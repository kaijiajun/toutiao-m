<template>
  <div class="comment-reply">
    <!-- 导航头 -->
    <van-nav-bar :title="comment.reply_count>0?`${comment.reply_count}条回复`:'暂无回复'">
      <van-icon name="cross" slot="left" @click="$emit('close')"/>
    </van-nav-bar>
    <div class="scroll-warp">
        <!-- 展示当前评论 -->
    <comment-item :comment='comment'/>

    <!-- 全部的回复列表 -->
    <van-cell title="全部回复"/>

    <!-- 回复列表 -->
    <comment-list 
    :source="comment.com_id"
    :list="commentList"
    type="c"
    />
    </div>
    <!-- 发布评论按钮 -->
    <div class="post-warp">
        <van-button class="post-btn" size="small" round @click="isPostShow=true">写评论</van-button>
    </div>
    <!-- 写评论并发布 弹出层-->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        :target="comment.com_id"
        @post-comment="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from '../comment-item/index'
import CommentList from '../comment-list/index'
import CommentPost from '../comment-post/index'

export default {
  // 组件名称
  name: "CommentReply",
  // 局部注册的组件
  components: {
      CommentItem,
      CommentList,
      CommentPost
  },
  // 组件参数 接收来自父组件的数据
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  // 组件状态值
  data() {
    return {
        isPostShow:false, //控制发布评论的弹出层的显示与隐藏
        commentList:[] //评论的回复列表
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
      onPostSuccess(data){
          console.log(data);
        //更新回复的数量
          this.comment.reply_count++
        // 关闭弹层
          this.isPostShow=false
           // 将最新回复的内容展示到列表的顶部
          this.commentList.unshift(data.new_obj)
      }
  },
};
</script>

<style scoped lang="less">
.scroll-warp{
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
}
.post-warp{
    height: 88px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn{
        width: 60%;
    }
}
</style>
