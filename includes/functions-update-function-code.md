---
title: include file
description: include file
services: functions
author: ggailey777
manager: jeconnoc
ms.service: azure-functions
ms.topic: include
ms.date: 03/12/2019
ms.author: glenga
ms.custom: include file, fasttrack-edit
---

## Update the function

By default, the template creates a function that requires a function key when making requests. To make it easier to test the function in Azure, you need to update the function to allow anonymous access. The way that you make this change depends on your functions project language.

### C\#

Open the MyHttpTrigger.cs code file that is your new function and update the **AuthorizationLevel** attribute in the function definition to a value of `Anonymous` and save your changes.

```csharp
[FunctionName("MyHttpTrigger")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
    ILogger log)
```

### JavaScript

Open the function.json file for your new function in a text editor, update the **authLevel** property in **bindings** to `anonymous`, and save your changes.

```json
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
```

Now you can call the function in Azure without having to supply the function key. The function key is never required when running locally.
