---
title: Quickstart - Create a service connection in Container Apps using the Azure CLI
description: Quickstart showing how to create a service connection in Azure Container Apps using the Azure CLI
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
ms.date: 05/24/2022
ms.devlang: azurecli
---

# Quickstart: Create a service connection in Container Apps with the Azure CLI

This quickstart shows you how to create a service connection in Container Apps with the Azure CLI. The [Azure CLI](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- Version 2.37.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).

- An application deployed to Container Apps in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy a container to Container Apps](../container-apps/quickstart-portal.md).

> [!IMPORTANT]
> Service Connector in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## View supported target services

Use the following Azure CLI command to create and manage service connections from Container Apps.

```azurecli-interactive
az provider register -n Microsoft.ServiceLinker
az containerapp connection list-support-types --output table
```

## Create a service connection

### [Using an access key](#tab/using-access-key)

1. Use the following Azure CLI command to create a service connection from Container Apps to a Blob Storage with an access key.

    ```azurecli-interactive
    az containerapp connection create storage-blob --secret
    ```

1. Provide the following information at the Azure CLI's request:

   - **The resource group which contains the container app**: the name of the resource group with the container app.
   - **Name of the container app**: the name of your container app.
   - **The container where the connection information will be saved:** the name of the container, in your container app, that connects to the target service
   - **The resource group which contains the storage account:** the name of the resource group name with the storage account. In this guide, we're using a Blob Storage.
   - **Name of the storage account:** the name of the storage account that contains your blob.

> [!NOTE]
> If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --secret` to provision a new Blob Storage and directly get connected to your app service.

### [Using a managed identity](#tab/using-managed-identity)

> [!IMPORTANT]
> Using a managed identity requires you have the permission to [Azure AD role assignment](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). Without this permission, your connection creation will fail. Ask your subscription owner to grant you this permission, or use an access key instead to create the connection.

1. Use the following Azure CLI command to create a service connection from Container Apps to a Blob Storage with a system-assigned managed identity.

    ```azurecli-interactive
    az containerapp connection create storage-blob --system-identity
    ```

1. Provide the following information at the Azure CLI's request:

   - **The resource group which contains the container app**: the name of the resource group with the container app.
   - **Name of the container app**: the name of your container app.
   - **The container where the connection information will be saved:** the name of the container, in your container app, that connects to the target service
   - **The resource group which contains the storage account:** the name of the resource group name with the storage account. In this guide, we're using a Blob Storage.
   - **Name of the storage account:** the name of the storage account that contains your blob.

> [!NOTE]
> If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --system-identity` to provision a new Blob Storage and directly get connected to your app service.

---

## View connections

 Use the Azure CLI command `az containerapp connection list` to list all your container app's provisioned connections. Provide the following information:

- **Source compute service resource group name:** the resource group name of the container app.
- **Container app name:** the name of your container app.

```azurecli-interactive
az containerapp connection list -g "<your-container-app-resource-group>" --name "<your-container-app-name>" --output table
```

The output also displays the provisioning state of your connections: failed or succeeded.

## Next steps

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)
