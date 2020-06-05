---
title: Failover cluster instances 
description: "Learn about the differences with the failover cluster instance (FC) feature for SQL Server on Azure Virtual Machines." 
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

SQL Server on Azure VMs leverages Windows Server Failover Clustering (WSFC) functionality to provide local high availability through redundancy at the server-instance level - a failover cluster instance (FCI). An FCI is a single instance of SQL Server that is installed across Windows Server Failover Cluster (WSFC) (or simply the cluster) nodes and, possibly, across multiple subnets. On the network, an FCI appears to be an instance of SQL Server running on a single computer, but the FCI provides failover from one WSFC node to another if the current node becomes unavailable.

The rest of the article focuses on the differences for failover cluster instances when used with SQL Server on Azure VMs, but to learn more about the failover clustering technology see: 

- [Windows cluster technologies](https://docs.microsoft.com/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server Failover Cluster Instances](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)

## Licensing and pricing

On Azure virtual machines, you can license SQL Server using the pay-as-you-go (PAYG) or bring-your-own-license (BYOL)/Azure Hybrid Benefit (AHUB) licensing model. The type of licensing model you choose you choose affects how you're charged when using the failover cluster feature with SQL Server on Azure VMs.

With pay-as-you-go licensing, a failover cluster instance (FCI) of SQL Server on Azure virtual machines incurs charges for all nodes of the FCI, including the passive nodes. See [pricing](https://azure.microsoft.com/pricing/details/virtual-machines/sql-server-enterprise/) to learn more. 

If you have an Enterprise Agreement with Software Assurance, you can use one free passive FCI node for each active node. To take advantage of this benefit in Azure, use the Azure Hybrid Benefit licensing model on both the active and passive nodes in the cluster. See [Enterprise Agreement](https://www.microsoft.com/Licensing/licensing-programs/enterprise.aspx) to learn more.

To compare pay-as-you-go and BYOL licensing for SQL Server on Azure virtual machines, see [Get started with SQL Server on Azure VMs](sql-server-on-azure-vm-iaas-what-is-overview.md#get-started-with-sql-vms).

For complete information about licensing SQL Server, see [Pricing](https://www.microsoft.com/sql-server/sql-server-2019-pricing).


## Storage

In a traditional on-premises SQL Server clustered environment, the Windows Failover Cluster uses local shared storage that is accessible by both nodes. Since storage for a virtual machine is not local, there are several solutions available to deploy a failover cluster with SQL Serer on Azure VMs. 

### Shared managed disks

[Shared managed disks](../../../virtual-machines/windows/disks-shared.md) are a feature of [Azure Virtual Machines](../../../virtual-machines/windows/index.yml), and Windows Server 2019 supports using shared managed disks with a failover cluster instance. 

Benefits: 

Limitations: 
- Only available for Windows Server 2019. 
- Proximity placement group (PPG)
- Has to be in an availability set. 
 
To get started, see [SQL Server failover cluster instance with shared managed disks](failover-cluster-instance-shared-managed-disks-manually-configure.md). 

**Supported OS**: 
**Supported SQL version**: 

### Storage spaces direct

[Storage spaces direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) are a Windows Server feature that is supported with failover clustering on Azure Virtual Machines. Storage spaces direct provide a software-based virtual SAN. 

Benefits:

Limitations:
- Only available for Windows Server 2016 and later. 
- Filestream is supported. 
 

To get started, see [SQL Server failover cluster instance storage spaces direct](failover-cluster-instance-shared-managed-disks-manually-configure.md). 

**Supported OS**: 
**Supported SQL version**: 

###  Premium file share

[Premium file shares](../../../storage/files/storage-how-to-create-premium-fileshare.md) are a feature of [Azure Files](../../../storage/files/index.yml). Premium file shares are SSD-backed, consistently low-latency file shares that are fully supported for use with Failover Cluster Instances for SQL Server 2012 or later on Windows Server 2012 or later. Premium file shares give you greater flexibility, allowing you to resize and scale a file share without any downtime.

Benefits:


Limitations: 
- Only available for Windows Server 2012 and later. 
- Filestream is not supported 


To get started, see [SQL Server failover cluster instance with premium file share](failover-cluster-instance-premium-file-share-manually-configure.md). 

### Third party

There are a number of third-party clustering solutions with supported storage. 

One example uses SIOS Datakeeper as the storage. For more information, see the blog [Failover clustering and SIOS DataKeeper](https://azure.microsoft.com/blog/high-availability-for-a-file-share-using-wsfc-ilb-and-3rd-party-software-sios-datakeeper/)

**Supported OS**: 
**Supported SQL version**: 

### iSCSI and ExpressRoute

You can also expose an iSCSI target shared block storage via ExpressRoute. 

For example, NetApp Private Storage (NPS) exposes an iSCSI target via ExpressRoute with Equinix to Azure VMs.

For third-party shared storage and data replication solutions, you should contact the vendor for any issues related to accessing data on failover.

**Supported OS**: 
**Supported SQL version**: 

## Quorum

Although a two node cluster will function without a [quorum resource](/windows-server/storage/storage-spaces/understand-quorum), customers are strictly required to use a quorum resource to have production support and, cluster validation will not pass any cluster without a quorum resource. 

Technically, a three node cluster can survive a single node loss (down to two nodes) without a quorum resource – but once the cluster is down to two nodes, there is risk of running into: 

1. **Partition in space** (split brain): The cluster nodes become separated on the network due to the server, NIC, or switch issue. 
1. **Partition in time** (amnesia): A node joins or rejoins the cluster and tries to claim ownership of the cluster group or a cluster role inappropriately. 

The quorum resource protects the cluster against either of these issues. 

To configure the quorum resource with SQL Server on Azure VMs, you can use a Disk Witness, a Cloud Witness, or a File Share Witness. 

## Disk Witness

A small clustered disk which is in the Cluster Available Storage group. This disk is highly-available and can failover between nodes. It contains a copy of the cluster database, with a default size of less than 1 GB usually. Disk Witness is a unique capability of Azure Shared Disks and preferred because it is a familiar part of the on-premises infrastructure. 

Since the disk witness is common in on-premises clusters, the familiar functionality makes it easier to adapt to the Azure environment, and technically provides the most protection for teh cluster. 

To get started, see [Configure Disk Witness?? need link? or do we write this content ourselves? ]()


**Supported OS**: 
**Supported SQL version**: 
**Supported FCI storage**: Azure Shared Storage

## Cloud Witness

A [Cloud Witness](/windows-server/failover-clustering/deploy-cloud-witness) is a type of Failover Cluster quorum witness that uses Microsoft Azure to provide a vote on cluster quorum. The default size is about 1 MB and contains just the time stamp. Cloud Witness is ideal for multi-site, multi-zone, and multi-region deployments.

To get started, see [Configure Cloud Witness](/windows-server/failover-clustering/deploy-cloud-witness#CloudWitnessSetUp).


**Supported OS**: Windows Server 2019 and later
**Supported SQL version**: 
**Supported FCI storage**: 

## File Share Witness

A SMB file share that is typically configured on a file server running Windows Server. It maintains clustering information in a witness.log file, but doesn't store a copy of the cluster database. In Azure, you can you can configure an [Azure File Share](../../../storage/files/storage-how-to-create-file-share.md) to use as the File Share Witness, or you can use a file share on a separate virtual machine.

If you're going to use another Azure file share, you can mount it with the same process used to [mount the premium file share](failover-cluster-instance-premium-file-share-manually-configure.md#mount-the-premium-file-share). 

To get started, see [Configure File Share Witness need link? or should we create our own :| ]


**Supported OS**: Windows Server 2012 and later
**Supported SQL version**: 
**Supported FCI storage**: 

## Networking

One thing to be aware of is that on an Azure virtual machine guest failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure virtual machine guest cluster. The cluster validation report will warn you that the nodes are reachable only on a single network. You can ignore this warning on Azure virtual machine guest failover clusters.

## Connectivity 

In a traditional on-premises network environment, a SQL Server failover cluster instance (FCI) appears to be a single instance of SQL Server running on a single computer.  Since the failover cluster instance fails over from node to node, the virtual network name (VNN) for the instance provides a unified connection point and allows applications to connect to the SQL Server instance without knowing which node is currently active. When a failover occurs, the virtual network name is registered to the new active node after it starts. This process is transparent to the client or application connecting to SQL Server and this minimizes the downtime the application or clients experience during a failure. 

Use an Azure load balancer or a dynamic network name (DNN) to route traffic to the virtual network name of the failover cluster instance with a SQL Server on Azure VM. The dynamic network name feature is currently only available for SQL Server 2019 on a Windows Server 2019 virtual machine. 

### Azure load balancer

Since the virtual network name IP does not work in Azure, you can configure an [Azure load balancer](../../../load-balancer/index.yml) to route traffic to the IP address of the virtual network name in Azure. In Azure virtual machines, a load balancer holds the IP address for the virtual network name (VNN) that the clustered SQL Server resources relies on. The load balancer distributes inbound flows that arrive at the frontend, and then routes that traffic to the instances defined by the backend pool. Traffic flow is configured using load balancing rules and health probes. With SQL Server FCI, the backend pool instances are the Azure Virtual Machines running SQL Server. 

There is a slight failover delay when using the load balancer as the health probe conducts alive checks every 10 seconds by default. 

To get started, learn how to [configure an Azure load balancer for an FCI](failover-cluster-instance-connectivity-configure.md#load-balancer). 

**Supported OS**: Windows Server 2012 and greater
**Supported SQL version**: SQL Server 2012 and greater
**Supported FCI storage**: All storage options 

### Dynamic network name (preview)

Dynamic network name (DNN) is a new feature for Windows Server 2019, and is currently in public preview for SQL Server 2019 and Windows Server 2019 with SQL Server on Azure VMs. The dynamic network name provides an alternative way for SQL Server clients to connect to the SQL Server failover cluster instance without using a load balancer. 

When a dynamic network name resource is created, the cluster binds the DNS name with the IP addresses of all the nodes in the cluster. The SQL client will try to connect to each IP address in this list to find the node where the failover cluster instance is currently running. This process can be accelerated by specifying `MultiSubnetFailover=True` in the connection string, which tells the provider to try all IP addresses in parallel, allowing the client to connect to the FCI instantly. 

Using a dynamic network name rather than a load balancer has the following benefits: 
- End-to-end solution is more robust since you no longer have to maintain the load balancer resource. 
- Minimized failover duration by eliminating the load balancer probes. 
- Simplified provisioning and management of the failover cluster instance with SQL Server on Azure VM. 

Most SQL Server features work transparently with FCI and you can simply replace the existing VNN DNS name with the DNN DNS name, or set the DNN name value with the existing VNN DNS name. However, some server side components require a network alias that maps the VNN Name to the DNN name. Additionally, there may be specific cases that require the explicit use of the DNN DNS name, such as when defining certain URLs in a server-side configuration. 

To get started, learn how to [configure a dynamic network name (DNN) resource for an FCI](failover-cluster-instance-connectivity-configure.md#dynamic-network-name). 

**Supported OS**: Windows Server 2019
**Supported SQL version**: SQL Server 2019
**Supported FCI storage**:  Shared Managed Disks

## Limitations

## Lightweight resource provider

-  At this time, SQL Server failover cluster instances on Azure virtual machines are only supported with the [lightweight management mode](sql-vm-resource-provider-register.md#management-modes) of the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md). To change from full extension mode to lightweight, delete the **SQL virtual machine** resource for the corresponding VMs and then register them with the SQL VM resource provider in lightweight mode. When deleting the **SQL virtual machine** resource using the Azure portal, **clear the checkbox next to the correct Virtual Machine**. The full extension supports features such as automated backup, patching, and advanced portal management. These features will not work for SQL Server VMs after the agent is reinstalled in lightweight management mode.

### MS DTC 
Azure Virtual Machines supports Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and a [standard load balancer](../../../load-balancer/load-balancer-standard-overview.md).

On Azure Virtual Machines, MSDTC isn't supported on Windows Server 2016 or earlier because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.


## Next steps

[Configure a SQL Server Always On Availability Group on Azure Virtual Machines in Different Regions](availability-group-manually-configure-multiple-regions.md)

