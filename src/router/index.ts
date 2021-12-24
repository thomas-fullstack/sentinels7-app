import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import AdminDevices from '../views/AdminDevices.vue'
import Overview from '../views/Overview.vue'
import Reports from '../views/Reports.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/overview'
  },
  {
    path: '/overview',
    component: Overview
  },
  {
    path: '/admindevices',
    component: AdminDevices
  },
  {
    path: '/reports',
    component: Reports
  },
  {
    path: '/login',
    component: Login
  },
  { 
    path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})

export default router
