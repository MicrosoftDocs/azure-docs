---
title: 'How to enable and download server logs for Azure Database for PostgreSQL - Flexible Server'
description: This article describes how to download and list server logs using Azure portal.
ms.service: postgresql
ms.subservice: flexible-server
author: varun-dhawan
ms.author: varundhawan
ms.topic: conceptual
ms.date: 11/21/2023
---

# Enable, list and download server logs for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You can use server logs to help monitor and troubleshoot an instance of Azure Database for PostgreSQL - Flexible Server, and to gain detailed insights into the activities that have run on your servers.

By default, the server logs feature in Azure Database for PostgreSQL - Flexible Server is disabled. However, after you enable the feature, a flexible server starts capturing events of the selected log type and writes them to a file. You can then use the Azure portal or the Azure CLI to download the files to assist with your troubleshooting efforts. This article explains how to enable the server logs feature in Azure Database for PostgreSQL - Flexible Server and download server log files. It also provides information about how to disable the feature.

In this tutorial, you’ll learn how to:
- Enable the server logs feature.
- Disable the server logs feature.
- Download server log files.

## Prerequisites

To complete this tutorial, you need an existing Azure Database for PostgreSQL - Flexible Server. If you need to create a new server, see [Create an Azure Database for PostgreSQL - Flexible Server](./quickstart-create-server-portal.md).

## Enable Server logs

To enable the server logs feature, perform the following steps.

1. In the [Azure portal](https://portal.azure.com), select your PostgreSQL flexible server.

2. On the left pane, under **Monitoring**, select **Server logs**.

    :::image type="content" source="./media/how-to-server-logs-portal/1-how-to-serverlog.png" alt-text="Screenshot showing Azure Database for PostgreSQL - Server Logs.":::

3. To enable server logs, under **Server logs**, select **Enable**.

    :::image type="content" source="./media/how-to-server-logs-portal/2-how-to-serverlog.png" alt-text="Screenshot showing Enable Server Logs.":::

4. To configure retention period (in days), choose the slider. Minimum retention 1 days and Maximum retention is 7 days


## Download Server logs

To download server logs, perform the following steps.

> [!Note]
> After enabling logs, the log files will be available to download after few minutes.

1. Under **Name**, select the log file you want to download, and then, under **Action**, select **Download**.

    :::image type="content" source="./media/how-to-server-logs-portal/3-how-to-serverlog.png" alt-text="Screenshot showing Server Logs - Download.":::

2. To download multiple log files at one time, under **Name**, select the files you want to download, and then above **Name**, select **Download**.

    :::image type="content" source="./media/how-to-server-logs-portal/4-how-to-serverlog.png" alt-text="Screenshot showing server Logs - Download all.":::


## Disable Server Logs

1. From your Azure portal, select Server logs from Monitoring server pane.

2. For disabling Server logs to file, Uncheck Enable. (The setting will disable logging for all the log_types available)

    :::image type="content" source="./media/how-to-server-logs-portal/5-how-to-serverlog.png" alt-text="Screenshot showing server Logs - Disable.":::

3. Select Save