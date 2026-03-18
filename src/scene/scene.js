import * as THREE from "three";
import Player, { Gb, parseGlb } from "./util.js";
// 场景入口
function RunScene(arg) {
  const { json, dom, glb } = arg;
  let scene, camera, controls, renderer, renderer2;
  // 标记
  let mark;
  // 时间标记
  let markTime = 0;
  this.pb = undefined;
  this.player = undefined;
  this.assets = undefined;
  // 节流移动的flag
  this.mouseMobeContro = true;

  this.run = () => {
    const params = {
      glb,
      runningFn: this.runing,
      camera: new THREE.PerspectiveCamera(
        105,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
      ),
    };

    // 返回this 将解析后的json转为对象传入untils 这样可以加载出需要的资源-------------
    this.player = new Player(dom).run(params);
    // 拿到资源
    this.assets = this.player.getAssets();
    this.pb = new Gb(
      Object.assign(this.assets, {
        THREE,
      })
    );
    this.assets.pb = this.pb;
    // 初始化
    this.init(this.assets);
  };

  // 初始化场景资源
  this.init = (assets) => {
    scene = assets.scene;
    camera = assets.camera;
    controls = assets.controls;
    renderer = assets.renderer;
    renderer2 = assets.renderer2;
    // 初始化点击等事件
    this.initEvent();
    // 初始化相机位置
    this.initCamera();

    this.initSomething();
  };

  this.initSomething = () => {
    console.log(scene, "scene");
    // 设置环境光（模拟模型查看器的环境光）
    const ambientLight = new THREE.AmbientLight(0xfffffff, 2); // 颜色：0x404040，强度：1
    scene.add(ambientLight);
  };

  // 初始化相机位置-----------
  this.initCamera = () => {
    //设置相机距离原点的最远距离
    controls.minDistance = 1;
    //设置相机距离原点的最远距离
    controls.maxDistance = 10000;
    //相机缓动
    controls.enableDamping = true;
    // 限制控制器的显示范围---第一个是左键 第一个是右键
    controls.maxPolarAngle = Math.PI / 2;
    controls.screenSpacePanning = false;

    // 相机动画 初始化位置
    this.pb.cameraAnima(
      true,
      this.pb.getCameraAnimaBaseData(
        false,
        2.4628306489094394,
        1.3306810000000011,
        3.019758468662376,
        2.856,
        1.51,
        0
      ),
      2
    );
  };

  //鼠标按下事件--------------
  this.pointerdown = () => {
    mark = setInterval(() => {
      markTime += 1;
    });
    if (markTime >= 25) {
      clearInterval(mark);
      markTime = 0;
    }
  };

  // 初始化鼠标 键盘等等事件----
  this.initEvent = () => {
    dom.addEventListener("click", this.click);
    //鼠标点击按下事件
    dom.addEventListener("pointerdown", this.pointerdown);
    //悬浮事件
    dom.addEventListener("mousemove", this.mousemove);
  };

  // 点击
  this.click = (e) => {
    console.log(
      camera.position.x + "," + camera.position.y + "," + camera.position.z
    );
    console.log(
      controls.target.x + "," + controls.target.y + "," + controls.target.z
    );
    // const result = this.pb?.getClickEventObj(e, [...scene.children]);
    // const fristObj = result[0].object;
    // console.log("第一个对象:", fristObj.name);
  };

  // 一直循环调用
  this.runing = () => {};

  // 清空内存溢出
  this.dispose = () => {
    console.log("解决内存溢出");
    this.player.dispose();
    this.init = () => {};
    dom.removeEventListener("click", this.click);
    dom.removeEventListener("pointerdown", this.pointerdown);
    dom.removeEventListener("mousemove", this.mousemove);
    this.click = null;
    this.pointerdown = null;
    this.mousemove = null;
  };
}
// 鼎加车间

export default RunScene;
