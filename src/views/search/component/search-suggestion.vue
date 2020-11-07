<template>
  <div class="search-suggestion">
      <van-cell  
      icon="search"
      v-for="(text,index) in suggestions"
      :key='index'
      @click="$emit('search',text)"
      >
      <div slot="title" v-html='hightLight(text)'></div>
      </van-cell>
  </div>
</template>

<script>
import {getSearchSuggestions} from '@/api/search'
import {debounce} from 'lodash'

export default {
  // 组件名称
  name:"SearchSuggestion",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
      searchText:{
          type:String,
          required:true
      }
  },
  // 组件状态值
  data() {
    return {
       suggestions:[] //初始化搜索建议列表数据
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
      searchText: {
           // debounce 函数
           // 参数1：函数
           // 参数2：防抖时间
           // 返回值：防抖之后的函数，和参数1功能是一样的
           handler:debounce(function(val){
             this.loadSearshSuggestions(val)
          },300),
          // 监视的处理函数,当searchText发生变化时就会调用handler函数
        //   注意：handler函数名是固定
        //   handler (val){
        //     //   console.log(val);
        //     this.loadSearshSuggestions(val)
        //   },
          // 首次监视触发
        immediate: true //该回调将会在侦听开始之后被立即调用
      }
  },
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created() {},
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted() {},
  // 组件方法
  methods: {
      async loadSearshSuggestions(query){
          try {
              const {data:res}=await getSearchSuggestions(query)
              this.suggestions=res.data.options
          } catch (error) {
              this.$toast('获取失败，请稍后重试')
          }
      },
/**
     * 处理高亮文本
     * 思路：
     * 1. 想要在一个字符串中，将固定的字符特殊显示（改变颜色）
     * 2. 那么就需要在这个字符串中，找出该字符，然后为该字符设置单独的样式（span.active）
     * 拆解：
     *     1. 找出字符
     *     2. 替换字符
     *     3. 设置单独的样式比较容易（替换字符），难点在于找出字符
     * 如何找出字符：
     * 1. 那么《处理高亮文本》的问题，就变成，《如何在字符串中找出固定的字符》
     * 2. 在字符串中找出固定字符，大家首先想到的就应该是使用 -》 正则表达式
     * 3. 简单使用正则（text.replace(/匹配的内容/gi, highlightStr)） , 无法插入响应式数据
     * 4. 所以我们使用了 RegExp 对象。RegExp 构造函数创建了一个正则表达式对象，用于将文本与一个模式匹配。MDN: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp
     * 5. 通过 RegExp 来完成响应式数据的正则匹配
     */
      hightLight(text){
          const hightLightStr=`<span class='active'>${this.searchText}</span>`
          // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
         const reg=new RegExp(this.searchText,'gi')
         return text.replace(reg,hightLightStr)
      }
  }
};
</script>

<style scoped lang="less">
.search-suggestion{
    /deep/ span.active{
        color:#3296fa;
    }
}
</style>
