<template>
    <h1>hello world {{myLang}}</h1>
    <input type="text" value="myvalue"/>
    <!-- :value : v-bind : value= 의 약어이다. -->
    <!-- v-bind : input박스에서 많이 사용하는 단방향 변수 매핑 방식-->
    <input type="text" :value="inputvalue1"/>
    <!-- v-model 양방향 데이터바인딩 모델 이라는 차이점 -->
    <input type="text" v-model="inputvalue2"/>
    <!-- onclick = @click -->
    <button @click="showValue">변수 변경사항 확인</button>
    <div>
        <h2>{{count}}</h2>
        <button @click="increment">increment</button>
    </div>
    <div>
        <h2>{{doubleCount}}</h2>
        <button @click="increment">increment</button>
    </div>

</template>

<script>

export default {
    data(){
        return{
            myLang:"python",
            inputvalue1:"python2",
            inputvalue2:"python3",
            count: 0,
        }
    },
    // vue 생명주기에서 인스턴스가 생성되는 시점을 created라고 하고, mounted는 생성된 이후이다. 
    // 즉 확면이 열리기전에 일어나는 것이다, 약간 AOP, Interceptor 같은 느낌 ?
    created(){ 
        this.myLang = "java"
    },
    // computed는 종속된 반응형 데이터(count)가 변경될 때만 함수를 다시 실행하여 값을 계산하는 계산함수
    computed: {
        doubleCount(){
            return this.count * 2;
        }
    },
    methods : {
        increment(){
            this.count ++;
        },
        showValue(){
            alert(this.inputvalue2)
        }
    }
}
</script>
