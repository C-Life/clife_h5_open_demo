@echo off
rem   sleep
rem ============== 项目配置 ===================
rem 版本号
set version=v1.0.1
rem 自动刷新浏览器（yes/no）
set autorefresh=yes
rem ===========================================
set pa=%cd%
cd ../../
:redo
cmd /c start.cmd 3 %pa% %version% %autorefresh%
pause
goto redo
