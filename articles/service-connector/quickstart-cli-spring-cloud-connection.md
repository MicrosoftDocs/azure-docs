---
title: Quickstart - Create a service connection in Spring Cloud with the Azure CLI
description: Quickstart showing how to create a service connection in Spring Cloud with the Azure CLI
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: quickstart
ms.date: 03/24/2022
ms.devlang: azurecli
ms.custom: event-tier1-build-2022
---

# Quickstart: Create a service connection in Spring Cloud with the Azure CLI

The [Azure CLI](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. This quickstart shows you several options to create an Azure Web PubSub instance with the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- Version 2.30.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- At least one Spring Cloud application running on Azure. If you don't have a Spring Cloud application, [create one](../spring-cloud/quickstart.md).

## View supported target service types

Use the Azure CLI [[az spring-cloud connection](quickstart-cli-spring-cloud-connection.md)] command to create and manage service connections to your Spring Cloud application.

```azurecli-interactive
az provider register -n Microsoft.ServiceLinker
az spring-cloud connection list-support-types --output table
```

## Create a service connection

### [Using an access key](#tab/Using-access-key)

Use the Azure CLI command `az spring-cloud connection` to create a service connection to an Azure Blob Storage with an access key, providing the following information:

- **Spring Cloud resource group name:** the resource group name of the Spring Cloud.
- **Spring Cloud name:** the name of your Spring Cloud.
- **Spring Cloud app name:** the name of your Spring Cloud app that connects to the target service.
- **Target service resource group name:** the resource group name of the Blob Storage.
- **Storage account name:** the account name of your Blob Storage.

```azurecli-interactive
az spring-cloud connection create storage-blob --secret
```

> [!NOTE]
> If you don't have a Blob Storage, you can run `az spring-cloud connection create storage-blob --new --secret` to provision a new one and directly get connected to your app service.

### [Using Managed Identity](#tab/Using-Managed-Identity)

> [!IMPORTANT]
> To use Managed Identity, you must have permission to manage [role assignments in Azure Active Directory](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). If you don't have this permission, your connection creation will fail. You can ask your subscription owner to grant you a role assignment permission or use an access key to create the connection.

Use the Azure CLI command `az spring-cloud connection` to create a service connection to a Blob Storage with System-assigned Managed Identity, providing the following information:

- **Spring Cloud resource group name:** the resource group name of the Spring Cloud.
- **Spring Cloud name:** the name of your Spring Cloud.
- **Spring Cloud app name:** the name of your Spring Cloud app that connects to the target service.
- **Target service resource group name:** the resource group name of the Blob Storage.
- **Storage account name:** the account name of your Blob Storage.

```azurecli-interactive
az spring-cloud connection create storage-blob --system-identity
```

> [!NOTE]
> If you don't have a Blob Storage, you can run `az spring-cloud connection create --system-identity --new --secret` to provision a new one and directly get connected to your app service.

---

## View connections

Use the Azure CLI [az spring-cloud connection](quickstart-cli-spring-cloud-connection.md) command to list connection to your Spring Cloud application, providing the following information:

```azurecli-interactive
az spring-cloud connection list -g <your-spring-cloud-resource-group> --spring-cloud <your-spring-cloud-name>
```

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: Spring Cloud + MySQL](./tutorial-java-spring-mysql.md)
> [Tutorial: Spring Cloud + Apache Kafka on Confluent Cloud](./tutorial-java-spring-confluent-kafka.md)
