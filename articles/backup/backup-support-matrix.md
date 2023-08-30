---
title: Azure Backup support matrix
description: Provides a summary of support settings and limitations for the Azure Backup service.
ms.topic: conceptual
ms.date: 08/14/2023
ms.custom: references_regions 
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for Azure Backup

You can use [Azure Backup](backup-overview.md) to back up data to the Microsoft Azure cloud platform. This article summarizes the general support settings and limitations for Azure Backup scenarios and deployments.

Other support matrices are available:

- Support matrix for [Azure virtual machine (VM) backup](backup-support-matrix-iaas.md)
- Support matrix for backup by using [System Center Data Protection Manager (DPM)/Microsoft Azure Backup Server (MABS)](backup-support-matrix-mabs-dpm.md)
- Support matrix for backup by using the [Microsoft Azure Recovery Services (MARS) agent](backup-support-matrix-mars-agent.md)

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]

## Vault support

Azure Backup uses Recovery Services vaults to orchestrate and manage backups for the following workload types - Azure VMs, SQL in Azure VMs, SAP HANA in Azure VMs, Azure File shares and on-premises workloads using Azure Backup Agent, Azure Backup Server and System Center DPM. It also uses Recovery Services vaults to store backed-up data for these workloads.

The following table describes the features of Recovery Services vaults:

**Feature** | **Details**
--- | ---
**Vaults in subscription** | Up to 500 Recovery Services vaults in a single subscription.
**Machines in a vault** | Up to 2000 datasources across all workloads (like Azure VMs, SQL Server VM, MABS Servers, and so on) can be protected in a single vault.<br><br>Up to 1,000 Azure VMs in a single vault.<br/><br/> Up to 50 MABS servers can be registered in a single vault.
**Data sources** | Maximum size of an individual [data source](./backup-azure-backup-faq.yml#how-is-the-data-source-size-determined-) is 54,400 GB. This limit doesn't apply to Azure VM backups. No limits apply to the total amount of data you can back up to the vault.
**Backups to vault** | **Azure VMs:** Once a day.<br/><br/>**Machines protected by DPM/MABS:** Twice a day.<br/><br/> **Machines backed up directly by using the MARS agent:** Three times a day.
**Backups between vaults** | Backup is within a region.<br/><br/> You need a vault in every Azure region that contains VMs you want to back up. You can't back up to a different region.
**Move vaults** | You can [move vaults](./backup-azure-move-recovery-services-vault.md) across subscriptions or between resource groups in the same subscription. However, moving vaults across regions isn't supported.
**Move data between vaults** | Moving backed-up data between vaults isn't supported.
**Modify vault storage type** | You can modify the storage replication type (either geo-redundant storage or locally redundant storage) for a vault before backups are stored. After backups begin in the vault, the replication type can't be modified.
**Private Endpoints** | See [this section](./private-endpoints.md#before-you-start) for requirements to create private endpoints for a recovery service vault.  

## On-premises backup support

Here's what's supported if you want to back up on-premises machines:

**Machine** | **What's backed up** | **Location** | **Features**
--- | --- | --- | ---
**Direct backup of Windows machine with MARS agent** | - Files, folders <br><br> - System state | Back up to Recovery Services vault. | - Back up three times a day<br/><br/> - Back up once a day. <br><br> No app-aware backup<br/><br/> Restore file, folder, volume
**Direct backup of Linux machine with MARS agent** | Backup not supported
**Back up to DPM** | Files, folders, volumes, system state, app data | Back up to local DPM storage. DPM then backs up to vault. | App-aware snapshots<br/><br/> Full granularity for backup and recovery<br/><br/> Linux supported for VMs (Hyper-V/VMware)<br/><br/> Oracle not supported
**Back up to MABS** | Files, folders, volumes, system state, app data | Back up to MABS local storage. MABS then backs up to the vault. | App-aware snapshots<br/><br/> Full granularity for backup and recovery<br/><br/> Linux supported for VMs (Hyper-V/VMware)<br/><br/> Oracle not supported

## Azure VM backup support

### Azure VM limits

**Limit** | **Details**
--- | ---
**Azure VM data disks** | See the [support matrix for Azure VM backup](./backup-support-matrix-iaas.md#vm-storage-support).
**Azure VM data disk size** | Individual disk size can be up to 32 TB and a maximum of 256 TB combined for all disks in a VM.

### Azure VM backup options

Here's what's supported if you want to back up Azure VMs:

**Machine** | **What's backed up** | **Location** | **Features**
--- | --- | --- | ---
**Azure VM backup by using VM extension** | Entire VM | Back up to vault. | Extension installed when you enable backup for a VM.<br/><br/> Back up once a day.<br/><br/> App-aware backup for Windows VMs; file-consistent backup for Linux VMs. You can configure app-consistency for Linux machines by using custom scripts.<br/><br/> Restore VM or disk.<br/><br/>[Backup and restore of Active Directory domain controllers](active-directory-backup-restore.md) is supported.<br><br> Can't back up an Azure VM to an on-premises location.
**Azure VM backup by using MARS agent** | - Files, folders <br><br> - System state | Back up to vault. | - Back up three times a day. <br><br> - Back up once a day. <br/><br/> If you want to back up specific files or folders rather than the entire VM, the MARS agent can run alongside the VM extension.
**Azure VM with DPM** | Files, folders, volumes, system state, app data | Back up to local storage of Azure VM that's running DPM. DPM then backs up to vault. | App-aware snapshots.<br/><br/> Full granularity for backup and recovery.<br/><br/> Linux supported for VMs (Hyper-V/VMware).<br/><br/> Oracle not supported.
**Azure VM with MABS** | Files, folders, volumes, system state, app data | Back up to local storage of Azure VM that's running MABS. MABS then backs up to the vault. | App-aware snapshots.<br/><br/> Full granularity for backup and recovery.<br/><br/> Linux supported for VMs (Hyper-V/VMware).<br/><br/> Oracle not supported.

## Linux backup support

Here's what's supported if you want to back up Linux machines:

**Backup type** | **Linux (Azure endorsed)**
--- | ---
**Direct backup of on-premises machine that's running Linux** | Not supported. The MARS agent can be installed only on Windows machines.
**Using agent extension to back up Azure VM that's running Linux** | App-consistent backup by using [custom scripts](backup-azure-linux-app-consistent.md).<br/><br/> File-level recovery.<br/><br/> Restore by creating a VM from a recovery point or disk.
**Using DPM to back up on-premises machines running Linux** | File-consistent backup of Linux Guest VMs on Hyper-V and VMware.<br/><br/> VM restoration of Hyper-V and VMware Linux Guest VMs.
**Using MABS to back up on-premises machines running Linux** | File-consistent backup of Linux Guest VMs on Hyper-V and VMware.<br/><br/> VM restoration of Hyper-V and VMware Linux guest VMs.
**Using MABS or DPM to back up Linux Azure VMs** | Not supported.

## Daylight saving time support

Azure Backup doesn't support automatic clock adjustment for daylight saving time for Azure VM backups. It doesn't shift the hour of the backup forward or backwards. To ensure the backup runs at the desired time, modify the backup policies manually as required.

## Disk deduplication support

Disk deduplication support is as follows:

- Disk deduplication is supported on-premises when you use DPM or MABS to back up Hyper-V VMs that are running Windows. Windows Server performs data deduplication (at the host level) on virtual hard disks (VHDs) that are attached to the VM as backup storage.
- Deduplication isn't supported in Azure for any Backup component. When DPM and MABS are deployed in Azure, the storage disks attached to the VM can't be deduplicated.

>[!Note]
>Azure VM backup does not support Azure VM with deduplication. This means Azure Backup does not deduplicate backup data, except in MABS/MARS.

## Security and encryption support

Azure Backup supports encryption for in-transit and at-rest data.

### Network traffic to Azure

- The backup traffic from servers to the Recovery Services vault is encrypted by using Advanced Encryption Standard 256.
- Backup data is sent over a secure HTTPS link.

### Data security

- Backup data is stored in the Recovery Services vault in encrypted form.
- When data is backed-up from on-premises servers with the MARS agent, data is encrypted with a passphrase before upload to the Azure Backup service and decrypted only after it's downloaded from Azure Backup.
- When you're backing up Azure VMs, you need to set up encryption *within* the virtual machine.
- Azure Backup supports Azure Disk Encryption, which uses BitLocker on Windows virtual machines and **dm-crypt** on Linux virtual machines.
- On the back end, Azure Backup uses [Azure Storage Service Encryption](../storage/common/storage-service-encryption.md), which protects data at rest.

**Machine** | **In transit** | **At rest**
--- | --- | ---
**On-premises Windows machines without DPM/MABS** | ![Yes][green] | ![Yes][green]
**Azure VMs** | ![Yes][green] | ![Yes][green]
**On-premises Windows machines or Azure VMs with DPM** | ![Yes][green] | ![Yes][green]
**On-premises Windows machines or Azure VMs with MABS** | ![Yes][green] | ![Yes][green]

## Compression support

Backup supports the compression of backup traffic, as summarized in the following table.

- For Azure VMs, the VM extension reads the data directly from the Azure storage account over the storage network, so it isn't necessary to compress this traffic.
- If you're using DPM or MABS, you can save bandwidth by compressing the data before it's backed up.

**Machine** | **Compress to MABS/DPM (TCP)** | **Compress to vault (HTTPS)**
--- | --- | ---
**Direct backup of on-premises Windows machines** | NA | ![Yes][green]
**Backup of Azure VMs by using VM extension** | NA | NA
**Backup on on-premises/Azure machines by using MABS/DPM** | ![Yes][green] | ![Yes][green]

## Retention limits

**Setting** | **Limits**
--- | ---
**Maximum recovery points per protected instance (machine or workload)** | 9,999
**Maximum expiry time for a recovery point** | No limit
**Maximum backup frequency to DPM/MABS** | Every 15 minutes for SQL Server<br/><br/> Once an hour for other workloads
**Maximum backup frequency to vault** | **On-premises Windows machines or Azure VMs running MARS:** Three per day<br/><br/> **DPM/MABS:** Two per day<br/><br/> **Azure VM backup:** One per day
**Recovery point retention** | Daily, weekly, monthly, yearly
**Maximum retention period** | Depends on backup frequency
**Recovery points on DPM/MABS disk** | 64 for file servers; 448 for app servers <br/><br/>Unlimited tape recovery points for on-premises DPM

## Cross Region Restore

Azure Backup has added the Cross Region Restore feature to strengthen data availability and resiliency capability, giving you full control to restore data to a secondary region. To configure this feature, see [Set Cross Region Restore](backup-create-rs-vault.md#set-cross-region-restore). This feature is supported for the following management types:

| Backup Management type | Supported                                                    | Supported Regions |
| ---------------------- | ------------------------------------------------------------ | ----------------- |
| Azure VM               | Supported for Azure VMs (including encrypted Azure VMs) with both managed and unmanaged disks. Not supported for classic VMs. | Available in all Azure public regions and sovereign regions, except for UG IOWA. |
| SQL /SAP HANA | Available      | Available in all Azure public regions and sovereign regions, except for France Central and UG IOWA. |
| MARS Agent (Preview)  | Available in preview. <br><br> Not supported for vaults with Private Endpoint enabled.       | Available in all Azure public regions.   |
| DPM/MABS | No                        |                      N/A                   |
| AFS (Azure file shares)                 | No                                                           | N/A               |

## Resource health

The resource health check functions in following conditions:

| Resource health check    | Details    |
| --- | --- |
| **Supported Resources** | Recovery Services vault, Backup vault |
| **Supported Regions** | - Recovery Services vault: Supported in all Azure public regions, US Sovereign cloud, and China Sovereign cloud. <br><br> - Backup vault: Supported in all Azure public regions, except Sovereign clouds. |
| **For unsupported regions** | The resource health status is shown as "Unknown". |

## Zone-redundant storage support

Azure Backup now supports zone-redundant storage (ZRS).

### Supported regions

- Azure Backup currently supports ZRS for all workloads, except Azure Disk, in the following regions: UK South, South East Asia, Australia East, North Europe, Central US, East US 2, Brazil South, South Central US, Korea Central, Norway East, France Central, West Europe, East Asia, Sweden Central, Canada Central, India Central, South Africa North, West US 2, Japan East, East US, US Gov Virginia, Switzerland North, Qatar, UAE North, and West US 3.

- ZRS support for Azure Disk is generally available in the following regions: UK South, Southeast Asia, Australia East, North Europe, Central US, South Central US, West Europe, West US 2, Japan East, East US, US Gov Virginia, Qatar, and West US 3.

### Supported scenarios

Here's the list of scenarios supported even if zone gets unavailable in the supported regions:

- Create/List/Update Policy
- List backup jobs
- List of protected items
- Update vault config
- Create vault
- Get vault credential file

### Supported operations

The following table lists the workload specific operations supported even if zone gets unavailable in the supported regions:

| Protected workload | Supported Operations |
| --- | --- |
| **IAAS VM** | - Backups are successful, if the protected VM is in an active zone. <br><br> - Original location recovery (OLR) is successful, if the protected VM is in an active zone. <br><br> - Alternate location restores (ALR) to an active zone is successful. |
| **SQL/ SAP HANA database in Azure VM** | - Backups are successful, if the protected workload is in an active zone. <br><br> - Original location recovery (OLR) is successful, if the protected workload is in an active zone. <br><br> - Alternate location restores (ALR) to an active zone is successful. |
| **Azure Files** | Backups, OLR, and ALR are successful, if the protected file share is in a ZRS account. |
| **Blob** | Recovery is successful, if the protected storage account is in ZRS. |
| **Disk** | - Backups are successful, if the protected disk is in an active zone. <br><br> - Restore to an active zone is successful. |
| **MARS** | Backups and restores are successful. |

## Next steps

- [Review support matrix](backup-support-matrix-iaas.md) for Azure VM backup.

[green]: ./media/backup-support-matrix/green.png
[yellow]: ./media/backup-support-matrix/yellow.png
[red]: ./media/backup-support-matrix/red.png
