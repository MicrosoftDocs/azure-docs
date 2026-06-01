---
title: View Health and Performance Metrics for Workflows
description: Find and review the health and performance metrics for your workflows in Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
author: kewear
ms.author: kewear
ms.reviewers: estfan, azla
ms.topic: how-to
ai.usage: ai-assisted
ms.update-cycle: 1095-days 
ms.date: 04/27/2026
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to review the health and performance metrics for my workflows.
---

# View health and performance metrics for workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

If you don't have visibility into workflow execution health, and your workflows integrate multiple services and run at scale, you can have a difficult time when you have to find and troubleshoot unexpected failures, slow triggers, or high action error rates. Azure Logic Apps exposes workflow performance data through Azure Monitor Metrics so you get real-time and historical views of workflow runs, triggers, actions, and job execution timing.

This guide shows how to find the health and performance metrics for your Consumption or Standard logic app workflows, identify the metrics that matter to your scenario, and apply filters to narrow the results to a specific workflow or status. This information helps you quickly identify and diagnose issues before they negatively affect your integrations.

For the full list of available metrics, see [Supported metrics with Azure Monitor](/azure/azure-monitor/essentials/metrics-supported#microsoftlogicworkflows).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Consumption or Standard logic app workflow that ran at least once or is currently running.

## Find and view metrics

### [Consumption](#tab/consumption)

To view the metrics for Consumption logic app workflows, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app.

1. On the logic app sidebar, under **Monitoring**, select **Metrics**.

   The **Metrics** page opens and shows the following lists: **Scope**, **Metric Namespace**, **Metric**, and **Aggregation**.

1. Confirm that **Scope** is set to your logic app name and **Metric Namespace** is set to **Logic app standard metrics**.

1. Open the **Metric** list to view the available metrics for your workflow.

   :::image type="content" source="./media/view-workflow-metrics/view-metrics-consumption.png" alt-text="Screenshot shows the Azure portal, Consumption logic app sidebar with Metrics selected, and the Metric list open." lightbox="./media/view-workflow-metrics/view-metrics-consumption.png":::

1. From the **Metric** list, select the metric to review.

   For the full metrics list, see [Supported metrics for `Microsoft.Logic/Workflows`](/azure/logic-apps/monitor-logic-apps-reference#supported-metrics-for-microsoftlogicworkflows).

1. From the **Aggregation** list, select the option to group the metric's values: **Count**, **Avg**, **Min**, **Max**, or **Sum**.

### [Standard](#tab/standard)

To view the metrics for Standard logic app workflows, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app.

1. On the logic app sidebar, under **Monitoring**, select **Metrics**.

   The **Metrics** page opens and shows the following lists: **Scope**, **Metric Namespace**, **Metric**, and **Aggregation**.

1. Confirm that **Scope** is set to your logic app name and **Metric Namespace** is set to **App Service standard metrics**.

1. In the **Metric** search box, enter **workflow** to view the metrics that start with **Workflow**.

   The filtered list shows the metrics for your workflow:

   | Metric name | Description |
   |-------------|-------------|
   | **Workflow Action Completed Count** | The number of completed actions, regardless of status. |
   | **Workflow Actions Failure Rate** | The rate of failed actions. |
   | **Workflow Job Execution Delay** | The amount of time between when a job was scheduled to run and when the job actually ran. |
   | **Workflow Job Execution Duration** | The amount of time that a job took to complete execution. |
   | **Workflow Runs Completed Count** | The number of completed workflow executions, regardless of status. |
   | **Workflow Runs Dispatched Count** | The number of previously queued requests that are now processed. |
   | **Workflow Runs Failure Rate** | The number of failed workflow runs. |
   | **Workflow Runs Started Count** | The number of started workflows, regardless of outcome status. |
   | **Workflow Triggers Completed Count** | The number of completed triggers, regardless of outcome. |
   | **Workflow Triggers Failure Rate** | The rate of failed triggers. |

   :::image type="content" source="./media/view-workflow-metrics/view-metrics-standard.png" alt-text="Screenshot shows the Azure portal, Standard logic app sidebar with Metrics selected, the Metric search box with workflow entered, and the Metric list open." lightbox="./media/view-workflow-metrics/view-metrics-standard.png":::

   > [!NOTE]
   >
   > For information about non-workflow related metrics, such as Azure App Service metrics for Standard workflows, see [Azure App Service - Metrics](../app-service/web-sites-monitor.md#understand-metrics).

1. From the **Metric** list, select the metric to review.

1. From the **Aggregation** list, select the option to group the metric's values: **Count**, **Avg**, **Min**, **Max**, or **Sum**.

#### Filter by workflow

If your Standard logic app has multiple workflows running, you can filter the results by workflow:

1. Under the **Metrics** toolbar, select **Add filter**.

1. From the **Property** list, select **Workflow Name**.

1. From the **Values** list, select the workflow to filter.

#### Filter by workflow status

1. Under the **Metrics** toolbar, select **Add filter**.

1. From the **Property** list, select **Status**.

1. From the **Values** list, select the status to filter.

#### Example

This example for a Standard logic app shows the number of workflow runs that have a specific status over the past 24 hours. Multiple workflows are running, so to filter the results, add a filter:

1. From the **Metric** list, select the metric named **Workflow Runs Completed**.

1. From the **Aggregation** list, select **Sum**.

   :::image type="content" source="./media/view-workflow-metrics/example-metric-standard.png" alt-text="Screenshot shows example metric settings for a Standard logic app workflow.":::

1. On the **Metrics** toolbar, select **Add filter**.

1. From the **Property** list, select **Workflow Name**.

1. From the **Values** list, select the workflow.

   :::image type="content" source="./media/view-workflow-metrics/example-add-filter-standard.png" alt-text="Screenshot shows an example with an added metrics filter for a Standard logic app workflow.":::

---

## Related content

- [Monitor logic apps](monitor-logic-apps.md)
