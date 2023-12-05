---
title: Troubleshoot storage checkpoint store issues in Azure Event Hubs
description: This article describes how to troubleshoot checkpoint store issues when using Azure Blob Storage as the checkpoint store in Azure Event Hubs. 
ms.topic: troubleshooting
ms.date: 06/16/2023
---

# Troubleshoot checkpoint store issues 
This article discusses issues with using Blob Storage as a checkpoint store.

## Issues with using Blob Storage as a checkpoint store
You may see issues when using a blob storage account as a checkpoint store that are related to delays in processing, or failures to create checkpoints when using the SDK, etc.

[!INCLUDE [storage-checkpoint-store-recommendations](./includes/storage-checkpoint-store-recommendations.md)]

## Using Blob Storage checkpoint store on Azure Stack Hub
If you're using Azure Blob Storage as the checkpoint store in an environment that supports a different version of Storage Blob SDK than the ones that are typically available on Azure, you need to use code to change the Storage service API version to the specific version supported by that environment. For example, if you're running [Event Hubs on an Azure Stack Hub version 2002](/azure-stack/user/event-hubs-overview), the highest available version for the Storage service is version 2017-11-09. In this case, you need to use code to target the Storage service API version to 2017-11-09. For an example of how to target a specific Storage API version, see these samples on GitHub: 

- [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples/)
- [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs-checkpointstore-blob/src/samples/java/com/azure/messaging/eventhubs/checkpointstore/blob/EventProcessorWithCustomStorageVersion.java). 
- [JavaScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/eventhub/eventhubs-checkpointstore-blob/samples/v1/javascript/receiveEventsWithApiSpecificStorage.js) or  [TypeScript](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/eventhub/eventhubs-checkpointstore-blob/samples/v1/typescript/src/receiveEventsWithApiSpecificStorage.ts) 
- Python - [Synchronous](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub-checkpointstoreblob/samples/receive_events_using_checkpoint_store_storage_api_version.py), [Asynchronous](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub-checkpointstoreblob-aio/samples/receive_events_using_checkpoint_store_storage_api_version_async.py)

If you run Event Hubs receiver that uses Blob Storage as the checkpoint store without targeting the version that Azure Stack Hub supports, you receive the following error message:

```
The value for one of the HTTP headers is not in the correct format
```


### Sample error message in Python
For Python, an error of `azure.core.exceptions.HttpResponseError` is passed to the error handler `on_error(partition_context, error)` of `EventHubConsumerClient.receive()`. But, the method `receive()` doesn't raise an exception. `print(error)` prints the following exception information:

```bash
The value for one of the HTTP headers is not in the correct format.

RequestId:f048aee8-a90c-08ba-4ce1-e69dba759297
Time:2020-03-17T22:04:13.3559296Z
ErrorCode:InvalidHeaderValue
Error:None
HeaderName:x-ms-version
HeaderValue:2019-07-07
```

The logger logs two warnings like the following ones:

```bash
WARNING:azure.eventhub.extensions.checkpointstoreblobaio._blobstoragecsaio: 
An exception occurred during list_ownership for namespace '<namespace-name>.eventhub.<region>.azurestack.corp.microsoft.com' eventhub 'python-eh-test' consumer group '$Default'. 

Exception is HttpResponseError('The value for one of the HTTP headers is not in the correct format.\nRequestId:f048aee8-a90c-08ba-4ce1-e69dba759297\nTime:2020-03-17T22:04:13.3559296Z\nErrorCode:InvalidHeaderValue\nError:None\nHeaderName:x-ms-version\nHeaderValue:2019-07-07')

WARNING:azure.eventhub.aio._eventprocessor.event_processor:EventProcessor instance '26d84102-45b2-48a9-b7f4-da8916f68214' of eventhub 'python-eh-test' consumer group '$Default'. An error occurred while load-balancing and claiming ownership. 

The exception is HttpResponseError('The value for one of the HTTP headers is not in the correct format.\nRequestId:f048aee8-a90c-08ba-4ce1-e69dba759297\nTime:2020-03-17T22:04:13.3559296Z\nErrorCode:InvalidHeaderValue\nError:None\nHeaderName:x-ms-version\nHeaderValue:2019-07-07'). Retrying after 71.45254944090853 seconds
```


## Next steps

See the following article learn about partitioning and checkpointing: [Balance partition load across multiple instances of your application](event-processor-balance-partition-load.md)
