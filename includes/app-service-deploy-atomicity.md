---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 01/07/2020
ms.author: cephalin
ms.custom: "include file"
---

## What happens to my app during deployment?

All the officially supported deployment methods make changes to the files in the */home/site/wwwroot* folder of your app. These files are used to run your app. So the deployment can fail because of locked files. The app might also behave unpredictably during deployment because the files aren't all updated at the same time. This behavior is undesirable for a customer-facing app. There are a few ways to avoid these issues:

- [Run your app directly from the ZIP package](../articles/app-service/deploy-run-package.md), without unpacking it.
- Stop your app or enable offline mode for it during deployment. For more information, see [Deal with locked files during deployment](https://github.com/projectkudu/kudu/wiki/Dealing-with-locked-files-during-deployment).
- Deploy to a [staging slot](../articles/app-service/deploy-staging-slots.md) with [auto swap](../articles/app-service/deploy-staging-slots.md#configure-auto-swap) turned on. 
