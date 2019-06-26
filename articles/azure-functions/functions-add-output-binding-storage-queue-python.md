---
title: Add an Azure Storage queue binding to your Python function 
description: Learn how to add an Azure Storage queue output binding to your Python function using the Azure CLI and Functions Core Tools.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 04/24/2019
ms.topic: quickstart
ms.service: azure-functions
ms.custom: mvc
ms.devlang: python
manager: jeconnoc
---

# Add an Azure Storage queue binding to your Python function

Azure Functions lets you connect Azure services and other resources to functions without having to write your own integration code. These *bindings*, which represent both input and output, are declared within the function definition. Data from bindings is provided to the function as parameters. A trigger is a special type of input binding. While a function has only one trigger, it can have multiple input and output bindings. To learn more, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

This article shows you how to integrate the function you created in the [previous quickstart article](functions-create-first-function-python.md) with an Azure Storage queue. The output binding that you add to this function writes data from the HTTP request to a message in the queue. 

Most bindings require a stored connection string that Functions uses to access the bound service. To make it easier, you use the Storage account that you created with your function app. The connection to this account is already stored in an app setting named `AzureWebJobsStorage`.  

## Prerequisites

Before you start this article, complete the steps in [part 1 of the Python quickstart](functions-create-first-function-python.md).

## Download the function app settings

In the previous quickstart article, you created a function app in Azure along with the required Storage account. The connection string for this account is stored securely in app settings in Azure. In this article, you write messages to a Storage queue in the same account. To connect to your Storage account when running the function locally, you must download app settings to the local.settings.json file. Run the following the Azure Functions Core Tools command to download settings to local.settings.json, replacing `<APP_NAME>` with the name of your function app from the previous article:

```bash
func azure functionapp fetch-app-settings <APP_NAME>
```

You may be required to sign in to your Azure account.

> [!IMPORTANT]  
> Because it contains secrets, the local.settings.json file never gets published, and it should be excluded from source control.

You need the value `AzureWebJobsStorage`, which is the Storage account connection string. You use this connection to verify that the output binding works as expected.

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

Now, you can add a the Storage output binding to your project.

## Add an output binding

In Functions, each type of binding requires a `direction`, `type`, and a unique `name` to be defined in the function.json file. Depending on the binding type, additional properties may be required. The [queue output configuration](functions-bindings-storage-queue.md#output---configuration) describes the fields required for an Azure Storage queue binding.

To create a binding, you add a binding configuration object to the `function.json` file. Edit the function.json file in your HttpTrigger folder to add an object to the `bindings` array that has the following properties:

| Property | Value | Description |
| -------- | ----- | ----------- |
| **`name`** | `msg` | Name that identifies the binding parameter referenced in your code. |
| **`type`** | `queue` | The binding is an Azure Storage queue binding. |
| **`direction`** | `out` | The binding is an output binding. |
| **`queueName`** | `outqueue` | The name of the queue that the binding writes to. When the *queueName* doesn't exist, the binding creates it on first use. |
| **`connection`** | `AzureWebJobsStorage` | The name of an app setting that contains the connection string for the Storage account. The `AzureWebJobsStorage` setting contains the connection string for the Storage account you created with the function app. |

Your function.json file should now look like the following example:

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

Once it's configured, you can start using the `name` of the binding to access it as a method attribute in the function signature. In the following example, `msg` is an instance of the [`azure.functions.InputStream class`](/python/api/azure-functions/azure.functions.httprequest).

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

By using an output binding, you don't have to use the Azure Storage SDK code for authentication, getting a queue reference, or writing data. The Functions runtime and queue output binding do those tasks for you.

## Run the function locally

As before, use the following command to start the Functions runtime locally:

```bash
func host start
```

> [!NOTE]  
> Because the previous article had you enable extension bundles in the host.json, the [Storage binding extension](functions-bindings-storage-blob.md#packages---functions-2x) was downloaded and installed for you during startup, along with the other Microsoft binding extensions.

Copy the URL of your `HttpTrigger` function from the runtime output and paste it into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request. You should see the same response in the browser as you did in the previous article.

This time, the output binding also creates a queue named `outqueue` in your Storage account and adds a message with this same string.

Next, you use the Azure CLI to view the new queue and verify that a message was added. You can also view your queue using the [Microsoft Azure Storage Explorer][Azure Storage Explorer] or in the [Azure portal](https://portal.azure.com).

### Set the Storage account connection

Open the local.settings.json file and copy the value of `AzureWebJobsStorage`, which is the Storage account connection string. Set the `AZURE_STORAGE_CONNECTION_STRING` environment variable to the connection string using the following Bash command:

```azurecli-interactive
export AZURE_STORAGE_CONNECTION_STRING=<STORAGE_CONNECTION_STRING>
```

With the connection string set in the `AZURE_STORAGE_CONNECTION_STRING` environment variable, you can access your Storage account without having to provide authentication each time.

### Query the Storage queue

You can use the [`az storage queue list`](/cli/azure/storage/queue#az-storage-queue-list) command to view the Storage queues in your account, as in the following example:

```azurecli-interactive
az storage queue list --output tsv
```

The output from this command includes a queue named `outqueue`, which is the queue that was created when the function ran.

Next, use the [`az storage message peek`](/cli/azure/storage/message#az-storage-message-peek) command to view the messages in this queue, as in the following example.

```azurecli-interactive
echo `echo $(az storage message peek --queue-name outqueue -o tsv --query '[].{Message:content}') | base64 --decode`
```

The string returned should be the same as the message you sent to test the function.

> [!NOTE]  
> The previous example decodes the returned string from base64. This is because the Queue storage bindings write to and read from Azure Storage as [base64 strings](functions-bindings-storage-queue.md#encoding).

Now, it's time to republish the updated function app to Azure.

[!INCLUDE [functions-publish-project](../../includes/functions-publish-project.md)]

Again, you can use cURL or a browser to test the deployed function. As before append the query string `&name=<yourname>` to the URL, as in the following example:

```bash
curl https://myfunctionapp.azurewebsites.net/api/httptrigger?code=cCr8sAxfBiow548FBDLS1....&name=<yourname>
```

You can [Examine the Storage queue message](#query-the-storage-queue) to verify that the output binding again generates a new message in the queue.

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

You've updated your HTTP triggered function to write data to a Storage queue. To learn more about developing Azure Functions using Python, see the [Azure Functions Python developer guide](functions-reference-python.md) and [Azure Functions triggers and bindings](functions-triggers-bindings.md).

Next, you should enable Application Insights monitoring for your function app:

> [!div class="nextstepaction"]
> [Enable Application Insights integration](functions-monitoring.md#manually-connect-an-app-insights-resource)

[Azure Storage Explorer]: https://storageexplorer.com/