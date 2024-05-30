---
title: Performance best practices for Oracle on Azure VMs 
description: Performance best practices for Oracle on Azure VMs - optimizing performance, dependability, and cost for your Oracle workloads on Azure VMs.
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: oracle-on-azure
ms.collection: oracle
ms.topic: article
ms.date: 06/13/2023
---

# Performance best practices for Oracle on Azure VMs

This article describes how the right VM size and storage options you choose affects your Oracle workload performance - input/output operations (IOPS) and throughput - dependability, and cost. There's a trade-off between optimizing for costs and for performance. This performance best practices series is focused on getting the best performance for the Oracle workload on Azure VMs. If your workload is less demanding, you might not require every optimization recommended. It's critical in the planning phase, to assess the performance requirements of your Oracle workloads and right size the compute and storage as needed.  

When considering to run Oracle workloads on Azure VMs, for a cost-effective configuration start by selecting a virtual machine that supports the necessary IOPS and throughput with the appropriate memory-to-vCore ratio and then add your storage requirement. 

## VM sizing recommendations
 
The following three VM series are the recommended to run Oracle database workloads on Azure.  

### E-series (Eds v5 and Ebds V5)
The [E-series](/azure/virtual-machines/edv5-edsv5-series) is designed for memory-intensive workloads. These VMs provide high memory-to-core ratios, making them suitable for Oracle databases. Also offer a range of CPU options to match the performance requirements of your Oracle database workload. 

The new [Ebdsv5-series](/azure/virtual-machines/ebdsv5-ebsv5-series#ebdsv5-series) provides the highest I/O throughput-to-vCore ratio in Azure along with a memory-to-vCore ratio of 8. This series offers the best price-performance for Oracle workloads on Azure VMs. Consider this series first for most Oracle database workloads.  

### M-series
The [M-series](/azure/virtual-machines/m-series) is built for large databases, that is, up to 12-TB RAM and 416vCPUs. The M series VMs offer the highest memory-to-vCore ratio in Azure. Consider these VMs for large and large mission critical Oracle database workloads or if you would need to consolidate databases into fewer VMs.  

### D-series
The [D-series](/azure/virtual-machines/dv5-dsv5-series) is built for general purpose VMs with smaller memory-to-vCore ratios with the General-Purpose virtual machines. It's important to carefully monitor memory-based performance counters to ensure Oracle workload can get the IOPS & through put. The [Ddsv5-series](/azure/virtual-machines/ddv5-ddsv5-series#ddsv5-series) offers a fair combination of vCPU, memory, and temporary disk but with smaller memory-to-vCore support. D-series doesn't have the memory-to-vCore ratio of 8 that is recommended for Oracle workloads. As such, consider using these virtual machines for small to medium databases or for dev/test environment for lower TCO. 

## Storage recommendations 

This section provides storage best practices and guidelines to optimize performance for your Oracle workload on Azure Virtual Machines (VM). Consider your performance needs, costs, and workload patterns as you evaluate these recommendations. Let us take a quick look at the options: 

- [Disk Types](/azure/virtual-machines/disks-types): [Premium SSD](/azure/virtual-machines/disks-types#premium-ssds), [Premium SSD V2](/azure/virtual-machines/disks-types#premium-ssd-v2) & [Ultra disks](/azure/virtual-machines/disks-types#ultra-disks) are recommended disk types for Oracle workload. Refer to [disk type comparison](/azure/virtual-machines/disks-types#disk-type-comparison) to understand maximum disk size, maximum throughput and maximum IOPS to choose right disk type for Azure VM to meet your Oracle workload performance. Generally, Premium SSD v2 is the best price per performance disk option that you could consider.  

- Premium SSD V2 offers higher performance than Premium SSDs while also generally being less costly. You can individually tweak the performance (capacity, throughput, and IOPS) of Premium SSD v2 disks at any time, allowing workloads to be cost efficient while meeting shifting performance needs. For example, a transaction-intensive database needs a large amount of IOPS at a small size, or a gaming application can require a large amount of IOPS but only during peak hours. Because you can individually tweak the performance, for most general-purpose workloads, Premium SSD v2 can provide the best price performance. 

- Premium SSDs are suitable for mission-critical production workloads. They deliver high-performance and low-latency disk support for virtual machines (VMs) with input/output (IO)-intensive workloads.  

- Ultra disks are the highest-performing storage option for Azure virtual machines (VMs). They're suitable for data-intensive and transaction-heavy workloads. They provide low sub millisecond latencies and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput, before and after you provision the disk.   

[Azure Elastic SAN](/azure/storage/elastic-san/elastic-san-introduction) delivers a massively scalable, cost-effective, highly performant, and reliable block storage solution that connects to various Azure compute services over iSCSI protocol. Elastic SAN enables a seamless transition from an existing SAN storage estate to the cloud without having to refactor customer application architecture. This solution can achieve massive scale - up to millions of IOPS, double-digit GB/s of throughput, and low single-digit millisecond latencies with built-in resiliency to minimize downtime. This makes it a great fit for customers looking to consolidate storage, customers working with multiple compute services, or those who have workloads that require high throughput levels achieved by driving storage over network bandwidth.  

>[!Note]
> VM sizing with Elastic SAN should accommodate production (VM to VM) network throughput requirements along with storage throughput.

Consider placing Oracle workloads on Elastic SAN for better cost efficiency for the following reasons. 

- **Storage consolidation and dynamic performance sharing**: Normally for Oracle workload on Azure VM, disk type storage is provisioned on a per VM basis based on customer’s capacity and peak performance requirements for that VM. This overprovisioned performance is available when needed but the unused performance can't be shared with workloads on other VMs. Elastic SAN, like on-premises SAN, allows consolidating storage needs of multiple Oracle workloads to achieve better cost efficiency, with the ability to dynamically share provisioned performance across the volumes provisioned to these different workloads based on IO demands. For example, in East US, if you have 10 workloads that require 2-TiB capacity and 10K IOPS each, but collectively they don’t need more than 60 K IOPS at any point in time. You can configure an Elastic SAN with 12 base units (one base unit = $0.08 per GiB/month) that will give you 12 TiB capacity and the needed 60K IOPS, and 8 capacity-only units (1 capacity-only unit = $0.06 per GiB/month) that will give you the remaining 8-TiB capacity at a cheaper price. This optimal storage configuration provides better cost efficiency while providing the necessary performance (10K IOPS) to each of these workloads. For more information on Elastic SAN base and capacity-only provisioning units, see [Planning for an Azure Elastic SAN](/azure/storage/elastic-san/elastic-san-planning#storage-and-performance) and for pricing, see [Azure Elastic SAN - Pricing](https://azure.microsoft.com/pricing/details/elastic-san/). 

- **To drive higher storage throughput**: Oracle Workload on Azure VM deployments occasionally require overprovisioning a VM due disk throughput limit for that VM. You can avoid this with Elastic SAN, since you drive higher storage throughput over compute network bandwidth with the iSCSI protocol. For example, a Standard_E32bds_v5 (SCSI) VM is capped at 88,000 IOPS and 2,500 MBps for disk/storage throughput, but it can achieve up to a maximum of 16,000-MBps network throughput. If the storage throughput requirement for your workload is greater than 2,500 MBps, you won't have to upgrade the VM a higher SKU since it can now support up to 16,000 MBps by using Elastic SAN. 

Additionally, the following are some inputs can help you to derive further value from Elastic SAN.  

| Other parameters      | description                          |
|---------------------------|---------------------------|
| Provisioning Model        | Flexible model at TiB granularity |
| [BCDR](/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-disaster-recovery-oracle-landing-zone)                      | Incremental snapshot for fast restore; Snapshot export for hardening. |
| Redundancy & Scale Targets| Refer [redundancy capabilities of Azure Elastic SAN](/azure/storage/elastic-san/elastic-san-planning#redundancy) in redundancy requirements. |
| [Encryption](/azure/storage/elastic-san/elastic-san-planning#redundancy)                | Encryption at rest is supported. |


[Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-introduction) is an Azure native, first-party, enterprise-class, high-performance file storage service suitable for storing Oracle database files. It provides Volumes as a service for which you can create NetApp accounts, capacity pools, and volumes. You can also select service and performance levels and manage data protection. By using the same protocols and tools that you know and trust, and enterprise applications that depend on on-premises, you can build and maintain file shares that are fast, reliable, and scalable.  

The following are key attributes of Azure NetApp files:  

- Performance, cost optimization, and scale.  
- Simplicity and availability.  
- Data management and security.  
- SLA 99.99%  

Azure NetApp Files volumes are [highly available](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) by design and provide flexibility for scaling volumes up and down in capacity and performance without service interruption. For other availability across zones and regions volumes can be replicated using [cross-zone](/azure/azure-netapp-files/cross-zone-replication-introduction) and [cross-region replication](/azure/azure-netapp-files/cross-region-replication-introduction). 

For hosting extremely demanding Oracle database files, redo logs and archive logs that scale well into multiple gigabytes per second throughput and multiple tens of terabytes capacity, you can utilize [single](/azure/azure-netapp-files/performance-oracle-single-volumes) or [multiple volumes](/azure/azure-netapp-files/performance-oracle-multiple-volumes), depending on capacity and performance requirements. Volumes can be protected using [snapshots](/azure/azure-netapp-files/snapshots-introduction) for fast primary data protection and recoverability, and can be backed up using RMAN, [AzAcSnap](/azure/azure-netapp-files/azacsnap-introduction), [Azure NetApp Files backup](/azure/azure-netapp-files/backup-introduction) or other preferred backup methods or applications.   

It's highly recommended to use [Oracle direct NFS (dNFS) with Azure NetApp Files](/azure/azure-netapp-files/solutions-benefits-azure-netapp-files-oracle-database#how-oracle-direct-nfs-works) for enhanced performance. The combination of Oracle dNFS with Azure NetApp Files provides great advantage to your workloads. Oracle dNFS makes it possible to drive higher performance than the operating system's kernel NFS. The article explains the technology and provides a performance comparison between dNFS and the kernel NFS client.  
Azure VMs are throttled for network traffic at higher speeds than direct attached storage such as SSD. As a result, the Oracle deployment performs better using Azure NetApp Files volumes at the same VM SKU, or you can choose a smaller VM SKU for the same performance and save on Oracle license cost. 

Snapshots can be cloned to provide read/write access to current data for test and development purposes without interacting with the live data. 

| Item | Description |
|------|-------------|
| Other parameter | Available in three performance service levels ([Ultra](/azure/azure-netapp-files/azure-netapp-files-service-levels#supported-service-levels), Premium, Standard) with dynamic interruption-free up- and down scaling of performance and capacity to balance changing requirements and cost |
|Provisioning model | [Single volume](/azure/azure-netapp-files/performance-oracle-single-volumes) for medium to large databases  [Multiple volumes](/azure/azure-netapp-files/performance-oracle-multiple-volumes) for extremely large and high throughput Provisioning through Azure portal with online dynamic up-and downsizing  Dynamic online performance scaling through [dynamic service level](/azure/azure-netapp-files/azure-netapp-files-service-levels) changes and QoS adjustments |
| [BDR](/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-disaster-recovery-oracle-landing-zone) |Snapshot-based independent data access for BC/DR and test/dev purposes  Vaulting of snapshots with [Azure NetApp Files backup](/azure/azure-netapp-files/backup-introduction) Storage-based [cross-region replication](/azure/azure-netapp-files/cross-region-replication-introduction)  Storage-based [cross-zone replication](/azure/azure-netapp-files/cross-zone-replication-introduction) Integration with Oracle Data Guard for high availability and disaster recovery |
|Redundancy & scale targets| Demonstrated capability to support largest and highest performing Oracle databases over 100TiB in size and multiple gigabytes per second throughput while maintaining near-instantaneous snapshot-based primary data protection and recoverability |
| Encryption |[Single or double encryption](/azure/azure-netapp-files/understand-data-encryption#understand-encryption-at-rest) at rest with platform- or customer-managed keys |

## Automate VMs and storage selection 

Consider using Community tool [Oracle Migration Assistant Tool](https://github.com/Azure/Oracle-Workloads-for-Azure/tree/main/omat) (OMAT) to get the right VM SKUs with recommended storage options including disk types, Elastic SAN & ANF with indicative cost based on list price.  You can provide AWR report of the Oracle database as a input and run the OMT tool script to get an output of the recommended VM SKUs and storage options that aligns with the performance requirements of the database and is cost effective. 

## Next steps
- [Migrate Oracle workload to Azure VMs (IaaS)](oracle-migration.md)
- [Partner storage offerings for Oracle on Azure VMs](oracle-third-party-storage.md)

