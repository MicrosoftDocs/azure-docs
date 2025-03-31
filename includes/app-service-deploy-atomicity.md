---
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 01/07/2020
ms.author: cephalin
ms.custom: "include file"
---

## What happens to my app during deployment?

When you use officially supported deployment methods, changes are made to the files in your app's `/home/site/wwwroot` folder. These files are used to run your app. The deployment can fail because of locked files. The app might also behave unpredictably during deployment because the files aren't all updated at the same time. This behavior is undesirable for a customer-facing app.

There are a few ways to avoid these problems:

- [Run your app directly from the ZIP package](../articles/app-service/deploy-run-package.md), without unpacking it.
- Stop your app or enable offline mode during deployment. For more information, see [Deal with locked files during deployment](https://github.com/projectkudu/kudu/wiki/Dealing-with-locked-files-during-deployment).
- Deploy to a [staging slot](../articles/app-service/deploy-staging-slots.md) with [auto swap](../articles/app-service/deploy-staging-slots.md#configure-auto-swap) turned on.
