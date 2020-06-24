---
title: Azure CLI script sample - Deploy a managed application
description: Provides Azure CLI sample script that deploys an Azure Managed Application definition to the subscription.
author: tfitzmac

ms.devlang: azurecli
ms.topic: sample
ms.date: 10/25/2017
ms.author: tomfitz
---

# Deploy a managed application for service catalog with Azure CLI

This script deploys a managed application definition from the service catalog. 


[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli[main](../../../../cli_scripts/managed-applications/create-application/create-application.sh "Create application")]


## Script explanation

This script uses the following command to deploy the managed application. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az managedapp create](https://docs.microsoft.com/cli/azure/managedapp#az-managedapp-create) | Create a managed application. Provide the definition ID and parameters for the template. |


## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).
