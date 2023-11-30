---
title: Pause, resume, scale with REST APIs for dedicated SQL pool (formerly SQL DW)
description: Manage compute power for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics through REST APIs.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: wiassaf
ms.date: 03/09/2022
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - azure-synapse
---

# REST APIs for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics

REST APIs for managing compute for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics.

> [!NOTE]
> The REST APIs that are described in this article are for standalone dedicated SQL pools (formerly SQL DW) and are not applicable to a dedicated SQL pool in an Azure Synapse Analytics workspace. For information about REST APIs to use specifically for an Azure Synapse Analytics workspace, see [Azure Synapse Analytics workspace REST API](/rest/api/synapse/).

## Scale compute

To change the data warehouse units, use the [Create or Update Database](/rest/api/sql/2022-08-01-preview/databases/create-or-update) REST API. The following example sets the data warehouse units to DW1000 for the database `MySQLDW`, which is hosted on server MyServer. The server is in an Azure resource group named ResourceGroup1.

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}?api-version=2020-08-01-preview HTTP/1.1
Content-Type: application/json; charset=UTF-8

{
    "location": "West Central US",
    "sku": {
        "name": "DW200c"
    }
}
```

## Pause compute

To pause a database, use the [Pause Database](/rest/api/sql/databases/pause) REST API. The following example pauses a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1.

```
POST https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/pause?api-version=2020-08-01-preview HTTP/1.1
```

## Resume compute

To start a database, use the [Resume Database](/rest/api/sql/databases/resume) REST API. The following example starts a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1.

```
POST https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/resume?api-version=2020-08-01-preview HTTP/1.1
```

## Check database state

> [!NOTE]
> Currently Check database state might return ONLINE while the database is completing the online workflow, resulting in connection errors. You might need to add a 2 to 3 minutes delay in your application code if you are using this API call to trigger connection attempts.

```
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Sql/servers/{serverName}/databases/{databaseName}?api-version=2020-08-01-preview
```

## Get maintenance schedule

Check the maintenance schedule that has been set for a dedicated SQL pool (formerly SQL DW).

```
GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/maintenanceWindows/current?maintenanceWindowName=current&api-version=2017-10-01-preview HTTP/1.1

```

## Set maintenance schedule

To set and update a maintenance schedule on an existing dedicated SQL pool (formerly SQL DW).

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/maintenanceWindows/current?maintenanceWindowName=current&api-version=2017-10-01-preview HTTP/1.1

{
    "properties": {
        "timeRanges": [
                {
                                "dayOfWeek": "Saturday",
                                "startTime": "00:00",
                                "duration": "08:00",
                },
                {
                                "dayOfWeek": "Wednesday",
                                "startTime": "00:00",
                                "duration": "08:00",
                }
                ]
    }
}

```

## Next steps

For more information, see [Manage compute](sql-data-warehouse-manage-compute-overview.md).
