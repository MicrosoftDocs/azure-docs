---
title: Azure CLI Script Sample - Work with key-values in App Configuration Store
titleSuffix: Azure App Configuration
description: Provides information on working with key-values in an Azure App Configuration store
services: azure-app-configuration
documentationcenter: ''
author: lisaguthrie
manager: maiye
editor: ''

ms.service: azure-app-configuration
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: azure-app-configuration
ms.date: 11/08/2019
ms.author: lcozzens
ms.custom: mvc
---

# Work with key-values in an Azure App Configuration store

This sample script creates a new key-value in an Azure App Configuration store, lists all existing key-values, updates the value of the newly created key, and lastly deletes it.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

You need to install the Azure App Configuration CLI extension first by executing the following command:

        az extension add -n appconfig

## Sample script

```azurecli-interactive
#!/bin/bash

appConfigName=myTestAppConfigStore
newKey="TestKey"
refKey="KeyVaultReferenceTestKey"
uri="[URL to value stored in Key Vault]"
uri2="[URL to another value stored in Key Vault]"

# Create a new key-value 
az appconfig kv set --name $appConfigName --key $newKey --value "Value 1"

# List current key-values
az appconfig kv list --name $appConfigName

# Update new key's value
az appconfig kv set --name $appConfigName --key $newKey --value "Value 2"

# List current key-values
az appconfig kv list --name $appConfigName

# Create a new key-value referencing a value stored in Azure Key Vault
az appconfig kv set --name $appConfigName --key $refKey --content-type "application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8" --value "{\"uri\":\"$uri\"}"

# List current key-values
az appconfig kv list --name $appConfigName

# Update Key Vault reference
az appconfig kv set --name $appConfigName --key $refKey --value "{\"uri\":\"$uri2\"}"

# List current key-values
az appconfig kv list --name $appConfigName

# Delete new key
az appconfig kv delete  --name $appConfigName --key $newKey

# Delete Key Vault reference
az appconfig kv delete --name $appConfigName --key $refKey

# List current key-values
az appconfig kv list --name $appConfigName
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to operate on key-values in an App Configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az appconfig kv set](/cli/azure/ext/appconfig/appconfig/kv#ext-appconfig-az-appconfig-kv-set) | Creates or updates a key-value. |
| [az appconfig kv list](/cli/azure/ext/appconfig/appconfig/kv#ext-appconfig-az-appconfig-kv-list) | Lists key-values in an App Configuration store. |
| [az appconfig kv delete](/cli/azure/ext/appconfig/appconfig/kv#ext-appconfig-az-appconfig-kv-delete) | Deletes a key-value. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Configuration CLI script samples can be found in the [Azure App Configuration CLI samples](../cli-samples.md).
