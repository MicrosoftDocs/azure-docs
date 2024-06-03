---
title: Create your first function in the Azure portal
description: Learn how to create your first Azure Function for serverless execution using the Azure portal.
ms.topic: how-to
ms.date: 01/31/2024
ms.custom: devx-track-csharp, mvc, devcenter, cc996988-fb4f-47, devdivchpfy22, devx-track-extended-java, devx-track-js, devx-track-python, build-2024
zone_pivot_groups: programming-languages-set-functions
---

# Create your first function in the Azure portal

Azure Functions lets you run your code in a serverless environment without having to first create a virtual machine (VM) or publish a web application. In this article, you learn how to use Azure Functions to create a "hello world" HTTP trigger function in the Azure portal. 

Choose your preferred programming language at the top of the article.

::: zone pivot="programming-language-csharp"  
>[!NOTE]
>Editing your C# function code in the Azure portal is currently only supported for [C# script (.csx) functions](functions-reference-csharp.md). To learn more about the limitations on editing function code in the Azure portal, see [Development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal). 
>
> You should instead [develop your functions locally](functions-develop-local.md) and publish to a function app in Azure. Use one of the following links to get started with your chosen local development environment:
>+ [Visual Studio](functions-create-your-first-function-visual-studio.md)
>+ [Visual Studio Code](./create-first-function-vs-code-csharp.md)
>+ [Terminal/command prompt](./create-first-function-cli-csharp.md)
::: zone-end  
::: zone pivot="programming-language-java" 
>[!NOTE]
>Editing your Java function code in the Azure portal isn't currently supported. For more information, see [Development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal). 
> 
> You should instead [develop your functions locally](functions-develop-local.md) and publish to a function app in Azure. Use one of the following links to get started with your chosen local development environment:
>+ [Eclipse](functions-create-maven-eclipse.md)
>+ [Gradle](functions-create-first-java-gradle.md)
>+ [IntelliJ IDEA](functions-create-maven-intellij.md) 
>+ [Maven](create-first-function-cli-java.md)
>+ [Quarkus](functions-create-first-quarkus.md)
>+ [Spring Cloud](/azure/developer/java/spring-framework/getting-started-with-spring-cloud-function-in-azure?toc=/azure/azure-functions/toc.json)
>+ [Visual Studio Code](create-first-function-vs-code-java.md) 
::: zone-end  
::: zone pivot="programming-language-javascript"
>[!NOTE]
>Because of [development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal), you should instead [develop your functions locally](functions-develop-local.md) and publish to a function app in Azure. Use one of the following links to get started with your chosen local development environment:
>+ [Visual Studio Code](./create-first-function-vs-code-node.md)
>+ [Terminal/command prompt](./create-first-function-cli-node.md)
::: zone-end   
::: zone pivot="programming-language-typescript"  
>[!NOTE]
>Editing your TypeScript function code in the Azure portal isn't currently supported. For more information, see [Development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal). 
> 
> You should instead [develop your functions locally](functions-develop-local.md) and publish to a function app in Azure. Use one of the following links to get started with your chosen local development environment:
>+ [Visual Studio Code](./create-first-function-vs-code-typescript.md)
>+ [Terminal/command prompt](./create-first-function-cli-typescript.md)
::: zone-end  
::: zone pivot="programming-language-powershell"  
>[!NOTE]
>Because of [development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal), you should instead [develop your functions locally](functions-develop-local.md) and publish to a function app in Azure. Use one of the following links to get started with your chosen local development environment:
>+ [Visual Studio Code](./create-first-function-vs-code-powershell.md)
>+ [Terminal/command prompt](./create-first-function-cli-powershell.md)
::: zone-end 
::: zone pivot="programming-language-python"  
>[!NOTE]
>Developing Python functions in the Azure portal is currently only supported when running in a [Consumption plan](./consumption-plan.md). For more information, see [Development limitations in the Azure portal](functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal).
>
> You should instead [develop your functions locally](functions-develop-local.md) and publish to a function app in Azure. Use one of the following links to get started with your chosen local development environment:
>+ [Visual Studio Code](./create-first-function-vs-code-python.md)
>+ [Terminal/command prompt](./create-first-function-cli-python.md)
::: zone-end 

Please review the [known issues](./recover-python-functions.md#development-issues-in-the-azure-portal) for development of Azure Functions using Python in the Azure portal.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a function app

You must have a function app to host the execution of your functions. A function app lets you group functions as a logical unit for easier management, deployment, scaling, and sharing of resources. 

Use these steps to create your function app and related Azure resources, whether or not you're able to edit your code in the Azure portal. 
::: zone pivot="programming-language-csharp" 
To be able to create a C# script app that you can edit in the portal, you must choose **6 (LTS)** for .NET **Version**.
::: zone-end

[!INCLUDE [Create function app Azure portal](../../includes/functions-create-function-app-portal.md)]

Next, create a function in the new function app.

::: zone pivot="programming-language-python,programming-language-javascript,programming-language-powershell,programming-language-csharp"  
## <a name="create-function"></a>Create an HTTP trigger function

1. In your function app, select **Overview**, and then select **+ Create** under **Functions**. If you don't see the **+ Create** button, you can instead [create your functions locally](#create-your-functions-locally).

1. Under **Select a template**, scroll down and choose the **HTTP trigger** template.

1. In **Template details**, use `HttpExample` for **New Function**, select **Anonymous** from the **[Authorization level](functions-bindings-http-webhook-trigger.md#authorization-keys)** drop-down list, and then select **Create**.

    Azure creates the HTTP trigger function. Now, you can run the new function by sending an HTTP request.
::: zone-end  
::: zone pivot="programming-language-java,programming-language-csharp,programming-language-typescript,programming-language-python" 
## Create your functions locally

If you aren't able to create your function code in the portal, you can instead create a local project and publish the function code to your new function app.

1. In your function app, select **Overview**, and then in **Create functions in your preferred environment** under **Functions**.

1. Choose your preferred local development environment and follow the steps in the linked article to create and publish your first Azure Functions project. 

    >[!TIP]
    >When publishing your new project, make sure to use the function app and related resources you just created. 
::: zone-end  
## Test the function

[!INCLUDE [functions-test-function-portal](../../includes/functions-test-function-portal.md)]

## Clean up resources

[!INCLUDE [Clean-up resources](../../includes/functions-quickstart-cleanup.md)]

## Next steps

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps.md)]
