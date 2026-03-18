<template>
  <div class="map">
    <div class="search">
      <input
        type="text"
        class="search-input"
        v-model="searchInfo.name"
        placeholder="搜地点、查公交、找路线..."
        @keydown.enter="doSearch"
      />
      <div class="search-list" v-if="searchInfo.list.length">
        <div
          class="search-list-item"
          v-for="(item, index) in searchInfo.list"
          :key="index"
        >
          <div class="name">{{ item.name }}</div>
          <div class="image">
            <img v-if="item.photos[0]" :src="item.photos[0]?.url" />
            <img v-else src="@/assets/imgs/摸鱼.gif" />
          </div>
        </div>
      </div>
    </div>

    <div class="container" id="container"></div>
  </div>
</template>

<script lang="ts" setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, reactive, nextTick, ref } from "vue";
import CourtDIcon from "@/assets/imgs/摸鱼.gif";

let AMap = reactive({}); // gis Amap
let map = reactive({}); // 地图
let placeSearch = reactive({}); // 地标
let searchInfo = reactive({
  name: "",
  list: [],
}); // 搜索内容

// 初始化 地图
const initMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: "ec26ef996ae20367632bce58553ed1d2",
  };
  AMapLoader.load({
    key: "17c4c49108cef5e4868d8753083ce122", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.DragRoute",
      "AMap.Scale",
      "AMap.ToolBar",
      "AMap.MouseTool",
      "AMap.PlaceSearch",
      // "AMap.AutoComplete",
      // "AMap.HawkEy",
      // "AMap.ControlBar",
    ], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
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
      // 初始化搜索
      initSearch(aMap);
    })
    .catch((error) => {
      console.log("错误：", error);
    });
};

// 初始化搜索
const initSearch = (AMap) => {
  placeSearch = new AMap.PlaceSearch({
    city: "无锡", // 默认搜索的城市
    map: map, // 结果会显示在地图上
  });
};

// 执行搜索
const doSearch = () => {
  console.log("搜索了：", searchInfo.name);
  // 使用 PlaceSearch 实例进行搜索
  placeSearch.search(searchInfo.name, function (status, result) {
    if (status === "complete" && result.info === "OK") {
      const { poiList } = result;
      const { pois } = poiList;
      searchInfo.list = pois;
      console.log("搜索结果：", result, searchInfo);
    } else {
      searchInfo.list = [];
      console.log("搜索失败：", result);
    }
  });
};

// 初始化 地图工具
const initTool = (AMap) => {
  // 添加卫星图层
  // map.addLayer(new AMap.TileLayer.Satellite());

  // 添加比例尺控件
  map.addControl(new AMap.Scale());

  // 右下角放大工具
  map.addControl(new AMap.ToolBar());

  // 地图点击事件
  mapClick();

  // 聚合点位
  aggregationPointLocation();

  // 划线
  new AMap.Polyline({
    map,
    path: [
      ["120.3127", "31.4912"],
      ["120.3228", "31.4812"],
      ["120.3017", "31.4912"],
    ],
  });
};

// 聚合点位
const aggregationPointLocation = () => {
  // 点聚合数据
  const points = [
    { weight: 8, lnglat: ["120.3127", "31.4912"] },
    { weight: 1, lnglat: ["120.3228", "31.4912"] },
    { weight: 1, lnglat: ["120.3017", "31.4912"] },
    { weight: 1, lnglat: ["120.3007", "31.4912"] },
    { weight: 1, lnglat: ["120.3307", "31.4912"] },
  ];

  // 添加 聚合点位
  map.plugin(["AMap.MarkerCluster"], () => {
    // 创建 MarkerCluster 实例
    const markerCluster = new AMap.MarkerCluster(map, points, {
      gridSize: 50, //数据聚合计算时网格的像素大小
      renderMarker: (context) => {
        // context 为回调参数，
        // 包含如下属性 marker:当前非聚合点
        context.marker.setContent(
          `<img src="${CourtDIcon}"  style="width: 30px; height: 30px;"/>`
        );
      },
    });

    // 监听聚合点的点击事件
    markerCluster.on("click", function (e) {
      // 聚焦到点击到的位置
      map.setCenter([e.lnglat.lng, e.lnglat.lat]);
    });
  });
};

// 地图点击事件
const mapClick = () => {
  // 监听地图点击事件
  map.on("click", (e) => {
    const { lnglat, target } = e;
    const { De } = target;
    map.setCenter([lnglat.lng, lnglat.lat]); // 将地图的中心设置为无锡市政府
    console.log("map自带的点击:", e, lnglat);
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
.map {
  width: 100%;
  height: 100%;
  position: relative;
  .search {
    z-index: 9999;
    position: relative;
    .search-input {
      position: absolute;
      left: 50px;
      top: 20px;
      width: 368px;
      height: 38px;
      padding: 20px;
      border-radius: 5px;
      outline: none;
      border: none;
    }
    .search-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 368px;
      max-height: 500px;
      overflow-y: scroll;
      padding: 5px;
      border-radius: 5px;
      position: absolute;
      top: 70px;
      left: 50px;
      background-color: #fff;
      gap: 10px;

      .search-list-item {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          font-size: 14px;
          font-weight: bold;
          flex-shrink: 0; /* 防止在 flex 容器中被缩小 */
          justify-content: center;
          align-items: center;
          width: 200px;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
        .image {
          width: 100px;
          height: 100px;
          > img {
            object-fit: contain;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

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
}
</style>
