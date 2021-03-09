---
title: Overview of SQL Server Always On availability groups
description: This article introduces SQL Server Always On availability groups on Azure Virtual Machines.
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management

ms.assetid: 601eebb1-fc2c-4f5b-9c05-0e6ffd0e5334
ms.service: virtual-machines-sql
ms.subservice: hadr

ms.topic: overview
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "10/07/2020"
ms.author: mathoma
ms.custom: "seo-lt-2019"

---

# Always On availability group on SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article introduces Always On availability groups for SQL Server on Azure Virtual Machines (VMs). 

## Overview

Always On availability groups on Azure Virtual Machines are similar to [Always On availability groups on-premises](/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server). However, since the virtual machines are hosted in Azure, there are a few additional considerations as well, such as VM redundancy, and routing traffic on the Azure network. 

The following diagram illustrates an availability group for SQL Server on Azure VMs:

![Availability Group](./media/availability-group-overview/00-EndstateSampleNoELB.png)


## VM redundancy 

To increase redundancy and high availability, SQL Server VMs should either be in the same [availability set](../../../virtual-machines/availability-set-overview.md), or different [availability zones](../../../availability-zones/az-overview.md).

Placing a set of VMs in the same availability set protects from outages within a datacenter caused by equipment failure (VMs within an Availability Set do not share resources) or from updates (VMs within an Availability Set are not updated at the same time). 
Availability Zones protect against the failure of an entire datacenter, with each Zone representing a set of datacenters within a region.  By ensuring resources are placed in different Availability Zones, no datacenter-level outage can take all of your VMs offline.

When creating Azure VMs, you must choose between configuring Availability Sets vs Availability Zones.  An Azure Vm cannot participate in both.



## Connectivity

You can configure a virtual network name, or a distributed network name for an availability group. [Review the differences between the two](hadr-compare-virtual-distributed-network-name.md) and then deploy either a [distributed network name](availability-group-distributed-network-name-dnn-listener-configure.md) or a [virtual network name](availability-group-vnn-azure-load-balancer-configure.md) for your availability group. 

If you are using DNN or if your AG spans across multiple subnets like multiple Azure regions and you are using client libraries that support the MultiSubnetFailover connection option in the connection string, you can optimize availability group failover to a different subnet by setting MultiSubnetFailover to "True" or "Yes. The MultiSubnetFailover connection option only works with the TCP network protocol.

### Basic availability group

As basic AG does not allow to have more than one secondary replica and there is no read access to the secondary replica, you can use Database mirroring connection strings for Basic AG. This eliminates the need to have listeners. This is more helpful for AG on Azure VM as this eliminates the need of load balancer or adding additional IPs to the load balancer, for multiple listeners for additional databases. 

For example, to explicitly connect using TCP/IP to the AG database AdventureWorks on either Replica_A or Replica_B of a Basic AG (or any AG that that has only one secondary replica and the read access is not allowed in the secondary replica), a client application could supply the following database mirroring connection string to successfully connect to the AG:
"Server=Replica_A; Failover_Partner=Replica_B; Database=AdventureWorks; Network=dbmssocn



## Deployment 

There are multiple options for deploying an availability group to SQL Server on Azure VMs, some with more automation than others. 

The following table provides a comparison of the options available:

| | Azure portal | Azure CLI / PowerShell | Quickstart Templates | Manual |
|---------|---------|---------|---------|---------|
|**SQL Server version** |2016 + |2016 +|2016 +|2012 +|
|**SQL Server edition** |Enterprise |Enterprise |Enterprise |Enterprise, Standard|
|**Windows Server version**| 2016 + | 2016 + | 2016 + | All|
|**Creates the cluster for you**|Yes|Yes | Yes |No|
|**Creates the availability group for you** |Yes |No|No|No|
|**Creates listener and load balancer independently** |No|No|No|Yes|
|**Possible to create DNN listener using this method?**|No|No|No|Yes|
|**WSFC quorum configuration**|Cloud witness|Cloud witness|Cloud witness|All|
|**DR with multiple regions** |No|No|No|Yes|
|**Multisubnet support** |Yes|Yes|Yes|Yes|
|**Support for an existing AD**|Yes|Yes|Yes|Yes|
|**DR with multizone in the same region**|Yes|Yes|Yes|Yes|
|**Distributed AG with no AD**|No|No|No|Yes|
|**Distributed AG with no cluster** |No|No|No|Yes|

For more information, see [Azure portal](availability-group-azure-portal-configure.md), [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), [Quickstart Templates](availability-group-quickstart-template-configure.md), and [Manual](availability-group-manually-configure-prerequisites-tutorial.md).

## Lease mechanism 

For SQL Server, the AG resource DLL determines the health of the AG based on the AG lease mechanism and Always On health detection. The AG resource DLL exposes the resource health through the IsAlive operation. The resource monitor polls IsAlive at the cluster heartbeat interval, which is set by the CrossSubnetDelay and SameSubnetDelay cluster-wide values. On a primary node, the cluster service initiates failovers whenever the IsAlive call to the resource DLL returns that the AG is not healthy.

The Always On resource DLL monitors the status of internal SQL Server components. sp_server_diagnostics reports the health of these components SQL Server on an interval controlled by HealthCheckTimeout.

Unlike other failover mechanisms, the SQL Server instance plays an active role in the lease mechanism. The lease mechanism is used as a Looks-Alive validation between the Cluster resource host and the SQL Server process. The mechanism is used to ensure that the two sides (the Cluster Service and SQL Server service) are in frequent contact, checking each other's state and ultimately preventing a split-brain scenario.


## Considerations 

On an Azure IaaS VM guest failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure IaaS VM guest cluster. Although the cluster validation report will issue a warning that the nodes are only reachable on a single network, this warning can be safely ignored on Azure IaaS VM guest failover clusters. 

## Next steps

Review the [HADR best practices](hadr-cluster-best-practices.md) and then get started with deploying your availability group using the [Azure portal](availability-group-azure-portal-configure.md), [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), [Quickstart Templates](availability-group-quickstart-template-configure.md) or [manually](availability-group-manually-configure-prerequisites-tutorial.md).

Alternatively, you can deploy a [clusterless availability group](availability-group-clusterless-workgroup-configure.md) or an availability group in [multiple regions](availability-group-manually-configure-multiple-regions.md).
