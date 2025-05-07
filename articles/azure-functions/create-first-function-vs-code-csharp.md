---
title: "Create a C# function using Visual Studio Code - Azure Functions"
description: "Learn how to create a C# function, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code. "
ms.topic: quickstart
ms.date: 06/03/2024
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-ui, vscode-azure-extension-update-complete, ai-video-demo
ai-usage: ai-assisted
---

# Quickstart: Create a C# function in Azure using Visual Studio Code

This article creates an HTTP triggered function that runs on .NET 8 in an isolated worker process. For information about .NET versions supported for C# functions, see [Supported versions](dotnet-isolated-process-guide.md#supported-versions).

There's also a [CLI-based version](create-first-function-cli-csharp.md) of this article.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

This video shows you how to create a C# function in Azure using VS Code.
> [!VIDEO be75e388-1b74-4051-8a62-132b069a3ec9]

The steps in the video are also described in the following sections.

## Configure your environment

Before you get started, make sure you have the following requirements in place:

[!INCLUDE [functions-requirements-visual-studio-code-csharp](../../includes/functions-requirements-visual-studio-code-csharp.md)]

[!INCLUDE [functions-install-core-tools-vs-code](../../includes/functions-install-core-tools-vs-code.md)]

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in C#. Later in this article, you'll publish your function code to Azure.

1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette and search for and run the command `Azure Functions: Create New Project...`.

1. Select the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.
 
1. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `C#`.|
    | **Select a .NET runtime** | Choose `.NET 8.0 Isolated (LTS)`.|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.<sup>1</sup>|
    |**Provide a function name**|Type `HttpExample`.|
    |**Provide a namespace** | Type `My.Functions`. |
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth).|
    |**Select how you would like to open your project**|Select `Open in current window`.|

    <sup>1</sup> Depending on your VS Code settings, you may need to use the `Change template filter` option to see the full list of templates.

1. Visual Studio Code uses the provided information and generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. For more information about the files that are created, see [Generated project files](functions-develop-vs-code.md?tabs=csharp#generated-project-files).

[!INCLUDE [functions-run-function-test-local-vs-code-csharp](../../includes/functions-run-function-test-local-vs-code-csharp.md)]

After checking that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=csharp) to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by connecting to one of the core Azure storage services. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=csharp).

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-csharp&tabs=isolated-process)
> [!div class="nextstepaction"]
> [Connect to Azure Queue Storage](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-csharp&tabs=isolated-process)


