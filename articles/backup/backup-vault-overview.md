---
title: Overview of the Backup vaults
description: An overview of Backup vaults.
ms.topic: conceptual
ms.date: 07/05/2023
ms.custom: references_regions
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Backup vaults overview

This article describes the features of a Backup vault. A Backup vault is a storage entity in Azure that houses backup data for certain newer workloads that Azure Backup supports. You can use Backup vaults to hold backup data for various Azure services, such Azure Database for PostgreSQL servers and newer workloads that Azure Backup will support. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides features such as:

- **Enhanced capabilities to help secure backup data**: With Backup vaults, Azure Backup provides security capabilities to protect cloud backups. The security features ensure you can secure your backups, and safely recover data, even if production and backup servers are compromised. [Learn more](backup-azure-security-feature.md)

- **Azure role-based access control (Azure RBAC)**: Azure RBAC provides fine-grained access management control in Azure. [Azure provides various built-in roles](../role-based-access-control/built-in-roles.md), and Azure Backup has three [built-in roles to manage recovery points](backup-rbac-rs-vault.md). Backup vaults are compatible with Azure RBAC, which restricts backup and restore access to the defined set of user roles. [Learn more](backup-rbac-rs-vault.md)

## Storage settings in the Backup vault

A Backup vault is an entity that stores the backups and recovery points created over time. The Backup vault also contains the backup policies that are associated with the protected resources.

- Azure Backup automatically handles storage for the vault. Choose the storage redundancy that matches your business needs when creating the Backup vault.

- To learn more about storage redundancy, see these articles on [geo](../storage/common/storage-redundancy.md#geo-redundant-storage), [zonal (preview)](../storage/common/storage-redundancy.md#zone-redundant-storage), and [local](../storage/common/storage-redundancy.md#locally-redundant-storage) redundancy.

## Encryption settings in the Backup vault

This section discusses the options available for encrypting your backup data stored in the Backup vault. Azure Backup service uses the **Backup Management Service** app to access Azure Key Vault, but not the managed identity of the Backup vault.


### Encryption of backup data using platform-managed keys

By default, all your data is encrypted using platform-managed keys. You don't need to take any explicit action from your end to enable this encryption. It applies to all workloads being backed up to your Backup vault.

## Cross Region Restore support for PostgreSQL using Azure Backup (preview)

Azure Backup allows you to replicate your backups to an additional Azure paired region by using Geo-redundant Storage (GRS)  to protect your backups from regional outages. When you enable the backups with GRS, the backups in the secondary region become accessible only when Microsoft declares an outage in the primary region. However, Cross Region Restore enables you to access and perform restores from the secondary region recovery points even when no outage occurs in the primary region; thus, enables you to perform drills to assess regional resiliency.

Learn [how to perform Cross Region Restore](create-manage-backup-vault.md#perform-cross-region-restore-using-azure-portal-preview).

>[!Note]
>- Cross Region Restore is now available for PostgreSQL backups protected in Backup vaults. 
>- Backup vaults enabled with Cross Region Restore will be automatically charged at [RA-GRS rates](https://azure.microsoft.com/pricing/details/backup/) for the PostgreSQL backups stored in the vault once the feature is generally available.

## Next steps

- [Create and manage Backup vault](create-manage-backup-vault.md)
