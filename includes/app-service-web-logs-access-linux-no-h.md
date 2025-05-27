---
title: "Include file"
description: "Include file"
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: "include"
ms.date: 04/01/2025
ms.author: cephalin
ms.custom: include file, linux-related-content
---

You can access the console logs generated from inside the container.

To turn on container logging, run the following command:

```azurecli-interactive
az webapp log config --name <app-name> --resource-group <resource-group-name> --docker-container-logging filesystem
```

Replace `<app-name>` and `<resource-group-name>` with names that are appropriate for your web app.

After you turn on container logging, run the following command to see the log stream:

```azurecli-interactive
az webapp log tail --name <app-name> --resource-group <resource-group-name>
```

If console logs don't appear immediately, check again in 30 seconds.

To stop log streaming at any time, select **Ctrl**+**C**.
