<template>
    <div class="container">
        <div class="page-header text-center" style="margin-top: 20px"><h1>{{pageTitle}}</h1></div>
        <div class="d-flex justify-content-between" style="margin-top:20px;">
            <form @submit.prevent="searchItems">
                <select v-model="searchType" sytle="display: inline-block; width:auto; margin-right: 5px;">
                    <option value="optional">선택</option>
                    <option value="name">상품명</option>
                    <option value="category">카테고리</option>
                </select>
                <input v-model="searchValue" type="text"/>
                <button type="submit">검색</button>
            </form>
            <div v-if="!isAdmin"> <!-- Admin이 아닌경우에만-->
                <button @click="addCart" class="btn btn-secondary">장바구니</button>
                <button @click="placeOrder" class="btn btn-success">주문하기</button>
            </div>
            <div v-if="isAdmin">
                <a href="/item/create"><button class="btn btn-success">상품등록</button></a>
            </div>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th v-if="!isAdmin"></th> <!--체크박스에 대한 head. Admin이면 없어도 댐-->
                    <th>제품사진</th>
                    <th>제품명</th>
                    <th>가격</th>
                    <th>재고수량</th>
                    <th v-if="!isAdmin">주문수량</th>
                    <th v-if="isAdmin">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in itemList" :key="item.id">
                    <!-- 체크박스를 선택하면 value가 true가 담기게 됨 -->
                    <td v-if="!isAdmin"><input type="checkbox" v-model="selectedItems[item.id]"/></td>
                    <td><img :src="getImage(item.id)" style="height: 100px; width: auto;"/></td>
                    <td>{{item.name}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.stockQuantity}}</td>
                    <td v-if="!isAdmin"><input type="number" min="1" v-model="item.quantity" style="width: 60px"/></td>
                    <td v-if="isAdmin"><button @click="deleteItem(item.id)" class="btn btn-secondary">삭제</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import {mapActions} from 'vuex';
export default {
    props: ['isAdmin', 'pageTitle'],
    data(){
        return{
            itemList: [],
            pageSize: 10, //페이지 당 목록 갯수
            currentPage: 0, //화면 페이지
            searchType: 'name',
            searchValue: '',
            isLastPage: false,
            isLoading: false,
            selectedItems: {}
        }
    },
    created(){
        this.loadItems();
    },
    // mounted : window dom객체가 생성된 이후에 실행되는 hook함수
    mounted(){
        // scroll 동작이 발생할때마다 scrollPagination함수 호출된다는 의미
        window.addEventListener('scroll', this.scrollPagination);
    },
    methods: { //사용자 정의 함수
        ...mapActions(['addToCart']),
        addCart(){
            const orderItems = Object.keys(this.selectedItems) //객체 안에 키값 추출하는 메서드
                                .filter(key=>this.selectedItems[key]===true) // 키를 넣고 조회하는데 있는 애들중(선택된 애들 중) true이면
                                .map(key => {
                                    const item = this.itemList.find(item => item.id == key); // 전체 item객체를 리턴하는데
                                    return {itemId:item.id, name:item.name ,count:item.quantity}; // 그 전체 item중 일치하는 값 return
                                });
            console.log(orderItems)
            // mutation직접호출 방식
            // orderItems.forEach(item => this.$store.commit('addToCart', item));
            // actions호출 방식
            orderItems.forEach(item => this.$store.commit('addToCart', item));
            this.selectedItems = [];
        },
        async deleteItem(itemId){
            if (confirm("정말 삭제 하시겠습니까?")) {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/item/${itemId}/delete`, { headers });
                window.location.reload();
            }
        },
        async placeOrder(){
            // {
                    // "1":true,
                    // "2":false,
            // }
            // Object.keys : 위의 데이터구조에서 1,2 등 key값 추출하는 메서드
            const orderItems = Object.keys(this.selectedItems) //객체 안에 키값 추출하는 메서드
                                .filter(key=>this.selectedItems[key]===true) // 키를 넣고 조회하는데 있는 애들중(선택된 애들 중) true이면
                                .map(key => {
                                    const item = this.itemList.find(item => item.id == key); // 전체 item객체를 리턴하는데
                                    return {itemId:item.id, count:item.quantity}; // 그 전체 item중 일치하는 값 return
                                });

            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            if(orderItems.length < 1){
                alert("주문대상 물건이 없습니다.")
                return;
            }
            if(!confirm(`${orderItems.length}개의 상품을 주문하시겠습니까?`)){
                console.log("주문이 취소 되었습니다.");
                return;
            }
            try{
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order/create`, orderItems ,{headers})
                console.log(orderItems);
                alert("주문완료되었습니다.");
                window.location.reload();
            }catch(error){
                console.log(error);
                alert("주문이 실패되었습니다.");
            }
        },

        searchItems(){
            this.itemList = [];
            this.selectedItems = [];
            this.currentPage = 0;
            this.isLastPage = false;
            this.loadItems();
        },
        scrollPagination(){
            // innerHeight : 브라우저 창의 내부높이를 픽셀단위로 변환
            // scrollY : 스크롤을 통해 Y축을 이동한 거리
            // offsetHeight : 전체브라우저 창의 높이
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
            if(nearBottom && !this.isLastPage && !this.isLoading){
                this.currentPage++;
                this.loadItems();
            }
        },
        getImage(id){
            return `${process.env.VUE_APP_API_BASE_URL}/item/${id}/image`
        },
        async loadItems(){
            this.isLoading = true;
            try{
            // params 키워드 사용해야 파라미터 방식으로 axios요청 가능
            const params = {
                page: this.currentPage,
                size: this.pageSize,
                // [this.searchType]: this.searchValue
            }
            if(this.searchType === "name"){
                params.name = this.searchValue;
            }else if(this.searchType === "category"){
                params.category = this.searchValue;
            }
            console.log(params);
            console.log("데이터 호출");
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/items`, {params});
            const addItemList = response.data.map(item=>({...item, quantity:1 })) //기본 데이터 값을 1으로 설정
            if(addItemList.length < this.pageSize){
                this.isLastPage = true;
            }
            this.itemList = [...this.itemList, ...addItemList]; // 두 배열이 합해진다
            }catch(error){
                console.log(error)
            }
            this.isLoading = false;
        },
    },
}
</script>
