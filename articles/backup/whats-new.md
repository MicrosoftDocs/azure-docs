---
title: What's new in the Azure Backup service
description: Learn about the new features in the Azure Backup service.
ms.topic: release-notes
ms.date: 11/20/2025
ms.service: azure-backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to stay informed about new features and enhancements in Azure Backup, so that I can effectively manage data protection and ensure compliance within my organization's cloud infrastructure."
---

# What's new in Azure Backup

Azure Backup is constantly improving and releasing new features that enhance the protection of your data in Azure. These new features expand your data protection to new workload types, enhance security, and improve the availability of your backup data. They also add new management, monitoring, and automation capabilities.

You can learn more about the new releases by bookmarking this page or by [subscribing to updates here](https://azure.microsoft.com/updates/?query=backup).

## Updates summary

- November 2025
  - [Threat detection in Azure Backup with Microsoft Defender for Cloud integration (preview)](#threat-detection-in-azure-backup-with-microsoft-defender-for-cloud-integration-preview)
  - [Vaulted backup support for Azure Data Lake storage is now generally available](#vaulted-backup-support-for-azure-data-lake-storage-is-now-generally-available)
- September 2025
  - [Vaulted backup support for Azure Files (Premium) is now generally available](#vaulted-backup-support-for-azure-files-premium-is-now-generally-available)
- July 2025
  - [Agentless multi-disk crash-consistent backups for Azure VMs is now generally available](#agentless-multi-disk-crash-consistent-backups-for-azure-vms-is-now-generally-available)
- June 2025
  - [Migration of Azure VM backups from Standard to Enhanced policy is now generally available](#migration-of-azure-vm-backups-from-standard-to-enhanced-policy-is-now-generally-available)
- May 2025
  - [Operational backup support for Azure Elastic SAN (preview)](#operational-backup-support-for-azure-elastic-san-preview)
  - [Vaulted Backups for Azure Database for PostgreSQL – flexible server is now generally available](#vaulted-backups-for-azure-database-for-postgresql--flexible-server-is-now-generally-available)
  - [Back up SAP ASE (Sybase) database is now generally available](#back-up-sap-ase-sybase-database-is-now-generally-available)

- April 2025
  - [Vaulted backup support for  Azure Data Lake Storage (preview)](#vaulted-backup-support-for-azure-data-lake-storage-preview)
- March 2025
  - [Vaulted backup support for Azure Files is now generally available](#vaulted-backup-support-for-azure-files-is-now-generally-available)

- February 2025
  - [Azure Backup for Azure Database for PostgreSQL – Flexible Server is now generally available](#azure-backup-for-azure-database-for-postgresql--flexible-server-is-now-generally-available)
- November 2024
  - [Secure by Default with Vault soft delete (preview)](#secure-by-default-with-vault-soft-delete-preview)
  - [WORM enabled Immutable Storage for Recovery Services vaults is now generally available](#worm-enabled-immutable-storage-for-recovery-services-vaults-is-now-generally-available)
  - [Cross Subscription Backup support for Azure File Share (preview)](#cross-subscription-backup-support-for-azure-file-share-preview)
  - [Back up SAP ASE (Sybase) database (preview)](#back-up-sap-ase-sybase-database-preview)   
  - [Vaulted backup and Cross Region Restore support for AKS is now generally available](#vaulted-backup-and-cross-region-restore-support-for-aks-is-now-generally-available) 
- October 2024
    - [GRS and CRR support for Azure VMs using Premium SSD v2 and Ultra Disk is now generally available.](#grs-and-crr-support-for-azure-vms-using-premium-ssd-v2-and-ultra-disk-is-now-generally-available)
    - [Back up Azure VMs with Extended Zones](#back-up-azure-vms-with-extended-zones-preview)
- July 2024
  - [Azure Blob vaulted backup is now generally available](#azure-blob-vaulted-backup-is-now-generally-available)
  - [Backup and restore of virtual machines with private endpoint enabled disks is now Generally Available](#backup-and-restore-of-virtual-machines-with-private-endpoint-enabled-disks-is-now-generally-available)
- May 2024
  - [Migration of Azure VM backups from standard to enhanced policy (preview)](#migration-of-azure-vm-backups-from-standard-to-enhanced-policy-preview)
- March 2024
  - [Agentless multi-disk crash-consistent backups for Azure VMs (preview)](#agentless-multi-disk-crash-consistent-backups-for-azure-vms-preview)
  - [Azure Files vaulted backup (preview)](#azure-files-vaulted-backup-preview)
  - [Support for long-term Retention for Azure Database for MySQL - Flexible Server (preview)](#support-for-long-term-retention-for-azure-database-for-mysql---flexible-server-preview)
- January 2024
  - [Cross Region Restore support for PostgreSQL by using Azure Backup is now generally available](#cross-region-restore-support-for-postgresql-by-using-azure-backup-is-now-generally-available)


## Threat detection in Azure Backup with Microsoft Defender for Cloud integration (preview)

Azure Backup now integrates with Microsoft Defender for Cloud to deliver advanced threat detection for Azure Virtual Machine backups. This feature proactively identifies compromised restore points, validates snapshot health using Defender scans, and helps you recover faster by locating clean restore points during a ransomware attack. The feature works seamlessly with [Microsoft Defender for Servers Plan 1 and Plan 2](/azure/defender-for-cloud/defender-for-servers-overview). You can manage threat detection for Azure VM backups using Vault properties or [Resiliency](../resiliency/resiliency-overview.md).

For more information, see [About Threat Detection for Azure VM Backups (preview)](threat-detection-overview.md).

## Vaulted backup support for Azure Data Lake storage is now generally available 

Azure Backup allows you to create vaulted backups for [hierarchical namespace](../storage/blobs/data-lake-storage-namespace.md)-enabled storage accounts, which protect your data from ransomware attacks and malicious or accidental deletions. You can define backup schedules to generate recovery points and set retention policies to keep backups in the vault for up to **10 years**.

The backup data is stored in the [Backup vault](backup-vault-overview.md) that gives you an offsite copy for long-term protection. If the source account loses data, you can restore it to an alternate account and regain access quickly. You can also manage backups at scale using [Resiliency](../business-continuity-center/business-continuity-center-overview.md) and monitor them using Azure Backup’s advanced alerting and reporting capabilities.

For more information, see [About Azure Data Lake Storage vaulted backup](azure-data-lake-storage-backup-overview.md).

## Vaulted backup support for Azure Files (Premium) is now generally available

Azure Backup now supports vaulted backup File Shares in standard storage accounts to protect against ransomware and data loss. You can define backup schedules and retention settings to store data in the Backup vault for up to **10 years**.

For more information, see [Overview of Azure Files backup](azure-file-share-backup-overview.md).

## Agentless multi-disk crash-consistent backups for Azure VMs is now generally available

Azure Backup now supports agentless VM backups by using multi-disk crash-consistent restore points. Crash consistent backups are OS agnostic, do not require any agent, and quiesce VM I/O for a shorter period compared to application or file-system consistent backups for performance sensitive workloads.

For more information, see [About agentless multi-disk crash-consistent backup for Azure VMs](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md).

## Migration of Azure VM backups from Standard to Enhanced policy is now generally available

Azure Backup now supports migrating VM backups (protected with Standard policy) to the Enhanced policy, offering greater flexibility and resilience.

This feature includes:

- Scheduling multiple backups per day (up to every 4 hours).
- Retaining snapshots for extended durations.
- Ensuring multi-disk crash consistency for VM backups.
- Providing zonally resilient snapshot-tier recovery points.
- Enabling seamless migration of VMs to Trusted Launch, and using Premium SSD v2 and Ultra disks for the VMs without disrupting existing backups.
- Migrating protected VMs from Standard policy to Enhanced policy in bulk.

For more information, see [Migrate Azure VM backups from Standard to Enhanced policy](backup-azure-vm-migrate-enhanced-policy.md).

## Operational backup support for Azure Elastic SAN (preview)

Azure Backup now allows secure backup and restoration for Azure Elastic SAN volumes through Azure Backup vault, ensuring seamless data protection. This fully managed solution seamlessly allows you to schedule backups, set expiration timelines for restore points, and restore data to a new volume.

Key features include:

- Protects against accidental deletions, ransomware attacks, and application updates.
- Captures Elastic SAN volumes at specific points in time as independent Managed Disk incremental snapshots with Locally redundant storage (LRS) resiliency.
- Stores up to **450** recovery points, which allows you customize **daily** or **weekly** schedules to align your backup strategy with business continuity and compliance needs.

>[!Note]
>This feature is in preview and [available in specific Azure regions](azure-elastic-storage-area-network-backup-support-matrix.md#supported-regions).

For more information, see [About Azure Elastic SAN backup (preview)](azure-elastic-storage-area-network-backup-overview.md).

## Vaulted Backups for Azure Database for PostgreSQL – flexible server is now generally available

Azure Backup now supports vaulted backup for PostgreSQL Flexible Server across all Azure regions, offering a robust and scalable backup solution designed to meet the resiliency and compliance needs of enterprises.

**Key Features include**:

- **Policy-based scheduled backups**: Eliminates manual intervention and increases efficiency.
- **Long-term retention**: Ensures long-term retention of backups upto 10 years for regulatory and compliance requirements.
- **Cyber resiliency**: Protects from ransomware threats with immutability and role-based access control.
 
You can  also use Azure [Business Continuity Center](https://ms.portal.azure.com/#view/Microsoft_Azure_BCDRCenter/AbcCenterMenuBlade/~/overview) to manage the vaulted backup operations.

For more information, see [Azure Backup for PostgreSQL Flexible Server overview](backup-azure-database-postgresql-flex-overview.md). 

## Back up SAP ASE (Sybase) database is now generally available

Azure Backup now supports SAP ASE (Sybase) database backups on Azure VMs. Backups stream directly to managed Recovery Services vault of Azure Backup, ensuring security with [Immutability](backup-azure-immutable-vault-concept.md?tabs=recovery-services-vault), [Soft Delete](backup-azure-security-feature-cloud.md?tabs=azure-portal), [Multiuser Authorization](multi-user-authorization-concept.md?tabs=recovery-services-vault), and [Customer Managed Key (CMK)](encryption-at-rest-with-cmk.md?tabs=portal). Data is stored in a Microsoft-managed subscription, isolating it from user environments for enhanced protection.

With stream-based backup, log backups can occur every **15 minutes**, enabling **Point-In-Time recovery**. Restore options include Alternate Location Restore, Original Location Restore, and Restore as Files.

Azure Backup also offers cost-effective policies (weekly full + daily differential) to reduce storage costs, alongside [Multi-SID](sap-hana-backup-support-matrix.md#support-for-azure-backup-multiple-components-on-one-system-mcos) and [Cross Subscription Restore (CSR)](sap-ase-database-about.md#cross-subscription-restore-for-sap-ase-sybase-database) support. [Azure Business Continuity Center](../business-continuity-center/business-continuity-center-overview.md) enables protection, monitoring, and alert configuration for SAP ASE backups.

For more information, see [Back up SAP ASE (Sybase) database](sap-ase-database-about.md).

## Vaulted backup support for Azure Data Lake Storage (preview)

Azure Backup now supports vaulted backups for block blob data in Azure Data Lake Storage ([hierarchical namespace](/azure/storage/blobs/data-lake-storage-namespace) enabled storage account), enhancing data protection against ransomware and accidental loss. You can schedule backups, set retention policies, and store recovery points securely in the Backup vault for up to **10 years**. If there is data loss in the source storage account, you can  restore to an alternate account. Security features such as [Immutable vault](backup-azure-immutable-vault-concept.md?tabs=backup-vault) and [Soft delete](backup-azure-security-feature-cloud.md) protect your backup data.

>[!Note]
>- This feature is currently in limited preview and is available in specific regions only. See the [supported regions](azure-data-lake-storage-backup-support-matrix.md#supported-regions).
>- To enroll in this preview feature, fill [this signup form](https://forms.office.com/r/sixidTkYb4)  and write to [AskAzureBackupTeam@microsoft.com](mailto:AskAzureBackupTeam@microsoft.com).

For more information, see [Overview of Azure Data Lake Storage backup (preview)](azure-data-lake-storage-backup-overview.md).

## Vaulted backup support for Azure Files is now generally available

Azure Backup now supports vaulted backup File Shares in standard storage accounts to protect against ransomware and data loss. You can define backup schedules and retention settings to store data in the Backup vault for up to 10 years.

Vaulted backups provide an offsite copy of your data. If there is data loss on the source account, you can restore it to an alternate account. You can manage vaulted backups at scale via Azure Business Continuity Center and monitor them using Azure Backup's alerting and reporting features.

We recommend switching from snapshot backups to vaulted backups for comprehensive protection against data loss.

For more information, see [Overview of Azure Files backup](azure-file-share-backup-overview.md?tabs=vault-standard).
## Azure Backup for Azure Database for PostgreSQL – Flexible Server is now generally available

Azure Backup now provides improved backup and restore processes, reduced downtime, and increased efficiency for Azure Database for PostgreSQL - Flexible Server. This feature is generally available in the following regions: East Asia, Central India, Southeast Asia, UK South, and UK West. However, this feature is currently in preview for other regions. You can manage the protection of the database by using the [Azure Business Continuity Center](../business-continuity-center/business-continuity-center-overview.md) in the Azure portal.

The robust, scalable backup solution for Azure Database for PostgreSQL – Flexible Server allows you to meet  the needs of enterprises and developers alike, emphasizing comprehensive data protection and management.

This release includes the following key features:

- **Managed Service**: Ensures safety and integrity of PostgreSQL servers.
- **Automated Backups**: Policy-based management eliminates manual intervention.
- **Long-term Retention**: Meets regulatory and compliance requirements.
- **Cyber Resiliency**: Features immutability for enhanced protection.
- **High Performance**: Built on Azure's scalable infrastructure.
- **Strong Security**: Encryption at rest and in transit.

For more information, see [Azure Backup for PostgreSQL Flexible Server overview](backup-azure-database-postgresql-flex-overview.md).

## Secure by Default with Vault soft delete (preview)
 
Azure Backup now provides the **Secure By default with Vault soft delete (preview)** feature that applies soft delete by default at all granularities - vaults, recovery points, containers and backup items. Azure Backup now ensures that all the backup data is recoverable against ransomware attacks by default and has no cost for *14 days*. You don't need to opt in to get *fair* security level for your backup data. You can update the soft delete retention period as per your preference up to *180 days*.

Soft delete provides data recoverability from malicious or accidental deletions and is enabled by default for all vaults. To make soft delete irreversible, you can use **always-on** soft delete.

For more information, see [Secure by Default with Azure Backup (Preview)](secure-by-default.md).

## WORM enabled Immutable Storage for Recovery Services vaults is now generally available

Azure Backup now provides immutable WORM storage for your backups when immutability is enabled and locked on a Recovery Services vault. When immutability is enabled, Azure Backup ensures that a Recovery Point, once created, can't be deleted or have  its retention period reduced before its intended expiry. 

When immutability is locked, Azure Backup also uses WORM-enabled immutable storage to meet any compliance requirements. This feature is applicable to both existing and new vaults with locked immutability. WORM immutability is available in [these regions](backup-azure-immutable-vault-concept.md#supported-scenarios-for-worm-storage). 

For more information, see [About Immutable vault for Azure Backup](backup-azure-immutable-vault-concept.md).

## Cross Subscription Backup support for Azure File Share (preview)

Azure Backup now supports Cross Subscription Backup (CSB) for Azure File Shares (preview), allowing you to back up data across different subscriptions within the same tenant or Microsoft Entra ID. This capability offers greater flexibility and control, essentially for enterprises managing multiple subscriptions with varying purposes and security policies.

For more information, see [About Azure File share backup](azure-file-share-backup-overview.md#how-cross-subscription-backup-for-azure-files-works).

## Back up SAP ASE (Sybase) database (preview)

Azure Backup now allows you backing up SAP Adaptive Server Enterprise (ASE) (Sybase) databases running on Azure VMs. All backups are streamed directly to the Azure Backup managed recovery services vault that provides security capabilities like Immutability, Soft Delete and Multiuser Authorization. The vaulted backup data is stored in Microsoft-managed Azure subscription, thus isolating the backups from user's environment. These features ensure that the SAP ASE backup data is always secure and can be recovered safely even if the source machines are compromised.

For stream-based backup, Azure Backup can stream log backups in every **15 minutes**. You can enable this feature in addition to the database backup, which provides **Point-In-Time recovery** capability. Azure Backup also offers **Multiple Database Restore** capabilities such as **Alternate Location Restore** (System refresh), **Original Location Restore**, and **Restore as Files**.
 
Azure Backup also offers cost-effective Backup policies (Weekly full + daily differential backups), which result in lower storage cost.

For more information, see [Back up SAP ASE (Sybase) database (preview)](sap-ase-database-about.md).

## Vaulted backup and Cross Region Restore support for AKS is now generally available
 
Azure Backup supports storing AKS backups offsite, which is protected against tenant compromise, malicious attacks and ransomware threats. Along with backup stored in a vault, you can also use the backups in a regional disaster scenario and recover backups.

Once the feature is enabled, your snapshot-based AKS backups stored in Operational Tier are converted into blobs and moved to a Vault-standard tier outside of your tenant. You can enable/disable this feature by updating the retention rules of your backup policy. This feature also allows you to back up data for long term storage as per the compliance and regulatory requirements. With this feature, you can also enable a Backup vault to be *Globally redundant* with *Cross Region Restore*, and then your vaulted backups will be available in an Azure Paired region for restore. In case of primary region outage, you can use these backups to restore your AKS clusters in a secondary region.

For more information, see [Overview of AKS backup](azure-kubernetes-service-backup-overview.md).

## GRS and CRR support for Azure VMs using Premium SSD v2 and Ultra Disk is now generally available.

Azure Backup now supports backup of Azure VMs using Premium SSD v2 and Ultra disk on GRS vaults and performs Cross-Region Restore (CRR). With Geo-redundant storage (GRS) and cross-region restore support, you can protect your virtual machines from data loss during a disaster and perform periodic audits by restoring data on demand in the secondary region.

>[!Note]
>Premium SSD v2 offering provides the most advanced block storage solution designed for a broad range of IO-intensive enterprise production workloads that require sub-millisecond disk latencies as well as high IOPS and throughput — at a low cost.

For more information, see the [VM backup support matrix for the supported features and region availability](backup-support-matrix-iaas.md#vm-storage-support).


## Back up Azure VMs with Extended Zones (preview)

Azure Backup now enables you to back up your Azure virtual machines in the [Azure Extended Zones](../extended-zones/overview.md). Azure Extended Zones offer enhanced resiliency by distributing resources across multiple physical locations within an Azure region. You can back up multiple Azure virtual machines in Azure Extended Zones.

For more information, see [Back up an Azure Virtual Machine in Azure Extended Zones](./backup-azure-vms-enhanced-policy.md).

## Azure Blob vaulted backup is now generally available

Azure Backup now enables you to perform a vaulted backup of block blob data in *general-purpose v2 storage accounts* to protect data against ransomware attacks or source data loss due to malicious or rogue admin. You can define the backup schedule to create recovery points and the retention settings that determine how long backups will be retained in the vault. You can configure and manage the vaulted and operational backups using a single backup policy. 

Under vaulted backups, the data is copied and stored in the Backup vault. So, you get an offsite copy of data that can be retained for up to *10 years*. If any data loss happens on the source account, you can trigger a restore to an alternate account and get access to your data. The vaulted backups can be managed at scale via the Backup center, and monitored via the rich alerting and reporting capabilities offered by the Azure Backup service.

If you're currently using operational backups, we recommend you to switch to vaulted backups for complete protection against different data loss scenarios.

For more information, see [Azure Blob backup overview](blob-backup-overview.md?tabs=vaulted-backup).

## Backup and restore of virtual machines with private endpoint enabled disks is now Generally Available

Azure Backup now allows you to back up the Azure Virtual Machines that use disks with private endpoints (disk access). This support is extended for Virtual Machines that are backed up using Enhanced backup policies, along with the existing support for those that were backed up using Standard backup policies. While initiating the restore operation, you can specify the network access settings required for the restored disks. You can choose to keep the network configuration of the restored disks the same as that of the source disks, specify the access from specific networks only, or allow public access from all networks.
 
For more information, see [Assign network access settings during restore](backup-azure-arm-restore-vms.md#assign-network-access-settings-during-restore).

## Migration of Azure VM backups from standard to enhanced policy (preview)

Azure Backup now supports migration to the enhanced policy for Azure VM backups using standard policy. The migration of VM backups to enhanced policy enables you to schedule multiple backups per day (up to every 4 hours), retain snapshots for longer duration, and use multi-disk crash consistency for Virtual Machine (VM) backups. Snapshot-tier recovery points (created using enhanced policy) are zonally resilient. The migration of VM backups to enhanced policy also allows you to migrate your VMs to Trusted Launch and use Premium SSD v2 and Ultra-disks for the VMs without disrupting the existing backups.

For more information, see [Migrate Azure VM backups from standard  to enhanced policy (preview)](backup-azure-vm-migrate-enhanced-policy.md).

## Agentless multi-disk crash-consistent backups for Azure VMs (preview)

Azure Backup now supports agentless VM backups by using multi-disk crash-consistent restore points (preview). Crash consistent backups are OS agnostic, do not require any agent, and quiesce VM I/O for a shorter period compared to application or file-system consistent backups for performance sensitive workloads.

For more information, see [About agentless multi-disk crash-consistent backup for Azure VMs (preview)](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md).

## Azure Files vaulted backup (preview)

Azure Backup now enables you to perform a vaulted backup of Azure Files to protect data from ransomware attacks or source data loss due to a malicious actor or rogue admin. You can define the schedule and retention of backups by using a backup policy. Azure Backup creates and manages the recovery points as per the schedule and retention defined in the backup policy.

By using vaulted backups, Azure Backup copies and stores data in the Recovery Services vault. This creates an offsite copy of data that you can retain for up to *99 years*. If any data loss occurs on the source account, you can trigger a restore operation to an alternate account and access your data. Additionally, you can use Backup center to manage the vaulted backups at scale and monitor the backup operations by using the rich *Alerting* and *Reporting* capabilities of Azure Backup.

If you're currently using snapshot-based backups, we recommend that you try vaulted backups (preview) for complete protection from different data loss scenarios.

>[!Note]
>Switching to vaulted backups (preview) doesn't lead to loss of the existing snapshots, and they're retained as per the expiry date set in the current backup policy. All future backups will be transferred to the vault as per the schedule and retention set in the modified policy.

For more information, see [Azure Files backup overview](azure-file-share-backup-overview.md?tabs=vault-standard).

## Support for long-term Retention for Azure Database for MySQL - Flexible Server (preview)

[!INCLUDE [Azure Database for MySQL - Flexible Server backup advisory](../../includes/backup-mysql-flexible-server-advisory.md)]

Azure Backup and Azure Database Services provide a new backup solution for the MySQL - Flexible Servers that support retaining backups for up to **10 years**. This feature provides you with access to:

- Comprehensive data protection for different levels of data loss due to  accidental deletions or ransomware attacks.
- Customer controlled scheduled and on-demand backups.
- Isolated backups stored in a separate security and fault domain.
- Long-term retention of backups.
- Centralized monitoring of all backup operations and jobs.

Azure Backup and Azure Database services together help you build an enterprise-class backup solution for Azure MySQL - Flexible Server. You can meet your data protection and compliance needs with a customer-controlled backup policy that enables retention of backups for up to 10 years. This feature allows you to back up the entire MySQL - Flexible Server to long-term Azure Backup vault storage. You  can also restore the backups to your storage account and use the native MySQL tools to re-create the MySQL Server. Currently, you can use the Azure portal to perform the MySQL - Flexible Server database protection operations.

For more information, see [About Azure Database for MySQL - Flexible Server retention for long term (preview)](backup-azure-mysql-flexible-server-about.md).

## Cross Region Restore support for PostgreSQL by using Azure Backup is now generally available

Azure Backup allows you to replicate your backups to an additional Azure paired region by using Geo-redundant Storage (GRS) to protect your backups from regional outages. When you enable the backups with GRS, the backups in the secondary region become accessible only when Microsoft declares an outage in the primary region. However, Cross Region Restore enables you to access and perform restores from the secondary region recovery points even when no outage occurs in the primary region; thus, enables you to perform drills to assess regional resiliency.

For more information, see [Cross Region Restore support for PostgreSQL using Azure Backup](backup-vault-overview.md#cross-region-restore-support-for-postgresql-using-azure-backup).

## Next steps

- [Azure Backup guidance and best practices](guidance-best-practices.md)
- [Archived release notes](backup-release-notes-archived.md)
