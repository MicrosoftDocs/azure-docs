---
title: Cost optimization in Azure Monitor
description: Recommendations for reducing costs in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/12/2024
ms.reviewer: bwren
---

# Cost optimization in Azure Monitor

Cost optimization refers to ways to reduce unnecessary expenses and improve operational efficiencies. You can significantly reduce your cost for Azure Monitor by understanding your different configuration options and opportunities to reduce the amount of data that it collects. Before you use this article, you should see [Azure Monitor cost and usage](cost-usage.md) to understand the different ways that Azure Monitor charges and how to view your monthly bill.

This article describes [Cost optimization](/azure/architecture/framework/cost/) for Azure Monitor as part of the [Azure Well-Architected Framework](/azure/architecture/framework/). The Azure Well-Architected Framework is a set of guiding tenets that can be used to improve the quality of a workload. The framework consists of five pillars of architectural excellence:

- Reliability
 - Security
 - Cost Optimization
 - Operational Excellence
 - Performance Efficiency

## Azure Monitor Logs

[!INCLUDE [waf-logs-cost](includes/waf-logs-cost.md)]

## Azure resources

### Design checklist

> [!div class="checklist"]
> - Collect only critical resource log data from Azure resources.

### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Collect only critical resource log data from Azure resources. | When you create [diagnostic settings](essentials/diagnostic-settings.md) to send [resource logs](essentials/resource-logs.md) for your Azure resources to a Log Analytics database, only specify those categories that you require. Since diagnostic settings don't allow granular filtering of resource logs, you can use a [workspace transformation](essentials/data-collection-transformations-workspace.md) to filter unneeded data for those resources that use a [supported table](logs/tables-feature-support.md). See [Diagnostic settings in Azure Monitor](essentials/diagnostic-settings.md#controlling-costs) for details on how to configure diagnostic settings and using transformations to filter their data. |

## Alerts

[!INCLUDE [waf-containers-cost](includes/waf-alerts-cost.md)]

## Virtual machines

[!INCLUDE [waf-vm-cost](includes/waf-vm-cost.md)]

## Containers

[!INCLUDE [waf-containers-cost](includes/waf-containers-cost.md)]

## Application Insights

[!INCLUDE [waf-application-insights-cost](includes/waf-application-insights-cost.md)]

## Next step

- [Get best practices for a complete deployment of Azure Monitor](best-practices.md).

