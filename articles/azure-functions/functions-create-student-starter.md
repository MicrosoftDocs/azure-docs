---
title: Create a function using Azure for Students Starter 
description: Learn how to create an Azure Function from within an Azure for Student Starter subscription
# Customer intent: As a student, I want to be able to create an HTTP triggered Function App within the Student Starter plan so that I can easily add APIs to any project.

ms.topic: how-to
ms.date: 04/29/2020


---
# Create a function using Azure for Students Starter

In this tutorial, we'll create a "hello world" HTTP function in an Azure for Students Starter subscription. We'll also walk through what's available in Azure Functions in this subscription type.

Microsoft *Azure for Students Starter* gets you started with the Azure products you need to develop in the cloud at no cost to you. [Learn more about this offer here.](https://azure.microsoft.com/offers/ms-azr-0144p/)

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment without having to first create a VM or publish a web application. [Learn more about Functions here.](./functions-overview.md)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a function

 In this article, learn how to use Azure Functions to create an "hello world" HTTP trigger function in the Azure portal.

![Create function app in the Azure portal](./media/functions-create-student-starter/function-app-in-portal-editor.png)

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

Next, you create a function in the new function app.

## <a name="create-function"></a>Create an HTTP trigger function

1. From the left menu of the **Functions** window, select **Functions**, then select **Add** from the top menu. 
 
1. From the **New Function** window, select **Http trigger**.

    ![Choose HTTP trigger function](./media/functions-create-student-starter/function-app-select-http-trigger.png)

1. In the **New Function** window, accept the default name for **New Function**, or enter a new name. 

1. Choose **Anonymous** from the **Authorization level** drop-down list, and then select **Create Function**.

    Azure creates the HTTP trigger function. Now, you can run the new function by sending an HTTP request.

## Test the function

1. In your new HTTP trigger function, select **Code + Test** from the left menu, then select **Get function URL** from the top menu.

    ![Select Get function URL](./media/functions-create-student-starter/function-app-select-get-function-url.png)

1. In the **Get function URL** dialog box, select **default** from the drop-down list, and then select the **Copy to clipboard** icon. 

    ![Copy the function URL from the Azure portal](./media/functions-create-student-starter/function-app-develop-tab-testing.png)

1. Paste the function URL into your browser's address bar. Add the query string value `?name=<your_name>` to the end of this URL and press Enter to run the request. 

    The following example shows the response in the browser:

    ![Function response in the browser.](./media/functions-create-student-starter/function-app-browser-testing.png)

    The request URL includes a key that is required, by default, to access your function over HTTP.

1. When your function runs, trace information is written to the logs. To see the trace output, return to the **Code + Test** page in the portal and expand the **Logs** arrow at the bottom of the page.

   ![Functions log viewer in the Azure portal.](./media/functions-create-student-starter/function-view-logs.png)

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Supported features in Azure for Students Starter

In Azure for Students Starter, you have access to most of the features of the Azure Functions runtime, with several key limitations listed below:

* The HTTP trigger is the only trigger type supported.
    * All input and all output bindings are supported! [See the full list here.](functions-triggers-bindings.md)
* Languages Supported: 
    * C# (.NET Core 2)
    * JavaScript (Node.js 8 & 10)
    * F# (.NET Core 2)
    * [See languages supported in higher plans here](supported-languages.md)
* Windows is the only supported operating system.
* Scale is restricted to [one free tier instance](https://azure.microsoft.com/pricing/details/app-service/windows/) running for up to 60 minutes each day. You'll serverlessly scale from 0 to 1 instance automatically as HTTP traffic is received, but no further.
* Only [version 2.x and later](functions-versions.md) of the Functions runtime is supported.
* All developer tooling is supported for editing and publishing functions. This includes VS Code, Visual Studio, the Azure CLI, and the Azure portal. If you'd like to use anything other than the portal, you'll need to first create an app in the portal, and then choose that app as a deployment target in your preferred tool.

## Next steps

You've now finished creating a function app with a simple HTTP trigger function. Next, you can explore local tooling, more languages, monitoring, and integrations.

 * [Create your first function using Visual Studio](./functions-create-your-first-function-visual-studio.md)
 * [Create your first function using Visual Studio Code](./create-first-function-vs-code-csharp.md)
 * [Azure Functions JavaScript developer guide](./functions-reference-node.md)
 * [Use Azure Functions to connect to an Azure SQL Database](./functions-scenario-database-table-cleanup.md)
 * [Learn more about Azure Functions HTTP bindings](./functions-bindings-http-webhook.md).
 * [Monitor your Azure Functions](./functions-monitoring.md)