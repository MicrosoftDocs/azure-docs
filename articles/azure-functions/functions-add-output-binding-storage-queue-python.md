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

[!INCLUDE [functions-cloud-shell-note](../../includes/functions-cloud-shell-note.md)]

## Download the function app settings

[!INCLUDE [functions-app-settings-download-cli](../../includes/functions-app-settings-download-local-cli.md)]

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

You can now add the Storage output binding to your project.

## Add an output binding

In Functions, each type of binding requires a `direction`, `type`, and a unique `name` to be defined in the function.json file. The way you define these attributes depends on the language of your function app.

[!INCLUDE [functions-add-output-binding-json](../../includes/functions-add-output-binding-json.md)]

## Add code that uses the output binding

[!INCLUDE [functions-add-output-binding-python](../../includes/functions-add-output-binding-python.md)]

When you use an output binding, you don't have to use the Azure Storage SDK code for authentication, getting a queue reference, or writing data. The Functions runtime and queue output binding do those tasks for you.

## Run the function locally

As before, use the following command to start the Functions runtime locally:

```bash
func host start
```

> [!NOTE]  
> Because you enabled extension bundles in the host.json, the [Storage binding extension](functions-bindings-storage-blob.md#packages---functions-2x) was downloaded and installed for you during startup, along with the other Microsoft binding extensions.

Copy the URL of your `HttpTrigger` function from the runtime output and paste it into your browser's address bar. Append the query string `?name=<yourname>` to this URL and run the request. You should see the same response in the browser as you did in the previous article.

This time, the output binding also creates a queue named `outqueue` in your Storage account and adds a message with this same string.

Next, you use the Azure CLI to view the new queue and verify that a message was added. You can also view your queue by using the [Microsoft Azure Storage Explorer][Azure Storage Explorer] or in the [Azure portal](https://portal.azure.com).

[!INCLUDE [functions-storage-account-set-cli](../../includes/functions-storage-account-set-cli.md)]

[!INCLUDE [functions-query-storage-cli](../../includes/functions-query-storage-cli.md)]

### Redeploy the project 

To update your published app, use the [`func azure functionapp publish`](functions-run-local.md#project-file-deployment) Core Tools command to deploy your project code to Azure. In this example, replace `<APP_NAME>` with the name of your app.

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