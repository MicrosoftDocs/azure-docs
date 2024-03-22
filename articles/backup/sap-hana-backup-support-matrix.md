---
title: SAP HANA Backup support matrix
description: In this article, learn about the supported scenarios and limitations when you use Azure Backup to back up SAP HANA databases on Azure VMs.
ms.topic: conceptual
ms.date: 01/30/2024
ms.custom: references_regions 
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for backup of SAP HANA databases on Azure VMs

Azure Backup supports the backup of SAP HANA databases to Azure. This article summarizes the scenarios supported and limitations present when you use Azure Backup to back up SAP HANA databases on Azure VMs.

> [!NOTE]
> The frequency of log backup can now be set to a minimum of 15 minutes. Log backups only begin to flow after a successful full backup for the database has completed.

## Scenario support

| **Scenario**               | **Supported  configurations**                                | **Unsupported  configurations**                              |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Topology**               | SAP HANA running in Azure Linux  VMs only                    | HANA Large Instances (HLI)                                   |
| **Regions**                   | **Americas** – Central US, East US 2, East US, North Central US, South Central US, West US 2, West US 3, West Central US, West US, Canada Central, Canada East, Brazil South <br> **Asia Pacific** – Australia Central, Australia Central 2, Australia East, Australia Southeast, Japan East, Japan West, Korea Central, Korea South, East Asia, Southeast Asia, Central India, South India, West India, China East, China East 2, China East 3, China North, China North 2, China North 3 <br> **Europe** – West Europe, North Europe, France Central, UK South, UK West, Germany North, Germany West Central, Switzerland North, Switzerland West, Central Switzerland North, Norway East, Norway West, Sweden Central, Sweden South <br> **Africa / ME** - South Africa North, South Africa West, UAE North, UAE Central  <BR>  **Azure Government regions** | France South, Germany Central, Germany Northeast, US Gov IOWA |
| **OS versions**            | SLES 12 with SP2, SP3, SP4 and SP5; SLES 15 with SP0, SP1, SP2, SP3, SP4, and SP5 <br><br>  RHEL 7.4, 7.6, 7.7, 7.9, 8.1, 8.2, 8.4, 8.6, 8.8, 9.0, and 9.2.               |                                             |
| **HANA versions**          | SDC on HANA 1.x, MDC on HANA 2.x SPS 04, SPS 05 Rev <= 59, SPS 06 (validated for encryption enabled scenarios as well), and SPS 07.      |                                                            |
| **Encryption** | SSLEnforce, HANA data encryption |            |
| **HANA Instances**         | A single SAP HANA instance on a  single Azure VM – scale up only | Multiple SAP HANA instances on a  single VM. You can protect only one of these multiple instances at a time.                  |
| **HANA database types**    | Single Database Container (SDC)  ON 1.x, Multi-Database Container (MDC) on 2.x | MDC in HANA 1.x                                              |
| **HANA database size**     | HANA database of size upto 40 TB (this isn't the memory size of the HANA system).               |                                                              |
| **Backup types**           | Full, Differential, Incremental and Log backups, Snapshots |                                      |
| **Restore types**          | Refer to the SAP HANA Note [1642148](https://launchpad.support.sap.com/#/notes/1642148) to learn about the supported restore types |                                                              |
| **Cross Subscription Restore** | Supported via the Azure portal and Azure CLI. [Learn more](sap-hana-database-restore.md#cross-subscription-restore). |          |
| **Number of full backups per day**     |   One scheduled backup.  <br><br>   Three on-demand backups. <br><br> We recommend not to trigger more than three backups per day. However, to allow user retries in case of failed attempts, hard limit for on-demand backups is set to nine attempts.  |
| **HANA deployments** | HANA System Replication (HSR) |           |
| **Special configurations** |                                                              | SAP HANA + Dynamic Tiering <br>  Cloning through LaMa        |
| **Compression** | You can enable HANA Native compression via the Backup policy. [See the SAP HANA document](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/86943e9f8d5343c59577755edff8296b.html). |       |
| **Multi-streaming backup** | You can increase your streaming backup throughput from *420 MBps* to *1.5 GBps*. [Learn more](#support-for-multistreaming-data-backups). |      |

------

>[!NOTE]
>Azure Backup doesn’t automatically adjust for daylight saving time changes when backing up a SAP HANA database running in an Azure VM.
>
>Modify the policy manually as needed.

> [!NOTE]
> You can now [monitor the backup and restore](./sap-hana-db-manage.md#monitor-manual-backup-jobs-in-the-portal) jobs (to the same machine) triggered from HANA native clients (SAP HANA Studio/ Cockpit/ DBA Cockpit) in the Azure portal.

## Support for multistreaming data backups

- **Supported HANA versions**: SAP HANA 2.0 SP05 and prior.
- **Parameters to enable SAP HANA settings for multistreaming**: 
  - *parallel_data_backup_backint_channels*
  - *data_backup_buffer_size (optional)*

  >[!Note]
  >By setting the above HANA parameters will lead to increased memory and CPU utilization. We recommend that you monitor the memory consumption and CPU utilization as overutilization might negatively impact the backup and other HANA operations.

- **Backup performance for databases**: The performance gain will be more prominent for larger databases.

- **Database size applicable for multistreaming**: The number of multistreaming channels applies to all data backups *larger than 128 GB*. Data backups smaller than 128 GB always use only one channel.

- **Supported backup throughput**: Multistreaming currently supports the data backup throughput of up to *1.5 GBps*. Recovery throughput is slower than the backup throughput.

- **VM configuration applicable for multistreaming**: To utilize the benefits of multistreaming, the VM needs to have a minimum configuration of *16 vCPUs* and *128 GB* of RAM.
- **Limiting factors**: Throughput of *total disk LVM striping* and *VM network*, whichever hits first. 

Learn more about [SAP HANA Azure Virtual Machine storage](/azure/sap/workloads/hana-vm-operations-storage) and [SAP HANA Azure virtual machine Premium SSD storage configurations](/azure/sap/workloads/hana-vm-premium-ssd-v1) configurations. To configure multistreaming data backups, see the [SAP documentation](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/18db704959a24809be8d01cc0a409681.html).



## Next steps

* Learn how to [backup SAP HANA databases running on Azure VMs](./backup-azure-sap-hana-database.md)
* Learn how to [restore SAP HANA databases running on Azure VMs](./sap-hana-db-restore.md)
* Learn how to [manage SAP HANA databases that are backed up using Azure Backup](sap-hana-db-manage.md)
* Learn how to [troubleshoot common issues when backing up SAP HANA databases](./backup-azure-sap-hana-database-troubleshoot.md)
