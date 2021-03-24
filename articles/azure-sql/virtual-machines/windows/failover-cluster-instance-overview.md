---
title: Failover cluster instances 
description: "Learn about failover cluster instances (FCIs) with SQL Server on Azure Virtual Machines." 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.topic: overview
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Failover cluster instances with SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article introduces feature differences when you're working with failover cluster instances (FCI) for SQL Server on Azure Virtual Machines (VMs). 

## Overview

SQL Server on Azure VMs uses Windows Server Failover Clustering (WSFC) functionality to provide local high availability through redundancy at the server-instance level: a failover cluster instance. An FCI is a single instance of SQL Server that's installed across WSFC (or simply the cluster) nodes and, possibly, across multiple subnets. On the network, an FCI appears to be an instance of SQL Server running on a single computer. But the FCI provides failover from one WSFC node to another if the current node becomes unavailable.

The rest of the article focuses on the differences for failover cluster instances when they're used with SQL Server on Azure VMs. To learn more about the failover clustering technology, see: 

- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server failover cluster instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)

## Quorum

Failover cluster instances with SQL Server on Azure Virtual Machines support using a disk witness, a cloud witness, or a file share witness for cluster quorum.

To learn more, see [Quorum best practices with SQL Server VMs in Azure](hadr-cluster-best-practices.md#quorum). 


## Storage

In traditional on-premises clustered environments, a Windows failover cluster uses a storage area network (SAN) that's accessible by both nodes as the shared storage. SQL Server files are hosted on the shared storage, and only the active node can access the files at one time. 

SQL Server on Azure VMs offers various options as a shared storage solution for a deployment of SQL Server failover cluster instances: 

||[Azure shared disks](../../../virtual-machines/disks-shared.md)|[Premium file shares](../../../storage/files/storage-how-to-create-file-share.md) |[Storage Spaces Direct (S2D)](/windows-server/storage/storage-spaces/storage-spaces-direct-overview)|
|---------|---------|---------|---------|
|**Minimum OS version**| All |Windows Server 2012|Windows Server 2016|
|**Minimum SQL Server version**|All|SQL Server 2012|SQL Server 2016|
|**Supported VM availability** |Availability sets with proximity placement groups (For Premium SSD) </br> Same availability zone (For Ultra SSD) |Availability sets and availability zones|Availability sets |
|**Supports FileStream**|Yes|No|Yes |
|**Azure blob cache**|No|No|Yes|

The rest of this section lists the benefits and limitations of each storage option available for SQL Server on Azure VMs. 

### Azure shared disks

[Azure shared disks](../../../virtual-machines/disks-shared.md) are a feature of [Azure managed disks](../../../virtual-machines/managed-disks-overview.md). Windows Server Failover Clustering supports using Azure shared disks with a failover cluster instance. 

**Supported OS**: All   
**Supported SQL version**: All     

**Benefits**: 
- Useful for applications looking to migrate to Azure while keeping their high-availability and disaster recovery (HADR) architecture as is. 
- Can migrate clustered applications to Azure as is because of SCSI Persistent Reservations (SCSI PR) support. 
- Supports shared Azure Premium SSD and Azure Ultra Disk storage.
- Can use a single shared disk or stripe multiple shared disks to create a shared storage pool. 
- Supports Filestream.
- Premium SSDs support availability sets. 


**Limitations**: 
- It is recommended to place the virtual machines in the same availability set and proximity placement group.
- Ultra disks do not support availability sets. 
- Availability zones are supported for Ultra Disks, but the VMs must be in the same availability zone, which reduces the availability of the virtual machine. 
- Regardless of the chosen hardware availability solution, the availability of the failover cluster is always 99.9% when using Azure Shared Disks. 
- Premium SSD disk caching is not supported.

 
To get started, see [SQL Server failover cluster instance with Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md). 

### Storage Spaces Direct

[Storage Spaces Direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) is a Windows Server feature that is supported with failover clustering on Azure Virtual Machines. It provides a software-based virtual SAN.

**Supported OS**: Windows Server 2016 and later   
**Supported SQL version**: SQL Server 2016 and later   


**Benefits:** 
- Sufficient network bandwidth enables a robust and highly performant shared storage solution. 
- Supports Azure blob cache, so reads can be served locally from the cache. (Updates are replicated simultaneously to both nodes.) 
- Supports FileStream. 

**Limitations:**
- Available only for Windows Server 2016 and later. 
- Availability zones are not supported.
- Requires the same disk capacity attached to both virtual machines. 
- High network bandwidth is required to achieve high performance because of ongoing disk replication. 
- Requires a larger VM size and double pay for storage, because storage is attached to each VM. 

To get started, see [SQL Server failover cluster instance with Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md). 

### Premium file share

[Premium file shares](../../../storage/files/storage-how-to-create-file-share.md) are a feature of [Azure Files](../../../storage/files/index.yml). Premium file shares are SSD backed and have consistently low latency. They're fully supported for use with failover cluster instances for SQL Server 2012 or later on Windows Server 2012 or later. Premium file shares give you greater flexibility, because you can resize and scale a file share without any downtime.

**Supported OS**: Windows Server 2012 and later   
**Supported SQL version**: SQL Server 2012 and later   

**Benefits:** 
- Only shared storage solution for virtual machines spread over multiple availability zones. 
- Fully managed file system with single-digit latencies and burstable I/O performance. 

**Limitations:**
- Available only for Windows Server 2012 and later. 
- FileStream is not supported. 


To get started, see [SQL Server failover cluster instance with Premium file share](failover-cluster-instance-premium-file-share-manually-configure.md). 

### Partner

There are partner clustering solutions with supported storage. 

**Supported OS**: All   
**Supported SQL version**: All   

One example uses SIOS DataKeeper as the storage. For more information, see the blog entry [Failover clustering and SIOS DataKeeper](https://azure.microsoft.com/blog/high-availability-for-a-file-share-using-wsfc-ilb-and-3rd-party-software-sios-datakeeper/).

### iSCSI and ExpressRoute

You can also expose an iSCSI target shared block storage via Azure ExpressRoute. 

**Supported OS**: All   
**Supported SQL version**: All   

For example, NetApp Private Storage (NPS) exposes an iSCSI target via ExpressRoute with Equinix to Azure VMs.

For shared storage and data replication solutions from Microsoft partners, contact the vendor for any issues related to accessing data on failover.

## Connectivity

Failover cluster instances with SQL Server on Azure Virtual Machines use a [distributed network name (DNN)](failover-cluster-instance-distributed-network-name-dnn-configure.md) or 
a [virtual network name (VNN) with Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) to route traffic to the SQL Server instance, regardless of which node currently owns the clustered resources. There are additional considerations when using certain features and the DNN with a SQL Server FCI. See [DNN interoperability with SQL Server FCI](failover-cluster-instance-dnn-interoperability.md) to learn more. 

For more details about cluster connectivity options, see [Route HADR connections to SQL Server on Azure VMs](hadr-cluster-best-practices.md#connectivity). 

## Limitations

Consider the following limitations for failover cluster instances with SQL Server on Azure Virtual Machines. 

### Lightweight extension support   

At this time, SQL Server failover cluster instances on Azure virtual machines are supported only with the [lightweight management mode](sql-server-iaas-agent-extension-automate-management.md#management-modes) of the SQL Server IaaS Agent Extension. To change from full extension mode to lightweight, delete the **SQL virtual machine** resource for the corresponding VMs and then register them with the SQL IaaS Agent extension in lightweight mode. When you're deleting the **SQL virtual machine** resource by using the Azure portal, clear the check box next to the correct virtual machine to avoid deleting the virtual machine. 

The full extension supports features such as automated backup, patching, and advanced portal management. These features will not work for SQL Server VMs registered in lightweight management mode.

### MSDTC 

Azure Virtual Machines support Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and [Azure Standard Load Balancer](../../../load-balancer/load-balancer-overview.md) or on SQL Server VMs that are using Azure shared disks. 

On Azure Virtual Machines, MSDTC isn't supported for Windows Server 2016 or earlier with Clustered Shared Volumes because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.


## Next steps

Review [cluster configurations best practices](hadr-cluster-best-practices.md), and then you can [prepare your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md). 

For more information, see: 

- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)   
- [SQL Server failover cluster instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)