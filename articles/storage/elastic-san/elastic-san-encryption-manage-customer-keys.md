---
title: Learn how to manage keys for Elastic SAN Preview
titleSuffix: Azure Elastic SAN Storage
description: Learn how to manage keys for Elastic SAN Preview
author: roygara

ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 11/06/2023
ms.author: rogarana
ms.reviewer: jaylansdaal
---

# Learn how to manage keys for Elastic SAN Preview

All data written to an Elastic SAN volume is automatically encrypted-at-rest with a data encryption key (DEK). Azure DEKs are always *platform-managed* (managed by Microsoft). Azure uses [envelope encryption](../../security/fundamentals/encryption-atrest.md#envelope-encryption-with-a-key-hierarchy), also referred to as wrapping, which involves using a Key Encryption Key (KEK) to encrypt the DEK. By default, the KEK is platform-managed, but you can create and manage your own KEK. [Customer-managed keys](elastic-san-encryption-overview.md#customer-managed-keys) offer greater flexibility to manage access controls and can help you meet your organization security and compliance requirements.

You control all aspects of your key encryption keys, including:

- Which key is used
- Where your keys are stored
- How the keys are rotated
- The ability to switch between customer-managed and platform-managed keys

This article tells you how to manage your customer-managed KEKs.

> [!NOTE]
> Envelope encryption allows you to change your key configuration without impacting your Elastic SAN volumes. When you make a change, the Elastic SAN service re-encrypts the data encryption keys with the new keys. The protection of the data encryption key changes, but the data in your Elastic SAN volumes remain encrypted at all times. There is no additional action required on your part to ensure that your data is protected. Changing the key configuration doesn't impact performance, and there is no downtime associated with such a change.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Change the key

You can change the key that you're using for Azure Elastic SAN encryption at any time.

To change the key with PowerShell, call [Update-AzElasticSanVolumeGroup](/powershell/module/az.elasticsan/update-azelasticsanvolumegroup) and provide the new key name and version. If the new key is in a different key vault, then you must also update the key vault URI.


If the new key is in a different key vault, you must [grant the managed identity access to the key in the new vault](elastic-san-configure-customer-managed-keys.md#choose-a-managed-identity-to-authorize-access-to-the-key-vault). If you opt for manual updating of the key version, you'll also need to [update the key vault URI](elastic-san-configure-customer-managed-keys.md#manual-key-version-rotation).

## Update the key version

Following cryptographic best practices means to rotate the key that is protecting your Elastic SAN volume group on a regular schedule, typically at least every two years. Azure Elastic SAN never modifies the key in the key vault, but you can configure a key rotation policy to rotate the key according to your compliance requirements. For more information, see [Configure cryptographic key auto-rotation in Azure Key Vault](../../key-vault/keys/how-to-configure-key-rotation.md).

After the key is rotated in the key vault, the customer-managed KEK configuration for your Elastic SAN volume group must be updated to use the new key version. Customer-managed keys support both automatic and manual updating of the KEK version. You can decide which approach you want to use when you initially configure customer-managed keys, or when you update your configuration.

When you modify the key or the key version, the protection of the root encryption key changes, but the data in your Azure Elastic SAN volume group remains encrypted at all times. There's no extra action required on your part to ensure that your data is protected. Rotating the key version doesn't impact performance, and there's no downtime associated with rotating the key version.

> [!IMPORTANT]
> To rotate a key, create a new version of the key in the key vault, according to your compliance requirements. Azure Elastic SAN does not handle key rotation, so you will need to manage rotation of the key in the key vault.
>
> When you rotate the key used for customer-managed keys, that action is not currently logged to the Azure Monitor logs for Azure Elastic SAN.

### Automatically update the key version

To automatically update a customer-managed key when a new version is available, omit the key version when you enable encryption with customer-managed keys for the Elastic SAN volume group. If the key version is omitted, then Azure Elastic SAN checks the key vault daily for a new version of a customer-managed key. If a new key version is available, then Azure Elastic SAN automatically uses the latest version of the key.

Azure Elastic SAN checks the key vault for a new key version only once daily. When you rotate a key, be sure to wait 24 hours before disabling the older version.

If the Elastic SAN volume group was previously configured for manual updating of the key version and you want to change it to update automatically, you might need to explicitly change the key version to an empty string. For details on how to do this, see [Manual key version rotation](elastic-san-configure-customer-managed-keys.md#manual-key-version-rotation).

### Manually update the key version

To use a specific version of a key for Azure Elastic SAN encryption, specify that key version when you enable encryption with customer-managed keys for the Elastic SAN volume group. If you specify the key version, then Azure Elastic SAN uses that version for encryption until you manually update the key version.

When the key version is explicitly specified, then you must manually update the Elastic SAN volume group to use the new key version URI when a new version is created. To learn how to update the Elastic SAN volume group to use a new version of the key, see [Configure encryption with customer-managed keys stored in Azure Key Vault](elastic-san-configure-customer-managed-keys.md).

## Revoke access to a volume group that uses customer-managed keys

To temporarily revoke access to an Elastic SAN volume group that is using customer-managed keys, disable the key currently being used in the key vault. There's no performance impact or downtime associated with disabling and reenabling the key.

After the key has been disabled, clients can't call operations that read from or write to volumes in the volume group or their metadata.


> [!CAUTION]
> When you disable the key in the key vault, the data in your Azure Elastic SAN volume group remains encrypted, but it becomes inaccessible until you reenable the key.

To revoke a customer-managed key with PowerShell, call the [Update-AzKeyVaultKey](/powershell/module/az.keyvault/update-azkeyvaultkey) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values to define the variables, or use the variables defined in the previous examples.

```azurepowershell
$KvName  = "<key-vault-name>"
$KeyName = "<key-name>"
$enabled = $false
# $false to disable the key / $true to enable it

# Check the current state of the key (before and after enabling/disabling it)
Get-AzKeyVaultKey -Name $KeyName -VaultName $KvName

# Disable (or enable) the key
Update-AzKeyVaultKey -VaultName $KvName -Name $KeyName -Enable $enabled
```

## Switch back to platform-managed keys

You can switch from customer-managed keys back to platform-managed keys at any time, using the Azure PowerShell module.

To switch from customer-managed keys back to platform-managed keys with PowerShell, call [Update-AzElasticSanVolumeGroup](/powershell/module/az.elasticsan/update-azelasticsanvolumegroup) with the `-Encryption` option, as shown in the following example. Remember to replace the placeholder values with your own values and to use the variables defined in the previous examples.

```azurepowershell
Update-AzElasticSanVolumeGroup -ResourceGroupName "ResourceGroupName" -ElasticSanName "ElasticSanName" -Name "ElasticSanVolumeGroupName" -Encryption EncryptionAtRestWithPlatformKey 
```


## See also

- [Configure customer-managed keys for an Elastic SAN volume group](elastic-san-configure-customer-managed-keys.md)