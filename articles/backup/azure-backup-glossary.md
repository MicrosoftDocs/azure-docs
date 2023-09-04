---
title: Azure Backup glossary
description: This article defines terms helpful for use with Azure Backup.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell, devx-track-arm-template, devx-track-azurecli
ms.date: 12/21/2020
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Backup glossary

This glossary of terms can be helpful when using Azure Backup.

>[!NOTE]
>
> - Terms which are marked with the prefix "(Workload-specific term)" refer to those terms which are only relevant in the context of a specific subset of workloads that Azure Backup supports.
> - For terms which are used commonly in Azure Backup documentation but refer to other Azure services, a direct link is provided to the documentation of the relevant Azure service.

## AFS (Azure File shares)

Refer to [Azure Files documentation](../storage/files/storage-files-introduction.md).

## Alternate location recovery

A recovery done from the recovery point to a location other than the original location where the backups were taken. When using Azure VM backup, this would mean restoring the VM to a server other than the original server where the backups were taken. When using Azure File share backup, this would mean restoring data to a file share that is different from the backed-up file share.

## Application consistent backup

(Workload-specific term)

Application-consistent backups capture memory content and pending I/O operations. App-consistent snapshots use a [VSS](#vss-windows-volume-shadow-copy-service) VSS writer (or pre or post scripts for Linux) to ensure the consistency of the app data before a backup occurs. [Learn more](backup-azure-vms-introduction.md).

## Azure Resource Manager (ARM) templates

Refer to [ARM templates documentation](../azure-resource-manager/templates/overview.md).

## Autoprotection (for databases)

(Workload-specific term)

Autoprotection is a capability that lets you automatically protect all the databases in a standalone SQL Server instance or a SQL Server Always On availability group. Not only does it enable backups for the existing databases, but it also protects all the databases that you may add in future.

## Availability (Storage Replication types)

Azure Backup offers three types of replication to keep your storage and data highly available:

### LRS

[Locally redundant storage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage) replicates your backup data three times (it creates three copies of your backup data) in a storage scale unit in a datacenter. All copies of the backup data exist within the same region. LRS is a low-cost option for protecting your backup data from local hardware failures.

### GRS

[Geo-redundant storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage) is the default and recommended replication option. GRS replicates your backup data to a secondary region, hundreds of miles away from the primary location of the source data. GRS costs more than LRS, but GRS provides a higher level of durability for your backup data, even if there's a regional outage.

>[!NOTE]
>For GRS vaults that have the cross-region restore feature enabled, backup storage is upgraded from GRS to RA-GRS (Read-Access Geo-Redundant Storage).

### ZRS

[Zone-redundant storage (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage) replicates your backup data in [availability zones](../availability-zones/az-overview.md#availability-zones), guaranteeing backup data residency and resiliency in the same region. So your critical workloads that require [data residency](https://azure.microsoft.com/resources/achieving-compliant-data-residency-and-security-with-azure/) can be backed up in ZRS.

## Azure CLI

Refer to [Azure CLI documentation](/cli/azure/what-is-azure-cli).

## Azure Policy

Refer to [Azure Policy documentation](../governance/policy/overview.md).

## Azure PowerShell

Refer to [Azure PowerShell documentation](/powershell/azure/).

## Azure Resource Manager (ARM)

Refer to [Azure Resource Manager documentation](../azure-resource-manager/management/overview.md).

## Azure Disk Encryption (ADE)

Refer to [Azure Disk Encryption documentation](../virtual-machines/disk-encryption-overview.md).

## Backend storage / Cloud storage / Backup storage

The actual storage used by a backup instance. Includes the size of all retention points that exist for the backup instance (as defined by the backup and retention policy).

## Bare metal backup

Backup of operating system files and all data on critical volumes, except for user data. By definition, a bare metal backup includes a system state backup. It provides protection when a computer won't start and you have to recover everything. [Learn more](backup-mabs-system-state-and-bmr.md).

## Backup extensions / VM extensions

(Specific to Azure VM workload type)

Azure virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. Azure Backup backs up Azure VMs by installing an extension to the Azure VM agent running on the machine. Azure Backup automatically manages these extensions and users don't need to manually update these extensions.

## Backup instance / Backup item

A datasource backed up to a vault with a particular backup and retention policy constitutes a backup instance or a backup item.

## Backup rule / Backup policy

A backup rule is a user-defined rule that specifies when and how often backups should be performed on a datasource. For some workload types, backup policy also provides a way to specify the snapshot method to be applied on the datasource (full, incremental, differential). Backup policies are often created as a combination of backup rules and retention rules.

## Backup vault

An Azure Resource Manager resource of type *Microsoft.DataProtection/BackupVaults*. Currently, Backup vaults are used to back up Azure Databases for PostgreSQL Server. [Learn more about Backup vaults](backup-azure-recovery-services-vault-overview.md).

## BCDR (Business Continuity and Disaster Recovery)

BCDR involves a set of processes an organization must adopt to ensure apps and workloads are up and running during planned and unplanned service or Azure outages, with minimal business disruption. [Learn more](https://azure.microsoft.com/solutions/backup-and-disaster-recovery/#overview) about the various services that Azure offers to help you create a sound BCDR strategy.

## Churn

The percent of change in the data being backed up between two consecutive backups. This could be because of addition of new data, or the modification or deletion of existing data.

## Crash-consistent backup

(Workload-specific term)

Crash-consistent snapshots typically occur if an Azure VM shuts down at the time of backup. Only the data that already exists on the disk at the time of backup is captured and backed up. [Learn more](backup-azure-vms-introduction.md#snapshot-consistency).

## Cross-Region Restore (CRR)

As one of the [restore options](backup-azure-arm-restore-vms.md#restore-options), Cross Region Restore (CRR) allows you to restore backup items in a secondary region, which is an [Azure paired region](../availability-zones/cross-region-replication-azure.md).

## Data box

Refer to [data box documentation](../databox/data-box-overview.md).

## Datasource

A resource (Azure resource, proxy-resource, or on-premises resource) which is a candidate for being backed up. For example, an Azure VM or an Azure File share.

## DPM (Data Protection Manager)

(Workload-specific term)

Refer to the [DPM documentation](/system-center/dpm/dpm-overview).

## ExpressRoute

Refer to the [ExpressRoute documentation](../expressroute/expressroute-introduction.md).

## File system consistent backup

(Workload-specific term)

File-system consistent backups provide consistency by taking a snapshot of all files at the same time. [Learn more](backup-azure-vms-introduction.md#snapshot-consistency).

## Frontend storage / Source size

The size of the data to be backed up for a datasource. The frontend size of a datasource determines its [Protected Instance](#protected-instance) count.

## Full backup

In full backups, a copy of the whole data source is stored for every backup.

## GFS Backup Policy

A GFS (Grandfather-father-son) backup policy is one that enables you to define weekly, monthly, and yearly backup schedules in addition to the daily backup schedule. The weekly backups are known "sons", the monthly backups are known as "fathers" and the yearly backups are known as "grandfathers". Each of these sets of backup copies can be configured to be retained for different durations of time, allowing for more customization of retention choices for backup copies. GFS policies are useful in retaining backups for a long period of time in a more storage-efficient manner.

## IaaS VMs / Azure VMs

Refer to the [Azure VM documentation](../virtual-machines/index.yml).

## Incremental backup

Incremental backups store only the blocks that have changed since the previous backup.

## Instant restore

(Workload specific term) Instant restore involves restoring a machine directly from its backup snapshot rather than from the copy of the snapshot in the vault. Instant restores are faster than restores from a vault. The number of instant restore points available depends on the retention duration configured for snapshots. Currently applicable for Azure VM backup only.

## IOPS

Input/output operations per second.

## Item-level restore

(Workload-specific term)

Restoring individual files or folders inside the machine from the recovery point.

## Job

A backup-related task that is created by a user or the Azure Backup service. Jobs can be either scheduled or on-demand (ad-hoc). There are different types of jobs - backup, restore, configure protection, and so on. [Learn more about jobs](backup-azure-monitoring-built-in-monitor.md#backup-jobs-in-backup-center).

## MABS / Azure Backup Server

(Workload-specific term)

With Azure Backup Server, you can protect application workloads such as Hyper-V VMs, Microsoft SQL Server, SharePoint Server, Microsoft Exchange, and Windows clients from a single console. It inherits much of the workload backup functionality from DPM, but with a few differences. [Learn more](backup-azure-microsoft-azure-backup.md)

## Managed disks

Refer to the [Managed disks documentation](../virtual-machines/managed-disks-overview.md).

## MARS Agent

(Workload-specific term)

Also known as **Azure Backup agent** or **Recovery Services agent**, the MARS agent is used by Azure Backup to back up data from on-premises machines and Azure VMs to a backup Recovery Services vault in Azure. [Learn more](backup-support-matrix-mars-agent.md).

## NSG (Network Security Group)

Refer to the [NSG documentation](../virtual-network/network-security-groups-overview.md).

## Offline seeding

Offline seeding refers to the process of transferring the initial (full) backup offline, without the use of network bandwidth. It provides a mechanism to copy backup data onto physical storage devices, which are then shipped to a nearby Azure datacenter and uploaded onto a Recovery Services vault. [Learn more](offline-backup-overview.md).

## On-demand backup / Ad hoc backup

A backup job that is triggered by a user on a one-time need basis, and not based on the backup schedule (policy) that has been configured for the resource.

## Original location recovery (OLR)

A recovery done from the restore point to the source location from where the backups were taken, replacing it with the state stored in the recovery point. When using Azure VM backup, this would mean restoring the VM to the original server where the backups were taken. When using Azure File share backup, this would mean restoring data to the backed-up file share.

## Passphrase

(Workload-specific term)

A passphrase is used to encrypt and decrypt data while backing up or restoring your on-premises or local machine using the MARS agent to or from Azure.

## Private endpoint

Refer to the [Private Endpoint documentation](../private-link/private-endpoint-overview.md).

## Protected instance

A protected instance refers to the computer, physical or virtual server you use to configure the backup to Azure.  From a **billing standpoint**, Protected Instance Count for a machine is a function of its frontend size. Thus, a single backup instance (such as a VM backed up to Azure) can correspond to multiple protected instances, depending on its frontend size. [Learn more](https://azure.microsoft.com/pricing/details/backup/).

## RBAC (Role-based access control)

Refer to the [RBAC documentation](../role-based-access-control/overview.md).

## Recovery point/ Restore point/ Retention point / Point-in-time (PIT)

A copy of the original data that is being backed up. A retention point is associated with a timestamp so you can use this to restore an item to a particular point in time.

## Recovery Services vault

An Azure Resource Manager resource of type *Microsoft.RecoveryServices/vaults*. Currently, Recovery Services vaults are used to back up the following workloads: Azure VMs, SQL in Azure VMs, SAP HANA in Azure VMs, and Azure File shares. It's also used to back up on-premises workloads using MARS, Azure Backup Server (MABS), and System Center DPM. [Learn more about Recovery Services vaults](backup-azure-recovery-services-vault-overview.md).

## Resource group

Refer to the [Azure Resource Manager documentation](../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group).

## REST API

Refer to the [Azure REST API documentation](/rest/api/azure/).

## Retention rule

A user-defined rule that specifies how long backups should be retained.

## RPO (Recovery Point Objective)

RPO indicates the maximum data loss that is possible in a data-loss scenario. This is determined by backup frequency.

## RTO (Recovery Time Objective)

RTO indicates the maximum possible time in which data can be restored to the last available point-in-time after a data loss scenario.

## Scheduled backup

A backup job that is automatically triggered by the backup policy configured for the given item.

## Secondary region / Paired region

A regional pair consists of two regions within the same geography. One is the primary region, and the other is the secondary region. Paired regions are used by some Azure services (including Azure Backup with GRS settings) to ensure business continuity and protect against data loss. [Learn more](../availability-zones/cross-region-replication-azure.md).

## Soft delete

Soft delete is a feature that helps guard against accidental deletion of backup data. With soft delete, even if a malicious actor deletes a backup (or backup data is accidentally deleted), the backup data is retained for an additional period of time, allowing the recovery of that backup item with no data loss. [Learn more](backup-azure-security-feature-cloud.md).

## Snapshot

A snapshot is a full, read-only copy of a virtual hard drive (VHD) or an Azure File share. Learn more about [disk snapshots](../virtual-machines/windows/snapshot-copy-managed-disk.md) and [file snapshots](../storage/files/storage-snapshots-files.md).

## Storage account

Refer to the [Storage account documentation](../storage/common/storage-account-overview.md).

## Subscription

An Azure subscription is a logical container used to provision resources in Azure. It holds the details of all your resources, like virtual machines (VMs), databases, and more.

## System State backup

(Workload-specific term)

Backs up operating system files. This backup allows you to recover when a computer starts, but system files and the registry are lost. [Learn more](backup-mabs-system-state-and-bmr.md).

## Tenant

A tenant is a representation of an organization. It's a dedicated instance of Azure AD that an organization or app developer receives when the organization or app developer creates a relationship with Microsoft, like signing up for Azure, Microsoft Intune, or Microsoft 365.

## Tier

Currently, Azure Backup supports the following backup storage tiers:

### Snapshot tier

(Workload specific term) In the first phase of VM backup, the snapshot taken is stored along with the disk. This form of storage is referred to as snapshot tier. Snapshot tier restores are faster (than restoring from a vault) because they eliminate the wait time for snapshots to get copied to from the vault before triggering the restore operation.

### Vault-Standard tier

Backup data for all workloads supported by Azure Backup is stored in vaults which hold backup storage, an auto-scaling set of storage accounts managed by Azure Backup. The Vault-Standard tier is an online storage tier that enables you to store an isolated copy of backup data in a Microsoft managed tenant, thus creating an additional layer of protection. For workloads where snapshot tier is supported, there is a copy of the backup data in both the snapshot tier and the vault-standard tier. Vault-standard tier ensures that backup data is available even if the datasource being backed up is deleted or compromised.

## Unmanaged disk

Refer to the [Unmanaged disks documentation](../storage/common/storage-disaster-recovery-guidance.md#azure-unmanaged-disks).

## Vault

A storage entity in Azure that houses backup data. It's also a unit of RBAC and billing. Currently there are two types of vaults - Recovery Services vault and Backup vault.

## Vault credentials

The vault credentials file is a certificate generated by the portal for each vault. This is used while registering an on-premises server to the vault. [Learn more](backup-azure-dpm-introduction.md).

## VNET (Virtual Network)

Refer to the [VNET documentation](../virtual-network/virtual-networks-overview.md).

## VSS (Windows Volume Shadow Copy Service)

Refer to the [VSS documentation](/windows-server/storage/file-server/volume-shadow-copy-service).

## Next steps

- [Azure Backup overview](backup-overview.md)
- [Azure Backup architecture and components](backup-architecture.md)
