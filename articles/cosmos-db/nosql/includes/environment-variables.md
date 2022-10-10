---
title: include file
description: include file
services: cosmos-db
author: seesharprun
ms.service: cosmos-db
ms.topic: include
ms.date: 09/22/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: include file, ignite-2022
---

To use the **URI** and **PRIMARY KEY** values within your code, persist them to new environment variables on the local machine running the application. To set the environment variable, use your preferred terminal to run the following commands:

#### [Windows](#tab/windows)

```powershell
$env:COSMOS_ENDPOINT = "<cosmos-account-URI>"
$env:COSMOS_KEY = "<cosmos-account-PRIMARY-KEY>"
```

#### [Linux / macOS](#tab/linux+macos)

```bash
export COSMOS_ENDPOINT="<cosmos-account-URI>"
export COSMOS_KEY="<cosmos-account-PRIMARY-KEY>"
```

---
