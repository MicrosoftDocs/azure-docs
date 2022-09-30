---
title: "Custom roles for SQL Server to Azure SQL Database (Preview) migrations using ADS"
titleSuffix: Azure Database Migration Service
description: Learn to use the custom roles for SQL Server to Azure SQL Database (Preview) migrations.
services: database-migration
author: croblesm
ms.author: roblescarlos
manager: 
ms.reviewer: 
ms.service: dms
ms.workload: data-services
ms.custom: ""
ms.topic: conceptual
ms.date: 09/28/2022
---

# Custom roles for SQL Server to Azure SQL Database (Preview) migrations using ADS

This article explains how to set up a custom role in Azure for Database Migrations. The custom role will only have the permissions necessary to create and run a Database Migration Service with Azure SQL Database (Preview) as a target. 

The AssignableScopes section of the role definition json string allows you to control where the permissions appear in the **Add Role Assignment** UI in the portal. You'll likely want to define the role at the resource group or even resource level to avoid cluttering the UI with extra roles. This doesn't perform the actual role assignment.

```json
{
    "properties": {
        "roleName": "DmsCustomRoleDemoForSqlDB",
        "description": "",
        "assignableScopes": [
            "/subscriptions/<sqlDbSubscription>/resourceGroups/<sqlDbRG>",
            "/subscriptions/<DMSSubscription>/resourceGroups/<dmsServiceRG>"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Sql/servers/read",
                    "Microsoft.Sql/servers/write",
                    "Microsoft.Sql/servers/databases/read",
                    "Microsoft.Sql/servers/databases/write",
                    "Microsoft.Sql/servers/databases/delete",
                    "Microsoft.DataMigration/locations/operationResults/read",
                    "Microsoft.DataMigration/locations/operationStatuses/read",
                    "Microsoft.DataMigration/locations/sqlMigrationServiceOperationResults/read",
                    "Microsoft.DataMigration/databaseMigrations/write",
                    "Microsoft.DataMigration/databaseMigrations/read",
                    "Microsoft.DataMigration/databaseMigrations/delete",
                    "Microsoft.DataMigration/databaseMigrations/cancel/action",
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

## Description of permissions needed to migrate to Azure SQL Database (Preview)

| Permission Action    | Description       |
| ------------------------------------------- | --------------------------------------------------------------------|
| Microsoft.Sql/servers/read | Return the list of SqlDb resources or gets the properties for the specified SqlDb. |
| Microsoft.Sql/servers/write | Creates a SqlDb with the specified parameters or update the properties or tags for the specified SqlDb. |
| Microsoft.Sql/servers/databases/read | Gets existing SqlDb database. |
| Microsoft.Sql/servers/databases/write | Creates a new database or updates an existing database. |
| Microsoft.Sql/servers/databases/delete | Deletes an existing SqlDb database. |
| Microsoft.DataMigration/locations/operationResults/read | Get the status of a long-running operation related to a 202 Accepted response. |
| Microsoft.DataMigration/locations/operationStatuses/read | Get the status of a long-running operation related to a 202 Accepted response. |
| Microsoft.DataMigration/locations/sqlMigrationServiceOperationResults/read | Retrieve Service Operation Results.   |
| Microsoft.DataMigration/databaseMigrations/write | Create or Update Database Migration resource. |
| Microsoft.DataMigration/databaseMigrations/read | Retrieve the Database Migration resource. |
| Microsoft.DataMigration/databaseMigrations/delete | Delete Database Migration resource. |
| Microsoft.DataMigration/databaseMigrations/cancel/action | Stop ongoing migration for the database. |
| Microsoft.DataMigration/sqlMigrationServices/write | Create a new or change properties of existing Service |
| Microsoft.DataMigration/sqlMigrationServices/delete | Delete existing Service. |
| Microsoft.DataMigration/sqlMigrationServices/read | Retrieve details of Migration Service. |
| Microsoft.DataMigration/sqlMigrationServices/listAuthKeys/action | Retrieve the List of Authentication Keys. |
| Microsoft.DataMigration/sqlMigrationServices/regenerateAuthKeys/action | Regenerate the Authentication Keys. |
| Microsoft.DataMigration/sqlMigrationServices/deleteNode/action | De-register the IR node. |
| Microsoft.DataMigration/sqlMigrationServices/listMonitoringData/action | Lists the Monitoring Data  for all migrations. |
| Microsoft.DataMigration/sqlMigrationServices/listMigrations/read | Lists the migrations for the user. |
| Microsoft.DataMigration/sqlMigrationServices/MonitoringData/read | Retrieve the Monitoring Data.  |

## Role assignment

To assign a role to users/APP ID, open the Azure portal, perform the following steps:

1. Navigate to the resource, go to **Access Control**, and then scroll to find the custom roles you created.

2. Select the appropriate role, select the User or APP ID, and then save the changes.

  The user or APP ID(s) now appears listed on the **Role assignments** tab.

## Next steps

* Review the migration guidance for your scenario in the Microsoft [Database Migration Guide](https://datamigration.microsoft.com/).