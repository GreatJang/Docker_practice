<template>
    <div class="container">
        <div class="page-header text-center" style="margin-top: 20px"><h1>회원 정보</h1></div>
        <table class="table">
            <tr>
                <td>이름</td>
                <td>{{ memberinfo.name }}</td>
            </tr>
            <tr>
                <td>email</td>
                <td>{{memberinfo.email}}</td>
            </tr>
            <tr>
                <td>도시</td>
                <td>{{memberinfo.city}}</td>
            </tr>
            <tr>
                <td>상세주소</td>
                <td>{{memberinfo.street}}</td>
            </tr>
            <tr>
                <td>우편정보</td>
                <td>{{memberinfo.zipcode}}</td>
            </tr>
        </table>
    </div>
    <OrderListComponent
    :isAdmin="false"
    apiUrl="/member/myorders"
    />
</template>

<script>
import axios from 'axios';
import OrderListComponent from '@/components/OrderListComponent.vue';
export default {
    components:{
        OrderListComponent
    },
    data(){
        return{
            memberinfo: {},
        }
    },
    created(){
        this.fetchMember();
    },
    methods:{
        async fetchMember(){
                try{
            const token = localStorage.getItem('token');
            const headers = token ? {Authorization: `Bearer ${token}`} : {};
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member/myInfo`, {headers});
            this.memberinfo = response.data;
            }catch(error){
                console.log(error)
            }
        }
    }
}
</script>