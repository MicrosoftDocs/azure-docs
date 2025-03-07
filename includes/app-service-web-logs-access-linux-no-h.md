---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: "include"
ms.date: 03/06/2025
ms.author: cephalin
ms.custom: include file, linux-related-content
---

You can access the console logs generated from inside the container.

To turn on container logging, run the following command:

```azurecli-interactive
az webapp log config --name <app-name> --resource-group <resource-group-name> --docker-container-logging filesystem
```

Replace *\<app-name>* and *\<resource-group-name>* with the names appropriate for your web app.

After you turn on container logging, run the following command to see the log stream:

```azurecli-interactive
az webapp log tail --name <app-name> --resource-group <resource-group-name>
```

If you don't see console logs immediately, check again in 30 seconds.

To stop log streaming at any time, type **Ctrl**+**C**.

You can also inspect the log files in a browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`.
