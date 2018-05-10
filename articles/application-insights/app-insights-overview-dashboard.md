---
title: Application Insights Overview Dashboard | Microsoft Docs
description: Monitor applications with Azure Application Insights and Overview Dashboard functionality.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 05/10/2018
ms.author: mbullwin

---

# Overview dashboard (preview)

Application Insights has always provided a summary overview pane to allow quick, at-a-glance assessment of your application's health and performance. Starting on May 15, 2018 a new faster more flexible experience will be released as a preview. On May 29, 2018 the classic overview experience will be retired.

## How do I test out the new experience?

On May 15, the new experience will begin to show up in Application Insights under: _Investigate_ > _Overview (preview)_.

![Overview Preview](.\media\app-insights-overview-dashboard\01.png)

This will launch the new default overview dashboard:

![Overview Preview Pane](.\media\app-insights-overview-dashboard\02.png)

## What has changed?

Time range selection has been simplified to a simple one-click interface.

![Time range](.\media\app-insights-overview-dashboard\04.png)

Overall performance has been greatly increased. Each default dynamically updating KPI tile is linked to the corresponding Application Insights feature. For example, selecting failed requests will launch the _Failures_ pane:

![Failures](.\media\app-insights-overview-dashboard\03.png)

The most recent iteration of the classic overview experience locked down the tiles preventing user customization. With this new preview release the _Pin parts_ button allows you to expand and customize to give deeper insight into the health and performance of your application.

So whereas before you were limited to:

![Classic Overview](.\media\app-insights-overview-dashboard\05.png)

Now you can expand to the same level previously only available in the Azure dashboard view:

![Dashboard view](.\media\app-insights-overview-dashboard\06.png)
