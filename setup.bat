@echo off
REM BondTerminal PRO - Next.js 项目初始化脚本 (Windows)
REM 用于快速设置和验证项目环境

setlocal enabledelayedexpansion

echo.
echo ================================
echo   BondTerminal PRO 初始化
echo ================================
echo.

REM 检查 Node.js
echo 检查 Node.js 版本...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js 未找到，请先安装 Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] 找到 %NODE_VERSION%
echo.

REM 检查 npm
echo 检查 npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm 未找到
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] 找到 npm %NPM_VERSION%
echo.

REM 检查 .env.local
echo 检查 .env.local 文件...
if exist ".env.local" (
    echo [OK] .env.local 已存在
    
    findstr /m "GEMINI_API_KEY=" .env.local >nul
    if errorlevel 1 (
        echo [!] GEMINI_API_KEY 未配置，请编辑 .env.local
    ) else (
        echo [OK] GEMINI_API_KEY 已配置
    )
) else (
    echo [!] .env.local 不存在，创建模板...
    (
        echo # Google Gemini API Key
        echo # 从 https://ai.google.dev 获取您的 API Key
        echo GEMINI_API_KEY=your_actual_gemini_api_key_here
    ) > .env.local
    echo [OK] .env.local 已创建
    echo [!] 请编辑 .env.local 并填入实际的 API Key
)
echo.

REM 安装依赖
echo 安装项目依赖...
call npm install
if errorlevel 1 (
    echo [X] npm install 失败
    pause
    exit /b 1
)
echo [OK] 依赖安装完成
echo.

REM 项目信息
echo ================================
echo   项目信息
echo ================================
echo.
echo [OK] 项目初始化完成！
echo.
echo 项目结构:
echo    - app\              : Next.js 应用文件
echo    - app\api\gemini\   : 后端 API 路由
echo    - lib\              : 工具库
echo    - .env.local        : 环境变量 (已忽略 Git)
echo.
echo 启动开发服务器:
echo    npm run dev
echo.
echo 重要文件:
echo    - README.md              : 完整使用文档
echo    - QUICKSTART.md          : 快速开始指南
echo    - COMPLETION_CHECKLIST.md : 项目完成清单
echo.
echo 安全提醒:
echo    - .env.local 已添加到 .gitignore
echo    - 绝不要将 .env.local 提交到 Git
echo    - 绝不要将 API Key 放在客户端代码中
echo.
echo ==================================
echo   下一步:
echo ==================================
echo.
echo 1. 编辑 .env.local，填入您的 GEMINI_API_KEY
echo 2. 运行: npm run dev
echo 3. 访问: http://localhost:3000
echo.
echo 祝您使用愉快！
echo.
pause
