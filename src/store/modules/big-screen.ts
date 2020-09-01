import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { getProjectList, saveProject, getProject, getComponentsByProjectId } from '@/api/big-screen'

export interface BigScreenProject {
  projectId: string,
  projectName: string,
  publishUrl: string,
  memo: string,
  createTimestamp: string,
  updateTimestamp: string
}

export interface BigScreenComponent {
  componentId: string,
  projectId: string,
  componentName: string,
  memo: string,
  componentOption: string,
  componentType: 0,
  extraComponentName: string,
  queryUrl: string,
  isWebsocketApi: false,
  pollingInterval: 0
}

export interface IBigScreenState {
  projectList: BigScreenProject[],
  project: BigScreenProject | {},
  componentList: BigScreenComponent[],
  submitting: boolean,
  dataLoading: boolean
}

@Module({ dynamic: true, store, name: 'bigScreen' })
class BigScreen extends VuexModule implements IBigScreenState {
  public projectList: BigScreenProject[] = [];
  public project: BigScreenProject | {} = {};
  public componentList: BigScreenComponent[] = [];
  public submitting: boolean = false;
  public dataLoading: boolean = false;

  @Mutation
  private SET_PROJECT_LIST(projectList: BigScreenProject[]) {
    this.projectList = projectList
  }

  @Mutation
  private SET_PROJECT(project: BigScreenProject) {
    this.project = project
  }

  @Mutation
  private SET_SUBMITTING(submitting: boolean) {
    this.submitting = submitting
  }

  @Mutation
  private SET_COMPONENT_LIST(componentList: BigScreenComponent[]) {
    this.componentList = componentList
  }

  @Mutation
  private SET_DATALOADING(dataLoading: boolean) {
    this.dataLoading = dataLoading
  }

  @Action
  public async getProjectList(projectName: string) {
    const { data } = await getProjectList(projectName)
    this.SET_PROJECT_LIST(data)
  }

  @Action
  public showSubmitting(submitting: boolean) {
    this.SET_SUBMITTING(submitting)
  }

  @Action
  public showDataLoading(dataLoading: boolean) {
    this.SET_DATALOADING(dataLoading)
  }

  @Action
  public async saveProject(projectForm: BigScreenProject | {}) {
    const { data } = await saveProject(projectForm)
    this.SET_SUBMITTING(false)
    // this.SET_PROJECT(data)
  }

  @Action
  public async getProject(projectId: string) {
    const { data } = await getProject(projectId)
    this.SET_DATALOADING(false)
    this.SET_PROJECT(data)
  }

  @Action
  public async getComponentsByProjectId(projectId: string) {
    const { data } = await getComponentsByProjectId(projectId)
    this.SET_COMPONENT_LIST(data)
  }
}

export const BigScreenModule = getModule(BigScreen)
