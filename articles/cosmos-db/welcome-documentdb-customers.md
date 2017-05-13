---
title: DocumentDB customers, wecome to Azure Cosmos DB | Microsoft Docs
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

## Welcome DocumentDB customers

DocumentDB customers, we are excited to let you know that you now part of the Azure Cosmos DB family! 

Azure Cosmos DB, [annouced at //build 2017](https://azure.microsoft.com/blog/azure-cosmos-db-microsofts-globally-distributed-multi-model-database-service/), is the first globally-distributed data service that lets you elastically scale throughput and storage across any number of geographical regions while guaranteeing low latency, high availability, and consistency – backed by the most comprehensive SLAs in the industry, and supporting a multitude of data models and APIs. 

One of the APIs Azure Cosmos DB supports is the DocumentDB API and the document data-model. You're already familiar with the DocumentDB APIs, they're the APIs you already use to run your current DocumentDB apps. These APIs are not changing - the Nuget package, namespaces, and dependencies will all remain the same. You don't need to change anything to continue running your apps built on the DocumentDB APIs, Azure Cosmos DB is simply the name of the service they are now a part of. 

Let's go through a number of questions you may have about the change. 

## What do I need to do to ensure my DocumentDB resources continue to run on Azure Cosmos DB?

Nothing, there are no changes you need to make. Your DocumentDB resources are now Azure Cosmos DB resources and there was no interruption in service while this move occurred.

## What changes do I need to make for my app to work with Azure Cosmos DB?

There are no changes to make. Classes, namespaces, and Nuget package names have not changed. As always, we recommend that you keep your SDKs up to date to take advantage of the latest features and improvments. 

## What's changed in the Azure portal?

Azure DocumentDB no longer appears in the portal as an Azure service. Instead Azure Cosmos DB appears with a new icon, as shown below. All of your collections are available just as they were before, and you can still scale throughput, change consistency, and monitor SLAs. The capabilities of **Data Explorer (preview)** have been enhanced and you can now view and edit documents, create and run queries, and work with stored procedures, triggers, and UDF from one page, as shown below. 

![View and copy an access key in the Azure portal, Keys blade](./media/welcome-documentdb-customers/cosmos-db-data-explorer.png)

## Are there changes to pricing?

No, the cost running your app on Azure Cosmos DB is the same as it was before. However, you may benefit from the new request unit per minute feature we announced. For more information, see the [Scale throughput per minute](#rupm) section below.

## Are there changes to the Service Level Agreements (SLAs)?

No, the SLAs for availability, consistency, latency, and throughput are unchanged and are still displayed in the portal. For details about the SLAs, see [SLA for Azure Cosmos DB](https://azure.microsoft.com/en-us/support/legal/sla/cosmos-db/).
   
![Todo app with sample data](../../includes/media/cosmosdb-tutorial-review-slas/azure-cosmosdb-portal-metrics-slas.png)

## What's new with Azure Cosmos DB? 

Azure Cosmos DB adds support for multiple data models including graph and key/value data, in addition to the document data-model you're already familiar with. We've also added a new consistency level, and the ability to set throughput per minute, instead of just per second as with DocumentDB. 

What's new?
* [Graph API](#graph-api)
* [Table API](#table-api)
* [New consistent prefix consistency level](#consistent-prefix)
* [Scale throughput per minute with RU/m](#rupm)

<a id="graph-api"></a>
### Support for Graph API

The Graph API enables you to expand your data modeling techniques to capture not only the complexities of the entities your modeling, but the rich relationship between entities. Graph databases are common for social networking apps, when you not only want to know about a user, but you want to know who knows who, and find similarities and connections between those people, the places they live, and their interests. The following diagram dipicts a simple graph you could create using the Graph API. Learn more about graph support in [Introduction to Azure Cosmos DB: Graph API](graph-introduction.md).

![Sample database showing persons, devices, and interests](./media/graph-introduction/sample-graph.png) 

<a id="table-api"></a>
### Support for Table API

Azure Cosmos DB also adds support for key/value data models that have high throughput requirements. The Table API enables you to store key/value pair data, just as you would with Azure Table storage, but benefit from the single-digit millisecond latency, tunable consistency levels, and global-replication options available from Azure Cosmos DB. 

You can learn more about the Table API in [Introduction to Azure Cosmos DB: Table API](table-introduction.md), or if you'd like to create a Table API account with Azure Cosmos DB, follow the [Build a .NET application using the Table API](create-table-dotnet.md) quickstart. 

![Azure Table storage API and Azure Cosmos DB](./media/table-introduction/premium-tables.png)

If you're an existing Azure Table storage customer, you have two options. 

1. If you want to continue to use your Azure Table storage account with no changes, you're welcome to do so - you don't need to change anything. Your table resources are still available under Azure Storage in the Azure portal. This will change in the future as Azure Cosmos DB starts managing these accounts - but there are no changes right now. 

2. If you want to take advantage of the increased throughput available with Azure Cosmos DB with data in an existing Azure Storage account, please reach out to askcosmosdb@microsoft.com with your subscription ID. We will work with you to migrate your existing Azure Storage account to the Azure Cosmos DB Table API premium preview offering. 

<a id="consistent-prefix"></a>
### New consistency level: Consistent prefix

Consistent prefix is a new consistency level available to all Azure Cosmos DB accounts. Consistent prefix falls between Eventual consistency and Session level consistency on the consistency continuum. Learn more about the consistent prefix level in the [Tunable data consistency levels](../documentdb/documentdb-consistency-levels.md#consistent-prefix) article. 

![Azure Cosmos DB offers multiple, well defined (relaxed) consistency models to choose from](media/introduction/azure-cosmos-db-consistency-levels.png)

<a id="rupm"></a>
### Scale throughput per minute

With DocumentDB, you could scale your throughput from 400-250K RU/s in the portal or using the APIs. However if you had a spiky workload, many customers would over provision their throughput to avoid throttling during peak usage. 

To give customers a way to provide predictable performance when they have unpredictable needs and spiky workloads, we introduced the concept of request units per minute (RU/m). With RU/m, you get 10 times your provisioned RU/s value for use across each 60 second period. So if you provision 400 RU/s and you enable RU/m, you'll get 4,000 RU/m provisioned to use across each 60 second period. Each 60 seconds the allotment is refilled for you to use. So if you normally only use 300 RU/s, but need 2500 RU/s to handle occasional spikes, it's likely cost effective to turn on the RU/m feature so that you don't get throttled. 

Learn more about RU/m in the [Request units per minute in Azure Cosmos](request-units-per-minute.md) article. 

## Next steps

We thank you for your being an Azure DocumentDB customer, and hope the move to Azure Cosmos DB provides exciting opportunities to expand the solutions you can provide, while building on the foundations in DocumentDB you're already familiar with. If you have questions, please reach out to us at askcosmosdb@microsoft.com as we want to continue to support you as you grow with us. 

To start learning about the new capabilities in Azure Cosmos DB, we'd recommend trying out the new graph and table capabilities by completing the [Build an application using the Graph API](create-graph-dotnet.md) and [Build an application using the Table API](create-table-dotnet.md) quickstarts.

You can also read more about Azure Cosmos DB in these announcements and overviews: 

* [Welcome to Azure Cosmos DB](introduction.md) article
* [Azure Cosmos DB: The industry’s first globally-distributed, multi-model database service](https://azure.microsoft.com/blog/azure-cosmos-db-microsofts-globally-distributed-multi-model-database-service/) blog
* [A technical overview of Azure Cosmos DB](https://azure.microsoft.com/blog/a-technical-overview-of-azure-cosmos-db/)

Thanks,

The DocumentDB team