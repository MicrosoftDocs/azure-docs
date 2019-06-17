---
title: Azure CLI Script Sample - Get details of an Azure Cache for Redis | Microsoft Docs
description: Azure CLI Script Sample - Get details of an Azure Cache for Redis
services: cache
documentationcenter: ''
author: yegu-ms
manager: jhubbard
editor: 
tags: azure-service-management

ms.assetid: 155924e6-00d5-4a8c-ba99-5189f300464a
ms.service: cache
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 08/30/2017
ms.author: yegu
---

# Get details of an Azure Cache for Redis

In this scenario, you learn how to retrieve the details of an Azure Cache for Redis instance, including its provisioning status.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/redis-cache/show-cache/show-cache.sh "Azure Cache for Redis")]

## Script explanation

This script uses the following commands to retrieve the details of an Azure Cache for Redis instance. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az redis show](https://docs.microsoft.com/cli/azure/redis) | Retrieve details of an Azure Cache for Redis instance. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Cache for Redis CLI script samples can be found in the [Azure Cache for Redis documentation](../cli-samples.md).
