<template>
  <div class="app-container pane-container">
    <split-pane
      split="vertical"
      :min-percent="10"
      :default-percent="20"
      @resize="resize"
    >
      <template slot="paneL">
        <div class="left-container">
          <el-button
            style="width: 100%"
            @click="newComponent"
          >
            新建组件
          </el-button>
          <el-table
            :data="componentList"
            border
            :show-header="false"
            style="width: 100%"
            class="custom-table"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              prop="componentName"
              label="项目名称"
            />
          </el-table>
        </div>
      </template>
      <template slot="paneR">
        <split-pane
          split="horizontal"
          :min-percent="10"
          :default-percent="50"
        >
          <template slot="paneL">
            <div class="top-container">
              <InputForm :edit-component="currentComponent" />
            </div>
          </template>
          <template slot="paneR">
            <div class="bottom-container" />
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SplitPane from 'vue-splitpane'
import { BigScreenModule, BigScreenComponent } from '@/store/modules/big-screen'
import InputForm from './inputForm.vue'

@Component({
  name: 'ComponentEditor',
  components: {
    InputForm,
    SplitPane
  }
})
export default class ComponentEditor extends Vue {
  private componentList: BigScreenComponent[] = []
  private currentComponent: BigScreenComponent | null = null

  mounted() {
    BigScreenModule.getComponentsByProjectId(this.$route.params.projectId).then(() => {
      this.componentList = BigScreenModule.componentList
    })
  }

  resize() {
    // Handle resize
  }

  private newComponent() {

  }

  private handleCurrentChange(val: BigScreenComponent | null) {
    this.currentComponent = val
    console.log(this.currentComponent)
  }
}
</script>

<style lang="scss">
.custom-table {
  .el-table__body {
    .el-table__row {
      > td {
        transition: all .2s linear;
      }

      &:hover {
        > td {
          border-left: 5px solid #E6A23C;
        }
      }
    }

    .current-row {
      > td {
        border-left: 5px solid #67C23A;
      }
    }
  }
}

.pane-container {
  height: calc(100vh - 84px);
}

.left-container {
  height: 100%;
  padding-right: 4px;
}

.right-container {
  background-color: #FCE38A;
  height: 200px;
}

.top-container {
  width: 100%;
  height: 100%;
  padding-left: 4px;
}

.bottom-container {
  width: 100%;
  background-color: #95E1D3;
  height: 100%;
}
</style>
