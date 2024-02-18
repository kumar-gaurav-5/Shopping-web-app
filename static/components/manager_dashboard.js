export default {
    template: 
    `<div>
        <div class="badge bg-primary text-wrap" style="font-size: 1.02rem;font-weight: 600;"> 
           Welcome Store Manager
        </div> <br>

        <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-6">
                  <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" v-model="searchQuery" placeholder="Search for Categories/Products" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit" @click="submitSearch">Search</button>
                  </form>
                </div>
              </div>
        </div> <br>


        <div v-if="isSearching">
            <div >{{ error }}</div>
            <div class="container">
              <div class="row g-3">
                <div class="col-md-2" v-for="category in searchResults" >
                  <div class="card text-center">
                    <div class="card-body">
                       <div  v-if="category.is_approved">
                          <router-link :to="{ name: 'Products', params: { categoryId: category.category_id, categoryName: category.category_name } }" >
                           <h5 class="card-title">{{ category.category_name }}</h5>
                          </router-link>
                       </div>
                       <div v-else> 
                         <h5 class="card-title">{{ category.category_name }}</h5> 
                       </div>
                    <button v-if="category.is_approved" class="btn btn-primary" @click="editHandle(category.category_id,category.category_name)">Edit</button>
                    <button v-if="category.is_approved" class="btn btn-danger" @click="deleteRequest(category.category_id,category.category_name)">Delete</button>
                    <button v-if="!category.is_approved" class="btn btn-light"> (not approved) </button>
                 </div>
                </div>
              </div>
             </div>
            </div> 
          </div>
        <div v-if="!isSearching">
            <div >{{ error }}</div>
            <div class="container">
              <div class="row g-3">
                <div class="col-md-2" v-for="category in categories" >
                  <div class="card text-center">
                    <div class="card-body">
                       <div  v-if="category.is_approved">
                          <router-link :to="{ name: 'Products', params: { categoryId: category.category_id, categoryName: category.category_name } }" >
                           <h5 class="card-title">{{ category.category_name }}</h5>
                          </router-link>
                       </div>
                       <div v-else> 
                         <h5 class="card-title">{{ category.category_name }}</h5> 
                       </div>
                    <button v-if="category.is_approved" class="btn btn-primary" @click="editHandle(category.category_id,category.category_name)">Edit</button>
                    <button v-if="category.is_approved" class="btn btn-danger" @click="deleteRequest(category.category_id,category.category_name)">Delete</button>
                    <button v-if="!category.is_approved" class="btn btn-light"> (not approved) </button>
                 </div>
                </div>
              </div>
             </div>
            </div> 
          </div><br>



        <div v-if="!isSearching" class="text-center">
             <button type="button" class="btn btn-dark" @click="openCreateCat">Create Category</button>
        </div>
        <div v-if="showCreateCat">
             <div class='d-flex justify-content-center' >
               <div class="mb-3 p-5 bg-light">
                  <label for="category-name" class="form-label">Category Name</label>
                  <input type="name" class="form-control" id="category-name" v-model="categ.category_name">
                  <button class="btn btn-dark mt-2" @click='createCateg'>Create</button>
                  <button class="btn btn-dark mt-2" @click='CAncel' >Cancel</button>
               </div>
             </div> 
        </div><br>

        <div v-if="showEditCateg">
             <div class='d-flex justify-content-center' >
               <div class="mb-3 p-5 bg-light">
                  <label for="category-name" class="form-label">Category Name</label>
                  <input type="name" class="form-control" id="category-name" v-model="categ_edit.category_name">
                  <button class="btn btn-dark mt-2" @click='editCateg'>Edit</button>
                  <button class="btn btn-dark mt-2" @click='cancelEditCateg'>Cancel</button>
               </div>
             </div> 
        </div><br>

        <div class='d-flex justify-content-center'>
        <table v-if="isSearching && SearchProdResults.length > 0">
             <tr>
                  <th>Name &nbsp;&nbsp;</th>
                  <th>Unit &nbsp;&nbsp;</th>
                  <th>Rate/Unit &nbsp;&nbsp;</th>
                  <th>Quantity &nbsp;&nbsp;</th>
                  <th>Manufacture Date &nbsp;&nbsp;</th>
                  <th>Expiry Date &nbsp;&nbsp;</th>
                  <th>Actions </th>
             </tr>
             <tr v-for="product in SearchProdResults" >
                  <td>{{ product.product_name }}&nbsp;</td>
                  <td>{{ product.unit }}&nbsp;&nbsp;</td>
                  <td>{{ product.rate_per_unit }}&nbsp;&nbsp;</td>
                  <td>{{ product.quantity }}&nbsp;</td>
                  <td>{{ product.manufacture_date}}&nbsp;</td>
                  <td>{{ product.expiry_date}}&nbsp;</td>
                  <td>
                     <button class="btn btn-primary" @click="handleEdit(product.product_id,product.product_name,product.unit,product.rate_per_unit,product.quantity,product.manufacture_date,product.expiry_date,product.category_id)">Edit</button>
                     <button class="btn btn-danger" @click="deleteProduct(product.product_id,product.category_id)">Delete</button>
                  </td>
             </tr>         
        </table>
        </div>

        <div v-if="showEditProduct">
             <div class='d-flex justify-content-center' >
               <div class="mb-3 p-5 bg-light">
                  <label for="product-name" class="form-label">Product Name</label>
                  <input type="name" class="form-control" id="product-name" v-model="prod_edit.product_name">
                  <label for="unit" class="form-label">Unit</label>
                  <input type="text" class="form-control" id="unit" v-model="prod_edit.unit">
                  <label for="rate_per_unit" class="form-label">Rate per unit</label>
                  <input type="number" class="form-control" id="rate_per_unit" min="1" v-model="prod_edit.rate_per_unit">
                  <label for="quantity" class="form-label">Quantity</label>
                  <input type="number" class="form-control" id="quantity" min="1" v-model="prod_edit.quantity">
                  <label for="manufacture_date" class="form-label">Manufacture Date</label>
                  <input type="date" class="form-control" id="manufacture_date" v-model="prod_edit.manufacture_date">
                  <label for="expiry_date" class="form-label">Expiry Date</label>
                  <input type="date" class="form-control" id="expiry_date" v-model="prod_edit.expiry_date">
                  <button class="btn btn-dark mt-2" @click='editProduct'>Edit</button>
                  <button class="btn btn-dark mt-2" @click='cancelEdit'>Cancel</button>
               </div>
             </div> 
          </div>
          
          <div v-if="!isSearching" class="text-center">
            <button @click='downlodProductsCSV' class="btn btn-outline-success ">Download Products Details</button>
            <div v-if='isLoading' class="d-flex justify-content-center"> Waiting to download... </div>
          </div>

    </div>`,
    data() {
        return {
            categ:{
                category_name : '',
            },
            categ_edit:{
                category_id : null,
                category_name : '',
            },
            del:{
                category_id : null,
                category_name: '',
            },
            prod_edit:{
              product_id: null,
              product_name : null,
              unit : null,
              rate_per_unit : null, 
              quantity : null,
              manufacture_date : null,
              expiry_date : null,
              category_id : null,
          },
        categories: [], 
        error: null,
        token: localStorage.getItem('auth-token'),    
        showCreateCat: false,
        showEditCateg: false,
        showEditProduct: false,
         searchQuery: '',
         isSearching: false,
         searchResults: [],
         SearchProdResults:[],
         isLoading: false,
        };
    },
    methods:{
        async openCreateCat() {
            // Setting the flag to show the form for creating Category
            this.showCreateCat = true;
          },
        async CAncel(){
            this.showCreateCat = false;
        },
        async createCateg(){
            const res = await fetch('/api/get-category', {
                method: 'POST',
                headers: {
                  'Authentication-Token': this.token,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.categ),
              })
        
              const data = await res.json()
              if (res.ok) {
                this.showCreateCat = false
                window.location.reload()
                alert("Request Sent to Admin")
              }
              else {alert("Error while Creating Category")}
        },
        async deleteRequest(category_id,category_name){
             this.del.category_id=category_id
             this.del.category_name=category_name
             const isConfirmed = window.confirm('Send Request to Delete?');
                  if (isConfirmed) {
                    try {
                      const response = await fetch(`/api/request-delete`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authentication-Token': this.token,
                        },
                        body: JSON.stringify(this.del),
                      });
                      const dat = await response.json()
                      if (response.ok) {
                          alert(dat.message)
                      }
                      else {alert("Error while Sending Request")}
                    } catch (error) {
                      console.error('Error deleting Category:', error);
                    }
                  }
        },
        cancelEditCateg(){
          this.showEditCateg = false
        },
        async editHandle(category_id,category_name) {
                  
          this.showEditCateg = true
          this.categ_edit.category_id = category_id
          this.categ_edit.category_name= category_name
          
        },
        async editCateg(){
            const isConfirmed = window.confirm('Send Request to Edit?');
               if (isConfirmed) {
                 try {
                   const response = await fetch(`/api/request-edit`, {
                     method: 'POST',
                     headers: {
                       'Content-Type': 'application/json',
                       'Authentication-Token': this.token,
                     },
                     body: JSON.stringify(this.categ_edit),
                   });
                   const dat = await response.json()
                   if (response.ok) {
                       this.showEditCateg = false
                       alert(dat.message)
                   }
                   else {alert("Error while Sending Request")}
                 } catch (error) {
                   console.error('Error deleting Category:', error);
                 }
               }
        },  
        submitSearch(){

        },
        async handleEdit(product_id,product_name,unit,rate_per_unit,quantity,manufacture_date,expiry_date,category_id){
          this.showEditProduct = true
          this.prod_edit.product_id = product_id
          this.prod_edit.product_name= product_name
          this.prod_edit.unit= unit
          this.prod_edit.rate_per_unit= rate_per_unit
          this.prod_edit.quantity=quantity
          this.prod_edit.manufacture_date=manufacture_date
          this.prod_edit.expiry_date=expiry_date
          this.prod_edit.category_id=category_id
     },
     async editProduct(){
      try{
      const res = await fetch('/api/get-product', {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.prod_edit),
        });
      const dat = await res.json()
      if (res.ok) {
              this.showEditCategory = false
              alert(dat.message)
              window.location.reload()
              
          }
      else {alert("Error while Updating Product")}
      }
      catch{
          alert('Some error')
          window.location.reload()
      }
    },
        cancelEdit(){
           this.showEditProduct = false;
        },
       async deleteProduct(product_id,categoryId) {
          const isConfirmed = window.confirm('Sure to delete this Product?');
             if (isConfirmed) {
               try {
                const response = await fetch(`/api/get-product/${product_id}/${categoryId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                   'Authentication-Token': this.token,
                },
               });
        
              if (response.ok) {
                this.products = this.products.filter(product => product.id !== product_id);
                window.location.reload();
              } else {
              console.error('Error deleting Product:', response.status, response.statusText);
               }
              } catch (error) {
              console.error('Error deleting Product:', error);
             }
             window.location.reload();
             }
        },
     async downlodProductsCSV(){
      this.isLoading = true
      const response = await fetch('/download_product_details')
      const data = await response.json()
      if (response.ok) {
        const taskId = data['task-id']
        const interval = setInterval(async () => {
          const csv_res = await fetch(`/get_csv_file/${taskId}`)
          if (csv_res.ok) {
            this.isLoading = false
            clearInterval(interval)
            window.location.href = `/get_csv_file/${taskId}`
          }
        }, 1000)
      }
     },

    },
    async mounted() {
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
        }
        
      },
    
      watch: {
        searchQuery(newQuery) {      //watching for change in searchQuery binded to search bar
          if (newQuery) {
            this.showCreateCat= false
            this.showEditCateg= false
            this.showEditProduct= false
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