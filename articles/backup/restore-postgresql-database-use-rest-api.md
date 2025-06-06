---
title: Restore PostgreSQL Databases by Using the Data Protection REST API
description: Learn how to restore Azure Database for PostgreSQL by using the Azure Backup Data Protection REST API.
ms.topic: how-to
ms.date: 05/20/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
ms.custom:
  - build-2025
---

# Restore PostgreSQL databases by using the Data Protection REST API

This article describes how to use the Data Protection REST API to restore PostgreSQL databases to an [Azure Database for PostgreSQL](/azure/postgresql/overview#azure-database-for-postgresql---single-server) server that you backed up via Azure Backup. You can also restore a PostgreSQL database using [Azure portal](restore-azure-database-postgresql.md), [Azure PowerShell](restore-postgresql-database-ps.md), and [Azure CLI](restore-postgresql-database-cli.md).

Because a PostgreSQL database is a platform as a service (PaaS) database, the Original-Location Recovery (OLR) option to restore by replacing the existing database (from where the backups were taken) isn't supported. You can restore from a recovery point to create a new database in the same Azure Database for PostgreSQL server or in any other PostgreSQL server. This option is called Alternate-Location Recovery (ALR). ALR helps to keep both the source database and the restored (new) database.

## Prerequisites

- [Create a Backup vault](backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md)
- [Create a PostgreSQL database backup policy](backup-azure-data-protection-use-rest-api-create-update-postgresql-policy.md)
- [Configure a PostgreSQL database backup](backup-azure-data-protection-use-rest-api-backup-postgresql.md)

The examples in this article refer to an existing Backup vault named `TestBkpVault` under the resource group `testBkpVaultRG`.

## Restore a backed-up PostgreSQL database

### Set up permissions

A Backup vault uses a managed identity to access other Azure resources. To restore from a backup, a Backup vault's managed identity requires a set of permissions on the Azure Database for PostgreSQL server to which the database should be restored.

To assign the relevant permissions for vault's system-assigned managed identity on the target PostgreSQL server, see the [permissions needed to back up a PostgreSQL database](./backup-azure-database-postgresql-overview.md#permissions-needed-for-postgresql-database-restore).

To restore the recovery point as files to a storage account, the Backup vault's system-assigned managed identity needs [access on the target storage account](./restore-azure-database-postgresql.md#restore-permissions-on-the-target-storage-account).

### Fetch the relevant recovery point

To list all the available recovery points for a backup instance, use the [List Recovery Points](/rest/api/dataprotection/recovery-points/list) API:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/recoveryPoints?api-version=2021-07-01
```

For example, the API translates to:

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/recoveryPoints?api-version=2021-07-01
```

#### Responses for a list of recovery points

After you submit the `GET` request, it returns the following responses. It also returns a list of all discrete recovery points with the relevant details.

|Name  |Type  |Description  |
|---------|---------|---------|
|`200 OK`     |    [AzureBackupRecoveryPointResourceList](/rest/api/dataprotection/recovery-points/list#azurebackuprecoverypointresourcelist)     |   The request is completed.      |
|Other status codes     |    [CloudError](/rest/api/dataprotection/recovery-points/list#clouderror)     |     The error response describes the reason for the operation failure.    |

Here's an example response:

```http
HTTP/1.1 200 OK
Content-Length: 53396
Content-Type: application/json
Expires: -1
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 11999
x-ms-correlation-request-id: 41f7ef85-f31e-4db7-87ef-115e3ca65b93
x-ms-routing-request-id: SOUTHINDIA:20211022T200018Z:ba3bc1ce-c081-4895-a292-beeeb6eb22cc
Cache-Control: no-cache
Date: Fri, 22 Oct 2021 20:00:18 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET

{
  "value": [
    {
      "properties": {
        "objectType": "AzureBackupDiscreteRecoveryPoint",
        "recoveryPointId": "eb006fde78cb47198be5a320fbe45e9b",
        "recoveryPointTime": "2021-10-21T16:31:16.8316716Z",
        "recoveryPointType": "Full",
        "friendlyName": "794ead7c7661410da03997d210d469e7",
        "recoveryPointDataStoresDetails": [
          {
            "id": "9ea7eaf4-eeb8-4c8f-90a7-7f04b60bf075",
            "type": "VaultStore",
            "creationTime": "2021-10-21T16:31:16.8316716Z",
            "expiryTime": "2022-10-21T16:31:16.8316716Z",
            "metaData": null,
            "visible": true,
            "state": "COMMITTED",
            "rehydrationExpiryTime": null,
            "rehydrationStatus": null
          }
        ],
        "retentionTagName": "Default",
        "retentionTagVersion": "637212748405148394",
        "policyName": "osspol3",
        "policyVersion": null
      },
.
.
.
.
```

To fetch the recovery point from the archive tier, modify the `type` variable in `recoveryPointDataStoreDetails` as `ArchiveStore`.

Select the relevant recovery points from the preceding list, and then prepare the restore request. This article uses a recovery point named `794ead7c7661410da03997d210d469e7` from the preceding list to restore.

### Prepare the restore request

There are various restore options for a PostgreSQL database. You can restore the recovery point as another database or restore as files. The recovery point can also be on the archive tier.

#### Restore as a database

Construct the Azure Resource Manager ID of the new PostgreSQL database to be created with the target PostgreSQL server to which permissions were assigned ([as detailed earlier](#set-up-permissions)). Include the required PostgreSQL database name. For example, a PostgreSQL database can be named `emprestored21` under a target PostgreSQL server named `targetossserver` in the resource group `targetrg` with a different subscription:

```http
"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/targetrg/providers/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21"
```

The following request body contains the recovery point ID and the restore target details:

```json
{
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
    "sourceDataStoreType": "VaultStore",
    "restoreTargetInfo": {
      "objectType": "restoreTargetInfo",
      "recoveryOption": "FailIfExists",
      "dataSourceInfo": {
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
        "resourceName": "emprestored21",
        "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
        "resourceLocation": "westus",
        "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
        "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
      },
      "dataSourceSetInfo": {
        "objectType": "DatasourceSet",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver",
        "resourceName": "targetossserver",
        "resourceType": "Microsoft.DBforPostgreSQL/servers",
        "resourceLocation": "westus",
        "resourceUri": "",
        "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
      },
      "datasourceAuthCredentials": {
        "objectType": "SecretStoreBasedAuthCredentials",
        "secretStoreResource": {
          "secretStoreType": "AzureKeyVault",
          "uri": "https://vikottur-test.vault.azure.net/secrets/dbauth3",
          "value": null
        }
      },
      "restoreLocation": "westus"
    },
    "recoveryPointId": "eb006fde78cb47198be5a320fbe45e9b"
  }
}
```

For an archive-based recovery point, you need to:

1. Rehydrate from the archive datastore to the vault datastore.
1. Modify the source datastore.
1. Add other parameters to specify the rehydration priority.
1. Specify the duration for which the rehydrated recovery point should be retained in the vault datastore.

```json
{
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
    "sourceDataStoreType": "ArchiveStore",
    "restoreTargetInfo": {
      "objectType": "restoreTargetInfo",
      "recoveryOption": "FailIfExists",
      "dataSourceInfo": {
        "objectType": "Datasource",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
        "resourceName": "emprestored21",
        "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
        "resourceLocation": "westus",
        "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
        "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
      },
      "dataSourceSetInfo": {
        "objectType": "DatasourceSet",
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver",
        "resourceName": "targetossserver",
        "resourceType": "Microsoft.DBforPostgreSQL/servers",
        "resourceLocation": "westus",
        "resourceUri": "",
        "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
      },
      "datasourceAuthCredentials": {
        "objectType": "SecretStoreBasedAuthCredentials",
        "secretStoreResource": {
          "secretStoreType": "AzureKeyVault",
          "uri": "https://vikottur-test.vault.azure.net/secrets/dbauth3",
          "value": null
        }
      },
      "restoreLocation": "westus"
    },
    "recoveryPointId": "eb006fde78cb47198be5a320fbe45e9b",
    "rehydration_priority": "Standard",
    "rehydration_retention_duration": "P15D",
  }
}
```

#### Restore as files

Fetch the URI of the container within the storage account to which permissions were assigned, as [detailed earlier](#set-up-permissions). For example, use a container named `testcontainerrestore` under a storage account named  `testossstorageaccount` with a different subscription:

```http
"https://testossstorageaccount.blob.core.windows.net/testcontainerrestore"
```

```json
{
  "objectType": "ValidateRestoreRequestObject",
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
    "sourceDataStoreType": "VaultStore",
    "restoreTargetInfo": {
      "targetDetails": {
        "url": "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore",
        "filePrefix": "empdb11_postgresql-westus_1628853549768",
        "restoreTargetLocationType": "AzureBlobs"
      },
      "restoreLocation": "westus",
      "recoveryOption": "FailIfExists",
      "objectType": "RestoreFilesTargetInfo"
    },
    "recoveryPointId": "eb006fde78cb47198be5a320fbe45e9b"
  }
}
```

For an archive-based recovery point, modify the source datastore. Add the rehydration priority and the retention duration, in days, of the rehydrated recovery point:

```json
{
  "objectType": "ValidateRestoreRequestObject",
  "restoreRequestObject": {
    "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
    "sourceDataStoreType": "ArchiveStore",
    "restoreTargetInfo": {
      "targetDetails": {
        "url": "https://testossstorageaccount.blob.core.windows.net/testcontainerrestore",
        "filePrefix": "empdb11_postgresql-westus_1628853549768",
        "restoreTargetLocationType": "AzureBlobs"
      },
      "restoreLocation": "westus",
      "recoveryOption": "FailIfExists",
      "objectType": "RestoreFilesTargetInfo"
    },
    "recoveryPointId": "eb006fde78cb47198be5a320fbe45e9b",
    "rehydration_priority": "Standard",
    "rehydration_retention_duration": "P15D",
  }
}
```

#### Validate the restore request

After you prepare the request body, validate it by using the [Validate For Restore API](/rest/api/dataprotection/backup-instances/validate-for-restore). Like the Validate For Backup API, this API is a `POST` operation.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/validateRestore?api-version=2021-07-01
```

For example, the preceding API translates to:

```http
POST "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/ValidateRestore?api-version=2021-07-01"
```

[Learn more](/rest/api/dataprotection/backup-instances/validate-for-restore#request-body) about the request body for this `POST` API.

##### Request body to validate the restore request

You constructed a request body in an [earlier section](#restore-as-a-database). Now, add an object type and use it to trigger a validation operation:

```json
{
    "objectType": "ValidateRestoreRequestObject",
    "recoveryPointId": "eb006fde78cb47198be5a320fbe45e9b",
    "restoreRequestObject": {
      "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
      "sourceDataStoreType": "VaultStore",
      "restoreTargetInfo": {
        "objectType": "restoreTargetInfo",
        "recoveryOption": "FailIfExists",
        "dataSourceInfo": {
          "objectType": "Datasource",
          "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
          "resourceName": "emprestored21",
          "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
          "resourceLocation": "westus",
          "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
          "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
        },
        "dataSourceSetInfo": {
          "objectType": "DatasourceSet",
          "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver",
          "resourceName": "targetossserver",
          "resourceType": "Microsoft.DBforPostgreSQL/servers",
          "resourceLocation": "westus",
          "resourceUri": "",
          "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
        },
        "datasourceAuthCredentials": {
          "objectType": "SecretStoreBasedAuthCredentials",
          "secretStoreResource": {
            "secretStoreType": "AzureKeyVault",
            "uri": "https://vikottur-test.vault.azure.net/secrets/dbauth3",
            "value": null
          }
        },
        "restoreLocation": "westus"
      }
  }
}
```

##### Response to validate the restore request

Validation of the restore request is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). So, this operation creates another operation that you need to track separately.

The operation returns these responses:

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |         |  The operation is completed.       |
|202 Accepted     |         |     The request is accepted. Another operation is created.    |

After the `POST` operation is submitted, it returns the initial response as `202 Accepted` with an `Azure-asyncOperation` header, as shown in this example response:

```http
HTTP/1.1 202 Accepted
Content-Length: 0
Expires: -1
Pragma: no-cache
Retry-After: 10
Azure-AsyncOperation: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzVlNzMxZDBiLTQ3MDQtNDkzNS1hYmNjLWY4YWEzY2UzNTk1ZQ==?api-version=2021-07-01
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: bae60c92-669d-45a4-aed9-8392cca7cc8d
x-ms-routing-request-id: CENTRALUSEUAP:20210708T205935Z:f51db7a4-9826-4084-aa3b-ae640dc78af6
Cache-Control: no-cache
Date: Thu, 08 Jul 2021 20:59:35 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzVlNzMxZDBiLTQ3MDQtNDkzNS1hYmNjLWY4YWEzY2UzNTk1ZQ==?api-version=2021-07-01
X-Powered-By: ASP.NET
```

Track the `Azure-AsyncOperation` header with a simple `GET` request. When the request is successful, it returns `200 OK` with a status response.

```http
GET https://management.azure.com/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/providers/Microsoft.DataProtection/locations/westus/operationStatus/YWJjMGRmMzQtNTY1NS00MGMyLTg4YmUtMTUyZDE3ZjdiNzMyOzY4NDNmZWZkLWU4ZTMtNDM4MC04ZTJhLWUzMTNjMmNhNjI1NA==?api-version=2021-07-01
```

```http
{
  "id": "/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/providers/Microsoft.DataProtection/locations/westus/operationStatus/YWJjMGRmMzQtNTY1NS00MGMyLTg4YmUtMTUyZDE3ZjdiNzMyOzY4NDNmZWZkLWU4ZTMtNDM4MC04ZTJhLWUzMTNjMmNhNjI1NA==",
  "name": "YWJjMGRmMzQtNTY1NS00MGMyLTg4YmUtMTUyZDE3ZjdiNzMyOzY4NDNmZWZkLWU4ZTMtNDM4MC04ZTJhLWUzMTNjMmNhNjI1NA==",
  "status": "Inprogress",
  "startTime": "2021-10-22T20:22:41.0305623Z",
  "endTime": "0001-01-01T00:00:00Z"
}
```

The response indicates errors that you have to solve before you submit the restore request. The following example represents what happens when the target database is of a lower version, so it can't be restored:

```http
---------- Response (1892 ms) ------------

HTTP/1.1 200 OK
Content-Length: 1236
Content-Type: application/json
Expires: -1
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 11999
x-ms-correlation-request-id: 784764f8-941d-4f05-8d8c-c02d2c05f799
x-ms-routing-request-id: SOUTHINDIA:20211022T202725Z:e109a061-a09e-4f13-acd0-9b9833f851ac
Cache-Control: no-cache
Date: Fri, 22 Oct 2021 20:27:25 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET

{
  "id": "/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/providers/Microsoft.DataProtection/locations/westus/operationStatus/YWJjMGRmMzQtNTY1NS00MGMyLTg4YmUtMTUyZDE3ZjdiNzMyOzY4NDNmZWZkLWU4ZTMtNDM4MC04ZTJhLWUzMTNjMmNhNjI1NA==",
  "name": "YWJjMGRmMzQtNTY1NS00MGMyLTg4YmUtMTUyZDE3ZjdiNzMyOzY4NDNmZWZkLWU4ZTMtNDM4MC04ZTJhLWUzMTNjMmNhNjI1NA==",
  "status": "Failed",
  "error": {
    "additionalInfo": [
      {
        "type": "UserFacingError",
        "info": {
          "message": "Restoring backups of a higher PostgreSQL version to a lower version is not supported.",
          "recommendedAction": [
            "Restore to the same or a higher PostgreSQL version from which the backup was taken."
          ],
          "code": "UserErrorRestoreToLowerVersion",
          "target": "",
          "innerError": {
            "code": "InnerErrorCodeUnavailable",
            "additionalInfo": {
              "DetailedNonLocalisedMessage": "Restoring backup from version:10 of PostgreSQL to 9.5 of PostgreSQL not supported, as the restore server version is lower."
            }
          },
          "isRetryable": false,
          "isUserError": false,
          "properties": {
            "ActivityId": "2a23524f-0217-4bc1-bbe8-1546d2e6204d-Ibz"
          }
        }
      }
    ],
    "code": "UserErrorRestoreToLowerVersion",
    "message": "Restoring backups of a higher PostgreSQL version to a lower version is not supported."
  },
  "startTime": "2021-10-22T20:22:41.0305623Z",
  "endTime": "2021-10-22T20:23:11Z"
}
```

After you fix the errors and revalidate the request, it returns `200 OK` and a success response:

```http
HTTP/1.1 200 OK
Content-Length: 443
Content-Type: application/json
Expires: -1
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 11999
x-ms-correlation-request-id: 61d62dd8-8e1a-473c-bcc6-c6a7a19fb035
x-ms-routing-request-id: SOUTHINDIA:20211022T203846Z:89af04a6-4e91-4b64-8998-a369dc763408
Cache-Control: no-cache
Date: Fri, 22 Oct 2021 20:38:46 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET

{
  "id": "/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/providers/Microsoft.DataProtection/locations/westus/operationStatus/YWJjMGRmMzQtNTY1NS00MGMyLTg4YmUtMTUyZDE3ZjdiNzMyOzU0NDI4YzdhLTJjNWEtNDNiOC05ZjBjLTM2NmQ3ZWVjZDUxOQ==",
  "name": "YWJjMGRmMzQtNTY1NS00MGMyLTg4YmUtMTUyZDE3ZjdiNzMyOzU0NDI4YzdhLTJjNWEtNDNiOC05ZjBjLTM2NmQ3ZWVjZDUxOQ==",
  "status": "Succeeded",
  "startTime": "2021-10-22T20:28:24.3820169Z",
  "endTime": "2021-10-22T20:28:49Z"
}
```

#### Trigger the restore request

The operation to trigger a restore request is a `POST` API. [Learn more about this operation](/rest/api/dataprotection/backup-instances/trigger-restore).

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}/restore?api-version=2021-07-01
```

For example, the API translates to:

```http
POST "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/restore?api-version=2021-07-01"
```

##### Create a request body for restore operations

After the requests are validated, use the same request body (with minor changes) to trigger the restore request.

As shown in the following example, the only change from the request body for validating a restore request is to remove the `restoreRequest` object at the start:

```json
{
  "objectType": "AzureBackupRecoveryPointBasedRestoreRequest",
  "sourceDataStoreType": "VaultStore",
  "restoreTargetInfo": {
    "objectType": "restoreTargetInfo",
    "recoveryOption": "FailIfExists",
    "dataSourceInfo": {
      "objectType": "Datasource",
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
      "resourceName": "emprestored21",
      "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
      "resourceLocation": "westus",
      "resourceUri": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver/databases/emprestored21",
      "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
    },
    "dataSourceSetInfo": {
      "objectType": "DatasourceSet",
      "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/targetrg/providers/Microsoft.DBforPostgreSQL/servers/targetossserver",
      "resourceName": "targetossserver",
      "resourceType": "Microsoft.DBforPostgreSQL/servers",
      "resourceLocation": "westus",
      "resourceUri": "",
      "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases"
    },
    "datasourceAuthCredentials": {
      "objectType": "SecretStoreBasedAuthCredentials",
      "secretStoreResource": {
        "secretStoreType": "AzureKeyVault",
        "uri": "https://vikottur-test.vault.azure.net/secrets/dbauth3",
        "value": null
      }
    },
    "restoreLocation": "westus"
  },
  "recoveryPointId": "eb006fde78cb47198be5a320fbe45e9b"
}
```

#### Response to trigger restore requests

The operation to trigger a restore request is [asynchronous](../azure-resource-manager/management/async-operations.md). So, this operation creates another operation that needs to be tracked separately.

The operation returns these responses:

|Name  |Type  |Description  |
|---------|---------|---------|
|`200 OK`     |         |  The operation is completed.       |
|`202 Accepted`     |         |     The request is accepted. Another operation is created.    |

After the `POST` operation is submitted, it returns the initial response as `202 Accepted` with an `Azure-asyncOperation` header, as shown in the following example response:

```http
HTTP/1.1 202 Accepted
Content-Length: 0
Expires: -1
Pragma: no-cache
Retry-After: 30
Azure-AsyncOperation: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==?api-version=2021-07-01
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1197
x-ms-correlation-request-id: 8661209c-5b6a-44fe-b676-4e2b9c296593
x-ms-routing-request-id: CENTRALUSEUAP:20210708T204652Z:69e3fa4b-c5d9-4601-9410-598006ada187
Cache-Control: no-cache
Date: Thu, 08 Jul 2021 20:46:52 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==?api-version=2021-07-01
X-Powered-By: ASP.NET
```

Track the `Azure-AsyncOperation` header with a simple `GET` request. When the request is successful, it returns `200 OK` with a job ID that should be further tracked for completion of the restore request.

```http
GET https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==?api-version=2021-07-01

{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationStatus/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==",
  "name": "ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExO2Q1NDIzY2VjLTczYjYtNDY5ZC1hYmRjLTc1N2Q0ZTJmOGM5OQ==",
  "status": "Succeeded",
  "startTime": "2021-07-08T20:46:52.4110868Z",
  "endTime": "2021-07-08T20:46:56Z",
  "properties": {
    "jobId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupJobs/cccc2c2c-dd3d-ee4e-ff5f-aaaaaa6a6a6a",
    "objectType": "OperationJobExtendedInfo"
  }
}
```

#### Track jobs

After a restore job is triggered, you can track the resultant job ID by using the [GET Jobs API](/rest/api/dataprotection/jobs/get).

Use the following `GET` command to track the `jobId` value in the [response to the triggered restore operation](#response-to-trigger-restore-requests):

```http
 GET /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupJobs/cccc2c2c-dd3d-ee4e-ff5f-aaaaaa6a6a6a?api-version=2021-07-01
```

The job status indicates that the restore job is complete.

## Related content

- [What is Azure Database for PostgreSQL backup?](backup-azure-database-postgresql-overview.md)
- [Track  backup and restore jobs by using the REST API in Azure Backup](backup-azure-arm-userestapi-managejobs.md)
