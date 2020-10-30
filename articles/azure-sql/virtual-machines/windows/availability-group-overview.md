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

ms.topic: overview
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "10/07/2020"
ms.author: mathoma
ms.custom: "seo-lt-2019, devx-track-azurecli"

---

# Always On availability group on SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article introduces Always On availability groups for SQL Server on Azure Virtual Machines (VMs). 

## Overview

Always On availability groups on Azure Virtual Machines are similar to [Always On availability groups on-premises](/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server). However, since the virtual machines are hosted in Azure, there are a few additional considerations as well, such as VM redundancy, and routing traffic on the Azure network. 

The following diagram illustrates an availability group for SQL Server on Azure VMs:

![Availability Group](./media/availability-group-overview/00-EndstateSampleNoELB.png)


## VM redundancy 

To increase redundancy and high availability, the SQL Server VMs should either be in the same [availability set](../../../virtual-machines/windows/tutorial-availability-sets.md#availability-set-overview), or different [availability zones](../../../availability-zones/az-overview.md).

An availability set is a grouping of resources which are configured such that no two land in the same availability zone. This prevents impacting multiple resources in the group during deployment roll outs. 


## Connectivity 

In a traditional on-premises deployment, clients connect to the availability group listener using the virtual network name (VNN), and the listener routes traffic to the appropriate SQL Server replica in the availability group. However, there is an extra requirement to route traffic on the Azure network. 

With SQL Server on Azure VMs, configure a [load balancer](availability-group-vnn-azure-load-balancer-configure.md) to route traffic to your availability group listener, or, if you're on SQL Server 2019 CU8 and later, you can configure a [distributed network name (DNN) listener](availability-group-distributed-network-name-dnn-listener-configure.md) to replace the traditional VNN availability group listener. 


### VNN listener 

Use an [Azure Load Balancer](../../../load-balancer/load-balancer-overview.md) to route traffic from the client to the traditional availability group virtual network name (VNN) listener on the Azure network. 

The load balancer holds the IP addresses for the VNN listener. If you have more than one availability group, each group requires a VNN listener. One load balancer can support multiple listeners.

To get started, see [configure a load balancer](availability-group-vnn-azure-load-balancer-configure.md). 

### DNN listener

SQL Server 2019 CU8 introduces support for the distributed network name (DNN) listener. The DNN listener replaces the traditional availability group listener, negating the need for an Azure Loud Balancer to route traffic on the Azure network. 

The DNN listener is the recommended HADR connectivity solution in Azure as it simplifies deployment, reduces maintenance and cost, and reduces failover time in the event of a failure. 

Use the DNN listener to replace an existing VNN listener, or alternatively, use it in conjunction with an existing VNN listener so that your availability group has two distinct connection points - one using the VNN listener name (and port if non-default), and one using the DNN listener name and port. This could be useful for customers who want to avoid the load balancer failover latency but still take advantage of SQL Server features that depend on the VNN listener, such as distributed availability groups, service broker or filestream. To learn more, see [DNN listener and SQL Server feature interoperability](availability-group-dnn-interoperability.md)

To get started, see [configure a DNN listener](availability-group-distributed-network-name-dnn-listener-configure.md).


## Deployment 

There are multiple options for deploying an availability group to SQL Server on Azure VMs, some with more automation than others. 

The following table provides a comparison of the options available: 

| |**[Azure portal](availability-group-azure-portal-configure.md)**|**[Azure CLI / PowerShell](./availability-group-az-commandline-configure.md)**|**[Quickstart Templates](availability-group-quickstart-template-configure.md)**|**[Manual](availability-group-manually-configure-prerequisites-tutorial.md)** | 
|---------|---------|---------|--------- |---------|
|**SQL Server version** |2016 + |2016 +|2016 +|2012 +|
|**SQL Server edition** |Enterprise |Enterprise |Enterprise |Enterprise, Standard|
|**Windows Server version**| 2016 + | 2016 + | 2016 + | All| 
|**Creates the cluster for you**|Yes|Yes | Yes |No|
|**Creates the availability group for you** |Yes |No|No|No|
|**Creates listener and load balancer independently** |No|No|No|Yes|
|**Possible to create DNN listener using this method?**|No|No|No|Yes|
|**WSFC quorum configuratio**n|Cloud witness|Cloud witness|Cloud witness|All|
|**DR with multiple regions** |No|No|No|Yes|
|**Multisubnet support** |Yes|Yes|Yes|Yes|
|**Support for an existing AD**|Yes|Yes|Yes|Yes|
|**DR with multizone in the same region**|Yes|Yes|Yes|Yes|
|**Distributed AG with no AD**|No|No|No|Yes|
|**Distributed AG with no cluster** |No|No|No|Yes|
||||||



## Considerations 

On an Azure IaaS VM guest failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure IaaS VM guest cluster. Although the cluster validation report will issue a warning that the nodes are only reachable on a single network, this warning can be safely ignored on Azure IaaS VM guest failover clusters. 

## Next steps

Review the [HADR best practices](hadr-cluster-best-practices.md) and then get started with deploying your availability group using the [Azure portal](availability-group-azure-portal-configure.md), [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), [Quickstart Templates](availability-group-quickstart-template-configure.md) or [manually](availability-group-manually-configure-prerequisites-tutorial.md).

Alternatively, you can deploy a [clusterless availability group](availability-group-clusterless-workgroup-configure.md) or an availability group in [multiple regions](availability-group-manually-configure-multiple-regions.md).