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
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) comprised of health entities on which System components and watchdogs can report local conditions they are monitoring. The [Health Store](service-fabric-health-introduction.md#Health-Store) aggregates all health data to determine whether entities are healthy.

Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md).

Service Fabric allows multiple ways to get the entities aggregated health: issue health queries through Powerhsell/API/REST, issue general queries through Powershell/API/REST and through tools like ServiceFabricExplorer.
I will show each of these using a local cluster with **5 nodes**. Next to fabric:/System application (which exists out of the box), I have deployed **fabric:/WordCount** and **fabric:/CalculatorActor** applications. The word count application contains a stateful service configured with  with 7 replicas. Since there are only 5 nodes, system components will flag that the partition is below target count with an Warning.

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

## Health queries
Service Fabric exposes health queries for each of the supported [entity types](service-fabric-health-introduction.md#Health-Entities-and-Hierarchy). They can be accessed trough API (methods on FabricClient.HealthClient), Powershell cmdlets and REST.
These queries return complete health information about the entity, including aggregated health state, health events reported on the entity, children health states (when applicable) and unhealthy evaluations in case the entity is not healthy.

> [AZURE.NOTE] A health entity is returned to the user when it is completely populated in the health store: the entity has a System report, it's active and parent entities on the hierarchy chain have System reports. If any of these conditions is not satisfied, the health queries return an exception showing why the entity is not returned.

The health queries require passing in the entity identifier, which depends on the entity type. They accept optional health policy parameters. If not specified, the [health policies](service-fabric-health-introduction.md#health-policies) from cluster or application manifest are used for evaluation. They also accept filters for returning only partial children or events, the ones that respect the specified filters.

> [AZURE.NOTE] The output filters are applied on the server side, so the message reply size is reduced. It is recommended to use the filters to limit the data returned rather than apply filters on the client side.

An entity health contains the following information:
- The aggregated health state of the entity. This is computed by the Health Store based on entity health reports, children health states (when applicable) and health policies. Read more at [Entity health evaluation](service-fabric-health-introduction.md#entity-health-evaluation).  
- The health events on the entity.
- For the entities that can have children, collection of health states for all children. The health states contain the entity identifier and the aggregated health state.
- If the entity is not healthy, the unhealthy evaluations which point to the report that triggered the state of the entity.

### Get Cluster Health
Returns the health of the cluster entity. Contains the health states of applications and the nodes children of the cluster.
Input:
- [optional] Application health policy map with health policies used to override the application manifest policies.
- [optional] Filter to return only events, nodes, applications with certain health state (eg. return only errors or warning or errors etc).

#### API
To get cluster health through API, we need to create a FabricClient and call GetClusterHealthAsync method on its HealthClient.

#### Powershell
Here is the Powershell cmdlet to get cluster health for the cluster described above. The error event from the watchdog event is cleared, so the aggregated health state of the cluster is Warning. Default health policies are used. Note how the unhealthy evaluations show with details the condition that triggered the aggregated health.

```xml
PS C:\Windows\System32\WindowsPowerShell\v1.0> Get-ServiceFabricClusterHealth

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
The following Powershell command gets the health of the cluster with custom application policy. It filters results to get only Error or Warning applications and nodes (therefore, no nodes will be returned as they are all healthy and only fabric:/WordCount application is returned). Because the custom policy specifies to consider warning as error for the fabric:/WordCount application, the application is evaluated at Error, and so is the cluster.

```powershell
PS C:\Windows\System32\WindowsPowerShell\v1.0> $appHealthPolicy = New-Object -TypeName System.Fabric.Health.ApplicationHealthPolicy
$appHealthPolicy.ConsiderWarningAsError = $true
$appHealthPolicyMap = New-Object -TypeName System.Fabric.Health.ApplicationHealthPolicyMap
$appUri1 = New-Object -TypeName System.Uri -ArgumentList "fabric:/WordCount"
$appHealthPolicyMap.Add($appUri1, $appHealthPolicy)
$warningAndErrorFilter = [System.Fabric.Health.HealthStateFilter]::Warning.value__  + [System.Fabric.Health.HealthStateFilter]::Error.value__

PS C:\Windows\System32\WindowsPowerShell\v1.0> Get-ServiceFabricClusterHealth -ApplicationHealthPolicyMap $appHealthPolicyMap -ApplicationsHealthStateFilter $warningAndErrorFilter -NodesHealthStateFilter $warningAndErrorFilter

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

## General Queries
Use general queries to get the list of Service Fabric entities. Exposed trough API (methods on FabricClient.QueryClient), Powershell cmdlets and REST. These queries aggregate sub-queries from multiple components. One of them is the [Health Store](service-fabric-health-introduction.md#Health-Store), which populates the aggregated health state for each query result.  

> [AZURE.NOTE] The general queries return the aggregated health state of the entity and do not contain the rich health data. If an entity is not healthy, you can follow up with health queries to get all health information, like events, children health states and unhealthy evaluations.

- Use Service Fabric Explorer or other tools that give a graphic view of the cluster and its entities. Internally, these tools use same mechanisms as above, general queries and health queries.

If the general queries return Unknown health state for an entity, it's possible that the Health Store doesn't have complete data about the entity or the sub-query to the Health Store wasn't successful (eg. communication error, health store was throttled etc). Follow up with a health query for the entity. This may succeed, if the sub-query encountered transient errors (eg. network issues), or will give more details about why the entity is not exposed from Health store.
