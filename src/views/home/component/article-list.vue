<template>
  <div class="article-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <!-- 下拉刷新 -->
    <van-pull-refresh
      :success-text="refreshSuccessText"
      :success-duration="1500"
      v-model="isRefreshLoading"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
      <article-item
      v-for="(article, index) in list"
          :key="index"
          :article="article"
      />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from '@/components/article-item'

export default {
  // 组件名称
  name: "ArticleList",
  // 局部注册的组件
  components: {
    ArticleItem
  },
  // 组件参数 接收来自父组件的数据
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  // 组件状态值
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      error: false, // 是否加载失败
      isRefreshLoading: false, // 控制下拉刷新的失败状态
      refreshSuccessText: "",
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
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data: res } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        });
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsnajndjsa')
        // }
        //   console.log(res);
        // 2. 把请求结果数据放到 list 数组中
        const { results } = res.data;
        // console.log(results);
        // 通过展开符展开results数组并push到list中
        this.list.push(...results);
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false;
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = res.data.pre_timestamp;
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true;
        }
      } catch (error) {
        this.error = true; // 开启错误提示
        this.loading = false; // 关闭 loading 效果
      }
    },

    //
    async onRefresh () {
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now(), // 时间戳，请求最新的推荐数据传当前的时间戳
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        });
        
        // 模拟随机失败的情况
        // if (Math.random() > 0.9) {
        //   JSON.parse('dsnajndjsa')
        // }

        // 2. 将数据追加到列表的顶部
        const { results } = res.data;
        this.list.unshift(...results);
        // 3. 关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false;
        // 提示成功
        this.refreshSuccessText = `刷新成功，跟新了${results.length}条数据`;
      } catch (error) {
        this.isRefreshLoading = false; // 关闭下拉刷新的 loading 状态
        this.refreshSuccessText = "刷新失败";
      }
    },
    //     onLoad() {
    //       // 1. 请求获取数据
    //       // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //       setTimeout(() => {
    //           // 2. 把请求结果数据放到 list 数组中
    //         for (let i = 0; i < 10; i++) {
    //           this.list.push(this.list.length + 1);
    //         }

    //         // 3. 本次数据加载结束之后要把加载状态设置为结束
    //         //     loading 关闭以后才能触发下一次的加载更多
    //         this.loading = false;

    //        // 4. 判断数据是否全部加载完成
    //         if (this.list.length >= 40) {
    //             // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
    //           this.finished = true;
    //         }
    //       }, 1000);
    //     },
  },
};
</script>

<style scoped lang="less">
.article-list{
  // vh视口单位1vw=浏览器窗口可视区域宽的百分之一
  //          1vh=浏览器窗口可视区域高的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
