---
title: Stop/start - Azure portal - Azure Database for MySQL server
description: This article describes how to stop/start operations in Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
author: mksuni
ms.author: sumuth
ms.topic: how-to
ms.date: 06/20/2022
---

# Stop/Start an Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

> [!IMPORTANT]
> When you **Stop** the server it remains in that state for the next 7 days in a stretch. If you do not manually **Start** it during this time, the server will automatically be started at the end of 7 days. You can choose to **Stop** it again if you are not using the server.

This article provides step-by-step procedure to perform Stop and Start of the single server.

## Prerequisites

To complete this how-to guide, you need:

-   You must have an Azure Database for MySQL single server.

> [!NOTE]
> Refer to the limitation of using [stop/start](concepts-servers.md#limitations-of-stopstart-operation)

## How to stop/start the Azure Database for MySQL using Azure portal

### Stop a running server

1.  In the [Azure portal](https://portal.azure.com/), choose your MySQL server that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

    :::image type="content" source="./media/how-to-stop-start-server/mysql-stop-server.png" alt-text="Azure Database for MySQL Stop server":::

    > [!NOTE]
    > Once the server is stopped, the other management operations are not available for the single server.

### Start a stopped server

1.  In the [Azure portal](https://portal.azure.com/), choose your single server that you want to start.

2.  From the **Overview** page, click the **Start** button in the toolbar.

    :::image type="content" source="./media/how-to-stop-start-server/mysql-start-server.png" alt-text="Azure Database for MySQL start server":::

    > [!NOTE]
    > Once the server is started, all management operations are now available for the single server.

## How to stop/start the Azure Database for MySQL using CLI

### Stop a running server

1.  In the [Azure portal](https://portal.azure.com/), choose your MySQL server that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

    ```azurecli-interactive
    az mysql server stop --name <server-name> -g <resource-group-name>
    ```
    > [!NOTE]
    > Once the server is stopped, the other management operations are not available for the single server.

### Start a stopped server

1.  In the [Azure portal](https://portal.azure.com/), choose your single server that you want to start.

2.  From the **Overview** page, click the **Start** button in the toolbar.

    ```azurecli-interactive
    az mysql server start --name <server-name> -g <resource-group-name>
    ```
    > [!NOTE]
    > Once the server is started, all management operations are now available for the single server.

## Next steps
Learn about [how to create alerts on metrics](how-to-alert-on-metric.md).
