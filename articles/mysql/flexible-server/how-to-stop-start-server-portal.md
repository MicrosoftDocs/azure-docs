---
title: Stop/start - Azure portal - Azure Database for MySQL - Flexible Server
description: This article describes how to stop/start operations in Azure Database for MySQL through the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: VandhanaMehta
ms.author: vamehta
ms.date: 09/29/2020
---

# Stop/Start an Azure Database for MySQL - Flexible Server

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides step-by-step procedure to perform Stop and Start of the flexible server.

## Prerequisites

To complete this how-to guide, you need:

-   You must have an Azure Database for MySQL - Flexible Server.

## Stop a running server

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

    :::image type="content" source="media/how-to-stop-start-server-portal/stop-server.png" alt-text="Stop flexible server.":::

3.  Click **Yes** to confirm stopping your server.

    :::image type="content" source="media/how-to-stop-start-server-portal/confirm-stop.png" alt-text="Confirm stopping flexible server.":::

> [!NOTE]
> Once the server is stopped, the other management operations are not available for the flexible server.

## Start a stopped server

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to start.

2.  From the **Overview** page, click the **Start** button in the toolbar.

    :::image type="content" source="media/how-to-stop-start-server-portal/start-server.png" alt-text="Start flexible server.":::

> [!NOTE]
> Once the server is started, all management operations are now available for the flexible server.

## Next steps
- Learn more about [networking in Azure Database for MySQL - Flexible Server](./concepts-networking.md)
- [Create and manage Azure Database for MySQL - Flexible Server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).

