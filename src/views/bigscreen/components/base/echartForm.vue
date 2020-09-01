<template>
  <el-form
    ref="echartForm"
    :model="echartForm"
    label-width="100px"
  >
    <el-form-item label="数据获取方式">
      <el-radio-group v-model="echartForm.isWebsocketApi">
        <el-radio :label="true">
          Websocket
        </el-radio>
        <el-radio :label="false">
          轮询
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="!echartForm.isWebsocketApi"
      label="轮询间隔"
    >
      <el-input-number
        v-model="echartForm.pollingInterval"
        controls-position="right"
        :min="100"
        :step="100"
      />
    </el-form-item>
    <el-form-item label="数据接口">
      <el-radio-group v-model="echartForm.isWebsocketApi">
        <el-input
          v-model="echartForm.queryUrl"
          placeholder="请输入URL"
        />
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import FormBase from './form-base'
import { BigScreenComponent } from '@/store/modules/big-screen'

@Component({
  name: 'EchartForm'
})
export default class EchartForm extends mixins(FormBase) {
  private echartForm: BigScreenComponent | null = null

  initComponent() {
    console.log('EchartForm initComponent')
    this.echartForm = this.targetComponent
  }
}
</script>

<style scoped>

</style>
