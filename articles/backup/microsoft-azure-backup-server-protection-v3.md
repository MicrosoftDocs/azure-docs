---
title: What Azure Backup Server V3 RTM can back up
description: This article provides a protection matrix listing all workloads, data types, and installations that Azure Backup Serve V3 RTM protects.
ms.date: 09/11/2024
ms.topic: reference
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

# Azure Backup Server V3 RTM protection matrix

The following matrix lists what can be protected with Azure Backup Server V3 RTM and earlier versions.

## Protection support matrix

|Workload|Version|Azure Backup Server</br> installation| Azure Backup Server|Protection and recovery|
|------------|-----------|---------------|--------------|--------------|
|Client computers (64-bit and 32-bit)|Windows 10|Physical server<br /><br />Hyper-V virtual machine<br /><br />VMware virtual machine|V3, V2|Volume, share, folder, files, deduped volumes<br /><br />Protected volumes must be NTFS. FAT and FAT32 aren't supported.<br /><br />Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy Service (VSS) to take the data snapshot and the snapshot only works if the volume is at least 1 GB.|
|Client computers (64-bit and 32-bit)|Windows 8.1|Physical server<br /><br />Hyper-V virtual machine|V3, V2|Files<br /><br />Protected volumes must be NTFS. FAT and FAT32 aren't supported.<br /><br />Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy Service (VSS) to take the data snapshot and the snapshot only works if the volume is at least 1 GB.|
|Client computers (64-bit and 32-bit)|Windows 8.1|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)|V3, V2|Volume, share, folder, files, deduped volumes<br /><br />Protected volumes must be NTFS. FAT and FAT32 aren't supported.<br /><br />Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy Service (VSS) to take the data snapshot and the snapshot only works if the volume is at least 1 GB.|
|Client computers (64-bit and 32-bit)|Windows 8|Physical server<br /><br />On-premises Hyper-V virtual machine|V3, V2|Volume, share, folder, files, deduped volumes<br /><br />Protected volumes must be NTFS. FAT and FAT32 aren't supported.<br /><br />Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy Service (VSS) to take the data snapshot and the snapshot only works if the volume is at least 1 GB.|
|Client computers (64-bit and 32-bit)|Windows 8|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)|V3, V2|Volume, share, folder, files, deduped volumes<br /><br />Protected volumes must be NTFS. FAT and FAT32 aren't supported.<br /><br />Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy Service (VSS) to take the data snapshot and the snapshot only works if the volume is at least 1 GB.|
|Client computers (64-bit and 32-bit)|Windows 7|Physical server<br /><br />On-premises Hyper-V virtual machine|V3, V2|Volume, share, folder, files, deduped volumes<br /><br />Protected volumes must be NTFS. FAT and FAT32 aren't supported.<br /><br />Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy Service (VSS) to take the data snapshot and the snapshot only works if the volume is at least 1 GB.|
|Client computers (64-bit and 32-bit)|Windows 7|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)|V3, V2|Volume, share, folder, files, deduped volumes<br /><br />Protected volumes must be NTFS. FAT and FAT32 aren't supported.<br /><br />Volumes must be at least 1 GB. Azure Backup Server uses Volume Shadow Copy Service (VSS) to take the data snapshot and the snapshot only works if the volume is at least 1 GB.|
|Servers (64-bit)|Windows Server 2019|Azure virtual machine (when workload is running as Azure virtual machine)<br /><br />Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /><br />Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3 <br />Not Nano server|Volume, share, folder, file, system state/bare metal), deduped volumes|
|Servers (32-bit and 64-bit)|Windows Server 2016|Azure virtual machine (when workload is running as Azure virtual machine)<br /><br />Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /><br />Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2<br />Not Nano server|Volume, share, folder, file, system state/bare metal), deduped volumes|
|Servers (32-bit and 64-bit)|Windows Server 2012 R2 - Datacenter and Standard|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|Volume, share, folder, file<br /><br />Azure Backup Server must be running on at least Windows Server 2012 R2 to protect Windows Server 2012 deduped volumes.|
|Servers (32-bit and 64-bit)|Windows Server 2012 R2 - Datacenter and Standard|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Volume, share, folder, file, system state/bare metal)<br /><br />Azure Backup Server must be running on Windows Server 2012 or 2012 R2 to protect Windows Server 2012 deduped volumes.|
|Servers (32-bit and 64-bit)|Windows Server 2012/2012 with SP1 - Datacenter and Standard|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|Volume, share, folder, file, system state/bare metal<br /><br />Azure Backup Server must be running on at least Windows Server 2012 R2 to protect Windows Server 2012 deduped volumes.|
|Servers (32-bit and 64-bit)|Windows Server 2012/2012 with SP1 - Datacenter and Standard|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|Volume, share, folder, file<br /><br />Azure Backup Server must be running on at least Windows Server 2012 R2 to protect Windows Server 2012 deduped volumes.|
|Servers (32-bit and 64-bit)|Windows Server 2012/2012 with SP1 - Datacenter and Standard|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Volume, share, folder, file, system state/bare metal<br /><br />Azure Backup Server must be running on at least Windows Server 2012 R2 to protect Windows Server 2012 deduped volumes.|
|SQL Server|SQL Server 2019|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine (when workload is running as Azure virtual machine) <br /><br /> Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3|All deployment scenarios: database|
|SQL Server|SQL Server 2017|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine (when workload is running as Azure virtual machine) <br /><br /> Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3|All deployment scenarios: database|
|SQL Server|SQL Server 2016 SP2|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine <br /><br /> Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2016 SP1|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine <br /><br /> Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2016|Physical server <br /><br /> On-premises Hyper-V virtual machine <br /> <br /> Azure virtual machine <br /><br /> Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2014|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2014|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2012 with SP2|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2012 with SP2|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2012 with SP2|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2012, SQL Server 2012 with SP1|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2012, SQL Server 2012 with SP1|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2012, SQL Server 2012 with SP1|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|Exchange|Exchange 2016|Physical server<br/><br/> On-premises Hyper-V virtual machine<br /> <br /> Azure Stack<br /> <br />Azure virtual machine (when workload is running as Azure virtual machine)|V3, V2|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2016|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2013|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2013|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios): Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2010|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover  (all deployment scenarios):  Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|Exchange|Exchange 2010|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Standalone Exchange server, database under a database availability group (DAG)<br /><br />Recover (all deployment scenarios):  Mailbox, mailbox databases under a DAG<br/><br/> Backup of Exchange over ReFS not supported |
|SharePoint|SharePoint 2016|Physical server<br /><br />On-premises Hyper-V virtual machine<br /><br />Azure virtual machine (when workload is running as Azure virtual machine)<br /><br />Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios):  Farm,  frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 Always On feature for the content databases isn't supported.|
|SharePoint|SharePoint 2013|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios):  Farm,  frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 Always On feature for the content databases isn't supported.|
|SharePoint|SharePoint 2013|Azure virtual machine (when workload is running as Azure virtual machine) - <br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios):  Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 Always On feature for the content databases isn't supported.|
|SharePoint|SharePoint 2013|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios):  Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios):  Farm, database, web application, file or list item, SharePoint search, frontend web server<br /><br />Note that protecting a SharePoint farm that's using the SQL Server 2012 Always On feature for the content databases isn't supported.|
|SharePoint|SharePoint 2010|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios): Farm, database, web application, file or list item, SharePoint search, frontend web server|
|SharePoint|SharePoint 2010|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios): Farm, database, web application, file or list item, SharePoint search, frontend web server|
|SharePoint|SharePoint 2010|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Protect (all deployment scenarios): Farm, SharePoint search, frontend web server content<br /><br />Recover (all deployment scenarios): Farm, database, web application, file or list item, SharePoint search, frontend web server|
|Hyper-V host - MABS protection agent on Hyper-V host server, cluster, or VM|Windows Server 2019|Physical server<br /><br />On-premises Hyper-V virtual machine|V3|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - MABS protection agent on Hyper-V host server, cluster, or VM|Windows Server 2016|Physical server<br /><br />On-premises Hyper-V virtual machine|V3, V2|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - MABS protection agent on Hyper-V host server, cluster, or VM|Windows Server 2012 R2 - Datacenter and Standard|Physical server<br /><br />On-premises Hyper-V virtual machine|V3, V2|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - MABS protection agent on Hyper-V host server, cluster, or VM|Windows Server 2012 - Datacenter and Standard|Physical server<br /><br />On-premises Hyper-V virtual machine|V3, V2|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|VMware VMs|VMware vCenter/vSphere ESX/ESXi  Licensed Version 5.5/6.0/6.5 |Physical server, <br/>On-premises Hyper-V VM, <br/> Windows VM in VMware|V3, V2|VMware VMs on cluster-shared volumes (CSVs), NFS, and SAN storage<br /> Item-level recovery of files and folders is available only for Windows VMs, VMware vApps are not supported.|
|VMware VMs|[VMware vSphere Licensed version 6.7, 7.0](backup-azure-backup-server-vmware.md#vmware-vsphere-67-70-and-80) |Physical server, <br/>On-premises Hyper-V VM, <br/> Windows VM in VMware|V3|VMware VMs on cluster-shared volumes (CSVs), NFS, and SAN storage<br /> Item-level recovery of files and folders is available only for Windows VMs, VMware vApps are not supported.|
|Linux|Linux running as [Hyper-V](back-up-hyper-v-virtual-machines-mabs.md) or [VMware](backup-azure-backup-server-vmware.md) guest|Physical server, <br/>On-premises Hyper-V VM, <br/> Windows VM in VMware|V3, V2|Hyper-V must be running on Windows Server 2012 R2 or Windows Server 2016. Protect: Entire virtual machine<br /><br />Recover: Entire virtual machine <br/><br/> Only file-consistent snapshots are supported. <br/><br/> For a complete list of supported Linux distributions and versions, see the article, [Linux on distributions endorsed by Azure](/azure/virtual-machines/linux/endorsed-distros).|

### Operating systems and applications at end of support

Support for the following operating systems and applications in MABS are deprecated. We recommended you to upgrade them to continue protecting your data.

If the existing commitments prevent upgrading Windows Server or SQL Server, migrate them to Azure and [use Azure Backup to protect the servers](./index.yml). For more information, see [migration of Windows Server, apps and workloads](https://azure.microsoft.com/migration/windows-server/).

For on-premises or hosted environments that you can't upgrade or migrate to Azure, activate Extended Security Updates for the machines for protection and support. Note that only limited editions are eligible for Extended Security Updates. For more information, see [Frequently asked questions](https://www.microsoft.com/windows-server/extended-security-updates).

|Workload|Version|Azure Backup Server</br> installation| Azure Backup Server|Protection and recovery|
|------------|-----------|---------------|--------------|--------------|
|Servers (32-bit and 64-bit)|Windows Server 2008 R2 SP1 - Standard and Enterprise|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2<br />You need to be running SP1 and install [Windows Management Framework](https://www.microsoft.com/download/details.aspx?id=54616)|Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Server 2008 R2 SP1 - Standard and Enterprise|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2<br />You need to be running SP1 and install [Windows Management Framework](https://www.microsoft.com/download/details.aspx?id=54616)|Volume, share, folder, file|
|Servers (32-bit and 64-bit)|Windows Server 2008 R2 SP1 - Standard and Enterprise|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2<br />You need to be running SP1 and install [Windows Management Framework](https://www.microsoft.com/download/details.aspx?id=54616)|Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Server 2008 SP2|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|Not supported|Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Server 2008 SP2|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|Volume, share, folder, file, system state/bare metal|
|Servers (32-bit and 64-bit)|Windows Storage Server 2008|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|Volume, share, folder, file, system state/bare metal|
|SQL Server|SQL Server 2008 R2|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2008 R2|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2008 R2|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2008|Physical server<br /><br />On-premises Hyper-V virtual machine<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2008|Azure virtual machine (when workload is running as Azure virtual machine)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|SQL Server|SQL Server 2008|Windows virtual machine in VMware (protects workloads running in Windows virtual machine in VMware)<br /> <br /> Azure Stack|V3, V2|All deployment scenarios: database|
|Hyper-V host - MABS protection agent on Hyper-V host server, cluster, or VM|Windows Server 2008 R2 SP1 - Enterprise and Standard|Physical server<br /><br />On-premises Hyper-V virtual machine|V3, V2|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|
|Hyper-V host - MABS protection agent on Hyper-V host server, cluster, or VM|Windows Server 2008 SP2|Physical server<br /><br />On-premises Hyper-V virtual machine|Not supported|Protect: Hyper-V computers, cluster shared volumes (CSVs)<br /><br />Recover: Virtual machine, Item-level recovery of files and folder, volumes, virtual hard drives|

## Azure ExpressRoute support

You can back up your data over Azure ExpressRoute with Microsoft peering. Backup over private peering is not supported.

Select the following services/regions and relevant community values:

* Microsoft Entra ID (12076:5060)
* Microsoft Azure Region (according to the location of your Recovery Services vault)
* Azure Storage (according to the location of your Recovery Services vault)

For more details, see the [ExpressRoute routing requirements](../expressroute/expressroute-routing.md).

## Cluster support

Azure Backup Server can protect data in the following clustered applications:

* File servers

* SQL Server

* Hyper-V - If you protect a Hyper-V cluster using scaled-out MABS protection agent, you can't add secondary protection for the protected Hyper-V workloads.

  - If you run Hyper-V on Windows Server 2008 R2, make sure to install the update described in KB [975354](https://support.microsoft.com/kb/975354).
  - If you run Hyper-V on Windows Server 2008 R2 in a cluster configuration, make sure you install SP2 and KB [971394](https://support.microsoft.com/kb/971394).

  Note that Windows Server 2008 R2 is at end of support and we recommend you to upgrade it soon.

* Exchange Server - Azure Backup Server can protect non-shared disk clusters for supported Exchange Server versions (cluster-continuous replication), and can also protect Exchange Server configured for local continuous replication.

* SQL Server - Azure Backup Server doesn't support backing up SQL Server databases hosted on cluster-shared volumes (CSVs).

Azure Backup Server can protect cluster workloads that are located in the same domain as the MABS server, and in a child or trusted domain. If you want to protect data sources in untrusted domains or workgroups, use NTLM or certificate authentication for a single server, or certificate authentication only for a cluster.
