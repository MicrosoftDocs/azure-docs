---
title: Deploy a custom container to Azure Container Apps
description: Learn how to publish your functions as a custom Linux container image to Azure Container Apps.
ms.date: 05/04/2023
ms.topic: quickstart
zone_pivot_groups: programming-languages-set-functions-full
---

# Deploy a custom container to Azure Container Apps 

In this article, you deploy the custom Linux container with your function app to Azure Container Apps. The custom Docker container is the one you created in the previous quickstart article [Create a function that runs in custom container](./functions-create-function-linux-custom-image.md). 

Completing this article incurs costs of a few US dollars in your Azure account, which you can minimize by [cleaning-up resources](#clean-up-resources) when you're done.

> [!NOTE]
> Support for deploying custom function app containers to Azure Container Apps is currently in preview. 

Other options for deloying your custom container app to Azure include:

+ Azure Functions: to learn more, see [Deploy a custom container to Azure Functions](./functions-deploy-custom-container.md). 

+ Azure Arc (currently in preview): to learn more, see [Deploy a custom container to Azure Arc](./create-first-function-arc-custom-container.md).

## Create the custom container

If you haven't already done so, complete the previous quickstart article [Create a function that runs in custom container](./functions-create-function-linux-custom-image.md) to create and publish a custom container with your first function app.

## Create supporting Azure resources for your function

Before you can deploy your container to Azure, you need to create three resources:

* A [resource group](../azure-resource-manager/management/overview.md), which is a logical container for related resources.
* A [Storage account](../storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
* A Container Apps environment with a Log Analytics workspace.

Use the following commands to create these items. 

1. If you haven't done already, sign in to Azure.

    ```azurecli
    az login
    az account set -subscription <SUBSCRIPTION_NAME>
    ```

    The [`az login`](/cli/azure/reference-index#az-login) command signs you into your Azure account. Use `az account set` when you have more than one subscription associated with your account.


1. Upgrade the Container Apps extension

    ```azurecli
    az upgrade
    az extension add --name containerapp --upgrade
    az provider register --namespace Microsoft.Web
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

1. Create a resource group named `AzureFunctionsContainers-rg` in your chosen region.

    
    ```azurecli
    az group create --name AzureFunctionsContainers-rg --location <REGION>
    ```
 
    The [`az group create`](/cli/azure/group#az-group-create) command creates a resource group. In the above command, replace `<REGION>` with a region near you, using an available region code returned from the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

1. Create Azure Container App environment with an auto-generated Log Analytics workspace.

    ```azurecli
    az containerapp env create -n MyContainerappEnvironment -g AzureFunctionsContainers-rg --location northeurope
    ```

1. Create a general-purpose storage account in your resource group and region.

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsContainers-rg --sku Standard_LRS
    ```

    The [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) command creates the storage account. 

    In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Storage names must contain 3 to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account [supported by Functions](storage-considerations.md#storage-account-requirements).
    
1. Create a function app in the new managed environment backed by Azure Container Apps using the following command:

    ```azurecli
    az functionapp create --resource-group AzureFunctionsContainers-rg --name <APP_NAME> \
    --environment MyContainerappEnvironment \
    --storage-account <STORAGE_NAME> \
    --functions-version 4 \
    --runtime dotnet-isolated \
    --image <DOCKER_ID>/<image_name>:<version> 
    ```

    In the [`az functionapp create`](/cli/azure/functionapp#az-functionapp-create) command, the *-environment* parameter specifies Container Apps environment and the *-image* parameter specifies the image to use for the function app. You can use the [az functionapp config container show](/cli/azure/functionapp/config/container#az-functionapp-config-container-show) command to view information about the image used for deployment. You can also use the [`az functionapp config container set`](/cli/azure/functionapp/config/container#az-functionapp-config-container-set) command to deploy from a different image.

    > [!NOTE]  
    > If you're using a custom container registry, then the *deployment-container-image-name* parameter will refer to the registry URL.
    
    In this example, replace `<STORAGE_NAME>` with the name you used in the previous section for the storage account. Also, replace `<APP_NAME>` with a globally unique name appropriate to you, and `<DOCKER_ID>` with your Docker Hub account ID. 

    When you first create the function app, it pulls the initial image from your Docker Hub. You can also [Enable continuous deployment](./functions-how-to-custom-container.md#enable-continuous-deployment-to-azure) to Azure from Docker Hub.

1. Use the following command to get the connection string for the storage account you created:

    ```azurecli
    az storage account show-connection-string --resource-group AzureFunctionsContainers-rg --name <STORAGE_NAME> --query connectionString --output tsv
    ```

    The connection string for the storage account is returned by using the [`az storage account show-connection-string`](/cli/azure/storage/account) command.   

    Replace `<STORAGE_NAME>` with the name of the storage account you created earlier.

1. Use the following command to add the setting to the function app:
 
    ```azurecli
    az functionapp config appsettings set --name <APP_NAME> --resource-group AzureFunctionsContainers-rg --settings AzureWebJobsStorage=<CONNECTION_STRING>
    ```
    The [`az functionapp config appsettings set`](/cli/azure/functionapp/config/appsettings#az-functionapp-config-ppsettings-set) command creates the setting.

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
