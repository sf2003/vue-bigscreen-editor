import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const bigScreenRouter: RouteConfig = {
  path: '/bigScreen',
  component: Layout,
  redirect: 'noredirect',
  name: 'BigScreen',
  meta: {
    title: 'bigScreen',
    icon: 'chart',
    alwaysShow: true // will always show the root menu
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/bigscreen/project/list.vue'),
      name: 'BigScreenMangerList',
      meta: {
        title: 'bigScreenMangerList',
        noCache: true
      }
    },
    {
      path: 'template',
      component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/bigscreen/template/index.vue'),
      name: 'BigScreenTemplate',
      meta: {
        title: 'bigScreenTemplate',
        noCache: true
      }
    },
    {
      path: 'template2',
      component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/bigscreen/template2/index.vue'),
      name: 'BigScreenTemplate2',
      meta: {
        title: 'bigScreenTemplate2',
        noCache: true
      }
    },
    {
      path: 'componentEditor/:projectId',
      component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/bigscreen/components/editor.vue'),
      name: 'ComponentEditor',
      meta: {
        title: 'componentEditor',
        noCache: true
      }
    },
    {
      path: 'modalEdit',
      component: () => import('@/views/modal-edit/modalEditor.vue'),
      name: 'ModalEdit',
      meta: {
        title: 'modalEdit',
        noCache: true
      }
    }
  ]
}

export default bigScreenRouter
