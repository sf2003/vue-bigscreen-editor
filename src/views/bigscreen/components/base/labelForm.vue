<template>
  <div>Label Form</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import FormBase from '@/views/bigscreen/components/base/form-base'

@Component({
  name: 'LabelForm'
})
export default class LabelForm extends mixins(FormBase) {

}
</script>

<style scoped>

</style>
