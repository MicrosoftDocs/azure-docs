---
title: MABS (Azure Backup Server) V3 UR1 protection matrix
description: This article provides a support matrix listing all workloads, data types, and installations that Azure Backup Server protects.
ms.date: 08/08/2022
ms.topic: conceptual
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# MABS (Azure Backup Server) V3 UR1 (and later) protection matrix

This article lists the various servers and workloads that you can protect with Azure Backup Server. The following matrix lists what can be protected with Azure Backup Server.

Use the following matrix for MABS v3 UR1 (and later):

* Workloads – The workload type of technology.

* Version – Supported MABS version for the workloads.

* MABS installation – The computer/location where you wish to install MABS.

* Protection and recovery – List the detailed information about the workloads such as supported storage container or supported deployment.

>[!NOTE]
>Support for the 32-bit protection agent is deprecated with MABS v3 UR1 (and later). See [32-Bit protection agent deprecation](backup-mabs-whats-new-mabs.md#32-bit-protection-agent-deprecation).

## Protection support matrix

The following sections details the protection support matrix for MABS:

* [Applications Backup](#applications-backup)
* [VM Backup](#vm-backup)
* [Linux](#linux)

## Applications backup

| **Workload**               | **Version**                                                  | **Azure Backup Server   installation**                       | **Azure Backup Server** | **Protection and recovery**                                  |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------ |
| Client  computers (64-bit) | Windows 11, Windows 10                                                  | Physical  server  <br><br>    Hyper-V virtual machine   <br><br>   VMware virtual machine | V3 UR1 and V3 UR2                            | Volume,  share, folder, files, deduped volumes   <br><br>   Protected volumes must be NTFS. FAT and FAT32 aren't supported.  <br><br>    Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy  Service (VSS) to take the data snapshot and the snapshot only works if the  volume is at least 1 GB. |
| Servers  (64-bit)          | Windows  Server 2022, 2019, 2016, 2012 R2, 2012 <br /><br />(Including Windows Server Core edition)                   | Azure  virtual machine (when workload is running as Azure virtual machine)  <br><br>    Physical server  <br><br>    Hyper-V virtual machine <br><br>     VMware virtual machine  <br><br>    Azure Stack | V3 UR1 and V3 UR2                            | Volume,  share, folder, file <br><br>    Deduped  volumes (NTFS only) <br><br>When protecting a WS 2016 NTFS deduped volume with MABS v3 running on Windows Server 2019, the recoveries may be affected. We have a fix for doing recoveries in a non-deduped way that will be part of later versions of MABS. Contact MABS support if you need this fix on MABS v3 UR1.<br><br> When protecting a WS 2019 NTFS deduped volume with MABS v3 on Windows Server 2016, the backups and restores will be non-deduped. This means that the backups will consume more space on the MABS server than the original NTFS deduped volume.   <br><br>   System  state and  bare metal  (Not  supported when workload is running as Azure virtual machine) |
| SQL  Server                | SQL  Server 2019, 2017, 2016 and [supported SPs](https://support.microsoft.com/lifecycle/search?alpha=SQL%20Server%202016), 2014 and supported [SPs](https://support.microsoft.com/lifecycle/search?alpha=SQL%20Server%202014) | Physical  server  <br><br>     Hyper-V virtual machine   <br><br>     VMware  virtual machine  <br><br>   Azure virtual machine (when workload is running as Azure virtual machine)  <br><br>     Azure Stack | V3 UR1 and V3 UR2                            | All  deployment scenarios: database       <br><br>    MABS v3 UR2 and later supports the backup of SQL database, stored on the Cluster Shared Volume.     <br><br>  MABS v3 UR1 supports the backup of SQL databases over ReFS volumes     <br><br>     MABS doesn't support SQL Server databases hosted on Windows Server 2012 Scale-Out File Servers (SOFS). <br><br>   MABS can't protect SQL server Distributed Availability Group (DAG) or Availability Group (AG), where the role name on the failover cluster is different than the named AG on SQL.       |
| Exchange                   | Exchange  2019, 2016                                         | Physical  server   <br><br>   Hyper-V virtual machine  <br><br>      VMware  virtual machine  <br><br>   Azure Stack  <br><br>    Azure virtual machine (when workload is running as Azure virtual machine) | V3 UR1 and V3 UR2                            | Protect  (all deployment scenarios): Standalone Exchange server, database under a  database availability group (DAG)  <br><br>    Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG    <br><br>  Backup of Exchange over ReFS is supported with MABS v3 UR1 |
| SharePoint                 | SharePoint  2019, 2016 with latest SPs                       | Physical  server  <br><br>    Hyper-V virtual machine <br><br>    VMware  virtual machine  <br><br>   Azure virtual machine (when workload is running as Azure virtual machine)   <br><br>   Azure Stack | V3 UR1 and V3 UR2                            | Protect  (all deployment scenarios): Farm, frontend web server content  <br><br>    Recover (all deployment scenarios): Farm, database, web application, file, or  list item, SharePoint search, frontend web server  <br><br>    Protecting a SharePoint farm that's using the SQL Server 2012  Always On feature for the content databases isn't supported. |

## VM Backup

| **Workload**                                                 | **Version**                                             | **Azure  Backup Server   installation**                      | **Supported  Azure Backup Server** | **Protection  and recovery**                                 |
| ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------- | ------------------------------------------------------------ |
| Hyper-V  host - MABS protection agent on Hyper-V host server, cluster, or VM | Windows  Server 2022, 2019, 2016, 2012 R2, 2012               | Physical  server  <br><br>    Hyper-V virtual machine <br><br>    VMware  virtual machine | V3 UR1 and V3 UR2                                 | Protect:  Virtual machines, cluster shared volumes (CSVs)  <br><br>    Recover: Virtual machine, Item-level recovery of files and folders available  only for Windows, volumes, virtual hard drives |
| Azure Stack HCI  |       V1, 20H2, and 21H2      |    Physical server        <br><br>     Hyper-V / Azure Stack HCI virtual machine     <br><br>    VMware virtual machine     |    V3 UR2 and later   | Protect: Virtual machines, cluster shared volumes (CSVs)      <br><br>     Recover: Virtual machine, Item-level recovery of files and folders available only for Windows, volumes, virtual hard drives |
| VMware  VMs                                                  | VMware  server 5.5, 6.0, or 6.5, 6.7 (Licensed Version) | Hyper-V  virtual machine  <br><br>   VMware  virtual machine         | V3 UR1                             | Protect:  VMware VMs on cluster-shared volumes (CSVs), NFS, and SAN storage   <br><br>     Recover:  Virtual machine, Item-level recovery of files and folders available only for  Windows, volumes, virtual hard drives <br><br>    VMware  vApps aren't supported. |
| VMware VMs      |   VMware server 7.0, 6.7, 6.5 or 6.0 (Licensed Version)     |    Hyper-V virtual machine     <br><br>    VMware virtual machine    |   V3 UR2 and later    |   Protect: VMware VMs on cluster-shared volumes (CSVs), NFS, and SAN storage     <br><br>    Recover: Virtual machine, Item-level recovery of files and folders available only for Windows, volumes, virtual hard drives     <br><br>    VMware vApps aren't supported.  |

>[!NOTE]
> MABS doesn't support backup of virtual machines with pass-through disks or those that use a remote VHD. We recommend that in these scenarios you use guest-level backup using MABS, and install an agent on the virtual machine to back up the data.

## Linux

| **Workload** | **Version**                               | **Azure  Backup Server   installation**                      | **Supported  Azure Backup Server** | **Protection  and recovery**                                 |
| ------------ | ----------------------------------------- | ------------------------------------------------------------ | ---------------------------------- | ------------------------------------------------------------ |
| Linux        | Linux running as [Hyper-V](back-up-hyper-v-virtual-machines-mabs.md) or [VMware](backup-azure-backup-server-vmware.md) guest | Physical  server,    On-premises Hyper-V VM,    Windows VM in VMware | V3 UR1 and V3 UR2                             | Hyper-V  must be running on Windows Server 2012 R2, Windows Server 2016, or Windows Server 2019. Protect:  Entire virtual machine   <br><br>   Recover: Entire virtual machine   <br><br>    Only file-consistent snapshots are supported.    <br><br>   For a complete list of supported Linux distributions and versions, see the  article, [Linux on distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md). |

## Azure ExpressRoute support

You can back up your data over Azure ExpressRoute with public peering (available for old circuits) and Microsoft peering. Backup over private peering isn't supported.

With public peering: Ensure access to the following domains/addresses:

* URLs
  * `www.msftncsi.com`
  * `*.Microsoft.com`
  * `*.WindowsAzure.com`
  * `*.microsoftonline.com`
  * `*.windows.net`
  * `www.msftconnecttest.com`
* IP addresses
  * 20.190.128.0/18
  * 40.126.0.0/18

With Microsoft peering, select the following services/regions and relevant community values:

* Azure Active Directory (12076:5060)
* Microsoft Azure Region (according to the location of your Recovery Services vault)
* Azure Storage (according to the location of your Recovery Services vault)

For more information, see the [ExpressRoute routing requirements](../expressroute/expressroute-routing.md).

>[!NOTE]
>Public Peering is deprecated for new circuits.

## Operating systems and applications at end of support

Support for the following operating systems and applications in MABS are deprecated. We recommended you to upgrade them to continue protecting your data.

If the existing commitments prevent upgrading Windows Server or SQL Server, migrate them to Azure and [use Azure Backup to protect the servers](./index.yml). For more information, see [migration of Windows Server, apps and workloads](https://azure.microsoft.com/migration/windows-server/).

For on-premises or hosted environments that you can't upgrade or migrate to Azure, activate Extended Security Updates for the machines for protection and support. Note that only limited editions are eligible for Extended Security Updates. For more information, see [Frequently asked questions](https://www.microsoft.com/windows-server/extended-security-updates).

|Workload |Version |Azure Backup Server installation |Azure Backup Server |Protection and recovery |
|------------|-----------|---------------|--------------|--------------|
|Servers (64-bit) | Windows Server 2008 R2 SP1, Windows Server 2008 SP2 (You need to install [Windows Management Framework](https://www.microsoft.com/download/details.aspx?id=54616)) | Physical server <br><br> Hyper-V virtual machine <br><br> VMware virtual machine | Volume, share, folder, file, system state/bare metal |

## Cluster support

Azure Backup Server can protect data in the following clustered applications:

* File servers

* SQL Server

* Hyper-V - If you protect a Hyper-V cluster using scaled-out MABS protection agent, you can't add secondary protection for the protected Hyper-V workloads.

* Exchange Server - Azure Backup Server can protect non-shared disk clusters for supported Exchange Server versions (cluster-continuous replication), and can also protect Exchange Server configured for local continuous replication.

* SQL Server - Azure Backup Server doesn't support backing up SQL Server databases hosted on cluster-shared volumes (CSVs).

>[!NOTE]
>- MABS V3 UR1 supports the protection of Hyper-V virtual machines on Cluster Shared Volumes (CSVs). Protection of other workloads hosted on CSVs isn't supported.
>- MABS v3 UR2 additionally supports SQL Server Failover Cluster Instance (FCI) using Cluster Shared Volumes (CSVs).

Azure Backup Server can protect cluster workloads that are located in the same domain as the MABS server, and in a child or trusted domain. If you want to protect data sources in untrusted domains or workgroups, use NTLM or certificate authentication for a single server, or certificate authentication only for a cluster.

## Data protection issues

* MABS can't back up VMs using shared drives (which are potentially attached to other VMs) as the Hyper-V VSS writer can't back up volumes that are backed up by shared VHDs.

* When you protect a shared folder, the path to the shared folder includes the logical path on the volume. If you move the shared folder, protection will fail. If you must move a protected shared folder, remove it from its protection group and then add it to protection after the move.  Also, if you change the path of a protected data source on a volume that uses the Encrypting File System (EFS) and the new file path exceeds 5120 characters, data protection will fail.

* You can't change the domain of a protected computer and continue protection without disruption. Also, you can't change the domain of a protected computer and associate the existing replicas and recovery points with the computer when it's reprotected. If you must change the domain of a protected computer, then first remove the data sources on the computer from protection. Then protect the data source on the computer after it has a new domain.

* You can't change the name of a protected computer and continue protection without disruption. Also, you can't change the name of a protected computer and associate the existing replicas and recovery points with the computer when it's reprotected. If you must change the name of a protected computer, then first remove the data sources on the computer from protection. Then protect the data source on the computer after it has a new name.

* MABS automatically identifies the time zone of a protected computer during installation of the protection agent. If a protected computer is moved to a different time zone after protection is configured, ensure that you change the computer time in Control Panel. Then update the time zone in the MABS database.

* MABS can protect workloads in the same domain as the MABS server, or in child and trusted domains. You can also protect the following workloads in workgroups and untrusted domains using NTLM or certificate authentication:

  * SQL Server
  * File Server
  * Hyper-V

  These workloads can be running on a single server or in a cluster configuration. To protect a workload that isn't in a trusted domain, see [Prepare computers in workgroups and untrusted domains](/system-center/dpm/back-up-machines-in-workgroups-and-untrusted-domains?view=sc-dpm-2019&preserve-view=true#supported-scenarios) for exact details of what's supported and what authentication is required.

## Unsupported data types

MABS doesn't support protecting the following data types:

* Hard links

* Reparse points, including DFS links and junction points

* Mount point metadata - A protection group can contain data with mount points. In this case DPM protects the mounted volume that is the target of the mount point, but it doesn't protect the mount point metadata. When you recover data containing mount points, you'll need to manually recreate your mount point hierarchy.

* Data in mounted volumes within mounted volumes

* Recycle Bin

* Paging files

* System Volume Information folder. To protect system information for a computer, you'll need to select the computer's system state as the protect group member.

* Non-NTFS volumes

* Files containing hard links or symbolic links from Windows Vista.

* Data on file shares hosting UPDs (User Profile Disks)

* Files with any of the following combinations of attributes:

  * Encryption and reparse

  * Encryption and Single Instance Storage (SIS)

  * Encryption and case-sensitivity

  * Encryption and sparse

  * Case-sensitivity and SIS

  * Compression and SIS

## Next steps

* [Support matrix for backup with Microsoft Azure Backup Server or System Center DPM](backup-support-matrix-mabs-dpm.md)