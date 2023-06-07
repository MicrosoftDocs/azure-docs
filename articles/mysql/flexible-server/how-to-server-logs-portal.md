---
title: 'How to enable and download server logs for Azure Database for MySQL - Flexible Server'
description: This article describes how to download and list server logs using Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd
ms.author: sisawant
ms.date: 08/05/2022
---
# Enable, list and download server logs for Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

You can use server logs to help monitor and troubleshoot an instance of Azure Database for MySQL - Flexible Server, and to gain detailed insights into the activities that have run on your servers.
By default, the server logs feature in Azure Database for MySQL - Flexible Server is disabled. However, after you enable the feature, a flexible server starts capturing events of the selected log type and writes them to a file. You can then use the Azure portal or the Azure CLI to download the files to assist with your troubleshooting efforts.
This article explains how to enable the server logs feature in Azure Database for MySQL - Flexible Server and download server log files. It also provides information about how to disable the feature.

In this tutorial, you’ll learn how to:
- Enable the server logs feature.
- Disable the server logs feature.
- Download server log files.

## Prerequisites

To complete this tutorial, you need an existing Azure Database for MySQL - Flexible Server. If you need to create a new server, see [Create an Azure Database for MySQL - Flexible Server](./quickstart-create-server-portal.md).

## Enable Server logs

To enable the server logs feature, perform the following steps.

1. In the [Azure portal](https://portal.azure.com), select your MySQL flexible server.

2. On the left pane, under **Monitoring**, select **Server logs**.

    :::image type="content" source="./media/how-to-server-logs-portal/1-how-to-serverlog.png" alt-text="Screenshot showing Azure Database for My SQL - Server Logs.":::

3. To enable server logs, under **Server logs**, select **Enable**.

    :::image type="content" source="./media/how-to-server-logs-portal/2-how-to-serverlog.png" alt-text="Screenshot showing Enable Server Logs.":::

>[!Note]
> You can also enable server logs in the Azure portal, on the [Server parameters](./how-to-configure-server-parameters-portal.md) pane for your server, by setting the value of the log_output parameter to FILE.
> For more information on the log_output parameter, in the MySQL documentation, see topic Server System Variables ([version 5.7](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_log_output) or [version 8.0](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_log_output)).

4. To enable the slow_query_log log, under **Select logs to enable**, select **slow_query_log**.

    :::image type="content" source="./media/how-to-server-logs-portal/3-how-to-serverlog.png" alt-text="Screenshot showing select slow log - Server Logs.":::

To configure slow_logs on your Azure Database for MySQL - Flexible Server, see [Query Performance Insight.](./tutorial-query-performance-insights.md)


## Download Server logs

To download server logs, perform the following steps.
> [!Note]
> After enabling logs, the log files will be available to download after few minutes.

1. Under **Name**, select the log file you want to download, and then, under **Action**, select **Download**.

    :::image type="content" source="./media/how-to-server-logs-portal/4-how-to-serverlog.png" alt-text="Screenshot showing Server Logs - Download.":::

    For HA enabled Azure Database for MySQL - Flexible Server, server logs for standby server can be identified by another four-letter identifier after the hostname of the server as shown below.

    :::image type="content" source="./media/how-to-server-logs-portal/5-how-to-serverlog.png" alt-text="Screenshot showing server Logs - HA logs.":::

2. To download multiple log files at one time, under **Name**, select the files you want to download, and then above **Name**, select **Download**.

    :::image type="content" source="./media/how-to-server-logs-portal/6-how-to-serverlog.png" alt-text="Screenshot showing server Logs - Download all.":::


## Disable Server Logs

1. From your Azure portal, select Server logs from Monitoring server pane.

2. For disabling Server logs to file, Uncheck Enable. (The setting will disable logging for all the log_types available)

    :::image type="content" source="./media/how-to-server-logs-portal/7-how-to-serverlog.png" alt-text="Screenshot showing server Logs - Disable.":::

3. Select Save

    :::image type="content" source="./media/how-to-server-logs-portal/8-how-to-serverlog.png" alt-text="Screenshot showing server Logs - Save.":::


## Next steps
- Learn more about [How to enable slow query logs](./tutorial-query-performance-insights.md#configure-slow-query-logs-by-using-the-azure-portal)
- List and download [Server logs using Azure CLI](./how-to-server-logs-cli.md)
