---
title: Create your first function from the Azure Portal | Microsoft Docs
description: Welcome to Azure. Create your first Azure Function from the Azure portal.
services: functions
documentationcenter: na
author: ggailey777
manager: erikre
editor: ''
tags: ''

ms.assetid: 96cf87b9-8db6-41a8-863a-abb828e3d06d
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 03/15/2017
ms.author: glenga

ms.custom: welcome-email

ROBOTS: NOINDEX, NOFOLLOW

---
# Create your first function in the Azure portal

This topic shows you how to create a simple "hello world" Azure Function that is invoked by an HTTP request. Before you can create a function in the Azure portal, you must create a function app in Azure App Service to host the execution of your function.

To complete this quickstart, you must have an Azure account. [Free accounts](https://azure.microsoft.com/free/) are available. You can also [try Azure Functions](https://azure.microsoft.com/try/app-service/functions/) without having to register with Azure.

## Create a function app

[!INCLUDE [functions-create-function-app-portal](../../includes/functions-create-function-app-portal.md)]

For more information, see [Create a function app from the Azure portal](functions-create-function-app-portal.md).

## Create a function
These steps create a function in the new function app by using the Azure Functions quickstart.

1. In the **Quickstart** tab, click **WebHook + API** and choose a language for your function, then click **Create a function**. A new predefined function is created in your chosen language.  
   
    ![](./media/functions-create-first-azure-function-azure-portal/function-app-quickstart-node-webhook.png)

4. (Optional) At this point in the quickstart, you can choose to take a quick tour of Azure Functions features in the portal. After you have completed or skipped the tour, you can test your new function by sending an the HTTP request.


## Test the function
[!INCLUDE [Functions quickstart test](../../includes/functions-quickstart-test.md)]

## Next steps
[!INCLUDE [Functions quickstart next steps](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

