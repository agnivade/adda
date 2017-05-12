import Router from 'vue-router'
import Home from '@/components/Home'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ],
  mode: 'history'
})
