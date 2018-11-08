---
title: Azure CLI script sample - Create custom topic | Microsoft Docs
description: Azure CLI Script Sample - Create custom topic
services: event-grid
documentationcenter: na
author: tfitzmac

ms.service: event-grid
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/02/2018
ms.author: tomfitz
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
| [az eventgrid topic create](https://docs.microsoft.com/cli/azure/eventgrid/topic#az-eventgrid-topic-create) | Create an Event Grid custom topic. |


## Next steps

* For information about querying subscriptions, see [Query Event Grid subscriptions](../query-event-subscriptions.md).
* For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).
