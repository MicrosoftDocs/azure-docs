---
title: Create a TypeScript function using Visual Studio Code - Azure Functions
description: Learn how to create a TypeScript function, then publish the local Node.js project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.
ms.topic: quickstart
ms.date: 06/03/2024
ms.devlang: typescript
ms.custom: mode-ui, vscode-azure-extension-update-complete, devx-track-js, devx-track-ts
zone_pivot_groups: functions-nodejs-model
---

# Quickstart: Create a function in Azure with TypeScript using Visual Studio Code

In this article, you use Visual Studio Code to create a TypeScript function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

[!INCLUDE [functions-nodejs-model-pivot-description](../../includes/functions-nodejs-model-pivot-description.md)]

Completion of this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-typescript.md) of this article.

## Configure your environment

Before you get started, make sure you have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

::: zone pivot="nodejs-model-v3" 
+ [Node.js 18.x](https://nodejs.org/en/about/previous-releases) or [Node.js 16.x](https://nodejs.org/en/about/previous-releases). Use the `node --version` command to check your version.  
::: zone-end
::: zone pivot="nodejs-model-v4" 
+ [Node.js 18.x](https://nodejs.org/en/about/previous-releases) or above. Use the `node --version` command to check your version.  

+ [TypeScript 4.x](https://www.typescriptlang.org/). Use the `tsc -v` command to check your version.
::: zone-end

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Azure Functions extension v1.10.4](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) or above for Visual Studio Code.

::: zone pivot="nodejs-model-v3" 
+ [Azure Functions Core Tools 4.x](functions-run-local.md#install-the-azure-functions-core-tools).
::: zone-end
::: zone pivot="nodejs-model-v4" 
+ [Azure Functions Core Tools v4.0.5382 or above](functions-run-local.md#install-the-azure-functions-core-tools).
::: zone-end

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions project in TypeScript. Later in this article, you publish your function code to Azure.
 
1. In Visual Studio Code, press <kbd>F1</kbd> to open the command palette and search for and run the command `Azure Functions: Create New Project...`.

2. Choose the directory location for your project workspace and choose **Select**. You should either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that is already part of a workspace.

::: zone pivot="nodejs-model-v3" 
3. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `TypeScript`.|
    |**Select a TypeScript programming model**|Choose `Model V3`|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Authorization level**|Choose `Anonymous`, which enables anyone to call your function endpoint. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth).|
    |**Select how you would like to open your project**|Choose `Open in current window`.|

    Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md?tabs=typescript#generated-project-files).
::: zone-end
::: zone pivot="nodejs-model-v4" 
3. Provide the following information at the prompts:

    |Prompt|Selection|
    |--|--|
    |**Select a language for your function project**|Choose `TypeScript`.|
    |**Select a TypeScript programming model**|Choose `Model V4`|
    |**Select a template for your project's first function**|Choose `HTTP trigger`.|
    |**Provide a function name**|Type `HttpExample`.|
    |**Select how you would like to open your project**|Choose `Open in current window`|

    Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Azure Functions TypeScript developer guide](functions-reference-node.md?tabs=typescript). 
::: zone-end

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## Create the function app in Azure

[!INCLUDE [functions-create-azure-resources-vs-code](../../includes/functions-create-azure-resources-vs-code.md)]

## Deploy the project to Azure

[!INCLUDE [functions-deploy-project-vs-code](../../includes/functions-deploy-project-vs-code.md)]

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used [Visual Studio Code](functions-develop-vs-code.md?tabs=javascript) to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by connecting to Azure Storage. To learn more about connecting to other Azure services, see [Add bindings to an existing function in Azure Functions](add-bindings-existing-function.md?tabs=typescript).   

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-typescript)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
