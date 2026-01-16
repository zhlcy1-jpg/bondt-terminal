# 🚀 Next.js 改造完成 - 快速启动指南

## ✅ 改造完成清单

您的 BondTerminal 项目已成功改造为 Next.js 前后端应用！

- ✅ Vite 迁移到 Next.js 15
- ✅ API Key 安全保护（后端存储）
- ✅ 前后端分离架构
- ✅ 后端 API 路由完成
- ✅ 前端客户端库配置
- ✅ TypeScript 类型完整
- ✅ Tailwind CSS 配置
- ✅ 环境变量管理

---

## 🔒 API Key 安全配置（最重要）

### 第一步：创建 `.env.local`

在项目根目录创建 `.env.local` 文件，内容如下：

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

⚠️ **重要提醒**：
- 替换 `your_actual_gemini_api_key_here` 为您的真实 API Key
- **绝不要**将此文件提交到 Git（已自动忽略）
- **绝不要**在客户端代码中使用 API Key

### 第二步：获取 API Key

1. 访问 [Google AI Studio](https://ai.google.dev)
2. 创建新的 API Key
3. 复制 Key 粘贴到 `.env.local`

---

## 📝 后端 API 路由

所有 AI 功能都通过后端 API 路由调用，确保 API Key 不泄露：

| 路由 | 功能 | 位置 |
|------|------|------|
| `/api/gemini/insight` | 交易员见解 | `app/api/gemini/insight/route.ts` |
| `/api/gemini/news` | 发行人新闻 | `app/api/gemini/news/route.ts` |
| `/api/gemini/macro` | 宏观策略 | `app/api/gemini/macro/route.ts` |
| `/api/gemini/background` | 发行人背景 | `app/api/gemini/background/route.ts` |
| `/api/gemini/financial` | 财务分析 | `app/api/gemini/financial/route.ts` |

---

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 开发模式运行（推荐）
npm run dev

# 生产构建
npm run build

# 生产模式运行
npm start
```

在浏览器打开：**http://localhost:3000**

---

## 📂 项目结构变化

### 删除了（Vite 相关）
```
❌ vite.config.ts
❌ index.html
❌ index.tsx
❌ App.tsx
```

### 新增了（Next.js 相关）
```
✅ app/layout.tsx              # 根布局
✅ app/page.tsx               # 首页
✅ app/api/gemini/*/route.ts  # 后端 API 路由
✅ .env.local                 # 环境变量（已忽略）
✅ next.config.ts             # Next.js 配置
```

### 保持不变（可继续使用）
```
✅ components/                # 旧的组件目录
✅ lib/                       # 工具库
✅ services/                  # 服务目录
✅ types.ts                   # 类型定义
✅ constants.ts               # 常量数据
```

---

## 🔌 前端如何调用后端 API

### ✅ 安全的方法（已实现）

在前端组件中使用 `apiService`：

```typescript
'use client';

import { apiService } from '@/lib/apiService';

export default function MyComponent() {
  // 调用后端 API 获取数据
  const insight = await apiService.getTraderInsight(bond);
  const news = await apiService.getIssuerNews('issuer', 'guarantor');
  const macro = await apiService.getMacroSummary(news);
  // ...
}
```

### ❌ 错误的方法（绝不要这样做）

```typescript
// ❌ 错误：直接调用 Gemini 或使用 API Key
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY  // ❌ 不行！会泄露到客户端
});
```

---

## 🧪 测试后端 API

### 使用 cURL

```bash
curl -X POST http://localhost:3000/api/gemini/news \
  -H "Content-Type: application/json" \
  -d '{"issuer":"美国财政部"}'
```

### 使用 REST Client

1. 在 VS Code 安装 REST Client 扩展
2. 创建 `test.http` 文件：

```http
POST http://localhost:3000/api/gemini/news
Content-Type: application/json

{
  "issuer": "美国财政部"
}
```

3. 点击 "Send Request"

---

## 📦 依赖包说明

### 关键依赖
- **next** - Next.js 框架
- **@google/genai** - Gemini API 客户端（仅在后端使用！）
- **react & react-dom** - React 库
- **recharts** - 图表库
- **tailwindcss** - CSS 框架

### 已安装的所有依赖见 `package.json`

---

## ⚙️ 环境变量

### 后端可访问（服务器端）
```
✅ GEMINI_API_KEY  # 在后端 API 路由中使用
```

### 前端无法访问（客户端）
```
❌ 任何使用 process.env.GEMINI_API_KEY 的尝试都会失败
```

这是 Next.js 的安全设计 - 只有 `/api` 路由可以访问后端环境变量。

---

## 🚀 下一步

### 1. 立即开始
```bash
npm install
npm run dev
```

### 2. 填入 API Key
编辑 `.env.local` 添加您的 GEMINI_API_KEY

### 3. 测试功能
打开 http://localhost:3000 查看应用

### 4. 部署到生产
参考完整 README.md 的部署章节

---

## 📚 完整文档

详细文档请查看 [README.md](README.md)

包含内容：
- API 端点文档
- 安全最佳实践
- 部署指南（Vercel、Docker、VPS）
- 故障排除
- 更多示例

---

## ✨ 安全架构总结

```
┌─ 用户浏览器 ─────────────┐
│  React 前端应用          │
│  ✅ 无法访问 API Key    │
│  ✅ 通过 HTTP 请求      │
└──────────┬───────────────┘
           │ POST /api/gemini/*
           ▼
┌─ Next.js 后端 ──────────┐
│  API 路由 (server-side)  │
│  ✅ 访问环境变量        │
│  ✅ 保护 API Key        │
└──────────┬───────────────┘
           │ 使用秘密 Key
           ▼
┌─ Google Gemini API ────┐
│  云端 AI 服务          │
│  ✅ 安全调用           │
└────────────────────────┘
```

---

## ❓ 常见问题

**Q: 如何知道 API Key 是否正确？**
A: 启动 `npm run dev`，访问应用，点击债券查看是否能加载分析数据。

**Q: `.env.local` 文件在哪？**
A: 应该在项目根目录（与 `package.json` 同级）

**Q: 能否在客户端代码中使用 API Key？**
A: 绝对不能！这会将 Key 暴露给所有用户。始终通过后端 API 代理。

**Q: 如何在生产环境设置 API Key？**
A: 在部署平台（Vercel、Docker 等）设置环境变量，不要提交 `.env.local`

---

## 🆘 遇到问题？

1. 检查 `.env.local` 是否存在和包含正确的 API Key
2. 确保运行了 `npm install`
3. 重启 `npm run dev`
4. 查看浏览器控制台和服务器日志
5. 参考完整 README.md 的故障排除章节

---

<div align="center">

**🎉 改造完成！现在您有了一个安全的 Next.js 应用！**

祝您使用愉快！

</div>
