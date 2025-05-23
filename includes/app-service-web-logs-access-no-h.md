---
title: "Include file"
description: "Include file"
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: "include"
ms.date: 04/01/2025
ms.author: cephalin
ms.custom: "include file"
---

To access the console logs generated from inside your application code in App Service, turn on diagnostic logging by running the following command in [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp log config --resource-group <resource-group-name> --name <app-name> --docker-container-logging filesystem --level Verbose
```

Possible values for `--level` are `Error`, `Warning`, `Info`, and `Verbose`. Each subsequent level includes the previous level. For example, `Error` includes only error messages. `Verbose` includes all messages.

After you turn on diagnostic logging, run the following command to see the log stream:

```azurecli-interactive
az webapp log tail --resource-group <resource-group-name> --name <app-name>
```

If console logs don't appear immediately, check again in 30 seconds.

> [!NOTE]
> You can also inspect the log files from the browser at `https://<app-name>.scm.azurewebsites.net/api/logs/docker`. For recently created apps, use `https://<app-name>-<random-hash>.scm.<region>.azurewebsites.net/`.

To stop log streaming at any time, select **Ctrl**+**C**.
