---
title: Update Recovery Services vault configuration with REST API
description: In this article, learn how to update vault's configuration using REST API.
ms.topic: conceptual
ms.date: 12/06/2019
ms.assetid: 9aafa5a0-1e57-4644-bf79-97124db27aa2
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Update Azure Recovery Services vault configurations using REST API

This article describes how to update backup related configurations in Azure Recovery Services vault using REST API.

## Soft delete state

Deleting backups of a protected item is a significant operation that has to be monitored. To protect against accidental deletions, Azure Recovery Services vault has a soft-delete capability. This capability allows you to restore deleted backups, if necessary, within a time period after the deletion.

But there are scenarios in which this capability isn't required. An Azure Recovery Services vault can't be deleted if there are backup items within it, even soft-deleted ones. This may pose a problem if the vault needs to be immediately deleted. For example: deployment operations often clean up the created resources in the same workflow. A deployment can create a vault, configure backups for an item, do a test restore and then proceed to delete the backup items and the vault. If the vault deletion fails, the entire deployment might fail. Disabling soft-delete is the only way to guarantee immediate deletion.

So you need to carefully choose whether or not to disable soft-delete for a particular vault depending on the scenario. For more information, see the [soft-delete article](backup-azure-security-feature-cloud.md).

### Fetch soft delete state using REST API

By default, the soft-delete state will be enabled for any newly created Recovery Services vault. To fetch/update the state of soft-delete for a vault, use the backup vault's config related [REST API document](/rest/api/backup/backup-resource-vault-configs)

To fetch the current state of soft-delete for a vault, use the following *GET* operation

```http
GET https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupconfig/vaultconfig?api-version=2019-06-15
```

The GET URI has `{subscriptionId}`, `{vaultName}`, `{vaultresourceGroupName}` parameters. In this example, `{vaultName}` is "testVault" and `{vaultresourceGroupName}` is "testVaultRG". As all the required parameters are given in the URI, there's no need for a separate request body.

```http
GET https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupconfig/vaultconfig?api-version=2019-06-15
```

#### Responses

The successful response for the 'GET' operation is shown below:

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |   [BackupResourceVaultConfig](/rest/api/backup/backup-resource-vault-configs/get#backupresourcevaultconfigresource)      | OK        |

##### Example response

Once the 'GET' request is submitted, a 200 (successful) response is returned.

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testvaultRG/providers/Microsoft.RecoveryServices/vaults/testvault/backupconfig/vaultconfig",
  "name": "vaultconfig",
  "type": "Microsoft.RecoveryServices/vaults/backupconfig",
  "properties": {
    "enhancedSecurityState": "Enabled",
    "softDeleteFeatureState": "Enabled"
  }
}
```

### Update soft delete state using REST API

To update the soft-delete state of the Recovery Services vault using REST API, use the following *PUT* operation

```http
PUT https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupconfig/vaultconfig?api-version=2019-06-15
```

The PUT URI has `{subscriptionId}`, `{vaultName}`, `{vaultresourceGroupName}` parameters. In this example, `{vaultName}` is "testVault" and `{vaultresourceGroupName}` is "testVaultRG". If we replace the URI with the values above, then the URI will look like this.

```http
PUT https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupconfig/vaultconfig?api-version=2019-06-15
```

#### Create the request body

The following common definitions are used to create a request body

For more details, refer to [the REST API documentation](/rest/api/backup/backup-resource-vault-configs/update#request-body)

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|eTag     |         |   String      |  Optional eTag       |
|location     |  true       |String         |   Resource location      |
|properties     |         | [VaultProperties](/rest/api/recoveryservices/vaults/createorupdate#vaultproperties)        |  Properties of the vault       |
|tags     |         | Object        |     Resource tags    |

#### Example request body

The following example is used to update the soft-delete state to 'disabled'.

```json
{
  "properties": {
    "enhancedSecurityState": "Enabled",
    "softDeleteFeatureState": "Disabled"
  }
}
```

#### Responses for the PATCH operation

The successful response for the 'PATCH' operation is shown below:

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |   [BackupResourceVaultConfig](/rest/api/backup/backup-resource-vault-configs/get#backupresourcevaultconfigresource)      | OK        |

##### Example response for the PATCH operation

Once the 'PATCH' request is submitted, a 200 (successful) response is returned.

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testvaultRG/providers/Microsoft.RecoveryServices/vaults/testvault/backupconfig/vaultconfig",
  "name": "vaultconfig",
  "type": "Microsoft.RecoveryServices/vaults/backupconfig",
  "properties": {
    "enhancedSecurityState": "Enabled",
    "softDeleteFeatureState": "Disabled"
  }
}
```

## Next steps

[Create a backup policy for backing up an Azure VM in this vault](backup-azure-arm-userestapi-createorupdatepolicy.md).

For more information on the Azure REST APIs, see the following documents:

- [Azure Recovery Services provider REST API](/rest/api/recoveryservices/)
- [Get started with Azure REST API](/rest/api/azure/)
