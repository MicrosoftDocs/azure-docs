---
title: Troubleshoot with system health reports | Microsoft Docs
description: Describes the health reports sent by Azure Service Fabric components and their usage for troubleshooting cluster or application problems
services: service-fabric
documentationcenter: .net
author: oanapl
manager: chackdan
editor: ''

ms.assetid: 52574ea7-eb37-47e0-a20a-101539177625
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2018
ms.author: oanapl

---
# Use system health reports to troubleshoot
Azure Service Fabric components provide system health reports on all entities in the cluster right out of the box. The [health store](service-fabric-health-introduction.md#health-store) creates and deletes entities based on the system reports. It also organizes them in a hierarchy that captures entity interactions.

> [!NOTE]
> To understand health-related concepts, read more at [Service Fabric health model](service-fabric-health-introduction.md).
> 
> 

System health reports provide visibility into cluster and application functionality, and flag problems. For applications and services, system health reports verify that entities are implemented and are behaving correctly from the Service Fabric perspective. The reports don't provide any health monitoring of the business logic of the service or detection of processes that are not responding. User services can enrich the health data with information specific to their logic.

> [!NOTE]
> Health reports sent by user watchdogs are visible only *after* the system components create an entity. When an entity is deleted, the health store automatically deletes all the health reports associated with it. The same is true when a new instance of the entity is created. An example is when a new stateful persisted service replica instance is created. All reports associated with the old instance are deleted and cleaned up from the store.
> 
> 

The system component reports are identified by the source, which starts with the "**System.**" prefix. Watchdogs can't use the same prefix for their sources, as reports with invalid parameters are rejected.

Let's look at some system reports to understand what triggers them and to learn how to correct the potential problems they represent.

> [!NOTE]
> Service Fabric continues to add reports on conditions of interest that improve visibility into what is happening in the cluster and the applications. Existing reports can be enhanced with more details to help troubleshoot the problem faster.
> 
> 

## Cluster system health reports
The cluster health entity is created automatically in the health store. If everything works properly, it doesn't have a system report.

### Neighborhood loss
**System.Federation** reports an error when it detects a neighborhood loss. The report is from individual nodes, and the node ID is included in the property name. If one neighborhood is lost in the entire Service Fabric ring, you can typically expect two events that represent both sides of the gap report. If more neighborhoods are lost, there are more events.

The report specifies the global-lease timeout as the time-to-live (TTL). The report is resent every half of the TTL duration for as long as the condition remains active. The event is automatically removed when it expires. Remove-when-expired behavior ensures that the report is cleaned up from the health store correctly, even if the reporting node is down.

* **SourceId**: System.Federation
* **Property**: Starts with **Neighborhood** and includes node information.
* **Next steps**: Investigate why the neighborhood is lost. For example, check the communication between cluster nodes.

### Rebuild

The Failover Manager (FM) service manages information about the cluster nodes. When FM loses its data and goes into data loss, it can't guarantee that it has the most updated information about the cluster nodes. In this case, the system goes through a rebuild, and System.FM gathers data from all nodes in the cluster in order to rebuild its state. Sometimes, due to networking or node issues, rebuild can get stuck or stalled. The same can happen with the Failover Manager Master (FMM) service. The FMM is a stateless system service that keeps track of where all the FMs are in the cluster. The FMM's primary is always the node with the ID closest to 0. If that node gets dropped, a rebuild is triggered.
When one of the previous conditions happens, **System.FM** or **System.FMM** flags it through an error report. Rebuild might be stuck in one of two phases:

* **Waiting for broadcast**: FM/FMM waits for the broadcast message reply from the other nodes.

  * **Next steps**: Investigate whether there is a network connection issue between nodes.
* **Waiting for nodes**: FM/FMM already received a broadcast reply from the other nodes and is waiting for a reply from specific nodes. The health report lists the nodes for which the FM/FMM is waiting for a response.
   * **Next steps**: Investigate the network connection between the FM/FMM and the listed nodes. Investigate each listed node for other possible issues.

* **SourceID**: System.FM or System.FMM
* **Property**: Rebuild.
* **Next steps**: Investigate the network connection between the nodes, as well as the state of any specific nodes that are listed on the description of the health report.

### Seed Node Status
**System.FM** reports a cluster level warning if some seed nodes are unhealthy. Seed nodes are the nodes which maintain the availability of the underlying cluster. These nodes help to ensure the cluster remains up by establishing leases with other nodes and serving as tiebreakers during certain kinds of network failures. If a majority of the seed nodes are down in the cluster and they are not brought back, the cluster automatically shuts down. 

A seed node is unhealthy if its node status is Down, Removed or Unknown.
The warning report for seed node status will list all the unhealthy seed nodes with detailed information.

* **SourceID**: System.FM
* **Property**: SeedNodeStatus
* **Next steps**: If this warning shows in the cluster, follow below instructions to fix it:
For cluster running Service Fabric version 6.5 or higher:
For Service Fabric cluster on Azure, after the seed node goes down, Service Fabric will try to change it to a non-seed node automatically. To make this happen, make sure the number of non-seed nodes in the primary node type is greater or equal to the number of Down seed nodes. If necessary, add more nodes to the primary node type to achieve this.
Depending on the cluster status, it may take some time to fix the issue. Once this is done, the warning report is automatically cleared.

For Service Fabric standalone cluster, to clear the warning report, all the seed nodes need to become healthy. Depending on why seed nodes are unhealthy, different actions need to be taken: if the seed node is Down, users need to bring that seed node up; if the seed node is Removed or Unknown, this seed node [needs to be removed from the cluster](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-windows-server-add-remove-nodes).
The warning report is automatically cleared when all seed nodes become healthy.

For cluster running Service Fabric version older than 6.5:
In this case, the warning report needs to be cleared manually. **Users should make sure all the seed nodes become healthy before clearing the report**: if the seed node is Down, users need to bring that seed node up;if the seed node is Removed or Unknown, that seed node needs to be removed from the cluster.
After all the seed nodes become healthy, use following command from Powershell to [clear the warning report](https://docs.microsoft.com/powershell/module/servicefabric/send-servicefabricclusterhealthreport):

```powershell
PS C:\> Send-ServiceFabricClusterHealthReport -SourceId "System.FM" -HealthProperty "SeedNodeStatus" -HealthState OK

## Node system health reports
System.FM, which represents the Failover Manager service, is the authority that manages information about cluster nodes. Each node should have one report from System.FM showing its state. The node entities are removed when the node state is removed. For more information, see [RemoveNodeStateAsync](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.clustermanagementclient.removenodestateasync).

### Node up/down
System.FM reports as OK when the node joins the ring (it's up and running). It reports an error when the node departs the ring (it's down, either for upgrading or simply because it has failed). The health hierarchy built by the health store acts on deployed entities in correlation with System.FM node reports. It considers the node a virtual parent of all deployed entities. The deployed entities on that node are exposed through queries if the node is reported as up by System.FM, with the same instance as the instance associated with the entities. When System.FM reports that the node is down or restarted, as a new instance, the health store automatically cleans up the deployed entities that can exist only on the down node or on the previous instance of the node.

* **SourceId**: System.FM
* **Property**: State.
* **Next steps**: If the node is down for an upgrade, it should come back up after it's been upgraded. In this case, the health state should switch back to OK. If the node doesn't come back or it fails, the problem needs more investigation.

The following example shows the System.FM event with a health state of OK for node up:

```powershell
PS C:\> Get-ServiceFabricNodeHealth  _Node_0

NodeName              : _Node_0
AggregatedHealthState : Ok
HealthEvents          : 
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 8
                        SentAt                : 7/14/2017 4:54:51 PM
                        ReceivedAt            : 7/14/2017 4:55:14 PM
                        TTL                   : Infinite
                        Description           : Fabric node is up.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Ok = 7/14/2017 4:55:14 PM, LastWarning = 1/1/0001 12:00:00 AM
```


### Certificate expiration
**System.FabricNode** reports a warning when certificates used by the node are near expiration. There are three certificates per node: **Certificate_cluster**, **Certificate_server**, and **Certificate_default_client**. When the expiration is at least two weeks away, the report health state is OK. When the expiration is within two weeks, the report type is a warning. TTL of these events is infinite, and they are removed when a node leaves the cluster.

* **SourceId**: System.FabricNode
* **Property**: Starts with **Certificate** and contains more information about the certificate type.
* **Next steps**: Update the certificates if they are near expiration.

### Load capacity violation
The Service Fabric Load Balancer reports a warning when it detects a node capacity violation.

* **SourceId**: System.PLB
* **Property**: Starts with **Capacity**.
* **Next steps**: Check the provided metrics and view the current capacity on the node.

### Node capacity mismatch for resource governance metrics
System.Hosting reports a warning if defined node capacities in the cluster manifest are larger than the real node capacities for resource governance metrics (memory and CPU cores). A health report appears when the first service package that uses [resource governance](service-fabric-resource-governance.md) registers on a specified node.

* **SourceId**: System.Hosting
* **Property**: **ResourceGovernance**.
* **Next steps**: This issue can be a problem because governing service packages aren't enforced as expected and [resource governance](service-fabric-resource-governance.md) doesn't work properly. Update the cluster manifest with the correct node capacities for these metrics, or don't specify them and let Service Fabric automatically detect available resources.

## Application system health reports
System.CM, which represents the Cluster Manager service, is the authority that manages information about an application.

### State
System.CM reports as OK when the application has been created or updated. It informs the health store when the application is deleted so that it can be removed from the store.

* **SourceId**: System.CM
* **Property**: State.
* **Next steps**: If the application has been created or updated, it should include the Cluster Manager health report. Otherwise, check the state of the application by issuing a query. For example, use the PowerShell cmdlet **Get-ServiceFabricApplication -ApplicationName** *applicationName*.

The following example shows the state event on the **fabric:/WordCount** application:

```powershell
PS C:\> Get-ServiceFabricApplicationHealth fabric:/WordCount -ServicesFilter None -DeployedApplicationsFilter None -ExcludeHealthStatistics

ApplicationName                 : fabric:/WordCount
AggregatedHealthState           : Ok
ServiceHealthStates             : None
DeployedApplicationHealthStates : None
HealthEvents                    : 
                                  SourceId              : System.CM
                                  Property              : State
                                  HealthState           : Ok
                                  SequenceNumber        : 282
                                  SentAt                : 7/13/2017 5:57:05 PM
                                  ReceivedAt            : 7/14/2017 4:55:10 PM
                                  TTL                   : Infinite
                                  Description           : Application has been created.
                                  RemoveWhenExpired     : False
                                  IsExpired             : False
                                  Transitions           : Error->Ok = 7/13/2017 5:57:05 PM, LastWarning = 1/1/0001 12:00:00 AM
```

## Service system health reports
System.FM, which represents the Failover Manager service, is the authority that manages information about services.

### State
System.FM reports as OK when the service has been created. It deletes the entity from the health store when the service is deleted.

* **SourceId**: System.FM
* **Property**: State.

The following example shows the state event on the service **fabric:/WordCount/WordCountWebService**:

```powershell
PS C:\> Get-ServiceFabricServiceHealth fabric:/WordCount/WordCountWebService -ExcludeHealthStatistics


ServiceName           : fabric:/WordCount/WordCountWebService
AggregatedHealthState : Ok
PartitionHealthStates : 
                        PartitionId           : 8bbcd03a-3a53-47ec-a5f1-9b77f73c53b2
                        AggregatedHealthState : Ok
                        
HealthEvents          : 
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 14
                        SentAt                : 7/13/2017 5:57:05 PM
                        ReceivedAt            : 7/14/2017 4:55:10 PM
                        TTL                   : Infinite
                        Description           : Service has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Ok = 7/13/2017 5:57:18 PM, LastWarning = 1/1/0001 12:00:00 AM
```

### Service correlation error
**System.PLB** reports an error when it detects that updating a service is correlated with another service that creates an affinity chain. The report is cleared when a successful update happens.

* **SourceId**: System.PLB
* **Property**: **ServiceDescription**.
* **Next steps**: Check the correlated service descriptions.

## Partition system health reports
System.FM, which represents the Failover Manager service, is the authority that manages information about service partitions.

### State
System.FM reports as OK when the partition has been created and is healthy. It deletes the entity from the health store when the partition is deleted.

If the partition is below the minimum replica count, it reports an error. If the partition is not below the minimum replica count, but it's below the target replica count, it reports a warning. If the partition is in quorum loss, System.FM reports an error.

Other notable events include a warning when the reconfiguration takes longer than expected and when the build takes longer than expected. The expected times for the build and reconfiguration are configurable based on the service scenarios. For example, if a service has a terabyte of state, such as Azure SQL Database, the build takes longer than for a service with a small amount of state.

* **SourceId**: System.FM
* **Property**: State.
* **Next steps**: If the health state is not OK, it's possible that some replicas have not been created, opened, or promoted to primary or secondary correctly. 

If the description describes quorum loss, then examining the detailed health report for replicas that are down and bringing them back up helps to bring the partition back online.

If the description describes a partition stuck in [reconfiguration](service-fabric-concepts-reconfiguration.md), then the health report on the primary replica provides additional information.

For other System.FM health reports, there would be reports on the replicas or the partition or service from other system components. 

The following examples describe some of these reports. 

The following example shows a healthy partition:

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountWebService | Get-ServiceFabricPartitionHealth -ExcludeHealthStatistics -ReplicasFilter None

PartitionId           : 8bbcd03a-3a53-47ec-a5f1-9b77f73c53b2
AggregatedHealthState : Ok
ReplicaHealthStates   : None
HealthEvents          : 
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 70
                        SentAt                : 7/13/2017 5:57:05 PM
                        ReceivedAt            : 7/14/2017 4:55:10 PM
                        TTL                   : Infinite
                        Description           : Partition is healthy.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Ok = 7/13/2017 5:57:18 PM, LastWarning = 1/1/0001 12:00:00 AM
```

The following example shows the health of a partition that's below target replica count. The next step is to get the partition description, which shows how it's configured: **MinReplicaSetSize** is three and **TargetReplicaSetSize** is seven. Then get the number of nodes in the cluster, which in this case is five. So, in this case, two replicas can't be placed, because the target number of replicas is higher than the number of nodes available.

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountService | Get-ServiceFabricPartitionHealth -ReplicasFilter None -ExcludeHealthStatistics


PartitionId           : af2e3e44-a8f8-45ac-9f31-4093eb897600
AggregatedHealthState : Warning
UnhealthyEvaluations  : 
                        Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', ConsiderWarningAsError=false.
                        
ReplicaHealthStates   : None
HealthEvents          : 
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Warning
                        SequenceNumber        : 123
                        SentAt                : 7/14/2017 4:55:39 PM
                        ReceivedAt            : 7/14/2017 4:55:44 PM
                        TTL                   : Infinite
                        Description           : Partition is below target replica or instance count.
                        fabric:/WordCount/WordCountService 7 2 af2e3e44-a8f8-45ac-9f31-4093eb897600
                          N/S Ready _Node_2 131444422260002646
                          N/S Ready _Node_4 131444422293113678
                          N/S Ready _Node_3 131444422293113679
                          N/S Ready _Node_1 131444422293118720
                          N/P Ready _Node_0 131444422293118721
                          (Showing 5 out of 5 replicas. Total available replicas: 5)
                        
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Warning = 7/14/2017 4:55:44 PM, LastOk = 1/1/0001 12:00:00 AM
                        
                        SourceId              : System.PLB
                        Property              : ServiceReplicaUnplacedHealth_Secondary_af2e3e44-a8f8-45ac-9f31-4093eb897600
                        HealthState           : Warning
                        SequenceNumber        : 131445250939703027
                        SentAt                : 7/14/2017 4:58:13 PM
                        ReceivedAt            : 7/14/2017 4:58:14 PM
                        TTL                   : 00:01:05
                        Description           : The Load Balancer was unable to find a placement for one or more of the Service's Replicas:
                        Secondary replica could not be placed due to the following constraints and properties:  
                        TargetReplicaSetSize: 7
                        Placement Constraint: N/A
                        Parent Service: N/A
                        
                        Constraint Elimination Sequence:
                        Existing Secondary Replicas eliminated 4 possible node(s) for placement -- 1/5 node(s) remain.
                        Existing Primary Replica eliminated 1 possible node(s) for placement -- 0/5 node(s) remain.
                        
                        Nodes Eliminated By Constraints:
                        
                        Existing Secondary Replicas -- Nodes with Partition's Existing Secondary Replicas/Instances:
                        --
                        FaultDomain:fd:/4 NodeName:_Node_4 NodeType:NodeType4 UpgradeDomain:4 UpgradeDomain: ud:/4 Deactivation Intent/Status: None/None
                        FaultDomain:fd:/3 NodeName:_Node_3 NodeType:NodeType3 UpgradeDomain:3 UpgradeDomain: ud:/3 Deactivation Intent/Status: None/None
                        FaultDomain:fd:/2 NodeName:_Node_2 NodeType:NodeType2 UpgradeDomain:2 UpgradeDomain: ud:/2 Deactivation Intent/Status: None/None
                        FaultDomain:fd:/1 NodeName:_Node_1 NodeType:NodeType1 UpgradeDomain:1 UpgradeDomain: ud:/1 Deactivation Intent/Status: None/None
                        
                        Existing Primary Replica -- Nodes with Partition's Existing Primary Replica or Secondary Replicas:
                        --
                        FaultDomain:fd:/0 NodeName:_Node_0 NodeType:NodeType0 UpgradeDomain:0 UpgradeDomain: ud:/0 Deactivation Intent/Status: None/None
                        
                        
                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : Error->Warning = 7/14/2017 4:56:14 PM, LastOk = 1/1/0001 12:00:00 AM

PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountService | select MinReplicaSetSize,TargetReplicaSetSize

MinReplicaSetSize TargetReplicaSetSize
----------------- --------------------
                2                    7                        

PS C:\> @(Get-ServiceFabricNode).Count
5
```

The following example shows the health of a partition that's stuck in reconfiguration due to the user not honoring the cancellation token in the **RunAsync** method. Investigating the health report of any replica marked as primary (P) can help to drill down further into the problem.

```powershell
PS C:\utilities\ServiceFabricExplorer\ClientPackage\lib> Get-ServiceFabricPartitionHealth 0e40fd81-284d-4be4-a665-13bc5a6607ec -ExcludeHealthStatistics 


PartitionId           : 0e40fd81-284d-4be4-a665-13bc5a6607ec
AggregatedHealthState : Warning
UnhealthyEvaluations  : 
                        Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', 
                        ConsiderWarningAsError=false.
                                               
HealthEvents          : 
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Warning
                        SequenceNumber        : 7
                        SentAt                : 8/27/2017 3:43:09 AM
                        ReceivedAt            : 8/27/2017 3:43:32 AM
                        TTL                   : Infinite
                        Description           : Partition reconfiguration is taking longer than expected.
                        fabric:/app/test1 3 1 0e40fd81-284d-4be4-a665-13bc5a6607ec
                          P/S Ready Node1 131482789658160654
                          S/P Ready Node2 131482789688598467
                          S/S Ready Node3 131482789688598468
                          (Showing 3 out of 3 replicas. Total available replicas: 3)                        
                        
                        For more information see: https://aka.ms/sfhealth
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Ok->Warning = 8/27/2017 3:43:32 AM, LastError = 1/1/0001 12:00:00 AM
```
This health report shows the state of the replicas of the partition undergoing reconfiguration: 

```
  P/S Ready Node1 131482789658160654
  S/P Ready Node2 131482789688598467
  S/S Ready Node3 131482789688598468
```

For each replica, the health report contains:
- Previous configuration role
- Current configuration role
- [Replica state](service-fabric-concepts-replica-lifecycle.md)
- Node on which the replica is running
- Replica ID

In a case like the example, further investigation is needed. Investigate the health of each individual replica starting with the replicas marked as `Primary` and `Secondary` (131482789658160654 and 131482789688598467) in the previous example.

### Replica constraint violation
**System.PLB** reports a warning if it detects a replica constraint violation and can't place all partition replicas. The report details show which constraints and properties prevent the replica placement.

* **SourceId**: System.PLB
* **Property**: Starts with **ReplicaConstraintViolation**.

## Replica system health reports
**System.RA**, which represents the reconfiguration agent component, is the authority for the replica state.

### State
System.RA reports OK when the replica has been created.

* **SourceId**: System.RA
* **Property**: State.

The following example shows a healthy replica:

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountService | Get-ServiceFabricReplica | where {$_.ReplicaRole -eq "Primary"} | Get-ServiceFabricReplicaHealth

PartitionId           : af2e3e44-a8f8-45ac-9f31-4093eb897600
ReplicaId             : 131444422293118721
AggregatedHealthState : Ok
HealthEvents          : 
                        SourceId              : System.RA
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 131445248920273536
                        SentAt                : 7/14/2017 4:54:52 PM
                        ReceivedAt            : 7/14/2017 4:55:13 PM
                        TTL                   : Infinite
                        Description           : Replica has been created._Node_0
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Ok = 7/14/2017 4:55:13 PM, LastWarning = 1/1/0001 12:00:00 AM
```

### ReplicaOpenStatus, ReplicaCloseStatus, ReplicaChangeRoleStatus
This property is used to indicate warnings or failures when attempting to open a replica, close a replica, or transition a replica from one role to another. For more information, see [Replica lifecycle](service-fabric-concepts-replica-lifecycle.md). The failures might be exceptions thrown from the API calls or crashes of the service host process during this time. For failures due to API calls from C# code, Service Fabric adds the exception and stack trace to the health report.

These health warnings are raised after retrying the action locally some number of times (depending on policy). Service Fabric retries the action up to a maximum threshold. After the maximum threshold is reached, it might try to act to correct the situation. This attempt can cause these warnings to get cleared as it gives up on the action on this node. For example, if a replica is failing to open on a node, Service Fabric raises a health warning. If the replica continues to fail to open, Service Fabric acts to self-repair. This action might involve trying the same operation on another node. This attempt causes the warning raised for this replica to be cleared. 

* **SourceId**: System.RA
* **Property**: **ReplicaOpenStatus**, **ReplicaCloseStatus**, and **ReplicaChangeRoleStatus**.
* **Next steps**: Investigate the service code or crash dumps to identify why the operation is failing.

The following example shows the health of a replica that's throwing `TargetInvocationException` from its open method. The description contains the point of failure, **IStatefulServiceReplica.Open**, the exception type **TargetInvocationException**, and the stack trace.

```powershell
PS C:\> Get-ServiceFabricReplicaHealth -PartitionId 337cf1df-6cab-4825-99a9-7595090c0b1b -ReplicaOrInstanceId 131483509874784794


PartitionId           : 337cf1df-6cab-4825-99a9-7595090c0b1b
ReplicaId             : 131483509874784794
AggregatedHealthState : Warning
UnhealthyEvaluations  : 
                        Unhealthy event: SourceId='System.RA', Property='ReplicaOpenStatus', HealthState='Warning', 
                        ConsiderWarningAsError=false.
                        
HealthEvents          : 
                        SourceId              : System.RA
                        Property              : ReplicaOpenStatus
                        HealthState           : Warning
                        SequenceNumber        : 131483510001453159
                        SentAt                : 8/27/2017 11:43:20 PM
                        ReceivedAt            : 8/27/2017 11:43:21 PM
                        TTL                   : Infinite
                        Description           : Replica had multiple failures during open on _Node_0 API call: IStatefulServiceReplica.Open(); Error = System.Reflection.TargetInvocationException (-2146232828)
Exception has been thrown by the target of an invocation.
   at Microsoft.ServiceFabric.Replicator.RecoveryManager.d__31.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at Microsoft.ServiceFabric.Replicator.LoggingReplicator.d__137.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at Microsoft.ServiceFabric.Replicator.DynamicStateManager.d__109.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at Microsoft.ServiceFabric.Replicator.TransactionalReplicator.d__79.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at Microsoft.ServiceFabric.Replicator.StatefulServiceReplica.d__21.MoveNext()
--- End of stack trace from previous location where exception was thrown ---
   at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
   at Microsoft.ServiceFabric.Services.Runtime.StatefulServiceReplicaAdapter.d__0.MoveNext()

    For more information see: https://aka.ms/sfhealth
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Warning = 8/27/2017 11:43:21 PM, LastOk = 1/1/0001 12:00:00 AM                        
```

The following example shows a replica that's constantly crashing during close:

```powershell
C:>Get-ServiceFabricReplicaHealth -PartitionId dcafb6b7-9446-425c-8b90-b3fdf3859e64 -ReplicaOrInstanceId 131483565548493142


PartitionId           : dcafb6b7-9446-425c-8b90-b3fdf3859e64
ReplicaId             : 131483565548493142
AggregatedHealthState : Warning
UnhealthyEvaluations  : 
                        Unhealthy event: SourceId='System.RA', Property='ReplicaCloseStatus', HealthState='Warning', 
                        ConsiderWarningAsError=false.
                        
HealthEvents          : 
                        SourceId              : System.RA
                        Property              : ReplicaCloseStatus
                        HealthState           : Warning
                        SequenceNumber        : 131483565611258984
                        SentAt                : 8/28/2017 1:16:01 AM
                        ReceivedAt            : 8/28/2017 1:16:03 AM
                        TTL                   : Infinite
                        Description           : Replica had multiple failures during close on _Node_1. The application 
                        host has crashed.
                        
                        For more information see: https://aka.ms/sfhealth
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Warning = 8/28/2017 1:16:03 AM, LastOk = 1/1/0001 12:00:00 AM
```

### Reconfiguration
This property is used to indicate when a replica performing a [reconfiguration](service-fabric-concepts-reconfiguration.md) detects that the reconfiguration is stalled or stuck. This health report might be on the replica whose current role is primary, except in the cases of a swap primary reconfiguration, where it might be on the replica that's being demoted from primary to active secondary.

The reconfiguration can be stuck for one of the following reasons:

- An action on the local replica, the same replica as the one performing the reconfiguration, is not completing. In this case, investigating the health reports on this replica from other components, System.RAP or System.RE, might provide additional information.

- An action is not completing on a remote replica. Replicas for which actions are pending are listed in the health report. Further investigation should be done on health reports for those remote replicas. There might also be communication problems between this node and the remote node.

In rare cases, the reconfiguration can be stuck due to communication or other problems between this node and the Failover Manager service.

* **SourceId**: System.RA
* **Property**: Reconfiguration.
* **Next steps**: Investigate local or remote replicas depending on the description of the health report.

The following example shows a health report where a reconfiguration is stuck on the local replica. In this sample, it's due to a service not honoring the cancellation token.

```powershell
PS C:\> Get-ServiceFabricReplicaHealth -PartitionId 9a0cedee-464c-4603-abbc-1cf57c4454f3 -ReplicaOrInstanceId 131483600074836703


PartitionId           : 9a0cedee-464c-4603-abbc-1cf57c4454f3
ReplicaId             : 131483600074836703
AggregatedHealthState : Warning
UnhealthyEvaluations  : 
                        Unhealthy event: SourceId='System.RA', Property='Reconfiguration', HealthState='Warning', 
                        ConsiderWarningAsError=false.
                        
HealthEvents          : 
                        SourceId              : System.RA
                        Property              : Reconfiguration
                        HealthState           : Warning
                        SequenceNumber        : 131483600309264482
                        SentAt                : 8/28/2017 2:13:50 AM
                        ReceivedAt            : 8/28/2017 2:13:57 AM
                        TTL                   : Infinite
                        Description           : Reconfiguration is stuck. Waiting for response from the local replica
                        
                        For more information see: https://aka.ms/sfhealth
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Warning = 8/28/2017 2:13:57 AM, LastOk = 1/1/0001 12:00:00 AM
```

The following example shows a health report where a reconfiguration is stuck waiting for a response from two remote replicas. In this example, there are three replicas in the partition, including the current primary. 

```Powershell
PS C:\> Get-ServiceFabricReplicaHealth -PartitionId  579d50c6-d670-4d25-af70-d706e4bc19a2 -ReplicaOrInstanceId 131483956274977415


PartitionId           : 579d50c6-d670-4d25-af70-d706e4bc19a2
ReplicaId             : 131483956274977415
AggregatedHealthState : Warning
UnhealthyEvaluations  : 
                        Unhealthy event: SourceId='System.RA', Property='Reconfiguration', HealthState='Warning', ConsiderWarningAsError=false.
                        
HealthEvents          : 
                        SourceId              : System.RA
                        Property              : Reconfiguration
                        HealthState           : Warning
                        SequenceNumber        : 131483960376212469
                        SentAt                : 8/28/2017 12:13:57 PM
                        ReceivedAt            : 8/28/2017 12:14:07 PM
                        TTL                   : Infinite
                        Description           : Reconfiguration is stuck. Waiting for response from 2 replicas
                        
                        Pending Replicas: 
                        P/I Down 40 131483956244554282
                        S/S Down 20 131483956274972403
                        
                        For more information see: https://aka.ms/sfhealth
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Warning = 8/28/2017 12:07:37 PM, LastOk = 1/1/0001 12:00:00 AM
```

This health report shows that the reconfiguration is stuck waiting for a response from two replicas: 

```
    P/I Down 40 131483956244554282
    S/S Down 20 131483956274972403
```

For each replica, the following information is given:
- Previous configuration role
- Current configuration role
- [Replica state](service-fabric-concepts-replica-lifecycle.md)
- Node ID
- Replica ID

To unblock the reconfiguration:
- The **down** replicas should be brought up. 
- The **inbuild** replicas should complete the build and transition to ready.

### Slow service API call
**System.RAP** and **System.Replicator** report a warning if a call to the user service code takes longer than the configured time. The warning is cleared when the call completes.

* **SourceId**: System.RAP or System.Replicator
* **Property**: The name of the slow API. The description provides more details about the time the API has been pending.
* **Next steps**: Investigate why the call takes longer than expected.

The following example shows the health event from System.RAP for a reliable service that's not honoring the cancellation token in **RunAsync**:

```powershell
PS C:\> Get-ServiceFabricReplicaHealth -PartitionId 5f6060fb-096f-45e4-8c3d-c26444d8dd10 -ReplicaOrInstanceId 131483966141404693


PartitionId           : 5f6060fb-096f-45e4-8c3d-c26444d8dd10
ReplicaId             : 131483966141404693
AggregatedHealthState : Warning
UnhealthyEvaluations  : 
                        Unhealthy event: SourceId='System.RA', Property='Reconfiguration', HealthState='Warning', ConsiderWarningAsError=false.
                        
HealthEvents          :                         
                        SourceId              : System.RAP
                        Property              : IStatefulServiceReplica.ChangeRole(S)Duration
                        HealthState           : Warning
                        SequenceNumber        : 131483966663476570
                        SentAt                : 8/28/2017 12:24:26 PM
                        ReceivedAt            : 8/28/2017 12:24:56 PM
                        TTL                   : Infinite
                        Description           : The api IStatefulServiceReplica.ChangeRole(S) on _Node_1 is stuck. Start Time (UTC): 2017-08-28 12:23:56.347.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Warning = 8/28/2017 12:24:56 PM, LastOk = 1/1/0001 12:00:00 AM
                        
```

The property and text indicate which API got stuck. The next steps to take for different stuck APIs are different. Any API on the *IStatefulServiceReplica* or *IStatelessServiceInstance* is usually a bug in the service code. The following section describes how these translate to the [Reliable Services model](service-fabric-reliable-services-lifecycle.md):

- **IStatefulServiceReplica.Open**: This warning indicates that a call to `CreateServiceInstanceListeners`, `ICommunicationListener.OpenAsync`, or if overridden, `OnOpenAsync` is stuck.

- **IStatefulServiceReplica.Close** and **IStatefulServiceReplica.Abort**: The most common case is a service not honoring the cancellation token passed in to `RunAsync`. It might also be that `ICommunicationListener.CloseAsync`, or if overridden, `OnCloseAsync` is stuck.

- **IStatefulServiceReplica.ChangeRole(S)** and **IStatefulServiceReplica.ChangeRole(N)**: The most common case is a service not honoring the cancellation token passed in to `RunAsync`. In this scenario, the best solution is to restart the replica.

- **IStatefulServiceReplica.ChangeRole(P)**: The most common case is that the service has not returned a task from `RunAsync`.

Other API calls that can get stuck are on the **IReplicator** interface. For example:

- **IReplicator.CatchupReplicaSet**: This warning indicates one of two things. There are insufficient up replicas. To see if this is the case, look at the replica status of the replicas in the partition or the System.FM health report for a stuck reconfiguration. Or the replicas are not acknowledging operations. The PowerShell cmdlet `Get-ServiceFabricDeployedReplicaDetail` can be used to determine the progress of all the replicas. The problem lies with replicas whose `LastAppliedReplicationSequenceNumber` value is behind the primary's `CommittedSequenceNumber` value.

- **IReplicator.BuildReplica(\<Remote ReplicaId>)**: This warning indicates a problem in the build process. For more information, see [Replica lifecycle](service-fabric-concepts-replica-lifecycle.md). It might be due to a misconfiguration of the replicator address. For more information, see [Configure stateful Reliable Services](service-fabric-reliable-services-configuration.md) and [Specify resources in a service manifest](service-fabric-service-manifest-resources.md). It might also be a problem on the remote node.

### Replicator system health reports
**Replication queue full:**
**System.Replicator** reports a warning when the replication queue is full. On the primary, the replication queue usually becomes full because one or more secondary replicas are slow to acknowledge operations. On the secondary, this usually happens when the service is slow to apply the operations. The warning is cleared when the queue is no longer full.

* **SourceId**: System.Replicator
* **Property**: **PrimaryReplicationQueueStatus** or **SecondaryReplicationQueueStatus**, depending on the replica role.
* **Next steps**: If the report is on the primary, check the connection between the nodes in the cluster. If all connections are healthy, there might be at least one slow secondary with a high disk latency to apply operations. If the report is on the secondary, check the disk usage and performance on the node first. Then check the outgoing connection from the slow node to the primary.

**RemoteReplicatorConnectionStatus:**
**System.Replicator** on the primary replica reports a warning when the connection to a secondary (remote) replicator is not healthy. The remote replicator's address is shown in the report's message, which makes it more convenient to detect if the wrong configuration was passed in or if there are network issues between the replicators.

* **SourceId**: System.Replicator
* **Property**: **RemoteReplicatorConnectionStatus**.
* **Next steps**: Check the error message and make sure the remote replicator address is configured correctly. For example, if the remote replicator is opened with the "localhost" listen address, it isn't reachable from the outside. If the address looks correct, check the connection between the primary node and the remote address to find any potential network issues.

### Replication queue full
**System.Replicator** reports a warning when the replication queue is full. On the primary, the replication queue usually becomes full because one or more secondary replicas are slow to acknowledge operations. On the secondary, this usually happens when the service is slow to apply the operations. The warning is cleared when the queue is no longer full.

* **SourceId**: System.Replicator
* **Property**: **PrimaryReplicationQueueStatus** or **SecondaryReplicationQueueStatus**, depending on the replica role.

### Slow Naming operations
**System.NamingService** reports the health on its primary replica when a Naming operation takes longer than acceptable. Examples of Naming operations are [CreateServiceAsync](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.servicemanagementclient.createserviceasync) or [DeleteServiceAsync](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.servicemanagementclient.deleteserviceasync). More methods can be found under FabricClient. For example, they can be found under [service management methods](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.servicemanagementclient) or [property management methods](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.propertymanagementclient).

> [!NOTE]
> The Naming service resolves service names to a location in the cluster. Users can use it to manage service names and properties. It's a Service Fabric partitioned-persisted service. One of the partitions represents the *Authority Owner*, which contains metadata about all Service Fabric names and services. The Service Fabric names are mapped to different partitions, called *Name Owner* partitions, so the service is extensible. Read more about the [Naming service](service-fabric-architecture.md).
> 
> 

When a Naming operation takes longer than expected, the operation is flagged with a warning report on the primary replica of the Naming service partition that serves the operation. If the operation completes successfully, the warning is cleared. If the operation completes with an error, the health report includes details about the error.

* **SourceId**: System.NamingService
* **Property**: Starts with the prefix "**Duration_**" and identifies the slow operation and the Service Fabric name on which the operation is applied. For example, if create service at name **fabric:/MyApp/MyService** takes too long, the property is **Duration_AOCreateService.fabric:/MyApp/MyService**. "AO" points to the role of the Naming partition for this name and operation.
* **Next steps**: Check to see why the Naming operation fails. Each operation can have different root causes. For example, the delete service might be stuck. The service might be stuck because the application host keeps crashing on a node due to a user bug in the service code.

The following example shows a create service operation. The operation took longer than the configured duration. "AO" retries and sends work to "NO." "NO" completed the last operation with TIMEOUT. In this case, the same replica is primary for both the "AO" and "NO" roles.

```powershell
PartitionId           : 00000000-0000-0000-0000-000000001000
ReplicaId             : 131064359253133577
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='System.NamingService', Property='Duration_AOCreateService.fabric:/MyApp/MyService', HealthState='Warning', ConsiderWarningAsError=false.

HealthEvents          :
                        SourceId              : System.RA
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 131064359308715535
                        SentAt                : 4/29/2016 8:38:50 PM
                        ReceivedAt            : 4/29/2016 8:39:08 PM
                        TTL                   : Infinite
                        Description           : Replica has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Ok = 4/29/2016 8:39:08 PM, LastWarning = 1/1/0001 12:00:00 AM

                        SourceId              : System.NamingService
                        Property              : Duration_AOCreateService.fabric:/MyApp/MyService
                        HealthState           : Warning
                        SequenceNumber        : 131064359526778775
                        SentAt                : 4/29/2016 8:39:12 PM
                        ReceivedAt            : 4/29/2016 8:39:38 PM
                        TTL                   : 00:05:00
                        Description           : The AOCreateService started at 2016-04-29 20:39:08.677 is taking longer than 30.000.
                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : Error->Warning = 4/29/2016 8:39:38 PM, LastOk = 1/1/0001 12:00:00 AM

                        SourceId              : System.NamingService
                        Property              : Duration_NOCreateService.fabric:/MyApp/MyService
                        HealthState           : Warning
                        SequenceNumber        : 131064360657607311
                        SentAt                : 4/29/2016 8:41:05 PM
                        ReceivedAt            : 4/29/2016 8:41:08 PM
                        TTL                   : 00:00:15
                        Description           : The NOCreateService started at 2016-04-29 20:39:08.689 completed with FABRIC_E_TIMEOUT in more than 30.000.
                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : Error->Warning = 4/29/2016 8:39:38 PM, LastOk = 1/1/0001 12:00:00 AM
```

## DeployedApplication system health reports
**System.Hosting** is the authority on deployed entities.

### Activation
System.Hosting reports as OK when an application has been successfully activated on the node. Otherwise, it reports an error.

* **SourceId**: System.Hosting
* **Property**: **Activation**, including the rollout version.
* **Next steps**: If the application is unhealthy, investigate why the activation failed.

The following example shows a successful activation:

```powershell
PS C:\> Get-ServiceFabricDeployedApplicationHealth -NodeName _Node_1 -ApplicationName fabric:/WordCount -ExcludeHealthStatistics

ApplicationName                    : fabric:/WordCount
NodeName                           : _Node_1
AggregatedHealthState              : Ok
DeployedServicePackageHealthStates : 
                                     ServiceManifestName   : WordCountServicePkg
                                     ServicePackageActivationId : 
                                     NodeName              : _Node_1
                                     AggregatedHealthState : Ok
                                     
HealthEvents                       : 
                                     SourceId              : System.Hosting
                                     Property              : Activation
                                     HealthState           : Ok
                                     SequenceNumber        : 131445249083836329
                                     SentAt                : 7/14/2017 4:55:08 PM
                                     ReceivedAt            : 7/14/2017 4:55:14 PM
                                     TTL                   : Infinite
                                     Description           : The application was activated successfully.
                                     RemoveWhenExpired     : False
                                     IsExpired             : False
                                     Transitions           : Error->Ok = 7/14/2017 4:55:14 PM, LastWarning = 1/1/0001 12:00:00 AM
```

### Download
System.Hosting reports an error if the application package download fails.

* **SourceId**: System.Hosting
* **Property**: **Download**, including the rollout version.
* **Next steps**: Investigate why the download failed on the node.

## DeployedServicePackage system health reports
**System.Hosting** is the authority on deployed entities.

### Service package activation
System.Hosting reports as OK if the service package activation on the node is successful. Otherwise, it reports an error.

* **SourceId**: System.Hosting
* **Property**: Activation.
* **Next steps**: Investigate why the activation failed.

### Code package activation
System.Hosting reports as OK for each code package if the activation is successful. If the activation fails, it reports a warning as configured. If **CodePackage** fails to activate or terminates with an error greater than the configured **CodePackageHealthErrorThreshold**, hosting reports an error. If a service package contains multiple code packages, an activation report is generated for each one.

* **SourceId**: System.Hosting
* **Property**: Uses the prefix **CodePackageActivation** and contains the name of the code package and the entry point as *CodePackageActivation:CodePackageName:SetupEntryPoint/EntryPoint*. For example, **CodePackageActivation:Code:SetupEntryPoint**.

### Service type registration
System.Hosting reports as OK if the service type has been registered successfully. It reports an error if the registration wasn't done in time, as configured by using **ServiceTypeRegistrationTimeout**. If the runtime is closed, the service type is unregistered from the node and hosting reports a warning.

* **SourceId**: System.Hosting
* **Property**: Uses the prefix **ServiceTypeRegistration** and contains the service type name. For example, **ServiceTypeRegistration:FileStoreServiceType**.

The following example shows a healthy deployed service package:

```powershell
PS C:\> Get-ServiceFabricDeployedServicePackageHealth -NodeName _Node_1 -ApplicationName fabric:/WordCount -ServiceManifestName WordCountServicePkg


ApplicationName            : fabric:/WordCount
ServiceManifestName        : WordCountServicePkg
ServicePackageActivationId : 
NodeName                   : _Node_1
AggregatedHealthState      : Ok
HealthEvents               : 
                             SourceId              : System.Hosting
                             Property              : Activation
                             HealthState           : Ok
                             SequenceNumber        : 131445249084026346
                             SentAt                : 7/14/2017 4:55:08 PM
                             ReceivedAt            : 7/14/2017 4:55:14 PM
                             TTL                   : Infinite
                             Description           : The ServicePackage was activated successfully.
                             RemoveWhenExpired     : False
                             IsExpired             : False
                             Transitions           : Error->Ok = 7/14/2017 4:55:14 PM, LastWarning = 1/1/0001 12:00:00 AM
                             
                             SourceId              : System.Hosting
                             Property              : CodePackageActivation:Code:EntryPoint
                             HealthState           : Ok
                             SequenceNumber        : 131445249084306362
                             SentAt                : 7/14/2017 4:55:08 PM
                             ReceivedAt            : 7/14/2017 4:55:14 PM
                             TTL                   : Infinite
                             Description           : The CodePackage was activated successfully.
                             RemoveWhenExpired     : False
                             IsExpired             : False
                             Transitions           : Error->Ok = 7/14/2017 4:55:14 PM, LastWarning = 1/1/0001 12:00:00 AM
                             
                             SourceId              : System.Hosting
                             Property              : ServiceTypeRegistration:WordCountServiceType
                             HealthState           : Ok
                             SequenceNumber        : 131445249088096842
                             SentAt                : 7/14/2017 4:55:08 PM
                             ReceivedAt            : 7/14/2017 4:55:14 PM
                             TTL                   : Infinite
                             Description           : The ServiceType was registered successfully.
                             RemoveWhenExpired     : False
                             IsExpired             : False
                             Transitions           : Error->Ok = 7/14/2017 4:55:14 PM, LastWarning = 1/1/0001 12:00:00 AM
```

### Download
System.Hosting reports an error if the service package download fails.

* **SourceId**: System.Hosting
* **Property**: **Download**, including the rollout version.
* **Next steps**: Investigate why the download failed on the node.

### Upgrade validation
System.Hosting reports an error if validation during the upgrade fails or if the upgrade fails on the node.

* **SourceId**: System.Hosting
* **Property**: Uses the prefix **FabricUpgradeValidation** and contains the upgrade version.
* **Description**: Points to the error encountered.

### Undefined node capacity for resource governance metrics
System.Hosting reports a warning if node capacities aren't defined in the cluster manifest and the configuration for automatic detection is turned off. Service Fabric raises a health warning whenever the service package that uses [resource governance](service-fabric-resource-governance.md) registers on a specified node.

* **SourceId**: System.Hosting
* **Property**: **ResourceGovernance**.
* **Next steps**: The preferred way to overcome this problem is to change the cluster manifest to enable automatic detection of available resources. Another way is to update the cluster manifest with correctly specified node capacities for these metrics.

## Next steps
* [View Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)

* [How to report and check service health](service-fabric-diagnostics-how-to-report-and-check-service-health.md)

* [Monitor and diagnose services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

* [Service Fabric application upgrade](service-fabric-application-upgrade.md)

