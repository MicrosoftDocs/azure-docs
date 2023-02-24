---
title: Azure CLI Script Sample - Create a SignalR Service
description: Learn by following the sample script to create a new Azure SignalR Service in a new resource group, with a random name.
author: vicancy
ms.service: signalr
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/30/2022
ms.author: lianwei
ms.custom: mvc, devx-track-azurecli
---

# Create a SignalR Service

This sample script creates a new Azure SignalR Service resource in a new resource group with a random name.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/azure-signalr/create-signalr-service-and-group/create-signalr-service-and-group.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

Each command in the table links to command specific documentation. This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az signalr create](/cli/azure/signalr#az-signalr-create) | Creates an Azure SignalR Service resource. |
| [az signalr key list](/cli/azure/signalr/key#az-signalr-key-list) | List the keys, which will be used by your application when pushing real-time content updates with SignalR. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).

Additional Azure SignalR Service CLI script samples can be found in the [Azure SignalR Service documentation](../signalr-reference-cli.md).
