---
title: Restore blobs in a storage account using Azure Data Protection REST API
description: In this article, learn how to restore blobs of a storage account using REST API.
ms.topic: conceptual
ms.date: 07/09/2021
ms.assetid: 9b8d21e6-3e23-4345-bb2b-e21040996afd
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure blobs to point-in-time using Azure Data Protection REST API

This article describes how to restore [blobs](blob-backup-overview.md) to any point-in-time using Azure Backup.

> [!IMPORTANT]
> Before proceeding to restore Azure blobs using Azure Backup, see [important points](blob-restore.md#before-you-start).

In this article, you'll learn how to:

- Restore Azure blobs to point-in-time

- Track the restore operation status

## Prerequisites

- [Create a Backup vault](backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md)

- [Create a blob backup policy](backup-azure-dataprotection-use-rest-api-create-update-blob-policy.md)

- [Configure a blob backup](backup-azure-dataprotection-use-rest-api-backup-blobs.md)

We will refer to an existing backup vault _TestBkpVault_, under the resource group _testBkpVaultRG_, where blobs in a storage account named "msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d" in the examples.

## Restoring Azure blobs within a storage account

### Fetching the valid time range for restore

As the operational backup for blobs is continuous, there are no distinct points to restore from. Instead, we need to fetch the valid time-range under which blobs can be restored to any point-in-time. In this example, let's check for valid time-ranges to restore within the last 30 days.

The restorable time ranges can be listed using [find restorable time range](/rest/api/dataprotection/restorable-time-ranges/find) API. It is a *POST* API which triggers an operation to calculate the range of continuous backups for the blobs in the storage account.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/findRestorableTimeRanges?api-version=2021-01-01
```

For our example, this translates to

```http
POST https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d/findRestorableTimeRanges?api-version=2021-01-01
```

#### Create the request body to fetch valid time ranges for restore

To trigger an operation to calculate valid time ranges, following are the components of a request body

|**Name**  |**Type**  |**Description**  |
|---------|---------|---------|
|sourceDatastoreType     |   [RestoreSourceDataStoreType](/rest/api/dataprotection/restorable-time-ranges/find#restoresourcedatastoretype)      |    The datastore which contains the data to be restored     |
|startTime     |    String     |  Start time for the List Restore Ranges request. ISO 8601 format.       |
|endTime     |    String     |    End time for the List Restore Ranges request. ISO 8601 format.     |

##### Example request body to fetch valid time range

The following request body defines properties required to fetch the time ranges of the continuous data which can be restored. Since blob backups reside in the storage account, the datastore is 'Operational'. You can give start and end time that helps to narrow the search process and return the available time range.

```json
{
  "sourceDataStoreType": "OperationalStore",
  "startTime": "",
  "endTime": ""
}
```

#### Responses for fetch valid time ranges

Once you submit the *POST* request, the response is 200(OK) with the start and end time of the range available for restore within the specified start and end time of the request.

|**Name**  |**Type**  |**Description**  |
|---------|---------|---------|
|200(OK)     |   [AzureBackupFindRestorableTimeRangesResponseResource](/rest/api/dataprotection/restorable-time-ranges/find#azurebackupfindrestorabletimerangesresponseresource)      |    OK     |
|Other Status codes     |    [CloudError](/rest/api/dataprotection/restorable-time-ranges/find#clouderror)     |  Error response describing why the operation has failed.       |

##### Example response for fetch valid time ranges

```http
HTTP/1.1 200 OK
Content-Length: 379
Content-Type: application/json
Expires: -1
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: a2b7c2d9-01f5-499a-b521-55da4862c79a
x-ms-routing-request-id: CENTRALUSEUAP:20210708T184646Z:4996a2bf-2df8-48a7-9b53-a552466a27f7
Cache-Control: no-cache
Date: Thu, 08 Jul 2021 18:46:45 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET

{
  "id": "msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d",
  "type": "Microsoft.DataProtection/backupVaults/backupInstances/findRestorableTimeRanges",
  "properties": {
    "restorableTimeRanges": [
      {
        "startTime": "2021-07-06T18:46:45.947728Z",
        "endTime": "2021-07-08T18:46:45.9932408Z",
        "objectType": "RestorableTimeRange"
      }
    ],
    "objectType": "AzureBackupFindRestorableTimeRangesResponse"
  }
}
```

### Preparing the restore request

Once the point-in-time to restore to the same storage account is fixed, there are multiple options to restore.

#### Restoring all the blobs to a point-in-time

Using this option restores all block blobs in the storage account by rolling them back to the selected point in time. Storage accounts containing large amounts of data or witnessing a high churn may take longer times to restore.

##### Constructing the request body for point-in-time restore of all blobs

The key points to remember in this scenario are:

- Restore is happening to the same storage account which means the target object for the restore is same as the source datasource. This is reflected in the restore target info section below.
- These are continuous backups and hence the restore time is a point-in-time and not a distinct recovery point.
- All blobs are restored
- The source datastore that is, where the backups reside, is the same storage account. Hence the source datastore is 'Operational' datastore.

```json
{
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryTimeBasedRestoreRequest",
    "restoreTargetInfo": {
      "objectType": "RestoreTargetInfo",
      "recoveryOption": "FailIfExists",
      "restoreLocation": "westus",
      "datasourceInfo": {
        "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
        "resourceLocation": "westus",
        "resourceName": "msblobbackup",
        "resourceType": "Microsoft.Storage/storageAccounts",
        "resourceUri": ""
      }
    },
    "sourceDataStoreType": "OperationalStore",
    "recoveryPointTime": "2021-07-08T00:00:00.0000000Z"
  }
}
```

#### Restoring few containers to a point-in-time

Using this option allows you to select up to 10 containers to restore or restore a subset of blobs using a prefix match. You can specify up to 10 lexicographical ranges of blobs within a single container or across multiple containers to return those blobs to their previous state at a given point in time. In case of using prefixes, here are a few things to keep in mind:

- You can use a forward slash (/) to delineate the container name from the blob prefix
- The start of the range specified is inclusive, however the specified range is exclusive.

[Learn more](blob-restore.md#use-prefix-match-for-restoring-blobs) about using prefixes to restore blob ranges.

##### Constructing the request body for point-in-time restore of selected containers or few blobs

The key points to remember in this scenario are:

- Restore is happening to the same storage account which means the target object for the restore is same as the source datasource. This is reflected in the restore target info section below.
- These are continuous backups and hence the restore time is a point-in-time and not a distinct recovery point.
- Few items within the storage account are restored. They could be containers or blobs with a prefix pattern.
- The source datastore i.e., where the backups reside, is the same storage account. Hence the source datastore is 'Operational' datastore.

```json
{
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryTimeBasedRestoreRequest",
    "restoreTargetInfo": {
      "objectType": "ItemLevelRestoreTargetInfo",
      "recoveryOption": "FailIfExists",
      "restoreLocation": "westus",
      "restoreCriteria": [
        {
          "objectType": "RangeBasedItemLevelRestoreCriteria",
          "minMatchingValue": "Container1",
          "maxMatchingValue": "Container10-0"
        }
      ],
      "datasourceInfo": {
        "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
        "resourceLocation": "westus",
        "resourceName": "msblobbackup",
        "resourceType": "Microsoft.Storage/storageAccounts",
        "resourceUri": ""
      }
    },
    "sourceDataStoreType": "OperationalStore",
    "recoveryPointTime": "2021-07-08T00:00:00.0000000Z"
  }
}
```

#### Validating restore requests

Once request body is prepared, it can be validated using the [validate for restore API](/rest/api/dataprotection/backup-instances/validate-for-restore). Like the validate for backup API, this is a *POST* operation.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/validateRestore?api-version=2021-01-01
```

For our example, this translates to:

```http
POST "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d/validateRestore?api-version=2021-01-01"
```

The request body for this POST API is detailed [here](/rest/api/dataprotection/backup-instances/validate-for-restore#request-body). We have constructed the same in the  above section for [all blobs restore](#constructing-the-request-body-for-point-in-time-restore-of-all-blobs) and [few items restore](#constructing-the-request-body-for-point-in-time-restore-of-selected-containers-or-few-blobs) scenarios. We will use the same to trigger a validate operation.

##### Response to validate restore requests

The validate restore request is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created and then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |         |  Status of validate request       |
|202 Accepted     |         |     Accepted    |

###### Example response to restore validate request

Once the *POST* operation is submitted, the initial response will be 202 Accepted along with an Azure-asyncOperation header.

```http
HTTP/1.1 202 Accepted
Content-Length: 0
Expires: -1
Pragma: no-cache
Retry-After: 10
Azure-AsyncOperation: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzVlNzMxZDBiLTQ3MDQtNDkzNS1hYmNjLWY4YWEzY2UzNTk1ZQ==?api-version=2021-01-01
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: bae60c92-669d-45a4-aed9-8392cca7cc8d
x-ms-routing-request-id: CENTRALUSEUAP:20210708T205935Z:f51db7a4-9826-4084-aa3b-ae640dc78af6
Cache-Control: no-cache
Date: Thu, 08 Jul 2021 20:59:35 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzVlNzMxZDBiLTQ3MDQtNDkzNS1hYmNjLWY4YWEzY2UzNTk1ZQ==?api-version=2021-01-01
X-Powered-By: ASP.NET
```

Track the Azure-AsyncOperation header with a simple *GET* request. When the request is successful it returns 200 OK with a success status response.

```http
 GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzVlNzMxZDBiLTQ3MDQtNDkzNS1hYmNjLWY4YWEzY2UzNTk1ZQ==?api-version=2021-01-01

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzVlNzMxZDBiLTQ3MDQtNDkzNS1hYmNjLWY4YWEzY2UzNTk1ZQ==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzVlNzMxZDBiLTQ3MDQtNDkzNS1hYmNjLWY4YWEzY2UzNTk1ZQ==",
  "status": "Succeeded",
  "startTime": "2021-07-08T20:59:35.0060264Z",
  "endTime": "2021-07-08T20:59:57Z"
}
```

#### Triggering restore requests

The triggering restore operation is a ***POST*** API. All details about the trigger restore operation are documented [here](/rest/api/dataprotection/backup-instances/trigger-restore).

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/restore?api-version=2021-01-01
```

For our example, this translates to:

```http
POST "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d/restore?api-version=2021-01-01"
```

##### Creating a request body for restore operations

Once the requests are validated, the same request body can be used to trigger the restore request with minor changes.

###### Example request body for all blobs restore

The only change from the validate restore request body is to remove the "restoreRequest" object at the start.

```json
{
  "objectType": "AzureBackupRecoveryTimeBasedRestoreRequest",
  "restoreTargetInfo": {
    "objectType": "RestoreTargetInfo",
    "recoveryOption": "FailIfExists",
    "restoreLocation": "westus",
    "datasourceInfo": {
      "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
      "objectType": "Datasource",
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
      "resourceLocation": "westus",
      "resourceName": "msblobbackup",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceUri": ""
    }
  },
  "sourceDataStoreType": "OperationalStore",
  "recoveryPointTime": "2021-07-08T00:00:00Z"
}
```

###### Example request body for items or few blobs restore

The only change from the validate restore request body is to remove the "restoreRequest" object at the start.

```json
{
  "objectType": "AzureBackupRecoveryTimeBasedRestoreRequest",
  "restoreTargetInfo": {
    "objectType": "ItemLevelRestoreTargetInfo",
    "recoveryOption": "FailIfExists",
    "restoreLocation": "westus",
    "restoreCriteria": [
      {
        "objectType": "RangeBasedItemLevelRestoreCriteria",
        "minMatchingValue": "Container1",
        "maxMatchingValue": "Container2"
      }
    ],
    "datasourceInfo": {
      "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
      "objectType": "Datasource",
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
      "resourceLocation": "westus",
      "resourceName": "msblobbackup",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceUri": ""
    }
  },
  "sourceDataStoreType": "OperationalStore",
  "recoveryPointTime": "2021-07-08T00:00:00.0000000Z"
}
```

#### Response to trigger restore requests

The trigger restore request is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created and then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |         |  Status of restore request       |
|202 Accepted     |         |     Accepted    |

##### Example response to trigger restore request

Once the *POST* operation is submitted, the initial response will be 202 Accepted along with an Azure-asyncOperation header.

```http
HTTP/1.1 202 Accepted
Content-Length: 0
Expires: -1
Pragma: no-cache
Retry-After: 30
Azure-AsyncOperation: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==?api-version=2021-01-01
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1197
x-ms-correlation-request-id: 8661209c-5b6a-44fe-b676-4e2b9c296593
x-ms-routing-request-id: CENTRALUSEUAP:20210708T204652Z:69e3fa4b-c5d9-4601-9410-598006ada187
Cache-Control: no-cache
Date: Thu, 08 Jul 2021 20:46:52 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==?api-version=2021-01-01
X-Powered-By: ASP.NET
```

Track the Azure-AsyncOperation header with a simple *GET* request. When the request is successful it returns 200 OK with a Job ID which should be further tracked for completion of restore request.

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==?api-version=2021-01-01

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==",
  "status": "Succeeded",
  "startTime": "2021-07-08T20:46:52.4110868Z",
  "endTime": "2021-07-08T20:46:56Z",
  "properties": {
    "jobId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupJobs/c4bd49a1-0645-4eec-b207-feb818962852",
    "objectType": "OperationJobExtendedInfo"
  }
}
```

#### Tracking jobs

The trigger restore requests triggered the restore job and the resultant Job ID should be tracking using the [GET Jobs API](/rest/api/dataprotection/jobs/get).

Use the simple GET command to track the JobId given in the [trigger restore response](#example-response-to-trigger-restore-request) above.

```http
 GET /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupJobs/c4bd49a1-0645-4eec-b207-feb818962852?api-version=2021-01-01

{
  "properties": {
    "activityID": "4195ca6c-e02d-11eb-b0b1-70bc105e2242",
    "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx",
    "backupInstanceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d",
    "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/BlobBackup-Policy",
    "dataSourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
    "vaultName": "BV-JPE-GRS",
    "backupInstanceFriendlyName": "msblobbackup",
    "policyName": "BlobBackup-Policy",
    "sourceResourceGroup": "RG-BlobBackup",
    "dataSourceName": "msblobbackup",
    "progressEnabled": false,
    "etag": "W/\"datetime'2021-07-08T20%3A48%3A36.6999667Z'\"",
    "sourceSubscriptionID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx",
    "dataSourceLocation": "westus",
    "startTime": "2021-07-08T20:44:19.5467125Z",
    "endTime": "2021-07-08T20:48:35.8297312Z",
    "dataSourceType": "Microsoft.Storage/storageAccounts/blobServices",
    "operationCategory": "Restore",
    "operation": "Restore",
    "status": "Completed",
    "isUserTriggered": true,
    "supportedActions": [
      ""
    ],
    "duration": "PT4M16.2830187S",
    "extendedInfo": {
      "sourceRecoverPoint": {
        "recoveryPointTime": "2021-07-08T00:00:00Z"
      },
      "recoveryDestination": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
      "subTasks": [
        {
          "taskId": 1,
          "taskName": "Trigger Restore",
          "taskStatus": "Completed"
        }
      ]
    }
  },
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupJobs/c4bd49a1-0645-4eec-b207-feb818962852",
  "name": "c4bd49a1-0645-4eec-b207-feb818962852",
  "type": "Microsoft.DataProtection/BackupVaults/backupJobs"
}
```

The job status above indicates that the restore job is completed and all blobs have been recovered to specified point-in-time.

## Next steps

[Overview of Azure blob backup](blob-backup-overview.md).

For more information on the Azure Backup REST APIs, see the following documents:

- [Azure Data Protection provider REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)