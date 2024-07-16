---
title: Server-side encryption of Azure managed disks
description: Azure Storage protects your data by encrypting it at rest before persisting it to Storage clusters. You can use customer-managed keys to manage encryption with your own keys, or you can rely on Microsoft-managed keys for the encryption of your managed disks.
author: roygara
ms.date: 01/11/2024
ms.topic: conceptual
ms.author: rogarana
ms.service: azure-disk-storage
ms.custom:
  - references_regions
  - ignite-2023
---

# Server-side encryption of Azure Disk Storage

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Most Azure managed disks are encrypted with Azure Storage encryption, which uses server-side encryption (SSE) to protect your data and to help you meet your organizational security and compliance commitments. Azure Storage encryption automatically encrypts your data stored on Azure managed disks (OS and data disks) at rest by default when persisting it to the cloud. Disks with encryption at host enabled, however, aren't encrypted through Azure Storage. For disks with encryption at host enabled, the server hosting your VM provides the encryption for your data, and that encrypted data flows into Azure Storage.

Data in Azure managed disks is encrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal)

Azure Storage encryption doesn't impact the performance of managed disks and there's no extra cost. For more information about Azure Storage encryption, see [Azure Storage encryption](../storage/common/storage-service-encryption.md).

> [!NOTE]
> Temporary disks are not managed disks and are not encrypted by SSE, unless you enable encryption at host.

## About encryption key management

You can rely on platform-managed keys for the encryption of your managed disk, or you can manage encryption using your own keys. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all data in managed disks. 

The following sections describe each of the options for key management in greater detail.

### Platform-managed keys

By default, managed disks use platform-managed encryption keys. All managed disks, snapshots, images, and data written to existing managed disks are automatically encrypted-at-rest with platform-managed keys. Platform-managed keys are managed by Microsoft.

### Customer-managed keys

You can choose to manage encryption at the level of each managed disk, with your own keys. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.

You must use one of the following Azure key stores to store your customer-managed keys:

- [Azure Key Vault](../key-vault/general/overview.md)
- [Azure Key Vault Managed Hardware Security Module (HSM)](../key-vault/managed-hsm/overview.md)

You can either import [your RSA keys](../key-vault/keys/hsm-protected-keys.md) to your Key Vault or generate new RSA keys in Azure Key Vault. Azure managed disks handles the encryption and decryption in a fully transparent fashion using envelope encryption. It encrypts data using an [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) 256 based data encryption key (DEK), which is, in turn, protected using your keys. The Storage service generates data encryption keys and encrypts them with customer-managed keys using RSA encryption. The envelope encryption allows you to rotate (change) your keys periodically as per your compliance policies without impacting your VMs. When you rotate your keys, the Storage service re-encrypts the data encryption keys with the new customer-managed keys. 

Managed disks and the Key Vault or managed HSM must be in the same Azure region, but they can be in different subscriptions. They must also be in the same Microsoft Entra tenant, unless you're using [Encrypt managed disks with cross-tenant customer-managed keys (preview)](disks-cross-tenant-customer-managed-keys.md).

#### Full control of your keys

You must grant access to managed disks in your Key Vault or managed HSM to use your keys for encrypting and decrypting the DEK. This allows you full control of your data and keys. You can disable your keys or revoke access to managed disks at any time. You can also audit the encryption key usage with Azure Key Vault monitoring to ensure that only managed disks or other trusted Azure services are accessing your keys.

> [!IMPORTANT]
> When a key is either disabled, deleted, or expired, any VMs with either OS or data disks using that key will automatically shut down. After the automated shut down, VMs won't boot until the key is enabled again, or you assign a new key.
> 
> Generally, disk I/O (read or write operations) start to fail one hour after a key is either disabled, deleted, or expired.

The following diagram shows how managed disks use Microsoft Entra ID and Azure Key Vault to make requests using the customer-managed key:

:::image type="content" source="media/disk-encryption/customer-managed-keys-sse-managed-disks-workflow.png" alt-text="Diagram of managed disk and customer-managed keys workflow. An admin creates an Azure Key Vault, then creates a disk encryption set, and sets up the disk encryption set. The set is associated to a VM, which allows the disk to make use of Microsoft Entra ID to authenticate" lightbox="media/disk-encryption/customer-managed-keys-sse-managed-disks-workflow.png":::

The following list explains the diagram in more detail:

1. An Azure Key Vault administrator creates key vault resources.
1. The key vault admin either imports their RSA keys to Key Vault or generate new RSA keys in Key Vault.
1. That administrator creates an instance of Disk Encryption Set resource, specifying an Azure Key Vault ID and a key URL. Disk Encryption Set is a new resource introduced for simplifying the key management for managed disks. 
1. When a disk encryption set is created, a [system-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview) is created in Microsoft Entra ID and associated with the disk encryption set. 
1. The Azure key vault administrator then grants the managed identity permission to perform operations in the key vault.
1. A VM user creates disks by associating them with the disk encryption set. The VM user can also enable server-side encryption with customer-managed keys for existing resources by associating them with the disk encryption set. 
1. Managed disks use the managed identity to send requests to the Azure Key Vault.
1. For reading or writing data, managed disks sends requests to Azure Key Vault to encrypt (wrap) and decrypt (unwrap) the data encryption key in order to perform encryption and decryption of the data. 

To revoke access to customer-managed keys, see [Azure Key Vault PowerShell](/powershell/module/azurerm.keyvault/) and [Azure Key Vault CLI](/cli/azure/keyvault). Revoking access effectively blocks access to all data in the storage account, as the encryption key is inaccessible by Azure Storage.

#### Automatic key rotation of customer-managed keys

Generally, if you're using customer-managed keys, you should enable automatic key rotation to the latest key version. Automatic key rotation helps ensure your keys are secure. A disk references a key via its disk encryption set. When you enable automatic rotation for a disk encryption set, the system will automatically update all managed disks, snapshots, and images referencing the disk encryption set to use the new version of the key within one hour. To learn how to enable customer-managed keys with automatic key rotation, see [Set up an Azure Key Vault and DiskEncryptionSet with automatic key rotation](windows/disks-enable-customer-managed-keys-powershell.md#set-up-an-azure-key-vault-and-diskencryptionset-optionally-with-automatic-key-rotation).

> [!NOTE]
> Virtual Machines aren't rebooted during automatic key rotation.

If you can't enable automatic key rotation, you can use other methods to alert you before keys expire. This way, you can make sure to rotate your keys before expiration and keep business continuity. You can use either an [Azure Policy](../key-vault/general/azure-policy.md) or [Azure Event Grid](../event-grid/event-schema-key-vault.md) to send a notification when a key expires soon.

#### Restrictions

For now, customer-managed keys have the following restrictions:

[!INCLUDE [virtual-machines-managed-disks-customer-managed-keys-restrictions](../../includes/virtual-machines-managed-disks-customer-managed-keys-restrictions.md)]

#### Supported regions

Customer-managed keys are available in all regions that managed disks are available.

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Microsoft Entra ID. When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Microsoft Entra directory to another, the managed identity associated with managed disks isn't transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Microsoft Entra directories](../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

To enable customer-managed keys for managed disks, see our articles covering how to enable it with either the [Azure PowerShell module](windows/disks-enable-customer-managed-keys-powershell.md), the [Azure CLI](linux/disks-enable-customer-managed-keys-cli.md) or the [Azure portal](disks-enable-customer-managed-keys-portal.yml).

See [Create a managed disk from a snapshot with CLI](scripts/create-managed-disk-from-snapshot.md#disks-with-customer-managed-keys) for a code sample.

## Encryption at host - End-to-end encryption for your VM data

When you enable encryption at host, that encryption starts on the VM host itself, the Azure server that your VM is allocated to. The data for your temporary disk and OS/data disk caches are stored on that VM host. After enabling encryption at host, all this data is encrypted at rest and flows encrypted to the Storage service, where it's persisted. Essentially, encryption at host encrypts your data from end-to-end. Encryption at host doesn't use your VM's CPU and doesn't impact your VM's performance. 

Temporary disks and ephemeral OS disks are encrypted at rest with platform-managed keys when you enable end-to-end encryption. The OS and data disk caches are encrypted at rest with either customer-managed or platform-managed keys, depending on the selected disk encryption type. For example, if a disk is encrypted with customer-managed keys, then the cache for the disk is encrypted with customer-managed keys, and if a disk is encrypted with platform-managed keys then the cache for the disk is encrypted with platform-managed keys.

### Restrictions

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](../../includes/virtual-machines-disks-encryption-at-host-restrictions.md)]

### Regional availability

[!INCLUDE [virtual-machines-disks-encryption-at-host-regions](../../includes/virtual-machines-disks-encryption-at-host-regions.md)]

#### Supported VM sizes

The complete list of supported VM sizes can be pulled programmatically. To learn how to retrieve them programmatically, refer to the finding supported VM sizes section of either the [Azure PowerShell module](windows/disks-enable-host-based-encryption-powershell.md#finding-supported-vm-sizes) or [Azure CLI](linux/disks-enable-host-based-encryption-cli.md#finding-supported-vm-sizes) articles.

To enable end-to-end encryption using encryption at host, see our articles covering how to enable it with either the [Azure PowerShell module](windows/disks-enable-host-based-encryption-powershell.md), the [Azure CLI](linux/disks-enable-host-based-encryption-cli.md), or the [Azure portal](disks-enable-host-based-encryption-portal.md).

## Double encryption at rest

High security sensitive customers who are concerned of the risk associated with any particular encryption algorithm, implementation, or key being compromised can now opt for extra layer of encryption using a different encryption algorithm/mode at the infrastructure layer using platform managed encryption keys. This new layer can be applied to persisted OS and data disks, snapshots, and images, all of which will be encrypted at rest with double encryption.

### Restrictions

Double encryption at rest isn't currently supported with either Ultra Disks or Premium SSD v2 disks.

### Supported regions

Double encryption is available in all regions that managed disks are available.

To enable double encryption at rest for managed disks, see our articles covering how to enable it with either the [Azure PowerShell module](windows/disks-enable-double-encryption-at-rest-powershell.md), the [Azure CLI](linux/disks-enable-double-encryption-at-rest-cli.md) or the [Azure portal](disks-enable-double-encryption-at-rest-portal.md).

## Server-side encryption versus Azure disk encryption

[Azure Disk Encryption](../virtual-machines/disk-encryption-overview.md) leverages either the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux or the [BitLocker](/windows/security/information-protection/bitlocker/bitlocker-overview) feature of Windows to encrypt managed disks with customer-managed keys within the guest VM.  Server-side encryption with customer-managed keys improves on ADE by enabling you to use any OS types and images for your VMs by encrypting data in the Storage service.
> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Microsoft Entra ID. When you configure customer-managed keys, a managed identity is automatically assigned to your resources under the covers. If you subsequently move the subscription, resource group, or managed disk from one Microsoft Entra directory to another, the managed identity associated with managed disks is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see [Transferring a subscription between Microsoft Entra directories](../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

## Next steps

- Enable end-to-end encryption using encryption at host with either the [Azure PowerShell module](windows/disks-enable-host-based-encryption-powershell.md), the [Azure CLI](linux/disks-enable-host-based-encryption-cli.md), or the [Azure portal](disks-enable-host-based-encryption-portal.md).
- Enable double encryption at rest for managed disks with either the [Azure PowerShell module](windows/disks-enable-double-encryption-at-rest-powershell.md), the [Azure CLI](linux/disks-enable-double-encryption-at-rest-cli.md) or the [Azure portal](disks-enable-double-encryption-at-rest-portal.md).
- Enable customer-managed keys for managed disks with either the [Azure PowerShell module](windows/disks-enable-customer-managed-keys-powershell.md), the [Azure CLI](linux/disks-enable-customer-managed-keys-cli.md) or the [Azure portal](disks-enable-customer-managed-keys-portal.yml).
- [Explore the Azure Resource Manager templates for creating encrypted disks with customer-managed keys](https://github.com/ramankumarlive/manageddiskscmkpreview)
- [What is Azure Key Vault?](../key-vault/general/overview.md)
