<template>
  <div class="app-container">
    <el-form
      :inline="true"
      :model="formInline"
    >
      <el-form-item label="项目名称">
        <el-input
          v-model="formInline.projectName"
          placeholder="项目名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <br>
    <el-button @click="newProject">
      新建项目
    </el-button>
    <el-table
      v-loading="searching"
      :data="projectList"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        prop="projectName"
        label="项目名称"
      />
      <el-table-column
        prop="publishUrl"
        label="发布路径"
      />
      <el-table-column
        prop="memo"
        label="备注"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="viewClick(scope.row)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="editClick(scope.row)"
          >
            编辑
          </el-button>
          <router-link
            :to="'/bigScreen/componentEditor/'+scope.row.projectId"
            class="link-type"
            style="margin-left: 10px"
          >
            <el-button
              type="text"
              size="small"
            >
              编辑组件
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <ProjectEditor
      :dialog-form-visible="editModalVisible"
      :edit-project-id="editProjectId"
      :edit-mode="editMode"
      @closeClick="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BigScreenModule, BigScreenProject } from '@/store/modules/big-screen'
import ProjectEditor from '@/views/bigscreen/project/editor.vue'

@Component({
  name: 'ProjectList',
  components: { ProjectEditor }
})
export default class ProjectList extends Vue {
  private formInline = {
    projectName: ''
  }

  private editModalVisible: boolean = false
  private editProjectId: string = ''
  private editMode: boolean = true

  private searching: boolean = true

  get projectList() {
    return BigScreenModule.projectList
  }

  mounted() {
    this.onSubmit()
  }

  private onSubmit() {
    this.searching = true
    BigScreenModule.getProjectList(this.formInline.projectName).then(() => {
      this.searching = false
    })
  }

  private closeModal() {
    this.editModalVisible = false
  }

  private newProject() {
    this.editProjectId = 'new'
    this.editModalVisible = true
    this.editMode = true
  }

  private viewClick(row: BigScreenProject) {
    this.editProjectId = row.projectId
    this.editModalVisible = true
    this.editMode = false
  }

  private editClick(row: BigScreenProject) {
    this.editProjectId = row.projectId
    this.editModalVisible = true
    this.editMode = true
  }

  private componentEditClick(row: BigScreenProject) {
    this.editProjectId = row.projectId
  }
}
</script>

<style scoped>

</style>
