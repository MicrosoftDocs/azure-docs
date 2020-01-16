---
title: Create your first function in Azure using Visual Studio Code
description: Create and publish to Azure a simple HTTP triggered function by using Azure Functions extension in Visual Studio Code. 
ms.topic: quickstart
ms.date: 01/10/2020
ms.custom: mvc, devcenter
zone_pivot_groups: programming-languages-set-functions
---

# Create your first function using Visual Studio Code

In this quickstart, you use Microsoft Visual Studio Code to create and test a "hello world" function on your local computer. You then use Visual Studio Code to create Azure resources and publish your function code to those Azure resources. You can also [create and publish functions from the Terminal or command prompt](functions-create-first-azure-function-azure-cli.md).

Azure Functions lets you execute your code in a [serverless](https://azure.microsoft.com/solutions/serverless/) environment without having to first create a VM or publish a web application. To learn more, see the [Azure Functions overview](functions-overview.md).

The steps in this article and the article that follows support the following languages:

+ [C#](/azure/azure-functions/functions-create-first-function-vs-code?tabs=csharp)
+ [JavaScript](/azure/azure-functions/functions-create-first-function-vs-code?tabs=nodejs)
+ [Python](/azure/azure-functions/functions-create-first-function-vs-code?tabs=python)

## Prerequisites

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms). 

::: zone pivot="programming-language-csharp"

+ The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) for Visual Studio Code.

::: zone-end

::: zone pivot="programming-language-javascript"

+ [Node.js](https://nodejs.org/), Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).

::: zone-end

::: zone pivot="programming-language-python"
    
+ [Python 3.7](https://www.python.org/downloads/release/python-375/) or [Python 3.6](https://www.python.org/downloads/release/python-368/), which as supported by Azure Functions. Python 3.8 isn't yet supported. 

+ The [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for Visual Studio Code.

::: zone-end

::: zone pivot="programming-language-powershell"

+ [PowerShell Core](/powershell/scripting/install/installing-powershell-core-on-windows)

+ The [PowerShell extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell).

::: zone-end

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. This extension currently lets you create functions in C#, JavaScript, Java, PowerShell, Python, and TypesScript. It also installs the [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account). If not already installed, the extension also installs the [Azure Functions Core Tools](functions-run-local.md#v2). The extension is currently in preview. To learn more, see the [Azure Functions extension for Visual Studio Code] extension page.

+ An [Azure account](../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing) with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

[!INCLUDE [functions-create-function-app-vs-code](../../includes/functions-create-function-app-vs-code.md)]

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

1. Copy the URL of the HTTP trigger from the **Output** panel. This URL includes the function key, which is passed to the `code` query parameter. Again, add the `name` query string, this time as `&name=<yourname>`, to the end of this URL and execute the request.

    The URL that calls your HTTP-triggered function should be in the following format:

        http://<functionappname>.azurewebsites.net/api/<functionname>?code=<function_key>&name=<yourname> 

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
