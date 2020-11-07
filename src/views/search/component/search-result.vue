<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
       error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(article,index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import {getSearch} from '@/api/search'

export default {
  // 组件名称
  name: "SearchResult",
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
      list: [],
      loading: false,
      finished: false,
      page:1,
      perPage:20,
      error:false //控制错误信息是否显示
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
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
    async onLoad() {
      // 异步更新数据
     try {
          // 1, 请求获取数据
          const {data:res}=await getSearch({
              page:this.page, // 页码值
              per_page:this.perPage, // 每页请求多少条数据
              q:this.searchText //搜索关键字
          })
           // 2，将数据添加到数组列表
          const {results}=res.data
          this.list.push(...results)
          // 3，将本地加载的 loading 关闭
          this.loading=false
           // 4，判断是否还有数据
           if(results.length){
             // 4.1，如果有，则更新下一页数据的页码   
            this.page++
           }else{
            // 4.2，如果没有，则将 finished 设为结束
            this.finished=true
           }
     } catch (error) {
         // 展示加载失败的提示状态
          this.error = true;
         // 既然失败了，就停掉loading，这样失败的文本才会显示
         this.loading=false
        }
    },
  },
};
</script>

<style scoped lang="less">
</style>
