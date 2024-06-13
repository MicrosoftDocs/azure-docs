---
title: Create Azure Backup policy for blobs using REST API.
description: In this article, learn how to create a policy to back up blobs in a storage account using REST API.
ms.topic: conceptual
ms.date: 07/09/2021
ms.assetid: 93861379-5bec-4ed5-95d2-46f534a115fd
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Create Azure Backup vault using REST API

Azure Backup's new Data Protection platform provides enhanced capabilities for backup and restore for newer workloads such as blobs in storage accounts, managed disk and PostgreSQL server's PaaS platform. It aims to minimize management overhead while making it easy for organizing backups. A 'Backup vault' is the cornerstone of the Data protection platform and this is different from the 'Recovery Services' vault.

The steps to create an Azure Backup vault using REST API are outlined in [create vault REST API](/rest/api/dataprotection/backup-vaults/create-or-update) documentation. Let's use this document as a reference to create a vault called "testBkpVault" in "West US" and under 'TestBkpVaultRG' resource group.

To create or update an Azure Backup vault, use the following *PUT* operation.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DataProtection/testBkpVault?api-version=2021-01-01
```

## Create a request

To create the *PUT* request, the `{subscription-id}` parameter is required. If you have multiple subscriptions, see [Working with multiple subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli). You define a `{resourceGroupName}` and `{vaultName}` for your resources, along with the `api-version` parameter. This article uses `api-version=2021-01-01`.

The following headers are required:

| Request header   | Description |
|------------------|-----------------|
| *Content-Type:*  | Required. Set to `application/json`. |
| *Authorization:* | Required. Set to a valid `Bearer` [access token](/rest/api/azure/#authorization-code-grant-interactive-clients). |

For more information about how to create the request, see [Components of a REST API request/response](/rest/api/azure/#components-of-a-rest-api-requestresponse).

## Create the request body

The following common definitions are used to build a request body:

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|eTag     |         |   String      |  Optional eTag       |
|location     |  true       |String         |   Resource location      |
|properties     |   true      | [BackupVault](/rest/api/dataprotection/backup-vaults/create-or-update#backupvault)        |  Properties of the vault       |
|Identity     |         |  [DPPIdentityDetails](/rest/api/dataprotection/backup-vaults/create-or-update#dppidentitydetails)       |    Identifies the unique system identifier for each Azure resource     |
|tags     |         | Object        |     Resource tags    |

Note that vault name and resource group name are provided in the PUT URI. The request body defines the location.

## Example request body

The following example body is used to create a vault in "West US". Specify the location.

```json
{
  "location": "WestUS",
  "tags": {
    "key1": "val1"
  },
  "identity": {
    "type": "None"
  },
  "properties": {
    "storageSettings": [
      {
        "datastoreType": "VaultStore",
        "type": "LocallyRedundant"
      }
    ]
  }
}
```

If you want to create a backup vault and also generate a system assigned identity, then the following request body should be given.

```json
{
  "location": "WestUS",
  "tags": {
    "key1": "val1"
  },
  "identity": {
    "type": "systemAssigned"
  },
  "properties": {
    "storageSettings": [
      {
        "datastoreType": "VaultStore",
        "type": "LocallyRedundant"
      }
    ]
  }
}
```

## Responses

Creation of a backup vault is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.
There are two successful responses for the operation to create or update a Backup vault:

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |   [BackupVaultResource](/rest/api/dataprotection/backup-vaults/create-or-update#backupvaultresource)      | OK        |
|201 Created     | [BackupVaultResource](/rest/api/dataprotection/backup-vaults/create-or-update#backupvaultresource)        |   Created      |
| Other status codes  |  [CloudError](/rest/api/dataprotection/backup-vaults/create-or-update#clouderror)

For more information about REST API responses, see [Process the response message](/rest/api/azure/#process-the-response-message).

### Example response

A condensed *201 Created* response from the previous example request body shows an *id* has been assigned and the *provisioningState* is *Succeeded*:

```json
{
    "eTag": null,
    "id": "/subscriptions/xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/TestBkpVaultRG/providers/Microsoft.DataProtection/BackupVaults/testBkpVault",
    "identity": {
      "principalId": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "tenantId": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": "SystemAssigned"
    },
    "location": "westUS",
    "name": "testBkpVault",
    "properties": {
      "provisioningState": "Succeeded",
      "storageSettings": [
        {
          "datastoreType": "VaultStore",
          "type": "GeoRedundant"
        }
      ]
    },
    "resourceGroup": "TestBkpVaultRG",
    "systemData": null,
    "tags": {},
    "type": "Microsoft.DataProtection/backupVaults"
  }
```

## Next steps

[Create a backup policy for backing up blobs in this vault](backup-azure-dataprotection-use-rest-api-create-update-blob-policy.md).

For more information on the Azure REST APIs, see the following documents:

- [Azure Data Protection provider REST API](/rest/api/dataprotection/)
- [Get started with Azure REST API](/rest/api/azure/)
