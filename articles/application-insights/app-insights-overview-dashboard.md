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

## Better performance

Time range selection has been simplified to a simple one-click interface.

![Time range](.\media\app-insights-overview-dashboard\04.png)

Overall performance has been greatly increased. Each default dynamically updating KPI tile is linked to the corresponding Application Insights feature. For example, selecting failed requests will launch the _Failures_ pane:

![Failures](.\media\app-insights-overview-dashboard\03.png)

## Application dashboard

Application dashboard leverages the existing dashboard technology within Azure to provide a fully customizable single pane view of your application health and performance.

To access the default dashboard select _Application Dashboard_ in the upper left corner.

![Dashboard view](.\media\app-insights-overview-dashboard\0009.png)

If this is your first time accessing the dashboard it will launch a default view:

![Dashboard view](.\media\app-insights-overview-dashboard\06.png)

While you can keep the default view if you like it, you can also add, and delete from the dashboard to best fit the needs of your team.

To navigate back to the overview experience just select:

![Overview Button](.\media\app-insights-overview-dashboard\07.png)

There is also a new button called _Pin Parts_.

![Overview Button](.\media\app-insights-overview-dashboard\008.png)

This replicates a little known feature from the classic overview that allows you to take any of the tiles from the old overview experience _(Alerts, Availability, Live Metrics, Usage, Proactive Detections, and Application Map)_ and add them into custom dashboards. 

In the case of the default _Application Dashboard_ we have already added these tiles. But if you create additional custom dashboards, or if someone on your team deletes a classic tile and you want to add it back, _Pin parts_ provides that functionality in any easy to find place.
