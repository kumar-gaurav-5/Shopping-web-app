export default {
    template: 
        `<div> 
            <h5>Create Category Request:</h5> 
                  <div v-if="error">{{ error }}</div>
                  <div v-for="category in allcateg">
                       {{ category.category_name }}
                       <button v-if="!error" class="btn btn-dark mt-2" @click="approve(category.category_id)">
                         Approve
                       </button>
                  </div><br>
               
            <h5>Edit Category Request:</h5>
                  <div v-if="erroredit">{{ erroredit }}</div>
                  <div v-for="category in edit_category">
                     <div v-for="categ in original_category">
                        <div v-if="categ.category_id==category.category_id">
                          <span>{{ categ.category_name }} as {{category.category_name}}</span>
                          <button v-if="!erroredit" class="btn btn-dark mt-2" @click="approveEdit(category.category_id,category.category_name)">
                           Approve
                          </button>
                        </div>
                      </div>
                  </div><br>

            <h5>Delete Category Request:</h5>
                  <div v-if="errordel">{{ errordel }}</div>
                  <div v-for="category in delete_category">
                      {{ category.category_name }}
                      <button v-if="!errordel" class="btn btn-dark mt-2" @click="approveDelete(category.category_id)">
                          Approve
                      </button>
                  </div>
        </div> `,
    data(){
        return{
          edit_categ:{
            category_id: null,
            category_name:'' ,
          },
            allcateg: [],
            delete_category: [],
            edit_category: [],
            original_category: [],
            error: null,
            errordel: null,
            erroredit: null,
            token: localStorage.getItem('auth-token'),
        };
    },
    methods: {
        async approve(category_id) {
          try {
            const res = await fetch(`/approve/category/${category_id}`, {
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
        async approveDelete(category_id){
            
                const response = await fetch(`/api/get-category/${category_id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                  },
                });
                const data = await response.json().catch((e) => {})
               
                if (response.ok) {
                  
                  alert('Category Deletion Approved')
                  window.location.reload();
                  
                } 
              else{
                alert('Error Deleting Category')
              }
               
        },
        async approveEdit(category_id,category_name){
               this.edit_categ.category_id=category_id
               this.edit_categ.category_name=category_name
               const res = await fetch('/api/get-category', {
               method: 'PUT',
               headers: {
                 'Authentication-Token': this.token,
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify(this.edit_categ),
               })
               const dat = await res.json().catch((e) => {})
               
                if (res.ok) {
                  
                  alert('Category Edit Approved')
                  window.location.reload();
                  
                } 
              else{
                alert('Error Approving Edit Category')
              }

        },
      },
    async mounted(){
        try {
            const res = await fetch('/category_false', {
              headers: {
                'Authentication-Token': this.token,
              },
            });
           
            const data = await res.json();
            if (!res.ok) {
                this.error = data.message;
            }
            console.log(data);
            this.allcateg = data;
          } catch (error) {
            this.error = data.message;
          }
        
        try {
            const res = await fetch('/get-delete-category', {
              headers: {
                'Authentication-Token': this.token,
              },
            });
           
            const dat = await res.json();
            if (!res.ok) {
                this.errordel = dat.message;
            }
            console.log(dat);
            this.delete_category = dat;
          } catch (error) {
            this.errordel = dat.message;
          }

          try {
            const res = await fetch('/get-edit-category', {
              headers: {
                'Authentication-Token': this.token,
              },
            });
           
            const data = await res.json();
            if (!res.ok) {
                this.erroredit = data.message;
            }
            console.log(data);
            this.edit_category = data;
          } catch (error) {
            this.erroredit = data.message;
          }
          
          try {
            const res = await fetch('/api/get-category', {
              headers: {
                'Authentication-Token': this.token,
              },
            });
           
            const data = await res.json();
            if (!res.ok) {
                this.erroredit = data.message;
            }
            console.log(data);
            this.original_category = data;
          } catch (error) {
            this.erroredit = data.message;
          }
        

    },
}