---
title: Pause, resume, scale with REST in Azure SQL Data Warehouse | Microsoft Docs
description: Manage compute power in SQL Data Warehouse through REST APIs.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
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

```
GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}/databases/{database-name}?api-version=2014-04-01 HTTP/1.1
```


## Next steps
For more information, see [Manage compute](sql-data-warehouse-manage-compute-overview.md).

