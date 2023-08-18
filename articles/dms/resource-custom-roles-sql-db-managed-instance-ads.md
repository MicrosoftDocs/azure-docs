---
title: "Custom roles: Online SQL Server to SQL Managed Instance migrations using ADS"
titleSuffix: Azure Database Migration Service
description: Learn to use the custom roles for SQL Server to Azure SQL Managed Instance migrations.
author: krepko7
ms.author: kirepko
ms.date: 05/02/2022
ms.service: dms
ms.topic: conceptual
---

# Custom roles for SQL Server to Azure SQL Managed Instance migrations using ADS

This article explains how to set up a custom role in Azure for Database Migrations. The custom role will only have the permissions necessary to create and run a Database Migration Service with SQL Managed Instance as a target. 

The AssignableScopes section of the role definition json string allows you to control where the permissions appear in the **Add Role Assignment** UI in the portal. You'll likely want to define the role at the resource group or even resource level to avoid cluttering the UI with extra roles. This doesn't perform the actual role assignment.

```json
{
    "properties": {
        "roleName": "DmsCustomRoleDemoForMI",
        "description": "",
        "assignableScopes": [
            "/subscriptions/<storageSubscription>/resourceGroups/<storageAccountRG>",
            "/subscriptions/<ManagedInstanceSubscription>/resourceGroups/<managedInstanceRG>",
            "/subscriptions/<DMSSubscription>/resourceGroups/<dmsServiceRG>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Storage/storageAccounts/read",
                    "Microsoft.Storage/storageAccounts/listkeys/action",
                    "Microsoft.Storage/storageAccounts/blobServices/read",
                    "Microsoft.Storage/storageAccounts/blobServices/write",
                    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
                    "Microsoft.Sql/managedInstances/read",
                    "Microsoft.Sql/managedInstances/write",
                    "Microsoft.Sql/managedInstances/databases/read",
                    "Microsoft.Sql/managedInstances/databases/write",
                    "Microsoft.Sql/managedInstances/databases/delete",
                    "Microsoft.DataMigration/locations/operationResults/read",
                    "Microsoft.DataMigration/locations/operationStatuses/read",
                    "Microsoft.DataMigration/locations/sqlMigrationServiceOperationResults/read",
                    "Microsoft.DataMigration/databaseMigrations/write",
                    "Microsoft.DataMigration/databaseMigrations/read",
                    "Microsoft.DataMigration/databaseMigrations/delete",
                    "Microsoft.DataMigration/databaseMigrations/cancel/action",
                    "Microsoft.DataMigration/databaseMigrations/cutover/action",
                    "Microsoft.DataMigration/sqlMigrationServices/write",
                    "Microsoft.DataMigration/sqlMigrationServices/delete",
                    "Microsoft.DataMigration/sqlMigrationServices/read",
                    "Microsoft.DataMigration/sqlMigrationServices/listAuthKeys/action",
                    "Microsoft.DataMigration/sqlMigrationServices/regenerateAuthKeys/action",
                    "Microsoft.DataMigration/sqlMigrationServices/deleteNode/action",
                    "Microsoft.DataMigration/sqlMigrationServices/listMonitoringData/action",
                    "Microsoft.DataMigration/sqlMigrationServices/listMigrations/read",
                    "Microsoft.DataMigration/sqlMigrationServices/MonitoringData/read"
                ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ]
    }
}
```
You can use either the Azure portal, AZ PowerShell, Azure CLI or Azure REST API to create the roles.

For more information, see the articles [Create custom roles using the Azure portal](../role-based-access-control/custom-roles-portal.md) and [Azure custom roles](../role-based-access-control/custom-roles.md).

## Description of permissions needed to migrate to Azure SQL Managed Instance

| Permission Action    | Description       |
| ------------------------------------------- | --------------------------------------------------------------------|
| Microsoft.Storage/storageAccounts/read      | Returns the list of storage accounts or gets the properties for the specified storage account.   |
| Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
| Microsoft.Storage/storageAccounts/blobServices/read | List blob services. |
| Microsoft.Storage/storageAccounts/blobServices/write | Returns the result of put blob service properties. |
| Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns list of containers. |
| Microsoft.Sql/managedInstances/read | Return the list of managed instances or gets the properties for the specified managed instance. |
| Microsoft.Sql/managedInstances/write | Creates a managed instance with the specified parameters or update the properties or tags for the specified managed instance. |
| Microsoft.Sql/managedInstances/databases/read | Gets existing managed database. |
| Microsoft.Sql/managedInstances/databases/write | Creates a new database or updates an existing database. |
| Microsoft.Sql/managedInstances/databases/delete | Deletes an existing managed database. |
| Microsoft.DataMigration/locations/operationResults/read | Get the status of a long-running operation related to a 202 Accepted response. |
| Microsoft.DataMigration/locations/operationStatuses/read | Get the status of a long-running operation related to a 202 Accepted response. |
| Microsoft.DataMigration/locations/sqlMigrationServiceOperationResults/read | Retrieve Service Operation Results.   |
| Microsoft.DataMigration/databaseMigrations/write | Create or Update Database Migration resource. |
| Microsoft.DataMigration/databaseMigrations/read | Retrieve the Database Migration resource. |
| Microsoft.DataMigration/databaseMigrations/delete | Delete Database Migration resource. |
| Microsoft.DataMigration/databaseMigrations/cancel/action | Stop ongoing migration for the database. |
| Microsoft.DataMigration/databaseMigrations/cutover/action | Cutover online migration operation for the database.   |
| Microsoft.DataMigration/sqlMigrationServices/write | Create a new or change properties of existing Service |
| Microsoft.DataMigration/sqlMigrationServices/delete | Delete existing Service. |
| Microsoft.DataMigration/sqlMigrationServices/read | Retrieve details of Migration Service. |
| Microsoft.DataMigration/sqlMigrationServices/listAuthKeys/action | Retrieve the List of Authentication Keys. |
| Microsoft.DataMigration/sqlMigrationServices/regenerateAuthKeys/action | Regenerate the Authentication Keys. |
| Microsoft.DataMigration/sqlMigrationServices/deleteNode/action | De-register the IR node. |
| Microsoft.DataMigration/sqlMigrationServices/listMonitoringData/action | Lists the Monitoring Data  for all migrations. |
| Microsoft.DataMigration/sqlMigrationServices/listMigrations/read | Lists the migrations for the user. |
| Microsoft.DataMigration/sqlMigrationServices/MonitoringData/read | Retrieve the Monitoring Data.  |
| Microsoft.SqlVirtualMachine/sqlVirtualMachines/read | Retrieve details of SQL virtual machine. |
| Microsoft.SqlVirtualMachine/sqlVirtualMachines/write | Create a new or change properties of existing SQL virtual machine. |

## Role assignment

To assign a role to users/APP ID, open the Azure portal, perform the following steps:

1. Navigate to the resource, go to **Access Control**, and then scroll to find the custom roles you created.

2. Select the appropriate role, select the User or APP ID, and then save the changes.

  The user or APP ID(s) now appears listed on the **Role assignments** tab.

## Next steps

* Review the migration guidance for your scenario in the Microsoft [Database Migration Guide](/data-migration/).
