<properties
   pageTitle="Introduction to Service Fabric Health Monitoring"
   description="This article describes the Azure Service Fabric Health Monitoring model, including health entities, reporting and evaluation."
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
   ms.date="04/26/2015"
   ms.author="oanapl"/>

# Introduction to Service Fabric Health Monitoring
Service Fabric introduces a health model that provides rich, flexible and extensible health evaluation and reporting. This includes near real-time monitoring of the state of the cluster and of the services running in it. You  can easily obtain the health information and take actions to correct potential issues before they cascade and cause massive outages. The typical model is that services send reports based on their local view and the information is aggregated to provide an overall cluster level view.

Service Fabric components use this health model to report their current state. And you can use the same mechanism to report health from your applications. The quality and richness of health reporting specific to your custom conditions will determine how easily you will be able to detect and fix issues for your running application.

> [AZURE.NOTE] We started the Health subsystem as a need for monitored upgrades. Service Fabric provides monitored upgrades that know how to upgrade a cluster or an application with no down time, minimum to no user intervention and with full cluster and application availability. To do this, the upgrade checks health based on configured upgrade policies and allows upgrade to proceed only when health respects desired thresholds. Otherwise, the upgrade is either automatically rolled back or paused to give administrators a chance to fix the issues. To learn more about application upgrades see [this article](service-fabric-application-upgrade.md).

## Health Store
The Health Store keeps health related information about entities in the cluster for easy retrieval and evaluation. It is implemented as a Service Fabric persisted stateful service to ensure high availability and scalability. It is part of the fabric:/System application and is available as soon as the cluster is up and running.

## Health entities and hierarchy
The health entities are organized in a logical hierarchy that captures interactions and dependencies between different entities. The entities and the hierarchy are automatically built by the Health Store based on reports received from the Service Fabric components.

The health entities mirror the Service Fabric entities (eg. health application entity matches an application instance deployed in the cluster, health node entity matches a Service Fabric cluster node). The health hierarchy captures the interactions of the system entities and is the basis for advanced health evaluation. You can learn about the key Service Fabric concepts at [Service Fabric technical overview](service-fabric-technical-overview.md). For more on application, go to [Service Fabric application model](service-fabric-application-model.md).

The health entities and hierarchy allow for effective reporting, debugging and monitoring of the cluster and applications. The health model allows an accurate, **granular** representation of the health of the many moving pieces in the cluster.

![Health Entities.][1]
The health entities, organized in an hierarchy based on parent-children relationships.

[1]: ./media/service-fabric-health-introduction/servicefabric-health-hierarchy.png

The health entities are:

- **Cluster**. Represents the health of a Service Fabric cluster. Cluster health reports describe conditions that affect the entire cluster and can't be narrowed down to one or more unhealthy children. Example: split-brain of the cluster due to network partitioning or communication issues.

- **Node**. Represents the health of a Service Fabric node. Node health reports describe conditions that affect the node functionality and typically affect all the deployed entities running on it. Example: node is out of disk space (or other machine wide property such as memory, connections, etc.) or node is down. The node entity is identified by the node name (string).

- **Application**. Represents the health of an application instance running in the cluster. Application health reports describe conditions that affect the overall health of the application and can't be narrowed down to individual children (services or deployed applications). Example: the end to end interaction between different services in the application. The application entity is identified by the application name (Uri).

- **Service**. Represents the health of a service running in the cluster. Service health reports describe conditions that affect the overall health of the service, and can't be narrowed down to a partition or a replica. Example: a service configuration (such as port or external file share) that is causing issues for all partitions. The service entity is identified by the service name (Uri).

- **Partition**. Represents the health of a service partition. Partition health reports describe conditions that affect the entire replica set. Example: the number of replicas is below target count or partition is in quorum loss. The partition entity is identified by the partition id (Guid).

- **Replica**. Represents the health of a stateful service replica or a stateless service instance. This is the smallest unit watchdogs and system components can report on for an application. Example: For stateful services, primary replica can report if it can't replicate operations to secondaries or replication is not proceeding at the expected pace. A stateless instance can report if it is running out of resources or has connectivity issues. The replica entity is identified by the partition id (Guid) and the replica or instance id (long).

- **DeployedApplication**. Represents the health of an *application running on a node*. Deployed application health reports describe conditions specific to the application on the node that can't be narrowed down to service packages deployed on the same node. Example: the application package can't be downloaded on that node or there is an issue setting up application security principals on the node. The deployed application is identified by application name (Uri) and node name (string).

- **DeployedServicePackage**. Represents the health of a service package of an application running in a node in the cluster. It describes conditions specific to a service package that do not affect the other service packages on the same node for the same application. Example: a code package in the service package cannot be started or configuration package cannot be read. The deployed service package is identified by application name (Uri), node name (string) and service manifest name (string).

The granularity of the health model makes it easy to detect and correct issues. For example, if a service is not responding, it is feasible to report that the application instance is unhealthy; however, it is not ideal because the issue might not be affecting all services within that application. The report should be applied on the unhealthy service, or, if more information points to a specific child partition, on that partition. The data will automatically surface through the hierarchy: an unhealthy partition will be made visible at service and application levels. This will help pinpoint and resolve the root cause of the issues faster.

The health hierarchy is composed of parent-children relationships. Cluster is composed of nodes and applications; applications have services and deployed applications; deployed applications have deployed service packages. Services have partitions, and each partition has one or more replicas. There is a special relationship between nodes and deployed entities. If a node is unhealthy as reported by its authority System component (Failover Manager Service), it will affect the deployed applications, service packages and replicas deployed on it.

The health hierarchy represents the latest state of the system based on the latest health reports, which is almost real-time information.
Internal and external watchdogs can report on the same entities based on application specific logic or custom monitored conditions. The user reports co-exist with the system reports.

Investing time on planning how to report and respond to health while designing the service makes large cloud services easier to debug, monitor, and subsequently operate.

## Health states
Service Fabric uses three health states to describe whether an entity is healthy or not: Ok, Warning and Error. Any report sent to the Health Store must specify one of these states. The health evaluation result is one of these states.

The possible health states are:

- Ok: The entity is healthy. There are no known issues reported on it or its children (when applicable).

- Warning: The entity experiences some issues but it is not yet unhealthy (i.e., unexpected delay that it is not causing any functional issue). In some cases, the warning condition may fix itself without any special intervention, and it is useful to provide visibility into what is going on. In other cases, the Warning condition may degrade into a severe problem without user intervention.

- Error: The entity is unhealthy. Action should be taken to fix the state of the entity, as it can't function properly.

- Unknown: The entity doesn't exist in the health store. This result can be obtained from distributed queries like get the Service Fabric nodes or applications. These queries merge results from multiple system components. If another system component has an entity that has not reached the health store yet or that has been cleaned up from health store, the merged query will populate health result with 'Unknown' health state.

## Health policies
The Health Store applies health policies to determine whether an entity is healthy based on its reports and its children.

> [AZURE.NOTE] The health policies can be specified in the cluster manifest (for cluster and node health evaluation) or the application manifest (for application evaluation and any of its children). The health evaluation requests can also pass in custom health evaluation policies, which will only be used for that evaluation.

By default, Service Fabric applies strict rules (everything must be healthy) for the parent-children hierarchical relationship; as long as one of the children has one unhealthy event, the parent is considered unhealthy.

### Cluster Health Policy
The cluster health policy is used to evaluate cluster health state and node health states. It can be defined in the cluster manifest. If not present, it defaults to the default policy (0 tolerated failures).
Contains:

- **ConsiderWarningAsError**. Specifies whether to treat Warning health reports as errors during health evaluation. Default: False.

- **MaxPercentUnhealthyApplications**. Maximum tolerated percentage of applications that can be unhealthy before the cluster is considered in Error.

- **MaxPercentUnhealthyNodes**. Maximum tolerated percentage of nodes that can be unhealthy before the cluster is considered in Error. In large clusters, there will always be nodes down or out for repairs, so this percentage should be configured to tolerate that.

The following is an excerpt from a cluster manifest:

```xml
<FabricSettings>
  <Section Name="HealthManager/ClusterHealthPolicy">
    <Parameter Name="ConsiderWarningAsError" Value="False" />
    <Parameter Name="MaxPercentUnhealthyApplications" Value="0" />
    <Parameter Name="MaxPercentUnhealthyNodes" Value="20" />
  </Section>
</FabricSettings>
```

### Application Health Policy
The application health policy describes how evaluation of events and children states aggregation is done for application and its children. It can be defined in the application manifest, ApplicationManifest.xml in the application package. If not specified, Service Fabric assumes the entity to be unhealthy if is has a health report or a child at Warning or Error health state.
The configurable policies are:

- **ConsiderWarningAsError**. Specifies whether to treat Warning health reports as errors during health evaluation. Default: False.

- **MaxPercentUnhealthyDeployedApplications**. Maximum tolerated percentage of deployed applications that can be unhealthy before the application is considered in Error. This is calculated by dividing the number of unhealthy deployed applications over the number of nodes that the applications is currently deployed on in the cluster. The computation rounds up to tolerate one failure on small number of nodes. Default: 0%.

- **DefaultServiceTypeHealthPolicy**. Specifies the default service type health policy, which will replace the default health policy for all service types in the application.

- **ServiceTypeHealthPolicyMap**. Map with service health policies per service type, which replace the default service type health policy for the specified service types. For example, in an application that contains a stateless Gateway service type and a stateful Engine service type, the health policy for the stateless and stateful service can be configured differently. Specifying policy per service types allows a more granular control of the health of the service.

### Service Type Health Policy
The service type health policy specifies how to evaluate and aggregate children of service. Contains:

- **MaxPercentUnhealthyPartitionsPerService**. Maximum tolerated percentage of unhealthy partitions before a service is considered unhealthy. Default: 0%.

- **MaxPercentUnhealthyReplicasPerPartition**. Maximum tolerated percentage of unhealthy replicas before a partition is considered unhealthy. Default: 0%.

- **MaxPercentUnhealthyServices**. Maximum tolerated percentage of unhealthy services before the application is considered unhealthy. Default: 0%

The following is an excerpt from an application manifest:

```xml
    <Policies>
        <HealthPolicy ConsiderWarningAsError="true" MaxPercentUnhealthyDeployedApplications="20">
            <DefaultServiceTypeHealthPolicy
                   MaxPercentUnhealthyServices="0"
                   MaxPercentUnhealthyPartitionsPerService="10"
                   MaxPercentUnhealthyReplicasPerPartition="0"/>
            <ServiceTypeHealthPolicy ServiceTypeName="FrontEndServiceType"
                   MaxPercentUnhealthyServices="0"
                   MaxPercentUnhealthyPartitionsPerService="20"
                   MaxPercentUnhealthyReplicasPerPartition="0"/>
            <ServiceTypeHealthPolicy ServiceTypeName="BackEndServiceType"
                   MaxPercentUnhealthyServices="20"
                   MaxPercentUnhealthyPartitionsPerService="0"
                   MaxPercentUnhealthyReplicasPerPartition="0">
            </ServiceTypeHealthPolicy>
        </HealthPolicy>
    </Policies>
```

## Health evaluation
Users or automated services can evaluate health for any entity at any point in time. To evaluate an entity health, the Health Store aggregates all health reports on the entity and evaluates all its children (when applicable). The health aggregation algorithm uses health policies that specify how to evaluate health reports as well as how to aggregate children health states (when applicable).

### Health reports aggregation
One entity can have multiple health reports sent by different reporters (system components or watchdogs) on different properties. The aggregation uses the associated health policies, in particular the ConsiderWarningAsError member of application or cluster health policy, which specifies how to evaluate warnings.

The aggregated health state is triggered by the **worst** health reports on the entity. If there is at least one Error health report, the aggregated health state is Error.

![Health Report Aggregation with Error Report.][2]

Error health report triggers the health entity to be in Error state.

[2]: ./media/service-fabric-health-introduction/servicefabric-health-report-eval-error.png

If there are no Error reports, and one or more Warning, the aggregated health state is either Warning or Error, depending on the ConsiderWarningAsError policy flag.

![Health Report Aggregation with Warning Report and ConsiderWarningAsError false.][3]

Health Report Aggregation with Warning Report and ConsiderWarningAsError false (default).

[3]: ./media/service-fabric-health-introduction/servicefabric-health-report-eval-warning.png

### Children health aggregation
The aggregated health state of an entity reflects the children health states (when applicable). The algorithm for aggregating children health states uses the health policies applicable based on the entity type.

![Children entities health aggregation.][4]

Children aggregation based on health policies.

[4]: ./media/service-fabric-health-introduction/servicefabric-health-hierarchy-eval.png

After evaluating all children, the Health Store aggregates the health states based on the configured max percent unhealthy taken from the policy based on the entity and child type.

- If all children have Ok states, the children aggregated health state is Ok.

- If children have Ok and Warning states, the children aggregated health state is Warning.

- If there are children with Error states that do not respect max allowed percentage of unhealthy children, the aggregated health state is error.

- If the children with Error states respect the max allowed percentage of unhealthy children, the aggregated health state is Warning.

## Health reporting
System components and internal/external watchdogs can report against the Service Fabric entities. The *reporters* make a **local** determination of the health of the monitored entity based on some conditions they are monitoring. They don't need to look at any global state and aggregate data. This is not desired, as it would make the reporters complex organisms that need to look at many things in order to infer what information to send.

To send health data to the health store, the reporters need to identify the affected entity and create a health report. The report can then be sent through API with FabricClient.HealthManager.ReportHealth, through Powershell or through REST.

### Health reports
The health reports for each of the entities in the cluster contain the following information:

- SourceId. A string that uniquely identifies the reporter of the health event.

- Entity identifier. Identifies the entity on which the report is applied on. It differs based on the [entity type](service-fabric-health-introduction.md#health-entities-and-hierarchy):

  - Cluster: none

  - Node: node name  (string).

  - Application:  application name (URI). Represents the name of the application instance deployed in the cluster.

  - Service: service name (URI). Represents the name of the service instance deployed in the cluster.

  - Partition: partition id (GUID). Represents the partition unique identifier.

  - Replica: the sateful service replica id or the stateless service instance id (Int64).

  - DeployedApplication: application name (URI) and node name (string).

  - DeployedServicePackage: application name (URI), node name (string) and service manifest name (string).

- Property. A *string* (not a fixed enumeration) that allows the reporter to categorize the health event for a specific property of the entity. For example, reporter A can report health on Node01 "storage" property and reporter B can report health on Node01 "connectivity" property. Both these reports are treated as separate health events in the health store for the Node01 entity.

- Description. A string that allows the reporter to provide detail information about the health event. SourceId, Property and HealthState should fully describe the report. The description adds human readable information about the report to make it easier for administrators and users to understand.

- HealthState. An [enumeration](service-fabric-health-introduction.md#health-states) that describes the health state of the report. The accepted values are OK, Warning, and Error.

- TimeToLive. A timespan that indicates how long the health report is valid. Coupled with RemoveWhenExpired, it lets the HealthStore know how to evaluate expired events. By default, the value is infinite and the report is valid forever.

- RemoveWhenExpired. A boolean. If set to true, the expired health report is automatically removed from health store and it doesn't impact entity health evaluation. This is used when the report is valid for a period of time only and the reporter doesn't need to explicitly clear it out. It's also used to delete reports from health store. Eg. a watchdog is changed and stops sending reports with previous source and property. So it can send a report with small TTL and RemoveWhenExpired to clear up any previous state from Health Store. If set to false, the expired report is treated as an error on health evaluation. It signals to the health store that the source should report periodically on this property; if it doesn't, then there must be something wrong with the watchdog. The watchdog health is captured by considering the event as error.

- SequenceNumber. A positive integer that needs to be ever increasing, as it represents the order of the reports. It is used by Health Store to detect stale reports, received late because of network delays or other issues. Reports are rejected if the sequence number is less or equal the latest applied one for the same entity, source and property. The sequence number is auto-generated if not specified. It is only necessary to put in the sequence number when reporting on state transitions: the source needs to remember what reports it sent and persist the information for recovery on failover.

The SourceId, entity identifier, Property and HealthState are required for every health report. The SourceId string is not allowed to start with prefix "System.", which is reserved for System reports. For the same entity, there is only one report for the same source and property; if multiple reports are generated for the same source and property, they override each other, either on health client side (if they are batched) or on the health store side. The replacement is done based on sequence number: newer reports (with higher sequence number) replace older reports.

### Health events
Internally, the Health Store keeps health events, which contain all the information from the reports plus additional metadata, such as time the report was given to the health client and time it was modified on the server side. The health events are returned by the [health queries](service-fabric-view-entities-aggregated-health.md#health-queries).

The added metadata contains:

- SourceUtcTimestamp: the time the report was given to the health client (Utc)

- LastModifiedUtcTimestamp: the time the report was last modified on the server side (Utc)

- IsExpired: flag to indicate whether the report was expired at the time the query was executed by the Health Store. An event can be expired only if RemoveWhenExpired is false; otherwise, the event is not returned by query, it is removed from store.

- LastOkTransitionAt, LastWarningTransitionAt, LastErrorTransitionAt: last time for Ok/Warning/Error transitions. These fields give the history of the transition of the health states for the event.

The state transition fields can be used for smarter alerting or "historical" health event information. They enable scenarios like:

- Alert when a property has been at Warning/Error for more than X minutes. This avoids alerting on temporary conditions. Eg: alert if the health state has been Warning for more than 5 minutes can be translated into (HealthState == Warning and Now - LastWarningTransitionTime
> 5 minutes).

- Alert only on conditions that changed in the last X minutes. If a report is at Error since before that, it can be ignored (because it was already signaled previously).

- If a property is toggling between Warning and Error, determine how long it has been unhealthy (i.e. not Ok). Eg: alert if the property wasn't healthy for more than 5 minutes can be translated into: (HealthState != Ok and Now - LastOkTransitionTime > 5 minutes).

## Example: report and evaluate application health
The following example sends a health report through Powershell on the application named fabric:/WordCount from the source MyWatchdog. The health report contains information about the health property Availability in an Error health state, with infinite TTL. Then it queries the application health, which will return aggregated health state error and the reported health event as part of the list of health events.

```powershell
PS C:\> Send-ServiceFabricApplicationHealthReport –ApplicationName fabric:/WordCount –SourceId "MyWatchdog" –HealthProperty "Availability" –HealthState Error

PS C:\> Get-ServiceFabricApplicationHealth fabric:/WordCount

ApplicationName                 : fabric:/WordCount
AggregatedHealthState           : Error
UnhealthyEvaluations            :
                                  Error event: SourceId='MyWatchdog', Property='Availability'.

ServiceHealthStates             :
                                  ServiceName           : fabric:/WordCount/WordCount.Service
                                  AggregatedHealthState : Warning

                                  ServiceName           : fabric:/WordCount/WordCount.WebService
                                  AggregatedHealthState : Ok

DeployedApplicationHealthStates :
                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.4
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.1
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.5
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.2
                                  AggregatedHealthState : Ok

                                  ApplicationName       : fabric:/WordCount
                                  NodeName              : Node.3
                                  AggregatedHealthState : Ok

HealthEvents                    :
                                  SourceId              : System.CM
                                  Property              : State
                                  HealthState           : Ok
                                  SequenceNumber        : 5102
                                  SentAt                : 4/15/2015 5:29:15 PM
                                  ReceivedAt            : 4/15/2015 5:29:15 PM
                                  TTL                   : Infinite
                                  Description           : Application has been created.
                                  RemoveWhenExpired     : False
                                  IsExpired             : False
                                  Transitions           : ->Ok = 4/15/2015 5:29:15 PM

                                  SourceId              : MyWatchdog
                                  Property              : Availability
                                  HealthState           : Error
                                  SequenceNumber        : 130736794527105907
                                  SentAt                : 4/16/2015 5:37:32 PM
                                  ReceivedAt            : 4/16/2015 5:37:32 PM
                                  TTL                   : Infinite
                                  Description           :
                                  RemoveWhenExpired     : False
                                  IsExpired             : False
                                  Transitions           : ->Error = 4/16/2015 5:37:32 PM

```

## Health model usage
The health model allows the cloud services and the underlying Service Fabric platform to scale, because the monitoring and health determination is distributed among the different monitors within the cluster.
Other systems have a single centralized service at the cluster level parsing all the *potentially* useful information emitted by services. This hinders their scalability and it doesn't allow them to collect very specific information to help identify issues and potential issues as close to the root cause as possible.

The health model is heavily used for monitoring and diagnosis, for evaluating the cluster and application health, and for monitored upgrades. Other services use the health data to perform automatic repairs, to build cluster health history and to issue alerts on certain conditions.

## Next steps
[How to view Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)

[Using System health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)

[Adding custom Service Fabric health reports](service-fabric-report-health.md)

[How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric Application Upgrade](service-fabric-application-upgrade.md)
