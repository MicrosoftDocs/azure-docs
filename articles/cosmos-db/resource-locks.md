---
title: Use locks to protect resources
titleSuffix: Azure Cosmos DB
description: Use Azure resource locks to prevent Azure Cosmos DB resources from being deleted or changed unintentionally. 
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.devlang: azurecli
ms.date: 03/23/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2022
---

# Protect Azure Cosmos DB resources with locks

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

As an administrator, you may need to lock an Azure Cosmos DB account, database or container. Locks prevent other users in your organization from accidentally deleting or modifying critical resources. You can set the lock level to `CanNotDelete` or `ReadOnly`.

| Level | Description |
| --- | --- |
| `CanNotDelete` | Authorized users can still read and modify a resource, but they can't delete the resource. |
| `ReadOnly` | Authorized users can read a resource, but they can't delete or update the resource. Applying this lock is similar to restricting all authorized users to the permissions granted by the **Reader** role. |

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## How locks are applied

When you apply a lock at a parent scope, all resources within that scope inherit the same lock. Even resources you add later inherit the lock from the parent. The most restrictive lock in the inheritance takes precedence.

Unlike Azure role-based access control, you use management locks to apply a restriction across all users and roles. To learn about role-based access control for Azure Cosmos DB see, [Azure role-based access control in Azure Cosmos DB](role-based-access-control.md).

Resource Manager locks apply only to operations that happen in the management plane, which consists of operations sent to `https://management.azure.com`. The locks don't restrict how resources perform their own functions. Resource changes are restricted, but resource operations aren't restricted. For example, a ReadOnly lock on an Azure Cosmos DB container prevents you from deleting or modifying the container. It doesn't prevent you from creating, updating, or deleting data in the container. Data transactions are permitted because those operations aren't sent to `https://management.azure.com`.

## Manage locks

Resource locks don't work for changes made by users accessing Azure Cosmos DB using account keys unless the Azure Cosmos DB account is first locked by enabling the `disableKeyBasedMetadataWriteAccess` property. Ensure this property doesn't break existing applications that make changes to resources using any SDK, Azure portal, or third party tools. Enabling this property breaks applications that connect via account keys to modify resources. These modifications can include changing throughput, updating index policies, etc. To learn more and to go through a checklist to ensure your applications continue to function, see [preventing changes from the Azure Cosmos DB SDKs](role-based-access-control.md#prevent-sdk-changes)

### [PowerShell](#tab/powershell)

```powershell-interactive
$RESOURCE_GROUP_NAME = "<resource-group>"
$ACCOUNT_NAME = "<account-name>"
$LOCK_NAME = "$ACCOUNT_NAME-lock"
```

First, update the account to prevent changes by anything that connects via account keys.

```powershell-interactive
$parameters = @{
    Name = $ACCOUNT_NAME
    ResourceGroupName = $RESOURCE_GROUP_NAME
    DisableKeyBasedMetadataWriteAccess = true
}
Update-AzCosmosDBAccount @parameters
```

Create a Delete Lock on an Azure Cosmos DB account resource and all child resources.

```powershell-interactive
$parameters = @{
    ResourceGroupName = $RESOURCE_GROUP_NAME
    ResourceName = $ACCOUNT_NAME
    LockName = $LOCK_NAME
    ApiVersion = "2020-04-01"
    ResourceType = "Microsoft.DocumentDB/databaseAccounts"
    LockLevel = "CanNotDelete"
}
New-AzResourceLock @parameters
```

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
resourceGroupName='<resource-group>'
accountName='<account-name>'
lockName="$accountName-Lock"
```

First, update the account to prevent changes by anything that connects via account keys.

```azurecli-interactive
az cosmosdb update \
    --resource-group $resourceGroupName  \
    --name $accountName \
    --disable-key-based-metadata-write-access true
```

Create a Delete Lock on an Azure Cosmos DB account resource

```azurecli-interactive
az lock create \
    --resource-group $resourceGroupName  \
    --name $lockName \
    --lock-type 'CanNotDelete' \
    --resource-type Microsoft.DocumentDB/databaseAccount \
    --resource $accountName
```

---

### Template

When applying a lock to an Azure Cosmos DB resource, use the [``Microsoft.Authorization/locks``](/azure/templates/microsoft.authorization/2017-04-01/locks) Azure Resource Manager (ARM) resource.

#### [JSON](#tab/json)

```json
{
  "type": "Microsoft.Authorization/locks",
  "apiVersion": "2017-04-01",
  "name": "cosmoslock",
  "dependsOn": [
    "[resourceId('Microsoft.DocumentDB/databaseAccounts', parameters('accountName'))]"
  ],
  "properties": {
    "level": "CanNotDelete",
    "notes": "Do not delete Azure Cosmos DB account."
  },
  "scope": "[resourceId('Microsoft.DocumentDB/databaseAccounts', parameters('accountName'))]"
}
```

#### [Bicep](#tab/bicep)

```bicep
resource lock 'Microsoft.Authorization/locks@2017-04-01' = {
  name: 'cosmoslock'
  scope: account
  properties: {
    level: 'CanNotDelete'
    notes: 'Do not delete Azure Cosmos DB API for NoSQL account.'
  }
}
```

---

## Samples

Manage resource locks for Azure Cosmos DB:

- API for Cassandra keyspace and table [Azure CLI](scripts\cli\cassandra\lock.md) | [Azure PowerShell](scripts\powershell\cassandra\lock.md)
- API for Gremlin database and graph [Azure CLI](scripts\cli\gremlin\lock.md) | [Azure PowerShell](scripts\powershell\gremlin\lock.md)
- API for MongoDB database and collection [Azure CLI](scripts\cli\mongodb\lock.md)| [Azure PowerShell](scripts\powershell\mongodb\lock.md)
- API for NoSQL database and container [Azure CLI](scripts\cli\sql\lock.md) | [Azure PowerShell](scripts\powershell\sql\lock.md)
- API for Table table [Azure CLI](scripts\cli\table\lock.md) | [Azure PowerShell](scripts\powershell\table\lock.md)

## Next steps

> [!div class="nextstepaction"]
> [Overview of Azure Resource Manager Locks](../azure-resource-manager/management/lock-resources.md)
