---
title: Create a Python function from the command line - Azure Functions
description: Learn how to create a Python function from the command line, then publish the local project to serverless hosting in Azure Functions.
ms.date: 02/29/2024
ms.topic: quickstart
ms.devlang: python
ms.custom: devx-track-python, devx-track-azurecli, devx-track-azurepowershell, mode-api, devdivchpfy22
---

# Quickstart: Create a Python function in Azure from the command line

In this article, you use command-line tools to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions. 

This article uses the Python v2 programming model for Azure Functions, which provides a decorator-based approach for creating functions. To learn more about the Python v2 programming model, see the [Developer Reference Guide](functions-reference-python.md?pivots=python-mode-decorators)

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [Visual Studio Code-based version](create-first-function-vs-code-python.md) of this article.

## Configure your local environment

Before you begin, you must have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ One of the following tools for creating Azure resources:

  + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

  + The Azure [Az PowerShell module](/powershell/azure/install-azure-powershell) version 5.9.0 or later.

+ [A Python version supported by Azure Functions](supported-languages.md#languages-by-runtime-version).

+ The [Azurite storage emulator](../storage/common/storage-use-azurite.md?tabs=npm#install-azurite). While you can also use an actual Azure Storage account, the article assumes you're using this emulator.

[!INCLUDE [functions-install-core-tools](../../includes/functions-install-core-tools.md)]

Use the `func --version` command to make sure your version of Core Tools is at least `4.0.5530`.

## <a name="create-venv"></a>Create and activate a virtual environment

In a suitable folder, run the following commands to create and activate a virtual environment named `.venv`. Make sure that you're using a [version of Python supported by Azure Functions](supported-languages.md?pivots=programming-language-python#languages-by-runtime-version).

### [bash](#tab/bash)

```bash
python -m venv .venv
```

```bash
source .venv/bin/activate
```

If Python didn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```

### [PowerShell](#tab/powershell)

```powershell
py -m venv .venv
```

```powershell
.venv\scripts\activate
```

### [Cmd](#tab/cmd)

```cmd
py -m venv .venv
```

```cmd
.venv\scripts\activate
```

---

You run all subsequent commands in this activated virtual environment.

## Create a local function

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. 
 
In this section, you create a function project and add an HTTP triggered function.

1. Run the [`func init`](functions-core-tools-reference.md#func-init) command as follows to create a Python v2 functions project in the virtual environment.

    ```console
    func init --python
    ```

    The environment now contains various files for the project, including configuration files named [*local.settings.json*](functions-develop-local.md#local-settings-file) and [*host.json*](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```

    If prompted, choose the **ANONYMOUS** option. [`func new`](functions-core-tools-reference.md#func-new) adds an HTTP trigger endpoint named `HttpExample` to the `function_app.py` file, which is accessible without authentication.    

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

## Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create three resources:

+ A resource group, which is a logical container for related resources.
+ A storage account, which maintains the state and other information about your projects.
+ A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items. Both Azure CLI and PowerShell are supported.

1. If needed, sign in to Azure.

    ### [Azure CLI](#tab/azure-cli)
    ```azurecli
    az login
    ```

    The [`az login`](/cli/azure/reference-index#az-login) command signs you into your Azure account.

    ### [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    Connect-AzAccount
    ```

    The [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet signs you into your Azure account.

    ---

1. Create a resource group named `AzureFunctionsQuickstart-rg` in your chosen region.

    ### [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create --name AzureFunctionsQuickstart-rg --location <REGION>
    ```

    The [az group create](/cli/azure/group#az-group-create) command creates a resource group. In the above command, replace `<REGION>` with a region near you, using an available region code returned from the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

    ### [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name AzureFunctionsQuickstart-rg -Location '<REGION>'
    ```

    The [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) cmdlet.

    ---

    > [!NOTE]
    > You can't host Linux and Windows apps in the same resource group. If you have an existing resource group named `AzureFunctionsQuickstart-rg` with a Windows function app or web app, you must use a different resource group.

1. Create a general-purpose storage account in your resource group and region.

    ### [Azure CLI](#tab/azure-cli)

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS
    ```

    The [az storage account create](/cli/azure/storage/account#az-storage-account-create) command creates the storage account.

    ### [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsQuickstart-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location <REGION>
    ```

    The [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet creates the storage account.

    ---

    In the previous example, replace `<STORAGE_NAME>` with a name that's appropriate to you and unique in Azure Storage. Names must contain 3 to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account [supported by Functions](storage-considerations.md#storage-account-requirements).

    The storage account incurs only a few cents (USD) for this quickstart.

1. Create the function app in Azure.

    ### [Azure CLI](#tab/azure-cli)

    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location westeurope --runtime python --runtime-version <PYTHON_VERSION> --functions-version 4 --name <APP_NAME> --os-type linux --storage-account <STORAGE_NAME>
    ```

    The [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command creates the function app in Azure. You must supply `--os-type linux` because Python functions only run on Linux.

    ### [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccountName <STORAGE_NAME> -FunctionsVersion 4 -RuntimeVersion <PYTHON_VERSION> -Runtime python -Location '<REGION>'
    ```

    The [New-AzFunctionApp](/powershell/module/az.functions/new-azfunctionapp) cmdlet creates the function app in Azure.

    ---

    In the previous example, replace `<APP_NAME>` with a globally unique name appropriate to you. The `<APP_NAME>` is also the default subdomain for the function app. Make sure that the value you set for `<PYTHON_VERSION>` is a [version supported by Functions](supported-languages.md#languages-by-runtime-version) and is the same version you used during local development. 

    This command creates a function app running in your specified language runtime under the [Azure Functions Consumption Plan](consumption-plan.md), which is free for the amount of usage you incur here. The command also creates an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

## Invoke the function on Azure

Because your function uses an HTTP trigger, you invoke it by making an HTTP request to its URL in the browser or with a tool like curl. 

### [Browser](#tab/browser)

Copy the complete **Invoke URL** shown in the output of the `publish` command into a browser address bar, appending the query parameter `?name=Functions`. The browser should display similar output as when you ran the function locally.

### [curl](#tab/curl)

Run [`curl`](https://curl.haxx.se/) with the **Invoke URL** shown in the output of the `publish` command, appending the parameter `?name=Functions`. The output of the command should be the text, "Hello Functions."

---

<!--- // Re-enable this after this bug gets fixed: https://github.com/Azure/azure-functions-core-tools/issues/3609
Run the following command to view near real-time streaming logs in Application Insights in the Azure portal.

```console
func azure functionapp logstream <APP_NAME> --browser
```

In a separate terminal window or in the browser, call the remote function again. A verbose log of the function execution in Azure is shown in the terminal.
--->

[!INCLUDE [functions-cleanup-resources-cli](../../includes/functions-cleanup-resources-cli.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connect to Azure Cosmos DB](functions-add-output-binding-cosmos-db-vs-code.md?pivots=programming-language-python)
> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-python)


Having issues with this article? 

+ [Troubleshoot Python function apps in Azure Functions](recover-python-functions.md)
+ [Let us know](https://aka.ms/python-functions-qs-survey)
