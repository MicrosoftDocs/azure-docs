---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: app-service
ms.topic: "include"
ms.date: 06/08/2018
ms.author: cephalin
ms.custom: "include file"
---

## What happens to my app during deployment?

All the officially supported deployment methods have one thing in common: they make changes to the files in the `/site/home/wwwroot` folder of your app. These are the same files that are run in production. Therefore, the deployment can fail due to locked files, or the app in production may have unpredictable behavior during deployment because not all the files are updated simultaneously. There are a few different ways to avoid these issues:

- Stop your app or enable offline mode for your app during deployment. For more information, see [Dealing with locked files during deployment](https://github.com/projectkudu/kudu/wiki/Dealing-with-locked-files-during-deployment).
- Deploy to a [staging slot](../articles/app-service/web-sites-staged-publishing.md) with [auto swap](../articles/app-service/web-sites-staged-publishing.md#configure-auto-swap) enabled. 
- Use [Run From Package](https://github.com/Azure/app-service-announcements/issues/84) instead.
