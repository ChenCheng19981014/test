/**
 * @description 路由导航守卫
 */

export default (router: any) => {
  router.beforeEach(async (to, from, next) => {
    next();
  });
};
