---
title: Azure Batch pool delete start event
description: Reference for Batch pool delete start event. This event is emitted when a pool delete operation has started.
ms.topic: reference
ms.date: 04/20/2017
---

# Pool delete start event

 This event is emitted when a pool delete operation has started. Since the pool delete is an asynchronous event, you can expect a pool delete complete event to be emitted once the delete operation completes.

 The following example shows the body of a pool delete start event.

```
{
	"id": "myPool1"
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|`id`|String|The ID of the pool.|
