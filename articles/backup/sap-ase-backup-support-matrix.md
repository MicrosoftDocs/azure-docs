---
title: SAP ASE Backup support matrix
description: In this article, learn about the supported scenarios and limitations when you use Azure Backup to back up SAP ASE databases on Azure VMs.
ms.topic: reference
ms.date: 11/12/2024
ms.custom: references_regions 
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for backup of SAP ASE databases on Azure VMs

Azure Backup supports the backup of SAP Adaptive Server Enterprise (ASE) (Sybase) databases to Azure. This article summarizes the scenarios supported and limitations present when you use Azure Backup to back up SAP ASE (Sybase) databases on Azure VMs.

> [!NOTE]
> The frequency of log backup can now be set to a minimum of 15 minutes. Log backups only begin to flow after a successful full backup for the database has completed.

## Scenario support

| **Scenario** | **Supported  configurations** | **Unsupported  configurations** |
| ------- | -------- | -------- |
| **Topology** | SAP ASE Database running in Azure Linux VMs only | Windows |
| **Regions** | **Americas** – Central US, East US 2, East US, North Central US, South Central US, West US 2, West US 3, West Central US, West US, Canada Central, Canada East, Brazil South. <br> **Asia Pacific** – Australia Central, Australia Central 2, Australia East, Australia Southeast, Japan East, Japan West, Korea Central, Korea South, East Asia, Southeast Asia, Central India, South India, West India. <br> **Europe** – West Europe, North Europe, France Central, UK South, UK West, Germany North, Germany West Central, Switzerland North, Switzerland West, Central Switzerland North, Norway East, Norway West, Sweden Central, Sweden South. <br> **Africa/ME** - South Africa North, South Africa West, UAE North, UAE Central. | France South, Germany Central, Germany Northeast, US Gov IOWA, Azure Gov, China East, China East 2, China East 3, China North, China North 2, China North 3. |
| **OS versions** | SLES 12 with SP0, SP1, SP2, SP3, SP4, and SP5; SLES 15 with SP0, SP1, SP2, SP3, SP4, and SP5 <br><br> RHEL 7.1, 7.2, 7.3, 7.4, 7.6, 7.7, 7.9, 8.1, 8.2, 8.3, 8.4,8.5, 8.6, 8.7, 8.8, 8.9, 8.10|  |
| **ASE versions** | SAP Adaptive Server Enterprise 16.0 SP02, SP03, SP04 |  |
| **ASE Instances** | A single SAP ASE instance on a single Azure VM | HA and multi SID on single VM isn't supported for public preview. |
| **Backup types** | Full, Differential, and Log backups | Incremental, archival support from GA |
| **Restore types** | ALR-Alternate Location Restore, OLR-Original Location Restore (In-Place), Restore as Files  |  |
| **Cross Subscription Restore** | Supported via the Azure portal <br>
Cross Subscription Restore to Paired Region |  Region of Choice isn't supported |
| **Number of full backups per day** | One scheduled backup. <br><br> Three on-demand backups. <br> <br> We recommend not to trigger more than three backups per day. However, to allow user retries in case of failed attempts, hard limit for on-demand backups is set to nine attempts. |
| **ASE deployments** | Standalone | HA, Multi SID on Single VM |
| **Compression** | You can enable ASE Native compression via the Backup policy and when you take Adhoc Backup/Backup Now. In Preregistration Script – Compression Level is set to **Level 101** for Optimal results. |  |
| **Striping Support** | You can increase your  backup throughput by enabling Striping configuration, which needs to be set in **Preregistration script** –  refer parameters **enable-striping** - Set to **true** and **stripesCount** set to 4 by Default and can be adjusted.  | |
| **Azure CLI PowerShell** |  | Azure CLI/PowerShell support will be from GA release. |
| **Security Capabilities** | Immutability, Soft Delete, MUA, Private Endpoint, Encryption at rest are supported. | |

>[!NOTE]
>- Azure Backup doesn’t automatically adjust for daylight saving time changes when backing up a SAP ASE (Sybase) database running in an Azure VM. We recommend you to modify the policy manually as needed.
>- You can now monitor the backup and restore jobs (to the same machine) triggered from ASE native clients (SAP ASE Studio/Cockpit/DBA Cockpit) in the Azure portal.

## Support for multistreaming data backups

- **Parameters to enable SAP ASE settings for multistreaming**: 
  - *parallel_data_backup_backint_channels*
  - *data_backup_buffer_size (optional)*

  >[!Note]
  >By setting the above ASE parameters will lead to increased memory and CPU utilization. We recommend that you monitor the memory consumption and CPU utilization as overutilization might negatively impact the backup and other ASE operations.

- **Backup performance for databases**: The performance gain will be more prominent for larger databases.

- **Database size applicable for multistreaming**: The number of multistreaming channels applies to all data backups *larger than 128 GB*. Data backups smaller than 128 GB always use only one channel.

- **Supported backup throughput**: Multistreaming currently supports the data backup throughput of up to *1.5 GBps*. Recovery throughput is slower than the backup throughput.

- **VM configuration applicable for multistreaming**: To utilize the benefits of multistreaming, the VM needs to have a minimum configuration of *16 vCPUs* and *128 GB* of RAM.
- **Limiting factors**: Throughput of *total disk LVM striping* and *VM network*, whichever hits first. 

Learn more about SAP ASE (Sybase) Azure Virtual Machine storage and SAP ASE (Sybase) Azure virtual machine Premium SSD storage configurations. To configure multistreaming data backups, see the [SAP documentation](https://help.sap.com/docs/SAP_ASE_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/18db704959a24809be8d01cc0a409681.html).


## Next steps

* Learn how to backup SAP ASE (Sybase) databases running on Azure VMs.
* Learn how to restore SAP ASE (Sybase) databases running on Azure VMs
* Learn how to manage SAP ASE (Sybase) databases that are backed up using Azure Backup.
* Learn how to troubleshoot common issues when backing up SAP ASE (Sybase) databases.
