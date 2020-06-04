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

SQL Server on Azure VMs leverages Windows Server Failover Clustering (WSFC) functionality to provide local high availability through redundancy at the server-instance level-a failover cluster instance (FCI). An FCI is a single instance of SQL Server that is installed across Windows Server Failover Clustering (WSFC) nodes and, possibly, across multiple subnets. On the network, an FCI appears to be an instance of SQL Server running on a single computer, but the FCI provides failover from one WSFC node to another if the current node becomes unavailable.

For more information about the feature, see the SQL Server [failover cluster instance](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server) documentation. 

The rest of the article focuses on the differences for the feature when used with SQL Server on Azure VMs. 

For more information about failover clustering, see

- [Windows cluster technologies](https://docs.microsoft.com/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server Failover Cluster Instances](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)

> [!IMPORTANT]
> At this time, SQL Server failover cluster instances on Azure virtual machines are only supported with the [lightweight management mode](sql-vm-resource-provider-register.md#management-modes) of the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md). To change from full extension mode to lightweight, delete the **SQL virtual machine** resource for the corresponding VMs and then register them with the SQL VM resource provider in lightweight mode. When deleting the **SQL virtual machine** resource using the Azure portal, **clear the checkbox next to the correct Virtual Machine**. The full extension supports features such as automated backup, patching, and advanced portal management. These features will not work for SQL Server VMs after the agent is reinstalled in lightweight management mode.

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

### Storage spaces direct

[Storage spaces direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) are a Windows Server feature that is supported with failover clustering on Azure Virtual Machines. Storage spaces direct provide a software-based virtual SAN. 

Benefits:

Limitations:
- Only available for Windows Server 2016 and later. 
- Filestream is supported. 
 

To get started, see [SQL Server failover cluster instance storage spaces direct](failover-cluster-instance-shared-managed-disks-manually-configure.md). 

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

### iSCSI and ExpressRoute

You can also expose an iSCSI target shared block storage via ExpressRoute. 

For example, NetApp Private Storage (NPS) exposes an iSCSI target via ExpressRoute with Equinix to Azure VMs.

For third-party shared storage and data replication solutions, you should contact the vendor for any issues related to accessing data on failover.

## Networking

One thing to be aware of is that on an Azure virtual machine guest failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure virtual machine guest cluster. The cluster validation report will warn you that the nodes are reachable only on a single network. You can ignore this warning on Azure virtual machine guest failover clusters.

## Connectivity 

In a traditional on-premises network environment, a SQL Server failover cluster instance (FCI) appears to be a single instance of SQL Server running on a single computer.  Since the failover cluster instance fails over from node to node, the virtual network name (VNN) for the instance provides a unified connection point and allows applications to connect to the SQL Server instance without knowing which node is currently active. When a failover occurs, the virtual network name is registered to the new active node after it starts. This process is transparent to the client or application connecting to SQL Server and this minimizes the downtime the application or clients experience during a failure. 

Use an Azure load balancer or a dynamic network name (DNN) to route traffic to the virtual network name of the failover cluster instance with a SQL Server on Azure VM. The dynamic network name feature is currently only available for SQL Server 2019 on a Windows Server 2019 virtual machine. 

### Azure load balancer

Since the virtual network name IP does not work in Azure, you can configure an [Azure load balancer](../../../load-balancer/index.yml) to route traffic to the IP address of the virtual network name in Azure. In Azure virtual machines, a load balancer holds the IP address for the virtual network name (VNN) that the clustered SQL Server resources relies on. The load balancer distributes inbound flows that arrive at the frontend, and then routes that traffic to the instances defined by the backend pool. Traffic flow is configured using load balancing rules and health probes. With SQL Server FCI, the backend pool instances are the Azure Virtual Machines running SQL Server. 

There is a slight failover delay when using the load balancer as the health probe conducts alive checks every 10 seconds by default. 

To get started, learn how to [configure an Azure load balancer for an FCI](failover-cluster-instance-connectivity-configure.md#load-balancer). 

### Dynamic network name (preview)

Dynamic network name (DNN) is a new feature for Windows Server 2019, and is currently in public preview for SQL Server 2019 and Windows Server 2019 with SQL Server on Azure VMs. The dynamic network name provides an alternative way for SQL Server clients to connect to the SQL Server failover cluster instance without using a load balancer. 

When a dynamic network name resource is created, the cluster binds the DNS name with the IP addresses of all the nodes in the cluster. The SQL client will try to connect to each IP address in this list to find the node where the failover cluster instance is currently running. This process can be accelerated by specifying `MultiSubnetFailover=True` in the connection string, which tells the provider to try all IP addresses in parallel, allowing the client to connect to the FCI instantly. 

Using a dynamic network name rather than a load balancer has the following benefits: 
- End-to-end solution is more robust since you no longer have to maintain the load balancer resource. 
- Minimized failover duration by eliminating the load balancer probes. 
- Simplified provisioning and management of the failover cluster instance with a SQL Server on Azure VM. 

To get started, learn how to [configure a dynamic network name (DNN) resource for an FCI](failover-cluster-instance-connectivity-configure.md#dynamic-network-name). 

## Next steps

[Configure a SQL Server Always On Availability Group on Azure Virtual Machines in Different Regions](availability-group-manually-configure-multiple-regions.md)

