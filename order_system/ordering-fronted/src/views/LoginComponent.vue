<template>
    <div class="container">
        <div class="page-header text-center" style="margin-top: 20px">
          <h1>로그인</h1>
        </div>
        <div id="update-form" class="mt-4">
      <!-- submit 은 기본적으로 폼 제출시 페이지를 새로고침한다. > 막기위해 prevent 사용 -->
          <form @submit.prevent="doLogin"> 
            <div class="form-group">
              <label for="email">email: </label>
              <input class="form-control" v-model="email" type="text" >
            </div>
      
            <div class="form-group">
              <label for="password">비번: </label>
              <input class="form-control" v-model="password" type="password">
            </div>
      
            <button class="btn btn-primary" type="submit" value="로그인">로그인</button>
          </form>
        </div>
      </div>
</template>

<script>
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
export default {
    data(){
        return{
            email:"",
            password:""
        }
    },
    methods:{
      async doLogin(){                      
        
        // 1. 200번대 상태값 + 토큰x 
        // 2. 200번대 상태값x -> 분기처리
      try{
        const loginData = {email:this.email, password:this.password};
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/doLogin`,loginData);
        const token = response.data.result.token
        if(token){
          const decoded = jwtDecode(token)
          localStorage.setItem("token",token) // 로그인 성공시
          localStorage.setItem("role",decoded.role)
        // created함수는 reload될때 1번만 실행되는 hook함수
        // 그런데, router.push를 통한 화면전환은 reload를 실행시키지 않으므로, created함수 호출이 되지 않음
          
          // this.$router.push("/") // 홈으로 보냄
          window.location.href ="/";
        }else{
          alert("Loign failed")
        }
        
      }catch(error){
        const error_message = error.response.data.error_message
        if (error_message){
          console.log(error_message)
          alert(error_message)
        }
        else{
          console.log(error)
          alert("Loign failed")
        }
      }
    }
  }
}
</script>