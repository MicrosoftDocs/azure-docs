---
title: "include file"
description: "include file"
services: app-service
author: kraigb
ms.service: app-service
ms.topic: "include"
ms.date: 09/24/2020
ms.author: kraigb
ms.custom: "include file"
---

# [Bash](#tab/bash)

```bash
# Linux systems only
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Git Bash on Windows only
py -3 -m venv .venv
source .venv\\scripts\\activate
pip install -r requirements.txt
```

If you're on a Windows system and see the error "'source' is not recognized as an internal or external command," make sure you're either running in the Git Bash shell, or use the commands shown in the **Cmd** tab above.


# [PowerShell](#tab/powershell)

```powershell
py -3 -m venv .venv
.venv\scripts\activate
pip install -r requirements.txt
```

# [Cmd](#tab/cmd)

```cmd
py -3 -m venv .venv
.venv\scripts\activate
pip install -r requirements.txt
```

---   
