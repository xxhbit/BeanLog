# BeanLog ☕

一个简洁的咖啡记录 PWA 应用，帮助你记录每一杯咖啡的豆子参数和风味感知。

## 功能

- **咖啡豆信息**：豆名、产地、处理法、品种、烘焙商
- **烘焙信息**：烘焙度、烘焙日期
- **冲煮参数**：冲煮方式、研磨度、粉量、水量、水温、萃取时间、粉水比
- **风味感知**：综合评分、酸/甜/醇/苦/余韵五维评分、风味标签、品鉴笔记
- **快速录入**：常用选项直接点选、最近使用的参数自动建议
- **数据管理**：CSV 导入导出，数据完全存储在本地浏览器
- **离线使用**：PWA 支持，安装后无需网络

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 技术栈

- React 19 + TypeScript
- Vite 6 + vite-plugin-pwa
- Tailwind CSS 4
- Dexie.js (IndexedDB)
- Papa Parse (CSV)
