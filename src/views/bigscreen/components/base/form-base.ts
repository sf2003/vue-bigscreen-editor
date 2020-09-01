import { Component, Prop, Vue } from 'vue-property-decorator'
import { BigScreenComponent } from '@/store/modules/big-screen'

@Component({
  name: 'FormBase'
})
export default class extends Vue {
  @Prop({ default: null }) private component!: BigScreenComponent;

  get targetComponent() {
    return this.component
  }

  mounted() {
    console.log('FormBase mounted')
    this.initComponent()
  }

  initComponent() {
    console.log('FormBase initComponent')
  }
}
