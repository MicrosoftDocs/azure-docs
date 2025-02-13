---
title: What's new in the Azure Backup service
description: Learn about the new features in the Azure Backup service.
ms.topic: release-notes
ms.date: 11/21/2024
ms.service: azure-backup
ms.custom:
  - ignite-2023
author: jyothisuri
ms.author: jsuri
---

# What's new in Azure Backup

Azure Backup is constantly improving and releasing new features that enhance the protection of your data in Azure. These new features expand your data protection to new workload types, enhance security, and improve the availability of your backup data. They also add new management, monitoring, and automation capabilities.

You can learn more about the new releases by bookmarking this page or by [subscribing to updates here](https://azure.microsoft.com/updates/?query=backup).

## Updates summary

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
- December 2023
  - [Vaulted backup and Cross Region Restore for support for AKS (preview)](#vaulted-backup-and-cross-region-restore-for-support-for-aks-preview)
- November 2023
  - [Encryption using Customer Managed Keys for Backup vaults (preview)](#encryption-using-customer-managed-keys-for-backup-vaults-preview)
  - [Back up Azure Database for PostgreSQL-Flexible server (preview)](#back-up-azure-database-for-postgresql-flexible-server-preview)
  - [Azure Kubernetes Service backup is now generally available](#azure-kubernetes-service-backup-is-now-generally-available)
  - [Manage protection of datasources using Azure Business Continuity center (preview)](#manage-protection-of-datasources-using-azure-business-continuity-center-preview)
  - [Save your MARS backup passphrase securely to Azure Key Vault is now generally available.](#save-your-mars-backup-passphrase-securely-to-azure-key-vault-is-now-generally-available)
  - [Update Rollup 1 for Microsoft Azure Backup Server v4 is now generally available](#update-rollup-1-for-microsoft-azure-backup-server-v4-is-now-generally-available)
  - [SAP HANA instance snapshot backup support is now generally available](#sap-hana-instance-snapshot-backup-support-is-now-generally-available)
- September 2023
  - [Multi-user authorization using Resource Guard for Backup vault is now generally available](#multi-user-authorization-using-resource-guard-for-backup-vault-is-now-generally-available)
  - [Enhanced soft delete for Azure Backup is now generally available](#enhanced-soft-delete-for-azure-backup-is-now-generally-available)
  - [Support for selective disk backup with enhanced policy for Azure VM is now generally available](whats-new.md#support-for-selective-disk-backup-with-enhanced-policy-for-azure-vm-is-now-generally-available)
- August 2023
  - [Save your MARS backup passphrase securely to Azure Key Vault (preview)](#save-your-mars-backup-passphrase-securely-to-azure-key-vault-preview)
  - [Cross Region Restore for MARS Agent (preview)](#cross-region-restore-for-mars-agent-preview)
- July 2023
  - [SAP HANA System Replication database backup support is now generally available](#sap-hana-system-replication-database-backup-support-is-now-generally-available)
  - [Cross Region Restore for PostgreSQL (preview)](#cross-region-restore-for-postgresql-preview)
- April 2023
  - [Microsoft Azure Backup Server v4 is now generally available](#microsoft-azure-backup-server-v4-is-now-generally-available)
- March 2023
  - [Multiple backups per day for Azure VMs is now generally available](#multiple-backups-per-day-for-azure-vms-is-now-generally-available)
  - [Immutable vault for Azure Backup is now generally available](#immutable-vault-for-azure-backup-is-now-generally-available)
  - [Support for selective disk backup with enhanced policy for Azure VM (preview)](whats-new.md#support-for-selective-disk-backup-with-enhanced-policy-for-azure-vm-is-now-generally-available)
  - [Azure Kubernetes Service backup (preview)](#azure-kubernetes-service-backup-preview)
  - [Azure Blob vaulted backups (preview)](#azure-blob-vaulted-backups-preview)
- October 2022
  - [Multi-user authorization using Resource Guard for Backup vault (in preview)](#multi-user-authorization-using-resource-guard-for-backup-vault-in-preview)
  - [Enhanced soft delete for Azure Backup (preview)](#enhanced-soft-delete-for-azure-backup-preview)
  - [Immutable vault for Azure Backup (in preview)](#immutable-vault-for-azure-backup-in-preview)
  - [SAP HANA instance snapshot backup support (preview)](#sap-hana-instance-snapshot-backup-support-preview)
  - [SAP HANA System Replication database backup support (preview)](#sap-hana-system-replication-database-backup-support-preview)
- September 2022
  - [Built-in Azure Monitor alerting for Azure Backup is now generally available](#built-in-azure-monitor-alerting-for-azure-backup-is-now-generally-available)
- June 2022
  - [Multi-user authorization using Resource Guard for Recovery Services vault is now generally available](#multi-user-authorization-using-resource-guard-for-recovery-services-vault-is-now-generally-available)
- May 2022
  - [Archive tier support for Azure Virtual Machines is now generally available](#archive-tier-support-for-azure-virtual-machines-is-now-generally-available)
- February 2022
  - [Multiple backups per day for Azure Files is now generally available](#multiple-backups-per-day-for-azure-files-is-now-generally-available)
- January 2022
  - [Back up Azure Database for PostgreSQL is now generally available](#back-up-azure-database-for-postgresql-is-now-generally-available)
- October 2021
  - [Archive Tier support for SQL Server/ SAP HANA in Azure VM from Azure portal](#archive-tier-support-for-sql-server-sap-hana-in-azure-vm-from-azure-portal)
  - [Multi-user authorization using Resource Guard for Recovery Services vault (in preview)](#multi-user-authorization-using-resource-guard-for-recovery-services-vault-in-preview)
  - [Multiple backups per day for Azure Files (in preview)](#multiple-backups-per-day-for-azure-files-in-preview)
  - [Azure Backup Metrics and Metrics Alerts (in preview)](#azure-backup-metrics-and-metrics-alerts-in-preview)
- July 2021
  - [Archive Tier support for SQL Server in Azure VM for Azure Backup is now generally available](#archive-tier-support-for-sql-server-in-azure-vm-for-azure-backup-is-now-generally-available)
- May 2021
  - [Backup for Azure Blobs is now generally available](#backup-for-azure-blobs-is-now-generally-available)
- April 2021
  - [Enhancements to encryption using customer-managed keys for Azure Backup (in preview)](#enhancements-to-encryption-using-customer-managed-keys-for-azure-backup-in-preview)
- March 2021
  - [Azure Disk Backup is now generally available](#azure-disk-backup-is-now-generally-available)
  - [Backup center is now generally available](#backup-center-is-now-generally-available)
  - [Archive Tier support for Azure Backup (in preview)](#archive-tier-support-for-azure-backup-in-preview)
- February 2021
  - [Backup for Azure Blobs (in preview)](#backup-for-azure-blobs-in-preview)

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

For more information, see [About Azure File share backup](azure-file-share-backup-overview.md#how-cross-subscription-backup-for-azure-file-share-preview-works).

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

Azure Backup now supports migration to the enhanced policy for Azure VM backups using standard policy. The migration of VM backups to enhanced policy enables you to schedule multiple backups per day (up to every 4 hours), retain snapshots for longer duration, and use multi-disk crash consistency for VM backups. Snapshot-tier recovery points (created using enhanced policy) are zonally resilient. The migration of VM backups to enhanced policy also allows you to migrate your VMs to Trusted Launch and use Premium SSD v2 and Ultra-disks for the VMs without disrupting the existing backups.

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

## Vaulted backup and Cross Region Restore for support for AKS (preview)
 
Azure Backup supports storing AKS backups offsite, which is protected against tenant compromise, malicious attacks and ransomware threats. Along with backup stored in a vault, you can also use the backups in a regional disaster scenario and recover backups.

Once the feature is enabled, your snapshot-based AKS backups stored in Operational Tier are converted into blobs and moved to a Vault-standard tier outside of your tenant. You can enable/disable this feature by updating the retention rules of your backup policy. This feature also allows you to back up data for long term storage as per the compliance and regulatory requirements. With this feature, you can also enable a Backup vault to be *Globally redundant* with *Cross Region Restore*, and then your vaulted backups will be available in an Azure Paired region for restore. In case of primary region outage, you can use these backups to restore your AKS clusters in a secondary region.

For more information, see [Overview of AKS backup](azure-kubernetes-service-backup-overview.md).

## Encryption using Customer Managed Keys for Backup vaults (preview)

Azure Backup Vault now allows you to encrypt your backup data using customer-managed keys (CMK) instead of using platform-managed keys, which are enabled by default. This feature enables you to control data access using the key and Key Vault you provide.

For more information, see [Encryption of backup data in the Backup vault using customer-managed keys (preview)](encryption-at-rest-with-cmk-for-backup-vault.md).

## Back up Azure Database for PostgreSQL-Flexible server (preview) 

Azure Backup and Azure Database services together help you to build an enterprise-class backup solution for Azure PostgreSQL-Flexible server. You can meet your data protection and compliance needs with an end-user-controlled backup policy that enables retention of backups for up to 10 years. 

With this, you can back up the entire PostgreSQL Flexible server to Azure Backup Vault storage. These backups can be restored to a target storage account, and you can use native PostgreSQL tools to re-create the PostgreSQL Server.

For more information, see [Azure Database for PostgreSQL Flexible server (preview)](backup-azure-database-postgresql-flex-overview.md).

## Azure Kubernetes Service backup is now generally available

Azure Kubernetes Service (AKS) backup is a simple, cloud-native process to back up and restore the containerized applications and data running in AKS clusters. You can configure scheduled backup for both cluster state and application data (persistent volumes - CSI driver based Azure Disks). 

The solution provides granular control to choose a specific namespace or an entire cluster to back up or restore with the ability to store backups locally in a blob container and as disk snapshots. With AKS backup, you can unlock end-to-end scenarios - operational recovery, cloning test or developer environments, or cluster upgrade scenarios. 

AKS backup integrates with [Backup center](backup-center-overview.md) (with other backup management capabilities) to provide a single pane of glass that helps you govern, monitor, operate, and analyze backups at scale.

If you're running specialized database workloads in the AKS clusters in containers, you can achieve application consistent backups of those databases with Custom Hooks. Once the backup is complete, you can restore those databases in the original or alternate AKS cluster, in the same or different subscription.

For more information, see [Overview of AKS backup](azure-kubernetes-service-backup-overview.md).

## Manage protection of datasources using Azure Business Continuity center (preview)

You can now also manage Azure Backup protections with Azure Business Continuity (ABC) center. ABC enables you to manage your protection estate across solutions and environments. It provides a unified experience with consistent views, seamless navigation, and supporting information to provide a holistic view of your business continuity estate for better discoverability with the ability to do core activities. 

For more information, see the [supported scenarios of ABC center (preview)](../business-continuity-center/business-continuity-center-support-matrix.md).


## Save your MARS backup passphrase securely to Azure Key Vault is now generally available.

Azure Backup now allows you to save the MARS passphrase to Azure Key Vault automatically from the MARS console during registration or changing passphrase with MARS agent.

The MARS agent from Azure Backup requires a passphrase that you provide to encrypt the backups sent to and stored on Azure Recovery Services vault. This passphrase isn't shared with Microsoft and needs to be saved in a secure location to ensure that the backups can be retrieved if the server backed up with MARS goes down.

For more information, see [Save and manage MARS agent passphrase securely in Azure Key Vault](save-backup-passphrase-securely-in-azure-key-vault.md).

## Update Rollup 1 for Microsoft Azure Backup Server v4 is now generally available

Azure Backup now provides Update Rollup 1 for Microsoft Azure Backup Server (MABS) V4.

- It contains new features, such as item-level recovery from online recovery points for VMware VMs, support for Windows and Basic SMTP authentication for MABS email reports and alerts, and other enhancements.
- It also contains stability improvements and bug fixes on MABS V4.

For more information, see [What's new in MABS](backup-mabs-whats-new-mabs.md).

## SAP HANA instance snapshot backup support is now generally available

Azure Backup now supports SAP HANA instance snapshot backup and enhanced restore, which provides a cost-effective backup solution using managed disk incremental snapshots. Because instant backup uses snapshot, the effect on the database is minimum. 

You can now take an instant snapshot of the entire HANA instance and backup- logs for all databases, with a single solution. It also enables you to do an instant restore of the entire instance with point-in-time recovery using logs over the snapshot.

>[!Note]
>- Currently, the snapshots are stored on your storage account/operational tier and isn't stored in Recovery Services vault.
>- Original Location Restore (OLR) is not supported.
>- For pricing, as per SAP advisory, you must do a *weekly full backup + logs* streaming/Backint based backup so that the existing protected instance fee and storage cost are applied. For snapshot backup, the snapshot data created by Azure Backup is saved in your storage account and incurs snapshot storage charges. Thus, in addition to streaming/Backint backup charges, you're charged for per GB data stored in your snapshots, which is charged separately. Learn more about [Snapshot pricing](https://azure.microsoft.com/pricing/details/managed-disks/) and [Streaming/Backint based backup pricing](https://azure.microsoft.com/pricing/details/backup/?ef_id=_k_CjwKCAjwp8OpBhAFEiwAG7NaEsaFZUxIBD-FH1IUIfF-7yZRWAYJSMHP67InGf0drY0X2Km71KOKDBoCktgQAvD_BwE_k_&amp;OCID=AIDcmmf1elj9v5_SEM__k_CjwKCAjwp8OpBhAFEiwAG7NaEsaFZUxIBD-FH1IUIfF-7yZRWAYJSMHP67InGf0drY0X2Km71KOKDBoCktgQAvD_BwE_k_&amp;gclid=CjwKCAjwp8OpBhAFEiwAG7NaEsaFZUxIBD-FH1IUIfF-7yZRWAYJSMHP67InGf0drY0X2Km71KOKDBoCktgQAvD_BwE). 

For more information, see [Back up databases' instance snapshots](sap-hana-database-about.md#back-up-database-instance-snapshots).

## Multi-user authorization using Resource Guard for Backup vault is now generally available

Azure Backup now supports multi-user authorization (MUA) that allows you to add an additional layer of protection to critical operations on your Backup vaults. For MUA, Azure Backup uses the Azure resource, Resource Guard, to ensure critical operations are performed only with applicable authorization.

For more information, see [MUA for Backup vault](multi-user-authorization-concept.md?tabs=backup-vault).

## Enhanced soft delete for Azure Backup is now generally available

Enhanced soft delete provides improvements to the existing [soft delete](backup-azure-security-feature-cloud.md) feature. With enhanced soft delete, you now get the ability to make soft delete always-on, thus protecting it from being disabled by any malicious actors.

You can also customize soft delete retention period (for which soft deleted data must be retained). Enhanced soft delete is available for Recovery Services vaults and Backup vaults.

>[!Note]
>Once you enable the *always-on* state for soft delete, you can't disable it for that vault.

For more information, see [Enhanced soft delete for Azure Backup](backup-azure-enhanced-soft-delete-about.md).

## Save your MARS backup passphrase securely to Azure Key Vault (preview)

Azure Backup now enables you to save the MARS passphrase to Azure Key Vault automatically from the MARS console during registration or changing passphrase.

The MARS agent from Azure Backup requires a passphrase provided by the user to encrypt the backups sent to and stored on Azure Recovery Services Vault. This passphrase is not shared with Microsoft and needs to be saved in a secure location to ensure that the backups can be retrieved if the server backed up with MARS goes down. 

For more information, see [Save and manage MARS agent passphrase securely in Azure Key Vault](save-backup-passphrase-securely-in-azure-key-vault.md).

## Cross Region Restore for MARS Agent (preview)

You can now restore data from the secondary region for MARS Agent backups using Cross Region Restore on Recovery Services vaults with Geo-redundant storage (GRS) replication. You can use this capability to do recovery drills from the secondary region for audit or compliance. If disasters cause partial or complete unavailability of the primary region, you can directly access the  backup data from the secondary region.

For more information, see [Cross Region Restore for MARS (preview)](about-restore-microsoft-azure-recovery-services.md#cross-region-restore).

## SAP HANA System Replication database backup support is now generally available

Azure Backup now supports backup of HANA database with HANA System Replication. Now, the log backups from the new primary node are accepted immediately; thus provides continuous database automatic protection,

This eliminates the need of manual intervention to continue backups on the new primary node during a failover. With the elimination of the need to trigger full backups for every failover, you can save costs and reduce time for continue protection.

For more information, see [Back up a HANA system with replication enabled](sap-hana-database-about.md#back-up-a-hana-system-with-replication-enabled).

## Cross Region Restore for PostgreSQL (preview)

Azure Backup allows you to replicate your backups to an additional Azure paired region by using Geo-redundant Storage (GRS) to protect your backups from regional outages. When you enable the backups with GRS, the backups in the secondary region become accessible only when Microsoft declares an outage in the primary region.

For more information, see [Cross Region Restore support for PostgreSQL using Azure Backup](backup-vault-overview.md#cross-region-restore-support-for-postgresql-using-azure-backup).

## Microsoft Azure Backup Server v4 is now generally available

Azure Backup now provides Microsoft Azure Backup Server (MABS) v4, the latest edition of on-premises backup solution.

- It can *protect* and *run on* Windows Server 2022, Azure Stack HCI 22H2, vSphere 8.0, and SQL Server 2022.
- It contains stability improvements and bug fixes on *MABS v3 UR2*. 

For more information, see [What's new in MABS](backup-mabs-whats-new-mabs.md).
## Multiple backups per day for Azure VMs is now generally available

Azure Backup now enables you to create a backup policy to take multiple backups a day. With this capability, you can also define the duration in which your backup jobs would trigger and align your backup schedule with the working hours when there are frequent updates to Azure Virtual Machines.

For more information, see [Back up an Azure VM using Enhanced policy](backup-azure-vms-enhanced-policy.md).

## Immutable vault for Azure Backup is now generally available

Azure Backup now supports immutable vaults that help you ensure that recovery points once created can't be deleted before their expiry as per the backup policy (expiry at the time at which the recovery point was created). You can also choose to make the immutability irreversible to offer maximum protection to your backup data, thus helping you protect your data better against various threats, including ransomware attacks and malicious actors.

For more information, see the [concept of Immutable vault for Azure Backup](backup-azure-immutable-vault-concept.md).

## Support for selective disk backup with enhanced policy for Azure VM is now generally available

Azure Backup now provides *Selective Disk backup and restore* capability to Enhanced policy. Using this capability, you can selectively back up a subset of the data disks that are attached to your VM, and then restore a subset of the disks that are available in a recovery point, both from instant restore and vault tier.

This is useful when you:

- Manage critical data in a subset of the VM disks.
- Use database backup solutions and want to back up only their OS disk to reduce cost. 

For more information, see [Selective disk backup and restore](selective-disk-backup-restore.md).

## Azure Kubernetes Service backup (preview)

Azure Kubernetes Service (AKS) backup is a simple, cloud-native process to back up and restore the containerized applications and data running in AKS clusters. You can configure scheduled backup for both cluster state and application data (persistent volumes - CSI driver based Azure Disks). 

The solution provides granular control to choose a specific namespace or an entire cluster to back up or restore with the ability to store backups locally in a blob container and as disk snapshots. With AKS backup, you can unlock end-to-end scenarios - operational recovery, cloning test or developer environments, or cluster upgrade scenarios. 

AKS backup integrates with [Backup center](backup-center-overview.md) (with other backup management capabilities) to provide a single pane of glass that helps you govern, monitor, operate, and analyze backups at scale.

For more information, see [Overview of AKS backup (preview)](azure-kubernetes-service-backup-overview.md).

## Azure Blob vaulted backups (preview)

Azure Backup now enables you to perform a vaulted backup of block blob data in *general-purpose v2 storage accounts* to protect data against ransomware attacks or source data loss due to malicious or rogue admin. You can define the backup schedule to create recovery points and the retention settings that determine how long backups will be retained in the vault. You can configure and manage the vaulted and operational backups using a single backup policy. 

Under vaulted backups, the data is copied and stored in the Backup vault. So, you get an offsite copy of data that can be retained for up to *10 years*. If any data loss happens on the source account, you can trigger a restore to an alternate account and get access to your data. The vaulted backups can be managed at scale via the Backup center, and monitored via the rich alerting and reporting capabilities offered by the Azure Backup service.

If you're currently using operational backups, we recommend you to switch to vaulted backups for complete protection against different data loss scenarios.

For more information, see [Azure Blob backup overview](blob-backup-overview.md).

## Multi-user authorization using Resource Guard for Backup vault (in preview)

Azure Backup now supports multi-user authorization (MUA) that allows you to add an additional layer of protection to critical operations on your Backup vaults. For MUA, Azure Backup uses the Azure resource, Resource Guard, to ensure critical operations are performed only with applicable authorization.

For more information, see [MUA for Backup vault](multi-user-authorization-concept.md?tabs=backup-vault).

## Enhanced soft delete for Azure Backup (preview)

Enhanced soft delete provides improvements to the existing [soft delete](backup-azure-security-feature-cloud.md) feature. With enhanced soft delete, you can now make soft delete irreversible to prevent malicious actors from disabling it and deleting backups.

You can also customize soft delete retention period (for which soft deleted data must be retained). Enhanced soft delete is available for Recovery Services vaults and Backup vaults.

For more information, see [Enhanced soft delete for Azure Backup](backup-azure-enhanced-soft-delete-about.md).

## Immutable vault for Azure Backup (in preview)

Azure Backup now supports immutable vaults that help you ensure that recovery points once created can't be deleted before their expiry as per the backup policy (expiry at the time at which the recovery point was created). You can also choose to make the immutability irreversible to offer maximum protection to your backup data, thus helping you protect your data better against various threats, including ransomware attacks and malicious actors.

For more information, see the [concept of Immutable vault for Azure Backup (preview)](backup-azure-immutable-vault-concept.md).

## SAP HANA instance snapshot backup support (preview)

Azure Backup now supports SAP HANA instance snapshot backup that provides a cost-effective backup solution using Managed disk incremental snapshots. Because instant backup uses snapshot, the effect on the database is minimum. 

You can now take an instant snapshot of the entire HANA instance and backup logs for all databases, with a single solution. It also enables you to instantly restore the entire instance with point-in-time recovery using logs over the snapshot.

For more information, see [Back up databases' instance snapshots (preview)](sap-hana-database-about.md#back-up-database-instance-snapshots).

## SAP HANA System Replication database backup support (preview)

Azure Backup now supports backup of HANA database with HANA System Replication. Now, the log backups from the new primary node are accepted immediately; thus provides continuous database automatic protection,

This eliminates the need of manual intervention to continue backups on the new primary node during a failover. With the elimination of the need to trigger full backups for every failover, you can save costs and reduce time for continue protection.

For more information, see [Back up a HANA system with replication enabled (preview)](sap-hana-database-about.md#back-up-a-hana-system-with-replication-enabled).

## Built-in Azure Monitor alerting for Azure Backup is now generally available

Azure Backup now offers a new and improved alerting solution via Azure Monitor. This solution provides multiple benefits, such as:

- Ability to configure notifications to a wide range of notification channels.
- Ability to select specific scenarios to get notified.
- Ability to manage alerts and notifications programmatically.
- Ability to have a consistent alert management experience for multiple Azure services, including Azure Backup.

If you're currently using the [classic alerts solution](move-to-azure-monitor-alerts.md?tabs=recovery-services-vaults#backup-alerts-in-recovery-services-vault), we recommend you to switch to Azure Monitor alerts. Now, Azure Backup provides a guided experience via Backup center that allows you to switch to built-in Azure Monitor alerts and notifications with a few clicks.

For more information, see [Switch to Azure Monitor based alerts for Azure Backup](move-to-azure-monitor-alerts.md).

## Multi-user authorization using Resource Guard for Recovery Services vault is now generally available
 
Azure Backup now supports multi-user authorization (MUA) that allows you to add an additional layer of protection to critical operations on your Recovery Services vaults. For MUA, Azure Backup uses the Azure resource, Resource Guard, to ensure critical operations are performed only with applicable authorization.

For more information, see [how to protect Recovery Services vault and manage critical operations with MUA](multi-user-authorization.md).

## Archive tier support for Azure Virtual Machines is now generally available

Azure Backup now supports the movement of recovery points to the Vault-archive tier for Azure Virtual Machines from the Azure portal. This allows you to move the archivable/recommended recovery points (corresponding to a backup item) to the Vault-archive tier at one go.

Azure Backup also supports Vault-archive tier for SQL Server in Azure VM and SAP HANA in Azure VM. The support has been extended via Azure portal.
 
For more information, see [Archive tier support in Azure Backup](archive-tier-support.md).

## Multiple backups per day for Azure Files is now generally available

Low RPO (Recovery Point Objective) is a key requirement for Azure Files that contains the frequently updated, business-critical data. To ensure minimal data loss if a disaster or unwanted changes to file share content, you may prefer to take backups more frequently than once a day.

Using Azure Backup, you can create a backup policy or modify an existing backup policy to take multiple snapshots in a  day. This capability allows you to define the duration in which your backup jobs will run. Therefore, you can align your backup schedule with the working hours when there are frequent updates to Azure Files content. With this release, you can also configure policy for multiple backups per day using Azure PowerShell and Azure CLI.

For more information, see [how to configure multiple backups per day via backup policy](./manage-afs-backup.md#create-a-new-policy).

## Back up Azure Database for PostgreSQL is now generally available

Azure Backup and Azure Database services together help you to build an enterprise-class backup solution for Azure PostgreSQL (is now generally available). You can meet your data protection and compliance needs with a customer-controlled backup policy that enables retention of backups for up to 10 years.

With this, you've granular control to manage the backup and restore operations at the individual database level. Likewise, you can restore across PostgreSQL versions or to blob storage with ease. Besides using the Azure portal to perform the PostgreSQL database protection operations, you can also use the PowerShell, CLI, and REST API clients.

For more information, see [Azure Database for PostgreSQL backup](backup-azure-database-postgresql-overview.md).

## Archive Tier support for SQL Server/ SAP HANA in Azure VM from Azure portal

Azure Backup now supports the movement of recovery points to the Vault-archive tier for SQL Server and SAP HANA in Azure Virtual Machines from the Azure portal. This allows you to move the archivable recovery points corresponding to a particular database to the Vault-archive tier at one go.

Also, the support is extended via Azure CLI for the above workloads, along with Azure Virtual Machines (in preview).

For more information, see [Archive Tier support in Azure Backup](archive-tier-support.md).

## Multi-user authorization using Resource Guard for Recovery Services vault (in preview)

Azure Backup now supports multi-user authorization (MUA) that allows you to add an additional layer of protection to critical operations on your Recovery Services vaults. For MUA, Azure Backup uses the Azure resource, Resource Guard, to ensure critical operations are performed only with applicable authorization.

For more information, see [how to protect Recovery Services vault and manage critical operations with MUA](./multi-user-authorization.md).

## Multiple backups per day for Azure Files (in preview)

Low RPO (Recovery Point Objective) is a key requirement for Azure Files that contains the frequently updated, business-critical data. To ensure minimal data loss if a disaster or unwanted changes to file share content, you may prefer to take backups more frequently than once a day.

Using Azure Backup, you can now  create a backup policy or modify an existing backup policy to take multiple snapshots in a  day. With this capability, you can also define the duration in which your backup jobs would trigger. This capability empowers you to align your backup schedule with the working hours when there are frequent updates to Azure Files content.

For more information, see [how to configure multiple backups per day via backup policy](./manage-afs-backup.md#create-a-new-policy).

## Azure Backup metrics and metrics alerts (in preview)

Azure Backup now provides a set of built-in metrics via [Azure Monitor](/azure/azure-monitor/essentials/data-platform-metrics) that allows you to monitor the health of your backups. You can also configure alert rules that trigger alerts when metrics exceed the defined thresholds.

Azure Backup offers the following key capabilities:
 
- Ability to view out-of-the-box metrics related to the backup and restore health of your backup items along with associated trends.
- Ability to write custom alert rules on these metrics to efficiently monitor the health of your backup items.
- Ability to route fired metric alerts to various notification channels that Azure Monitor supports, such as email, ITSM, webhook, logic apps, and so on.
 
Currently, Azure Backup supports built-in metrics for the following workload types:

- Azure VM
- SQL databases in Azure VM
- SAP HANA databases in Azure VM
- Azure Files.

For more information, see [Monitor the health of your backups using Azure Backup Metrics (preview)](metrics-overview.md).

## Archive Tier support for SQL Server in Azure VM for Azure Backup is now generally available

Azure Backup allows you to move your long-term retention points for Azure Virtual Machines and SQL Server in Azure Virtual Machines to the low-cost Archive Tier. You can also restore from the recovery points in the Vault-archive tier.

In addition to the capability to move the recovery points:

- Azure Backup provides recommendations to move a specific set of recovery points for Azure Virtual Machine backups that will ensure cost savings.
- You have the capability to move all their recovery points for a particular backup item at one go using sample scripts.
- You can view Archive storage usage on the Vault dashboard.

For more information, see [Archive Tier support](./archive-tier-support.md).

## Backup for Azure Blobs is now generally available

Operational backup for Azure Blobs is a managed-data protection solution that lets you protect your block blob data from various data loss scenarios, such as blob corruptions, blob deletions, and accidental deletion of storage accounts.

Being an operational backup solution, the backup data is stored locally in the source storage account, and can be recovered from a selected point-in-time, giving you a simple and cost-effective means to protect your blob data. To do this, the solution uses the blob point-in-time restore capability available from blob storage.

Operational backup for blobs integrates with the Azure Backup management tools, including Backup Center, to help you manage the protection of your blob data effectively and at-scale. In addition to previously available capabilities, you can now configure and manage operational backup for blobs using the **Data protection** view of the storage accounts, also  [through PowerShell](backup-blobs-storage-account-ps.md). Also, Backup now gives you an enhanced experience for managing role assignments required for configuring operational backup.

For more information, see [Overview of operational backup for Azure Blobs](blob-backup-overview.md).

## Enhancements to encryption using customer-managed keys for Azure Backup (in preview)

Azure Backup now provides enhanced capabilities (in preview) to manage encryption with customer-managed keys. Azure Backup allows you to bring in your own keys to encrypt the backup data in the Recovery Services vaults, thus providing you with better control.

- Supports user-assigned managed identities to grant permissions to the keys to manage data encryption in the Recovery Services vault.
- Enables encryption with customer-managed keys while creating a Recovery Services vault.
  >[!NOTE]
  >This feature is currently in limited preview. To sign up, fill [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0H3_nezt2RNkpBCUTbWEapURDNTVVhGOUxXSVBZMEwxUU5FNDkyQkU4Ny4u), and write to us at [AskAzureBackupTeam@microsoft.com](mailto:AskAzureBackupTeam@microsoft.com).
- Allows you to use Azure Policies to audit and enforce encryption using customer-managed keys.
>[!NOTE]
>- The above capabilities are supported through the Azure portal only, PowerShell is currently not supported.<br>If you are using PowerShell for managing encryption keys for Backup, we do not recommend to update the keys from the portal.<br>If you update the key from the portal, you can’t use PowerShell to update the encryption key further, till a PowerShell update to support the new model is available. However, you can continue updating the key from the Azure portal.
>- You can use the audit policy for auditing vaults with encryption using customer-managed keys that are enabled after 04/01/2021.  
>- For vaults with the CMK encryption enabled before this date, the policy might fail to apply, or might show false negative results (that is, these vaults may be reported as non-compliant, despite having CMK encryption enabled). [Learn more](encryption-at-rest-with-cmk.md#use-azure-policy-to-audit-and-enforce-encryption-via-customer-managed-keys-in-preview).

For more information, see [Encryption for Azure Backup using customer-managed keys](encryption-at-rest-with-cmk.md). 

## Azure Disk Backup is now generally available

Azure Backup offers snapshot lifecycle management to Azure Managed Disks by automating periodic creation of snapshots and retaining these for configured durations using Backup policy.

For more information, see [Overview of Azure Disk Backup](disk-backup-overview.md).

## Backup center is now generally available

Backup center simplifies data protection management at-scale by enabling you to discover, govern, monitor, operate, and optimize backup management from one single central console.

For more information, see [Overview of Backup Center](backup-center-overview.md).

## Archive Tier support for Azure Backup (in preview)

Azure Backup now allows you to reduce the cost of long-term retention backups with the availability of Archive Tier for Azure virtual machines and SQL Server in Azure virtual machines.

For more information, see [Archive Tier support (Preview)](archive-tier-support.md).

## Backup for Azure Blobs (in preview)

Operational backup for Blobs is a managed, local data protection solution that lets you protect your block blobs from various data loss scenarios like corruptions, blob deletions, and accidental storage account deletion. The data is stored locally within the source storage account itself and can be recovered to a selected point in time whenever needed. So it provides a simple, secure, and cost-effective means to protect your blobs.

Operational backup for Blobs integrates with Backup Center, among other Backup management capabilities, to provide a single pane of glass that can help you govern, monitor, operate, and analyze backups at scale.

For more information, see [Overview of operational backup for Azure Blobs (in preview)](blob-backup-overview.md).

## Next steps

- [Azure Backup guidance and best practices](guidance-best-practices.md)
- [Archived release notes](backup-release-notes-archived.md)
