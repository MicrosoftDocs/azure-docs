---
title: Configure permissions to restore an Azure Cosmos DB account.
description: Learn how to isolate and restrict the restore permissions for continuous backup account to a specific role or a principal. It shows how to assign a built-in role using Azure portal, CLI, or define a custom role.
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 02/01/2021
ms.author: govindk
ms.reviewer: sngun
---

# Manage permissions to restore an Azure Cosmos DB account
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB allows you to isolate and restrict the restore permissions for continuous backup(Preview) account to a specific role or a principal. The owner of the account can trigger a restore and assign a role to other principals to perform the restore operation. These permissions can be applied at the subscription scope or more granularly at the source account scope as shown in the following image:

:::image type="content" source="./media/continuous-backup-restore-permissions/restore-roles-permissions.png" alt-text="List of roles required to perform restore operation." lightbox="./media/continuous-backup-restore-permissions/restore-roles-permissions.png" border="false":::

Scope is a set of resources that have access, to learn more on scopes, see the [Azure RBAC](../role-based-access-control/scope-overview.md) documentation. In Azure Cosmos DB, applicable scopes are the source subscription and database account for most of the use cases. The principal performing the restore actions should have write permissions to the destination resource group.

## Assign roles for restore using the Azure portal

To perform a restore, a user or a principal need the permission to restore (that is *restore/action* permission), and permission to provision a new account (that is *write* permission).  To grant these permissions, the owner can assign the `CosmosRestoreOperator` and `Cosmos DB Operator` built in roles to a principal.

1. Sign into the [Azure portal](https://portal.azure.com/)

1. Navigate to your subscription and go to **Access control (IAM)** tab and select **Add** > **Add role assignment**

1. In the **Add role assignment** pane, for **Role** field, select **CosmosRestoreOperator** role. Choose **User, group, or a service principal** for the **Assign access to** field and search for a user's name or email ID as shown in the following image:

   :::image type="content" source="./media/continuous-backup-restore-permissions/assign-restore-operator-roles.png" alt-text="Assign CosmosRestoreOperator and Cosmos DB Operator roles." border="true":::

1. Select **Save** to grant the *restore/action* permission.

1. Repeat Step 3 with **Cosmos DB Operator** role to grant the write permission. When assigning this role from the Azure portal, it grants the restore permission to the whole subscription.

## Permission scopes

|Scope  |Example  |
|---------|---------|
|Subscription | /subscriptions/00000000-0000-0000-0000-000000000000 |
|Resource group | /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Example-cosmosdb-rg |
|CosmosDB restorable account resource | /subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/West US/restorableDatabaseAccounts/23e99a35-cd36-4df4-9614-f767a03b9995|

The restorable account resource can be extracted from the output of the `az cosmosdb restorable-database-account list --name <accountname>` command in CLI or `Get-AzCosmosDBRestorableDatabaseAccount -DatabaseAccountName <accountname>` cmdlet in PowerShell. The name attribute in the output represents the `instanceID` of the restorable account. To learn more, see the [PowerShell](continuous-backup-restore-powershell.md) or [CLI](continuous-backup-restore-command-line.md) article.

## Permissions

Following permissions are required to perform the different activities pertaining to restore for continuous backup mode accounts:

|Permission  |Impact  |Minimum scope  |Maximum scope  |
|---------|---------|---------|---------|
|`Microsoft.Resources/deployments/validate/action`, `Microsoft.Resources/deployments/write` | These permissions are required for the ARM template deployment to create the restored account. See the sample permission [RestorableAction](#custom-restorable-action) below for how to set this role. | Not applicable | Not applicable  |
|`Microsoft.DocumentDB/databaseAccounts/write` | This permission is required to restore an account into a resource group | Resource group under which the restored account is created. | Subscription under which the restored account is created |
|`Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restore/action` |This permission is required on the source restorable database account scope to allow restore actions to be performed on it.  | The *RestorableDatabaseAccount* resource belonging to the source account being restored. This value is also given by the `ID` property of the restorable database account resource. An example of restorable account is */subscriptions/subscriptionId/providers/Microsoft.DocumentDB/locations/regionName/restorableDatabaseAccounts/<guid-instanceid>* | The subscription containing the restorable database account. The resource group cannot be chosen as scope.  |
|`Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read` |This permission is required on the source restorable database account scope to list the database accounts that can be restored.  | The *RestorableDatabaseAccount* resource belonging to the source account being restored. This value is also given by the `ID` property of the restorable database account resource. An example of restorable account is */subscriptions/subscriptionId/providers/Microsoft.DocumentDB/locations/regionName/restorableDatabaseAccounts/<guid-instanceid>*| The subscription containing the restorable database account. The resource group cannot be chosen as scope.  |
|`Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` | This permission is required on the source restorable account scope to allow reading of restorable resources such as list of databases and containers for a restorable account.  | The *RestorableDatabaseAccount* resource belonging to the source account being restored. This value is also given by the `ID` property of the restorable database account resource. An example of restorable account is */subscriptions/subscriptionId/providers/Microsoft.DocumentDB/locations/regionName/restorableDatabaseAccounts/<guid-instanceid>*| The subscription containing the restorable database account. The resource group cannot be chosen as scope. |

## Azure CLI role assignment scenarios to restore at different scopes

Roles with permission can be assigned to different scopes to achieve granular control on who can perform the restore operation within a subscription or a given account.

### Assign capability to restore from any restorable account in a subscription

Assign the `CosmosRestoreOperator` built-in role at subscription level

```azurecli-interactive
az role assignment create --role "CosmosRestoreOperator" --assignee <email> –scope /subscriptions/<subscriptionId>
```

### Assign capability to restore from a specific account

* Assign a user write action on the specific resource group. This action is required to create a new account in the resource group.

* Assign the *CosmosRestoreOperator* built-in role to the specific restorable database account that needs to be restored. In the following command, the scope for the *RestorableDatabaseAccount* is retrieved from the `ID` property in the output of `az cosmosdb restorable-database-account` (if using CLI)  or  `Get-AzCosmosDBRestorableDatabaseAccount` (if using PowerShell).

  ```azurecli-interactive
   az role assignment create --role "CosmosRestoreOperator" --assignee <email> –scope <RestorableDatabaseAccount>
  ```

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
  "description": "Can do a restore request for any Cosmos DB database account with continuous backup",
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

* Configure and manage continuous backup using the [Azure portal](continuous-backup-restore-portal.md), [PowerShell](continuous-backup-restore-powershell.md), [CLI](continuous-backup-restore-command-line.md), or [Azure Resource Manager](continuous-backup-restore-template.md).
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
