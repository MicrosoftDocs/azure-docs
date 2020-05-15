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

All the officially supported deployment methods make changes to the files in the `/home/site/wwwroot` folder of your app. These files are used to run your app. Therefore, the deployment can fail because of locked files. The app may also behave unpredictably during deployment, because not all the files updated at the same time. This is undesirable for a customer-facing app. There are a few different ways to avoid these issues:

- [Run your app from the ZIP package directly](../articles/app-service/deploy-run-package.md) without unpacking it.
- Stop your app or enable offline mode for your app during deployment. For more information, see [Deal with locked files during deployment](https://github.com/projectkudu/kudu/wiki/Dealing-with-locked-files-during-deployment).
- Deploy to a [staging slot](../articles/app-service/deploy-staging-slots.md) with [auto swap](../articles/app-service/deploy-staging-slots.md#configure-auto-swap) enabled. 
