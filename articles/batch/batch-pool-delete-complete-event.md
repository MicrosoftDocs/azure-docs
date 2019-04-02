---
title: "Azure Batch pool delete complete event | Microsoft Docs"
description: Reference for Batch pool delete complete event.
services: batch
author: laurenhughes
manager: jeconnoc

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 04/20/2017
ms.author: lahugh
---

# Pool delete complete event

 This event is emitted when a pool delete operation has completed.

 The following example shows the body of a pool delete complete event.

```
{
	"id": "myPool1",
	"startTime": "2016-09-09T22:13:48.579Z",
	"endTime": "2016-09-09T22:14:08.836Z"
}
```

|Element|Type|Notes|
|-------------|----------|-----------|
|id|String|The id of the pool.|
|startTime|DateTime|The time the pool delete started.|
|endTime|DateTime|The time the pool delete completed.|

## Remarks
For more information about states and error codes for pool resize operation, see [Delete a pool from an account](https://docs.microsoft.com/rest/api/batchservice/delete-a-pool-from-an-account).