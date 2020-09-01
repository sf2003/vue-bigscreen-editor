import request from '@/utils/request'
import { BigScreenProject } from '@/store/modules/big-screen'

export const getProjectList = (projectName: string) =>
  request({
    url: '/bigScreen/getProjectList',
    method: 'post',
    data: {
      projectName
    }
  })

export const saveProject = (projectForm: BigScreenProject | {}) =>
  request({
    url: '/bigScreen/saveProject',
    method: 'post',
    data: {
      ...projectForm
    }
  })

export const getProject = (projectId: string) =>
  request({
    url: `/bigScreen/getProject/${projectId}`,
    method: 'get'
  })

export const getComponentsByProjectId = (projectId: string) =>
  request({
    url: `/bigScreen/getComponentsByProjectId/${projectId}`,
    method: 'get'
  })
