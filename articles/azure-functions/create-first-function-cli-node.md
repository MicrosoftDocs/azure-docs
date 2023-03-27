---
title: Create a JavaScript function from the command line - Azure Functions
description: Learn how to create a JavaScript function from the command line, then publish the local Node.js project to serverless hosting in Azure Functions.
ms.date: 03/08/2023
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-azurecli, devx-track-azurepowershell, mode-api
zone_pivot_groups: functions-nodejs-model
---

# Quickstart: Create a JavaScript function in Azure from the command line

In this article, you use command-line tools to create a JavaScript function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

[!INCLUDE [functions-nodejs-model-pivot-description](../../includes/functions-nodejs-model-pivot-description.md)]

Note that completion will incur a small cost of a few USD cents or less in your Azure account.

There is also a [Visual Studio Code-based version](create-first-function-vs-code-node.md) of this article.

## Configure your local environment

Before you begin, you must have the following:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

::: zone pivot="nodejs-model-v3" 
+ The [Azure Functions Core Tools](./functions-run-local.md#v2) version 4.x.
::: zone-end

::: zone pivot="nodejs-model-v4" 
+ The [Azure Functions Core Tools](./functions-run-local.md#v2) version v4.0.5095 or above
::: zone-end

+ One of the following tools for creating Azure resources:

    + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

    + The Azure [Az PowerShell module](/powershell/azure/install-az-ps) version 5.9.0 or later.

::: zone pivot="nodejs-model-v3" 
+ [Node.js](https://nodejs.org/) version 18 or 16. 
::: zone-end

::: zone pivot="nodejs-model-v4" 
+ [Node.js](https://nodejs.org/) version 18 or above. 
::: zone-end

### Prerequisite check

Verify your prerequisites, which depend on whether you are using Azure CLI or Azure PowerShell for creating Azure resources:

# [Azure CLI](#tab/azure-cli)

::: zone pivot="nodejs-model-v3" 
+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 4.x.
::: zone-end

::: zone pivot="nodejs-model-v4" 
+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version v4.0.5095 or above.
::: zone-end

+ Run `az --version` to check that the Azure CLI version is 2.4 or later.

+ Run `az login` to sign in to Azure and verify an active subscription.

# [Azure PowerShell](#tab/azure-powershell)

::: zone pivot="nodejs-model-v3" 
+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 4.x.
::: zone-end

::: zone pivot="nodejs-model-v4" 
+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version v4.0.5095 or above.
::: zone-end

+ Run `(Get-Module -ListAvailable Az).Version` and verify version 5.0 or later.

+ Run `Connect-AzAccount` to sign in to Azure and verify an active subscription.

---

## Create a local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

::: zone pivot="nodejs-model-v3" 
1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:

    ```console
    func init LocalFunctionProj --javascript
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

You may find the [Azure Functions Core Tools reference](functions-core-tools-reference.md) helpful.

### (Optional) Examine the file contents

If desired, you can skip to [Run the function locally](#run-the-function-locally) and examine the file contents later.

#### index.js

*index.js* exports a function that's triggered according to the configuration in *function.json*.

:::code language="javascript" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-JavaScript/index.js":::

For an HTTP trigger, the function receives request data in the variable `req` as defined in *function.json*. The response is defined as `res` in *function.json* and can be accessed using `context.res`. To learn more, see [Azure Functions HTTP triggers and bindings](./functions-bindings-http-webhook.md?tabs=javascript).

#### function.json

*function.json* is a configuration file that defines the input and output `bindings` for the function, including the trigger type.

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-JavaScript/function.json":::

Each binding requires a direction, a type, and a unique name. The HTTP trigger has an input binding of type [`httpTrigger`](functions-bindings-http-webhook-trigger.md) and output binding of type [`http`](functions-bindings-http-webhook-output.md).

::: zone-end

::: zone pivot="nodejs-model-v4" 
1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj*:

    ```console
    func init LocalFunctionProj --model V4
    ```
    You are then prompted to choose a worker runtime and a language - choose Node for the first and JavaScript for the second.

2. Navigate into the project folder:

    ```console
    cd LocalFunctionProj
    ```

    This folder contains various files for the project, including configurations files named *local.settings.json* and *host.json*. Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

3. Add a function to your project by using the following command:

    ```console
    func new
    ```

    Choose the template for "HTTP trigger". You can keep the default name (*httpTrigger*) or give it a new name (*HttpExample*). Your function name must be unique, or you'll be asked to confirm if your intention is to replace an existing function. 

    You can find the function you added in the *src/functions* directory. 

4. Add Azure Storage connection information in *local.settings.json*. 
    ```json
    {
        "Values": {       
            "AzureWebJobsStorage": "<Azure Storage connection information>",
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "AzureWebJobsFeatureFlags": "EnableWorkerIndexing"
        }
    }
    ```

5. (Optional) If you want to learn more about a particular function, say HTTP trigger, you can run the following command:

    ```console
    func help httptrigger
    ```
::: zone-end 

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

[!INCLUDE [functions-create-azure-resources-cli](../../includes/functions-create-azure-resources-cli.md)]

4. Create the function app in Azure:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location <REGION> --runtime node --runtime-version 18 --functions-version 4 --name <APP_NAME> --storage-account <STORAGE_NAME>
    ```

    The [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command creates the function app in Azure. It is recommended that you use the latest version of Node.js, which is currently 18. You can specify the version by setting `--runtime-version` to `18`.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccount <STORAGE_NAME> -Runtime node -RuntimeVersion 18 -FunctionsVersion 4 -Location <REGION>
    ```

    The [New-AzFunctionApp](/powershell/module/az.functions/new-azfunctionapp) cmdlet creates the function app in Azure. It is recommended that you use the latest version of Node.js, which is currently 18. You can specify the version by setting `--runtime-version` to `18`.

    ---

    In the previous example, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, and replace `<APP_NAME>` with a globally unique name appropriate to you. The `<APP_NAME>` is also the default DNS domain for the function app.

    This command creates a function app running in your specified language runtime under the [Azure Functions Consumption Plan](consumption-plan.md), which is free for the amount of usage you incur here. The command also provisions an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

::: zone pivot="nodejs-model-v4" 
## Update app settings

To enable your V4 programming model app to run in Azure, you need to add a new application setting named `AzureWebJobsFeatureFlags` with a value of `EnableWorkerIndexing`. This setting is already in your local.settings.json file. 

Run the following command to add this setting to your new function app in Azure. Replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively.

# [Azure CLI](#tab/azure-cli)

```azurecli 
az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings AzureWebJobsFeatureFlags=EnableWorkerIndexing
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"AzureWebJobsFeatureFlags" = "EnableWorkerIndexing"}
```

---
::: zone-end

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]

[!INCLUDE [functions-streaming-logs-cli-qs](../../includes/functions-streaming-logs-cli-qs.md)]

[!INCLUDE [functions-cleanup-resources-cli](../../includes/functions-cleanup-resources-cli.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-javascript)
