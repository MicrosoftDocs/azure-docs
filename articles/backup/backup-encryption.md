---
title: Encryption in Azure Backup
description: Learn how encryption features in Azure Backup help you protect your backup data and meet the security needs of your business.
ms.topic: conceptual
ms.date: 08/04/2020
ms.custom: references_regions 
---

# Encryption in Azure Backup

All your backed-up data is automatically encrypted when stored in the cloud using Azure Storage encryption, which helps you meet your security and compliance commitments. This data at rest is encrypted using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant. In addition to encryption at rest, all your backup data in transit is transferred over HTTPS. It always remains on the Azure backbone network.

## Levels of encryption in Azure Backup

Azure Backup includes encryption on two levels:

- **Encryption of data in the Recovery Services vault**
  - **Using platform-managed keys**: By default, all your data is encrypted using platform-managed keys. You don't need to take any explicit action from your end to enable this encryption. It applies to all workloads being backed up to your Recovery Services vault.
  - **Using customer-managed keys**: When backing up your Azure Virtual Machines, you can choose to encrypt your data using encryption keys owned and managed by you. Azure Backup lets you use your RSA keys stored in the Azure Key Vault for encrypting your backups. The encryption key used for encrypting backups may be different from the one used for the source. The data is protected using an AES 256 based data encryption key (DEK), which is, in turn, protected using your keys. This gives you full control over the data and the keys. To allow encryption, it's required that you grant the Recovery Services vault access to the encryption key in the Azure Key Vault. You can disable the key or revoke access whenever needed. However, you must enable encryption using your keys before you attempt to protect any items to the vault. [Learn more here](encryption-at-rest-with-cmk.md).
  - **Infrastructure-level encryption**: In addition to encrypting your data in the Recovery Services vault using customer-managed keys, you can also choose to have an additional layer of encryption configured on the storage infrastructure. This infrastructure encryption is managed by the platform. Together with encryption at rest using customer-managed keys, it allows two-layer encryption of your backup data. Infrastructure encryption can only be configured if you first choose to use your own keys for encryption at rest. Infrastructure encryption uses platform-managed keys for encrypting data.
- **Encryption specific to the workload being backed up**  
  - **Azure virtual machine backup**: Azure Backup supports backup of VMs with disks encrypted using [platform-managed keys](../virtual-machines/disk-encryption.md#platform-managed-keys), as well as [customer-managed keys](../virtual-machines/disk-encryption.md#customer-managed-keys) owned and managed by you. In addition, you can also back up your Azure Virtual machines that have their OS or data disks encrypted using [Azure Disk Encryption](backup-azure-vms-encryption.md#encryption-support-using-ade). ADE uses BitLocker for Windows VMs, and DM-Crypt for Linux VMs, to perform in-guest encryption.

>[!NOTE]
>Infrastructure encryption is currently in limited preview and is available in US East, US West2, US South Central, US Gov Arizona, and US GOV Virginia regions only. If you wish to use the feature in any of these regions, fill out [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0H3_nezt2RNkpBCUTbWEapUN0VHNEpJS0ZUWklUNVdJSTEzR0hIOVRMVC4u) and email us at [AskAzureBackupTeam@microsoft.com](mailto:AskAzureBackupTeam@microsoft.com).

## Next steps

- [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md)
- [Azure Backup FAQ](/backup-azure-backup-faq.yml#encryption) for any questions you may have about encryption