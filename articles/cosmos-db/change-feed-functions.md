---
title: How to use Azure Cosmos DB change feed with Azure Functions
description: Use Azure Cosmos DB change feed with Azure Functions 
author: rimman
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/06/2018
ms.author: rimman
ms.reviewer: sngun
---

# Trigger Azure Functions from Azure Cosmos DB

If you're using Azure Functions, the simplest way to connect to change feed is to add an [Azure Cosmos DB trigger](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger) to your Azure Functions app. When you create a Cosmos DB trigger in an Azure Functions app, you select the Cosmos container to connect to and the function is triggered whenever you change something in the container.

Triggers can be created in the Azure Functions portal or in the Azure Cosmos DB portal or programmatically. For more information, see [serverless database computing using Azure Cosmos DB and Azure Functions](serverless-computing-database.md).

## Frequently asked questions

### How can I configure Azure functions to read from a particular region?

It is possible to define the [PreferredLocations](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations?view=azure-dotnet#Microsoft_Azure_Documents_Client_ConnectionPolicy_PreferredLocations) when using the Azure Cosmos DB trigger to specify a list of regions. It's same as you customize the ConnectionPolicy, to make the trigger read from your preferred regions. Ideally, you want to read from the closest region where your Azure Functions is deployed.

### What is the default size of batches in Azure Functions?

The default size is 100 items for every invocation of Azure Functions. However, this number is configurable within the function.json file. Here is complete [list of configuration options](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---configuration). If you are developing locally, update the application settings within the local.settings.json file.

### I am monitoring a container and reading its change feed, however I don't get all the inserted documents, some items are missing?

Make sure that there is no other Azure Function reading the same container with the same lease container. The missing documents are processed by the other Azure Functions that are also using the same lease.

Therefore, if you are creating multiple Azure Functions to read the same change feed, they must use different lease containers or use the "leasePrefix" configuration to share the same container. However, when you use change feed processor library you can start multiple instances of your Azure Function and the SDK will divide the documents between different instances automatically for you.

### Azure Cosmos item is updated every second, and I don't get all the changes in Azure Functions listening to change feed?

Azure Functions polls the change feed for changes continuously, with a maximum default delay of 5 seconds. If there are no pending changes to be read, or if there are changes pending after the trigger is applied, the function will read them right away. However, if there are no pending changes, the function will wait 5 seconds and poll for more changes.

If your document receives multiple changes in the same interval that took the Trigger to poll for new changes, you might receive the latest version of the document and not the intermediate one.

If you want to poll change feed for less than 5 seconds, for example, for every second, you can configure the polling time "feedPollDelay", see [the complete configuration](https://docs.microsoft.com/dotnet/api/microsoft.azure.documents.client.connectionpolicy.preferredlocations?view=azure-dotnet#Microsoft_Azure_Documents_Client_ConnectionPolicy_PreferredLocations). It is defined in milliseconds with a default of 5000. Polling for less than 1 second is possible but it's not advised because you will start using more CPU memory.

### Can multiple Azure Functions read one container’s change feed?

Yes. Multiple Azure Functions can read the same container’s change feed. However, the Azure Functions needs to have a separate “leaseCollectionPrefix” defined.

### If I am processing change feed by using Azure Functions, in a batch of 10 documents, and I get an error at seventh Document. In that case the last three documents are not processed how can I start processing from the failed document (i.e, seventh document) in my next feed?

To handle the error, the recommended pattern is to wrap your code with try-catch block and, if you are iterating over the list of documents, wrap each iteration in its own try-catch block. Catch the error and put that document on a queue (dead-letter) and then define logic to deal with the documents that produced the error. With this method if you have a 200-document batch, and just one document failed, you do not have to throw away the whole batch.

In case of error, you should not rewind the check point back to beginning else you will can keep getting those documents from change feed. Remember, change feed keeps the last final snap shot of the documents, because of this you may lose the previous snapshot on the document. change feed keeps only one last version of the document, and in between other processes can come and change the document.

As you keep fixing your code, you will soon find no documents on dead-letter queue. Azure Functions is automatically called by change feed system and check point is maintained internally by Azure Function. If you want to roll back the check point and control every aspect of it, you should consider using change feed Processor SDK.

### Are there any extra costs for using the Azure Cosmos DB Trigger?

The Azure Cosmos DB Trigger leverages the Change Feed Processor library internally. As such, it requires an extra collection, called Leases collection, to maintain state and partial checkpoints. This state management is needed to be able to dynamically scale and continue in case you want to stop your Azure Functions and continue processing at a later time. To learn more, see [how to work with change feed processor library](change-feed-processor.md).

## Next steps

You can now proceed to learn more about change feed in the following articles:

* [Overview of change feed](change-feed.md)
* [Ways to read change feed](read-change-feed.md)
* [Using change feed processor library](change-feed-processor.md)
* [How to work with change feed processor library](change-feed-processor.md)
* [Serverless database computing using Azure Cosmos DB and Azure Functions](serverless-computing-database.md)
