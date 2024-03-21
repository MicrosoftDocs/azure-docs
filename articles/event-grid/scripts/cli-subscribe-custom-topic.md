---
title: Azure CLI script sample - Create custom topic and send event | Microsoft Docs
description: This article provides a sample Azure CLI script that shows how to create a custom topic and send an event to the custom topic using Azure CLI. 
ms.devlang: azurecli
ms.topic: sample
ms.date: 03/29/2022 
ms.custom: devx-track-azurecli
---

# Create custom topic and subscribe to events for an Azure subscription with Azure CLI

This article provides a sample Azure CLI script that shows how to create a custom topic and send an event to the custom topic using Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Sample script

[!INCLUDE [cli-launch-cloud-shell-sign-in.md](../../../includes/cli-launch-cloud-shell-sign-in.md)]

### Run the script

:::code language="azurecli" source="~/azure_cli_scripts/event-grid/create-topic-subscribe/event-grid.sh" id="FullScript":::

## Clean up resources

[!INCLUDE [cli-clean-up-resources.md](../../../includes/cli-clean-up-resources.md)]

```azurecli
az group delete --name $resourceGroup
```

## Sample reference

This script uses the following command to create the event subscription. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create) | Create an Event Grid subscription. |

## Next steps

* For information about querying subscriptions, see [Query Event Grid subscriptions](../query-event-subscriptions.md).
* For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
