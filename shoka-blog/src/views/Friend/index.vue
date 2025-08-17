<template>
  <div class="page-header">
    <h1 class="page-title">追番列表</h1>
    <img class="page-cover" src="https://hmleadnewsyouzi.oss-cn-beijing.aliyuncs.com/background/gbcninaaa.jpg" alt="" />
    <!-- 波浪 -->
<!--    <Waves></Waves>-->
  </div>
  <div class="bg">
    <div class="page-container" style="width: 90%">
      <h2>
        <svg-icon class="flower" icon-class="flower" size="1.25rem" color="pink"></svg-icon>
        番剧列表！
      </h2>
      <div class="friends">
        <div class="friend-item" v-animate="['slideUpBigIn']" v-for="friend in friendList" :key="friend.id">
          <a target="_blank" :href="friend.url">
            <img class="image" v-lazy="friend.avatar" />
          </a>
          <div class="info">
            <a class="name" target="_blank" :href="friend.url" :style="{ color: friend.color }">{{
                friend.name
              }}</a>
            <p class="desc">{{ friend.introduction }}</p>
          </div>
        </div>
      </div>
      <CommentList :comment-type="commentType"></CommentList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFriendList } from "@/api/friend";
import { Friend } from "@/api/friend/types";
import { useBlogStore } from "@/store";
const blog = useBlogStore();
const commentType = ref(2);
const friendList = ref<Friend[]>([]);
onMounted(() => {
  getFriendList().then(({ data }) => {
    friendList.value = data.data;
  });
});
</script>

<style lang="scss" scoped>
.block {
  line-height: 2;
  margin: 0 1.5rem;
  font-size: 15px;
  border-left: 0.2rem solid var(--color-purple);
  padding: 0.625rem 1rem;
  color: var(--grey-5);
  background: var(--color-pink-light);
  border-radius: 4px;
  word-wrap: break-word;
}

.welcome {
  position: relative;
  margin: 0 2.5rem 0.5rem;

  &::before {
    content: "";
    position: absolute;
    width: 0.4em;
    height: 0.4em;
    background: var(--primary-color);
    border-radius: 50%;
    top: 0.85em;
    left: -1em;
  }
}

.friends {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	font-size: 1.2rem;
	width: 100%;
}

.friend-item {
	
	display: flex;
	flex: 1 0 calc(33.333% - 2rem); // 使用 flex 属性，并设置基础宽度为父容器的三分之一减去一些间距
	margin: 1rem;
	line-height: 2;
	box-shadow: 0 0.625rem 1.875rem -0.9375rem var(--box-bg-shadow);
	transition: all 0.2s ease-in-out 0s;
	animation-duration: 0.5s;
	visibility: hidden;
	overflow: hidden;
	

	&:hover {
		box-shadow: 0 0 2rem var(--box-bg-shadow);
	}

	.image {
		display: block;
		width: 15rem;
		height: auto;
		border-radius: 3%;
	}

	.info {
		padding-left: 1rem;
		width: 9rem;
		height: 21rem;
		
	}

	.name {
    font-weight: 700;
    font-size: 1rem;
  }

  .desc {
    font-size: 0.75em;
    margin: 1rem 0;
    white-space: pre-wrap;
  }
}

.flower {
  animation: rotate 6s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
	.friend-item {
        flex: 1 0 calc(100% - 2rem);
	}
}
</style>
