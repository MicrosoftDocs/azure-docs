---
title: Create a function from the Azure Portal | Microsoft Docs
description: Create a new function app in Azure App Service from the portal. 
services: functions
documentationcenter: na
author: ggailey777
manager: erikre
editor: ''
tags: ''

ms.assetid: 
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 03/15/2017
ms.author: glenga

---
# Create a function from the Azure portal

Azure Function Apps uses the Azure App Service infrastructure. This topic shows you how to create a function app in the Azure portal. A function app is the container that hosts the execution of individual functions. When you create a function app in the App Service hosting plan, your function app can use all of the features of App Service.

## Create a function app

[!INCLUDE [functions-create-function-app-portal](../../includes/functions-create-function-app-portal.md)]

## Service plans

Azure Functions has two different service plans: Consumption plan and App Service plan. The Consumption plan automatically allocates compute power when your code is running, scales-out as necessary to handle load, and then scales-in when code is not running. The App Service plan gives your function app access to all of the facilities of App Service. You must chose your service plan when your function app is created, and it cannot currently be changed. For more information, see [Choose an Azure Functions hosting plan](functions-scale.md).

## <a name="storage-account-requirements"></a>Storage account requirements

When creating a function app in App Service, you must create or link to a general-purpose Azure Storage account that supports Blob, Queue, and Table storage. Internally, Functions uses Storage for operations such as managing triggers and logging function executions. Some storage accounts do not support queues and tables, such as blob-only storage accounts, Azure Premium Storage, and general purpose storage accounts with ZRS replication. These accounts are filtered out of from the Storage Account blade when creating a new function app.

>[!Important]When using the Consumption hosting plan, function app content, including function code and binding configuration files, are stored on Azure File storage on the main storage account. If you delete the main storage account, this content will be deleted and cannot be recovered.

To learn more about storage account types, see [Introducing the Azure Storage Services] (../storage/storage-introduction.md#introducing-the-azure-storage-services).

## Next steps
[!INCLUDE [Functions quickstart next steps](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

