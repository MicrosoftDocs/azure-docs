---
title: include file
description: include file
services: cosmos-db
author: seesharprun
ms.service: cosmos-db
ms.topic: include
ms.date: 09/22/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: include file, ignite-2022
---

Before you start building the application, let's look into the hierarchy of resources in Azure Cosmos DB. Azure Cosmos DB has a specific object model used to create and access resources. The Azure Cosmos DB creates resources in a hierarchy that consists of accounts, databases, containers, and items.

:::image type="complex" source="media/object-model/resource-hierarchy.svg" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, databases, containers, and items." border="false":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child database nodes. One of the database nodes includes two child container nodes. The other database node includes a single child container node. That single container node has three child item nodes.
:::image-end:::

For more information about the hierarchy of different resources, see [working with databases, containers, and items in Azure Cosmos DB](../../resource-model.md).
