---
title: Azure CLI Script Sample - Work with key-values in an Azure App Configuration Store | Microsoft Docs
description: Provides information on working with key-values in an Azure App Configuration store
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.service: azure-app-configuration
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: azure-app-configuration
ms.date: 02/24/2019
ms.author: yegu
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

# Create a new key-value 
az appconfig kv set --name $appConfigName --key $newKey --value "Value 1"

# List current key-values
az appconfig kv list --name $appConfigName

# Update new key's value
az appconfig kv set --name $appConfigName --value "Value 2"

# List current key-values
az appconfig kv list --name $appConfigName

# Delete new key
az appconfig kv delete  --name $appConfigName --key $newKey

# List current key-values
az appconfig kv list --name $appConfigName
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to operate on key-values in an app configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az appconfig kv set](/cli/azure/ext/appconfig/appconfig) | Creates or updates a key-value. |
| [az appconfig kv list](/cli/azure/ext/appconfig/appconfig) | Lists key-values in an app configuration store. |
| [az appconfig kv delete](/cli/azure/ext/appconfig/appconfig) | Deletes a key-value. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Configuration CLI script samples can be found in the [Azure App Configuration documentation](../cli-samples.md).
