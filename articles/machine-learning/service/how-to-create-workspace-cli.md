---
title: Use the Azure CLI to create a workspace
titleSuffix: Azure Machine Learning service
description: Learn how to use the Azure CLI to create a new Azure Machine Learning service workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.author: larryfr
author: Blackmist
ms.date: 08/30/2019
---

# Use an Azure Resource Manager template to create a workspace for Azure Machine Learning service

In this article, you learn how to create an Azure Machine Learning service workspace using the Azure CLI. The Azure CLI provides commands for managing Azure resources. The machine learning extension to the CLI provides commands for working with Azure Machine Learning service resources.

## Prerequisites

* An **Azure subscription**. If you do not have one, try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree).

* To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

    If you use the [Azure Cloud Shell](https://azure.microsoft.com//features/cloud-shell/), the CLI is accessed through the browser and lives in the cloud.

## Connect the CLI to your Azure subscription

> [!IMPORTANT]
> If you are using the Azure Cloud Shell, you can skip this section. The cloud shell automatically authenticates you using the account you log into your Azure subscription.

There are several ways that you can authenticate to your Azure subscription from the CLI. The most basic is to interactively authenticate using a browser. To authenticate interactively, open a command line or terminal and use the following command:

```azurecli
az login
```

If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser and follow the instructions on the command line. The instructions involve browsing to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and entering an authorization code.

For other methods of authenticating, see [Sign in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

## Install the machine learning extension

To install the machine learning extension, use the following command:

```azurecli-interactive
az extension add -n azure-cli-ml
```

## Resource group

The Azure Machine Learning service workspace must be created inside a resource group. You can use an existing resource group or create a new one.

To __use an existing resource group__, skip to the [Create the workspace](#create-the-workspace) section and provide the name of the resource group when creating the workspace.

To __create a new resource group__, use the following command. Replace `<resourcegroupname>` with the name to use for this resource group. Replace `<location>` with the Azure region to use for this resource group:

> [!TIP]
> You should select a region where the Azure Machine Learning service is available. For information, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service).

```azurecli-interactive
az group create --name <resource-grou-pname> --location <location>
```

The response from this command is similar to the following JSON:

```json
{
  "id": "/subscriptions/<subscription-GUID>/resourceGroups/<resourcegroupname>",
  "location": "<location>",
  "managedBy": null,
  "name": "<resource-group-name>",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": null
}
```

For more information on working with resource groups, see [az group](https://docs.microsoft.com//cli/azure/group?view=azure-cli-latest).

## Create the workspace

The Azure Machine Learning service workspace relies on the following Azure services:

> [!IMPORTANT]
> If you do not specify an existing Azure service, one will be created automatically during workspace creation.

| Service | Parameter to specify an existing instance |
| ---- | ---- |
| **Azure Storage Account** | `--storage-account <service-id>` |
| **Azure Application Insights** | `--application-insights <service-id>` |
| **Azure Key Vault** | `--keyvault <service-id>` |
| **Azure Container Registry** | `--container-registry <service-id>` |

### Automatically create required resources

To create a new workspace where the __services are automatically created__, use the following command:

```azurecli-interactive
az ml workspace create -w <workspace-name> -g <resource-group-name>
```

The output of this command is similar to the following JSON:

```json
{
  "applicationInsights": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<application-insight-name>",
  "containerRegistry": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.containerregistry/registries/<acr-name>",
  "creationTime": "2019-08-30T20:24:19.6984254+00:00",
  "description": "",
  "friendlyName": "<workspace-name>",
  "id": "/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>",
  "identityPrincipalId": "77158e44-0709-4489-af2c-8b86d280c8a8",
  "identityTenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
  "identityType": "SystemAssigned",
  "keyVault": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.keyvault/vaults/<key-vault-name>",
  "location": "<location>",
  "name": "<workspace-name>",
  "resourceGroup": "<resource-group-name>",
  "storageAccount": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.storage/storageaccounts/<storage-account-name>",
  "type": "Microsoft.MachineLearningServices/workspaces",
  "workspaceid": "2451d145-c782-404c-b96d-10bd39b244d1"
}
```

### Use existing resources

To create a workspace that uses existing resources, you must provide the ID for the resources. Use the following commands to get the ID for the services:

> [!IMPORTANT]
> You don't have to specify all existing resources. You can specify one or more. For example, you can specify an existing storage account and the workspace will create the other resources.

+ **Azure Storage Account**: `az storage account show --name <storage-account-name> --query "id"`

    The response from this command is similar to the following text, and is the ID for your storage account:

    `"/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"`

+ **Azure Application Insights**:

    1. Install the application insights extension:

        ```bash
        az extension add -n application-insights
        ```

    2. Get the ID of your application insight service:

        ```bash
        az monitor app-insights component show --app <application-insight-name> -g <resource-group-name> --query "id"
        ```

        The response from this command is similar to the following text, and is the ID for your application insights service:

        `"/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/microsoft.insights/components/<application-insight-name>"`

+ **Azure Key Vault**: `az keyvault show --name <key-vault-name> --query "ID"

    The response from this command is similar to the following text, and is the ID for your key vault:

    `"/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<key-vault-name>"`

+ **Azure Container Registry**: `az acr show --name <acr-name> -g <resource-group-name> --query "id"`

    The response from this command is similar to the following text, and is the ID for the container registry:

    `"/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerRegistry/registries/<acr-name>"`

    > [!IMPORTANT]
    > The container registry must have the the [admin account](/azure/container-registry/container-registry-authentication#admin-account) enabled before it can be used with an Azure Machine Learning service workspace.

Once you have the IDs for the resource(s) that you want to use with the workspace, use the base `az workspace create -w <workspace-name> -g <resource-group-name>` command and add the parameter(s) and ID(s) for the existing resources. For example, the following command creates a workspace that uses an existing container registry:

```azurecli-interactive
az ml workspace create -w <workspace-name> -g <resource-group-name> --container-registry "/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerRegistry/registries/<acr-name>"
```

The output of this command is similar to the following JSON:

```json
{
  "applicationInsights": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<application-insight-name>",
  "containerRegistry": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.containerregistry/registries/<acr-name>",
  "creationTime": "2019-08-30T20:24:19.6984254+00:00",
  "description": "",
  "friendlyName": "<workspace-name>",
  "id": "/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>",
  "identityPrincipalId": "77158e44-0709-4489-af2c-8b86d280c8a8",
  "identityTenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
  "identityType": "SystemAssigned",
  "keyVault": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.keyvault/vaults/<key-vault-name>",
  "location": "<location>",
  "name": "<workspace-name>",
  "resourceGroup": "<resource-group-name>",
  "storageAccount": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.storage/storageaccounts/<storage-account-name>",
  "type": "Microsoft.MachineLearningServices/workspaces",
  "workspaceid": "2451d145-c782-404c-b96d-10bd39b244d1"
}
```

## Delete the workspace

To delete a workspace after it is no longer needed, use the following command:

```azurecli-interactive
az ml workspace delete -w <workspace-name> -g <resource-group-name>
```

> [!IMPORTANT]
> Deleting a workspace does not delete the application insight, storage account, key vault, or container registry used by the workspace.