<properties
   pageTitle="Using System health reports for troubleshooting"
   description="Describes the System Health reports and how to use them for troubleshooting cluster or application issues"
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
   ms.date="06/16/2015"
   ms.author="oanapl"/>

# Using System health reports for troubleshooting

Service Fabric components report out of the box on all entities in the cluster. The [Health Store](service-fabric-health-introduction.md#health-store) creates and deletes entities based on the system reports, and organizes them in an hierarchy that captures entity interactions.

> [AZURE.NOTE] Read more about the [Service Fabric Health Model](service-fabric-health-introduction.md) to understand health related concepts.

The System health reports provide visibility into cluster and application functionality and flag issues through health. For application and services, the System health reports verify that entities are implemented and are behaving correctly from Service Fabric perspective. The reports do not provide any health monitoring of the business logic of the service or detection of hung processes. User services can enrich the health data with information specific to their logic.

> [AZURE.NOTE] Watchdogs health reports are only visible **after** the system components create an entity. When an entity is deleted, the Health Store automatically deletes all health reports associated with it. Same when a new instance of the entity is created (eg. a new service replica instance is created): all reports associated with the old instance are deleted and cleaned up from store.

The System components reports are identified by the source, which starts with *"System."* prefix. Watchdogs can't use the same prefix for their sources, as reports will be rejected with invalid parameters.
Let's look at some system reports and understand what triggers them and how to correct possible issues they represent.

> [AZURE.NOTE] Service Fabric continues to add reports for conditions of interest that would improve visibility into what is happening in the cluster/application.

## Cluster System health reports
The cluster health entity is created automatically in the health store, so if everything works properly it doesn't have a system report.

### Neighborhood loss
System.Federation reports an Error when it detects a neighborhood loss. The report is from individual nodes and node id is included in the property name. If there is one neighborhood loss in the entire Service Fabric ring, typically we can expect two events (both sides of the gap will report). If there are more neighborhoods lost, there will be more events.
The report specifies Global Lease timeout as the TTL and the report is re-sent every half of the TTL as long as the condition is still active. The event is automatically removed when expired, so if the reporting node is down, it is still correctly cleaned up from Health Store.

- SourceId: System.Federation
- Property: starts with "Neighborhood" and includes node information.
- Next steps: investigate why the neighborhood is lost. Eg. Check communication between cluster nodes.

## Node System health reports
System.FM, which represents the Failover Manager service, is the authority that manages information about cluster nodes. Any node should have one report from System.FM showing its state. The node entities are removed when the node is disabled.

### Node up/down
System.FM reports Ok when the node joins the ring (it's up and running) and Error when the node departs the ring (it's down, either for upgrading, or simply failed).  The health hierarchy built by the Health Store takes action on deployed entities in correlation with System.FM node reports. It considers node a virtual parent of all deployed entities. The deployed entities on that node are not exposed through queries if the node is down or not reported, or the node has a different instance than the instance associated with the entities. When FM reports the node down or restarted (new instance), the Health Store automatically cleans up the deployed entities that can only exist on the down node or the previous instance of the node.

- SourceId: System.FM
- Property: State
- Next steps: If the node is down for upgrade, it should come up once upgraded, in which case the health state should be switched back to Ok. If the node doesn't come back or it failed, it needs more investigation.

The following shows the System.FM event with health state Ok for node up:

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
System.FabricNode reports Warning when certificates used by the node are close to expiration. There are three certificates per node: Certificate_cluster, Certificate_server and Certificate_default_client.
When the expiration is at least two weeks away, the report type is OK; if the expiration is within two weeks, the report type is Warning. TTL of these events is infinite, they are removed when a node leaves the cluster.

- SourceId: System.FabricNode
- Property: starts with "Certificate" and contains more information about certificate type.
- Next steps: Update the certificates if they are close to expiration.

### Load capacity violation
The Service Fabric load balancer reports Warning if it detects a node capacity violation.

 - SourceId: System.PLB
 - Property: starts with "Capacity".
 - Next steps: Check provided metrics and view the current capacity on the node.

## Application System health reports
System.CM, which represents the Cluster Manager service, is the authority that manages information about application.

### State
System.CM reports Ok when the application is created or updated. It informs the Health Store when the application is deleted, so it can be removed from store.

- SourceId: System.CM
- Property: State
- Next steps: If the application is created, it should have the CM health report. Otherwise, check the state of the application by issuing a query (eg Powershell cmdlet Get-ServiceFabricApplication -ApplicationName <applicationName>).

The following shows the State event on fabric:/WordCount application.

```powershell
PS C:\> Get-ServiceFabricApplicationHealth fabric:/WordCount -ServicesHealthStateFilter ([System.Fabric.Health.HealthStateFilter]::None) -DeployedApplicationsHealthStateFilter ([System.Fabric.Health.HealthStateFilter]::None)

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

## Service System health reports
System.FM, which represents the Failover Manager service, is the authority that manages information about services.

### State
System.FM reports Ok when the service is created. It deletes the entity from Health Store when the service is deleted.

- SourceId: System.FM
- Property: State.

The following shows the State event on the service fabric:/WordCount/WordCountService.

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
System.PLB reports Warning if it was unable to find a placement for one or more of the service replica. The report is removed when expired.

- SourceId: System.FM
- Property: State.
- Next steps: Check the service constraints. Check the current state of the placement.

## Partition System health reports
System.FM, which represents the Failover Manager service, is the authority that manages information about service partitions.

### State
System.FM reports Ok when the partition is created and healthy. It deletes the entity from Health Store when the partition is deleted.
If the partition is below min replica count, it reports Error.
If the partition is not below min replica count, but it is below target replica count, it reports Warning.
If the partition is in quorum loss, FM reports error.
Other important events are: Warning when the reconfiguration takes longer than expected and when the build is taking longer than expected. The expected times for build or reconfiguration are configurable based on service scenarios. Eg. if a service has TB of state, like SQL Azure, the build will take longer than a service with a small amount of state.

- SourceId: System.FM
- Property: State.
- Next steps: if health state is not Ok, it's possible some replicas are not created/opened/promoted to primary or secondary correctly. In many instances, the root cause is a service bug in the open or change role implementation.

The following shows a healthy partition.

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

The following shows the health of a partition that is below target replica count. Next steps: get the partition description, which shows how it was configured: MinReplicaSetSize is 2, TargetReplicaSetSize is 7. Then get the number of nodes in the cluster: 5. So in this case, 2 replicas can't be placed.

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCountService | Get-ServiceFabricPartitionHealth -ReplicasHealthStateFilter ([System.Fabric.Health.HealthStateFilter]::None)

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
System.PLB reports Warning if it detects replica constraint violation and can't place replicas of the partition.

- SourceId: System.PLB
- Property: starts with "ReplicaConstraintViolation".

## Replica System health reports
System.RA, which represents the Reconfiguration Agent component, is the authority for replica state.

### State
System.RA reports Ok when the replica is created.

- SourceId: System.RA
- Property: State.

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
The description of this health report contains the start time (UTC) when the API call was invoked.
System.RA reports Warning if replica open takes longer than the configured period (default: 30 minutes). If the API impacts service availability, the report is issued much faster (configurable interval, default 30 seconds). This time includes time taken for replicator open and service open. The property changes to Ok if open completes.

- SourceId: System.RA
- Property: ReplicaOpenStatus.
- Next steps: If health state is not Ok, check why the replica open takes longer than expected.

### Slow service API call
System.RAP and System.Replicator report Warning if a call into user service code takes longer than configured time. The warning is cleared when the call completes.

- SourceId: System.RAP or System.Replicator
- Property: the name of the slow API. The description gives more detail about the time the API has been pending.
- Next steps: investigate why the call it takes longer than expected.

The following example shows a partition in quorum loss and investigation steps done to figure out why. One of the replicas has Warning health state, so we get its health. It shows that service operation takes longer than expected, event reported by System.RAP. After this information, next step is to look at service code and investigate. For this case, the RunAsync implementation of the stateful service throws an unhandled exception. Note that replicas are recycling, so you may not see any replicas in Warning state. Retry getting the health and look whether there are any differences in replica id, this gives clues in certain cases.

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

When starting the faulty application under debugger, the Diagnostic Events windows show the exception thrown from RunAsync:

![Visual Studio 2015 Diagnostic Events: RunAsync failure in fabric:/HelloWorldStatefulApplication.][1]

Visual Studio 2015 Diagnostic Events: RunAsync failure in fabric:/HelloWorldStatefulApplication.

[1]: ./media/service-fabric-understand-and-troubleshoot-with-system-health-reports/servicefabric-health-vs-runasync-exception.png


### Replication queue full
System.Replicator reports Warning if replication queue is full. On the primary, this usually happens because one or more replicas secondary replicas are slow to ack operations. On secondary, this usually happens when the service is slow to apply the operations. The Warning is cleared when the queue is no longer full.

- SourceId: System.Replicator
- Property: PrimaryReplicationQueueStatus or SecondaryReplicationQueueStatus, depending on the replica role.

## DeployedApplication System health reports
System.Hosting is the authority on deployed entities.

### Activation
System.Hosting reports Ok when an application is successfully activated on the node, Error otherwise.

- SourceId: System.Hosting
- Property: Activation. Includes the rollout version.
- Next steps: If unhealthy, investigate why the activation failed.

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
System.Hosting reports Error is the application package download failed.

- SourceId: System.Hosting
- Property: Download:<RolloutVersion>
- Next steps: Investigate why download failed on the node.

## DeployedServicePackage System health reports
System.Hosting is the authority on deployed entities.

### Service package activation
System.Hosting reports Ok if the service package activation on the node is successful, Error otherwise.

- SourceId: System.Hosting
- Property: Activation.
- Next steps: Investigate why the activation failed.

### Code package activation
System.Hosting reports Ok for each code package if activation is successful. If the activation fails, it reports Warning as configured; if the CodePackage failed to activate or terminated with an error more than the configured 'CodePackageHealthErrorThreshold', Hosting reports Error.
If there are multiple code packages in a service package, there will be an Activation report generated for each one.

- SourceId: System.Hosting
- Property: prefix CodePackageActivation and contains the name of the code package and te entry point. CodePackageActivation:<CodePackageName>:<SetupEntryPoint/EntryPoint>. Eg. CodePackageActivation:Code:SetupEntryPoint.

### Service type registration
System.Hosting reports Ok if the service type was registered successfully. It reports Error if the registration wasn't done in time (configured with ServiceTypeRegistrationTimeout). If the service type is unregistered from the node, because the runtime was closed. Hosting reports Warning.

- SourceId: System.Hosting
- Property: prefix ServiceTypeRegistration and contains the service type name. Eg. "ServiceTypeRegistration:FileStoreServiceType"

The following shows a healthy deployed service package.

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
System.Hosting reports Error is the service package download failed.

- SourceId: System.Hosting
- Property: Download:<RolloutVersion>
- Next steps: Investigate why download failed on the node.

### Upgrade validation
System.Hosting reports Error if validation during upgrade fails or if upgrade fails on the node.

- SourceId: System.Hosting
- Property: prefix FabricUpgradeValidation, contains the upgrade version.
- Description: points to the error encountered.

## Next steps
[How to view Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)

[How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric Application Upgrade](service-fabric-application-upgrade.md)
 