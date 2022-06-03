---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/30/2022
---
Delete the resource group by using the [az group delete](/cli/azure/group#az-group-delete) command.

#### [bash](#tab/terminal-bash)

```azurecli
RESOURCE_GROUP_NAME='msdocs-expressjs-mongodb-tutorial'

# Removing a resource group will delete all Azure resources inside the resource group!
az group delete \
    --name $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$resourceGroupName='msdocs-expressjs-mongodb-tutorial'

# Removing a resource group will delete all Azure resources inside the resource group!
az group delete `
    --name $resourceGroupName
```

---
