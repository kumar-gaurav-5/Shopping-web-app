import router from './router.js'
import Nav from './components/Nav.js'

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !localStorage.getItem('auth-token') && to.name !== 'Register' ? true : false)
    next({ name: 'Login'  })
  else next()
})                               //Navigation Guard

new Vue({
  el: '#app',
  template: `<div>
   <Nav :key='any_change'/>          
   <router-view />
            </div>`,
  router,
  components: {
    Nav,
  },
  data: {
    any_change: true,
  },
  watch: {
    $route(to, from) {
      this.any_change = !this.any_change
    },
  },
  
})