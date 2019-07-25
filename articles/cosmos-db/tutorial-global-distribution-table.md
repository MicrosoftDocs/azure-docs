---
title: Azure Cosmos DB global distribution tutorial for Table API
description: Learn how to set up Azure Cosmos DB global distribution using the Table API.
author: wmengmsft
ms.author: wmeng
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: tutorial
ms.date: 12/13/2018
ms.reviewer: sngun
---
# Set up Azure Cosmos DB global distribution using the Table API

This article covers the following tasks: 

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the [Table API](table-introduction.md)

[!INCLUDE [cosmos-db-tutorial-global-distribution-portal](../../includes/cosmos-db-tutorial-global-distribution-portal.md)]


## Connecting to a preferred region using the Table API

In order to take advantage of [global distribution](distribute-data-globally.md), client applications can specify the ordered preference list of regions to be used to perform document operations. This can be done by setting the [TableConnectionPolicy.PreferredLocations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cosmosdb.table.tableconnectionpolicy.preferredlocations?view=azure-dotnet#Microsoft_Azure_CosmosDB_Table_TableConnectionPolicy_PreferredLocations) property. The Azure Cosmos DB Table API SDK picks the best endpoint to communicate with based on the account configuration, current regional availability and the supplied preference list.

The PreferredLocations should contain a comma-separated list of preferred (multi-homing) locations for reads. Each client instance can specify a subset of these regions in the preferred order for low latency reads. The regions must be named using their [display names](https://msdn.microsoft.com/library/azure/gg441293.aspx), for example, `West US`.

All reads are sent to the first available region in the PreferredLocations list. If the request fails, the client will fail down the list to the next region, and so on.

The SDK attempts to read from the regions specified in PreferredLocations. So, for example, if the Database Account is available in three regions, but the client only specifies two of the non-write regions for PreferredLocations, then no reads will be served out of the write region, even in the case of failover.

The SDK automatically sends all writes to the current write region.

If the PreferredLocations property is not set, all requests will be served from the current write region.

That's it, that completes this tutorial. You can learn how to manage the consistency of your globally replicated account by reading [Consistency levels in Azure Cosmos DB](consistency-levels.md). And for more information about how global database replication works in Azure Cosmos DB, see [Distribute data globally with Azure Cosmos DB](distribute-data-globally.md).

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the Azure Cosmos DB Table APIs

