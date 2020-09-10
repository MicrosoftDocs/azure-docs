---
title: Stop/start - Azure portal - Azure Database for MySQL Flexible Server
description: This article describes how to stop/start operations in Azure Database for MySQL through the Azure portal.
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: how-to
ms.date: 09/21/2020
---

# Stop/Start an Azure Database for MySQL - Flexible Server (Preview)


> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is currently in public preview.

This article provides step-by-step procedure to perform Stop and Start of the flexible server.

## Prerequisites

To complete this how-to guide, you need:

-   You must have an Azure Database for MySQL Flexible Server.

## Stop a running server

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

> [!NOTE]
> Once the server is stopped, the other management operations are not available for the flexible server.

## Start a stopped server

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to start.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

> [!NOTE]
> Once the server is started, all management operations are now available for the flexible server.

## Next steps
- Learn more about [networking in Azure Database for MySQL Flexible Server](./concepts-networking.md)
- [Create and manage Azure Database for MySQL Flexible Server virtual network using Azure portal](./how-to-manage-virtual-network-portal.md).

