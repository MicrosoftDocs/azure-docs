---
title: Quickstart - Create a service connection in App Service with the Azure CLI
description: Quickstart showing how to create a service connection in App Service with the Azure CLI
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
ms.date: 04/13/2023
ms.devlang: azurecli
ms.custom: event-tier1-build-2022, devx-track-azurecli
---
# Quickstart: Create a service connection in App Service with the Azure CLI

The [Azure CLI](/cli/azure) is a set of commands used to create and manage Azure resources. The Azure CLI is available across Azure services and is designed to get you working quickly with Azure, with an emphasis on automation. This quickstart shows you the options to create a service connection with the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.30.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
- This quickstart assumes that you already have at least an App Service running on Azure. If you don't have an App Service, [create one](../app-service/quickstart-dotnetcore.md).

## Initial set-up

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```

   > [!TIP]
   > You can check if the resource provider has already been registered by running the command  `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.
   >
2. Optionally, use the Azure CLI [az webapp connection list-support-types](/cli/azure/webapp/connection#az-webapp-connection-list-support-types) command to get a list of supported target services for App Service.

   ```azurecli
   az webapp connection list-support-types --output table
   ```

## Create a service connection

#### [Using an access key](#tab/Using-access-key)

Use the Azure CLI [az webapp connection create](/cli/azure/webapp/connection/create) command to create a service connection to an Azure Blob Storage with an access key, providing the following information:

- **Source compute service resource group name:** the resource group name of the App Service.
- **App Service name:** the name of your App Service that connects to the target service.
- **Target service resource group name:** the resource group name of the Blob Storage.
- **Storage account name:** the account name of your Blob Storage.

```azurecli
az webapp connection create storage-blob --secret
```

> [!NOTE]
> If you don't have a Blob Storage, you can run `az webapp connection create storage-blob --new --secret` to provision a new one and directly get connected to your app service.

#### [Using a managed identity](#tab/Using-Managed-Identity)

> [!IMPORTANT]
> Using Managed Identity requires you have the permission to [Microsoft Entra role assignment](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). If you don't have the permission, your connection creation would fail. You can ask your subscription owner for the permission or using access key to create the connection.

Use the Azure CLI [az webapp connection](/cli/azure/webapp/connection) command to create a service connection to a Blob Storage with a System-assigned Managed Identity, providing the following information:

- **Source compute service resource group name:** the resource group name of the App Service.
- **App Service name:** the name of your App Service that connects to the target service.
- **Target service resource group name:** the resource group name of the Blob Storage.
- **Storage account name:** the account name of your Blob Storage.

```azurecli
az webapp connection create storage-blob --system-identity
```

> [!NOTE]
> If you don't have a Blob Storage, you can run `az webapp connection create storage-blob --new --system-identity` to provision a new one and directly get connected to your app service.

---

## View connections

Use the Azure CLI [az webapp connection](/cli/azure/webapp/connection) command to list connections to your App Service, providing the following information:

- **Source compute service resource group name:** the resource group name of the App Service.
- **App Service name:** the name of your App Service that connects to the target service.

```azurecli
az webapp connection list -g "<your-app-service-resource-group>" -n "<your-app-service-name>" --output table
```

## Next steps

Follow the tutorials listed below to start building your own application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: WebApp + Storage with Azure CLI](./tutorial-csharp-webapp-storage-cli.md)

> [!div class="nextstepaction"]
> [Tutorial: WebApp + PostgreSQL with Azure CLI](./tutorial-django-webapp-postgres-cli.md)
