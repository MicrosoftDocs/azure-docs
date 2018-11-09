---
title: Accessing change feed in Azure Cosmos DB Azure Cosmos DB 
description: This article describes different options available to read and access change feed in Azure Cosmos DB Azure Cosmos DB.  
author: rafats

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: rafats

---
# Accessing change feed in Azure Cosmos DB

You can work with the Azure Cosmos DB change feed using any of the following options:

* **Using Azure Functions:** Azure Functions is the simplest and recommended option. When you create an Azure Cosmos DB trigger in an Azure Functions application, you can select the container to connect, and the Azure Function gets triggered whenever there is a change to the container. Triggers can be created by using the Azure Functions portal, the Azure Cosmos DB portal or programmatically with SDKs. Visual Studio and VS Code provide support to write Azure Functions, and you can even use the Azure Functions CLI for cross-platform development. You can write and debug the code on your desktop, and then deploy the function with one click. See [Serverless database computing using Azure Functions](serverless-computing-database.md) and [Using change feed with Azure Functions](TBD) articles to learn more.

* **Using change feed processor library:** The change feed processor library hides complexity and still gives you a complete control of the change feed. The library follows the observer pattern, where your processing function is called by the library. If you have a high throughput change feed, you can instantiate multiple clients to read the change feed. Because you're using change feed processor library, it will automatically divide the load among the different clients without you having to implement this logic. All the complexity is handled by the library. If you want to have your own load balancer, then you can implement `IParitionLoadBalancingStrategy` for a custom partition strategy to process change feed. To learn more, see [using change feed processor library](change-feed-processor.md).

* **Using SDK:** With the SDK, you get a low-level control of the change feed. You can manage the checkpoint, access a particular logical partition key, etc. If you have multiple readers, you can use `ChangeFeedOptions` to distribute read load to different threads or different clients. To learn more, see [using change feed with SDK](TBD).

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