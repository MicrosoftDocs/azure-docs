---
  title: Backup and Disaster Recovery for Azure IaaS Disks | Microsoft Docs
  description: In this article, we will explain how to plan for Backup and Disaster Recovery (DR) of IaaS virtual machines (VMs) and Disks in Azure. This document covers both Managed and Unmanaged Disks
  services: storage
  cloud: Azure
  documentationcenter: na
  author: luywang
  manager: kavithag

  ms.assetid:
  ms.service: storage
  ms.workload: storage
  ms.tgt_pltfrm: na
  ms.devlang: na
  ms.topic: article
  ms.date: 07/13/2017
  ms.author: luywang

---
# Backup and Disaster Recovery for Azure IaaS Disks

In this article, we will explain how to plan for Backup and Disaster Recovery (DR) of IaaS virtual machines (VMs) and Disks in Azure. This document covers both Managed and Unmanaged Disks.

We’ll first talk about the built-in fault tolerance capabilities in the Azure platform which help guard against local failures. We’ll then discuss the disaster scenarios not fully covered by the built-in capabilities, which is the main topic addressed by this document. We’ll also show several examples of workload scenarios where different Backup and DR considerations may apply. We’ll then review possible solutions for DR of IaaS Disks. 

## Introduction

The Azure platform uses various methods for redundancy and fault tolerance to help protect customers from localized hardware failures that can occur. Local failures may include problems with an Azure storage server machine that stores part of the data for a virtual disk or failures of an SSD or HDD on that server. Such isolated hardware component failures can happen during normal operations and the platform is designed to be resilient to these failures. Major disasters can result in failures or inaccessibility of a large numbers of storage servers or a whole datacenter. While your VMs and disks are normally protected from localized failures, additional steps are necessary to protect your workload from region-wide catastrophic failures (such as a major disaster) that can affect your VM and disks.

In addition to the possibility of platform failures, problems with the customer application or data can occur. For example, a new version of your application may inadvertently make a breaking change to the data. In that case, you may want to revert the application and the data to a prior version containing the last known good state. This requires maintaining regular backups.

For regional disaster recovery, you must backup your IaaS VM disks to a different region. 

Before we look at Backup and DR options, let’s recap a few methods available for handling localized failures.

### Azure IaaS Resiliency

*Resiliency* refers to the tolerance for normal failures that occur in hardware components. Resiliency is the ability to recover from failures and continue to function. It's not about avoiding failures, but responding to failures in a way that avoids downtime or data loss. The goal of resiliency is to return the application to a fully functioning state following a failure. Azure Virtual Machines and Disks are designed to be resilient to common hardware faults. Let us look at how the Azure IaaS platform provides this resiliency.

A virtual machine consists mainly of two parts: (1) A compute server, and (2) the persistent disks. Both affect the fault tolerance of a virtual machine.

If the Azure compute host server that houses your VM experiences a hardware failure (which is rare), Azure is designed to automatically restore the VM on another server. If this happens, you will experience a reboot, and the VM will be back up after some time. Azure automatically detects such hardware failures and executes recoveries to help ensure the customer VM will be available as soon as possible.

Regarding IaaS disks, durability of data is critical for the persistent storage platform. Azure customers have important business applications running on IaaS and they depend on the persistence of the data. Azure designs protection for these IaaS disks with three redundant copies of data stored locally, providing high durability against local failures. If one of the hardware components that holds your disk fails, your VM is not impacted because there are two additional copies to support disk requests. It works fine even if two different hardware components supporting a disk fail at the same time (which would be very rare). To help ensure we always maintain three replicas, the Azure Storage service automatically spawns a new copy of data in the background if one of the three copies becomes unavailable. Therefore, it should not be necessary to use RAID with Azure disks for fault tolerance. A simple RAID 0 configuration should be sufficient for striping the disks if necessary to create larger volumes.

Because of this architecture, **Azure has consistently delivered enterprise-grade durability for IaaS disks, with an industry-leading ZERO % [Annualized Failure Rate](https://en.wikipedia.org/wiki/Annualized_failure_rate).**

Localized hardware faults on the compute host or in the storage platform can sometimes result in temporary unavailability for the VM which is covered by the [Azure SLA](https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/) for VM Availability. Azure also provides an industry-leading SLA for single VM instances that use Premium Storage disks.

To safeguard application workloads from downtime due to the temporary unavailability of a disk or VM, customers can leverage [Availability Sets](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/manage-availability). Two or more virtual machines in an availability set provides redundancy for the application. Azure then creates these VMs and disks in separate fault domains with different power, network, and server components. Thus, localized hardware failures typically do not affect multiple VMs in the set at the same time, providing high availability for your application. It is considered a good practice to use availability sets when high availability is required. For more information, see the Disaster Recovery aspects detailed below.

### Backup and Disaster Recovery

Disaster recovery (DR) is the ability to recover from rare but major incidents: non-transient, wide-scale failures, such as service disruption that affects an entire region. Disaster recovery includes data backup and archiving, and may include manual intervention, such as restoring a database from backup.

The Azure platform’s built-in protection against localized failures may not fully protect the VMs/disks in the case of major disasters which can cause large-scale outages. This includes catastrophic events such as a data center being hit by a hurricane, earthquake, fire, or large scale hardware unit failures. In addition, you may encounter failures due to application or data issues.

To help protect your IaaS workloads from outages, you should plan for redundancy and backups to enable recovery. For disaster recovery, you should plan redundancy and backup in a different geographic location away from the primary site. This helps ensure your backup is not affected by the same event that originally impacted the VM or disks. For more information, see Disaster Recovery for [Applications built on Azure](https://docs.microsoft.com/en-us/azure/architecture/resiliency/disaster-recovery-azure-applications).

Your DR considerations may include the following aspects:

1. High Availability (HA) is the ability of the application to continue running in a healthy state, without significant downtime. By "healthy state," we mean the application is responsive, and users can connect to the application and interact with it. Certain mission-critical applications and databases may be required to be available always, even when there are failures in the platform. For these workloads, you may need to plan redundancy for the application as well as the data.

2. Data Durability: In some cases, the main consideration is ensuring the data is preserved in the case of a disaster. Therefore, you may need a backup of your data in a different site. For such workloads, you may not need full redundancy for the application, but a regular backup of the disks.

## Backup and DR Scenarios

Let’s look at a few typical examples of application workload scenarios and the considerations for planning Disaster Recovery.

### Scenario 1: Major Database Solutions

Consider a production database server like SQL Server or Oracle that can support High Availability. Critical production applications and users depend on this database. The Disaster Recovery plan for this system may need to support the following requirements:

1. Data must be protected and recoverable.
2.	Server must be available for use.

This may require maintaining a replica of the database in a different region as a backup. Depending on the requirements for server availability and data recovery, the solution could range from an Active-Active or Active-Passive replica site to periodic offline backups of the data. Relational databases such as SQL Server and Oracle provide various options for replication. For SQL Server, [SQL Server Always On Availability Groups](https://msdn.microsoft.com/en-us/library/hh510230.aspx) can be used for high availability.

NoSQL databases like MongoDB also support [replicas](https://docs.mongodb.com/manual/replication/) for redundancy. The replicas for high availability can be used.

### Scenario 2: A cluster of redundant VMs

Consider a workload handled by a cluster of VMs that provide redundancy and load balancing. One example would be a Cassandra cluster deployed in a region. This type of architecture already provides a high level of redundancy within that region. However, to protect the workload from a regional level failure, you should consider spreading the cluster across two regions or making periodic backups to another region.

### Scenario 3: IaaS Application Workload

This could be a typical production workload running on an Azure VM. For example, it could be a web server or file server holding the content and other resources of a site. It could also be a custom-built business application running on a VM that stored its data, resources, and application state on the VM disks. In this case, it is important to make sure you take backups on a regular basis. Backup frequency should be based on the nature of the VM workload. For example, if the application runs every day and modifies data, then the backup should be taken every hour.

Another example is a reporting server that pull data from other sources and generates aggregated reports. Loss of this VM or disks will lead to the loss of the reports. However, it may be possible to rerun the reporting process and regenerate the output. In that case, you don’t really have a loss of data even if the reporting server is hit with a disaster, so you could have a higher level of tolerance for losing part of the data on the reporting server. In that case, less frequent backups is an option to reduce the cost.

### Scenario 4: IaaS Application data issues

You have an application that computes, maintains, and serves critical commercial data such as pricing information. A new version of your application had a software bug which incorrectly computed the pricing and corrupted the existing commerce data served by the platform. Here, the best course of action would be to revert to the earlier version of the application and the data first. To enable this, take periodic backups of your system.

## Disaster Recovery Solution: Azure Backup Service

[Azure Backup Service](https://azure.microsoft.com/en-us/services/backup/) is can be used for Backup and DR, and it works with [Managed Disks](https://docs.microsoft.com/en-us/azure/storage/storage-managed-disks-overview) as well as [Unmanaged Disks](https://docs.microsoft.com/en-us/azure/storage/storage-about-disks-and-vhds-windows#unmanaged-disks). You can create a backup job with time-based backups, easy VM restoration and backup retention policies. 

If you use [Premium Storage disks](https://docs.microsoft.com/en-us/azure/storage/storage-premium-storage), [Managed Disks](https://docs.microsoft.com/en-us/azure/storage/storage-managed-disks-overview), or other disk types with the [locally redundant storage (LRS)](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#locally-redundant-storage) option, it is especially important to leverage periodic DR backups. Azure Backup stores the data in your Recovery Services vault for long term retention. Choose the [Geo-redundant storage (GRS)](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#geo-redundant-storage) option for the Backup Recovery Services vault. That will ensure backups are replicated to a different Azure region for safeguarding from regional disasters.

For [Unmanaged Disks](https://docs.microsoft.com/en-us/azure/storage/storage-about-disks-and-vhds-windows#unmanaged-disks), you can use the LRS storage type for IaaS disks, but ensure that Azure Backup is enabled with the GRS option for the Recovery Services Vault.

If you use the [GRS](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#geo-redundant-storage)/[RA-GRS](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#read-access-geo-redundant-storage) option for your Unmanaged Disks, you still need consistent snapshots for Backup and DR. You must use either [Azure Backup Service](https://azure.microsoft.com/en-us/services/backup/) or [consistent snapshots](//TODO).

The following is a summary of solutions for DR.

| Scenario | Automatic Replication | DR Solution |
| --- | --- | --- |
| *Premium Storage Disks* | Local ([LRS](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#locally-redundant-storage)) | [Azure Backup](https://azure.microsoft.com/en-us/services/backup/) |
| *Managed Disks* | Local ([LRS](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#locally-redundant-storage)) | [Azure Backup](https://azure.microsoft.com/en-us/services/backup/) |
| *Unmanaged LRS Disks* | Local ([LRS](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#locally-redundant-storage)) | [Azure Backup](https://azure.microsoft.com/en-us/services/backup/) |
| *Unmanaged GRS Disks* | Cross region ([GRS](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#geo-redundant-storage)) | [Azure Backup](https://azure.microsoft.com/en-us/services/backup/)<br/>[Consistent snapshots](//TODO) |
| *Unmanaged RA-GRS Disks* | Cross region ([RA-GRS](https://docs.microsoft.com/en-us/azure/storage/storage-redundancy#read-access-geo-redundant-storage)) | [Azure Backup](https://azure.microsoft.com/en-us/services/backup/)<br/>[Consistent snapshots](//TODO) |

High availability can best by met through the use of Managed Disks in an Availability Set along with Azure Backup. If you are using Unmanaged Disks, you can still  use Azure Backup for DR. If you are unable to use Azure Backup, then taking [consistent snapshots](//TODO) as described in a later section is an alternative solution for Backup and DR.

Your choices for high availability, backup and DR at Application or Infrastructure levels can be represented as below:

| *Level* |	High Availability	| Backup / DR |
| --- | --- | --- |
| *Application* | SQL Always On	| Azure Backup |
| *Infrastructure*	| Availability Set	| GRS with consistent snapshots |

### Using the Azure Backup Service

[Azure Backup](https://azure.microsoft.com/en-us/documentation/articles/backup-azure-vms-introduction/) can backup your VMs running Windows or Linux to the Azure Recovery Services Vault. Backing up and restoring business-critical data is complicated by the fact that business-critical data must be backed up while the applications that produce the data are running. To address this, Azure Backup provides application-consistent backups for Microsoft workloads by using the Volume Shadow Service (VSS) to ensure that data is written correctly to storage. For Linux VMs, only file-consistent backups are possible, since Linux does not have functionality equivalent to VSS.

![][1]





[1]: ./media/storage-backup-and-disaster-recovery-for-azure-iaas-disks/backup-and-disaster-recovery-for-azure-iaas-disks-1.png