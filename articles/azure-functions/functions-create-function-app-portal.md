---
title: Create a function app from the Azure portal 
description: Create a new function app in Azure from the portal. 
ms.topic: how-to
ms.date: 08/29/2019
ms.custom: mvc

---
# Create a function app from the Azure portal

This topic shows you how to use Azure Functions to create a function app in the Azure portal. A function app is the container that hosts the execution of individual functions. 

## Create a function app

[!INCLUDE [functions-create-function-app-portal](../../includes/functions-create-function-app-portal.md)]

After the function app is created, you can create individual functions in one or more different languages. Create functions [by using the portal](functions-create-first-azure-function.md#create-function), [continuous deployment](functions-continuous-deployment.md), or by [uploading with FTP](https://github.com/projectkudu/kudu/wiki/Accessing-files-via-ftp).

## Service plans

Azure Functions has three different service plans: Consumption plan, Premium plan, and Dedicated (App Service) plan. You must choose your service plan when your function app is created, and it cannot subsequently be changed. For more information, see [Choose an Azure Functions hosting plan](functions-scale.md).

If you are planning to run JavaScript functions on a Dedicated (App Service) plan, you should choose a plan with fewer cores. For more information, see the [JavaScript reference for Functions](functions-reference-node.md#choose-single-vcpu-app-service-plans).

<a name="storage-account-requirements"></a>

## Storage account requirements

When creating a function app, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. Internally, Functions uses Storage for operations such as managing triggers and logging function executions. Some storage accounts do not support queues and tables, such as blob-only storage accounts, Azure Premium Storage, and general-purpose storage accounts with ZRS replication. These accounts are filtered out of from the Storage Account blade when creating a function app.

>[!NOTE]
>When using the Consumption hosting plan, your function code and binding configuration files are stored in Azure File storage in the main storage account. When you delete the main storage account, this content is deleted and cannot be recovered.

To learn more about storage account types, see [Introducing the Azure Storage Services](../storage/common/storage-introduction.md#core-storage-services). 

## Next steps

While the Azure portal makes it easy to create and try out Functions, we recommend [local development](functions-develop-local.md). After creating a function app in the portal, you still need to add a function. 

> [!div class="nextstepaction"]
> [Add an HTTP triggered function](functions-create-first-azure-function.md#create-function)
