---
title: Windows Server Failover Cluster overview
description: "Learn about the differences with the Windows Server Failover Cluster technology when used with SQL Server on Azure VMs, such as availability groups, and failover cluster instances. " 
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
ms.date: "06/01/2021"
ms.author: mathoma

---

# Windows Server Failover Cluster with SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes the differences when using the Windows Server Failover Cluster feature with SQL Server on Azure VMs for high availability and disaster recovery (HADR), such as for Always On availability groups (AG) or failover cluster instances (FCI). 

To learn more about the Windows feature itself, see the [Windows Server Failover Cluster documentation](/windows-server/failover-clustering/failover-clustering-overview).

## Overview

SQL Server high availability solutions on Windows, such as Always On availability groups (AG) or failover cluster instances (FCI) rely on the underlying Windows Server Failover Clustering (WSFC) service.

The cluster service monitors network connections and the health of nodes in the cluster. This monitoring is in addition to the health checks that SQL Server does as part of the availability group or failover cluster instance feature. If the cluster service is unable to reach the node, or if the AG or FCI role in the cluster becomes unhealthy, then the cluster service initiates appropriate recovery actions to recover and bring applications and services online, either on the same or on another node in the cluster.

## Cluster health monitoring

In order to provide high availability, the cluster must ensure the health of the different components that make up the clustered solution. The cluster service monitors the health of the cluster based on a number of system and network parameters in order to detect and respond to failures. 

Setting the threshold for declaring a failure is important in order to achieve a balance between promptly responding to a failure, and avoiding false failures.

There are two strategies for monitoring:

| Monitoring  | Description |
|-|-|
| Aggressive | Provides rapid failure detection and recovery of hard failures, which delivers the highest levels of availability. The cluster service and SQL Server are both less forgiving of transient failure and in some situations may prematurely fail over resources when there are transient outages. Once failure is detected, the corrective action that follows may take extra time. |
| Relaxed | Provides more forgiving failure detection with a greater tolerance for brief transient network issues. Avoids transient failures, but also introduces the risk of delaying the detection of a true failure. |

Aggressive settings in a cluster environment in the cloud may lead to premature failures and longer outages, therefore a relaxed monitoring strategy is recommended for failover clusters on Azure VMs. To adjust threshold settings, see [cluster best practices](hadr-cluster-best-practices.md#relaxed-monitoring) for more detail. 

## Cluster heartbeat

The primary settings that affect cluster heart beating and health detection between nodes:

| Setting | Description |
|-|-|
| Delay | This defines the frequency at which cluster heartbeats are sent between nodes. The delay is the number of seconds before the next heartbeat is sent. Within the same cluster there can be different delay settings configured between nodes on the same subnet, and between nodes that are on different subnets. |
| Threshold | The threshold is the number of heartbeats that can be missed before the cluster takes recovery action. Within the same cluster there can be different threshold settings configured between nodes on the same subnet, and between nodes that are on different subnets. |

The default values for these settings may be too low for cloud environments, and could result in unnecessary failures due to transient network issues. To be more tolerant, use relaxed threshold settings for failover clusters in Azure VMs. See [cluster best practices](hadr-cluster-best-practices.md#heartbeat-and-threshold) for more detail. 

## Quorum

Although a two-node cluster will function without a [quorum resource](/windows-server/storage/storage-spaces/understand-quorum), customers are strictly required to use a quorum resource to have production support. Cluster validation won't pass any cluster without a quorum resource. 

Technically, a three-node cluster can survive a single node loss (down to two nodes) without a quorum resource. But after the cluster is down to two nodes, there's a risk that the clustered resources will go offline to prevent a split-brain scenario if a node is lost or there's a communication failure between the nodes. Configuring a quorum resource will allow the cluster resources to remain online with only one node online.

The disk witness is the most resilient quorum option, but to use a disk witness on a SQL Server on Azure VM, you must use an Azure Shared Disk which imposes some limitations to the high availability solution. As such, use a disk witness when you're configuring your failover cluster instance with Azure Shared Disks, otherwise use a cloud witness whenever possible. 

The following table lists the quorum options available for SQL Server on Azure VMs: 

|  |[Cloud witness](/windows-server/failover-clustering/deploy-cloud-witness) |[Disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum) |[File share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |
|---------|---------|---------|---------|
|**Supported OS**| Windows Server 2016+ |All | All|
| **Description** | A cloud witness is a type of failover cluster quorum witness that uses Microsoft Azure to provide a vote on cluster quorum. The default size is about 1 MB and contains just the time stamp. A cloud witness is ideal for deployments in multiple sites, multiple zones, and multiple regions. Use a cloud witness whenever possible, unless you have a failover cluster solution with shared storage. | A disk witness is a small clustered disk in the Cluster Available Storage group. This disk is highly available and can fail over between nodes. It contains a copy of the cluster database, with a default size that's less than 1 GB. The disk witness is the preferred quorum option for any cluster that uses Azure Shared Disks (or any shared-disk solution like shared SCSI, iSCSI, or fiber channel SAN).  A Clustered Shared Volume cannot be used as a disk witness. Configure an Azure shared disk as the disk witness.  | A file share witness is an SMB file share that's typically configured on a file server running Windows Server. It maintains clustering information in a witness.log file, but doesn't store a copy of the cluster database. In Azure, you can configure a file share on a separate virtual machine within the same virtual network. Use a file share witness if a disk witness or cloud witness is unavailable in your environment. | 

To get started, see [Configure cluster quorum](hadr-cluster-quorum-configure-how-to.md). 


## Virtual network name (VNN)

In a traditional on-premises environment, clustered resources such as failover cluster instances or Always On availability groups rely on the Virtual Network Name to route traffic to the appropriate target - either the failover cluster instance, or the listener of the Always On availability group. The virtual name binds the IP address in DNS, and clients can use either the virtual name or the IP address to connect to their high availability target, regardless of which node currently owns the resource. The VNN is a network name and address managed by the cluster, and the cluster service moves the network address from node to node during a failover event. During a failure, the address is taken offline on the original primary replica, and brought online on the new primary replica.

On Azure Virtual Machines, an additional component is necessary to route traffic from the client to the Virtual Network Name of the clustered resource (failover cluster instance, or the listener of an availability group). In Azure, a load balancer holds the IP address for the VNN that the clustered SQL Server resources rely on and is necessary to route traffic to the appropriate high availability target. The load balancer also detects failures with the networking components and moves the address to a new host. 

The load balancer distributes inbound flows that arrive at the front end, and then routes that traffic to the instances defined by the back-end pool. You configure traffic flow by using load-balancing rules and health probes. With SQL Server FCI, the back-end pool instances are the Azure virtual machines running SQL Server, and with availability groups, the back-end pool is the listener. There is a slight failover delay when you're using the load balancer, because the health probe conducts alive checks every 10 seconds by default. 

To get started, learn how to configure Azure Load Balancer for a [failover cluster instance](failover-cluster-instance-vnn-azure-load-balancer-configure.md) or an [availability group](availability-group-vnn-azure-load-balancer-configure.md). 

**Supported OS**: All   
**Supported SQL version**: All   
**Supported HADR solution**: Failover cluster instance, and availability group   

Configuration of the VNN can be cumbersome, it's an additional source of failure, it can cause a delay in failure detection, and there is an overhead and cost associated with managing the additional resource. To address some of these limitations, SQL Server 2019 introduced support for the Distributed Network Name feature. 

## Distributed network name (DNN)

Starting with SQL Server 2019, the Distributed Network Name feature provides an alternative way for SQL Server clients to connect to the SQL Server failover cluster instance or availability group listener without using a load balancer. 

When a DNN resource is created, the cluster binds the DNS name with the IP addresses of all the nodes in the cluster. The client will try to connect to each IP address in this list to find which resource to connect to. You can accelerate this process by specifying `MultiSubnetFailover=True` in the connection string. This setting tells the provider to try all IP addresses in parallel, so the client can connect to the FCI or listener instantly. 

A distributed network name is recommended over a load balancer when possible because: 
- The end-to-end solution is more robust since you no longer have to maintain the load balancer resource. 
- Eliminating the load balancer probes minimizes failover duration. 
- The DNN simplifies provisioning and management of the failover cluster instance or availability group listener with SQL Server on Azure VMs. 

Most SQL Server features work transparently with FCI and availability groups when using the DNN, but there are certain features that may require special consideration. 

**Supported OS**: Windows Server 2016 and later   
**Supported SQL version**: SQL Server 2019 CU2 (FCI) and SQL Server 2019 CU8 (AG)   
**Supported HADR solution**: Failover cluster instance, and availability group   

To get started, learn to configure a distributed network name resource for [a failover cluster instance](failover-cluster-instance-distributed-network-name-dnn-configure.md) or an [availability group](availability-group-distributed-network-name-dnn-listener-configure.md).

There are additional considerations when using the DNN with other SQL Server features. See [FCI and DNN interoperability](failover-cluster-instance-dnn-interoperability.md) and [AG and DNN interoperability](availability-group-dnn-interoperability.md) to learn more. 

## Recovery actions

The cluster service takes corrective action when a failure is detected. This could restart the resource on the existing node, or fail the resource over to another node. Once corrective measures are initiated, they make take some time to complete. 

For example, a restarted availability group comes online per the following sequence: 

1. Listener IP comes online
1. Listener network name comes online
1. Availability group comes online
1. Individual databases go through recovery, which can take some time depending on a number of factors, such as the length of the redo log. Connections are routed by the listener only once the database is fully recovered. To learn more, see [Estimating failover time (RTO)](/sql/database-engine/availability-groups/windows/monitor-performance-for-always-on-availability-groups). 

Since recovery could take some time, aggressive monitoring set to detect a failure in 20 seconds could result in an outage of minutes if a transient event occurs (such as memory-preserving [Azure VM maintenance](#azure-platform-maintenance)). Setting the monitoring to a more relaxed value of 40 seconds can help avoid a longer interruption of service. 

To adjust threshold settings, see [cluster best practices](hadr-cluster-best-practices.md) for more detail. 


## Node location

Nodes in a Windows cluster on virtual machines in Azure may be physically separated within the same Azure region, or they can be in different regions. The distance may introduce network latency, much like having cluster nodes spread between locations in your own facilities would. In cloud environments, the difference is that within a region you may not be aware of the distance between nodes.  Moreover, some other factors like physical and virtual components, number of hops, etc. can also contribute to increased latency. If latency between the nodes is a concern, consider placing the nodes of the cluster within a [proximity placement group](../../../virtual-machines/co-location.md) to guarantee network proximity.

## Resource limits

When you configure an Azure VM, you determine the computing resources limits for the CPU, memory, and IO. Workloads that require more resources than the purchased Azure VM, or disk limits may cause VM performance issues. Performance degradation may result in a failed health check for either the cluster service, or for the SQL Server high availability feature. Resource bottlenecks may make the node or resource appear down to the cluster or SQL Server. 

Intensive SQL IO operations or maintenance operations such as backups, index, or statistics maintenance could cause the VM or disk to reach *IOPS* or *MBPS* throughput limits, which could make SQL Server unresponsive to an *IsAlive/LooksAlive* check. 

If your SQL Server is experiencing unexpected failovers, check to make sure you are following all [performance best practices](performance-guidelines-best-practices-checklist.md) and monitor the server for disk or VM-level capping. 

## Azure platform maintenance

Like any other cloud service, Azure periodically updates its platform to improve the reliability, performance, and security of the host infrastructure for virtual machines. The purpose of these updates ranges from patching software components in the hosting environment to upgrading networking components or decommissioning hardware.

Most platform updates don't affect customer VMs. When a no-impact update isn't possible, Azure chooses the update mechanism that's least impactful to customer VMs. Most nonzero-impact maintenance pauses the VM for less than 10 seconds. In certain cases, Azure uses memory-preserving maintenance mechanisms. These mechanisms pause the VM for up to 30 seconds and preserve the memory in RAM. The VM is then resumed, and its clock is automatically synchronized.

Memory-preserving maintenance works for more than 90 percent of Azure VMs. It doesn't work for G, M, N, and H series. Azure increasingly uses live-migration technologies and improves memory-preserving maintenance mechanisms to reduce the pause durations. When the VM is live-migrated to a different host, some sensitive workloads like SQL Server, might show a slight performance degradation in the few minutes leading up to the VM pause.

A resource bottleneck during platform maintenance may make the AG or FCI appear down to the cluster service. See the [resource limits](#resource-limits) section of this article to learn more. 

If you are using aggressive cluster monitoring, an extended VM pause may trigger a failover. A failover will often cause more downtime than the maintenance pause, so it is recommended to use relaxed monitoring to avoid triggering a failover while the VM is paused for maintenance. See the [cluster best practices](hadr-cluster-best-practices.md) for more information on setting cluster thresholds in Azure VMs.

## Limitations

Consider the following limitations when you're working with FCI or availability groups and SQL Server on Azure Virtual Machines. 

### MSDTC 

Azure Virtual Machines support Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on Clustered Shared Volumes (CSV) and [Azure Standard Load Balancer](../../../load-balancer/load-balancer-overview.md) or on SQL Server VMs that are using Azure shared disks. 

On Azure Virtual Machines, MSDTC isn't supported for Windows Server 2016 or earlier with Clustered Shared Volumes because:

- The clustered MSDTC resource can't be configured to use shared storage. On Windows Server 2016, if you create an MSDTC resource, it won't show any shared storage available for use, even if storage is available. This issue has been fixed in Windows Server 2019.
- The basic load balancer doesn't handle RPC ports.



## Next steps

Now that you've familiarized yourself with the differences when using a Windows Failover Cluster with SQL Server on Azure VMs, learn about the high availability features [availability groups](availability-group-overview.md) or [failover cluster instances](failover-cluster-instance-overview.md). If you're ready to get started, be sure to review the [best practices](hadr-cluster-best-practices.md) for configuration recommendations. 
