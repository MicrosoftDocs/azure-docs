---
title: Stop/start - Azure portal - Azure Database for PostgreSQL Flexible Server
description: This article describes how to stop/start operations in Azure Database for PostgreSQL through the Azure portal.
author: lfittl-msft
ms.author: lufittl
ms.service: postgresql
ms.topic: how-to
ms.date: 09/22/2020
---

# Stop/Start an Azure Database for PostgreSQL - Flexible Server (Preview)

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is currently in public preview.

This article provides step-by-step procedure to perform Stop and Start of the flexible server.

## Pre-requisites

To complete this how-to guide, you need:

-   You must have an Azure Database for PostgreSQL Flexible Server.

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

- Learn more about [compute and storage options in Azure Database for PostgreSQL Flexible Server](./concepts-compute-storage.md).
