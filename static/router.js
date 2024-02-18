import Home from './components/Home.js'
import Login from './components/Login.js'
import NotFound from './components/NotFound.js'
import Register from './components/Register.js'
import Manager from './components/Manager.js'
import Requests from './components/Requests.js'
import Products from './components/Products.js'
import Product_user from './components/Product_user.js'
import Cart from './components/Cart.js'
import BuyNow from './components/BuyNow.js'
import OrderPlaced from './components/OrderPlaced.js'

const routes = [
  
  { path: '/', component: Home, name: 'Home'},
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/manager', component: Manager },
  { path: '/other-requests', component: Requests },
  { path: '/products/:categoryId/:categoryName', component: Products, name: 'Products'},
  { path: '/product_user/:categoryId/:categoryName', component: Product_user, name: 'Product_user'},
  { path: '/cart', component: Cart, name:'Cart'},
  { path: '/buynow/:currentuserId/:productId', component: BuyNow, name: 'BuyNow'},
  { path: '/orderplaced', component: OrderPlaced, name: 'OrderPlaced'},
  { path: '*', component: NotFound, name: 'NotFound'}

]

export default new VueRouter({
  routes,
})