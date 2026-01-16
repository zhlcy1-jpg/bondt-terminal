# BondTerminal PRO - Next.js 前后端应用

<div align="center">
<h2>专业债券交易终端 | Professional Bond Trading Terminal</h2>
<p>✨ 使用 Next.js 构建 | AI 驱动的市场分析 | 安全的 API Key 管理</p>
</div>

---

## 🔒 安全性说明 (CRITICAL)

### API Key 保护机制
- ✅ **GEMINI_API_KEY 仅存储在后端** - 通过 `.env.local` 配置
- ✅ **前端从不知道 API Key** - 所有 AI 调用都通过后端 API 路由进行
- ✅ **后端 API 路由充当代理** - 前端请求 → 后端处理 → 使用秘密 Key 调用 Gemini
- ✅ **.env.local 自动忽略** - 已添加到 `.gitignore`，绝不泄露

### 请求流程示意图
```
┌──────────────────┐
│  前端应用        │
│  (无法访问Key)   │
└────────┬─────────┘
         │ HTTP POST
         ▼
┌──────────────────────┐
│  后端 API 路由       │ ◄─── 环境变量: GEMINI_API_KEY
│  /api/gemini/*       │
└────────┬─────────────┘
         │
         ▼ (使用秘密Key)
┌──────────────────┐
│  Google Gemini   │
│  API             │
└──────────────────┘
```

---

## 📋 环境配置

### 1️⃣ 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

```env
# Google Gemini API Key - 仅在后端使用，永不暴露给客户端
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2️⃣ 获取 API Key

- 访问 [Google AI Studio](https://ai.google.dev)
- 创建新的 API Key
- 复制 Key 到 `.env.local`

### ⚠️ 重要提醒

- **绝不要**将 API Key 提交到 Git
- **绝不要**在客户端代码中使用 API Key
- **绝不要**将 `.env.local` 分享给他人
- `.env.local` 已自动添加到 `.gitignore`

---

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式 (推荐用于开发)
```bash
npm run dev
```

打开浏览器访问：`http://localhost:3000`

### 生产构建
```bash
npm run build
npm start
```

---

## 📁 项目结构

```
bondterminal-pro/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 主页面 (首页)
│   ├── globals.css              # 全局样式
│   ├── components/              # React 组件
│   │   ├── MarketTicker.tsx     # 市场行情组件
│   │   ├── WatchlistTable.tsx   # 债券清单表格
│   │   ├── AnalysisPanel.tsx    # 分析面板
│   │   └── NewsFeed.tsx         # 新闻流
│   └── api/                      # 后端 API 路由
│       └── gemini/
│           ├── insight/route.ts       # 交易员见解 API ⭐
│           ├── news/route.ts          # 新闻 API ⭐
│           ├── macro/route.ts         # 宏观策略 API ⭐
│           ├── background/route.ts    # 发行人背景 API ⭐
│           └── financial/route.ts     # 财务分析 API ⭐
│
├── lib/                         # 工具库
│   ├── apiService.ts           # 前端 API 客户端 (无秘密信息)
│   └── geminiService.ts        # 后端 Gemini 服务 (使用秘密Key)
│
├── components/                  # 旧的组件目录 (可删除)
│   └── ...
│
├── services/                    # 旧的服务目录 (可删除)
│   └── ...
│
├── types.ts                     # TypeScript 类型定义
├── constants.ts                 # 应用常量数据
├── .env.local                   # ⭐ 环境变量 (已忽略, 不提交!)
├── .gitignore                   # Git 忽略规则
├── next.config.ts              # Next.js 配置
├── tailwind.config.ts          # Tailwind CSS 配置
├── postcss.config.js           # PostCSS 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖和脚本

```

---

## 🔌 后端 API 端点

所有端点都位于 `/api/gemini/*`，使用 POST 方法。

### 1️⃣ 交易员见解
**端点**: `POST /api/gemini/insight`

**请求体**:
```json
{
  "action": "getTraderInsight",
  "bond": {
    "id": "bond-001",
    "ticker": "US12345",
    "issuer": "公司名称",
    "yield": 4.5,
    "ratings": {
      "moodys": "Baa1",
      "snp": "BBB+",
      "fitch": "BBB"
    }
  }
}
```

**响应**:
```json
{
  "insight": "资深债券交易员分析内容..."
}
```

---

### 2️⃣ 发行人新闻
**端点**: `POST /api/gemini/news`

**请求体**:
```json
{
  "issuer": "美国财政部",
  "guarantor": "可选的担保人名称"
}
```

**响应**:
```json
{
  "news": [
    {
      "id": "gen-xxx",
      "timestamp": "14:30",
      "date": "2026-01-16",
      "title": "发行人新闻标题",
      "summary": "新闻摘要内容",
      "sentiment": "neutral",
      "impact": "medium",
      "tags": ["TAG1", "TAG2"]
    }
  ]
}
```

---

### 3️⃣ 宏观策略
**端点**: `POST /api/gemini/macro`

**请求体**:
```json
{
  "news": [
    {
      "id": "news-001",
      "title": "新闻标题",
      "summary": "新闻摘要"
    }
  ]
}
```

**响应**:
```json
{
  "macro": "根据市场新闻分析的宏观策略建议..."
}
```

---

### 4️⃣ 发行人背景
**端点**: `POST /api/gemini/background`

**请求体**:
```json
{
  "issuer": "公司名称",
  "guarantor": "可选的担保人"
}
```

**响应**:
```json
{
  "background": "公司背景和信用分析信息..."
}
```

---

### 5️⃣ 财务分析
**端点**: `POST /api/gemini/financial`

**请求体**:
```json
{
  "issuer": "公司名称"
}
```

**响应**:
```json
{
  "analysis": {
    "totalAssets": "1,234,567",
    "totalLiabilities": "567,890",
    "debtRatio": "45.5%",
    "currentRatio": "1.8",
    "grossMargin": "32.1%",
    "netMargin": "12.5%",
    "reportDate": "2023年年报"
  }
}
```

---

## 📱 前端 API 客户端使用

在任何前端组件中使用 `apiService` 调用后端 API：

```typescript
'use client';

import { apiService } from '@/lib/apiService';
import { Bond, NewsItem } from '@/types';

export default function MyComponent() {
  // 获取交易员见解
  const insight = await apiService.getTraderInsight(bond as Bond);
  
  // 获取新闻
  const news = await apiService.getIssuerNews('美国财政部', '可选担保人');
  
  // 获取宏观策略
  const macro = await apiService.getMacroSummary(news as NewsItem[]);
  
  // 获取发行人背景
  const background = await apiService.getIssuerBackground('公司名', '担保人');
  
  // 获取财务分析
  const analysis = await apiService.getFinancialAnalysis('公司名');
}
```

---

## 🧪 测试 API

### 使用 cURL
```bash
# 测试宏观策略
curl -X POST http://localhost:3000/api/gemini/macro \
  -H "Content-Type: application/json" \
  -d '{"news": []}'

# 测试新闻
curl -X POST http://localhost:3000/api/gemini/news \
  -H "Content-Type: application/json" \
  -d '{"issuer": "美国财政部"}'
```

### 使用 VS Code REST Client 扩展

创建 `test.http` 文件：

```http
### 获取新闻
POST http://localhost:3000/api/gemini/news
Content-Type: application/json

{
  "issuer": "美国财政部"
}

### 获取宏观策略
POST http://localhost:3000/api/gemini/macro
Content-Type: application/json

{
  "news": []
}

### 获取背景信息
POST http://localhost:3000/api/gemini/background
Content-Type: application/json

{
  "issuer": "中国银行",
  "guarantor": "中国政府"
}
```

右键选择 "Send Request" 来测试

### 使用 Postman

1. 导入本项目（或手动创建请求）
2. 设置请求方法为 POST
3. 设置 URL：`http://localhost:3000/api/gemini/news`
4. Headers: `Content-Type: application/json`
5. Body (JSON):
   ```json
   {
     "issuer": "美国财政部"
   }
   ```

---

## 📦 依赖说明

### 核心依赖
- **next** (v15.x) - 全栈 React 框架
- **react** (v19.x) - UI 库
- **react-dom** (v19.x) - DOM 渲染
- **@google/genai** (v1.37.0) - Google Gemini API 客户端 ⭐

### UI 和样式
- **recharts** (v3.6.0) - React 图表库
- **tailwindcss** (v3.4.0) - 功能型 CSS 框架
- **autoprefixer** (v10.4.0) - CSS 供应商前缀

### 开发工具
- **typescript** (v5.8.2) - TypeScript 编译器
- **@types/node** (v22.14.0) - Node.js 类型定义
- **@types/react** (v19.0.0) - React 类型定义
- **@types/react-dom** (v19.0.0) - React DOM 类型定义

---

## 🛠️ 构建和部署

### Vercel (推荐)

Vercel 是 Next.js 的官方托管服务，最简单的部署方式：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

在 Vercel 仪表板配置环境变量：
1. 项目设置 → 环境变量
2. 添加 `GEMINI_API_KEY` = your_actual_key

### Docker

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

运行：
```bash
docker build -t bondterminal .
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  bondterminal
```

### 传统 VPS 部署

```bash
# 1. SSH 到服务器
ssh user@your-server.com

# 2. 克隆项目
git clone your-repo.git
cd your-repo

# 3. 安装依赖并构建
npm install
npm run build

# 4. 设置环境变量
echo "GEMINI_API_KEY=your_key" > .env.local

# 5. 使用 PM2 启动
npm install -g pm2
pm2 start "npm start" --name "bondterminal"
pm2 save
```

---

## ✨ 主要功能特性

- 🎯 **实时债券监控** - 动态更新的债券清单
- 🤖 **AI 驱动分析** - Google Gemini 提供智能见解
- 📊 **数据可视化** - 交互式图表和趋势分析
- 📰 **实时新闻** - 市场新闻聚合和分析
- 💰 **财务分析** - 发行人财务数据深度分析
- 📈 **宏观策略** - AI 生成的交易策略建议
- 🔐 **企业级安全** - API Key 完全保护

---

## 🔍 故障排除

### 问题 1: API Key 错误

**错误信息**: `GEMINI_API_KEY environment variable is not set`

**解决方案**:
1. 检查 `.env.local` 文件是否存在
2. 检查 API Key 是否有效
3. 重启开发服务器: `npm run dev`

### 问题 2: API 请求失败

**错误信息**: `Internal server error` 或 `Failed to fetch`

**解决方案**:
1. 确认后端服务运行正常: `npm run dev`
2. 检查浏览器控制台错误信息
3. 检查 API 响应状态码
4. 查看服务器日志中的详细错误

### 问题 3: 前端无法调用 API

**症状**: 网络请求卡住或超时

**解决方案**:
1. 确认 API 路由文件存在: `app/api/gemini/*/route.ts`
2. 检查路由是否导出 POST 函数
3. 确认 API 端点 URL 正确
4. 检查防火墙/代理设置

---

## 📚 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Google Gemini API 文档](https://ai.google.dev/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React 文档](https://react.dev)

---

## 🤝 安全最佳实践

✅ **已实现**:
- [x] 环境变量管理 (`.env.local`)
- [x] Git 忽略规则 (`.gitignore`)
- [x] 后端 API 代理
- [x] 错误处理

🔜 **建议补充实现**:
- [ ] 请求速率限制 (Rate Limiting)
- [ ] 身份验证 (Authentication)
- [ ] 授权检查 (Authorization)
- [ ] CORS 配置
- [ ] 输入验证和消毒
- [ ] 日志和监控
- [ ] API 文档 (Swagger/OpenAPI)

---

## 📝 更新日志

### v2.0.0 - Next.js 迁移
- ✨ 迁移到 Next.js 15 框架
- ✨ 实现完整的前后端分离架构
- 🔒 API Key 安全性改进
- 🚀 性能优化和 SEO 改进
- 📚 完整的文档和示例

### v1.0.0 - Vite 版本
- 初始发布

---

## 📧 支持和反馈

如有问题或建议，请：
1. 检查本 README 的故障排除部分
2. 查看项目日志和浏览器控制台
3. 创建 GitHub Issue
4. 联系技术支持

---

<div align="center">

**[⬆ 回到顶部](#bondterminal-pro---nextjs-前后端应用)**

最后更新: 2026 年 1 月

Made with ❤️ using Next.js and Google Gemini

</div>
