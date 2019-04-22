---
title: Azure CLI Script Sample - Create a Premium Azure Cache for Redis with clustering | Microsoft Docs
description: Azure CLI Script Sample - Create a Premium tier Azure Cache for Redis with clustering
services: cache
documentationcenter: ''
author: yegu-ms
manager: jhubbard
editor: 
tags: azure-service-management

ms.assetid: 07bcceae-2521-4fe3-b88f-ed833104ddd2
ms.service: cache
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 08/30/2017
ms.author: yegu
---

# Create a Premium Azure Cache for Redis with clustering

In this scenario, you learn how to create a 6 GB Premium tier Azure Cache for Redis with clustering enabled and two shards.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/redis-cache/create-premium-cache-cluster/create-premium-cache-cluster.sh "Azure Cache for Redis")]

[!INCLUDE [cli-script-clean-up](../../../includes/redis-cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to create a resource group and a Premium tier Azure Cache for Redis with clustering enable. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az redis create](https://docs.microsoft.com/cli/azure/redis) | Create Azure Cache for Redis instance. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Cache for Redis CLI script samples can be found in the [Azure Cache for Redis documentation](../cli-samples.md).
