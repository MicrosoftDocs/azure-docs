---
title: Third-party data modeling tools for Azure Cosmos DB graph data
description: This article describes various tools to  design the Graph data model.
author: manishmsfte
ms.author: mansha
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 05/25/2021
ms.reviewer: mjbrown
---
# Third-party data modeling tools for Azure Cosmos DB graph data

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

It is important to design the data model and further important to maintain. Here are set of third-party visual design tools which help in designing & maintaining the graph data model.

> [!IMPORTANT] 
> Solutions mentioned in this article are for information purpose only, the ownership lies to individual solution owner. We recommend users to do thorough evaluation and then select most suitable to you.

## Hackolade

Hackolade is a data modeling and schema design tool for NoSQL databases. It has a data modeling Studio, which helps in management of schemas for data-at-rest and data-in-motion.

### How it works
This tool provides the data modeling of vertices / edges and their respective properties.  It supports several use cases, some of them are:
-	Start from a blank page and think through different options to graphically build your Azure Cosmos DB Gremlin model.  Then forward-engineer the model to your Azure instance to evaluate the result and continue the evolution.  All such goodies without writing single line of code.
-	Reverse-engineer an existing graph on Azure to clearly understand its structure, so you could effectively query your graph too.  Then enrich the data model with descriptions, metadata, and constraints to produce documentation. It supports HTML, Markdown or PDF format, and feeds to corporate data governance or dictionary systems.
-	Migrate from relational database to NoSQL through the de-normalization of data structures.
-	Integrate with a CI/CD pipeline via a Command-Line Interface
-	Collaboration and versioning using Git
-	And much more…

### Sample

The animation at Figure-2 provides a demonstration of reverse engineering, extraction of entities from RDBMS then Hackolade will discover relations from foreign key relationships then modifications.

Sample DDL for source as SQL Server available at [here](https://github.com/Azure-Samples/northwind-ddl-sample/blob/main/nw.sql)   


:::image type="content" source="./media/modeling-tools/hackolade-screenshot.jpg" alt-text="Graph Diagram":::
**Figure-1:** Graph Diagram (extracted the graph data model)

After modification of data model, the tool can generate the gremlin script, which may include custom Azure Cosmos DB index script to ensure optimal indexes are created, refer Figure-2 for full flow.

The following image demonstrates reverse engineering from RDBMS & Hackolade in action:
:::image type="content" source="./media/modeling-tools/cosmos-db-gremlin-hackolade.gif" alt-text="Hackolade in action":::

**Figure-2:** Hackolade in action (demonstrating SQL to Gremlin data model conversion)
### Useful links 
-	[Download a 14-day free trial](https://hackolade.com/download.html)
-  [Get more data models](https://hackolade.com/samplemodels.html#cosmosdb).
-  [Documentation of Hackolade](https://hackolade.com/help/CosmosDBGremlin.html)

## Next steps
- [Visualizing the data](./visualization-partners.md)
