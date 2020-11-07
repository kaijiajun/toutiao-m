<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        class="search-btn"
        type="info"
        size="mini"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 滑动导航 -->
    <!--
	使用的组件属性说明:
    通过v-model绑定当前激活标签对应的索引值，默认情况下启用第一个标签
    通过animated属性可以开启切换标签内容时的转场动画
    通过swipeable属性可以开启滑动切换标签页
-->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 频道的文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <!-- 为hamburger-btn占位 -->
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <!-- 传递channels 传递active高亮索引 定义update-active事件-->
      <channel-edit
        :my-channels="channels"
        :active="active"
        @updata-active="onUpdataActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getChannels } from "@/api/user";
// 导入文章列表组件
import ArticleList from "./component/article-list";
import ChannelEdit from "./component/channel-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";

export default {
  // 组件名称
  name: "HomePage",
  // 局部注册的组件
  components: {
    ArticleList,
    ChannelEdit,
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      // 借助这个变量 来 标识当前所选中的频道
      active: 0,
      //定义数据接收频道列表
      channels: [],
      // 请求下一页数据的时间戳
      timestamp: null,
      // 控制频道弹出层的显示与隐藏
      isChannelEditShow: false,
    };
  },
  // 计算属性
  computed: {
    ...mapState(["user"]),
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    //  调用获取频道列表
    this.loadChannel();
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    // 获取频道列表
    async loadChannel() {
      try {
        let channels = [];
        if (this.user) {
          // 登录状态，请求获取线上的频道数据
          const { data: res } = await getChannels();
          channels = res.data.channels;
        } else {
          // 未登录
          const localChannels = getItem("TOUTIAO_CHANNELS");
          if (localChannels) {
            // 有本地频道数据，则使用
            channels = localChannels;
          } else {
            // 没有本地频道数据，则请求获取默认推荐的频道列表
            const { data: res } = await getChannels();
            channels = res.data.channels;
          }
        }
        // 将数据更新到组件中
        this.channels = channels;
        // console.log(this.channels);
      } catch (error) {
        this.$toast("获取频道列表失败");
      }
    },

    onUpdataActive(index, isChannelEditShow = true) {
      // 修改active的值
      this.active = index;
      //  关闭编辑频道的弹窗
      this.isChannelEditShow = isChannelEditShow;
    },
  },
};
</script>

<style scoped lang="less">
.home-container {
  /*添加上padding 撑开高度*/
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  //  /deep/深度操作符
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      height: 82px;
      z-index: 1;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777;
      }
      .van-tab--active {
        color: #333;
      }
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    border: 0;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 58px;
      background: url("~@/assets/gradient-gray-line.png");
      background-size: contain;
    }
  }
}
</style>
