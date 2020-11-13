<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    />
    <input 
    type="file" 
    hidden 
    ref="file"
    @change="onFileChange"
    />
    <!-- 具体内容 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell 
    title="昵称" 
    :value="user.name" 
    is-link
    @click="isUpdataNameShow=true" 
    />
    <van-cell 
    title="性别" 
    :value="user.gender===0?'男':'女'" 
    is-link 
    @click="isUpdataGenderShow=true"
    />
    <van-cell 
    title="生日" 
    :value="user.birthday" 
    is-link 
    @click="isUpdataBirthdayShow=true"
    />
    <!-- 编辑昵称弹出层 -->
    <van-popup 
    v-model="isUpdataNameShow" 
    position="bottom"
    style="height:100%"
    >
      <updata-name 
      v-if="isUpdataNameShow"
      @close="isUpdataNameShow=false"
      v-model="user.name"
      />
    </van-popup>
    <!-- 编辑性别弹出层 -->
    <van-popup 
    v-model="isUpdataGenderShow" 
    position="bottom"
    >
    <updata-gender 
    v-if="isUpdataGenderShow"
    v-model="user.gender"
    @close="isUpdataGenderShow=false"
    />
    </van-popup>
    <!-- 编辑生日弹出层 -->
    <van-popup 
    v-model="isUpdataBirthdayShow" 
    position="bottom"
    >
    <updata-birthday 
    v-if="isUpdataBirthdayShow"
    v-model="user.birthday"
    @close="isUpdataBirthdayShow=false"
    />
    </van-popup>
    <!-- 修改头像弹出层 -->
    <van-popup 
    v-if="isUpdataPhotoShow"
    v-model="isUpdataPhotoShow" 
    position="bottom"
    style="height:100%"
    >
    <updata-photo 
    :img="img"
    @close="isUpdataPhotoShow=false"
    @updata-photo="user.photo=$event"
    />
    </van-popup>
  </div>
</template>

<script>
import {getUserProfile} from '@/api/user'
import UpdataName from './components/updata-name'
import UpdataGender from './components/updata-gender'
import UpdataBirthday from './components/updata-birthday'
import UpdataPhoto from './components/updata-photo'

export default {
  // 组件名称
  name: "UserProfile",
  // 局部注册的组件
  components: {
      UpdataName,
      UpdataGender,
      UpdataBirthday,
      UpdataPhoto
  },
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
        user:{}, //存放用户信息的对象
        isUpdataNameShow:false,
        isUpdataGenderShow:false,
        isUpdataBirthdayShow:false,
        isUpdataPhotoShow:false,
        img:null  //预览的图片
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
  created() {
      this.loadUserProfile()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
      async loadUserProfile(){
          try {
              const {data:res}=await getUserProfile()
            //   console.log(res);
              this.user=res.data
          } catch (error) {
              this.$toast('获取信息失败')
          }
      },

      onFileChange(){
        //   获取文件对象
        const file=this.$refs.file.files[0]
        // 基于文件对象获取blov数据
        this.img=window.URL.createObjectURL(file)
        // console.log(data);
        this.isUpdataPhotoShow=true
        // file-input 如果选了同一个文件不会触发change事件
        // 解决办法：每次使用完毕，把他的value值清空
        this.$refs.file.value=''
      }
  },
};
</script>

<style scoped lang="less">
.user-profile{
    .avatar{
        width: 60px;
        height: 60px;
    }
    .van-popup {
  background: #f5f7f9;
}
}
</style>
