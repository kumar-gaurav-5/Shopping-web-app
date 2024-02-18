export default {
    template: `
      <div class='d-flex justify-content-center' style="margin-top: 15vh">
        <div class="mb-3 p-5 bg-light">
          <label for="username" class="form-label">Username</label>
          <input type="username" class="form-control" id="username" placeholder="Type username" v-model="cred.username">
          
          <label for="user-email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="user-email" placeholder="Type email" v-model="cred.email">
          
          <label for="user-password" class="form-label">Password</label>
          <input type="password" class="form-control" id="user-password" placeholder="Type password" v-model="cred.password">
          
          <label class="form-label">Role</label>
          <div>
            <input type="radio" id="manager" value="manager" v-model="cred.role">
            <label for="manager">Manager</label>
            &nbsp;
            <input type="radio" id="customer" value="customer" v-model="cred.role">
            <label for="customer">Customer</label>
          </div>
          <div>
            
          </div>
          
          <button class="btn btn-dark mt-2" @click='register'>Register</button>
          <div class='text-danger'>{{ error }}</div>
        </div>
      </div>
    `,
    data() {
      return {
        cred: {
          username: '',
          email: '',
          password: '',
          role: '',
        },
        error: null,
      };
    },
    methods: {
        async register() {
          try {
            const response = await fetch('/user-register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.cred),
            });
    
            const data = await response.json();
    
            if (response.ok) {
            
              this.$router.push({ path: '/' });      // or    { name: 'Login' }
            } else {
              this.error = data.message;
            }
          } catch (error) {
            console.error('An error occurred during login:', error);
            this.error = 'Unexpected error. Try again.';
          }
        },
      },
  };
  