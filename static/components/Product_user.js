export default {
    template: 
    `<div>
          <h5 class="text-center">Shop for products under {{categoryName}} category</h5>
          <div class="text-center">{{ error }}</div>
          <div class="container d-flex align-items-center justify-content-center">
          <table  >   
             <tr v-for="product in products" >
                  <td>{{ product.product_name }}&nbsp;&nbsp;&nbsp;</td>
                  <td>Rs.{{ product.rate_per_unit }}&nbsp;&nbsp;&nbsp;</td>
                  <td>
                     <div v-if="product.quantity>0">
                       <button class="btn btn-primary" @click="AddtoCart(product.product_id)">Add to Cart</button>
                       <button class="btn btn-danger" @click="BuyNow(product.product_id)">Buy Now</button>
                     </div>
                     <div v-if="product.quantity==0" class="text-danger">
                        Out of Stock!
                     </div>
                  </td>
             </tr>   
          </table> 
          </div><br>
        
    </div>
            `,
    data() {
        return {

        categoryId: null,
        categoryName: null,
        products: [], 
        error: null,
        token: localStorage.getItem('auth-token'),
        currentuserId: null,
    
        };
    },
    methods: {
        async AddtoCart(product_id){
          const res = await fetch(`/api/addtocart/${this.currentuserId}/${product_id}`, {
            headers: {
            'Authentication-Token': this.token,
             },
            })
            const data = await res.json().catch((e) => {})
            if (res.ok) {
               alert(data.message)
            } else {
              alert(data.message)
            }

        },
        async BuyNow(product_id){
          //sending product_id where it will be added to Cart. Then redirected to checkout 
          const res = await fetch(`/api/buynow/${this.currentuserId}/${product_id}`, {
           headers: {
             'Authentication-Token': this.token,
           },
         })
         const data = await res.json().catch((e) => {})
         if (res.ok) {
           console.log('Added to cart')
           this.$router.push({ name: 'BuyNow', params: { currentuserId: this.currentuserId, productId:product_id} });
         } else {
           alert('Error')
         }
         
       }
        
    },

    async mounted() {
        this.categoryId = this.$route.params.categoryId;
        this.categoryName = this.$route.params.categoryName;
        const categoryId = this.$route.params.categoryId;
        const res = await fetch(`/api/get-product/${categoryId}`, {
            headers: {
              'Authentication-Token': this.token,
            },
          })
          const data = await res.json().catch((e) => {})
          if (res.ok) {
            console.log(data)
            this.products = data
            
          } else {
            this.error = 'No Product Found'
          }
        
          try{
            const res = await fetch('/current_user', {
              headers: {
                'Authentication-Token': this.token,
              },
            })
            const data = await res.json().catch((e) => {})
            if (res.ok) {
              console.log(data)
              this.currentuserId = data.user_id
              this.username = data.username
              
            }
          }
          catch{
            this.currentuserId = data.user_id
          }
      },
    
  }