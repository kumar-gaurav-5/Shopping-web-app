import adminDashboard from './admin_dashboard.js'
import managerDashboard from './manager_dashboard.js'
import customerDashboard from './customer_dashboard.js'

export default {
    template: `<div>
      
      <adminDashboard v-if="userRole=='admin'"/>
      <managerDashboard v-if="userRole=='manager'" />
      <customerDashboard v-if="userRole=='customer'" />
    </div>`,
  
  data() {
      return {
        userRole: localStorage.getItem('role'),
      }
    },  
  components: {
      adminDashboard,
      managerDashboard,
      customerDashboard,
    },
    
  
  }