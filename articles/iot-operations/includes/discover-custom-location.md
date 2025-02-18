---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 11/12/2024
ms.author: dobett
---

# [Bash](#tab/bash)

You can discover your custom location name by running the following command:

```bash
az iot ops list -g <your Azure resource group> --query "[0].extendedLocation.name" -o tsv | awk -F'/' '{print $NF}'
```

# [PowerShell](#tab/powershell)

You can discover your custom location name by running the following command:

```powershell
az iot ops list -g <your Azure resource group> --query "[0].extendedLocation.name" -o tsv) -split '/' | Select-Object -Last 1
```

---