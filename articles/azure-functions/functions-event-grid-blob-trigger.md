---
title: Azure Functions Event Grid Blob Trigger
description: Learn to setup and debug with the Event Grid Blob Trigger
author: cachai2

ms.topic: conceptual
ms.date: 3/1/2021
ms.author: cachai
---

# Azure Function Event Grid Blob Trigger

This article demonstrates how to debug and deploy a local Event Grid Blob triggered function that handles events raised by a storage account.

> [!NOTE]
> The Event Grid Blob trigger is in preview.

## Prerequisites

- Create or use an existing function app
- Create or use an existing storage account
- Have version 5.0+ of the [Microsoft.Azure.WebJobs.Extensions.Storage extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/5.0.0-beta.2) installed.
- Download [ngrok](https://ngrok.com/) to allow Azure to call your local function

## Create a new function

1. Open your function app in Visual Studio Code.

1. **Press F1** to create a new blob trigger function. Make sure to use the connection string for your storage account.

1. Once the function is created, add the Event Grid source parameter.

# [C#](#tab/csharp)
Add **Source = BlobTriggerSource.EventGrid** to the function parameters.

```csharp
    [FunctionName("BlobTriggerCSharp")]
    public static void Run([BlobTrigger("samples-workitems/{name}", Source = BlobTriggerSource.EventGrid, Connection = "connection")]Stream myBlob, string name, ILogger log)
    {
        log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");
    }
```

# [C# Script](#tab/csharp-script)
Add **"source": "EventGrid"** to the function.json binding data.

```json
    {
        "disabled": false,
        "bindings": [
            {
                "name": "myBlob",
                "type": "blobTrigger",
                "direction": "in",
                "path": "samples-workitems/{name}",
                "connection":"MyStorageAccountAppSetting"
            }
        ]
    }
```

# [Java](#tab/java)
This function writes a log when a blob is added or updated in the `myblob` container.

```java
    @FunctionName("blobprocessor")
    public void run(
      @BlobTrigger(name = "file",
                   dataType = "binary",
                   path = "myblob/{name}",
                   source: "EventGrid",
                   connection = "MyStorageAccountAppSetting") byte[] content,
      @BindingName("name") String filename,
      final ExecutionContext context
    ) {
      context.getLogger().info("Name: " + filename + " Size: " + content.length + " bytes");
    }
```

# [JavaScript](#tab/javascript)
Add **"source": "EventGrid"** to the function.json binding data.

```json
    {
        "disabled": false,
        "bindings": [
            {
                "name": "myBlob",
                "type": "blobTrigger",
                "direction": "in",
                "path": "samples-workitems/{name}",
                "source": "EventGrid",
                "connection":"MyStorageAccountAppSetting"
            }
        ]
    }
```

# [PowerShell](#tab/powershell)
Add **"source": "EventGrid"** to the function.json binding data.

```json
    {
      "bindings": [
        {
          "name": "InputBlob",
          "type": "blobTrigger",
          "direction": "in",
          "path": "samples-workitems/{name}",
          "source": "EventGrid",
          "connection": "MyStorageAccountConnectionString"
        }
      ]
    }
```

# [Python](#tab/python)
Add **"source": "EventGrid"** to the function.json binding data.

```json
    {
      "scriptFile": "__init__.py",
      "bindings": [
        {
          "name": "myblob",
          "type": "blobTrigger",
          "direction": "in",
          "path": "samples-workitems/{name}",
          "source": "EventGrid",
          "connection": "MyStorageAccountConnectionString"
        }
      ]
    }
```
---

1. Set a breakpoint in your function on the line that handles logging.

1. **Press F5** to start a debugging session.

[!INCLUDE [functions-event-grid-local-dev](../../includes/functions-event-grid-local-dev.md)]

## Deployment

As you deploy the function app to Azure, update the webhook endpoint from your local endpoint to your deployed app endpoint. To update an endpoint, follow the steps in [Add a storage event](#add-a-storage-event) and use the below for the webhook URL in step 5.

```http
https://<FUNCTION-APP-NAME>.azurewebsites.net/runtime/webhooks/blobs?functionName=Function1&code=<BLOB-EXTENSION-KEY>
```

## Clean up resources

To clean up the resources created in this article, delete the event grid subscription you created in this tutorial.

## Next steps

- [Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md)
- [Event Grid trigger for Azure Functions](./functions-bindings-event-grid.md)
