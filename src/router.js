import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WalkerDetailView from './views/WalkerDetailView.vue'
import ReserveView from './views/ReserveView.vue'
import ReviewView from './views/ReviewView.vue'


export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/walkers/:id', name: 'walker', component: WalkerDetailView },
    { path: '/walkers/:id/reserve', name: 'reserve', component: ReserveView },
    { path: '/review', name: 'review', component: ReviewView },
  ],
})