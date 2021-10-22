---
title: 'Tutorial: Query performance insights for Azure Database for MySQL – Flexible Server'
description: 'Tutorial: Query performance insights for Azure Database for MySQL – Flexible Server'
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.topic: tutorial
ms.date: 10/01/2021
---

# Tutorial: Query performance insights for Azure Database for MySQL – Flexible Server
[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Query Performance Insight proposes to provide intelligent query analysis for databases. The most preferred insights are the workload patters and the longer-running queries. This helps find which queries to optimize to improve overall performance and to efficiently use the resources available. Query Performance Insight should help you spend less time troubleshooting database performance by provide the details like
* Top N long running queries and its trend.
* The ability to drill down into details of a query, to view the query text as well as the history of execution with minimum, maximum, average, and standard deviation query time
* The resource utilizations (CPU, Memory and Storage)
 
In this tutorial you will learn how you can use MySQL Slow query logs, Log Analytics tool or Workbooks template to visualize the Query performance insights for Azure Database for MySQL – Flexible Server. 

## Prerequisites
- You would need to create an Instance of Azure Database for MySQL – Flexible Server. For step by step procedure please refer to [Create Instance of Azure Database for MySQL - Flexible Server](./quickstart-create-server-portal.md)
- You would need to create Log Analytics Workspace created. For step-by-step procedure please refer to [Create Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md)

In this tutorial you will learn how to:
>[!div class="checklist"]
> * Configure Slow Query logs From Portal or using Azure CLI
> * Set up diagnostics
> * View slow query using Log Analytics 
> * View slow query using workbooks 

## Configure slow query logs from portal 


1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your flexible server.

1. Under the **Settings** section in the sidebar, select **Server parameters**.
   :::image type="content" source="./media//tutorial-query-performance-insights/server-parameters.png" alt-text="Server parameters page.":::

1. Update the **slow_query_log** parameter to **ON**.
   :::image type="content" source="./media/tutorial-query-performance-insights/slow-query-log-enable.png" alt-text="Turn on slow query logs.":::

1. Change any other parameters needed (ex. `long_query_time`, `log_slow_admin_statements`). Refer to the [slow query logs](./concepts-slow-query-logs.md#configure-slow-query-logging) docs for more parameters.  
   :::image type="content" source="./media/tutorial-query-performance-insights/long-query-time.png" alt-text="Update slow query log related parameters.":::

1. Select **Save**. 
   :::image type="content" source="./media/tutorial-query-performance-insights/save-parameters.png" alt-text="Save slow query log parameters.":::

From the **Server Parameters** page, you can return to the list of logs by closing the page.



## Configure slow query logs from Azure CLI
 
In case you wish to do the above using Azure CLI , you can enable and configure slow query logs for your server using CLI 

> [!IMPORTANT]
> It is recommended to only log the event types and users required for your auditing purposes to ensure your server's performance is not heavily impacted.

Enable and configure slow query logs for your server.

```azurecli
# Turn on statement level log

az mysql flexible-server parameter set \
--name log_statement \
--resource-group myresourcegroup \
--server-name mydemoserver \
--value all


# Set log_min_duration_statement time to 10 sec

# This setting will log all queries executing for more than 10 sec. Please adjust this threshold based on your definition for slow queries

az mysql server configuration set \
--name log_min_duration_statement \
--resource-group myresourcegroup \
--server mydemoserver \
--value 10000

# Enable Slow query logs



az mysql flexible-server parameter set \
--name slow_query_log \
--resource-group myresourcegroup \
--server-name mydemoserver \
--value ON
```

## Set up diagnostics

Slow query logs are integrated with Azure Monitor diagnostic settings to allow you to pipe your logs to Azure Monitor logs, Event Hubs, or Azure Storage.

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings** > **Add diagnostic settings**.

   :::image type="content" source="./media/tutorial-query-performance-insights/add-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings options":::

1. Provide a diagnostic setting name.

1. Specify which destinations to send the slow query logs ( Log Analytics workspace,storage account or event hub)

    >[!Note]
    > For the scope of the tutorial we would need to send the slow query logs to Log Analytics workspace

1. Select **MySqlSlowLogs** as the log type.
    :::image type="content" source="./media/tutorial-query-performance-insights/configure-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings configuration options":::

1. After you've configured the data sinks to pipe the slow query logs to, select **Save**.
    :::image type="content" source="./media/tutorial-query-performance-insights/save-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings configuration options, with Save highlighted":::

    >[!Note]
    >You should create data sinks (Log Analytics workspace, storage account or event hub) before you configure diagnostic settings. 
    >You can access the slow query logs in the data sinks you configured (Log Analytics workspace, storage account or event hub).It can take up to 10 minutes for the logs to appear.
 
## View query insights using Log Analytics 

Navigate to **Logs** under the **Monitoring** section. Close the **Queries** window.

:::image type="content" source="./media/tutorial-query-performance-insights/log-query.png" alt-text="Screenshot of Log analytics":::

On the query window you can write the query to be executed.  Here we have used query to find Queries longer than 10 seconds on a particular server

```kusto
 AzureDiagnostics
    | where Category == 'MySqlSlowLogs'
    | project TimeGenerated, LogicalServerName_s, event_class_s, start_time_t , query_time_d, sql_text_s 
    | where query_time_d > 10
```
    
Select the **Time range** and **Run** the query. You will see the results of the query below.  

:::image type="content" source="./media/tutorial-query-performance-insights/slow-query.png" alt-text="Screenshot of slow query log":::

## View query insights using Workbooks 

1.	On the Azure portal, Navigate to **Monitoring** blade for Azure Database for MySQL – Flexible Server and select **Workbooks**.
2.	You should be able to able to see the templates. Select **Query Performance insights** 

    :::image type="content" source="./media/tutorial-query-performance-insights/monitor-workbooks.png" alt-text="Screenshot of workbook template":::

You will be able to see the following Visualization 
>[!div class="checklist"]
> * Query Load
> * Total Active Connections
> * Slow Query Trend (>10 Sec Query Time)
> * Slow Query Details
> * List top 5 longest queries
> * Summarize slow queries by minimum, maximum, average, and standard deviation query time

    
:::image type="content" source="./media/tutorial-query-performance-insights/long-query.png" alt-text="Screenshot of long queries":::

>[!Note]
> * For resource utilization you can use the Overview template.
> * You can also edit these templates and customize as per your requirement for more details see, [Azure Monitor Workbooks Overview - Azure Monitor](../../azure-monitor/visualize/workbooks-overview.md#editing-mode)
> * For quick view you can also ping the workbooks or Log Analytics query to your Dashboard. For more details refer, [Create a dashboard in the Azure portal - Azure portal](../../azure-portal/azure-portal-dashboards.md) 

Two metrics in Query Performance Insights can help you find potential bottlenecks are duration and execution count. Long-running queries have the greatest potential for locking resources longer, blocking other users, and limiting scalability. 
In some cases, a high execution count can lead to more network round trips. Round trips affect performance. They're subject to network latency and to downstream server latency. So execution count can help to find frequently executed ("chatty") queries. These queries are the best candidates for optimization. 

## Next steps
- [Get started Azure Monitor Workbooks](../../azure-monitor/visualize/workbooks-overview.md#visualizations) and learning more about workbooks many rich visualizations options.
- Learn more about [slow query logs](concepts-slow-query-logs.md)


