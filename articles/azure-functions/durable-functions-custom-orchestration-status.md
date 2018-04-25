---
title: Custom orchestration status in Durable Functions - Azure
description: Learn how to configure and use custom orchestration status for Durable Functions.
services: functions
author: kadimitr
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/24/2018
ms.author: azfuncdf
---

# Custom orchestration status in Durable Functions (Azure Functions)

Custom orchestration status lets you set a custom status value for your orchestrator function. This status is provided via the HTTP GetStatus API or the `DurableOrchestrationClient.GetStatusAsync` API.

## Use cases 

### Visualize progress

Clients can poll the status end point and display a progress UI that visualizes the current execution stage.

### Output customization 

Another interesting scenario is segmenting users by returning customized output based on unique characteristics or interactions. With the help of custom orchestration status, the client-side code will stay generic. All main modifications will happen on the server side. 

### Instruction specification 

The orchestrator can provide unique instructions to the clients via the custom state. The custom status instructions will be mapped to the steps in the orchestration code.

## Sample

In the following sample, the custom status is set first;

```csharp
public static async Task SetStatusTest([OrchestrationTrigger] DurableOrchestrationContext ctx)
{
    // ...do work...

    // update the status of the orchestration with some arbitrary data
    var customStatus = new { nextActions = new [] {"A", "B", "C"}, foo = 2, };
    ctx.SetCustomStatus(customStatus);

    // ...do more work...
}

```

While the orchestration is running, external clients can fetch this custom status:

```http
GET /admin/extensions/DurableTaskExtension/instances/instance123

```

Clients will get the following response: 

```http
{
  "runtimeStatus": "Running",
  "input": null,
  "customStatus": { "nextActions": ["A", "B", "C"], "foo": 2 },
  "output": null,
  "createdTime": "2017-10-06T18:30:24Z",
  "lastUpdatedTime": "2017-10-06T19:40:30Z"
}
```

> [!WARNING]
>  The custom status payload is limited to 16 KB of UTF-16 JSON text because it needs to be able to fit in an Azure Table Storage column. Developers can use external storage if they need larger payload.


## Next steps

> [!div class="nextstepaction"]
> [Learn about HTTP APIs in Durable Functions](durable-functions-http-api.md)


