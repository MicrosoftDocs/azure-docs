---
title: Create a C# function using Visual Studio Code - Azure Functions
description: Learn how to create a C# function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code. 
ms.topic: quickstart
ms.date: 09/14/2021
ms.custom: devx-track-csharp
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./create-first-function-vs-code-csharp-ieux
zone_pivot_groups: runtime-version-programming-functions
---

# Quickstart: Create a C# function in Azure using Visual Studio Code

[!INCLUDE [functions-runtime-version-dotnet](../../includes/functions-runtime-version-dotnet.md)]

In this article, you use Visual Studio Code to create a C# function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

::: zone pivot="programming-runtime-functions-v3"
[!INCLUDE [functions-dotnet-execution-model](../../includes/functions-dotnet-execution-model.md)]    
::: zone-end
::: zone pivot="programming-runtime-functions-v4"
> [!NOTE]
> Currently, Visual Studio Code supports creating C# functions that run only on .NET 6 using the [in-process execution model](functions-dotnet-class-library.md).
::: zone-end

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-csharp.md) of this article.

## Configure your environment

Before you get started, make sure you have the following requirements in place:

::: zone pivot="programming-runtime-functions-v3"
# [In-process](#tab/in-process)

+ [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download)

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 3.x.

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.  

+ [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

# [Isolated process](#tab/isolated-process)

+ [.NET 5.0 SDK](https://dotnet.microsoft.com/download)

+ [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download). Required by the build process.

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 3.x.

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.  

+ [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

---
::: zone-end
::: zone pivot="programming-runtime-functions-v4"
+ [.NET 6.0 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 4.x.

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.  

+ [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.
::: zone-end

You also need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in C#. Later in this article, you'll publish your function code to Azure.

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    ::: zone pivot="programming-runtime-functions-v3"
    # [In-process](#tab/in-process) 

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `C#`.|
    | **Select a .NET runtime** | Choose `.NET Core 3.1 LTS`.|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Provide a namespace** | Type `My.Functions`. |
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).|
    |**Select how you would like to open your project**|Choose `Add to workspace`.|

    # [Isolated process](#tab/isolated-process)

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `C#`.|
    | **Select a .NET runtime** | Choose `.NET 5.0 Isolated`.|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Provide a namespace** | Type `My.Functions`. |
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).|
    |**Select how you would like to open your project**|Choose `Add to workspace`.|

    ---
    ::: zone-end
    ::: zone pivot="programming-runtime-functions-v4"
    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `C#`.|
    | **Select a .NET runtime** | Choose `.NET 6.0`.<sup>*</sup>|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Provide a namespace** | Type `My.Functions`. |
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).|
    |**Select how you would like to open your project**|Choose `Add to workspace`.|

    <sup>*</sup>If you don't see `.NET 6` as a runtime option, make sure you have installed version 4.x of the Azure Functions Core Tools.
    ::: zone-end
    
1. Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md#generated-project-files).

[!INCLUDE [functions-run-function-test-local-vs-code-csharp](../../includes/functions-run-function-test-local-vs-code-csharp.md)]

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=csharp) to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by connecting to either Azure Cosmos DB or Azure Queue Storage. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=csharp). 

::: zone pivot="programming-runtime-functions-v3"
# [In-process](#tab/in-process) 

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-csharp&tabs=in-process)
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-csharp&tabs=in-process)

# [Isolated process](#tab/isolated-process)

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-csharp&tabs=isolated-process)
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-csharp&tabs=isolated-process)

---
::: zone-end
::: zone pivot="programming-runtime-functions-v4"
> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-csharp&tabs=in-process)
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-csharp&tabs=in-process)
::: zone-end

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
