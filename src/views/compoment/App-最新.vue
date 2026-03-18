<template>
  <div class="map">
    <!-- 搜索 -->
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
          <div class="name">{{ item?.name }}</div>
          <div class="image">
            <img v-if="item?.photos[0]" :src="item?.photos[0]?.url" />
            <img v-else src="@/assets/imgs/摸鱼.gif" />
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑按钮区域 -->
    <div class="button">
      <button @click="createPolyline">新建Polyline</button>
      <button @click="endEditor">结束编辑Polyline</button>

      <button @click="createPolyOn">新建PolyOn</button>
      <!-- <button @click="endEditor()">结束编辑PolyOn</button> -->
      <button @click="close">关闭</button>
    </div>

    <!-- 地图 -->
    <div class="container" id="container"></div>
  </div>
</template>

<script lang="ts" setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, reactive, nextTick, ref } from "vue";
import CourtDIcon from "@/assets/imgs/摸鱼.gif";

let AMap = reactive({}); // gis Amap
let map = reactive({}) as any; // 地图
let placeSearch = reactive({}); // 地标
let searchInfo = reactive({
  name: "",
  list: [],
}); // 搜索内容

// 编辑的东西
let editorContent = reactive({
  savePolyLinePaths: null, // 线段
  savePolyOnPath: null, // 多边形
  polyLineEditor: null,
}) as any;

// 初始化 地图
const initMap = () => {
  AMapLoader.load({
    key: "17c4c49108cef5e4868d8753083ce122", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      "AMap.DragRoute",
      "AMap.Scale",
      "AMap.ToolBar",
      "AMap.MouseTool",
      "AMap.PlaceSearch",
      "AMap.OverView",
      "AMap.AutoComplete",
      "AMap.HawkEy",
      "AMap.ControlBar",
      "AMap.MarkerCluster",
      "AMap.PolylineEditor",
      "AMap.Polyline",
    ], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((aMap) => {
      AMap = aMap; // 赋值给 Vue 响应式的 AMap
      map = new AMap.Map("container", {
        viewMode: "2D", // 地图模式
        center: [120.3127, 31.4912], // 初始无锡中心位置
        zoom: 13, // 初始缩放级别
      });
      // 初始化 地图工具
      initTool(aMap);
      // 初始化搜索
      initSearch(aMap);
      // 缩放地图到合适的视野级别
      // map.setFitView();
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
  map.addControl(new AMap.ToolBar({ position: "RB" }));

  // 地图默认显示啥
  map.setFeatures(["road", "point", "bg", "building"]); //多个种类要素显示

  // 新增一个 线段编辑器
  editorContent.polyLineEditor = new AMap.PolylineEditor(map);

  // 地图点击事件
  mapClick();

  // 聚合点位
  aggregationPointLocation(AMap);

  // 编辑
  editor(AMap);
};

// 聚合点位
const aggregationPointLocation = (AMap) => {
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
// 新建 PolyOn
const createPolyOn = () => {};

// 新建 Polyline
const createPolyline = () => {
  editorContent.polyLineEditor.setTarget();
  editorContent.polyLineEditor.open();
  // editorContent.polyLineEditor.on("add", (e) => {
  //   e.target.setOptions({
  //     strokeColor: "#87CEEB", // 更改颜色为蓝色
  //     strokeWeight: 5, // 更改宽度为 5px
  //     strokeOpacity: 0.8, // 更改透明度为 0.8
  //     bubble: true,
  //   });
  // });
};

// 结束编辑
const endEditor = () => {
  // 此处设置最终颜色
  // editorContent.polyLineEditor.on("end", (e) => {
  //   e.target.setOptions({
  //     strokeColor: "#87CEEB", // 更改颜色为蓝色
  //     strokeWeight: 5, // 更改宽度为 5px
  //     strokeOpacity: 0.8, // 更改透明度为 0.8
  //     bubble: true,
  //   });
  // });
  editorContent.polyLineEditor.close();
};

// 编辑
const editor = (AMap) => {
  // let mouseTool = new AMap.MouseTool(map); //创建鼠标工具插件实例
  // 绘制折线
  // mouseTool.polyline({
  //   draggable: true, // 可以被拖动
  //   showArea: true, // 是否显示面积
  //   showLength: true, // 是否显示长度‘
  //   unit: "m", // 单位
  //   strokeOpacity: 0.8,
  //   strokeWeight: 4,
  //   lineJoin: "round",
  //   // strokeStyle: "dashed",
  //   cursor: "move",
  // });
  //在插件的回调函数中使用功能
  // mouseTool.on("draw", function (event) {
  //   const { obj } = event;
  //   editorContent.savePolyLinePaths = obj.getPath();
  //   //event.obj 为绘制出来的覆盖物对象
  //   console.log("覆盖物对象绘制完成", event, obj.getPath());
  // });
  // 绘制多边形
  // mouseTool.polygon({
  //   draggable: true, // 可以被拖动
  //   showArea: true, // 是否显示面积
  //   showLength: true, // 是否显示长度
  //   unit: "m", // 单位
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   strokeStyle: "dashed",
  //   cursor: "move",
  // });
  // 启用绘制规则 测距离
  // mouseTool.rule(); // 测量距离
  // 绘制点标注
  // mouseTool.marker({
  //   draggable: true,
  //   animation: "AMAP_ANIMATION_NONE",
  //   clickable: true,
  //   title: "我是一个小图标", // 鼠标悬停时显示的标题
  // });
  // 绘制矩形
  // mouseTool.rectangle();
  // 绘制圆
  // mouseTool.circle();
  // 测量 面积
  //  mouseTool.measureArea({
  //   draggable: true, // 可以被拖动
  //   showArea: true, // 是否显示面积
  //   showLength: true, // 是否显示长度
  //   unit: "m", // 单位
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   strokeStyle: "dashed",
  //   cursor: "move",
  // });
};

// 关闭
const close = () => {
  // 移除多边形
  removePolygon();
  // 移除线段
  removePolyline();
};

// 移除线段
const removePolyline = () => {
  let line = new AMap.Polyline({ map });
  // 首先获取当前地图中所有覆盖物的实例。
  let mapPolyLineArr = map.getAllOverlays("polyline");
  // 定义一个空数组用来存放需要删除的覆盖物实例。
  let arr = [];
  for (let i = 0; i < mapPolyLineArr.length - 1; i++) {
    // 将需要删除的项添加到空数组里
    arr.push(mapPolyLineArr[i]);
  }
  // 移除覆盖物
  map.remove(arr);
};

// 清除绘制的多边形
const removePolygon = () => {
  // 创建Polygon实例
  let poly = new AMap.Polygon({ map });
  // 首先获取当前地图中所有覆盖物的实例。
  let mapPolyArr = map.getAllOverlays("polygon");
  // 定义一个空数组用来存放需要删除的覆盖物实例。
  let arr = [];
  for (let i = 0; i < mapPolyArr.length - 1; i++) {
    // 将需要删除的项添加到空数组里
    arr.push(mapPolyArr[i]);
  }
  // 移除覆盖物
  map.remove(arr);
};

// 地图点击事件
const mapClick = () => {
  // 监听地图点击事件
  map.on("click", (e) => {
    // const { lnglat, target } = e;
    // const { De } = target;
    // map.setCenter([lnglat.lng, lnglat.lat]); // 将地图的中心设置为无锡市政府
    // console.log("map自带的点击:", e, lnglat);
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
          flex-shrink: 0;
          /* 防止在 flex 容器中被缩小 */
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

  .button {
    right: 50px;
    top: 20px;
    z-index: 9999;
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    > button {
      padding: 2px 5px;
    }
  }

  .container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    ::v-deep .marker-text {
      padding: 10px;
      white-space: nowrap;
      /* 防止文本换行 */
      min-width: 100px;
      /* 设置宽度 */
      background-color: #777;
      border-radius: 5px;
      font-size: 14px;
      color: white;
    }
  }
}
</style>
