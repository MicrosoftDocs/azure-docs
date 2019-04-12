---
title: Diagnose and troubleshoot issues when using Azure Cosmos DB Trigger in Azure Functions
description: Understand, diagnose, and fix the most common 
author: ealsur
ms.service: cosmos-db
ms.date: 01/19/2019
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot issues when using Azure Cosmos DB Trigger in Azure Functions

This article covers common issues, workarounds, and diagnostic steps, when you use the [Azure Cosmos DB Trigger](change-feed-functions.md) with Azure Functions.

## Dependencies

The Azure Cosmos DB Trigger and bindings depend on extension packages over the base Azure Functions runtime. Always keep these packages updated, as they might include fixes and new features that might be addressing your current issue:

* For Functions V2, see [Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB).
* For Functions V1, see [Microsoft.Azure.WebJobs.Extensions.DocumentDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DocumentDB).

This article will always refer to Functions V2 whenever the Functions runtime is mentioned, unless specified otherwise.

## Consuming the Cosmos DB SDK separately from the Trigger and bindings

The extension packages' main goal is to provide support for the Cosmos DB Trigger and bindings. 
It also includes the [Cosmos DB .NET SDK](sql-api-sdk-dotnet-core.md), which is useful if you want to interact with Cosmos DB programmatically outside of these Trigger and bindings.

If your intent is to use the Cosmos DB SDK make sure that you don't add to your project another Nuget reference to the Cosmos DB SDK, **let the SDK reference resolve through the Azure Functions' Cosmos DB Extension package**.

Additionally, if you are manually creating your own instance of the Cosmos DB SDK client, you are advised to follow the pattern of having only one instance of the client [through a Singleton/Lazy pattern approach](../azure-functions/manage-connections.md#documentclient-code-example-c). This will avoid potential socket issues in your operations.

## Common known scenarios and workarounds

### Function fails to start with "Either the source collection 'collection-name' (in database 'database-name') or the lease collection 'collection2-name' (in database 'database2-name') does not exist. Both collections must exist before the listener starts. To automatically create the lease collection, set 'CreateLeaseCollectionIfNotExists' to 'true'"

This means that either one or both of the containers required for the Trigger to work do not exist or are not reachable to the Function. **The error itself will tell you which database and collections is the Trigger looking for based on your configuration**.

1. Verify the `ConnectionStringSetting` attribute and that it **references a setting that exists in your Function App**. The value on this attribute shouldn't be the Connection String itself, but the name of the Configuration Setting.
2. Verify that the `databaseName` and `collectionName` are names that exist within your Azure Cosmos DB account. If you are using automatic value replacement (using `%settingName%` patterns), make sure the name of the setting exists in your Function App.
3. If you don't specify a `LeaseCollectionName/leaseCollectionName`, the default is "leases". Verify that such a container exists. Optionally you can set the `CreateLeaseCollectionIfNotExists` attribute in your Trigger to `true` as the error describes to automatically create it.
4. Verify your [Cosmos DB Firewall configuration](how-to-configure-firewall.md) to see if it's not blocking the Function.

### Function fails to start with "Shared throughput collection should have a partition key"

Earlier versions of the Cosmos DB Extension did not support using a leases container that was within a Shared Throughput Database. To solve this issue, update the [Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB) extension to the latest version.

### Function fails to start with "The lease collection, if partitioned, must have partition key equal to id."

This error means that your current leases container is partitioned, but the Partition Key definition is not `/id`. To solve this scenario, just recreate the leases container setting `/id` as the Partition Key.

### You see a "Value cannot be null. Parameter name: o" in your Azure Functions logs when you try to Run the Trigger

This issue appears if you are using the Azure portal and you try to press the **Run** button on the screen when inspecting a Function that uses the Trigger. The Trigger does not require for you to press Run to start, it will automatically do so when the Function is deployed. If you want to check the Functions' log stream on the Azure portal, just go to your monitored container and insert some new documents, you will automatically see the Trigger executing.

### My changes take too long be received

This scenario can have multiple causes and all of them should be verified:

1. Is your Function deployed in the same region as your Azure Cosmos DB account? For optimal network latency, both the Function and your Cosmos DB account should be colocated in the same Azure region.
2. Are the changes happening in your container continuous or sporadic? If the later, there could be some delay between the changes being stored and the Function picking them up. This is because internally, when the Trigger checks for changes in your container and finds none pending to be read, it will sleep for a configurable amount of time (5 seconds by default) before checking for new changes (to avoid over generating RU consumption). You can configure this sleep time through the `FeedPollDelay/feedPollDelay` setting in the [configuration](../azure-functions/functions-bindings-cosmosdb-v2.md#trigger---configuration) of your Trigger (the value is expected in milliseconds).
3. Your container might be experiencing [throttling](request-units.md.
4. You can use the `PreferredLocations` attribute in your Trigger to specify a comma-separated list of Azure regions to define a custom preferred connection order.

### Some changes are missing in my Trigger

If you find yourself suspecting that some of the changes that happen in your container are not being picked up by the Function, there is an initial investigation step that needs to be done.

If your Function receives the changes, processes them, and sends them to another destination, make sure you **measure which changes are being received at the ingestion point** (when the Function starts), not on the destination. If some changes are missing on the destination, this could mean that is some error happening during the Function execution after the changes were received, but the changes were delivered by the Trigger.

In this scenario, the best course of action is to add `try/catch` blocks across your code and within loops that might be processing the changes to detect any failure for a particular subset of documents and handle them accordingly (send them to another cold storage for further analysis or retry). **The Cosmos DB Trigger, by default, won't retry a batch of changes if there was an unhandled exceptions** during your code execution, this means that the reason for the changes to not arrive to destination could be that you are failing to process them.

If, after measuring, you find that some changes were not received at all by your Trigger, the most common scenario is that there is **another Function running** (it could be another Function deployed in Azure or another Function running locally in a developer machine) that has the **exact same configuration** (same monitored and lease container), and this Function is *stealing* a subset of the changes you would expect your Function to process.

Additionally, the scenario can be validated if you know how many Function App instances you have running. If you inspect your leases container and count the # of lease documents within, the distinct values of the `Owner` property in them should be equal to the amount of instances of your Function App. If there are more Owners than known Function App instances, it means these extra owners are the one *stealing* the changes.

One easy way to workaround this situation, is to apply a `LeaseCollectionPrefix/leaseCollectionPrefix` to your Function with a new/different value. Another option would be to test with a new leases container.