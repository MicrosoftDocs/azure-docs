---
title: SAP ASE Backup support matrix
description: In this article, learn about the supported scenarios and limitations when you use Azure Backup to back up SAP ASE databases on Azure VMs.
ms.topic: reference
ms.custom:
  - references_regions
  - ignite-2024
  - build-2025
ms.date: 05/13/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Support matrix for backup of SAP ASE databases on Azure VMs

This article summarizes the scenarios supported and limitations present when you use Azure Backup to back up SAP Adaptive Server Enterprise (ASE) (Sybase) databases on Azure VMs.

> [!NOTE]
> The frequency of log backup can now be set to a minimum of 15 minutes. Log backups only begin to flow after a successful full backup for the database.

## Scenario support for SAP ASE (Sybase) databases on Azure VMs

| **Scenario** | **Supported  configurations** | **Unsupported  configurations** |
| ------- | -------- | -------- |
| **Topology** | SAP ASE Database running in Azure Linux VMs only. | Windows |
| **Regions**                   | **Americas** – Central US, East US 2, East US, North Central US, South Central US, West US 2, West US 3, West Central US, West US, Canada Central, Canada East, Brazil South <br> **Asia Pacific** – Australia Central, Australia Central 2, Australia East, Australia Southeast, Japan East, Japan West, Korea Central, Korea South, East Asia, Southeast Asia, Central India, South India, West India, China East, China East 2, China East 3, China North, China North 2, China North 3 <br> **Europe** – West Europe, North Europe, France Central, UK South, UK West, Germany North, Germany West Central, Switzerland North, Switzerland West, Central Switzerland North, Norway East, Norway West, Sweden Central, Sweden South <br> **Africa / ME** - South Africa North, South Africa West, UAE North, UAE Central  <BR>  **Azure Government regions** | France South, Germany Central, Germany Northeast, US Gov IOWA |
| **OS versions** | SLES 12 with SP0, SP1, SP2, SP3, SP4, and SP5; SLES 15 with SP0, SP1, SP2, SP3, SP4, and SP5, 15.6 <br><br> RHEL 7.1, 7.2, 7.3, 7.4, 7.6, 7.7, 7.9, 8.1, 8.2, 8.3, 8.4,8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 9.2 |  |
| **ASE versions** | SAP Adaptive Server Enterprise 16.0 SP02, SP03, SP04 |  |
| **ASE Instances** | A single SAP ASE instance on a single Azure Virtual Machine (VM). <br><br> Multi SID on single VM. | HA on single VM isn't currently supported. |
| **Backup types** | Full, Differential, and Log backups. | Incremental, archival support is currently not available. |
| **Restore types** | ALR-Alternate Location Restore, OLR-Original Location Restore (In-Place), Restore as Files.  |  |
| **Cross Subscription Restore** | Supported via the Azure portal.<br>Cross Subscription Restore to Paired Region. |  Region of Choice isn't supported. |
| **Number of full backups per day** | One scheduled backup. <br><br> Three on-demand backups. <br> <br> We recommend not to trigger more than three backups per day. However, to allow user retries for failed attempts, hard limit for on-demand backups is set to nine attempts. |
| **ASE deployments** | Standalone, Multi SID on Single VM. | HA on Single VM. |
| **Compression** | You can enable ASE Native compression via the Backup policy and when you take an on-demand Backup/Backup Now. In Preregistration Script, Compression Level is set to **Level 101** for Optimal results. |  |
| **Striping Support** | You can increase your  backup throughput by enabling Striping configuration, which needs to be set in **Preregistration script** –  refer parameters **enable-striping** - Set to **true** and **stripesCount** set to 4 by Default and can be adjusted.  | |
| **Azure CLI/PowerShell** |  | Azure CLI/PowerShell support is currently not available. |
| **Security Capabilities** | Immutability, Soft Delete, MUA, Private Endpoint, and Encryption at rest are supported. | |

>[!NOTE]
>- Azure Backup doesn’t automatically adjust for daylight saving time changes when backing up an SAP ASE (Sybase) database running in an Azure VM. We recommend you to modify the policy manually as needed.
>- You can now monitor the backup and restore jobs (to the same machine) triggered from ASE native clients (SAP ASE Studio/Cockpit/DBA Cockpit) in the Azure portal.

## Support for multistreaming data backups

- **Parameters to enable SAP ASE settings for multistreaming**: 
  - *parallel_data_backup_backint_channels*
  - *data_backup_buffer_size (optional)*

  >[!Note]
  >The previous ASE parameters lead to increased memory and CPU utilization. We recommend that you monitor the memory consumption and CPU utilization as overutilization might negatively impact the backup and other ASE operations.

- **Backup performance for databases**: The performance gain becomes more prominent for larger databases.

- **Database size applicable for multistreaming**: The number of multistreaming channels applies to all data backups *larger than 128 GB*. Data backups smaller than 128 GB always use only one channel.

- **Supported backup throughput**: Multistreaming currently supports the data backup throughput of up to *1.5 GBps*. Recovery throughput is slower than the backup throughput.

- **VM configuration applicable for multistreaming**: To utilize the benefits of multistreaming, the VM needs to have a minimum configuration of *16 vCPUs* and *128 GB* of RAM.
- **Limiting factors**: Throughput of *total disk Logical Volume Management (LVM) striping* and *VM network*, whichever hits first. 

Learn more [about SAP ASE (Sybase) Azure Virtual Machine storage and SAP ASE (Sybase) Azure virtual machine Premium SSD storage configurations](sap-ase-database-backup.md). To configure multistreaming data backups, see the [SAP documentation](https://help.sap.com/docs/SAP_ASE_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/18db704959a24809be8d01cc0a409681.html).


## Support for multiple SAP ASE instances on a single host

Azure Backup now enables seamless backups for multiple ASE (Sybase) database instances on Azure VMs, utilizing Multi-SID support. This advancement is particularly useful for shared VM environments, such as non-production setups, where multiple users require efficient data protection and recovery. SAP ASE Multi-SID support includes the following configurations:

| Sap ASE instance | Support |
| --- |--- |
| Standalone (SID1) + Standalone (SID2) | Supported |
| HA (SID1) + Standalone (SID2) | Supported |
| HA (SID1) + HA (SID2)| Supported |

***SID1 (HXE) and SID2 (HYE) represent two ASE instances running on the same host.**

The following table lists the required parameters for adding/removing SAP ASE instances:

| Action | Parameter | Description | Example script |
| --- | --- | --- | --- |
| Add an instance | `--sid` | SAP ASE database instance that you want to protect. <br><br> By default, the first instance is selected. | `./PreReg.sh  --add --sid HXE` <br><br> Or <br><br> `./PreReg.sh --sid HXE` <br><br> (Default mode is `add` for the script.) <br><br> After you add instances, registration needs to be done on recovery services vault. If a new instance is added later, re-registration is required. |
|    | `sudo` | Add a `SID` from the **Config** file. | `"<Path_to_the_Pre-Reg_Script" -aw SAPAse --sid "<SID>" --sid-user "<sidUser>" --db-port "<dbPort>" --db-user <dbUser> --db-host "<dbHost>" --enable-striping <true/false> --skip-network-checks` |
| Remove an instance | `--sid` | SAP ASE database instance that you want to remove protection from. <br><br> SID is a mandate parameter for remove. | `./PreReg.sh --remove --sid HXE` |
|    | `sudo` | Remove a `SID` from the **Config** file. | `"<Path_to_the_Pre-Reg_Script" -aw SAPAse --sid "<SID>" --sid-user "<sidUser>" --db-port "<dbPort>" --db-user <dbUser> --db-host "<dbHost>" --enable-striping <true/false> --skip-network-checks --remove` |
|    | `--dbHost` | The private IP of the specific SID instance that you intend to register. <br><br> In multi-instance setups, each System ID (SID) might have a different private IP. Use the IP available in `/sybase/<SID>/interfaces` for the correct instance. |     |


>[!Note]
>If you have the preregistration script already installed, update the script name by running the following bash command:
>
> `sudo ./<script name> -us`


## Next steps

- [Configure backup for SAP ASE (Sybase) databases on Azure VMs using Azure portal](sap-ase-database-backup.md).
- [Restore SAP ASE database on Azure VMs using Azure portal](sap-ase-database-restore.md).
- [Manage and monitor backed-up SAP ASE database using Azure portal](sap-ase-database-manage.md).
- [Quickstart: Run the preregistration script for SAP ASE (Sybase) database backup in Azure Cloud Shell](sap-ase-database-backup-run-preregistration-quickstart.md).
- [Tutorial: Back up SAP ASE (Sybase) database using Azure Business Continuity Center](sap-ase-database-backup-tutorial.md).
- [Troubleshoot SAP ASE (Sybase) database backup](troubleshoot-sap-ase-sybase-database-backup.md).
