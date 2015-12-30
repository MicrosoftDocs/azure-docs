<properties
   pageTitle="How to view Azure Service Fabric entities' aggregated health | Microsoft Azure"
   description="Describes how to query, view, and evaluate Azure Service Fabric entities' aggregated health, through health queries and general queries."
   services="service-fabric"HealthManager
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
   ms.date="10/23/2015"
   ms.author="oanapl"/>

# View Service Fabric health reports
Azure Service Fabric introduces a [health model](service-fabric-health-introduction.md) that comprises health entities on which system components and watchdogs can report local conditions that they are monitoring. The [health store](service-fabric-health-introduction.md#health-store) aggregates all health data to determine whether entities are healthy.

Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Use system health reports to troubleshoot](service-fabric-understand-and-troubleshoot-with-system-health-reports.md).

Service Fabric provides multiple ways to get the aggregated health of the entities:

- [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) or other visualization tools

- Health queries (through PowerShell, the API, or REST)

- General queries that return a list of entities that have health as one of the properties (through PowerShell, the API, or REST)

To demonstrate these options, let's use a local cluster with five nodes. Next to the **fabric:/System** application (which exists out of the box), some other applications are deployed. One of these is **fabric:/WordCount**. This application contains a stateful service configured with seven replicas. Because there are only five nodes, the system components will show a warning that the partition is below the target count.

```xml
<Service Name="WordCount.Service">
  <StatefulService ServiceTypeName="WordCount.Service" MinReplicaSetSize="2" TargetReplicaSetSize="7">
    <UniformInt64Partition PartitionCount="1" LowKey="1" HighKey="26" />
  </StatefulService>
</Service>
```

## Health in Service Fabric Explorer
Service Fabric Explorer provides a visual view of the cluster. In the image below, you can see that:

- The application **fabric:/WordCount** is red (in error) because it has an error event reported by **MyWatchdog** for the property **Availability**.

- One of its services, **fabric:/WordCount/WordCount.Service** is yellow (in warning). As described above, the service is configured with seven replicas, and they can't all be placed (since there are only five nodes). Although it's not shown here, the service partition is yellow because of the system report. The yellow partition triggers the yellow service.

- The cluster is red because of the red application.

The evaluation uses default policies from the cluster manifest and application manifest. They are strict policies and do not tolerate any failure.

View of the cluster with Service Fabric Explorer:

![View of the cluster with Service Fabric Explorer.][1]

[1]: ./media/service-fabric-view-entities-aggregated-health/servicefabric-explorer-cluster-health.png


> [AZURE.NOTE] Read more about [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

## Health queries
Service Fabric exposes health queries for each of the supported [entity types](service-fabric-health-introduction.md#health-entities-and-hierarchy). They can be accessed through the API (the methods can be found on **FabricClient.HealthManager**), PowerShell cmdlets, and REST. These queries return complete health information about the entity, including aggregated health state, health events reported on the entity, child health states (when applicable), and unhealthy evaluations when the entity is not healthy.

> [AZURE.NOTE] A health entity is returned to the user when it is completely populated in the health store. The entity must be active (not deleted) and have a system report. Its parent entities on the hierarchy chain must also have system reports. If any of these conditions is not satisfied, the health queries return an exception that shows why the entity is not returned.

The health queries must pass in the entity identifier, which depends on the entity type. The queries accept optional health policy parameters. If these are not specified, the [health policies](service-fabric-health-introduction.md#health-policies) from the cluster or application manifest are used for evaluation. The queries also accept filters for returning only partial children or events--the ones that respect the specified filters.

> [AZURE.NOTE] The output filters are applied on the server side, so the message reply size is reduced. We recommended that you use the output filters to limit the data returned, rather than apply filters on the client side.

An entity's health contains the following information:

- The aggregated health state of the entity. This is computed by the health store based on entity health reports, child health states (when applicable), and health policies. Read more about [entity health evaluation](service-fabric-health-introduction.md#entity-health-evaluation).  

- The health events on the entity.

- The collection of health states of all children for the entities that can have children. The health states contain entity identifiers and the aggregated health state. To get complete health for a child, call the query health for the child entity type and pass in the child identifier.

- The unhealthy evaluations that point to the report that triggered the state of the entity, if the entity is not healthy.

## Get cluster health
This returns the health of the cluster entity and contains the health states of applications and nodes (children of the cluster). Input:

- [Optional] The application health policy map, with the health policies used to override the application manifest policies.

- [Optional] Filters for events, nodes, and applications that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events, nodes, and applications are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get cluster health, create a **FabricClient** and call the [**GetClusterHealthAsync**](https://msdn.microsoft.com/en-us/library/azure/system.fabric.fabricclient.healthclient.getclusterhealthasync.aspx) method on its **HealthManager**.

The following gets cluster health:

```csharp
ClusterHealth clusterHealth = fabricClient.HealthManager.GetClusterHealthAsync().Result;
```

The following gets cluster health by using a custom cluster health policy and filters for nodes and applications. Note that it creates **System.Fabric.Description.[ClusterHealthQueryDescription](https://msdn.microsoft.com/en-us/library/azure/system.fabric.description.clusterhealthquerydescription.aspx)**, which contains all of the input data.

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

### PowerShell
The cmdlet to get the cluster health is **[Get-ServiceFabricClusterHealth](https://msdn.microsoft.com/en-us/library/mt125850.aspx)**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet.

The state of the cluster is five nodes, the system application, and fabric:/WordCount configured as above.

The following cmdlet gets cluster health by using default health policies. The aggregated health state is in warning, because the fabric:/WordCount application is in warning. Note how the unhealthy evaluations provide details on the conditions that triggered the aggregated health.

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

The following PowerShell cmdlet gets the health of the cluster by using a custom application policy. It filters results to get only error or warning applications and nodes. As a result, no nodes will be returned, as they are all healthy. Only the fabric:/WordCount application respects the applications filter. Because the custom policy specifies to consider warnings as errors for the fabric:/WordCount application, the application is evaluated as in error, and so is the cluster.

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
This returns the health of a node entity and contains the health events reported on the node. Input:

- [Required] The node name that identifies the node.

- [Optional] The cluster health policy settings used to evaluate health.

- [Optional] Filters for events that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get node health through the API, create a FabricClient and call the **GetNodeHealthAsync** method on its HealthManager.

The following gets the node health for the specified node name:

```csharp
NodeHealth nodeHealth = fabricClient.HealthManager.GetNodeHealthAsync(nodeName).Result;
```

The following gets the node health for the specified node name and passes in an events filter and custom policy through **System.Fabric.Description.[NodeHealthQueryDescription](https://msdn.microsoft.com/en-us/library/azure/system.fabric.description.nodehealthquerydescription.aspx)**:

```csharp
var queryDescription = new NodeHealthQueryDescription(nodeName)
{
    HealthPolicy = new ClusterHealthPolicy() {  ConsiderWarningAsError = true },
    EventsFilter = new HealthEventsFilter() { HealthStateFilter = (long)HealthStateFilter.Warning },
};

NodeHealth nodeHealth = fabricClient.HealthManager.GetNodeHealthAsync(queryDescription).Result;
```

### PowerShell
The cmdlet to get the node health is **Get-ServiceFabricNodeHealth**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet.
The following cmdlet gets the node health by using default health policies:

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

The following cmdlet gets the health of all nodes in the cluster:

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
This returns the health of an application entity. It contains the health states of the deployed application and service children. Input:

- [Required] The application name (URI) that identifies the application.

- [Optional] The application health policy used to override the application manifest policies.

- [Optional] Filters for events, services, and deployed applications that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events, services, and deployed applications are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get application health, create a FabricClient and call the **GetApplicationHealthAsync** method on its HealthManager.

The following gets the application health for the specified application name (URI):

```csharp
ApplicationHealth applicationHealth = fabricClient.HealthManager.GetApplicationHealthAsync(applicationName).Result;
```

The following gets the application health for the specified application name (URI), with filters and custom policies specified via **System.Fabric.Description.ApplicationHealthQueryDescription**.

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

### PowerShell
The cmdlet to get the application health is **Get-ServiceFabricApplicationHealth**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet.

The following cmdlet returns the health of the fabric:/WordCount application:

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

The following PowerShell cmdlet passes in custom policies. It also filters children and events.

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
This returns the health of a service entity. It contains the partition health states. Input:

- [Required] The service name (URI) that identifies the service.
- [Optional] The application health policy used to override the application manifest policy.
- [Optional] Filters for events and partitions that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events and partitions are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get service health through the API, create a FabricClient and call the **GetServiceHealthAsync** method on its HealthManager.

The following example gets the health of a service with specified service name (URI):

```charp
ServiceHealth serviceHealth = fabricClient.HealthManager.GetServiceHealthAsync(serviceName).Result;
```

The following gets the service health for the specified service name (URI), specifying filters and custom policy via System.Fabric.Description.ServiceHealthQueryDescription:

```csharp
var queryDescription = new ServiceHealthQueryDescription(serviceName)
{
    EventsFilter = new HealthEventsFilter() { HealthStateFilter = (long)HealthStateFilter.All },
    PartitionsFilter = new PartitionHealthStatesFilter() { HealthStateFilter = (long)HealthStateFilter.Error },
};

ServiceHealth serviceHealth = fabricClient.HealthManager.GetServiceHealthAsync(queryDescription).Result;
```

### PowerShell
The cmdlet to get the service health is **Get-ServiceFabricServiceHealth**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet.

The following cmdlet gets the service health by using default health policies:

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
This returns the health of a partition entity. It contains the replica health states. Input:

- [Required] The partition ID (GUID) that identifies the partition.

- [Optional] The application health policy used to override the application manifest policy.

- [Optional] Filters for events and replicas that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events and replicas are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get partition health through the API, create a FabricClient and call the **GetPartitionHealthAsync** method on its HealthManager. To specify optional parameters, create **System.Fabric.Description.PartitionHealthQueryDescription**.

```csharp
PartitionHealth partitionHealth = fabricClient.HealthManager.GetPartitionHealthAsync(partitionId).Result;
```

### PowerShell
The cmdlet to get the partition health is **Get-ServiceFabricPartitionHealth**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet.

The following cmdlet gets the health for all partitions of the word-count service:

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
This returns the health of a replica. Input:

- [Required] The partition ID (GUID) and replica ID that identify the replica.

- [Optional] The application health policy parameters used to override the application manifest policies.

- [Optional] Filters for events that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get the replica health through the API, create a FabricClient and call the **GetReplicaHealthAsync** method on its HealthManager. To specify advanced parameters, use **System.Fabric.Description.ReplicaHealthQueryDescription**.

```csharp
ReplicaHealth replicaHealth = fabricClient.HealthManager.GetReplicaHealthAsync(partitionId, replicaId).Result;
```

### PowerShell
The cmdlet to get the replica health is **Get-ServiceFabricReplicaHealth**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet.

The following cmdlet gets the health of the primary replica for all partitions of the service:

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
This returns the health of an application deployed on a node entity. It contains the deployed service package health states. Input:

- [Required] The application name (URI) and node name (string) that identify the deployed application.

- [Optional] The application health policy used to override the application manifest policies.

- [Optional] Filters for events and deployed service packages that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events and deployed service packages are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get the health of an application deployed on a node through the API, create a FabricClient and call the **GetDeployedApplicationHealthAsync** method on its HealthManager. To specify optional parameters, use **System.Fabric.Description.DeployedApplicationHealthQueryDescription**.

```csharp
DeployedApplicationHealth health = fabricClient.HealthManager.GetDeployedApplicationHealthAsync(
    new DeployedApplicationHealthQueryDescription(applicationName, nodeName)).Result;
```

### PowerShell
The cmdlet to get the deployed application health is **Get-ServiceFabricDeployedApplicationHealth**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet. To find out where an application is deployed, run **Get-ServiceFabricApplicationHealth** and look at the deployed application children.

The following cmdlet gets the health of the fabric:/WordCount application deployed on Node.1.

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
This returns the health of a deployed service package entity. Input:

- [Required] The application name (URI), node name (string), and service manifest name (string) that identify the deployed service package.

- [Optional] The application health policy used to override the application manifest policy.

- [Optional] Filters for events that specify which entries are of interest and should be returned in the result (for example, errors only, or both warnings and errors). Note that all events are used to evaluate the entity aggregated health, regardless of the filter.

### API
To get the health of a deployed service package through the API, create a FabricClient and call the **GetDeployedServicePackageHealthAsync** method on its HealthManager.

```csharp
DeployedServicePackageHealth health = fabricClient.HealthManager.GetDeployedServicePackageHealthAsync(
    new DeployedServicePackageHealthQueryDescription(applicationName, nodeName, serviceManifestName)).Result;
```

### PowerShell
The cmdlet to get the deployed service package health is **Get-ServiceFabricDeployedServicePackageHealth**. First, connect to the cluster by using the **Connect-ServiceFabricCluster** cmdlet. To see where an application is deployed, run **Get-ServiceFabricApplicationHealth** and look at the deployed applications. To see which service packages are in an application, look at the deployed service package children in the **Get-ServiceFabricDeployedApplicationHealth** output.

The following cmdlet gets the health of the **WordCount.Service** service package of the fabric:/WordCount application deployed on Node.1. The entity has **System.Hosting** reports for successful service-package and entry-point activation, as well as successful service-type registration.

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

## General queries
General queries return a list of Service Fabric entities of a specified type. They are exposed through the API (via the methods on **FabricClient.QueryManager**), PowerShell cmdlets, and REST. These queries aggregate subqueries from multiple components. One of them is the [health store](service-fabric-health-introduction.md#health-store), which populates the aggregated health state for each query result.  

> [AZURE.NOTE] General queries return the aggregated health state of the entity and do not contain rich health data. If an entity is not healthy, you can follow up with health queries to get all its health information, including events, child health states, and unhealthy evaluations.

If general queries return an unknown health state for an entity, it's possible that the health store doesn't have complete data about the entity. It's also possible that a subquery to the health store wasn't successful (for example, there was a communication error, or the health store was throttled). Follow up with a health query for the entity. If the subquery encountered transient errors, such as network issues, this follow-up query may succeed. It may also give you more details from the health store about why the entity is not exposed.

The queries that contain **HealthState** for entities are:

- Node list: This returns the list nodes in the cluster.
  - API: FabricClient.QueryManager.GetNodeListAsync
  - PowerShell: Get-ServiceFabricNode
- Application list: This returns the list of applications in the cluster.
  - API: FabricClient.QueryManager.GetApplicationListAsync
  - PowerShell: Get-ServiceFabricApplication
- Service list: This returns the list of services in an application.
  - API: FabricClient.QueryManager.GetServiceListAsync
  - PowerShell: Get-ServiceFabricService
- Partition list: This returns the list of partitions in a service.
  - API: FabricClient.QueryManager.GetPartitionListAsync
  - PowerShell: Get-ServiceFabricPartition
- Replica list: This returns the list of replicas in a partition.
  - API: FabricClient.QueryManager.GetReplicaListAsync
  - PowerShell: Get-ServiceFabricReplica
- Deployed application list: This returns the list of deployed applications on a node.
  - API: FabricClient.QueryManager.GetDeployedApplicationListAsync
  - PowerShell: Get-ServiceFabricDeployedApplication
- Deployed service package list: This returns the list of service packages in a deployed application.
  - API: FabricClient.QueryManager.GetDeployedServicePackageListAsync
  - PowerShell: Get-ServiceFabricDeployedApplication

### Examples

The following gets the unhealthy applications in the cluster:

```csharp
var applications = fabricClient.QueryManager.GetApplicationListAsync().Result.Where(
  app => app.HealthState == HealthState.Error);
```

The following cmdlet gets the application details for the fabric:/WordCount application. Notice that health state is at warning.

```powershell
PS C:\> Get-ServiceFabricApplication -ApplicationName fabric:/WordCount

ApplicationName        : fabric:/WordCount
ApplicationTypeName    : WordCount
ApplicationTypeVersion : 1.0.0.0
ApplicationStatus      : Ready
HealthState            : Warning
ApplicationParameters  : { "_WFDebugParams_" = "[{"ServiceManifestName":"WordCount.WebService","CodePackageName":"Code","EntryPointType":"Main"}]" }
```

The following cmdlet gets the services with a health state of warning:

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

## Cluster and application upgrades
During a monitored upgrade of the cluster and application, Service Fabric checks health to ensure that everything remains healthy. If an entity is unhealthy as evaluated by using configured health policies, the upgrade applies upgrade-specific policies to determine the next action. The upgrade may be paused to allow user interaction (such as fixing error conditions or changing policies), or it may automatically roll back to the previous good version.

During a *cluster* upgrade, you can get the cluster upgrade status. This will include any unhealthy evaluations, which point to what is unhealthy in the cluster. If the upgrade is rolled back due to health issues, the upgrade status will keep the last unhealthy reasons. This keeps information that can help administrators investigate what went wrong.

Similarly, during an *application* upgrade, any unhealthy evaluations are contained in the application upgrade status.

The following shows the application upgrade status for a modified fabric:/WordCount application. A watchdog reported an error on one of its replicas. The upgrade is rolling back because the health checks are not respected.

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

Read more about the [Service Fabric application upgrade](service-fabric-application-upgrade.md).

## Use health evaluations to troubleshoot
Whenever there is an issue with the cluster or an application, look at the cluster or application health to pinpoint what is wrong. The unhealthy evaluations will provide details about what triggered the current unhealthy state. If you need to, you can drill down into unhealthy child entities to identify the root cause.

## Next steps
[Use system health reports to troubleshoot](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

[Add custom Service Fabric health reports](service-fabric-report-health.md)

[Monitor and diagnose services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric application upgrade](service-fabric-application-upgrade.md)
