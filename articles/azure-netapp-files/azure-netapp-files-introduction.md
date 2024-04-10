---
title: What is Azure NetApp Files | Microsoft Docs
description: Learn about Azure NetApp Files, an Azure native, first-party, enterprise-class, high-performance file storage service.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: overview
ms.date: 01/11/2024
ms.author: anfdocs
---

# What is Azure NetApp Files?

Azure NetApp Files is an Azure native, first-party, enterprise-class, high-performance file storage service. It provides _Volumes as a service_ for which you can create NetApp accounts, capacity pools, and volumes. You can also select service and performance levels and manage data protection. You can create and manage high-performance, highly available, and scalable file shares by using the same protocols and tools that you're familiar with and rely on on-premises.

Key attributes of Azure NetApp Files are:

- Performance, cost optimization, and scale.
- Simplicity and availability.
- Data management and security.

Azure NetApp Files supports SMB, NFS, and dual protocols volumes and can be used for use cases such as:

- File sharing.
- Home directories.
- Databases.
- High-performance computing.

For more information about workload solutions using Azure NetApp Files, see [Solution architectures using Azure NetApp Files](azure-netapp-files-solution-architectures.md).

## Performance, cost optimization, and scale

Azure NetApp Files is designed to provide high-performance file storage for enterprise workloads and provide functionality to provide cost optimization and scale. Key features that contribute to these capabilities include:

| Functionality | Description | Benefit |
| - | - | - | 
| In-Azure bare-metal flash performance | Fast and reliable all-flash performance with submillisecond latency. | Run performance-intensive workloads in the cloud with on-premises infrastructure-level performance.
| Multi-protocol support | Supports multiple protocols, including NFSv3, NFSv4.1, SMB 3.0, SMB 3.1.1, and simultaneous dual-protocol. | Seamlessly integrate with existing infrastructure and workflows without compatibility issues or complex configurations. |
| Three flexible performance tiers (Standard, Premium, Ultra) | Three performance tiers with dynamic service-level change capability based on workload needs, including cool access for cold data. | Choose the right performance level for workloads and dynamically adjust performance without overspending on resources.
| Small-to-large volumes | Easily resize file volumes from 100 GiB up to 100 TiB without downtime. | Scale storage as business needs grow without over-provisioning, avoiding upfront cost.
| 1-TiB minimum capacity pool size | 1-TiB capacity pool is a reduced-size storage pool compared to the initial 4-TiB minimum. | Save money by starting with a smaller storage footprint and lower entry point, without sacrificing performance or availability. Scale storage based on growth without high upfront costs.
| 1,000-TiB maximum capacity pool | 1000-TiB capacity pool is an increased storage pool compared to the initial 500-TiB maximum. | Reduce waste by creating larger, pooled capacity and performance budget, and share and distribute across volumes.
| 100-500 TiB large volumes | Store large volumes of data up to 500 TiB in a single volume. | Manage large datasets and high-performance workloads with ease.
| User and group quotas | Set quotas on storage usage for individual users and groups. | Control storage usage and optimize resource allocation.
| Virtual machine (VM) networked storage performance | Higher VM network throughput compared to disk IO limits enable more demanding workloads on smaller Azure VMs. | Improve application performance at a smaller VM footprint, improving overall efficiency and lowering application license cost.
| Deep workload readiness | Seamless deployment and migration of any-size workload with well-documented deployment guides. | Easily migrate any workload of any size to the platform. Enjoy a seamless, cost-effective deployment and migration experience.
| Datastores for Azure VMware Solution | Use Azure NetApp Files as a storage solution for VMware workloads in Azure, reducing the need for superfluous compute nodes normally included with Azure VMware Solution expansions. | Save money by eliminating the need for unnecessary compute nodes when you expand storage, resulting in significant cost savings.
| Standard storage with cool access | Use the cool access option of Azure NetApp Files Standard service level to move inactive data transparently from Azure NetApp Files Standard service-level storage (the hot tier) to an Azure Storage account (the cool tier). | Save money by transitioning data that resides within Azure NetApp Files volumes (the hot tier) by moving blocks to the lower-cost storage (the cool tier). |

These features work together to provide a high-performance file storage solution for the demands of enterprise workloads. They help to ensure that your workloads experience optimal (low) storage latency, cost, and scale.

## Simplicity and availability

Azure NetApp Files is designed to provide simplicity and high availability for your file storage needs. Key features include:

| Functionality | Description | Benefit | 
| - | - | - | 
| Volumes as a service | Provision and manage volumes in minutes with a few clicks like any other Azure service. | Enables businesses to quickly and easily provision and manage volumes without the need for dedicated hardware or complex configurations.
| Native Azure integration | Integration with the Azure portal, REST, CLI, billing, monitoring, and security. | Simplifies management and ensures consistency with other Azure services while providing a familiar interface and integration with existing tools and workflows.
| High availability | Azure NetApp Files provides a [high-availability SLA](https://azure.microsoft.com/support/legal/sla/netapp/) with automatic failover. | Ensures that data is always available and accessible, avoiding downtime and disruption to business operations.
| Application migration | Migrate applications to Azure without refactoring. | Enables businesses to move their workloads to Azure quickly and easily without the need for costly and time-consuming application refactoring or redesign.
| Cross-region and cross-zone replication | Replicate data between regions or zones. | Provides disaster recovery capabilities and ensures data availability and redundancy across different Azure regions or availability zones.
| Application volume groups | Application volume groups enable you to deploy all application volumes according to best practices in a single one-step and optimized workflow. | Simplified multi-volume deployment for applications ensures volumes and mount points are optimized and adhere to best practices in a single step, saving time and effort.
| Programmatic deployment | Automate deployment and management with APIs and SDKs. | Enables businesses to integrate Azure NetApp Files with their existing automation and management tools, reducing the need for manual intervention and improving efficiency.
| Fault-tolerant bare metal | Built on a fault-tolerant bare-metal fleet powered by ONTAP. | Ensures high performance and reliability by using a robust, fault-tolerant storage platform and powerful data management capabilities provided by ONTAP.
| Azure native billing | Integrates natively with Azure billing, providing a seamless and easy-to-use billing experience, based on hourly usage. | Easily and accurately manage and track the cost of using the service for seamless budgeting and cost control. Easily track usage and expenses directly from the Azure portal for a unified experience for billing and management. |

These features work together to provide a simple-to-use and highly available file storage solution. This solution ensures that your data is easy to manage and always available, recoverable, and accessible to your applications, even in an outage.

## Data management and security

Azure NetApp Files provides built-in data management and security capabilities to help ensure the secure storage, availability, and manageability of your data. Key features include:

| Functionality | Description | Benefit | 
| - | - | - | 
| Efficient snapshots and backup | Advanced data protection and faster recovery of data by using block-efficient, incremental snapshots and vaulting. | Quickly and easily back up data and restore to a previous point in time, minimizing downtime and reducing the risk of data loss.
| Snapshot restore to a new volume | Instantly restore data from a previously taken snapshot quickly and accurately. | Reduces downtime and saves time and resources that would otherwise be spent on restoring data from backups.
| Snapshot revert | Revert volume to the state it was in when a previous snapshot was taken. | Easily and quickly recover data (in-place) to a known good state, ensuring business continuity and maintaining productivity.
| Application-aware snapshots and backup | Ensure application-consistent snapshots with guaranteed recoverability. | Automates snapshot creation and deletion processes, reducing manual efforts and potential errors while increasing productivity by allowing teams to focus on other critical tasks.
| Efficient cloning | Create and access clones in seconds. | Saves time and reduces costs for test, development, system refresh, and analytics.
| Data-in-transit encryption | Secure data transfers with protocol encryption. | Ensures the confidentiality and integrity of data being transmitted for peace of mind that information is safe and secure.
| Data-at-rest encryption | Data-at-rest encryption with platform- or customer-managed keys. | Prevents unrestrained access to stored data, meets compliance requirements, and enhances data security.
| Azure platform integration and compliance certifications | Compliance with regulatory requirements and Azure platform integration. | Adheres to Azure standards and regulatory compliance and ensures audit and governance completion.
| Azure Identity & Access Management (IAM) | Azure role-based access control (RBAC) allows you to manage permissions for resources at any level. | Simplifies access management and improves compliance with Azure-native RBAC, empowering you to easily control user access to configuration management.
| AD/LDAP authentication, export policies, and access control lists (ACLs) | Authenticate and authorize access to data by using existing AD/LDAP credentials and allow for the creation of export policies and ACLs to govern data access and usage. | Prevents data breaches and ensures compliance with data security regulations, with enhanced granular control over access to data volumes, directories, and files. |

These features work together to provide a comprehensive data management solution that helps to ensure that your data is always available, recoverable, and secure.

## Next steps

* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md) 
* [Quickstart: Set up Azure NetApp Files and create an NFS volume](azure-netapp-files-quickstart-set-up-account-create-volumes.md)
* [Understand NAS concepts in Azure NetApp Files](network-attached-storage-concept.md)
* [Register for NetApp Resource Provider](azure-netapp-files-register.md)
* [Solution architectures using Azure NetApp Files](azure-netapp-files-solution-architectures.md)
* [Azure NetApp Files videos](azure-netapp-files-videos.md)
