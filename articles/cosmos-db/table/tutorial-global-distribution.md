---
title: Azure Cosmos DB global distribution tutorial for API for Table
description: Learn how global distribution works in Azure Cosmos DB for Table accounts and how to configure the preferred list of regions
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: table
ms.custom: ignite-2022
ms.topic: tutorial
ms.date: 01/30/2020
ms.reviewer: mjbrown
---
# Set up Azure Cosmos DB global distribution using the API for Table
[!INCLUDE[Table](../includes/appliesto-table.md)]

This article covers the following tasks: 

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the [API for Table](introduction.md)

[!INCLUDE [cosmos-db-tutorial-global-distribution-portal](../includes/cosmos-db-tutorial-global-distribution-portal.md)]


## Connecting to a preferred region using the API for Table

In order to take advantage of the [global distribution](../distribute-data-globally.md), client applications should specify the current location where their application is running. This is done by setting the `CosmosExecutorConfiguration.CurrentRegion` property. The `CurrentRegion` property should contain a single location. Each client instance can specify their own region for low latency reads. The region must be named by using their [display names](/previous-versions/azure/reference/gg441293(v=azure.100)) such as "West US". 

The Azure Cosmos DB for Table SDK automatically picks the best endpoint to communicate with based on the account configuration and current regional availability. It prioritizes the closest region to provide better latency to clients. After you set the current `CurrentRegion` property, read and write requests are directed as follows:

* **Read requests:** All read requests are sent to the configured `CurrentRegion`. Based on the proximity, the SDK automatically selects a fallback geo-replicated region for high availability.

* **Write requests:** The SDK automatically sends all write requests to the current write region. In an account with multi-region writes, current region will serve the writes requests as well. Based on the proximity, the SDK automatically selects a fallback geo-replicated region for high availability.

If you don't specify the `CurrentRegion` property, the SDK uses the current write region for all operations.

For example, if an Azure Cosmos DB account is in "West US" and "East US" regions. If "West US" is the write region and the application is present in "East US". If the CurrentRegion property is not configured, all the read and write requests are always directed to the "West US" region. If the CurrentRegion property is configured, all the read requests are served from "East US" region.

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the Azure Cosmos DB Table APIs
