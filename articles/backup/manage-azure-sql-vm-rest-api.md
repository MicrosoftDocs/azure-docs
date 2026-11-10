---
title: Manage SQL server databases in Azure VMs with REST API
description: Learn how to use REST API to manage and monitor SQL server databases in Azure VM that are backed up by Azure Backup.
ms.topic: how-to
ms.date: 02/13/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka

# Customer intent: "As a database administrator, I want to manage and monitor SQL server databases in Azure VMs using REST API, so that I can automate backup and restore operations efficiently and track the job status effectively."
---

# Manage SQL server databases in Azure VMs using REST API

This article describes how to manage and monitor the SQL server databases that are backed-up by [Azure Backup](backup-overview.md) using REST API. You can also use [Azure CLI](backup-azure-sql-manage-cli.md) and [Azure portal](manage-monitor-sql-database-backup.md) to manage SQL database backups.

To view the backup and restore scenarios that we support today, see the [support matrix](sql-support-matrix.md#scenario-support). For common questions, see the [frequently asked questions](faq-backup-sql-server.yml).

## Monitor jobs

The Azure Backup service triggers jobs that run in the background. This includes scenarios, such as triggering backup, restore operations, and disabling backup. You can track these jobs using their IDs. Learn more about [managing backup and restore jobs](backup-azure-arm-userestapi-managejobs.md).

### Fetch job information from operations

An operation, such as triggering backup, returns a *jobID* in response.

For example, the final response of a [trigger backup REST API](backup-azure-sql-vm-rest-api.md#trigger-an-on-demand-backup-for-the-database) operation is as follows:

```json
{
  "id": "cd2a3b13-d392-4e81-86ac-02ea91cc70b9",
  "name": "cd2a3b13-d392-4e81-86ac-02ea91cc70b9",
  "status": "Succeeded",
  "startTime": "2018-05-28T11:43:21.6516182Z",
  "endTime": "2018-05-28T11:43:21.6516182Z",
  "properties": {
    "objectType": "OperationStatusJobExtendedInfo",
    "jobId": "c22eca5d-0c1c-48a0-a40d-69bef708d92a"
  }
}
```

You can identify the Backup job is identified by the **jobId** field and track as [mentioned here](/rest/api/backup/job-details) using a GET request.

### Track the job

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupJobs/{jobName}?api-version=2016-12-01
```

The `{jobName}` is the *jobId* mentioned above. The response is 200 (OK) with the **status** field indicating the status of the job. Once it's *Completed* or *CompletedWithWarnings*, the **extendedInfo** section shows more job details.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/Microsoft.RecoveryServices/vaults/SQLServer2012/backupJobs/c22eca5d-0c1c-48a0-a40d-69bef708d92a?api-version=2016-12-01
```

#### Response

Name  | Type  |  Description
--- | --- | ----
200 OK |  JobResource  | OK

#### Response example

Once the *GET* URI is submitted, a 200 response is returned.

```http
HTTP/1.1 200 OK
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: e057b496-8ceb-45b6-bd9e-367f7dd73d6d
x-ms-client-request-id: 1ffda117-b2c0-4a80-a9ba-43ba66eaec9b; 1ffda117-b2c0-4a80-a9ba-43ba66eaec9b
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14999
x-ms-correlation-request-id: e057b496-8ceb-45b6-bd9e-367f7dd73d6d
x-ms-routing-request-id: SOUTHINDIA:20180528T115536Z:e057b496-8ceb-45b6-bd9e-367f7dd73d6d
Cache-Control: no-cache
Date: Mon, 28 May 2018 11:55:35 GMT
Server: Microsoft-IIS/8.0
X-Powered-By: ASP.NET

{
  "id": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupJobs/c22eca5d-0c1c-48a0-a40d-69bef708d92a",
  "name": "c22eca5d-0c1c-48a0-a40d-69bef708d92a",
  "type": "Microsoft.RecoveryServices/vaults/backupJobs",
  "properties": {
    "jobType": "AzureWorkloadJob",
    "workloadType": "SQLDataBase",
    "duration": "00:03:13.6439467",
    "actionsInfo": [
      1
    ],
    "errorDetails": [
      {
        "errorCode": 510008,
        "errorString": "Operation cancelled as a conflicting operation was already running on the same database.",
        "errorTitle": "OperationCancelledBecauseConflictingOperationRunningUserError",
        "recommendations": [
          "Please try again after sometime."
        ]
      }
    ],
    "extendedInfo": {
      "tasksList": [
        {
          "taskId": "Transfer data to vault",
          "status": "Failed"
        }
      ],
      "propertyBag": {
        "Data Transferred (in MB)": "0"
      }
    },
    "entityFriendlyName": "MSSQLSERVER/msDB [sqlserver-0.contoso.com]",
    "backupManagementType": "AzureWorkload",
    "operation": "Backup (Full)",
    "status": "Failed",
    "startTime": "2018-05-28T11:43:21.6516182Z",
    "endTime": "2018-05-28T11:46:35.2955649Z",
    "activityId": "6b033cf6-f875-4c03-8985-9add07ec2845"
  }
} 
}
```

## List protected SQL instances and databases

To list SQL instances and their databases for instance-level snapshot protection, use API version `2024-01-31-preview`. Replace the URI placeholders with your vault details. The following examples show selected response fields.

### List protected SQL instances

Filter protected items by `itemType eq 'SQLInstance'`:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupProtectedItems?api-version=2024-01-31-preview&$filter=backupManagementType eq 'AzureWorkload' and itemType eq 'SQLInstance'
```

The response contains a `value` array. Each instance includes its protected item name, container name, child databases, and protection status. For example:

```json
{
  "value": [
    {
      "name": "SQLInstance;mssqlserver",
      "properties": {
        "childDBList": ["MSSQLSERVER;testdb", "MSSQLSERVER;testdb1", "MSSQLSERVER;testdb2"],
        "instanceProtectionReadiness": "Ready",
        "friendlyName": "mssqlserver",
        "serverName": "sqlserver-0",
        "protectedItemType": "AzureVmWorkloadSQLInstance",
        "backupManagementType": "AzureWorkload",
        "workloadType": "SQLInstance",
        "containerName": "VMAppContainer;Compute;SQLServerPMDemo;sqlserver-0",
        "protectionStatus": "Healthy",
        "protectionState": "IRPending",
        "protectedItemDataSourceId": "2265943933205758867"
      }
    }
  ]
}
```

Save the returned container and protected item names for subsequent requests. For instance point-in-time recovery queries, also save `protectedItemDataSourceId`.

### List databases protected under an instance

List database protected items in the vault:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupProtectedItems?api-version=2024-01-31-preview&$filter=backupManagementType eq 'AzureWorkload' and itemType eq 'SQLDatabase'
```

In the returned `value` array, identify databases with `protectionLevel` set to `DatabaseUnderInstance`. Use `parentProtectedItem`, together with the container and server details, to identify the parent instance. A database item's properties can include:

```json
{
  "parentProtectedItem": "mssqlserver",
  "protectionLevel": "DatabaseUnderInstance",
  "friendlyName": "testdb",
  "serverName": "sqlserver-0",
  "parentName": "MSSQLSERVER",
  "protectedItemType": "AzureVmWorkloadSQLDatabase",
  "backupManagementType": "AzureWorkload",
  "workloadType": "SQLDataBase"
}
```

### Get a protected SQL instance

To retrieve one instance, use its returned container and protected item names:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2024-01-31-preview
```

For example, `{protectedItemName}` can be `SQLInstance;mssqlserver`. The response includes `childDBList`, `instanceProtectionReadiness`, and `protectionState`. If the item is scheduled for deferred deletion, inspect `isScheduledForDeferredDelete`, `deferredDeleteTimeInUTC`, and `softDeleteRetentionPeriod` as well.

## Modify policy

To change the policy that protects the database, use the same format as enabling protection. However, provide the new policy ID in the request body and submit the request. For example, to change the policy of *testVM* from *HourlyLogPolicy* to *ProdPolicy*, provide the *ProdPolicy* ID in the request body.

```json
{
  "properties": {
    "backupManagementType": "AzureWorkload",
    "workloadType": "SQLDataBase",
    "policyId": "/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerSelfHost/providers/microsoft.recoveryservices/vaults/SQLServer2012/backupPolicies/ProdPolicy"
  },
  "location": "westcentralus"
}
```

The response will follow the same format as mentioned for enabling protection.

### Modify the policy for a snapshot-protected instance

Submit a *PUT* request for the instance protected item and provide the new snapshot policy ID:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2024-01-31-preview
```

```json
{
  "properties": {
    "backupManagementType": "AzureWorkload",
    "workloadType": "SQLInstance",
    "protectedItemType": "AzureVmWorkloadSQLInstance",
    "friendlyName": "MSSQLSERVER",
    "policyId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupPolicies/{newPolicyName}",
    "childDatabaseNameList": ["model"]
  }
}
```

Replace the placeholders in the JSON body as well as the URI. Use the instance's selected database names in `childDatabaseNameList`.

## Resume backup for a SQL instance

To resume backup, submit a *PUT* request to the instance protected item with the snapshot policy ID. The following example uses an empty `childDatabaseNameList` for the resume operation:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2024-01-31-preview
```

```json
{
  "properties": {
    "backupManagementType": "AzureWorkload",
    "workloadType": "SQLInstance",
    "protectedItemType": "AzureVmWorkloadSQLInstance",
    "friendlyName": "MSSQLSERVER",
    "policyId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupPolicies/SQLInstanceSnapPolicy",
    "childDatabaseNameList": []
  }
}
```

Use the instance protected item name, such as `SQLInstance;mssqlserver`, and replace the policy ID placeholders with your vault details. Track the resulting operation and job as described in [Monitor jobs](#monitor-jobs).

## Stop protection and retain existing data

To remove protection from a protected database and retain the data already backed-up, remove the policy in the request body you used to enable backup and submit the request. Once you remove the association with the policy, backups are no longer triggered, and no new recovery points are created.

```json
{
  "properties": {
    "protectedItemType": "AzureVmWorkloadSQLDatabase",
    "protectionState": "ProtectionStopped",
    "sourceResourceId":
"/subscriptions/00000000-0000-0000-0000-0000000000/resourceGroups/SQLServerPMDemo/providers/Microsoft.Compute/virtualMachines/sqlserver-0",
    "policyId": ""
  }
}
```

### Sample response

Stopping protection for a database is an asynchronous operation. The operation creates another operation that needs to be tracked. It returns two responses: 202 (Accepted) when another operation is created, and 200 when that operation is complete.

Response header when operation is successfully accepted:

```http
Status Code:
OK

Headers:
Pragma                        : no-cache
X-Content-Type-Options        : nosniff
x-ms-request-id               : 388c9359-e237-4644-8f6c-38ae5eb0dfcb
x-ms-client-request-id        : 5ef896e6-d812-431a-ad58-9d9ee1bb8bb3,5ef896e6-d812-431a-ad58-9d9ee1bb8bb3
Strict-Transport-Security     : max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-resource-requests: 107
x-ms-correlation-request-id   : 388c9359-e237-4644-8f6c-38ae5eb0dfcb
x-ms-routing-request-id       : SOUTHINDIA:20211126T054036Z:388c9359-e237-4644-8f6c-38ae5eb0dfcb
Cache-Control                 : no-cache
Date                          : Fri, 26 Nov 2021 05:40:36 GMT
Server                        : Microsoft-IIS/10.0
X-Powered-By                  : ASP.NET

Body:
{
  "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
  "name": "TestOBJ",
  "status": "Succeeded",
  "startTime": "2021-11-26T05:36:36.5262731Z",
  "endTime": "2021-11-26T05:36:36.5262731Z",
  "properties": {
    "objectType": "OperationStatusJobExtendedInfo",
    "jobId": "68178d86-d564-460b-9643-829046aac1b1"
  }
}
```

Then, track the resulting operation using the location header or Azure-AsyncOperation header with a *GET* command:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupoperations/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e?api-version=2016-12-01
```

### Response body

```json
{
  "id": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
  "name": "TestOBJ",
  "status": "Succeeded",
  "startTime": "2021-11-26T05:36:36.5262731Z",
  "endTime": "2021-11-26T05:36:36.5262731Z",
  "properties": {
    "objectType": "OperationStatusJobExtendedInfo",
    "jobId": "68178d86-d564-460b-9643-829046aac1b1"
  }
}
```

### Stop protection for a database protected under an instance

For a database protected through an instance snapshot policy, submit a *PUT* request to the **database** protected item, not the instance item:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/Azure/protectionContainers/{containerName}/protectedItems/SQLDatabase;MSSQLSERVER;tdb2?api-version=2024-01-31-preview
```

Set `protectionState` to `ProtectionStopped` and include the instance snapshot policy ID:

```json
{
  "properties": {
    "backupManagementType": "AzureWorkload",
    "workloadType": "SQLDataBase",
    "friendlyName": "MSSQLSERVER;tdb2",
    "protectedItemType": "AzureVmWorkloadSQLDatabase",
    "protectionState": "ProtectionStopped",
    "policyId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupPolicies/SQLInstanceSnapPolicy"
  }
}
```

Replace the sample database item name with the name returned for your database and replace the policy ID placeholders. This operation stops protection while retaining existing backup data. Track the asynchronous operation as described earlier in this section.

## Stop protection and delete backup data

To remove the protection from a protected file share and delete the backup data as well, perform a delete operation.

```http
DELETE https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2019-05-13
```

The parameters *containerName* and *protectedItemName* are as set in the configure backup step in [this article](backup-azure-sql-vm-rest-api.md).

### Responses

Delete protection is an asynchronous operation. The operation creates another operation that needs to be tracked separately. It returns two responses: 202 (Accepted) when another operation is created, and 204 (NoContent) when that operation is complete.

## Next steps

- Learn how to [troubleshoot problems while configuring backup for SQL server databases](backup-sql-server-azure-troubleshoot.md).
