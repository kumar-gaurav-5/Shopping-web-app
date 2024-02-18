export default {
    template: 
    `<div>
        <div class="badge bg-primary text-wrap" style="font-size: 1.02rem;font-weight: 600;"> 
            Welcome admin
        </div> <br><br>


          <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-6">
                  <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" v-model="searchQuery" placeholder="Search for Categories" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit" @click="submitSearch">Search</button>
                  </form>
                </div>
              </div>
          </div> <br>


        <div v-if="isSearching"  >
             <div >{{ error }}</div>
             <div class="container">
               <div class="row g-3">
                 <div class="col-md-2" v-for="category in searchResults" >
                   <div class="card text-center">
                     <div class="card-body">
                       <h5 class="card-title">{{ category.category_name }}</h5>
                       <button class="btn btn-primary" @click="handleEdit(category.category_id,category.category_name)">Edit</button>
                       <button class="btn btn-danger" @click="deleteCategory(category.category_id)">Delete</button>
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
                    <h5 class="card-title">{{ category.category_name }}</h5>
                    <button class="btn btn-primary" @click="handleEdit(category.category_id,category.category_name)">Edit</button>
                    <button class="btn btn-danger" @click="deleteCategory(category.category_id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div><br><br><br>


        <div class="text-center">
             <button type="button" class="btn btn-dark" @click="openCreateCategory">Create Category</button>
        </div>

        
        <div v-if="showCreateCategory">
             <div class='d-flex justify-content-center' >
               <div class="mb-3 p-5 bg-light">
                  <label for="category-name" class="form-label">Category Name</label>
                  <input type="name" class="form-control" id="category-name" v-model="cat.category_name">
                  <button class="btn btn-dark mt-2" @click='createCategory'>Create</button>
                  <button class="btn btn-dark mt-2" @click='cancel'>Cancel</button>
               </div>
             </div> 
        </div>


        <div v-if="showEditCategory">
             <div class='d-flex justify-content-center' >
               <div class="mb-3 p-5 bg-light">
                  <label for="category-name" class="form-label">Category Name</label>
                  <input type="name" class="form-control" id="category-name" v-model="cat_edit.category_name">
                  <button class="btn btn-dark mt-2" @click='editCategory'>Edit</button>
                  <button class="btn btn-dark mt-2" @click='cancelEdit'>Cancel</button>
               </div>
             </div> 
        </div>
     
    </div>
            `,
    data() {
        return {
            cat:{
                category_name : '',
            },
            cat_edit:{
                category_id: null,
                category_name: '',
            },
         searchQuery: '',
         isSearching: false,
         searchResults: [],
        categories: [], 
        error: null,
        token: localStorage.getItem('auth-token'),
        showCreateCategory: false,
        showEditCategory: false,
        };
    },
    methods: {
      async handleEdit(category_id,category_name) {
                  
                  this.showEditCategory = true
                  this.cat_edit.category_id = category_id
                  this.cat_edit.category_name= category_name;
                  
        },
      async editCategory(){
        const res = await fetch('/api/get-category', {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cat_edit),
        })
        const dat = await res.json()
              if (res.ok) {
                
                this.showEditCategory = false
                window.location.reload()
                alert(dat.message)
              }
              else {alert("Error while Updating Category")}
                 
      },
      
      async deleteCategory(category_id) {
                  // Implementing  delete functionality here
                  const isConfirmed = window.confirm('Sure to delete this Category?');
                  if (isConfirmed) {
                    try {
                      const response = await fetch(`/api/get-category/${category_id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authentication-Token': this.token,
                        },
                      });
                  
                      if (response.ok) {
                        // Updating categories after successful deletion
                        this.categories = this.categories.filter(category => category.id !== category_id);
                        window.location.reload()
                      } else {
                        console.error('Error deleting Category:', response.status, response.statusText);
                      }
                    } catch (error) {
                      console.error('Error deleting Category:', error);
                    }
                  }
        },
        openCreateCategory() {
            // Setting the flag to show the form for creating Category
            this.showCreateCategory = true;
          },
        async createCategory(){
            const res = await fetch('/api/get-category', {
                method: 'POST',
                headers: {
                  'Authentication-Token': this.token,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cat),
              })
        
              const dat = await res.json()
              if (res.ok) {
                
                this.showCreateCategory = false
                window.location.reload()
                alert(dat.message)
              }
              else {alert("Error while Creating Category")}
        },
        cancel(){
            this.showCreateCategory = false;
            // window.location.reload();
        },
        cancelEdit(){
            this.showEditCategory = false;
        },

    
      submitSearch() {
            fetch('/api/searchcategory', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token,
              },
              body: JSON.stringify({ query: this.searchQuery }),
            })
            .then(response => response.json())
            .then(data => {
              this.searchResults = data.results;
              this.isSearching = true;
            });
          }
    
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
          } else {
            // If search query is empty, clearing searchResults and setting isSearching to false
            this.searchResults = [];
            this.isSearching = false;
          }
        }
      },
      
  }