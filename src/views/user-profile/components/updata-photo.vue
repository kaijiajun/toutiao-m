<template>
  <div class="updata-photo">
    <img class="img" :src="img" ref="img" />
    <div class="toolbar">
      <span @click="$emit('close')">取消</span>
      <span @click="onConfirm">完成</span>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import {updataUserPhoto} from '@/api/user.js'

export default {
  // 组件名称
  name: "UpdataPhoto",
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  // 组件状态值
  data() {
    return {
      cropper:null
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
  mounted() { //该钩子函数在DOM元素都加载完毕才执行
    // 因为要获取DOM元素进行剪裁，所以要写在mounted中   
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
     viewMode: 1,  // 只能在裁剪的图片范围内移动
     dragMode: 'move',   // 画布和图片都可以移动
     aspectRatio: 1,  // 裁剪区默认正方形
     autoCropArea: 1,   // 自动调整裁剪图片
     cropBoxMovable: false,  // 禁止裁剪区移动
     cropBoxResizable: false,  // 禁止裁剪区缩放
     background: false,  // 关闭默认背景
    //  movable:  true
    })
  },
  // 组件方法
  methods: {
    onConfirm(){
      // 基于服务端的剪裁使用getData方法获取剪裁参数
      // console.log(this.cropper.getData());
      // 纯客户端的剪裁使用 获取剪裁的文件参数
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob);
        this.updataUserAvatar(blob)
      })
    },
    async updataUserAvatar(blob){
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0,
      })
      try {
        // 错误写法
        // 如果接口要求Content-Type	是 application/json，则传递普通的javascript对象
        // updataUserPhoto(){photo:blob}
        // 如果接口要求Content-Type 是	multipart/form-data，则必须传递formData对象
        const formData = new FormData();

       formData.append('photo', blob)

       const {data:res}=await updataUserPhoto(formData)
       console.log(res);
       //  关闭弹出层
       this.$emit('close')
       // 更新视图
       this.$emit('updata-photo',res.data.photo)
       this.$toast('更新头像成功')
       } catch (error) {
         console.log(error)
         this.$toast('更新失败')
       }
    }
  },
};
</script>

<style scoped lang="less">
.updata-photo {
  background-color: #000;
  height: 100%;
  .img {
    display: block;
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 30px;
    padding: 0 20px;
    color: #fff;
  }
}
</style>
