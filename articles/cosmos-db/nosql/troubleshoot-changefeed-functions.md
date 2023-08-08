---
title: Troubleshoot issues with the Azure Functions trigger for Azure Cosmos DB
description: This article discusses common issues, workarounds, and diagnostic steps when you're using the Azure Functions trigger for Azure Cosmos DB
author: ealsur
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, build-2023
ms.date: 04/11/2023
ms.author: maquaran
ms.topic: troubleshooting
ms.reviewer: mjbrown
---

# Diagnose and troubleshoot issues with the Azure Functions trigger for Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article covers common issues, workarounds, and diagnostic steps when you're using the [Azure Functions trigger for Azure Cosmos DB](change-feed-functions.md).

## Dependencies

The Azure Functions trigger and bindings for Azure Cosmos DB depend on the extension package [Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB) over the base Azure Functions runtime. Always keep these packages updated, because they include fixes and new features that can help you address any potential issues you might encounter.

## Consume the Azure Cosmos DB SDK independently

The key functionality of the extension package is to provide support for the Azure Functions trigger and bindings for Azure Cosmos DB. The package also includes the [Azure Cosmos DB .NET SDK](sdk-dotnet-core-v2.md), which is helpful if you want to interact with Azure Cosmos DB programmatically without using the trigger and bindings.

If you want to use the Azure Cosmos DB SDK, make sure that you don't add to your project another NuGet package reference. Instead, let the SDK reference resolve through the Azure Functions extension package. Consume the Azure Cosmos DB SDK separately from the trigger and bindings.

Additionally, if you're manually creating your own instance of the [Azure Cosmos DB SDK client](./sdk-dotnet-core-v2.md), you should follow the pattern of having only one instance of the client and [use a singleton pattern approach](../../azure-functions/manage-connections.md?tabs=csharp#azure-cosmos-db-clients). This process avoids the potential socket issues in your operations.

## Common scenarios and workarounds

### Your Azure function fails with an error message that the collection "doesn't exist"

The Azure function fails with the following error message: "Either the source collection 'collection-name' (in database 'database-name') or the lease collection 'collection2-name' (in database 'database2-name') doesn't exist. Both collections must exist before the listener starts. To automatically create the lease collection, set 'CreateLeaseCollectionIfNotExists' to 'true'."

This error means that one or both of the Azure Cosmos DB containers that are required for the trigger to work either:
* Don't exist
* Aren't reachable to the Azure function 

The error text itself tells you which Azure Cosmos DB database and container the trigger is looking for, based on your configuration.

To resolve this issue:

1. Verify the `Connection` attribute and that it references a setting that exists in your Azure function app.

   The value on this attribute shouldn't be the connection string itself, but the name of the configuration setting.

1. Verify that the `databaseName` and `containerName` values exist in your Azure Cosmos DB account.

   If you're using automatic value replacement (using `%settingName%` patterns), make sure that the name of the setting exists in your Azure function app.

1. If you don't specify a `LeaseContainerName/leaseContainerName` value, the default is `leases`. Verify that such a container exists. 

   Optionally, you can set the `CreateLeaseContainerIfNotExists` attribute in your trigger to `true` to automatically create it.

1. Verify your [Azure Cosmos DB account's firewall configuration](../how-to-configure-firewall.md) to ensure that it's not blocking the Azure function.

### Your Azure function fails to start, with error message "Shared throughput collection should have a partition key"

Previous versions of the Azure Cosmos DB extension didn't support using a leases container that was created within a [shared throughput database](../set-throughput.md#set-throughput-on-a-database). 

To resolve this issue:

* Update the [Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB) extension to get the latest version.

### Your Azure function fails to start, with error message "PartitionKey must be supplied for this operation"

This error means that you're currently using a partitioned lease collection with an old [extension dependency](#dependencies). 

To resolve this issue:

* Upgrade to the latest available version.

### Your Azure function fails to start, with error message "Forbidden (403); Substatus: 5300... The given request [POST ...] can't be authorized by Azure AD token in data plane"

This error means that your function is attempting to [perform a non-data operation by using Azure Active Directory (Azure AD) identities](troubleshoot-forbidden.md#non-data-operations-are-not-allowed). You can't use `CreateLeaseContainerIfNotExists = true` when you're using Azure AD identities.

### Your Azure function fails to start, with error message "The lease collection, if partitioned, must have partition key equal to id"

This error means that your current leases container is partitioned, but the partition key path isn't `/id`. 

To resolve this issue:

* Re-create the leases container with `/id` as the partition key.

### When you try to run the trigger, you get the error message "Value can't be null. Parameter name: o" in your Azure function logs

This issue might arise if you're using the Azure portal and you select the **Run** button when you're inspecting an Azure function that uses the trigger. The trigger doesn't require you to select **Run** to start it. It automatically starts when you deploy the function. 

To resolve this issue:

* To check the function's log stream on the Azure portal, go to your monitored container and insert some new items. The trigger will run automatically.

### Your changes are taking too long to be received

This scenario can have multiple causes. Consider trying any or all of the following solutions:

* Are your Azure function and your Azure Cosmos DB account deployed in separate regions? For optimal network latency, your Azure function and your Azure Cosmos DB account should be colocated in the same Azure region.

* Are the changes that are happening in your Azure Cosmos DB container continuous or sporadic?

   If they're sporadic, there could be some delay between the changes being stored and the Azure function that's picking them up. This is because when the trigger checks internally for changes in your Azure Cosmos DB container and finds no changes waiting to be read, the trigger sleeps for a configurable amount of time (5 seconds, by default) before it checks for new changes. It does this to avoid high request unit (RU) consumption. You can configure the sleep time through the `FeedPollDelay/feedPollDelay` setting in the [configuration](../../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) of your trigger. The value is expected to be in milliseconds.

* Your Azure Cosmos DB container might be [rate-limited](../request-units.md).

* You can use the `PreferredLocations` attribute in your trigger to specify a comma-separated list of Azure regions to define a custom preferred connection order.

* The speed at which your trigger receives new changes is dictated by the speed at which you're processing them. Verify the function's [execution time, or duration](../../azure-functions/analyze-telemetry-data.md). If your function is slow, that will increase the time it takes for the trigger to get new changes. If you see a recent increase in duration, a recent code change might be affecting it. If the speed at which you're receiving operations on your Azure Cosmos DB container is faster than the speed of your trigger, it will keep lagging behind. You might want to investigate the function's code to determine the most time-consuming operation and how to optimize it.

* You can use [Debug logs](how-to-configure-cosmos-db-trigger.md#enabling-trigger-specific-logs) to check the Diagnostics and verify if there are networking delays.

### Some changes are repeated in my trigger

The concept of a *change* is an operation on an item. The most common scenarios where events for the same item are received are:

* Your Function is failing during execution. If your Function has enabled [retry policies](../../azure-functions/functions-bindings-error-pages.md#retries) or in cases where your Function execution is exceeding the allowed execution time, the same batch of changes can be delivered again to your Function. This is expected and by design, look at your Function logs for indication of failures and make sure you have enabled [trigger logs](how-to-configure-cosmos-db-trigger.md#enabling-trigger-specific-logs) for further details.

* There is a load balancing of leases across instances. When instances increase or decrease, [load balancing](change-feed-processor.md#dynamic-scaling) can cause the same batch of changes to be delivered to multiple Function instances. This is expected and by design, and should be transient. The [trigger logs](how-to-configure-cosmos-db-trigger.md#enabling-trigger-specific-logs) include the events when an instance acquires and releases leases.

* The item is being updated. The change feed can contain multiple operations for the same item. If the item is receiving updates, it can pick up multiple events (one for each update). One easy way to distinguish among different operations for the same item is to track the `_lsn` [property for each change](change-feed-modes.md#parse-the-response-object). If the properties don't match, the changes are different.

* If you're identifying items only by `id`, remember that the unique identifier for an item is the `id` and its partition key. (Two items can have the same `id` but a different partition key).

### Some changes are missing in your trigger

You might find that some of the changes that occurred in your Azure Cosmos DB container aren't being picked up by the Azure function. Or some changes are missing at the destination when you're copying them. If so, try the solutions in this section.

* Make sure you have [logs](how-to-configure-cosmos-db-trigger.md#enabling-trigger-specific-logs) enabled. Verify no errors are happening during processing.

* When your Azure function receives the changes, it often processes them and could, optionally, send the result to another destination. When you're investigating missing changes, make sure that you measure which changes are being received at the ingestion point (that is, when the Azure function starts), not at the destination.

* If some changes are missing on the destination, this could mean that some error is happening during the Azure function execution after the changes were received.

   In this scenario, the best course of action is to add `try/catch` blocks in your code and inside the loops that might be processing the changes. Adding it will help you detect any failure for a particular subset of items and handle them accordingly (send them to another storage for further analysis or retry). Alternatively, you can configure Azure Functions [retry policies](../../azure-functions/functions-bindings-error-pages.md#retries).

    > [!NOTE]
    > The Azure Functions trigger for Azure Cosmos DB, by default, won't retry a batch of changes if there was an unhandled exception during the code execution. This means that the reason that the changes didn't arrive at the destination might be because you've failed to process them.

* If the destination is another Azure Cosmos DB container and you're performing upsert operations to copy the items, verify that the partition key definition on both the monitored and destination container are the same. Upsert operations could be saving multiple source items as one at the destination because of this configuration difference.

* If you find that the trigger didn't receive some changes, the most common scenario is that another Azure function is running. The other function might be deployed in Azure or a function might be running locally on a developer's machine with exactly the same configuration (that is, the same monitored and lease containers). If so, this function might be stealing a subset of the changes that you would expect your Azure function to process.

Additionally, the scenario can be validated, if you know how many Azure function app instances you have running. If you inspect your leases container and count the number of lease items within it, the distinct values of the `Owner` property in them should be equal to the number of instances of your function app. If there are more owners than known Azure function app instances, it means that these extra owners are the ones "stealing" the changes.

One easy way to work around this situation is to apply a `LeaseCollectionPrefix/leaseCollectionPrefix` to your function with a new or different value or, alternatively, to test with a new leases container.

### You need to restart and reprocess all the items in your container from the beginning 

To reprocess all the items in a container from the beginning:

1. Stop your Azure function if it's currently running. 

1. Delete the documents in the lease collection (or delete and re-create the lease collection so that it's empty).

1. Set the [StartFromBeginning](../../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) CosmosDBTrigger attribute in your function to `true`. 

1. Restart the Azure function. It will now read and process all changes from the beginning. 

Setting [StartFromBeginning](../../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) to `true` tells the Azure function to start reading changes from the beginning of the history of the collection instead of the current time. 
   
This solution works only when there are no already-created leases (that is, documents in the leases collection). 
   
Setting this property to `true` has no effect when there are leases already created. In this scenario, when a function is stopped and restarted, it begins reading from the last checkpoint, as defined in the leases collection.  

### Error: Binding can be done only with IReadOnlyList\<Document> or JArray

This error happens if your Azure Functions project (or any referenced project) contains a manual NuGet reference to the Azure Cosmos DB SDK with a version that's different from the one provided by the [Azure Cosmos DB extension for Azure Functions](./troubleshoot-changefeed-functions.md#dependencies).

To work around this situation, remove the manual NuGet reference that was added, and let the Azure Cosmos DB SDK reference resolve through the Azure Cosmos DB extension for Azure Functions package.

### Change the Azure function's polling interval for detecting changes

As explained earlier in the [Your changes are taking too long to be received](#your-changes-are-taking-too-long-to-be-received) section, your Azure function will sleep for a configurable amount of time (5 seconds, by default) before it checks for new changes (to avoid high RU consumption). You can configure this sleep time through the `FeedPollDelay/feedPollDelay` setting in the [trigger configuration](../../azure-functions/functions-bindings-cosmosdb-v2-trigger.md#configuration) (the value is expected to be in milliseconds).

## Next steps

* [Enable monitoring for your Azure function](../../azure-functions/functions-monitoring.md)
* [Troubleshoot the Azure Cosmos DB .NET SDK](./troubleshoot-dotnet-sdk.md)
