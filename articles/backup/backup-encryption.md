---
title: Encryption in Azure Backup
description: Learn how encryption features in Azure Backup help you protect your backup data and meet the security needs of your business.
ms.topic: conceptual
ms.date: 10/28/2022
ms.custom: references_regions, engagement-fy23 
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Encryption in Azure Backup

Azure Backup automatically encrypts all your backed-up data while storing in the cloud using Azure Storage encryption, which helps you meet your security and compliance commitments. This data at rest is encrypted using 256-bit AES encryption (one of the strongest block ciphers available that is FIPS 140-2 compliant). Additionally, all your backup data in transit is transferred over HTTPS. It always remains on the Azure backbone network.

This article describes the levels of encryption in Azure Backup that helps to protect your backed-up data.

## Encryption levels

Azure Backup includes encryption on two levels:

| Encryption level | Description |
| --- | --- |
| **Encryption of data in the Recovery Services vault** | - **Using platform-managed keys**: By default, all your data is encrypted using platform-managed keys. You don't need to take any explicit action from your end to enable this encryption. It applies to all workloads being backed-up to your Recovery Services vault. <br><br>  - **Using customer-managed keys**: When backing up your Azure Virtual Machines, you can choose to encrypt your data using encryption keys owned and managed by you. Azure Backup lets you use your RSA keys stored in the Azure Key Vault for encrypting your backups. The encryption key used for encrypting backups may be different from the one used for the source. The data is protected using an AES 256 based data encryption key (DEK), which is, in turn, protected using your keys. This gives you full control over the data and the keys. To allow encryption, it's required that you grant the Recovery Services vault access to the encryption key in the Azure Key Vault. You can disable the key or revoke access whenever needed. However, you must enable encryption using your keys before you attempt to protect any items to the vault. [Learn more here](encryption-at-rest-with-cmk.md). <br><br> - **Infrastructure-level encryption**: In addition to encrypting your data in the Recovery Services vault using customer-managed keys, you can also choose to have an additional layer of encryption configured on the storage infrastructure. This infrastructure encryption is managed by the platform. Together with encryption at rest using customer-managed keys, it allows two-layer encryption of your backup data. Infrastructure encryption can only be configured if you first choose to use your own keys for encryption at rest. Infrastructure encryption uses platform-managed keys for encrypting data.  |
| **Encryption specific to the workload being backed-up** | - **Azure virtual machine backup**: Azure Backup supports backup of VMs with disks encrypted using [platform-managed keys](../virtual-machines/disk-encryption.md#platform-managed-keys), as well as [customer-managed keys](../virtual-machines/disk-encryption.md#customer-managed-keys) owned and managed by you. In addition, you can also back up your Azure Virtual machines that have their OS or data disks encrypted using [Azure Disk Encryption](backup-azure-vms-encryption.md#encryption-support-using-ade). ADE uses BitLocker for Windows VMs, and DM-Crypt for Linux VMs, to perform in-guest encryption.  <br><br>  - **TDE - enabled database backup is supported**. To restore a TDE-encrypted database to another SQL Server, you need to first [restore the certificate to the destination server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server). The backup compression for TDE-enabled databases for SQL Server 2016 and newer versions is available, but at lower transfer size as explained [here](https://techcommunity.microsoft.com/t5/sql-server/backup-compression-for-tde-enabled-databases-important-fixes-in/ba-p/385593). |

## Next steps

- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
- [Azure Backup FAQ](./backup-azure-backup-faq.yml) for any questions you may have about encryption
