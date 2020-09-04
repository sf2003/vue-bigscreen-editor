<template>
  <div class="app-container">
    <div>
      <el-button @click="addTable">
        Add Table
      </el-button>
    </div>
    <div id="playground">
      <div
        v-for="node in tables"
        :id="node.id"
        class="diagram-node-wrapper"
        :style="{left: node.x + 'px', top: node.y + 'px'}"
      >
        <div class="title">
          <span>{{ node.name }}</span>
          <div
            class="title-bottom"
            @click.stop="tableEdit(node)"
          >
            <i class="el-icon-s-tools" />
          </div>
        </div>
        <div class="column-container">
          <template v-if="node.columns.length > 0">
            <div
              v-for="column in node.columns"
              :id="column.id"
              class="column"
              :class="{'delete': column.delete, 'unlinked': column.unlinked, 'add': column.add}"
            >
              <svg-icon
                v-if="column.unlinked"
                icon-class="unlink"
                style="color: #E6A23C"
              />
              <svg-icon
                v-else
                icon-class="column"
                style="color: #409EFF"
              />
              <span>{{ column.name }}</span>
            </div>
          </template>
          <template v-else>
            <div class="column empty">
              <span>尚未配置列</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import jsPlumb from 'jsplumb'
import * as lodash from 'lodash'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import { uid } from '@/utils'

export default {
  name: 'ModalEditor',

  data() {
    return {
      plumbInstance: null,
      tables: [],
      edges: [],
      connectProps: {
        endpoint: 'Blank',
        anchor: ['Left', 'Right'],
        paintStyle: { stroke: '#ddd', strokeWidth: 1.5, cursor: 'pointer' },
        hoverPaintStyle: { stroke: '#4a90e2', strokeWidth: 3 },
        connector: ['Straight', { gap: 2 }],
        overlays: [['Arrow', { width: 8, length: 8, location: 1 }]]
      },
      unlinkedConnectProps: {
        endpoint: 'Blank',
        anchor: ['Left', 'Right'],
        paintStyle: { stroke: '#F56C6C', strokeWidth: 1.5, cursor: 'pointer' },
        hoverPaintStyle: { stroke: '#F56C6C', strokeWidth: 3 },
        connector: ['Straight', { gap: 2 }],
        overlays: [
          ['Arrow', { width: 8, length: 8, location: 1 }]
        ]
      },
      sourceOption: {
        endpoint: 'Dot',
        anchor: 'Continuous',
        paintStyle: { stroke: '#ddd', strokeWidth: 1.5, cursor: 'pointer', fill: '#ddd' },
        hoverPaintStyle: { stroke: '#4a90e2', strokeWidth: 3, fill: '#4a90e2' },
        connectorOverlays: [['Arrow', { width: 8, length: 8, location: 0.5 }]]
      },
      targetOption: {
        endpoint: 'Rectangle',
        anchor: 'Continuous',
        paintStyle: { stroke: '#ddd', strokeWidth: 1.5, cursor: 'pointer', fill: '#ddd' },
        hoverPaintStyle: { stroke: '#4a90e2', strokeWidth: 3, fill: '#4a90e2' },
        connectorOverlays: [['Arrow', { width: 8, length: 8, location: 0.5 }]]
      }
    }
  },

  mounted() {
    const _this = this
    setTimeout(() => {
      this.plumbInstance = jsPlumb.jsPlumb.getInstance()
      this.plumbInstance.setContainer('playground')
      this.plumbInstance.ready(() => {
        _this.plumbInstance.bind('connection', _this.connected)
      })
    })
  },

  methods: {
    addTable() {
      this.$prompt('请输入实体名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const table = {
          id: uid(),
          name: value,
          type: 'table',
          columns: []
        }
        this.tables.push(table)
        const _this = this
        this.$nextTick(() => {
          // this.plumbInstance.draggable(table.id, {containment: 'playground'})
          const element = $(`#${table.id}`)
          element.draggable({
            handle: 'div.title',
            drag: (event, ui) => {
              _this.plumbInstance.revalidate(table.id)
            }
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },

    draw() {
      this.plumbInstance.reset()
      this.tables.forEach(node => {
        this.plumbInstance.draggable(node.id, { containment: 'playground' })
      })
      this.edges.forEach(edge => {
        this.plumbInstance.connect({
          source: edge.source,
          target: edge.target
        }, edge.unlinked ? this.unlinkedConnectProps : this.connectProps)
      })
    },

    tableEdit(table) {
      table.columns.push({
        id: uid(),
        name: 'column1',
        unlinked: false
      })

      this.$nextTick(() => {
        if (table.columns.length === 1) {
          this.$nextTick(() => {
            this.plumbInstance.makeSource($(`#${table.id} .column-container`), this.sourceOption)
            this.plumbInstance.makeTarget($(`#${table.id} .column-container`), this.targetOption)
          })
        } else {
          this.plumbInstance.revalidate(table.id)
        }
      })
    },

    connected(info) {
      console.log(info)
      const connection = info.connection
      connection.bind('dblclick', this.connectionDblclick)
    },

    connectionDblclick(connection, originalEvent) {
      console.log(connection)
    }
  }
}
</script>

<style lang="scss">
#playground {
  width: 100%;
  height: calc(100vh - 140px);
  position: relative;
  background: white;

  .dagre {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.diagram-node-wrapper {
  box-shadow: 0 0 4px #d8d8d8;
  border-radius: 5px;
  display: inline-block;
  position: absolute;
  background: white;
  z-index: 99;
  transition: box-shadow .3s linear;
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

    .title-bottom {
      padding: 0 5px 0 5px;
      border-top-right-radius: 5px;
      color: white;
      transition: background-color .3s linear;

      &:hover {
        cursor: pointer;
        background-color: #67c23a;
      }

      &:active {
        background-color: #409167;
      }
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

.jtk-connector {
  cursor: pointer;

  &.active {
    z-index: 999;

    path {
      stroke: #4a90e2;
      fill: #4a90e2;
      stroke-width: 2px;
    }
  }
}
</style>
