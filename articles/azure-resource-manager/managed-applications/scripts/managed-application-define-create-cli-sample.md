---
title:  Create managed application definition - Azure CLI
description: Provides an Azure CLI script sample that publishes a managed application definition to a service catalog and then deploys a managed application definition from the service catalog.
author: davidsmatlak
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/07/2022
ms.author: davidsmatlak 
ms.custom: devx-track-azurecli
---

# Create a managed application definition to service catalog and deploy managed application from service catalog with Azure CLI

This script publishes a managed application definition to a service catalog and then deploys a managed application definition from the service catalog.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../../includes/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/managed-applications/create-application/create-managed-application.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $appResourceGroup -y
az group delete --name $appDefinitionResourceGroup -y
```

## Sample reference

This script uses the following command to create the managed application definition. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az managedapp definition create](/cli/azure/managedapp/definition#az-managedapp-definition-create) | Create a managed application definition. Provide the package that contains the required files. |

## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
