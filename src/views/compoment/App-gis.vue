<template>
  <div class="container" id="container"></div>
</template>

<script lang="ts" setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, reactive, nextTick } from "vue";
import { useRoute } from "vue-router";
let AMap = reactive({}); // gis Amap
let map = reactive({}); // 地图
let placeSearch = reactive({}); // 地标

// 初始化 地图
const initMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: "ec26ef996ae20367632bce58553ed1d2",
  };

  AMapLoader.load({
    key: "17c4c49108cef5e4868d8753083ce122", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((aMap) => {
      AMap = aMap; // 赋值给 Vue 响应式的 AMap
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "2D", // 地图模式
        center: [120.3127, 31.4912], // 初始无锡中心位置
        zoom: 13, // 初始缩放级别
      });
      // 初始化 地图工具
      initTool(aMap);
    })
    .catch((error) => {
      console.log("错误：", error);
    });
};

// 初始化 地图工具
const initTool = (AMap) => {
  // 添加卫星图层
  // map.addLayer(new AMap.TileLayer.Satellite());

  // 添加比例尺控件
  map.addControl(new AMap.Scale());

  // 地图点击事件
  mapClick();
};

// 地图点击事件
const mapClick = () => {
  // 监听地图点击事件
  map.on("click", (e) => {
    const { lnglat, target } = e;
    const { De } = target;
    map.setCenter([lnglat.R, lnglat.Q]); // 将地图的中心设置为无锡市政府
    console.log("map自带的点击:", e, e.target);
  });
};

onMounted(() => {
  // 初始化 地图
  initMap();

  // 创建标记点
  // const marker = new AMap.Marker({
  //   position: [120.386098, 31.489297],
  //   title: "我的家",
  //   content: "<div class='marker-text'>朗诗青春未来家园</div>", // 使用类名
  //   clickable: true, // 控制是否可以点击
  // draggable: true, // 控制是否可以拖动
  // });

  // 将标记点添加到地图中
  // map.add(marker);

  // 为 marker 绑定点击事件
  // marker.on("click", function (e) {
  //   const { lnglat, target } = e;
  //   const { De } = target;
  //   const { position } = De;
  //   map.setCenter([position.R, position.Q]); // 将地图的中心设置为无锡市政府
  //   map.setZoom(20); // 设置更高的缩放级别，显示无锡市政府周围区域
  //   console.log("自定义的被点击了！", e, marker.getTitle());
  // });
});
</script>
<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  ::v-deep .marker-text {
    padding: 10px;
    white-space: nowrap; /* 防止文本换行 */
    min-width: 100px; /* 设置宽度 */
    background-color: #777;
    border-radius: 5px;
    font-size: 14px;
    color: white;
  }
}
</style>
