---
title: include file
description: include file
services: app-service
author: ggailey777
ms.service: app-service
ms.topic: include
ms.date: 02/19/2019
ms.author: glenga
ms.custom: include file
---

> [!NOTE]
> A web app can time out after 20 minutes of inactivity. Only requests to the actual web app reset the timer. Viewing the app's configuration in the Azure portal or making requests to the advanced tools site (`https://<app_name>.scm.azurewebsites.net`) don't reset the timer. If your app runs continuous or scheduled WebJobs, enable **Always On** to ensure that the WebJobs run reliably. This feature is available only in the Basic, Standard, and Premium [pricing tiers](https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
