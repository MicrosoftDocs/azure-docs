---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/15/2025
ms.author: glenga
---

## Update application settings

To enable the Functions host to connect to the default storage account using shared secrets, you must replace the `AzureWebJobsStorage` connection string setting with a complex setting, prefixed with `AzureWebJobsStorage`, that uses the user-assigned managed identity to connect to the storage account.

1. Remove the existing `AzureWebJobsStorage` connection string setting:

    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="52" :::

    The [az functionapp config appsettings delete](/cli/azure/functionapp/config/appsettings#az-functionapp-config-appsettings-delete) command removes this setting from your app.

1. Add equivalent settings, with an `AzureWebJobsStorage__` prefix, that define a user-assigned managed identity connection to the default storage account:
 
    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="47-51" :::