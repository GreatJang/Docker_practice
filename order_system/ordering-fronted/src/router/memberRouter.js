// router중 member 모음

import MemberList from '@/views/MemberList.vue';
import MemberCreate from '@/views/MemberCreate.vue';
import MemberOrders from '@/views/MemberOrders.vue';
import MyPage from '@/views/MyPage.vue';

export const memberRoutes = [
    {   
        path : '/members',
        name : 'memberList',
        component: MemberList,
    },
    {   
        path : '/member/create',
        name : 'MemberCreate',
        component: MemberCreate,
    },
    {   
        path : '/member/:id/orders', //id가 들어온다 //props:['id'],
        name : 'MemberOrders',
        component: MemberOrders,
        props : true,
    },
    {
        path:'/mypage',
        name : 'MyPage',
        component: MyPage,
    },


];