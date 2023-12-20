---
title: Create a PowerShell function from the command line - Azure Functions
description: Learn how to create a PowerShell function from the command line, then publish the local project to serverless hosting in Azure Functions.
ms.date: 11/03/2020
ms.topic: quickstart
ms.devlang: powershell
ms.custom: devx-track-powershell, devx-track-azurecli, devx-track-azurepowershell, mode-api
---

# Quickstart: Create a PowerShell function in Azure from the command line

[!INCLUDE [functions-language-selector-quickstart-cli](../../includes/functions-language-selector-quickstart-cli.md)]

In this article, you use command-line tools to create a PowerShell function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There is also a [Visual Studio Code-based version](create-first-function-vs-code-powershell.md) of this article.

## Configure your local environment

Before you begin, you must have the following:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ One of the following tools for creating Azure resources:

    + The Azure [Az PowerShell module](/powershell/azure/install-azure-powershell) version 9.4.0 or later.

    + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

+ The [.NET 6.0 SDK](https://dotnet.microsoft.com/download)

+ [PowerShell 7.2](/powershell/scripting/install/installing-powershell-core-on-windows)

[!INCLUDE [functions-install-core-tools](../../includes/functions-install-core-tools.md)]

## Create a local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:

    ```console
    func init LocalFunctionProj --powershell
    ```

1. Navigate into the project folder:

    ```console
    cd LocalFunctionProj
    ```

    This folder contains various files for the project, including configurations files named [local.settings.json](functions-develop-local.md#local-settings-file) and [host.json](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```

    `func new` creates a subfolder matching the function name that contains a code file appropriate to the project's chosen language and a configuration file named *function.json*.

### (Optional) Examine the file contents

If desired, you can skip to [Run the function locally](#run-the-function-locally) and examine the file contents later.

#### run.ps1

*run.ps1* defines a function script that's triggered according to the configuration in *function.json*.

:::code language="powershell" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-PowerShell/run.ps1":::

For an HTTP trigger, the function receives request data passed to the `$Request` param defined in *function.json*. The return object, defined as `Response` in *function.json*, is passed to the `Push-OutputBinding` cmdlet as the response.

#### function.json

*function.json* is a configuration file that defines the input and output `bindings` for the function, including the trigger type.

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-PowerShell/function.json":::

Each binding requires a direction, a type, and a unique name. The HTTP trigger has an input binding of type [`httpTrigger`](functions-bindings-http-webhook-trigger.md) and output binding of type [`http`](functions-bindings-http-webhook-output.md).

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

[!INCLUDE [functions-create-azure-resources-cli](../../includes/functions-create-azure-resources-cli.md)]

4. Create the function app in Azure:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location <REGION> --runtime powershell --functions-version 4 --name <APP_NAME> --storage-account <STORAGE_NAME>
    ```

    The [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command creates the function app in Azure.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccount <STORAGE_NAME> -Runtime PowerShell -FunctionsVersion 4 -Location '<REGION>'
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

[Connect to an Azure Storage queue]: functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-powershell
