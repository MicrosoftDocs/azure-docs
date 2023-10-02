---
title: Azure Backup support matrix for SQL Server Backup in Azure VMs 
description: Provides a summary of support settings and limitations when backing up SQL Server in Azure VMs with the Azure Backup service.
ms.topic: conceptual
ms.date: 07/25/2023
ms.custom: references_regions 
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Support matrix for SQL Server Backup in Azure VMs

You can use Azure Backup to back up SQL Server databases in Azure VMs hosted on the Microsoft Azure cloud platform. This article summarizes the general support settings and limitations for scenarios and deployments of SQL Server Backup in Azure VMs.

## Scenario support

**Support** | **Details**
--- | ---
**Supported deployments** | SQL Marketplace Azure VMs and non-Marketplace (SQL Server manually installed) VMs are supported.
**Supported regions** | Azure Backup for SQL Server databases is available in all regions, except France South (FRS), UK North (UKN), UK South 2 (UKS2), UG IOWA (UGI), and Germany (Black Forest).
**Supported operating systems** | Windows Server 2022, Windows Server 2019, Windows Server 2016, Windows Server 2012 (all versions), Windows Server 2008 R2 SP1 <br/><br/> Linux isn't currently supported.
**Supported SQL Server versions** | SQL Server 2022, SQL Server 2019, SQL Server 2017 as detailed on the [Search product lifecycle page](https://support.microsoft.com/lifecycle/search?alpha=SQL%20server%202017), SQL Server 2016 and SPs as detailed on the [Search product lifecycle page](https://support.microsoft.com/lifecycle/search?alpha=SQL%20server%202016%20service%20pack), SQL Server 2014, SQL Server 2012, SQL Server 2008 R2, SQL Server 2008 <br/><br/> Enterprise, Standard, Web, Developer, Express.<br><br>Express Local DB versions aren't supported.
**Supported .NET versions** | .NET Framework 4.5.2 or later installed on the VM
**Supported deployments** | SQL Marketplace Azure VMs and non-Marketplace (SQL Server that is manually installed) VMs are supported. Support for standalone instances is always on [availability groups](backup-sql-server-on-availability-groups.md).
**Cross Region Restore** | Supported. [Learn more](restore-sql-database-azure-vm.md#cross-region-restore).
**Cross Subscription Restore** | Supported via the Azure portal and Azure CLI. [Learn more](restore-sql-database-azure-vm.md#cross-subscription-restore).


## Feature considerations and limitations

|Setting  |Maximum limit |
|---------|---------|
|Number of databases that can be protected in a server (and in a vault)    |   2000      |
|Database size supported (beyond this, performance issues may come up)   |   6 TB*      |
|Number of files supported in a database    |   1000      |
|Number of full backups supported per day    |    One scheduled backup. <br><br> Three on-demand backups. <br><br> We recommend not to trigger more than three backups per day. However, to allow user retries in case of failed attempts, hard limit for on-demand backups is set to nine attempts. |
| Log shipping | When you enable [log shipping](/sql/database-engine/log-shipping/about-log-shipping-sql-server?view=sql-server-ver15&preserve-view=true) on the SQL server database that you are backing up, we recommend you to disable log backups in the backup policy. This is because, the log shipping (which automatically sends transaction logs from the primary to secondary database) will interfere with the log backups enabled through Azure Backup. <br><br>    Therefore, if you enable log shipping, ensure that your policy only has full and/or differential backups enabled. |
| Retention period for on-demand backups  | For Full/ Differential/ Incremental backups, the out-of-box retention is 45 days. <br><br>  For Copy-only full backup, you can define a custom retention period.  |

_*The database size limit depends on the data transfer rate that we support and the backup time limit configuration. It’s not the hard limit. [Learn more](#backup-throughput-performance) on backup throughput performance._

* SQL Server backup can be configured in the Azure portal or **PowerShell**. CLI isn't supported.
* The solution is supported on both kinds of [deployments](../azure-resource-manager/management/deployment-models.md) - Azure Resource Manager VMs and classic VMs.
* All backup types (full/differential/log) and recovery models (simple/full/bulk logged) are supported.
* For **read-only** databases: full and copy-only full backups are the only supported backup types.
* SQL native compression is supported if explicitly enabled by the user in the backup policy. Azure Backup overrides instance-level defaults with the COMPRESSION / NO_COMPRESSION clause, depending on the value of this control as set by the user.
* TDE - enabled database backup is supported. To restore a TDE-encrypted database to another SQL Server, you need to first [restore the certificate to the destination server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server). The backup compression for TDE-enabled databases for SQL Server 2016 and newer versions is available, but at lower transfer size as explained [here](https://techcommunity.microsoft.com/t5/sql-server/backup-compression-for-tde-enabled-databases-important-fixes-in/ba-p/385593).
* The backup and restore operations for mirror databases and database snapshots aren't supported.
* SQL Server **Failover Cluster Instance (FCI)** isn't supported.
* Back up of databases with extensions in their names aren’t supported. This is because the IIS server performs the [file extension request filtering](/iis/configuration/system.webserver/security/requestfiltering/fileextensions). However, note that we've allowlisted `.ad`, `.cs`, and `.master` that can be used in the database names.

## Backup throughput performance

Azure Backup supports a consistent data transfer rate of 350 MBps for full and differential backups of large SQL databases (of 500 GB). To utilize the optimum performance, ensure that:

- The underlying VM (containing the SQL Server instance, which hosts the database) is configured with the required network throughput. If the maximum throughput of the VM is less than 200 MBps, Azure Backup can’t transfer data at the optimum speed.<br>Also, the disk that contains the database files must have enough throughput provisioned. [Learn more](../virtual-machines/disks-performance.md) about disk throughput and performance in Azure VMs. 
- Processes, which are running in the VM, are not consuming the VM bandwidth. 
- The backup schedules are spread across a subset of databases. Multiple backups running concurrently on a VM shares the network consumption rate between the backups. [Learn more](faq-backup-sql-server.yml#can-i-control-how-many-concurrent-backups-run-on-the-sql-server-) about how to control the number of concurrent backups.

>[!NOTE]
>- The higher throughput is automatically throttled when the following conditions are met:
>    - All the databases should be above the size of *4 TB*.
>    - The databases should be hosted on Azure VMs that have *maximum uncached disk throughput metric greater than 800 MBpS*.
>- [Download the detailed Resource Planner](https://download.microsoft.com/download/A/B/5/AB5D86F0-DCB7-4DC3-9872-6155C96DE500/SQL%20Server%20in%20Azure%20VM%20Backup%20Scale%20Calculator.xlsx) to calculate the approximate number of protected databases that are recommended per server based on the VM resources, bandwidth and the backup policy.

## Next steps

Learn how to [back up a SQL Server database](backup-azure-sql-database.md) that's running on an Azure VM.
