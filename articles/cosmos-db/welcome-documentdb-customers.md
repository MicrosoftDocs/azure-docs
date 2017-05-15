---
title: DocumentDB customers, welcome to Azure Cosmos DB | Microsoft Docs
description: Learn more about the annoucement made at //build 2017, in which DocumentDB customers are now Azure Cosmos DB customers. 
services: cosmosdb
author: mimig1
manager: jhubbard
editor: 

ms.assetid:
ms.service: cosmosdb
ms.devlang: n/a
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: database
ms.date: 05/12/2017
ms.author: mimig
---

# Welcome DocumentDB customers

DocumentDB customers, we are excited to let you know that you now part of the Azure Cosmos DB family! 

Azure Cosmos DB, [announced at //build 2017](https://azure.microsoft.com/blog/azure-cosmos-db-microsofts-globally-distributed-multi-model-database-service/), is the first globally-distributed data service that lets you elastically scale throughput and storage across any number of geographical regions while guaranteeing low latency, high availability, and consistency – backed by the most comprehensive SLAs in the industry, and supporting a multitude of data models and APIs. 

One of the APIs Azure Cosmos DB supports is the DocumentDB API and the document data-model. You're already familiar with the DocumentDB APIs, they're the APIs you already use to run your current DocumentDB apps. These APIs are not changing - the Nuget package, namespaces, and dependencies will all remain the same. You don't need to change anything to continue running your apps built on the DocumentDB APIs, Azure Cosmos DB is simply the name of the service they are now a part of. 

Let's go through a number of questions you may have about the change. 

## What do I need to do to ensure my DocumentDB resources continue to run on Azure Cosmos DB?

Nothing, there are no changes you need to make. Your DocumentDB resources are now Azure Cosmos DB resources and there was no interruption in service while this move occurred.

## What changes do I need to make for my app to work with Azure Cosmos DB?

There are no changes to make. Classes, namespaces, and Nuget package names have not changed. As always, we recommend that you keep your SDKs up to date to take advantage of the latest features and improvements. 

## What's changed in the Azure portal?

Azure DocumentDB no longer appears in the portal as an Azure service. Instead Azure Cosmos DB appears with a new icon, as shown below. All of your collections are available just as they were before, and you can still scale throughput, change consistency, and monitor SLAs. The capabilities of **Data Explorer (preview)** have been enhanced and you can now view and edit documents, create and run queries, and work with stored procedures, triggers, and UDF from one page, as shown below. 

![View and copy an access key in the Azure portal, Keys blade](./media/welcome-documentdb-customers/cosmos-db-data-explorer.png)

## Are there changes to pricing?

No, the cost running your app on Azure Cosmos DB is the same as it was before. However, you may benefit from the new request unit per minute feature we announced. For more information, see the [Scale throughput per minute](#rupm) section below.

## Are there changes to the Service Level Agreements (SLAs)?

No, the SLAs for availability, consistency, latency, and throughput are unchanged and are still displayed in the portal. For details about the SLAs, see [SLA for Azure Cosmos DB](https://azure.microsoft.com/en-us/support/legal/sla/cosmos-db/).
   
![Todo app with sample data](../../includes/media/cosmosdb-tutorial-review-slas/azure-cosmosdb-portal-metrics-slas.png)

## What's new in Azure Cosmos DB? 

Azure Cosmos DB is the next big leap in globally distributed, at scale, cloud databases. As a DocumentDB customer, you now have access to the new breakthrough system and capabilities offered by Azure Cosmos DB.

Since DocumentDB was made generally available in 2015, significant new capabilities have been added to the engine but only a subset of these capabilities were available in DocumentDB. These capabilities are in the areas of the core database engine as well as global distribution, elastic scalability, and industry-leading, comprehensive SLAs. Specifically, we have evolved the Azure Cosmos DB database engine to be able to efficiently map all popular data models, type systems, and APIs to the underlying data model of Azure Cosmos DB. 

The current developer facing manifestation of this work is the new support for [Gremlin](graph-introduction.md) and [Table Storage APIs](table-introduction.md). And this is just the beginning… We will be adding other popular APIs and newer data models over time with more advances towards performance and storage at global scale. 

It is important to point out that DocumentDB’s [SQL dialect](../documentdb/documentdb-sql-query.md) has always been just one of the many APIs that the underlying Cosmos DB was capable of supporting. As a developer using a fully managed service like Azure Cosmos DB, the only interface to the service is the APIs exposed by the service. To that end, nothing really changes for you as an existing DocumentDB customer. Azure Cosmos DB offers the exactly the same SQL API that DocumentDB did. However, now (and in the future) you can get access to other capabilities which were previously not accessible. 

Another manifestation of our continued work is the extended foundation for global and elastic scalability of throughput and storage. One of the very first manifestations of it is the [RU/m](request-units-per-minute.md) but we have more capabilities that we will be announcing in these areas. These new capabilities will help reduce costs for our customers for various workloads. We have made several foundational enhancements to the global distribution subsystem. One of the many developer facing manifestations of this work is the consistent prefix consistency model (making in total 5 well-defined consistency models). However, there are many more interesting capabilities we will release as they mature. 

## What's next with Azure Cosmos DB?

Azure Cosmos DB is a constantly evolving database service. All new capabilities are validated on large scale applications inside Microsoft, subsequently exposed to key external customers, and finally, released to the world. 

The new Gremlin and Table API support are just the beginning of the popular APIs and data models Azure Cosmos DB will support, and look forward to sharing new data models with you as they're announced. We also continue to make great strides in performance and storage at global scale 

As always, we thank you for your being an Azure DocumentDB customer, and hope the move to Azure Cosmos DB provides exciting opportunities to expand the solutions you can provide, while building on the foundations in DocumentDB you're already familiar with. If you have questions, please reach out to us at askcosmosdb@microsoft.com or on twitter at [@AzureCosmosDB](https://twitter.com/AzureCosmosDB) as we want to continue to support you as you grow with us. 


Thanks,

The Azure Cosmos DB team