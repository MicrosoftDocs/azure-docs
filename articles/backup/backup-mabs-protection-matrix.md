---
title: MABS (Azure Backup Server) V3 UR1 protection matrix
description: This article provides a support matrix listing all workloads, data types, and installations that Azure Backup Server protects.
ms.date: 03/19/2020
ms.topic: conceptual
---

# MABS (Azure Backup Server) V3 UR1 protection matrix

This article lists the various servers and workloads that you can protect with Azure Backup Server. The following matrix lists what can be protected with Azure Backup Server.

Use the following matrix for MABS v3 UR1:

* Workloads – The workload type of technology.

* Version – Supported MABS version for the workloads.

* MABS installation – The computer/location where you wish to install MABS.

* Protection and recovery – List the detailed information about the workloads such as supported storage container or supported deployment.

## Protection support matrix

The following sections details the protection support matrix for MABS:

* [Applications Backup](#applications-backup)
* [VM Backup](#vm-backup)
* [Linux](#linux)

## Applications Backup

| **Workload**               | **Version**                                                  | **Azure Backup Server   installation**                       | **Supported Azure Backup Server** | **Protection and recovery**                                  |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------ |
| Client  computers (64-bit) | Windows  10                                                  | Physical  server  <br><br>    Hyper-V virtual machine   <br><br>   VMware virtual machine | V3 UR1                            | Volume,  share, folder, files, deduped volumes   <br><br>   Protected volumes must be NTFS. FAT and FAT32 aren't supported.  <br><br>    Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy  Service (VSS) to take the data snapshot and the snapshot only works if the  volume is at least 1 GB. |
| Servers  (64-bit)          | Windows  Server 2019, 2016, 2012 R2, 2012                    | Azure  virtual machine (when workload is running as Azure virtual machine)  <br><br>    Physical server  <br><br>    Hyper-V virtual machine <br><br>     VMware virtual machine  <br><br>    Azure Stack | V3 UR1                            | Volume,  share, folder, file,      deduped  volumes (NTFS and ReFS)  <br><br>   System  state and  bare metal  (Not  supported when workload is running as Azure virtual machine) |
| Servers  (64-bit)          | Windows  Server 2008 R2 SP1, Windows Server 2008 SP2  (You  need to install [Windows Management Frame 4.0](https://www.microsoft.com/download/details.aspx?id=40855)) | Physical  server  <br><br>    Hyper-V virtual machine  <br><br>      VMware  virtual machine  <br><br>   Azure Stack | V3 UR1                            | Volume,  share, folder, file, system state/bare metal        |
| SQL  Server                | SQL  Server 2019, 2017, 2016 and [supported SPs](https://support.microsoft.com/lifecycle/search?alpha=SQL%20Server%202016), 2014 and supported [SPs](https://support.microsoft.com/lifecycle/search?alpha=SQL%20Server%202014) | Physical  server  <br><br>     Hyper-V virtual machine   <br><br>     VMware  virtual machine  <br><br>   Azure virtual machine (when workload is running as Azure virtual machine)  <br><br>     Azure Stack | V3 UR1                            | All  deployment scenarios: database       <br><br>  MABS v3 UR1 supports the backup of SQL databases over ReFS volumes                  |
| Exchange                   | Exchange  2019, 2016                                         | Physical  server   <br><br>   Hyper-V virtual machine  <br><br>      VMware  virtual machine  <br><br>   Azure Stack  <br><br>    Azure virtual machine (when workload is running as Azure virtual machine) | V3 UR1                            | Protect  (all deployment scenarios): Standalone Exchange server, database under a  database availability group (DAG)  <br><br>    Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG    <br><br>  Backup of Exchange over ReFS is supported with MABS v3 UR1 |
| SharePoint                 | SharePoint  2019, 2016 with latest SPs                       | Physical  server  <br><br>    Hyper-V virtual machine <br><br>    VMware  virtual machine  <br><br>   Azure virtual machine (when workload is running as Azure virtual machine)   <br><br>   Azure Stack | V3 UR1                            | Protect  (all deployment scenarios): Farm, frontend web server content  <br><br>    Recover (all deployment scenarios): Farm, database, web application, file, or  list item, SharePoint search, frontend web server  <br><br>    Protecting a SharePoint farm that's using the SQL Server 2012  AlwaysOn feature for the content databases isn't supported. |

## VM Backup

| **Workload**                                                 | **Version**                                             | **Azure  Backup Server   installation**                      | **Supported  Azure Backup Server** | **Protection  and recovery**                                 |
| ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------- | ------------------------------------------------------------ |
| Hyper-V  host - MABS protection agent on Hyper-V host server, cluster, or VM | Windows  Server 2019, 2016, 2012 R2, 2012               | Physical  server  <br><br>    Hyper-V virtual machine <br><br>    VMware  virtual machine | V3 UR1                             | Protect:  Hyper-V computers, cluster shared volumes (CSVs)  <br><br>    Recover: Virtual machine, Item-level recovery of files and folder available  only for Windows, volumes, virtual hard drives |
| VMware  VMs                                                  | VMware  server 5.5, 6.0, or 6.5, 6.7 (Licensed Version) | Hyper-V  virtual machine  <br><br>   VMware  virtual machine         | V3 UR1                             | Protect:  VMware VMs on cluster-shared volumes (CSVs), NFS, and SAN storage   <br><br>     Recover:  Virtual machine, Item-level recovery of files and folder available only for  Windows, volumes, virtual hard drives <br><br>    VMware  vApps are not supported. |

## Linux

| **Workload** | **Version**                               | **Azure  Backup Server   installation**                      | **Supported  Azure Backup Server** | **Protection  and recovery**                                 |
| ------------ | ----------------------------------------- | ------------------------------------------------------------ | ---------------------------------- | ------------------------------------------------------------ |
| Linux        | Linux  running as Hyper-V or VMware guest | Physical  server,    On-premises Hyper-V VM,    Windows VM in VMWare | V3 UR1                             | Hyper-V  must be running on Windows Server 2012 R2 or Windows Server 2016. Protect:  Entire virtual machine   <br><br>   Recover: Entire virtual machine   <br><br>    Only file-consistent snapshots are supported.    <br><br>   For a complete list of supported Linux distributions and versions, see the  article, [Linux on   distributions endorsed by Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros). |

## Azure ExpressRoute support

You can back up your data over Azure ExpressRoute with public peering (available for old circuits) and Microsoft peering. Backup over private peering isn't supported.

With public peering: Ensure access to the following domains/addresses:

* `http://www.msftncsi.com/ncsi.txt`
* `microsoft.com`
* `.WindowsAzure.com`
* `.microsoftonline.com`
* `.windows.net`

With Microsoft peering, select the following services/regions and relevant community values:

* Azure Active Directory (12076:5060)
* Microsoft Azure Region (according to the location of your Recovery Services vault)
* Azure Storage (according to the location of your Recovery Services vault)

For more information, see the [ExpressRoute routing requirements](https://docs.microsoft.com/azure/expressroute/expressroute-routing).

>[!NOTE]
>Public Peering is deprecated for new circuits.

## Cluster support

Azure Backup Server can protect data in the following clustered applications:

* File servers

* SQL Server

* Hyper-V - If you protect a Hyper-V cluster using scaled-out MABS protection agent, you can't add secondary protection for the protected Hyper-V workloads.

* Exchange Server - Azure Backup Server can protect non-shared disk clusters for supported Exchange Server versions (cluster-continuous replication), and can also protect Exchange Server configured for local continuous replication.

* SQL Server - Azure Backup Server doesn't support backing up SQL Server databases hosted on cluster-shared volumes (CSVs).

Azure Backup Server can protect cluster workloads that are located in the same domain as the MABS server, and in a child or trusted domain. If you want to protect data sources in untrusted domains or workgroups, use NTLM or certificate authentication for a single server, or certificate authentication only for a cluster.
