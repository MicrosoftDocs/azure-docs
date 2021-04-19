---
title: Azure Backup support matrix for SQL Server Backup in Azure VMs 
description: Provides a summary of support settings and limitations when backing up SQL Server in Azure VMs with the Azure Backup service.
ms.topic: conceptual
ms.date: 04/07/2021
ms.custom: references_regions 
---

# Support matrix for SQL Server Backup in Azure VMs

You can use Azure Backup to back up SQL Server databases in Azure VMs hosted on the Microsoft Azure cloud platform. This article summarizes the general support settings and limitations for scenarios and deployments of SQL Server Backup in Azure VMs.

## Scenario support

**Support** | **Details**
--- | ---
**Supported deployments** | SQL Marketplace Azure VMs and non-Marketplace (SQL Server manually installed) VMs are supported.
**Supported regions** | Australia South East (ASE), East Australia (AE), Australia Central (AC), Australia Central 2 (AC) <br> Brazil South (BRS)<br> Canada Central (CNC), Canada East (CE)<br> South East Asia (SEA), East Asia (EA) <br> East US (EUS), East US 2 (EUS2), West Central US (WCUS), West US (WUS); West US 2 (WUS 2) North Central US (NCUS) Central US (CUS) South Central US (SCUS) <br> India Central (INC), India South (INS), India West <br> Japan East (JPE), Japan West (JPW) <br> Korea Central (KRC), Korea South (KRS) <br> North Europe (NE), West Europe <br> UK South (UKS), UK West (UKW) <br> US Gov Arizona, US Gov Virginia, US Gov Texas, US DoD Central, US DoD East <br> Germany North, Germany West Central <br> Switzerland North, Switzerland West <br> France Central <br> China East, China East 2, China North, China North 2
**Supported operating systems** | Windows Server 2019, Windows Server 2016, Windows Server 2012, Windows Server 2008 R2 SP1 <br/><br/> Linux isn't currently supported.
**Supported SQL Server versions** | SQL Server 2019, SQL Server 2017 as detailed on the [Search product lifecycle page](https://support.microsoft.com/lifecycle/search?alpha=SQL%20server%202017), SQL Server 2016 and SPs as detailed on the [Search product lifecycle page](https://support.microsoft.com/lifecycle/search?alpha=SQL%20server%202016%20service%20pack), SQL Server 2014, SQL Server 2012, SQL Server 2008 R2, SQL Server 2008 <br/><br/> Enterprise, Standard, Web, Developer, Express.<br><br>Express Local DB versions aren't supported.
**Supported .NET versions** | .NET Framework 4.5.2 or later installed on the VM

## Feature considerations and limitations

|Setting  |Maximum limit |
|---------|---------|
|Number of databases that can be protected in a server (and in a vault)    |   2000      |
|Database size supported (beyond this, performance issues may come up)   |   6 TB*      |
|Number of files supported in a database    |   1000      |

_*The database size limit depends on the data transfer rate that we support and the backup time limit configuration. It’s not the hard limit. [Learn more](#backup-throughput-performance) on backup throughput performance._

* SQL Server backup can be configured in the Azure portal or **PowerShell**. CLI isn't supported.
* The solution is supported on both kinds of [deployments](../azure-resource-manager/management/deployment-models.md) - Azure Resource Manager VMs and classic VMs.
* All backup types (full/differential/log) and recovery models (simple/full/bulk logged) are supported.
* For **read-only** databases: full and copy-only full backups are the only supported backup types.
* SQL native compression is supported if explicitly enabled by the user in the backup policy. Azure Backup overrides instance-level defaults with the COMPRESSION / NO_COMPRESSION clause, depending on the value of this control as set by the user.
* TDE - enabled database backup is supported. To restore a TDE-encrypted database to another SQL Server, you need to first [restore the certificate to the destination server](/sql/relational-databases/security/encryption/move-a-tde-protected-database-to-another-sql-server). Backup compression for TDE-enabled databases for SQL Server 2016 and newer versions is available, but at lower transfer size as explained [here](https://techcommunity.microsoft.com/t5/sql-server/backup-compression-for-tde-enabled-databases-important-fixes-in/ba-p/385593).
* Backup and restore operations for mirror databases and database snapshots aren't supported.
* SQL Server **Failover Cluster Instance (FCI)** isn't supported.
* Using more than one backup solutions to back up your standalone SQL Server instance or SQL Always on availability group may lead to backup failure. Refrain from doing so. Backing up two nodes of an availability group individually with same or different solutions, may also lead to backup failure.
* When availability groups are configured, backups are taken from the different nodes based on a few factors. The backup behavior for an availability group is summarized below.

### Back up behavior with Always on availability groups

We recommend that the backup is configured on only one node of an availability group (AG). Always configure backup in the same region as the primary node. In other words, you always need the primary node to be present in the region where you're configuring the backup. If all the nodes of the AG are in the same region where the backup is configured, there isn't any concern.

#### For cross-region AG

* Regardless of the backup preference, backups will only run from the nodes that are in the same region where the backup is configured. This is because cross-region backups aren't supported. If you have only two nodes and the secondary node is in the other region, the backups will continue to run from the primary node (unless your backup preference is 'secondary only').
* If a node fails over  to a region different than the one where the backup is configured, backups will fail on the nodes in the failed-over region.

Depending on the backup preference and backups types (full/differential/log/copy-only full), backups are taken from a particular node (primary/secondary).

#### Backup preference: Primary

**Backup Type** | **Node**
--- | ---
Full | Primary
Differential | Primary
Log |  Primary
Copy-Only Full |  Primary

#### Backup preference: Secondary Only

**Backup Type** | **Node**
--- | ---
Full | Primary
Differential | Primary
Log |  Secondary
Copy-Only Full |  Secondary

#### Backup preference: Secondary

**Backup Type** | **Node**
--- | ---
Full | Primary
Differential | Primary
Log |  Secondary
Copy-Only Full |  Secondary

#### No Backup preference

**Backup Type** | **Node**
--- | ---
Full | Primary
Differential | Primary
Log |  Secondary
Copy-Only Full |  Secondary

## Backup throughput performance

Azure Backup supports a consistent data transfer rate of 200 Mbps for full and differential backups of large SQL databases (of 500 GB). To utilize the optimum performance, ensure that:

- The underlying VM (containing the SQL Server instance, which hosts the database) is configured with the required network throughput. If the maximum throughput of the VM is less than 200 Mbps, Azure Backup can’t transfer data at the optimum speed.<br></br>Also, the disk that contains the database files must have enough throughput provisioned. [Learn more](../virtual-machines/disks-performance.md) about disk throughput and performance in Azure VMs. 
- Processes, which are running in the VM, are not consuming the VM bandwidth. 
- The backup schedules are spread across a subset of databases. Multiple backups running concurrently on a VM shares the network consumption rate between the backups. [Learn more](faq-backup-sql-server.yml#can-i-control-how-many-concurrent-backups-run-on-the-sql-server-) about how to control the number of concurrent backups.

>[!NOTE]
> [Download the detailed Resource Planner](https://download.microsoft.com/download/A/B/5/AB5D86F0-DCB7-4DC3-9872-6155C96DE500/SQL%20Server%20in%20Azure%20VM%20Backup%20Scale%20Calculator.xlsx) to calculate the approximate number of protected databases that are recommended per server based on the VM resources, bandwidth and the backup policy.

## Next steps

Learn how to [back up a SQL Server database](backup-azure-sql-database.md) that's running on an Azure VM.