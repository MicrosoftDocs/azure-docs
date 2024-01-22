---
title: Azure Monitor Resource Group insights | Microsoft Docs
description: Understand the health and performance of your distributed applications and services at the Resource Group level with Resource Group insights feature of Azure Monitor.
ms.topic: conceptual
ms.date: 09/19/2018
ms.reviewer: daviste
---

# Monitor Azure Monitor Resource Group insights

Modern applications are often complex and highly distributed with many discrete parts working together to deliver a service. Recognizing this complexity, Azure Monitor provides monitoring insights for resource groups. This makes it easy to triage and diagnose any problems your individual resources encounter, while offering context as to the health and performance of the resource group&mdash;and your application&mdash;as a whole.

## Access insights for resource groups

1. Select **Resource groups**  from the left-side navigation bar.
2. Pick one of your resource groups that you want to explore. (If you have a large number of resource groups filtering by subscription can sometimes be helpful.)
3. To access insights for a resource group, click **Insights** in the left-side menu of any resource group.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0001-overview.png" lightbox="./media/resource-group-insights/0001-overview.png" alt-text="Screenshot of resource group insights overview page." border="false":::

## Resources with active alerts and health issues

The overview page shows how many alerts have been fired and are still active, along with the current Azure Resource Health of each resource. Together, this information can help you quickly spot any resources that are experiencing issues. Alerts help you detect issues in your code and how you've configured your infrastructure. Azure Resource Health surfaces issue with the Azure platform itself, that aren't specific to your individual applications.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0002-overview.png" lightbox="./media/resource-group-insights/0002-overview.png" alt-text="Screenshot of Azure Resource Health pane." border="false":::

### Azure Resource Health

To display Azure Resource Health, check the **Show Azure Resource Health** box above the table. This column is hidden by default to help the page load quickly.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0003-overview.png" lightbox="./media/resource-group-insights/0003-overview.png" alt-text="Screenshot with resource health graph added." border="false":::

By default, the resources are grouped by app layer and resource type. **App layer** is a simple categorization of resource types, that only exists within the context of the resource group insights overview page. There are resource types related to application code, compute infrastructure, networking, storage + databases. Management tools get their own app layers, and every other resource is categorized as belonging to the **Other** app layer. This grouping can help you see at-a-glance what subsystems of your application are healthy and unhealthy.

## Diagnose issues in your resource group

The resource group insights page provides several other tools scoped to help you diagnose issues

   | Tool | Description |
   | ---------------- |:-----|
   | [**Alerts**](../alerts/alerts-overview.md)      |  View, create, and manage your alerts. |
   | [**Metrics**](../data-platform.md) | Visualize and explore your metric based data.    |
   | [**Activity logs**](../essentials/platform-logs-overview.md) | Subscription level events that have occurred in Azure.  |
   | [**Application map**](../app/app-map.md) | Navigate your distributed application's topology to identify performance bottlenecks or failure hotspots. |

## Failures and performance

What if you've noticed your application is running slowly, or users have reported errors? It's time consuming to search through all of your resources to isolate problems.

The **Performance** and **Failures** tabs simplify this process by bringing together performance and failure diagnostic views for many common resource types.

Most resource types will open a gallery of Azure Monitor Workbook templates. Each workbook you create can be customized, saved, shared with your team, and reused in the future to diagnose similar issues.

### Investigate failures

To test out the Failures tab select **Failures** under **Investigate** in the left-hand menu.

The left-side menu bar changes after your selection is made, offering you new options.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/00004-failures.png" lightbox="./media/resource-group-insights/00004-failures.png" alt-text="Screenshot of Failure overview pane." border="false":::

When App Service is chosen, you are presented with a gallery of Azure Monitor Workbook templates.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0005-failure-insights-workbook.png" lightbox="./media/resource-group-insights/0005-failure-insights-workbook.png" alt-text="Screenshot of application workbook gallery." border="false":::

Choosing the template for Failure Insights will open the workbook.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0006-failure-visual.png" lightbox="./media/resource-group-insights/0006-failure-visual.png" alt-text="Screenshot of failure report." border="false":::

You can select any of the rows. The selection is then displayed in a graphical details view.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0007-failure-details.png" lightbox="./media/resource-group-insights/0007-failure-details.png" alt-text="Screenshot of failure details." border="false":::

Workbooks abstract away the difficult work of creating custom reports and visualizations into an easily consumable format. While some users may only want to adjust the prebuilt parameters, workbooks are completely customizable.

To get a sense of how this workbook functions internally, select **Edit** in the top bar.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0008-failure-edit.png" lightbox="./media/resource-group-insights/0008-failure-edit.png" alt-text="Screenshot of additional edit option." border="false":::

A number of **Edit** boxes appear near the various elements of the workbook. Select the **Edit** box below the table of operations.
<!-- convertborder later -->
:::image type="content" source="./media/resource-group-insights/0009-failure-edit-graph.png" lightbox="./media/resource-group-insights/0009-failure-edit-graph.png" alt-text="Screenshot of edit boxes." border="false":::

This reveals the underlying log query that is driving the table visualization.
 <!-- convertborder later -->
 :::image type="content" source="./media/resource-group-insights/0010-failure-edit-query.png" lightbox="./media/resource-group-insights/0010-failure-edit-query.png" alt-text="Screenshot of log query window." border="false":::

You can modify the query directly. Or you can use it as a reference and borrow from it when designing your own custom parameterized workbook.

### Investigate performance

Performance offers its own gallery of workbooks. For App Service the prebuilt Application Performance workbook offers the following view:
 <!-- convertborder later -->
 :::image type="content" source="./media/resource-group-insights/0011-performance.png" lightbox="./media/resource-group-insights/0011-performance.png" alt-text="Screenshot of performance view." border="false":::

In this case, if you select edit you will see that this set of visualizations is powered by Azure Monitor Metrics.
 <!-- convertborder later -->
 :::image type="content" source="./media/resource-group-insights/0012-performance-metrics.png" lightbox="./media/resource-group-insights/0012-performance-metrics.png" alt-text="Screenshot of performance view with Azure Metrics." border="false":::

## Troubleshooting

### Enabling access to alerts

To see alerts in Resource Group insights, someone with an Owner or Contributor role for this subscription needs to open Resource Group insights for any resource group in the subscription. This will enable anyone with read access to see alerts in Resource Group insights for all of the resource groups in the subscription. If you have an Owner or Contributor role, refresh this page in a few minutes.

Resource Group insights relies on the Azure Monitor Alerts Management system to retrieve alert status. Alerts Management isn't configured for every resource group and subscription by default, and it can only be enabled by someone with an Owner or Contributor role. It can be enabled either by:
* Opening Resource Group insights for any resource group in the subscription.
* Or by going to the subscription, clicking **Resource Providers**, then clicking **Register for Alerts.Management**.

## Next steps

- [Azure Monitor Workbooks](../visualize/workbooks-overview.md)
- [Azure Resource Health](../../service-health/resource-health-overview.md)
- [Azure Monitor Alerts](../alerts/alerts-overview.md)
