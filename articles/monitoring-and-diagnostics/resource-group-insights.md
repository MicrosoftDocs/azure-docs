---
title:  Azure Monitor Resource Group Insights | Microsoft Docs
description: TBD.
services: azure-monitor
author: NumberByColors
manager: carmonm
ms.service: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: conceptual
ms.date: 08/23/2018
ms.reviewer: mbullwin
ms.author: daviste
---

# Monitor resource groups with Azure Monitor (preview)

Modern applications are often complex and highly distributed with many discrete parts working together to deliver a service. Recognizing this complexity, Azure Monitor provides monitoring insights for resource groups. This makes it easy to triage and diagnose any problems your individual resources encounter, while offering context as to the health and performance of the resource group&mdash;and your application&mdash;as a whole.

## Access insights for resource groups

1. Select **Resource groups**  from the left-side navigation bar.
2. Pick one of your resource groups that you want to explore. (If you have a large number of resource groups filtering by subscription can sometimes be helpful.)
3. To access insights for a resource group, click **Insights** in the left-side menu of any resource group.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\001-overview.png)

## Find resources with active alerts and health issues

The overview page shows how many alerts have been fired and are still active for each resource, plus the current Azure Resource Health of each resource. Together, this information can help you quickly spot any resources that are encountering issues. Alerts help you detect issues in your code and how you've configured your infrastructure. Azure Resource Health surfaces issue with the Azure platform itself, that are not specific to your individual applications.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\002-overview.png)

### Azure Resource Health

To display Azure Resource Health, check the **Show Azure Resource Health** box above the table. This column is hidden by default to help the page load quickly.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\003-overview.png)

By default, the resources are grouped by app layer and resource type. **App layer** is a simple categorization of resource types, that only exists within the context of the resource group insights overview page. There are resource types related to application code, compute infrastructure, networking, storage + databases. Management tools get their own app layers, and every other resource is categorized as belonging to the **Other** app layer. This grouping can help you see at-a-glance what subsystems of your application are healthy and unhealthy.

## Diagnose issues with your resource group

The resource group insights page provides several other tools scoped to to help you diagnose issues

   |         |          |
   | ---------------- |:-----|
   | [**Alerts**](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-unified-alerts)      |  View, create, and manage your alerts. |
   | [**Metrics**](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-metrics) | Visualize and explore your metric based data.    |
   | [**Activity logs**](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) | Subscription level events that have occurred in Azure.  |
   | [**Application map**](https://docs.microsoft.com/azure/application-insights/app-insights-app-map) | Navigate your distributed application's topology to identify performance bottlenecks or failure hotspots. |
    |[**Virtual machine map**](TBD) | TBD |

## Failures and Performance

What if you've noticed your application is performing slowly, or users have reported errors? It's time consuming to search through all of your resources to isolate problems.

The **Performance** and **Failures** tabs simplify this process by bringing together performance and failure diagnostic views for many common resource types.

Most resource types will open a gallery of Azure Monitor Workbook templates. Each workbook you create can be customized, saved, shared with your team, and reused in the future to diagnose similar issues.

### Investigate Failures

To test out the Failures tab select **Failures** under **Investigate** in the left-hand menu.

You will notice that your left-side menu bar changes after your selection is made, offering you new options.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\004-failures.png)

When App Service is chosen you are presented with a gallery of Azure Monitor Workbook templates.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\005-failure-insights-workbook.png)

Choosing the template for Failure Insights will open the workbook.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\006-failure-visual.png)

Each of the rows can be selected. The selection is displayed in a graphical details view.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\007-failure-details.png)

Workbooks abstract away the difficult work of creating custom reports and visualizations into an easily consumable format. While some users may only want to adjust the prebuilt parameters, workbooks are completely customizable.

To get a sense of how this workbook functions internally, select **Edit** in the top bar.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\008-failure-edit.png)

You will notice a number of **Edit** boxes appear near the various elements of workbook. Select the **Edit** box below the table of operations.

![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\009-failure-edit-graph.png)

This reveals the underlying Log Analytics query that is driving the table visualization.

 ![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\010-failure-edit-query.png)

You can modify the query directly. Or you can use it as a reference and borrow from it when designing your own custom parameterized workbook.

### Investigate Performance

Performance offers its owns gallery of workbooks. For App Service the prebuilt Application Performance workbook offers the following view:

 ![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\011-performance.png)

In this case if you select edit you will find that this set of visualizations is powered by Azure Monitor Metrics.

 ![Screenshot of Resource Group Insights Overview pane](.\media\resource-group-insights\012-performance-metrics.png)

## Next steps

- [Azure Monitor Workbooks](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-usage-workbooks)
- [Azure Resource Health](https://docs.microsoft.com/azure/service-health/resource-health-overview)
- [Azure Monitor Alerts](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitoring-overview-unified-alerts)
