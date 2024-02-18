export default {
    template: 
    `<div>
          
          <div v-if="!carted_products">{{error}}</div>
          <div class='d-flex justify-content-center' style="margin-top: 23vh">
          <div class="mb-3 p-5 bg-light">
          <button v-if="carted_products.length > 0" class="btn btn-dark" @click="clearCart">Clear Cart</button>
          <table >
             <tr >
                  <th>Name &nbsp;&nbsp;</th>
                  <th>Unit &nbsp;&nbsp;</th>
                  <th>Rate/Unit &nbsp;&nbsp;</th>
                  <th>Manufacture Date &nbsp;&nbsp;</th>
                  <th>Expiry Date &nbsp;&nbsp;</th>
                  <th>Quantity </th>
             </tr>
             <tr v-for="product in carted_products">
                  <td>{{ product.product_name }}&nbsp;&nbsp;</td>
                  <td>{{ product.unit }}&nbsp;&nbsp;</td>
                  <td>{{ product.rate_per_unit }}&nbsp;&nbsp;</td>
                  <td>{{ product.manufacture_date}}&nbsp;</td>
                  <td>{{ product.expiry_date}}&nbsp;</td>
                  <td><input type="number" v-model="product.product_quantity" min="1" /></td>
                  <button @click="updateQuantity(product.product_id,product.product_quantity)">ok</button>
                  <button class="btn btn-danger" @click="removeProduct(product.product_id)">Remove</button>
             </tr> <br>
          </table>
             <div>Total amount to be paid: Rs. {{totalamount}}</div>
             <button v-if="carted_products.length > 0" class="btn btn-success" @click="checkoutall">&nbsp;&nbsp;&nbsp; Buy &nbsp;&nbsp;&nbsp;</button>
          
          <div class ="text-danger d-flex justify-content-center align-items-center">{{error}} </div>
          <div v-if="carted_products.length == 0" class ="text-danger d-flex justify-content-center align-items-center">Your Cart is Empty </div>
          </div>
          </div>
          
    </div>
            `,
    data() {
        return {
            okay:{
                product_id: null,
                newquantity: null,
            },

        userId: null,
        productId: null,
        carted_products: [], 
        error: null,
        token: localStorage.getItem('auth-token'),
        currentuserId: null,
        username: null,
        totalamount: null,
        };
    },
    methods: {
        async updateQuantity(product_id,product_quantity){ 
            this.okay.product_id=product_id
            this.okay.newquantity=product_quantity
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
        async removeProduct(product_id){
            const res = await fetch(`/api/removecartedproduct/${product_id}`, {
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                  },
                })
            const data = await res.json()
            if (res.ok) {
                alert('Product Removed from cart')
                window.location.reload()
              }
            else {this.error=data.message}
        },
        async clearCart(){
            const res = await fetch('/api/removecartedproduct', {
                method: 'DELETE',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                  },
                })
            const data = await res.json()
            if (res.ok) {
                alert(data.message)
                window.location.reload()
              }
            else {this.error=data.message}
        },

        async checkoutall(){
            const res = await fetch('/api/cartedproducts', {
                method: 'POST',
                headers: {
                  'Authentication-Token': this.token,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.carted_products),
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
        try{
            const res = await fetch('/api/cartedproducts', {
              headers: {
                'Authentication-Token': this.token,
              },
            })
            const data = await res.json().catch((e) => {})
            if (res.ok) {
                console.log(data)
                this.carted_products = data.cart_products
                this.totalamount = data.totalamount
            }
          }
          catch{
               this.error = data.message
          }
        
      },
    
  }