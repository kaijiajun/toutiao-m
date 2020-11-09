<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";

export default {
  // 组件名称
  name: "FollowUser",
  // 局部注册的组件
  components: {},
//   自定义 v-model 的数据名称
model:{
   prop:'isFollowed', //默认是value
   event:'updata-is_followed' //默认是input
},
  // 组件参数 接收来自父组件的数据
  props: {
      isFollowed:{
          type:Boolean,
          required:true
      },
      userId: {
          type: [String, Number, Object],
          required: true
      }
  },
  // 组件状态值
  data() {
    return {
        loading:false
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
    // 点击关注或取消关注用户
    async onFollow() {
      this.loading = true; //展示关注按钮的loading状态
      console.log(this.userId);
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId);
          // this.article.is_followed=false
        } else {
          // 未关注，添加关注
          await addFollow(this.userId);
          // this.article.is_followed=true
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed;
        this.$emit('updata-is_followed',!this.isFollowed)
      } catch (error) {
        let message = "操作失败，请重试";
        if (error.response && error.response.status === 400) {
          message = "你不能关注你自己";
        }
        this.$toast(message);
      }
      this.loading = false; //关闭关注按钮的loading状态
    },
  },
};
</script>

<style scoped lang="less">
</style>
