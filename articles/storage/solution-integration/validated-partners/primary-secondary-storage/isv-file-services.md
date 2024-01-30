---
title: Considerations for running ISV file services in Azure
titleSuffix: Azure Storage
description: Basic guidance for different ISV options on running file services in Azure 
author: dukicn
ms.author: nikoduki
ms.topic: conceptual 
ms.date: 03/22/2022
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.custom: ignite-2022
---

# Running ISV file services in Azure

Azure offers various options for storing file data. Azure native services are:
- [Azure Files](https://azure.microsoft.com/services/storage/files/) – Fully managed file shares in the cloud that are accessible via the industry-standard SMB and NFS protocols. Azure Files offer two different types (standard and premium) with different performance characteristics.
- [Azure NetApp Files](https://azure.microsoft.com/services/netapp/) – Fully managed file shares in the cloud designed to meet the performance requirements for enterprise line-of-business applications. Azure NetApp Files offer multiple service levels with different performance limitations (standard, premium, and ultra).
- [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/) – large-scale object storage platform for storing unstructured data. Azure Blob Storage offer two different types (standard and premium) with different performance characteristics. 
  
There are several articles that describe the differences and recommendation on selecting the native file service. You can learn more:
- Our migration guide describes the [basic flow chart](../../../common/storage-migration-overview.md#choose-a-target-storage-service)
- [Detailed comparison between Azure Files and Azure NetApp Files](../../../files/storage-files-netapp-comparison.md)

Many independent software vendor (ISV) solutions can provide file services in Azure. This article addresses two topics:
- provides general considerations on selecting file services
- outlines the differences between ISV solutions.
  
Full list of verified ISV solutions is available on [Azure Storage partners for primary and secondary storage](./partner-overview.md).

## Considerations

When selecting the best solution for running a file services in Azure, several considerations are important.

### Basic considerations

Basic functionality consideration examines the most common functionalities of the underlying storage platforms. This step is done initially to explore what solutions provide the basic functionality we need to satisfy our requirements. Important basic features vary from case to case. The most common ones are protocol support, namespace size, automatic tiering, encryption, WORM support, and authentication. You can see the list of basic functionalities that our ISV solutions support in [feature comparison](#isv-solutions-comparison).

### Performance considerations

After selecting which solution satisfies basic functionality, required performance must be considered. Estimating performance fit depends on three basic performance characteristics:
  - Latency
  - Bandwidth
  - IOPS or TPS

Importance of basic performance characteristics depends on the concurrency of the workloads (number of requests in parallel) and the block size (request size).

| Workload type | Recommendations |
| -------------------- | --------------- |
| **Low concurrency** | Latency is the most critical consideration. Smaller the latency, more performance can be achieved. In workloads with low concurrency, IOPS and bandwidth limitations are rarely crossed |
| **High concurrency** | Latency impact is much smaller because of high concurrency. IOPS and / or bandwidth must be considered. |
| **Block size** | For workloads with small block sizes, IOPS limits are more important to consider while bandwidth limits are more important for workloads with large block sizes. |

Any storage workload can be described with those characteristics in mind. For example, OLTP workloads typically have high concurrency and small block sizes. HPC workloads usually have high concurrency, but block size can vary, from small to large. 
    
Some general rules are always recommended:
  - Protocol selection: if possible, use SMB3 with multichannel support or NFSv3 with nconnect support as that will provide better performance. Avoid using legacy protocols both from performance, but also security considerations. Also note that clients can be tuned as well and is recommended to maximize the performance.
  - Networking: if VM type supports it, use accelerated networking. It will reduce the latency and always have a positive effect on the performance. 
  - VM type: select the VM type that is most suitable for the workload. If the workload has small number of clients, running file services in smaller number of larger VMs is better suited. In contrast, large number of clients can benefit from running file services in larger number of smaller VMs.
  - For low concurrency and small block size workloads explore solutions that:
    - use managed disks (Premium or Ultra SSD disks) or
    - have a suitable caching algorithm.
  - For high concurrency and large block size workloads, explore solutions that use Azure Blob Storage as a backend

## ISV solutions: overview and example use cases

This article compares several ISV solutions that provide files services in Azure.

| Solution | Overview | Example use cases |
| -------- | ----------- | ----------------- |
| **Nasuni** | **UniFS** is an enterprise file service with a simpler, low-cost, cloud alternative built on Microsoft Azure | - Primary file storage <br> - Departmental file shares <br> - Centralized file management <br> - multi-site collaboration with global file locking <br> - Azure Virtual Desktop <br> - Remote work/VDI file shares |
| **NetApp** | **Cloud Volumes ONTAP** optimizes your cloud storage costs, and performance while enhancing data protection, security, and compliance. Includes enterprise-grade data management, availability, and durability | - Business applications <br> - Relational and NoSQL databases <br> - Big Data & Analytics <br> - Persistent data for containers <br> - CI/CD pipelines <br> - Disaster recovery for on-premises NetApp solutions |
| **Panzura**| **CloudFS** is an enterprise global file system with added resiliency and high-performance. Offers ransomware protection. | - Simplified legacy storage replacement <br> - Backup and disaster recovery, with granular recovery ability <br> - Cloud native access to unstructured data for Analytics, AI/ML. <br> - Multi-site file collaboration, with automatic file locking and real time global file consistency <br> - Global remote work with cloud VDI <br> - Accelerated cloud migration for legacy workloads |
| **Qumulo** | **Qumulo** on Azure offers multiple petabytes (PiB) of storage capacity, and up to 20 GB/s of performance per file system. Windows (SMB) and Linux (NFS) are both natively supported, and Qumulo provides onboard real-time workload analytics. | – Primary file storage for High Performance Compute, Media & Entertainment, Genomics, Electronic design, and Financial modeling. |
| **Tiger Technology** | **Tiger Bridge** is a data management software solution. Provides tiering between an NTFS file system and Azure Blob Storage or Azure managed disks. Creates a single namespace with local file locking. | - Cloud archive<br> - Continuous data protection (CDP) <br> - Disaster Recovery for Windows servers <br> - Multi-site sync and collaboration <br> - Remote workflows (VDI)<br> - Native access to cloud data for Analytics, AI, ML |
| **XenData** | **Cloud File Gateway** creates a highly scalable global file system using windows file servers | - Global sharing of engineering and scientific files <br> - Collaborative video editing |

## ISV solutions comparison

### Supported protocols

|                                                     | Nasuni               | NetApp CVO                     | Panzura                   | Qumulo                | Tiger Technology      | XenData               |
|-----------------------------------------------------|----------------------|--------------------------------|---------------------------|-----------------------|-----------------------|-----------------------|
| **SMB 2.1**                                         | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | Yes                   |
| **SMB 3.0**                                         | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | Yes                   |
| **SMB 3.1**                                         | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | Yes                   |
| **NFS v3**                                          | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | Yes                   |
| **NFS v4.1**                                        | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | Yes                   |
| **iSCSI**                                           | No                   | Yes                            | No                        | No                    | Yes                   | No                    |

### Supported services for persistent storage

|                                                     | Nasuni               | NetApp CVO                     | Panzura                   | Qumulo                | Tiger Technology      | XenData               |
|-----------------------------------------------------|----------------------|--------------------------------|---------------------------|-----------------------|-----------------------|-----------------------|
| **Managed disks**                                   | No                   | Yes                            | Yes                       | No                    | Yes                   | No                    |
| **Unmanaged disks**                                 | No                   | No                             | No                        | No                    | Yes                   | No                    |
| **Azure Storage Block blobs**                       | Yes                  | Yes (tiering)                  | Yes                       | No                    | Yes                   | Yes                   |
| **Azure Storage Page blobs**                        | No                   | Yes (for HA)                   | Yes                       | Yes                   | No                    | No                    |
| **Azure Archive tier support**                      | No                   | No                             | Yes                       | No                    | Yes                   | Yes                   |
| **Files accessible in non-opaque format**           | No                   | No                             | No                        | No                    | Yes                   | Yes                   |

### Extended features

|                                                     | Nasuni               | NetApp CVO                     | Panzura                   | Qumulo                | Tiger Technology      | XenData               |
|-----------------------------------------------------|----------------------|--------------------------------|---------------------------|-----------------------|-----------------------|-----------------------|
| **Operating Environment**                           | UniFS                | ONTAP                          | PFOS                      | Qumulo Core           | Windows Server        | Windows Server              |
| **High-Availability**                               | Yes                  | Yes                            | Yes                       | Yes                   | Yes (requires setup)  | Yes                   |
| **Automatic failover between nodes in the cluster** | Yes                  | Yes                            | Yes                       | Yes                   | Yes (windows cluster) | yes (windows cluster) |
| **Automatic failover across availability zones**    | Yes                  | No                             | Yes                       | No                    | Yes (windows cluster) | yes (windows cluster) |
| **Automatic failover across regions**               | Yes (with Nasuni support)| No                         | No                        | No                    | Yes (windows cluster) | yes (windows cluster) |
| **Snapshot support**                                | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | No                    |
| **Consistent snapshot support**                     | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | No                    |
| **Integrated backup**                               | Yes                  | Yes (Add-on)                   | No                        | Yes                   | Yes                   | Yes                   |
| **Versioning**                                      | Yes                  | Yes                            | No                        | Yes                   | Yes                   | Yes                   |
| **File level restore**                              | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | Yes                   |
| **Volume level restore**                            | Yes                  | Yes                            | Yes                       | No                    | Yes                   | Yes                   |
| **WORM**                                            | Yes                  | Yes                            | No                        | No                    | Yes                   | No                    |
| **Automatic tiering**                               | Yes                  | Yes                            | No                        | Yes                   | Yes                   | Yes                   |
| **Global file locking**                             | Yes                  | Yes (NetApp Global File Cache) | Yes                       | Yes                   | Yes                   | Yes                   |
| **Namespace aggregation over backend sources**      | Yes                  | Yes                            | No                        | Yes                   | Yes                   | Yes                   |
| **Caching of active data**                          | Yes                  | Yes                            | Yes                       | Yes                   | yes                   | Yes                   |
| **Supported caching modes**                         | LRU, manually pinned | LRU                            | LRU, manually pinned      | Predictive            | LRU                   | LRU                   |
| **Encryption at rest**                              | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | No                    |
| **De-duplication**                                  | Yes                  | Yes                            | Yes                       | No                    | No                    | No                    |
| **Compression**                                     | Yes                  | Yes                            | Yes                       | No                    | No                    | No                    |

### Authentication sources

|                                                     | Nasuni               | NetApp CVO                     | Panzura                   | Qumulo                | Tiger Technology      | XenData               |
|-----------------------------------------------------|----------------------|--------------------------------|---------------------------|-----------------------|-----------------------|-----------------------|
| **Microsoft Entra ID support**                                | Yes (via AD DS)      | Yes (via AD DS)                | Yes (via AD DS)           | Yes                   | Yes (via AD DS)       | Yes (via AD DS)       |
| **Active directory support**                        | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | Yes                   |
| **LDAP support**                                    | Yes                  | Yes                            | No                        | Yes                   | Yes                   | Yes                   |

### Management

|                                                     | Nasuni               | NetApp CVO                     | Panzura                   | Qumulo                | Tiger Technology      | XenData               |
|-----------------------------------------------------|----------------------|--------------------------------|---------------------------|-----------------------|-----------------------|-----------------------|
| **REST API**                                        | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | No                    |
| **Web GUI**                                         | Yes                  | Yes                            | Yes                       | Yes                   | No                    | No                    |

### Scalability

|                                                     | Nasuni               | NetApp CVO                     | Panzura                   | Qumulo                | Tiger Technology      | XenData               |
|-----------------------------------------------------|----------------------|--------------------------------|---------------------------|-----------------------|-----------------------|-----------------------|
| **Maximum number of nodes in a single cluster**     | 100                  | 2 (HA)                         | Tested  up to 60 nodes    | 100                   | N / A                 | N / A                 |
| **Maximum number of volumes**                       | 800                  | 1024                           | Unlimited                 | N / A                 | N / A                 | 1                     |
| **Maximum number of snapshots**                     | Unlimited            | Unlimited                      | Unlimited                 | Unlimited             | N / A                 | N / A                 |
| **Maximum size of a single namespace**              | Unlimited            | Depends on infrastructure      | Unlimited                 | Unlimited             | N / A                 | N / A                 |

### Licensing

|                                                     | Nasuni               | NetApp CVO                     | Panzura                   | Qumulo                | Tiger Technology      | XenData               |
|-----------------------------------------------------|----------------------|--------------------------------|---------------------------|-----------------------|-----------------------|-----------------------|
| **BYOL**                                            | Yes                  | Yes                            | Yes                       | Yes                   | Yes                   | yes                   |
| **Azure Benefit Eligible**                          | No                   | Yes                            | Yes                       | Yes                   | No                    | No                    |
| **Deployment model (IaaS, SaaS)**                   | IaaS                 | IaaS                           | IaaS                      | SaaS                  | IaaS                  | IaaS                  |

### Other features

**Nasuni**
- [Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/nasunicorporation.nasuni-nea-90-prod?tab=Overview)
- Can use managed disks for caching data
- Centralized Management of all Edge Appliances
- Unlimited file versioning history
- Unlimited file system size
- Unlimited file size
- Access files Via HTTPS, REST API, and FTP
- Load balance multiple filers with Azure Load Balancer
- Encryption with Customer-Managed Keys
- Supports third-party security and auditing Tools (for example, Varonis, Stealthbits)
- White glove deployment and professional services

**NetApp**
- [Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/netapp.cloud-manager)
- De-duplication savings passed on to customer via reduced infrastructure consumption

**Panzura**
- [Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/panzura-file-system.panzura-freedom-filer)
- Byte Level Locking (multiple simultaneous R/W opens)

**Qumulo**
- [Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp)
- Support for REST, and FTP

**Tiger Technology**
- Invisible to applications
- Partial Restore
- Windows Shell integration (overlay, context menu, property sheet)
- Azure Soft Delete and undelete support
- Option to apply renames to the cloud target
- Partial write to objects
- Ransomware protection

**XenData**
- The Azure Cosmos DB service provides fast synchronization of multiple gateways, including application-specific owner files for global collaboration 
- Each gateway has highly granular control of locally cached content
- Supports video streaming and partial file restores
- Supports Azure Data Box uploads
- Encryption provided by Azure Blob Storage

## Next steps

Learn more:

- [Azure Disks](../../../../virtual-machines/managed-disks-overview.md)
- [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/)
- [Verified partners for primary and secondary storage](./partner-overview.md)
- [Storage migration overview](../../../common/storage-migration-overview.md)
