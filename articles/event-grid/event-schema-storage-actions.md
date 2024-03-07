---
title: Azure Storage Actions as Event Grid source
description: Describes the properties that are provided for Azure Storage Actions events with Azure Event Grid.
ms.topic: conceptual
author: normesta
ms.author: normesta
ms.date: 08/30/2023
---

# Azure Storage Actions as an Event Grid source

This article provides the properties and schema for Azure Storage Actions events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). To learn more about Azure Storage Actions, see [What is Azure Storage Actions?](../storage-actions/overview.md).

> [!IMPORTANT]
> Azure Storage Actions is currently in PREVIEW and is available these [regions](../storage-actions/overview.md#supported-regions).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
## Available event types

## Storage Actions events

These events are triggered when a storage task is queued and when a storage task run completes.

 |Event name |Description|
 |----------|-----------|
 | [Microsoft.StorageActions.StorageTaskQueued](#microsoftstorageactionsstoragetaskqueued-event) | Triggered when a storage task assignment run is queued. This event provides the status of assignment execution such as when the assignment is queued, and the corresponding execution ID for tracking purpose. |
 |[Microsoft.StorageActions.StorageTaskCompleted](#microsoftstorageactionsstoragetaskcompleted-event) | Triggered when a storage tasks assignment run is completed. This event provides the status of assignment execution such as when the assignment is completed, the assignment's status, which task is associated with the assignment, and the link to summary report file. |

### Example events


# [Cloud event schema](#tab/cloud-event-schema)

### Microsoft.StorageActions.StorageTaskQueued event

```json
[{
  "source": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/BlobInventory/providers/Microsoft.StorageActions/storageAccounts/my-storage-account",
  "subject": "DataManagement/StorageTasks",
  "type": "Microsoft.StorageActions.StorageTaskQueued",
  "time": "2023-08-07T21:35:23Z",
  "id": "8eb4656c-5c4a-4541-91e0-685558acbb1d",
  "data": {
    "queuedDateTime":"2023-08-07T21:35:23Z",
    "taskExecutionId":"testdelete-2023-08-07T21:35:16.9494934Z_2023-08-07T21:35:17.5432186Z"
  },
  "specversion": "1.0"
}]
```

### Microsoft.StorageActions.StorageTaskCompleted event

```json
[{
  "source": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/BlobInventory/providers/Microsoft.StorageActions/storageAccounts/my-storage-account",
  "subject": "DataManagement/StorageTasks",
  "type": "Microsoft.StorageActions.StorageTaskCompleted",
  "time": "2023-08-07T21:35:34Z",
  "id": "dee33d3b-0b39-42f2-b2be-76f2fb94b852",
  "data": {
    "status":"Succeeded",
    "completedDateTime":"2023-08-07T21:35:34Z",
    "taskExecutionId":"testdelete-2023-08-07T21:35:16.9494934Z_2023-08-07T21:35:17.5432186Z",
    "taskName":"deleteallcentraleu",
    "summaryReportBlobUrl":"https://my-storage-account.blob.core.windows.net/result-container/deleteallcentraleu_testdelete_2023-08-07T21:35:23/SummaryReport.json"
  },
  "specversion": "1.0"
}]
```

# [Event Grid event schema](#tab/event-grid-event-schema)

### Microsoft.StorageActions.StorageTaskQueued event

```json
[{
  "topic":"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/BlobInventory/providers/Microsoft.StorageActions/storageAccounts/my-storage-account",
  "subject":"DataManagement/StorageTasks",
  "eventType":"Microsoft.StorageActions.StorageTaskQueued",
  "id":"8eb4656c-5c4a-4541-91e0-685558acbb1d",
  "data":{
    "queuedDateTime":"2023-08-07T21:35:23Z",
    "taskExecutionId":"testdelete-2023-08-07T21:35:16.9494934Z_2023-08-07T21:35:17.5432186Z"
  },
  "dataVersion":"1.0",
  "metadataVersion":"1",
  "eventTime":"2023-08-07T21:35:23Z"
}]

```

### Microsoft.StorageActions.StorageTaskCompleted event

```json
[{
  "topic":"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/BlobInventory/providers/Microsoft.StorageActions/storageAccounts/my-storage-account",
  "subject":"DataManagement/StorageTasks",
  "eventType":"Microsoft.StorageActions.StorageTaskCompleted",
  "id":"dee33d3b-0b39-42f2-b2be-76f2fb94b852",
  "data":{
    "status":"Succeeded",
    "completedDateTime":"2023-08-07T21:35:34Z",
    "taskExecutionId":"testdelete-2023-08-07T21:35:16.9494934Z_2023-08-07T21:35:17.5432186Z",
    "taskName":"deleteallcentraleu",
    "summaryReportBlobUrl":"https://my-storage-account.blob.core.windows.net/result-container/deleteallcentraleu_testdelete_2023-08-07T21:35:23/SummaryReport.json"
  },
  "dataVersion":"1.0",
  "metadataVersion":"1",
  "eventTime":"2023-08-07T21:35:34Z"
}]
```

---

## Event properties

# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Storage task event data. |
| `specversion` | string | CloudEvents schema specification version. |

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `eventType` | string | One of the registered event types for this event source. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Storage task event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |


---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `queuedDateTime` | string | The time that the storage task assignment is queued. |
| `status` | string | The storage task assignment completion status (`Succeeded` or `Failed`) |
| `completedDateTime` | string | The time that the storage task assignment completed. |
| `taskExecutionId` | string | The unique ID that is associated with the storage task assignment. |
| `taskName` | string | The storage task that is associated with the storage task assignment. |
| `summaryReportBlobUrl` | string | The link to the storage task assignment summary report file. |

## Next steps

- For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
- For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).