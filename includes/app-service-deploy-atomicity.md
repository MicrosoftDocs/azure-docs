---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 06/12/2019
ms.author: cephalin
ms.custom: "include file"
---

## What happens to my app during deployment?

All the officially supported deployment methods make changes to the files in the `/home/site/wwwroot` folder of your app. These files are the same ones that are run in production. Therefore, the deployment can fail because of locked files. The app in production may also behave unpredictably during deployment, because not all the files updated at the same time. There are a few different ways to avoid these issues:

- Stop your app or enable offline mode for your app during deployment. For more information, see [Deal with locked files during deployment](https://github.com/projectkudu/kudu/wiki/Dealing-with-locked-files-during-deployment).
- Deploy to a [staging slot](../articles/app-service/deploy-staging-slots.md) with [auto swap](../articles/app-service/deploy-staging-slots.md#configure-auto-swap) enabled. 
- Use [Run From Package](https://github.com/Azure/app-service-announcements/issues/84) instead of continuous deployment.
