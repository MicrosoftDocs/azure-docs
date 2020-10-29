---
title: Prevent Azure Cosmos DB resources from being deleted or changed
description: Use Azure Resource Locks to prevent Azure Cosmos DB resources from being deleted or changed. 
author: markjbrown
ms.service: cosmos-db
ms.topic: how-to
ms.date: 10/06/2020
ms.author: mjbrown
---

# Prevent Azure Cosmos DB resources from being deleted or changed

As an administrator, you may need to lock an Azure Cosmos account, database or container to prevent other users in your organization from accidentally deleting or modifying critical resources. You can set the lock level to CanNotDelete or ReadOnly.

- **CanNotDelete** means authorized users can still read and modify a resource, but they can't delete the resource.
- **ReadOnly** means authorized users can read a resource, but they can't delete or update the resource. Applying this lock is similar to restricting all authorized users to the permissions granted by the Reader role.

## How locks are applied

When you apply a lock at a parent scope, all resources within that scope inherit the same lock. Even resources you add later inherit the lock from the parent. The most restrictive lock in the inheritance takes precedence.

Unlike role-based access control, you use management locks to apply a restriction across all users and roles. To learn about RBAC for Azure Cosmos DB see, [Role-based access control in Azure Cosmos DB](role-based-access-control.md).

Resource Manager locks apply only to operations that happen in the management plane, which consists of operations sent to https://management.azure.com. The locks don't restrict how resources perform their own functions. Resource changes are restricted, but resource operations aren't restricted. For example, a ReadOnly lock on an Azure Cosmos container prevents you from deleting or modifying the container. It doesn't prevent you from creating, updating, or deleting data in the container. Data transactions are permitted because those operations aren't sent to https://management.azure.com.

## Manage locks

> [!WARNING]
> Resource locks do not work for changes made by users accessing Azure Cosmos DB using account keys unless the Azure Cosmos account is first locked by enabling the disableKeyBasedMetadataWriteAccess property. Care should be taken before enabling this property to ensure it does not break existing applications that make changes to resources using any SDK, Azure portal or 3rd party tools that connect via account keys and modify resources such as changing throughput, updating index policies, etc. To learn more and to go through a checklist to ensure your applications continue to function see, [Preventing changes from the Azure Cosmos DB SDKs](role-based-access-control.md#prevent-sdk-changes)

### PowerShell

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "my-cosmos-account"
$lockName = "$accountName-Lock"

# First, update the account to prevent changes by anything that connects via account keys
Update-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $accountName -DisableKeyBasedMetadataWriteAccess true

# Create a Delete Lock on an Azure Cosmos account resource and all child resources
New-AzResourceLock `
    -ApiVersion "2020-04-01" `
    -ResourceType "Microsoft.DocumentDB/databaseAccounts" `
    -ResourceGroupName $resourceGroupName `
    -ResourceName $accountName `
    -LockName $lockName `
    -LockLevel "CanNotDelete" # CanNotDelete or ReadOnly
```

### Azure CLI

```bash
resourceGroupName='myResourceGroup'
accountName='my-cosmos-account'
$lockName="$accountName-Lock"

# First, update the account to prevent changes by anything that connects via account keys
az cosmosdb update  --name $accountName --resource-group $resourceGroupName  --disable-key-based-metadata-write-access true

# Create a Delete Lock on an Azure Cosmos account resource
az lock create --name $lockName \
    --resource-group $resourceGroupName \
    --resource-type Microsoft.DocumentDB/databaseAccount \
    --lock-type 'CanNotDelete' # CanNotDelete or ReadOnly \
    --resource $accountName
```

### Template

When applying a lock to an Azure Cosmos DB resource, use the following formats:

- name - `{resourceName}/Microsoft.Authorization/{lockName}`
- type - `{resourceProviderNamespace}/{resourceType}/providers/locks`

> [!IMPORTANT]
> When modifying an existing Azure Cosmos account, make sure to include the other properties for your account and child resources when redploying with this property. Do not deploy this template as is or it will reset all of your account properties.

```json
"resources": [
    {
        "type": "Microsoft.DocumentDB/databaseAccounts",
        "name": "[variables('accountName')]",
        "apiVersion": "2020-04-01",
        "kind": "GlobalDocumentDB",
        "location": "[parameters('location')]",
        "properties": {
            "consistencyPolicy": "[variables('consistencyPolicy')[parameters('defaultConsistencyLevel')]]",
            "locations": "[variables('locations')]",
            "databaseAccountOfferType": "Standard",
            "enableAutomaticFailover": "[parameters('automaticFailover')]",
            "disableKeyBasedMetadataWriteAccess": true
        }
    },
    {
        "type": "Microsoft.DocumentDB/databaseAccounts/providers/locks",
        "apiVersion": "2020-04-01",
        "name": "[concat(variables('accountName'), '/Microsoft.Authorization/siteLock')]",
        "dependsOn": [
        "[resourceId('Microsoft.DocumentDB/databaseAccounts', variables('accountName'))]"
        ],
        "properties": {
        "level": "CanNotDelete",
        "notes": "Cosmos account should not be deleted."
        }
    }
]
```

## Next steps

- [Overview of Azure Resource Manager Locks](../azure-resource-manager/management/lock-resources.md)
