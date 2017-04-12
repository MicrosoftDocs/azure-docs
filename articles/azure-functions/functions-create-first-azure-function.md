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
ms.topic: hero-article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/12/2017
ms.author: glenga

---
# Create your first function in the Azure portal

This topic shows you how to use Azure Functions to create a "hello world" function in the Azure Portal. 

![Create function app in the Azure portal](./media/functions-create-first-azure-function/function-app-in-portal-editor.png)

To complete this quickstart, you must have an Azure account. [Free accounts](https://azure.microsoft.com/free/) are available. You can also [try Azure Functions](https://azure.microsoft.com/try/app-service/functions/) without having to register with Azure.

## Log in to Azure

Log in to the [Azure portal](https://portal.azure.com/).
## Create a function from the portal quickstart

## Create a function app

Before you can create a function in the Azure portal, you must create a function app to host the serverless execution of your function.

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Click **Compute** > **Function App**, select your **Subscription**, and enter values for the required function app settings.
 
     ![Create function app in the Azure portal](./media/functions-create-first-azure-function/function-app-create-flow.png)

    | Setting      | Description                                        |
    | ------------ | -------------------------------------------------- |
    | **App name** | A name that uniquely identifies your function app. |
    | **[Resource Group](../articles/azure-resource-manager/resource-group-overview.md)** | Select an existing resource group or **Create new** and enter a name for the new resource group. |
    | **[Hosting plan](../articles/app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md)** | Choose **Consumption plan**, which is the default plan type for Azure Functions where resources are added to your function app as needed. |
    | **Storage account** | Each function app requires a storage account. You can either choose an existing storage account or [create a storage account](../articles/storage/storage-create-storage-account.md#create-a-storage-account).|    

3. Click **Create** to provision and deploy the new function app.  

Now, you can create a function in the new function app.

## Create an HTTP triggered function

Click the **+** button next to **Functions**, then click **WebHook + API**,choose a language for your function, and click **Create a function**. 
   
![](./media/functions-create-first-azure-function/function-app-quickstart-node-webhook.png)

A function is created in your chosen language using the HTTP triggered function template. You can trigger the new function by sending an HTTP request.

## Test the function

1. In your function, click **</> Get function URL**, copy the request URL and paste it into the tool or browser address bar. Append the query string value `&name=yourname` to the URL and execute the request. The following shows the response in the browser:

	![](./media/functions-create-first-azure-function/function-app-browser-testing.png)

Information is written to the logs and a string is returned in the body of the response message. 

Now you have simple function that runs when it is invoked over HTTP. 

## Next steps

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

