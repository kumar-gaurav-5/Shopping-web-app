export default {
    template: `
      <div>
        <div v-if="error">{{ error }}</div>
        <div v-for="manager in allManagers">
          {{ manager.email }}
          <button class="btn btn-dark mt-2" v-if="!manager.active" @click="approve(manager.id)">
            Approve
          </button>
        </div>
      </div>
    `,
    data() {
      return {
        error: null,
        allManagers: [],
        token: localStorage.getItem('auth-token'),
        
      };
    },
    methods: {
      async approve(manager_id) {
        try {
          const res = await fetch(`/activate/manager/${manager_id}`, {
            headers: {
              'Authentication-Token': this.token,
            },
          });
          const data = await res.json();
          if (res.ok) {
            alert(data.message);
            // After successfully approving an account window will reload
            window.location.reload();
          }
        } catch (error) {
          console.error('Error during approval:', error);
        }
      },
    },
    async mounted() {
      try {
        const res = await fetch('/manager', {
          headers: {
            'Authentication-Token': this.token,
          },
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
        this.allManagers = data;
      } catch (error) {
        this.error = error.message;
      }
    },
  };
  