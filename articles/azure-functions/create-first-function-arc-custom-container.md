---
title: Create your first containerized Azure Functions on Azure Arc
description: Get started with Azure Functions on Azure Arc by deploying your first function app in a custom Linux container.
ms.topic: quickstart
ms.date: 06/05/2023
ms.custom: mode-other, devx-track-azurecli, build-2023, devx-track-extended-java, devx-track-js, devx-track-python
ms.devlang: azurecli
zone_pivot_groups: programming-languages-set-functions
---

# Create your first containerized Azure Functions on Azure Arc (preview)

In this article, you create a function app running in a Linux container and deploy it to an [Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/overview.md) from a container registry. When you create your own container, you can customize the execution environment for your function app. To learn more, see [App Service, Functions, and Logic Apps on Azure Arc](../app-service/overview-arc-integration.md).

> [!NOTE]
> Support for deploying a custom container to an Azure Arc-enabled Kubernetes cluster is currently in preview.  

You can also publish your functions to an Azure Arc-enabled Kubernetes cluster without first creating a container. To learn more, see [Create your first function on Azure Arc (preview)](create-first-function-arc-cli.md)     

[!INCLUDE [functions-create-container-registry](../../includes/functions-create-container-registry.md)]

[!INCLUDE [functions-arc-create-environment](../../includes/functions-arc-create-environment.md)]

[!INCLUDE [app-service-arc-cli-install-extensions](../../includes/app-service-arc-cli-install-extensions.md)]

## Create Azure resources 

Before you can deploy your container to your new App Service Kubernetes environment, you need to create two more resources:

- A [Storage account](../storage/common/storage-account-create.md). While this article creates a storage account, in some cases a storage account may not be required. For more information, see [Azure Arc-enabled clusters](storage-considerations.md#azure-arc-enabled-clusters) in the storage considerations article.  
- A function app, which provides the context for running your container. The function app runs in the App Service Kubernetes environment and maps to your local function project. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

> [!NOTE]
> Function apps run in an App Service Kubernetes environment on a Dedicated (App Service) plan. When you create your function app without an existing plan, a plan is created for you.  

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

# [Azure Container Registry](#tab/acr)
```azurecli
az functionapp create --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --resource-group AzureFunctionsContainers-rg --image <LOGIN_SERVER>/azurefunctionsimage:v1.0.0 --registry-username <USERNAME> --registry-password <SECURE_PASSWORD> 
```

# [Docker Hub](#tab/docker)
```azurecli
az functionapp create --name <APP_NAME> --custom-location <CUSTOM_LOCATION_ID> --storage-account <STORAGE_NAME> --resource-group AzureFunctionsContainers-rg --image <DOCKER_ID>/azurefunctionsimage:v1.0.0
```
---

In this example, replace `<CUSTOM_LOCATION_ID>` with the ID of the custom location you determined for the App Service Kubernetes environment. Also, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, `<APP_NAME>` with a globally unique name, and `<DOCKER_ID>` or `<LOGIN_SERVER>` with your Docker Hub account ID or Container Registry server, respectively. When you're deploying from a custom container registry, the image name indicates the URL of the registry. 

When you first create the function app, it pulls the initial image from your Docker Hub. 
<!--- Need to verify if CI/CD is supported:
You can also [Enable continuous deployment](./functions-how-to-custom-container.md#enable-continuous-deployment-to-azure) to Azure from Docker Hub. -->

### Set required app settings

Run the following commands to create an app setting for the storage account connection string:

```azurecli-interactive
storageConnectionString=$(az storage account show-connection-string --resource-group AzureFunctionsContainers-rg --name <STORAGE_NAME> --query connectionString --output tsv)
az functionapp config appsettings set --name <app_name> --resource-group AzureFunctionsContainers-rg --settings AzureWebJobsStorage=$storageConnectionString
```

This code must be run either in Cloud Shell or in Bash on your local computer. Replace `<STORAGE_NAME>` with the name of the storage account and `<APP_NAME>` with the function app name.  

[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]

## Clean up resources

If you want to continue working with Azure Function using the resources you created in this article, you can leave all those resources in place. 

When you are done working with this function app deployment, delete the `AzureFunctionsContainers-rg` resource group to clean up all the resources in that group:

```azurecli
az group delete --name AzureFunctionsContainers-rg
```

This only removes the resources created in this article. The underlying Azure Arc environment remains in place.

## Next steps

> [!div class="nextstepaction"]
> [Working with custom containers and Azure Functions](./functions-how-to-custom-container.md)
