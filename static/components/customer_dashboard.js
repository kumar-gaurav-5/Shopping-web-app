export default {
    template: 
    `<div>
           <div class="badge bg-primary text-wrap" style="font-size: 1.02rem;font-weight: 600;"> 
           Welcome {{username}}
           </div>
           
           <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-6">
                  <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" v-model="searchQuery" placeholder="Search for Categories/Products" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit" >Search</button>
                  </form>
                </div>
              </div>
           </div> <br>


           <div class="text-center" v-if="!isSearching">
             <button type="button" class="btn btn-dark" @click="openCategories">Explore Categories</button>
           </div>
           
           <div class="container" v-if="isSearching">
             <div >{{ error }}</div>
             <div class="row">
               <div class="col-md-2" v-for="category in searchResults" >
                 <div class="card text-center">
                   <div class="card-body bg-info" >
                     <router-link :to="{ name: 'Product_user', params: { categoryId: category.category_id, categoryName: category.category_name } }" style="color: white;">
                        <h5 class="card-title">{{ category.category_name }}</h5>
                     </router-link>
                   </div>
                 </div>
               </div>
             </div>
           </div> 


           <div class="container" v-if="showAllCategory && (!isSearching)">
             <div >{{ error }}</div>
             <div class="row">
               <div class="col-md-2" v-for="category in categories" >
                 <div class="card text-center">
                   <div class="card-body bg-info" >
                     <router-link :to="{ name: 'Product_user', params: { categoryId: category.category_id, categoryName: category.category_name } }" style="color: white;">
                        <h5 class="card-title">{{ category.category_name }}</h5>
                     </router-link>
                   </div>
                 </div>
               </div>
             </div>
           </div> <br><br>
           
           <div v-if="isSearching">
           <div class="text-center">{{ errorprod }}</div>
           <div class="container">
             <div class="row g-3">
               <div class="col-md-2" v-for="product in SearchProdResults" >
                 <div class="card text-center">
                   <div class="card-body " >                    
                        <h5 class="card-title">{{ product.product_name }}</h5>
                        <div v-if="product.quantity>0">
                          <button class="btn btn-primary" @click="MovetoCart(product.product_id)">Add to Cart</button>
                          <button class="btn btn-success" @click="BuyNow(product.product_id)">Buy Now</button>
                        </div>
                        <p v-else class="text-danger">Out of Stock!</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           </div>

           <div v-if="!isSearching">
           <div class="text-center">{{ errorprod }}</div>
           <div class="container">
             <div class="row g-3">
               <div class="col-md-2" v-for="product in products" >
                 <div class="card text-center">
                   <div class="card-body " >                    
                        <h5 class="card-title">{{ product.product_name }}</h5>
                        <div v-if="product.quantity>0">
                          <button class="btn btn-primary" @click="MovetoCart(product.product_id)">Add to Cart</button>
                          <button class="btn btn-success" @click="BuyNow(product.product_id)">Buy Now</button>
                        </div>
                        <p v-else class="text-danger">Out of Stock!</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           </div>
     </div>`,

    data() {
        return {
          categories: [], 
          products:[],
          error: null,
          errorprod: null,
          userRole: localStorage.getItem('role'),
          token: localStorage.getItem('auth-token'),
          showAllCategory: false,
          currentuserId: null,
          username: null,
        searchQuery: '',
        isSearching: false,
        searchResults: [],
        SearchProdResults:[],
        }
      },  
    
    methods:{
      openCategories(){
        this.showAllCategory = !this.showAllCategory
      },
      async MovetoCart(product_id){
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
         this.$router.push({ name: 'BuyNow', params: { currentuserId: this.currentuserId, productId:product_id} });
      }
    },


    async mounted() {
      try{
      const res = await fetch('/api/get-category', {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json().catch((e) => {})
      if (res.ok) {
        console.log(data)
        this.categories = data
        
      } else {
        this.error = data.message
      } }
      catch{this.error = "Unexpected error in loading categories"}


      try{
        const res = await fetch('/api/allproducts', {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json().catch((e) => {})
        if (res.ok) {
          console.log(data)
          this.products = data
          
        } else {
          this.errorprod = 'No Product Found'
        }
      }
      catch{
          this.errorprod = 'Error loading products'
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

    watch: {
      searchQuery(newQuery) {      //watching for change in searchQuery binded to search bar
        if (newQuery) {
          
          fetch('/api/searchcategory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            },
            body: JSON.stringify({ query: newQuery }),
          })
          .then(response => response.json())
          .then(data => {
            this.searchResults = data.results;
            this.isSearching = true;
          });

          fetch('/api/searchproduct', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            },
            body: JSON.stringify({ query: newQuery }),
          })
          .then(response => response.json())
          .then(data => {
            this.SearchProdResults = data.prod_results;
            this.isSearching = true;
          });
        } else {
          // If search query is empty, clearing searchResults and setting isSearching to false
          this.searchResults = [];
          this.SearchProdResults = [];
          this.isSearching = false;
        }
      }
    },
  }