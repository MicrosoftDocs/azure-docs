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
ms.date: "06/01/2021"
ms.author: mathoma
ms.custom: "seo-lt-2019"

---

# Always On availability group on SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article introduces Always On availability groups (AG) for SQL Server on Azure Virtual Machines (VMs). 

## Overview

Always On availability groups on Azure Virtual Machines are similar to [Always On availability groups on-premises](/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server), and rely on the underlying [Windows Server Failover Cluster](hadr-windows-server-failover-cluster-overview.md). However, since the virtual machines are hosted in Azure, there are a few additional considerations as well, such as VM redundancy, and routing traffic on the Azure network. 

The following diagram illustrates an availability group for SQL Server on Azure VMs:

![Availability Group](./media/availability-group-overview/00-EndstateSampleNoELB.png)

> [!NOTE]
> It's now possible to lift and shift your availability group solution to SQL Server on Azure VMs using Azure Migrate. See [Migrate availability group](../../migration-guides/virtual-machines/sql-server-availability-group-to-sql-on-azure-vm.md) to learn more. 

## VM redundancy 

To increase redundancy and high availability, SQL Server VMs should either be in the same [availability set](../../../virtual-machines/availability-set-overview.md), or different [availability zones](../../../availability-zones/az-overview.md).

Placing a set of VMs in the same availability set protects from outages within a data center caused by equipment failure (VMs within an Availability Set do not share resources) or from updates (VMs within an availability set are not updated at the same time). 

Availability Zones protect against the failure of an entire data center, with each Zone representing a set of data centers within a region.  By ensuring resources are placed in different Availability Zones, no data center-level outage can take all of your VMs offline.

When creating Azure VMs, you must choose between configuring Availability Sets vs Availability Zones.  An Azure VM cannot participate in both. 

While Availability Zones may provide better availability than Availability Sets (99.99% vs 99.95%), performance should also be a consideration. VMs within an Availability Set can be placed in a [proximity placement group](../../../virtual-machines/co-location.md) which guarantees that they are close to each other, minimizing network latency between them. VMs located in different Availability Zones will have greater network latency between them, which can increase the time it takes to synchronize data between the primary and secondary replica(s). This may cause delays on the primary replica as well as increase the chance of data loss in the event of an unplanned failover. It is important to test the proposed solution under load and ensure that it meets SLAs for both performance and availability.

## Connectivity

You can configure a virtual network name, or a distributed network name for an availability group. [Review the differences between the two](hadr-windows-server-failover-cluster-overview.md) and then deploy either a [distributed network name (DNN)](availability-group-distributed-network-name-dnn-listener-configure.md) or a [virtual network name (VNN)](availability-group-vnn-azure-load-balancer-configure.md) for your availability group. 

Most SQL Server features work transparently with availability groups when using the DNN, but there are certain features that may require special consideration. See [AG and DNN interoperability](availability-group-dnn-interoperability.md) to learn more. 

Additionally, there are some behavior differences between the functionality of the VNN listener and DNN listener that are important to note: 

- **Failover time**: Failover time is faster when using a DNN listener since there is no need to wait for the network load balancer to detect the failure event and change its routing. 
- **Existing connections**: Connections made to a *specific database* within a failing-over availability group will close, but other connections to the primary replica will remain open since the DNN stays online during the failover process. This is different than a traditional VNN environment where all connections to the primary replica typically close when the availability group fails over, the listener goes offline, and the primary replica transitions to the secondary role. When using a DNN listener, you may need to adjust application connection strings to ensure that connections are redirected to the new primary replica upon failover.
- **Open transactions**: Open transactions against a database in a failing-over availability group will close and roll back, and you need to *manually* reconnect. For example, in SQL Server Management Studio, close the query window and open a new one. 

Setting up a VNN listener in Azure requires a load balancer. There are two main options for load balancers in Azure: external (public) or internal. The external (public) load balancer is internet-facing and is associated with a public virtual IP that's accessible over the internet. An internal load balancer supports only clients within the same virtual network. For either load balancer type, you must enable [Direct Server Return](../../../load-balancer/load-balancer-multivip-overview.md#rule-type-2-backend-port-reuse-by-using-floating-ip). 

You can still connect to each availability replica separately by connecting directly to the service instance. Also, because availability groups are backward compatible with database mirroring clients, you can connect to the availability replicas like database mirroring partners as long as the replicas are configured similarly to database mirroring:

* There's one primary replica and one secondary replica.
* The secondary replica is configured as non-readable (**Readable Secondary** option set to **No**).

Here's an example client connection string that corresponds to this database mirroring-like configuration using ADO.NET or SQL Server Native Client:

```console
Data Source=ReplicaServer1;Failover Partner=ReplicaServer2;Initial Catalog=AvailabilityDatabase;
```

For more information on client connectivity, see:

* [Using Connection String Keywords with SQL Server Native Client](/sql/relational-databases/native-client/applications/using-connection-string-keywords-with-sql-server-native-client)
* [Connect Clients to a Database Mirroring Session (SQL Server)](/sql/database-engine/database-mirroring/connect-clients-to-a-database-mirroring-session-sql-server)
* [Connecting to Availability Group Listener in Hybrid IT](/archive/blogs/sqlalwayson/connecting-to-availability-group-listener-in-hybrid-it)
* [Availability Group Listeners, Client Connectivity, and Application Failover (SQL Server)](/sql/database-engine/availability-groups/windows/listeners-client-connectivity-application-failover)
* [Using Database-Mirroring Connection Strings with Availability Groups](/sql/database-engine/availability-groups/windows/listeners-client-connectivity-application-failover)

## Lease mechanism 

For SQL Server, the AG resource DLL determines the health of the AG based on the AG lease mechanism and Always On health detection. The AG resource DLL exposes resource health through the *IsAlive* operation. The resource monitor polls IsAlive at the cluster heartbeat interval, which is set by the **CrossSubnetDelay** and **SameSubnetDelay** cluster-wide values. On a primary node, the cluster service initiates failover whenever the IsAlive call to the resource DLL returns that the AG is not healthy.

The AG resource DLL monitors the status of internal SQL Server components. Sp_server_diagnostics reports the health of these components to SQL Server on an interval controlled by **HealthCheckTimeout**.

Unlike other failover mechanisms, the SQL Server instance plays an active role in the lease mechanism. The lease mechanism is used as a *LooksAlive* validation between the Cluster resource host and the SQL Server process. The mechanism is used to ensure that the two sides (the Cluster Service and SQL Server service) are in frequent contact, checking each other's state and ultimately preventing a split-brain scenario.

When configuring an AG in Azure VMs, there is often a need to configure these thresholds differently than they would be configured in an on-premises environment. To configure threshold settings according to best practices for Azure VMs, see the [cluster best practices](hadr-cluster-best-practices.md). 


## Network configuration  

On an Azure VM failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure VM failover cluster. Although the cluster validation report will issue a warning that the nodes are only reachable on a single network, this warning can be safely ignored on Azure VM failover clusters. 

## Basic availability group

As basic availability group does not allow more than one secondary replica and there is no read access to the secondary replica, you can use the database mirroring connection strings for basic availability groups. Using the connection string eliminates the need to have listeners. Removing the listener dependency is helpful for availability groups on Azure VMs as it eliminates the need for a load balancer or having to add additional IPs to the load balancer when you have multiple listeners for additional databases. 

For example, to explicitly connect using TCP/IP to the AG database AdventureWorks on either Replica_A or Replica_B of a Basic AG (or any AG that that has only one secondary replica and the read access is not allowed in the secondary replica), a client application could supply the following database mirroring connection string to successfully connect to the AG

`Server=Replica_A; Failover_Partner=Replica_B; Database=AdventureWorks; Network=dbmssocn`


## Deployment options

There are multiple options for deploying an availability group to SQL Server on Azure VMs, some with more automation than others. 

The following table provides a comparison of the options available:

| | [Azure portal](availability-group-azure-portal-configure.md), | [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md) | [Quickstart Templates](availability-group-quickstart-template-configure.md) | [Manual](availability-group-manually-configure-prerequisites-tutorial.md) |
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

## Next steps

Review the [HADR best practices](hadr-cluster-best-practices.md) and then get started with deploying your availability group using the [Azure portal](availability-group-azure-portal-configure.md), [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), [Quickstart Templates](availability-group-quickstart-template-configure.md) or [manually](availability-group-manually-configure-prerequisites-tutorial.md).

Alternatively, you can deploy a [clusterless availability group](availability-group-clusterless-workgroup-configure.md) or an availability group in [multiple regions](availability-group-manually-configure-multiple-regions.md).

To learn more, see:

- [Windows Server Failover Cluster with SQL Server on Azure VMs](hadr-windows-server-failover-cluster-overview.md)
- [Always On availability groups overview](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server)
