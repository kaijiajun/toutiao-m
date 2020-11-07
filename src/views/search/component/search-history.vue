<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow=true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="oSearchItemClick(item,index)"
    >
      <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>


export default {
  // 组件名称
  name: "SearchHistory",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  // 对于props数据，
         // props是受父组件数据影响的  
         // 如果是基础数据类型（字符串，数字，布尔值），要想修改，必须通过子向父传值；
         // 如果是引用数据类型（对象，数组），可以直接修改。[].push ,不能赋值
         // 总之，props 数据只能在子组件中修改而不能重新赋值！
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  // 组件状态值
  data() {
    return {
      isDeleteShow: false, //控制删除的显示与隐藏
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
      oSearchItemClick(item,index){
          // 如果是删除状态，则执行删除操作
          if(this.isDeleteShow){
             this.searchHistories.splice(index,1)
          }else{
               // 否则执行搜索操作
               this.$emit('search',item)
          }
      }
  },
};
</script>

<style scoped lang="less">
</style>
