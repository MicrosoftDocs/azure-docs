---
title: Azure CLI Script Sample - Create a SignalR Service
description: Azure CLI Script Sample - Create SignalR Service
author: sffamily
ms.service: signalr
ms.devlang: azurecli
ms.topic: sample
ms.date: 04/20/2018
ms.author: zhshang
ms.custom: mvc
---

# Create a SignalR Service 

This sample script creates a new Azure SignalR Service resource in a new resource group with a random name.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Sample script

This script uses the *signalr* extension for the Azure CLI. Execute the following command to install the *signalr* extension for the Azure CLI before using this sample script:

```azurecli-interactive
az extension add -n signalr
```

This script creates a new SignalR Service resource and a new resource group. 

[!code-azurecli-interactive[main](../../../cli_scripts/azure-signalr/create-signalr-service-and-group/create-signalr-service-and-group.sh "Creates a new Azure SignalR Service resource and resource group")]

Make a note of the actual name generated for the new resource group. You will use that resource group name when you want to delete all group resources.

[!INCLUDE [cli-script-clean-up](../../../includes/cli-script-clean-up.md)]

## Script explanation

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az signalr create](/cli/azure/signalr#az-signalr-create) | Creates an Azure SignalR Service resource. |
| [az signalr key list](/cli/azure/signalr/key#az-signalr-key-list) | List the keys, which will be used by your application when pushing real-time content updates with SignalR. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure SignalR Service CLI script samples can be found in the [Azure SignalR Service documentation](../signalr-reference-cli.md).
