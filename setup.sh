#!/bin/bash
# BondTerminal PRO - Next.js 项目初始化脚本
# 用于快速设置和验证项目环境

set -e

echo "================================"
echo "  BondTerminal PRO 初始化"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
echo "🔍 检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未找到，请先安装 Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ 找到 $NODE_VERSION${NC}"
echo ""

# 检查 npm
echo "🔍 检查 npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未找到${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ 找到 npm $NPM_VERSION${NC}"
echo ""

# 检查 .env.local
echo "🔍 检查 .env.local 文件..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local 已存在${NC}"
    
    # 检查 GEMINI_API_KEY
    if grep -q "GEMINI_API_KEY=" .env.local; then
        echo -e "${GREEN}✅ GEMINI_API_KEY 已配置${NC}"
    else
        echo -e "${YELLOW}⚠️  GEMINI_API_KEY 未配置，请编辑 .env.local${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local 不存在，创建模板...${NC}"
    cat > .env.local << EOF
# Google Gemini API Key
# 从 https://ai.google.dev 获取您的 API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here
EOF
    echo -e "${GREEN}✅ .env.local 已创建${NC}"
    echo -e "${YELLOW}⚠️  请编辑 .env.local 并填入实际的 API Key${NC}"
fi
echo ""

# 安装依赖
echo "📦 安装项目依赖..."
npm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 项目信息
echo "================================"
echo "  项目信息"
echo "================================"
echo ""
echo -e "${GREEN}✅ 项目初始化完成！${NC}"
echo ""
echo "📁 项目结构:"
echo "   - app/              → Next.js 应用文件"
echo "   - app/api/gemini/   → 后端 API 路由"
echo "   - lib/              → 工具库"
echo "   - .env.local        → 环境变量 (已忽略 Git)"
echo ""
echo "🚀 启动开发服务器:"
echo "   npm run dev"
echo ""
echo "📝 重要文件:"
echo "   - README.md              → 完整使用文档"
echo "   - QUICKSTART.md          → 快速开始指南"
echo "   - COMPLETION_CHECKLIST.md → 项目完成清单"
echo ""
echo "🔒 安全提醒:"
echo "   - .env.local 已添加到 .gitignore"
echo "   - 绝不要将 .env.local 提交到 Git"
echo "   - 绝不要将 API Key 放在客户端代码中"
echo ""
echo "===================================="
echo "  下一步:"
echo "===================================="
echo ""
echo "1️⃣  编辑 .env.local，填入您的 GEMINI_API_KEY"
echo "2️⃣  运行: npm run dev"
echo "3️⃣  访问: http://localhost:3000"
echo ""
echo -e "${GREEN}祝您使用愉快！🎉${NC}"
echo ""
