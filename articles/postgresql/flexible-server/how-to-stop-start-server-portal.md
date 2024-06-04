---
title: Stop/start - Azure portal
description: This article describes how to stop/start operations in Azure Database for PostgreSQL - Flexible Server through the Azure portal.
author: varun-dhawan
ms.author: varundhawan
ms.reviewer: maghan
ms.date: 04/30/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
#customer intent: As a user, I want to learn how to stop/start an Azure Database for PostgreSQL flexible server instance using the Azure portal so that I can manage my server efficiently.
---

# Stop/Start an Azure Database for PostgreSQL - Flexible Server instance using Azure portal

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides step-by-step instructions to stop and start an Azure Database for PostgreSQL flexible server instance.

## Prerequisites

To complete this how-to guide, you need:

-   You must have an Azure Database for PostgreSQL flexible server instance.

## Stop a running server

1.  In the [Azure portal](https://portal.azure.com/), choose the Azure Database for PostgreSQL flexible server instance that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

> [!NOTE]
> Once the server is stopped, other management operations are not available for the Azure Database for PostgreSQL flexible server instance.
> While the Azure Database for PostgreSQL flexible server instance is in stopped state, it could be briefly restarted for scheduled monthly maintenance, and then returned to its stopped state. This ensures that even instances in a stopped state stay up to date with all necessary patches and updates.

## Start a stopped server

1.  In the [Azure portal](https://portal.azure.com/), choose the Azure Database for PostgreSQL flexible server instance that you want to start.

2.  From the **Overview** page, click the **Start** button in the toolbar.

> [!NOTE]
> Once the server is started, all management operations are now available for the Azure Database for PostgreSQL flexible server instance.

## Related content

-   Learn about [Compute](./concepts-compute.md)
-   Learn about [Storage](./concepts-storage.md)
