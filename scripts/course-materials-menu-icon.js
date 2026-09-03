'use strict';

hexo.extend.filter.register('before_generate', function setCourseMaterialsMenuIcon() {
  if (hexo.theme.config.menu && hexo.theme.config.menu['课程资料']) {
    hexo.theme.config.menu['课程资料'][1] = 'icon-container';
  }
}, 20);
