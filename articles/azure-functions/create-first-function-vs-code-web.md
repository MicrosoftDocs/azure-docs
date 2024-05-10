---
title: Create your first function using Visual Studio Code for the Web
description: Learn how to create your first Flex Consumption hosted function using Visual Studio Code for the Web in the Azure portal.
ms.topic: quickstart
ms.date: 05/06/2024
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
>Visual Studio Code for the Web in the Azure portal is currently only supported for Node.js, PowerShell, and Python apps hosted in the Flex Consumption plan, which is currently in preview. You can instead download a starter code project from the portal, develop your code locally, and then [deploy to your Flex Consumption plan app](./flex-consumption-how-to.md#deploy-your-code-project). 
::: zone-end

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions in the Flex Consumption plan. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources. 

Use these steps to create your function app and related Azure resources. 

[!INCLUDE [functions-create-flex-consumption-app-portal](../../includes/functions-create-flex-consumption-app-portal.md)]
::: zone pivot="programming-language-csharp,programming-language-java"

At this point, under **Create functions in your preferred environment** select your choice of local development environments. This link takes you to one of these quickstart articles, the first part of which tells you how to create a code project with an HTTP triggered function:
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ [Create an Azure Functions project from the command line](create-first-function-cli-csharp.md)  
+ [Create an Azure Functions project using Visual Studio](./functions-create-your-first-function-visual-studio.md)  
+ [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-csharp.md) 
::: zone-end  
::: zone pivot="programming-language-java" 
+ [Create an Azure Functions project from the command line](create-first-function-cli-java.md)  
+ [Create an Azure Functions project using Visual Studio Code](create-first-function-vs-code-java.md)
::: zone-end
::: zone pivot="programming-language-python,programming-language-javascript,programming-language-powershell,programming-language-typescript"
Next, create a function in the new function app in the portal using Visual Studio Code for Web.

## Create an HTTP trigger function

1. In the Overview page of your function app under **Create functions in your preferred environment** select **Create with VS Code for the Web**. This takes you to the Visual Studio Code for the Web editor.

1. Under **Select a template**, scroll down and choose the **HTTP trigger** template.

1. In **Template details**, use `HttpExample` for **New Function**, select **Anonymous** from the **[Authorization level](functions-bindings-http-webhook-trigger.md#authorization-keys)** drop-down list, and then select **Create**.

    Azure creates the HTTP trigger function. Now, you can run the new function by sending an HTTP request.

::: zone-end  
## Test the function

[!INCLUDE [functions-test-function-portal](../../includes/functions-test-function-portal.md)]

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
