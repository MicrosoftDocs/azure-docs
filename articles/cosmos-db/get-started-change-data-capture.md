---
title: Get started with change data capture in analytical store
titleSuffix: Azure Cosmos DB
description: Enable change data capture in Azure Cosmos DB analytical store for an existing account to consume a continuous and incremental feed of changed data.
author: Rodrigossz
ms.author: rosouz
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: how-to
ms.date: 03/23/2023
---

# Get started with change data capture in the analytical store for Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

TODO

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## Enable analytical store

First, enable Azure Synapse Link at the scope that's appropriate for your Azure Cosmos DB account, resources and workload.

| Option | Guide |
| --- | --- |
| **Enable account-wide** | [Enable Azure Synapse Link for entire Azure Cosmos DB account](configure-synapse-link.md#enable-synapse-link) |
| **Enable for a specific new container** | [Enable Azure Synapse Link for your new containers](configure-synapse-link.md#new-container) |
| **Enable for a specific existing container** | [Enable Azure Synapse Link for your existing containers](configure-synapse-link.md#existing-container) |

## Create a target Azure resource using data flows

The change data capture feature of the analytical store is available through the data flow feature of [Azure Data Factory](../data-factory/concepts-data-flow-overview.md) or [Azure Synapse](../synapse-analytics/concepts-data-flow-overview.md). Choose the option that works best for your workload.

### [Azure Data Factory](#tab/azure-data-factory)

1. [Create an Azure Data Factory](../data-factory/quickstart-create-data-factory.md), if you do not already have one.

    > [!TIP]
    > If possible, create the data factory in the same region where your Azure Cosmos DB account resides. Ideally, this would be the same region where your sink resource resides.

1. Launch the newly created data factory.

1. In the data factory, select the **Data flows** tab, and then select **New data flow**.

### [Azure Synapse Analytics](#tab/azure-synapse-analytics)

1. [Create an Azure Synapse workspace](../synapse-analytics/quickstart-create-workspace.md), if you do not already have one.

    > [!TIP]
    > If possible, create the workspace in the same region where your Azure Cosmos DB account resides. Ideally, this would be the same region where your sink resource resides.

1. Launch the newly created workspace.

1. In the workspace, select the **Develop** tab, select **Add new resource**, and then select **Data flow**.

## Configure source settings for the analytical store container

TODO

1. TODO

## Configure sink settings for update and delete opertions

TODO

1. TODO

## Schedule change data capture execution

TODO

1. TODO

## Next steps

- Review the [overview of Azure Cosmos DB analytical store](analytical-store-introduction.md)
