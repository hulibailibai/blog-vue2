<template>
  <div>
    <button class="chat-btn" @click="toggleChat">
      {{ isChatOpen ? '.' : '.' }}
    </button>

    <div v-if="isChatOpen" class="chat-container">
      <div class="chat-header">
        <h3>经贸校园地图总览</h3>
      </div>
      <div class="chat-content">
        <label>
          <input type="checkbox" v-model="mapSetting.enableScrollWheelZoom" />
          鼠标缩放
        </label>
        <label>
          <input type="checkbox" v-model="mapSetting.enableDragging" />
          拖拽
        </label>
        <br />
        <label>
          <input type="checkbox" v-model="mapSetting.enableInertialDragging" />
          惯性拖拽
        </label>
        <label>
          <input type="checkbox" v-model="mapSetting.enablePinchToZoom" />
          双指缩放地图
        </label>
        <br />
        <label>
          <input type="checkbox" v-model="mapSetting.enableKeyboard" />
          键盘操作
        </label>
        <label>
          <input type="checkbox" v-model="mapSetting.enableContinuousZoom" />
          双击平滑缩放效果
        </label>
        <br />
				显示区域:
  <select class="mySelect" name="" id="" v-model="showRegion">
    <option value="inside">局部显示</option>
  </select>
        <br />
        <br />
        地图类型：
        <select class="mySelect" v-model="type">
          <option value="BMAP_NORMAL_MAP">常规地图</option>
          <option value="BMAP_EARTH_MAP">地球模式</option>
          <option value="BMAP_SATELLITE_MAP">卫星图</option>
        </select>
      </div>
      <BMap
        v-bind="$attrs"
        enableScrollWheelZoom
        :heading="64.5"
        :center="{ lng: 118.547425, lat: 24.910726 }"
        :zoom="19"
        :minZoom="3"
				@initd="handleInitd"
        :mapType="type"
        :enableDragging="mapSetting.enableDragging"
        :enableInertialDragging="mapSetting.enableInertialDragging"
        :enableScrollWheelZoom="mapSetting.enableScrollWheelZoom"
        :enableContinuousZoom="mapSetting.enableContinuousZoom"
        :enableDoubleClickZoom="mapSetting.enableDoubleClickZoom"
        :enableKeyboard="mapSetting.enableKeyboard"
        :enablePinchToZoom="mapSetting.enablePinchToZoom"
        :enableTraffic="mapSetting.enableTraffic"
        ak="EhexYtbvRgMfTELo576xgYLrENX3qwnr"
        :plugins="['TrackAnimation']"
				>
				<BMarker :position="center"></BMarker>
				<BMapMask :path="path" :show-region="showRegion" isPoiMask isBuildingMask isMapMask></BMapMask>
				<BLocation />
				<BNavigation3d />
				<BPanoramaControl />
                <BPanoramaCoverageLayer />
                <BScale />
		</BMap>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { shallowRef, triggerRef } from 'vue'
import { MapType, MapProps } from 'vue3-baidu-map-gl'
import { BMap } from 'vue3-baidu-map-gl'
import { BMarker, BMapMask, Point, type MapMaskShowRegion } from 'vue3-baidu-map-gl'
import { BLocation } from 'vue3-baidu-map-gl'
import { BNavigation3d } from 'vue3-baidu-map-gl'
import { BPanoramaControl } from 'vue3-baidu-map-gl'


const path = shallowRef<Point[]>([])
  const center = ref<BMapGL.Point>()
  const showRegion = ref<MapMaskShowRegion>('inside')
  function handleInitd() {
    path.value = [
		new BMapGL.Point(118.545727,24.912614),
      new BMapGL.Point(118.545116,24.911328),
      new BMapGL.Point(118.544739,24.910419),
      new BMapGL.Point(118.544146,24.909108),
      new BMapGL.Point(118.545367,24.909075),
      new BMapGL.Point(118.547272,24.909075),
      new BMapGL.Point(118.548053,24.909042),
      new BMapGL.Point(118.54826,24.909108),
      new BMapGL.Point(118.548794,24.91055),
      new BMapGL.Point(118.549378,24.912262),
			new BMapGL.Point(118.548161,24.91252),
			new BMapGL.Point(118.547056,24.912725),
			new BMapGL.Point(118.545745,24.912848),
    ]
    triggerRef(path)
  }

const type = ref<MapType>('BMAP_NORMAL_MAP')
const mapSetting = ref<MapProps>({
  enableDragging: true,
  enableInertialDragging: true,
  enableScrollWheelZoom: false,
  enableContinuousZoom: true,
  enableResizeOnCenter: true,
  enableDoubleClickZoom: false,
  enableKeyboard: true,
  enablePinchToZoom: true,
  enableAutoResize: true,
  enableTraffic: false
})

const isChatOpen = ref(false) // 控制聊天窗口的显示状态

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value // 切换聊天窗口的显示状态
}
</script>

<style scoped>
.chat-container {
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  font-size: 14px;
  background: #ffffff; /* 使用白色背景 */
  border-radius: 1rem;
  animation: fadeIn 0.5s ease-in-out; /* 添加淡入效果 */
  animation-fill-mode: both;
  z-index: 12000000;
  padding: 20px;
  width: 400px; /* 设置宽度 */
  height: 500px; /* 设置高度 */
  position: fixed;
  bottom: 100px;
  left: 20px;
  overflow-y: auto; /* 允许垂直滚动 */
  width: 80%; /* 使用百分比设置宽度 */
  max-width: 400px; /* 设置最大宽度 */
  height: auto; /* 高度自适应 */
  max-height: 80vh; /* 最大高度为视口高度的80% */
  overflow-y: auto; /* 允许垂直滚动 */

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0; /* 分隔线 */
}

.chat-content {
  padding: 10px 0;
  overflow-y: auto; /* 允许垂直滚动 */
  max-height: 300px; /* 最大高度 */
}

.mySelect {
  margin-top: 10px;
  padding: 5px;
}

.chat-btn {
  position: fixed;
  bottom: 80px;
  left: 15px;
  width: 30px;
  height: 30px;
  border-radius: 100px;
  cursor: pointer;
  z-index: 1000;
  background-color: var(--color-blue);
  color: #fff;
  border: none;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  background-image: url('./th.jpg');
  background-size: 100%;
  z-index: 100000000;

  &:hover {
    background-color: darken(var(--color-blue), 10%);
  }
}
</style>
