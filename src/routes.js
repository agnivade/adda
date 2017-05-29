import Router from 'vue-router'

import Home from '@/components/Home'
import Filter from '@/components/Filter'
import Following from '@/components/Following'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/filter/:tags',
      name: 'Filter',
      component: Filter
    },
    {
      path: '/following',
      name: 'Following',
      component: Following
    }
  ],
  mode: 'history'
})
