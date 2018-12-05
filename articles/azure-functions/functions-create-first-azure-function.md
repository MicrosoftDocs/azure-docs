---
title: Create your first function from the Azure Portal | Microsoft Docs
description: Learn how to create your first Azure Function for serverless execution using the Azure portal.
services: functions
documentationcenter: na
author: ggailey777
manager: jeconnoc

ms.assetid: 96cf87b9-8db6-41a8-863a-abb828e3d06d
ms.service: azure-functions
ms.devlang: multiple
ms.topic: quickstart
ms.date: 03/28/2018
ms.author: glenga
ms.custom: mvc, devcenter, cc996988-fb4f-47


---
# Create your first function in the Azure portal

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment without having to first create a VM or publish a web application. In this topic, learn how to use Functions to create a "hello world" function in the Azure portal.

![Create function app in the Azure portal](./media/functions-create-first-azure-function/function-app-in-portal-editor.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> C# developers should consider [creating your first function in Visual Studio 2017](functions-create-your-first-function-visual-studio.md) instead of in the portal. 

## Log in to Azure

Sign in to the Azure portal at <http://portal.azure.com> with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logic unit for easier management, deployment, and sharing of resources. 

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

Next, you create a function in the new function app.

## <a name="create-function"></a>Create an HTTP triggered function

1. Expand your new function app, then select the **+** button next to **Functions**, choose **In-portal**, and select **Continue**.

    ![Functions quickstart choose platform.](./media/functions-create-first-azure-function/function-app-quickstart-choose-portal.png)

1. Choose **WebHook + API** and then select **Create**.

    ![Functions quickstart in the Azure portal.](./media/functions-create-first-azure-function/function-app-quickstart-node-webhook.png)

A function is created using a language-specific template for an HTTP triggered function.

Now, you can run the new function by sending an HTTP request.

## Test the function

1. In your new function, click **</> Get function URL** at the top right, select **default (Function key)**, and then click **Copy**. 

    ![Copy the function URL from the Azure portal](./media/functions-create-first-azure-function/function-app-develop-tab-testing.png)

2. Paste the function URL into your browser's address bar. Add the query string value `&name=<yourname>` to the end of this URL and press the `Enter` key on your keyboard to execute the request. You should see the response returned by the function displayed in the browser.  

    The following example shows the response in the browser:

    ![Function response in the browser.](./media/functions-create-first-azure-function/function-app-browser-testing.png)

    The request URL includes a key that is required, by default, to access your function over HTTP.

3. When your function runs, trace information is written to the logs. To see the trace output from the previous execution, return to your function in the portal and click the arrow at the bottom of the screen to expand the **Logs**.

   ![Functions log viewer in the Azure portal.](./media/functions-create-first-azure-function/function-view-logs.png)

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

You have created a function app with a simple HTTP triggered function.  

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

For more information, see [Azure Functions HTTP bindings](functions-bindings-http-webhook.md).
