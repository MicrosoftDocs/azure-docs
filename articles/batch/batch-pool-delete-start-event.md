---
title: Azure Batch pool delete start event
description: Reference for Batch pool delete start event. This event is emitted when a pool delete operation is started.
ms.topic: reference
ms.date: 07/01/2025
# Customer intent: "As a cloud operator, I want to monitor the pool delete start event, so that I can track the status of my asynchronous pool deletion operations."
---

# Pool delete start event

 This event is emitted when a pool delete operation is started. Since the pool delete is an asynchronous event, you can expect a pool delete complete event to be emitted once the delete operation completes.

 The following example shows the body of a pool delete start event.

```
{
   "id": "myPool1"
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|`id`|String|The ID of the pool.|
