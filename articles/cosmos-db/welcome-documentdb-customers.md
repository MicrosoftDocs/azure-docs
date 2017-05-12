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

As you may have heard at //build, Microsoft announced a new globally-distributed service - Azure Cosmos DB. Azure Cosmos DB is the first globally-distributed data service that lets you to elastically scale throughput and storage across any number of geographical regions while guaranteeing low latency, high availability and consistency – backed by the most comprehensive SLAs in the industry, and supports a multitude of data models and APIs. 

One of APIs Azure Cosmos DB supports is the DocumentDB API and the document data-model. The DocumentDB APIs are the APIs you already use to run your current DocumentDB apps, so no changes are needed to continue running any existing applications. There is also no change to pricing, and no change to the SLAs. 

One change you will notice is that when you log into the Azure portal, all of your portal services are now available under the Azure Cosmos DB name, and use the new Azure Cosmos DB logo. So there are no changes needed on your part to continue running your services - everything continues to operate as before, your resources are just managed by a new service.

## What's new with Azure Cosmos DB? 

Azure Cosmos DB adds support for multiple data models including graph and key/value data, in addition to the document data-model you're already familiar with. 

### Support for Graph API

The Graph API enables you to model the rich relationships between entities. For example, following diagram dipicts a sample graph that shows the relationship between people, mobile devices, interests, and operating systems. Data with relationships like this are perfect for the Graph API. You can learn more about graph support in [Introduction to Azure Cosmos DB: Graph API](graph-introduction.md).

![Sample database showing persons, devices, and interests](./media/graph-introduction/sample-graph.png) 

### Support for Table API

Azure Cosmos DB also adds support for key/value data models that have high throughput requirements. The Table API enables you to store key/value pair data, just as you would with Azure Table storage, but benefit from the single-digit millisecond latency, tunable consistency levels, and global-replication options available from Azure Cosmos DB. 

![Azure Table storage API and Azure Cosmos DB](./media/table-introduction/premium-tables.png)

If you're an existing Azure Table storage customer, you can continue to use your Azure Storage account for tables that have high storage and lower throughput requirements. Just as with DocumentDB accounts, there is nothing you need to do if you want your app to continue to run as it has and your table resources will continue to be available under Azure Storage in the Azure portal until they are upgraded to Azure Cosmos DB in the future. 

However, if you want to take advantage of the increased throughput available with Azure Cosmos DB, please reach out to askcosmosdb@microsoft.com with your subscription ID, and we will work with you to migrate your existing Azure Storage account to the Azure Cosmos DB: Table API premium preview offering. 

