---
title: 'Quickstart: Create a function app on Azure Arc'
description: Get started with Azure Functions on Azure Arc by deploying your first function app.
ms.topic: quickstart
ms.date: 05/10/2021
---

# Create your first function on Azure Arc

In this quickstart, you create an Azure Functions project and deploy it to a function app running on an Azure Arc-enabled Kubernetes cluster. This scenario supports only running on Linux. PowerShell function app aren't currently supported on Azure Arc-enabled Kubernetes clusters.

## Prerequisites

On your local computer:

# [C\#](#tab/csharp)

+ [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download)
+ [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

# [JavaScript](#tab/nodejs)

+ [Node.js](https://nodejs.org/) version 12. Node.js version 10 is also supported.
+ [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

# [Python](#tab/python)

+ [Python versions that are supported by Azure Functions](supported-languages.md#languages-by-runtime-version)
+ [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

---

You must also first [create an App Service Kubernetes environment](../app-service/manage-create-arc-environment.md) for an Azure Arc-enabled Kubernetes cluster.

## Create the local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:  

    # [C\#](#tab/csharp)

    ```console
    func init LocalFunctionProj --dotnet
    ```
    # [JavaScript](#tab/nodejs)

    ```console
    func init LocalFunctionProj --javascript
    ```

    # [Python](#tab/python/bash)

    Python requires a virtual environment:
    
    ```bash
    python -m venv .venv
    ```
    
    ```bash
    source .venv/bin/activate
    ```

    ```console
    func init LocalFunctionProj --python
    ```
    
    # [Python](#tab/python/cmd)

    Python requires a virtual environment:
    
    ```cmd
    py -m venv .venv
    ```
    
    ```cmd
    .venv\scripts\activate
    ```      
 
    ```console
    func init LocalFunctionProj --python
    ```

    ---

1. Navigate into the project folder:

    # [bash](#tab/bash)

    ```console
    cd LocalFunctionProj
    ```

    # [cmd](#tab/cmd)

    ```console
    cd LocalFunctionProj
    ```
    ---

    This folder contains various files for the project, including configurations files named [local.settings.json](functions-run-local.md#local-settings-file) and [host.json](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```  
[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

## Create Azure resources 

Before you can deploy your function code to your new App Service Kubernetes environment, you need to create two additional resources:

- A [Storage account](../storage/common/storage-account-create.md), which is currently required by tooling and isn't part of the environment.
- A function app, which provides the context for executing your function code. A function app runs in the App Service Kubernetes environment and maps to your local function project. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

>[!NOTE]
>Function apps run in an App Service Kubernetes environment on a Dedicated (App Service) plan. When you create your function app without an existing plan, a plan is created for you.  

### Create Storage account

Use the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command to create a general-purpose storage account in your resource group and region:

```azurecli
az storage account create --name <STORAGE_NAME> --location westeurope --resource-group myResourceGroup --sku Standard_LRS
```

>[!NOTE]  
>A storage account is currently required by Azure Functions tooling. 

n the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements). The `--location` value is a standard Azure region. 

### Create the function app

Run the [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command to create a new function app in the environment.

# [C\#](#tab/csharp)  
```azurecli-interactive
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 3 --runtime dotnet 
```

# [JavaScript](#tab/nodejs)  
```azurecli-interactive
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 3 --runtime node --runtime-version 12
```

# [Python](#tab/python)  
```azurecli-interactive
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 3 --runtime python --runtime-version 3.8
```
---

In this example, replace `<CUSTOM_LOCATION_ID>` with the ID of the custom location of the App Service Kubernetes environment (see [Prerequisites](#prerequisites)). Also, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, and replace `<APP_NAME>` with a globally unique name appropriate to you. 

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]

[!INCLUDE [functions-streaming-logs-cli-qs](../../includes/functions-streaming-logs-cli-qs.md)]

## Next steps

Now that you have your function app running in an Arc-enabled App Service Kubernetes environment, you can extend it by connecting to Azure Storage by adding a Queue Storage output binding.

# [C\#](#tab/csharp)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-csharp)

# [JavaScript](#tab/nodejs)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-javascript)

# [Python](#tab/python)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-python)

---