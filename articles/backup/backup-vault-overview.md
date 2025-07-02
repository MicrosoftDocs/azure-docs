---
title: Overview of the Backup vaults
description: An overview of Backup vaults.
ms.topic: overview
ms.date: 06/23/2025
ms.custom: references_regions
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: As a backup administrator, I want to utilize Backup vaults to manage and secure my backup data across various Azure services, so that I can ensure data integrity, facilitate easy recovery, and minimize management overhead in our cloud environment.
---
# Backup vaults overview

This article describes the features of a Backup vault. A Backup vault is a storage entity in Azure that houses backup data for certain newer workloads that Azure Backup supports. You can use Backup vaults to hold backup data for various Azure services, such as Azure Blob, Azure Database for PostgreSQL servers and newer workloads that Azure Backup will support. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Learn about the [types of vault supported for backup and restore](/azure/backup/backup-azure-backup-faq#what-are-the-various-vaults-supported-for-backup-and-restore-).

## Key features

Backup vaults are based on the Azure Resource Manager model of Azure, which provides features such as:

- **Enhanced capabilities to help secure backup data**: With Backup vaults, Azure Backup provides security capabilities to protect cloud backups. The security features ensure you can secure your backups, and safely recover data, even if production and backup servers are compromised. [Learn more](backup-azure-security-feature.md)

- **Azure role-based access control (Azure RBAC)**: Azure RBAC provides fine-grained access management control in Azure. [Azure provides various built-in roles](../role-based-access-control/built-in-roles.md), and Azure Backup has three [built-in roles to manage recovery points](backup-rbac-rs-vault.md). Backup vaults are compatible with Azure RBAC, which restricts backup and restore access to the defined set of user roles. [Learn more](backup-rbac-rs-vault.md)

- **Data isolation**: With Azure Backup, the vaulted backup data is stored in Microsoft-managed Azure subscription and tenant. External users or guests have no direct access to this backup storage or its contents, which ensures the isolation of backup data from the production environment where the data source resides. This robust approach ensures that even in a compromised environment, existing backups can't be tampered or deleted by unauthorized users.

- **Central monitoring of the V2 workloads**: With Backup Vault you can monitor all your V2 workloads from Backup jobs to alerts. Reporting capabilities for the same is available in the Azure Business Continuity Center.

## Storage settings in the Backup vault

A Backup vault is an entity that stores the backups and recovery points created over time. The Backup vault also contains the backup policies that are associated with the protected resources.

- Azure Backup automatically handles storage for the vault. Choose the storage redundancy that matches your business needs when creating the Backup vault.

- To learn more about storage redundancy, see these articles on [geo](../storage/common/storage-redundancy.md#geo-redundant-storage), [zonal](../storage/common/storage-redundancy.md#zone-redundant-storage), and [local](../storage/common/storage-redundancy.md#locally-redundant-storage) redundancy.

## Encryption settings in the Backup vault

This section discusses the options available for encrypting your backup data stored in the Backup vault. Azure Backup service uses the **Backup Management Service** app to access Azure Key Vault, but not the managed identity of the Backup vault.


### Encryption of backup data using platform-managed keys

Azure Backup provides you two options (**Microsoft managed keys** and **Customer Managed keys**) to manage the backup data encryption for your Backup vault. By default, all your data is encrypted using Microsoft managed keys. Azure Backup uses the Backup Management Service app to access Azure Key Vault, but not the managed identity of the Backup vault.

You can fetch your own keys to encrypt the backup data by using the **Customer Managed Keys** option under **Encryption settings** on the *Backup vault*.

### Role-Based Access Control (RBAC) in Backup vault

Backup vaults provide a robust Role-Based Access Control (RBAC) mechanism that not only governs who can access a Backup vault and what operations they can perform, but also enables fine-grained control over which individual workloads the vault can access and to what extent. This includes access to Azure resources such as Azure Disks or PostgreSQL servers to be backed up and Key Vaults used for encryption key management.

RBAC is enforced through Managed Identities associated with the Backup vault. Specific roles can be assigned to these identities to grant the required access. Backup vaults support two types of managed identities:

- **System Assigned Managed Identity:** This identity is automatically created when the Backup vault is provisioned and is tied to the lifecycle of the vault. You have the option to disable this identity if needed.

- **User Assigned Managed Identity:** This is an independent Azure resource that can be assigned to one or more Backup vaults. Once assigned, any roles granted to this identity apply to the vault as well. The lifecycle of a user-assigned managed identity is decoupled from the vault, providing greater flexibility. Multiple user-assigned identities can be associated with a single Backup vault.

These identities ensure secure and manageable access control, enabling Backup vaults to operate with the least privilege necessary while aligning with organizational security policies.

## Cross Region Restore support for PostgreSQL using Azure Backup

Azure Backup allows you to replicate your backups to an additional Azure paired region by using Geo-redundant Storage (GRS)  to protect your backups from regional outages. When you enable the backups with GRS, the backups in the secondary region become accessible only when Microsoft declares an outage in the primary region. However, Cross Region Restore enables you to access and perform restores from the secondary region recovery points even when no outage occurs in the primary region; thus, enables you to perform drills to assess regional resiliency.

Learn [how to perform Cross Region Restore](manage-backup-vault.md#perform-cross-region-restore-using-azure-portal).

>[!Note]
>- Cross Region Restore is now available for PostgreSQL backups protected in Backup vaults. 
>- Backup vaults enabled with Cross Region Restore are automatically charged at [RA-GRS rates](https://azure.microsoft.com/pricing/details/backup/) for the PostgreSQL backups stored in the vault.

## Next steps

- [Create and delete Backup vault](create-manage-backup-vault.md).
- [Manage Backup vault](manage-backup-vault.md).
- [Create a Backup vault using REST API](backup-azure-dataprotection-use-rest-api-create-update-backup-vault.md).