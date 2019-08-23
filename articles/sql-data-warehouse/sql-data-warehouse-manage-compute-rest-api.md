---
title: Pause, resume, scale with REST in Azure SQL Data Warehouse | Microsoft Docs
description: Manage compute power in SQL Data Warehouse through REST APIs.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: implement
ms.date: 03/29/2019
ms.author: kevin
ms.reviewer: igorstan
---

# REST APIs for Azure SQL Data Warehouse
REST APIs for managing compute in Azure SQL Data Warehouse.

## Scale compute
To change the data warehouse units, use the [Create or Update Database](/rest/api/sql/databases/createorupdate) REST API. The following example sets the data warehouse units to DW1000 for the database MySQLDW, which is hosted on server MyServer. The server is in an Azure resource group named ResourceGroup1.

```
PATCH https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}?api-version=2014-04-01-preview HTTP/1.1
Content-Type: application/json; charset=UTF-8

{
    "properties": {
        "requestedServiceObjectiveName": DW1000
    }
}
```

## Pause compute

To pause a database, use the [Pause Database](/rest/api/sql/databases/pause) REST API. The following example pauses a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1.

```
POST https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/pause?api-version=2014-04-01-preview HTTP/1.1
```

## Resume compute

To start a database, use the [Resume Database](/rest/api/sql/databases/resume) REST API. The following example starts a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1. 

```
POST https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/resume?api-version=2014-04-01-preview HTTP/1.1
```

## Check database state

> [!NOTE]
> Currently Check database state might return ONLINE while the database is completing the online workflow, resulting in connection errors. You might need to add a 2 to 3 minutes delay in your application code if you are using this API call to trigger connection attempts.

```
GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}?api-version=2014-04-01 HTTP/1.1
```

## Get maintenance schedule
Check the maintenance schedule that has been set for a data warehouse. 

```
GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/maintenanceWindows/current?maintenanceWindowName=current&api-version=2017-10-01-preview HTTP/1.1

```

## Set maintenance schedule
To set and update a maintnenance schedule on an existing data warehouse.

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}/maintenanceWindows/current?maintenanceWindowName=current&api-version=2017-10-01-preview HTTP/1.1

{
    "properties": {
        "timeRanges": [
                {
                                "dayOfWeek": Saturday,
                                "startTime": 00:00,
                                "duration": 08:00,
                },
                {
                                "dayOfWeek": Wednesday
                                "startTime": 00:00,
                                "duration": 08:00,
                }
                ]
    }
}

```


## Next steps
For more information, see [Manage compute](sql-data-warehouse-manage-compute-overview.md).

