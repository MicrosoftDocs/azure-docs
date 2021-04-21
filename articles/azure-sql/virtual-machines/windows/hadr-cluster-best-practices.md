---
title: Cluster configuration best practices
description: "Learn about the supported cluster configurations when you configure high availability and disaster recovery (HADR) for SQL Server on Azure Virtual Machines, such as supported quorums or connection routing options." 
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
ms.date: "04/25/2021"
ms.author: mathoma

---

# Cluster configuration best practices (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

A [Windows Server Failover Cluster](hadr-windows-server-failover-cluster-overview.md) is used for high availability and disaster recovery (HADR) with SQL Server on Azure Virtual Machines (VMs). 

This article provides cluster configuration best practices for both [failover cluster instances (FCIs)](failover-cluster-instance-overview.md) and [availability groups](availability-group-overview.md) when you use them with SQL Server on Azure VMs. 

## VM availability settings

To reduce the impact of downtime, consider the following VM best availability settings: 

* Use proximity placement groups together with accelerated networking for lowest latency
* Use availability zones to protect from datacenter level failures or configure multiple virtual machines in an availability set for redundancy
* Use premium-managed OS and data disks for VMs in an availability set
* Configure each application tier into separate availability sets

## Quorum

Although a two-node cluster will function without a [quorum resource](/windows-server/storage/storage-spaces/understand-quorum), customers are strictly required to use a quorum resource to have production support. Cluster validation won't pass any cluster without a quorum resource. 

Technically, a three-node cluster can survive a single node loss (down to two nodes) without a quorum resource. But after the cluster is down to two nodes, there's a risk that the clustered resources will go offline if a node loss or communication failure to prevent a split-brain scenario. Configuring a quorum resource will allow the cluster to continue online with only one node online.

The following table lists the quorum options available in the order recommended using with an Azure VM, with the disk witness being the preferred choice: 

||[Disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |[Cloud witness](/windows-server/failover-clustering/deploy-cloud-witness#CloudWitnessSetUp))  |[File share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |
|---------|---------|---------|---------|
|**Supported OS**| All |Windows Server 2016+| All|

- The **disk witness** is the preferred quorum option for any cluster that uses Azure Shared Disks (or any shared-disk solution like shared SCSI, iSCSI, or fiber channel SAN).  A Clustered Shared Volume cannot be used as a disk witness.
- The **cloud witness** is ideal for deployments in multiple sites, multiple zones, and multiple regions.
- The **fileshare witness** is suitable for when the disk witness and cloud witness are unavailable options. 

### Quorum Voting

It's possible to change the quorum vote of a node participating in a Windows Server Failover Cluster. 

When modifying the node vote settings, follow these guidelines: 

this is rewrite: 

| Guidelines |
|-|
| Start with each node having no vote by default. Each node should only have a vote with explicit justification|
| Enable votes for cluster nodes that host the primary replica of an availability group, or the preferred owners of a failover cluster instance. |
| Enable votes for automatic failover owners. Each node that may host a primary replica or FCI as a result of an automatic failover should have a vote. | 
| If an availability group has more than one secondary replica, only enable votes for the replicas that have automatic failover. | 
| Disable votes for nodes that are in secondary disaster recovery sites. Nodes in secondary sites should not contribute to the decision of taking a cluster offline if there's nothing wrong with the primary site. | 
| Have an odd number of votes, with three quorum votes minimum. Add a quorum witness for an additional vote if necessary in a two-node cluster. | 
| Reassess vote assignments post-failover. You don't want to fail over into a cluster configuration that doesn't support a healthy quorum. |


this is original: 

| Guidelines |
|-|
| No vote by default. Assume that each node shouldn't vote without explicit justification. |
| Include all primary replicas. Each WSFC node that hosts an availability group primary replica or is the preferred owner of an FCI should have a vote. |
| Include possible automatic failover owners. Each node that could host a primary replica, as the result of an automatic availability group failover or FCI failover, should have a vote. If there's only one availability group in the WSFC cluster and availability replicas are hosted only by standalone instances, this rule includes only the secondary replica that is the automatic failover target. |
| Exclude secondary site nodes. In general, don't give votes to WSFC nodes located at a secondary disaster recovery site. You don't want nodes in the secondary site to contribute to a decision to take the cluster offline when there's nothing wrong with the primary site. |
| Odd number of votes. If necessary, add a cloud witness, file share witness, a witness node, or a witness disk to the cluster and adjust the quorum mode to prevent possible ties in the quorum vote. It's recommended to have three or more quorum votes. |
| Reassess vote assignments post-failover. You don't want to fail over into a cluster configuration that doesn't support a healthy quorum. |

please ensure i have not technically changed the meaning in any way 



## Networking

Use a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy, which makes additional NICs and subnets unnecessary on an Azure virtual machine guest cluster. The cluster validation report will warn you that the nodes are reachable only on a single network. You can ignore this warning on Azure virtual machine guest failover clusters.

## Heartbeat and threshold 

The default heartbeat and threshold cluster settings are designed for highly tuned on-premises networks and do not consider the possibility of induced latency in a cloud environment. The heartbeat network is maintained with UDP 3343, which is traditionally far less reliable than TCP and more prone to incomplete conversations.
 
Therefore, when running cluster nodes for SQL Server on Azure VM high availability solutions, change the cluster settings to a more relaxed monitoring state to avoid transient failures due to the increased possibility of network latency or failure, Azure maintenance, or hitting resource bottlenecks. 

The delay and threshold settings have a cumulative effect to total health detection. For example, setting *CrossSubnetDelay* to send a heartbeat every 2 seconds and setting the *CrossSubnetThreshold* to 10 missed heartbeats before taking recovery means the cluster can have a total network tolerance of 20 seconds before recovery action is taken. In general, continuing to send frequent heartbeats but having greater thresholds is preferred. 

To ensure recovery during legitimate outages while providing greater tolerance for transient issues, relax your delay and threshold settings to the recommended values detailed in the following table: 


| Setting | Windows Server 2012 or later | Windows Server 2008R2 |
|:---------------------|:----------------------------|:-----------------------|
| SameSubnetDelay      | 1 second                    | 2 second               |
| SameSubnetThreshold  | 40 heartbeats               | 10 heartbeats (max)         |
| CrossSubnetDelay     | 1 second                    | 2 second               |  
| CrossSubnetThreshold | 40 heartbeats               | 20 heartbeats (max)         |


Use PowerShell to change your cluster parameters: 

# [Windows Server 2012-2019](#tab/windows2012)


```powershell
(get-cluster).SameSubnetThreshold = 40
(get-cluster).CrossSubnetThreshold = 40
```

# [Windows Server 2008/R2](#tab/windows2008)


```powershell
(get-cluster).SameSubnetThreshold = 10
(get-cluster).CrossSubnetThreshold = 20 
(get-cluster).SameSubnetDelay = 2000
(get-cluster).CrossSubnetDelay = 2000
```

---

Use PowerShell to verify your changes: 

```powershell
get-cluster | fl *subnet*
```


Consider the following: 

* This change is immediate, restarting the cluster or any resources is not required. 
* Same subnet values should not be greater than cross subnet values. 
* SameSubnetThreshold <= CrossSubnetThreshold
* SameSubnetDelay <= CrossSubnetDelay

Choose relaxed values based on how much down time is tolerable and how long before a corrective action should occur depending on your application,  business needs, and your environment. If you're not able to exceed the default Windows Server 2019 values, then at least try to match them, if possible: 

For reference, the following table details the default values: 


| Setting | Windows Server 2019 |  Windows Server 2016 |    Windows Server 2008 - 2012 R2 |
|:---------------------|:----------------|   ------------|:----------------------------|
| SameSubnetDelay      | 1 second        | 1 second       | 1 second                    |
| SameSubnetThreshold  | 20 heartbeats   | 10 heartbeats  | 5 heartbeats               |
| CrossSubnetDelay     | 1 second        | 1 second     | 1 second                    |
| CrossSubnetThreshold | 20 heartbeats   | 10 heartbeats   | 5 heartbeats               |


To learn more, see [Tuning Failover Cluster Network Thresholds](/windows-server/troubleshoot/iaas-sql-failover-cluster).

## Relaxed monitoring

If tuning your heartbeat and threshold settings is insufficient tolerance and you're still seeing failures due to transient issues rather than true outages, you can configure your monitoring to be more relaxed. 

In some scenarios, it may be beneficial to temporarily relax the monitoring for a period of time given the level of activity. For example, you may want to relax the monitoring when you're doing IO intensive workloads such as database backups, index maintenance, DBCC checkdb, etc. Once the activity is complete, set your monitoring to less relaxed values. 

>[!WARNING]
> Changing these settings may mask an underlying problem, and should be used as a temporary solution to reduce, rather than eliminate, the likelihood of failure. Underlying issues should still be investigated and addressed. 

Increase the following parameters from their default values for relaxed monitoring: 


|Parameter |Default value  |Description  |
|---------|---------|---------|
|**Healthcheck timeout**|30000 |Determines health of the primary replica or node. The cluster resource DLL sp_server_diagnostics returns results at an interval that equals 1/3 of the health-check timeout threshold. If sp_server_diagnostics is slow or is not returning information, the resource DLL will wait for the full interval of the health-check timeout threshold before determining that the resource is unresponsive, and initiating an automatic failover, if configured to do so. |
|**Failure-Condition Level** |  3  | Conditions that trigger an automatic failover. There are five failure-condition levels, which range from the least restrictive (level one) to the most restrictive (level five)  |

Use Transact-SQL (T-SQL) to modify the health check and failure conditions for both AGs and FCIs. 

For availability groups: 

```sql
ALTER AVAILABILITY GROUP AG1 SET (HEALTH_CHECK_TIMEOUT =60000);
ALTER AVAILABILITY GROUP AG1 SET (FAILURE_CONDITION_LEVEL = 2);
```

For failover cluster instances: 

```sql
ALTER SERVER CONFIGURATION SET FAILOVER CLUSTER PROPERTY HealthCheckTimeout = 60000;
ALTER SERVER CONFIGURATION SET FAILOVER CLUSTER PROPERTY FailureConditionLevel = 2; 
```

Specific to availability groups, review the following parameters: 

|Parameter |Default value  |Description  |
|---------|---------|---------|
|**Lease timeout**|20000|Prevents split-brain. |
|**Session timeout**|10 |Checks communication issues between replicas. The session-timeout period is a replica property that controls how long (in seconds) that an availability replica waits for a ping response from a connected replica before considering the connection to have failed. By default, a replica waits 10 seconds for a ping response. This replica property applies only the connection between a given secondary replica and the primary replica of the availability group. |

Before making any changes, consider the following: 
- Do not lower any timeout values below their default values. 
- The lease interval (½ * LeaseTimeout) must be shorter than SameSubnetThreshold * SameSubnetDelay
- For synchronous-commit replicas, changing session-timeout to a high value can increase HADR_Sync_commit waits.

Use Transact-SQL (T-SQL) to modify the session timeout for an availability group: 

```sql
ALTER AVAILABILITY GROUP AG1
MODIFY REPLICA ON 'INSTANCE01' WITH (SESSION_TIMEOUT = 15);
```

Use the Failover Cluster Manager to modify the lease timeout settings for your availability group.  See the SQL Server [availability group lease health check](/sql/database-engine/availability-groups/windows/availability-group-lease-healthcheck-timeout#lease-timeout) documentation for detailed steps.

## Resource limits

VM or disk limits could result in a resource bottleneck that impacts the health of the cluster, and impedes the health check. If you're experiencing issues with resource limits, consider the following: 

* Ensure your OS, drivers, and SQL Server are at the latest builds.
* Optimize SQL Server on Azure VM environment as described in the [performance guidelines](performance-guidelines-best-practices-checklist.md) for SQL Server on Azure Virtual Machines
* Reduce or spread out the workload to reduce utilization without exceeding resource limits
* Tune the SQL Server workload if there is any opportunity, such as
    * Add/optimize indexes
    * Update statistics if needed and if possible, with Full scan  
    * Use features like resource governor (starting with SQL Server 2014, enterprise only) to limit resource utilization during specific workloads, such as backups or index maintenance. 
* Move to a VM or disk that has higher limits to meet or exceed the demands of your workload. 


## Connectivity

It's possible to configure either a virtual network name (VNN), or starting with SQL Server 2019, a distributed network name (DNN) for both failover cluster instances and availability group listeners. 

The distributed network name is the recommended connectivity option, when available: 
- The end-to-end solution is more robust since you no longer have to maintain the load balancer resource. 
- Eliminating the load balancer probes minimizes failover duration. 
- The DNN simplifies provisioning and management of the failover cluster instance or availability group listener with SQL Server on Azure VMs. 

To learn more, see the [Windows Server Failover Cluster overview](hadr-windows-server-failover-cluster-overview.md#virtual-network-name-vnn). 

To configure connectivity, see the following articles:
- Availability group:  [Configure DNN  for AG](availability-group-distributed-network-name-dnn-listener-configure.md), [Configure VNN for AG](availability-group-vnn-azure-load-balancer-configure.md)
- Failover cluster instance: [Configure DNN for FCI](failover-cluster-instance-distributed-network-name-dnn-configure.md), [Configure VNN for FCI](failover-cluster-instance-vnn-azure-load-balancer-configure.md). 

Most SQL Server features work transparently with FCI and availability groups when using the DNN, but there are certain features that may require special consideration. See [FCI and DNN interoperability](failover-cluster-instance-dnn-interoperability.md) and [AG and DNN interoperability](availability-group-dnn-interoperability.md) to learn more. 

## Known issues

If the Windows cluster settings are too aggressive for your environment, you may see following message in the system event log frequently. For more information, review [Troubleshooting cluster issue with Event ID 1135.](https://docs.microsoft.com/windows-server/troubleshoot/troubleshooting-cluster-event-id-1135)

| Event ID        | Description                                                            |
|----|----|
|       1135      |  Cluster node 'Node1' was removed from the active failover cluster membership. The Cluster service on this node may have stopped. This could also be due to the node having lost communication with other active nodes in the failover cluster. Run the Validate a Configuration wizard to check your network configuration. If the condition persists, check for hardware or software errors related to the network adapters on this node. Also check for failures in any other network components to which the node is connected such as hubs, switches, or bridges.|

If the monitoring is too aggressive for your environment, you may see frequent AG or FCI restarts, failures, or failovers. Additionally for availability groups, you may see the following messages in the SQL Server error log: 

| Message ID | Description                                                                   |
|--|--|
| 19407| The lease between availability group 'PRODAG' and the Windows Server Failover Cluster has expired. A connectivity issue occurred between the instance of SQL Server and the Windows Server Failover Cluster. To determine whether the availability group is failing over correctly, check the corresponding availability group resource in the Windows Server Failover Cluster |
| 19419| The renewal of the lease between availability group '%.*ls' and the Windows Server Failover Cluster failed because the existing lease is no longer valid.   |

If the session timeout is too aggressive for your availability group environment, you may see following messages frequently:

| Message ID | Description |
|-|-|
| 35201 | A connection timeout has occurred while attempting to establish a connection to availability replica 'replicaname' with ID [availability_group_id]. Either a networking or firewall issue exists, or the endpoint address provided for the replica is not the database mirroring endpoint of the host server instance. |
| 35206 | A connection timeout has occurred on a previously established connection to availability replica 'replicaname' with ID [availability_group_id]. Either a networking or a firewall issue exists, or the availability replica has transitioned to the resolving role. 


## Next steps

After you've determined the appropriate best practices for your solution, get started by [preparing your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md) or by creating your availability group by using the [Azure portal](availability-group-azure-portal-configure.md), the [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), or [Azure quickstart templates](availability-group-quickstart-template-configure.md).
