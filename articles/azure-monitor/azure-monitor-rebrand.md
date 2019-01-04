---
title: Azure Monitor rebranding | Microsoft Docs
description: Describes the recent branding and name changes recently made to Azure management services.
author: bwren
manager: carmonm
editor: tysonn
services: azure-monitor
documentationcenter: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/22/2018
ms.author: bwren
---

# Azure Monitor branding changes
This article describes the recent branding and name changes recently made to Azure management services. 


## Consolidation of monitoring services into Azure Monitor
Log Analytics and Application Insights have been consolidated into Azure Monitor to provide a single integrated experience for monitoring Azure resources and hybrid environments. No functionality has been removed from these services, and users can perform the same scenarios that they've always completed with no loss or compromise of any features.

Documentation for each of these services has been consolidated into a single set of content for Azure Monitor. This will assist the reader in finding all of the content for a particular monitoring scenario in a single location as opposed to having to reference multiple sets of content. As the consolidated service evolves, the content will become more integrated.

## Log Analytics redefinition
Log Analytics has played a central role in Azure management by collecting telemetry and other data from a variety of sources and providing a query language and analytics engine that gives you insights into the operation of your applications and resources. 

This critical role hasn't changed, but is now considered the logs feature of Azure Monitor. Other features that were considered part of Log Analytics such as agents and views have also been repositioned as features of Azure Monitor. Their functionality hasn't changed other than potential improvements to their experience in the Azure portal.

The term Log Analytics now applies to the page in the Azure portal used to write and run queries and analyze log data. It's the functional equivalent of Metrics Analytics which is the page in the Azure portal used to analyze metric data.

## Metrics explorer is now metrics analytics
The tool in the Azure portal used to graph and analyze metrics collected by Azure Monitor has been renamed from metrics explorer to metrics analytics. This is the same tool, but the new name provides better consistency with log analytics. Use log analytics to analyze your log data and metrics analytics to analyze your metric data.

## Log query language
Azure Monitor uses Data Explorer query language for log queries. Before Azure Data Explorer was released, this language was referred to as Kusto or the Azure Monitor query language. We're now referring to it with the same name as Data Explorer to reinforce that they use the same language. There are minor differences with the Azure Monitor flavor of the language as detailed in [Azure Monitor log query language differences](log-query/data-explorer-difference.md).

## Application Insights
Application Insights was a standalone service before being integrated with Azure Monitor. We considered renaming it to follow the convention of other insights such as [Azure Monitor for containers]() and [Azure Monitor for VMs](). The decision was made to keep the name Application Insights because of its strong legacy. It's still considered the peer of these insights tools.

## Retirement of Operations Management Suite brand
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