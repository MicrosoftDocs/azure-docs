---
title: Encryption in Azure Backup
description: Learn how encryption features in Azure Backup help you protect your backup data and meet the security needs of your business.
ms.topic: reference
ms.date: 11/09/2026
ms.custom: references_regions, engagement-fy23 
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a data security officer, I want to understand the encryption features in Azure Backup, so that I can ensure our backup data is protected and compliant with industry standards.
---

# Encryption in Azure Backup

Azure Backup automatically encrypts all your backed-up data while storing in the cloud using Azure Storage encryption, which helps you meet your security and compliance commitments. This data at rest is encrypted using 256-bit AES encryption (one of the strongest block ciphers available that is FIPS 140-2 compliant). Additionally, all your backup data in transit is transferred over HTTPS. It always remains on the Azure backbone network.

This article describes the levels of encryption in Azure Backup that helps to protect your backed-up data.

## Encryption levels

Azure Backup includes encryption on two levels:

| Encryption level | Description |
| --- | --- |
| **Encryption of data in the Recovery Services vault** | - **Using platform-managed keys**: By default, all your data is encrypted using platform-managed keys. You don't need to take any explicit action from your end to enable this encryption. It applies to all workloads being backed-up to your Recovery Services vault. <br><br> - **Using customer-managed keys**: You control the keys that protect your vault's backup data. See [How customer-managed key encryption works](#how-customer-managed-key-encryption-works) for the protection model and [Configure a Recovery Services vault](encryption-at-rest-with-cmk.md) for setup requirements and steps. <br><br> - **Infrastructure-level encryption**: In addition to encrypting your data in the Recovery Services vault using customer-managed keys, you can also choose to have an additional layer of encryption configured on the storage infrastructure. This infrastructure encryption is managed by the platform. Together with encryption at rest using customer-managed keys, it allows two-layer encryption of your backup data. Infrastructure encryption can only be configured if you first choose to use your own keys for encryption at rest. Infrastructure encryption uses platform-managed keys for encrypting data.  |
| **Encryption specific to the workload being backed-up** | - **Azure virtual machine backup**: Azure Backup supports backup of VMs with disks encrypted using [platform-managed keys](/azure/virtual-machines/disk-encryption#platform-managed-keys), as well as [customer-managed keys](/azure/virtual-machines/disk-encryption#customer-managed-keys) owned and managed by you. In addition, you can also back up your Azure Virtual machines that have their OS or data disks encrypted using [Azure Disk Encryption](backup-azure-vms-encryption.md#encryption-support-by-using-ade). ADE uses BitLocker for Windows VMs, and DM-Crypt for Linux VMs, to perform in-guest encryption.  <br><br>  - **TDE - enabled database backup is supported**. To restore a TDE-encrypted database to another SQL Server, you need to first [restore the certificate to the destination server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server). The backup compression for TDE-enabled databases for SQL Server 2016 and newer versions is available, but at lower transfer size as explained [here](https://techcommunity.microsoft.com/t5/sql-server/backup-compression-for-tde-enabled-databases-important-fixes-in/ba-p/385593). |

## How customer-managed key encryption works

Customer-managed keys give you control over the keys that protect your vault's backup data at rest. Azure Storage encrypts the data by using AES 256-based data encryption keys (DEKs), and your CMK acts as a key encryption key (KEK) that protects the encryption keys. The CMK isn't used to encrypt the backup data directly and can be different from the key used to encrypt the source resource. The data remains encrypted in storage, and its readability depends on access to your key.

For a CMK-enabled vault, Azure Backup validates the vault's managed identity permissions on the configured key and configures the CMK settings on the Azure Storage accounts that store the vault's data. Azure Storage manages the data encryption keys (DEKs) and performs key wrapping and unwrapping by using the CMK in Azure Key Vault. Azure Backup doesn't perform these cryptographic operations itself.

For the underlying key hierarchy and operations, see [Customer-managed keys for Azure Storage encryption](../storage/common/customer-managed-keys-overview.md#about-customer-managed-keys).

The following flows describe the encryption dependencies for backup and restore:

- **Backup**: Protected resource data is processed for backup. Azure Storage encrypts the data by using DEKs protected by the CMK and stores the encrypted recovery point in the vault.
- **Restore**: Azure Storage requires access to the CMK to make the DEKs usable and decrypt backup data as needed for Azure Backup to restore the resource.

### Managed identity and key access

A system-assigned or user-assigned managed identity authenticates access to the key through Microsoft Entra ID. You authorize key operations through an Azure role-based access control (RBAC) role or Key Vault access policy permissions granted to the identity configured for the vault's encryption settings. You manage those permissions rather than provide key material to Azure Backup.

This authorization allows Azure Storage to use your CMK for normal backup and restore operations. Removing the identity's required permissions revokes access to the key.

### Data readability depends on key access

Without access to the required CMK, neither Azure Backup nor Microsoft can decrypt the vault's backup data. While you grant the required key access, Azure Storage can decrypt the data as needed for authorized backup and restore operations.

If the required CMK access is unavailable, backup and restore operations through the vault fail. Existing recovery points remain stored in encrypted form in the vault, but Azure Backup can't access them as usable customer data. Restoring access to the required key enables Azure Backup to access that encrypted backup data again.

If the required key or the key vault that contains it is deleted and can't be recovered, the backup data becomes permanently inaccessible, including to Microsoft. Protect the key and key vault with soft delete and purge protection, and maintain the managed identity's required permissions.

### Encryption scope

The vault's CMK protects backup data in the vault-standard and vault-archive tiers. It doesn't protect data in the snapshot or operational tier.

Azure VM snapshots have separate encryption and recovery dependencies. For those details, see [Recovery Services vault encryption scope](encryption-at-rest-with-cmk.md#encryption-scope).

For vault-specific configuration and key-access guidance, see:

- [Encrypt backup data in a Recovery Services vault by using customer-managed keys](encryption-at-rest-with-cmk.md).
- [Encrypt backup data in a Backup vault by using customer-managed keys](encryption-at-rest-with-cmk-for-backup-vault.md).

## Next steps

- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
- [Azure Backup FAQ](./backup-azure-backup-faq.yml) for any questions you may have about encryption
