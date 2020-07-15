---
title: Azure Cosmos DB global distribution tutorial for Table API
description: Learn how global distribution works in Azure Cosmos DB Table API accounts and how to configure the preferred list of regions
author: sakash279
ms.author: akshanka
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: tutorial
ms.date: 01/30/2020
ms.reviewer: sngun
---
# Set up Azure Cosmos DB global distribution using the Table API

This article covers the following tasks: 

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the [Table API](table-introduction.md)

[!INCLUDE [cosmos-db-tutorial-global-distribution-portal](../../includes/cosmos-db-tutorial-global-distribution-portal.md)]


## Connecting to a preferred region using the Table API

In order to take advantage of the [global distribution](distribute-data-globally.md), client applications should specify the current location where their application is running. This is done by setting the `CosmosExecutorConfiguration.CurrentRegion` property. The `CurrentRegion` property should contain a single location. Each client instance can specify their own region for low latency reads. The region must be named by using their [display names](https://msdn.microsoft.com/library/azure/gg441293.aspx) such as "West US". 

The Azure Cosmos DB Table API SDK automatically picks the best endpoint to communicate with based on the account configuration and current regional availability. It prioritizes the closest region to provide better latency to clients. After you set the current `CurrentRegion` property, read and write requests are directed as follows:

* **Read requests:** All read requests are sent to the configured `CurrentRegion`. Based on the proximity, the SDK automatically selects a fallback geo-replicated region for high availability.

* **Write requests:** The SDK automatically sends all write requests to the current write region. In a multi master account, current region will serve the writes requests as well. Based on the proximity, the SDK automatically selects a fallback geo-replicated region for high availability.

If you don't specify the `CurrentRegion` property, the SDK uses the current write region for all operations.

For example, if an Azure Cosmos account is in "West US" and "East US" regions. If "West US" is the write region and the application is present in "East US". If the CurrentRegion property is not configured, all the read and write requests are always directed to the "West US" region. If the CurrentRegion property is configured, all the read requests are served from "East US" region.

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the Azure Cosmos DB Table APIs

