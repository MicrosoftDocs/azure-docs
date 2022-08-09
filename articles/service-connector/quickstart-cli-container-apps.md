---
title: Quickstart - Create a service connection in Container Apps using the Azure CLI
description: Quickstart showing how to create a service connection in Azure Container Apps using the Azure CLI
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
ms.date: 08/09/2022
ms.devlang: azurecli
---

# Quickstart: Create a service connection in Container Apps with the Azure CLI

This quickstart shows you how to create a service connection in Azure Container Apps with the Azure CLI. The [Azure CLI](/cli/azure) a cross-platform command-line tool used to create and manage Azure resources.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- An application deployed to Container Apps in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy a container to Container Apps](../container-apps/quickstart-portal.md).

This tutorial requires that you run the Azure CLI locally. You must have the Azure CLI version  2.37.0 or later installed. Run az --version to find the version. If you need to install or upgrade the CLI, go to [Install Azure CLI](/cli/azure/install-azure-cli).

> [!IMPORTANT]
> Service Connector in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prepare to create a connection

1. Run the command [az provider register](/cli/azure/provider?view=azure-cli-latest#az-provider-register) to start using Service Connector.

    ```azurecli-interactive
    az provider register -n Microsoft.ServiceLinker
    ```

1. Run the command `az containerapp connection` to get a list of supported target services for Container Apps.

    ```azurecli-interactive
    az containerapp connection list-support-types --output table
    ```

## Create a service connection

You can create a connection using an access key or a managed identity.

### [Access key](#tab/using-access-key)

1. Run the `az containerapp connection create` command to create a service connection between Container Apps and Azure Blob Storage with an access key.

    ```azurecli-interactive
    az containerapp connection create storage-blob --secret
    ```

1. Provide the following information at the Azure CLI's request:

   - **The resource group that contains the container app**: the name of the resource group with the container app.
   - **Name of the container app**: the name of your container app.
   - **The container where the connection information will be saved:** the name of the container of the container app that connects to the target service
   - **The resource group which contains the storage account:** the name of the resource group with the storage account. In this guide, we're using a Blob Storage.
   - **Name of the storage account:** the name of the storage account that contains your blob.

> [!TIP]
> If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --secret` to provision a new Blob Storage and directly get connected to your app service with a connection string.

### [Managed identity](#tab/using-managed-identity)

> [!IMPORTANT]
> Using a managed identity requires you have the permission to [Azure AD role assignment](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). Without this permission, your connection creation will fail. Ask your subscription owner to grant you this permission, or use an access key instead to create the connection.

1. Run the `az containerapp connection create` command to create a service connection from Container Apps to a Blob Storage with a system-assigned managed identity.

    ```azurecli-interactive
    az containerapp connection create storage-blob --system-identity
    ```

1. Provide the following information at the Azure CLI's request:

   - **The resource group that contains the container app**: the name of the resource group with the container app.
   - **Name of the container app**: the name of your container app.
   - **The container where the connection information will be saved:** the name of the container of the container app that connects to the target service
   - **The resource group which contains the storage account:** the name of the resource group with the storage account. In this guide, we're using a Blob Storage.
   - **Name of the storage account:** the name of the storage account that contains your blob.

> [!NOTE]
> If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --system-identity` to provision a new Blob Storage and directly get connected to your app service with a managed identity.

---

## View connections

 Use the Azure CLI command `az containerapp connection list` to list all your container app's provisioned connections and replace the placeholders `<container-app-resource-group>` and `<container-app-name>` with your container app's resource group and name. You can also remove the `--output table` option to view more information about your connections.

```azurecli-interactive
az containerapp connection list -g "<container-app-resource-group>" --name "<container-app-name>" --output table
```

The output also displays the provisioning state of your connections: failed or succeeded.

## Next steps

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)
