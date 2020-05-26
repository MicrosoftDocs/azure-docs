---
title: Encryption in Azure Backup
description: Learn about how encryption features in Azure Backup help you protect your backup data and meet the security needs of your business.
ms.topic: conceptual
ms.date: 04/30/2020
---

# Encryption in Azure Backup

All your backed-up data is automatically encrypted when stored in the cloud using Azure Storage encryption, which helps you meet your security and compliance commitments. This data at rest is encrypted using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant.

In addition to encryption at rest, all your backup data in transit is transferred over HTTPS. It always remains on the Azure backbone network.

For more information, see [Azure Storage encryption for data at rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption). Refer to the [Azure Backup FAQ](https://docs.microsoft.com/azure/backup/backup-azure-backup-faq#encryption) to answer any questions that you may have about encryption.

## Encryption of backup data using platform-managed keys

By default, all your data is encrypted using platform-managed keys. You don't need to take any explicit action from your end to enable this encryption and it applies to all workloads being backed up to your Recovery Services vault.

## Encryption of backup data using customer-managed keys

When backing up your Azure Virtual Machines, you can now encrypt your data using keys owned and managed by you. Azure Backup lets you use your RSA keys stored in the Azure Key Vault for encrypting your backups. The encryption key used for encrypting backups may be different from the one used for the source. The data is protected using an AES 256 based data encryption key (DEK), which is, in turn, protected using your keys. This gives you full control over the data and the keys. To allow encryption, it's required that the Recovery Services vault be granted access to the encryption key in the Azure Key Vault. You can disable the key or revoke access whenever needed. However, you must enable encryption using your keys before you attempt to protect any items to the vault.

>[!NOTE]
>This feature is currently in limited availability. Please fill out [this survey](https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0H3_nezt2RNkpBCUTbWEapURE9TTDRIUEUyNFhNT1lZS1BNVDdZVllHWi4u) and email us at AskAzureBackupTeam@microsoft.com if you wish to encrypt your backup data using customer managed keys. Note that the ability to use this feature is subject to approval from the Azure Backup service.

## Backup of managed disk VMs encrypted using customer-managed keys

Azure Backup also allows you back up your Azure VMs that use your key for server-side encryption. The key used for encrypting the disks is stored in the Azure Key Vault and managed by you. Server-side encryption using customer-managed keys differs from Azure Disk Encryption, since ADE leverages BitLocker (for Windows) and DM-Crypt (for Linux) to perform in-guest encryption, SSE encrypts data in the storage service, enabling you to use any OS or images for your VMs. Refer to [Encryption of managed disks with customer managed keys](https://docs.microsoft.com/azure/virtual-machines/windows/disk-encryption#customer-managed-keys) for more details.

## Backup of VMs encrypted using ADE

With Azure Backup, you can also back up your Azure Virtual machines that have their OS or data disks encrypted using Azure Disk Encryption. ADE uses BitLocker for Windows VMs and DM-Crypt for Linux VMs to perform in-guest encryption. For details, see [Back up and restore encrypted virtual machines with Azure Backup](https://docs.microsoft.com/azure/backup/backup-azure-vms-encryption).

## Next steps

- [Back up and restore an encrypted Azure VM](backup-azure-vms-encryption.md)
