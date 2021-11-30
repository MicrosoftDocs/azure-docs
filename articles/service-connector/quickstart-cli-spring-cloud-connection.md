---
title: Quickstart - Create a service connection in Spring Cloud with the Azure CLI
description: Quickstart showing how to create a service connection in Spring Cloud with the Azure CLI
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: quickstart
ms.date: 10/29/2021
ms.custom: ignite-fall-2021
---

# Quickstart: Create a service connection in Spring Cloud with the Azure CLI

The [Azure command-line interface (Azure CLI)](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. This quickstart shows you the options to create Azure Web PubSub instance with the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- This quickstart assumes that you already have at least a Spring Cloud application running on Azure. If you don't have a Spring Cloud application, [create one](../spring-cloud/quickstart.md).


## View supported target service types

Use the Azure CLI [az spring-cloud connection]() command create and manage service connections to your Spring Cloud application. 

```azurecli-interactive
az provider register -n Microsoft.ServiceLinker
az spring-cloud connection list-support-types
```

## Create a service connection

Use the Azure CLI [az spring-cloud connection]() command to create a service connection to a blob storage, providing the following information:

- **Spring Cloud resource group name:** The resource group name of the Spring Cloud.
- **Spring Cloud name:** The name of your Spring Cloud.
- **Spring Cloud app name:** The name of your Spring Cloud app that connects to the target service.
- **Target service resource group name:** The resource group name of the blob storage.
- **Storage account name:** The account name of your blob storage.

```azurecli-interactive
az spring-cloud connection create storage-blob -g <spring_cloud_resource_group> --service <spring_cloud_name> --app <app_name> --deployment default --tg <storage_resource_group> --account <storage_account_name> --system-identity
```

> [!NOTE]
> If you don't have a blob storage, you can run `az spring-cloud connection create storage-blob -g <app_service_resource_group> -n <app_service_name> --tg <storage_resource_group> --account <storage_account_name> --system-identity --new` to provision a new one and directly get connected to your app service.

## View connections

Use the Azure CLI [az spring-cloud connection]() command to list connection to your Spring Cloud application, providing the following information:

```azurecli-interactive
az spring-cloud connection list -g <your-spring-cloud-resource-group> --spring-cloud <your-spring-cloud-name>
```

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: Spring Cloud + MySQL](./tutorial-java-spring-mysql.md)

> [!div class="nextstepaction"]
> [Tutorial: Spring Cloud + Apache Kafka on Confluent Cloud](./tutorial-java-spring-confluent-kafka.md)
