---
title: 'Quickstart: Create a function app on Azure Arc'
description: Get started with Azure Functions on Azure Arc by deploying your first function app.
ms.topic: quickstart
ms.date: 09/02/2022
ms.custom: mode-other, devx-track-azurecli, build-2023
ms.devlang: azurecli
---

# Create your first function on Azure Arc (preview)

In this quickstart, you create an Azure Functions project and deploy it to a function app running on an [Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/overview.md). To learn more, see [App Service, Functions, and Logic Apps on Azure Arc](../app-service/overview-arc-integration.md). This scenario only supports function apps running on Linux.   

> [!NOTE]
> Support for running functions on an Azure Arc-enabled Kubernetes cluster is currently in preview.  
>  
> Publishing PowerShell function projects to Azure Arc-enabled Kubernetes clusters isn't currently supported. If you need to deploy PowerShell functions to Azure Arc-enabled Kubernetes clusters, [create your function app in a container](create-first-function-arc-custom-container.md). 

If you need to customize the container in which your function app runs, instead see [Create your first containerized functions on Azure Arc (preview)](create-first-function-arc-custom-container.md).

## Prerequisites

On your local computer:

# [C\#](#tab/csharp)

+ [.NET 6.0 SDK](https://dotnet.microsoft.com/download)
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later

# [JavaScript](#tab/nodejs)

+ [Node.js](https://nodejs.org/) version 18. Node.js version 14 is also supported.
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later

# [Python](#tab/python)

+ [Python versions that are supported by Azure Functions](supported-languages.md#languages-by-runtime-version)
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later

# [PowerShell](#tab/powershell)

+ [PowerShell 7](/powershell/scripting/install/installing-powershell-core-on-windows)
+ [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later
+ PowerShell 7 requires version 1.2.5 of the connectedk8s Azure CLI extension, or a later version. It also requires version 0.1.3 of the appservice-kube Azure CLI extension, or a later version. Make sure you install the correct version of both of these extensions as you complete this quickstart article.

---
[!INCLUDE [functions-install-core-tools](../../includes/functions-install-core-tools.md)]

[!INCLUDE [functions-arc-create-environment](../../includes/functions-arc-create-environment.md)]

[!INCLUDE [app-service-arc-cli-install-extensions](../../includes/app-service-arc-cli-install-extensions.md)]

## Create the local function project

In Azure Functions, a function project is the unit of deployment and execution for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:  

    # [C\#](#tab/csharp)

    ```console
    func init LocalFunctionProj --dotnet
    ```
    # [JavaScript](#tab/nodejs)

    ```console
    func init LocalFunctionProj --javascript
    ```

    # [Python](#tab/python)

    Python requires a virtual environment, the commands for which differ between bash and a Windows command line.
    
     + bash: 

        ```bash
        python -m venv .venv
        source .venv/bin/activate
        ```
    
     + command line:

        ```cmd
        py -m venv .venv
        .venv\scripts\activate
        ```  

    Now, you create the project inside the virtual environment. 
    
    ```console
    func init LocalFunctionProj --python
    ```
    
    # [PowerShell](#tab/powershell)


    ```console
    func init LocalFunctionProj --powershell
    ```

    ---

1. Navigate into the project folder:

    ```console
    cd LocalFunctionProj
    ```

    This folder contains various files for the project, including configurations files named [local.settings.json](functions-develop-local.md#local-settings-file) and [host.json](functions-host-json.md). By default, the *local.settings.json* file is excluded from source control in the *.gitignore* file. This exclusion is because the file can contain secrets that are downloaded from Azure.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```  
[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

[!INCLUDE [functions-arc-get-custom-location](../../includes/functions-arc-get-custom-location.md)]

## Create Azure resources 

Before you can deploy your function code to your new App Service Kubernetes environment, you need to create two more resources:

- A [Storage account](../storage/common/storage-account-create.md). While this article creates a storage account, in some cases a storage account may not be required. For more information, see [Azure Arc-enabled clusters](storage-considerations.md#azure-arc-enabled-clusters) in the storage considerations article.    
- A function app, which provides the context for executing your function code. The function app runs in the App Service Kubernetes environment and maps to your local function project. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

> [!NOTE]
> Function apps run in an App Service Kubernetes environment on a Dedicated (App Service) plan. When you create your function app without an existing plan, the correct plan is created for you.  

### Create Storage account

Use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command to create a general-purpose storage account in your resource group and region:

```azurecli
az storage account create --name <STORAGE_NAME> --location westeurope --resource-group myResourceGroup --sku Standard_LRS
```

> [!NOTE]  
> In some cases, a storage account may not be required. For more information, see [Azure Arc-enabled clusters](storage-considerations.md#azure-arc-enabled-clusters) in the storage considerations article. 

In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements). The `--location` value is a standard Azure region. 

### Create the function app

Run the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command to create a new function app in the environment.

# [C\#](#tab/csharp)  
```azurecli
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 4 --runtime dotnet 
```

# [JavaScript](#tab/nodejs)  
```azurecli
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 4 --runtime node --runtime-version 18
```

# [Python](#tab/python)  
```azurecli
az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 4 --runtime python --runtime-version 3.8
```

# [PowerShell](#tab/powershell)

```azurecli
az functionapp create --resource-group myResourceGroup --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --functions-version 4 --runtime powershell --runtime-version 7.0
```

---

In this example, replace `<CUSTOM_LOCATION_ID>` with the ID of the custom location you determined for the App Service Kubernetes environment. Also, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, and replace `<APP_NAME>` with a globally unique name appropriate to you. 

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

Because it can take some time for a full deployment to complete on an Azure Arc-enabled Kubernetes cluster, you may want to rerun the following command to verify your published functions:

```command
func azure functionapp list-functions
``` 

[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]

## Next steps

Now that you have your function app running in a container an Azure Arc-enabled App Service Kubernetes environment, you can connect it to Azure Storage by adding a Queue Storage output binding.

# [C\#](#tab/csharp)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-csharp)

# [JavaScript](#tab/nodejs)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-javascript)

# [Python](#tab/python)  

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-python)

# [PowerShell](#tab/powershell)

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-powershell)

---
