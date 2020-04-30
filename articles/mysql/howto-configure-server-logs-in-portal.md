---
title: Access slow query logs - Azure portal - Azure Database for MySQL
description: This article describes how to configure and access the slow logs in Azure Database for MySQL from the Azure portal.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 4/13/2020
---

# Configure and access slow query logs from the Azure portal

You can configure, list, and download the [Azure Database for MySQL slow query logs](concepts-server-logs.md) from the Azure portal.

## Prerequisites
The steps in this article require that you have [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md).

## Configure logging
Configure access to the MySQL slow query log. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select your Azure Database for MySQL server.

3. Under the **Monitoring** section in the sidebar, select **Server logs**. 
   ![Screenshot of Server logs options](./media/howto-configure-server-logs-in-portal/1-select-server-logs-configure.png)

4. To see the server parameters, select **Click here to enable logs and configure log parameters**.

5. Turn **slow_query_log** to **ON**.

6. Select where to output the logs to using **log_output**. To send logs to both local storage and Azure Monitor Diagnostic Logs, select **File**. 

7. Change any other parameters needed. 

8. Select **Save**. 

   :::image type="content" source="./media/howto-configure-server-logs-in-portal/3-save-discard.png" alt-text="Screenshot of slow query log parameters and save.":::

From the **Server Parameters** page, you can return to the list of logs by closing the page.

## View list and download logs
After logging begins, you can view a list of available slow query logs, and download individual log files.

1. Open the Azure portal.

2. Select your Azure Database for MySQL server.

3. Under the **Monitoring** section in the sidebar, select **Server logs**. The page shows a list of your log files.

   ![Screenshot of Server logs page, with list of logs highlighted](./media/howto-configure-server-logs-in-portal/4-server-logs-list.png)

   > [!TIP]
   > The naming convention of the log is **mysql-slow-< your server name>-yyyymmddhh.log**. The date and time used in the file name is the time when the log was issued. Log files are rotated every 24 hours or 7.5 GB, whichever comes first. 

4. If needed, use the search box to quickly narrow down to a specific log, based on date and time. The search is on the name of the log.

5. To download individual log files, select the down-arrow icon next to each log file in the table row.

   ![Screenshot of Server logs page, with down-arrow icon highlighted](./media/howto-configure-server-logs-in-portal/5-download.png)

## Set up diagnostic logs

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings** > **Add diagnostic settings**.

   ![Screenshot of Diagnostic settings options](./media/howto-configure-server-logs-in-portal/add-diagnostic-setting.png)

1. Provide a diagnostic setting name.

1. Specify which data sinks to send the slow query logs (storage account, event hub, or Log Analytics workspace).

1. Select **MySqlSlowLogs** as the log type.
![Screenshot of Diagnostic settings configuration options](./media/howto-configure-server-logs-in-portal/configure-diagnostic-setting.png)

1. After you've configured the data sinks to pipe the slow query logs to, select **Save**.
![Screenshot of Diagnostic settings configuration options, with Save highlighted](./media/howto-configure-server-logs-in-portal/save-diagnostic-setting.png)

1. Access the slow query logs by exploring them in the data sinks you configured. It can take up to 10 minutes for the logs to appear.

## Next steps
- See [Access slow query Logs in CLI](howto-configure-server-logs-in-cli.md) to learn how to download slow query logs programmatically.
- Learn more about [slow query logs](concepts-server-logs.md) in Azure Database for MySQL.
- For more information about the parameter definitions and MySQL logging, see the MySQL documentation on [logs](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html).