<template>
  <div class="channel-edit">
    <van-cell :boder="false" title="我的频道" class="title-text">
      <van-button
        size="mini"
        round
        type="danger"
        plain
        class="edit-btn"
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? "完成" : "编辑" }}
      </van-button>
    </van-cell>
    <!-- 宫格组件 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fixedChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- v-bind:class 语法
          一个对象：对象中的key表示要作用的css类名
                   对象中的value要计算出布尔值
                   若index===active则动态绑定active类名
                   反之不绑定
       -->
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :boder="false" title="频道推荐" class="title-text"> </van-cell>
    <!-- 宫格组件 -->
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannel"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channels";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";

export default {
  // 组件名称
  name: "",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  // 组件状态值
  data() {
    return {
      allChannels: [], //所有频道
      isEdit: false, //控制编辑状态的显示
      fixedChannels: [0], //固定频道的数组，不允许删除
    };
  },
  // 计算属性
  computed: {
    // 获取user
    ...mapState(["user"]),

    //   计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    // 简化计算属性recommendChannles的计算
    recommendChannel() {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter((channel) => {
        // const channels = []
        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id;
        });
      });
    },
    //   recommendChannel(){
    //       const channels=[]
    //       this.allChannels.forEach(channel=>{
    // find 遍历数组，找到满足条件的元素项
    //           const ret=this.myChannels.find(myChannel=>{
    //               return myChannel.id===channel.id
    //           })
    // 如果我的频道中不包括该频道项，则收集到推荐频道中
    //           if(!ret){
    //               channels.push(channel)
    //           }
    //       })
    // 把计算结果返回
    //       return channels
    //   }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    this.loadAllChannel();
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadAllChannel() {
      try {
        const { data: res } = await getAllChannels();
        console.log(res);
        this.allChannels = res.data.channels;
      } catch (error) {
        this.$toast("获取所有频道失败");
      }
    },

    // 向我的频道添加频道
    async onAddChannel(channel) {
      this.myChannels.push(channel);
      //    数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id, // 频道 id
            seq: this.myChannels.length, // 频道的 序号
          });
          this.$toast("添加频道成功");
        } catch (error) {
          this.$toast("添加频道失败");
        }
      } else {
        // 未登录，把数据存储到本地
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },
    //点击我的频道里的频道
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 1. 如果是固定频道，则不删除
        if (this.fixedChannels.includes(channel.id)) {
          return;
        }
        // 处于编辑状态，点击删除频道
        // 2. 删除频道项
        this.myChannels.splice(index, 1);
        // 3. 如果删除的激活频道之前的频道，则更新激活的频道项
        // 参数1：要删除的元素的开始索引（包括）
        // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
        if (index <= this.active) {
          this.$emit("updata-active", this.active - 1, true);
        }
        //    4.持久化处理
        this.deleteChannel(channel);
      } else {
        // 未编辑状态，点击切换频道
        this.$emit("updata-active", index, false);
      }
    },
    //
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，把数据请求接口放到线上
          await deleteUserChannel(channel.id);
        } else {
          // 未登录，把数据存储到本地
          setItem("TOUTIAO_CHANNELS", this.myChannels);
        }
      } catch (error) {
        this.$toast("操作失败，请稍后重试");
      }
    },
  },
};
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>
