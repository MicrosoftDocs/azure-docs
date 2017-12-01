---
title: Azure Cosmos DB global distribution tutorial for Table API | Microsoft Docs
description: Learn how to setup Azure Cosmos DB global distribution using the Table API.
services: cosmos-db
keywords: global distribution, Table
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: cgronlun

ms.assetid: 8b815047-2868-4b10-af1d-40a1af419a70
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 11/15/2017
ms.author: mimig

---
# How to setup Azure Cosmos DB global distribution using the Table API

This article covers the following tasks: 

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the [Table API](table-introduction.md)

[!INCLUDE [cosmos-db-tutorial-global-distribution-portal](../../includes/cosmos-db-tutorial-global-distribution-portal.md)]


## Connecting to a preferred region using the Table API

In order to take advantage of [global distribution](distribute-data-globally.md), client applications can specify the ordered preference list of regions to be used to perform document operations. This can be done by setting the `TablePreferredLocations` configuration value in the app.config for the Azure Cosmos DB Table API SDK. The Azure Cosmos DB Table API SDK will pick the best endpoint to communicate with based on the account configuration, current regional availability and the supplied preference list.

The `TablePreferredLocations` should contain a comma-separated list of preferred (multi-homing) locations for reads. Each client instance can specify a subset of these regions in the preferred order for low latency reads. The regions must be named using their [display names](https://msdn.microsoft.com/library/azure/gg441293.aspx), for example, `West US`.

All reads are sent to the first available region in the `TablePreferredLocations` list. If the request fails, the client will fail down the list to the next region, and so on.

The SDK attempts to read from the regions specified in `TablePreferredLocations`. So, for example, if the Database Account is available in three regions, but the client only specifies two of the non-write regions for `TablePreferredLocations`, then no reads will be served out of the write region, even in the case of failover.

The SDK will automatically send all writes to the current write region.

If the `TablePreferredLocations` property is not set, all requests will be served from the current write region.

```xml
    <appSettings>
      <add key="TablePreferredLocations" value="East US, West US, North Europe"/>           
    </appSettings>
```

That's it, that completes this tutorial. You can learn how to manage the consistency of your globally replicated account by reading [Consistency levels in Azure Cosmos DB](consistency-levels.md). And for more information about how global database replication works in Azure Cosmos DB, see [Distribute data globally with Azure Cosmos DB](distribute-data-globally.md).

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the Azure Cosmos DB Table APIs

