---
title: Azure Data Box as Event Grid source
description: Describes the properties that are provided for Data Box events with Azure Event Grid.
ms.topic: conceptual
ms.date: 02/09/2023
---

# Azure Data Box as an Event Grid source

This article provides the properties and schema for Azure Data Box events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Data Box events

 |Event name |Description|
 |----------|-----------|
 | Microsoft.DataBox.CopyStarted |Triggered when the copy has started from the device and the first byte of data copy is copied.  |
 |Microsoft.DataBox.CopyCompleted |Triggered when the copy has completed from device.|
 | Microsoft.DataBox.OrderCompleted |Triggered when the order has completed copying and copy logs are available. |

### Example events

# [Event Grid event schema](#tab/event-grid-event-schema)

### Microsoft.DataBox.CopyStarted event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.DataBox/jobs/{your-resource}",
  "subject": "/jobs/{your-resource}",
  "eventType": "Microsoft.DataBox.CopyStarted",
  "id": "049ec3f6-5b7d-4052-858e-6f4ce6a46570",
  "data": {
    "serialNumber": "SampleSerialNumber",
    "stageName": "CopyStarted",
    "stageTime": "2022-10-12T19:38:08.0218897Z"
  },
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2022-10-16T02:51:26.4248221Z"
}]
```

### Microsoft.DataBox.CopyCompleted event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.DataBox/jobs/{your-resource}",
  "subject": "/jobs/{your-resource}",
  "eventType": "Microsoft.DataBox.CopyCompleted",
  "id": "759c892a-a628-4e48-a116-2e1d54c555ce",
  "data": {
    "serialNumber": "SampleSerialNumber",
    "stageName": "CopyCompleted",
    "stageTime": "2022-10-12T19:38:08.0218897Z"
  },
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2022-10-16T02:58:18.503829Z"
}]
```

### Microsoft.DataBox.OrderCompleted event

```json
{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.DataBox/jobs/{your-resource}",
  "subject": "/jobs/{your-resource}",
  "eventType": "Microsoft.DataBox.OrderCompleted",
  "id": "5eb07c79-39a8-439c-bb4b-bde1f6267c37",
  "data": {
    "serialNumber": "SampleSerialNumber",
    "stageName": "OrderCompleted",
    "stageTime": "2022-10-12T19:38:08.0218897Z"
  },
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2022-10-16T02:51:26.4248221Z"
}
```

# [Cloud event schema](#tab/cloud-event-schema)

### Microsoft.DataBox.CopyStarted event

```json
[{
  "source": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.DataBox/jobs/{your-resource}",
  "subject": "/jobs/{your-resource}",
  "type": "Microsoft.DataBox.CopyStarted",
  "time": "2022-10-16T02:51:26.4248221Z",
  "id": "049ec3f6-5b7d-4052-858e-6f4ce6a46570",
  "data": {
    "serialNumber": "SampleSerialNumber",
    "stageName": "CopyStarted",
    "stageTime": "2022-10-12T19:38:08.0218897Z"
  },
  "specVersion": "1.0"
}]
```

### Microsoft.DataBox.CopyCompleted event

```json
{
  "source": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.DataBox/jobs/{your-resource}",
  "subject": "/jobs/{your-resource}",
  "type": "Microsoft.DataBox.CopyCompleted",
  "time": "2022-10-16T02:51:26.4248221Z",
  "id": "759c892a-a628-4e48-a116-2e1d54c555ce",
  "data": {
    "serialNumber": "SampleSerialNumber",
    "stageName": "CopyCompleted",
    "stageTime": "2022-10-12T19:38:08.0218897Z"
  },
  "specVersion": "1.0"
}
```

### Microsoft.DataBox.OrderCompleted event

```json
[{
  "source": "/subscriptions/{subscription-id}/resourceGroups/{your-rg}/providers/Microsoft.DataBox/jobs/{your-resource}",
  "subject": "/jobs/{your-resource}",
  "type": "Microsoft.DataBox.OrderCompleted",
  "time": "2022-10-16T02:51:26.4248221Z",
  "id": "5eb07c79-39a8-439c-bb4b-bde1f6267c37",
  "data": {
    "serialNumber": "SampleSerialNumber",
    "stageName": "OrderCompleted",
    "stageTime": "2022-10-12T19:38:08.0218897Z"
  },
  "specVersion": "1.0"
}]
```
---


## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md). 
