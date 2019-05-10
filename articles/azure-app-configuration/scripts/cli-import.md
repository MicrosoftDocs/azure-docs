---
title: Azure CLI Script Sample - Import to an Azure App Configuration Store | Microsoft Docs
description: Provides information and sample scripts for importing to an Azure App Configuration store
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

# Import to an Azure App Configuration store

This sample script imports key-values to an Azure App Configuration store.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

You need to install the Azure App Configuration CLI extension first by executing the following command:

        az extension add -n appconfig

## Sample script

```azurecli-interactive
#!/bin/bash

# Import key-values from a file
az appconfig kv import --name myTestAppConfigStore --file ~/Import.json
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to import an app configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az appconfig import](/cli/azure/ext/appconfig/appconfig) | Imports to an app configuration store resource. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Configuration CLI script samples can be found in the [Azure App Configuration documentation](../cli-samples.md).
