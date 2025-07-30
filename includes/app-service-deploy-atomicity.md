---
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 06/11/2025
ms.author: cephalin
ms.custom: "include file"
---

### What happens to my app during deployment that can cause failure or unpredictable behavior?

Officially supported deployment methods make changes to files in the */home/site/wwwroot* folder that are used to run your app. The deployment can fail because of locked files. The app might also behave unpredictably during deployment if the files aren't all updated at the same time, which is undesirable for a customer-facing app.

There are a few ways to avoid these problems.

- [Run your app directly from the ZIP package](../articles/app-service/deploy-run-package.md) without unpacking it.
- Stop your app or enable offline mode during deployment. For more information, see [Deal with locked files during deployment](https://github.com/projectkudu/kudu/wiki/Dealing-with-locked-files-during-deployment).
- Deploy to a [staging slot](../articles/app-service/deploy-staging-slots.md) with [auto swap](../articles/app-service/deploy-staging-slots.md#configure-auto-swap) turned on.
