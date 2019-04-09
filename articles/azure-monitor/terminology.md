---
title: Azure Monitor terminology updates | Microsoft Docs
description: Describes recent terminology changes made to Azure monitoring services.
author: bwren
manager: carmonm
editor: tysonn
services: azure-monitor
documentationcenter: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/18/2019
ms.author: bwren
---

# Azure Monitor naming and terminology changes
Significant changes have been made to Azure Monitor recently, with different services being consolidated in order to simplify monitoring for Azure customers. This article describes recent name and terminology changes in Azure Monitor documentation.

## February 2019 - Log Analytics terminology
After the consolidation of different services under Azure Monitor, we're taking the next step by modifying terminology in our documentation to better describe the Azure Monitor service and its different components. 

### Log Analytics
Azure Monitor log data is still stored in a Log Analytics workspace and is still collected and analyzed by the same Log Analytics service, but we are changing the term _Log Analytics_ in many places to _Azure Monitor logs_. This term better reflects its role in Azure Monitor and provides better consistency [metrics in Azure Monitor](platform/data-platform-metrics.md).

The term _log analytics_ now primarily applies to the page in the Azure portal used to write and run queries and analyze log data. It's the functional equivalent of [metrics explorer](platform/metrics-charts.md), which is the page in the Azure portal used to analyze metric data.

### Log Analytics workspaces
[Workspaces](platform/manage-access.md) that hold log data in Azure Monitor are still referred to as Log Analytics workspaces. The **Log Analytics** menu in the Azure portal has been renamed to **Log Analytics workspaces** and is where you [create new workspaces](learn/quick-create-workspace.md) and configure data sources. Analyze your logs and other monitoring data in **Azure Monitor** and configure your workspace in **Log Analytics workspaces**.

### Management solutions
[Management solutions](insights/solutions.md) have been renamed to _monitoring solutions_, which better describes their functionality.


## August 2018 - Consolidation of monitoring services into Azure Monitor
Log Analytics and Application Insights have been consolidated into Azure Monitor to provide a single integrated experience for monitoring Azure resources and hybrid environments. No functionality has been removed from these services, and users can perform the same scenarios that they've always completed with no loss or compromise of any features.

Documentation for each of these services has been consolidated into a single set of content for Azure Monitor. This will assist the reader in finding all of the content for a particular monitoring scenario in a single location as opposed to having to reference multiple sets of content. As the consolidated service evolves, the content will become more integrated.

Other features that were considered part of Log Analytics such as agents and views have also been repositioned as features of Azure Monitor. Their functionality hasn't changed other than potential improvements to their experience in the Azure portal.


## April 2018 - Retirement of Operations Management Suite brand
Operations Management Suite (OMS) was a bundling of the following Azure management services for licensing purposes:

- Application Insights
- Azure Automation
- Azure Backup
- Log Analytics
- Site Recovery

[New pricing has been introduced for these services](https://azure.microsoft.com/blog/introducing-a-new-way-to-purchase-azure-monitoring-services/), and the OMS bundling is no longer available for new customers. None of the services that were part of OMS have changed, except for the consolidation into Azure Monitor described above. 




## Next steps

- Read an [overview of Azure Monitor](overview.md) that describes its different components and features.
- Learn about the [transition of the OMS portal](../log-analytics/log-analytics-oms-portal-transition.md).