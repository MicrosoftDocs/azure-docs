---
title: Analyze Azure CDN usage patterns
description: This article describes the different types of analysis reports available for Azure CDN products.
services: cdn
author: duongau
manager: KumudD
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/27/2023
ms.author: duau
---


# Analyze Azure CDN usage patterns

After you enable CDN for your application, you can monitor CDN usage, check the health of your delivery, and troubleshoot potential issues. Azure CDN provides these capabilities in the following ways: 

## Raw logs for Azure CDN from Microsoft
With a Standard Microsoft profile, you can enable raw logs and select to stream logs to:

* Azure Storage
* Event hubs
* Azure Log Analytics

With Azure Log Analytics you can view monitoring metrics, and set up alerts. 

For more information, see [Azure CDN HTTP raw logs](monitoring-and-access-log.md).


## Core analytics via Azure diagnostic logs

Core analytics is available for CDN endpoints for all pricing tiers. Azure diagnostics logs allow core analytics to be exported to Azure storage, event hubs, or Azure Monitor logs. Azure Monitor logs offers a solution with graphs that are user-configurable and customizable. For more information about Azure diagnostic logs, see [Azure diagnostic logs](cdn-azure-diagnostic-logs.md).

<a name='verizon-core-reports'></a>

## Edgio core reports

**Azure CDN Standard from Edgio** or **Azure CDN Premium from Edgio** profiles provide core reports. You can view core reports in the Edgio supplemental portal. Edgio core reports are accessible via the **Manage** option from the Azure portal and offers different kinds of graphs and views. For more information, see [Core Reports from Edgio](cdn-analyze-usage-patterns.md).

<a name='verizon-custom-reports'></a>

## Edgio custom reports

**Azure CDN Standard from Edgio** or **Azure CDN Premium from Edgio** profiles provide custom reports. You can view custom reports in the Edgio supplemental portal. Edgio custom reports are accessible via the **Manage** option from the Azure portal. 

The custom reports display the number of hits or data transferred for each edge CNAME. Data gets grouped by HTTP response code or cache status over period of time. For more information, see [Custom Reports from Edgio](cdn-verizon-custom-reports.md).

<a name='azure-cdn-premium-from-verizon-reports'></a>

## Azure CDN Premium from Edgio reports

With **Azure CDN Premium from Edgio**, you can also access the following reports:
   * [Advanced HTTP reports](cdn-advanced-http-reports.md)
   * [Real-time stats](cdn-real-time-stats.md)
   * [Azure CDN edge node performance](cdn-edge-performance.md)

## Next steps
In this article, you learned about the different options for analysis reports for Azure CDN.

For more information on Azure CDN and the other Azure services mentioned in this article, see:

* [What is Azure CDN?](cdn-overview.md)
* [Azure CDN HTTP raw logs](monitoring-and-access-log.md)
