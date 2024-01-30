---
title: Quickstart - Create a service connection in Azure Spring Apps with the Azure CLI
description: Quickstart showing how to create a service connection in Azure Spring Apps with the Azure CLI
displayName: 
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
ms.date: 10/31/2022
ms.devlang: azurecli
ms.custom: event-tier1-build-2022, devx-track-azurecli
---

# Quickstart: Create a service connection in Azure Spring Apps with the Azure CLI

This quickstart shows you how to connect Azure Spring Apps to other Cloud resources using the Azure CLI and Service Connector.

Service Connector lets you quickly connect compute services to cloud services, while managing your connection's authentication and networking settings.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- At least one application hosted by Azure Spring Apps in a [region supported by Service Connector](./concept-region-support.md). If you don't have one, [deploy your first application to Azure Spring Apps](../spring-apps/quickstart.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- Version 2.37.0 or higher of the Azure CLI. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.

- The Azure Spring Apps extension must be installed in the Azure CLI or the Cloud Shell. To install it, run `az extension add --name spring`.

## Initial set up

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

    ```azurecli
    az provider register -n Microsoft.ServiceLinker
    ```

    > [!TIP]
    > You can check if the resource provider has already been registered by running the command `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.

1. Optionally, run the command [az spring connection list-support-types](/cli/azure/spring/connection#az-spring-connection-list-support-types) to get a list of supported target services for Azure Spring Apps.

    ```azurecli
    az spring connection list-support-types --output table
    ```

    > [!TIP]
    > If the `az spring` command isn't recognized by the system, check that you have installed the required extension by running `az extension add --name spring`.

## Create a service connection

Create a connection from Azure Spring Apps using an access key or a managed identity.

### [Access key](#tab/Using-access-key)

1. Run the `az spring connection create` command to create a service connection between Azure Spring Apps and an Azure Blob Storage using an access key.

    ```azurecli
    az spring connection create storage-blob --secret
    ```

1. Provide the following information at the CLI or Cloud Shell's request:

    | Setting                                                 | Description                                                                                        |
    |---------------------------------------------------------|----------------------------------------------------------------------------------------------------|
    | `The resource group which contains the spring-cloud`    | The name of the resource group that contains app hosted by Azure Spring Apps.                      |
    | `Name of the spring-cloud service`                      | The name of the Azure Spring Apps resource.                                                        |
    | `Name of the spring-cloud app`                          | The name of the application hosted by Azure Spring Apps that connects to the target service.       |
    | `The resource group which contains the storage account` | The name of the resource group with the storage account.                                           |
    | `Name of the storage account`                           | The name of the storage account you want to connect to. In this guide, we're using a Blob Storage. |

> [!TIP]
> If you don't have a Blob Storage, you can run `az spring connection create storage-blob --new --secret` to provision a new Blob Storage and directly connect it to your application hosted by Azure Spring Apps using a connection string.

### [Managed identity](#tab/Using-Managed-Identity)

> [!IMPORTANT]
> To use a managed identity, you must have the permission to modify [role assignments in Microsoft Entra ID](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). Without this permission, your connection creation will fail. Ask your subscription owner to grant you a role assignment permission or use an access key to create the connection.

1. Run the `az spring connection create` command to create a service connection to a Blob Storage with a system-assigned managed identity

1. Provide the following information at the CLI or Cloud Shell's request:

    ```azurecli-interactive
    az spring connection create storage-blob --system-identity
    ```

    | Setting                                                 | Description                                                                                        |
    |---------------------------------------------------------|----------------------------------------------------------------------------------------------------|
    | `The resource group which contains the spring-cloud`    | The name of the resource group that contains an app hosted by Azure Spring Apps.                   |
    | `Name of the spring-cloud service`                      | The name of the Azure Spring Apps resource.                                                        |
    | `Name of the spring-cloud app`                          | The name of the application hosted by Azure Spring Apps that connects to the target service.       |
    | `The resource group which contains the storage account` | The name of the resource group with the storage account.                                           |
    | `Name of the storage account`                           | The name of the storage account you want to connect to. In this guide, we're using a Blob Storage. |

> [!TIP]
> If you don't have a Blob Storage, you can run `az spring connection create storage-blob --new --system-identity` to provision a new Blob Storage and directly connect it to your application hosted by Azure Spring Apps using a managed identity.

---

## View connections

Run `az spring connection list` command to list all of your Azure Spring Apps' provisioned connections.

Replace the placeholders `<azure-spring-apps-resource-group>`, `<azure-spring-apps-name>`, and `<app-name>` from the command below with the name of your Azure Spring Apps resource group, the name of your Azure Spring Apps resource, and the name of your application. You can also remove the `--output table` option to view more information about your connections.

```azurecli-interactive
az spring connection list --resource-group <azure-spring-apps-resource-group> --service <azure-spring-apps-name> --app <app-name>--output table
```

The output also displays the provisioning state of your connections: failed or succeeded.

## Next steps

Check the guides below for more information about Service Connector and Azure Spring Apps.

> [!div class="nextstepaction"]
> [Tutorial: Azure Spring Apps + MySQL](./tutorial-java-spring-mysql.md)

> [!div class="nextstepaction"]
> [Tutorial: Azure Spring Apps + Apache Kafka on Confluent Cloud](./tutorial-java-spring-confluent-kafka.md)
