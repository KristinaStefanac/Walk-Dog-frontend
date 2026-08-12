import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WalkerDetailView from './views/WalkerDetailView.vue'
import ReserveView from './views/ReserveView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/walkers/:id', name: 'walker', component: WalkerDetailView },
    { path: '/walkers/:id/reserve', name: 'reserve', component: ReserveView },
  ],
})