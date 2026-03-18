<template>
  <div class="flex-x-box">
    <!-- 内容 start -->
    <div class="card" v-for="(i, index) in list" :key="index">
      <img :src="i.url" />
      <div class="info-box">
        <h1>{{ i.label + "管理" }}</h1>
        <p>{{ i.desc }}</p>
      </div>
      <div class="details-box">
        <span>
          <h2>{{ i.total }}</h2>
          <p>{{ i.label + "总数" }}</p>
        </span>
        <span>
          <h2>{{ i.add }}</h2>
          <p>今日新增</p>
        </span>
      </div>
    </div>
    <!-- 内容 end -->
  </div>
</template>

<script>
// import Vue 不是必须的，需要手动指定 Vue 的版本时，可以解开注释
// import Vue from 'vue';
export default {
  data() {
    return {
      list: [
        {
          label: "报表",
          desc: "深度数据挖掘，多维度报表生成，实时监控业务动态，为企业决策提供有力数据支撑",
          url: "https://gd-hbimg.huaban.com/b6b8fee10b8a8564021d067930260b4d0d5a251a9838-heNzIc",
          total: "108",
          add: "12",
        },
        {
          label: "产品",
          desc: "全生命周期管理，从研发到销售无缝衔接，优化产品组合，提升市场竞争力",
          url: "https://gd-hbimg.huaban.com/85fcf3acaf0f353f3761c2b88ef64f4738234aa8a5e8-y6brmg",
          total: "267",
          add: "25",
        },
        // {
        //   label:'文档',
        //   desc:'高效知识存储，智能检索体系，确保信息准确传递，助力团队协作与知识共享',
        //   url:'https://gd-hbimg.huaban.com/6d34a31131216b323f0123f9667a77ba186f02418ebc-dCDn9Y',
        //   total:'37',
        //   add:'2'
        // }
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss">
html {
  width: 100%;
  height: 100%;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0px;
  background: linear-gradient(to bottom, #01010e, #162f4d);
}

.flex-x-box {
  display: flex;
}

/* 卡片宽度 */
$card-height: 280px;
$card-width: 220px;

div,
span,
p {
  box-size: border-box;
}
.card {
  position: relative;
  width: $card-width;
  height: $card-height;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: rgba(88, 199, 250, 0%);
  cursor: pointer;
  box-size: border-box;
  background: linear-gradient(210deg, #203656, #426889);
  margin: 0px 15px;

  img {
    width: 90%;
    margin-top: -80px;
    transition: 200ms linear;
  }
  .info-box {
    width: 100%;
  }
  h1 {
    font-size: 14px;
    color: #f3fbff;
  }
  p {
    font-size: 12px;
    color: #a1c4de;
    padding: 0px 28px;
    line-height: 1.6;
  }
  .details-box {
    position: absolute;
    display: flex;
    align-items: center;
    width: 100%;
    height: 120px;
    box-sizing: border-box;
    bottom: 0px;
    padding-top: 45px;
    z-index: 10;
    background: linear-gradient(0deg, #152d4a 70%, transparent);
    border-radius: 0px 0px 12px 12px;
    transition: 200ms linear;
    opacity: 0;
    span {
      width: 0px;
      flex-grow: 1;
    }
    h2 {
      margin: 0px;
      font-size: 14px;
      line-height: 1.8;
      color: #fff;
    }
    p {
      margin: 0px;
    }
  }
}
.card:hover {
  &::before {
    background-image: linear-gradient(
      var(--rotate),
      #5ddcff,
      #3c67e3 43%,
      #ffddc5
    );
    animation: spin 3s linear infinite;
  }
  &::after {
    background-image: linear-gradient(
      var(--rotate),
      #5ddcff,
      #3c67e3 43%,
      #ff8055
    );
    animation: spin 3s linear infinite;
  }
  .details-box {
    opacity: 1;
  }
  img {
    width: 9%;
    margin-top: -60px;
  }
}

.card::before {
  content: "";
  width: $card-width + 2px;
  height: $card-height + 2px;
  border-radius: 13px;
  background-image: linear-gradient(
    var(--rotate),
    #435b7c,
    #5f8cad 50%,
    #729bba
  );
  position: absolute;
  z-index: -1;
  top: -1px;
  left: -1px;
}
.card::after {
  position: absolute;
  content: "";
  top: calc($card-height / 6);
  left: 0;
  right: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  transform: scale(0.9);
  filter: blur(20px);
  opacity: 1;
  transition: opacity 0.5s;
}

/* CSS 自定义属性 */
@property --rotate {
  syntax: "<angle>";
  initial-value: 90deg;
  inherits: false;
}

@keyframes spin {
  0% {
    --rotate: 0deg;
  }
  100% {
    --rotate: 360deg;
  }
}
</style>
