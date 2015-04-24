<properties
   pageTitle="How to View Azure Service Fabric entities aggregated health"
   description="Describes how to query, view and evaluate the Azure Service Fabric entities aggregated health, through health queries and general queries."
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

# How to view Service Fabric health reports
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) comprised of health entities on which System components and watchdogs can report local conditions they are monitoring. The [Health Store](service-fabric-health-introduction.md#health-store) aggregates all health data to determine whether entities are healthy.

Out of the box, the cluster is populated with health reports sent by the System components. Read more at [Using System health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md).

Service Fabric provides multiple ways to get the entities aggregated health:

- [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) or other visualization tools

- Health queries (through Powerhsell/API/REST)

- General queries that return a list of entities that have health as one of the properties (through Powershell/API/REST)

To demonstrate these options, let's use a local cluster with **5 nodes**. Next to **fabric:/System** application (which exists out of the box), there are some other applications deployed, one of which is **fabric:/WordCount**. This application contains a stateful service configured with 7 replicas. Since there are only 5 nodes, system components will flag that the partition is below target count with an Warning.

```xml
<Service Name="WordCount.Service">
  <StatefulService ServiceTypeName="WordCount.Service" MinReplicaSetSize="2" TargetReplicaSetSize="7">
    <UniformInt64Partition PartitionCount="1" LowKey="1" HighKey="26" />
  </StatefulService>
</Service>
```

## Health in Service Fabric Explorer
Service Fabric Explorer provides a visual view of the cluster. In the picture below, you can see that:

- Application **fabric:/WordCount** is "red" (at Error) because it has an error event reported by MyWatchdog for property Availability.

- One of its services, **fabric:/WordCount/WordCount.Service** is "yellow" (at Warning). As described above, the service is configured with 7 replicas, which can't all be placed (since we only have 5 nodes). Though not shown here, the service partition is "yellow" because of the System report. The "yellow" partition triggers the "yellow" service.

- The **cluster** is "red" because of the "red" application.

The evaluation uses default policies from cluster manifest and application manifest, which are the strict policies (do not tolerate any failure).

![View of the cluster with ServiceFabricExplorer.][1]

View of the cluster with ServiceFabricExplorer.

[1]: ./media/service-fabric-view-entities-aggregated-health/servicefabric-explorer-cluster-health.png


> [AZURE.NOTE] Read more about [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

## Health queries
Service Fabric exposes health queries for each of the supported [entity types](service-fabric-health-introduction.md#health-entities-and-hierarchy). They can be accessed trough API (methods on FabricClient.HealthManager), Powershell cmdlets and REST. These queries return complete health information about the entity, including aggregated health state, health events reported on the entity, children health states (when applicable) and unhealthy evaluations when the entity is not healthy.

> [AZURE.NOTE] A health entity is returned to the user when it is completely populated in the Health Store: the entity has a System report, it's active (not deleted) and parent entities on the hierarchy chain have System reports. If any of these conditions is not satisfied, the health queries return an exception showing why the entity is not returned.

The health queries require passing in the entity identifier, which depends on the entity type. They accept optional health policy parameters. If not specified, the [health policies](service-fabric-health-introduction.md#health-policies) from cluster or application manifest are used for evaluation. They also accept filters for returning only partial children or events, the ones that respect the specified filters.

> [AZURE.NOTE] The output filters are applied on the server side, so the message reply size is reduced. It is recommended to use the filters to limit the data returned rather than apply filters on the client side.

An entity health contains the following information:

- The aggregated health state of the entity. This is computed by the Health Store based on entity health reports, children health states (when applicable) and health policies. Read more about [Entity health evaluation](service-fabric-health-introduction.md#entity-health-evaluation).  

- The health events on the entity.

- For the entities that can have children, collection of health states for all children. The health states contain the entity identifier and the aggregated health state. To get complete health for a child, call the query health for the child entity type, passing in the child identifier.

- If the entity is not healthy, the unhealthy evaluations which point to the report that triggered the state of the entity.

## Get cluster health
Returns the health of the cluster entity. Contains the health states of applications and nodes (children of the cluster). Input:

- [optional] Application health policy map with health policies used to override the application manifest policies.

- [optional] Filter to return only events, nodes, applications with certain health state (eg. return only errors or warning or errors etc).

### API
To get cluster health, create a FabricClient and call GetClusterHealthAsync method on its HealthManager.

The following gets cluster health:

```csharp
ClusterHealth clusterHealth = fabricClient.HealthManager.GetClusterHealthAsync().Result;
```

The following gets cluster health using custom cluster health policy and filters for nodes and applications. Note that it creates System.Fabric.Description.ClusterHealthQueryDescription that contains all the input data.

```csharp
var policy = new ClusterHealthPolicy()
{
    MaxPercentUnhealthyNodes = 20
};
var nodesFilter = new NodeHealthStatesFilter()
{
    HealthStateFilter = (long)(HealthStateFilter.Error | HealthStateFilter.Warning)
};
var applicationsFilter = new ApplicationHealthStatesFilter()
{
    HealthStateFilter = (long)HealthStateFilter.Error
};
var queryDescription = new ClusterHealthQueryDescription()
{
    HealthPolicy = policy,
    ApplicationsFilter = applicationsFilter,
    NodesFilter = nodesFilter,
};
ClusterHealth clusterHealth = fabricClient.HealthManager.GetClusterHealthAsync(queryDescription).Result;
```

### Powershell
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

The following Powershell cmdlet gets the health of the cluster with custom application policy. It filters results to get only Error or Warning applications and nodes. As a result, no nodes will be returned as they are all healthy. Only fabric:/WordCount application respects the applications filter. Because the custom policy specifies to consider warning as error for the fabric:/WordCount application, the application is evaluated at Error, and so is the cluster.

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

## Get node health
Returns the health of a node entity. Contains the health events reported on the node. Input:

- [required] The node name which identifies the node.

- [optional] Cluster health policy settings used to evaluate health.

- [optional] Filter to return only events with certain health state (eg. return only errors or warning or errors etc).

### API
To get node health through API, create a FabricClient and call GetNodeHealthAsync method on its HealthManager.

The following gets the node health for the specified node name.

```csharp
NodeHealth nodeHealth = fabricClient.HealthManager.GetNodeHealthAsync(nodeName).Result;
```

The following gets the node health for the specified node name, passing in events filter and custom policy through System.Fabric.Description.NodeHealthQueryDescription.

```csharp
var queryDescription = new NodeHealthQueryDescription(nodeName)
{
    HealthPolicy = new ClusterHealthPolicy() {  ConsiderWarningAsError = true },
    EventsFilter = new HealthEventsFilter() { HealthStateFilter = (long)HealthStateFilter.Warning },
};

NodeHealth nodeHealth = fabricClient.HealthManager.GetNodeHealthAsync(queryDescription).Result;
```

### Powershell
The cmdlet to get node health is Get-ServiceFabricNodeHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet.
The following cmdlet gets node health with default health policies.

```powershell
PS C:\> Get-ServiceFabricNodeHealth -NodeName Node.1

NodeName              : Node.1
AggregatedHealthState : Ok
HealthEvents          :
                        SourceId              : System.FM
                        Property              : State
                        HealthState           : Ok
                        SequenceNumber        : 5
                        SentAt                : 4/21/2015 8:01:17 AM
                        ReceivedAt            : 4/21/2015 8:02:12 AM
                        TTL                   : Infinite
                        Description           : Fabric node is up.
                        RemoveWhenExpired     : False
                        IsExpired             : False
                        Transitions           : ->Ok = 4/21/2015 8:02:12 AM
```

The following cmdlet gets the health of all nodes in the cluster.

```powershell
PS C:\> Get-ServiceFabricNode | Get-ServiceFabricNodeHealth | select NodeName, AggregatedHealthState | ft -AutoSize

NodeName AggregatedHealthState
-------- ---------------------
Node.4                      Ok
Node.2                      Ok
Node.1                      Ok
Node.5                      Ok
Node.3                      Ok
```

## Get application health
Returns the health of an application entity. Contains the health states of deployed application and service children. Input:

- [required] Application name (Uri) which identifies the application

- [optional] Application health policy used to override the application manifest policies.

- [optional] Filter to return only events, services, deployed applications with certain health state (eg. return only errors or warning or errors etc).

### API
To get application health, create a FabricClient and call GetApplicationHealthAsync method on its HealthManager.

The following gets the application health for the specified application name Uri.

```csharp
ApplicationHealth applicationHealth = fabricClient.HealthManager.GetApplicationHealthAsync(applicationName).Result;
```

The following gets the application health for the specified application name Uri, specifying filters and custom policy through System.Fabric.Description.ApplicationHealthQueryDescription.

```csharp
HealthStateFilter warningAndErrors = HealthStateFilter.Error | HealthStateFilter.Warning;
var serviceTypePolicy = new ServiceTypeHealthPolicy()
{
    MaxPercentUnhealthyPartitionsPerService = 0,
    MaxPercentUnhealthyReplicasPerPartition = 5,
    MaxPercentUnhealthyServices = 0,
};
var policy = new ApplicationHealthPolicy()
{
    ConsiderWarningAsError = false,
    DefaultServiceTypeHealthPolicy = serviceTypePolicy,
    MaxPercentUnhealthyDeployedApplications = 0,
};

var queryDescription = new ApplicationHealthQueryDescription(applicationName)
{
    HealthPolicy = policy,
    EventsFilter = new HealthEventsFilter() { HealthStateFilter = (long)warningAndErrors },
    ServicesFilter = new ServiceHealthStatesFilter() { HealthStateFilter = (long)warningAndErrors },
    DeployedApplicationsFilter = new DeployedApplicationHealthStatesFilter() { HealthStateFilter = (long)warningAndErrors },
};

ApplicationHealth applicationHealth = fabricClient.HealthManager.GetApplicationHealthAsync(queryDescription).Result;
```

### Powershell
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

## Get service health
Returns the health of a service entity. Contains the partition health states. Input:

- [required] Service name (Uri) which identifies the service
- [optional] Application health policy used to override the application manifest policy.
- [optional] Filter to return only events andpartitions with certain health state (eg. return only errors or warning or errors etc).

### API
To get service health through API, create a FabricClient and call GetServiceHealthAsync method on its HealthManager.

The following example get the health of a service with specified service name (Uri):

```charp
ServiceHealth serviceHealth = fabricClient.HealthManager.GetServiceHealthAsync(serviceName).Result;
```

The following gets the service health for the specified service name Uri, specifying filters and custom policy through System.Fabric.Description.ServiceHealthQueryDescription.

```csharp
var queryDescription = new ServiceHealthQueryDescription(serviceName)
{
    EventsFilter = new HealthEventsFilter() { HealthStateFilter = (long)HealthStateFilter.All },
    PartitionsFilter = new PartitionHealthStatesFilter() { HealthStateFilter = (long)HealthStateFilter.Error },
};

ServiceHealth serviceHealth = fabricClient.HealthManager.GetServiceHealthAsync(queryDescription).Result;
```

### Powershell
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

## Get partition health
Returns the health of a partition entity. Contains the replica health states. Input:

- [required] Partition id (Guid) which identifies the partition

- [optional] Application health policy used to override the application manifest policy.

- [optional] Filter to return only events, replicas with certain health state (eg. return only errors or warning or errors etc).

### API
To get partition health through API, create a FabricClient and call GetPartitionHealthAsync method on its HealthManager. To specify optional parameters, create System.Fabric.Description.PartitionHealthQueryDescription.

```csharp
PartitionHealth partitionHealth = fabricClient.HealthManager.GetPartitionHealthAsync(partitionId).Result;
```

### Powershell
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

## Get replica health
Returns the health of a replica.Input:

- [required] Partition id (Guid) and replica id which identify the replica

- [optional] Application health policy parameters used to override the application manifest policies.

- [optional] Filter to return only events with certain health state (eg. return only errors or warning or errors etc).

### API
To get replica health through API, create a FabricClient and call GetReplicaHealthAsync method on its HealthManager. Specify advanced parameters with System.Fabric.Description.ReplicaHealthQueryDescription.

```csharp
ReplicaHealth replicaHealth = fabricClient.HealthManager.GetReplicaHealthAsync(partitionId, replicaId).Result;
```

### Powershell
The cmdlet to get replica health is Get-ServiceFabricReplicaHealth. First connect to the cluster with Connect-ServiceFabricCluster cmdlet.

The following cmdlet gets the health of the primary replica for all partitions of the service.

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

## Get deployed application health
Returns the health of an application deployed on a node entity. Contains the deployed service package health states. Input:

- [required] Application name (Uri) and node name (string) which identify the deployed application

- [optional] Application health policy used to override the application manifest policies.

- [optional] Filter to return only events, deployed service packages with certain health state (eg. return only errors or warning or errors etc).

### API
To get the health on an application deployed on a node through API, create a FabricClient and call GetDeployedApplicationHealthAsync method on its HealthManager. To specify optional parameters, use System.Fabric.Description.DeployedApplicationHealthQueryDescription.

```csharp
DeployedApplicationHealth health = fabricClient.HealthManager.GetDeployedApplicationHealthAsync(
    new DeployedApplicationHealthQueryDescription(applicationName, nodeName)).Result;
```

### Powershell
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

## Get deployed service package health
Returns the health of a deployed service package entity. Input:

- [required] Application name (Uri), node name (string) and service manifest name (string) which identify the deployed service package

- [optional] Application health policy used to override the application manifest policy.

- [optional] Filter to return only events with certain health state (eg. return only errors or warning or errors etc).

### API
To get the health of a deployed service package through API, create a FabricClient and call GetDeployedServicePackageHealthAsync method on its HealthManager.

```csharp
DeployedServicePackageHealth health = fabricClient.HealthManager.GetDeployedServicePackageHealthAsync(
    new DeployedServicePackageHealthQueryDescription(applicationName, nodeName, serviceManifestName)).Result;
```

### Powershell
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
The general queries return the list of Service Fabric entities of the specified type. They are exposed through API (methods on FabricClient.QueryManager), Powershell cmdlets and REST. These queries aggregate sub-queries from multiple components. One of them is the [Health Store](service-fabric-health-introduction.md#health-store), which populates the aggregated health state for each query result.  

> [AZURE.NOTE] The general queries return the aggregated health state of the entity and do not contain the rich health data. If an entity is not healthy, you can follow up with health queries to get all health information, like events, children health states and unhealthy evaluations.

If the general queries return Unknown health state for an entity, it's possible that the Health Store doesn't have complete data about the entity or the sub-query to the Health Store wasn't successful (eg. communication error, health store was throttled etc). Follow up with a health query for the entity. This may succeed, if the sub-query encountered transient errors (eg. network issues), or will give more details about why the entity is not exposed from Health store.

The queries that contains HealthState for entities are:

- Node list. Returns the list nodes in the cluster.
  - Api: FabricClient.QueryManager.GetNodeListAsync.
  - Powershell: Get-ServiceFabricNode.
- Application list. Returns the list of applications in the cluster.
  - Api: FabricClient.QueryManager.GetApplicationListAsync.
  - Powershell: Get-ServiceFabricApplication.
- Service list. Returns the list of services in an application.
  - Api: FabricClient.QueryManager.GetServiceListAsync.
  - Powershell: Get-ServiceFabricService.
- Partition list. Returns the list of partitions in a service.
  - Api: FabricClient.QueryManager.GetPartitionListAsync.
  - Powershell: Get-ServiceFabricPartition.
- Replica list. Returns the list of replicas in a partition.
  - Api: FabricClient.QueryManager.GetReplicaListAsync.
  - Powershell: Get-ServiceFabricReplica.
- Deployed application list. Returns the list of deployed applications on a node.
  - Api: FabricClient.QueryManager.GetDeployedApplicationListAsync.
  - Powershell: Get-ServiceFabricDeployedApplication.
- Deployed service package list. Returns the list of service packages in a deployed application.
  - Api: FabricClient.QueryManager.GetDeployedServicePackageListAsync.
  - Powershell: Get-ServiceFabricDeployedApplication.

### Examples

The following gets the unhealthy applications in the cluster:

```csharp
var applications = fabricClient.QueryManager.GetApplicationListAsync().Result.Where(
  app => app.HealthState == HealthState.Error);
```

The following cmdlet gets application details for fabric:/WordCount application. Notice that health state is Warning.

```powershell
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

## Cluster and application upgrade
During cluster and application monitored upgrade, Service Fabric checks health to ensure everything is and remains healthy. If something is unhealthy per configured policy, the upgrade is either paused to allow user interaction or automatically rolled back.

During **cluster** upgrade, you can get the cluster upgrade status, which will include unhealthy evaluations that point to what is unhealthy in the cluster. If the upgrade is rolled back due to health issues, the upgrade status will keep the last unhealthy reasons so administrators can investigate what went wrong.
Similarly, during **application** upgrade, the application upgrade status contains the unhealthy evaluations.

The following shows the application upgrade status for a modified fabric:/WordCount application. A watchdog reported an Error on one of its replica. The upgrade is rolling back because the health checks are not respected.

```powershell
PS C:\> Get-ServiceFabricApplicationUpgrade fabric:/WordCount

ApplicationName               : fabric:/WordCount
ApplicationTypeName           : WordCount
TargetApplicationTypeVersion  : 1.0.0.0
ApplicationParameters         : {}
StartTimestampUtc             : 4/21/2015 5:23:26 PM
FailureTimestampUtc           : 4/21/2015 5:23:37 PM
FailureReason                 : HealthCheck
UpgradeState                  : RollingBackInProgress
UpgradeDuration               : 00:00:23
CurrentUpgradeDomainDuration  : 00:00:00
CurrentUpgradeDomainProgress  : UD1

                                NodeName            : Node1
                                UpgradePhase        : Upgrading

                                NodeName            : Node2
                                UpgradePhase        : Upgrading

                                NodeName            : Node3
                                UpgradePhase        : PreUpgradeSafetyCheck
                                PendingSafetyChecks :
                                EnsurePartitionQuorum - PartitionId: 30db5be6-4e20-4698-8185-4bd7ca744020
NextUpgradeDomain             : UD2
UpgradeDomainsStatus          : { "UD1" = "Completed";
                                "UD2" = "Pending";
                                "UD3" = "Pending";
                                "UD4" = "Pending" }
UnhealthyEvaluations          :
                                Unhealthy services: 100% (1/1), ServiceType='WordCount.Service', MaxPercentUnhealthyServices=0%.

                                Unhealthy service: ServiceName='fabric:/WordCount/WordCount.Service', AggregatedHealthState='Error'.

                                Unhealthy partitions: 100% (1/1), MaxPercentUnhealthyPartitionsPerService=0%.

                                Unhealthy partition: PartitionId='30db5be6-4e20-4698-8185-4bd7ca744020', AggregatedHealthState='Error'.

                                Unhealthy replicas: 16% (1/6), MaxPercentUnhealthyReplicasPerPartition=0%.

                                Unhealthy replica: PartitionId='30db5be6-4e20-4698-8185-4bd7ca744020', ReplicaOrInstanceId='130741105362491906', AggregatedHealthState='Error'.

                                Error event: SourceId='DiskWatcher', Property='Disk'.

UpgradeKind                   : Rolling
RollingUpgradeMode            : UnmonitoredAuto
ForceRestart                  : False
UpgradeReplicaSetCheckTimeout : 00:15:00
```

Read more about [Service Fabric Application Upgrade](service-fabric-application-upgrade.md).

## Troubleshoot with Health
Whenever there is an issue in the cluster or an application, look at the cluster or the application health to pinpoint what is wrong. The unhealthy evaluations will show with details what triggered the current unhealthy state. If needed, drill down into unhealthy children entities to figure out issues.

## Next steps
[Using System health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

[Adding custom Service Fabric health reports](service-fabric-report-health.md)

[How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric Application Upgrade](service-fabric-application-upgrade.md)
