---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 10/20/2018
ms.author: glenga
---

To maximize performance, use a separate storage account for each function app. This is particularly important when you have Durable Functions or Event Hub triggered functions, which both generate a high volume of storage transactions. When your application logic interacts with Azure Storage, either directly (using the Storage SDK) or through one of the storage bindings, you should use a dedicated storage account. For example, if you have an Event Hub-triggered function writing some data to blob storage, use two storage accounts&mdash;one for the function app and another for the blobs being stored by the function.