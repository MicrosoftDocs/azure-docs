---
title: Create a C# function from the command line - Azure Functions
description: Learn how to create a C# function from the command line, then publish the local project to serverless hosting in Azure Functions.
ms.date: 10/03/2020
ms.topic: quickstart
ms.custom: [devx-track-csharp, devx-track-azurecli, devx-track-azurepowershell]
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./create-first-function-cli-csharp-ieux
---

# Quickstart: Create a C# function in Azure from the command line

[!INCLUDE [functions-language-selector-quickstart-cli](../../includes/functions-language-selector-quickstart-cli.md)]

In this article, you use command-line tools to create a C# class library-based function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There is also a [Visual Studio Code-based version](create-first-function-vs-code-csharp.md) of this article.

## Configure your local environment

Before you begin, you must have the following:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [.NET Core SDK 3.1](https://www.microsoft.com/net/download)

+ The [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.

+ One of the following tools for creating Azure resources:

    + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

    + [Azure PowerShell](/powershell/azure/install-az-ps) version 5.0 or later.

### Prerequisite check

Verify your prerequisites, which depend on whether you are using Azure CLI or Azure PowerShell for creating Azure resources:

# [Azure CLI](#tab/azure-cli)

+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 3.x.

+ Run `az --version` to check that the Azure CLI version is 2.4 or later.

+ Run `az login` to sign in to Azure and verify an active subscription.

+ Run `dotnet --list-sdks` to check that .NET Core SDK version 3.1.x is installed

# [Azure PowerShell](#tab/azure-powershell)

+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 3.x.

+ Run `(Get-Module -ListAvailable Az).Version` and verify version 5.0 or later. 

+ Run `Connect-AzAccount` to sign in to Azure and verify an active subscription.

+ Run `dotnet --list-sdks` to check that .NET Core SDK version 3.1.x is installed

---

## Create a local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:  

    ```csharp
    func init LocalFunctionProj --dotnet
    ```

1. Navigate into the project folder:

    ```console
    cd LocalFunctionProj
    ```

    This folder contains various files for the project, including configurations files named [local.settings.json](functions-run-local.md#local-settings-file) and [host.json](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ``` 

    `func new` creates a HttpExample.cs code file.

### (Optional) Examine the file contents

If desired, you can skip to [Run the function locally](#run-the-function-locally) and examine the file contents later.

#### HttpExample.cs

*HttpExample.cs* contains a `Run` method that receives request data in the `req` variable is an [HttpRequest](/dotnet/api/microsoft.aspnetcore.http.httprequest) that's decorated with the **HttpTriggerAttribute**, which defines the trigger behavior.

:::code language="csharp" source="~/functions-docs-csharp/http-trigger-template/HttpExample.cs":::

The return object is an [ActionResult](/dotnet/api/microsoft.aspnetcore.mvc.actionresult) that returns a response message as either an [OkObjectResult](/dotnet/api/microsoft.aspnetcore.mvc.okobjectresult) (200) or a [BadRequestObjectResult](/dotnet/api/microsoft.aspnetcore.mvc.badrequestobjectresult) (400). To learn more, see [Azure Functions HTTP triggers and bindings](./functions-bindings-http-webhook.md?tabs=csharp).

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

[!INCLUDE [functions-create-azure-resources-cli](../../includes/functions-create-azure-resources-cli.md)]

4. Create the function app in Azure:

    # [Azure CLI](#tab/azure-cli)
        
    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location westeurope --runtime dotnet --functions-version 3 --name <APP_NAME> --storage-account <STORAGE_NAME>
    ```
    
    The [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command creates the function app in Azure. 
    
    # [Azure PowerShell](#tab/azure-powershell)
    
    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccount <STORAGE_NAME> -Runtime dotnet -FunctionsVersion 3 -Location 'West Europe'
    ```
    
    The [New-AzFunctionApp](/powershell/module/az.functions/new-azfunctionapp) cmdlet creates the function app in Azure. 
    
    ---
    
    In the previous example, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, and replace `<APP_NAME>` with a globally unique name appropriate to you. The `<APP_NAME>` is also the default DNS domain for the function app. 
    
    This command creates a function app running in your specified language runtime under the [Azure Functions Consumption Plan](consumption-plan.md), which is free for the amount of usage you incur here. The command also provisions an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]

[!INCLUDE [functions-streaming-logs-cli-qs](../../includes/functions-streaming-logs-cli-qs.md)]

[!INCLUDE [functions-cleanup-resources-cli](../../includes/functions-cleanup-resources-cli.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue]

[Connect to an Azure Storage queue]: functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-csharp
