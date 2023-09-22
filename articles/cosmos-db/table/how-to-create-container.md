---
title: Create a container in Azure Cosmos DB for Table
description: Learn how to create a container in Azure Cosmos DB for Table by using Azure portal, .NET, Java, Python, Node.js, and other SDKs. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: table
ms.custom: ignite-2022, devx-track-azurecli, devx-track-dotnet, devx-track-extended-java, devx-track-python
ms.topic: how-to
ms.date: 10/16/2020
ms.author: sidandrews
ms.reviewer: mjbrown 
---

# Create a container in Azure Cosmos DB for Table
[!INCLUDE[Table](../includes/appliesto-table.md)]

This article explains the different ways to create a container in Azure Cosmos DB for Table. It shows how to create a container using Azure portal, Azure CLI, PowerShell, or supported SDKs. This article demonstrates how to create a container, specify the partition key, and provision throughput.

This article explains the different ways to create a container in Azure Cosmos DB for Table. If you are using a different API, see [API for MongoDB](../mongodb/how-to-create-container.md), [API for Cassandra](../cassandra/how-to-create-container.md), [API for Gremlin](../gremlin/how-to-create-container.md), and [API for NoSQL](../how-to-create-container.md) articles to create the container.

> [!NOTE]
> When creating containers, make sure you don’t create two containers with the same name but different casing. That’s because some parts of the Azure platform are not case-sensitive, and this can result in confusion/collision of telemetry and actions on containers with such names.

## <a id="portal-table"></a>Create using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos DB account](quickstart-dotnet.md#create-an-azure-cosmos-db-account), or select an existing account.

1. Open the **Data Explorer** pane, and select **New Table**. Next, provide the following details:

   * Enter a Table ID.
   * Enter a throughput to be provisioned (for example, 1000 RUs).
   * Select **OK**.

    :::image type="content" source="../media/how-to-create-container/partitioned-collection-create-table.png" alt-text="Screenshot of API for Table, Add Table dialog box":::

> [!Note]
> For API for Table, the partition key is specified each time you add a new row.

## <a id="cli-mongodb"></a>Create using Azure CLI

[Create a API for Table table with Azure CLI](../scripts/cli/table/create.md). For a listing of all Azure CLI samples across all Azure Cosmos DB APIs see, [Azure CLI samples for Azure Cosmos DB](cli-samples.md).

## Create using PowerShell

[Create a API for Table table with PowerShell](../scripts/powershell/table/create.md). For a listing of all PowerShell samples across all Azure Cosmos DB APIs see, [PowerShell Samples](powershell-samples.md)

## Next steps

* [Partitioning in Azure Cosmos DB](../partitioning-overview.md)
* [Request Units in Azure Cosmos DB](../request-units.md)
* [Provision throughput on containers and databases](../set-throughput.md)
* [Work with Azure Cosmos DB account](../resource-model.md)
