---
title: Download server logs
description: This article describes how to download server logs using Azure portal.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Enable, list and download server logs for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can use server logs to help monitor and troubleshoot an instance of Azure Database for PostgreSQL flexible server, and to gain detailed insights into the activities that have run on your servers.

By default, the server logs feature in Azure Database for PostgreSQL flexible server is disabled. However, after you enable the feature, Azure Database for PostgreSQL flexible server starts capturing events of the selected log type and writes them to a file. You can then use the Azure portal or the Azure CLI to download the files to assist with your troubleshooting efforts. This article explains how to enable the server logs feature in Azure Database for PostgreSQL flexible server and download server log files. It also provides information about how to disable the feature.

In this tutorial, you’ll learn how to:
>[!div class="checklist"]
> * Enable the server logs feature.
> * Disable the server logs feature.
> * Download server log files.

## Prerequisites

To complete this tutorial, you need an Azure Database for PostgreSQL flexible server instance. If you need to create a new server, see [Create an Azure Database for PostgreSQL - Flexible Server](./quickstart-create-server-portal.md).

## Enable Server logs

To enable the server logs feature, perform the following steps.

1. In the [Azure portal](https://portal.azure.com), select your Azure Database for PostgreSQL flexible server instance.

2. On the left pane, under **Monitoring**, select **Server logs**.

    :::image type="content" source="./media/how-to-server-logs-portal/1-how-to-server-log.png" alt-text="Screenshot showing Azure Database for PostgreSQL flexible server logs.":::

3. To enable server logs, under **Server logs**, select **Enable**.

    :::image type="content" source="./media/how-to-server-logs-portal/2-how-to-server-log.png" alt-text="Screenshot showing Enable Server Logs.":::

4. To configure retention period (in days), choose the slider. Minimum retention 1 days and Maximum retention is 7 days.

> [!Note]
> You can configure your server logs in the same way as above using the [Server Parameters](./howto-configure-server-parameters-using-portal.md), setting the appropriate values for these parameters: _logfiles.download_enable_ to ON to enable this feature, and _logfiles.retention_days_ to define retention in days. Initially, server logs occupy data disk space for about an hour before moving to backup storage for the set retention period.

## Download Server logs

To download server logs, perform the following steps.

> [!Note]
> After enabling logs, the log files will be available to download after few minutes.

1. Under **Name**, select the log file you want to download, and then, under **Action**, select **Download**.

    :::image type="content" source="./media/how-to-server-logs-portal/3-how-to-server-log.png" alt-text="Screenshot showing Server Logs - Download.":::

2. To download multiple log files at one time, under **Name**, select the files you want to download, and then above **Name**, select **Download**.

    :::image type="content" source="./media/how-to-server-logs-portal/4-how-to-server-log.png" alt-text="Screenshot showing server Logs - Download all.":::


## Disable Server Logs

1. From your Azure portal, select Server logs from Monitoring server pane.

2. For disabling Server logs to file, Uncheck Enable. (The setting will disable logging for all the log_types available)

    :::image type="content" source="./media/how-to-server-logs-portal/5-how-to-server-log.png" alt-text="Screenshot showing server Logs - Disable.":::

3. Select Save

## Next steps
- To enable and disable Server logs from CLI, you can refer to the [article.](./how-to-server-logs-cli.md)
- Learn more about [Logging](./concepts-logging.md)
