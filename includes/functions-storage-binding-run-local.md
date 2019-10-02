---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/02/2019
ms.author: glenga
---

> [!NOTE]  
> Because you enabled extension bundles in the host.json, the [Storage binding extension](../articles/azure-functions/functions-bindings-storage-blob.md#packages---functions-2x) was downloaded and installed for you during startup, along with the other Microsoft binding extensions.

Copy the URL of your `HttpTrigger` function from the runtime output and paste it into your browser's address bar. Append the query string `?name=<yourname>` to this URL and run the request. You should see the same response in the browser as you did in the previous article.

This time, the output binding also creates a queue named `outqueue` in your Storage account and adds a message with this same string.

Next, you use the Azure CLI to view the new queue and verify that a message was added. You can also view your queue by using the [Microsoft Azure Storage Explorer][Azure Storage Explorer] or in the [Azure portal](https://portal.azure.com).