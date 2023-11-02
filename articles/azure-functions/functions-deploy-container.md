---
title: Create your first containerized Azure Functions
description: Get started by deploying your first function app from a Linux image in a container registry to Azure Functions.
ms.date: 05/08/2023
ms.topic: quickstart
ms.custom: build-2023, devx-track-azurecli, devx-track-azurepowershell, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions
---

# Create your first containerized Azure Functions 

In this article, you create a function app running in a Linux container and deploy it to Azure Functions. 

Deploying your function code to Azure Functions in a container requires [Premium plan](functions-premium-plan.md) or [Dedicated (App Service) plan](dedicated-plan.md) hosting. Completing this article incurs costs of a few US dollars in your Azure account, which you can minimize by [cleaning-up resources](#clean-up-resources) when you're done.

Other options for deploying your function app container to Azure include:

+ Azure Container Apps: to learn more, see [Deploy a container to Azure Container apps](./functions-deploy-container-apps.md).

+ Azure Arc (currently in preview): to learn more, see [Deploy a container to Azure Arc](./create-first-function-arc-custom-container.md).

[!INCLUDE [functions-create-container-registry](../../includes/functions-create-container-registry.md)]

## Create supporting Azure resources for your function

Before you can deploy your container to Azure, you need to create three resources:

* A [resource group](../azure-resource-manager/management/overview.md), which is a logical container for related resources.
* A [Storage account](../storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
* A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources. 

Use the following commands to create these items. Both Azure CLI and PowerShell are supported. To create your Azure resources using Azure PowerShell, you also need the [Az PowerShell module](/powershell/azure/install-az-ps), version 5.9.0 or later.

1. If you haven't done already, sign in to Azure.

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

1. Create a resource group named `AzureFunctionsContainers-rg` in your chosen region.

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli
    az group create --name AzureFunctionsContainers-rg --location <REGION>
    ```
 
    The [`az group create`](/cli/azure/group#az-group-create) command creates a resource group. In the above command, replace `<REGION>` with a region near you, using an available region code returned from the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name AzureFunctionsContainers-rg -Location <REGION>
    ```

    The [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the [`Get-AzLocation`](/powershell/module/az.resources/get-azlocation) cmdlet.

    ---

1. Create a general-purpose storage account in your resource group and region.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsContainers-rg --sku Standard_LRS
    ```

    The [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) command creates the storage account. 

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsContainers-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location <REGION>
    ```

    The [`New-AzStorageAccount`](/powershell/module/az.storage/new-azstorageaccount) cmdlet creates the storage account.

    ---

    In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Storage names must contain 3 to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account [supported by Functions](storage-considerations.md#storage-account-requirements).
    
1. Use the command to create a Premium plan for Azure Functions named `myPremiumPlan` in the **Elastic Premium 1** pricing tier (`--sku EP1`), in your `<REGION>`, and in a Linux container (`--is-linux`).

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp plan create --resource-group AzureFunctionsContainers-rg --name myPremiumPlan --location <REGION> --number-of-workers 1 --sku EP1 --is-linux
    ```
    # [Azure PowerShell](#tab/azure-powershell)
    ```powershell
    New-AzFunctionAppPlan -ResourceGroupName AzureFunctionsContainers-rg -Name MyPremiumPlan -Location <REGION> -Sku EP1 -WorkerType Linux
    ```
    ---
    We use the Premium plan here, which can scale as needed. For more information about hosting, see [Azure Functions hosting plans comparison](functions-scale.md). For more information on how to calculate costs, see the [Functions pricing page](https://azure.microsoft.com/pricing/details/functions/).

    The command also creates an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

## Create and configure a function app on Azure with the image

A function app on Azure manages the execution of your functions in your Azure Functions hosting plan. In this section, you use the Azure resources from the previous section to create a function app from an image in a container registry and configure it with a connection string to Azure Storage.

1. Create a function app using the following command, depending on your container registry:

    # [Azure Container Registry](#tab/acr/azure-cli)
    ```azurecli
    az functionapp create --name <APP_NAME> --storage-account <STORAGE_NAME> --resource-group AzureFunctionsContainers-rg --plan myPremiumPlan --image <LOGIN_SERVER>/azurefunctionsimage:v1.0.0 --registry-username <USERNAME> --registry-password <SECURE_PASSWORD> 
    ```

    # [Docker Hub](#tab/docker/azure-cli)
    ```azurecli
    az functionapp create --name <APP_NAME> --storage-account <STORAGE_NAME> --resource-group AzureFunctionsContainers-rg --plan myPremiumPlan --image <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```

    # [Azure Container Registry](#tab/acr/azure-powershell)
    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -PlanName myPremiumPlan -StorageAccount <STORAGE_NAME> -DockerImageName <LOGIN_SERVER>/azurefunctionsimage:v1.0.0
    ```

    # [Docker Hub](#tab/docker/azure-powershell)
    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -PlanName myPremiumPlan -StorageAccount <STORAGE_NAME> -DockerImageName <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```
    ---
    
    In this example, replace `<STORAGE_NAME>` with the name you used in the previous section for the storage account. Also, replace `<APP_NAME>` with a globally unique name appropriate to you and `<DOCKER_ID>` or `<LOGIN_SERVER>` with your Docker Hub account ID or Container Registry server, respectively. When you're deploying from a custom container registry, the image name indicates the URL of the registry. 

    When you first create the function app, it pulls the initial image from your Docker Hub. You can also [Enable continuous deployment](./functions-how-to-custom-container.md#enable-continuous-deployment-to-azure) to Azure from your container registry.
    
    > [!TIP]  
    > You can use the [`DisableColor` setting](functions-host-json.md#console) in the *host.json* file to prevent ANSI control characters from being written to the container logs.

1. Use the following command to get the connection string for the storage account you created:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az storage account show-connection-string --resource-group AzureFunctionsContainers-rg --name <STORAGE_NAME> --query connectionString --output tsv
    ```

    The connection string for the storage account is returned by using the [`az storage account show-connection-string`](/cli/azure/storage/account) command.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    $storage_name = "<STORAGE_NAME>"
    $key = (Get-AzStorageAccountKey -ResourceGroupName AzureFunctionsContainers-rg -Name $storage_name)[0].Value
    $string = "DefaultEndpointsProtocol=https;EndpointSuffix=core.windows.net;AccountName=" + $storage_name + ";AccountKey=" + $key
    Write-Output($string) 
    ```
    The key returned by the [`Get-AzStorageAccountKey`](/powershell/module/az.storage/get-azstorageaccountkey) cmdlet is used to construct the connection string for the storage account.

    ---    

    Replace `<STORAGE_NAME>` with the name of the storage account you created earlier.

1. Use the following command to add the setting to the function app:
 
    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp config appsettings set --name <APP_NAME> --resource-group AzureFunctionsContainers-rg --settings AzureWebJobsStorage=<CONNECTION_STRING>
    ```
    The [`az functionapp config appsettings set`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-ppsettings-set) command creates the setting.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    Update-AzFunctionAppSetting -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -AppSetting @{"AzureWebJobsStorage"="<CONNECTION_STRING>"}
    ```
    The [`Update-AzFunctionAppSetting`](/powershell/module/az.functions/update-azfunctionappsetting) cmdlet creates the setting.

    ---

    In this command, replace `<APP_NAME>` with the name of your function app and `<CONNECTION_STRING>` with the connection string from the previous step. The connection should be a long encoded string that begins with `DefaultEndpointProtocol=`.
 
1. The function can now use this connection string to access the storage account.

[!INCLUDE [functions-container-verify-azure](../../includes/functions-container-verify-azure.md)]

## Clean up resources

If you want to continue working with Azure Function using the resources you created in this article, you can leave all those resources in place. Because you created a Premium Plan for Azure Functions, you'll incur one or two USD per day in ongoing costs.

To avoid ongoing costs, delete the `AzureFunctionsContainers-rg` resource group to clean up all the resources in that group:

```azurecli
az group delete --name AzureFunctionsContainers-rg
```

## Next steps

> [!div class="nextstepaction"]
> [Working with custom containers and Azure Functions](./functions-how-to-custom-container.md)
