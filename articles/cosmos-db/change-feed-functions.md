---
title: How to use change feed with Azure Functions
description: Use Azure Cosmos DB change feed with Azure Functions 
keywords: change feed
services: cosmos-db
author: rimman
manager: kfile

ms.service: cosmos-db
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: rimman

---
# How to use change feed with Azure Functions

If you're using Azure Functions, the simplest way to connect to change feed is to add an [Azure Cosmos DB trigger](https://docs.microsoft.com/azure/azure-functions/functions-bindings-cosmosdb-v2#trigger) to your Azure Functions app. When you create a Cosmos DB trigger in an Azure Functions app, you select the Cosmos container to connect to and the function is triggered whenever a change to the container is made.

Triggers can be created in the Azure Functions portal or in the Cosmos DB portal or programmatically. For more information, see [Serverless database computing using Azure Cosmos DB and Azure Functions](https://docs.microsoft.com/en-us/azure/cosmos-db/serverless-computing-database).

## How can I configure Azure functions to read from a particular region?

It is possible to define the [PreferredLocations](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations?view=azure-dotnet#Microsoft_Azure_Documents_Client_ConnectionPolicy_PreferredLocations) when using the Cosmos DB Trigger to specify a list of regions, just like you would do when customizing the ConnectionPolicy, to make the Trigger read from your preferred region(s). Ideally, you want to read from the closest region to where your Azure Functions are deployed.

## What is the default size of batches in Azure Functions?

The default size is 100 items for every invocation of Azure Functions. However, this number is configurable within the function.json file. Here is complete [list of configuration options](https://docs.microsoft.com/azure/azure-functions/functions-bindings-cosmosdb-v2#trigger---configuration). If you are developing locally, update the application settings within the local.settings.json file.

## I am monitoring a container and reading its change feed, however I see I am not getting all the inserted document, some items are missing. What is going on here?

Please make sure that there is no other function reading the same container with the same lease container. It happened to me, and later I realized the missing documents are processed by my other Azure functions, which is also using the same lease.

Therefore, if you are creating multiple Azure Functions to read the same change feed then they must use different lease container or use the "leasePrefix" configuration to share the same container. However, when you use change feed processor library you can start multiple instances of your function and SDK will divide the documents between different instances automatically for you.

## A Cosmos item is updated every second, and I am not getting all the changes in Azure Functions listening to change feed. What is going on here?

Azure Functions polls the change feed for changes continuously, with a maximum default delay of 5 seconds in case there are no changes pending to be read, that is, if there are changes pending after it triggers, it will read them right away, but if there are no pending changes, it will wait 5 seconds and poll for more changes.

If your document received multiple changes in the interval that took the Trigger to poll for new changes, you might receive the latest version of the document and not the intermediate.

If you want to go below 5 seconds, and want to poll change Feed every second, you can configure the polling time "feedPollDelay", see [the complete configuration](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations?view=azure-dotnet#Microsoft_Azure_Documents_Client_ConnectionPolicy_PreferredLocations). It is defined in milliseconds with a default of 5000. Below 1 second is possible but not advisable, as you will start burning more CPU.

## Can multiple Azure Functions read one container’s change feed?

Yes. Multiple Azure Functions can read the same container’s change feed. However, the Azure Functions need to have a separate “leaseCollectionPrefix” defined.

## If I am processing change feed by using Azure Functions, say a batch of 10 documents, and I get an error at 7th Document. In that case the last three documents are not processed how can I start processing from the failed document (i.e, 7th document) in my next feed?

To handle the error, the recommended pattern is to wrap your code with try-catch block and, if you are iterating over the list of documents, wrap each iteration in its own try-catch block. Catch the error and put that document on a queue (dead-letter) and then define logic to deal with the documents that produced the error. With this method if you have a 200-document batch, and just one document failed, you do not have to throw away the whole batch.

In case of error you should not rewind the check point back to beginning else you will can keep getting those documents from change feed. Remember, change feed keeps the last final snap shot of the documents, because of this you may lose the previous snapshot on the document. change feed keeps only one last version of the document, and in between other processes can come and change the document.

As you keep fixing your code, you will soon find no documents on dead-letter queue. Azure Functions is automatically called by change feed system and check point is maintained internally by Azure Function. If you want to roll back the check point and control every aspect of it, you should consider using change feed Processor SDK.

## Are there any extra costs for using the Azure Cosmos DB Trigger?

The Cosmos DB Trigger leverages the Change Feed Processor library internally. As such, it requires an extra collection, called Leases collection, to maintain state and partial checkpoints. This state management is needed to be able to dynamically scale and continue in case you want to stop your Functions and continue processing at a later time. See [How to work with change feed processor library](change-feed-processor.md).




## Next steps

* [Overview of change feed](change-feed.md)
* [Ways to read change feed](change-feed-reading.md)
* [Using change feed with SDK](TBD)
* [Using change feed processor library](change-feed-processor.md)
* [How to work with change feed processor library](TBD)
* [How to work with change feed using JavaScript](TBD)
* [How to work with change feed using Java](TBD)
* [How to work with change feed using Spark](TBD)
* [Concurrency Control](TBD)
* [Serverless database computing using Azure Cosmos DB and Azure Functions](https://docs.microsoft.com/en-us/azure/cosmos-db/serverless-computing-database)