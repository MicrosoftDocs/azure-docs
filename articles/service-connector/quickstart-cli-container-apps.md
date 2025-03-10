---
title: 'Create a service connection in Container Apps - Azure CLI'
description: Learn how to create a service connection in Azure Container Apps using the Azure CLI. This quickstart guides you through the process step-by-step.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
ms.date: 12/18/2024
ms.devlang: azurecli
ms.custom: devx-track-azurecli, build-2024
---

# Quickstart: Create a service connection in Azure Container Apps with the Azure CLI (preview)

This quickstart shows you how to connect Azure Container Apps to other Cloud resources using the Azure CLI and Service Connector (preview). Service Connector lets you quickly connect compute services to cloud services, while managing your connection's authentication and networking settings.

## Prerequisites

- An active Azure subscription. [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

- At least one application deployed to Azure Container Apps in a [region supported by Service Connector](./concept-region-support.md). If you don't have one, [create and deploy a container to Container Apps](../container-apps/quickstart-portal.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- Version 2.37.0 or higher of the Azure CLI must be installed. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.

- The Container Apps extension must be installed in the Azure CLI or the Cloud Shell. To install it, run `az extension add --name containerapp`.

## Set up your environment

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

## Create a service connection (preview)

Create a connection using a managed identity or an access key.

### [Managed identity](#tab/using-managed-identity)

> [!IMPORTANT]
> To use a managed identity, you must have the permission to modify [Microsoft Entra role assignment](/entra/identity/role-based-access-control/manage-roles-portal). Ask your subscription owner to grant you this permission, or use an access key instead to create the connection.

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

### [Access key](#tab/using-access-key)

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

1. Run the `az containerapp connection create` command to create a service connection between Container Apps and Azure Blob Storage using an access key.

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

---

## View connections

 Use the Azure CLI command `az containerapp connection list` to list all your container app's provisioned connections. Replace the placeholders `<container-app-resource-group>` and `<container-app-name>` from the command below with the resource group and name of your container app. You can also remove the `--output table` option to view more information about your connections.

```azurecli
az containerapp connection list -g "<container-app-resource-group>" --name "<container-app-name>" --output table
```

The output also displays the provisioning state of your connections: failed or succeeded.

## Related links

- [Container Apps: Connect Java Quarkus app to PostgreSQL](../container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database.md?bc=%2fazure%2fservice-connector%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fservice-connector%2fTOC.json)
- [Container Apps: Connect ASP.NET Core app to App Configuration](../azure-app-configuration/quickstart-container-apps.md?bc=%2fazure%2fservice-connector%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fservice-connector%2fTOC.json)


