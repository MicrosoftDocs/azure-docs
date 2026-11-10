---
title: Restore SQL server databases in Azure VMs with REST API
description: Learn how to use REST API to restore SQL server databases in Azure VM from a restore point created by Azure Backup
ms.topic: how-to
ms.date: 02/13/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a database administrator, I want to restore SQL Server databases in Azure VMs using the REST API, so that I can efficiently manage backup and recovery operations without using the portal."
---

# Restore SQL Server databases in Azure VMs with REST API

This article explains how to restore a SQL server database in an Azure VM from a restore point created by [Azure Backup](./backup-overview.md) by using the RcEST API.

By the end of this article, you'll learn how to perform the following operations using REST API:

- View the restore points for a backed-up SQL database.
- Query snapshot recovery points and point-in-time recovery ranges for SQL databases and instances.
- Retrieve the databases and data directory paths included in a recovery point.
- Restore a full SQL database.

To view the backup and restore scenarios that we support today, see the [support matrix](sql-support-matrix.md#scenario-support). For common questions, see the [frequently asked questions](faq-backup-sql-server.yml).

## Prerequisites

We assume that you have a backed-up SQL database for restore. If you don’t have one, see [Backup SQL Server databases in Azure VMs using REST API](backup-azure-sql-vm-rest-api.md) to create.

For this article, we'll use the following resources:

- **Recovery Services vault**: *SQLServer2012*
- **Resource group**: *SQLServerSelfHost*
- **SQL server**: *sqlserver-0*
- **SQL database**: *msdb*

## Primary-region restore

To trigger a regular restore job in the primary region, see the following sections. For Cross-region restore, see the [Cross-region-restore](#cross-region-restore) section.

### Fetch ContainerName and ProtectedItemName

For most of the restore related API calls, you need to pass values for the `{containerName}` and `{protectedItemName}` URI parameters. Use the ID attribute in the response body of the [GET backupprotectableitems](/rest/api/backup/protected-items/get) operation to retrieve values for these parameters. In our example, the ID of the database we want to protect is:

```
/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb
```

The values translate as follows:

- `{containername}`: *VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0*
- `{protectedItemName}`: *sqldatabase;mssqlserver;msdb*

### Fetch recovery points for backed up SQL database

To restore any backed-up database:

1. Select a recovery point to perform the restore operation.
1. List the available recovery points of a backed-up item using the [Recovery Point-List](/rest/api/site-recovery/recoverypoints/listbyreplicationprotecteditems) REST API call. It's a *GET* operation with all relevant values.

    ```http
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/recoveryPoints?api-version=2016-12-01
    ```

   Set the URI values as follows:

   - `{fabricName}`: *Azure*
   - `{vaultName}`: *SQLServer2012*
   - `{containerName}`: *VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0*
   - `{protectedItemName}`: *sqldatabase;mssqlserver;msdb*
   - `{resourceGroupName}`: *SQLServerSelfHost*

   The GET URI has all the required parameters. No additional request body is needed.

    ```http
    GET "https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.RecoveryServices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/recoveryPoints?api-version=2016-12-01"
    ```

#### Example response for fetch recovery points

Once you submit the *GET* URI, a 200 response is returned:

```http
HTTP/1.1 200 OK
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: fab6cc6f-db1e-4ac1-acac-fc82ebdb1fdb
x-ms-client-request-id: 6fb93717-2876-47df-b01f-d53af5f08785; 6fb93717-2876-47df-b01f-d53af5f08785
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14999
x-ms-correlation-request-id: fab6cc6f-db1e-4ac1-acac-fc82ebdb1fdb
x-ms-routing-request-id: SOUTHINDIA:20180604T061127Z:fab6cc6f-db1e-4ac1-acac-fc82ebdb1fdb
Cache-Control: no-cache
Date: Mon, 04 Jun 2018 06:11:26 GMT
Server: Microsoft-IIS/8.0
X-Powered-By: ASP.NET

{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/recoveryPoints/55515936059579",
      "name": "55515936059579",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLRecoveryPoint",
        "recoveryPointTimeInUTC": "2018-06-01T22:15:12Z",
        "type": "Full"
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/recoveryPoints/62043109781074",
      "name": "62043109781074",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLRecoveryPoint",
        "recoveryPointTimeInUTC": "2018-05-31T22:15:08Z",
        "type": "Full"
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/recoveryPoints/69710749096214",
      "name": "69710749096214",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLRecoveryPoint",
        "recoveryPointTimeInUTC": "2018-05-30T22:15:09Z",
        "type": "Full"
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/recoveryPoints/55459165802209",
      "name": "55459165802209",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLRecoveryPoint",
        "recoveryPointTimeInUTC": "2018-05-29T22:15:15Z",
        "type": "Full"
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/recoveryPoints/56798287946753",
      "name": "56798287946753",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLRecoveryPoint",
        "recoveryPointTimeInUTC": "2018-05-28T13:18:15Z",
        "type": "Full"
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/recoveryPoints/DefaultRangeRecoveryPoint",
      "name": "DefaultRangeRecoveryPoint",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLPointInTimeRecoveryPoint",
        "timeRanges": [
          {
            "startTime": "2018-05-28T11:03:34Z",
            "endTime": "2018-06-02T00:02:31Z"
          }
        ],
        "type": "Log"
      }
    }
  ]
}
```

The recovery point is identified with the `{name}` field in the response above.

### Query snapshot and streaming recovery points

For snapshot-protected SQL instances and databases, use API version `2024-01-31-preview` for the following recovery-point queries. Replace the URI placeholders with the vault details and the container and protected item names returned by [listing protected items](manage-azure-sql-vm-rest-api.md#list-protected-sql-instances-and-databases). URL-encode the filter expression when sending the request.

Use `restorePointQueryType` to select recovery-point types:

| Value | Recovery points returned |
| --- | --- |
| `FullDifferentialAndSnapshot` | Full, differential, and snapshot recovery points for a database. |
| `Snapshot` | Snapshot recovery points for a database or instance. |
| `FullAndDifferential` | Streaming full and differential recovery points for a database. |
| `Log` | Log recovery time ranges for a database. |

#### List full, differential, and snapshot recovery points

Use the database protected item name, such as `SQLDataBase;mssqlserver;testdb`:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=restorePointQueryType eq 'FullDifferentialAndSnapshot'
```

#### List snapshot recovery points

For a database, use its database protected item name:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=restorePointQueryType eq 'Snapshot'
```

For an instance, use its instance protected item name, such as `SQLInstance;mssqlserver`:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{instanceProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=restorePointQueryType eq 'Snapshot'
```

#### List streaming full and differential recovery points

You can also specify a time window and include soft-deleted recovery points:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=startDate eq '2024-02-15 05:12:12 PM' and endDate eq '2024-02-22 05:12:12 PM' and restorePointQueryType eq 'FullAndDifferential' and includeSoftDeletedRP eq 'true'
```

Replace the sample dates with your required time window. The `value` array contains recovery points with properties such as `recoveryPointTimeInUTC`, `type`, and `recoveryPointTierDetails`. Retention information can appear in `recoveryPointProperties`, including `expiryTime`, `ruleName`, and `isSoftDeleted`.

### Query log recovery ranges for point-in-time restore

To list log recovery ranges for a database, use the following request:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=restorePointQueryType eq 'Log'
```

The response includes a `DefaultRangeRecoveryPoint` item. The following example shows selected response fields:

```json
{
  "value": [
    {
      "name": "DefaultRangeRecoveryPoint",
      "properties": {
        "objectType": "AzureWorkloadSQLPointInTimeRecoveryPoint",
        "timeRanges": [
          {
            "startTime": "2024-02-07T17:12:13.2853054Z",
            "endTime": "2024-02-22T15:30:13Z"
          }
        ],
        "type": "Log"
      }
    }
  ]
}
```

Select a restore time within the returned ranges.

#### Query database log ranges by recovery mode

For streaming-based recovery, specify `recoveryMode eq 'WorkloadRecovery'`:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=restorePointQueryType eq 'Log' and recoveryMode eq 'WorkloadRecovery'
```

For snapshot-based recovery, specify `recoveryMode eq 'SnapshotAttachAndRecover'`:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=restorePointQueryType eq 'Log' and recoveryMode eq 'SnapshotAttachAndRecover'
```

Both queries return the log recovery-range response format shown earlier.

#### Query database log ranges for an instance restore

For instance point-in-time restore, first select an instance snapshot recovery point and [retrieve its included databases](#get-databases-and-disk-paths-in-an-instance-snapshot). For each included database, query its log ranges with the selected base snapshot details:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2024-01-31-preview&$filter=restorePointQueryType eq 'Log' and recoveryMode eq 'SnapshotAttachAndRecover' and baseSnapshotRPId eq '{baseSnapshotRPId}' and baseRPDatasourceId eq '{baseRPDatasourceId}'
```

- `{baseSnapshotRPId}`: The `name` of the selected instance snapshot recovery point.
- `{baseRPDatasourceId}`: The `protectedItemDataSourceId` of the **instance** protected item, not the child database's datasource ID.
- `{databaseProtectedItemName}`: The protected item name of the child database being queried.

### Get databases and disk paths in an instance snapshot

Get the selected instance recovery point to retrieve its included databases and disk paths. Use the same metadata when preparing an instance snapshot restore or instance point-in-time restore:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{instanceProtectedItemName}/recoveryPoints/{snapshotRecoveryPointId}?api-version=2024-01-31-preview
```

`{snapshotRecoveryPointId}` is the recovery point's `name`. The following example shows selected response fields:

```json
{
  "name": "2265756871711897922",
  "properties": {
    "objectType": "AzureWorkloadSQLRecoveryPoint",
    "extendedInfo": {
      "dataDirectoryTimeInUTC": "2024-03-13T08:03:25Z",
      "dataDirectoryPaths": [
        {
          "type": "DiskDrives",
          "path": "F:\\"
        },
        {
          "type": "DiskDrives",
          "path": "G:\\"
        }
      ],
      "includedDatabases": [
        {
          "datasourceId": "2265838378698362078",
          "datasourceName": "MSSQLSERVER;user1"
        }
      ],
      "snapshotRecoveryPointInfo": {}
    },
    "recoveryPointTimeInUTC": "2024-03-13T08:03:25Z",
    "type": "SnapshotFull",
    "recoveryPointTierDetails": [
      {
        "type": "InstantRP",
        "status": "Valid"
      }
    ]
  }
}
```

`extendedInfo.includedDatabases` identifies the databases captured in the selected snapshot. `extendedInfo.dataDirectoryPaths` identifies the disk paths available for advanced restore configuration.

### Get database paths for advanced restore configuration

For a database streaming or snapshot recovery point, retrieve the recovery point details:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints/{recoveryPointId}?api-version=2023-02-01
```

Inspect `properties.extendedInfo.dataDirectoryPaths` for data and log file paths and logical names. For example:

```json
{
  "dataDirectoryTimeInUTC": "2024-03-04T18:03:35Z",
  "dataDirectoryPaths": [
    {
      "type": "Data",
      "path": "F:\\DATA\\TestDB1.mdf",
      "logicalName": "TestDB1"
    },
    {
      "type": "Log",
      "path": "F:\\LOG\\TestDB1_log.ldf",
      "logicalName": "TestDB1_log"
    }
  ],
  "snapshotRecoveryPointInfo": {}
}
```

For database point-in-time restore, request extended information when listing log recovery ranges. The following example uses snapshot-based recovery:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{databaseProtectedItemName}/recoveryPoints?api-version=2023-02-01&$filter=startDate eq '2024-02-06 07:50:56 AM' and endDate eq '2024-03-07 07:23:05 AM' and extendedInfo eq 'true' and restorePointQueryType eq 'Log' and recoveryMode eq 'SnapshotAttachAndRecover'
```

Replace the sample dates with the required query window. The response contains the log recovery ranges and `properties.extendedInfo`, including `dataDirectoryTimeInUTC`, `dataDirectoryPaths`, and `snapshotRecoveryPointInfo`.

The preceding queries retrieve recovery points and restore configuration metadata. The following section describes the existing streaming database restore request.

### Database recovery using REST API

Triggering restore is a *POST* request. To perform this operation, use the [trigger restore](/rest/api/backup/restores/trigger) REST API.

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/recoveryPoints/{recoveryPointId}/restore?api-version=2019-05-13
```

The values {containerName} and {protectedItemName} are as set [here](#fetch-containername-and-protecteditemname) and recoveryPointID is the {name} field of the recovery point mentioned above.

```http
POST https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerSelfHost/providers/Microsoft.RecoveryServices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0/protectedItems/sqldatabase;mssqlserver;msdb/recoveryPoints/56798287946753/restore?api-version=2019-05-13'
```

#### Create request body

##### Request body example to restore a database to the same data directory

The following request body defines properties required to trigger SQL database restore to the same data directory.

```json
{
   "properties":{
        "objectType":"AzureWorkloadSQLRestoreRequest",
        "shouldUseAlternateTargetLocation":false,
        "isNonRecoverable":false,
        "targetInfo":{"ContainerName": "compute;SQLServerPMDemo;sqlserver-0", "DatabaseName" : "SQLINSTANCE/msdb"},
        "alternateDirectoryPaths":null,
        "isFallbackOnDefaultDirectoryEnabled":true,
        "recoveryType":"AlternateLocation",
        "sourceResourceId":"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerPMDemo/providers/Azure/virtualmachines/compute;SQLServerPMDemo;sqlserver-0"       
    }
}
```

##### Request body example to restore a database to an alternate data directory

The following request body defines properties required to trigger SQL database restore to the same data directory.

```json
{
    "properties":{ 
        "objectType":"AzureWorkloadSQLRestoreRequest",
        "shouldUseAlternateTargetLocation":true,
        "isNonRecoverable":false,
        "targetInfo":
        {
            "overwriteOption":"Overwrite","containerName":"compute;oneboxrg;oneboxvm","databaseName":"SQLINSTANCE/msdb"},
            "alternateDirectoryPaths":[{"mappingType":"Log","sourcePath":"C:\\SQLfiles\\Default.ldf","targetPath":"C:\\SQLFiles\\Temp.ldf"}],
            "recoveryType":"AlternateLocation",
            "sourceResourceId":"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerPMDemo/providers/Azure/virtualmachines/compute;SQLServerPMDemo;sqlserver-0"
        }
    }
}
```

#### Response

Triggering of a restore operation is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). This operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation is complete.

##### Response example

```http
Status Code:
OK

Headers:
Pragma                        : no-cache
Cache-Control                 : no-cache
Server                        : Microsoft-IIS/10.0,Microsoft-IIS/10.0
X-Content-Type-Options        : nosniff
x-ms-request-id               : f17973f5-c788-482f-8aad-6bb50e647a2e
x-ms-client-request-id        : b0356a0e-c68d-4ac2-a53f-4f546685146d,b0356a0e-c68d-4ac2-a53f-4f546685146d
X-Powered-By                  : ASP.NET
Strict-Transport-Security     : max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-resource-requests: 149
x-ms-correlation-request-id   : f17973f5-c788-482f-8aad-6bb50e647a2e
x-ms-routing-request-id       : SOUTHINDIA:20210801T104711Z:f17973f5-c788-482f-8aad-6bb50e647a2e
Date                          : Sun, 01 Aug 2021 10:47:11 GMT

{
    "id":"/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerSelfHost/providers/Microsoft.RecoveryServices/vaults/SQLServer2012/backupJobs/0bda1a53-73fa-427e-9a1c-72a2016adee3",
    "name": "0bda1a53-73fa-427e-9a1c-72a2016adee3",
    "type": "Microsoft.RecoveryServices/vaults/backupJobs",
    "properties": {
    "jobType": "AzureWorkloadJob",
    "actionsInfo": [
      1
    ],
    "workloadType": "SQLDataBase",
    "duration": "PT1.6543659S",
    "extendedInfo": {
      "tasksList": [
        {
          "taskId": "Transfer data from vault",
          "status": "InProgress"
        }
      ],
      "propertyBag": {
        "Job Type": "Recovery to the original database"
      }
    },
    "isUserTriggered": true,
    "entityFriendlyName": "msdb [sqlserver-0]",
    "backupManagementType": "AzureWorkload",
    "operation": "Restore",
    "status": "InProgress",
    "startTime": "2021-08-01T10:47:09.5865449Z",
    "activityId": "b0356a0e-c68d-4ac2-a53f-4f546685146d"
  }
}
```

## Cross-region restore

If you've enabled Cross-region restore, then the recovery points will be replicated to the secondary paired region as well. Then, you can fetch those recovery points and trigger restore to a machine, present in that paired region. With the normal restore, the target machine should be registered to the target vault in the secondary region. The following steps describe the end-to-end process:

1. Fetch the backup items that are replicated to the secondary region. 

   For the below example, you need to have:

   - A container: *VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0*
   - A protected item: *sqldatabase;mssqlserver;msdb*) for the database that needs to be restored, using the steps mentioned earlier in this document.

1. Fetch the recovery points (distinct and/or logs) that are replicated to the secondary region.
1. Choose a target server, which is registered to a vault within the secondary paired region.
1. Trigger restore to that server and track it using *JobId*.

>[!Note]
>The RPO for the backup data to be available in secondary region is 12 hours. Therefore, when you turn on CRR, the RPO for the secondary region is 12 hours + log frequency duration (that can be set to a minimum of 15 minutes).

### Fetch distinct recovery points from the secondary region

Use the [List Recovery Points API](/rest/api/backup/recovery-points-crr/list) to fetch the list of available recovery points for the database in the secondary region. In the following example, an optional filter is applied to fetch full and differential recovery points in a given time range.

```http
GET "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerSelfHost/providers/Microsoft.RecoveryServices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/recoveryPoints/?$filter=startDate eq'2021-07-25 08:41:32 AM' and endDate eq '2021-08-01 08:41:45 AM' and restorePointQueryType eq 'FullAndDifferential' and extendedInfo eq 'True'&api-version=2018-12-20"
```

#### Example Response for fetch recovery points

```http
Headers:
Pragma                        : no-cache
X-Content-Type-Options        : nosniff
x-ms-request-id               : 66b3fbb4-e38a-4a4b-98c7-56db66ab52e6
x-ms-client-request-id        : 35eb7834-8b5c-4a2c-adda-eee2ed02eb08,35eb7834-8b5c-4a2c-adda-eee2ed02eb08
Strict-Transport-Security     : max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-resource-requests: 149
x-ms-correlation-request-id   : 66b3fbb4-e38a-4a4b-98c7-56db66ab52e6
x-ms-routing-request-id       : SOUTHINDIA:20210801T102906Z:66b3fbb4-e38a-4a4b-98c7-56db66ab52e6
Cache-Control                 : no-cache
Date                          : Sun, 01 Aug 2021 10:29:06 GMT
Server                        : Microsoft-IIS/10.0
X-Powered-By                  : ASP.NET

Body:
{
  "value": [
    {
      "id":
"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerSelfHost/providers/Microsoft.RecoveryServices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/RecoveryPoints/932604119111216382",
      "name": "932604119111216382",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLRecoveryPoint",
        "recoveryPointTimeInUTC": "2021-07-31T16:33:48Z",
        "type": "Full"
      }
    },
    {
      "id":
"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerSelfHost/providers/Microsoft.RecoveryServices/vaults/SQLServer2012/backupFabrics/Azure/protectionContainers/VMAppContainer;compute;SQLServerPMDemo;sqlserver-0/protectedItems/SQLDataBase;mssqlserver;msdb/RecoveryPoints/932599942005436803",
      "name": "932599942005436803",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "AzureWorkloadSQLRecoveryPoint",
        "recoveryPointTimeInUTC": "2021-07-30T16:33:49Z",
        "type": "Full"
      }
    },
.....
```

The recovery point is identified with the `{name}` field in the response above.

### Get access token

To perform Cross-region restore, you will require an access token to enable proper communication between the Azure Backup services. To get an access token, follow these steps:

1. Use the [Microsoft Entra Properties API](/rest/api/backup/aad-properties/get) to fetch Microsoft Entra properties for the secondary region (*westus* in the below example).

    ```http
    GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.RecoveryServices/locations/westus/backupAadProperties?api-version=2018-12-20
    ```

   The response returned is of the below format:

    ```json
    {
      "properties": {
        "tenantId": "00000000-0000-0000-0000-000000000000",
        "audience": "https://RecoveryServices/IaasCoord/aadmgmt/wus",
        "servicePrincipalObjectId": "00000000-0000-0000-0000-000000000000"
      }
    }
    ```

1. Use the Get Access Token API to get an access token to enable communication between the Azure Backup services.

    ```http
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/recoveryPoints/{recoveryPointId}/accessToken?api-version=2018-12-20
    ```

   For the request body, paste the contents of the response returned by the Microsoft Entra Properties API in the previous step.

   The response returned format is as follows:

    ```json
    {
      "protectableObjectUniqueName": "MSSQLSERVER/model",
        "protectableObjectFriendlyName": "msdb",
        "protectableObjectWorkloadType": "SQL",
        "protectableObjectProtectionState": "Protected",
        "protectableObjectContainerHostOsName": "sqlserver-0",
        "protectableObjectParentLogicalContainerName": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/sqlserver-0",
        "containerId": "0000000",
        "policyName": "HourlyLogBackup",
        "policyId": "00000000-0000-0000-0000-000000000000",
        "objectType": "WorkloadCrrAccessToken",
        "accessTokenString": "<access-token-string>",
        "subscriptionId": "00000000-0000-0000-0000-000000000000",
        "resourceGroupName": "SQLServerSelfHost",
        "resourceName": "SQLServer2012",
        "resourceId": "0000000000000000000",
        "protectionContainerId": 0000000,
        "recoveryPointId": "932603497994988273",
        "recoveryPointTime": "7/31/2021 4:33:17 PM",
        "containerName": "Compute;SQLServerPMDemo;sqlserver-0",
        "containerType": "VMAppContainer",
        "backupManagementType": "AzureWorkload",
        "datasourceType": "SQLDataBase",
        "datasourceName": "msdb",
        "datasourceId": "932350676859704517",
        "datasourceContainerName": "Compute;SQLServerPMDemo;sqlserver-0",
        "coordinatorServiceStampId": "00000000-0000-0000-0000-000000000000",
        "coordinatorServiceStampUri": "https://pod01-wbcm1.eus.backup.windowsazure.com",
        "protectionServiceStampId": "00000000-0000-0000-0000-000000000000",
        "protectionServiceStampUri": "https://pod01-prot1j-int.eus.backup.windowsazure.com",
        "rpOriginalSAOption": false,
        "rpIsManagedVirtualMachine": false,
        "bMSActiveRegion": "EastUS"
    }
    ```

### Restore disks to the secondary region

Use the [Cross-Region Restore Trigger API](/rest/api/backup/cross-region-restore/trigger) to restore an item to the secondary region.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.RecoveryServices/locations/{azureRegion}/backupCrossRegionRestore?api-version=2018-12-20
```

The request body should have two parts:

1. *crossRegionRestoreAccessDetails*: Paste the *properties* block of the response from the Get Access Token API request performed in the previous step to fill this segment of the request body.

2. *restoreRequest*: To fill the *restoreRequest* segment of the request body, you need to pass the details of the container (registered to a vault in the secondary region) to which the database must be restored, along with the name under which the restored database should be stored. To perform restore of a full backup to the secondary region, specify *AlternateLocation* as the recovery type.

Sample request body to restore the disks of a VM to the secondary region is as follows:

```json
  {
  "crossRegionRestoreAccessDetails": {
	      "protectableObjectUniqueName": "MSSQLSERVER/model",
        "protectableObjectFriendlyName": "msdb",
        "protectableObjectWorkloadType": "SQL",
        "protectableObjectProtectionState": "Protected",
        "protectableObjectContainerHostOsName": "sqlserver-0",
        "protectableObjectParentLogicalContainerName": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/sqlserver-0",
        "containerId": "0000000",
        "policyName": "HourlyLogBackup",
        "policyId": "00000000-0000-0000-0000-000000000000",
        "objectType": "WorkloadCrrAccessToken",
        "accessTokenString": "<access-token-string>",
        "subscriptionId": "00000000-0000-0000-0000-000000000000",
        "resourceGroupName": "SQLServerSelfHost",
        "resourceName": "SQLServer2012",
        "resourceId": "0000000000000000000",
        "protectionContainerId": 0000000,
        "recoveryPointId": "932603497994988273",
        "recoveryPointTime": "7/31/2021 4:33:17 PM",
        "containerName": "Compute;SQLServerPMDemo;sqlserver-0",
        "containerType": "VMAppContainer",
        "backupManagementType": "AzureWorkload",
        "datasourceType": "SQLDataBase",
        "datasourceName": "msdb",
        "datasourceId": "932350676859704517",
        "datasourceContainerName": "Compute;SQLServerPMDemo;sqlserver-0",
        "coordinatorServiceStampId": "00000000-0000-0000-0000-000000000000",
        "coordinatorServiceStampUri": "https://pod01-wbcm1.eus.backup.windowsazure.com",
        "protectionServiceStampId": "00000000-0000-0000-0000-000000000000",
        "protectionServiceStampUri": "https://pod01-prot1j-int.eus.backup.windowsazure.com",
        "rpOriginalSAOption": false,
        "rpIsManagedVirtualMachine": false,
        "bMSActiveRegion": "EastUS"
    },
    "restoreRequest": {
        "objectType": "AzureWorkloadSQLRestoreRequest",
        "shouldUseAlternateTargetLocation": true,
        "isNonRecoverable": false,
        "alternateDirectoryPaths": [],
        "recoveryType": "AlternateLocation",
        "sourceResourceId":"/subscriptions/600000000-0000-0000-0000-000000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/sqlserver-0",
        "targetInfo": {
            "overwriteOption": "FailOnConflict",
          "containerId":"/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/RestoreRG/providers/Microsoft.RecoveryServices/vaults/wusRestoreVault/backupFabrics/Azure/protectionContainers/vmappcontainer;compute;restorerg;wusrestorevm",
          "databaseName": "MSSQLSERVER/msdb_restored_8_1_2021_1758"
        }
      }
  }
```

### Perform point-in-time cross-region restore for a SQL instance protected by a snapshot policy

Use this flow to restore the databases included in a SQL instance snapshot and replay their log backups to a common point in time in the secondary region.

> [!IMPORTANT]
> The selected point in time must be covered by the log range of every database that you want to recover from the instance snapshot. Request the access token for the SQL instance protected item and the selected concrete snapshot recovery point.

#### Discover the instance snapshot and log ranges

1. List the recovery points for the SQL instance protected item.

    ```http
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{sourceVaultName}/backupFabrics/Azure/protectionContainers/{sourceContainerName}/protectedItems/SQLInstance%3Bmssqlserver/recoveryPoints?api-version=2023-01-15
    ```

    Select a recovery point whose response contains all of the following values:

    - `properties.type` is `SnapshotFull`.
    - `properties.crossRegionRestoreState` is `Supported`.
    - `properties.recoveryPointTierDetails` contains a `HardenedRP` entry whose status is `Valid`.

1. Get the selected recovery point to retrieve its authoritative extended information.

    ```http
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{sourceVaultName}/backupFabrics/Azure/protectionContainers/{sourceContainerName}/protectedItems/SQLInstance%3Bmssqlserver/recoveryPoints/{instanceSnapshotRecoveryPointId}?api-version=2023-01-15
    ```

    Use `properties.extendedInfo.includedDatabases` to identify the child databases included in the snapshot. The response also contains the source disk paths and snapshot metadata required for restore.

1. Get the SQL instance protected item and save `properties.protectedItemDataSourceId`.

    ```http
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{sourceVaultName}/backupFabrics/Azure/protectionContainers/{sourceContainerName}/protectedItems/SQLInstance%3Bmssqlserver?api-version=2023-01-15
    ```

1. For each included database, list the log range associated with the selected instance snapshot.

    ```http
    GET "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{sourceVaultName}/backupFabrics/Azure/protectionContainers/{sourceContainerName}/protectedItems/SQLDataBase%3Bmssqlserver%3B{databaseName}/recoveryPoints?api-version=2023-01-15&$filter=restorePointQueryType eq 'Log' and recoveryMode eq 'SnapshotAttachAndRecover' and baseSnapshotRPId eq '{instanceSnapshotRecoveryPointId}' and baseRPDatasourceId eq '{instanceProtectedItemDataSourceId}'"
    ```

    The response contains a `DefaultRangeRecoveryPoint`. Choose a UTC `pointInTime` that falls inside the returned `properties.timeRanges` for every database being restored.

#### Get the access token for the instance snapshot

Fetch the Microsoft Entra properties for the secondary region.

```http
GET "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.RecoveryServices/locations/{secondaryRegion}/backupAadProperties?api-version=2023-01-15&$filter=backupManagementType eq 'AzureWorkload'"
```

Pass the returned `properties` object in the request body when you request an access token for the SQL instance and selected snapshot recovery point.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{sourceVaultName}/backupFabrics/Azure/protectionContainers/{sourceContainerName}/protectedItems/SQLInstance%3Bmssqlserver/recoveryPoints/{instanceSnapshotRecoveryPointId}/accessToken?api-version=2023-01-15
```

```json
{
  "properties": {
    "tenantId": "<tenant-id>",
    "audience": "<audience-returned-by-the-service>",
    "servicePrincipalObjectId": "<service-principal-object-id>",
    "identityVersion": 1
  }
}
```

#### Trigger the SQL instance point-in-time restore

Use `AzureWorkloadSQLPointInTimeRestoreRequest` with `SnapshotAttachAndRecover`. Copy the complete `properties` object from the access-token response into `crossRegionRestoreAccessDetails`.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.RecoveryServices/locations/{secondaryRegion}/backupCrossRegionRestore?api-version=2023-01-15
```

```json
{
  "crossRegionRestoreAccessDetails": {
    "objectType": "WorkloadCrrAccessToken",
    "accessTokenString": "<access-token-string>",
    "recoveryPointId": "<instance-snapshot-recovery-point-id>",
    "datasourceType": "SQLInstance",
    "datasourceName": "mssqlserver"
  },
  "restoreRequest": {
    "objectType": "AzureWorkloadSQLPointInTimeRestoreRequest",
    "shouldUseAlternateTargetLocation": true,
    "recoveryMode": "SnapshotAttachAndRecover",
    "isNonRecoverable": false,
    "recoveryType": "AlternateLocation",
    "sourceResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{sourceVmResourceGroup}/providers/Microsoft.Compute/virtualMachines/{sourceVmName}",
    "targetVirtualMachineId": "/subscriptions/{subscriptionId}/resourceGroups/{targetVmResourceGroup}/providers/Microsoft.Compute/virtualMachines/{targetVmName}",
    "targetResourceGroupName": "{targetVmResourceGroup}",
    "pointInTime": "2026-08-09T17:18:23.500Z",
    "alternateDirectoryPaths": [
      {
        "mappingType": "DiskDrives",
        "sourcePath": "F:\\",
        "targetPath": "J:\\"
      },
      {
        "mappingType": "DiskDrives",
        "sourcePath": "G:\\",
        "targetPath": "K:\\"
      }
    ],
    "targetInfo": {
      "containerId": "/subscriptions/{subscriptionId}/resourceGroups/{targetVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{targetVaultName}/backupFabrics/Azure/protectionContainers/{targetContainerName}",
      "overwriteOption": "FailOnConflict",
      "databaseName": "MSSQLSERVER/*_{databaseNameSuffix}"
    },
    "userAssignedManagedIdentityDetails": {
      "identityArmId": "/subscriptions/{subscriptionId}/resourceGroups/{identityResourceGroup}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}",
      "userAssignedIdentityProperties": {
        "clientId": "<managed-identity-client-id>",
        "principalId": "<managed-identity-principal-id>"
      }
    }
  }
}
```

The abbreviated `crossRegionRestoreAccessDetails` object above shows the fields that identify the instance scenario. In the actual request, copy every property returned by the access-token API, including `tokenExtendedInformation` when it is present.

### Perform cross-region log restore for a child database protected by a snapshot policy

Use this flow to restore one child database to a selected point in time when the database is protected as part of a SQL instance snapshot policy.

> [!IMPORTANT]
> For a child-database log restore, request the access token on the child `SQLDataBase` protected item and `DefaultRangeRecoveryPoint`. Don't request the token on the parent SQL instance recovery point.

#### Discover the child database log range

List log recovery points for the child database protected item.

```http
GET "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{sourceVaultName}/backupFabrics/Azure/protectionContainers/{sourceContainerName}/protectedItems/SQLDataBase%3Bmssqlserver%3B{databaseName}/recoveryPoints?api-version=2023-01-15&$filter=restorePointQueryType eq 'Log'"
```

The response contains a `DefaultRangeRecoveryPoint` with one or more UTC ranges:

```json
{
  "value": [
    {
      "name": "DefaultRangeRecoveryPoint",
      "properties": {
        "objectType": "AzureWorkloadSQLPointInTimeRecoveryPoint",
        "timeRanges": [
          {
            "startTime": "2026-07-26T19:25:29.9811766Z",
            "endTime": "2026-08-10T18:31:23Z"
          }
        ],
        "type": "Log"
      }
    }
  ]
}
```

Choose a UTC `pointInTime` inside one of the returned ranges.

#### Get the access token for the child database log range

Fetch the Microsoft Entra properties for the secondary region by using the Azure workload filter shown in the SQL instance section. Pass the returned `properties` object when requesting the child database access token.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{sourceVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{sourceVaultName}/backupFabrics/Azure/protectionContainers/{sourceContainerName}/protectedItems/SQLDataBase%3Bmssqlserver%3B{databaseName}/recoveryPoints/DefaultRangeRecoveryPoint/accessToken?api-version=2023-01-15
```

The returned access-token properties identify the selected child database with values such as:

```json
{
  "properties": {
    "protectableObjectUniqueName": "MSSQLSERVER/{databaseName}",
    "protectableObjectFriendlyName": "{databaseName}",
    "objectType": "WorkloadCrrAccessToken",
    "accessTokenString": "<access-token-string>",
    "recoveryPointId": "DefaultRangeRecoveryPoint",
    "datasourceType": "SQLDataBase",
    "datasourceName": "{databaseName}"
  }
}
```

#### Trigger the child database log restore

Use `AzureWorkloadSQLPointInTimeRestoreRequest` with `SnapshotAttachAndRecover`. The target database name must use the `MSSQLSERVER/{targetDatabaseName}` logical path format.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.RecoveryServices/locations/{secondaryRegion}/backupCrossRegionRestore?api-version=2023-01-15
```

```json
{
  "crossRegionRestoreAccessDetails": {
    "objectType": "WorkloadCrrAccessToken",
    "accessTokenString": "<access-token-string>",
    "recoveryPointId": "DefaultRangeRecoveryPoint",
    "datasourceType": "SQLDataBase",
    "datasourceName": "{databaseName}"
  },
  "restoreRequest": {
    "objectType": "AzureWorkloadSQLPointInTimeRestoreRequest",
    "shouldUseAlternateTargetLocation": true,
    "recoveryMode": "SnapshotAttachAndRecover",
    "isNonRecoverable": false,
    "recoveryType": "AlternateLocation",
    "sourceResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{sourceVmResourceGroup}/providers/Microsoft.Compute/virtualMachines/{sourceVmName}",
    "targetVirtualMachineId": "/subscriptions/{subscriptionId}/resourceGroups/{targetVmResourceGroup}/providers/Microsoft.Compute/virtualMachines/{targetVmName}",
    "targetResourceGroupName": "{targetVmResourceGroup}",
    "pointInTime": "2026-08-03T06:58:26Z",
    "alternateDirectoryPaths": [
      {
        "mappingType": "DiskDrives",
        "sourcePath": "F:\\",
        "targetPath": "J:\\"
      },
      {
        "mappingType": "DiskDrives",
        "sourcePath": "G:\\",
        "targetPath": "K:\\"
      }
    ],
    "targetInfo": {
      "containerId": "/subscriptions/{subscriptionId}/resourceGroups/{targetVaultResourceGroup}/providers/Microsoft.RecoveryServices/vaults/{targetVaultName}/backupFabrics/Azure/protectionContainers/{targetContainerName}",
      "overwriteOption": "FailOnConflict",
      "databaseName": "MSSQLSERVER/{targetDatabaseName}"
    },
    "userAssignedManagedIdentityDetails": {
      "identityArmId": "/subscriptions/{subscriptionId}/resourceGroups/{identityResourceGroup}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}",
      "userAssignedIdentityProperties": {
        "clientId": "<managed-identity-client-id>",
        "principalId": "<managed-identity-principal-id>"
      }
    }
  }
}
```

As with the instance request, copy the complete access-token `properties` object into `crossRegionRestoreAccessDetails`. Treat `accessTokenString` and `tokenExtendedInformation` as secrets and don't write them to logs or include them in shared artifacts.

For both point-in-time scenarios, the trigger is asynchronous. Follow the `Azure-AsyncOperation`, `Location`, and `Retry-After` response headers, and verify the terminal status of the resulting Recovery Services vault job before treating the restore as successful.

## Next steps

Manage SQL server databases in Azure VMs with [Azure portal](manage-monitor-sql-database-backup.md), [Azure CLI](backup-azure-sql-manage-cli.md), [REST API](manage-azure-sql-vm-rest-api.md).

For more information on the Azure Backup REST APIs, see the following documents:

- [Azure Recovery Services provider REST API](/rest/api/recoveryservices/).
- [Get started with Azure REST API](/rest/api/azure/).