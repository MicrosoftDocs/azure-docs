---
title: Stop/start by using the Azure portal
description: This article describes how to stop/start operations in Azure Database for MySQL - Flexible Server by using the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
author: VandhanaMehta
ms.author: vamehta
ms.date: 09/29/2020
---

# Stop/Start an Azure Database for MySQL - Flexible Server instance

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides step-by-step procedure to perform Stop and Start of an Azure Database for MySQL flexible server instance.

## Prerequisites

To complete this how-to guide, you must have an Azure Database for MySQL flexible server instance.

## Stop a running server

1.  In the [Azure portal](https://portal.azure.com/), choose your Azure Database for MySQL flexible server instance that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

    :::image type="content" source="media/how-to-stop-start-server-portal/stop-server.png" alt-text="Stop flexible server.":::

3.  Click **Yes** to confirm stopping your server.

    :::image type="content" source="media/how-to-stop-start-server-portal/confirm-stop.png" alt-text="Confirm stopping flexible server.":::

> [!NOTE]
> Once the server is stopped, the other management operations are not available for the Azure Database for MySQL flexible server instance.

## Start a stopped server

1.  In the [Azure portal](https://portal.azure.com/), choose your Azure Database for MySQL flexible server instance that you want to start.

2.  From the **Overview** page, click the **Start** button in the toolbar.

    :::image type="content" source="media/how-to-stop-start-server-portal/start-server.png" alt-text="Start flexible server.":::

> [!NOTE]
> Once the server is started, all management operations are now available for the Azure Database for MySQL flexible server instance.

## Next steps
- Learn more about [networking in Azure Database for MySQL flexible server](./concepts-networking.md)
- [Create and manage Azure Database for MySQL flexible server instance virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).

