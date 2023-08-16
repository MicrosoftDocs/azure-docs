---
title: 'Tutorial: Query Performance Insight for Azure Database for MySQL - Flexible Server'
description: 'This article shows you the tools to help visualize Query Performance Insight for Azure Database for MySQL - Flexible Server.'
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.topic: tutorial
author: code-sidd
ms.author: sisawant
ms.date: 10/01/2021
---

# Tutorial: Query Performance Insight for Azure Database for MySQL - Flexible Server
[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Query Performance Insight proposes to provide intelligent query analysis for databases. The most preferred insights are the workload patterns and the longer-running queries. Understanding these insights can help you find which queries to optimize to improve overall performance and to use your available resources efficiently. 

Query Performance Insight is designed to help you spend less time troubleshooting database performance by providing such information as:
* Top *N* long-running queries and their trends.
* The query details: view the history of execution with minimum, maximum, average, and standard deviation query time.
* The resource utilizations (CPU, memory, and storage).
 
This article discusses how to use MySQL slow query logs, the Log Analytics tool, and workbooks templates to visualize Query Performance Insight for Azure Database for MySQL - Flexible Server.

In this tutorial, you'll learn how to:
>[!div class="checklist"]
> * Configure slow query logs by using the Azure portal or the Azure CLI
> * Set up diagnostics
> * View slow query logs by using Log Analytics 
> * View slow query logs by using workbooks 

## Prerequisites

- [Create an Azure Database for MySQL - Flexible Server instance](./quickstart-create-server-portal.md).
- [Create a Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md).


## Configure slow query logs by using the Azure portal 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your flexible server instance.

1. On the left pane, under **Settings**, select **Server parameters**.

   :::image type="content" source="./media//tutorial-query-performance-insights/server-parameters.png" alt-text="Screenshot showing the 'Server parameters' list.":::

1. For the **slow_query_log** parameter, select **ON**.

   :::image type="content" source="./media/tutorial-query-performance-insights/slow-query-log-enable.png" alt-text="Screenshot showing the 'slow_query_log' parameter switched to 'ON'.":::

1. For the other parameters, such as **long_query_time** and **log_slow_admin_statements**, refer to the [slow query logs](./concepts-slow-query-logs.md#configure-slow-query-logging) documentation.  

   :::image type="content" source="./media/tutorial-query-performance-insights/long-query-time.png" alt-text="Screenshot showing updated values for the remaining slow query log-related parameters.":::

1. Select **Save**. 

   :::image type="content" source="./media/tutorial-query-performance-insights/save-parameters.png" alt-text="Screenshot of the 'Save' button for saving changes in the parameter values.":::

You can return to the list of logs by closing the **Server parameters** page.

## Configure slow query logs by using the Azure CLI
 
Alternatively, you can enable and configure slow query logs for your flexible server from the Azure CLI by running the following command: 

> [!IMPORTANT]
> To ensure that your flexible server's performance is not heavily affected, we recommend that you log only the event types and users that are required for your auditing purposes.

```azurecli
# Turn on statement level log.

az mysql flexible-server parameter set \
--name log_statement \
--resource-group myresourcegroup \
--server-name mydemoserver \
--value all


# Set log_min_duration_statement time to 10 seconds. This setting will log all queries that execute for more than 10 seconds. Adjust this threshold based on your definition for slow queries.

az mysql server configuration set \
--name log_min_duration_statement \
--resource-group myresourcegroup \
--server mydemoserver \
--value 10000

# Enable slow query logs.

az mysql flexible-server parameter set \
--name slow_query_log \
--resource-group myresourcegroup \
--server-name mydemoserver \
--value ON
```

## Set up diagnostics

Slow query logs are integrated with Azure Monitor diagnostic settings to allow you to pipe your logs to any of three data sinks:
* A Log Analytics workspace
* An event hub
* A storage account

>[!Note]
>You should create your data sinks before you configure the diagnostics settings. You can access the slow query logs in the data sinks you've configured. It can take up to 10 minutes for the logs to appear.

1. On the left pane, under **Monitoring**, select **Diagnostic settings**.

1. On the **Diagnostics settings** pane, select **Add diagnostic setting**.

   :::image type="content" source="./media/tutorial-query-performance-insights/add-diagnostic-setting.png" alt-text="Screenshot of the 'Add diagnostic setting' link on the 'Diagnostic settings' pane.":::

1. In the **Name** box, enter a name for the diagnostics setting.

1. Specify which destinations (Log Analytics workspace, an event hub, or a storage account) to send the slow query logs to by selecting their corresponding checkboxes.

    >[!Note]
    > For this tutorial, you'll send the slow query logs to a Log Analytics workspace.

1. Under **Log**, for the log type, select the **MySqlSlowLogs** checkbox.

    :::image type="content" source="./media/tutorial-query-performance-insights/configure-diagnostic-setting.png" alt-text="Screenshot of the 'Diagnostics settings' pane for selecting configuration options.":::

1. After you've configured the data sinks to pipe the slow query logs to, select **Save**.

    :::image type="content" source="./media/tutorial-query-performance-insights/save-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings configuration options, with Save highlighted":::

## View query insights by using Log Analytics 

1. In Log Analytics, on the left pane, under **Monitoring**, select **Logs**.

1. Close the **Queries** window that opens.

   :::image type="content" source="./media/tutorial-query-performance-insights/log-query.png" alt-text="Screenshot of the Log Analytics 'Queries' pane.":::

1. In the query window, you can write the query to be executed. To find queries longer than 10 seconds on a particular server, we've used the following code:

   ```kusto
   AzureDiagnostics
      | where Category == 'MySqlSlowLogs'
      | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
      | where query_time_d > 10
   ```
    
1. Select the **Time range**, and then run the query. The results are displayed in the following image:  

   :::image type="content" source="./media/tutorial-query-performance-insights/slow-query.png" alt-text="Screenshot of a slow query log.":::

## View query insights by using workbooks 

1. In the Azure portal, on the left pane, under **Monitoring** for your Azure Database for MySQL - Flexible Server instance, select **Workbooks**.

1.	Select the **Query Performance Insight** template. 

    :::image type="content" source="./media/tutorial-query-performance-insights/monitor-workbooks.png" alt-text="Screenshot showing all workbooks in the workbook gallery.":::

In the workbook, you can view the following visualizations: 
>[!div class="checklist"]
> * Query Load
> * Total Active Connections
> * Slow Query Trend (>10 Sec Query Time)
> * Slow Query Details
> * List top 5 longest queries
> * Summarize slow queries by minimum, maximum, average, and standard deviation query time

    
:::image type="content" source="./media/tutorial-query-performance-insights/long-query.png" alt-text="Screenshot showing two long queries.":::

>[!Note]
> * To view resource utilization, you can use the Overview template.
> * You can also edit these templates and customize them according to your requirements. For more information, see [Azure Workbooks](../../azure-monitor/visualize/workbooks-overview.md).
> * For a quick view, you can also pin the workbooks or Log Analytics query to your Dashboard. For more information, see [Create a dashboard in the Azure portal](../../azure-portal/azure-portal-dashboards.md). 

In Query Performance Insight, two metrics that can help you find potential bottlenecks are *duration* and *execution count*. Long-running queries have the greatest potential for locking resources longer, blocking other users, and limiting scalability. 

In some cases, a high execution count can lead to more network round trips. Round trips affect performance. They're subject to network latency and downstream server latency. So execution count can help to find frequently executed ("chatty") queries. These queries are the best candidates for optimization. 

## Next steps
- [Learn more about Azure Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md#visualizations) and their rich visualization options.
- [Learn more about slow query logs](concepts-slow-query-logs.md).
