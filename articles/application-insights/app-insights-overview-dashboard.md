---
title: Azure Application Insights Overview Dashboard | Microsoft Docs
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
ms.topic: conceptual
ms.date: 05/10/2018
ms.author: mbullwin

---

# Application Insights Overview dashboard (preview)

Application Insights has always provided a summary overview pane to allow quick, at-a-glance assessment of your application's health and performance. The new preview overview dashboard provides a faster more flexible experience.

## How do I test out the new experience?

 In Application Insights under: _Overview_, select _Please try new Overview before it becomes the default experience_.

![Overview Preview](.\media\app-insights-overview-dashboard\app-insights-overview-dashboard-01.png)

This will launch the new default overview dashboard:

![Overview Preview Pane](.\media\app-insights-overview-dashboard\app-insights-overview-dashboard-02.png)

## Better performance

Time range selection has been simplified to a simple one-click interface.

![Time range](.\media\app-insights-overview-dashboard\app-insights-overview-dashboard-03.png)

Overall performance has been greatly increased. Each default dynamically updating KPI tile is linked to the corresponding Application Insights feature. For example, selecting failed requests will launch the _Failures_ pane:

![Failures](.\media\app-insights-overview-dashboard\app-insights-overview-dashboard-04.png)

## Application dashboard

Application dashboard leverages the existing dashboard technology within Azure to provide a fully customizable single pane view of your application health and performance.

To access the default dashboard select _Application Dashboard_ in the upper left corner.

![Dashboard view](.\media\app-insights-overview-dashboard\app-insights-overview-dashboard-05.png)

If this is your first time accessing the dashboard it will launch a default view:

![Dashboard view](.\media\app-insights-overview-dashboard\app-insights-overview-dashboard-06.png)

While you can keep the default view if you like it, you can also add, and delete from the dashboard to best fit the needs of your team.

> [!NOTE]
> All users with access to the Application Insights resource share the same Application dashboard experience. Changes made by one user will modify the view for all users.

To navigate back to the overview experience just select:

![Overview Button](.\media\app-insights-overview-dashboard\app-insights-overview-dashboard-07.png)

## Next steps

- [Funnels](usage-funnels.md)
- [Retention](app-insights-usage-retention.md)
- [User Flows](app-insights-usage-flows.md)
- [Dashboards](app-insights-dashboards.md)
