'use strict';

const skipRender = Array.isArray(hexo.config.skip_render)
  ? hexo.config.skip_render
  : (hexo.config.skip_render ? [hexo.config.skip_render] : []);

if (!skipRender.includes('course-materials/files/**')) {
  skipRender.push('course-materials/files/**');
}
hexo.config.skip_render = skipRender;

hexo.extend.filter.register('before_generate', function registerCourseMaterialsMenu() {
  hexo.theme.config.menu = hexo.theme.config.menu || {};
  if (!hexo.theme.config.menu['课程资料']) {
    hexo.theme.config.menu['课程资料'] = ['/course-materials/', 'icon-file-fill'];
  }
});
