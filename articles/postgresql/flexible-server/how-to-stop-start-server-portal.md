---
title: Stop/start - Azure portal - Azure Database for PostgreSQL Flexible Server
description: This article describes how to stop/start operations in Azure Database for PostgreSQL through the Azure portal.
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.topic: how-to
ms.date: 09/22/2020
---

# Stop/Start an Azure Database for PostgreSQL - Flexible Server (Preview) using Azure portal

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is currently in preview.

This article provides step-by-step instructions to stop and start a flexible server.

## Pre-requisites

To complete this how-to guide, you need:

-   You must have an Azure Database for PostgreSQL Flexible Server.

## Stop a running server

1.  In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

> [!NOTE]
> Once the server is stopped, other management operations are not available for the flexible server.

Please note that stopped servers will automatically start again after seven days. Any pending maintenance updates will be applied when the server is started the next time.

## Start a stopped server

1.  In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to start.

2.  From the **Overview** page, click the **Start** button in the toolbar.

> [!NOTE]
> Once the server is started, all management operations are now available for the flexible server.

## Next steps

- Learn more about [compute and storage options in Azure Database for PostgreSQL Flexible Server](./concepts-compute-storage.md).
