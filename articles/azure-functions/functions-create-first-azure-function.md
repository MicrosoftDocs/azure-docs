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
ms.date: 04/10/2017
ms.author: glenga

ms.custom: welcome-email

ROBOTS: NOINDEX, NOFOLLOW

---
# Create your first function in the Azure portal

This topic shows you how to use Azure Functions to create a "hello world" function that is invoked by an HTTP request. Before you can create a function in the Azure portal, you must create a function app to host the serverless execution of your function.

To complete this quickstart, you must have an Azure account. [Free accounts](https://azure.microsoft.com/free/) are available. You can also [try Azure Functions](https://azure.microsoft.com/try/app-service/functions/) without having to register with Azure.

## Log in to Azure

Log in to the [Azure portal](https://portal.azure.com/).

## Create a function app

[!INCLUDE [functions-create-function-app-portal](../../includes/functions-create-function-app-portal.md)]

For more information, see [Create a function app from the Azure portal](functions-create-function-app-portal.md).

## Create a function
These steps create a function in the new function app by using the Azure Functions quickstart.

1. Click the **New** button, then click **WebHook + API**, choose a language for your function, and click **Create a function**. A function is created in your chosen language using the HTTP triggered function template.  
   
    ![](./media/functions-create-first-azure-function/function-app-quickstart-node-webhook.png)

After the function is created, you can test it by sending an HTTP request.

## Test the function

Since the function templates contain working code, you can immediately test your new function right in the portal.

1. In your function app, click the new function and review the code from the template. Notice that the function expects an HTTP request with a *name* value passed either in the message body or in a query string. When the function runs, this value is returned in the response message. The example shown is a JavaScript function.
   
2. Click **Run** to run the function. You see that execution is triggered by a test HTTP request, information is written to the logs, and the "hello..." response is displayed in the **Output** in the **Test** tab.
 
    ![](./media/functions-create-first-azure-function/function-app-develop-tab-testing.png)

3. In the **Request body** text box, change the value of the *name* property to your name, and click **Run** again. This time, the response in the **Output** contains your name.   

4. To trigger execution of the same function from an HTTP testing tool or from another browser window, click **</> Get function URL**, copy the request URL and paste it into the tool or browser address bar. Append the query string value `&name=yourname` to the URL and execute the request. The same information is written to the logs and the same string is contained in the body of the response message.

	![](./media/functions-create-first-azure-function/function-app-browser-testing.png)


## Next steps
[!INCLUDE [Functions quickstart next steps](../../includes/functions-quickstart-next-steps.md)]

[!INCLUDE [Getting Started Note](../../includes/functions-get-help.md)]

