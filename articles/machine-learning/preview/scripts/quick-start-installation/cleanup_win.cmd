REM cleanup_win.cmd
REM Copyright (c) Microsoft. All rights reserved.

taskkill /F /IM AmlWorkbench.exe /T

REM sleep and wait till the process dies
timeout 5

REM delete local folders
rmdir /S /Q %LOCALAPPDATA%\amlworkbench
rmdir /S /Q %LOCALAPPDATA%\amlinstaller
rmdir /S /Q %APPDATA%\AmlWorkbench