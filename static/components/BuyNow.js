export default {
    template: 
    `<div>
          
          <div class='d-flex justify-content-center' style="margin-top: 23vh">
          <div class="mb-3 p-5 bg-light">
          <table >
             <tr >
                  <th>Name &nbsp;&nbsp;</th>
                  <th>Unit &nbsp;&nbsp;</th>
                  <th>Rate/Unit &nbsp;&nbsp;</th>
                  <th>Manufacture Date &nbsp;&nbsp;</th>
                  <th>Expiry Date &nbsp;&nbsp;</th>
                  <th>Quantity </th>
             </tr>
             <tr >
                  <td>{{ buynowproduct.product_name }}&nbsp;</td>
                  <td>{{ buynowproduct.unit }}&nbsp;&nbsp;</td>
                  <td>{{ buynowproduct.rate_per_unit }}&nbsp;&nbsp;</td>
                  <td>{{ buynowproduct.manufacture_date}}&nbsp;</td>
                  <td>{{ buynowproduct.expiry_date}}&nbsp;</td>
                  <td><input type="number" v-model="okay.newquantity" min="1" /></td>
                  <button @click="updateQuantity">ok</button>
             </tr> <br>
             </table>
             <div>Total amount to be paid: Rs. {{totalamount}}</div>
             <button class="btn btn-success" @click="chekout">&nbsp;&nbsp;&nbsp; Buy &nbsp;&nbsp;&nbsp;</button> 
             
          <div class ="text-danger d-flex justify-content-center align-items-center">{{error}} </div>
          </div>
          </div>
    </div>
            `,
    data() {
        return {
            okay:{
                user_id: null,
                product_id: null,
                newquantity: null,
            },
        buynowproduct: [], 
        cart: [],
        error: null,
        token: localStorage.getItem('auth-token'),
        totalamount: null,
        };
    },
    methods: {
        async updateQuantity(){ 
            
            const res = await fetch('/api/buynow', {
                method: 'PUT',
                headers: {
                  'Authentication-Token': this.token,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.okay),
              })
        
              const dat = await res.json()
              if (res.ok) {
                alert(dat.message)
                window.location.reload()
              }
              else {this.error=dat.message}
        },
        async chekout(){
            const res = await fetch('/api/buynow', {
                method: 'POST',
                headers: {
                  'Authentication-Token': this.token,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.okay),
              })
        
              const dat = await res.json()
              if (res.ok) {
                console.log(dat.message)
                this.$router.push({ path: '/orderplaced' });
              }
              else {this.error=dat.message}
        },
    },

    async mounted() {
        
        const userId = this.$route.params.currentuserId
        this.okay.user_id = userId
        const productId = this.$route.params.productId
        this.okay.product_id = productId
        const res = await fetch(`/api/buynowproduct/${userId}/${productId}`, {
            headers: {
              'Authentication-Token': this.token,
            },
          })
          const data = await res.json().catch((e) => {})
          if (res.ok) {
            this.buynowproduct = data.buynowproduct;
            this.cart = data.cart;
            this.okay.newquantity = this.cart.product_quantity;
            this.totalamount = this.cart.totalamount;
          }
          
      },
    
  }