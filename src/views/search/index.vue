<template>
  <div class="search-container">
      <!-- 搜索框-->
      <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
      <form action="/" class="search-form">
          <van-search
            v-model="searchText"
            show-action
            placeholder="请输入搜索关键词"
            background="#3296fa"
            @search="onSearch"
            @cancel="onCancel"
            @focus="isResultShow=false"
          />
      </form>
       <!-- 搜索结果 -->
      <search-result v-if="isResultShow" :searchText='searchText'></search-result>
      <!-- 联想建议 -->
      <search-suggestion 
      v-else-if="searchText" 
      :searchText='searchText'
      @search='onSearch'
      ></search-suggestion>
      <!-- 搜索历史记录 -->
      <search-history 
      v-else 
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories=[]"
      @search="onSearch"
      ></search-history>
  </div>

</template>

<script>
import SearchHistory from './component/search-history'
import SearchSuggestion from './component/search-suggestion'
import SearchResult from './component/search-result'
import {setItem,getItem} from '@/utils/storage'

export default {
  // 组件名称
  name:"SearchPage",
  // 局部注册的组件
  components: {
      SearchHistory,
      SearchSuggestion,
      SearchResult
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
       searchText:'', // 搜索栏中的数据
       isResultShow:false, //是否有搜索结果
       searchHistories:getItem('TOUTIAO_SEARCH_HISTORIES') || []
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    //   简写
      searchHistories(val){
          // 同步到本地存储
          setItem('TOUTIAO_SEARCH_HISTORIES',val)
      }
    //   完整写法
    //   searchHistories:{
    //       hander(){}
    //   }
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
       onSearch(val) {
           this.searchText=val
           const index=this.searchHistories.indexOf(val)
           if(index!==-1){
               this.searchHistories.splice(index,1)
           }
           this.searchHistories.unshift(val)
           this.isResultShow=true
    },
    onCancel() {
      this.$router.back()
    }
  }
};
</script>

<style scoped lang="less">
.search-container{
    padding-top: 108px;
    .van-search__action{
        color: #fff;
    }
    .search-form{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 1;
    }
}
</style>
