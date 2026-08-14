---
title: SAP HANA Backup support matrix
description: In this article, learn about the supported scenarios and limitations when you use Azure Backup to back up SAP HANA databases on Azure VMs.
ms.topic: reference
ms.date: 07/16/2026
ms.custom: references_regions 
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a database administrator, I want to understand the support matrix for backing up SAP HANA on Azure VMs, so that I can ensure compliance with supported configurations and optimize my backup strategy.
---

# Support matrix for backup of SAP HANA databases on Azure VMs

Azure Backup supports the backup of SAP HANA databases to Azure. This article summarizes the scenarios supported and limitations present when you use Azure Backup to back up SAP HANA databases on Azure VMs. For common questions, see the [frequently asked questions](sap-hana-faq-backup-azure-vm.yml).


Linux distributions listed below shouldn't be in an End-of-Life (EOL) state by their vendors. Make sure the distribution version is current, active, and supported.

> [!NOTE]
> The frequency of log backup can now be set to a minimum of 15 minutes. Log backups only begin to flow after a successful full backup for the database has completed.

## Scenario support

| **Scenario**               | **Supported  configurations**                                | **Unsupported  configurations**                              |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Topology**               | SAP HANA running in Azure Linux  VMs only                    | HANA Large Instances (HLI)                                   |
| **Regions**                   | **Americas** – Central US, East US 2, East US, North Central US, South Central US, West US 2, West US 3, West Central US, West US, Canada Central, Canada East, Brazil South <br> **Asia Pacific** – Australia Central, Australia Central 2, Australia East, Australia Southeast, Japan East, Japan West, Korea Central, Korea South, East Asia, Southeast Asia, Central India, South India, West India, China East, China East 2, China East 3, China North, China North 2, China North 3 <br> **Europe** – West Europe, North Europe, France Central, UK South, UK West, Germany North, Germany West Central, Switzerland North, Switzerland West, Central Switzerland North, Norway East, Norway West, Sweden Central, Sweden South <br> **Africa / ME** - South Africa North, South Africa West, UAE North, UAE Central  <BR>  **Azure Government regions** | France South, Germany Central, Germany Northeast, US Gov IOWA |
| **OS versions**            | SLES 12 with SP2, SP3, SP4, and SP5; SLES 15 with SP0, SP1, SP2, SP3, SP4, SP5, SP6, and SP7 <br><br>  RHEL 8.1, 8.2, 8.4, 8.6, 8.8, 8.10, 9.0, 9.2, 9.4, and 9.6               |                                             |
| **HANA versions**          | SDC on HANA 1.x, MDC on HANA 2.x SPS 04, SPS 05 Rev <= 59, SPS 06 (validated for encryption enabled scenarios as well), SPS 07, and SPS 08.      |                                                            |
| **Encryption** | SSLEnforce, HANA data encryption |            |
| **HANA Instances**         | - A single SAP HANA instance on a  single Azure VM – scale up only. <br><br> - Multiple SAP HANA instances on a  single VM. You can protect only one of these multiple instances at a time. |                            |
| **HANA database types**    | Single Database Container (SDC)  ON 1.x, Multi-Database Container (MDC) on 2.x | MDC in HANA 1.x                                              |
| **HANA database size**     | HANA database of size upto 40 TB (this isn't the memory size of the HANA system).               |                                                              |
| **Backup types**           | Full, Differential, Incremental and Log backups, Snapshots (Standard policy: Generally Available; Enhanced policy: Preview) |                                      |
| **Restore types**          | Refer to the SAP HANA Note [1642148](https://launchpad.support.sap.com/#/notes/1642148) to learn about the supported restore types |                                                              |
| **Cross Subscription Restore** | Supported via the Azure portal and Azure CLI. [Learn more](sap-hana-database-restore.md#cross-subscription-restore). |          |
| **Number of full backups per day**     |   One scheduled backup.  <br><br>   Three on-demand backups. <br><br> We recommend not to trigger more than three backups per day. However, to allow user retries in case of failed attempts, hard limit for on-demand backups is set to nine attempts.  |
| **HANA deployments** | HANA System Replication (HSR) - Streaming Backup,  Instance snapshot backup(Preview with Enhanced policy) <br><br> HANA Scale-out system - Streaming backup (Preview) |           |
| **Special configurations** |                                                              | SAP HANA + Dynamic Tiering <br>  Cloning through LaMa        |
| **Compression** | You can enable HANA Native compression via the Backup policy. [See the SAP HANA document](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/86943e9f8d5343c59577755edff8296b.html). |       |
| **Multi-streaming backup** | You can increase your streaming backup throughput from *420 MBps* to *1.5 GBps*. [Learn more](#support-for-multistreaming-data-backups). |      |
| **File System types** | File Systems `ext3` and `xfs` are supported for SAP HANA database instance snapshots backup. | Other File Systems aren't supported. |
| **Server-side secure stores** | SSFS (Secure Store in the File System) is supported. | Local Secure Store (LSS) is not supported. |

------

>[!NOTE]
>- Azure Backup doesn’t automatically adjust for daylight saving time changes when backing up an SAP HANA database running in an Azure VM. We recommend you to modify the policy manually as needed.
>- You can now [monitor the backup and restore](./sap-hana-db-manage.md#monitor-manual-backup-jobs-in-the-portal) jobs (to the same machine) triggered from HANA native clients (SAP HANA Studio/ Cockpit/ DBA Cockpit) in the Azure portal.

## Support for HANA System Replication (HSR)

Azure Backup supports SAP HANA databases in HANA System Replication (HSR) deployments.

### HSR capabilities

The following capabilities are supported for HSR deployments.

| Capability | Description |
| --- | --- |
| Unified backup chain | Backup recovery points are maintained as one coordinated chain across HSR nodes. |
| Automatic backup continuity | Backups continue through failover and failback events without requiring manual reconfiguration. |
| Backint-based backups | Streaming backups support long-term retention and point-in-time recovery. |
| Instance snapshot backups (Preview) | Snapshot backups are supported for HSR when you use the Enhanced policy in preview. |

### HSR limitations

The following limitations apply to HSR deployments.

| Limitation | Description |
| --- | --- |
| HSR + DR scenario | This combined scenario isn't supported. |
| Original Location Recovery (OLR) | OLR isn't supported for HSR. |
| Restore target type | Restore to an HSR instance isn't supported; restore to a HANA instance is supported. |

Learn more in [Back up SAP HANA System Replication databases on Azure VMs](sap-hana-database-with-hana-system-replication-backup.md) and [Restore SAP HANA databases on Azure VMs](sap-hana-database-restore.md).

## Support for HANA Scale-out (Preview)

Azure Backup supports SAP HANA scale-out deployments where one HANA system is distributed across multiple nodes.

### Scale-out capabilities

The following capabilities are supported for scale-out deployments.

| Capability | Description |
| --- | --- |
| Supported topologies | Primary and worker node topologies are supported, including NFS shared storage and local-storage-based scale-out systems. |
| Backup types | Full, Differential, Incremental, and Log backups are supported across all nodes. |
| Unified backup chain | Azure Backup maintains one backup chain across nodes and handles node failover automatically. |
| Restore options | Restore to same system and Alternate Location Restore (ALR) are supported. |

### Scale-out limitations

The following limitations apply to scale-out deployments.

| Limitation | Description |
| --- | --- |
| Maximum node count | A maximum of 32 nodes is supported per scale-out system. |
| Region scope | All nodes must be in the same region as the Recovery Services vault. |
| SUV consistency | The scale-out unique identifier (SUV) must be the same across all nodes. |
| Cross-subscription restore | Cross-subscription restore isn't supported. |
| Native client trigger | Backups can't be triggered from SAP HANA native clients (Studio, Cockpit, DBA Cockpit); use Azure portal or Azure CLI. |
| Instance snapshot backup | Instance snapshot backups aren't supported; only streaming backups are supported. |

Learn more in [Back up SAP HANA Scale-out databases on Azure VMs](sap-hana-database-scale-out-backup.md).

## Support for multistreaming data backups

The following requirements and characteristics apply to multistreaming data backups.

- **Parameters to enable SAP HANA settings for multistreaming**: 
  - *parallel_data_backup_backint_channels*
  - *data_backup_buffer_size (optional)*
Maximum number of channels that can be opened are 32 however maximum throughput that can be achieved is 1.5GBps.
  >[!Note]
  >By setting the above HANA parameters will lead to increased memory and CPU utilization. We recommend that you monitor the memory consumption and CPU utilization as overutilization might negatively impact the backup and other HANA operations.

- **Backup performance for databases**: The performance gain will be more prominent for larger databases.

- **Database size applicable for multistreaming**: The number of multistreaming channels applies to all data backups *larger than 128 GB*. Data backups smaller than 128 GB always use only one channel.

- **Supported backup throughput**: Multistreaming currently supports the data backup throughput of up to *1.5 GBps*. Recovery throughput is slower than the backup throughput.

- **VM configuration applicable for multistreaming**: To utilize the benefits of multistreaming, the VM needs to have a minimum configuration of *16 vCPUs* and *128 GB* of RAM.
- **Limiting factors**: Throughput of *total disk LVM striping* and *VM network*, whichever hits first. 

Learn more about [SAP HANA Azure Virtual Machine storage](/azure/sap/workloads/hana-vm-operations-storage) and [SAP HANA Azure virtual machine Premium SSD storage configurations](/azure/sap/workloads/hana-vm-premium-ssd-v1) configurations. To configure multistreaming data backups, see the [SAP documentation](https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/18db704959a24809be8d01cc0a409681.html).

## Support for Azure Backup Multiple Components on One System (MCOS)

Azure Backup for SAP HANA supports backing up multiple SAP HANA systems (SIDs) on a single host. SAP HANA MCOS support includes the following configurations. 

| Sap HANA instance | Support |
| --- | --- |
| Standalone (HXE)+ Standalone (HYE) | Supported |
| HSR (HXE) + Standalone (HYE) | Supported |
| HSR (HXE) + HSR (HYE) | Unsupported |

**`HXE` and `HYE` represent two HANA instances running on the same host.*

The following table lists the required parameters for adding/removing SAP HANA instances:

| Action | Parameter | Description | Example script |
| --- | --- | --- | --- |
| **Add an instance** | `--sid` | SAP HANA database instance that you want to protect. <br><br> By default, the first instance is selected. | `./msawb-plugin-config-com-sap-hana.sh --add --sid HXE` <br><br> Or <br><br> `./msawb-plugin-config-com-sap-hana.sh  --sid HXE` <br><br>  (Default mode is `add` for the script.) <br><br> After you add instances, registration needs to be done on recovery services vault. If a new instance is added later, re-registration is required.|
| **Remove an instance** | `--sid` | SAP HANA database instance that you want to remove protection. <br><br> **SID** is a mandate parameter for remove. | `./msawb-plugin-config-com-sap-hana.sh --remove --sid HXE` |

## Next steps

- Back up SAP HANA databases on Azure VMs using [Azure portal](backup-azure-sap-hana-database.md) and [Azure CLI](tutorial-sap-hana-backup-cli.md).
- Back up SAP HANA System Replication databases on Azure VMs using [Azure portal](sap-hana-database-with-hana-system-replication-backup.md) and [Azure CLI](quick-backup-hana-cli.md).
- Back up SAP HANA Scale-out databases on Azure VMs using [Azure portal](sap-hana-database-scale-out-backup.md).
- [Back up SAP HANA database snapshot instances on Azure VMs](sap-hana-database-instances-backup.md).
- [Restore SAP HANA databases on Azure VMs using Azure portal](./sap-hana-db-restore.md) and [Azure CLI](tutorial-sap-hana-restore-cli.md).
- Manage SAP HANA databases that are backed up by Azure Backup using [Azure portal](./sap-hana-db-manage.md) and [Azure CLI](tutorial-sap-hana-manage-cli.md).
- Restore SAP HANA System Replication on Azure VMs using [Azure portal](sap-hana-database-with-hana-system-replication-backup.md) and [Azure CLI](quick-restore-hana-cli.md).
- [Well-architected data reliability enhancement for SAP HANA](/azure/well-architected/sap/design-areas/data-platform#use-data-backups).
- [Troubleshoot common issues when backing up SAP HANA databases](./backup-azure-sap-hana-database-troubleshoot.md)
- [Troubleshoot SAP HANA snapshot backup jobs on Azure Backup](sap-hana-database-instance-troubleshoot.md).
