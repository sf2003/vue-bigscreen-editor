<template>
  <div v-if="editComponent !== null">
    <EchartForm
      v-if="editComponent.componentType === 0"
      :component="editComponent"
    />
    <LabelForm
      v-else-if="editComponent.componentType === 1"
      :component="editComponent"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { BigScreenComponent } from '@/store/modules/big-screen'
import EchartForm from '@/views/bigscreen/components/base/echartForm.vue'
import LabelForm from '@/views/bigscreen/components/base/labelForm.vue'

@Component({
  name: 'InputForm',
  components: { LabelForm, EchartForm }
})
export default class InputForm extends Vue {
  @Prop({ default: null }) private editComponent!: BigScreenComponent;
}
</script>

<style scoped>

</style>
