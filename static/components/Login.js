const Login = Vue.component("Login", {
    template: `<div class='d-flex justify-content-center' style="margin-top: 23vh">
    <div class="mb-3 p-5 bg-light">
      
      <label for="user-email" class="form-label">Email</label>
      <input type="email" class="form-control" id="user-email" placeholder="your email" v-model="credentials.email" >
      <label for="user-password" class="form-label">Password</label>
      <input type="password" class="form-control" id="user-password" placeholder="your password" v-model="credentials.password" >
      <button class="btn btn-dark mt-2" @click='login'>Login</button>
      <div class='text-danger' >{{ error }}</div>
    </div>
  </div> `,
  
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      error: null,
    };
  },

  

  methods: {
    async login() {
      try {
        const response = await fetch('/user-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.credentials),
        });

        const data = await response.json();

        if (response.ok) {
          const { token, role } = data;
          localStorage.setItem('auth-token', token);
          localStorage.setItem('role', role);
          this.$router.push({ path: '/' });
        } else {
          this.error = data.message;
        }
      } catch (error) {
        console.error('An error occurred during login:', error);
        this.error = 'Unexpected error. Please try again.';
      }
    },
  },
  
  
  });
  export default Login;