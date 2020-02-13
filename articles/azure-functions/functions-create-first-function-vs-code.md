---
title: Create your first function in Azure using Visual Studio Code
description: Create and publish to Azure a simple HTTP triggered function by using Azure Functions extension in Visual Studio Code. 
ms.topic: quickstart
ms.date: 01/10/2020
ms.custom: mvc, devcenter
zone_pivot_groups: programming-languages-set-functions
---

# Quickstart: Create an Azure Functions project using Visual Studio Code

In this article, you use Visual Studio Code to create a function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions. Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account. 

There is also a [CLI-based version](functions-create-first-azure-function-azure-cli.md) of this article.

## Prerequisites

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms). 
::: zone pivot="programming-language-csharp"
+ The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) for Visual Studio Code.
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
+ [Node.js](https://nodejs.org/), Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
::: zone-end
::: zone pivot="programming-language-python"
+ [Python 3.7](https://www.python.org/downloads/release/python-375/) or [Python 3.6](https://www.python.org/downloads/release/python-368/), which as supported by Azure Functions. Python 3.8 isn't yet supported. 

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.
::: zone-end
::: zone pivot="programming-language-powershell"
+ [PowerShell Core](/powershell/scripting/install/installing-powershell-core-on-windows)

+ The [.NET Core SDK 2.2+](https://www.microsoft.com/net/download)

+ The [PowerShell extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell). 
::: zone-end

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. 

+ An [Azure account](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing) with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## <a name="create-an-azure-functions-project"></a>Create your local project 

In this section, you use Visual Studio Code to create a local Azure Functions project in your chosen language. Later in this article, you'll publish your function code to Azure. 

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    ::: zone pivot="programming-language-csharp"

    | Prompt | Value | 
    | ------ | ----- | 
    | Select a language for your function project | C# |
    | Select a version | Azure Functions v2 | 
    | Select a template for your project's first function | HTTP trigger | 
    | Provide a function name | HttpExample | 
    | Provide a namespace | My.Functions | 
    | Authorization level | Anonymous | 
    | Select how you would like to open your project | Add to workspace |

    ::: zone-end

    ::: zone pivot="programming-language-javascript"

    | Prompt | Value | 
    | ------ | ----- | 
    | Select a language for your function project | JavaScript | 
    | Select a version | Azure Functions v2 | 
    | Select a template for your project's first function | HTTP trigger | 
    | Provide a function name | HttpExample | 
    | Authorization level | Anonymous | 
    | Select how you would like to open your project | Add to workspace |

    ::: zone-end

    ::: zone pivot="programming-language-typescript"

    | Prompt | Value | 
    | ------ | ----- | 
    | Select a language for your function project | TypeScript | 
    | Select a version | Azure Functions v2 | 
    | Select a template for your project's first function | HTTP trigger | 
    | Provide a function name | HttpExample | 
    | Authorization level | Anonymous | 
    | Select how you would like to open your project | Add to workspace |

    ::: zone-end

    ::: zone pivot="programming-language-powershell"

    | Prompt | Value | 
    | ------ | ----- | 
    | Select a language for your function project | PowerShell | 
    | Select a version | Azure Functions v2 | 
    | Select a template for your project's first function | HTTP trigger | 
    | Provide a function name | HttpExample | 
    | Authorization level | Anonymous | 
    | Select how you would like to open your project | Add to workspace |

    ::: zone-end

    ::: zone pivot="programming-language-python"

    | Prompt | Value | 
    | ------ | ----- | 
    | Select a language for your function project | Python | 
    | Select a version | Azure Functions v2 | 
    | Select a Python alias to create a virtual environment | Python alias | 
    | Select a template for your project's first function | HTTP trigger | 
    | Provide a function name | HttpExample | 
    | Authorization level | Anonymous | 
    | Select how you would like to open your project | Add to workspace | 

    ::: zone-end

1. Visual Studio Code does the following:

    + Creates an Azure Functions project in a new workspace, which contains the [host.json](functions-host-json.md) and [local.settings.json](functions-run-local.md#local-settings-file) configuration files. 

    ::: zone pivot="programming-language-csharp"

    + Creates an [HttpExample.cs class library file](functions-dotnet-class-library.md#functions-class-library-project) that implements the function.

    ::: zone-end
        
    ::: zone pivot="programming-language-javascript"
    
    + Creates a package.json file in the root folder.

    + Creates an HttpExample folder that contains the [function.json definition file](functions-reference-node.md#folder-structure) and the [index.js file](functions-reference-node.md#exporting-a-function), a Node.js file that contains the function code.
    
    ::: zone-end
    
    ::: zone pivot="programming-language-typescript"
    
    + Creates a package.json file and a tsconfig.json file in the root folder.

    + Creates an HttpExample folder that contains the [function.json definition file](functions-reference-node.md#folder-structure) and the [index.ts file](functions-reference-node.md#typescript), a TypeScript file that contains the function code.
    
    ::: zone-end
    
    ::: zone pivot="programming-language-powershell"
    
    + Creates an HttpExample folder that contains the [function.json definition file](functions-reference-python.md#programming-model) and the run.ps1 file, which contains the function code.
    
    ::: zone-end
    
    ::: zone pivot="programming-language-python"
    
    + Creates a project-level requirements.txt file that lists packages required by Functions.
    
    + Creates an HttpExample folder that contains the [function.json definition file](functions-reference-python.md#programming-model) and the \_\_init\_\_.py file, which contains the function code.
    
    ::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-python"

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

::: zone-end

::: zone pivot="programming-language-powershell"

[!INCLUDE [functions-run-function-test-local-vs-code-ps](../../includes/functions-run-function-test-local-vs-code-ps.md)]

::: zone-end

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure. 

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

[!INCLUDE [functions-publish-project-vscode](../../includes/functions-publish-project-vscode.md)]

## Run the function in Azure

1. Copy the URL of the HTTP trigger from the **Output** panel. Again, add the `name` query string as `?name=<yourname>` to the end of this URL and execute the request.

    The URL that calls your HTTP-triggered function should be in the following format:

        http://<functionappname>.azurewebsites.net/api/httpexample?name=<yourname> 

1. Paste this new URL for the HTTP request into your browser's address bar. The following example shows the response in the browser to the remote GET request returned by the function: 

    ![Function response in the browser](./media/functions-create-first-function-vs-code/functions-test-remote-browser.png)

## Clean up resources

When you continue to the next step, [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs-code.md), you'll need to keep all your resources in place to build on what you've already done.

Otherwise, you can use the following steps to delete the function app and its related resources to avoid incurring any further costs.

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

To learn more about Functions costs, see [Estimating Consumption plan costs](functions-consumption-costs.md).

## Next steps

You have used Visual Studio Code to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by adding an output binding. This binding writes the string from the HTTP request to a message in an Azure Queue Storage queue. 

> [!div class="nextstepaction"]
> [Add an Azure Storage queue binding to your function](functions-add-output-binding-storage-queue-vs-code.md)

[Azure Functions Core Tools]: functions-run-local.md
[Azure Functions extension for Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
