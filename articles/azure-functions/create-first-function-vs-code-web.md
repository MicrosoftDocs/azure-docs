---
title: Create your first function using Visual Studio Code for the Web
description: Learn how to create your first Flex Consumption hosted function using Visual Studio Code for the Web in the Azure portal.
ms.topic: quickstart
ms.date: 05/14/2024
zone_pivot_groups: programming-languages-set-functions

#customer intent: As an Azure developer, I want learn how to use Visual Studio Code for the Web to create functios that run in the Flex Consumption plan so that I can develop my function code directly in the Azure portal.
---

# Create your first function using Visual Studio Code for the Web

This quickstart creates an HTTP triggered function using Visual Studio Code for the Web in the Azure portal. The function app that hosts your code runs in the Flex Consumption hosting plan in Azure Functions.
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-typescript,programming-language-python"   
[!INCLUDE [functions-flex-preview-note](../../includes/functions-flex-preview-note.md)]
::: zone-end  
::: zone pivot="programming-language-java,programming-language-csharp" 
>[!IMPORTANT]
>Visual Studio Code for the Web in the Azure portal is currently only supported for Node.js, PowerShell, and Python apps hosted in the Flex Consumption plan, which is currently in preview. For C# and Java apps, you should instead complete [Create a Flex Consumption app](flex-consumption-how-to.md#create-a-flex-consumption-app). 
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-typescript,programming-language-python"  
## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions in the Flex Consumption plan. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources. 

Use these steps to create your function app and related Azure resources. 

[!INCLUDE [functions-create-flex-consumption-app-portal](../../includes/functions-create-flex-consumption-app-portal.md)]

6. Select **Review + create** to review the app configuration you chose, and then select **Create** to provision and deploy the function app.

7. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

8. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

Next, create a function in the new function app in the portal using Visual Studio Code for Web.

## Create an HTTP trigger function

1. In the Overview page of your function app under **Create functions in your preferred environment** select **Create with VS Code for the Web**. This takes you to the Visual Studio Code for the Web editor.

1. Under **Select a template**, scroll down and choose the **HTTP trigger** template.

1. In **Template details**, use `HttpExample` for **New Function**, select **Anonymous** from the **[Authorization level](functions-bindings-http-webhook-trigger.md#authorization-keys)** drop-down list, and then select **Create**.

    Azure creates the HTTP trigger function. Now, you can run the new function by sending an HTTP request.

## Test the function

[!INCLUDE [functions-test-function-portal](../../includes/functions-test-function-portal.md)]

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]

::: zone-end
