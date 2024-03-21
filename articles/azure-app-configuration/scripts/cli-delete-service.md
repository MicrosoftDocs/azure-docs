---
title: Azure CLI Script Sample - Delete an Azure App Configuration Store
titleSuffix: Azure App Configuration
description: Delete an Azure App Configuration store using a sample Azure CLI script. See reference article links to commands used in the script.
services: azure-app-configuration
author: maud-lv

ms.service: azure-app-configuration
ms.devlang: azurecli
ms.topic: sample
ms.date: 02/19/2020
ms.author: malev 
ms.custom: devx-track-azurecli
---

# Delete an Azure App Configuration store with the Azure CLI

This sample script deletes an instance of Azure App Configuration using the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

 - This tutorial requires version 2.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Sample script

```azurecli-interactive
#/bin/bash

# Delete an App Configuration store named myTestAppConfigStore from the Resource Group myResourceGroup
az appconfig delete --name myTestAppConfigStore --resource-group myResourceGroup
```

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to delete an App Configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az appconfig delete](/cli/azure/appconfig#az-appconfig-delete) | Deletes an App Configuration store resource. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Configuration CLI script samples can be found in the [Azure App Configuration CLI samples](../cli-samples.md).
