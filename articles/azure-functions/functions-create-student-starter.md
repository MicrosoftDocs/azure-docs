---
title: Create a Function using Azure for Students Starter | Microsoft Docs
description: Learn how to create an Azure Function from within an Azure for Student Starter subscription
Customer intent: As a student, I want to be able to create a HTTP triggered Function App within the Student Starter plan so that I can easily add APIs to any project.
services: functions
documentationcenter: na
author: alexkarcher-msft
manager: ggailey777

ms.assetid: 
ms.service: azure-functions
ms.devlang: multiple
ms.topic: quickstart
ms.date: 02/22/2019
ms.author: alkarche


---
# Create a Function using Azure for Students Starter

In this tutorial, we will walk through what's available in Azure Functions from an Azure for Students Starter subscription and then create a hello world HTTP function.

Microsoft *Azure for Students Starter* gets you started with the Azure products you need to develop in the cloud at no cost to you. [Learn more about this offer here](https://azure.microsoft.com/offers/ms-azr-0144p/)

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment without having to first create a VM or publish a web application. [Learn more about Functions here](./functions-overview.md)

## Capabilities of Functions in Azure for Students Starter

In this offering, you have access to most of the features of the Azure Functions runtime, with several key limitations:

* The HTTP trigger is the only trigger type supported.
    * All input and all output bindings are supported! [See the full list here](functions-triggers-bindings.md)
* Languages Supported: 
    * C# (.NET Core 2)
    * Javascript (Node.js 8 & 10)
    * F# (.NET Core 2)
    * [See languages supported in higher plans here](supported-languages.md)
* Windows is the only supported operating system.
* Scale is restricted to [one free tier instance](https://azure.microsoft.com/pricing/details/app-service/windows/) running for up to 60 minutes each day. You will serverlessly scale from 0 to 1 instance automatically as HTTP traffic is received, but no further.
* [The 2.x runtime](functions-versions.md) is the only supported runtime.
* All developer tooling is supported for editing and publishing functions. This includes VS code, Visual studio, the Azure CLI, and the portal. If you'd like to use anything other than the portal, you will need to first create an app in the portal, and then choose that app as a deployment target in your prefered tool.

## Create an HTTP triggered hello world Function

 In this topic, learn how to use Functions to create a "hello world" function in the Azure portal.

![Create function app in the Azure portal](./media/functions-create-first-azure-function/function-app-in-portal-editor.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> C# developers should consider [creating your first function in Visual Studio 2017](functions-create-your-first-function-visual-studio.md) instead of in the portal. 

## Log in to Azure

Sign in to the Azure portal at <https://portal.azure.com> with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logic unit for easier management, deployment, and sharing of resources. 

1. Select the **New** button found on the upper left-hand corner of the Azure portal, then select **Compute** > **Function App**.

    ![Create a function app in the Azure portal](../../includes/media/functions-create-function-app-portal/function-app-create-flow.png)

2. Use the function app settings as specified in the table below the image.

    ![Define new function app settings](./media/functions-create-function-app-portal/function-app-create-flow2.png)

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z`, `0-9`, and `-`.  | 
    | **Subscription** | Your subscription | The subscription under which this new function app is created. | 
    | **[Resource Group](../articles/azure-resource-manager/resource-group-overview.md)** |  myResourceGroup | Name for the new resource group in which to create your function app. |
    | **OS** | Windows | Serverless hosting is currently only available when running on Windows. For Linux hosting, see [Create your first function running on Linux using the Azure CLI](../articles/azure-functions/functions-create-first-azure-function-azure-cli-linux.md). |
    | **[Hosting plan](../articles/azure-functions/functions-scale.md)** | Consumption plan | Hosting plan that defines how resources are allocated to your function app. In the default **Consumption Plan**, resources are added dynamically as required by your functions. In this [serverless](https://azure.microsoft.com/overview/serverless-computing/) hosting, you only pay for the time your functions run. When you run in an App Service plan, you must manage the [scaling of your function app](../articles/azure-functions/functions-scale.md).  |
    | **Location** | West Europe | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access. |
    | **Runtime stack** | Preferred language | Choose a runtime that supports your favorite function programming language. Choose **.NET** for C# and F# functions. |
    | **[Storage](../articles/storage/common/storage-quickstart-create-account.md)** |  Globally unique name |  Create a storage account used by your function app. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. You can also use an existing account, which must meets the [storage account requirements](../articles/azure-functions/functions-scale.md#storage-account-requirements). |
    | **[Application Insights](../articles/azure-functions/functions-monitoring.md)** | Default | Application Insights is enabled by default. Choose a location near your function app.  |

3. Select **Create** to provision and deploy the function app.

4. Select the Notification icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

    ![Define new function app settings](./media/functions-create-function-app-portal/function-app-create-notification.png)

5. Select **Go to resource** to view your new function app.

> [!TIP]
> Having trouble finding your function apps in the portal, try [adding Function Apps to your favorites in the Azure portal](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#favorite).
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
