---
title: Change analysis in VM insights
description: VM insights integration with Application Change Analysis integration allows you to view any changes made to a virtual machine that might have affected it performance.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023

---

# Change analysis in VM insights
VM insights integration with [Application Change Analysis](../app/change-analysis.md) integration allows you to view any changes made to a virtual machine that might have affected its performance.

## Overview
Suppose you have a VM that's running slow and you want to investigate whether recent changes to its configuration could have affected its performance. You view the performance of the VM by using VM insights and find that there's an increase in memory usage in the past hour. Change analysis can help you determine whether any configuration changes made around this time were the cause of the increase.

The Application Change Analysis service aggregates changes from [Azure Resource Graph](../../governance/resource-graph/how-to/get-resource-changes.md) and nested properties changes like network security rules from Azure Resource Manager.

## Enable change analysis
To onboard change analysis in VM insights, you must register the *Microsoft.ChangeAnalysis* resource provider. The first time you start VM insights or Application Change Analysis in the Azure portal, this resource provider is automatically registered for you. Application Change Analysis is a free service that has no performance overhead on resources.

## View change analysis
Change analysis is available from the **Performance** or **Map** tab of VM insights by selecting the **Change** option.
<!-- convertborder later -->
:::image type="content" source="media/vminsights-change-analysis/investigate-changes-screenshot.png" lightbox="media/vminsights-change-analysis/investigate-changes-screenshot.png" alt-text="Screenshot that shows investigating changes." border="false":::

Select **Investigate Changes** to open the Application Change Analysis page filtered for the VM. Review the listed changes to see if there are any that could have caused the issue. If you're unsure about a particular change, look at the **Changed by** column to identify the person who made the change.
<!-- convertborder later -->
:::image type="content" source="media/vminsights-change-analysis/change-details-screenshot.png" lightbox="media/vminsights-change-analysis/change-details-screenshot.png" alt-text="Screenshot that shows the Change details screen." border="false":::

## Next steps
- Learn more about [Application Change Analysis](../app/change-analysis.md).
- Learn more about [Azure Resource Graph](../../governance/resource-graph/how-to/get-resource-changes.md).

