---
title: Web Apps FAQ| Microsoft Docs
description: This article lists the more frequently asked questions in Azure Web Apps.
services: app-service\web
documentationcenter: ''
author: simonxjx
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 5/16/2017
ms.author: v-six

---
# More requently asked questions in Azure Web Apps
This topic provides answers to more requently asked questions in [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Why is Autoscale not working as expected?

If you have noticed that Autoscale has not scaled-in or scaled-out the web app instances as you expected, you may be running into a scenario where we intentionally choose not to scale to avoid an infinite loop due to flapping. This usually happens when there isn't adequate margin between the scale-out and scale-in thresholds. How to avoid flapping and other Autoscale best practices are explained in good detail at this [link](https://azure.microsoft.com/en-us/documentation/articles/insights-autoscale-best-practices/#autoscale-best-practices).

## Functions Preview Versions Deprecation

As discussed at https://blogs.msdn.microsoft.com/appserviceteam/2017/01/03/azure-functions-preview-versioning-update/ we recommend that you upgrade your Functions version to ~1 in the App Settings. The ~1 syntax means that you will use the latest version of the host with a major version of 1.
