<template>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  :immediate-check='false'
  :error.sync='error'
  error-text="请求失败，点击重新加载"
  @load="onLoad"
>
  <comment-item 
  v-for="(item,index) in list" 
  :key="index"
  :comment='item'
  @reply-click="$emit('reply-click',$event)"
  />
</van-list>
</template>

<script>
import {getCommentList} from '@/api/comment'
import CommentItem from '../comment-item'

export default {
  // 组件名称
  name:"CommentList",
  // 局部注册的组件
  components: {
      CommentItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
      source:{
          type:[Number ,String ,Object],
          required:true
      },
      list:{
        type:Array,
        // 父组件如果用到list就传过来，若用不到则使用默认值[]空数组
        // 不会影响父组件的使用
        default:()=>[]
      },
      type:{
        type:String,
         // 自定义 prop 数据验证
        validator(value){
          return ['a','c'].includes(value)
        },
        // 默认值
        default:'a'
      }
  },
  // 组件状态值
  data() {
    return {
        // list: [],
        loading: false,
        finished: false,
        offset:null, // 请求下一页数据的页码(标志)
        limit:10, // 总数据条数
        error:false
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
  created() {
    // 页面一加载就获取评论数量
    // 之前 onLoad 事件都是被List触发时，会自动将 loading 重置为 true
    // 当手动调用 onLoad 时，需要手动将 loading 重置为 true
    this.loading=true
    this.onLoad()
  },
  /**
  * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
  */
  mounted() {},
  // 组件方法
  methods: {
      async onLoad() {
      // 获取文章的评论和获取评论的回复是同一个接口
      // 唯一的区别是接口参数不一样
      // type
      //   a 文章的评论
      //   c 评论的回复
      // source
      //   文章的评论，则传递文章的id
      //   评论的回复，则传递评论的id
       try {
           // 1. 请求获取数据
        const {data:res}=await getCommentList({
            type:this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
            source:this.source, //源id，文章id或评论id
            offset:this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
            limit:this.limit //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量  每页大小
        })
       // 2. 将数据添加到列表中
       console.log(res);
       const {results}=res.data
       this.$emit('onload-success',res.data)
       this.list.push(...results)
       // 3. 将加载更多的 loading 设置为 false
       this.loading=false
       // 4. 判断是否还有数据
       if(results.length){
           //还有数据 则更新获取下一页数据的页码
           this.offset=res.data.last_id
       }else{
           // 没有数据了，关闭加载更多
           this.finished=true
       }
       } catch (error) {
           this.error=true
           this.loading=false
       }
    },
  }
};
</script>

<style scoped lang="less">

</style>
