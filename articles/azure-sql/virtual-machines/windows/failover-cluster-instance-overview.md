---
title: Failover cluster instances 
description: "Learn about failover cluster instances (FCI) with SQL Server on Azure Virtual Machines." 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Failover cluster instances with SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article introduces feature differences when working with failover cluster instances (FCI) for SQL Server on Azure Virtual Machines (VMs). 

## Overview

SQL Server on Azure VMs leverages Windows Server Failover Clustering (WSFC) functionality to provide local high availability through redundancy at the server-instance level - a failover cluster instance (FCI). An FCI is a single instance of SQL Server that is installed across Windows Server Failover Cluster (WSFC) (or simply the cluster) nodes and, possibly, across multiple subnets. On the network, an FCI appears to be an instance of SQL Server running on a single computer, but the FCI provides failover from one WSFC node to another if the current node becomes unavailable.

The rest of the article focuses on the differences for failover cluster instances when used with SQL Server on Azure VMs, but to learn more about the failover clustering technology see: 

- [Windows cluster technologies](https://docs.microsoft.com/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server Failover Cluster Instances](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)

## Quorum

Failover cluster instances with SQL Server on Azure Virtual Machines support using a disk witness, a cloud witness, or a file share witness for cluster quorum.

To learn more, see [Quorum best practices with SQL Server VMs in Azure](hadr-cluster-best-practices.md#quorum). 


## Storage

In traditional on-premises clustered environments, the Windows Failover Cluster uses a Storage Area Network (SAN) that is accessible by both nodes as the shared storage. SQL Server files are hosted on the shared storage and only the active node can access the files at one time. SQL Server on Azure VMs offers various options as a shard storage solution for a SQL Server failover cluster instance deployment. The rest of this section lists the benefits and limitations of each storage option available for SQL Server on Azure VMs. 

### Azure Shared Disks

[Azure Shared Disks](../../../virtual-machines/windows/disks-shared.md) are a feature of [Azure Managed Disks](../../../virtual-machines/windows/managed-disks-overview.md), and Windows Server Failover Cluster supports using Azure Shared Disks with a failover cluster instance. 

**Supported OS**: Windows Server 2019   
**Supported SQL version**: SQL Server 2019   



|**Benefits** |**Limitations**|
|---------|---------|
|The recommended solutions for applications looking to migrate to Azure while keeping the HADR architecture as-is.  |Only available for SQL Server 2019 and Windows Server 2019 in Preview. |
|Can migrate clustered applications to Azure as-is due to SCSI Persistent Reservations (SCSI PR) support. |Virtual machines must be placed in the same availability Set and [Proximity placement group (PPG)](../../../virtual-machines/windows/proximity-placement-groups-portal.md).|
|Supports both Premium SSD and Ultra disks. | Availability Zones are not supported. |
|Use a single shared disk or stripe multiple shared disks to create a shared storage pool.|Premium SSD Disk caching is not supported.| 


**Benefits**: 
- The recommended solutions for applications looking to migrate to Azure while keeping the HADR architecture as-is. 
- Can migrate clustered applications to Azure as-is due to SCSI Persistent Reservations (SCSI PR) support. 
- Supports both Premium SSD and Ultra disks. 
- Use a single shared disk or stripe multiple shared disks to create a shared storage pool. 



**Limitations**: 
- Only available for SQL Server 2019 and Windows Server 2019 in Preview. 
- Virtual machines must be placed in the same availability Set and [Proximity placement group (PPG)](../../../virtual-machines/windows/proximity-placement-groups-portal.md).
- Availability Zones are not supported.
- Premium SSD Disk caching is not supported.
 
To get started, see [SQL Server failover cluster instance with Azure Shared Disks](failover-cluster-instance-azure-shared-disks-manually-configure.md). 



### Storage Spaces Direct

[Storage spaces direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) (S2D) is a Windows Server feature that is supported with failover clustering on Azure Virtual Machines. Storage spaces direct provide a software-based virtual SAN.

**Supported OS**: Windows Server 2016 and higher
**Supported SQL version**: SQL Server 2016 and higher

**Benefits:** 
- S2D requires same disk capacity attached both VMs as it internally replicates writes between FCI nodes. Because of the on-going replication, using S2D requires high network bandwidth to achive high performance. 
- S2D supports Azure Blob Cahce, so reads can be served locally from the cahce but updates are replicated simlutanously on both nodes. When used with the right VM size that allows the network activity required to synchrronize S2D, then it offers a high performance shared storage solution for SQL FCI. 

**Limitations:**
- Only available for Windows Server 2016 and later. 
- Filestream is supported. 
- Availability zones are not supported.
 

To get started, see [SQL Server failover cluster instance with Storage Spaces Direct](failover-cluster-instance-azure-shared-disks-manually-configure.md). 


### Premium file share

[Premium file shares](../../../storage/files/storage-how-to-create-premium-fileshare.md) are a feature of [Azure Files](../../../storage/files/index.yml). Premium file shares are SSD-backed, consistently low-latency file shares that are fully supported for use with Failover Cluster Instances for SQL Server 2012 or later on Windows Server 2012 or later. Premium file shares give you greater flexibility, allowing you to resize and scale a file share without any downtime.

**Supported OS**: Windows Server 2012 and higher
**Supported SQL version**: SQL Server 2012 and higher

**Benefits:** 
- PFS is the only shared storage solution if VMs are spreaded over multiple availability zones. 
- PFS is a fully managed file system with single digit latencies and offers burstable IO performance. 
- PFS can be used as the fully managed shared storage option for SQL FCI for multi zone deployments.


Limitations: 
- Only available for Windows Server 2012 and later. 
- Filestream is not supported 


To get started, see [SQL Server failover cluster instance with Premium File Share](failover-cluster-instance-premium-file-share-manually-configure.md). 

### Third party

There are a number of third-party clustering solutions with supported storage. 

One example uses SIOS Datakeeper as the storage. For more information, see the blog [Failover clustering and SIOS DataKeeper](https://azure.microsoft.com/blog/high-availability-for-a-file-share-using-wsfc-ilb-and-3rd-party-software-sios-datakeeper/)

**Supported OS**:    All
**Supported SQL version**:    All

### iSCSI and ExpressRoute

You can also expose an iSCSI target shared block storage via ExpressRoute. 

For example, NetApp Private Storage (NPS) exposes an iSCSI target via ExpressRoute with Equinix to Azure VMs.

For third-party shared storage and data replication solutions, you should contact the vendor for any issues related to accessing data on failover.

**Supported OS**:    All
**Supported SQL version**:    All

## Connectivity

Failover cluster instances with SQL Server on Azure Virtual Machines support using an [virtual network name](hadr-azure-load-balancer-configure.md) with Azure Load Balancer or a [distributed network name](hadr-distributed-network-name-dnn-configure.md) to route traffic to SQL Server instance regardless of which node currently owns the clustered resources. 

To learn more, see [Route HADR connections to SQL Server on Azure VMs](hadr-cluster-best-practices.md#route-connections). 

Using the DNN with FCI has additional considerations when used with other SQL Server features: 

### DNN Feature interoperability 

Consider the following when using the distributed network name (DNN) resource with SQL Server FCI and these features: 

**Client access**   
For drivers ODBC, OLEDB, Ado.Net, JDBC, PHP, Node.JS, users need to explicitly specify the DNN DNS name as the server name in the connection string. 

**Tools**   
[SQL Server Management Studio (SSMS)](/sql/ssms/sql-server-management-studio-ssms), [sqlcmd](sql/tools/sqlcmd-utility), [Azure Data Studio](/sql/azure-data-studio/what-is) and [SQL Server Data Tools (SSDT)](/sql/ssdt/sql-server-data-tools) users need to explicitly specify the DNN DNS name as the server name in the connection string. 

**Availability group + FCI**   
Always On availability groups can be configured with a failover cluster instance (FCI) as one of the replicas. In this configuration, the mirroring endpoint URL for the FCI replica needs to use the FCI DNN. Likewise, if the FCI is used as a read-only replica, the read-only routing to the FCI replica needs to use the FCI DNN. 

**Replication**   
Replication has three components: Publisher, Distributor, Subscriber. Any of these three components can be a failover cluster instance (FCI). Since the FCI VNN is heavily used in replication configuration, both explicitly and implicitly, a network alias that maps the VNN to the DNN may be necessary for replication to work. 

Keep using the VNN name as the FCI instance name within replication, but create a network alias in the following remote situations **before configuring replication**:

| Replication component (FCI w/ DNN) | Remote component | Network alias map| Server with network map| 
|---------|---------|---------|-------- | 
|Publisher | Distributor | Publisher VNN to Publisher DNN| Distributor| 
|Distributor|Subscriber |Distributor VNN to Distributor DNN| Subscriber | 
|Distributor|Publisher | Distributor VNN to Distributor DNN | Publisher| 
|Subscriber| Distributor| Subscriber VNN to Subscriber DNN | Distributor| 

For example, if you have a Publisher that's configured as an FCI using DNN in a replication topology, and the Distributor is remote, create a network alias on the Distributor server to map the Publisher VNN to the Publisher DNN. 

This is text to present the same information as the table, not sure which is better, leaving both for now: 

- If publisher is an FCI using DNN and the distributor is remote, define a network alias to map the publisher's VNN name to the publisher's DNN name on the distributor SQL Server.
- If distributor is an FCI using DNN and the publisher is remote, define a network alias to map the distributor's VNN name to distributor's DNN name on the publisher SQL Server.
- If subscriber is an FCI using DNN and the distributor is remote, define a network alias to map the subscriber's VNN to subscriber's DNN name on the distributor SQL server.
- If distributor is an FCI using DNN and the subscriber is remote, define a network alias to map the distributor's VNN name to distributor's DNN name in the subscriber SQL Server.

**Database mirroring**   
Database mirroring can be configured with an FCI as either database mirroring partner. Configure database mirroring using [Transact-SQL (T-SQL)](/sql/database-engine/database-mirroring/example-setting-up-database-mirroring-using-windows-authentication-transact-sql) rather than the SSMS GUI to ensure the database mirroring endpoint is created using the DNN instead of the VNN. 

For client access, the **Failover Partner** property can only handle database mirroring failover, but not FCI failover. 

**MS DTC**   
The FCI can participate in distributed transactions coordinated by MS DTC. Though both clustered MSDTC and local MSDTC is supported with FCI DNN, in Azure, a load balancer is still necessary for clustered MS DTC. The DNN defined in the FCI does not replace Azure Load Balancer required for the clustered MS DTC in Azure. 

**Filestream**   
Though Filestream is supported for a database in an FCI, accessing the FileStream or FileTable using File System APIs with DNN is not supported. 

**Linked servers**   
Using a linked server with an FCI DNN is supported. Either use the DNN directly to configure a linked server, or use a network alias to map the VNN to the DNN. 

## Limitations

Consider the following limitations for failover cluster instances with SQL Server on Azure Virtual Machines: 

**Lightweight resource provider**   
At this time, SQL Server failover cluster instances on Azure virtual machines are only supported with the [lightweight management mode](sql-vm-resource-provider-register.md#management-modes) of the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md). To change from full extension mode to lightweight, delete the **SQL virtual machine** resource for the corresponding VMs and then register them with the SQL VM resource provider in lightweight mode. When deleting the **SQL virtual machine** resource using the Azure portal, **clear the checkbox next to the correct Virtual Machine**. The full extension supports features such as automated backup, patching, and advanced portal management. These features will not work for SQL Server VMs after the agent is reinstalled in lightweight management mode.

**MS DTC**   
Azure Virtual Machines supports Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and a [standard load balancer](../../../load-balancer/load-balancer-standard-overview.md).

On Azure Virtual Machines, MSDTC isn't supported on Windows Server 2016 or earlier because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.


## Next steps

Be sure to review [supported cluster configurations](hadr-cluster-best-practices.md), and then you can [prepare your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md). 

For additional information see: 
- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)   
- [SQL Server Failover Cluster Instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)

