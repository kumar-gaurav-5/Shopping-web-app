export default {
    template: 
    `<div>
          <h5>Manage Products under {{categoryName}} category</h5>
          <div >{{ error }}</div>
          <table v-if="!error">
             <tr>
                  <th>Name &nbsp;&nbsp;</th>
                  <th>Unit &nbsp;&nbsp;</th>
                  <th>Rate/Unit &nbsp;&nbsp;</th>
                  <th>Quantity &nbsp;&nbsp;</th>
                  <th>Manufacture Date &nbsp;&nbsp;</th>
                  <th>Expiry Date &nbsp;&nbsp;</th>
                  <th>Actions </th>
             </tr>
             <tr v-for="product in products" >
                  <td>{{ product.product_name }}&nbsp;</td>
                  <td>{{ product.unit }}&nbsp;&nbsp;</td>
                  <td>{{ product.rate_per_unit }}&nbsp;&nbsp;</td>
                  <td>{{ product.quantity }}&nbsp;</td>
                  <td>{{ product.manufacture_date}}&nbsp;</td>
                  <td>{{ product.expiry_date}}&nbsp;</td>
                  <td>
                     <button class="btn btn-primary" @click="handleEdit(product.product_id,product.product_name,product.unit,product.rate_per_unit,product.quantity,product.manufacture_date,product.expiry_date,product.category_id)">Edit</button>
                     <button class="btn btn-danger" @click="deleteProduct(product.product_id,categoryId)">Delete</button>
                  </td>
             </tr>
                  
          </table> <br>

          <div class="text-center">
             <button type="button" class="btn btn-dark" @click="openCreateProduct">Add New Product</button>
          </div>

          <div v-if="showCreateProduct">
             <div class='d-flex justify-content-center' >
               <div class="mb-3 p-5 bg-light">
                  <label for="product-name" class="form-label">Product Name</label>
                  <input type="name" class="form-control" id="product-name" v-model="prod.product_name">
                  <label for="unit" class="form-label">Unit</label>
                  <input type="text" class="form-control" id="unit" v-model="prod.unit">
                  <label for="rate_per_unit" class="form-label">Rate per unit</label>
                  <input type="number" class="form-control" id="rate_per_unit" min="1" v-model="prod.rate_per_unit">
                  <label for="quantity" class="form-label">Quantity</label>
                  <input type="number" class="form-control" id="quantity" min="1" v-model="prod.quantity">
                  <label for="manufacture_date" class="form-label">Manufacture Date</label>
                  <input type="date" class="form-control" id="manufacture_date" v-model="prod.manufacture_date">
                  <label for="expiry_date" class="form-label">Expiry Date</label>
                  <input type="date" class="form-control" id="expiry_date" v-model="prod.expiry_date">
                  <button class="btn btn-dark mt-2" @click='createProduct(categoryId)'>Add</button>
                  <button class="btn btn-dark mt-2" @click='cancel'>Cancel</button>
               </div>
             </div> 
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
        
    </div>
            `,
    data() {
        return {
            prod:{
                product_name : null,
                unit : null,
                rate_per_unit : null, 
                quantity : null,
                manufacture_date : null,
                expiry_date : null,
                category_id : null,

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
        categoryId: null,
        categoryName: null,
        products: [], 
        error: null,
        token: localStorage.getItem('auth-token'),
        showCreateProduct: false,
        showEditProduct: false,
        };
    },
    methods: {
        openCreateProduct() {
            this.showCreateProduct = true;
          },
        cancel(){
            this.showCreateProduct = false;
        },
        async createProduct(categoryId){
            this.prod.category_id = categoryId
            const res = await fetch('/api/get-product', {
                method: 'POST',
                headers: {
                  'Authentication-Token': this.token,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.prod),
              })
        
              const dat = await res.json()
              if (res.ok) {
                
                this.showCreateProduct = false
                window.location.reload()
                alert(dat.message)
              }
              else {alert("Error while Adding Product")}
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
            }
        },
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
        
      },
    
  }