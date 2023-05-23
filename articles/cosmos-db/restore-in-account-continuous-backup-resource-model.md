---
title: Resource model for in-account restore (preview)
titleSuffix: Azure Cosmos DB
description: Review the required parameters and resource model for the in-account point-in-time restore feature of Azure Cosmos DB.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/08/2023
---

# Resource model for in-account point-in-time restore in Azure Cosmos DB (preview)

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

This article explains the resource model for the Azure Cosmos DB point-in-time in-account restore feature. It explains the parameters that support the continuous backup and resources that can be restored. This feature is supported in Azure Cosmos DB API for NoSQL, API for Gremlin, API for Table, and API for MongoDB.  

## Restore operation parameters for deleted containers and databases in existing accounts

The `RestoreParameters` resource contains the restore operation details including the account identifier, the time to restore, and resources that need to be restored.

| Property Name | Description  |
| --- | --- |
| `restoreMode` | The restore mode should be `PointInTime`. |
| `restoreSource` |  The `instanceId` of the source account to initiate the restore operation. |
| `restoreTimestampInUtc` | Point in time in UTC to restore the account. |

## Sample restore operation resources in Azure Resource Manager

The following JSON is a sample database account resource with continuous backup enabled:

```json
{ 
    "properties": { 
        "resource": { 
            "id": "<database-container-collection-graph-or-table-name>", 
            "createMode": "Restore", 
            "restoreParameters": { 
                "restoreSource": "/subscriptions/<subscription-id>/providers/Microsoft.DocumentDB/locations/<location>/restorableDatabaseAccounts/<account-instance-id>/", 
                "restoreTimestampInUtc": "<timestamp>"
      }         
    }     
  }
}
```

The following JSON is a sample MongoDB collection restore request in a subscription with an ID of `00000000-0000-0000-0000-000000000000`, an account with an instance ID of `abcd1234-d1c0-4645-a699-abcd1234`, a collection named `legacy-records-coll`, and the timestamp `2023-01-01T00:00:00Z`.

```json
{ 
    "properties": { 
        "resource": { 
            "id": "legacy-records-coll", 
            "createMode": "Restore", 
            "restoreParameters": { 
                "restoreSource": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/abcd1234-d1c0-4645-a699-abcd1234", 
                "restoreTimestampInUtc": "2023-01-01T00:00:00Z"
      }         
    }     
  }
} 
```

For more information about continuous backup, see [continuous backup resource model](continuous-backup-restore-resource-model.md).

## Next steps

* [Migrate to an account from periodic backup to continuous backup](migrate-continuous-backup.md).
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
