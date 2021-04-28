---
title: Azure CLI Script Sample - Export from an Azure App Configuration Store
titleSuffix: Azure App Configuration
description: Use Azure CLI script to export configuration from Azure App Configuration
services: azure-app-configuration
author: AlexandraKemperMS

ms.service: azure-app-configuration
ms.devlang: azurecli
ms.topic: sample
ms.date: 02/19/2020
ms.author: alkemper 
ms.custom: devx-track-azurecli
---

# Export from an Azure App Configuration store

This sample script exports key-values from an Azure App Configuration store.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

```azurecli-interactive
#!/bin/bash

# Export all key-values
az appconfig kv export --name myTestAppConfigStore --file ~/Export.json
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to export from an App Configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az appconfig kv export](/cli/azure/appconfig/kv#az_appconfig_kv_export) | Exports from an App Configuration store resource. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Configuration CLI script samples can be found in the [Azure App Configuration CLI samples](../cli-samples.md).
