---
title: Compare DNN & VNN 
description: "Compare the functionality between the Distributed Network Name and Virtual Network Name when used with failover cluster instances or availability groups with SQL Server on Azure VMs for the purpose of high availability and disaster recovery (HADR). " 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Compare Distributed Network Name with Virtual Network Name for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

## HA Configuration network considerations

HA configurations generally have duplicate hardware which can be used to take over in the event of a failure.  The consideration we're discussing here is how to get user connections properly routed to the current primary replica within the set.

Failover cluster instances and Availability Groups with SQL Server on Azure Virtual Machines use a [distributed network name (DNN)](failover-cluster-instance-distributed-network-name-dnn-configure.md) or 
a [virtual network name (VNN) with Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) to route traffic to the SQL Server instance, regardless of which node currently owns the clustered resources. There are additional considerations when using certain features and the DNN with a SQL Server FCI. See [DNN interoperability with SQL Server FCI](failover-cluster-instance-dnn-interoperability.md) to learn more. 

For more details about cluster connectivity options, see [Route HADR connections to SQL Server on Azure VMs](hadr-cluster-best-practices.md#connectivity). 

## Virtual Network Name (VNN)

The VNN is a network address/name which is managed by the cluster system.  The cluster system moves the network address from node to node during a failover event.  The address is taken offline on the original primary replica, and brought online on the new primary replica.  
In Azure VMs, this requires that a Network Load Balancer be configured to route traffic to the proper VM.
Virtual Network Names rely on the load balancer to detect that a failure has occurred and move the address to the new host.  Configuration of the load balancer has been cumbersome and takes time to get right.

### VNN in Azure VM environments

Because the virtual IP access point works differently in Azure, you need to configure [Azure Load Balancer](../../../load-balancer/index.yml) to route traffic to the IP address of the FCI nodes or the availability group listener. In Azure virtual machines, a load balancer holds the IP address for the VNN that the clustered SQL Server resources rely on. The load balancer distributes inbound flows that arrive at the front end, and then routes that traffic to the instances defined by the back-end pool. You configure traffic flow by using load-balancing rules and health probes. With SQL Server FCI, the back-end pool instances are the Azure virtual machines running SQL Server. 

There is a slight failover delay when you're using the load balancer, because the health probe conducts alive checks every 10 seconds by default. 

To get started, learn how to configure Azure Load Balancer for [failover cluster instance](failover-cluster-instance-vnn-azure-load-balancer-configure.md) or an [availability group](availability-group-vnn-azure-load-balancer-configure.md)

## Distributed Network name (DNN)

Starting with SQL Server 2019 CU8, SQL Server supports a new type of clustered network address, the DNN.

Listeners based on DNN network names work a bit differently from VNN listeners.  VNN listeners have an address which is moved from one node to another by the cluster system, while DNN listeners listen to a specific port, but for all IP addresses.  The DNS record for the listener name should resolve to all of the network addresses for replicas in the AG.  Only the primary replica will listen for connections on that port, so there is no need to move a network address around.  Because of this, there is not a need to create a network load balancer to handle redirection.  The connection will go out to all addresses which the name resolves to, and only the primary will respond on the listener port.  

A distributed network name is recommended over a load balancer when possible because:

- The end-to-end solution is more robust since you no longer have to maintain the load balancer resource.
- Eliminating the load balancer probes minimizes failover duration.
- The DNN simplifies provisioning and management of the failover cluster instance or availability group listener with SQL Server on Azure VMs.
- Most SQL Server features work transparently with FCI and availability groups when using the DNN, but there are certain features that may require special consideration. See [DNN interoperability with SQL Server FCI](failover-cluster-instance-dnn-interoperability.md) to learn more.

To get started, learn to configure a distributed network name resource for a failover cluster instance or an availability group

## Behavior differences

There are some behavioral differences which are important to take note of:

### Failover time

First, failover time is faster for DNN than it is for VNN listeners.  This is because there is no need to wait for the network load balancer to detect the failover event, and then change its routing.  However, DNN listeners only have to start listening on the DNN port. Reduced failover time can be a significant advantage.

### Existing connection behavior may change

Second, the behavior of existing connections to the listener is different when a failover occurs.  When there is a user-initiated failover, the network address on the original primary is not taken offline, so any existing connections to the listener on the original primary will not be broken and reconnected to the new primary.  This can be an unexpected difference in behavior.  The existing connection will remain connected to the original primary instance, even when it has transitioned to the secondary role.

### Database focus impacts failover behavior

There is one exception to that rule for DNN Listeners.  If the connection has focus on a database which is part of the AG (i.e. USE *ag-db*), then that database will go offline on the original Primary as the primary role transitions.  This will break the connection to the database, meaning that the connection will be re-established to the new Primary.  If the connection has focus on a database outside of the availability group, then it will remain connected to the same replica after the replica changes roles to secondary.

### Open update transactions

If you have a connection to the primary, and you have an open transaction where at least one modification has been done to a database which is a member of the availability group and you fail over, your connection is dead, and can’t be revived.  You need to reconnect.  In SSMS, you need to close the query window and open a new one.

To get started, see [configure a DNN listener](availability-group-distributed-network-name-dnn-listener-configure.md).

## Failover Cluster Instance (FCI)


Failover cluster instances with SQL Server on Azure Virtual Machines use a [distributed network name (DNN)](failover-cluster-instance-distributed-network-name-dnn-configure.md) or 
a [virtual network name (VNN) with Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) to route traffic to the SQL Server instance, regardless of which node currently owns the clustered resources. There are additional considerations when using certain features and the DNN with a SQL Server FCI. See [DNN interoperability with SQL Server FCI](failover-cluster-instance-dnn-interoperability.md) to learn more. 

For more details about cluster connectivity options, see [Route HADR connections to SQL Server on Azure VMs](hadr-cluster-best-practices.md#connectivity). 