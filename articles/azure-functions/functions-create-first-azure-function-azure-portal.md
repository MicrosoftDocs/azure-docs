---
title: Create a function from the Azure Portal | Microsoft Docs
description: Build your first Azure Function, a serverless application, in less than two minutes.
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
ms.date: 02/02/2017
ms.author: glenga

---
# Create a function from the Azure portal
## Overview
Azure Functions is an event-driven, compute-on-demand experience that extends the existing Azure application platform with capabilities to implement code triggered by events occurring in other Azure services, SaaS products, and on-premises systems. With Azure Functions, your applications scale based on demand and you pay only for the resources you consume. Azure Functions enables you to create scheduled or triggered units of code implemented in various programming languages. To learn more about Azure Functions, see the [Azure Functions Overview](functions-overview.md).

This topic shows you how to use the Azure portal to create a simple "hello world"  Node.js Azure Function that is invoked by an HTTP-trigger. Before you can create a function in the Azure portal, you must explicitly create a function app in Azure App Service. To have the function app created for you automatically, see [the other Azure Functions quickstart tutorial](functions-create-first-azure-function.md), which is a simpler quickstart experience and includes a video.

## Create a function app
A function app hosts the execution of your functions in Azure. If you don't already have an Azure account, check out the [Try Functions](https://functions.azure.com/try) experience or  [create a free Azure acccount](https://azure.microsoft.com/free/). Follow these steps to create a function app in the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com) and sign-in with your Azure account.
2. Click **+New** > **Compute** > **Function App**, select your **Subscription**, type a unique **App name** that identifies your function app, then specify the following settings:
   
   * **[Resource Group](../azure-resource-manager/resource-group-overview.md)**: Select **Create new** and enter a name for your new resource group. You can also choose an existing resource group, however you may not be able to create a consumption-based App Service plan for your function app.
   * **[Hosting plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md)**, which can be one of the following: 
     * **Consumption plan**: The default plan type for Azure Functions. When you choose a consumption plan, you must also choose the **Location** and set the **Memory Allocation** (in MB). For information about how memory allocation affects costs, see [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/). 
     * **App Service plan**: An App Service plan requires you to create an **App Service plan/location** or select an existing one. These settings determine the [location, features, cost and compute resources](https://azure.microsoft.com/pricing/details/app-service/) associated with your app.  
   * **Storage account**: Each function app requires a storage account. You can either choose an existing storage account or create one. 
     
     ![Create new function app in the Azure portal](./media/functions-create-first-azure-function-azure-portal/function-app-create-flow.png)

	Note that you must enter a valid **App name**, which can contain only letters, numbers, and hyphens. Underscore (**_**) is not an allowed character.

3. Click **Create** to provision and deploy the new function app.  

Now that the function app is provisioned, you can create your first function.

## Create a function
These steps create a function from the Azure Functions quickstart.

1. In the **Quickstart** tab, click **WebHook + API** and **JavaScript**, then click **Create a function**. A new predefined Node.js function is created. 
   
    ![](./media/functions-create-first-azure-function-azure-portal/function-app-quickstart-node-webhook.png)

2. (Optional) At this point in the quickstart, you can choose to take a quick tour of Azure Functions features in the portal.    After you have completed or skipped the tour, you can test your new function by using the HTTP trigger.

## Test the function
[!INCLUDE [Functions quickstart test](../../includes/functions-quickstart-test.md)]

## Next steps
[!INCLUDE [Functions quickstart next steps](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

