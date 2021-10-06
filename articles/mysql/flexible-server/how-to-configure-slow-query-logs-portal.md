---
title: Configure slow query logs - Azure portal - Azure Database for MySQL - Flexible Server
description: This article describes how to configure and access the slow query logs in Azure Database for MySQL Flexible Server from the Azure portal.
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: how-to
ms.date: 9/21/2020
---

# Configure and access slow query logs for Azure Database for MySQL - Flexible Server using the Azure portal

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

You can configure, list, and download the Azure Database for MySQL Flexible Server [slow query logs](concepts-slow-query-logs.md) from the Azure portal.

## Prerequisites

The steps in this article require that you have [flexible server](quickstart-create-server-portal.md).

## Configure logging

Configure access to the MySQL slow query log. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select your flexible server.

1. Under the **Settings** section in the sidebar, select **Server parameters**.
   :::image type="content" source="./media/how-to-configure-slow-query-logs-portal/server-parameters.png" alt-text="Server parameters page.":::

1. Update the **slow_query_log** parameter to **ON**.
   :::image type="content" source="./media/how-to-configure-slow-query-logs-portal/slow-query-log-enable.png" alt-text="Turn on slow query logs.":::

1. Change any other parameters needed (ex. `long_query_time`, `log_slow_admin_statements`). Refer to the [slow query logs](./concepts-slow-query-logs.md#configure-slow-query-logging) docs for more parameters.  
   :::image type="content" source="./media/how-to-configure-slow-query-logs-portal/long-query-time.png" alt-text="Update slow query log related parameters.":::

1. Select **Save**. 
   :::image type="content" source="./media/how-to-configure-slow-query-logs-portal/save-parameters.png" alt-text="Save slow query log parameters.":::

From the **Server Parameters** page, you can return to the list of logs by closing the page.

## Set up diagnostics

Slow query logs are integrated with Azure Monitor diagnostic settings to allow you to pipe your logs to Azure Monitor logs, Event Hubs, or Azure Storage.

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings** > **Add diagnostic settings**.

   :::image type="content" source="./media/how-to-configure-slow-query-logs-portal/add-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings options":::

1. Provide a diagnostic setting name.

1. Specify which destinations to send the slow query logs (storage account, event hub, or Log Analytics workspace).

1. Select **MySqlSlowLogs** as the log type.
    :::image type="content" source="./media/how-to-configure-slow-query-logs-portal/configure-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings configuration options":::

1. After you've configured the data sinks to pipe the slow query logs to, select **Save**.
    :::image type="content" source="./media/how-to-configure-slow-query-logs-portal/save-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings configuration options, with Save highlighted":::

1. Access the slow query logs by exploring them in the data sinks you configured. It can take up to 10 minutes for the logs to appear.

If you piped your logs to Azure Monitor Logs (Log Analytics), refer to some [sample queries](concepts-slow-query-logs.md#analyze-logs-in-azure-monitor-logs) you can use for analysis. 

## Next steps
<!-- - See [Access slow query Logs in CLI](howto-configure-server-logs-in-cli.md) to learn how to download slow query logs programmatically.-->
- Learn more about [slow query logs](concepts-slow-query-logs.md)
- For more information about the parameter definitions and MySQL logging, see the MySQL documentation on [logs](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html).
- Learn about [audit logs](concepts-audit-logs.md)
