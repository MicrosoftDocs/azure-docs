---
title: Create a Python function from the command line - Azure Functions
description: Learn how to create a Python function from the command line, then publish the local project to serverless hosting in Azure Functions.
ms.date: 08/07/2023
ms.topic: quickstart
ms.devlang: python
ms.custom: devx-track-python, devx-track-azurecli, devx-track-azurepowershell, mode-api, devdivchpfy22
zone_pivot_groups: python-mode-functions

---

# Quickstart: Create a Python function in Azure from the command line

In this article, you use command-line tools to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions. 

This article covers both Python programming models supported by Azure Functions. Use the selector at the top to choose your programming model.  

>[!NOTE]
>The v2 programming model provides a decorator based approach to create functions. To learn more about the Python v2 programming model, see the [Developer Reference Guide](functions-reference-python.md).

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [Visual Studio Code-based version](create-first-function-vs-code-python.md) of this article.

## Configure your local environment

Before you begin, you must have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ One of the following tools for creating Azure resources:

  + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

  + The Azure [Az PowerShell module](/powershell/azure/install-azure-powershell) version 5.9.0 or later.

+ [Python versions that are supported by Azure Functions](supported-languages.md#languages-by-runtime-version).
::: zone pivot="python-mode-decorators"  
+ The [Azurite storage emulator](../storage/common/storage-use-azurite.md?tabs=npm#install-azurite). While you can also use an actual Azure Storage account, the article assumes you're using this emulator.
::: zone-end  

[!INCLUDE [functions-x86-emulation-on-arm64-note](../../includes/functions-x86-emulation-on-arm64-note.md)]

[!INCLUDE [functions-install-core-tools](../../includes/functions-install-core-tools.md)]

## <a name="create-venv"></a>Create and activate a virtual environment

In a suitable folder, run the following commands to create and activate a virtual environment named `.venv`. Make sure that you're using Python 3.9, 3.8, or 3.7, which are supported by Azure Functions.

# [bash](#tab/bash)

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

# [PowerShell](#tab/powershell)

```powershell
py -m venv .venv
```

```powershell
.venv\scripts\activate
```

# [Cmd](#tab/cmd)

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
::: zone pivot="python-mode-configuration"  
In this section, you create a function project that contains a single function.

1. Run the `func init` command as follows to create a functions project in a folder named *LocalFunctionProj* with the specified runtime.

    ```console
    func init LocalFunctionProj --python
    ```

1. Go to the project folder.

    ```console
    cd LocalFunctionProj
    ```

    This folder contains various files for the project, including configuration files named [*local.settings.json*](functions-develop-local.md#local-settings-file) and [*host.json*](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```

    `func new` creates a subfolder matching the function name that contains a code file appropriate to the project's chosen language and a configuration file named *function.json*.    
::: zone-end  
::: zone pivot="python-mode-decorators"  
In this section, you create a function project and add an HTTP triggered function.

1. Run the `func init` command as follows to create a functions project in a folder named *LocalFunctionProj* with the specified runtime and the specified programming model version.

    ```console
    func init LocalFunctionProj --python -m V2
    ```

1. Go to the project folder.

    ```console
    cd LocalFunctionProj
    ```
    
    This folder contains various files for the project, including configuration files named [*local.settings.json*](functions-develop-local.md#local-settings-file) and [*host.json*](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. The file `function_app.py` can include all functions within your project. Open this file and replace the existing contents with the following code that adds an HTTP triggered function named `HttpExample`:  

   ```python
   import azure.functions as func
  
   app = func.FunctionApp()
  
   @app.function_name(name="HttpExample")
   @app.route(route="hello")
   def test_function(req: func.HttpRequest) -> func.HttpResponse:
       return func.HttpResponse("HttpExample function processed a request!")
   ```
   
1. Open the local.settings.json project file and verify that the `AzureWebJobsFeatureFlags` setting has a value of `EnableWorkerIndexing`. This is required for Functions to interpret your project correctly as the Python v2 model. You'll add this same setting to your application settings after you publish your project to Azure. 

1. In the local.settings.json file, update the `AzureWebJobsStorage` setting as in the following example:

    ```json
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    ```

    This tells the local Functions host to use the storage emulator for the storage connection currently required by the Python v2 model. When you publish your project to Azure, you'll need to instead use the default storage account. If you're instead using an Azure Storage account, set your storage account connection string here.   
::: zone-end  
::: zone pivot="python-mode-decorators"  
## Start the storage emulator

By default, local development uses the Azurite storage emulator. This emulator is used when the `AzureWebJobsStorage` setting in the *local.settings.json* project file is set to `UseDevelopmentStorage=true`. When using the emulator, you must start the local Azurite storage emulator before running the function. 

You can skip this step if the `AzureWebJobsStorage` setting in *local.settings.json* is set to the connection string for an Azure Storage account instead of `UseDevelopmentStorage=true`. 

Use the following command to start the Azurite storage emulator:

```cmd
azurite
```

For more information, see [Run Azurite](../storage/common/storage-use-azurite.md?tabs=npm#run-azurite)
::: zone-end

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

## Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create three resources:

+ A resource group, which is a logical container for related resources.
+ A storage account, which maintains the state and other information about your projects.
+ A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items. Both Azure CLI and PowerShell are supported.

1. If you haven't done so already, sign in to Azure.

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az login
    ```

    The [`az login`](/cli/azure/reference-index#az-login) command signs you into your Azure account.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    Connect-AzAccount
    ```

    The [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet signs you into your Azure account.

    ---


1. Create a resource group named `AzureFunctionsQuickstart-rg` in your chosen region.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create --name AzureFunctionsQuickstart-rg --location <REGION>
    ```

    The [az group create](/cli/azure/group#az-group-create) command creates a resource group. In the above command, replace `<REGION>` with a region near you, using an available region code returned from the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name AzureFunctionsQuickstart-rg -Location '<REGION>'
    ```

    The [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) cmdlet.

    ---

    ::: zone pivot="python-mode-decorators" 
    ::: zone-end

    > [!NOTE]
    > You can't host Linux and Windows apps in the same resource group. If you have an existing resource group named `AzureFunctionsQuickstart-rg` with a Windows function app or web app, you must use a different resource group.

1. Create a general-purpose storage account in your resource group and region.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS
    ```

    The [az storage account create](/cli/azure/storage/account#az-storage-account-create) command creates the storage account.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsQuickstart-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location <REGION>
    ```

    The [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet creates the storage account.

    ---

    In the previous example, replace `<STORAGE_NAME>` with a name that's appropriate to you and unique in Azure Storage. Names must contain 3 to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account [supported by Functions](storage-considerations.md#storage-account-requirements).

    The storage account incurs only a few cents (USD) for this quickstart.

1. Create the function app in Azure.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location westeurope --runtime python --runtime-version 3.9 --functions-version 4 --name <APP_NAME> --os-type linux --storage-account <STORAGE_NAME>
    ```

    The [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command creates the function app in Azure. If you're using Python 3.9, 3.8, or 3.7, change `--runtime-version` to `3.9`, `3.8`, or `3.7`, respectively. You must supply `--os-type linux` because Python functions can't run on Windows, which is the default.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccountName <STORAGE_NAME> -FunctionsVersion 4 -RuntimeVersion 3.9 -Runtime python -Location '<REGION>'
    ```

    The [New-AzFunctionApp](/powershell/module/az.functions/new-azfunctionapp) cmdlet creates the function app in Azure. If you're using Python 3.9, 3.8, or 3.7, change `-RuntimeVersion` to `3.9`, `3.8`, or `3.7`, respectively.

    ---

    In the previous example, replace `<APP_NAME>` with a globally unique name appropriate to you. The `<APP_NAME>` is also the default DNS domain for the function app.

    This command creates a function app running in your specified language runtime under the [Azure Functions Consumption Plan](consumption-plan.md), which is free for the amount of usage you incur here. The command also creates an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

::: zone pivot="python-mode-decorators"
## Update app settings

To use the Python v2 model in your function app, you need to add a new application setting in Azure named `AzureWebJobsFeatureFlags` with a value of `EnableWorkerIndexing`. This setting is already in your local.settings.json file. 

Run the following command to add this setting to your new function app in Azure.

# [Azure CLI](#tab/azure-cli)

```azurecli 
az functionapp config appsettings set --name <FUNCTION_APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings AzureWebJobsFeatureFlags=EnableWorkerIndexing
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Update-AzFunctionAppSetting -Name <FUNCTION_APP_NAME> -ResourceGroupName <RESOURCE_GROUP_NAME> -AppSetting @{"AzureWebJobsFeatureFlags" = "EnableWorkerIndexing"}
```

---

In the previous example, replace `<FUNCTION_APP_NAME>` and `<RESOURCE_GROUP_NAME>` with the name of your function app and resource group, respectively. This setting is already in your local.settings.json file.
::: zone-end

## Verify in Azure

Run the following command to view near real-time streaming logs in Application Insights in the Azure portal.

```console
func azure functionapp logstream <APP_NAME> --browser
```

In a separate terminal window or in the browser, call the remote function again. A verbose log of the function execution in Azure is shown in the terminal.

[!INCLUDE [functions-cleanup-resources-cli](../../includes/functions-cleanup-resources-cli.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-python)

Having issues with this article? 

+ [Troubleshoot Python function apps in Azure Functions](recover-python-functions.md)
+ [Let us know](https://aka.ms/python-functions-qs-survey)
