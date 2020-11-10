<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="isLoading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!--  模板中的 $event 是事件参数
          子组件传过来谁 $event 就接收到谁
          当我们传递给子组件的数据既要使用还要修改
          传递：props
            :is_followed='article.is_followed'
            修改：自定义事件
            @updata-is_followed="article.is_followed = $event"
          简写方式：在组件上使用v-model
          :value="article.is_followed"
          @input="article.is_followed = $event"

          如果需要修改v-model的规则名称，可以通过子组件的model属性修改

          一个组件上只能使用一次v-model，
          如果有多个数据需要实现类似于v-model的效果，咋办？
          可以使用属性的.sync修饰符
           -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
          <!-- <van-button
            v-if="article.is_followed" 
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFollow"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表区域 -->
        <comment-list
        :source='article.art_id'
        :list='commentList'
        @onload-success='totalCommentCount=$event.total_count'
        @reply-click="onReplyClick"
        />

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button 
          class="comment-btn" 
          type="default" 
          round 
          size="small"
          @click="isPostShow=true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <collect-article 
          class="btn-item" 
          v-model="article.is_collected" 
          :article-id='article.art_id'
          />
          <like-article
          class="btn-item"
          v-model="article.attitude"
          :article-id='article.art_id'
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论弹出层 -->
        <van-popup 
        v-model="isPostShow" 
        position="bottom"
         >
         <comment-post
         :target="article.art_id"
         @post-comment='onPostSuccess'
         />
         </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticle" class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

<!-- 评论回复 -->
    <van-popup 
        v-model="isReplyShow" 
        position="bottom"
        style="height:100%;"
         >
         <!-- v-if条件渲染
              true渲染元素节点
              false不渲染
          -->
         <comment-reply
         v-if="isReplyShow"
         :comment="currentComment"
         @close="isReplyShow=false"
         />
         </van-popup>

    <!-- 
        图片预览区域
     -->
  </div>
</template>

<script>
import { getArticleById } from "@/api/article.js";
import { ImagePreview } from "vant";
import FollowUser from "@/components/follow-user";
import CollectArticle from "@/components/collect-article";
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/commrnt-reply'

// ImagePreview({
//   images: [
//     'https://img.yzcdn.cn/vant/apple-1.jpg',
//     'https://img.yzcdn.cn/vant/apple-2.jpg',
//   ],
//   // 预览图片的起始位置
//   startPosition: 1,
// // 点击关闭
//   onClose() {
//     console.log(onClose);
//   },
// });

export default {
  // 组件名称
  name: "ArticlePage",
  // 局部注册的组件
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },

  // 给所有的后代组件提供数据
// 然后在任何后代组件里，我们都可以使用 inject 选项
// 来接收指定的我们想要添加在这个实例上的属性
  provide:function(){
    return {
       articleId:this.articleId
    }
  },
  // 组件参数 接收来自父组件的数据
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  // 组件状态值
  data() {
    return {
      article: {}, //文章详情
      isLoading: true, // 文章加载状态
      errStatus: 0, // 请求异常状态
      // followLoading:false //控制关注按钮loading的显示与隐藏
      totalCommentCount:0, //评论总数
      isPostShow:false, //控制发布评论弹出层的显示与隐藏
      commentList:[],  //
      isReplyShow:false, //控制回复弹窗的显示与隐藏
      currentComment:{} //点击的当前评论对象
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
    this.loadArticle();
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadArticle() {
      this.isLoading = true;
      try {
        const { data: res } = await getArticleById(this.articleId);
        //   console.log(res);
        this.article = res.data;
        // 随机错误
        // if (Math.random() > 0.5) {
        //     return JSON.parse('error')
        // }

        // 初始化图片点击预览
        // 注意：数据更新后并不会同步更新页面，所以想要获取数据更新后的页面
        setTimeout(() => {
          this.previewImage();
        }, 0);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404;
        }
        //   this.$toast('获取失败')
      }
      // 请求成功,关闭加载中
      this.isLoading = false;
    },

    previewImage() {
      //   得到所有的img节点
      const articleContent = this.$refs["article-content"];
      const imgs = articleContent.querySelectorAll("img");
      console.log(imgs);

      // 获取所有img地址
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);
        // 给每个img注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            images,
            // 预览图片的起始位置,从0开始
            startPosition: index,
          })
        }
      })
    },
    
    onPostSuccess(data){
      //   关闭弹层
      this.isPostShow=false
      // 将发布内容展示到列表顶部
      this.commentList.unshift(data.new_obj)
      this.totalCommentCount++
    },

    onReplyClick(comment){
      // console.log(comment);
      this.currentComment=comment
      // 显示评论回复弹出层
      this.isReplyShow=true
    }
  },
};
</script>

<style scoped lang="less">
// 导入文章正文的样式文件
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
