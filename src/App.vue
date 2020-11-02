<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view />
    <h1>黑马头条</h1>
    <div>
      <i class="toutiao toutiao-shipin"></i>
    </div>
    <van-button type="primary">主要按钮</van-button>
<van-button type="info">信息按钮</van-button>
<van-button type="default">默认按钮</van-button>
<van-button type="warning">警告按钮</van-button>
<van-button type="danger">危险按钮</van-button>
<div class="box1"></div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less">
.box1{
  width: 200px;
  height: 200px;
  background-color: pink;
}
</style>
