---
title: Azure CLI script sample - Import to an App Configuration store
titleSuffix: Azure App Configuration
description: Use Azure CLI script - Importing configuration to Azure App Configuration.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/12/2024
ms.author: malev 
ms.custom: devx-track-azurecli
---

# Import to an Azure App Configuration store

This sample script imports key-value settings to an Azure App Configuration store.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

```azurecli-interactive
#!/bin/bash

# Import key-values from a file
az appconfig kv import --name myTestAppConfigStore --source file --format json --path ~/Import.json
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to import to an App Configuration store. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az appconfig kv import](/cli/azure/appconfig/kv#az-appconfig-kv-import) | Imports to an App Configuration store resource. |

## Next steps

For more information on the Azure CLI, see the [Azure CLI documentation](/cli/azure).

More App Configuration CLI script samples can be found in the [Azure App Configuration CLI samples](../cli-samples.md).
