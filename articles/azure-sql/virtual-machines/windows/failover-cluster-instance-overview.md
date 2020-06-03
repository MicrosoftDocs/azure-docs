---
title: Failover cluster instances 
description: "This article introduces the failover cluster instance feature with SQL Server on Azure Virtual Machines."
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

This article introduces failover cluster instances for SQL Server on Azure Virtual Machines (VMs). 

## Overview

SQL Server on Azure VMs leverages Windows Server Failover Clustering (WSFC) functionality to provide local high availability to provide local high availability through redundancy at the server-instance level-a failover cluster instance (FCI). An FCI is a single instance of SQL Server that is installed across Windows Server Failover Clustering (WSFC) nodes and, possibly, across multiple subnets. On the network, an FCI appears to be an instance of SQL Server running on a single computer, but the FCI provides failover from one WSFC node to another if the current node becomes unavailable.

For more information about the feature, see the SQL Server [failover cluster instance](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server) documentation. 

The rest of the article focuses on the differences for the feature when used with SQL Server on Azure VMs. 


## Storage

In a traditional on-premises SQL Server clustered environment, the Windows Failover Cluster uses local shared storage that is accessible by both nodes. Since storage for a virtual machine is not local, there are several solutions available to deploy a failover cluster with SQL Serer on Azure VMs. 

### Shared managed disks

[Shared managed disks](../../../virtual-machines/windows/disks-shared.md) are a feature of [Azure Virtual Machines](../../../virtual-machines/windows/index.yml), and Windows Server 2019 supports using shared managed disks with a failover cluster instance. 

Benefits: 

Limitations: 
- Only available for Windows Server 2019. 
 
To get started, see [SQL Server failover cluster instance with shared managed disks](failover-cluster-instance-shared-managed-disks-manually-configure.md). 

### Storage spaces direct

[Storage spaces direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) are a Windows Server feature that is supported with failover clustering on Azure Virtual Machines. Storage spaces direct provide a software-based virtaul SAN. 

Benefits:

Limitations:
- Only available for Windows Server 2016 and later. 
 

To get started, see [SQL Server failover cluster instance storage spaces direct](failover-cluster-instance-shared-managed-disks-manually-configure.md). 

###  Premium file share

[Premium file shares](../../../storage/files/storage-how-to-create-premium-fileshare.md) are a feature of [Azure Files](../../../storage/files/index.yml). Premium file shares are SSD-backed consistently-low-latency file shares that are fully supported for use with Failover Cluster Instance. 

Benefits:


Limitations: 
- Only available for Windows Server 2012 and later. 


To get started, see [SQL Server failover cluster instance with premium file share](failover-cluster-instance-premium-file-share-manually-configure.md). 

### Third party

There are a number of third-party clustering solutions with supported storage. 

One example uses SIOS Datakeeper as the storage. For more information, see the blog [Failover clustering and SIOS DataKeeper](https://azure.microsoft.com/blog/high-availability-for-a-file-share-using-wsfc-ilb-and-3rd-party-software-sios-datakeeper/)

### iSCSI and ExpressRoute

You can also expose an iSCSI target shared block storage via ExpressRoute. 

For example, NetApp Private Storage (NPS) exposes an iSCSI target via ExpressRoute with Equinix to Azure VMs.

For third-party shared storage and data replication solutions, you should contact the vendor for any issues related to accessing data on failover.



## Connectivity 

In a traditional on-premises SQL Server environment, traffic is routed to the primary instance using DNS. However, since the virtual machines are hosted in Azure, a routing component is necessary to connect to your cluster on the virtual network. As such, the use of failover clustering with SQL Server on Azure VMs requires the configuration of an Azure load balancer. Alternatively, if you're on Windows Server 2019, you can use a dynamic network name instead. 

### Azure load balancer

The [Azure load balancer](../../../load-balancer/index.yml) is an Azure product that routes traffic from the internet to a designated target based on load-balancing rules. A load balancer is used to route traffic from the client to the current primary active node. The load balancer requires you to designate the ports, health probe, and load-balancing rules per clustering solution. 

### Dynamic network name

Dynamic network name (DNN) is available for Windows Server 2019 and is a 



## Next steps

[Configure a SQL Server Always On Availability Group on Azure Virtual Machines in Different Regions](availability-group-manually-configure-multiple-regions.md)

