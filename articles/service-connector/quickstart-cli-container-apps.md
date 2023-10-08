---
title: Quickstart - Create a service connection in Container Apps using the Azure CLI
description: Quickstart showing how to create a service connection in Azure Container Apps using the Azure CLI
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
ms.date: 04/13/2023
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---

# Quickstart: Create a service connection in Container Apps with the Azure CLI

This quickstart shows you how to connect Azure Container Apps to other Cloud resources using the Azure CLI and Service Connector. Service Connector lets you quickly connect compute services to cloud services, while managing your connection's authentication and networking settings.

> [!IMPORTANT]
> Service Connector in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- At least one application deployed to Container Apps in a [region supported by Service Connector](./concept-region-support.md). If you don't have one, [create and deploy a container to Container Apps](../container-apps/quickstart-portal.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- Version 2.37.0 or higher of the Azure CLI must be installed. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.

- The Container Apps extension must be installed in the Azure CLI or the Cloud Shell. To install it, run `az extension add --name containerapp`.

## Initial set-up

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

    ```azurecli
    az provider register -n Microsoft.ServiceLinker
    ```

    > [!TIP]
    > You can check if the resource provider has already been registered by running the command `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.

1. Optionally, run the command [az containerapp connection list-support-types](/cli/azure/containerapp/connection#az-containerapp-connection-list-support-types) to get a list of supported target services for Container Apps.

    ```azurecli
    az containerapp connection list-support-types --output table
    ```

## Create a service connection

You can create a connection using an access key or a managed identity.

### [Access key](#tab/using-access-key)

1. Run the `az containerapp connection create` command to create a service connection between Container Apps and Azure Blob Storage with an access key.

    ```azurecli
    az containerapp connection create storage-blob --secret
    ```

1. Provide the following information at the Azure CLI's request:

    | Setting                                                        | Description                                                                                        |
    |----------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
    | `The resource group that contains the container app`           | The name of the resource group with the container app.                                             |
    | `Name of the container app`                                    | The name of the container app.                                                                     |
    | `The container where the connection information will be saved` | The name of the container app's container.                                                         |
    | `The resource group which contains the storage account`        | The name of the resource group with the storage account.                                           |
    | `Name of the storage account`                                  | The name of the storage account you want to connect to. In this guide, we're using a Blob Storage. |

> [!TIP]
> If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --secret` to provision a new Blob Storage and directly connect it to your container app using a connection string.

### [Managed identity](#tab/using-managed-identity)

> [!IMPORTANT]
> To use a managed identity, you must have the permission to modify [Azure AD role assignment](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). Without this permission, your connection creation will fail. Ask your subscription owner to grant you this permission, or use an access key instead to create the connection.

1. Run the `az containerapp connection create` command to create a service connection from Container Apps to a Blob Storage with a system-assigned managed identity.

    ```azurecli
    az containerapp connection create storage-blob --system-identity
    ```

1. Provide the following information at the Azure CLI's request:

    | Setting                                                        | Description                                                                                        |
    |----------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
    | `The resource group that contains the container app`           | The name of the resource group with the container app.                                             |
    | `Name of the container app`                                    | The name of the container app.                                                                     |
    | `The container where the connection information will be saved` | The name of the container app's container.                                                         |
    | `The resource group which contains the storage account`        | The name of the resource group with the storage account.                                           |
    | `Name of the storage account`                                  | The name of the storage account you want to connect to. In this guide, we're using a Blob Storage. |

> [!NOTE]
> If you don't have a Blob Storage, you can run `az containerapp connection create storage-blob --new --system-identity` to provision a new Blob Storage and directly connect it to your container app using a managed identity.

---

## View connections

 Use the Azure CLI command `az containerapp connection list` to list all your container app's provisioned connections. Replace the placeholders `<container-app-resource-group>` and `<container-app-name>` from the command below with the resource group and name of your container app. You can also remove the `--output table` option to view more information about your connections.

```azurecli
az containerapp connection list -g "<container-app-resource-group>" --name "<container-app-name>" --output table
```

The output also displays the provisioning state of your connections: failed or succeeded.

## Next steps

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)
