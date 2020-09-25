<template>
  <div
    :id="node.id"
    class="diagram-node-wrapper"
    :style="{left: node.x + 'px', top: node.y + 'px'}"
  >
    <div class="controls">
      <div class="move-handle">
        &nbsp;
      </div>
      <div class="button-handle" @click.stop="showEditDialog(true)">
        <i class="el-icon-s-tools"/>
      </div>
    </div>
    <div class="connector">
      <div class="title">
        <span>{{ node.name }}</span>
      </div>
      <div class="column-container">
        <template v-if="this.node.columns.length > 0">
          <div
            v-for="column in this.node.columns"
            :id="column.id"
            class="column">
            <svg-icon icon-class="column" class="column-icon"/>
            <span class="column-name">{{ column.name }}</span>
            <span class="column-type">{{ column.type }}</span>
            <div class="column-delete-button">
              <svg-icon icon-class="delete-set"  @click="deleteColumn(column)" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="column empty">
            <span>尚未配置列</span>
          </div>
        </template>
      </div>
    </div>

    <el-dialog
      :title="this.node.name"
      :visible.sync="columnEditorVisible"
      destroy-on-close
      append-to-body
      :before-close="handleClose"
    >
      <div class="column-table">
        <div class="column-tools" @click="addColumn">
          <svg-icon icon-class="plus-circle"></svg-icon>
          <span>添加列</span>
        </div>
        <el-divider/>
        <template v-if="columns !== null && columns.length > 0">
          <div class="column-form" v-for="columnObject in columns" :key="`column-form-${columnObject.id}`">
            <el-form :inline="true" :ref="`columnForm-${columnObject.id}`" :model="columnObject" :rules="rules" size="mini">
              <el-form-item label="列名称" prop="name">
                <el-input v-model="columnObject.name" placeholder="列名称"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="columnObject.type" placeholder="类型">
                  <el-option label="varchar" value="varchar"></el-option>
                  <el-option label="integer" value="integer"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="column-remove-button">
                <div class="column-remove" @click="deleteColumnInEdit(columnObject)">
                  <svg-icon icon-class="delete-set" class="column-delete-button" />
                </div>
              </el-form-item>
            </el-form>
            <el-divider/>
          </div>
        </template>
        <template v-else>
          <div class="empty">
            <span>尚未配置列</span>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import {VisuallyTable} from "@/components/VisuallyElement/VisuallyTable";
import {VisuallyTableColumn} from "@/components/VisuallyElement/VisuallyTableColumn";
import "jquery-contextmenu"
import "jquery-contextmenu/dist/jquery.contextMenu.min.css"
import tools from "@/components/VisuallyElement/tools"
import lodash from "lodash"

export default {
  name: "EleTable",

  props: {
    plumbInstance: {
      type: Object,
      required: true
    },
    node: {
      type: VisuallyTable,
      required: true
    },
    playgroundId: {
      type: String,
      required: true
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.dragTable()
      if (this.node.columns.length > 0) {
        this.columns = lodash.cloneDeep(this.node.columns)
      }
    })
  },

  watch: {
    node: {
      handler(newValue, oldValue) {
        this.columns = lodash.cloneDeep(newValue.columns)
      },
      deep: true
    },
    columns: {
      handler(newValue, oldValue) {
        this.checkColumnsChanged()
      },
      deep: true
    }
  },

  data() {
    return {
      columnEditorVisible: false,
      columns: [],
      columnsChanged: false,
      rules: {
        name: [
          {required: true, message: '请输入列名称', trigger: 'blur'},
          {validator: this.columnExists, trigger: 'blur'}
        ],
        type: [{required: true, message: '请选择类型', trigger: 'blur'}]
      }
    }
  },

  methods: {
    addColumn() {
      this.columns.push(new VisuallyTableColumn({
        name: '',
        type: 'varchar'
      }))
    },

    dragTable() {
      const element = $(`#${this.node.id}`)
      element.draggable({
        handle: 'div.controls div.move-handle',
        containment: `#${this.playgroundId}`,
        drag: () => {
          this.plumbInstance.revalidate(this.node.id)
        },
        stop: (event, ui) => {
          this.node.x = ui.position.left
          this.node.y = ui.position.top
        }
      })

      element.contextMenu({
        selector: '.connector',
        callback: this.menuCallback,
        items: {
          edit: {name: '编辑', icon: 'edit'},
          delete: {name: '删除', icon: 'delete'},
        }
      })

      const el = $(`#${this.node.id} .connector`)
      this.plumbInstance.makeSource(el, tools.sourceOption)
      this.plumbInstance.makeTarget(el, tools.targetOption)
    },

    menuCallback(key, option) {
      if (key === 'edit') {
        this.showEditDialog(true)
      } else if (key === 'delete') {
        this.plumbInstance.remove(this.node.id)
        this.$emit('deleteNode', this.node.id)
      }
    },

    showEditDialog(visible) {
      this.columnEditorVisible = visible
    },

    closeDialog() {
      if (this.formValidation()) {
        this.node.columns = lodash.cloneDeep(this.columns)
        this.showEditDialog(false)
        this.$nextTick(() => {
          this.plumbInstance.revalidate(this.node.id)
        })
      } else {
        this.$message({
          showClose: true,
          message: '请修正错误的配置',
          type: 'error'
        });
      }
    },

    handleClose(done) {
      if (this.columnsChanged) {
        this.$confirm('变更尚未保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.columns = lodash.cloneDeep(this.node.columns)
          done()
        }).catch(() => {

        });
      } else {
        this.columns = lodash.cloneDeep(this.node.columns)
        done()
      }
    },

    formValidation() {
      let validateResult = true
      lodash.forIn(this.$refs, (value, key, formObject) => {
        value[0].validate((validate, object) => {
          if (!validate) {
            validateResult = false
            return false
          }
        })
      })

      return validateResult
    },

    columnExists(rule, value, callback) {
      const count = this.columns.reduce((acc, cur) => {
        return cur.name === value ? acc + 1 : acc + 0
      }, 0)
      if (count >= 2) {
        callback(new Error('列名重复'));
      } else {
        callback();
      }
    },

    deleteColumn(column) {
      this.node.deleteColumn(column)
      this.$nextTick(() => {
        if (this.node.columns.length === 0) {
          this.plumbInstance.deleteConnectionsForElement($(`#${this.node.id} .connector`))
        }
        this.plumbInstance.revalidate(this.node.id)
      })
    },

    deleteColumnInEdit(column) {
      this.columns = lodash.without(this.columns, column)
      this.$nextTick(() => {
        delete this.$refs[`columnForm-${column.id}`]
      })
    },

    checkColumnsChanged() {
      this.columnsChanged = lodash.differenceWith(this.node.columns, this.columns, lodash.isEqual).length > 0
    }
  }
}
</script>

<style lang="scss">
.diagram-node-wrapper {
  box-shadow: 0 0 4px #d8d8d8;
  border-radius: 5px;
  display: inline-block;
  position: absolute;
  background: white;
  z-index: 99;
  transition: box-shadow .2s linear;
  user-select: none;

  &:hover {
    box-shadow: 5px 5px 4px #d8d8d8
  }

  &.active {
    box-shadow: 0 0 4px #ff9900
  }

  &.danger > strong {
    background-color: #f56c6c;
  }

  .controls {
    position: absolute;
    width: 100%;
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;

    .move-handle {
      flex-grow: 1;
      height: 24px;
      padding: 3px 5px 3px 5px;
      color: white;
      border-top-left-radius: 5px;
      transition: background-color .2s linear;

      &:hover {
        cursor: move;
      }
    }

    .button-handle {
      height: 24px;
      padding: 3px 5px 3px 5px;
      border-top-right-radius: 5px;
      color: white;
      transition: background-color .2s linear;

      &:hover {
        cursor: pointer;
        background-color: #67c23a;
      }

      &:active {
        background-color: #409167;
      }
    }
  }

  .title {
    background-color: #4a90e2;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-content: center;
    line-height: 24px;
    min-width: 200px;

    span {
      cursor: move;
      font-size: 12px;
      color: white;
      font-weight: bold;
      text-align: center;
      flex-grow: 1;
    }
  }

  .column-container {
    .column {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 0 10px 0 10px;
      border-top: 1px solid #E4E7ED;
      min-width: 200px;

      &.empty {
        justify-content: center;
      }

      .column-icon {
        color: #409EFF
      }

      .column-type,
      .column-name {
        flex-grow: 1;
      }

      .column-delete-button {
        color: #F56C6C;
        cursor: pointer;
        transition-property: color, transform;
        transition-duration: .2s;
        transition-timing-function: linear;

        &:hover {
          color: #f78989;
          transform: scale(1.2);
        }

        &:active {
          color: #dd6161;
        }
      }
    }

    span {
      display: block;
      font-size: 12px;
      font-weight: bold;
      color: gray;
      padding: 6px 10px;
    }

    .delete {
      background: #fde2e2;
    }

    .unlinked {
      background: #faecd8;
    }

    .add {
      background: #e1f3d8;
    }
  }
}

.column-table {

  .el-divider--horizontal {
    margin: 16px 0;
  }

  .empty {
    text-align: center;
    font-size: 14px;
  }

  .column-form {
    .el-form {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      >:nth-last-child(2) {
        flex-grow: 1;
      }
    }

    .el-form-item--mini.el-form-item {
      margin-bottom: unset;
    }

    .column-remove {
      border: 1px solid #fbc4c4;
      background-color: #fef0f0;
      color: #f56c6c;
      padding: 0 7px 0 7px;
      border-radius: 10px;
      font-size: 14px;
      cursor: pointer;
      transition-property: color, transform, background, border-color;
      transition-duration: .2s;
      transition-timing-function: linear;

      &:hover {
        background: #f56c6c;
        border-color: #f56c6c;
        color: #fff;
      }

      &:active {
        background: #dd6161;
        border-color: #dd6161;
        color: #fff;
        outline: none;
      }
    }
  }

  .column-tools {
    width: 100%;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: #409eff;
    background-color: #ecf5ff;
    border: 1px dashed #b3d8ff;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    user-select: none;
    transition: all .2s linear;

    &:hover {
      background: #409eff;
      border-color: #409eff;
      color: #fff;
    }

    &:active {
      background: #3a8ee6;
      border-color: #3a8ee6;
      color: #fff;
      outline: none;
    }

    :last-child {
      margin-left: 8px;
    }
  }
}
</style>
