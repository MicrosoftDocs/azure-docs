---
title: View workflow health and performance metrics
description: View health and performance metrics for workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: kewear
ms.author: kewear
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/15/2023
# As a developer, I want to review the health and performance metrics for workflows in Azure Logic Apps.
---

# View metrics for workflow health and performance in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This guide shows how you can check the health and performance for both Consumption and Standard logic app workflows.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Consumption workflow or Standard workflow that is running or has run at least once

## Find and view metrics

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the logic app resource menu, under **Monitoring**, select **Metrics**.

   The **Metrics** page shows the following lists: **Scope**, **Metric Namespace**, and **Metric**.

1. Make sure that **Scope** is set to your Consumption logic app name and that **Metric Namespace** is set to **Logic app standard metrics**.

1. Open the **Metric** list to view the available metrics for your workflow.

   :::image type="content" source="./media/view-workflow-metrics/view-metrics-consumption.png" alt-text="Screenshot showing Azure portal, Consumption logic app resource menu with Metrics selected, and the Metric list opened.":::

   For more information about Consumption workflow metrics, see [Supported metrics with Azure Monitor - Microsoft.Logic/workflows](../azure-monitor/essentials/metrics-supported.md#microsoftlogicworkflows).

1. From the **Metric** list, select the metric that you want to review. From the **Aggregation** list, select the option for how you want to group the metric's values: **Count**, **Avg**, **Min**, **Max**, or **Sum**.

### [Standard (preview)](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the logic app resource menu, under **Monitoring**, select **Metrics**.

   The **Metrics** page shows the following lists: **Scope**, **Metric Namespace**, and **Metric**.

1. Make sure that **Scope** is set to your Standard logic app name and that **Metric Namespace** is set to **App Service standard metrics**.

1. In the **Metric** search box, enter **workflow** to view the metrics that start with **Workflow**.

   The filtered list now shows the available metrics for your workflow:

   | Metric name | Description |
   |-------------|-------------|
   | **Workflow Action Completed Count** | The number of completed actions, regardless of status. |
   | **Workflow Job Execution Delay** | The amount of time between when a job was scheduled to run and when the job actually ran. |
   | **Workflow Job Execution Duration** | The amount of time that a job took to complete execution. |
   | **Workflow Runs Completed Count** | The number of completed workflow executions, regardless of status. |
   | **Workflow Runs Dispatched Count** | The number of previously queued requests that are now processed. |
   | **Workflow Runs Started Count** | The number of started workflows, regardless of outcome status. |
   | **Workflow Triggers Completed Count** | The number of completed triggers, regardless of outcome. |

   :::image type="content" source="./media/view-workflow-metrics/view-metrics-standard.png" alt-text="Screenshot showing Azure portal, Standard logic app resource menu with Metrics selected, the Metric search box with workflow entered, and the Metric list opened.":::

   > [!NOTE]
   >
   > For information about non-workflow related metrics, such as Azure App Service metrics for Standard workflows, 
   > see [Monitor apps in Azure App Service - Understand metrics](../app-service/web-sites-monitor.md#understand-metrics).

1. From the **Metric** list, select the metric that you want to review. From the **Aggregation** list, select the option for how you want to group the metric's values: **Count**, **Avg**, **Min**, **Max**, or **Sum**.

#### Filter on a specific workflow

If your Standard logic app has multiple workflows running, you can filter the results by workflow.

1. Under the **Metrics** toolbar, select **Add filter**.

1. From the **Property** list, select **Workflow Name**.

1. From the **Values** list, select the specific workflow.

#### Filter on a specific workflow status

1. Under the **Metrics** toolbar, select **Add filter**.

1. From the **Property** list, select **Status**.

1. From the **Values** list, select the status.

#### Example

Suppose that you want to view the number of workflow runs that have a specific status over the past 24 hours.

1. From the **Metric** list, select the metric named **Workflow Runs Completed**.

1. From the **Aggregation** list, select **Sum**.

   :::image type="content" source="./media/view-workflow-metrics/example-metric-standard.png" alt-text="Screenshot showing example metric for Standard logic app.":::

   In this example, the Standard logic app has multiple workflows running. So, you can filter the results by adding a filter.

   1. Under the **Metrics** toolbar, select **Add filter**.

   1. From the **Property** list, select **Workflow Name**.

   1. From the **Values** list, select the specific workflow.

      :::image type="content" source="./media/view-workflow-metrics/example-add-filter-standard.png" alt-text="Screenshot showing example added metrics filter for Standard logic app.":::

---

## Next steps

- [Monitor logic apps](monitor-logic-apps.md)