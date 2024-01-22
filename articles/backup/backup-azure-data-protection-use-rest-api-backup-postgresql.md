---
title: Back up Azure PostgreSQL databases using Azure data protection REST API
description: In this article, learn how to configure, initiate, and manage backup operations of Azure PostgreSQL databases using REST API.
ms.topic: conceptual
ms.date: 01/24/2022
ms.service: backup
ms.assetid: 55fa0a81-018f-4843-bef8-609a44c97dcd
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure PostgreSQL databases using Azure data protection via REST API

This article describes how to manage backups for Azure PostgreSQL databases via REST API.

For information on the Azure PostgreSQL database backup supported scenarios, limitations, and authentication mechanisms, see the [overview](backup-azure-database-postgresql-overview.md) document.

## Prerequisites

- [Create a Backup vault](backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md)

- [Create a PostgreSQL backup policy](backup-azure-data-protection-use-rest-api-create-update-postgresql-policy.md)

## Configure backup

Once the vault and policy are created, there're three critical points that you need to consider to protect an Azure PostgreSQL database.

### Key entities involved

#### PostgreSQL database to be protected

Fetch the Azure Resource Manager ID (ARM ID) of the PostgreSQL database to be protected. This serves as the identifier of the database. We'll use an example of a database named **empdb11** under a PostgreSQL server **testpostgresql**, which is present in the resource group **ossdemoRG** under a different subscription. The following example uses bash.

```http
"/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql/databases/empdb11"
```

#### Azure key vault

The Azure Backup service doesn't store the username and password to connect to the PostgreSQL database. Instead, the backup admin needs to seed the *keys* into the key vault. Then the Azure Backup service will access the key vault, read the keys, and access the database. Note the secret identifier of the relevant key. The following example uses bash.

```http
"https://testkeyvaulteus.vault.azure.net/secrets/ossdbkey"
```

#### Backup vault

Backup vault has to connect to the PostgreSQL server, and then access the database via the keys present in the key vault. So, it requires access to PostgreSQL server and the key vault. Access is granted to the Backup vault's Managed Service Identity (MSI).

You need to grant permissions to back up vault's MSI on the PostgreSQL server and the Azure Key vault, where the keys to the database are stored. [Learn more](./backup-azure-database-postgresql-overview.md#set-of-permissions-needed-for-azure-postgresql-database-backup).

### Prepare the request to configure backup

After you set the relevant permissions to the vault and PostgreSQL database, and configure the vault and policy, prepare the request to configure backup. See the following request body to configure backup for an Azure PostgreSQL database. The Azure Resource Manager ID (ARM ID) of the Azure PostgreSQL database and its details are present in the _datasourceinfo_ section. The policy information is present in the _policyinfo_ section.

```json
{
  "backupInstance": {
    "dataSourceInfo": {
          "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql/databases/empdb11",
          "resourceUri": "",
          "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
          "resourceName": "empdb11",
          "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
          "resourceLocation": "westUS",
          "objectType": "Datasource"
      },
      "dataSourceSetInfo": {
          "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql",
          "resourceUri": "",
          "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
          "resourceName": "testpostgresql",
          "resourceType": "Microsoft.DBforPostgreSQL/servers",
          "resourceLocation": "westUS",
          "objectType": "DatasourceSet"
      },
      "policyInfo": {
          "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/osspol3",
          "policyVersion": ""
      },
    "objectType": "BackupInstance"
  }
}
```

### Validate the request to configure backup

To validate if the request to configure backup will be successful, use the [validate for backup API](/rest/api/dataprotection/backup-instances/validate-for-backup). You can use the response to perform the required prerequisites, and then submit the configuration for the backup request.

Validate for backup request is a _POST_ operation and the Uniform Resource Identifier (URI) contains `{subscriptionId}`, `{vaultName}`, `{vaultresourceGroupName}` parameters.

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{vaultresourceGroupname}/providers/Microsoft.DataProtection/backupVaults/{backupVaultName}/validateForBackup?api-version=2021-01-01
```

For example, this API translates to:

```http
POST https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/validateForBackup?api-version=2021-01-01
```

The [request body](#prepare-the-request-to-configure-backup) that we prepared earlier will be used to provide details of the Azure PostgreSQL database to be protected.

#### Example request body

```json
{
  "backupInstance": {
    "dataSourceInfo": {
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql/databases/empdb11",
        "resourceUri": "",
        "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
        "resourceName": "empdb11",
        "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
        "resourceLocation": "westUS",
        "objectType": "Datasource"
    },
    "dataSourceSetInfo": {
        "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql",
        "resourceUri": "",
        "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
        "resourceName": "testpostgresql",
        "resourceType": "Microsoft.DBforPostgreSQL/servers",
        "resourceLocation": "westUS",
        "objectType": "DatasourceSet"
    },
    "policyInfo": {
        "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/osspol3",
        "policyVersion": ""
    },
    "objectType": "BackupInstance"
  }
}
```

#### Responses for backup request validation

Backup request validation is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). So, this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|202 Accepted     |         |  The operation will be completed asynchronously      |
|200 OK     |   [OperationJobExtendedInfo](/rest/api/dataprotection/backup-instances/validate-for-backup#operationjobextendedinfo)      |     Accepted    |
| Other Status codes |    [CloudError](/rest/api/dataprotection/backup-instances/validate-for-backup#clouderror)    |    Error response describing why the operation failed    |

##### Example responses for validate backup request

###### Error response

If the given disk is already protected, it returns the response as HTTP 400 (Bad request) and states that the given disk is protected to a backup vault along with details.

```http
HTTP/1.1 400 BadRequest
Content-Length: 1012
Content-Type: application/json
Expires: -1
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id:
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: 0c99ff0f-6c26-4ec7-899f-205435e89894
x-ms-routing-request-id: WESTUS:20210830T142949Z:0be72802-02ad-485d-b91f-4aadd92c059c
Cache-Control: no-cache
Date: Mon, 30 Aug 2021 14:29:49 GMT
X-Powered-By: ASP.NET

{
  "error": {
    "additionalInfo": [
      {
        "type": "UserFacingError",
        "info": {
          "message": "Datasource is already protected under the Backup vault /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault.",
          "recommendedAction": [
            "Delete the backup instance testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149 from the Backup vault /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault to re-protect the datasource in any other vault."
          ],
          "details": null,
          "code": "UserErrorDppDatasourceAlreadyProtected",
          "target": "",
          "innerError": null,
          "isRetryable": false,
          "isUserError": false,
          "properties": {
            "ActivityId": "0c99ff0f-6c26-4ec7-899f-205435e89894"
          }
        }
      }
    ],
    "code": "UserErrorDppDatasourceAlreadyProtected",
    "message": "Datasource is already protected under the Backup vault /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault.",
    "target": null,
    "details": null
  }
}
```

###### Track response

If the datasource is unprotected, then the API proceeds for further validations and creates a tracking operation.

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
x-ms-routing-request-id: WESTUS:20210707T124850Z:105f2105-6db1-44bf-8a34-45972a8ba861
Cache-Control: no-cache
Date: Wed, 07 Jul 2021 12:48:50 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzM2NDdhZDNjLTFiNGEtNDU4YS05MGJkLTQ4NThiYjRhMWFkYg==?api-version=2021-01-01
X-Powered-By: ASP.NET
```

Track the resulting operation using the _Azure-AsyncOperation_ header with a simple *GET* command.

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

It returns 200 (OK) once it completes and the response body lists further requirements to be fulfilled, such as permissions.

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
              "DetailedNonLocalisedMessage": "Validate for Protection failed. Exception Message: The client 'a8b24f84-f43c-45b3-aa54-e3f6d54d31a6' with object id 'a8b24f84-f43c-45b3-aa54-e3f6d54d31a6' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/read' over scope '/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql/providers/Microsoft.Authorization' or the scope is invalid. If access was recently granted, please refresh your credentials."
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

If you grant all permissions, then resubmit the validate request, track the resulting operation. It'll return the success response as 200 (OK) if all the conditions are met.

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

Once the request is validated, you can submit the same to the [create backup instance API](/rest/api/dataprotection/backup-instances/create-or-update). One of the Azure Backup data protection services protects the Backup instance within the Backup vault. Here, the Azure PostgreSQL database is the backup instance. Use the above-validated request body with minor additions.

Use a unique name for the backup instance. So, we recommend you use a combination of the resource name and a unique identifier. For example, in the following operation, we'll use _testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149_ and mark it as the backup instance name.

To create or update the backup instance, use the following ***PUT*** operation.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/{BkpvaultName}/backupInstances/{UniqueBackupInstanceName}?api-version=2021-01-01
```

For example, this API translates to:

```http
 PUT https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149?api-version=2021-01-01
```

#### Create the request for configure backup

To create a backup instance, following are the components of the request body:

|Name  |Type  |Description  |
|---------|---------|---------|
|properties     |  [BackupInstance](/rest/api/dataprotection/backup-instances/create-or-update#backupinstance)       |     BackupInstanceResource properties    |

##### Example request for configure backup

We'll use the [same request body that we used to validate the backup request](#configure-backup) with a unique name.

```json
{
  "name": "testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149",
  "type": "Microsoft.DataProtection/backupvaults/backupInstances",
  "properties": {
    "dataSourceInfo": {
            "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql/databases/empdb11",
            "resourceUri": "",
            "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
            "resourceName": "empdb11",
            "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
            "resourceLocation": "westUS",
            "objectType": "Datasource"
        },
        "dataSourceSetInfo": {
            "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql",
            "resourceUri": "",
            "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
            "resourceName": "testpostgresql",
            "resourceType": "Microsoft.DBforPostgreSQL/servers",
            "resourceLocation": "westUS",
            "objectType": "DatasourceSet"
        },
        "policyInfo": {
            "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/osspol3",
            "policyVersion": ""
        }
    },
    "objectType": "BackupInstance"
  }
}
```

#### Responses to configure backup request

_Create backup instance request_ is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). So, this operation creates another operation that needs to be tracked separately.

It returns two responses: 201 (Created) when backup instance is created and the protection is configured. 200 (OK) when that configuration completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|201 Created   |   [Backup instance](/rest/api/dataprotection/backup-instances/create-or-update#backupinstanceresource)      |  Backup instance is created and protection is being configured      |
|200 OK     |    [Backup instance](/rest/api/dataprotection/backup-instances/create-or-update#backupinstanceresource)     |     Protection is configured    |
| Other Status codes |    [CloudError](/rest/api/dataprotection/backup-instances/validate-for-backup#clouderror)    |    Error response describing why the operation failed    |

##### Example responses to configure backup request

Once you submit the *PUT* request to create a backup instance, the initial response is 201 (Created) with an _Azure-asyncOperation_ header. Note that the request body contains all the backup instance properties.

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
x-ms-routing-request-id: WESTUS:20210707T170219Z:9e897266-5d86-4d13-b298-6561c60cf043
Cache-Control: no-cache
Date: Wed, 07 Jul 2021 17:02:18 GMT
Server: Microsoft-IIS/10.0
X-Powered-By: ASP.NET

{
    "properties": {
        "friendlyName": "testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149",
        "dataSourceInfo": {
            "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql/databases/empdb11",
            "resourceUri": "",
            "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
            "resourceName": "empdb11",
            "resourceType": "Microsoft.DBforPostgreSQL/servers/databases",
            "resourceLocation": "westUS",
            "objectType": "Datasource"
        },
        "dataSourceSetInfo": {
            "resourceID": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ossdemoRG/providers/Microsoft.DBforPostgreSQL/servers/testpostgresql",
            "resourceUri": "",
            "datasourceType": "Microsoft.DBforPostgreSQL/servers/databases",
            "resourceName": "testpostgresql",
            "resourceType": "Microsoft.DBforPostgreSQL/servers",
            "resourceLocation": "westUS",
            "objectType": "DatasourceSet"
        },
        "policyInfo": {
            "policyId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupPolicies/osspol3",
            "policyVersion": ""
        },
        "protectionStatus": {
            "status": "ProtectionConfigured"
        },
        "currentProtectionState": "ProtectionConfigured",
        "provisioningState": "Succeeded",
        "objectType": "BackupInstance"
    },
    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149",
    "name": "testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149",
    "type": "Microsoft.DataProtection/backupVaults/backupInstances"
}
```

Then track the resulting operation using the _Azure-AsyncOperation_ header with a simple *GET* command.

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

### Stop protection and delete data

To remove the protection on an Azure PostgreSQL database and delete the backup data as well, perform a [delete operation](/rest/api/dataprotection/backup-instances/delete).

Stopping protection and deleting data is a *DELETE* operation.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/backupVaults/{vaultName}/backupInstances/{backupInstanceName}?api-version=2021-01-01
```

For example, this API translates to:

```http
DELETE "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/resourceGroups/TestBkpVaultRG/providers/Microsoft.DataProtection/backupVaults/testBkpVault/backupInstances/testpostgresql-empdb11-957d23b1-c679-4c94-ade6-c4d34635e149?api-version=2021-01-01"
```

#### Responses for delete protection

*DELETE* protection is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). So, this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |         |  Status of delete request       |
|202 Accepted     |         |     Accepted    |

##### Example responses for delete protection

Once you submit the *DELETE* request, the initial response will be 202 (Accepted) with an _Azure-asyncOperation_ header.

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
x-ms-routing-request-id: WESTUS:20210708T071330Z:5c3a9f3e-53aa-4d5d-bf9a-20de5601b090
Cache-Control: no-cache
Date: Thu, 08 Jul 2021 07:13:29 GMT
Location: https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx/providers/Microsoft.DataProtection/locations/westus/operationResults/ZmMzNDFmYWMtZWJlMS00NGJhLWE4YTgtMDNjYjI4Y2M5OTExOzE1ZjM4YjQ5LWZhMGQtNDMxOC1iYjQ5LTExMDJjNjUzNjM5Zg==?api-version=2021-01-01
X-Powered-By: ASP.NET
```

Track the _Azure-AsyncOperation_ header with a simple *GET* request. When the request is successful, it returns 200 (OK) with a success status response.

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

[Restore data from an Azure PostGreSQL database backup](restore-postgresql-database-use-rest-api.md)

For more information on the Azure Backup REST APIs, see the following articles:

- [Get started with Azure Data Protection Provider REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)