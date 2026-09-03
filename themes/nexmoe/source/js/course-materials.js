(function () {
  'use strict';

  var search = document.getElementById('materials-search');
  var browser = document.getElementById('materials-browser');
  var breadcrumb = document.getElementById('materials-breadcrumb');
  var noResult = document.getElementById('materials-no-result');
  var dataElement = document.getElementById('materials-data');
  var resources = [];

  if (dataElement) {
    try {
      resources = JSON.parse(dataElement.textContent || '[]');
    } catch (error) {
      console.error('课程资料数据读取失败', error);
    }
  }

  function createNode(name) {
    return { name: name || '', children: {}, files: [] };
  }

  var root = createNode('全部资料');
  resources.forEach(function (resource) {
    var parts = String(resource.course || '未分类').split(' / ').filter(Boolean);
    var node = root;
    parts.forEach(function (part) {
      if (!node.children[part]) node.children[part] = createNode(part);
      node = node.children[part];
    });
    node.files.push(resource);
  });

  function fileCount(node) {
    return node.files.length + Object.keys(node.children).reduce(function (total, key) {
      return total + fileCount(node.children[key]);
    }, 0);
  }

  function sortChinese(a, b) {
    return String(a).localeCompare(String(b), 'zh-CN', { numeric: true, sensitivity: 'base' });
  }

  function getPathFromHash() {
    if (window.location.hash.indexOf('#path=') !== 0) return [];
    try {
      var value = JSON.parse(decodeURIComponent(window.location.hash.slice(6)));
      return Array.isArray(value) ? value.map(String) : [];
    } catch (error) {
      return [];
    }
  }

  function findNode(path) {
    var node = root;
    for (var index = 0; index < path.length; index += 1) {
      if (!node.children[path[index]]) return null;
      node = node.children[path[index]];
    }
    return node;
  }

  function goTo(path) {
    var hash = path.length ? '#path=' + encodeURIComponent(JSON.stringify(path)) : '#';
    if (window.location.hash === hash) render();
    else window.location.hash = hash;
  }

  function makeElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text !== 'undefined') element.textContent = text;
    return element;
  }

  function folderLevelName(depth) {
    if (depth === 0) return '年级';
    if (depth === 1) return '科目';
    return '文件夹';
  }

  function createFolderCard(name, node, path) {
    var button = makeElement('button', 'material-folder-card');
    button.type = 'button';
    button.setAttribute('aria-label', '打开' + name + '文件夹');

    var icon = makeElement('span', 'material-folder-icon', '⌁');
    icon.setAttribute('aria-hidden', 'true');
    var content = makeElement('span', 'material-folder-content');
    content.appendChild(makeElement('small', '', folderLevelName(path.length)));
    content.appendChild(makeElement('strong', '', name));
    content.appendChild(makeElement('span', '', fileCount(node) + ' 份资料'));
    button.appendChild(icon);
    button.appendChild(content);
    button.appendChild(makeElement('span', 'material-folder-arrow', '›'));
    button.addEventListener('click', function () { goTo(path.concat(name)); });
    return button;
  }

  function createFileCard(resource) {
    var card = makeElement('section', 'material-card');
    var top = makeElement('div', 'material-card-top');
    var extension = String(resource.extension || 'FILE');
    top.appendChild(makeElement('span', 'material-file-badge material-file-' + extension.toLowerCase(), extension));
    top.appendChild(makeElement('span', 'material-course', resource.course || '未分类'));
    card.appendChild(top);

    var title = makeElement('h2', '', resource.title || resource.filename);
    title.title = resource.filename || resource.title;
    card.appendChild(title);

    var meta = makeElement('div', 'material-meta');
    meta.appendChild(makeElement('span', '', resource.size || ''));
    meta.appendChild(makeElement('span', '', '更新于 ' + (resource.updated || '')));
    card.appendChild(meta);

    var actions = makeElement('div', 'material-actions');
    if (resource.previewType) {
      var preview = makeElement('button', 'material-preview', '在线预览');
      preview.type = 'button';
      preview.dataset.url = resource.url;
      preview.dataset.preview = resource.previewType;
      preview.dataset.name = resource.filename;
      actions.appendChild(preview);
    } else {
      actions.appendChild(makeElement('span', 'material-preview-unavailable', '暂不支持预览'));
    }
    var download = makeElement('a', 'material-download', '下载');
    download.href = resource.url;
    download.setAttribute('download', resource.filename);
    actions.appendChild(download);
    card.appendChild(actions);
    return card;
  }

  function renderBreadcrumb(path, searching) {
    if (!breadcrumb) return;
    breadcrumb.replaceChildren();
    var home = makeElement('button', '', '全部年级');
    home.type = 'button';
    home.disabled = !path.length && !searching;
    home.addEventListener('click', function () { goTo([]); });
    breadcrumb.appendChild(home);

    path.forEach(function (part, index) {
      breadcrumb.appendChild(makeElement('span', '', '›'));
      var button = makeElement('button', '', part);
      button.type = 'button';
      button.disabled = index === path.length - 1 && !searching;
      button.addEventListener('click', function () { goTo(path.slice(0, index + 1)); });
      breadcrumb.appendChild(button);
    });

    if (searching) {
      breadcrumb.appendChild(makeElement('span', '', '›'));
      var current = makeElement('button', '', '搜索结果');
      current.type = 'button';
      current.disabled = true;
      breadcrumb.appendChild(current);
    }
  }

  function addSectionTitle(container, eyebrow, title, count) {
    var header = makeElement('header', 'materials-section-heading');
    var copy = makeElement('div');
    copy.appendChild(makeElement('span', '', eyebrow));
    copy.appendChild(makeElement('h2', '', title));
    header.appendChild(copy);
    header.appendChild(makeElement('strong', '', count + ' 项'));
    container.appendChild(header);
  }

  function renderSearch(keyword, path) {
    var matched = resources.filter(function (resource) {
      var haystack = [resource.title, resource.filename, resource.course, resource.extension].join(' ').toLowerCase();
      return haystack.indexOf(keyword) !== -1;
    }).sort(function (a, b) { return sortChinese(a.title, b.title); });

    renderBreadcrumb(path, true);
    noResult.hidden = matched.length !== 0;
    if (!matched.length) return;
    addSectionTitle(browser, '全库搜索', '搜索结果', matched.length);
    var grid = makeElement('div', 'materials-grid');
    matched.forEach(function (resource) { grid.appendChild(createFileCard(resource)); });
    browser.appendChild(grid);
  }

  function render() {
    if (!browser) return;
    browser.replaceChildren();
    var keyword = search ? search.value.trim().toLowerCase() : '';
    var path = getPathFromHash();
    var node = findNode(path);
    if (!node) {
      goTo([]);
      return;
    }

    if (keyword) {
      renderSearch(keyword, path);
      return;
    }

    noResult.hidden = true;
    renderBreadcrumb(path, false);
    var folderNames = Object.keys(node.children).sort(sortChinese);
    if (folderNames.length) {
      addSectionTitle(browser, folderLevelName(path.length), path.length ? node.name + ' 下的文件夹' : '选择年级', folderNames.length);
      var folderGrid = makeElement('div', 'materials-folder-grid');
      folderNames.forEach(function (name) {
        folderGrid.appendChild(createFolderCard(name, node.children[name], path));
      });
      browser.appendChild(folderGrid);
    }

    if (node.files.length) {
      var files = node.files.slice().sort(function (a, b) { return sortChinese(a.title, b.title); });
      addSectionTitle(browser, '当前文件夹', '文件', files.length);
      var fileGrid = makeElement('div', 'materials-grid');
      files.forEach(function (resource) { fileGrid.appendChild(createFileCard(resource)); });
      browser.appendChild(fileGrid);
    }
  }

  if (search) search.addEventListener('input', render);
  window.addEventListener('hashchange', render);
  render();

  var viewer = document.getElementById('resource-viewer');
  if (!viewer) return;

  var viewerTitle = document.getElementById('resource-viewer-title');
  var viewerBody = document.getElementById('resource-viewer-body');
  var viewerStatus = document.getElementById('resource-viewer-status');
  var viewerDownload = document.getElementById('resource-viewer-download');
  var lastTrigger = null;

  function showStatus(message, isError) {
    viewerStatus.textContent = message;
    viewerStatus.classList.toggle('is-error', Boolean(isError));
    viewerStatus.hidden = !message;
  }

  function closeViewer() {
    viewer.hidden = true;
    viewerBody.replaceChildren();
    document.body.classList.remove('resource-viewer-open');
    if (lastTrigger) lastTrigger.focus();
  }

  function createMedia(tagName, url, name) {
    var element = document.createElement(tagName);
    element.src = url;
    element.setAttribute('aria-label', name);
    if (tagName === 'iframe') element.title = name;
    if (tagName === 'audio' || tagName === 'video') element.controls = true;
    if (tagName === 'img') element.alt = name;
    return element;
  }

  async function openViewer(button) {
    var url = button.dataset.url;
    var previewType = button.dataset.preview;
    var name = button.dataset.name;

    lastTrigger = button;
    viewerTitle.textContent = name;
    viewerDownload.href = url;
    viewerDownload.setAttribute('download', name);
    viewerBody.replaceChildren();
    viewer.hidden = false;
    document.body.classList.add('resource-viewer-open');
    showStatus('正在加载…', false);

    try {
      if (previewType === 'pdf') {
        viewerBody.appendChild(createMedia('iframe', url + '#view=FitH', name));
        showStatus('', false);
      } else if (previewType === 'docx') {
        if (!window.docx || typeof window.docx.renderAsync !== 'function') throw new Error('DOCX 预览组件加载失败');
        var response = await fetch(url);
        if (!response.ok) throw new Error('文件读取失败');
        await window.docx.renderAsync(await response.arrayBuffer(), viewerBody, null, {
          className: 'docx-preview', inWrapper: true, breakPages: true,
          ignoreWidth: false, ignoreHeight: false, renderHeaders: true, renderFooters: true
        });
        showStatus('', false);
      } else if (previewType === 'text') {
        var textResponse = await fetch(url);
        if (!textResponse.ok) throw new Error('文件读取失败');
        var pre = document.createElement('pre');
        pre.textContent = await textResponse.text();
        viewerBody.appendChild(pre);
        showStatus('', false);
      } else if (previewType === 'image') {
        viewerBody.appendChild(createMedia('img', url, name));
        showStatus('', false);
      } else if (previewType === 'audio') {
        viewerBody.appendChild(createMedia('audio', url, name));
        showStatus('', false);
      } else if (previewType === 'video') {
        viewerBody.appendChild(createMedia('video', url, name));
        showStatus('', false);
      }
    } catch (error) {
      showStatus('预览失败，请下载原文件查看。', true);
      console.error(error);
    }
  }

  document.addEventListener('click', function (event) {
    var previewButton = event.target.closest('.material-preview');
    if (previewButton) openViewer(previewButton);
    if (event.target.closest('[data-viewer-close]')) closeViewer();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !viewer.hidden) closeViewer();
  });
})();
