const Nav = Vue.component("Nav", {
  template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Grocery Store</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item" >
         <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
        </li>
        <li class="nav-item" v-if="role !== 'admin' && role !== 'manager' && role !== 'customer'">
           <router-link class="nav-link active" aria-current="page" to="/login">Login</router-link>
        </li>
        <li class="nav-item" v-if="role !== 'admin' && role !== 'manager' && role !== 'customer'">
           <router-link class="nav-link active" aria-current="page" to="/register">Register</router-link>
        </li>
        <li class="nav-item" v-if="role=='admin'">
           <router-link class="nav-link" to="/manager">Managers</router-link>
        </li>
        <li class="nav-item" v-if="role == 'admin' ">
           <router-link class="nav-link" to="/other-requests">Requests</router-link>
        </li>
        <li class="nav-item" v-if="role == 'customer' ">
           <router-link class="nav-link" to="/cart">Cart</router-link>
        </li>
        <li class="nav-item" v-if="is_login">
           <button class="nav-link" @click='logout' >logout</button>
        </li>
        
      </ul>
      
    </div>
  </div>
</nav> `,

data() {
  return {
    role: localStorage.getItem('role'),
    is_login: localStorage.getItem('auth-token'),
    currentUserId: null,
  }
},
methods: {
  logout() {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('role')
     
    fetch('/clear-cache')                             // Clearing server-side cache
        .then(response => response.text())        
        .then(data => console.log(data))
        .catch(error => console.error(error)); 

    this.$router.push({ path: '/login' })
  },
},

});
export default Nav;