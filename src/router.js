import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WalkerDetailView from './views/WalkerDetailView.vue'
import ReserveView from './views/ReserveView.vue'
import ReviewView from './views/ReviewView.vue'
import BecomeWalkerView from './views/BecomeWalkerView.vue'
import WalkerInboxView from './views/WalkerInboxView.vue'



export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/walkers/:id', name: 'walker', component: WalkerDetailView },
    { path: '/walkers/:id/reserve', name: 'reserve', component: ReserveView },
    { path: '/review', name: 'review', component: ReviewView },
    { path: '/become-walker', name: 'become-walker', component: BecomeWalkerView },
    {path: '/walker-inbox', name: 'walker-inbox', component: WalkerInboxView }
  ],
})