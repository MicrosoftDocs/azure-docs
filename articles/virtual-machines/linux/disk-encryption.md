---
title: Server side encryption of Azure Managed Disks | Microsoft Docs
description: Azure Storage protects your data by encrypting it at rest before persisting it to Storage clusters. You can rely on Microsoft-managed keys for the encryption of your managed disks, or you can manage encryption with your own keys.
author: roygara

ms.date: 10/16/2019
ms.topic: conceptual
ms.author: rogarana
ms.service: virtual-machines-linux
ms.subservice: disks
---

# Server side encryption of Azure managed disks

Azure managed disks automatically encrypt your data by default when persisting it to the cloud. Server-side encryption (SSE) protects your data and help you meet your organizational security and compliance commitments. Data in Azure managed disks is encrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant.   

Encryption does not affect performance of managed disks. There is no additional cost for the encryption.

For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal)

## About encryption key management

You can rely on Platform-managed keys for the encryption of your managed disk, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all data in managed disks. 

The following sections describe each of the options for key management in greater detail.

## Platform-managed keys

By default, your managed disk uses Platform-managed encryption keys. Starting June 10th, 2017, all new managed disks, snapshots, images and new data written to existing managed disks are automatically encrypted-at-rest with PMK. 

## Customer-managed keys

You can choose to manage encryption at the level of each managed disk, with your own keys. Azure managed disks handles the encryption and decryption in a fully transparent fashion using [envelope encryption](https://docs.microsoft.com/en-us/azure/storage/common/storage-client-side-encryption#encryption-via-the-envelope-technique). It encrypts data using an [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) 256 based data encryption key (DEK), which is, in turn, protected using your keys. Customer-managed keys offer greater flexibility to create, disable, and revoke access controls. SSE with customer-managed keys is integrated with Azure Key Vault (AKV) that provides highly available and scalable secure storage for RSA cryptographic keys backed by Hardware Security Modules (HSMs). You can either import [your RSA keys](https://docs.microsoft.com/azure/key-vault/key-vault-hsm-protected-keys) to AKV or generate new RSA keys in AKV. You can also audit the encryption keys used via AKV monitoring to protect your data. Managed disks and AKV must be created in the same subscription and region.

![Interaction of disk set and customer managed keys](media/disk-encryption/how-sse-customer-managed-keys-works-for-managed-disks.png)

This diagram shows how Azure Storage uses Azure Active Directory and Azure Key Vault to make requests using the customer-managed key:

![Managed disks customer managed keys workflow](media/disk-encryption/customer-managed-keys-sse-managed-disks-workflow.png)

The following list explains the numbered steps in the diagram:

1. An Azure Key Vault administrator creates key vault resources.
1. The key vault admin either imports their RSA keys to AKV or generate new RSA keys in AKV. .
1. That administrator creates an instance of Disk Encryption Set resource, specifying an Azure Key Vault ID and a key URL. Disk Encryption Set is a new Azure Resource Manager (ARM) introduced for simplifying the key management for managed disks. 
1. When a disk encryption set is created, a [system-assigned managed identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)is created in Azure active directory (AD) and associated with the disk encryption set. 
1. The Azure key vault administrator then grants the managed identity permission to perform operations in the key vault.
1. A VM user creates disks by associating them with the disk encryption set. The VM user can also enable SSE with customer-managed keys for existing resources by associating them with the disk encryption set. 
1. Managed disks use the managed identity to send requests to the Azure Key Vault.
1. For reading or writing data, managed disks sends requests to Azure Key Vault to encrypt (wrap) and decrypt (unwrap) the data encryption key in order to perform encryption and decryption of the data. 

To revoke access to customer-managed keys, see [Azure Key Vault PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/) and [Azure Key Vault CLI](https://docs.microsoft.com/cli/azure/keyvault). Revoking access effectively blocks access to all data in the storage account, as the encryption key is inaccessible by Azure Storage.

### Setting up your Azure Key Vault

1.	Create an instance of Azure Key Vault and encryption key

```powershell
$keyVault = New-AzKeyVault -Name myKeyVaultName ` 
-ResourceGroupName myRGName ` 
-Location centraluseuap ` 
-EnableSoftDelete ` 
-EnablePurgeProtection 
 
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName ` 
-Name myKeyName ` 
-Destination Software `  
```

1.	Create an instance of a new resource type called as DiskEncryptionSet which represents a CMK. 

```powershell
New-AzResourceGroupDeployment -ResourceGroupName myRGName ` 
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddiskscmkpreview/master/CreateDiskEncryptionSet.json" ` 
  -diskEncryptionSetName "myDiskEncryptionSet1" ` 
  -keyVaultId "/subscriptions/mySubscriptionId/resourceGroups/myRGName/providers/Microsoft.KeyVault/vaults/myKeyVaultName" ` 
  -keyVaultKeyUrl "https://myKeyVaultName.vault.azure.net/keys/myKeyName/403445136dee4a57af7068cab08f7d42" ` 
  -region "WestCentralUS"
```

1.	Grant DataEncryptionSet resource access to the key vault

```powershell
$identity = Get-AzADServicePrincipal -DisplayName myDiskEncryptionSet1  
 
Set-AzKeyVaultAccessPolicy ` 
    -VaultName $keyVault.VaultName ` 
    -ObjectId $identity.Id ` 
    -PermissionsToKeys wrapkey,unwrapkey,get 
 
New-AzRoleAssignment ` 
    -ObjectId $identity.Id ` 
    -RoleDefinitionName "Reader" ` 
    -ResourceName $keyVault.VaultName ` 
    -ResourceType "Microsoft.KeyVault/vaults" ` 
    -ResourceGroupName myRGName `  
```

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Azure AD directory to another, the managed identity associated with managed disks is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).  

## Server-side encryption versus Azure disk encryption

[Azure Disk Encryption](../../security/azure-security-disk-encryption-overview.md) leverages the [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview) feature of Windows and the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to encrypt managed disks with customer-managed keys within the guest VM.  Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.


## Next steps

- [What is Azure Key Vault?](../../key-vault/key-vault-overview.md)