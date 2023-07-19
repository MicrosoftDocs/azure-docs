---
title: Back up blobs in a storage account using Azure Data Protection REST API.
description: In this article, learn how to configure, initiate, and manage backup operations of blobs using REST API.
ms.topic: conceptual
ms.date: 10/31/2022
ms.assetid: 7c244b94-d736-40a8-b94d-c72077080bbe
ms.service: backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up blobs in a storage account using Azure Data Protection via REST API

Azure Backup enables you to easily configure operational backup for protecting block blobs in your storage accounts.

This article describes how to configure backups for blobs in a storage account via REST API. Backup of blobs is configured at the storage account level. So, all blobs in the storage account are protected with operational backup.

In this article, you'll learn about:

> [!div class="checklist"]
> - Prerequisites
> - Configure backup

For information on the Azure blob region availability, supported scenarios and limitations, see the [support matrix](blob-backup-support-matrix.md).

## Prerequisites

- [Create a Backup vault](backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md)
- [Create a blob backup policy](backup-azure-dataprotection-use-rest-api-create-update-blob-policy.md)

## Configure backup

Once you create the vault and policy, you need to consider two critical points to protect all Azure Blobs within a storage account.

### Key entities

#### Storage account that contains the blobs for protection

Fetch the Azure Resource Manager ID of the storage account which contains the blobs to be protected. This serves as the identifier of the storage account.

For example, we'll use a storage account named *msblobbackup*, under the resource group *RG-BlobBackup*, in a different subscription and in *west US*.

```http
"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup"
```

#### Backup vault

The Backup vault requires permissions on the storage account to enable backups on blobs present within the storage account. The system-assigned managed identity of the vault is used for assigning the permissions.

For example, we'll use a backup vault called *testBkpVault* in *West US* region under *TestBkpVaultRG* resource group.

### Assign permissions

You need to assign a few permissions via Azure role-based access control (Azure RBAC) to vault (represented by vault Managed Service Identity) and the relevant storage account. You can do these via Azure portal, PowerShell, or REST API. Learn more about all [related permissions](blob-backup-configure-manage.md#grant-permissions-to-the-backup-vault-on-storage-accounts).

### Prepare the request to configure backup

Once you set the relevant permissions to the vault and storage account, and configure the vault and policy, prepare the request to configure backup.

The following is the request body to configure backup for all blobs within a storage account. The Azure Resource Manager ID (ARM ID) of the storage account and its details are mentioned in the *datasourceinfo* section and the policy information is present in the *policyinfo* section.

```json
{
  "backupInstance": {
    "dataSourceInfo": {
      "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
      "objectType": "Datasource",
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
      "resourceLocation": "westUS",
      "resourceName": "msblobbackup",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceUri": ""
    },
    "policyInfo": {
      "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/BlobBackup-Policy"
    },
    "objectType": "BackupInstance"
  }
}
```

### Validate the request to configure backup

To validate if the request to configure backup will be successful, use [the validate for backup API](/rest/api/dataprotection/backup-instances/validate-for-backup). You can use the response to perform all required prerequisites and then submit the configuration for backup request.

*Validate for backup request* is a *POST operation and the URI has `{subscriptionId}`, `{vaultName}`, `{vaultresourceGroupName}` parameters.

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{vaultresourceGroupname}/providers/Microsoft.DataProtection/backupVaults/{backupVaultName}/validateForBackup?api-version=2021-01-01
```

For example, this translates to:

```http
POST https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/validateForBackup?api-version=2021-01-01
```

The [request body](#prepare-the-request-to-configure-backup) that you prepared earlier is used to give the details of the storage account to be protected.

#### Example request body

```json
{
  "backupInstance": {
    "dataSourceInfo": {
      "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
      "objectType": "Datasource",
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
      "resourceLocation": "westUS",
      "resourceName": "msblobbackup",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceUri": ""
    },
    "policyInfo": {
      "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/BlobBackup-Policy"
    },
    "objectType": "BackupInstance"
  }
}
```

#### Responses for validate backup request

Validate for backup request is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created and then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|202 Accepted     |         |  The operation will be completed asynchronously      |
|200 OK     |   [OperationJobExtendedInfo](/rest/api/dataprotection/backup-instances/validate-for-backup#operationjobextendedinfo)      |     Accepted    |
| Other Status codes |    [CloudError](/rest/api/dataprotection/backup-instances/validate-for-backup#clouderror)    |    Error response describing why the operation failed    |

##### Example responses for validate backup request

###### Error response

If the given storage account is already protected, the response is HTTP 400 (Bad request) and clearly states that the given storage account is protected to a backup vault along with details.

```http
HTTP/1.1 400 BadRequest
Content-Length: 999
Content-Type: application/json
Expires: -1
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: f36eb67a-8932-42a8-8aba-c5ee2443aa2e
x-ms-routing-request-id: WESTUS:20210707T124745Z:bcd23af5-fa17-4cd0-9929-a55f141e33ce
Cache-Control: no-cache
Date: Wed, 07 Jul 2021 12:47:45 GMT
X-Powered-By: ASP.NET

{
  "error": {
    "additionalInfo": [
      {
        "type": "UserFacingError",
        "info": {
          "message": "Datasource is already protected under the Backup vault /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault.",
          "recommendedAction": [
            "Delete the backup instance msblobbackuptemp from the Backup vault /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault to re-protect the datasource in any other vault."
          ],
          "details": null,
          "code": "UserErrorDppDatasourceAlreadyProtected",
          "target": "",
          "innerError": null,
          "isRetryable": false,
          "isUserError": false,
          "properties": {
            "ActivityId": "f36eb67a-8932-42a8-8aba-c5ee2443aa2e"
          }
        }
      }
    ],
    "code": "UserErrorDppDatasourceAlreadyProtected",
    "message": "Datasource is already protected under the Backup vault /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault.",
    "target": null
  }
}
```

###### Track response

If the data source is unprotected, then the API proceeds for further validations and creates a tracking operation.

```http
HTTP/1.1 202 Accepted
Content-Length: 0
Expires: -1
Pragma: no-cache
Retry-After: 10
Azure-AsyncOperation: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==?api-version=2021-01-01
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1197
x-ms-correlation-request-id: 3e7cacb3-65cd-4b3c-8145-71fe90d57327
x-ms-routing-request-id: CENTRALUSEUAP:20210707T124850Z:105f2105-6db1-44bf-8a34-45972a8ba861
Cache-Control: no-cache
Date: Wed, 07 Jul 2021 12:48:50 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==?api-version=2021-01-01
X-Powered-By: ASP.NET
```

Track the resulting operation using the *Azure-AsyncOperation* header with a simple *GET* command.

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==?api-version=2021-01-01

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==",
  "status": "Inprogress",
  "startTime": "2021-07-07T12:48:50.3432229Z",
  "endTime": "0001-01-01T00:00:00"
}
```

It returns 200 (OK) once the validation completes and the response body lists further requirements to be fulfilled, such as permissions.

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==?api-version=2021-01-01

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==",
  "status": "Failed",
  "error": {
    "additionalInfo": [
      {
        "type": "UserFacingError",
        "info": {
          "message": "Appropriate permissions to perform the operation is missing.",
          "recommendedAction": [
            "Grant appropriate permissions to perform this operation as mentioned at https://aka.ms/UserErrorMissingRequiredPermissions and retry the operation."
          ],
          "code": "UserErrorMissingRequiredPermissions",
          "target": "",
          "innerError": {
            "code": "UserErrorMissingRequiredPermissions",
            "additionalInfo": {
              "DetailedNonLocalisedMessage": "Validate for Protection failed. Exception Message: The client 'a8b24f84-f43c-45b3-aa54-e3f6d54d31a6' with object id 'a8b24f84-f43c-45b3-aa54-e3f6d54d31a6' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/read' over scope '/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup/providers/Microsoft.Authorization' or the scope is invalid. If access was recently granted, please refresh your credentials."
            }
          },
          "isRetryable": false,
          "isUserError": false,
          "properties": {
            "ActivityId": "3e7cacb3-65cd-4b3c-8145-71fe90d57327"
          }
        }
      }
    ],
    "code": "UserErrorMissingRequiredPermissions",
    "message": "Appropriate permissions to perform the operation is missing."
  },
  "startTime": "2021-07-07T12:48:50.3432229Z",
  "endTime": "2021-07-07T12:49:22Z"
}
```

If all the permissions are granted, then resubmit the validate request and track the resulting operation. It returns 200 (OK) as succeeded, if all the conditions are met.

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzlhMjk2YWM2LWRjNDMtNGRjZS1iZTU2LTRkZDNiMDhjZDlkOA==?api-version=2021-01-01

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzlhMjk2YWM2LWRjNDMtNGRjZS1iZTU2LTRkZDNiMDhjZDlkOA==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzlhMjk2YWM2LWRjNDMtNGRjZS1iZTU2LTRkZDNiMDhjZDlkOA==",
  "status": "Succeeded",
  "startTime": "2021-07-07T13:03:54.8627251Z",
  "endTime": "2021-07-07T13:04:06Z"
}
```

### Configure backup request

Once the request validation is complete, you can submit the same to the [create backup instance API](/rest/api/dataprotection/backup-instances/create-or-update). A Backup instance represents an item protected with data protection service of Azure Backup within the backup vault. In this case, the storage account is the backup instance and you can use the same request body, which was validated above, with minor additions.

Use a unique name for the backup instance. So, we recommend you use a combination of the resource name and a unique identifier. In this example, use *msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d* here and mark it as the backup instance name.

To create or update the backup instance, use the following *PUT* operation.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/{BkpvaultName}/backupInstances/{UniqueBackupInstanceName}?api-version=2021-01-01
```

For example, this translates to

```http
 PUT https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d?api-version=2021-01-01
```

#### Create the request for configure backup

To create a backup instance, following are the components of the request body

|Name  |Type  |Description  |
|---------|---------|---------|
|properties     |  [BackupInstance](/rest/api/dataprotection/backup-instances/create-or-update#backupinstance)       |     BackupInstanceResource properties    |

##### Example request for configure backup

Use the same request body that you used to validate the backup request with a unique name as we mentioned [above](#configure-backup).

```json
{
  "name": "msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d",
  "type": "Microsoft.DataProtection/backupvaults/backupInstances",
  "properties": {
    "objectType": "BackupInstance",
    "datasourceinfo": {
      "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
      "objectType": "Datasource",
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
      "resourceLocation": "westus",
      "resourceName": "msblobbackup",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceUri": ""
    },
    "policyInfo": {
      "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/BlobBackup-Policy"
    }
  }
}
```

#### Responses to configure backup request

The create backup instance request is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 201 (Created) when backup instance is created and the protection is being configured and then 200 (OK) when that configuration completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|201 Created   |   [Backup instance](/rest/api/dataprotection/backup-instances/create-or-update#backupinstanceresource)      |  Backup instance is created and protection is being configured      |
|200 OK     |    [Backup instance](/rest/api/dataprotection/backup-instances/create-or-update#backupinstanceresource)     |     Protection is configured    |
| Other Status codes |    [CloudError](/rest/api/dataprotection/backup-instances/validate-for-backup#clouderror)    |    Error response describing why the operation failed    |

##### Example responses to configure backup request

Once you submit the *PUT* request to create a backup instance, the initial response is 201 (Created) with an Azure-asyncOperation header. 

>[Note]
>The request body contains all the backup instance properties.

```http
HTTP/1.1 201 Created
Content-Length: 1149
Content-Type: application/json
Expires: -1
Pragma: no-cache
Retry-After: 15
Azure-AsyncOperation: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzI1NWUwNmFlLTI5MjUtNDBkNy1iMjMxLTM0ZWZlMDA3NjdkYQ==?api-version=2021-01-01
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: 5d9ccf1b-7ac1-456d-8ae3-36c93c0d2427
x-ms-routing-request-id: CENTRALUSEUAP:20210707T170219Z:9e897266-5d86-4d13-b298-6561c60cf043
Cache-Control: no-cache
Date: Wed, 07 Jul 2021 17:02:18 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d",
  "name": "msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d",
  "type": "Microsoft.DataProtection/backupVaults/backupInstances",
  "properties": {
    "friendlyName": "msblobbackup",
    "dataSourceInfo": {
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/RG-BlobBackup/providers/Microsoft.Storage/storageAccounts/msblobbackup",
      "resourceUri": "",
      "datasourceType": "Microsoft.Storage/storageAccounts/blobServices",
      "resourceName": "msblobbackup",
      "resourceType": "Microsoft.Storage/storageAccounts",
      "resourceLocation": "westus",
      "objectType": "Datasource"
    },
    "policyInfo": {
      "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/BlobBackup-Policy"
    },
    "protectionStatus": {
      "status": "ConfiguringProtection"
    },
    "currentProtectionState": "ConfiguringProtection",
    "provisioningState": "Provisioning",
    "objectType": "BackupInstance"
  }
}
```

Then track the resulting operation using the *Azure-AsyncOperation* header with a simple *GET* command.

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzI1NWUwNmFlLTI5MjUtNDBkNy1iMjMxLTM0ZWZlMDA3NjdkYQ==?api-version=2021-01-01
```

Once the operation completes, it returns 200 (OK) with the success message in the response body.

```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzI1NWUwNmFlLTI5MjUtNDBkNy1iMjMxLTM0ZWZlMDA3NjdkYQ==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzI1NWUwNmFlLTI5MjUtNDBkNy1iMjMxLTM0ZWZlMDA3NjdkYQ==",
  "status": "Succeeded",
  "startTime": "2021-07-07T17:02:19.0611871Z",
  "endTime": "2021-07-07T17:02:20Z"
}
```

> [!IMPORTANT]
> Once a storage account is configured for blobs backup, a few capabilities are affected, such as change feed and delete lock. [Learn more](blob-backup-configure-manage.md#effects-on-backed-up-storage-accounts).

### Stop protection and delete data

To remove the protection on a storage account and delete the backup data as well, follow [the delete operation process](/rest/api/dataprotection/backup-instances/delete).

Stopping protection and deleting data is a *DELETE* operation.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}?api-version=2021-01-01
```

For our example, this translates to:

```http
DELETE "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/msblobbackup-f2df34eb-5628-4570-87b2-0331d797c67d?api-version=2021-01-01"
```

#### Responses for delete protection

*DELETE* protection is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created and then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |         |  Status of delete request       |
|202 Accepted     |         |     Accepted    |

##### Example responses for delete protection

Once you submit the *DELETE* request, the initial response will be 202 Accepted along with an Azure-asyncOperation header.

```http
HTTP/1.1 202 Accepted
Content-Length: 0
Expires: -1
Pragma: no-cache
Retry-After: 30
Azure-AsyncOperation: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzE1ZjM4YjQ5LWZhMGQtNDMxOC1iYjQ5LTExMDJjNjUzNjM5Zg==?api-version=2021-01-01
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-deletes: 14999
x-ms-correlation-request-id: fee7a361-b1b3-496d-b398-60fed030d5a7
x-ms-routing-request-id: CENTRALUSEUAP:20210708T071330Z:5c3a9f3e-53aa-4d5d-bf9a-20de5601b090
Cache-Control: no-cache
Date: Thu, 08 Jul 2021 07:13:29 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzE1ZjM4YjQ5LWZhMGQtNDMxOC1iYjQ5LTExMDJjNjUzNjM5Zg==?api-version=2021-01-01
X-Powered-By: ASP.NET
```

Track the Azure-AsyncOperation header with a simple *GET* request. When the request is successful it returns 200 OK with a success status response.

```http
GET "https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzE1ZjM4YjQ5LWZhMGQtNDMxOC1iYjQ5LTExMDJjNjUzNjM5Zg==?api-version=2021-01-01"

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzE1ZjM4YjQ5LWZhMGQtNDMxOC1iYjQ5LTExMDJjNjUzNjM5Zg==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzE1ZjM4YjQ5LWZhMGQtNDMxOC1iYjQ5LTExMDJjNjUzNjM5Zg==",
  "status": "Succeeded",
  "startTime": "2021-07-08T07:13:30.23815Z",
  "endTime": "2021-07-08T07:13:46Z"
}
```

## Next steps

[Restore data from an Azure Blob backup](backup-azure-arm-userestapi-restoreazurevms.md).

For more information on the Azure Backup REST APIs, see the following documents:

- [Azure Data Protection Provider REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)
