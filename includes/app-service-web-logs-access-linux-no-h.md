---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 03/27/2019
ms.author: cephalin
ms.custom: "include file"
---

You can access the console logs generated from inside the container.

First, turn on container logging by running the following command:

```azurecli-interactive
az webapp log config --name <app-name> --resource-group <resource-group-name> --docker-container-logging filesystem
```

Replace `<app-name>` and `<resource-group-name>` with the names appropriate for your web app.

Once container logging is turned on, run the following command to see the log stream:

```azurecli-interactive
az webapp log tail --name <app-name> --resource-group <resource-group-name>
```

If you don't see console logs immediately, check again in 30 seconds.

To stop log streaming at any time, type **Ctrl**+**C**.

You can also inspect the log files in a browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`.
