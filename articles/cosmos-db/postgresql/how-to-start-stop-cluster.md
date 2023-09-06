---
title: Start and stop cluster - Azure Cosmos DB for PostgreSQL
description: How to start and stop compute on the cluster nodes
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: how-to
ms.date: 3/03/2023
---
# Start and stop compute on a cluster

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL allows you to stop and start compute on all nodes in a cluster. 

## Stop a running cluster

1.  In the [Azure portal](https://portal.azure.com/), choose the Azure Cosmos DB for PostgreSQL cluster that you want to stop.

2.  From the **Overview** page, click the **Stop** button in the toolbar.

> [!NOTE]
> Once the cluster is stopped, other management operations are not available for the cluster.


## Start a stopped cluster

1.  In the [Azure portal](https://portal.azure.com/), choose the Azure Cosmos DB for PostgreSQL cluster that you want to start.

2.  From the **Overview** page, click the **Start** button in the toolbar.

> [!NOTE]
> Once the cluster is started, all management operations are now available for the cluster.

## Next steps

- Learn more about [compute start and stop in Azure Cosmos DB for PostgreSQL](./concepts-compute-start-stop.md).

