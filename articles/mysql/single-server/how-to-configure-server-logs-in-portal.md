---
title: Access slow query logs - Azure portal - Azure Database for MySQL
description: This article describes how to configure and access the slow logs in Azure Database for MySQL from the Azure portal.
ms.service: mysql
ms.subservice: single-server
author: code-sidd 
ms.author: sisawant
ms.topic: how-to
ms.date: 06/20/2022
---

# Configure and access slow query logs from the Azure portal

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

You can configure, list, and download the [Azure Database for MySQL slow query logs](concepts-server-logs.md) from the Azure portal.

## Prerequisites
The steps in this article require that you have [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-portal.md).

## Configure logging
Configure access to the MySQL slow query log. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select your Azure Database for MySQL server.

3. Under the **Monitoring** section in the sidebar, select **Server logs**. 
   :::image type="content" source="./media/how-to-configure-server-logs-in-portal/1-select-server-logs-configure.png" alt-text="Screenshot of Server logs options":::

4. To see the server parameters, select **Click here to enable logs and configure log parameters**.

5. Turn **slow_query_log** to **ON**.

6. Select where to output the logs to using **log_output**. To send logs to both local storage and Azure Monitor Diagnostic Logs, select **File**.

7. Consider setting "long_query_time" which represents query time threshold for the queries that will be collected in the slow query log file, The minimum and default values of long_query_time are 0 and 10, respectively.

8. Adjust other parameters, such as log_slow_admin_statements to log administrative statements. By default, administrative statements are not logged, nor are queries that do not use indexes for lookups. 

9. Select **Save**. 

   :::image type="content" source="./media/how-to-configure-server-logs-in-portal/3-save-discard.png" alt-text="Screenshot of slow query log parameters and save.":::

From the **Server Parameters** page, you can return to the list of logs by closing the page.

## View list and download logs
After logging begins, you can view a list of available slow query logs, and download individual log files.

1. Open the Azure portal.

2. Select your Azure Database for MySQL server.

3. Under the **Monitoring** section in the sidebar, select **Server logs**. The page shows a list of your log files.

   :::image type="content" source="./media/how-to-configure-server-logs-in-portal/4-server-logs-list.png" alt-text="Screenshot of Server logs page, with list of logs highlighted":::

   > [!TIP]
   > The naming convention of the log is **mysql-slow-< your server name>-yyyymmddhh.log**. The date and time used in the file name is the time when the log was issued. Log files are rotated every 24 hours or 7.5 GB, whichever comes first. 

4. If needed, use the search box to quickly narrow down to a specific log, based on date and time. The search is on the name of the log.

5. To download individual log files, select the down-arrow icon next to each log file in the table row.

   :::image type="content" source="./media/how-to-configure-server-logs-in-portal/5-download.png" alt-text="Screenshot of Server logs page, with down-arrow icon highlighted":::

## Set up diagnostic logs

1. Under the **Monitoring** section in the sidebar, select **Diagnostic settings** > **Add diagnostic settings**.

   :::image type="content" source="./media/how-to-configure-server-logs-in-portal/add-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings options":::

2. Provide a diagnostic setting name.

3. Specify which data sinks to send the slow query logs (storage account, event hub, or Log Analytics workspace).

4. Select **MySqlSlowLogs** as the log type.
:::image type="content" source="./media/how-to-configure-server-logs-in-portal/configure-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings configuration options":::

5. After you've configured the data sinks to pipe the slow query logs to, select **Save**.
:::image type="content" source="./media/how-to-configure-server-logs-in-portal/save-diagnostic-setting.png" alt-text="Screenshot of Diagnostic settings configuration options, with Save highlighted":::

6. Access the slow query logs by exploring them in the data sinks you configured. It can take up to 10 minutes for the logs to appear.

## Next steps
- See [Access slow query Logs in CLI](how-to-configure-server-logs-in-cli.md) to learn how to download slow query logs programmatically.
- Learn more about [slow query logs](concepts-server-logs.md) in Azure Database for MySQL.
- For more information about the parameter definitions and MySQL logging, see the MySQL documentation on [logs](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html).