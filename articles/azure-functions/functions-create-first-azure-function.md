---
title: Create your first function in the Azure portal
description: Learn how to create your first Azure Function for serverless execution using the Azure portal.
ms.assetid: 96cf87b9-8db6-41a8-863a-abb828e3d06d
ms.topic: how-to
ms.date: 03/26/2020
ms.custom: mvc, devcenter, cc996988-fb4f-47
---

# Create your first function in the Azure portal

Azure Functions lets you run your code in a serverless environment without having to first create a virtual machine (VM) or publish a web application. In this article, you learn how to use Azure Functions to create a "hello world" HTTP trigger function in the Azure portal.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

If you're a C# developer, consider [creating your first function in Visual Studio 2019](functions-create-your-first-function-visual-studio.md) instead of in the portal. 

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

Next, create a function in the new function app.

## <a name="create-function"></a>Create an HTTP trigger function

1. From the left menu of the **Functions** window, select **Functions**, then select **Add** from the top menu. 
 
1. From the **New Function** window, select **Http trigger**.

    ![Choose HTTP trigger function](./media/functions-create-first-azure-function/function-app-select-http-trigger.png)

1. In the **New Function** window, accept the default name for **New Function**, or enter a new name. 

1. Choose **Anonymous** from the **Authorization level** drop-down list, and then select **Create Function**.

    Azure creates the HTTP trigger function. Now, you can run the new function by sending an HTTP request.

## Test the function

1. In your new HTTP trigger function, select **Code + Test** from the left menu, then select **Get function URL** from the top menu.

    ![Select Get function URL](./media/functions-create-first-azure-function/function-app-select-get-function-url.png)

1. In the **Get function URL** dialog box, select **default** from the drop-down list, and then select the **Copy to clipboard** icon. 

    ![Copy the function URL from the Azure portal](./media/functions-create-first-azure-function/function-app-develop-tab-testing.png)

1. Paste the function URL into your browser's address bar. Add the query string value `?name=<your_name>` to the end of this URL and press Enter to run the request. 

    The following example shows the response in the browser:

    ![Function response in the browser.](./media/functions-create-first-azure-function/function-app-browser-testing.png)

    The request URL includes a key that is required, by default, to access your function over HTTP.

1. When your function runs, trace information is written to the logs. To see the trace output, return to the **Code + Test** page in the portal and expand the **Logs** arrow at the bottom of the page.

   ![Functions log viewer in the Azure portal.](./media/functions-create-first-azure-function/function-view-logs.png)

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

