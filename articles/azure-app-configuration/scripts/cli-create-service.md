---
title: Azure CLI Script Sample - Create an Azure App Configuration Store
titleSuffix: Azure App Configuration
description: Use Azure CLI Script to create an Azure App Configuration store
services: azure-app-configuration
author: lisaguthrie

ms.service: azure-app-configuration
ms.topic: sample
ms.date: 01/24/2020
ms.author: lcozzens
---

# Create an Azure App Configuration Store

This sample script creates a new instance of Azure App Configuration in a new resource group.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Sample script

```azurecli-interactive
#!/bin/bash

appConfigName=myTestAppConfigStore
#resource name must be lowercase
myAppConfigStoreName=${appConfigName,,}
myResourceGroupName=$appConfigName"Group"

# Create resource group 
az group create --name $myResourceGroupName --location eastus

# Create the Azure AppConfig Service resource and query the hostName
appConfigHostname=$(az appconfig create \
  --name $myAppConfigStoreName \
  --location eastus \
  --resource-group $myResourceGroupName \
  --query endpoint \
  --sku free \
  -o tsv
  )

# Get the AppConfig connection string 
appConfigConnectionString=$(az appconfig credential list \
--resource-group $myResourceGroupName \
--name $myAppConfigStoreName \
--query "[?name=='Secondary Read Only'] .connectionString" -o tsv)

# Echo the connection string for use in your application
echo "$appConfigConnectionString"
```

Make a note of the actual name generated for the new resource group. You will use that resource group name when you want to delete all group resources.

[!INCLUDE [cli-script-cleanup](../../../includes/cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a new resource group and an App Configuration store. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az appconfig create](/cli/azure/appconfig#az-appconfig-create) | Creates an App Configuration store resource. |
| [az appconfig credential list](/cli/azure/appconfig/credential#az-appconfig-credential-list) | List access keys for an App Configuration store. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional App Configuration CLI script samples can be found in the [Azure App Configuration  CLI samples](../cli-samples.md).
