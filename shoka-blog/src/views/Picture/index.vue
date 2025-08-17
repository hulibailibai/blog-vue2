<template>
  <!-- 新增的响应式模块 -->
  <section class="responsive-module">
    <h2 class="module-title">某科学的神奇网站</h2>
    <div class="card-container">
      <div class="card" v-for="(item, index) in items" :key="index">
        <a :href="item.link" target="_blank" rel="noopener noreferrer">
          <img class="img" :src="item.image" alt="图片描述" />
          <div class="card-content">
            <p>{{ item.description }}</p>
          </div>
        </a>
      </div>
    </div>
    
    <!-- 第一个 Sakana Widget -->
    <div class="sakana-container sakana-left">
      <div ref="sakanaContainer1" class="sakana-widget"></div>
    </div>
    
    <!-- 第二个 Sakana Widget -->
    <div class="sakana-container sakana-right">
      <div ref="sakanaContainer2" class="sakana-widget"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { biliUpload } from "@/api/user";
import { useClipboard } from "@vueuse/core";
import { FormInst, UploadFileInfo } from "naive-ui";
import SakanaWidget from 'sakana-widget';
import 'sakana-widget/lib/index.css';

// 表单相关的逻辑
const form = reactive({
  csrf: "",
  data: "",
});

const loading = ref(false);
const formInstRef = ref<FormInst | null>(null);
const rules = {
  data: {
    required: true,
    message: "SESSDATA不能为空",
  },
  csrf: {
    required: true,
    message: "bili_jct不能为空",
  },
};

const imgList = reactive<string[]>([]);
const { copy } = useClipboard();

const handleCopy = (text: string) => {
  copy(text);
  window.$message?.success("复制成功");
};

const handleSave = () => {
  formInstRef.value?.validate((errors) => {
    if (!errors) {
      localStorage.setItem("SESSDATA", form.data);
      localStorage.setItem("csrf", form.csrf);
      window.$message?.success("保存成功");
    }
  });
};

const changeFile = (options: { file: UploadFileInfo }) => {
  formInstRef.value?.validate((errors) => {
    if (!errors) {
      let formData = new FormData();
      formData.append("file_up", options.file.file as File);
      formData.append("csrf", form.csrf);
      formData.append("data", form.data);
      loading.value = true;
      biliUpload(formData).then(({ data }) => {
        if (data.flag) {
          imgList.push(data.data);
          loading.value = false;
        }
      });
    }
  });
};

// 定义两个 ref 用于挂载 Sakana Widget
const sakanaContainer1 = ref<HTMLElement | null>(null);
const sakanaContainer2 = ref<HTMLElement | null>(null);

onMounted(() => {
  form.data = localStorage.getItem("SESSDATA") as string;
  form.csrf = localStorage.getItem("csrf") as string;
  
  // 初始化第一个 Sakana Widget (Takina)
  if (sakanaContainer1.value) {
    try {
      new SakanaWidget({
        character: 'takina',
        autoFit: true,
        initialState: {
          i: 0.02,
          d: 0.95
        }
      }).mount(sakanaContainer1.value);
    } catch (error) {
      console.error('第一个 Sakana Widget 初始化失败:', error);
    }
  }
  
  // 初始化第二个 Sakana Widget (Chisato)
  if (sakanaContainer2.value) {
    try {
      new SakanaWidget({
        character: 'chisato',
        autoFit: true,
        initialState: {
          i: 0.03,  // 不同的惯性值
          d: 0.97   // 不同的阻尼值
        }
      }).mount(sakanaContainer2.value);
    } catch (error) {
      console.error('第二个 Sakana Widget 初始化失败:', error);
    }
  }
});

// 新增的响应式模块数据
const items = ref([
  {
    image: "https://cryq-1329307853.cos.ap-guangzhou.myqcloud.com/8a970c3ff4220ce7004876d61f3e9a6.png",
    description: "小   学   搜   题   酱",
    link: "http://cuo.akiyamamio.fun",
  },
  {
    image: "https://cryq-1329307853.cos.ap-guangzhou.myqcloud.com/76292a4d00404315083a2851934849e.png",
    description: "来视奸莱弗里安",
    link: "http://shijian.akiyamamio.fun", 
  },
  {
    image: "https://cryq-1329307853.cos.ap-guangzhou.myqcloud.com/%E4%BA%9A%E6%89%98%E8%8E%89.png",
    description: "亚托莉小游戏",
    link: "http://atir.akiyamamio.fun/",
  },
]);
</script>

<style lang="scss" scoped>
.page-header {
  text-align: center;
}

.responsive-module {
  padding: 1rem;
  background-color: #f9f9f9;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative; /* 为绝对定位的子元素提供参考 */

  .module-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(33% - 1rem);
    margin: 0.5rem;
    border-radius: 8px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
    background: white;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
    }

    .img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-bottom: 1px solid #eee;
    }

    .card-content {
      padding: 1rem;
      text-align: center;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      
      p {
        margin: 0;
        font-size: 1.1rem;
        color: #333;
        font-weight: 500;
      }
    }
  }

  @media (max-width: 900px) {
    .card {
      width: calc(50% - 1rem);
    }
  }

  @media (max-width: 600px) {
    .card {
      width: calc(100% - 1rem);
    }
  }
  
  /* 两个 Sakana Widget 的样式 */
  .sakana-container {
      position: absolute; /* 改为 absolute */
      width: 150px;
      height: 150px;
      z-index: 1000;
      bottom: 20px;
    
    /* 确保容器是 BFC */
    position: relative;
    
    .sakana-widget {
      width: 100%;
      height: 100%;
    }
    
    /* 第一个 Widget 放在左上角 */
    &.sakana-left {
      bottom: 0%;
      left: 200px;
    }
    
    /* 第二个 Widget 放在右上角 */
    &.sakana-right {
      top: 20px;
      right: 200px;
    }
  }
  
  @media (max-width: 768px) {
    .sakana-container {
      width: 120px;
      height: 120px;
      
      &.sakana-left {
        left: 10px;
      }
      
      &.sakana-right {
        right: 10px;
      }
    }
  }
}
</style>