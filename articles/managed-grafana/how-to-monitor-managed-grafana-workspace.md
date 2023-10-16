---
title: 'How to monitor your Azure Managed Grafana instance with logs'
description: Learn how to monitor your Azure Managed Grafana instance with logs.
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to 
ms.custom: engagement-fy23
ms.date: 2/28/2023
---

# How to monitor your Azure Managed Grafana instance with logs

In this article, you'll learn how to monitor an Azure Managed Grafana instance by configuring diagnostic settings and accessing event logs.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance with access to at least one data source. If you don't have a Managed Grafana instance yet, [create an Azure Managed Grafana instance](./how-to-permissions.md) and [add a data source](how-to-data-source-plugins-managed-identity.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Add diagnostic settings

To monitor an Azure Managed Grafana instance, the first step to take is to configure diagnostic settings. In this process, you'll configure the streaming export of your instance's logs to a destination of your choice.

You can create up to five different diagnostic settings to send different logs to independent destinations.

1. Open a Managed Grafana resource, and go to **Diagnostic settings**, under **Monitoring**

   :::image type="content" source="media/monitoring-logs/diagnostic-overview.png" alt-text="Screenshot of the Azure platform. Diagnostic settings.":::

1. Select **+ Add diagnostic setting**.

1. For **Diagnostic setting name**, enter a unique name.

1. Select **allLogs** from the following options:
   - **audit** streams all audit logs
   - **allLogs** streams all logs
   - **Grafana Login Events** streams all Grafana login events
   - **AllMetrics** streams all metrics

1. Under **Destination details**, select one or more destinations, fill out details and select **Save**.

   | Destination             | Description                            | Settings                                                                                                                                                                         |
   |-------------------------|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | Log Analytics workspace | Send data to a Log Analytics workspace | Select the **subscription** containing an existing Log Analytics workspace, then select the **Log Analytics workspace**                                                          |
   | Storage account         | Archive data to a storage account      | Select the **subscription** containing an existing storage account, then select the **storage account**. Only storage accounts in the same region as the Grafana instance are displayed in the dropdown menu.                                                                          |
   | Event hub               | Stream to an event hub                 | Select a **subscription** and an existing Azure Event Hubs **namespace**. Optionally also choose an existing **event hub**. Lastly, choose an **event hub policy** from the list. Only event hubs in the same region as the Grafana instance are displayed in the dropdown menu. |
   | Partner solution        | Send to a partner solution             | Select a **subscription** and a **destination**. For more information about available destinations, go to [partner destinations](../azure-monitor/partners.md).                 |

   :::image type="content" source="media//monitoring-logs/monitoring-settings.png" alt-text="Screenshot of the Azure platform. Diagnostic settings configuration.":::

## Access logs

Now that you've configured your diagnostic settings, Azure will stream all new events to your selected destinations and generate logs. You can now create queries and access logs to monitor your application.

1. In your Managed Grafana instance, select **Logs** from the left menu. The Azure platform displays a **Queries** page, with suggestions of queries to choose from.

   :::image type="content" source="media/monitoring-logs/menu.png" alt-text="Screenshot of the Azure platform. Open Logs.":::

1. Select a query from the suggestions displayed under the **Queries** page, or close the page to create your own query.
   1. To use a suggested query, select a query and select **Run**, or select **Load to editor** to review the code.
   1. To create your own query, enter your query in the code editor and select **Run**. You can also perform some actions, such as editing the scope and the range of the query, as well as saving and sharing the query. The result of the query is displayed in the lower part of the screen.

   :::image type="content" source="media/monitoring-logs/query.png" alt-text="Screenshot of the Azure platform. Log query editing." lightbox="media/monitoring-logs/query-expanded.png":::

1. Select **Schema and Filter** on the left side of the screen to access tables, queries and functions. You can also filter and group results, as well as find your favorites.
1. Select **Columns** on the right of **Results** to  edit the columns of the results table, and manage the table like a pivot table.

   :::image type="content" source="media/monitoring-logs/filters.png" alt-text="Screenshot of the Azure platform. Log query filters and columns." lightbox="media/monitoring-logs/filters-expanded.png":::

## Next steps

> [!div class="nextstepaction"]
> [Grafana UI](./grafana-app-ui.md)

> [!div class="nextstepaction"]
> [Share an Azure Managed Grafana instance](./how-to-share-grafana-workspace.md)
