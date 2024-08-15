---
title: Partner storage offerings for Oracle on Azure VMs 
description: This article describes how Partner storage offerings are available for Oracle on Azure Virtual Machines.
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: oracle-on-azure
ms.collection: oracle
ms.topic: article
ms.date: 03/26/2024
---

# Partner storage offerings for Oracle on Azure VMs

This article describes Partner storage offerings for high performance - input/output operations (IOPS) and throughput - Oracle workloads on Azure virtual machines (VMs). While Microsoft first-party storage offerings for migrating Oracle workloads to Azure VMs are effective, there are use cases that require performance beyond the capacity of the first-party storage offering for Oracle on Azure VMs. These trusted third-party storage solutions are ideal for high performance use cases. 

## Oracle as a DBaaS on Azure 

Administering Oracle as a DBaaS on Azure requires Azure cloud skills outside the traditional database administration functions. Managing infrastructure as a service can interfere with defined database operations. In such scenarios, a better option is to use the Oracle Database as a service on Azure (DBaaS). The DBaaS provides access to a database without requirements to deploy and manage the underlying infrastructure. 

DBaaS is delivered as a managed database service, which means that the provider takes care of patching, upgrading, and backing up the database.  [Tessell](https://www.tessell.com/) primarily provides Oracle database as service – PaaS, also called as 'DBaaS – Database as service on Azure. Tessell's DBaaS platform is available for [coselling with Microsoft](https://www.tessell.com/blogs/azure-tessell-ip-co-sell), delivering the full power of Tessell on Azure. Joint Tessell-Microsoft customers can apply Tessell's advanced cloud-based database-as-a-service (DBaaS) platform with the expertise and support of Microsoft's sales and technical teams. Tessell’s DBaaS is Azure-native service with the following benefits: 

- Oracle self-service, DevOps integration, and production operations without having to deploy and manage the underlying infrastructure.  
- Running on Azure high-performance-compute (HPC, LSV3 series), the most demanding production Oracle workloads can be brought to Azure.  
- Support for all Oracle database management packs.  

## Lightbits: performance for Oracle on Azure VMs  

The [Lightbits](https://www.lightbitslabs.com/azure/) Cloud Data Platform provides scalable and cost-efficient high-performance storage that is easy to consume on Azure. It removes the bottlenecks associated with native storage on the public cloud, such as scalable performance and consistently low latency. Removing these bottlenecks offers rich data services and resiliency that enterprises rely on. It can deliver up to 1 million IOPS/volume and up to 3 million IOPs per VM. Lightbits cluster can scale vertically and horizontally. Lightbits support different sizes of [Lsv3](../../lsv3-series.md) and [Lasv3](../../lasv3-series.md) VMs for their clusters.

For other options, see L32sv3/L32asv3: 7.68 TB, L48sv3/L48asv3: 11.52 TB, L64sv3/L64asv3: 15.36 TB, L80sv3/L80asv3: 19.20 TB.
In real-world workload test scenarios, Lightbits delivers more than 10X more IOPS than the best available Azure native storage (Ultra disk).

The Lightbits Cloud Data Platform also provides synchronous replication across multiple availability zones, so you can have a dormant Oracle instance without starting it on a different zone, and if the zone fails, activate the database using the same Lightbits volumes that you used in the different zone without waiting for any log transfer.

The Lightbits Cloud Data Platform supports Oracle ASM and also supports shared raw block devices to use with Oracle RAC.

The following table provides other inputs to help you to determine the appropriate disk type.

| Parameter                   | Description                   |
|-----------------------------|------------------------------|
| Other            | Flexible model at TiB granularity |
| Provisioning Model          | Incremental snapshot for fast restore; Snapshot export for hardening. |
| [BCDR](/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-disaster-recovery-oracle-landing-zone)                        | See redundancy capabilities of Lightbits in redundancy requirements. |
| Redundancy & Scale Targets  | Built-in multi availability zone support via synchronous replication, and automatic cluster expansion based on storage usage. |
| Encryption                  | Encryption at rest is supported. |
## Tessel: Performance best practices for Oracle on Azure VMs  

[Tessell](https://www.tessell.com/) primarily provides Oracle database as service – PaaS, which is also called as “DBaaS’ – Database as service. Tessell's DBaaS platform is available for [coselling with Microsoft](https://www.tessell.com/blogs/azure-tessell-ip-co-sell), delivering the full power of Tessell on Azure. Joint Tessell-Microsoft customers can use Tessell's advanced cloud-based database-as-a-service (DBaaS) platform and the extensive expertise and support of Microsoft's sales and technical teams. Tessell’s DBaaS as Azure-native solution provides the following benefits: 

- Oracle self-service, DevOps integration, and production operations without having to deploy and manage the underlying infrastructure.  
- Run on Azure high-performance-compute (HPC, LSV3 series), the most demanding production Oracle workloads can be brought to Azure.  
- Support for all Oracle database management packs.  

Apart from providing Oracle as DBaaS on Azure, [Tessell provides NVMe](https://www.tessell.com/blogs/high-performance-database-with-nvme-storage) uses Non-Volatile Memory Express (NVMe) to provide high IOPS and throughput required to run Oracle database on Azure VMs. Use NVMe storage mount on L series VMs to reach IOPS & throughput up to 3,800,000 & 20,000 MB/s. For more information, see [Tessell’s Oracle SLOB](https://www.tessell.com/blogs/azure-oracle-benchmark) benchmark details on Azure. 

The following table provides other inputs to help you to determine the appropriate disk type.

| Other parameters                  |  DBaaS – A Managed service options for Oracle on Azure.                  |
|-----------------------------|------------------------------|
| Provisioning Model          | Upfront Provisioning                        |
| [BCDR](/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-disaster-recovery-oracle-landing-zone)  | Azure Snapshot, Backups, HA/DR  |
| Redundancy & Scale Targets  | Out-of-the-box Multi-Availability Zone (AZ) HA and cross-region DR services   |
| Encryption       | Azure Key Vault based & bring your own encryption          |


## Silk: Performance best practices for Oracle on Azure VMs  

[Silk](https://silk.us/about-us/)  focuses on providing [performance](https://silk.us/performance/) (IOPS & throughput) 50 times more than Azure Native storage recommended for Oracle on Azure IaaS. With the storage 1Gib-128TiB per volume, you can get IOPS & Throughput respectively 2,000,000 & 20,000 MB/sec.  


The following table provides other inputs to help you to determine the appropriate disk type.

| Other parameters         | SaaS offering                 |
|--------------------------|----------------------------|
| Provisioning Model       | Per GB granularity, online resize & scale-up or out, thin provisioned, compressed, optional deduped |
| BCDR                     | One-to-Many Multi-Zone and Multi-Region Replication, Instant zero footprint Snapshot, Clone, Revert, and Extract for AI / BI, Testing, or Back up |
| Redundancy & Scale Targets | One-to-Many Multi-Zone and Multi-Region Replication                                                  |
| Encryption   | Azure Key Vault based & bring your own encryption      |

## Next steps
- [Migrate Oracle workload to Azure VMs (IaaS)](oracle-migration.md)
- [Performance best practices for Oracle on Azure VMs](oracle-performance-best-practice.md)
