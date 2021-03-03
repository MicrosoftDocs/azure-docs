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


## Virtual Network Name (VNN)

Traditionally, the VNN was used. The VNN is a network address/name, which is managed by the cluster system.  The cluster system moves the network address from node to node during a failover event.  The address is taken offline on the original primary replica, and brought online on the new primary replica.  In Azure VMs, this requires that a Network Load Balancer be configured to route traffic to the proper VM.
Virtual Network Names rely on the load balancer to detect that a failure has occurred and move the address to the new host.  Configuration of the load balancer has been cumbersome and takes time to get right.

## Distributed Network name (DNN)

Starting with SQL Server 2019 CU8, SQL Server supports a new type of clustered network address, the DNN.

Listeners based on DNN network names work a bit differently from VNN listeners.  VNN listeners have an address which is moved from one node to another by the cluster system, while DNN listeners listen to a specific port, but for all IP addresses.  The DNS record for the listener name should resolve to all of the network addresses for replicas in the AG.  Only the primary replica will listen for connections on that port, so there is no need to move a network address around.  Because of this, there is not a need to create a network load balancer to handle redirection.  The connection will go out to all addresses which the name resolves to, and only the primary will respond on the listener port.  

## Behavior differences

There are some behavioral differences which are important to take note of:

First, failover time is faster for DNN than it is for VNN listeners.  This is because there is no need to wait for the network load balancer to detect the failover event, and then change its routing.  However, DNN listeners only have to start listening on the DNN port. Reduced failover time can be a significant advantage.

Second, the behavior of existing connections to the listener is different when a failover occurs.  When there is a user-initiated failover, the network address on the original primary is not taken offline, so any existing connections to the listener on the original primary will not be broken and reconnected to the new primary.  This can be an unexpected difference in behavior.  The existing connection will remain connected to the original primary instance, even when it has transitioned to the secondary role.



There’s one wrinkle that I found in verifying the behaviors:
If you have a connection to the Primary via the listener, and there is a failover, your connection does not move.
If you have a connection to the primary, and you have an open transaction where at least one modification has been done and you fail over, your connection is dead, and can’t be revived.  You need to reconnect.  In SSMS, you need to close the query window and open a new one.


from  best practices
## Connectivity

In a traditional on-premises network environment, a SQL Server failover cluster instance appears to be a single instance of SQL Server running on a single computer. Because the failover cluster instance fails over from node to node, the virtual network name (VNN) for the instance provides a unified connection point and allows applications to connect to the SQL Server instance without knowing which node is currently active. When a failover occurs, the virtual network name is registered to the new active node after it starts. This process is transparent to the client or application that's connecting to SQL Server, and this minimizes the downtime that the client or application experiences during a failure. Likewise, the availability group listener uses a VNN to route traffic to the appropriate replica. 

Use a VNN with Azure Load Balancer or a distributed network name (DNN) to route traffic to the VNN of the failover cluster instance with SQL Server on Azure VMs or to replace the existing VNN listener in an availability group. 


The following table compares HADR connection supportability: 

| |**Virtual Network Name (VNN)**  |**Distributed Network Name (DNN)**  |
|---------|---------|---------|
|**Minimum OS version**| All | Windows Server 2016 |
|**Minimum SQL Server version** |All |SQL Server 2019 CU2 (for FCI)<br/> SQL Server 2019 CU8 (for AG )|
|**Supported HADR solution** | Failover cluster instance <br/> Availability group | Failover cluster instance <br/> Availability group|


### Virtual Network Name (VNN)

Because the virtual IP access point works differently in Azure, you need to configure [Azure Load Balancer](../../../load-balancer/index.yml) to route traffic to the IP address of the FCI nodes or the availability group listener. In Azure virtual machines, a load balancer holds the IP address for the VNN that the clustered SQL Server resources rely on. The load balancer distributes inbound flows that arrive at the front end, and then routes that traffic to the instances defined by the back-end pool. You configure traffic flow by using load-balancing rules and health probes. With SQL Server FCI, the back-end pool instances are the Azure virtual machines running SQL Server. 

There is a slight failover delay when you're using the load balancer, because the health probe conducts alive checks every 10 seconds by default. 

To get started, learn how to configure Azure Load Balancer for [failover cluster instance](failover-cluster-instance-vnn-azure-load-balancer-configure.md) or an [availability group](availability-group-vnn-azure-load-balancer-configure.md)

**Supported OS**: All   
**Supported SQL version**: All   
**Supported HADR solution**: Failover cluster instance, and availability group   


### Distributed Network Name (DNN)

Distributed network name is a new Azure feature for SQL Server 2019. The DNN provides an alternative way for SQL Server clients to connect to the SQL Server failover cluster instance or availability group without using a load balancer. 

When a DNN resource is created, the cluster binds the DNS name with the IP addresses of all the nodes in the cluster. The SQL client will try to connect to each IP address in this list to find which resource to connect to.  You can accelerate this process by specifying `MultiSubnetFailover=True` in the connection string. This setting tells the provider to try all IP addresses in parallel, so the client can connect to the FCI or listener instantly. 

A distributed network name is recommended over a load balancer when possible because: 
- The end-to-end solution is more robust since you no longer have to maintain the load balancer resource. 
- Eliminating the load balancer probes minimizes failover duration. 
- The DNN simplifies provisioning and management of the failover cluster instance or availability group listener with SQL Server on Azure VMs. 

Most SQL Server features work transparently with FCI and availability groups when using the DNN, but there are certain features that may require special consideration. See [FCI and DNN interoperability](failover-cluster-instance-dnn-interoperability.md) and [AG and DNN interoperability](availability-group-dnn-interoperability.md) to learn more. 

To get started, learn to configure a distributed network name resource for [a failover cluster instance](failover-cluster-instance-distributed-network-name-dnn-configure.md) or an [availability group](availability-group-distributed-network-name-dnn-listener-configure.md)

**Supported OS**: Windows Server 2016 and later   
**Supported SQL version**: SQL Server 2019 CU2 (FCI) and SQL Server 2019 CU8 (AG)   
**Supported HADR solution**: Failover cluster instance, and availability group   

## availability group

In a traditional on-premises deployment, clients connect to the availability group listener using the virtual network name (VNN), and the listener routes traffic to the appropriate SQL Server replica in the availability group. However, there is an extra requirement to route traffic on the Azure network. 

With SQL Server on Azure VMs, configure a [load balancer](availability-group-vnn-azure-load-balancer-configure.md) to route traffic to your availability group listener, or, if you're on SQL Server 2019 CU8 and later, you can configure a [distributed network name (DNN) listener](availability-group-distributed-network-name-dnn-listener-configure.md) to replace the traditional VNN availability group listener. 

For more details about cluster connectivity options, see [Route HADR connections to SQL Server on Azure VMs](hadr-cluster-best-practices.md#connectivity). 

### VNN listener 

Use an [Azure Load Balancer](../../../load-balancer/load-balancer-overview.md) to route traffic from the client to the traditional availability group virtual network name (VNN) listener on the Azure network. 

The load balancer holds the IP addresses for the VNN listener. If you have more than one availability group, each group requires a VNN listener. One load balancer can support multiple listeners.

To get started, see [configure a load balancer](availability-group-vnn-azure-load-balancer-configure.md). 

### DNN listener

SQL Server 2019 CU8 introduces support for the distributed network name (DNN) listener. The DNN listener replaces the traditional availability group listener, negating the need for an Azure Load Balancer to route traffic on the Azure network. 

The DNN listener is the recommended HADR connectivity solution in Azure as it simplifies deployment, reduces maintenance and cost, and reduces failover time in the event of a failure. 

Use the DNN listener to replace an existing VNN listener, or alternatively, use it in conjunction with an existing VNN listener so that your availability group has two distinct connection points - one using the VNN listener name (and port if non-default), and one using the DNN listener name and port. This could be useful for customers who want to avoid the load balancer failover latency but still take advantage of SQL Server features that depend on the VNN listener, such as distributed availability groups, service broker or filestream. To learn more, see [DNN listener and SQL Server feature interoperability](availability-group-dnn-interoperability.md)

To get started, see [configure a DNN listener](availability-group-distributed-network-name-dnn-listener-configure.md).

## fci 


Failover cluster instances with SQL Server on Azure Virtual Machines use a [distributed network name (DNN)](failover-cluster-instance-distributed-network-name-dnn-configure.md) or 
a [virtual network name (VNN) with Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) to route traffic to the SQL Server instance, regardless of which node currently owns the clustered resources. There are additional considerations when using certain features and the DNN with a SQL Server FCI. See [DNN interoperability with SQL Server FCI](failover-cluster-instance-dnn-interoperability.md) to learn more. 

For more details about cluster connectivity options, see [Route HADR connections to SQL Server on Azure VMs](hadr-cluster-best-practices.md#connectivity). 