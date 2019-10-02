---
title: Add an Azure Storage queue binding to your Python function 
description: Learn how to add an Azure Storage queue output binding to your Python function.
author: ggailey777
ms.author: glenga
ms.date: 10/02/2019
ms.topic: quickstart
ms.service: azure-functions
manager: gwallace
---

# Add an Azure Storage queue binding to your Python function

[!INCLUDE [functions-add-storage-binding-intro](../../includes/functions-add-storage-binding-intro.md)]

This article shows you how to integrate the function you created in the [previous quickstart article](functions-create-first-function-python.md) with an Azure Storage queue. The output binding that you add to this function writes data from an HTTP request to a message in the queue.

Most bindings require a stored connection string that Functions uses to access the bound service. To make this connection easier, you use the Storage account that you created with your function app. The connection to this account is already stored in an app setting named `AzureWebJobsStorage`.  

## Prerequisites

Before you start this article, complete the steps in [part 1 of the Python quickstart](functions-create-first-function-python.md).

## Download the function app settings

[!INCLUDE [functions-app-settings-download-cli](../../includes/functions-app-settings-download-cli.md)]

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

You can now add the Storage output binding to your project.

## Add an output binding

In Functions, each type of binding requires that a `direction`, a `type`, and a unique `name` be defined in the function.json file. Depending on the binding type, additional properties might be required. The [queue output configuration](functions-bindings-storage-queue.md#output---configuration) describes the fields required for an Azure Storage queue binding.

To create a binding, you add a binding configuration object to the function.json file. Edit the function.json file in your HttpTrigger folder to add an object to the `bindings` array that has these properties:

| Property | Value | Description |
| -------- | ----- | ----------- |
| **`name`** | `msg` | The name that identifies the binding parameter referenced in your code. |
| **`type`** | `queue` | The binding is an Azure Storage queue binding. |
| **`direction`** | `out` | The binding is an output binding. |
| **`queueName`** | `outqueue` | The name of the queue that the binding writes to. When the `queueName` doesn't exist, the binding creates it on first use. |
| **`connection`** | `AzureWebJobsStorage` | The name of an app setting that contains the connection string for the Storage account. The `AzureWebJobsStorage` setting contains the connection string for the Storage account you created with the function app. |

Your function.json file should now look like this example:

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
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
    },
  {
      "type": "queue",
      "direction": "out",
      "name": "msg",
      "queueName": "outqueue",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

## Add code that uses the output binding

After the `name` is configured, you can start using it to access the binding as a method attribute in the function signature. In the following example, `msg` is an instance of the [`azure.functions.InputStream class`](/python/api/azure-functions/azure.functions.httprequest).

```python
import logging

import azure.functions as func


def main(req: func.HttpRequest, msg: func.Out[func.QueueMessage]) -> str:

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        msg.set(name)
        return func.HttpResponse(f"Hello {name}!")
    else:
        return func.HttpResponse(
            "Please pass a name on the query string or in the request body",
            status_code=400
        )
```

When you use an output binding, you don't have to use the Azure Storage SDK code for authentication, getting a queue reference, or writing data. The Functions runtime and queue output binding do those tasks for you.

## Run the function locally

As before, use the following command to start the Functions runtime locally:

```bash
func host start
```

[!INCLUDE [functions-storage-binding-run-local](../../includes/functions-storage-binding-run-local.md)]

[!INCLUDE [functions-storage-binding-set-connection](../../includes/functions-storage-binding-set-connection.md)]

[!INCLUDE [functions-storage-binding-query-cli](../../includes/functions-storage-binding-query-cli.md)]

### Redeploy the project 

To update your published app, use the [`func azure functionapp publish`](../articles/azure-functions/functions-run-local.md#project-file-deployment) Core Tools command to deploy your project code to Azure. In this example, replace `<APP_NAME>` with the name of your app.

```command
func azure functionapp publish <APP_NAME> --build remote
```

Again, you can use cURL or a browser to test the deployed function. As before, append the query string `&name=<yourname>` to the URL, as in this example:

```bash
curl https://myfunctionapp.azurewebsites.net/api/httptrigger?code=cCr8sAxfBiow548FBDLS1....&name=<yourname>
```

You can [examine the Storage queue message](#query-the-storage-queue) again to verify that the output binding generates a new message in the queue, as expected.

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

You've updated your HTTP-triggered function to write data to a Storage queue. To learn more about developing Azure Functions with Python, see the [Azure Functions Python developer guide](functions-reference-python.md) and [Azure Functions triggers and bindings](functions-triggers-bindings.md). For examples of complete Function projects in Python, see the [Python Functions samples](/samples/browse/?products=azure-functions&languages=python). 

Next, you should enable Application Insights monitoring for your function app:

> [!div class="nextstepaction"]
> [Enable Application Insights integration](functions-monitoring.md#manually-connect-an-app-insights-resource)

[Azure Storage Explorer]: https://storageexplorer.com/