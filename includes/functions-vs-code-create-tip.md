---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/31/2021
ms.author: glenga
---
    
> [!TIP]
> By default, the extension creates a [resource group](../articles/azure-resource-manager/management/overview.md), which is a logical container in which your function app and related resources run. It also creates a general [storage account](../articles/storage/common/storage-account-create.md), which is used to maintain state and other information about your functions. Both of these resources are created based on the function app name you provide, and in the same new resource group with the function app. If you want to either customize the names of these resources, or reuse existing resources, you need to instead [publish the project with advanced create options](../articles/azure-functions/functions-develop-vs-code.md#enable-publishing-with-advanced-create-options). 