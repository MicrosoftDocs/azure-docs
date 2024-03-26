---
title: Third-party storage options Oracle on Azure VMs 
description: This article describes third-party storage options Oracle on Azure VMs.
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: oracle
ms.topic: article
ms.date: 03/26/2024
---

# Third-party storage options Oracle on Azure VMs

This article describes third-party storage options for a high performance (IOPS and throughput) Oracle workload on Azure virtual machines (VMs). While Microsoft first-party storage offering for Oracle to Azure virtual machine migration is exhaustive in meeting IOPS and throughput. There are outliers use cases that require performance beyond the art of possible by first party storage offering for Oracle on Azure VMs. Considering this unique situation, we're listing the most tested and trusted partner/3rd party storage solutions.  

## Lightbits performance for Oracle on Azure VMs  

The Lightbits Cloud Data Platform provides scalable and cost-efficient high-performance storage that is easy to consume on Azure. It removes the bottlenecks associated with native storage on the public cloud, such as scalable performance and consistently low latency. Removing these bottlenecks offers rich data services and resiliency that enterprises have come to rely on. It can deliver up to 1 million IOPS/volume and up to 3 million IOPs per VM. Lightbits cluster can scale vertically and horizontally. Lightbits support different sizes of Lsv3 and Lasv3 VMs for their clusters. For options, see L32sv3/L32asv3: 7.68 TB, L48sv3/L48asv3: 11.52 TB, L64sv3/L64asv3: 15.36 TB, L80sv3/L80asv3: 19.20 TB. 

In testing using real-world workload scenarios, Lightbits delivers up to 4.6X more IOPS than the best available cloud native storage (EBS io2 Block Express), which reaches its limits at around 250 K IOPS. Lightbits on Azure delivers almost 1M sustained IPS of 8 KB while Ultra Disk is limited to only 80 K IOPS of 8 KB.

:::image type="content" source="media/oracle-third-party/lightbits.png" alt-text="This diagram compares IO2.Bc versus Lightbits Storage for Oracle using SLOB":::   

The following table provides other inputs to help you to determine the appropriate disk type.
| Parameter                   | Description                                                   |
|-----------------------------|---------------------------------------------------------------|
| Other            | Flexible model at TiB granularity |
| Provisioning Model          | Incremental snapshot for fast restore; Snapshot export for hardening. |
| [BCDR](/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-disaster-recovery-oracle-landing-zone)                        | Refer redundancy capabilities of Azure Elastic SAN in redundancy requirements. |
| Redundancy & Scale Targets  | Encryption at rest is supported. |
| Encryption                  | Encryption at rest is supported. |


## Tessel: Performance best practices for Oracle on Azure VMs  

[Tessell](https://www.tessell.com/) primarily provides Oracle database as service – PaaS, which is also called as “DBaaS’ – Database as service. Tessell's DBaaS platform is available for [coselling with Microsoft](https://www.tessell.com/blogs/azure-tessell-ip-co-sell), delivering the full power of Tessell on Azure. Joint Tessell-Microsoft customers can use Tessell's advanced cloud-based database-as-a-service (DBaaS) platform and the extensive expertise and support of Microsoft's sales and technical teams. Tessell’s DBaaS as Azure-native database-as-a-service (DBaaS), providing you with the following benefits: 

- Oracle self-service, DevOps integration, and production operations without having to deploy and manage the underlying infrastructure.  
- Run on Azure high-performance-compute (HPC, LSV3 series), the most demanding production Oracle workloads can be brought to Azure.  
- Support for all Oracle database management packs.  

Apart from providing Oracle as DBaaS on Azure, [Tessell provides NVMe](https://www.tessell.com/blogs/high-performance-database-with-nvme-storage)(Non-Volatile Memory Express) to provide you with high IOPS and throughput required for your Oracle database running on Azure VM. Use NVMe storage mount on L series VMs to achieve IOPS & throughput up to 3,800,000 & 20,000 MB/s. For more information, see [Tessell’s Oracle SLOB](https://www.tessell.com/blogs/azure-oracle-benchmark) benchmark details on Azure. 

The following table provides other inputs to help you to determine the appropriate disk type.

| Parameter                   | Description                 |
|-----------------------------|------------------------------|
| Provisioning Model          | Flexible model at TiB granularity                             |
| [BCDR](/azure/cloud-adoption-framework/scenarios/oracle-iaas/oracle-disaster-recovery-oracle-landing-zone)                        | Incremental snapshot for fast restore; Snapshot export for hardening. |
| Redundancy & Scale Targets  | Refer to the redundancy capabilities of Azure Elastic SAN in redundancy requirements. |
| Encryption                  | Encryption at rest is supported.                              |


## Silk: Performance best practices for Oracle on Azure VMs  

Silk as a company rewriting the rules of the cloud to make businesses smarter, faster, and fully prepared for whatever the world has in store for them next. Majorly focusing on providing performance (IOPS & throughput) 50 times more than Azure Native storage recommended for Oracle on Azure IaaS. With the storage 1Gib-128TiB per volume, you can get IOPS & Throughput respectively 2,000,000 & 20,000 MB/sec.  


The following table provides other inputs to help you to determine the appropriate disk type.

| Other parameters         | Description                |
|--------------------------|----------------------------|
| SaaS offering            |                                                                                                      |
| Provisioning Model       | Per GB granularity, online resize & scale-up or out, thin provisioned, compressed, optional deduped |
| BCDR                     | One-to-Many Multi-Zone and Multi-Region Replication, Instant zero footprint Snapshot, Clone, Revert, and Extract for AI / BI, Testing, or Back up |
| Redundancy & Scale Targets | One-to-Many Multi-Zone and Multi-Region Replication                                                  |
| Encryption               | Azure Key Vault based & bring your own encryption                                                    |

