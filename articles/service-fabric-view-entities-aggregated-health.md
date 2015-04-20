<properties
   pageTitle="View Service Fabric entities aggregated health"
   description="Describes how to query, view and evaluate the Azure Service Fabric health entities"
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
   ms.date="04/15/2015"
   ms.author="oanapl"/>

# View Azure Service Fabric entities aggregated health
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) comprised of health entities on which System components and watchdogs can report local conditions they are monitoring. The [Health Store](service-fabric-health-introduction.md#Health-store) aggregates all health data to determine whether entities are healthy.

Out of the box, the cluster is populated with health reports sent by the System components. Read more at [Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md).

Service Fabric provides multiple ways to get the entities aggregated health:
- Health queries (through Powerhsell/API/REST),
- General queries (through Powershell/API/REST) and
- [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) or other visualization tools.

To demonstrate these options, let's use a local cluster with **5 nodes**. Next to fabric:/System application (which exists out of the box), there are some other applications deployed, one of which is **fabric:/WordCount**. This application contains a stateful service configured with  with 7 replicas. Since there are only 5 nodes, system components will flag that the partition is below target count with an Warning.

```xml
<Service Name="WordCount.Service">
  <StatefulService ServiceTypeName="WordCount.Service" MinReplicaSetSize="2" TargetReplicaSetSize="7">
    <UniformInt64Partition PartitionCount="1" LowKey="1" HighKey="26" />
  </StatefulService>
</Service>
```

## Service Fabric Explorer
Service Fabric Explorer provides a visual view of the cluster. In the picture below, the fabric:/WordCount application is "red" (at Error) because it has an error event reported on it for property Availability from watchdog MyWatchdog. One of its services is "yellow" (at Warning) because it is configured with 7 replicas, which can't all be placed (since we only have 5 nodes). The partition has an Warning event, which makes the service "yellow".
The cluster is "red" because of the "red" application.
The evaluation uses default policies from cluster manifest and application manifest, which are the strict policies (do not tolerate any failure).

![View of the cluster with ServiceFabricExplorer.][1] View of the cluster with ServiceFabricExplorer.
[1]: ./media/service-fabric-health\servicefabric-explorer-cluster-health.png

> [AZURE.NOTE] Read more about [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

## Health queries
Service Fabric exposes health queries for each of the supported [entity types](service-fabric-health-introduction.md#Health-Entities-and-Hierarchy). They can be accessed trough API (methods on FabricClient.HealthClient), Powershell cmdlets and REST.
These queries return complete health information about the entity, including aggregated health state, health events reported on the entity, children health states (where applicable) and unhealthy evaluations in case the entity is not healthy.

> [AZURE.NOTE] A health entity is returned to the user when it is completely populated in the Health Store: the entity has a System report, it's active and parent entities on the hierarchy chain have System reports. If any of these conditions is not satisfied, the health queries return an exception showing why the entity is not returned.

The health queries require passing in the entity identifier, which depends on the entity type. They accept optional health policy parameters. If not specified, the [health policies](service-fabric-health-introduction.md#health-policies) from cluster or application manifest are used for evaluation. They also accept filters for returning only partial children or events, the ones that respect the specified filters.

> [AZURE.NOTE] The output filters are applied on the server side, so the message reply size is reduced. It is recommended to use the filters to limit the data returned rather than apply filters on the client side.

An entity health contains the following information:
- The aggregated health state of the entity. This is computed by the Health Store based on entity health reports, children health states (when applicable) and health policies. Read more about [Entity health evaluation](service-fabric-health-introduction.md#entity-health-evaluation).  
- The health events on the entity.
- For the entities that can have children, collection of health states for all children. The health states contain the entity identifier and its aggregated health state. To get complete health for a child, call the query health for the entity type, passing in the child identifier.
- If the entity is not healthy, the unhealthy evaluations which point to the report that triggered the state of the entity.

### Get Cluster Health
Returns the health of the cluster entity. Contains the health states of applications and the nodes children of the cluster.
Input:
- [optional] Application health policy map with health policies used to override the application manifest policies.
- [optional] Filter to return only events, nodes, applications with certain health state (eg. return only errors or warning or errors etc).

#### API
To get cluster health through API, create a FabricClient and call GetClusterHealthAsync method on its HealthClient.

#### Powershell
The cmdlet to get cluster health is Get-ServiceFabricClusterHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet.
State of the cluster: 5 nodes, System application and fabric:/WordCount configured as above.

The following cmdlet gets cluster health with default health policies. The aggregated health state is Warning, because the fabric:/WordCount application is in Warning. Note how the unhealthy evaluations show with details the condition that triggered the aggregated health.

```xml
PS C:\> Get-ServiceFabricClusterHealth

AggregatedHealthState   : Warning
UnhealthyEvaluations    :
                          Unhealthy applications: 50% (1/2), MaxPercentUnhealthyApplications=0%.

                          Unhealthy application: ApplicationName='fabric:/WordCount', AggregatedHealthState='Warning'.

                              Unhealthy services: 100% (1/1), ServiceType='WordCount.Service', MaxPercentUnhealthyServices=0%.

                              Unhealthy service: ServiceName='fabric:/WordCount/WordCount.Service', AggregatedHealthState='Warning'.

                                  Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                                  Unhealthy partition: PartitionId='889909a3-04d6-4a01-97c1-3e9851d77d6c', AggregatedHealthState='Warning'.

                                      Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', ConsiderWarningAsError=false.


NodeHealthStates        :
                          NodeName              : Node.4
                          AggregatedHealthState : Ok

                          NodeName              : Node.2
                          AggregatedHealthState : Ok

                          NodeName              : Node.1
                          AggregatedHealthState : Ok

                          NodeName              : Node.5
                          AggregatedHealthState : Ok

                          NodeName              : Node.3
                          AggregatedHealthState : Ok

ApplicationHealthStates :
                          ApplicationName       : fabric:/CalculatorActor
                          AggregatedHealthState : Ok

                          ApplicationName       : fabric:/System
                          AggregatedHealthState : Ok

                          ApplicationName       : fabric:/WordCount
                          AggregatedHealthState : Warning

HealthEvents            : None
```

The following Powershell cmdlet gets the health of the cluster with custom application policy. It filters results to get only Error or Warning applications and nodes. As a result,  no nodes will be returned as they are all healthy. Only fabric:/WordCount application respects the applications filter. Because the custom policy specifies to consider warning as error for the fabric:/WordCount application, the application is evaluated at Error, and so is the cluster.

```powershell
PS c:\> $appHealthPolicy = New-Object -TypeName System.Fabric.Health.ApplicationHealthPolicy
$appHealthPolicy.ConsiderWarningAsError = $true
$appHealthPolicyMap = New-Object -TypeName System.Fabric.Health.ApplicationHealthPolicyMap
$appUri1 = New-Object -TypeName System.Uri -ArgumentList "fabric:/WordCount"
$appHealthPolicyMap.Add($appUri1, $appHealthPolicy)
$warningAndErrorFilter = [System.Fabric.Health.HealthStateFilter]::Warning.value__  + [System.Fabric.Health.HealthStateFilter]::Error.value__
Get-ServiceFabricClusterHealth -ApplicationHealthPolicyMap $appHealthPolicyMap -ApplicationsHealthStateFilter $warningAndErrorFilter -NodesHealthStateFilter $warningAndErrorFilter

AggregatedHealthState   : Error
UnhealthyEvaluations    :
                          Unhealthy applications: 50% (1/2), MaxPercentUnhealthyApplications=0%.

                          Unhealthy application: ApplicationName='fabric:/WordCount', AggregatedHealthState='Error'.

                              Unhealthy services: 100% (1/1), ServiceType='WordCount.Service', MaxPercentUnhealthyServices=0%.

                              Unhealthy service: ServiceName='fabric:/WordCount/WordCount.Service', AggregatedHealthState='Error'.

                                  Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                                  Unhealthy partition: PartitionId='889909a3-04d6-4a01-97c1-3e9851d77d6c', AggregatedHealthState='Error'.

                                      Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', ConsiderWarningAsError=true.


NodeHealthStates        : None
ApplicationHealthStates :
                          ApplicationName       : fabric:/WordCount
                          AggregatedHealthState : Error

HealthEvents            : None

```

### Get Application Health
#### API
To get an application health through API, create a FabricClient and call GetApplicationHealthAsync method on its HealthClient.

#### Powershell
The cmdlet to get application health is Get-ServiceFabricApplicationHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet.

The following cmdlet returns the health of the fabric:/WordCount application.

```powershell
PS c:\> Get-ServiceFabricApplicationHealth fabric:/WordCount

ApplicationName                 : fabric:/WordCount
AggregatedHealthState           : Warning
UnhealthyEvaluations            :
                                  Unhealthy services: 100% (1/1), ServiceType='WordCount.Service',
                                  MaxPercentUnhealthyServices=0%.

                                  Unhealthy service: ServiceName='fabric:/WordCount/WordCount.Service',
                                  AggregatedHealthState='Warning'.

                                      Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                                      Unhealthy partition: PartitionId='325da69f-16d4-4418-9c30-1feaa40a072c',
                                  AggregatedHealthState='Warning'.

                                          Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning',
                                  ConsiderWarningAsError=false.

ServiceHealthStates             :
                                  ServiceName           : fabric:/WordCount/WordCount.WebService
                                  AggregatedHealthState : Ok

                                  ServiceName           : fabric:/WordCount/WordCount.Service
                                  AggregatedHealthState : Warning

DeployedApplicationHealthStates :
                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.2
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.5
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.4
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.1
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.3
                                  AggregatedHealthState : Ok

HealthEvents                    :
                                  SourceId              : System.CM
                                  Property              : State
                                  HealthState           : Ok
                                  SequenceNumber        : 2456
                                  SentAt                : 4/20/2015 9:57:06 PM
                                  ReceivedAt            : 4/20/2015 9:57:06 PM
                                  TTL                   : Infinite
                                  Description           : Application has been created.
                                  RemoveWhenExpired     : False
                                  IsExpired             : False
                                  Transitions           : ->Ok = 4/20/2015 9:57:06 PM
```

The following Powershell passes in custom policy and filters children and events.

```powershell
PS C:\> $errorFilter = [System.Fabric.Health.HealthStateFilter]::Error.value__
Get-ServiceFabricApplicationHealth -ApplicationName fabric:/WordCount -ConsiderWarningAsError $true -ServicesHealthStateFilter $errorFilter -EventsHealthStateFilter $errorFilter -DeployedApplicationsHealthStateFilter $errorFilter

ApplicationName                 : fabric:/WordCount
AggregatedHealthState           : Error
UnhealthyEvaluations            :
                                  Unhealthy services: 100% (1/1), ServiceType='WordCount.Service', MaxPercentUnhealthyServices=0%.

                                  Unhealthy service: ServiceName='fabric:/WordCount/WordCount.Service', AggregatedHealthState='Error'.

                                      Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                                      Unhealthy partition: PartitionId='8f82daff-eb68-4fd9-b631-7a37629e08c0', AggregatedHealthState='Error'.

                                          Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', ConsiderWarningAsError=true.

ServiceHealthStates             :
                                  ServiceName           : fabric:/WordCount/WordCount.Service
                                  AggregatedHealthState : Error

DeployedApplicationHealthStates : None
HealthEvents                    : None

```

### Get Service Health
#### API
To get service health through API, create a FabricClient and call GetServiceHealthAsync method on its HealthClient.

#### Powershell
The cmdlet to get service health is Get-ServiceFabricServiceHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet.

The following cmdlet gets the service health using default health policies.

```powershell
PS C:\> Get-ServiceFabricServiceHealth -ServiceName fabric:/WordCount/WordCount.Service


ServiceName           : fabric:/WordCount/WordCount.Service
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                        Unhealthy partition: PartitionId='8f82daff-eb68-4fd9-b631-7a37629e08c0', AggregatedHealthState='Warning'.

                            Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', ConsiderWarningAsError=false.

PartitionHealthStates :
                        PartitionId           : 8f82daff-eb68-4fd9-b631-7a37629e08c0
                        AggregatedHealthState : Warning

HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 3
                        SentAt                : 4/20/2015 10:12:29 PM
                        ReceivedAt            : 4/20/2015 10:12:33 PM
                        TTL                   : Infinite
                        Description           : Service has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/20/2015 10:12:33 PM
```

### Get Partition Health
#### API
To get partition health through API, create a FabricClient and call GetPartitionHealthAsync method on its HealthClient.

#### Powershell
The cmdlet to get partition health is Get-ServiceFabricPartitionHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet.

The following cmdlet gets the health for all partitions of the word count service.

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCount.Service | Get-ServiceFabricPartitionHealth

PartitionId           : 8f82daff-eb68-4fd9-b631-7a37629e08c0
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='System.FM', Property='State', HealthState='Warning', ConsiderWarningAsError=false.

ReplicaHealthStates   :
                        ReplicaId             : 130740415594605870
                        AggregatedHealthState : Ok

                        ReplicaId             : 130740415502123433
                        AggregatedHealthState : Ok

                        ReplicaId             : 130740415594605867
                        AggregatedHealthState : Ok

                        ReplicaId             : 130740415594605869
                        AggregatedHealthState : Ok

                        ReplicaId             : 130740415594605868
                        AggregatedHealthState : Ok

HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Warning
                        SequenceNumber        : 39
                        SentAt                : 4/20/2015 10:12:59 PM
                        ReceivedAt            : 4/20/2015 10:13:03 PM
                        TTL                   : Infinite
                        Description           : Partition is below target replica or instance count.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : Ok->Warning = 4/20/2015 10:13:03 PM
```

### Get Replica Health
#### API
To get replica health through API, create a FabricClient and call GetReplicaHealthAsync method on its HealthClient.

#### Powershell
The cmdlet to get replica health is Get-ServiceFabricReplicaHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet.

The following cmdlet get the health of the primary replica of all partitions of the service.

```powershell
PS C:\> Get-ServiceFabricPartition fabric:/WordCount/WordCount.Service | Get-ServiceFabricReplica | where {$_.ReplicaRole -eq "Primary"} | Get-ServiceFabricReplicaHealth



PartitionId           : 8f82daff-eb68-4fd9-b631-7a37629e08c0
ReplicaId             : 130740415502123433
AggregatedHealthState : Ok
HealthEvents          :
                        SourceId              : System.RA
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 130740415502802942
                        SentAt                : 4/20/2015 10:12:30 PM
                        ReceivedAt            : 4/20/2015 10:12:34 PM
                        TTL                   : Infinite
                        Description           : Replica has been created.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/20/2015 10:12:34 PM
```

### Get DeployedApplication Health
#### API
To get the health on an application deployed on a node through API, create a FabricClient and call GetDeployedApplicationHealthAsync method on its HealthClient.

#### Powershell
The cmdlet to get deployed application health is Get-ServiceFabricDeployedApplicationHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet. To find out where an application is deployed, run Get-ServiceFabricApplicationHealth and look at the deployed application children.

The following cmdlter gets the health of the fabric:/WordCount application deployed on node Node.1.
```powershell
PS C:\> Get-ServiceFabricDeployedApplicationHealth -ApplicationName fabric:/WordCount -NodeName Node.1
ApplicationName                    : fabric:/WordCount
NodeName                           : Node.1
AggregatedHealthState              : Ok
DeployedServicePackageHealthStates :
                                     ServiceManifestName   : WordCount.WebService
                                     NodeName              : Node.1
                                     AggregatedHealthState : Ok

                                     ServiceManifestName   : WordCount.Service
                                     NodeName              : Node.1
                                     AggregatedHealthState : Ok

HealthEvents                       :
                                     SourceId              : System.Hosting
                                     Property              : Activation
                                     HealthState           : Ok
                                     SequenceNumber        : 130740415502842941
                                     SentAt                : 4/20/2015 10:12:30 PM
                                     ReceivedAt            : 4/20/2015 10:12:34 PM
                                     TTL                   : Infinite
                                     Description           : The application was activated successfully.
                                     RemoveWhenExpired     : False
                                     IsExpired             : False
                                     Transitions           : ->Ok = 4/20/2015 10:12:34 PM
```

### Get DeployedServicePackage Health
#### API
To get the health of a deployed service package through API, create a FabricClient and call GetDeployedServicePackageHealthAsync method on its HealthClient.

#### Powershell
The cmdlet to get deployed service package health is Get-ServiceFabricDeployedServicePackageHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet. To see where an aplication is deployed, run Get-ServiceFabricApplicationHealth, look at deployed applications. To see what service packages are in an application, look at the deployed service package children in Get-ServiceFabricDeployedApplicationHealth output.

The following cmdlet gets the health of the WordCount.Service service package of the fabric:/WordCount application deployed on node Node.1. The entity has System.Hosting reports for successful service package and entry point activation and successful service type registration.

```powershell
PS C:\> Get-ServiceFabricDeployedApplication -ApplicationName fabric:/WordCount -NodeName Node.1 | Get-ServiceFabricDeployedServicePackageHealth -ServiceManifestName WordCount.Service

ApplicationName       : fabric:/WordCount
ServiceManifestName   : WordCount.Service
NodeName              : Node.1
AggregatedHealthState : Ok
HealthEvents          :
                        SourceId              : System.Hosting
                        Property              : Activation
                        HealthState           : Ok
                        SequenceNumber        : 130740415506383060
                        SentAt                : 4/20/2015 10:12:30 PM
                        ReceivedAt            : 4/20/2015 10:12:34 PM
                        TTL                   : Infinite
                        Description           : The ServicePackage was activated successfully.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/20/2015 10:12:34 PM

                        SourceId              : System.Hosting
                        Property              : CodePackageActivation:Code:EntryPoint
                        HealthState           : Ok
                        SequenceNumber        : 130740415506543054
                        SentAt                : 4/20/2015 10:12:30 PM
                        ReceivedAt            : 4/20/2015 10:12:34 PM
                        TTL                   : Infinite
                        Description           : The CodePackage was activated successfully.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/20/2015 10:12:34 PM

                        SourceId              : System.Hosting
                        Property              : ServiceTypeRegistration:WordCount.Service
                        HealthState           : Ok
                        SequenceNumber        : 130740415520193499
                        SentAt                : 4/20/2015 10:12:32 PM
                        ReceivedAt            : 4/20/2015 10:12:34 PM
                        TTL                   : Infinite
                        Description           : The ServiceType was registered successfully.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/20/2015 10:12:34 PM
```

## General Queries
The general queries return the list of Service Fabric entities of the specified type. They are exposed trough API (methods on FabricClient.QueryClient), Powershell cmdlets and REST. These queries aggregate sub-queries from multiple components. One of them is the [Health Store](service-fabric-health-introduction.md#Health-Store), which populates the aggregated health state for each query result.  

> [AZURE.NOTE] The general queries return the aggregated health state of the entity and do not contain the rich health data. If an entity is not healthy, you can follow up with health queries to get all health information, like events, children health states and unhealthy evaluations.

If the general queries return Unknown health state for an entity, it's possible that the Health Store doesn't have complete data about the entity or the sub-query to the Health Store wasn't successful (eg. communication error, health store was throttled etc). Follow up with a health query for the entity. This may succeed, if the sub-query encountered transient errors (eg. network issues), or will give more details about why the entity is not exposed from Health store.

The queries that contains HealthState for entities are:
- Application list. Returns the list of applications in the cluster. Powershell: Get-ServiceFabricApplication.
- Service list. Returns the list of services in an application. Powershell: Get-ServiceFabricService.
- Partition list. Returns the list of partitions in a service. Powershell: Get-ServiceFabricPartition.
- Replica list. Returns the list of replicas in a partition. Powershell: Get-ServiceFabricReplica.
- Deployed application list. Returns the list of deployed applications on a node. Powershell: Get-ServiceFabricDeployedApplication.
- Deployed service package list. Returns the list of service packaged in a deployed application. Powershell: Get-ServiceFabricDeployedApplication.

### Examples
The following cmdlet gets application details for fabric:/WordCount application. Notice that health state is Warning.
```
PS C:\> Get-ServiceFabricApplication -ApplicationName fabric:/WordCount

ApplicationName        : fabric:/WordCount
ApplicationTypeName    : WordCount
ApplicationTypeVersion : 1.0.0.0
ApplicationStatus      : Ready
HealthState            : Warning
ApplicationParameters  : { "_WFDebugParams_" = "[{"ServiceManifestName":"WordCount.WebService","CodePackageName":"Code","EntryPointType":"Main"}]" }
```

The following cmdlet gets the services with health state Warning.

```powershell
PS C:\> Get-ServiceFabricApplication | Get-ServiceFabricService | where {$_.HealthState -eq "Warning"}

ServiceName            : fabric:/WordCount/WordCount.Service
ServiceKind            : Stateful
ServiceTypeName        : WordCount.Service
IsServiceGroup         : False
ServiceManifestVersion : 1.0
HasPersistedState      : True
ServiceStatus          : Active
HealthState            : Warning
```

## Cluster and Application upgrade
During cluster and application monitored upgrade, Service Fabric checks health to ensure everything is and remains healthy. If something is unhealthy per configured policy, the upgrade is either paused to allow ser interaction or automatically rolled back.

During cluster upgrade, you can get the cluster upgrade status, which will include unhealthy evaluations that point to what is unhealthy in the cluster. If the upgrade is rolled back due to health issues, the upgrade status will keep the last unhealthy reasons so administrators can investigate what went wrong.
During application upgrade, the application upgrade status contains the unhealthy evaluations.

Read more about [Service Fabric Application Upgrade](service-fabric-application-upgrade.md).

## Troubleshoot with Health
Whenever there is an issue in the cluster or in an application, look at the cluster or the application health to pinpoint what is wrong. The unhealthy evaluations will show with details what triggered the current unhealthy state. If needed, drill down into unhealthy children entities to figure out issues.

## Next Steps
[Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

[Report Health on Azure Service Fabric entities](service-fabric-report-health.md)
