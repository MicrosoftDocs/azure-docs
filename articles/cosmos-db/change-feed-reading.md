---
title: Working with the change feed support in Azure Cosmos DB | Microsoft Docs
description: Use Azure Cosmos DB change feed support to track changes in documents and perform event-based processing like triggers and keeping caches and analytics systems up-to-date. 
keywords: change feed
services: cosmos-db
author: rafats
manager: kfile

ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: rafats

---
# Ways to work with the change feed

You can work with the Cosmos DB change feed using any of the options below:

* Using Azure Functions. Azure Functions is the simplest and most recommended option. When you create a Cosmos DB trigger in an Azure Functions app, you can select the Cosmos DB container to connect to, and the Azure Function gets triggered whenever a change to the container is made. Triggers can be created in the Azure Functions portal, in the Cosmos DB portal or programmatically. Visual Studio and VS Code have great support to write Azure Functions, and you can even use the Azure Functions CLI for cross-platform development. You can write and debug the code on your desktop, and then deploy the function with one click. See [Azure Cosmos DB: Serverless database computing using Azure Functions](serverless-computing-database.md) and [Using change feed with Azure Functions](TBD).

* Using change feed processor library. The change feed processor library hides complexity, yet still gives you complete control of change feed. The library follows the observer pattern, where your processing function is called by the library. If you have a high throughput change feed, you can instantiate multiple clients to read the change feed. Because you're using change feed processor library, it will automatically divide the load among the different clients without you having to implement this logic. All of the complexity is handled by the library. If you want to have your own load balancer, then you can implement IParitionLoadBalancingStrategy for a custom partition strategy to process change feed. By implementing IPartitionProcessor, you can perform custom processing on a partition. See [Using change feed processor library](change-feed-processor.md).

* Using SDK. With the SDK, you get low-level control of change feed. You can manage the checkpoint, you can access a particular logical partition key, etc. If you have multiple readers, you can use ChangeFeedOptions to distribute read load to different threads or different clients. See [Using change feed with SDK](TBD).

## Next steps
* [Overview of change feed](change-feed.md)
* [Using change feed with Azure Functions](TBD)
* [Using change feed with SDK](TBD)
* [Using change feed processor library](change-feed-processor.md)
* [How to work with change feed processor library](TBD)
* [How to work with change feed using JavaScript](TBD)
* [How to work with change feed using Java](TBD)
* [How to work with change feed using Spark](TBD)
* [Concurrency Control](TBD)