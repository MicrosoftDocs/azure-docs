---
author: wesmc7777
ms.service: redis-cache
ms.topic: include
ms.date: 11/09/2018
ms.author: wesmc
---
## Clean up deployment 

After the script sample has been run, the follow command can be used to remove the resource group, Azure Cache for Redis instance, and any related resources in the resource group.

```azurecli
az group delete --name contosoGroup
```