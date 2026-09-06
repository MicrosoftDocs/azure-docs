---
title: Create Queries for Workflow Monitoring and Tracking Data
description: View and create queries for workflow monitoring and tracking data in Azure Monitor for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: divswa, estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 07/10/2026
#Customer intent: As an automation and integration developer who works in Azure Logic Apps, I want to create queries to manage workflow monitoring and tracking data in Azure Monitor logs. 
---

# View and create queries for monitoring and tracking data in Azure Monitor for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

> [!NOTE]
>
> This article applies only to Consumption logic apps. For information about monitoring Standard logic apps, review 
> [Enable or open Application Insights after deployment for Standard logic apps](create-single-tenant-workflows-azure-portal.md#enable-open-application-insights).

You can view the underlying queries that produce the results from [Azure Monitor logs](/azure/azure-monitor/logs/log-query-overview) and create queries that filter the results based on your specific criteria. For example, you can find messages based on a specific interchange control number. Queries use the [Kusto query language](/azure/data-explorer/kusto/query/), which you can edit if you want to view different results. For more information, see [Azure Monitor log queries](/azure/data-explorer/kusto/query/).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Log Analytics workspace. If you don't have a Log Analytics workspace, learn [how to create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).

- A logic app that's set up with Azure Monitor logging and sends that information to a Log Analytics workspace. For more information, see [how to set up Azure Monitor logs for your logic app](monitor-logic-apps.md).

- If you're using an integration account, make sure that you've set up the account with Azure Monitor logging to send that information to a Log Analytics workspace. Learn how to [set up Azure Monitor logging for your integration account](monitor-b2b-messages-log-analytics.md).

## View queries behind results

To view or edit the query that produces the results in your workspace summary, follow these steps:

1. On any results page, at the bottom, select **See all**.

   :::image type="content" source="media/create-monitoring-tracking-queries/logic-app-see-all.png" alt-text="Screenshot that shows a results page with the See all link selected at the bottom left." lightbox="media/create-monitoring-tracking-queries/logic-app-see-all.png":::

   The **Logs** page opens and shows the query that produces the preceding results page.

   :::image type="content" source="media/create-monitoring-tracking-queries/view-query-behind-results.png" alt-text="Screenshot that shows the Logs page and the query editor with the selected query that produces the preceding results." lightbox="media/create-monitoring-tracking-queries/view-query-behind-results.png":::

1. On the **Logs** page, you can select these options:

   - To view the query results as a table, under the query editor, select **Table**.

   - To change the query, update the query string and select **Run** to view the results in the table.

## Create your own query

To find or filter results based on specific properties or values, you can create your own query by starting from an empty query or use an existing query. For more information, see [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries).

1. In the [Azure portal](https://portal.azure.com), find and select your Log Analytics workspace.

1. On your workspace menu, under **General**, select **Logs**.

1. Start from an empty query or any available existing queries.

   - To check whether any existing queries are available, on the query toolbar, select either **Samples queries** > **History**, which shows queries from previous query runs, or select **Query explorer**, which shows prebuilt queries.

     For example, the Logic Apps B2B solution provides these prebuilt queries:

     :::image type="content" source="media/create-monitoring-tracking-queries/b2b-prebuilt-queries.png" alt-text="Screenshot that shows the Query explorer and the Logic Apps B2B solution prebuilt queries highlighted." lightbox="media/create-monitoring-tracking-queries/b2b-prebuilt-queries.png":::

   - To start from an empty query, in the query editor, start typing the [Kusto query language](/azure/data-explorer/kusto/query/) for your query.

     :::image type="content" source="media/create-monitoring-tracking-queries/create-query-from-blank.png" alt-text="Screenshot that shows a new query and the query editor." lightbox="media/create-monitoring-tracking-queries/create-query-from-blank.png":::

## Related content

- [Tracking schemas for monitoring B2B messages](tracking-schemas-as2-x12-custom.md)
