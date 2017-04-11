---
title: "Pool delete start event | Microsoft Docs"
ms.custom: ""
ms.date: "2017-02-01"
ms.prod: "azure"
ms.reviewer: ""
ms.service: "batch"
ms.suite: ""
ms.tgt_pltfrm: ""
ms.topic: "reference"
ms.assetid: feddca1e-c69c-4257-be44-a36172e77157
caps.latest.revision: 4
author: "tamram"
ms.author: "tamram"
manager: "timlt"
---
# Pool delete start event
Pool delete start event log body

## Remarks
 This event is emitted when a pool delete operation has started. Since the pool delete is an asynchronous event, you can expect a pool delete complete event to be emitted once the delete operation completes.

 The following example shows the body of a pool delete start event.

```
{
	"id": "myPool1"
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|id|String|The id of the pool.|