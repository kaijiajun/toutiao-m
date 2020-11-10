<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title" class="title-wrap">
      <div class="user-name">{{comment.aut_name}}</div>
      <van-button
        class="like-btn"
        :class="{
           liked:comment.is_liking
        }"
        :icon="comment.is_liking?'good-job':'good-job-o'"
        :loading="commentLoading"
        @click="onCommentLike"
      >{{comment.like_count || '赞'}}</van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{comment.pubdate | relativeTime}}</span>
        <van-button
          class="reply-btn"
          round
          @click="$emit('reply-click',comment)"
        >回复 {{comment.reply_count}}</van-button>
      </div>
    </div>
  </van-cell>
</template>
<script>
import {addCommentLike,deleteCommentLike} from '@/api/comment'

export default {
  // 组件名称
  name:"CommentItem",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
      comment:{
          type:Object,
          required:true
      }
  },
  // 组件状态值
  data() {
    return {
       commentLoading:false
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
      async onCommentLike(){
          this.commentLoading=true
          try {
              if(this.comment.is_liking){
                //   已点赞，取消点赞
                const {data}=await deleteCommentLike(this.comment.com_id)
                console.log(data);
                this.comment.like_count--
              }else{
                //   未点赞，点击点赞
                const {data}=await addCommentLike(this.comment.com_id)
                console.log(data);
                this.comment.like_count++
              }
              this.comment.is_liking=!this.comment.is_liking
          } catch (error) {
              this.$toast('操作失败，请稍后重试')
          }
          this.commentLoading=false
      }
  }
};
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked{
        color: #e5645f;
    }
  }
}
</style>
