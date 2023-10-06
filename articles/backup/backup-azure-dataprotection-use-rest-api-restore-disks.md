---
title: Restore Azure Disks using Azure Data Protection REST API
description: In this article, learn how to restore Azure Disks using Azure Data protection REST API.
ms.topic: how-to
ms.date: 05/25/2023
ms.assetid: 30f4e7ff-2a55-4a85-be44-55feedc24607
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Disks using Azure Data Protection REST API

This article describes how to restore [disks](disk-backup-overview.md) using Azure Backup.

Azure Disk Backup offers a turnkey solution that provides snapshot lifecycle management for managed disks by automating periodic creation of snapshots and retaining it for configured duration using backup policy. You can manage the disk snapshots with zero infrastructure cost and without the need for custom scripting or any management overhead. This is a crash-consistent backup solution that takes point-in-time backup of a managed disk using incremental snapshots with support for multiple backups per day. It's also an agent-less solution and doesn't impact production application performance. It supports backup and restore of both OS and data disks (including shared disks), whether or not they're currently attached to a running Azure virtual machine.

>[!Note]
>- Currently, the Original-Location Recovery (OLR) option to restore by replacing the existing source disk (from where the backups were taken) isn't supported.
>- You can restore from a recovery point to create a new disk in the same resource group of the source disk or in any other resource group. It's known as Alternate-Location Recovery (ALR).

## Prerequisites

- [Create a Backup vault](backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md)

- [Create a disk backup policy](backup-azure-dataprotection-use-rest-api-create-update-disk-policy.md)

- [Configure a disk backup](backup-azure-dataprotection-use-rest-api-backup-disks.md)

In the example, we'll refer to an existing backup vault _TestBkpVault_, under the resource group _testBkpVaultRG_, where an Azure Disk is named _msdiskbackup-2dc6eb5b-d008-4d68-9e49-7132d99da0ed_.

## Restore to create a new Azure Disk

### Set up permissions

Backup vault uses managed identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the resource group where the disk needs to be restored.

Backup vault uses a system-assigned managed identity, which is restricted to one per resource and is tied to the lifecycle of this resource. To grant permissions to the managed identity, use the Azure role-based access control (Azure RBAC). Managed identity is a specific service principal that you may only use with Azure resources. Learn more about [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

Assign the relevant permissions for vault's system-assigned managed identity on the target resource group where the disks will be restored/created. [Learn more](restore-managed-disks.md#restore-to-create-a-new-disk).

### Fetch the list of recovery points

To list all the available recovery points for a backup instance, use the [list recovery points](/rest/api/dataprotection/recovery-points/list) API.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/recoveryPoints?api-version=2021-01-01
```

For example, this API translates to:

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msdiskbackup-2dc6eb5b-d008-4d68-9e49-7132d99da0ed/recoveryPoints?api-version=2021-01-01
```

#### Responses for list of recovery points

Once you submit the *GET* request, this returns response as 200 (OK) and the list of all discrete recovery points with all the relevant details.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |    [AzureBackupRecoveryPointResourceList](/rest/api/dataprotection/recovery-points/list#azurebackuprecoverypointresourcelist)     |   OK      |
|Other Status codes     |    [CloudError](/rest/api/dataprotection/recovery-points/list#clouderror)     |     Error response describes the reason for the operation failure.    |

**Example response for list of recovery points**

```http
HTTP/1.1 200 OK
Content-Length: 7550
Content-Type: application/json
Expires: -1
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 11999
x-ms-correlation-request-id: f01e2448-bdc5-4971-aee4-2edd1945c719
x-ms-routing-request-id: CENTRALUSEUAP:20210830T173435Z:0063423e-8b5e-493e-bb2e-74b7c7947c6c
Cache-Control: no-cache
Date: Mon, 30 Aug 2021 17:34:34 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET

{
  "value": [
    {
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msdiskbackup-2dc6eb5b-d008-4d68-9e49-7132d99da0ed/recoveryPoints/a3d02fc3ab8a4c3a8cc26688c26d3356",
      "name": "a3d02fc3ab8a4c3a8cc26688c26d3356",
      "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints",
      "properties": {
        "objectType": "AzureBackupDiscreteRecoveryPoint",
        "recoveryPointId": "a3d02fc3ab8a4c3a8cc26688c26d3356",
        "recoveryPointTime": "2021-08-30T10:02:11.6354913Z",
        "recoveryPointType": "Incremental",
        "friendlyName": "119ac243-a789-4a41-be24-0461bceb3888",
        "recoveryPointDataStoresDetails": [
          {
            "id": "13e7c1fe-005d-4b80-8532-c58d937132bb",
            "type": "OperationalStore",
            "creationTime": "2021-08-30T10:02:11.6354913Z",
            "expiryTime": "2021-09-06T10:02:11.6354913Z",
            "metaData": null,
            "visible": true,
            "state": "COMMITTED",
            "rehydrationExpiryTime": null,
            "rehydrationStatus": null
          }
        ],
        "retentionTagName": "Default",
        "retentionTagVersion": "637607428336647408",
        "policyName": "DiskBackupPolicy-03",
        "policyVersion": null
      }
    },
    {
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msdiskbackup-2dc6eb5b-d008-4d68-9e49-7132d99da0ed/recoveryPoints/8f76ebc4c54847c09455d5785a150ce2",
      "name": "8f76ebc4c54847c09455d5785a150ce2",
      "type": "Microsoft.DataProtection/backupVaults/backupInstances/recoveryPoints",
      "properties": {
        "objectType": "AzureBackupDiscreteRecoveryPoint",
        "recoveryPointId": "8f76ebc4c54847c09455d5785a150ce2",
        "recoveryPointTime": "2021-08-29T10:01:50.7749008Z",
        "recoveryPointType": "Incremental",
        "friendlyName": "1ac5aa6b-3583-464f-9604-7490c04c2b22",
        "recoveryPointDataStoresDetails": [
          {
            "id": "13e7c1fe-005d-4b80-8532-c58d937132bb",
            "type": "OperationalStore",
            "creationTime": "2021-08-29T10:01:50.7749008Z",
            "expiryTime": "2021-09-05T10:01:50.7749008Z",
            "metaData": null,
            "visible": true,
            "state": "COMMITTED",
            "rehydrationExpiryTime": null,
            "rehydrationStatus": null
          }
        ],
        "retentionTagName": "Default",
        "retentionTagVersion": "637607428336647408",
        "policyName": "DiskBackupPolicy-03",
        "policyVersion": null
      }
    },
    .
    .
    .
    .
}
```

Select the relevant recovery points from the above list and proceed to prepare the restore request. We'll choose a recovery point named `a3d02fc3ab8a4c3a8cc26688c26d3356` from the above list to restore.

### Prepare the restore request

Construct the Azure Resource Manager (ARM) ID of the new disk to be created with the target resource group (to which permissions were assigned as detailed [above](#set-up-permissions)) and the required disk name.

For example, we'll use a disk named `APITestDisk2`, under a resource group `targetrg`, present in the same region as the backed-up disk, but under a different subscription.

#### Construct the request body for restore request

The following request body contains the recovery point ID and the restore target details.

```json
{
  "recoveryPointId": "a3d02fc3ab8a4c3a8cc26688c26d3356",
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
    "sourceDataStoreType": "OperationalStore",
    "restoreTargetInfo": {
      "objectType": "restoreTargetInfo",
      "recoveryOption": "FailIfExists",
      "dataSourceInfo": {
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/APITestDisk2",
        "resourceName": "APITestDisk2",
        "resourceType": "Microsoft.Compute/disks",
        "resourceLocation": "westUS",
        "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/APITestDisk2",
        "datasourceType": "Microsoft.Compute/disks"
      },
      "restoreLocation": "westUS"
    }
  }
}
```

#### Validate restore requests

Once request body is prepared, validate it using the [validate for restore API](/rest/api/dataprotection/backup-instances/validate-for-restore). Like validate for backup API, this is a *POST* operation.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/validateRestore?api-version=2021-01-01
```

For example, this API translates to:

```http
POST "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msdiskbackup-2dc6eb5b-d008-4d68-9e49-7132d99da0ed/validateRestore?api-version=2021-01-01"
```

[Learn more](/rest/api/dataprotection/backup-instances/validate-for-restore#request-body) about the request body for this POST API. 

##### Request body to validate restore request

We have constructed a section of the same in the [above section](#construct-the-request-body-for-restore-request). Now, we'll add object type and use it to trigger a validate operation.

```json

{
  "objectType": "ValidateRestoreRequestObject",
  "recoveryPointId": "a3d02fc3ab8a4c3a8cc26688c26d3356",
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
    "sourceDataStoreType": "OperationalStore",
    "restoreTargetInfo": {
      "objectType": "restoreTargetInfo",
      "recoveryOption": "FailIfExists",
      "dataSourceInfo": {
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/APITestDisk2",
        "resourceName": "APITestDisk2",
        "resourceType": "Microsoft.Compute/disks",
        "resourceLocation": "westUS",
        "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/APITestDisk2",
        "datasourceType": "Microsoft.Compute/disks"
      },
      "restoreLocation": "westUS"
    }
  }
}
```

##### Response to validate restore requests

The _validate restore request_ is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). So, this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |         |  Status of validate request       |
|202 Accepted     |         |     Accepted    |

**Example response to restore validate request**

Once the *POST* operation is submitted, it will return the initial response as 202 (Accepted) with an _Azure-asyncOperation_ header.

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

Track the _Azure-AsyncOperation_ header with a *GET* request. When the request is successful, it returns 200 (OK) with a success status response.

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

#### Trigger restore requests

The trigger restore operation is a ***POST*** API. [Learn more](/rest/api/dataprotection/backup-instances/trigger-restore) about the trigger restore operation.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/restore?api-version=2021-01-01
```

For example, the API translates to:

```http
POST "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msdiskbackup-2dc6eb5b-d008-4d68-9e49-7132d99da0ed/restore?api-version=2021-01-01"
```

##### Create a request body for restore operations

Once the requests are validated, use the same request body to trigger the _restore request_ with minor changes.

###### Example request body for restore

The only change from the validate restore request body is to remove the _restoreRequest_ object at the start and change the object type.

```json
{
  "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
  "recoveryPointId": "a3d02fc3ab8a4c3a8cc26688c26d3356",
  "sourceDataStoreType": "OperationalStore",
  "restoreTargetInfo": {
    "datasourceInfo": {
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/APITestDisk2",
      "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/APITestDisk2",
      "datasourceType": "Microsoft.Compute/disks",
      "resourceName": "APITestDisk2",
      "resourceType": "Microsoft.Compute/disks",
      "resourceLocation": "westUS",
      "objectType": "Datasource"
    },
    "restoreLocation": "westUS",
    "recoveryOption": "FailIfExists",
    "objectType": "RestoreTargetInfo"
  }
}
```

#### Response to trigger restore requests

The _trigger restore request_ is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). So, this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |         |  Status of restore request       |
|202 Accepted     |         |     Accepted    |

**Example response to trigger restore request**

Once the *POST* operation is submitted, it will return the initial response as 202 (Accepted) with an _Azure-asyncOperation_ header.

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

Track the _Azure-AsyncOperation_ header with a *GET* request. When the request is successful, it will return 200 (OK) with a job ID that should be further tracked for completion of restore request.

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

#### Track jobs

The _trigger restore requests_ triggered the restore job. To track the resultant Job ID, use the [GET Jobs API](/rest/api/dataprotection/jobs/get).

Use the *GET* command to track the _JobId_ present in the [trigger restore response](#response-to-trigger-restore-requests) above.

```http
 GET /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupJobs/c4bd49a1-0645-4eec-b207-feb818962852?api-version=2021-01-01

{
  "properties": {
    "activityID": "2881cc22-f527-4af4-9b34-46c6c7b72076-Ibz",
    "subscriptionId": "62b829ee-7936-40c9-a1c9-47a93f9f3965",
    "backupInstanceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msdiskbackup-2dc6eb5b-d008-4d68-9e49-7132d99da0ed",
    "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/DiskBackup-Policy",
    "dataSourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-DiskBackup/providers/Microsoft.Compute/disks/msdiskbackup",
    "vaultName": "testBkpVault",
    "backupInstanceFriendlyName": "msdiskbackup",
    "policyName": "DiskBackup-Policy",
    "sourceResourceGroup": "RG-DiskBackup",
    "dataSourceSetName": null,
    "dataSourceName": "msdiskbackup",
    "sourceDataStoreName": null,
    "destinationDataStoreName": null,
    "progressEnabled": false,
    "etag": "W/\"datetime'2021-08-26T07%3A18%3A16.157629Z'\"",
    "sourceSubscriptionID": "62b829ee-7936-40c9-a1c9-47a93f9f3965",
    "dataSourceLocation": "westUS",
    "startTime": "2021-08-26T07:12:09.940517Z",
    "endTime": "2021-08-26T07:18:15.6815066Z",
    "dataSourceType": "Microsoft.Compute/disks",
    "operationCategory": "Restore",
    "operation": "Restore",
    "status": "Completed",
    "restoreType": null,
    "isUserTriggered": true,
    "rehydrationPriority": null,
    "supportedActions": [
      ""
    ],
    "duration": "PT6M5.7409896S",
    "progressUrl": null,
    "errorDetails": null,
    "extendedInfo": {
      "backupInstanceState": null,
      "dataTransferedInBytes": null,
      "targetRecoverPoint": null,
      "sourceRecoverPoint": {
        "recoveryPointID": "3a512290ec6b43d6b9a644869f4a3b38",
        "recoveryPointTime": "2021-08-25T09:03:11.6889015Z"
      },
      "recoveryDestination": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.Compute/disks/APITestDisk2",
      "subTasks": [
        {
          "taskId": 1,
          "taskName": "Trigger Restore",
          "taskStatus": "Completed",
          "taskProgress": null,
          "additionalDetails": null
        }
      ],
      "additionalDetails": null
    }
  },
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupJobs/3bc62c80-913f-47fa-b829-b7df476682be",
  "name": "3bc62c80-913f-47fa-b829-b7df476682be",
  "type": "Microsoft.DataProtection/BackupVaults/backupJobs"
}
```

The job status above indicates that the restore job is completed and the disks have been recovered to the specified subscription and target resource group.

## Next steps

[Overview of Azure Disk backup](disk-backup-overview.md)

For more information on the Azure Backup REST APIs, see the following articles:

- [Azure Data Protection provider REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)