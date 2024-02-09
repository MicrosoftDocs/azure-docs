---
title: Quickstart - Create a service connection in Azure Functions with the Azure CLI
description: Quickstart showing how to create a service connection in Azure Functions with the Azure CLI
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: quickstart
ms.date: 10/25/2023
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---
# Quickstart: Create a service connection in Azure Functions with the Azure CLI

This quickstart shows you how to connect Azure Functions to other Cloud resources using Azure CLI and Service Connector. Service Connector lets you quickly connect compute services to cloud services, while managing your connection's authentication and networking settings.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This quickstart requires version 2.30.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
- This quickstart assumes that you already have an Azure Function. If you don't have one yet, [create an Azure Function](../azure-functions/create-first-function-cli-python.md).
- This quickstart assumes that you already have an Azure Storage account. If you don't have one yet, [create a Azure Storage account](../storage/common/storage-account-create.md).

## Initial set-up

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```

   > [!TIP]
   > You can check if the resource provider has already been registered by running the command  `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.
   >
2. Optionally, use the Azure CLI [az functionapp connection list-support-types](/cli/azure/functionapp/connection#az-webapp-connection-list-support-types) command to get a list of supported target services for Function App.

   ```azurecli
   az functionapp connection list-support-types --output table
   ```

## Create a service connection

#### [Using an access key](#tab/Using-access-key)

Use the Azure CLI [az functionapp connection create](/cli/azure/functionapp/connection/create) command to create a service connection to an Azure Blob Storage with an access key, providing the following information:

- **Source compute service resource group name:** the resource group name of the Function App.
- **Function App name:** the name of your Function App that connects to the target service.
- **Target service resource group name:** the resource group name of the Blob Storage.
- **Storage account name:** the account name of your Blob Storage.

```azurecli
az functionapp connection create storage-blob --secret
```

> [!NOTE]
> If you don't have a Blob Storage, you can run `az functionapp connection create storage-blob --new --secret` to provision a new one and directly get connected to your function app.

#### [Using a managed identity](#tab/Using-Managed-Identity)

> [!IMPORTANT]
> Using Managed Identity requires you have the permission to [Azure AD role assignment](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). If you don't have the permission, your connection creation will fail. You can ask your subscription owner for the permission or use an access key to create the connection.

Use the Azure CLI [az functionapp connection](/cli/azure/functionapp/connection) command to create a service connection to a Blob Storage with a system-assigned managed identity, providing the following information:

- **Source compute service resource group name:** the resource group name of the Function App.
- **Function App name:** the name of your FunctioApp that connects to the target service.
- **Target service resource group name:** the resource group name of the Blob Storage.
- **Storage account name:** the account name of your Blob Storage.

```azurecli
az functionapp connection create storage-blob --system-identity
```

> [!NOTE]
> If you don't have a Blob Storage, you can run `az functionapp connection create storage-blob --new --system-identity` to provision a new one and directly get connected to your function app.

---

## View connections

Use the Azure CLI [az functionapp connection list](/cli/azure/functionapp/connection#az-functionapp-connection-list) command to list connections to your Function App, providing the following information:

- **Source compute service resource group name:** the resource group name of the Function App.
- **Function App name:** the name of your Function App that connects to the target service.

```azurecli
az functionapp connection list -g "<your-function-app-resource-group>" -n "<your-function-app-name>" --output table
```

## Next steps

Follow the tutorials below to start building your own function application with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: Python function with Azure Queue Storage as trigger](./tutorial-python-functions-storage-queue-as-trigger.md)

> [!div class="nextstepaction"]
> [Tutorial: Python function with Azure Blob Storage as input](./tutorial-python-functions-storage-blob-as-input.md)

> [!div class="nextstepaction"]
> [Tutorial: Python function with Azure Table Storage as output](./tutorial-python-functions-storage-table-as-output.md)
