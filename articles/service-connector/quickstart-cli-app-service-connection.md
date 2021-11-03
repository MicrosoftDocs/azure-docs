---
title: Quickstart - Create a service connection in App Service with the Azure CLI
description: Quickstart showing how to create a service connection in App Service with the Azure CLI
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: quickstart
ms.date: 10/29/2021
ms.custom: ignite-fall-2021
---

# Quickstart: Create a service connection in App Service with the Azure CLI

The [Azure command-line interface (Azure CLI)](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. This quickstart shows you the options to create Azure Web PubSub instance with the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.22.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- This quickstart assumes that you already have at least an App Service running on Azure. If you don't have an App Service, [create one](../app-service/quickstart-dotnetcore.md).

## View supported target service types

Use the Azure CLI [az webapp connection]() command create and manage service connections to App Service. 

```azurecli-interactive
az provider register -n Microsoft.ServiceLinker
az webapp connection list-support-types
```

## Create a service connection

Use the Azure CLI [az webapp connection]() command to create a service connection to a blob storage, providing the following information:

- **Source compute service resource group name:** The resource group name of the App Service.
- **App Service name:** The name of your App Service that connects to the target service.
- **Target service resource group name:** The resource group name of the blob storage.
- **Storage account name:** The account name of your blob storage.

```azurecli-interactive
az webapp connection create storage-blob -g <app_service_resource_group> -n <app_service_name> --tg <storage_resource_group> --account <storage_account_name> --system-identity
```

> [!NOTE]
> If you don't have a blob storage, you can run `az webapp connection create storage-blob -g <app_service_resource_group> -n <app_service_name> --tg <storage_resource_group> --account <storage_account_name> --system-identity --new` to provision a new one and directly get connected to your app service.

## View connections

Use the Azure CLI [az webapp connection]() command to list connection to your App Service, providing the following information:

- **Source compute service resource group name:** The resource group name of the App Service.
- **App Service name:** The name of your App Service that connects to the target service.

```azurecli-interactive
az webapp connection list -g "<your-app-service-resource-group>" --webapp "<your-app-service-name>"
```

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: WebApp + Storage with Azure CLI](./tutorial-csharp-webapp-storage-cli.md)

> [!div class="nextstepaction"]
> [Tutorial: WebApp + PostgreSQL with Azure CLI](./tutorial-django-webapp-postgres-cli.md)
