---
title: "Custom roles: Online SQL Server to SQL Managed Instance migrations"
titleSuffix: Azure Database Migration Service
description: Learn to use the custom roles for SQL Server to Azure SQL Managed Instance online migrations.
services: database-migration
author: kirepko
ms.author: kirepko
manager: sushants
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: ""
ms.topic: conceptual
ms.date: 05/02/2022
---

# Custom roles for SQL Server to Azure SQL Managed Instance online migrations using ADS

This article explains how to set up a custom role in Azure with the minimum permissions necessary to create a Database Migration Service and be able to run a database migration to Azure SQL Managed Instance.

The AssignableScopes section of the role definition json string allows you to control where the permissions appear in the **Add Role Assignment** UI in the portal. You'll likely want to define the role at the resource group or even resource level to avoid cluttering the UI with extra roles. Note that this doesn't perform the actual role assignment.

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
You can use either the Azure Portal, AZ PowerShell, Azure CLI or Azure Rest API to create the roles.

For more information, see the articles [Create custom roles using the Azure Portal](../role-based-access-control/custom-roles-portal.md) and [Azure custom roles](../role-based-access-control/custom-roles.md).

# Description of permissions




## Role assignment

To assign a role to users/APP ID, open the Azure portal, perform the following steps:

1. Navigate to the resource, go to **Access Control**, and then scroll to find the custom roles you just created.

2. Select the appropriate role, select the User or APP ID, and then save the changes.

  The user or APP ID(s) now appears listed on the **Role assignments** tab.

## Next steps

* Review the migration guidance for your scenario in the Microsoft [Database Migration Guide](https://datamigration.microsoft.com/).
