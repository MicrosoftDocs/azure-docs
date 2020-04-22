---
title: Azure CLI script sample - Import to an App Configuration store
titleSuffix: Azure App Configuration
description: Use Azure CLI script - Importing configuration to Azure App Configuration
services: azure-app-configuration
author: lisaguthrie
ms.service: azure-app-configuration
ms.devlang: azurecli
ms.topic: sample
ms.date: 02/19/2020
ms.author: lcozzens
---

# Import to an Azure App Configuration store

This sample script imports key-value settings to an Azure App Configuration store.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the Azure CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. To install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

```azurecli-interactive
#!/bin/bash

# Import key-values from a file
az appconfig kv import --name myTestAppConfigStore --source file --path ~/Import.json
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to import to an App Configuration store. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az appconfig kv import](/cli/azure/appconfig/kv#az-appconfig-kv-import) | Imports to an App Configuration store resource. |

## Next steps

For more information on the Azure CLI, see the [Azure CLI documentation](/cli/azure).

Additional App Configuration CLI script samples can be found in the [Azure App Configuration CLI samples](../cli-samples.md).
