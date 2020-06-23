---
title: Support matrix for Azure VM backup
description: Provides a summary of support settings and limitations when backing up Azure VMs with the Azure Backup service.
ms.topic: conceptual
ms.date: 09/13/2019
---

# Support matrix for Azure VM backup

You can use the [Azure Backup service](backup-overview.md) to back up on-premises machines and workloads, and Azure virtual machines (VMs). This article summarizes support settings and limitations when you back up Azure VMs with Azure Backup.

Other support matrices:

- [General support matrix](backup-support-matrix.md) for Azure Backup
- [Support matrix](backup-support-matrix-mabs-dpm.md) for Azure Backup server/System Center Data Protection Manager (DPM) backup
- [Support matrix](backup-support-matrix-mars-agent.md) for backup with the Microsoft Azure Recovery Services (MARS) agent

## Supported scenarios

Here's how you can back up and restore Azure VMs with the Azure Backup service.

**Scenario** | **Backup** | **Agent** |**Restore**
--- | --- | --- | ---
Direct backup of Azure VMs  | Back up the entire VM.  | No additional agent is needed on the Azure VM. Azure Backup installs and uses an extension to the [Azure VM agent](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows) that is running on the VM. | Restore as follows:<br/><br/> - **Create a basic VM**. This is useful if the VM has no special configuration such as multiple IP addresses.<br/><br/> - **Restore the VM disk**. Restore the disk. Then attach it to an existing VM, or create a new VM from the disk by using PowerShell.<br/><br/> - **Replace VM disk**. If a VM exists and it uses managed disks (unencrypted), you can restore a disk and use it to replace an existing disk on the VM.<br/><br/> - **Restore specific files/folders**. You can restore files/folders from a VM instead of from the entire VM.
Direct backup of Azure VMs (Windows only)  | Back up specific files/folders/volume. | Install the [Azure Recovery Services agent](backup-azure-file-folder-backup-faq.md).<br/><br/> You can run the MARS agent alongside the backup extension for the Azure VM agent to back up the VM at file/folder level. | Restore specific folders/files.
Back up Azure VM to backup server  | Back up files/folders/volumes; system state/bare metal files; app data to System Center DPM or to Microsoft Azure Backup Server (MABS).<br/><br/> DPM/MABS then backs up to the backup vault. | Install the DPM/MABS protection agent on the VM. The MARS agent is installed on DPM/MABS.| Restore files/folders/volumes; system state/bare metal files; app data.

Learn more about backup [using a backup server](backup-architecture.md#architecture-back-up-to-dpmmabs) and about [support requirements](backup-support-matrix-mabs-dpm.md).

>[!NOTE]
> **Azure Backup now supports selective disk backup and restore using the Azure Virtual Machine backup solution.**
>
>Today, Azure Backup supports backing up all the disks (Operating System and data) in a VM together using the Virtual Machine backup solution. With exclude-disk functionality, you get an option to backup one or a few from the many data disks in a VM. This provides an efficient and cost-effective solution for your backup and restore needs. Each recovery point contains data of the disks included in the backup operation, which further allows you to have a subset of disks restored from the given recovery point during the restore operation. This applies to restore both from the snapshot and the vault.
>
>**To sign up for the preview, write to us at AskAzureBackupTeam@microsoft.com**

## Supported backup actions

**Action** | **Support**
--- | ---
Back up a VM that's shutdown/offline VM | Supported.<br/><br/> Snapshot is crash-consistent only, not app-consistent.
Back up disks after migrating to managed disks | Supported.<br/><br/> Backup will continue to work. No action is required.
Back up managed disks after enabling resource group lock | Not supported.<br/><br/> Azure Backup can't delete the older restore points, and backups will start to fail when the maximum limit of restore points is reached.
Modify backup policy for a VM | Supported.<br/><br/> The VM will be backed up by using the schedule and retention settings in new policy. If retention settings are extended, existing recovery points are marked and kept. If they're reduced, existing recovery points will be pruned in the next cleanup job and eventually deleted.
Cancel a backup job| Supported during snapshot process.<br/><br/> Not supported when the snapshot is being transferred to the vault.
Back up the VM to a different region or subscription |Not supported.<br><br>To successfully back up, virtual machines must be in the same subscription as the vault for backup.
Backups per day (via the Azure VM extension) | One scheduled backup per day.<br/><br/>The  Azure Backup service supports up to nine on-demand backups per day, but Microsoft recommends no more than four daily on-demand backups to ensure best performance.
Backups per day (via the MARS agent) | Three scheduled backups per day.
Backups per day (via DPM/MABS) | Two scheduled backups per day.
Monthly/yearly backup| Not supported when backing up with Azure VM extension. Only daily and weekly is supported.<br/><br/> You can set up the policy to retain daily/weekly backups for monthly/yearly retention period.
Automatic clock adjustment | Not supported.<br/><br/> Azure Backup doesn't automatically adjust for daylight saving time changes when backing up a VM.<br/><br/>  Modify the policy manually as needed.
[Security features for hybrid backup](https://docs.microsoft.com/azure/backup/backup-azure-security-feature) |Disabling security features isn't supported.
Back up the VM whose machine time is changed | Not supported.<br/><br/> If the machine time is changed to a future date-time after enabling backup for that VM; However even if the time change is reverted, successful backup is not guaranteed.  

## Operating system support (Windows)

The following table summarizes the supported operating systems when backing up Windows Azure VMs.

**Scenario** | **OS support**
--- | ---
Back up with Azure VM agent extension | - Windows 10 Client (64 bit only) <br/><br/>- Windows Server 2019 (Datacenter/Datacenter Core/Standard) <br/><br/> - Windows Server 2016 (Datacenter/Datacenter Core/Standard) <br/><br/> - Windows Server 2012 R2 (Datacenter/Standard) <br/><br/> - Windows Server 2008 R2 (RTM and SP1 Standard)  <br/><br/> - Windows Server 2008 (64 bit only)
Back up with MARS agent | [Supported](backup-support-matrix-mars-agent.md#supported-operating-systems) operating systems.
Back up with DPM/MABS | Supported operating systems for backup with [MABS](backup-mabs-protection-matrix.md) and [DPM](https://docs.microsoft.com/system-center/dpm/dpm-protection-matrix?view=sc-dpm-1807).

Azure Backup doesn't support 32-bit operating systems.

## Support for Linux backup

Here's what's supported if you want to back up Linux machines.

**Action** | **Support**
--- | ---
Back up Linux Azure VMs with the Linux Azure VM agent | File consistent backup.<br/><br/> App-consistent backup using [custom scripts](backup-azure-linux-app-consistent.md).<br/><br/> During restore, you can create a new VM, restore a disk and use it to create a VM, or restore a disk and use it to replace a disk on an existing VM. You can also restore individual files and folders.
Back up Linux Azure VMs with MARS agent | Not supported.<br/><br/> The MARS agent can only be installed on Windows machines.
Back up Linux Azure VMs with DPM/MABS | Not supported.

## Operating system support (Linux)

For Azure VM Linux backups, Azure Backup supports the list of Linux [distributions endorsed by Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros). Note the following:

- Azure Backup doesn't support Core OS Linux.
- Azure Backup doesn't support 32-bit operating systems.
- Other bring-your-own Linux distributions might work as long as the [Azure VM agent for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-linux) is available on the VM, and as long as Python is supported.
- Azure Backup doesn't support a proxy-configured Linux VM if it does not have Python version 2.7 installed.

## Backup frequency and retention

**Setting** | **Limits**
--- | ---
Maximum recovery points per protected instance (machine/workload) | 9999.
Maximum expiry time for a recovery point | No limit.
Maximum backup frequency to vault (Azure VM extension) | Once a day.
Maximum backup frequency to vault (MARS agent) | Three backups per day.
Maximum backup frequency to DPM/MABS | Every 15 minutes for SQL Server.<br/><br/> Once an hour for other workloads.
Recovery point retention | Daily, weekly, monthly, and yearly.
Maximum retention period | Depends on backup frequency.
Recovery points on DPM/MABS disk | 64 for file servers, and 448 for app servers.<br/><br/> Tape recovery points are unlimited for on-premises DPM.

## Supported restore methods

**Restore option** | **Details**
--- | ---
**Create a new VM** | Quickly creates and gets a basic VM up and running from a restore point.<br/><br/> You can specify a name for the VM, select the resource group and virtual network (VNet) in which it will be placed, and specify a storage account for the restored VM. The new VM must be created in the same region as the source VM.
**Restore disk** | Restores a VM disk, which can then be used to create a new VM.<br/><br/> Azure Backup provides a template to help you customize and create a VM. <br/><br> The restore job generates a template that you can download and use to specify custom VM settings, and create a VM.<br/><br/> The disks are copied to the Resource Group you specify.<br/><br/> Alternatively, you can attach the disk to an existing VM, or create a new VM using PowerShell.<br/><br/> This option is useful if you want to customize the VM, add configuration settings that weren't there at the time of backup, or add settings that must be configured using the template or PowerShell.
**Replace existing** | You can restore a disk, and use it to replace a disk on the existing VM.<br/><br/> The current VM must exist. If it's been deleted, this option can't be used.<br/><br/> Azure Backup takes a snapshot of the existing VM before replacing the disk, and stores it in the staging location you specify. Existing disks connected to the VM are replaced with the selected restore point.<br/><br/> The snapshot is copied to the vault, and retained in accordance with the retention policy. <br/><br/> After the replace disk operation, the original disk is retained in the resource group. You can choose to manually delete the original disks if they are not needed. <br/><br/>Replace existing is supported for unencrypted managed VMs. It's not supported for unmanaged disks, [generalized VMs](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource), or for VMs [created using custom images](https://azure.microsoft.com/resources/videos/create-a-custom-virtual-machine-image-in-azure-resource-manager-with-powershell/).<br/><br/> If the restore point has more or less disks than the current VM, then the number of disks in the restore point will only reflect the VM configuration.<br><br> Replace existing isn't supported for VMs with linked resources (like [user-assigned managed-identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) or [Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)) because the backup client-app doesn't have permissions on these resources while performing the restore.
**Cross Region (secondary region)** | Cross Region restore can be used to restore Azure VMs in the secondary region, which is an [Azure paired region](https://docs.microsoft.com/azure/best-practices-availability-paired-regions#what-are-paired-regions).<br><br> You can restore all the Azure VMs for the selected recovery point if the backup is done in the secondary region.<br><br> This feature is available for the options below:<br> * [Create a VM](https://docs.microsoft.com/azure/backup/backup-azure-arm-restore-vms#create-a-vm) <br> * [Restore Disks](https://docs.microsoft.com/azure/backup/backup-azure-arm-restore-vms#restore-disks) <br><br> We don't currently support the [Replace existing disks](https://docs.microsoft.com/azure/backup/backup-azure-arm-restore-vms#replace-existing-disks) option.<br><br> Permissions<br> The restore operation on secondary region can be performed by Backup Admins and App admins.

## Support for file-level restore

**Restore** | **Supported**
--- | ---
Restoring files across operating systems | You can restore files on any machine that has the same (or compatible) OS as the backed-up VM. See the [Compatible OS table](backup-azure-restore-files-from-vm.md#system-requirements).
Restoring files from encrypted VMs | Not supported.
Restoring files from network-restricted storage accounts | Not supported.
Restoring files on VMs using Windows Storage Spaces | Restore not supported on same VM.<br/><br/> Instead, restore the files on a compatible VM.
Restore files on Linux VM using LVM/raid arrays | Restore not supported on same VM.<br/><br/> Restore on a compatible VM.
Restore files with special network settings | Restore not supported on same VM. <br/><br/> Restore on a compatible VM.

## Support for VM management

The following table summarizes support for backup during VM management tasks, such as adding or replacing VM disks.

**Restore** | **Supported**
--- | ---
Restore across subscription/region/zone. | Not supported.
Restore to an existing VM | Use replace disk option.
Restore disk with storage account enabled for Azure Storage Service Encryption (SSE) | Not supported.<br/><br/> Restore to an account that doesn't have SSE enabled.
Restore to mixed storage accounts |Not supported.<br/><br/> Based on the storage account type, all restored disks will be either premium or standard, and not mixed.
Restore VM directly to an availability set | For managed disks, you can restore the disk and use the availability set option in the template.<br/><br/> Not supported for unmanaged disks. For unmanaged disks, restore the disk, and then create a VM in the availability set.
Restore backup of unmanaged VMs after upgrading to managed VM| Supported.<br/><br/> You can restore disks, and then create a managed VM.
Restore VM to restore point before the VM was migrated to managed disks | Supported.<br/><br/> You restore to unmanaged disks (default), convert the restored disks to managed disk, and create a VM with the managed disks.
Restore a VM that's been deleted. | Supported.<br/><br/> You can restore the VM from a recovery point.
Restore a domain controller (DC) VM that is part of a multi-DC configuration through portal | Supported if you restore the disk and create a VM by using PowerShell.
Restore VM in different virtual network |Supported.<br/><br/> The virtual network must be in the same subscription and region.

## VM compute support

**Compute** | **Support**
--- | ---
VM size |Any Azure VM size with at least 2 CPU cores and 1-GB RAM.<br/><br/> [Learn more.](https://docs.microsoft.com/azure/virtual-machines/windows/sizes)
Back up VMs in [availability sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/availability#availability-sets) | Supported.<br/><br/> You can't restore a VM in an available set by using the option to quickly create a VM. Instead, when you restore the VM, restore the disk and use it to deploy a VM, or restore a disk and use it to replace an existing disk.
Back up VMs that are deployed with [Hybrid Use Benefit (HUB)](https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing) | Supported.
Back up VMs that are deployed in a [scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview) |Not supported.
Back up VMs that are deployed from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=virtual-machine-images)<br/><br/> (Published by Microsoft, third party) |Supported.<br/><br/> The VM must be running a supported operating system.<br/><br/> When recovering files on the VM, you can restore only to a compatible OS (not an earlier or later OS). We do not restore the Azure Marketplace VMs backed as VMs, as these needs purchase information but only as Disks.
Back up VMs that are deployed from a custom image (third-party) |Supported.<br/><br/> The VM must be running a supported operating system.<br/><br/> When recovering files on the VM, you can restore only to a compatible OS (not an earlier or later OS).
Back up VMs that are migrated to Azure| Supported.<br/><br/> To back up the VM, the VM agent must be installed on the migrated machine.
Back up Multi-VM consistency | Azure Backup does not provide data and application consistency across multiple VMs.
Backup with [Diagnostic Settings](https://docs.microsoft.com/azure/azure-monitor/platform/diagnostic-logs-overview)  | Unsupported. <br/><br/> If the restore of the Azure VM with diagnostic settings is triggered using [Create New](backup-azure-arm-restore-vms.md#create-a-vm) option, then the restore fails.
Restore of Zone-pinned VMs | Supported (for VM that is backed-up after Jan 2019 and where [availability zone](https://azure.microsoft.com/global-infrastructure/availability-zones/) are available).<br/><br/>We currently support restoring to the same zone that is pinned in VMs. However, if the zone is unavailable, restore fails.
Gen2 VMs | Supported <br> Azure Backup supports backup and restore of [Gen2 VMs](https://azure.microsoft.com/updates/generation-2-virtual-machines-in-azure-public-preview/). When these VMs are restored from Recovery point, they are restored as [Gen2 VMs](https://azure.microsoft.com/updates/generation-2-virtual-machines-in-azure-public-preview/).

## VM storage support

**Component** | **Support**
--- | ---
Azure VM data disks | Support for backup of Azure VMs with up to 32 disks is in public preview in [these regions](#backup-of-azure-virtual-machines-with-up-to-32-disks).<br><br> Support for backup of Azure VMs with unmanaged disks or classic VMs is up to 16 disks only.
Data disk size | Individual disk size can be up to 32 TB and a maximum of 256 TB combined for all disks in a VM.
Storage type | Standard HDD, Standard SSD, Premium SSD.
Managed disks | Supported.
Encrypted disks | Supported.<br/><br/> Azure VMs enabled with Azure Disk Encryption can be backed up (with or without the Azure AD app).<br/><br/> Encrypted VMs can't be recovered at the file/folder level. You must recover the entire VM.<br/><br/> You can enable encryption on VMs that are already protected by Azure Backup.
Disks with Write Accelerator enabled | Not supported.<br/><br/> Azure backup automatically excludes the disks with Write Accelerator (WA) enabled during backup. Since they are not backed up, you will not be able to restore these disks from Recovery-Points of the VM. <br><br> **Important note**: Virtual machines with WA disks need internet connectivity for a successful backup (even though those disks are excluded from the backup.)
Back up & Restore deduplicated VMs/disks | Azure Backup does not support deduplication. For more information, see this [article](https://docs.microsoft.com/azure/backup/backup-support-matrix#disk-deduplication-support) <br/> <br/>  - Azure Backup does not deduplicate across VMs in the Recovery Services vault <br/> <br/>  - If there are VMs in deduplication state during restore, the files can't be restored as vault does not understand the format. However, you will be able to successfully perform the full VM restore.
Add disk to protected VM | Supported.
Resize disk on protected VM | Supported.
Shared storage| Backing up VMs using Cluster Shared Volume (CSV) or Scale-Out File Server is not supported. CSV writers are likely to fail during backup. On restore, disks containing CSV volumes might not come-up.
[Shared disks](https://docs.microsoft.com/azure/virtual-machines/windows/disks-shared-enable) | Not supported.

### Backup of Azure virtual machines with up to 32 disks

Azure Backup now supports backup of Azure VMs with up to 32 attached disks.  This feature is in public preview in West Central US, Canada Central, Asia SouthEast, Brazil South, Canada East, France Central, France South, India Central, India South, Japan East, Japan West, Korea Central, Korea South, South Africa North, UK South, UK West, Australia East.  If you are interested in this feature in other regions, sign up for the limited preview by writing to us at AskAzureBackupTeam@microsoft.com.  

>[!NOTE]
>Azure Backup only supports up to 16 disks for Azure VMs with unmanaged disks or classic VMs.

## VM network support

**Component** | **Support**
--- | ---
Number of network interfaces (NICs) | Up to maximum number of NICs supported for a specific Azure VM size.<br/><br/> NICs are created when the VM is created during the restore process.<br/><br/> The number of NICs on the restored VM mirrors the number of NICs on the VM when you enabled protection. Removing NICs after you enable protection doesn't affect the count.
External/internal load balancer |Supported. <br/><br/> [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-special-configurations) about restoring VMs with special network settings.
Multiple reserved IP addresses |Supported. <br/><br/> [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-special-configurations) about restoring VMs with special network settings.
VMs with multiple network adapters| Supported. <br/><br/> [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-special-configurations) about restoring VMs with special network settings.
VMs with public IP addresses| Supported.<br/><br/> Associate an existing public IP address with the NIC, or create an address and associate it with the NIC after restore is done.
Network security group (NSG) on NIC/subnet. |Supported.
Static IP address | Not supported.<br/><br/> A new VM that's created from a restore point is assigned a dynamic IP address.<br/><br/> For classic VMs, you can't back up a VM with a reserved IP address and no defined endpoint.
Dynamic IP address |Supported.<br/><br/> If the NIC on the source VM uses dynamic IP addressing, by default the NIC on the restored VM will use it too.
Azure Traffic Manager| Supported.<br/><br/>If the backed-up VM is in Traffic Manager, manually add the restored VM to the same Traffic Manager instance.
Azure DNS |Supported.
Custom DNS |Supported.
Outbound connectivity via HTTP proxy | Supported.<br/><br/> An authenticated proxy isn't supported.
Virtual network service endpoints| Supported.<br/><br/> Firewall and virtual network storage account settings should allow access from all networks.

## VM security and encryption support

Azure Backup supports encryption for in-transit and at-rest data:

Network traffic to Azure:

- Backup traffic from servers to the Recovery Services vault is encrypted by using Advanced Encryption Standard 256.
- Backup data is sent over a secure HTTPS link.
- The backup data is stored in the Recovery Services vault in encrypted form.
- Only you have the passphrase to unlock this data. Microsoft can't decrypt the backup data at any point.

  > [!WARNING]
  > After you set up the vault, only you have access to the encryption key. Microsoft never maintains a copy and doesn't have access to the key. If the key is misplaced, Microsoft can't recover the backup data.

Data security:

- When backing up Azure VMs, you need to set up encryption *within* the virtual machine.
- Azure Backup supports Azure Disk Encryption, which uses BitLocker on Windows virtual machines and us **dm-crypt** on Linux virtual machines.
- On the back end, Azure Backup uses [Azure Storage Service encryption](../storage/common/storage-service-encryption.md), which protects data at rest.

**Machine** | **In transit** | **At rest**
--- | --- | ---
On-premises Windows machines without DPM/MABS | ![Yes][green] | ![Yes][green]
Azure VMs | ![Yes][green] | ![Yes][green]
On-premises/Azure VMs with DPM | ![Yes][green] | ![Yes][green]
On-premises/Azure VMs with MABS | ![Yes][green] | ![Yes][green]

## VM compression support

Backup supports the compression of backup traffic, as summarized in the following table. Note the following:

- For Azure VMs, the VM extension reads the data directly from the Azure storage account over the storage network. It is not necessary to compress this traffic.
- If you're using DPM or MABS, you can save bandwidth by compressing the data before it's backed up to DPM/MABS.

**Machine** | **Compress to MABS/DPM (TCP)** | **Compress to vault (HTTPS)**
--- | --- | ---
On-premises Windows machines without DPM/MABS | NA | ![Yes][green]
Azure VMs | NA | NA
On-premises/Azure VMs with DPM | ![Yes][green] | ![Yes][green]
On-premises/Azure VMs with MABS | ![Yes][green] | ![Yes][green]

## Next steps

- [Back up Azure VMs](backup-azure-arm-vms-prepare.md).
- [Back up Windows machines directly](tutorial-backup-windows-server-to-azure.md), without a backup server.
- [Set up MABS](backup-azure-microsoft-azure-backup.md) for backup to Azure, and then back up workloads to MABS.
- [Set up DPM](backup-azure-dpm-introduction.md) for backup to Azure, and then back up workloads to DPM.

[green]: ./media/backup-support-matrix/green.png
[yellow]: ./media/backup-support-matrix/yellow.png
[red]: ./media/backup-support-matrix/red.png
