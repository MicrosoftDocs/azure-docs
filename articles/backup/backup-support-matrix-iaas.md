---
title: Support matrix for Azure VM backups
description: Get a summary of support settings and limitations for backing up Azure VMs by using the Azure Backup service.
ms.topic: conceptual
ms.date: 07/05/2023
ms.custom: references_regions 
ms.reviewer: sharrai
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure VM backups

You can use the [Azure Backup service](backup-overview.md) to back up on-premises machines and workloads, along with Azure virtual machines (VMs). This article summarizes support settings and limitations when you back up Azure VMs by using Azure Backup.

Other support matrices include:

- [General support matrix](backup-support-matrix.md) for Azure Backup
- [Support matrix](backup-support-matrix-mabs-dpm.md) for Azure Backup servers and System Center Data Protection Manager (DPM) backup
- [Support matrix](backup-support-matrix-mars-agent.md) for backup with the Microsoft Azure Recovery Services (MARS) agent

## Supported scenarios

Here's how you can back up and restore Azure VMs by using the Azure Backup service.

**Scenario** | **Backup** | **Agent** |**Restore**
--- | --- | --- | ---
Direct backup of Azure VMs  | Back up the entire VM.  | No additional agent is needed on the Azure VM. Azure Backup installs and uses an extension to the [Azure VM agent](../virtual-machines/extensions/agent-windows.md) that's running on the VM. | Restore as follows:<br/><br/> - **Create a basic VM**. This is useful if the VM has no special configuration, such as multiple IP addresses.<br/><br/> - **Restore the VM disk**. Restore the disk. Then attach it to an existing VM, or create a new VM from the disk by using PowerShell.<br/><br/> - **Replace the VM disk**. If a VM exists and it uses managed disks (unencrypted), you can restore a disk and use it to replace an existing disk on the VM.<br/><br/> - **Restore specific files or folders**. You can restore files or folders from a VM instead of restoring the entire VM.
Direct backup of Azure VMs (Windows only)  | Back up specific files, folders, or volumes. | Install the [Azure Recovery Services agent](backup-azure-file-folder-backup-faq.yml).<br/><br/> You can run the MARS agent alongside the backup extension for the Azure VM agent to back up the VM at the file or folder level. | Restore specific files or folders.
Backup of Azure VMs to the backup server  | Back up files, folders, or volumes; system state or bare metal files; and app data to System Center DPM or to Microsoft Azure Backup Server (MABS).<br/><br/> DPM or MABS then backs up to the backup vault. | Install the DPM or MABS protection agent on the VM. The MARS agent is installed on DPM or MABS.| Restore files, folders, or volumes; system state or bare metal files; and app data.

Learn more about [using a backup server](backup-architecture.md#architecture-back-up-to-dpmmabs) and about [support requirements](backup-support-matrix-mabs-dpm.md).

## Supported backup actions

**Action** | **Support**
--- | ---
Back up a VM that's shut down or offline | Supported.<br/><br/> Snapshot is crash consistent only, not app consistent.
Back up disks after migrating to managed disks | Supported.<br/><br/> Backup will continue to work. No action is required.
Back up managed disks after enabling a resource group lock | Not supported.<br/><br/> Azure Backup can't delete the older restore points. Backups will start to fail when the limit of restore points is reached.
Modify backup policy for a VM | Supported.<br/><br/> The VM will be backed up according to the schedule and retention settings in the new policy. If retention settings are extended, existing recovery points are marked and kept. If they're reduced, existing recovery points will be pruned in the next cleanup job and eventually deleted.
Cancel a backup job| Supported during the snapshot process.<br/><br/> Not supported when the snapshot is being transferred to the vault.
Back up the VM to a different region or subscription |Not supported.<br><br>For successful backup, virtual machines must be in the same subscription as the vault for backup.
Back up daily via the Azure VM extension | Four backups per day: one scheduled backup as set up in the backup policy, and three on-demand backups.    <br><br>    To allow user retries in case of failed attempts, the hard limit for on-demand backups is set to nine attempts.
Back up daily via the MARS agent | Three scheduled backups per day.
Back up daily via DPM or MABS | Two scheduled backups per day.
Back up monthly or yearly| Not supported when you're backing up with the Azure VM extension. Only daily and weekly are supported.<br/><br/> You can set up the policy to retain daily or weekly backups for a monthly or yearly retention period.
Automatically adjust the clock | Not supported.<br/><br/> Azure Backup doesn't automatically adjust for daylight saving time when you're backing up a VM.<br/><br/>  Modify the policy manually as needed.
[Disable security features for hybrid backup](./backup-azure-security-feature.md) |Not supported.
Back up a VM whose machine time is changed | Not supported.<br/><br/> If you change the machine time to a future date/time after enabling backup for that VM, even if the time change is reverted, successful backup isn't guaranteed.
Do multiple backups per day    |  Supported through **Enhanced policy**. <br><br>   For hourly backup, the minimum recovery point objective (RPO) is 4 hours and the maximum is 24 hours. You can set the backup schedule to 4, 6, 8, 12, and 24 hours, respectively. <br><br> Note that the maximum limit of instant recovery point retention range depends on the number of snapshots you take per day. If the snapshot count is more (for example, every *4 hours* frequency in *24 hours* duration - *6* scheduled snapshots), then the maximum allowed days for retention reduces. However, if you choose lower RPO of *12* hours, the snapshot retention is increased to *30 days*. <br><br> Learn about how to [back up an Azure VM using Enhanced policy](backup-azure-vms-enhanced-policy.md).
Back up a VM with a deprecated plan when the publisher has removed it from Azure Marketplace | Not supported. <br><br> Backup is possible. However, restore will fail. <br><br> If you've already configured backup for a VM with a deprecated virtual machine offer and encounter a restore error, see [Troubleshoot backup errors with Azure VMs](backup-azure-vms-troubleshoot.md#usererrormarketplacevmnotsupported---vm-creation-failed-due-to-market-place-purchase-request-being-not-present).

## Operating system support (Windows)

The following table summarizes the supported operating systems when you're backing up Azure VMs running Windows.

**Scenario** | **OS support**
--- | ---
Back up with the Azure VM agent extension | - Windows 11 client (64 bit only) <br/><br/> - Windows 10 client (64 bit only) <br/><br/>- Windows Server 2022 (Datacenter, Datacenter Core, and Standard)   <br/><br/>- Windows Server 2019 (Datacenter, Datacenter Core, and Standard) <br/><br/> - Windows Server 2016 (Datacenter, Datacenter Core, and Standard) <br/><br/> - Windows Server 2012 R2 (Datacenter and Standard) <br/><br/> - Windows Server 2012 (Datacenter and Standard) <br/><br/> - Windows Server 2008 R2 (RTM and SP1 Standard)  <br/><br/> - Windows Server 2008 (64 bit only)
Back up with the MARS agent | [Supported](backup-support-matrix-mars-agent.md#supported-operating-systems) operating systems
Back up with DPM or MABS | Supported operating systems for backup with [MABS](backup-mabs-protection-matrix.md) and [DPM](/system-center/dpm/dpm-protection-matrix)

Azure Backup doesn't support 32-bit operating systems.

## Support for Linux backup

Here's what's supported if you want to back up Linux machines.

**Action** | **Support**
--- | ---
Back up Linux Azure VMs with the Linux Azure VM agent | Supported for file-consistent backup.<br/><br/> Also supported for app-consistent backup that uses [custom scripts](backup-azure-linux-app-consistent.md).<br/><br/> During restore, you can create a new VM, restore a disk and use it to create a VM, or restore a disk and use it to replace a disk on an existing VM. You can also restore individual files and folders.
Back up Linux Azure VMs with the MARS agent | Not supported.<br/><br/> The MARS agent can be installed only on Windows machines.
Back up Linux Azure VMs with DPM or MABS | Not supported.
Back up Linux Azure VMs with Docker mount points | Currently, Azure Backup doesn't support exclusion of Docker mount points because these are mounted at different paths every time.

## Operating system support (Linux)

For Linux VM backups, Azure Backup supports the list of [Linux distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md). Note the following:

- Azure Backup doesn't support CoreOS Linux.
- Azure Backup doesn't support 32-bit operating systems.
- Other bring-your-own Linux distributions might work as long as the [Azure VM agent for Linux](../virtual-machines/extensions/agent-linux.md) is available on the VM, and as long as Python is supported.
- Azure Backup doesn't support a proxy-configured Linux VM if it doesn't have Python version 2.7 or later installed.
- Azure Backup doesn't support backing up Network File System (NFS) files that are mounted from storage, or from any other NFS server, to Linux or Windows machines. It backs up only disks that are locally attached to the VM.

## Support matrix for managed pre and post scripts for Linux databases

Azure Backup provides the following support for customers to author their own pre and post scripts.

|Supported database  |OS version  |Database version  |
|---------|---------|---------|
|Oracle in Azure VMs     |   [Oracle Linux](../virtual-machines/linux/endorsed-distros.md)      |    Oracle 12.x or later     |


## Backup frequency and retention

**Setting** | **Limits**
--- | ---
Maximum recovery points per protected instance (machine or workload) | 9999.
Maximum expiry time for a recovery point | No limit (99 years).
Maximum backup frequency to a vault (Azure VM extension) | Once a day.
Maximum backup frequency to a vault (MARS agent) | Three backups per day.
Maximum backup frequency to DPM or MABS | Every 15 minutes for SQL Server.<br/><br/> Once an hour for other workloads.
Recovery point retention | Daily, weekly, monthly, and yearly.
Maximum retention period | Depends on backup frequency.
Recovery points on DPM or MABS disk | 64 for file servers, and 448 for app servers.<br/><br/> Tape recovery points are unlimited for on-premises DPM.

## Supported restore methods

**Restore option** | **Details**
--- | ---
**Create a new VM** | This option quickly creates and gets a basic VM up and running from a restore point.<br/><br/> You can specify a name for the VM, select the resource group and virtual network in which it will be placed, and specify a storage account for the restored VM. The new VM must be created in the same region as the source VM.
**Restore disk** | This option restores a VM disk, which can you can then use to create a new VM.<br/><br/> Azure Backup provides a template to help you customize and create a VM. <br/><br> The restore job generates a template that you can download and use to specify custom VM settings and create a VM.<br/><br/> The disks are copied to the resource group that you specify.<br/><br/> Alternatively, you can attach the disk to an existing VM, or create a new VM by using PowerShell.<br/><br/> This option is useful if you want to customize the VM, add configuration settings that weren't there at the time of backup, or add settings that must be configured via the template or PowerShell.
**Replace existing** | You can restore a disk and use it to replace a disk on the existing VM.<br/><br/> The current VM must exist. If it has been deleted, you can't use this option.<br/><br/> Azure Backup takes a snapshot of the existing VM before replacing the disk, and it stores the snapshot in the staging location that you specify. Existing disks connected to the VM are replaced with the selected restore point.<br/><br/> The snapshot is copied to the vault and retained in accordance with the retention policy. <br/><br/> After the replace disk operation, the original disk is retained in the resource group. You can choose to manually delete the original disks if they aren't needed. <br/><br/>This option is supported for unencrypted managed VMs and for VMs [created from custom images](https://azure.microsoft.com/resources/videos/create-a-custom-virtual-machine-image-in-azure-resource-manager-with-powershell/). It's not supported for unmanaged disks and VMs, classic VMs, and [generalized VMs](../virtual-machines/windows/capture-image-resource.md).<br/><br/> If the restore point has more or fewer disks than the current VM, the number of disks in the restore point will only reflect the VM configuration.<br><br> This option is also supported for VMs with linked resources, like [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) and [Azure Key Vault](../key-vault/general/overview.md).
**Cross Region (secondary region)** | You can use cross-region restore to restore Azure VMs in the secondary region, which is an [Azure paired region](../availability-zones/cross-region-replication-azure.md).<br><br> You can restore all the Azure VMs for the selected recovery point if the backup is done in the secondary region.<br><br> This feature is available for the following options:<br> - [Create a VM](./backup-azure-arm-restore-vms.md#create-a-vm) <br> - [Restore disks](./backup-azure-arm-restore-vms.md#restore-disks) <br><br> We don't currently support the [Replace existing disks](./backup-azure-arm-restore-vms.md#replace-existing-disks) option.<br><br> Backup admins and app admins have permissions to perform the restore operation on a secondary region.
**Cross Subscription (preview)** | You can use cross-subscription restore to restore Azure managed VMs in different subscriptions.<br><br> You can restore Azure VMs or disks to any subscription (within the same tenant as the source subscription) from restore points. This is one of the Azure role-based access control (RBAC) capabilities. <br><br> This feature is available for the following options:<br> - [Create a VM](./backup-azure-arm-restore-vms.md#create-a-vm) <br> - [Restore disks](./backup-azure-arm-restore-vms.md#restore-disks) <br><br> Cross-subscription restore is unsupported for [snapshots](backup-azure-vms-introduction.md#snapshot-creation) and [secondary region](backup-azure-arm-restore-vms.md#restore-in-secondary-region) restores. It's also unsupported for [unmanaged VMs](backup-azure-arm-restore-vms.md#restoring-unmanaged-vms-and-disks-as-managed), [encrypted Azure VMs](backup-azure-vms-introduction.md#encryption-of-azure-vm-backups), and [trusted launch VMs](backup-support-matrix-iaas.md#tvm-backup).
**Cross Zonal Restore** | You can use cross-zonal restore to restore Azure zone-pinned VMs in available zones.<br><br> You can restore Azure VMs or disks to different zones (one of the Azure RBAC capabilities) from restore points. <br><br> This feature is available for the following options:<br> - [Create a VM](./backup-azure-arm-restore-vms.md#create-a-vm) <br> - [Restore disks](./backup-azure-arm-restore-vms.md#restore-disks) <br><br> Cross-zonal restore is unsupported for [snapshots](backup-azure-vms-introduction.md#snapshot-creation) of restore points. It's also unsupported for [encrypted Azure VMs](backup-azure-vms-introduction.md#encryption-of-azure-vm-backups) and [trusted launch VMs](backup-support-matrix-iaas.md#tvm-backup).

## Support for file-level restore

**Restore** | **Supported**
--- | ---
Restore files across operating systems | You can restore files on any machine that has the same OS as the backed-up VM, or a compatible OS. See the [compatible OS table](backup-azure-restore-files-from-vm.md#step-3-os-requirements-to-successfully-run-the-script).
Restore files from encrypted VMs | Not supported.
Restore files from network-restricted storage accounts | Not supported.
Restore files on VMs by using Windows Storage Spaces | Not supported.
Restore files on a Linux VM by using LVM or RAID arrays | Not supported on the same VM.<br/><br/> Restore on a compatible VM.
Restore files with special network settings | Not supported on the same VM. <br/><br/> Restore on a compatible VM.
Restore files from an ultra disk | Supported. <br/><br/>See [Azure VM storage support](#vm-storage-support).
Restore files from a shared disk, temporary drive, deduplicated disk, ultra disk, or disk with a write accelerator enabled | Not supported. <br/><br/>See [Azure VM storage support](#vm-storage-support).

## Support for VM management

The following table summarizes support for backup during VM management tasks, such as adding or replacing VM disks.

**Restore** | **Supported**
--- | ---
<a name="backup-azure-cross-subscription-restore">Restore across a subscription</a> | [Cross-subscription restore (preview)](backup-azure-arm-restore-vms.md#restore-options) is now supported in Azure VMs.
[Restore across a region](backup-azure-arm-restore-vms.md#cross-region-restore) | Supported.
<a name="backup-azure-cross-zonal-restore">Restore across a zone</a> | [Cross-zonal restore](backup-azure-arm-restore-vms.md#restore-options) is now supported in Azure VMs.
Restore to an existing VM | Use the replace disk option.
Restore a disk with a storage account enabled for Azure Storage service-side encryption (SSE) | Not supported.<br/><br/> Restore to an account that doesn't have SSE enabled.
Restore to mixed storage accounts |Not supported.<br/><br/> Based on the storage account type, all restored disks will be either premium or standard, and not mixed.
Restore a VM directly to an availability set | For managed disks, you can restore the disk and use the availability set option in the template.<br/><br/> Not supported for unmanaged disks. For unmanaged disks, restore the disk, and then create a VM in the availability set.
Restore backup of unmanaged VMs after upgrading to a managed VM| Supported.<br/><br/> You can restore disks and then create a managed VM.
Restore a VM to a restore point before the VM was migrated to managed disks | Supported.<br/><br/> You restore to unmanaged disks (default), convert the restored disks to managed disks, and create a VM with the managed disks.
Restore a VM that has been deleted | Supported.<br/><br/> You can restore the VM from a recovery point.
Restore a domain controller VM  | Supported. For details, see [Restore domain controller VMs](backup-azure-arm-restore-vms.md#restore-domain-controller-vms).
Restore a VM in a different virtual network |Supported.<br/><br/> The virtual network must be in the same subscription and region.

## VM compute support

**Compute** | **Support**
--- | ---
Back up VMs of a certain size |You can back up any Azure VM that has at least two CPU cores and 1 GB of RAM.<br/><br/> [Learn more](../virtual-machines/sizes.md).
Back up VMs in [availability sets](../virtual-machines/availability.md#availability-sets) | Supported.<br/><br/> You can't restore a VM in an availability set by using the option to quickly create a VM. Instead, when you restore the VM, restore the disk and use it to deploy a VM, or restore a disk and use it to replace an existing disk.
Back up VMs that are deployed with [Azure Hybrid Benefit](../virtual-machines/windows/hybrid-use-benefit-licensing.md) | Supported.
Back up VMs that are deployed from [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=virtual-machine-images) (published by Microsoft or a third party) |Supported.<br/><br/> The VMs must be running a supported operating system.<br/><br/> When you're recovering files on the VM, you can restore only to a compatible OS (not an earlier or later OS). We don't restore Azure Marketplace VMs backed as VMs, because these need purchase information. They're restored only as disks.
Back up VMs that are deployed from a custom image (third-party) |Supported.<br/><br/> The VMs must be running a supported operating system.<br/><br/> When you're recovering files on VMs, you can restore only to a compatible OS (not an earlier or later OS).
Back up VMs that are migrated to Azure| Supported.<br/><br/> To back up a VM, make sure that the VM agent is installed on the migrated machine.
Back up multiple VMs and provide consistency | Azure Backup doesn't provide data and application consistency across multiple VMs.
Back up a VM with [diagnostic settings](../azure-monitor/essentials/platform-logs-overview.md)  | Not supported. <br/><br/> If the restore of the Azure VM with diagnostic settings is triggered via the [Create new](backup-azure-arm-restore-vms.md#create-a-vm) option, the restore fails.
Restore zone-pinned VMs | Supported (where [availability zones](https://azure.microsoft.com/global-infrastructure/availability-zones/) are available).<br/><br/>Azure Backup now supports [restoring Azure VMs to a any availability zones](backup-azure-arm-restore-vms.md#restore-options) other than the zone that's pinned in VMs. This support enables you to restore VMs when the primary zone is unavailable.
Back up Gen2 VMs | Supported. <br><br/> Azure Backup supports backup and restore of [Gen2 VMs](https://azure.microsoft.com/updates/generation-2-virtual-machines-in-azure-public-preview/). When these VMs are restored from a recovery point, they're restored as [Gen2 VMs](https://azure.microsoft.com/updates/generation-2-virtual-machines-in-azure-public-preview/).
Back up Azure VMs with locks | Supported for managed VMs. <br><br> Not supported for unmanaged VMs.
[Restore spot VMs](../virtual-machines/spot-vms.md) | Not supported. <br><br/> Azure Backup restores spot VMs as regular Azure VMs.
[Restore VMs in an Azure dedicated host](../virtual-machines/dedicated-hosts.md) | Supported.<br></br>When you're restoring an Azure VM through the [Create new](backup-azure-arm-restore-vms.md#create-a-vm) option, the VM can't be restored in the dedicated host, even when the restore is successful. To achieve this, we recommend that you [restore as disks](backup-azure-arm-restore-vms.md#restore-disks). While you're restoring as disks by using the template, create a VM in a dedicated host, and then attach the disks.<br></br>This is not applicable in a secondary region while you're performing [cross-region restore](backup-azure-arm-restore-vms.md#cross-region-restore).
Configure standalone Azure VMs in Windows Storage Spaces | Not supported.
[Restore Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration) | Supported for the flexible orchestration model to back up and restore a single Azure VM.
Restore with managed identities | Supported for managed Azure VMs. <br><br> Not supported for classic and unmanaged Azure VMs. <br><br> Cross-region restore isn't supported with managed identities. <br><br> Currently, this is available in all Azure public and national cloud regions. <br><br> [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-managed-identities).
<a name="tvm-backup">Back up trusted launch VMs</a>    |  Backup is supported. <br><br> Backup of trusted launch VMs is supported through [Enhanced policy](backup-azure-vms-enhanced-policy.md). You can enable backup through a [Recovery Services vault](./backup-azure-arm-vms-prepare.md), the [pane for managing a VM](./backup-during-vm-creation.md#start-a-backup-after-creating-the-vm), and the [pane for creating a VM](backup-during-vm-creation.md#create-a-vm-with-backup-configured).    <br><br>   **Feature details**   <br><br> - Backup is supported in all regions where trusted launch VMs are available. <br><br> - Configuration of backups, alerts, and monitoring for trusted launch VMs is currently not supported through the backup center. <br><br> - Migration of an existing [Gen2 VM](../virtual-machines/generation-2.md) (protected with Azure Backup) to a trusted launch VM is currently not supported. [Learn how to create a trusted launch VM](../virtual-machines/trusted-launch-portal.md?tabs=portal#deploy-a-trusted-launch-vm).  <br><br> - Item-level restore is not supported.    
[Back up confidential VMs](../confidential-computing/confidential-vm-overview.md) | The backup support is in limited preview. <br><br> Backup is supported only for confidential VMs that have no confidential disk encryption and for confidential VMs that have confidential OS disk encryption through a platform-managed key (PMK). <br><br> Backup is currently not supported for confidential VMs that have confidential OS disk encryption through a customer-managed key (CMK). <br><br> **Feature details** <br><br> - Backup is supported in [all regions where confidential VMs are available](../confidential-computing/confidential-vm-overview.md#regions). <br><br> - Backup is supported only if you're using [Enhanced policy](backup-azure-vms-enhanced-policy.md). You can configure backup through the [pane for creating a VM](backup-azure-arm-vms-prepare.md), the [pane for managing a VM](backup-during-vm-creation.md#start-a-backup-after-creating-the-vm), and the [Recovery Services vault](backup-azure-arm-vms-prepare.md). <br><br> - [Cross-region restore](backup-azure-arm-restore-vms.md#cross-region-restore) and file recovery (item-level restore) for confidential VMs are currently not supported.

## VM storage support

**Component** | **Support**
--- | ---
Azure VM data disks | Support for backup of Azure VMs is up to 32 disks.<br><br> Support for backup of Azure VMs with unmanaged disks or classic VMs is up to 16 disks only.
Data disk size | Individual disk size can be up to 32 TB and a maximum of 256 TB combined for all disks in a VM.
Storage type | Standard HDD, Standard SSD, Premium SSD. <br><br>  Backup and restore of [zone-redundant storage disks](../virtual-machines/disks-redundancy.md#zone-redundant-storage-for-managed-disks) is supported.
Managed disks | Supported.
Encrypted disks | Supported.<br/><br/> Azure VMs enabled with Azure Disk Encryption can be backed up (with or without the Azure Active Directory app).<br/><br/> Encrypted VMs can't be recovered at the file or folder level. You must recover the entire VM.<br/><br/> You can enable encryption on VMs that Azure Backup is already protecting. <br><br> You can back up and restore disks encrypted via platform-managed keys or customer-managed keys. You can also assign a disk-encryption set while restoring in the same region. That is, providing a disk-encryption set while performing cross-region restore is currently not supported. However, you can assign the disk-encryption set to the restored disk after the restore is complete.
Disks with a write accelerator enabled | Azure VMs with disk backup for a write accelerator became available in all Azure public regions on May 18, 2022. If disk backup for a write accelerator is not required as part of VM backup, you can choose to remove it by using the [selective disk feature](selective-disk-backup-restore.md). <br><br>**Important** <br> Virtual machines with write accelerator disks need internet connectivity for a successful backup, even though those disks are excluded from the backup.
Disks enabled for access with a private endpoint | Not supported.
Backup and restore of deduplicated VMs or disks | Azure Backup doesn't support deduplication. For more information, see [this article](./backup-support-matrix.md#disk-deduplication-support). <br/> <br/>  Azure Backup doesn't deduplicate across VMs in the Recovery Services vault. <br/> <br/>  If there are VMs in a deduplication state during restore, the files can't be restored because the vault doesn't understand the format. However, you can successfully perform the full VM restore.
Adding a disk to a protected VM | Supported.
Resizing a disk on a protected VM | Supported.
Shared storage| Backing up VMs by using Cluster Shared Volumes (CSV) or Scale-Out File Server isn't supported. CSV writers are likely to fail during backup. On restore, disks that contain CSV volumes might not come up.
[Shared disks](../virtual-machines/disks-shared-enable.md) | Not supported.
<a name="ultra-disk-backup">Ultra disks</a> | Supported with [Enhanced policy](backup-azure-vms-enhanced-policy.md). The support is currently in preview.       <br><br>    Supported region(s) - Sweden Central, Central US, North Central US, South Central US, East US, East US 2, West US 2, West Europe and North Europe.      <br><br>    To enroll your subscription for this feature, [fill this form](https://forms.office.com/r/1GLRnNCntU).       <br><br>    - Configuration of Ultra disk protection is supported via Recovery Services vault only. This configuration is currently not supported via virtual machine blade.       <br><br>    - Cross-region restore is currently not supported for machines using Ultra disks. 
<a name="premium-ssd-v2-backup">Premium SSD v2</a> | Supported with [Enhanced policy](backup-azure-vms-enhanced-policy.md). The support is currently in preview.       <br><br>    Supported region(s) - East US, West Europe, Central US, South Central US, East US 2, West US 2 and North Europe.       <br><br>    To enroll your subscription for this feature, [fill this form](https://forms.office.com/r/h56TpTc773).       <br><br>    - Configuration of Premium v2 disk protection is supported via Recovery Services vault only. This configuration is currently not supported via virtual machine blade.       <br><br>    - Cross-region restore is currently not supported for machines using Premium v2 disks. 
[Temporary disks](../virtual-machines/managed-disks-overview.md#temporary-disk) | Azure Backup doesn't back up temporary disks.
NVMe/[ephemeral disks](../virtual-machines/ephemeral-os-disks.md) | Not supported.
[Resilient File System (ReFS)](/windows-server/storage/refs/refs-overview) restore | Supported. Volume Shadow Copy Service (VSS) supports app-consistent backups on ReFS.
Dynamic disk with spanned or striped volumes | Supported, unless you enable the selective disk feature on an Azure VM.

## VM network support

**Component** | **Support**
--- | ---
Number of network interfaces (NICs) | Supported up to the maximum number for a specific Azure VM size.<br/><br/> NICs are created when the VM is created during the restore process.<br/><br/> The number of NICs on the restored VM mirrors the number of NICs on the VM when you enabled protection. Removing NICs after you enable protection doesn't affect the count.
External or internal load balancer |Supported. <br/><br/> [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-special-configurations) about restoring VMs with special network settings.
Multiple reserved IP addresses |Supported. <br/><br/> [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-special-configurations) about restoring VMs with special network settings.
VMs with multiple network adapters| Supported. <br/><br/> [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-special-configurations) about restoring VMs with special network settings.
VMs with public IP addresses| Supported.<br/><br/> Associate an existing public IP address with the NIC, or create an address and associate it with the NIC after the restore is done.
Network security group (NSG) on a NIC or subnet |Supported.
Static IP address | Not supported.<br/><br/> A new VM that's created from a restore point is assigned a dynamic IP address.<br/><br/> For classic VMs, you can't back up a VM with a reserved IP address and no defined endpoint.
Dynamic IP address |Supported.<br/><br/> If the NIC on the source VM uses dynamic IP addressing, the NIC on the restored VM will also use it by default.
Azure Traffic Manager| Supported.<br/><br/>If the backed-up VM is in Traffic Manager, manually add the restored VM to the same Traffic Manager instance.
Azure DNS |Supported.
Custom DNS |Supported.
Outbound connectivity via HTTP proxy | Supported.<br/><br/> An authenticated proxy isn't supported.
Virtual network service endpoints| Supported.<br/><br/> Storage account settings for a firewall and a virtual network should allow access from all networks.

## Support for VM security and encryption

Azure Backup supports encryption for in-transit and at-rest data.

For network traffic to Azure:

- The Backup traffic from servers to the Recovery Services vault is encrypted via Advanced Encryption Standard 256.
- Backup data is sent over a secure HTTPS link.
- Backup data is stored in the Recovery Services vault in encrypted form.
- Only you have the encryption key to unlock this data. Microsoft can't decrypt the backup data at any point.

  > [!WARNING]
  > After you set up the vault, only you have access to the encryption key. Microsoft never maintains a copy and doesn't have access to the key. If the key is misplaced, Microsoft can't recover the backup data.

For data security:

- When you're backing up Azure VMs, you need to set up encryption *within* the virtual machine.
- Azure Backup supports Azure Disk Encryption, which uses BitLocker on virtual machines running Windows and uses *dm-crypt* on Linux virtual machines.
- On the back end, Azure Backup uses [Azure Storage service-side encryption](../storage/common/storage-service-encryption.md) to help protect data at rest.

**Machine** | **In transit** | **At rest**
--- | --- | ---
On-premises Windows machines without DPM or MABS | ![Yes][green] | ![Yes][green]
Azure VMs | ![Yes][green] | ![Yes][green]
On-premises or Azure VMs with DPM | ![Yes][green] | ![Yes][green]
On-premises or Azure VMs with MABS | ![Yes][green] | ![Yes][green]

## VM compression support

Azure Backup supports the compression of backup traffic. Note the following:

- For Azure VMs, the VM extension reads the data directly from the Azure storage account over the storage network. It isn't necessary to compress this traffic.
- If you're using DPM or MABS, you can save bandwidth by compressing the data before it's backed up.

**Machine** | **Compress to DPM/MABS (TCP)** | **Compress to vault (HTTPS)**
--- | --- | ---
On-premises Windows machines without DPM or MABS | Not applicable | ![Yes][green]
Azure VMs | Not applicable | Not applicable
On-premises or Azure VMs with DPM | ![Yes][green] | ![Yes][green]
On-premises or Azure VMs with MABS | ![Yes][green] | ![Yes][green]

## Next steps

- [Back up Azure VMs](backup-azure-arm-vms-prepare.md).
- [Back up Windows machines directly](tutorial-backup-windows-server-to-azure.md), without a backup server.
- [Set up MABS](backup-azure-microsoft-azure-backup.md) for backup to Azure, and then back up workloads to MABS.
- [Set up DPM](backup-azure-dpm-introduction.md) for backup to Azure, and then back up workloads to DPM.

[green]: ./media/backup-support-matrix/green.png
[yellow]: ./media/backup-support-matrix/yellow.png
[red]: ./media/backup-support-matrix/red.png
