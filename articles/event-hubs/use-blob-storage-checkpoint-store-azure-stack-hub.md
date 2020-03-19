---
title: Use Blob Storage as checkpoint store on Azure Stack Hub
description: This article describes the differences between using Blob Storage as a checkpoint store in Event Hubs on Azure vs. Event Hubs on Azure Stack Hub.
services: event-hubs
documentationcenter: na
author: spelluru

ms.service: event-hubs
ms.topic: how-to
ms.date: 03/18/2020
ms.author: spelluru

---

# Use Blob Storage as checkpoint store on Azure Stack Hub
This article explains:

- What a checkpointing is
- How Blob Storage can be used as a checkpoint store
- Additional steps for using Blob Storage on Azure Stack Hub 

## Checkpointing
Checkpointing is a process by which readers mark their position within a partition event sequence. Checkpointing is the responsibility of the consumer and occurs on a per-partition basis within a consumer group. This responsibility means that for each consumer group, each partition reader must keep track of its current position in the event stream, and can inform the service when it considers the data stream complete.

If a reader disconnects from a partition, when it reconnects it begins reading at the checkpoint that was previously submitted by the last reader of that partition in that consumer group. When the reader connects, it passes the offset to the event hub to specify the location at which to start reading. In this way, you can use checkpointing to both mark events as "complete" by downstream applications, and to provide resiliency if a failover between readers that run on different machines occurs. It's possible to return to older data by specifying a lower offset from this checkpointing process. Through this mechanism, checkpointing enables both failover resiliency and event stream replay.

A checkpoint is the term used to describe a snapshot of the state of processing for a partition that has been persisted to durable storage and which allows an Event Processor client to resume processing at a specific location in the partition's event stream.  When a processor starts, it will seek out an existing checkpoint and, if found, use that as the place where it begins reading events.  If no checkpoint is found, a default location is used.

For more information, see [Balance partition load across multiple instances of your application](event-processor-balance-partition-load.md)).

## Blob Storage as a checkpoint store
You can use Azure Blob Storage as a checkpoint store. For an example of using Blob Storage as a checkpoint store, see the following samples on GitHub: [.NET](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/Sample04_BasicCheckpointing.cs), [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs-checkpointstore-blob/), [JavaScript and TypeScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/eventhubs-checkpointstore-blob), Python - [Synchronous](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub-checkpointstoreblob/samples) and [Asynchronous](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub-checkpointstoreblob-aio/samples).

## Blob Storage on Azure Stack Hub
If you're using Azure Blob Storage as the checkpoint store in an environment that supports a different version of Storage Blob SDK than the ones that are typically available on Azure, you'll need to use code to change the Storage service API version to the specific version supported by that environment. For example, if you're running [Event Hubs on an Azure Stack Hub version 2002](https://docs.microsoft.com/azure-stack/user/event-hubs-overview), the highest available version for the Storage service is version 2017-11-09. In this case, you'll need to use the code to change the Storage service API version to 2017-11-09. For an example on how to target a specific Storage API version, see these samples on GitHub: [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/Sample10_RunningWithDifferentStorageVersion.cs), [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs-checkpointstore-blob/src/samples/java/com/azure/messaging/eventhubs/checkpointstore/blob/EventProcessorWithOlderStorageVersion.java). [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/eventhubs-checkpointstore-blob/samples/receiveEventsWithDownleveledStorage.js) or  [TypeScript](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/eventhubs-checkpointstore-blob/samples/receiveEventsWithDownleveledStorage.ts), Python - [Synchronous](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub-checkpointstoreblob/samples/event_processor_blob_storage_example_with_storage_api_version.py), [Asynchronous](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub-checkpointstoreblob-aio/samples/event_processor_blob_storage_example_with_storage_api_version.py)

If you run Event Hubs receiver that uses Blob Storage without targeting the version that Azure Stack Hub supports, you'll receive the following error message:

```bash
The value for one of the HTTP headers is not in the correct format
```

### Sample error message in Python
For Python, an error of `azure.core.exceptions.HttpResponseError` is passed to the error handler `on_error(partition_context, error)` of `EventHubConsumerClient.receive()`. But, method `receive()` doesn't raise an exception. print(error) will print the following exception information:

```bash
The value for one of the HTTP headers is not in the correct format.

RequestId:f048aee8-a90c-08ba-4ce1-e69dba759297
Time:2020-03-17T22:04:13.3559296Z
ErrorCode:InvalidHeaderValue
Error:None
HeaderName:x-ms-version
HeaderValue:2019-07-07
```

The logger that uses synchronous pattern will log two warnings like the following ones:

```bash
WARNING:azure.eventhub.extensions.checkpointstoreblobaio._blobstoragecsaio: 
An exception occurred during list_ownership for namespace '<namespace-name>.eventhub.<region>.azurestack.corp.microsoft.com' eventhub 'python-eh-test' consumer group '$Default'. 

Exception is HttpResponseError('The value for one of the HTTP headers is not in the correct format.\nRequestId:f048aee8-a90c-08ba-4ce1-e69dba759297\nTime:2020-03-17T22:04:13.3559296Z\nErrorCode:InvalidHeaderValue\nError:None\nHeaderName:x-ms-version\nHeaderValue:2019-07-07')
```

The logger that uses asynchronous pattern will log two warnings like the following ones:

```bash
WARNING:azure.eventhub.aio._eventprocessor.event_processor:EventProcessor instance '26d84102-45b2-48a9-b7f4-da8916f68214' of eventhub 'python-eh-test' consumer group '$Default'. An error occurred while load-balancing and claiming ownership. 

The exception is HttpResponseError('The value for one of the HTTP headers is not in the correct format.\nRequestId:f048aee8-a90c-08ba-4ce1-e69dba759297\nTime:2020-03-17T22:04:13.3559296Z\nErrorCode:InvalidHeaderValue\nError:None\nHeaderName:x-ms-version\nHeaderValue:2019-07-07'). Retrying after 71.45254944090853 seconds
```



## Next steps

See the following article learn about partitioning and checkpointing: [Balance partition load across multiple instances of your application](event-processor-balance-partition-load.md)
