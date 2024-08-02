---
title: Azure built-in roles for Databases - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Databases category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Databases

This article lists the Azure built-in roles in the Databases category.


## Azure Connected SQL Server Onboarding

Allows for read and write access to Azure resources for SQL Server on Arc-enabled servers.

[Learn more](/sql/sql-server/azure-arc/connect)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.AzureArcData/sqlServerInstances/read | Retrieves a SQL Server Instance resource |
> | Microsoft.AzureArcData/sqlServerInstances/write | Updates a SQL Server Instance resource |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Microsoft.AzureArcData service role to access the resources of Microsoft.AzureArcData stored with RPSAAS.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e8113dce-c529-4d33-91fa-e9b972617508",
  "name": "e8113dce-c529-4d33-91fa-e9b972617508",
  "permissions": [
    {
      "actions": [
        "Microsoft.AzureArcData/sqlServerInstances/read",
        "Microsoft.AzureArcData/sqlServerInstances/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Connected SQL Server Onboarding",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cosmos DB Account Reader Role

Can read Azure Cosmos DB account data. See [DocumentDB Account Contributor](#documentdb-account-contributor) for managing Azure Cosmos DB accounts.

[Learn more](/azure/cosmos-db/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/*/read | Read any collection |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/readonlykeys/action | Reads the database account readonly keys. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/MetricDefinitions/read | Read metric definitions |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/Metrics/read | Read metrics |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read Azure Cosmos DB Accounts data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fbdf93bf-df7d-467e-a4d2-9458aa1360c8",
  "name": "fbdf93bf-df7d-467e-a4d2-9458aa1360c8",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.DocumentDB/*/read",
        "Microsoft.DocumentDB/databaseAccounts/readonlykeys/action",
        "Microsoft.Insights/MetricDefinitions/read",
        "Microsoft.Insights/Metrics/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cosmos DB Account Reader Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Cosmos DB Operator

Lets you manage Azure Cosmos DB accounts, but not access data in them. Prevents access to account keys and connection strings.

[Learn more](/azure/cosmos-db/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DocumentDb](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | **NotActions** |  |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/dataTransferJobs/* |  |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/readonlyKeys/* |  |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/regenerateKey/* |  |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/listKeys/* |  |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/listConnectionStrings/* |  |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/sqlRoleDefinitions/write | Create or update a SQL Role Definition |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/sqlRoleDefinitions/delete | Delete a SQL Role Definition |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/sqlRoleAssignments/write | Create or update a SQL Role Assignment |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/sqlRoleAssignments/delete | Delete a SQL Role Assignment |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/mongodbRoleDefinitions/write | Create or update a Mongo Role Definition |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/mongodbRoleDefinitions/delete | Delete a MongoDB Role Definition |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/mongodbUserDefinitions/write | Create or update a MongoDB User Definition |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/mongodbUserDefinitions/delete | Delete a MongoDB User Definition |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Azure Cosmos DB accounts, but not access data in them. Prevents access to account keys and connection strings.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/230815da-be43-4aae-9cb4-875f7bd000aa",
  "name": "230815da-be43-4aae-9cb4-875f7bd000aa",
  "permissions": [
    {
      "actions": [
        "Microsoft.DocumentDb/databaseAccounts/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action"
      ],
      "notActions": [
        "Microsoft.DocumentDB/databaseAccounts/dataTransferJobs/*",
        "Microsoft.DocumentDB/databaseAccounts/readonlyKeys/*",
        "Microsoft.DocumentDB/databaseAccounts/regenerateKey/*",
        "Microsoft.DocumentDB/databaseAccounts/listKeys/*",
        "Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/*",
        "Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions/write",
        "Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions/delete",
        "Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/write",
        "Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments/delete",
        "Microsoft.DocumentDB/databaseAccounts/mongodbRoleDefinitions/write",
        "Microsoft.DocumentDB/databaseAccounts/mongodbRoleDefinitions/delete",
        "Microsoft.DocumentDB/databaseAccounts/mongodbUserDefinitions/write",
        "Microsoft.DocumentDB/databaseAccounts/mongodbUserDefinitions/delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cosmos DB Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## CosmosBackupOperator

Can submit restore request for a Cosmos DB database or a container for an account

[Learn more](/azure/cosmos-db/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/backup/action | Submit a request to configure backup |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/restore/action | Submit a restore request |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can submit restore request for a Cosmos DB database or a container for an account",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/db7b14f2-5adf-42da-9f96-f2ee17bab5cb",
  "name": "db7b14f2-5adf-42da-9f96-f2ee17bab5cb",
  "permissions": [
    {
      "actions": [
        "Microsoft.DocumentDB/databaseAccounts/backup/action",
        "Microsoft.DocumentDB/databaseAccounts/restore/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CosmosBackupOperator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## CosmosRestoreOperator

Can perform restore action for Cosmos DB database account with continuous backup mode

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/locations/restorableDatabaseAccounts/restore/action | Submit a restore request |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/locations/restorableDatabaseAccounts/*/read |  |
> | [Microsoft.DocumentDB](../permissions/databases.md#microsoftdocumentdb)/locations/restorableDatabaseAccounts/read | Read a restorable database account or List all the restorable database accounts |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can perform restore action for Cosmos DB database account with continuous backup mode",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5432c526-bc82-444a-b7ba-57c5b0b5b34f",
  "name": "5432c526-bc82-444a-b7ba-57c5b0b5b34f",
  "permissions": [
    {
      "actions": [
        "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/restore/action",
        "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read",
        "Microsoft.DocumentDB/locations/restorableDatabaseAccounts/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CosmosRestoreOperator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DocumentDB Account Contributor

Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB.

[Learn more](/azure/cosmos-db/role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.DocumentDb](../permissions/databases.md#microsoftdocumentdb)/databaseAccounts/* | Create and manage Azure Cosmos DB accounts |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage DocumentDB accounts, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5bd9cd88-fe45-4216-938b-f97437e15450",
  "name": "5bd9cd88-fe45-4216-938b-f97437e15450",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.DocumentDb/databaseAccounts/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "DocumentDB Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Redis Cache Contributor

Lets you manage Redis caches, but not access to them.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/register/action | Registers the 'Microsoft.Cache' resource provider with a subscription |
> | [Microsoft.Cache](../permissions/databases.md#microsoftcache)/redis/* | Create and manage Redis caches |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Redis caches, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e0f68234-74aa-48ed-b826-c38b57376e17",
  "name": "e0f68234-74aa-48ed-b826-c38b57376e17",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cache/register/action",
        "Microsoft.Cache/redis/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Redis Cache Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SQL DB Contributor

Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers.

[Learn more](/azure/data-share/concepts-roles-permissions)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/*/read |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/* | Create and manage SQL databases |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/read | Return the list of servers or gets the properties for the specified server. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | **NotActions** |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/ledgerDigestUploads/write | Enable uploading ledger digests  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/ledgerDigestUploads/disable/action | Disable uploading ledger digests |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/currentSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/recommendedSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/securityAlertPolicies/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/securityAlertPolicies/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/auditingSettings/* | Edit audit settings |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/currentSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/dataMaskingPolicies/* | Edit data masking policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/extendedAuditingSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/recommendedSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/securityAlertPolicies/* | Edit security alert policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/securityMetrics/* | Edit security metrics |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessmentScans/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessmentSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/vulnerabilityAssessments/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/9b7fa17d-e63e-47b0-bb0a-15c516ac86ec",
  "name": "9b7fa17d-e63e-47b0-bb0a-15c516ac86ec",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Sql/locations/*/read",
        "Microsoft.Sql/servers/databases/*",
        "Microsoft.Sql/servers/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read"
      ],
      "notActions": [
        "Microsoft.Sql/servers/databases/ledgerDigestUploads/write",
        "Microsoft.Sql/servers/databases/ledgerDigestUploads/disable/action",
        "Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/managedInstances/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditRecords/read",
        "Microsoft.Sql/servers/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/dataMaskingPolicies/*",
        "Microsoft.Sql/servers/databases/extendedAuditingSettings/*",
        "Microsoft.Sql/servers/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/securityAlertPolicies/*",
        "Microsoft.Sql/servers/databases/securityMetrics/*",
        "Microsoft.Sql/servers/databases/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/*",
        "Microsoft.Sql/servers/vulnerabilityAssessments/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL DB Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SQL Managed Instance Contributor

Lets you manage SQL Managed Instances and required network configuration, but can't give access to others.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/networkSecurityGroups/* |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/routeTables/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/*/read |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/instanceFailoverGroups/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/* |  |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/* |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | **NotActions** |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/azureADOnlyAuthentications/delete | Deletes a specific managed server Azure Active Directory only authentication object |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/azureADOnlyAuthentications/write | Adds or updates a specific managed server Azure Active Directory only authentication object |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage SQL Managed Instances and required network configuration, but can't give access to others.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4939a1f6-9ae0-4e48-a1e0-f2cbe897382d",
  "name": "4939a1f6-9ae0-4e48-a1e0-f2cbe897382d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Network/networkSecurityGroups/*",
        "Microsoft.Network/routeTables/*",
        "Microsoft.Sql/locations/*/read",
        "Microsoft.Sql/locations/instanceFailoverGroups/*",
        "Microsoft.Sql/managedInstances/*",
        "Microsoft.Support/*",
        "Microsoft.Network/virtualNetworks/subnets/*",
        "Microsoft.Network/virtualNetworks/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read"
      ],
      "notActions": [
        "Microsoft.Sql/managedInstances/azureADOnlyAuthentications/delete",
        "Microsoft.Sql/managedInstances/azureADOnlyAuthentications/write"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL Managed Instance Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SQL Security Manager

Lets you manage the security-related policies of SQL servers and databases, but not access to them.

[Learn more](/azure/azure-sql/database/azure-defender-for-sql)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/administratorAzureAsyncOperation/read | Gets the Managed instance azure async administrator operations result. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/advancedThreatProtectionSettings/read | Retrieve a list of managed instance Advanced Threat Protection settings configured for a given instance |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/advancedThreatProtectionSettings/write | Change the managed instance Advanced Threat Protection settings for a given managed instance |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/advancedThreatProtectionSettings/read | Retrieve a list of the managed database Advanced Threat Protection settings configured for a given managed database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/advancedThreatProtectionSettings/write | Change the database Advanced Threat Protection settings for a given managed database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/advancedThreatProtectionSettings/read | Retrieve a list of managed instance Advanced Threat Protection settings configured for a given instance |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/advancedThreatProtectionSettings/write | Change the managed instance Advanced Threat Protection settings for a given managed instance |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/advancedThreatProtectionSettings/read | Retrieve a list of the managed database Advanced Threat Protection settings configured for a given managed database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/advancedThreatProtectionSettings/write | Change the database Advanced Threat Protection settings for a given managed database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/currentSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/recommendedSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/securityAlertPolicies/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/advancedThreatProtectionSettings/read | Retrieve a list of server Advanced Threat Protection settings configured for a given server |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/advancedThreatProtectionSettings/write | Change the server Advanced Threat Protection settings for a given server |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/securityAlertPolicies/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/transparentDataEncryption/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/serverConfigurationOptions/read | Gets properties for the specified Azure SQL Managed Instance Server Configuration Option. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/serverConfigurationOptions/write | Updates Azure SQL Managed Instance's Server Configuration Option properties for the specified instance. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/serverConfigurationOptionAzureAsyncOperation/read | Gets the status of Azure SQL Managed Instance Server Configuration Option Azure async operation. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/advancedThreatProtectionSettings/read | Retrieve a list of server Advanced Threat Protection settings configured for a given server |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/advancedThreatProtectionSettings/write | Change the server Advanced Threat Protection settings for a given server |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/auditingSettings/* | Create and manage SQL server auditing setting |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/extendedAuditingSettings/read | Retrieve details of the extended server blob auditing policy configured on a given server |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/advancedThreatProtectionSettings/read | Retrieve a list of database Advanced Threat Protection settings configured for a given database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/advancedThreatProtectionSettings/write | Change the database Advanced Threat Protection settings for a given database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/advancedThreatProtectionSettings/read | Retrieve a list of database Advanced Threat Protection settings configured for a given database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/advancedThreatProtectionSettings/write | Change the database Advanced Threat Protection settings for a given database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/auditingSettings/* | Create and manage SQL server database auditing settings |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/currentSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/dataMaskingPolicies/* | Create and manage SQL server database data masking policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/extendedAuditingSettings/read | Retrieve details of the extended blob auditing policy configured on a given database |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/read | Return the list of databases or gets the properties for the specified database. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/recommendedSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/schemas/read | Get a database schema. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/schemas/tables/columns/read | Get a database column. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/schemas/tables/read | Get a database table. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/securityAlertPolicies/* | Create and manage SQL server database security alert policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/securityMetrics/* | Create and manage SQL server database security metrics |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/transparentDataEncryption/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/sqlvulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessmentScans/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessmentSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/devOpsAuditingSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/firewallRules/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/read | Return the list of servers or gets the properties for the specified server. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/securityAlertPolicies/* | Create and manage SQL server security alert policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/sqlvulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/vulnerabilityAssessments/* |  |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/azureADOnlyAuthentications/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/read | Return the list of managed instances or gets the properties for the specified managed instance. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/azureADOnlyAuthentications/* |  |
> | [Microsoft.Security](../permissions/security.md#microsoftsecurity)/sqlVulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/administrators/read | Gets a list of managed instance administrators. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/administrators/read | Gets a specific Azure Active Directory administrator object |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/ledgerDigestUploads/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/ledgerDigestUploadsAzureAsyncOperation/read | Gets in-progress operations of ledger digest upload settings |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/ledgerDigestUploadsOperationResults/read | Gets in-progress operations of ledger digest upload settings |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/externalPolicyBasedAuthorizations/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage the security-related policies of SQL servers and databases, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/056cd41c-7e88-42e1-933e-88ba6a50c9c3",
  "name": "056cd41c-7e88-42e1-933e-88ba6a50c9c3",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Sql/locations/administratorAzureAsyncOperation/read",
        "Microsoft.Sql/managedInstances/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/managedInstances/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/managedInstances/databases/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/managedInstances/databases/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/managedInstances/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/managedInstances/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/managedInstances/databases/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/managedInstances/databases/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/servers/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/managedInstances/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/transparentDataEncryption/*",
        "Microsoft.Sql/managedInstances/vulnerabilityAssessments/*",
        "Microsoft.Sql/managedInstances/serverConfigurationOptions/read",
        "Microsoft.Sql/managedInstances/serverConfigurationOptions/write",
        "Microsoft.Sql/locations/serverConfigurationOptionAzureAsyncOperation/read",
        "Microsoft.Sql/servers/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/servers/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/servers/auditingSettings/*",
        "Microsoft.Sql/servers/extendedAuditingSettings/read",
        "Microsoft.Sql/servers/databases/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/servers/databases/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/servers/databases/advancedThreatProtectionSettings/read",
        "Microsoft.Sql/servers/databases/advancedThreatProtectionSettings/write",
        "Microsoft.Sql/servers/databases/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditRecords/read",
        "Microsoft.Sql/servers/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/dataMaskingPolicies/*",
        "Microsoft.Sql/servers/databases/extendedAuditingSettings/read",
        "Microsoft.Sql/servers/databases/read",
        "Microsoft.Sql/servers/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/read",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/read",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/tables/read",
        "Microsoft.Sql/servers/databases/securityAlertPolicies/*",
        "Microsoft.Sql/servers/databases/securityMetrics/*",
        "Microsoft.Sql/servers/databases/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/transparentDataEncryption/*",
        "Microsoft.Sql/servers/databases/sqlvulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/*",
        "Microsoft.Sql/servers/devOpsAuditingSettings/*",
        "Microsoft.Sql/servers/firewallRules/*",
        "Microsoft.Sql/servers/read",
        "Microsoft.Sql/servers/securityAlertPolicies/*",
        "Microsoft.Sql/servers/sqlvulnerabilityAssessments/*",
        "Microsoft.Sql/servers/vulnerabilityAssessments/*",
        "Microsoft.Support/*",
        "Microsoft.Sql/servers/azureADOnlyAuthentications/*",
        "Microsoft.Sql/managedInstances/read",
        "Microsoft.Sql/managedInstances/azureADOnlyAuthentications/*",
        "Microsoft.Security/sqlVulnerabilityAssessments/*",
        "Microsoft.Sql/managedInstances/administrators/read",
        "Microsoft.Sql/servers/administrators/read",
        "Microsoft.Sql/servers/databases/ledgerDigestUploads/*",
        "Microsoft.Sql/locations/ledgerDigestUploadsAzureAsyncOperation/read",
        "Microsoft.Sql/locations/ledgerDigestUploadsOperationResults/read",
        "Microsoft.Sql/servers/externalPolicyBasedAuthorizations/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL Security Manager",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SQL Server Contributor

Lets you manage SQL servers and databases, but not access to them, and not their security-related policies.

[Learn more](/azure/azure-sql/database/authentication-aad-configure)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/locations/*/read |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/* | Create and manage SQL servers |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | **NotActions** |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/currentSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/recommendedSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/securityAlertPolicies/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/databases/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/securityAlertPolicies/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/managedInstances/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/auditingSettings/* | Edit SQL server auditing settings |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/auditingSettings/* | Edit SQL server database auditing settings |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/currentSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/dataMaskingPolicies/* | Edit SQL server database data masking policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/extendedAuditingSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/recommendedSensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/securityAlertPolicies/* | Edit SQL server database security alert policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/securityMetrics/* | Edit SQL server database security metrics |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/sensitivityLabels/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessmentScans/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/databases/vulnerabilityAssessmentSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/devOpsAuditingSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/extendedAuditingSettings/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/securityAlertPolicies/* | Edit SQL server security alert policies |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/vulnerabilityAssessments/* |  |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/azureADOnlyAuthentications/delete | Deletes a specific server Azure Active Directory only authentication object |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/azureADOnlyAuthentications/write | Adds or updates a specific server Azure Active Directory only authentication object |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/externalPolicyBasedAuthorizations/delete | Deletes a specific server external policy based authorization property |
> | [Microsoft.Sql](../permissions/databases.md#microsoftsql)/servers/externalPolicyBasedAuthorizations/write | Adds or updates a specific server external policy based authorization property |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage SQL servers and databases, but not access to them, and not their security -related policies.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437",
  "name": "6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Sql/locations/*/read",
        "Microsoft.Sql/servers/*",
        "Microsoft.Support/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read"
      ],
      "notActions": [
        "Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/managedInstances/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditRecords/read",
        "Microsoft.Sql/servers/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/dataMaskingPolicies/*",
        "Microsoft.Sql/servers/databases/extendedAuditingSettings/*",
        "Microsoft.Sql/servers/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/securityAlertPolicies/*",
        "Microsoft.Sql/servers/databases/securityMetrics/*",
        "Microsoft.Sql/servers/databases/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/*",
        "Microsoft.Sql/servers/devOpsAuditingSettings/*",
        "Microsoft.Sql/servers/extendedAuditingSettings/*",
        "Microsoft.Sql/servers/securityAlertPolicies/*",
        "Microsoft.Sql/servers/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/azureADOnlyAuthentications/delete",
        "Microsoft.Sql/servers/azureADOnlyAuthentications/write",
        "Microsoft.Sql/servers/externalPolicyBasedAuthorizations/delete",
        "Microsoft.Sql/servers/externalPolicyBasedAuthorizations/write"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL Server Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)