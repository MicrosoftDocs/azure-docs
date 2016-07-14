<properties
   pageTitle="Troubleshoot with system health reports | Microsoft Azure"
   description="Describes the health reports sent by Azure Service Fabric components and their usage for troubleshooting cluster or application issues."
   services="service-fabric"
   documentationCenter=".net"
   authors="oanapl"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/11/2016"
   ms.author="oanapl"/>

# Use system health reports to troubleshoot

Azure Service Fabric components report out of the box on all entities in the cluster. The [health store](service-fabric-health-introduction.md#health-store) creates and deletes entities based on the system reports. It also organizes them in a hierarchy that captures entity interactions.

> [AZURE.NOTE] Read more about the [Service Fabric health model](service-fabric-health-introduction.md) to understand health-related concepts.

System health reports provide visibility into cluster and application functionality and flag issues through health. For applications and services, system health reports verify that entities are implemented and are behaving correctly from the Service Fabric perspective. The reports do not provide any health monitoring of the business logic of the service or detection of hung processes. User services can enrich the health data with information specific to their logic.

> [AZURE.NOTE] Watchdogs health reports are visible only *after* the system components create an entity. When an entity is deleted, the health store automatically deletes all health reports associated with it. The same is true when a new instance of the entity is created (for example, a new service replica instance is created). All reports associated with the old instance are deleted and cleaned up from the store.

The system component reports are identified by the source, which starts with the "**System.**" prefix. Watchdogs can't use the same prefix for their sources, as reports with invalid parameters will be rejected.
Let's look at some system reports to understand what triggers them and how to correct the possible issues they represent.

> [AZURE.NOTE] Service Fabric continues to add reports on conditions of interest that improve visibility into what is happening in the cluster and application.

## Cluster system health reports
The cluster health entity is created automatically in the health store, so if everything works properly, it doesn't have a system report.

### Neighborhood loss
**System.Federation** reports an error when it detects a neighborhood loss. The report is from individual nodes, and the node ID is included in the property name. If one neighborhood is lost in the entire Service Fabric ring, you can typically expect two events (both sides of the gap will report). If more neighborhoods are lost, there will be more events.

The report specifies the global lease timeout as the time to live. The report is resent every half of the TTL duration for as long as the condition remains active. The event is automatically removed when it expires, so if the reporting node is down, it is still cleaned up from the health store correctly.

- **SourceId**: System.Federation
- **Property**: Starts with **Neighborhood** and includes node information
- **Next steps**: Investigate why the neighborhood is lost (for example, check the communication between cluster nodes).

## Node system health reports
**System.FM**, which represents the Failover Manager service, is the authority that manages information about cluster nodes. Each node should have one report from System.FM showing its state. The node entities are removed when the node state is removed (ie. see [RemoveNodeStateAsync](https://msdn.microsoft.com/library/azure/mt161348.aspx) ).

### Node up/down
System.FM reports as OK when the node joins the ring (it's up and running). It reports an error when the node departs the ring (it's down, either for upgrading or simply because it has failed). The health hierarchy built by the health store takes action on deployed entities in correlation with System.FM node reports. It considers the node a virtual parent of all deployed entities. The deployed entities on that node are not exposed through queries if the node is down or not reported, or if the node has a different instance than the instance associated with the entities. When System.FM reports that the node is down or restarted (a new instance), the health store automatically cleans up the deployed entities that can exist only on the down node or on the previous instance of the node.

- **SourceId**: System.FM
- **Property**: State
- **Next steps**: If the node is down for an upgrade, it should come back up once it has been upgraded. In this case, the health state should be switched back to OK. If the node doesn't come back or it fails, the problem needs more investigation.

The following shows the System.FM event with a health state of OK for node up:

```powershell

PS C:\> Get-ServiceFabricNodeHealth -NodeName Node.1
NodeName              : Node.1
AggregatedHealthState : Ok
HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 2
                        SentAt                : 4/24/2015 5:27:33 PM
                        ReceivedAt            : 4/24/2015 5:28:50 PM
                        TTL                   : Infinite
                        Description           : Fabric node is up.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 5:28:50 PM

```


### Certificate expiration
**System.FabricNode** reports a warning when certificates used by the node are near expiration. There are three certificates per node: **Certificate_cluster**, **Certificate_server**, and **Certificate_default_client**. When the expiration is at least two weeks away, the report health state is OK. When the expiration is within two weeks, the report type is a warning. TTL of these events is infinite, and they are removed when a node leaves the cluster.

- **SourceId**: System.FabricNode
- **Property**: Starts with **Certificate** and contains more information about the certificate type
- **Next steps**: Update the certificates if they are near expiration.

### Load capacity violation
The Service Fabric Load Balancer reports a warning if it detects a node capacity violation.

 - **SourceId**: System.PLB
 - **Property**: Starts with **Capacity**
 - **Next steps**: Check provided metrics and view the current capacity on the node.

## Application system health reports
**System.CM**, which represents the Cluster Manager service, is the authority that manages information about an application.

### State
System.CM reports as OK when the application has been created or updated. It informs the health store when the application has been deleted, so that it can be removed from store.

- **SourceId**: System.CM
- **Property**: State
- **Next steps**: If the application has been created, it should include the Cluster Manager health report. Otherwise, check the state of the application by issuing a query (for example, the PowerShell cmdlet **Get-ServiceFabricApplication -ApplicationName *applicationName***).

The following shows the state event on the **fabric:/WordCount** application:

```powershell
PS C:\> Get-ServiceFabricApplicationHealth fabric:/WordCount -ServicesFilter None -DeployedApplicationsFilter None

ApplicationName                 : fabric:/WordCount
AggregatedHealthState           : Ok
ServiceHealthStates             : None
DeployedApplicationHealthStates : None
HealthEvents                    :
                                  SourceId              : System.CM
                                  Property              : State
                                  HealthState           : Ok
                                  SequenceNumber        : 82
                                  SentAt                : 4/24/2015 6:12:51 PM
                                  ReceivedAt            : 4/24/2015 6:12:51 PM
                                  TTL                   : Infinite
                                  Description           : Application has been created.
                                  RemoveWhenExpired     : False
                                  IsExpired             : False
                                  Transitions           : ->Ok = 4/24/2015 6:12:51 PM
```

## Service system health reports
**System.FM**, which represents the Failover Manager service, is the authority that manages information about services.

### State
System.FM reports as OK when the service has been created. It deletes the entity from the health store when the service has been deleted.

- **SourceId**: System.FM
- **Property**: State

The following shows the state event on the service **fabric:/WordCount/WordCountService**:

```powershell
PS C:\> Get-ServiceFabricServiceHealth fabric:/WordCount/WordCountService

ServiceName           : fabric:/WordCount/WordCountService
AggregatedHealthState : Ok
PartitionHealthStates :
                        PartitionId           : 875a1caa-d79f-43bd-ac9d-43ee89a9891c
                        AggregatedHealthState : Ok

HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 3
                        SentAt                : 4/24/2015 6:12:51 PM
                        ReceivedAt            : 4/24/2015 6:13:01 PM
                        TTL                   : Infinite
                        Description           : Service has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 6:13:01 PM
```

### Unplaced replicas violation
**System.PLB** reports a warning if it cannot find a placement for one or more service replicas. The report is removed when it expires.

- **SourceId**: System.FM
- **Property**: State
- **Next steps**: Check the service constraints and the current state of the placement.

The following shows a violation for a service configured with 7 target replicas in a cluster with 5 nodes:

```xml
PS C:\> Get-ServiceFabricServiceHealth fabric:/WordCount/WordCountService


ServiceName           : fabric:/WordCount/WordCountService
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='System.PLB',
                        Property='ServiceReplicaUnplacedHealth_Secondary_a1f83a35-d6bf-4d39-b90d-28d15f39599b', HealthState='Warning',
                        ConsiderWarningAsError=false.

PartitionHealthStates :
                        PartitionId           : a1f83a35-d6bf-4d39-b90d-28d15f39599b
                        AggregatedHealthState : Warning

HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 10
                        SentAt                : 3/22/2016 7:56:53 PM
                        ReceivedAt            : 3/22/2016 7:57:18 PM
                        TTL                   : Infinite
                        Description           : Service has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Error->Ok = 3/22/2016 7:57:18 PM, LastWarning = 1/1/0001 12:00:00 AM

                        SourceId              : System.PLB
                        Property              : ServiceReplicaUnplacedHealth_Secondary_a1f83a35-d6bf-4d39-b90d-28d15f39599b
                        HealthState           : Warning
                        SequenceNumber        : 131032232425505477
                        SentAt                : 3/23/2016 4:14:02 PM
                        ReceivedAt            : 3/23/2016 4:14:03 PM
                        TTL                   : 00:01:05
                        Description           : The Load Balancer was unable to find a placement for one or more of the Service's Replicas:
                        fabric:/WordCount/WordCountService Secondary Partition a1f83a35-d6bf-4d39-b90d-28d15f39599b could not be placed, possibly,
                        due to the following constraints and properties:  
                        Placement Constraint: N/A
                        Depended Service: N/A

                        Constraint Elimination Sequence:
                        ReplicaExclusionStatic eliminated 4 possible node(s) for placement -- 1/5 node(s) remain.
                        ReplicaExclusionDynamic eliminated 1 possible node(s) for placement -- 0/5 node(s) remain.

                        Nodes Eliminated By Constraints:

                        ReplicaExclusionStatic:
                        FaultDomain:fd:/0 NodeName:_Node_0 NodeType:NodeType0 UpgradeDomain:0 UpgradeDomain: ud:/0 Deactivation Intent/Status:
                        None/None
                        FaultDomain:fd:/1 NodeName:_Node_1 NodeType:NodeType1 UpgradeDomain:1 UpgradeDomain: ud:/1 Deactivation Intent/Status:
                        None/None
                        FaultDomain:fd:/3 NodeName:_Node_3 NodeType:NodeType3 UpgradeDomain:3 UpgradeDomain: ud:/3 Deactivation Intent/Status:
                        None/None
                        FaultDomain:fd:/4 NodeName:_Node_4 NodeType:NodeType4 UpgradeDomain:4 UpgradeDomain: ud:/4 Deactivation Intent/Status:
                        None/None

                        ReplicaExclusionDynamic:
                        FaultDomain:fd:/2 NodeName:_Node_2 NodeType:NodeType2 UpgradeDomain:2 UpgradeDomain: ud:/2 Deactivation Intent/Status:
                        None/None


                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : Error->Warning = 3/22/2016 7:57:48 PM, LastOk = 1/1/0001 12:00:00 AM
```

## Partition system health reports
**System.FM**, which represents the Failover Manager service, is the authority that manages information about service partitions.

### State
System.FM reports as OK when the partition has been created and is healthy. It deletes the entity from the health store when the partition is deleted.

If the partition is below the minimum replica count, it reports an error. If the partition is not below the minimum replica count, but it is below the target replica count, it reports a warning. If the partition is in quorum loss, System.FM reports an error.

Other important events include a warning when the reconfiguration takes longer than expected and when the build takes longer than expected. The expected times for the build and reconfiguration are configurable based on service scenarios. For example, if a service has a terabyte of state, such as SQL Database, the build will take longer than it would for a service with a small amount of state.

- **SourceId**: System.FM
- **Property**: State
- **Next steps**: If the health state is not OK, it's possible that some replicas have not been created, opened, or promoted to primary or secondary correctly. In many instances, the root cause is a service bug in the open or change-role implementation.

The following shows a healthy partition:

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/StatelessPiApplication/StatelessPiService | Get-ServiceFabricPartitionHealth
PartitionId           : 29da484c-2c08-40c5-b5d9-03774af9a9bf
AggregatedHealthState : Ok
ReplicaHealthStates   : None
HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 38
                        SentAt                : 4/24/2015 6:33:10 PM
                        ReceivedAt            : 4/24/2015 6:33:31 PM
                        TTL                   : Infinite
                        Description           : Partition is healthy.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 6:33:31 PM
```

The following shows the health of a partition that is below target replica count. The next step is to get the partition description, which shows how it is configured: **MinReplicaSetSize** is two and **TargetReplicaSetSize** is seven. Then get the number of nodes in the cluster: five. So in this case, two replicas can't be placed.

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountService | Get-ServiceFabricPartitionHealth -ReplicasFilter None

PartitionId           : 875a1caa-d79f-43bd-ac9d-43ee89a9891c
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', ConsiderWarningAsError=false.

ReplicaHealthStates   : None
HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Warning
                        SequenceNumber        : 37
                        SentAt                : 4/24/2015 6:13:12 PM
                        ReceivedAt            : 4/24/2015 6:13:31 PM
                        TTL                   : Infinite
                        Description           : Partition is below target replica or instance count.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Ok->Warning = 4/24/2015 6:13:31 PM

PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountService

PartitionId            : 875a1caa-d79f-43bd-ac9d-43ee89a9891c
PartitionKind          : Int64Range
PartitionLowKey        : 1
PartitionHighKey       : 26
PartitionStatus        : Ready
LastQuorumLossDuration : 00:00:00
MinReplicaSetSize      : 2
TargetReplicaSetSize   : 7
HealthState            : Warning
DataLossNumber         : 130743727710830900
ConfigurationNumber    : 8589934592


PS C:\> @(Get-ServiceFabricNode).Count
5
```

### Replica constraint violation
**System.PLB** reports a warning if it detects a replica constraint violation and can't place replicas of the partition.

- **SourceId**: System.PLB
- **Property**: Starts with **ReplicaConstraintViolation**

## Replica system health reports
**System.RA**, which represents the reconfiguration agent component, is the authority for the replica state.

### State
**System.RA** reports as OK when the replica has been created.

- **SourceId**: System.RA
- **Property**: State

The following shows a healthy replica:

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountService | Get-ServiceFabricReplica | where {$_.ReplicaRole -eq "Primary"} | Get-ServiceFabricReplicaHealth
PartitionId           : 875a1caa-d79f-43bd-ac9d-43ee89a9891c
ReplicaId             : 130743727717237310
AggregatedHealthState : Ok
HealthEvents          :
                        SourceId              : System.RA
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 130743727718018580
                        SentAt                : 4/24/2015 6:12:51 PM
                        ReceivedAt            : 4/24/2015 6:13:02 PM
                        TTL                   : Infinite
                        Description           : Replica has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 6:13:02 PM
```

### Replica open status
The description of this health report contains the start time (Coordinated Universal Time) when the API call was invoked.

**System.RA** reports a warning if the replica open takes longer than the configured period (default: 30 minutes). If the API impacts service availability, the report is issued much faster (a configurable interval, with a default of 30 seconds). This includes the time taken for the replicator open and the service open. The property changes to OK if the open completes.

- **SourceId**: System.RA
- **Property**: **ReplicaOpenStatus**
- **Next steps**: If the health state is not OK, investigate why the replica open takes longer than expected.

### Slow service API call
**System.RAP** and **System.Replicator** report a warning if a call to the user service code takes longer than the configured time. The warning is cleared when the call completes.

- **SourceId**: System.RAP or System.Replicator
- **Property**: The name of the slow API. The description provides more details about the time the API has been pending.
- **Next steps**: Investigate why the call takes longer than expected.

The following example shows a partition in quorum loss, as well as the investigation steps done to figure out why. One of the replicas has a warning health state, so you get its health. It shows that the service operation takes longer than expected, an event reported by System.RAP. After this information is received, the next step is to look at the service code and investigate there. For this case, the **RunAsync** implementation of the stateful service throws an unhandled exception. Note that the replicas are recycling, so you may not see any replicas in the warning state. You can retry getting the health state and look for any differences in the replica ID. In certain cases, this can give you clues.

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/HelloWorldStatefulApplication/HelloWorldStateful | Get-ServiceFabricPartitionHealth

PartitionId           : 72a0fb3e-53ec-44f2-9983-2f272aca3e38
AggregatedHealthState : Error
UnhealthyEvaluations  :
                        Error event: SourceId='System.FM', Property='State'.

ReplicaHealthStates   :
                        ReplicaId             : 130743748372546446
                        AggregatedHealthState : Ok

                        ReplicaId             : 130743746168084332
                        AggregatedHealthState : Ok

                        ReplicaId             : 130743746195428808
                        AggregatedHealthState : Warning

                        ReplicaId             : 130743746195428807
                        AggregatedHealthState : Ok

HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Error
                        SequenceNumber        : 182
                        SentAt                : 4/24/2015 7:00:17 PM
                        ReceivedAt            : 4/24/2015 7:00:31 PM
                        TTL                   : Infinite
                        Description           : Partition is in quorum loss.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Warning->Error = 4/24/2015 6:51:31 PM

PS C:\> Get-ServiceFabricPartition fabric:/HelloWorldStatefulApplication/HelloWorldStateful

PartitionId            : 72a0fb3e-53ec-44f2-9983-2f272aca3e38
PartitionKind          : Int64Range
PartitionLowKey        : -9223372036854775808
PartitionHighKey       : 9223372036854775807
PartitionStatus        : InQuorumLoss
LastQuorumLossDuration : 00:00:13
MinReplicaSetSize      : 2
TargetReplicaSetSize   : 3
HealthState            : Error
DataLossNumber         : 130743746152927699
ConfigurationNumber    : 227633266688

PS C:\> Get-ServiceFabricReplica 72a0fb3e-53ec-44f2-9983-2f272aca3e38 130743746195428808

ReplicaId           : 130743746195428808
ReplicaAddress      : PartitionId: 72a0fb3e-53ec-44f2-9983-2f272aca3e38, ReplicaId: 130743746195428808
ReplicaRole         : Primary
NodeName            : Node.3
ReplicaStatus       : Ready
LastInBuildDuration : 00:00:01
HealthState         : Warning

PS C:\> Get-ServiceFabricReplicaHealth 72a0fb3e-53ec-44f2-9983-2f272aca3e38 130743746195428808

PartitionId           : 72a0fb3e-53ec-44f2-9983-2f272aca3e38
ReplicaId             : 130743746195428808
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='System.RAP', Property='ServiceOpenOperationDuration', HealthState='Warning', ConsiderWarningAsError=false.

HealthEvents          :
                        SourceId              : System.RA
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 130743756170185892
                        SentAt                : 4/24/2015 7:00:17 PM
                        ReceivedAt            : 4/24/2015 7:00:33 PM
                        TTL                   : Infinite
                        Description           : Replica has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 7:00:33 PM

                        SourceId              : System.RAP
                        Property              : ServiceOpenOperationDuration
                        HealthState           : Warning
                        SequenceNumber        : 130743756399407044
                        SentAt                : 4/24/2015 7:00:39 PM
                        ReceivedAt            : 4/24/2015 7:00:59 PM
                        TTL                   : Infinite
                        Description           : Start Time (UTC): 2015-04-24 19:00:17.019
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Warning = 4/24/2015 7:00:59 PM
```

When you start the faulty application under the debugger, the diagnostic events windows show the exception thrown from RunAsync:

![Visual Studio 2015 diagnostic events: RunAsync failure in fabric:/HelloWorldStatefulApplication.][1]

Visual Studio 2015 diagnostic events: RunAsync failure in **fabric:/HelloWorldStatefulApplication**.

[1]: ./media/service-fabric-understand-and-troubleshoot-with-system-health-reports/servicefabric-health-vs-runasync-exception.png


### Replication queue full
**System.Replicator** reports a warning if the replication queue is full. On the primary, this usually happens because one or more secondary replicas are slow to acknowledge operations. On the secondary, this usually happens when the service is slow to apply the operations. The warning is cleared when the queue is no longer full.

- **SourceId**: System.Replicator
- **Property**: **PrimaryReplicationQueueStatus** or **SecondaryReplicationQueueStatus**, depending on the replica role

### Slow Naming operations

**System.NamingService** reports health on its primary replica when a Naming operation takes longer than acceptable. Example of Naming operations are [CreateServiceAsync](https://msdn.microsoft.com/library/azure/mt124028.aspx) or [DeleteServiceAsync](https://msdn.microsoft.com/library/azure/mt124029.aspx). More methods can be found under FabricClient, for example under [service management methods](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.servicemanagementclient.aspx) or [property management methods](https://msdn.microsoft.com/library/azure/system.fabric.fabricclient.propertymanagementclient.aspx).

> [AZURE.NOTE] The Naming service resolves service names to a location in the cluster and enables users to manage service names and properties. It is a Service Fabric partitioned persisted service. One of the partition represents the Authority Owner, which contains metadata about all System Fabric names and services. The Service Fabric names are mapped to different partitions, called Name Owner partitions, so the service is extensible. Read more about [Naming service](service-fabric-architecture.md). 

When a Naming operation takes longer than expected, the operation is flagged with a Warning report on the *primary replica of the Naming service partition that serves the operation*. If the operation completes successfully, the Warning is cleared. If the operation completes with an error, the health report includes details about the error.

- **SourceId**: System.NamingService
- **Property**: Starts with prefix **Duration_** and identifies the slow operation and the Service Fabric name on which the operation is applied. For example, if create service at name fabric:/MyApp/MyService takes too long, the property is Duration_AOCreateService.fabric:/MyApp/MyService. AO points to the role of the Naming partition for this name and operation.
- **Next steps**: Check why the Naming operation fails. Each operation can have different root causes. For example, delete service may be stuck on a node because the application host keeps crashing on a node due to a user bug in the service code. 

The following shows a create service operation. The operation took longer than the configured duration. AO retries and sends work to NO. NO completed the last operation with Timeout. In this case, the same replica is primary for both the AO and NO roles.

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

- **SourceId**: System.Hosting
- **Property**: Activation, including the rollout version
- **Next steps**: If the application is unhealthy, investigate why the activation failed.

The following shows successful activation:

```powershell
PS C:\> Get-ServiceFabricDeployedApplicationHealth -NodeName Node.1 -ApplicationName fabric:/WordCount

ApplicationName                    : fabric:/WordCount
NodeName                           : Node.1
AggregatedHealthState              : Ok
DeployedServicePackageHealthStates :
                                     ServiceManifestName   : WordCountServicePkg
                                     NodeName              : Node.1
                                     AggregatedHealthState : Ok

HealthEvents                       :
                                     SourceId              : System.Hosting
                                     Property              : Activation
                                     HealthState           : Ok
                                     SequenceNumber        : 130743727751144415
                                     SentAt                : 4/24/2015 6:12:55 PM
                                     ReceivedAt            : 4/24/2015 6:13:03 PM
                                     TTL                   : Infinite
                                     Description           : The application was activated successfully.
                                     RemoveWhenExpired     : False
                                     IsExpired             : False
                                     Transitions           : ->Ok = 4/24/2015 6:13:03 PM
```

### Download
**System.Hosting** reports an error if the application package download fails.

- **SourceId**: System.Hosting
- **Property**: **Download:*RolloutVersion***
- **Next steps**: Investigate why the download failed on the node.

## DeployedServicePackage system health reports
**System.Hosting** is the authority on deployed entities.

### Service package activation
System.Hosting reports as OK if the service package activation on the node is successful. Otherwise, it reports an error.

- **SourceId**: System.Hosting
- **Property**: Activation
- **Next steps**: Investigate why the activation failed.

### Code package activation
**System.Hosting** reports as OK for each code package if the activation is successful. If the activation fails, it reports a warning as configured. If **CodePackage** fails to activate or terminates with an error greater than the configured **CodePackageHealthErrorThreshold**, hosting reports an error. If a service package contains multiple code packages, an activation report will be generated for each one.

- **SourceId**: System.Hosting
- **Property**: Uses the prefix **CodePackageActivation** and contains the name of the code package and the entry point as **CodePackageActivation:*CodePackageName*:*SetupEntryPoint/EntryPoint*** (for example, **CodePackageActivation:Code:SetupEntryPoint**)

### Service type registration
**System.Hosting** reports as OK if the service type has been registered successfully. It reports an error if the registration wasn't done in time (as configured by using **ServiceTypeRegistrationTimeout**). If the service type is unregistered from the node, this is because the run time has been closed. Hosting reports a warning.

- **SourceId**: System.Hosting
- **Property**: Uses the prefix **ServiceTypeRegistration** and contains the service type name (for example, **ServiceTypeRegistration:FileStoreServiceType**)

The following shows a healthy deployed service package:

```powershell
PS C:\> Get-ServiceFabricDeployedServicePackageHealth -NodeName Node.1 -ApplicationName fabric:/WordCount -ServiceManifestName WordCountServicePkg


ApplicationName       : fabric:/WordCount
ServiceManifestName   : WordCountServicePkg
NodeName              : Node.1
AggregatedHealthState : Ok
HealthEvents          :
                        SourceId              : System.Hosting
                        Property              : Activation
                        HealthState           : Ok
                        SequenceNumber        : 130743727751456915
                        SentAt                : 4/24/2015 6:12:55 PM
                        ReceivedAt            : 4/24/2015 6:13:03 PM
                        TTL                   : Infinite
                        Description           : The ServicePackage was activated successfully.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 6:13:03 PM

                        SourceId              : System.Hosting
                        Property              : CodePackageActivation:Code:EntryPoint
                        HealthState           : Ok
                        SequenceNumber        : 130743727751613185
                        SentAt                : 4/24/2015 6:12:55 PM
                        ReceivedAt            : 4/24/2015 6:13:03 PM
                        TTL                   : Infinite
                        Description           : The CodePackage was activated successfully.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 6:13:03 PM

                        SourceId              : System.Hosting
                        Property              : ServiceTypeRegistration:WordCountServiceType
                        HealthState           : Ok
                        SequenceNumber        : 130743727753644473
                        SentAt                : 4/24/2015 6:12:55 PM
                        ReceivedAt            : 4/24/2015 6:13:03 PM
                        TTL                   : Infinite
                        Description           : The ServiceType was registered successfully.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/24/2015 6:13:03 PM
```

### Download
**System.Hosting** reports an error if the service package download fails.

- **SourceId**: System.Hosting
- **Property**: **Download:*RolloutVersion***
- **Next steps**: Investigate why the download failed on the node.

### Upgrade validation
**System.Hosting** reports an error if validation during the upgrade fails or if the upgrade fails on the node.

- **SourceId**: System.Hosting
- **Property**: Uses the prefix **FabricUpgradeValidation** and contains the upgrade version
- **Description**: Points to the error encountered

## Next steps
[View Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)

[How to report and check service health](service-fabric-diagnostics-how-to-report-and-check-service-health.md)

[Monitor and diagnose services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric application upgrade](service-fabric-application-upgrade.md)
