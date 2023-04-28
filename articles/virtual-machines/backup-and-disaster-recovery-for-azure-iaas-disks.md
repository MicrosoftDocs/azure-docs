---
  title: Backup and disaster recovery for managed disks on Azure VMs 
  description: This article explains how to plan for backup and disaster recovery of IaaS virtual machines and managed disks in Azure.
  author: roygara
  ms.service: storage
  ms.topic: conceptual
  ms.date: 03/30/2022
  ms.author: rogarana
  ms.subservice: disks
---

# Backup and disaster recovery for Azure managed disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

This article explains how to plan for backup and disaster recovery for Azure managed disks.

First, we cover the built-in fault tolerance capabilities in the Azure platform that guard against local failures. We then discuss the disaster scenarios not fully covered by the built-in capabilities. We also show several examples of workload scenarios where different backup and disaster recovery considerations can apply. We also cover some disaster recovery solutions for managed disks.

## Introduction

Azure uses various methods for redundancy and fault tolerance to protect customers from localized hardware failures. Local failures can include problems with an Azure Storage server machine that stores part of the data for a virtual disk or failures of solid-state drives (SSDs) or hard disk drives (HDDs) on that server. Isolated hardware component failures can happen during normal operations.

Azure is designed to be resilient to these failures. Major disasters can result in failures or the inaccessibility of many storage servers or even a whole data center. Although your virtual machines (VMs) and disks are normally protected from localized failures, additional steps are necessary to protect your workload from region-wide catastrophic failures, such as a major disaster, that can affect your VMs and disks.

In addition to the possibility of platform failures, problems with a customer application or data can occur. For example, a new version of your application might inadvertently make a change to the data that causes it to break. In that case, you might want to revert the application and the data to a prior version that contains the last known good state. This requires maintaining regular backups.

For regional disaster recovery, you must back up your infrastructure as a service (IaaS) VM disks to a different region. 

Before we look at backup and disaster recovery options, let’s recap a few methods available for handling localized failures.

### Azure IaaS resiliency

Resiliency refers to the tolerance for normal failures that occur in hardware components. Resiliency is the ability to recover from failures and continue to function. It's not about avoiding failures, but responding to failures in a way that avoids downtime or data loss. The goal of resiliency is to return the application to a fully functioning state following a failure. Azure VMs and managed disks are designed to be resilient to common hardware faults. Let's look at how the Azure IaaS platform provides this resiliency.

A VM consists mainly of two parts: a compute server and the persistent disks. Both affect the fault tolerance of a VM.

If the Azure compute host server that houses your VM experiences a hardware failure, which is rare, Azure is designed to automatically restore the VM on another server. In this scenario, your computer reboots, and the VM comes back up after some time. Azure automatically detects such hardware failures and begins recovery to help ensure the customer VM is available as soon as possible.

Regarding your managed disk, the durability of data is critical for a persistent storage platform. Azure customers have important business applications running on IaaS, and they depend on the persistence of the data. Azure designs protection for these IaaS disks, with three redundant copies of the data that is stored locally. These copies provide for high durability against local failures. If one of the hardware components that holds your disk fails, your VM is not affected, because there are two additional copies to support disk requests. It works fine, even if two different hardware components that support a disk fail at the same time (which is rare). 

To ensure that you always maintain three replicas, Azure automatically creates a new copy of the data in the background if one of the three copies becomes unavailable. Therefore, it should not be necessary to use RAID with Azure disks for fault tolerance. A simple RAID 0 configuration should be sufficient for striping the disks, if necessary, to create larger volumes.

Because of this architecture, Azure has consistently delivered enterprise-grade durability for IaaS disks, with an industry-leading zero percent [annualized failure rate](https://en.wikipedia.org/wiki/Annualized_failure_rate).

Localized hardware faults on the compute host or in the storage platform can sometimes result in of the temporary unavailability of the VM that is covered by the [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) for VM availability. Azure also provides an industry-leading SLA for single VM instances that use Azure premium SSDs.

To safeguard application workloads from downtime due to the temporary unavailability of a disk or VM, customers can use [availability sets](./availability.md). Two or more virtual machines in an availability set provide redundancy for the application. Azure then creates these VMs and disks in separate fault domains with different power, network, and server components.

Because of these separate fault domains, localized hardware failures typically don't affect multiple VMs in the set at the same time. Having separate fault domains provides high availability for your application. It's considered a good practice to use availability sets when high availability is required.

### Backup and disaster recovery

Disaster recovery is the ability to recover from rare, but major, incidents. These incidents include non-transient, wide-scale failures, such as a service disruption that affects an entire region. Disaster recovery includes data backup and archiving, and might include manual intervention, such as restoring a database from a backup.

The Azure platform’s built-in protection against localized failures might not fully protect the VMs/disks if a major disaster causes large-scale outages. These large-scale outages include catastrophic events, such as if a data center is hit by a hurricane, earthquake, fire, or if there is a large-scale hardware unit failure. In addition, you might encounter failures due to application or data issues.

To help protect your IaaS workloads from outages, you should plan for redundancy and have backups to enable recovery. For disaster recovery, you should back up in a different geographic location away from the primary site. This approach helps ensure your backup is not affected by the same event that originally affected the VM or disks. For more information, see [Disaster recovery for Azure applications](/azure/architecture/resiliency/disaster-recovery-azure-applications).

Your disaster recovery considerations might include the following aspects:

- High availability: The ability of the application to continue running in a healthy state, without significant downtime. By healthy state, this state means that the application is responsive, and users can connect to the application and interact with it. Certain mission-critical applications and databases might be required to always be available, even when there are failures in the platform. For these workloads, you might need to plan redundancy for the application, as well as the data.

- Data durability: In some cases, the main consideration is ensuring that the data is preserved if a disaster happens. Therefore, you might need a backup of your data in a different site. For such workloads, you might not need full redundancy for the application, but only a regular backup of the disks.

## Backup and disaster recovery scenarios

Let’s look at a few typical examples of application workload scenarios and the considerations for planning for disaster recovery.

### Scenario 1: Major database solutions

Consider a production database server, like SQL Server or Oracle, that can support high availability. Critical production applications and users depend on this database. The disaster recovery plan for this system might need to support the following requirements:

- The data must be protected and recoverable.
- The server must be available for use.

The disaster recovery plan might require maintaining a replica of the database in a different region as a backup. Depending on the requirements for server availability and data recovery, the solution might range from an active-active or active-passive replica site to periodic offline backups of the data. Relational databases, such as SQL Server and Oracle, provide various options for replication. For SQL Server, use [SQL Server Always On Availability Groups](/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server) for high availability.

NoSQL databases, like MongoDB, also support [replicas](https://docs.mongodb.com/manual/replication/) for redundancy. The replicas for high availability are used.

### Scenario 2: A cluster of redundant VMs

Consider a workload handled by a cluster of VMs that provide redundancy and load balancing. One example is a Cassandra cluster deployed in a region. This type of architecture already provides a high level of redundancy within that region. However, to protect the workload from a regional-level failure, you should consider spreading the cluster across two regions or making periodic backups to another region.

### Scenario 3: IaaS application workload

Let's look at the IaaS application workload. For example, this application might be a typical production workload running on an Azure VM. It might be a web server or file server holding the content and other resources of a site. It might also be a custom-built business application running on a VM that stored its data, resources, and application state on the VM disks. In this case, it's important to make sure you take backups on a regular basis. Backup frequency should be based on the nature of the VM workload. For example, if the application runs every day and modifies data, then the backup should be taken every hour.

Another example is a reporting server that pulls data from other sources and generates aggregated reports. The loss of this VM or disks might lead to the loss of the reports. However, it might be possible to rerun the reporting process and regenerate the output. In that case, you don’t really have a loss of data, even if the reporting server is hit with a disaster. As a result, you might have a higher level of tolerance for losing part of the data on the reporting server. In that case, less frequent backups are an option to reduce costs.

### Scenario 4: IaaS application data issues

IaaS application data issues are another possibility. Consider an application that computes, maintains, and serves critical commercial data, such as pricing information. A new version of your application had a software bug that incorrectly computed the pricing and corrupted the existing commerce data served by the platform. Here, the best course of action is to revert to the earlier version of the application and the data. To enable this, take periodic backups of your system.

## Disaster recovery solution: Azure Disk Backup 

Azure Disk Backup is a native, cloud-based backup solution that protects your data in managed disks. It's a simple, secure, and cost-effective solution that enables you to configure protection for managed disks in a few steps. It assures that you can recover your data in a disaster scenario.

Azure Disk Backup offers a turnkey solution that provides snapshot lifecycle management for managed disks by automating periodic creation of snapshots and retaining it for configured duration using backup policy. You can manage the disk snapshots with zero infrastructure cost and without the need for custom scripting or any management overhead. This is a crash-consistent backup solution that takes point-in-time backup of a managed disk using incremental snapshots with support for multiple backups per day. It's also an agent-less solution and doesn't impact production application performance. It supports backup and restore of both OS and data disks (including shared disks), whether or not they're currently attached to a running Azure VM.

For more details on Azure Disk Backup, see [Overview of Azure Disk Backup](../backup/disk-backup-overview.md).

## Alternative solution: Consistent snapshots

If you are unable to use Azure Backup, you can implement your own backup mechanism by using snapshots. Creating consistent snapshots for all the disks used by a VM and then replicating those snapshots to another region is complicated. For this reason, Azure considers using the Backup service as a better option than building a custom solution.

If you use locally redundant storage for disks, you need to replicate the data yourself.

A snapshot is a representation of an object at a specific point in time. A snapshot incurs billing for the incremental size of the data it holds. For more information, see [Create an incremental snapshot for managed disks](disks-incremental-snapshots.md).

### Create snapshots while the VM is running

Although you can take a snapshot at any time, if the VM is running, there is still data being streamed to the disks. The snapshots might contain partial operations that were in flight. Also, if there are several disks involved, the snapshots of different disks might have occurred at different times. These scenarios may cause to the snapshots to be uncoordinated. This lack of coordination is especially problematic for striped volumes whose files might be corrupted if changes were being made during backup.

To avoid this situation, the backup process must implement the following steps:

1.	Freeze all the disks.

1.	Flush all the pending writes.

1.	[Create an incremental snapshot for managed disks](disks-incremental-snapshots.md) for all the disks.

Some Windows applications, like SQL Server, provide a coordinated backup mechanism via a volume shadow service to create application-consistent backups. On Linux, you can use a tool like *fsfreeze* for coordinating the disks. This tool provides file-consistent backups, but not application-consistent snapshots. This process is complex, so you should consider using [Azure Disk Backup](../backup/disk-backup-overview.md) or a third-party backup solution that already implements this procedure.

The previous process results in a collection of coordinated snapshots for all of the VM disks, representing a specific point-in-time view of the VM. This is a backup restore point for the VM. You can repeat the process at scheduled intervals to create periodic backups. See [Copy the backups to another region](#copy-the-snapshots-to-another-region) for steps to copy the snapshots to another region for disaster recovery.

### Create snapshots while the VM is offline

Another option to create consistent backups is to shut down the VM and take snapshots of each disk. Taking offline snapshots is easier than coordinating snapshots of a running VM, but it requires a few minutes of downtime.

### Copy the snapshots to another region

Creation of the snapshots alone might not be sufficient for disaster recovery. You must also copy the snapshots to another region. See [Copy an incremental snapshot to a new region](disks-copy-incremental-snapshot-across-regions.md).

## Other options

### SQL Server

SQL Server running in a VM has its own built-in capabilities to back up your SQL Server database to Azure Blob storage or a file share. For more information, see [Back up and restore for SQL Server in Azure virtual machines](/azure/azure-sql/virtual-machines/windows/azure-storage-sql-server-backup-restore-use). In addition to back up and restore, [SQL Server Always On availability groups](/azure/azure-sql/virtual-machines/windows/business-continuity-high-availability-disaster-recovery-hadr-overview) can maintain secondary replicas of databases. This ability greatly reduces the disaster recovery time.

## Next steps

See [Back up Azure unmanaged Virtual Machine disks with incremental snapshots](linux/incremental-snapshots.md).

[1]: ./media/virtual-machines-common-backup-and-disaster-recovery-for-azure-iaas-disks/backup-and-disaster-recovery-for-azure-iaas-disks-1.png
[2]: ./media/virtual-machines-common-backup-and-disaster-recovery-for-azure-iaas-disks/backup-and-disaster-recovery-for-azure-iaas-disks-2.png