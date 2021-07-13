---
title: Azure CLI script sample - Create custom topic | Microsoft Docs
description: This article provides a sample Azure CLI script that shows how to create an Azure Event Grid custom topic.
ms.devlang: azurecli
ms.topic: sample
ms.date: 07/08/2020 
ms.custom: devx-track-azurecli
---

# Create Event Grid custom topic with Azure CLI

This script creates an Event Grid custom topic.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/event-grid/create-custom-topic/create-custom-topic.sh "Create custom topic")]

## Script explanation

This script uses the following command to create the custom topic. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az eventgrid topic create](/cli/azure/eventgrid/topic#az_eventgrid_topic_create) | Create an Event Grid custom topic. |


## Next steps

* For information about querying subscriptions, see [Query Event Grid subscriptions](../query-event-subscriptions.md).
* For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
