---
title: Deploy a custom container to Azure Functions
description: Learn how to publish your functions as a custom Linux container image to Azure Functions.
ms.date: 05/04/2023
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions-full
---

# Deploy a custom container to Azure Functions 

In this article, you deploy the custom Linux container with your function app to Azure Functions. The custom Docker container is the one you created in the previous quickstart article [Create a function that runs in custom container](./functions-create-function-linux-custom-image.md). 

Deploying your function code in a custom Linux container requires [Premium plan](functions-premium-plan.md) or a [Dedicated (App Service) plan](dedicated-plan.md) hosting. Completing this article incurs costs of a few US dollars in your Azure account, which you can minimize by [cleaning-up resources](#clean-up-resources) when you're done.

Other options for deloying your custom container app to Azure include:

+ Azure Container Apps: to learn more, see [Deploy a custom container to Azure Container apps](./functions-deploy-custom-container-aca.md).

+ Azure Arc (currently in preview): to learn more, see [Deploy a custom container to Azure Arc](./create-first-function-arc-custom-container.md).

## Create the custom container

If you haven't already done so, complete the previous quickstart article [Create a function that runs in custom container](./functions-create-function-linux-custom-image.md) to create and publish a custom container with your first function app.

## Create supporting Azure resources for your function

Before you can deploy your container to Azure, you need to create three resources:

* A [resource group](../azure-resource-manager/management/overview.md), which is a logical container for related resources.
* A [Storage account](../storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
* A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items. Both Azure CLI and PowerShell are supported.

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

A function app on Azure manages the execution of your functions in your hosting plan. In this section, you use the Azure resources from the previous section to create a function app from an image on Docker Hub and configure it with a connection string to Azure Storage.

1. Create a function app using the following command:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az functionapp create --name <APP_NAME> --storage-account <STORAGE_NAME> --resource-group AzureFunctionsContainers-rg --plan myPremiumPlan --deployment-container-image-name <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```

    In the [`az functionapp create`](/cli/azure/functionapp#az-functionapp-create) command, the *deployment-container-image-name* parameter specifies the image to use for the function app. You can use the [az functionapp config container show](/cli/azure/functionapp/config/container#az-functionapp-config-container-show) command to view information about the image used for deployment. You can also use the [`az functionapp config container set`](/cli/azure/functionapp/config/container#az-functionapp-config-container-set) command to deploy from a different image.

    > [!NOTE]  
    > If you're using a custom container registry, then the *deployment-container-image-name* parameter will refer to the registry URL.

    # [Azure PowerShell](#tab/azure-powershell)
    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsContainers-rg -PlanName myPremiumPlan -StorageAccount <STORAGE_NAME> -DockerImageName <DOCKER_ID>/azurefunctionsimage:v1.0.0
    ```
    ---
    
    In this example, replace `<STORAGE_NAME>` with the name you used in the previous section for the storage account. Also, replace `<APP_NAME>` with a globally unique name appropriate to you, and `<DOCKER_ID>` with your Docker Hub account ID. When you're deploying from a custom container registry, use the `deployment-container-image-name` parameter to indicate the URL of the registry. 

     When you first create the function app, it pulls the initial image from your Docker Hub. You can also [Enable continuous deployment](./functions-how-to-custom-container.md#enable-continuous-deployment-to-azure) to Azure from Docker Hub.
    
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

> [!NOTE]
> If you publish your custom image to a private container registry, you must also set the `DOCKER_REGISTRY_SERVER_USERNAME` and `DOCKER_REGISTRY_SERVER_PASSWORD` variables. For more information, see [Custom containers](../app-service/reference-app-settings.md#custom-containers) in the App Service settings reference.

## Verify your functions on Azure

With the image deployed to your function app in Azure, you can now invoke the function as before through HTTP requests.
In your browser, navigate to the following URL:

::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-other"  
`https://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`  
::: zone-end  
::: zone pivot="programming-language-csharp"  
# [In-process](#tab/in-process) 
`https://<APP_NAME>.azurewebsites.net/api/HttpExample?name=Functions`
# [Isolated process](#tab/isolated-process)
`https://<APP_NAME>.azurewebsites.net/api/HttpExample`

---
:::zone-end  

Replace `<APP_NAME>` with the name of your function app. When you navigate to this URL, the browser must display similar output as when you ran the function locally.

## Clean up resources

If you want to continue working with Azure Function using the resources you created in this article, you can leave all those resources in place. Because you created a Premium Plan for Azure Functions, you'll incur one or two USD per day in ongoing costs.

To avoid ongoing costs, delete the `AzureFunctionsContainers-rg` resource group to clean up all the resources in that group:

```azurecli
az group delete --name AzureFunctionsContainers-rg
```

## Next steps

> [!div class="nextstepaction"]
> [Working with custom containers and Azure Functions](./functions-how-to-custom-container.md)

[authorization keys]: functions-bindings-http-webhook-trigger.md#authorization-keys
