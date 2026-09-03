'use strict';

const fs = require('fs');
const path = require('path');

const RESOURCE_ROOT = path.join(hexo.source_dir, 'course-materials', 'files');
const ALLOWED_EXTENSIONS = new Set([
  '.pdf', '.docx', '.doc', '.pptx', '.ppt', '.xlsx', '.xls',
  '.txt', '.md', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
  '.mp3', '.wav', '.ogg', '.mp4', '.webm', '.zip', '.rar', '.7z'
]);

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.')) return [];
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(absolutePath) : [absolutePath];
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function previewType(extension) {
  if (extension === '.pdf') return 'pdf';
  if (extension === '.docx') return 'docx';
  if (['.txt', '.md'].includes(extension)) return 'text';
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(extension)) return 'image';
  if (['.mp3', '.wav', '.ogg'].includes(extension)) return 'audio';
  if (['.mp4', '.webm'].includes(extension)) return 'video';
  return '';
}

hexo.extend.generator.register('course-materials', function courseMaterialsGenerator() {
  const resources = collectFiles(RESOURCE_ROOT)
    .map((absolutePath) => {
      const relativePath = path.relative(RESOURCE_ROOT, absolutePath);
      const segments = relativePath.split(path.sep);
      const filename = segments.pop();
      const extension = path.extname(filename).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(extension)) return null;

      const stat = fs.statSync(absolutePath);
      const encodedPath = [...segments, filename].map(encodeURIComponent).join('/');
      const root = hexo.config.root || '/';

      return {
        title: path.basename(filename, extension),
        filename,
        course: segments.length ? segments.join(' / ') : '未分类',
        extension: extension.slice(1).toUpperCase(),
        size: formatBytes(stat.size),
        updated: stat.mtime.toISOString().slice(0, 10),
        url: `${root}course-materials/files/${encodedPath}`.replace(/\/+/g, '/'),
        previewType: previewType(extension)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.course.localeCompare(b.course, 'zh-CN') || a.title.localeCompare(b.title, 'zh-CN'));

  const courses = [...new Set(resources.map((resource) => resource.course))];
  const types = [...new Set(resources.map((resource) => resource.extension))].sort();

  return {
    path: 'course-materials/index.html',
    layout: 'course-materials',
    data: { title: '课程资料', comments: false, resources, courses, types }
  };
});
