---
title: What is Azure NetApp Files | Microsoft Docs
description: Learn about Azure NetApp Files, an Azure native, first-party, enterprise-class, high-performance file storage service.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: overview
ms.date: 01/26/2023
ms.author: anfdocs
---

# What is Azure NetApp Files

Azure NetApp Files is an Azure native, first-party, enterprise-class, high-performance file storage service. It provides NAS volumes as a service for which you can create NetApp accounts, capacity pools, select service and performance levels, create volumes, and manage data protection. It allows you to create and manage high-performance, highly available, and scalable file shares, using the same protocols and tools that you're familiar with and enterprise applications rely on on-premises. Azure NetApp Files supports SMB and NFS protocols and can be used for various use cases such as file sharing, home directories, databases, high-performance computing and more. Additionally, it also provides built-in availability, data protection and disaster recovery capabilities.

## High performance 

Azure NetApp Files is designed to provide high-performance file storage for enterprise workloads. Key features that contribute to the high performance include:

* High throughput:  
  Azure NetApp Files supports high throughput for large file transfers and can handle many random read and write operations with high concurrency, over the Azure high-speed network. This functionality helps to ensure that your workloads aren't bottlenecked by VM disk storage performance. Azure NetApp Files supports multiple service levels, such that you can choose the optimal mix of capacity, performance and cost.
* Low latency:  
  Azure NetApp Files is built on top of an all-flash bare-metal fleet, which is optimized for low latency, high throughput, and random IO. This functionality helps to ensure that your workloads experience optimal (low) storage latency.
* Protocols:  
  Azure NetApp Files supports both SMB, NFSv3/NFSv4.1, and dual-protocol volumes, which are the most common protocols used in enterprise environments. This functionality allows you to use the same protocols and tools that you use on-premises, which helps to ensure compatibility and ease of use. It supports NFS `nconnect` and SMB multichannel for increased network performance.
* Scale:  
  Azure NetApp Files can scale up or down to meet the performance and capacity needs of your workloads. You can increase or decrease the size of your volumes as needed, and the service automatically provisions the necessary throughput.
* Changing of service levels:   
  With Azure NetApp Files, you can dynamically and online change your volumes’ service levels to tune your capacity and performance needs whenever you need to. This functionality can even be fully automated through APIs.
* Optimized for workloads:  
  Azure NetApp Files is optimized for workloads like HPC, IO-intensive, and database scenarios. It provides high performance, high availability, and scalability for demanding workloads.

All these features work together to provide a high-performance file storage solution that can handle the demands of enterprise workloads. They help to ensure that your workloads experience optimal (low) storage latency.

## High availability 

Azure NetApp Files is designed to provide high availability for your file storage needs. Key features that contribute to the high availability include:

* Automatic failover:  
  Azure NetApp Files supports automatic failover within the bare-metal fleet if there's disruption or maintenance event. This functionality helps to ensure that your data is always available, even in a failure.
* Multi-protocol access:  
  Azure NetApp Files supports both SMB and NFS protocols, helping to ensure that your applications can access your data, regardless of the protocol they use.
* Self-healing:  
  Azure NetApp Files is built on top of a self-healing storage infrastructure, which helps to ensure that your data is always available and recoverable.
* Support for Availability Zones:  
  Volumes can be deployed in an Availability Zones of choice, enabling you to build HA application architectures for increased application availability.
* Data replication:  
  Azure NetApp Files supports data replication between different Azure regions and Availability Zones, which helps to ensure that your data is always available, even in an outage.
* Azure NetApp Files provides a high [availability SLA](https://azure.microsoft.com/support/legal/sla/netapp/).

All these features work together to provide a high-availability file storage solution to ensure that your data is always available, recoverable, and accessible to your applications, even in an outage.

## Data protection 

Azure NetApp Files provides built-in data protection to help ensure the safe storage, availability, and recoverability of your data. Key features include:   

* Snapshot copies:  
  Azure NetApp Files allows you to create point-in-time snapshots of your volumes, which can be restored or reverted to a previous state. The snapshots are incremental. That is, they only capture the changes made since the last snapshot, at the block level, which helps to drastically reduce storage consumption.
* Backup and restore:  
  Azure NetApp Files provides integrated backup, which allows you to create backups of your volume snapshots to lower-cost Azure storage and restore them if data loss happens.
* Data replication:  
  Azure NetApp Files supports data replication between different Azure regions and Availability Zones, which helps to ensure high availability and disaster recovery. Replication can be done asynchronously, and the service can fail over to a secondary region or zone in an outage. 
* Security:  
  Azure NetApp Files provides built-in security features such as RBAC/IAM, Active Directory Domain Services (AD DS), Azure Active Directory Domain Services (AADDS) and LDAP integration, and Azure Policy.  This functionality helps to protect data from unauthorized access, breaches, and misconfigurations.
  
All these features work together to provide a comprehensive data protection solution that helps to ensure that your data is always available, recoverable, and secure.

## Next steps

* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md) 
* [Quickstart: Set up Azure NetApp Files and create an NFS volume](azure-netapp-files-quickstart-set-up-account-create-volumes.md)
* [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
