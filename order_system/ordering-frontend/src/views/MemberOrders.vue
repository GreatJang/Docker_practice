<template>
    <OrderListComponent
    :isAdmin="true"
    :apiUrl="`/member/${id}/orders`"
    />
</template>

<script>
import OrderListComponent from '@/components/OrderListComponent.vue';
export default {
    // 매개변수로 데이터 넘겨받을 때 props사용
    props:['id'],
    components:{
        OrderListComponent
    }
}
</script>