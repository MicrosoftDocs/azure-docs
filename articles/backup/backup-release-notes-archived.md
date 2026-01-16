---
title: Azure Backup release notes - Archive
description: Learn about past features releases in Azure Backup.
ms.topic: release-notes
ms.date: 01/09/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator responsible for data protection, I want to review the previous feature releases for Azure Backup, so that I can stay informed about past features and improvements to better manage our backup solutions."
---

# Archived release notes in Azure Backup

This article lists all the past releases of features and improvements from Azure Backup. For more recent and up to date releases, see [What's new in Azure Backup](whats-new.md).

## Release summary

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
  - [Support for selective disk backup with enhanced policy for Azure VM is now generally available](#support-for-selective-disk-backup-with-enhanced-policy-for-azure-vm-is-now-generally-available)
- August 2023
  - [Save your MARS backup passphrase securely to Azure Key Vault (preview)](#save-your-mars-backup-passphrase-securely-to-azure-key-vault-preview)
  - [Cross Region Restore for MARS Agent (preview)](#cross-region-restore-for-mars-agent-preview)
- July 2023
  - [SAP HANA System Replication database backup support is now generally available](#sap-hana-system-replication-database-backup-support-is-now-generally-available)
  - [Cross Region Restore for PostgreSQL (preview)](#cross-region-restore-for-postgresql-preview)
- April 2023
  - [Microsoft Azure Backup Server v4 is now generally available](#microsoft-azure-backup-server-v4-is-now-generally-available)
- March 2023
  - [Multiple-backups-per-day for Azure VMs is now generally available](#multiple-backups-per-day-for-azure-vms-is-now-generally-available)
  - [Immutable vault for Azure Backup is now generally available](#immutable-vault-for-azure-backup-is-now-generally-available)
  - [Support for selective disk backup with enhanced policy for Azure VM (preview)](#support-for-selective-disk-backup-with-enhanced-policy-for-azure-vm-is-now-generally-available)
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
  - [Multiple-backups-per-day for Azure Files is now generally available](#multiple-backups-per-day-for-azure-files-is-now-generally-available)
- January 2022
  - [Back up Azure Database for PostgreSQL is now generally available](#back-up-azure-database-for-postgresql-is-now-generally-available)
- October 2021
  - [Archive Tier for SQL Server/ SAP HANA in Azure VM from Azure portal](#archive-tier-for-sql-server-sap-hana-in-azure-vm-from-azure-portal)
  - [Multi-user authorization using Resource Guard for Recovery Services vault (in preview)](#multi-user-authorization-using-resource-guard-for-recovery-services-vault-in-preview)
  - [Multiple backups per day for Azure Files (in preview)](#multiple-backups-per-day-for-azure-files-in-preview)
  - [Azure Backup Metrics and Metrics Alerts (in preview)](#azure-backup-metrics-and-metrics-alerts-in-preview)
- July 2021
  - [Archive Tier for SQL Server in Azure VM for Azure Backup is now generally available](#archive-tier-for-sql-server-in-azure-vm-for-azure-backup-is-now-generally-available)
- May 2021
  - [Backup for Azure Blobs is now generally available](#backup-for-azure-blobs-is-now-generally-available)
- April 2021
  - [Enhancements to encryption using customer-managed keys for Azure Backup (in preview)](#enhancements-to-encryption-using-customer-managed-keys-for-azure-backup-in-preview)
- March 2021
  - [Azure Disk Backup is now generally available](#azure-disk-backup-is-now-generally-available)
  - [Backup center is now generally available](#backup-center-is-now-generally-available)
  - [Archive Tier for Azure Backup (in preview)](#archive-tier-for-azure-backup-in-preview)
- February 2021
  - [Backup for Azure Blobs (in preview)](#backup-for-azure-blobs-in-preview)
- January 2021
  - [Azure Disk Backup (in preview)](#azure-disk-backup-in-preview)
  - [Encryption at rest using customer-managed keys (general availability)](#encryption-at-rest-using-customer-managed-keys)
- November 2020
  - [Azure Resource Manager template for Azure file share (AFS) backup](#azure-resource-manager-template-for-afs-backup)
  - [Incremental backups for SAP HANA databases on Azure VMs (in preview)](#incremental-backups-for-sap-hana-databases-in-preview)
- September 2020
  - [Backup Center (in preview)](#backup-center-in-preview)
  - [Back up Azure Database for PostgreSQL (in preview)](#back-up-azure-database-for-postgresql-in-preview)
  - [Selective disk backup and restore](#selective-disk-backup-and-restore)
  - [Cross Region Restore for SQL Server and SAP HANA databases on Azure VMs (in preview)](#cross-region-restore-for-sql-server-and-sap-hana-in-preview)
  - [Support for backup of VMs with up to 32 disks (general availability)](#support-for-backup-of-vms-with-up-to-32-disks)
  - [Simplified backup configuration experience for SQL in Azure VMs](#simpler-backup-configuration-for-sql-in-azure-vms)
  - [Back up SAP HANA in RHEL Azure Virtual Machines (in preview)](#back-up-sap-hana-in-rhel-azure-virtual-machines-in-preview)
  - [Zone redundant storage (ZRS) for backup data (in preview)](#zone-redundant-storage-zrs-for-backup-data-in-preview)
  - [Soft delete for SQL Server and SAP HANA workloads in Azure VMs](#soft-delete-for-sql-server-and-sap-hana-workloads)

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

For more information, see [Cross Region Restore for MARS (preview)](about-restore-microsoft-azure-recovery-services.md#cross-region-restore-for-mars).

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
## Multiple-backups-per-day for Azure VMs is now generally available

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

## Multiple-backups-per-day for Azure Files is now generally available

Low RPO (Recovery Point Objective) is a key requirement for Azure Files that contains the frequently updated, business-critical data. To ensure minimal data loss if a disaster or unwanted changes to file share content, you may prefer to take backups more frequently than once a day.

Using Azure Backup, you can create a backup policy or modify an existing backup policy to take multiple snapshots in a  day. This capability allows you to define the duration in which your backup jobs will run. Therefore, you can align your backup schedule with the working hours when there are frequent updates to Azure Files content. With this release, you can also configure policy for multiple backups per day using Azure PowerShell and Azure CLI.

For more information, see [how to configure multiple backups per day via backup policy](./manage-afs-backup.md#create-a-new-policy).

## Back up Azure Database for PostgreSQL is now generally available

Azure Backup and Azure Database services together help you to build an enterprise-class backup solution for Azure PostgreSQL (is now generally available). You can meet your data protection and compliance needs with a customer-controlled backup policy that enables retention of backups for up to 10 years.

With this, you've granular control to manage the backup and restore operations at the individual database level. Likewise, you can restore across PostgreSQL versions or to blob storage with ease. Besides using the Azure portal to perform the PostgreSQL database protection operations, you can also use the PowerShell, CLI, and REST API clients.

For more information, see [Azure Database for PostgreSQL backup](backup-azure-database-postgresql-overview.md).

## Archive Tier for SQL Server/ SAP HANA in Azure VM from Azure portal

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

## Archive Tier for SQL Server in Azure VM for Azure Backup is now generally available

Azure Backup allows you to move your long-term retention points for Azure Virtual Machines and SQL Server in Azure Virtual Machines to the low-cost Archive Tier. You can also restore from the recovery points in the Vault-archive tier.

In addition to the capability to move the recovery points:

- Azure Backup provides recommendations to move a specific set of recovery points for Azure Virtual Machine backups that will ensure cost savings.
- You have the capability to move all their recovery points for a particular backup item at one go using sample scripts.
- You can view Archive storage usage on the Vault dashboard.

For more information, see [Archive Tier support](./archive-tier-support.md).

## Backup for Azure Blobs is now generally available

Operational backup for Azure Blobs is a managed-data protection solution that lets you protect your block blob data from various data loss scenarios, such as blob corruptions, blob deletions, and accidental deletion of storage accounts.

Being an operational backup solution, the backup data is stored locally in the source storage account and can be recovered from a selected point-in-time, giving you a simple and cost-effective means to protect your blob data. To do this, the solution uses the blob point-in-time restore capability available from blob storage.

Operational backup for blobs integrates with the Azure Backup management tools, including Backup Center, to help you manage the protection of your blob data effectively and at-scale. In addition to previously available capabilities, you can now configure and manage operational backup for blobs using the **Data protection** view of the storage accounts, also  [through PowerShell](backup-blobs-storage-account-ps.md). Also, Backup now gives you an enhanced experience for managing role assignments required for configuring operational backup.

For more information, see [Overview of operational backup for Azure Blobs](blob-backup-overview.md).

## Enhancements to encryption using customer-managed keys for Azure Backup (in preview)

Azure Backup now provides enhanced capabilities (in preview) to manage encryption with customer-managed keys. Azure Backup allows you to bring in your own keys to encrypt the backup data in the Recovery Services vaults, thus providing you with better control.

- Supports user-assigned managed identities to grant permissions to the keys to manage data encryption in the Recovery Services vault.
- Enables encryption with customer-managed keys while creating a Recovery Services vault.
  >[!NOTE]
  >This feature is currently in limited preview. To sign up, fill [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0H3_nezt2RNkpBCUTbWEapURDNTVVhGOUxXSVBZMEwxUU5FNDkyQkU4Ny4u).
- Allows you to use Azure Policies to audit and enforce encryption using customer-managed keys.
>[!NOTE]
>- The above capabilities are supported through the Azure portal only, PowerShell is currently not supported.<br>If you are using PowerShell for managing encryption keys for Backup, we do not recommend updating the keys from the portal.<br>If you update the key from the portal, you can’t use PowerShell to update the encryption key further, till a PowerShell update to support the new model is available. However, you can continue updating the key from the Azure portal.
>- You can use the audit policy for auditing vaults with encryption using customer-managed keys that are enabled after 04/01/2021.  
>- For vaults with the CMK encryption enabled before this date, the policy might fail to apply, or might show false negative results (that is, these vaults may be reported as non-compliant, despite having CMK encryption enabled). [Learn more](encryption-at-rest-with-cmk.md#use-azure-policy-to-audit-and-enforce-encryption-via-customer-managed-keys-in-preview).

For more information, see [Encryption for Azure Backup using customer-managed keys](encryption-at-rest-with-cmk.md). 

## Azure Disk Backup is now generally available

Azure Backup offers snapshot lifecycle management to Azure Managed Disks by automating periodic creation of snapshots and retaining these for configured durations using Backup policy.

For more information, see [Overview of Azure Disk Backup](disk-backup-overview.md).

## Backup center is now generally available

Backup center simplifies data protection management at-scale by enabling you to discover, govern, monitor, operate, and optimize backup management from one single central console.

For more information, see [Overview of Backup Center](backup-center-overview.md).

## Archive Tier for Azure Backup (in preview)

Azure Backup now allows you to reduce the cost of long-term retention backups with the availability of Archive Tier for Azure virtual machines and SQL Server in Azure virtual machines.

For more information, see [Archive Tier support (Preview)](archive-tier-support.md).

## Backup for Azure Blobs (in preview)

Operational backup for Blobs is a managed, local data protection solution that lets you protect your block blobs from various data loss scenarios like corruptions, blob deletions, and accidental storage account deletion. The data is stored locally within the source storage account itself and can be recovered to a selected point in time whenever needed. So it provides a simple, secure, and cost-effective means to protect your blobs.

Operational backup for Blobs integrates with Backup Center, among other Backup management capabilities, to provide a single pane of glass that can help you govern, monitor, operate, and analyze backups at scale.

For more information, see [Overview of operational backup for Azure Blobs (in preview)](blob-backup-overview.md).

## Azure Disk Backup (in preview)

Azure Disk Backup offers a turnkey solution that provides snapshot lifecycle management for [Azure Managed Disks](/azure/virtual-machines/managed-disks-overview) by automating periodic creation of snapshots and retaining it for a configured duration using backup policy. You can manage the disk snapshots with zero infrastructure cost and without the need for custom scripting or any management overhead. This is a crash-consistent backup solution that takes point-in-time backup of a managed disk using [incremental snapshots](/azure/virtual-machines/disks-incremental-snapshots) with support for multiple backups per day. It's also an agent-less solution and doesn't impact production application performance. It supports backup and restore of both OS and data disks (including shared disks), whether or not they're currently attached to a running Azure virtual machine.

For more information, see [Azure Disk Backup (in preview)](disk-backup-overview.md).

## Encryption at rest using customer-managed keys

Support for encryption at rest using customer-managed keys is now generally available. This gives you the ability to encrypt the backup data in your Recovery Services vaults using your own keys stored in Azure Key Vaults. The encryption key used for encrypting backups in the Recovery Services vault may be different from the ones used for encrypting the source. The data is protected using an AES 256 based data encryption key (DEK), which is, in turn, protected using your keys stored in the Key Vault. Compared to encryption using platform-managed keys (which is available by default), this gives you more control over your keys and can help you better meet your compliance needs.

For more information, see [Encryption of backup data using customer-managed keys](encryption-at-rest-with-cmk.md).

## Azure Resource Manager template for AFS backup

Azure Backup now supports configuring backup for existing Azure file shares using an Azure Resource Manager (ARM) template. The template configures protection for an existing Azure file share by specifying appropriate details for the Recovery Services vault and backup policy. It optionally creates a new Recovery Services vault and backup policy, and registers the storage account containing the file share to the Recovery Services vault.

For more information, see [Azure Resource Manager templates for Azure Backup](backup-rm-template-samples.md).

## Incremental backups for SAP HANA databases (in preview)

Azure Backup now supports incremental backups for SAP HANA databases hosted on Azure VMs. This allows for faster and more cost-efficient backups of your SAP HANA data.

For more information, see [various options available during creation of a backup policy](./sap-hana-faq-backup-azure-vm.yml) and [how to create a backup policy for SAP HANA databases](tutorial-backup-sap-hana-db.md#create-a-backup-policy-for-sap-hana-databases).

## Backup Center (in preview)

Azure Backup has enabled a new native management capability to manage your entire backup estate from a central console. Backup Center provides you with the capability to monitor, operate, govern, and optimize data protection at scale in a unified manner consistent with Azure’s native management experiences.

With Backup Center, you get an aggregated view of your inventory across subscriptions, locations, resource groups, vaults, and even tenants using Azure Lighthouse. Backup Center is also an action center from where you can trigger your backup related activities, such as configuring backup, restore, creation of policies or vaults, all from a single place. In addition, with seamless integration to Azure Policy, you can now govern your environment and track compliance from a backup perspective. In-built Azure Policies specific to Azure Backup also allow you to configure backups at scale.

For more information, see [Overview of Backup Center](backup-center-overview.md).

## Back up Azure Database for PostgreSQL (in preview)

Azure Backup and Azure Database Services have come together to build an enterprise-class backup solution for Azure PostgreSQL (now in preview). Now you can meet your data protection and compliance needs with a customer-controlled backup policy that enables retention of backups for up to 10 years. With this, you have granular control to manage the backup and restore operations at the individual database level. Likewise, you can restore across PostgreSQL versions or to blob storage with ease.

For more information, see [Azure Database for PostgreSQL backup](backup-azure-database-postgresql.md).

## Selective disk backup and restore

Azure Backup supports backing up all the disks (operating system and data) in a VM together using the virtual machine backup solution. Now, using the selective disks backup and restore functionality, you can back up a subset of the data disks in a VM. This provides an efficient and cost-effective solution for your backup and restore needs. Each recovery point contains only the disks that are included in the backup operation.

For more information, see [Selective disk backup and restore for Azure virtual machines](selective-disk-backup-restore.md).

## Cross Region Restore for SQL Server and SAP HANA (in preview)

With the introduction of cross-region restore, you can now initiate restores in a secondary region at will to mitigate real downtime issues in a primary region for your environment. This makes the secondary region restores completely customer controlled. Azure Backup uses the backed-up data replicated to the secondary region for such restores.

Now, in addition to support for cross-region restore for Azure virtual machines, the feature has been extended to restoring SQL and SAP HANA databases in Azure virtual machines as well.

For more information, see [Cross Region Restore for SQL databases](restore-sql-database-azure-vm.md#cross-region-restore) and [Cross Region Restore for SAP HANA databases](sap-hana-db-restore.md#cross-region-restore).

## Support for backup of VMs with up to 32 disks

Until now, Azure Backup has supported 16 managed disks per VM. Now, Azure Backup supports backup of up to 32 managed disks per VM.

For more information, see the [VM storage support matrix](backup-support-matrix-iaas.md#vm-storage-support).

## Simpler backup configuration for SQL in Azure VMs

Configuring backups for your SQL Server in Azure VMs is now even easier with inline backup configuration integrated into the VM pane of the Azure portal. In just a few steps, you can enable backup of your SQL Server to protect all the existing databases as well as the ones that get added in the future.

For more information, see [Back up a SQL Server from the VM pane](backup-sql-server-vm-from-vm-pane.md).

## Back up SAP HANA in RHEL Azure virtual machines (in preview)

Azure Backup is the native backup solution for Azure and is BackInt certified by SAP. Azure Backup has now added support for Red Hat Enterprise Linux (RHEL), one of the most widely used Linux operating systems running SAP HANA.

For more information, see the [SAP HANA database backup scenario support matrix](sap-hana-backup-support-matrix.md#scenario-support).

## Zone redundant storage (ZRS) for backup data (in preview)

Azure Storage provides a great balance of high performance, high availability, and high data resiliency with its varied redundancy options. Azure Backup allows you to extend these benefits to the backup data as well, with options to store your backups in locally redundant storage (LRS) and geo-redundant storage (GRS). Now, there are additional durability options with the added support for zone redundant storage (ZRS).

For more information, see [Set storage redundancy for the Recovery Services vault](backup-create-rs-vault.md#set-storage-redundancy).

## Soft delete for SQL Server and SAP HANA workloads

Concerns about security issues, like malware, ransomware, and intrusion, are increasing. These security issues can be costly, in terms of both money and data. To guard against such attacks, Azure Backup provides security features to help protect backup data even after deletion.

One such feature is soft delete. With soft delete, even if a malicious actor deletes a backup (or backup data is accidentally deleted), the backup data is retained for 14 additional days, allowing the recovery of that backup item with no data loss. The additional 14 days of retention for backup data in the "soft delete" state don't incur any cost to you.

Now, in addition to soft delete support for Azure VMs, SQL Server and SAP HANA workloads in Azure VMs are also protected with soft delete.

For more information, see [Soft delete for SQL server in Azure VM and SAP HANA in Azure VM workloads](soft-delete-sql-saphana-in-azure-vm.md).