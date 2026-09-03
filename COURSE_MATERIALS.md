# 课程资料上传说明

1. 打开 `source/course-materials/files/`。
2. 每门课程新建一个文件夹，例如 `复变函数/`、`高等数学/`。
3. 把 PDF、DOCX 或其他资料文件放入对应课程文件夹。
4. 在项目根目录运行 `npm run build` 生成网站；本地查看可运行 `npm run server`。
5. 将改动提交并推送到 GitHub，等待 GitHub Pages 自动更新。

页面会自动使用文件夹名作为课程分类，使用文件名（不含扩展名）作为资料标题。无需手工修改网页。

## 在线预览支持

- 可直接预览：PDF、DOCX、TXT、Markdown、PNG/JPG/GIF/WebP/SVG、MP3/WAV/OGG、MP4/WebM。
- 可下载但不直接预览：DOC、PPT/PPTX、XLS/XLSX、ZIP/RAR/7Z。

建议避免上传含隐私或版权受限的资料；推送到公开仓库的文件将公开可访问。
