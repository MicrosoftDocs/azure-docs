---
title: Troubleshoot issues when using Azure Functions trigger for Cosmos DB
description: Common issues, workarounds, and diagnostic steps, when using the Azure Functions trigger for Cosmos DB
author: ealsur
ms.service: cosmos-db
ms.date: 03/13/2020
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot issues when using Azure Functions trigger for Cosmos DB

This article covers common issues, workarounds, and diagnostic steps, when you use the [Azure Functions trigger for Cosmos DB](change-feed-functions.md).

## Dependencies

The Azure Functions trigger and bindings for Cosmos DB depend on the extension packages over the base Azure Functions runtime. Always keep these packages updated, as they might include fixes and new features that might address any potential issues you may encounter:

* For Azure Functions V2, see [Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB).
* For Azure Functions V1, see [Microsoft.Azure.WebJobs.Extensions.DocumentDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DocumentDB).

This article will always refer to Azure Functions V2 whenever the runtime is mentioned, unless explicitly specified.

## Consume the Azure Cosmos DB SDK independently

The key functionality of the extension package is to provide support for the Azure Functions trigger and bindings for Cosmos DB. It also includes the [Azure Cosmos DB .NET SDK](sql-api-sdk-dotnet-core.md), which is helpful if you want to interact with Azure Cosmos DB programmatically without using the trigger and bindings.

If want to use the Azure Cosmos DB SDK, make sure that you don't add to your project another NuGet package reference. Instead, **let the SDK reference resolve through the Azure Functions' Extension package**. Consume the Azure Cosmos DB SDK separately from the trigger and bindings

Additionally, if you are manually creating your own instance of the [Azure Cosmos DB SDK client](./sql-api-sdk-dotnet-core.md), you should follow the pattern of having only one instance of the client [using a Singleton pattern approach](../azure-functions/manage-connections.md#documentclient-code-example-c). This process will avoid the potential socket issues in your operations.

## Common scenarios and workarounds

### Azure Function fails with error message collection doesn't exist

Azure Function fails with error message "Either the source collection 'collection-name' (in database 'database-name') or the lease collection 'collection2-name' (in database 'database2-name') does not exist. Both collections must exist before the listener starts. To automatically create the lease collection, set 'CreateLeaseCollectionIfNotExists' to 'true'"

This means that either one or both of the Azure Cosmos containers required for the trigger to work do not exist or are not reachable to the Azure Function. **The error itself will tell you which Azure Cosmos database and container is the trigger looking for** based on your configuration.

1. Verify the `ConnectionStringSetting` attribute and that it **references a setting that exists in your Azure Function App**. The value on this attribute shouldn't be the Connection String itself, but the name of the Configuration Setting.
2. Verify that the `databaseName` and `collectionName` exist in your Azure Cosmos account. If you are using automatic value replacement (using `%settingName%` patterns), make sure the name of the setting exists in your Azure Function App.
3. If you don't specify a `LeaseCollectionName/leaseCollectionName`, the default is "leases". Verify that such container exists. Optionally you can set the `CreateLeaseCollectionIfNotExists` attribute in your Trigger to `true` to automatically create it.
4. Verify your [Azure Cosmos account's Firewall configuration](how-to-configure-firewall.md) to see to see that it's not it's not blocking the Azure Function.

### Azure Function fails to start with "Shared throughput collection should have a partition key"

The previous versions of the Azure Cosmos DB Extension did not support using a leases container that was created within a [shared throughput database](./set-throughput.md#set-throughput-on-a-database). To resolve this issue, update the [Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB) extension to get the latest version.

### Azure Function fails to start with "PartitionKey must be supplied for this operation."

This error means that you are currently using a partitioned lease collection with an old [extension dependency](#dependencies). Upgrade to the latest available version. If you are currently running on Azure Functions V1, you will need to upgrade to Azure Functions V2.

### Azure Function fails to start with "The lease collection, if partitioned, must have partition key equal to id."

This error means that your current leases container is partitioned, but the partition key path is not `/id`. To resolve this issue, you need to recreate the leases container with `/id` as the partition key.

### You see a "Value cannot be null. Parameter name: o" in your Azure Functions logs when you try to Run the Trigger

This issue appears if you are using the Azure portal and you try to select the **Run** button on the screen when inspecting an Azure Function that uses the trigger. The trigger does not require for you to select Run to start, it will automatically start when the Azure Function is deployed. If you want to check the Azure Function's log stream on the Azure portal, just go to your monitored container and insert some new items, you will automatically see the Trigger executing.

### My changes take too long to be received

This scenario can have multiple causes and all of them should be checked:

1. Is your Azure Function deployed in the same region as your Azure Cosmos account? For optimal network latency, both the Azure Function and your Azure Cosmos account should be colocated in the same Azure region.
2. Are the changes happening in your Azure Cosmos container continuous or sporadic?
If it's the latter, there could be some delay between the changes being stored and the Azure Function picking them up. This is because internally, when the trigger checks for changes in your Azure Cosmos container and finds none pending to be read, it will sleep for a configurable amount of time (5 seconds, by default) before checking for new changes (to avoid high RU consumption). You can configure this sleep time through the `FeedPollDelay/feedPollDelay` setting in the [configuration](../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) of your trigger (the value is expected to be in milliseconds).
3. Your Azure Cosmos container might be [rate-limited](./request-units.md).
4. You can use the `PreferredLocations` attribute in your trigger to specify a comma-separated list of Azure regions to define a custom preferred connection order.

### Some changes are repeated in my Trigger

The concept of a "change" is an operation on a document. The most common scenarios where events for the same document is received are:
* The account is using Eventual consistency. While consuming the change feed in an Eventual consistency level, there could be duplicate events in-between subsequent change feed read operations (the last event of one read operation appears as the first of the next).
* The document is being updated. The Change Feed can contain multiple operations for the same documents, if that document is receiving updates, it can pick up multiple events (one for each update). One easy way to distinguish among different operations for the same document is to track the `_lsn` [property for each change](change-feed.md#change-feed-and-_etag-_lsn-or-_ts). If they don't match, these are different changes over the same document.
* If you are identifying documents just by `id`, remember that the unique identifier for a document is the `id` and its partition key (there can be two documents with the same `id` but different partition key).

### Some changes are missing in my Trigger

If you find that some of the changes that happened in your Azure Cosmos container are not being picked up by the Azure Function, there is an initial investigation step that needs to take place.

When your Azure Function receives the changes, it often processes them, and could optionally, send the result to another destination. When you are investigating missing changes, make sure you **measure which changes are being received at the ingestion point** (when the Azure Function starts), not on the destination.

If some changes are missing on the destination, this could mean that is some error happening during the Azure Function execution after the changes were received.

In this scenario, the best course of action is to add `try/catch` blocks in your code and inside the loops that might be processing the changes, to detect any failure for a particular subset of items and handle them accordingly (send them to another storage for further analysis or retry). 

> [!NOTE]
> The Azure Functions trigger for Cosmos DB, by default, won't retry a batch of changes if there was an unhandled exception during your code execution. This means that the reason that the changes did not arrive at the destination is because that you are failing to process them.

If you find that some changes were not received at all by your trigger, the most common scenario is that there is **another Azure Function running**. It could be another Azure Function deployed in Azure or an Azure Function running locally on a developer's machine that has **exactly the same configuration** (same monitored and lease containers), and this Azure Function is stealing a subset of the changes you would expect your Azure Function to process.

Additionally, the scenario can be validated, if you know how many Azure Function App instances you have running. If you inspect your leases container and count the number of lease items within, the distinct values of the `Owner` property in them should be equal to the number of instances of your Function App. If there are more owners than the known Azure Function App instances, it means that these extra owners are the ones "stealing" the changes.

One easy way to work around this situation, is to apply a `LeaseCollectionPrefix/leaseCollectionPrefix` to your Function with a new/different value or, alternatively, test with a new leases container.

### Need to restart and reprocess all the items in my container from the beginning 
To reprocess all the items in a container from the beginning:
1. Stop your Azure function if it is currently running. 
1. Delete the documents in the lease collection (or delete and re-create the lease collection so it is empty)
1. Set the [StartFromBeginning](../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) CosmosDBTrigger attribute in your function to true. 
1. Restart the Azure function. It will now read and process all changes from the beginning. 

Setting [StartFromBeginning](../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) to true will tell the Azure function to start reading changes from the beginning of the history of the collection instead of the current time. This only works when there are no already created leases (that is, documents in the leases collection). Setting this property to true when there are leases already created has no effect; in this scenario, when a function is stopped and restarted, it will begin reading from the last checkpoint, as defined in the leases collection. To reprocess from the beginning, follow the above steps 1-4.  

### Binding can only be done with IReadOnlyList\<Document> or JArray

This error happens if your Azure Functions project (or any referenced project) contains a manual NuGet reference to the Azure Cosmos DB SDK with a different version than the one provided by the [Azure Functions Cosmos DB Extension](./troubleshoot-changefeed-functions.md#dependencies).

To work around this situation, remove the manual NuGet reference that was added and let the Azure Cosmos DB SDK reference resolve through the Azure Functions Cosmos DB Extension package.

### Changing Azure Function's polling interval for the detecting changes

As explained earlier for [My changes take too long to be received](./troubleshoot-changefeed-functions.md#my-changes-take-too-long-to-be-received), Azure function will sleep for a configurable amount of time (5 seconds, by default) before checking for new changes (to avoid high RU consumption). You can configure this sleep time through the `FeedPollDelay/feedPollDelay` setting in the [configuration](../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) of your trigger (the value is expected to be in milliseconds).

## Next steps

* [Enable monitoring for your Azure Functions](../azure-functions/functions-monitoring.md)
* [Azure Cosmos DB .NET SDK Troubleshooting](./troubleshoot-dot-net-sdk.md)
