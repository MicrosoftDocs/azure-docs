---
title: Azure Monitor rebranding | Microsoft Docs
description: Describes the recent branding and name changes recently made to Azure management services.
author: bwren
manager: carmonm
editor: tysonn
services: azure-monitor
documentationcenter: azure-monitor

ms.service: azure-monitor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/13/2018
ms.author: bwren

---

# Azure Monitor branding changes
This article describes the recent branding and name changes recently made to Azure management services. 

## Consolidation of monitoring services
Log Analytics and Application Insights have been consolidated into Azure Monitor to provide a single integrated experience for monitoring of Azure resources. No functionality has been removed from these services, and users can perform the same scenarios that they've always completed with no loss or compromise of any features.

Log Analytics will start to be referred to as Azure Logs to reflect its primary role as providing a repository for storing and indexing log data in addition to a sophisticated query language for retrieving and analyzing data. Some features such as Agents and [Views](../log-analytics/log-analytics-view-designer.md) that were associated with Log Analytics will be repositioned as features of Azure Monitor. Their functionality hasn't changed. 

Documentation for each of these services has been consolidated into a single set of content for Azure Monitor. This will assist the reader in finding all of the content for a particular monitoring scenario in a single location as opposed to having to reference multiple sets of content. As the consolidated service evolves, the content will become more integrated.


## Operations Management Suite
Operations Management Suite (OMS) was a bundling of the following Azure management services for licensing purposes:

- Application Insights
- Azure Automation
- Azure Backup
- Log Analytics
- Site Recovery

[New pricing has been introduced for these services](https://azure.microsoft.com/blog/introducing-a-new-way-to-purchase-azure-monitoring-services/), and the OMS bundling is no longer available for new customers. None of the services that were part of OMS have changed, except for the consolidation of Azure Monitor described above. Your focus should be on the management tasks that you need to perform and the different Azure services that work together for each task.

## Operations Management Suite (OMS) portal
The OMS portal was used to configure data sources, manage solutions, and analyze data stored in Log Analytics. All of this functionality has been moved to the Azure portal to provide a more consistent experience for monitoring and managing your Azure resources. The OMS portal can still be used but will be deprecated shortly. For details on this transition, see [OMS portal moving to Azure](../log-analytics/log-analytics-oms-portal-transition.md).

## Alerts
 

## Next steps

- Get an overview of [Azure Monitor](overview.md).