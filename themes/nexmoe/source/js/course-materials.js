(function () {
  'use strict';

  var search = document.getElementById('materials-search');
  var course = document.getElementById('materials-course');
  var type = document.getElementById('materials-type');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.material-card'));
  var noResult = document.getElementById('materials-no-result');
  var viewer = document.getElementById('resource-viewer');

  function filterMaterials() {
    var keyword = search ? search.value.trim().toLowerCase() : '';
    var selectedCourse = course ? course.value : '';
    var selectedType = type ? type.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.dataset.title + ' ' + card.dataset.course).toLowerCase();
      var matched = (!keyword || haystack.indexOf(keyword) !== -1) &&
        (!selectedCourse || card.dataset.course === selectedCourse) &&
        (!selectedType || card.dataset.type === selectedType);
      card.hidden = !matched;
      if (matched) visible += 1;
    });

    if (noResult) noResult.hidden = visible !== 0;
  }

  [search, course, type].forEach(function (control) {
    if (control) control.addEventListener(control === search ? 'input' : 'change', filterMaterials);
  });

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
