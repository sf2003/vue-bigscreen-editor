<template>
  <el-dialog
    destroy-on-close
    :title="inEdit ? '项目编辑' : '项目详细'"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose"
    @open="dialogOpen"
    @opened="dialogOpened"
  >
    <el-form
      ref="projectForm"
      v-loading="dataLoading"
      :model="projectForm"
      :rules="rules"
      :disabled="!inEdit"
      label-width="100px"
    >
      <el-form-item
        label="项目名称"
        prop="projectName"
      >
        <el-input v-model="projectForm.projectName" />
      </el-form-item>
      <el-form-item
        label="发布路径"
        prop="publishUrl"
      >
        <el-input v-model="projectForm.publishUrl" />
      </el-form-item>
      <el-form-item
        label="说明"
        prop="memo"
      >
        <el-input
          v-model="projectForm.memo"
          type="textarea"
        />
      </el-form-item>
      <el-form-item v-if="inEdit">
        <el-button
          type="primary"
          :loading="submitting"
          @click="submitForm"
        >
          {{ editProjectId === 'new' ? '创建' : '更新' }}
        </el-button>
        <el-button @click="closeForm">
          关闭
        </el-button>
      </el-form-item>
    </el-form>
    <span
      v-if="!inEdit"
      slot="footer"
    >
      <el-button @click="gotoEditMode">编辑</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BigScreenModule, BigScreenProject } from '@/store/modules/big-screen'
import { Form } from 'element-ui'

@Component({
  name: 'ProjectEditor'
})
export default class ProjectEditor extends Vue {
  @Prop() private dialogFormVisible: boolean = false;
  @Prop() private editProjectId!: string;
  @Prop() private editMode: boolean = true;

  private projectForm: BigScreenProject | {} = {}
  private rules = {
    projectName: [
      { required: true, message: '请输入活动名称', trigger: 'blur' }
    ]
  }
  private inEdit: boolean = true

  get submitting() {
    return BigScreenModule.submitting
  }

  get dataLoading() {
    return BigScreenModule.dataLoading
  }

  get editProject() {
    return BigScreenModule.project
  }

  private dialogOpen() {
    this.inEdit = this.editMode
  }

  private dialogOpened() {
    if (this.editProjectId !== 'new') {
      BigScreenModule.showDataLoading(true)
      BigScreenModule.getProject(this.editProjectId).then(() => {
        this.projectForm = {
          ...BigScreenModule.project
        }
      })
    }
  }

  private submitForm() {
    (this.$refs['projectForm'] as Form).validate((valid) => {
      if (valid) {
        console.log('submit')
        BigScreenModule.saveProject(this.projectForm)
        this.closeForm()
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  private closeForm() {
    (this.$refs['projectForm'] as Form).resetFields()
    this.$emit('closeClick')
  }

  private handleClose() {
    if (this.editMode) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.closeForm()
        })
        .catch(_ => {})
    } else {
      this.closeForm()
    }
  }

  private gotoEditMode() {
    this.inEdit = true
  }
}
</script>

<style scoped>

</style>
