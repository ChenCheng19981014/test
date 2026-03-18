import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import axios from "axios";
import gsap from "gsap";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loaders = {
  textureLoader: new THREE.TextureLoader(),
  gltfLoader: new GLTFLoader(),
};

const Player = function (dom) {
  var loader = new THREE.ObjectLoader();
  var camera, scene, controls, renderer2, renderer;
  var events = {};
  let domSize = {
    width: dom.clientWidth,
    height: dom.clientHeight,
  };
  this.animaFn = null;

  this.run = (arg) => {
    const { glb, runningFn, camera } = arg;
    (() => {
      // 渲染器
      initRenderer();
      addEvents();
      scene = glb.scene;
      //! 解析scene中的environment bg fog background
      parseUserData(scene);
      this.animaFn = runningFn;
    })();
    // 相机
    this.setCamera(camera);

    // 控制器
    this.setControls();

    this.setSize(dom.clientWidth, dom.clientHeight);

    this.play();

    reSize();

    return this;
  };

  const initRenderer = () => {
    renderer = new THREE.WebGLRenderer({
      alpha: true, //渲染器透明
      antialias: true, //抗锯齿
      precision: "highp", //着色器开启高精度
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    dom.appendChild(renderer.domElement);
  };

  const addEvents = () => {
    events = {
      init: [],
      start: [],
      stop: [],
      keydown: [],
      keyup: [],
      mousedown: [],
      mouseup: [],
      mousemove: [],
      touchstart: [],
      touchend: [],
      touchmove: [],
      update: [],
    };
    dispatch(events.init, arguments);
  };

  const parseUserData = (scene) => {
    // console.log('场景', scene);
    const { userData } = scene;
    if (userData.environment) {
      pb.imgToTexture(userData.environment).then((texture) => {
        scene.environment = pb.textureToThreeD(renderer, texture);
      });
    }
    if (userData.bg) {
      pb.imgToTexture(userData.bg).then((texture) => {
        scene.background = pb.textureToThreeD(renderer, texture);
      });
    }
    if (userData.fog) {
      let { color, near, far } = userData.fog;
      scene.fog = new THREE.Fog(color, near, far);
    }
    if (scene.background) {
      let bgc = scene.background;
      if (typeof bgc === "number") {
        scene.background = new THREE.Color(bgc === 0 ? "#000000" : bgc);
      }
    }
  };

  this.setControls = () => {
    controls = new OrbitControls(camera, dom);
  };

  this.setCamera = (value) => {
    camera = value;
    //3.设置相机位置
    camera.position.set(0, 0, 0);

    camera.aspect = domSize.width / domSize.height;

    camera.updateProjectionMatrix();
  };

  this.setSize = function (width, height) {
    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    if (renderer) {
      renderer.setSize(width, height);
    }
    if (renderer2) {
      renderer2.setSize(width, height);
    }
  };

  this.animate = () => {
    this.animaFn && this.animaFn();
    if (controls) controls.update();
    renderer && renderer?.render(scene, camera);
    // renderer2 && renderer2?.render(scene, camera);
  };

  this.play = function () {
    dom.addEventListener("keydown", onDocumentKeyDown);
    dom.addEventListener("keyup", onDocumentKeyUp);
    dom.addEventListener("mousedown", onDocumentMouseDown);
    dom.addEventListener("mouseup", onDocumentMouseUp);
    dom.addEventListener("mousemove", onDocumentMouseMove);
    dom.addEventListener("touchstart", onDocumentTouchStart);
    dom.addEventListener("touchend", onDocumentTouchEnd);
    dom.addEventListener("touchmove", onDocumentTouchMove);

    dispatch(events.start, arguments);
    renderer.setAnimationLoop(this.animate);
  };

  const reSize = () => {
    window.addEventListener("resize", function () {
      // 调整渲染器尺寸
      renderer.setSize(window.innerWidth, window.innerHeight);

      // 更新相机的宽高比
      camera.aspect = window.innerWidth / window.innerHeight;

      // 更新投影矩阵
      camera.updateProjectionMatrix();

      // 重新渲染场景
      renderer.render(scene, camera);
    });
  };

  this.getAssets = () => {
    return {
      scene,
      camera,
      controls,
      renderer,
      renderer2,
      dom,
    };
  };

  this.dispose = function () {
    renderer.setAnimationLoop(null);
    renderer.dispose();
    renderer2.disposr();
    camera = undefined;
    scene = undefined;
    controls = undefined;
  };

  function dispatch(array, event) {
    for (var i = 0, l = array.length; i < l; i++) {
      array[i](event);
    }
  }

  function onDocumentKeyDown(event) {
    dispatch(events.keydown, event);
  }

  function onDocumentKeyUp(event) {
    dispatch(events.keyup, event);
  }

  function onDocumentMouseDown(event) {
    dispatch(events.mousedown, event);
  }

  function onDocumentMouseUp(event) {
    dispatch(events.mouseup, event);
  }

  function onDocumentMouseMove(event) {
    dispatch(events.mousemove, event);
  }

  function onDocumentTouchStart(event) {
    dispatch(events.touchstart, event);
  }

  function onDocumentTouchEnd(event) {
    dispatch(events.touchend, event);
  }

  function onDocumentTouchMove(event) {
    dispatch(events.touchmove, event);
  }

  /********************************************************************************************** */
  // 传出scene、camera、controls
};

function Gb(assets) {
  let { scene, camera, controls, eventBus, renderer, dom, THREE } = assets;
  /* 精灵图 */
  this.getSprite = (width, height) => {
    let spriteMaterial = new THREE.SpriteMaterial({});
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(width || 2000, height || 1000);
    return sprite;
  };
  /* 加框背 */
  this.getCanvas = (
    fillTextConfig = ["test", 10, 10],
    translate = [0, 0],
    fontSize = 150,
    color = "#00ff00",
    fontType = "Arial",
    bgc = "rgba(255,255,255,0.5)"
  ) => {
    let canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 800;
    let ctx = canvas.getContext("2d");
    ctx.translate(...translate);
    ctx.fillStyle = bgc;
    ctx.fillRect(0, 0, 1000000000, 10000000000);
    ctx.fillStyle = color; //文本填充颜色
    ctx.font = "bolder " + fontSize + "px " + fontType + " ";
    ctx.fillText(...fillTextConfig);
    // 将画布生成的图片作为贴图给精灵使用，并将精灵创建在设定好的位置
    return canvas;
  };
  /* 加文字 */
  this.setTexture = async (obj, map, type = "url") => {
    let Texture;
    if (type === "file") {
      Texture = new THREE.Texture(map);
      Texture.needsUpdate = true;
    } else {
      let load = new THREE.TextureLoader();
      Texture = await load.load(map);
    }
    obj.material.map = Texture;

    return Texture;
  };
  this.getTansDomToModel = (dom) => new CSS3DObject(dom);
  /* 世界坐标 */
  this.getObjWorldPosition = (obj) => {
    scene.updateMatrixWorld(true);
    // 声明一个三维向量用来保存网格模型的世界坐标
    let worldPosition = new THREE.Vector3();
    // 获得世界坐标，执行getWorldPosition方法，提取网格模型的世界坐标结果保存到参数worldPosition中
    obj.getWorldPosition(worldPosition);
    return worldPosition;
  };
  /* 获取添加一个点击对象 */
  this.getClickEventObj = (e, accectClickList) => {
    // 确定位置使用
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    mouse.x = (e.offsetX / dom.clientWidth) * 2 - 1;
    mouse.y = -(e.offsetY / dom.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(
      accectClickList.length > 0 ? accectClickList : scene.children,
      true
    );
    if (intersects.length > 0) {
      return intersects;
    } else {
      return null;
    }
  };
  this.anima = (begin, end, time, onUpdate, onComplete) => {
    let newBegin = { ...begin };
    let tween = gsap
      .to(newBegin, time, end)
      .eventCallback("onUpdate", (_) => onUpdate && onUpdate(newBegin))
      .eventCallback("onComplete", (_) => {
        onComplete && onComplete();
        gsap.killTweensOf(tween);
        tween = null;
      });

    return tween;
  };
  this.createMacroTask = (macroTaskFn, time = 0) => {
    let tempTimer = setTimeout(() => {
      clearTimeout(tempTimer);
      tempTimer = null;
      return macroTaskFn();
    }, time);
  };
  this.scalarBoom = (model, scalar) => {
    var modelCenter = new THREE.Vector3(0, 0, 0);

    model.traverse(function (value) {
      if (value.isMesh) {
        let meshBox3 = new THREE.Box3();
        meshBox3.setFromObject(value);
        //模型中心点
        var worldPs = new THREE.Vector3()
          .addVectors(meshBox3.max, meshBox3.min)
          .multiplyScalar(0.5);
        if (isNaN(worldPs.x)) return;
        //计算爆炸方向
        value.worldDir = new THREE.Vector3()
          .subVectors(worldPs, modelCenter)
          .normalize();
        //保存初始坐标
        value.userData.oldPs = new THREE.Vector3(
          value.position.x,
          value.position.y,
          value.position.z
        );
      }
    });
    model.traverse(function (value) {
      if (!value.isMesh || !value.worldDir) return;
      value.position.copy(
        new THREE.Vector3()
          .copy(value.userData.oldPs)
          .add(new THREE.Vector3().copy(value.worldDir).multiplyScalar(scalar))
      );
    });
  };
  this.deepFindParent = (model, parentName) => {
    if (!model.parent) return new Error("该模型没有父模型");
    let deep = (model) => {
      if (!model.parent || model.parent.name === "Scene") return false;
      if (model.parent.name === parentName) return true;
      return deep(model.parent);
    };
    return deep(model);
  };
  this.getModel = (objName) => {
    return scene.getObjectByName(objName);
  };
  this.getMesh = (_) => {
    let g = new THREE.BufferGeometry(1, 1, 1);
    let m = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    return new THREE.Mesh(g, m);
  };
  this.getInstance = (model1, model2) => {
    let model1WorldPosition = this.getObjWorldPosition(model1);
    let model2WorldPosition = this.getObjWorldPosition(model2);
    // if(model1.position.x ===0)
    return model1WorldPosition.distanceTo(model2WorldPosition);
  };
  this.changeModelOpc = (model, opc = 0.5, toOld = false) => {
    if (model.type === "Group") throw TypeError("该模型为Group类型");
    if (!model.material) throw TypeError("该模型没有材质");
    let modelTransparent = model.material.transparent;
    if (model.material.oldOpc === undefined) {
      model.material.oldOpc =
        model.material.opacity === undefined ? 1 : model.material.opacity;
      model.material.oldTransparent =
        model.material.transparent === undefined
          ? false
          : model.material.transparent;
    }
    if (toOld) {
      model.material.opacity = model.material.oldOpc;
      model.material.transparent = model.material.oldTransparent;
      return;
    }
    if (opc === 1) {
      model.material.transparent = false;
      model.material.opacity = 1;
    } else {
      if (!modelTransparent) {
        model.material.transparent = true;
      }
      model.material.opacity = opc;
    }
  };
  this.deepChangeModelOpc = (model, opc, toOld) => {
    if (model.type === "Mesh") {
      this.changeModelOpc(model, opc, toOld);
    } else if (model.type === "Group") {
      model.children.forEach((i) => this.deepChangeModelOpc(i, opc, toOld));
    }
  };
  /**
   * 作用：
   * @param {*} now true 的话 返回当前的相机的位置和控制器的target，是个对象
   * @param {*} 2-4是相机的位置
   * @param {*} 5-7是control 的camera
   * @returns 相机动画需要的数据
   */
  this.getCameraAnimaBaseData = (
    now = false,
    cx,
    cy,
    cz,
    tx,
    ty,
    tz,
    anima = false
  ) => {
    if (now) {
      let { x, y, z } = camera.position;
      let tx = controls.target.x;
      let ty = controls.target.y;
      let tz = controls.target.z;
      return {
        cx: x,
        cy: y,
        cz: z,
        tx,
        ty,
        tz,
      };
    } else {
      return {
        cx,
        cy,
        cz,
        tx,
        ty,
        tz,
      };
    }
  };
  /**
   * 作用：
   * @param {*} begin map 开始的对象
   * @param {*} end map 结束的map
   * @param {*} time 时间， 默认1秒
   * @returns promise 动画结束回调res函数，返回动画实例
   *
   */
  this.cameraAnima = (begin, end, time = 1) => {
    let start = begin === true ? this.getCameraAnimaBaseData(true) : false;
    return this.anima(
      start || begin,
      end,
      time,
      (data) => {
        camera.position.set(data.cx, data.cy, data.cz);
        controls.target.set(data.tx, data.ty, data.tz);
      },
      (_) => {}
    );
  };
  this.deepFindInfo = (model, type) => {
    let deep = (model, type) => {
      if (model[type] !== undefined) {
        return model[type];
      } else if (model.parent.type === "Scene") {
        return undefined;
      } else {
        return deep(model.parent, type);
      }
    };
    return deep(model, type);
  };
  this.animaSequence = (list, time, onUpdate, onComplate, end) => {
    let count = 0;
    let ani = () => {
      list[count + 1].ease = "none";
      this.anima(
        list[count],
        list[count + 1],
        time,
        (data) => onUpdate(data),
        () => {
          if (count + 1 < list.length - 1) {
            count++;
            onComplate();
            ani();
          } else {
            end();
          }
        }
      );
    };
    ani();
  };
  this.clone = (obj) => {
    if (obj === null) return null;
    if (typeof obj !== "object") return obj;
    var newObj = new obj.constructor(); //保持继承链
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        //不遍历其原型链上的属性
        var val = obj[key];
        newObj[key] = val;
      }
    }
    return newObj;
  };
  this.pathAnima = (
    model,
    animaModel,
    endCall,
    isLookAt = false,
    speed = 0.001
  ) => {
    if (!model.children)
      throw TypeError("路径动画需要传入的模型children不为空");
    let curve = new THREE.CatmullRomCurve3(
      model.children.map((i) => i.position)
    );
    let geometry = new THREE.BufferGeometry(); //创建一个缓冲类型几何体

    //曲线上等间距返回多个顶点坐标
    let pointsArr = curve.getSpacedPoints(100); //分段数100，返回101个顶点

    geometry.setFromPoints(pointsArr);
    let material = new THREE.LineBasicMaterial({
      color: 0x006666,
    });
    let line = new THREE.Line(geometry, material);
    this.changeModelOpc(line, 0);
    scene.add(line);
    let percent = 0.0;
    let timer = setInterval(() => {
      if (percent > 0.99) return;
      let nowLocal = curve.getPointAt(percent); //曲线上一点
      let nowLocal1 = curve.getPointAt(percent + speed); //曲线上一点
      if (animaModel.name === "Camera") {
        isLookAt && controls.target.copy(nowLocal1);
        animaModel.position.copy(nowLocal); //更新光点位置
      } else {
        isLookAt && animaModel.lookAt(nowLocal1);
        animaModel.position.copy(nowLocal); //更新光点位置
      }
      percent += speed;
      // if (percent > 0.99) percent = 0.0;
      if (percent > 0.99) {
        clearInterval(timer);
        endCall();
        return;
      }
    }, 16);
    return timer;
  };
}

const pb = {
  imgToTexture(img) {
    return new Promise((s) => {
      loaders.textureLoader.load(img, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.encoding = 3001;
        texture.flipY = false;
        texture.version = 1;
        texture.needsUpdate = true;
        s(texture);
      });
    });
  },
  textureToThreeD(renderer, texture) {
    let pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    return pmremGenerator.fromEquirectangular(texture).texture;
  },
  removeUnLess(model) {
    let deep = (model) => {
      const filterList = ["Group", "Object3D"];
      if (filterList.includes(model.type) && model.children.length === 1) {
        return deep(model.children[0]);
      }
      return model;
    };
    return deep(model);
  },
  parseGlb(glb) {
    return new Promise((s) => {
      axios.get(glb, { responseType: "arraybuffer" }).then((result) => {
        loaders.gltfLoader.parse(result.data, "", (result) => {
          s(result);
          // const model = pb.removeUnLess(result.scene);
          // s({
          //   json: result.asset.sceneJson,
          //   model,
          // });
        });
      });
    });
  },
};

export default Player;

const { parseGlb } = pb;

export { Gb, parseGlb };
