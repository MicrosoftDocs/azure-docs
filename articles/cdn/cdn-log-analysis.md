---
title: Analyze Azure CDN usage patterns | Microsoft Docs
description: This article describes the different types of analysis reports available for Azure CDN products.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 95e18b3c-b987-46c2-baa8-a27a029e3076
ms.service: cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/05/2017
ms.author: magattus
---


# Analyze Azure CDN usage patterns

After you enable CDN for your application, you can monitor CDN usage, check the health of your delivery, and troubleshoot potential issues. Azure CDN provides these capabilities in the following ways: 

## Core analytics via Azure diagnostic logs

Core analytics is available for CDN endpoints for all pricing tiers. Azure diagnostics logs allow core analytics to be exported to Azure storage, event hubs, or Azure Log Analytics. Azure Log Analytics offers a solution with graphs that are user-configurable and customizable. For more information about Azure diagnostic logs, see [Azure diagnostic logs](cdn-azure-diagnostic-logs.md).

## Verizon core reports

As an Azure CDN user with an **Azure CDN Standard from Verizon** or **Azure CDN Premium from Verizon** profile, you can view Verizon core reports in the Verizon supplemental portal. Verizon core reports is accessible via the **Manage** option from the Azure portal and offers a variety of graphs and views. For more information, see [Core Reports from Verizon](cdn-analyze-usage-patterns.md).

## Verizon custom reports

As an Azure CDN user with an **Azure CDN Standard from Verizon** or **Azure CDN Premium from Verizon** profile, you can view Verizon custom reports in the Verizon supplemental portal. Verizon custom reports is accessible via the **Manage** option from the Azure portal. The Verizon custom reports page shows the number of hits or data transferred for each edge CName belonging to an Azure CDN profile. The data can be grouped by HTTP response code or cache status over any period of time. For more information, see [Custom Reports from Verizon](cdn-verizon-custom-reports.md).

## Azure CDN Premium from Verizon reports

With **Azure CDN Premium from Verizon**, you can also access the following reports:
   * [Advanced HTTP reports](cdn-advanced-http-reports.md)
   * [Real-time stats](cdn-real-time-stats.md)
   * [Edge node performance](cdn-edge-performance.md)

