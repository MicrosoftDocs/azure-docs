---
title: Configure permissions to restore an Azure Cosmos DB account.
description: Learn how to isolate and restrict the restore permissions for continuous backup account to a specific role or a principal. It shows how to assign a built-in role using Azure portal, CLI, or define a custom role.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 02/28/2022
ms.author: govindk
ms.reviewer: mjbrown
ms.custom: subject-rbac-steps, ignite-2022
---

# Manage permissions to restore an Azure Cosmos DB account
[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

Azure Cosmos DB allows you to isolate and restrict the restore permissions for continuous backup account to a specific role or a principal. The owner of the account can trigger a restore and assign a role to other principals to perform the restore operation. These permissions can be applied at the subscription scope as shown in the following image:

:::image type="content" source="./media/continuous-backup-restore-permissions/restore-roles-permissions.svg" alt-text="List of roles required to perform restore operation." border="false":::

Scope is a set of resources that have access, to learn more on scopes, see the [Azure RBAC](../role-based-access-control/scope-overview.md) documentation. In Azure Cosmos DB, applicable scopes are the source subscription and database account for most of the use cases. The principal performing the restore actions should have write permissions to the destination resource group.

## Assign roles for restore using the Azure portal

To perform a restore, a user or a principal need the permission to restore (that is *restore/action* permission), and permission to provision a new account (that is *write* permission).  To grant these permissions, the owner can assign the `CosmosRestoreOperator` and `Cosmos DB Operator` built in roles to a principal.

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to your subscription.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | CosmosRestoreOperator |
    | Assign access to | User, group, or service principal |
    | Members | &lt;User of your choice&gt; |

    :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-page.png" alt-text="Screenshot that shows Add role assignment page in Azure portal.":::

1. Repeat step 4 with the **Cosmos DB Operator** role to grant the write permission. When assigning this role from the Azure portal, it grants the restore permission to the whole subscription.

## Permission scopes

|Scope  |Example  |
|---------|---------|
|Subscription | /subscriptions/00000000-0000-0000-0000-000000000000 |
|Resource group | /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Example-cosmosdb-rg |


## Permissions on the source account
Following permissions are required to perform the different activities pertaining to restore for continuous backup mode accounts:

> [!NOTE]
>  Assigning permissions at resource group scope is not supported.

|Permission  |Impact  | 
|---------|---------| 
|`Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restore/action` </br> You can't choose resource group as the permission scope. |This permission is required on the source restorable database account scope to allow restore actions to be performed on it.  |  
|`Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read` </br> You can't choose resource group as the permission scope. |This permission is required on the source restorable database account scope to list the database accounts that can be restored.  |  
|`Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` </br> You can't choose resource group as the permission scope. | This permission is required on the source restorable account scope to allow reading of restorable resources such as list of databases and containers for a restorable account.  |  
## Permissions on the destination account

Following permissions are required to perform the different activities pertaining to restore for continuous backup mode accounts:

 
|Permission  |Impact  | 
|---------|---------| 
|`Microsoft.Resources/deployments/validate/action`, `Microsoft.Resources/deployments/write` | These permissions are required for the ARM template deployment to create the restored account. See the sample permission [RestorableAction](#custom-restorable-action) below for how to set this role.  
|`Microsoft.DocumentDB/databaseAccounts/write` | This permission is required to restore an account into a resource group | 
 

## Azure CLI role assignment scenarios to restore at different scopes

Roles with permission can be assigned to different scopes to achieve granular control on who can perform the restore operation within a subscription or a given account.

### Assign capability to restore from any restorable account in a subscription

Assign the `CosmosRestoreOperator` built-in role at subscription level

```azurecli-interactive
az role assignment create --role "CosmosRestoreOperator" --assignee <email> --scope /subscriptions/<subscriptionId>
```

### Assign capability to restore from a specific account
This operation is currently not supported.

### Assign capability to restore from any source account in a resource group.
This operation is currently not supported.

## <a id="custom-restorable-action"></a>Custom role creation for restore action with CLI

The subscription owner can provide the permission to restore to any other Azure AD identity. The restore permission is based on the action: `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restore/action`, and it should be included in their restore permission. There is a built-in role called *CosmosRestoreOperator* that has this role included. You can either assign the permission using this built-in role or create a custom role.

The RestorableAction below represents a custom role. You have to explicitly create this role. The following JSON template creates a custom role *RestorableAction* with restore permission:

```json
{
  "assignableScopes": [
    "/subscriptions/23587e98-b6ac-4328-a753-03bcd3c8e744"
  ],
  "description": "Can do a restore request for any Azure Cosmos DB database account with continuous backup",
  "permissions": [
    {
      "actions": [
        "Microsoft.Resources/deployments/validate/action",
        "Microsoft.DocumentDB/databaseAccounts/write",
        "Microsoft.Resources/deployments/write",  
        "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restore/action",
        "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read",
        "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read"
        ],
        "dataActions": [],
        "notActions": [],
        "notDataActions": []
      }
    ],
    "Name": "RestorableAction",
    "roleType": "CustomRole"
}
```

Next use the following template deployment command to create a role with restore permission using ARM template:

```azurecli-interactive
az role definition create --role-definition <JSON_Role_Definition_Path>
```

## Next steps

* Provision continuous backup using [Azure portal](provision-account-continuous-backup.md#provision-portal), [PowerShell](provision-account-continuous-backup.md#provision-powershell), [CLI](provision-account-continuous-backup.md#provision-cli), or [Azure Resource Manager](provision-account-continuous-backup.md#provision-arm-template).
* [Get the latest restorable timestamp](get-latest-restore-timestamp.md) for SQL and MongoDB accounts.
* Restore an account using [Azure portal](restore-account-continuous-backup.md#restore-account-portal), [PowerShell](restore-account-continuous-backup.md#restore-account-powershell), [CLI](restore-account-continuous-backup.md#restore-account-cli), or [Azure Resource Manager](restore-account-continuous-backup.md#restore-arm-template).
* [Migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
