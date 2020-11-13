<template>
  <div class="post-comment">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
      ref="commentField"
    />
    <van-button class="post-btn" size="small" @click="onPost" :disabled="!message.length">发布</van-button>
  </div>
</template>

<script>
import { addComment } from "@/api/comment";

export default {
  // 组件名称
  name: "CommentPost",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据

  // 子组件接受父组件提供的属性，这种接收不论父子组件嵌套层级多深，都可以拿到数据。
// 比起属性绑定一层一层往下传看起来更具有灵活性。
// 但是该技巧不要滥用，它会使重构变得更加困难，同时所提供的 property 是非响应式的。
// inject: ['articleId'],
  inject:{
    articleId:{
      type:[Number, String, Object],
      default:null
    },
  },

  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
  },
  // 组件状态值
  data() {
    return {
      message: "", //发布评论的内容
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
  mounted() {
    this.$refs.commentField.focus()
  },
  // 组件方法
  methods: {
    async onPost () {
      //在组件中必须通过this.$toast去调用Toast组件
      this.$toast.loading({
        message: "发布中...", // 提示消息
        forbidClick: true, // 是否禁止背景点击（forbid：禁止）
        duration: 0, // 持续时间，默认时间2s，0表示持续展示不停止，直到成功或失败
      })
      try {
        const { data: res } = await addComment({
          target: this.target, //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, //评论内容
          art_id: this.articleId, //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        });
        console.log(res);
        //   关闭弹层
        // 将发布内容展示到列表顶部
        // 清空输入框
        this.message = "";
        this.$emit("post-comment", res.data);
        this.$toast.success("发布成功");
      } catch (error) {
        this.$toast.fail("发布失败");
      }
    },
  },
};
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  align-items: center;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
