---
  title: Backup and disaster recovery for managed disks on Azure VMs 
  description: This article explains how to plan for backup and disaster recovery of IaaS virtual machines and managed disks in Azure.
  author: roygara
  ms.service: azure-disk-storage
  ms.topic: conceptual
  ms.date: 08/07/2023
  ms.author: rogarana
---

# Backup and disaster recovery for Azure managed disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

This article explains how to plan for backup and disaster recovery for Azure managed disks. It introduces Azure built-in redundancy and some common failure types. After that, it covers typical backup and disaster recovery scenarios. Finally, it compares each backup and disaster recovery option for Azure managed disks.

## Azure built-in redundancy options

Azure managed disks have [two built-in redundancy options](disks-redundancy.md) to protect your data against failures:
-	Locally redundant storage (LRS) replicates your data three times within a single data center in a particular region. LRS protects your data against server rack and drive failures. 
-	Zone-redundant storage (ZRS) provides synchronous replication of data across zones in a region, enabling disks to tolerate zonal failures that may occur due to natural disasters or hardware issues.

However, major disasters (such as earthquakes, fires, or hurricanes) can result in outages or inaccessibility of large-scale storage servers, sometimes impacting a whole data center or zone (impacting LRS disks), or an entire region (impacting ZRS disks). In addition to platform failures, problems with an application or data can also occur (such as accidental deletes and ransomware attack). When these happen, you might want to revert the application and the data to a prior version that contains the last known good state. Reverting to a good state requires regular backups. 

To protect your IaaS workloads from outages, plan for redundancy, and create regular backups. To protect IaaS workloads from regional disasters, create backups in a different geographic location than your primary site. This ensures your backups aren’t affected by the same events that affected your other resources. For more information, see [Disaster Recovery for Azure Applications](/azure/well-architected/resiliency/backup-and-recovery).

## Backup and Disaster Recovery Scenarios

Let’s look at a few examples of application workload scenarios and things to consider when planning for backup and disaster recovery.

### Scenario 1: Major database solutions

In this scenario, you have a production database server (such as SQL Server and Oracle) that supports high availability. Critical production applications and users depend on this database. The disaster recovery plan for this system should include the following requirements:

- The data must be protected and recoverable.
- The server must be available for use.
- (Optional) A replica of the database in a different region as backup

Depending on your requirements for server availability and data recovery, solutions could range from an active-active or active-passive replica site to periodic offline backups of the data. Relational databases, such as SQL Server and Oracle, provide various options for replication. For SQL Server, use [SQL Server Always On Availability Groups](/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server) for high availability.

NoSQL databases, like MongoDB, also support [replicas](https://docs.mongodb.com/manual/replication/) for redundancy. The replicas for high availability are used.

### Scenario 2: A cluster of redundant VMs

In this scenario, you have a workload handled by a cluster of VMs that provide redundancy and load balancing, like a Cassandra cluster deployed in a region. This type of architecture already provides a high level of redundancy within that region. However, to protect the workload from a regional-level failure, consider spreading the cluster across two regions or making periodic backups to another region.

### Scenario 3: IaaS application workload

In this scenario, you have an application with a typical production workload running on an Azure VM (IaaS application workload). It could be a web server or file server holding content and other resources of a site, or a custom-built business application running on a VM that stored its data, resources, and application state on the VM disks. In this case, it's important to make sure you take backups regularly. Backup frequency should be based on the nature of the VM workload. For example, if the application runs daily and modifies data, then the backup should be taken hourly.

Another common scenario involves a reporting server that pulls data from other sources and generates aggregated reports. The loss of this VM or disks could lead to the loss of the reports. However, it's possible to regenerate the output by rerunning the reporting process. In this case, you don’t really experience data loss, even if the reporting server is hit with a disaster. So you have a higher level of tolerance for losing part of the data on the reporting server. In this case, taking backups less often would reduce your cost.

### Scenario 4: IaaS application data issues

IaaS application data issues are another possibility. Consider an application that computes, maintains, and serves critical commercial data, such as pricing information. A new version of your application had a software bug that incorrectly computed the pricing and corrupted the existing commerce data served by the platform. Here, the best course of action is to revert to the earlier version of the application and the data. To enable this, take periodic backups of your system.

## Backup and Disaster Recovery Solutions 

### Comparison Overview

This section covers some of Azure's options for backup and disaster recovery. You can refer to the following comparison table for a high level overview.

|Solution |Snapshot |Restore Points |Azure Backup|Azure Site Recovery|
|----------|-----------|------------|------------|------------|
|**Description**|Snapshot is a ready-only poin-in-time copy of the disk that you can use for backup. |Restore Points can be used to implement granular backup of all disks attached to your Virtual Machine|Azure Backup is a fully managed Azure service to provide simple, secure, and cost-effective solution to back up your data and recover it|Azure Site Recovery helps ensure your organization's business continuity by keeping apps and workloads running during outages|
|**Incremental Backup**|Yes   |Yes   |Yes   |Yes   |
|**Cross-Region Copy**|Yes   |Available in public preview   |Yes, with Azure VM backup   |Yes   |
|**Pricing**|See [Azure Disk Pricing](https://azure.microsoft.com/pricing/details/managed-disks/)   |N/A   |See [Estimate costs for backing up Azure VMs or on-premises servers](../backup/azure-backup-pricing.md#estimate-costs-for-backing-up-azure-vms-or-on-premises-servers)  |See [Azure Site Recovery Pricing](https://azure.microsoft.com/pricing/details/site-recovery/)   |
|**Operational Maintenance**|High   |Medium   |Low   |Low   |
|**Key benefits**|Most cost effective, suitable for disk backup   |Back up disks at VM level, Application consistent for VM running Windows OS, File system consistency for VMs running Linux OS  |Frequent and quick backup without interrupting the VM, custom backup policy, agentless solution   |Simple BCDR solution, keep application consistency over failover, orchestrate replication without intercepting application data   |


### Snapshots

A snapshot is a read-only point in time copy of the disk. You can take a snapshot at any time. Snapshots exist independently of the source disk and can only be used to create new managed disks. You can't use them to change the state of an existing disk. You can also use [incremental snapshots](disks-incremental-snapshots.md) for periodic incremental backup of your managed disks. 

Generally, you should use incremental snapshots for backup and disaster recovery purposes since they lower your costs and offer a faster recovery time. Incremental snapshots are point-in-time backups for managed disks that, when taken, consist only of the changes since the last snapshot. The first [incremental snapshot](https://azure.microsoft.com/blog/announcing-general-availability-of-incremental-snapshots-of-managed-disks/) is a full copy of the disk. Any incremental snapshots after the first one consists only of the changes to a disk since the last snapshot. When you create a disk from a snapshot, the system reconstructs the full disk that represents the point in time backup of the disk when the incremental snapshot was taken. You can also [Copy an incremental snapshot to a new region](disks-copy-incremental-snapshot-across-regions.md) for disaster recovery. 

You can implement backup mechanisms through snapshots. To do this, you need to create consistent snapshots for all disks used by a VM and then replicate them to another region. An option to create consistent backups with snapshot is to shut down the VM and take snapshots of each disk. If applications running on the VM can pause the IOs, you should take advantage of pausing it and then take snapshots of all the disks attached to VMs. Taking offline snapshots is easier than coordinating snapshots of a running VM, but it requires a few minutes of downtime.

You can take a snapshot anytime, but if you’re taking snapshots while the VM is running, keep these things in mind:
-	When the VM is running, data is still being streamed to the disks. As a result, snapshots of a running VM might contain partial operations that were in flight.
-	If there are several disks involved in a VM, snapshots of different disks might have occurred at different times.

In the described scenario, snapshots weren't coordinated. This lack of coordination is a problem for striped volumes whose files might be corrupted if changes were being made during a backup. So the backup process must implement the following steps:
1.	Freeze all the disks.
1.	Flush all the pending writes.
1.	[Create an incremental snapshot for managed disks](disks-incremental-snapshots.md) for all the disks.

Some Windows applications, like SQL Server, provide a coordinated backup mechanism through a volume shadow service to create application-consistent backups. On Linux, you can use a tool like fsfreeze to coordinate disks (this tool provides file-consistent backups, not application-consistent snapshots). This backup procedure is complex, so you should consider [Overview of Azure Disk Backup](../backup/disk-backup-overview.md) or a third-party backup solution that already implements this procedure. This would result a collection of coordinated snapshots for all the VM disks, representing a specific point-in-time view of the VM - in other words, a backup restore point for the VM. You can repeat the process at scheduled intervals to create periodic backups. 

### Restore Points

[Azure VM Restore Points](virtual-machines-create-restore-points.md) can be used to implement granular backup and retention policies of all disks attached to your virtual machine. Individual VM restore point is a resource that stores VM configuration and point-in-time application consistent snapshots of all the managed disks attached to the VM. You can use VM Restore Points to easily capture multi-disk consistent backups of all disks attached to your VM.

Restore points have three levels of hierarchy – VM Restore Point Collection, VM Restore Points, and Disk Restore Points:
-	Level 1: VM Restore Points are organized into Restore Point Collections. A Restore Point collection is an Azure Resource Management resource that contains the restore points for a specific VM.
-	Level 2: VM Restore Points contain a disk restore point for each of the attached disks. 
-	Level 3: A Disk Restore Point consists of a snapshot of an individual managed disk.

Restore points are incremental. First restore point stores a full copy of all disks attached to the VM, while successive restore point only contains incremental changes to VM disks. With Restore Points, you can:
-	Copy VM restore points between regions, restore VMs in a different region than the source VM and track the progress of copy operation. 
-	Create disks using disk restore points and get a shared access signature for the disk. These disks can then be used to create a new VM.

See the following articles to learn how to [Create VM restore points](virtual-machines-create-restore-points.md) and [Manage VM restore points](manage-restore-points.md).



### Azure Backup

[Azure Backup](../backup/backup-overview.md) provides simple, secure, and cost-effective solutions to backup your data and recover it from Azure. [Azure Disk Backup](../backup/disk-backup-overview.md) is a native, cloud-based backup solution that protects your data in managed disks. It's a simple, secure, and cost-effective solution that enables you to configure protection for managed disks in a few steps. It ensures your data is protected in the event of a disaster.

[Azure Disk Backup](../backup/disk-backup-overview.md) offers a turnkey solution that provides snapshot lifecycle management for managed disks by automating periodic creation of snapshots and retaining it for however long you specify, using backup policy. You can manage disk snapshots, with no infrastructure costs, without the need for custom scripting, or any management overhead.

Azure Disk Backup is a crash-consistent backup solution that takes point-in-time backup of a managed disk using incremental snapshots and supports multiple backups per day. It's also an agent-less solution, and doesn't impact production application performance. It supports backup and restore of both OS and data disks (including shared disks), whether they're currently attached to a running Azure VM or not. 

Azure Disk Backup is integrated into Backup Center, which provides a single unified management experience in Azure for enterprises to govern, monitor, operate, and analyze backups at scale. If you need an application-consistent backup of virtual machine including the data disks, or an option to restore an entire virtual machine from backup, restore a file or folder, or restore to a secondary region, use the [Azure VM backup](../backup/backup-azure-vms-introduction.md) solution. If you're unable to use Azure Backup, you can implement your own backup mechanism by using snapshots. But creating consistent snapshots for all the disks used by a VM, replicating those snapshots to another region, and continually managing this process is complicated and time consuming.

### Azure Site Recovery

[Azure Site Recovery](../site-recovery/site-recovery-overview.md) helps ensure your organization’s business continuity by keeping apps and workloads running during outages. It's a paid, fully managed service to help you achieve your business continuity and disaster recovery (BCDR) strategy.

Azure Site Recovery replicates workloads running on physical and virtual machines from a primary site to a secondary location. When an outage occurs at your primary site, your workload failover to a secondary location and can be accessed from there. After the primary location is running again, your workloads can fail back to it. 

You can easily set up [disaster recovery to a secondary Azure region](../site-recovery/azure-to-azure-quickstart.md) with a few steps. Azure Site Recovery enables many disaster recovery scenarios – Azure to Azure, VMware to Azure, Physical to Azure, Azure Stack VM, Hyper-V to Azure, DR for apps, DR to a secondary site. For a full list of benefits that Azure Site Recovery provides, refer to [About Site Recovery](../site-recovery/site-recovery-overview.md).

### Other options

SQL Server running in a VM has its own built-in capabilities to back up your SQL Server database to Azure Blob storage or a file share. For more information, see [Back up and restore for SQL Server in Azure virtual machines](/azure/azure-sql/virtual-machines/windows/azure-storage-sql-server-backup-restore-use). In addition to back up and restore, [SQL Server Always On availability groups](/azure/azure-sql/virtual-machines/windows/business-continuity-high-availability-disaster-recovery-hadr-overview) can maintain secondary replicas of databases. This ability greatly reduces the disaster recovery time.

## Next steps

Explore your options:
- [Create an incremental snapshot for managed disks](disks-incremental-snapshots.md)
- [Copy an incremental snapshot to a new region](disks-copy-incremental-snapshot-across-regions.md)
- [Overview of VM restore points](virtual-machines-create-restore-points.md)
- [Overview of Azure Disk Backup](../backup/disk-backup-overview.md)
- [About Site Recovery](../site-recovery/site-recovery-overview.md)
