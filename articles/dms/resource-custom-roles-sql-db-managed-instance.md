---
title: "Custom roles: Online SQL Server to SQL Managed Instance migrations"
titleSuffix: Azure Database Migration Service
description: Learn to use the custom roles for SQL Server to Azure SQL Managed Instance online migrations.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 02/08/2021
ms.service: dms
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - sql-migration-content
---

# Custom roles for SQL Server to Azure SQL Managed Instance online migrations

Azure Database Migration Service uses an APP ID to interact with Azure Services. The APP ID requires either the Contributor role at the Subscription level (which many Corporate security departments won't allow) or creation of custom roles that grant the specific permissions that Azure Database Migration Service requires. Since there's a limit of 2,000 custom roles in Microsoft Entra ID, you may want to combine all permissions required specifically by the APP ID into one or two custom roles, and then grant the APP ID the custom role on specific objects or resource groups (vs. at the subscription level). If the number of custom roles isn't a concern, you can split the custom roles by resource type, to create three custom roles in total as described below.

The AssignableScopes section of the role definition json string allows you to control where the permissions appear in the **Add Role Assignment** UI in the portal. You'll likely want to define the role at the resource group or even resource level to avoid cluttering the UI with extra roles. Note that this doesn't perform the actual role assignment.

## Minimum number of roles

We currently recommend creating a minimum of two custom roles for the APP ID, one at the resource level and the other at the subscription level.

> [!NOTE]
> The last custom role requirement may eventually be removed, as new SQL Managed Instance code is deployed to Azure.

**Custom Role for the APP ID**. This role is required for Azure Database Migration Service migration at the *resource* or *resource group* level that hosts the Azure Database Migration Service (for more information about the APP ID, see the article [Use the portal to create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)).

```json
{
  "Name": "DMS Role - App ID",
  "IsCustom": true,
  "Description": "DMS App ID access to complete MI migrations",
  "Actions": [
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Storage/storageaccounts/blobservices/read",
        "Microsoft.Storage/storageaccounts/blobservices/write",
        "Microsoft.Sql/managedInstances/read",
        "Microsoft.Sql/managedInstances/write",
        "Microsoft.Sql/managedInstances/databases/read",
        "Microsoft.Sql/managedInstances/databases/write",
        "Microsoft.Sql/managedInstances/databases/delete",
        "Microsoft.Sql/managedInstances/metrics/read",
        "Microsoft.DataMigration/locations/*",
        "Microsoft.DataMigration/services/*"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/<subscription_id>/ResourceGroups/<StorageAccount_rg_name>",
    "/subscriptions/<subscription_id>/ResourceGroups/<ManagedInstance_rg_name>",
    "/subscriptions/<subscription_id>/ResourceGroups/<DMS_rg_name>",
  ]
}
```

**Custom role for the APP ID - subscription**. This role is required for Azure Database Migration Service migration at *subscription* level that hosts the SQL Managed Instance.

```json
{
  "Name": "DMS Role - App ID - Sub",
  "IsCustom": true,
  "Description": "DMS App ID access at subscription level to complete MI migrations",
  "Actions": [
        "Microsoft.Sql/locations/managedDatabaseRestoreAzureAsyncOperation/*"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/<subscription_id>"
  ]
}
```

The json above must be stored in two text files, and you can use either the AzureRM, AZ PowerShell cmdlets, or Azure CLI to create the roles using either **New-AzureRmRoleDefinition (AzureRM)** or **New-AzRoleDefinition (AZ)**.

For more information, see the article [Azure custom roles](../role-based-access-control/custom-roles.md).

After you create these custom roles, you must add role assignments to users and APP ID(s) to the appropriate resources or resource groups:

* The “DMS Role - App ID” role must be granted to the APP ID that will be used for the migrations, and also at the Storage Account, Azure Database Migration Service instance, and SQL Managed Instance resource levels. It is granted at the resource or resource group level that hosts the Azure Database Migration Service.
* The “DMS Role - App ID - Sub” role must be granted to the APP ID at the subscription level that hosts the SQL Managed Instance (granting at the resource or resource group will fail). This requirement is temporary until a code update is deployed.

## Expanded number of roles

If the number of custom roles in your Microsoft Entra ID isn't a concern, we recommend you create a total of three roles. You'll still need the “DMS Role - App ID – Sub” role, but the “DMS Role - App ID” role above is split by resource type into two different roles.

**Custom role for the APP ID for SQL Managed Instance**

```json
{
  "Name": "DMS Role - App ID - SQL MI",
  "IsCustom": true,
  "Description": "DMS App ID access to complete MI migrations",
  "Actions": [
        "Microsoft.Sql/managedInstances/read",
        "Microsoft.Sql/managedInstances/write",
        "Microsoft.Sql/managedInstances/databases/read",
        "Microsoft.Sql/managedInstances/databases/write",
        "Microsoft.Sql/managedInstances/databases/delete",
        "Microsoft.Sql/managedInstances/metrics/read"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/<subscription_id>/resourceGroups/<ManagedInstance_rg_name>"
  ]
}
```

**Custom role for the APP ID for Storage**

```json
{
  "Name": "DMS Role - App ID - Storage",
  "IsCustom": true,
  "Description": "DMS App ID storage access to complete MI migrations",
  "Actions": [
"Microsoft.Storage/storageAccounts/read",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Storage/storageaccounts/blobservices/read",
        "Microsoft.Storage/storageaccounts/blobservices/write"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/<subscription_id>/resourceGroups/<StorageAccount_rg_name>"
  ]
}
```

## Role assignment

To assign a role to users/APP ID, open the Azure portal, perform the following steps:

1. Navigate to the resource group or resource (except for the role that needs to be granted on the subscription), go to **Access Control**, and then scroll to find the custom roles you just created.

2. Select the appropriate role, select the APP ID, and then save the changes.

  Your APP ID(s) now appears listed on the **Role assignments** tab.

## Next steps

* Review the migration guidance for your scenario in the Microsoft [Database Migration Guide](/data-migration/).
