import { createRouter,createWebHistory } from "vue-router";
import LoginComponent from '@/views/LoginComponent.vue';
import ItemList from '@/views/ItemList.vue';
import BasicComponent from '@/components/BasicComponent.vue';
// export default인 경우에는 {} 필요없고, 여러개 요소가 있을경우에는 {}필요.
import { memberRoutes } from './memberRouter.js';
import { orderRoutes } from './orderRouter.js';
import { itemRoutes } from './itemRouter.js';

const routes = [
    {   
        // 라우터 경로
        path : '/',
        // 라우터 이름
        name : 'HOME',
        // 넣을 component
        component:ItemList
    },
    {   
        path : '/basic',
        name : 'BasicComponent',
        component:BasicComponent
    },
    {
        path:'/login',
        name : 'Login',
        component: LoginComponent,
    },
    // ...은 스프레드 연산자로 불리고, 주로, 배열요소를 다른 배열요소애 합할 때 사용
    ...memberRoutes,
    ...orderRoutes,
    ...itemRoutes,
]

const router = createRouter({
    // vue router는 내부적으로 두가지 방식의 히스토리 관리를 제공한다.
    // 1) history: createWebHashHistory, createHashHistory
    history: createWebHistory(),
    routes
    }
)
export default router;