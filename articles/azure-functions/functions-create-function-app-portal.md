---
title: Create a function app from the Azure Portal | Microsoft Docs
description: Create a new function app in Azure App Service from the portal. 
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc

ms.assetid: 
ms.service: azure-functions
ms.devlang: multiple
ms.topic: quickstart
ms.date: 04/11/2017
ms.author: glenga
ms.custom: mvc

---
# Create a function app from the Azure portal

Azure Function Apps uses the Azure App Service infrastructure. This topic shows you how to create a function app in the Azure portal. A function app is the container that hosts the execution of individual functions. When you create a function app in the App Service hosting plan, your function app can use all the features of App Service.

## Create a function app

[!INCLUDE [functions-create-function-app-portal](../../includes/functions-create-function-app-portal.md)]

When you create a function app, supply a valid **App name**, which can contain only letters, numbers, and hyphens. Underscore (**_**) is not an allowed character.

Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. Your storage account name must be unique within Azure. 

After the function app is created, you can create individual functions in one or more different languages. Create functions [by using the portal](functions-create-first-azure-function.md#create-function), [continuous deployment](functions-continuous-deployment.md), or by [uploading with FTP](https://github.com/projectkudu/kudu/wiki/Accessing-files-via-ftp).

## Service plans

Azure Functions has two different service plans: Consumption plan and App Service plan. The Consumption plan automatically allocates compute power when your code is running, scales-out as necessary to handle load, and then scales-in when code is not running. The App Service plan gives your function app access to all the facilities of App Service. You must choose your service plan when your function app is created, and it cannot currently be changed. For more information, see [Choose an Azure Functions hosting plan](functions-scale.md).

If you are planning to run JavaScript functions on an App Service plan, you should choose a plan with fewer cores. For more information, see the [JavaScript reference for Functions](functions-reference-node.md#choose-single-vcpu-app-service-plans).

<a name="storage-account-requirements"></a>

## Storage account requirements

When creating a function app in App Service, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. Internally, Functions uses Storage for operations such as managing triggers and logging function executions. Some storage accounts do not support queues and tables, such as blob-only storage accounts, Azure Premium Storage, and general-purpose storage accounts with ZRS replication. These accounts are filtered out of from the Storage Account blade when creating a function app.

>[!NOTE]
>When using the Consumption hosting plan, your function code and binding configuration files are stored in Azure File storage in the main storage account. When you delete the main storage account, this content is deleted and cannot be recovered.

To learn more about storage account types, see [Introducing the Azure Storage Services](../storage/common/storage-introduction.md#azure-storage-services). 

## Next steps

[!INCLUDE [Functions quickstart next steps](../../includes/functions-quickstart-next-steps.md)]



