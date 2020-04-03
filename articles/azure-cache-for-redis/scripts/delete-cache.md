---
title: Delete an Azure Cache for Redis - Azure CLI 
description: This Azure CLI code sample shows how to delete an Azure Cache for Redis instance using the command az redis delete.
author: yegu-ms
ms.author: yegu
tags: azure-service-management
ms.service: cache
ms.devlang: azurecli
ms.topic: sample
ms.date: 08/30/2017
---

# Delete an Azure Cache for Redis

In this scenario, you learn how to delete an Azure Cache for Redis.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script

[!code-azurecli[main](../../../cli_scripts/redis-cache/delete-cache/delete-cache.sh "Azure Cache for Redis")]

[!INCLUDE [cli-script-clean-up](../../../includes/redis-cli-script-clean-up.md)]

## Script explanation

This script uses the following commands to delete an Azure Cache for Redis instance. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az redis delete](https://docs.microsoft.com/cli/azure/redis) | Delete Azure Cache for Redis instance. |


## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Cache for Redis CLI script samples can be found in the [Azure Cache for Redis documentation](../cli-samples.md).
