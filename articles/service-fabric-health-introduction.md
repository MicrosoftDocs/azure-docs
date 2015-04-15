<properties
   pageTitle="Service Fabric Health Introduction - Azure"
   description="Introduction of the Service Fabric Health Subsystem"
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
   ms.date="03/17/2015"
   ms.author="oanapl"/>

# Azure Service Fabric Health
Service Fabric introduces a health model that provides a rich, flexible and extensible reporting and evaluation functionality for Service Fabric entities. Service Fabric components report out of the box on all entities. User services can enrich the health data with information specific to their logic, reported on themselves or other entities in the cluster.

The Health subsystem provides near real-time monitoring capabilities of the state of the cluster and services running in the cluster, which enables administrators or external services to obtain health information and take actions to correct any potential issues in the respective services or cluster before they cascade and cause massive outages. This model also forces the healthy and unhealthy determination of a particular entity to be the responsibility of the “reporter”, improving the scalability and manageability of the cloud service.

## Health Store
The Health Store keeps health related information about entities in the cluster for easy retrieval and evaluation. It is implemented as a Service Fabric persisted stateful service to ensure high availability and scalability. It is part of the fabric/System application and is available as soon as the cluster is up and running.

## Health Entities and Hierarchy
The health entities are organized in a logical hierarchy that captures interactions and dependencies between different entities. The entities and the hierarchy are automatically built by the Health Store based on reports received from the Service Fabric components.

> [AZURE.NOTE] The health entities mirror the Service Fabric entities (eg. health application entity matches an application instance deployed in the cluster, health node entity matches a Service Fabric cluster node). The health hierarchy captures the interactions of the system entities and is the basis for advanced health evaluation.

The health entities and hierarchy allow for effective reporting, debugging and monitoring of the cluster and applications. The health model allows an accurate, **granular** representation of the health of the many moving pieces in the cluster.

![Health Entities.][1] The health entities, organized in an hierarchy based on parent-children relationships.
[1]: ./media/service-fabric-health\servicefabric-health-hierarchy.png

The health entities are:
- **Cluster**. Represents the health of a Service Fabric cluster. Cluster health reports describe conditions that affect the entire cluster and can't be narrowed down to one or more unhealthy children. Example: split-brain of the cluster due to network partitioning or communication issues.
- **Node**. Represents the health of a Service Fabric node (machine or OS instance). Node health reports describe conditions that affect the node functionality and typically affect all the deployed entities running on it. Example: node is out of disk space (or other machine wide property such as memory, connections, etc.) or node is down. The node entity is identified by the node name.
- **Application**. Represents the health of an application instance running in the cluster. Application health reports describe conditions that affect the overall health of the application and can't be narrowed down to individual children (services or deployed applications). Example: the end to end interaction between different services in the application. The application entity is identified the the application name (URI).
- **Service**. Represents the health of a service running in the cluster. Service health reports describe conditions that affect the overall health of the service, and can't be narrowed down to a partition. Example: the service configuration health (such port or external fileshare) that is causing issues for all partitions.
- **Partition**. Represents the health of a service partition. Partition health reports describe conditions that affect the entire replica set, like the number of replicas is below target count or partition is in quorum loss.
- **Replica**. Represents the health of a stateful service replica or a stateless service instance. This is the smallest unit watchdogs and system components can report on for an application. For stateful services, primary replica can report if it can't replicate operations to secondaries or replication is not proceeding at the expected pace. A stateless instance can report if it is running out of resources or has connectivity issues.
- **DeployedApplication**. Represents the health of an *application running on a node*. Deployed application health reports describe conditions specific to the application on the node that can't be narrowed down to service packages deployed on the same node. Example: the application package can't be downloaded on that node or there is an issue setting up application security principals on the node.
- **DeployedServicePackage**. Represents the health of a service package of an application running in a node in the cluster. It describes conditions specific to a service package that do not affect the other service packages on the same node for the same application. Example: a code package in the service package cannot be started or configuration package cannot be read.

The granularity of the health model makes it easy to detect and correct issues. For example, if a service is not responding, it is feasible to report that the application instance is unhealthy; however, it is not ideal because the issue might not be affecting all services within that application. The report should be applied on the unhealthy service, or, if more information points to a specific child partition, on that partition. The data will automatically surface through the hierarchy: an unhealthy partition will be made visible at service and application levels. This will help resolve the issue closer to the root cause.

The health hierarchy is composed of parent-children relationships. Cluster is composed of nodes and applications; applications have services and deployed applications; deployed applications have deployed service packages. Services have partitions, and each partition has one or more replicas. There is a special relationship between nodes and deployed entities. If a node is unhealthy as reported by system components, it will affect the deployed applications, service packages and replicas deployed on it.

Pushing the decision about how to report and respond to health at a granular level to design time makes large cloud services easier to debug, monitor, and subsequently operate.

The health hierarchy represents the latest state of the system based on the latest health reports, which is almost real-time information.
Internal and external watchdogs can report on the same entities based on application specific logic or custom monitored conditions. The user reports co-exist with the system reports.

## Health States
Service Fabric uses three health states to describe whether an entity is healthy or not: Ok, Warning and Error. Any report sent to the Health Store must specify one of these states. The health evaluation result is in one of these states.

The possible health states are:
- Ok: The entity is healthy. There are no known issues reported on it or its children (when applicable).
- Warning: The entity experiences some issues but is not yet unhealthy (i.e., unexpected delay that it is not causing any functional issue and may fix itself without any special intervention).
- Error: The entity is unhealthy. Action should be taken to fix the state of the entity, as it can't function properly.
- Unknown: The entity doesn't exist in the health store. This result can be obtained from distributed queries like get the Service Fabric nodes or applications. These queries merge results from multiple system components. If another system component has an entity that has not reached the health store yet or that has been cleaned up from health store, the merged query will populate health result with 'Unknown' health state.

## Health Policies
The Health Store applies health policies to determine whether an entity is healthy based on its reports and its children.

> [AZURE.NOTE] The health policies can be specified in the cluster manifest (for cluster and node health evaluation) or the application manifest (for application evaluation and any of its children). The health evaluation requests can also pass in custom health evaluations, which will be used only for that evaluation.

By default, Service Fabric applies strict rules (everything must be healthy) for the parent-children hierarchical relationship; as long as one of the children has one unhealthy event, the parent is considered unhealthy.

### Cluster Health Policy
The cluster health policy is used to evaluate cluster health state and node health states. It can be defined in the cluster manifest.
Contains:
- **ConsiderWarningAsError**. Specifies whether to treat Warning health reports as errors during health evaluation. Default: False
- **MaxPercentUnhealthyApplications**. Maximum tolerated percentage of applications that can be unhealthy before the cluster is considered in Error.
- **MaxPercentUnhealthyNodes**. Maximum tolerated percentage of nodes that can be unhealthy before the cluster is considered in Error.

The following is an excerpt from a cluster manifest:
```xml
<FabricSettings>
  <Section Name="HealthManager/ClusterHealthPolicy">
    <Parameter Name="ConsiderWarningAsError" Value="False" />
    <Parameter Name="MaxPercentUnhealthyNodes" Value="20" />
    <Parameter Name="MaxPercentUnhealthyApplications" Value="0" />
  </Section>
</FabricSettings>
```

### Application Health Policy
The application health policy describes how evaluation of events and children states aggregation is done for application and its children. It can be defined in the application manifest, ApplicationManifest.xml in the application package. If not specified, Service Fabric assumes the entity to be unhealthy if is has a health report or a child at Warning or Error health state.
The configurable policies are:
- **ConsiderWarningAsError**. Specifies whether to treat Warning health reports as errors during health evaluation. Default: False
- **MaxPercentUnhealthyDeployedApplications**. Maximum tolerated percentage of deployed applications that can be unhealthy before the application is considered in Error. This is calculated by dividing the number of unhealthy deployed applications over the number of nodes that the applications is currently deployed on in the cluster. The computation rounds up to tolerate one failure on small number of nodes. Default: 0%.
- **DefaultServiceTypeHealthPolicy**. Specifies the default service type health policy, which will replace the default health policy for all service types in the application.
- **ServiceTypeHealthPolicyMap**. Map with service health policies per service type, which replace the default service type health policy for the specified service types. For example, in an application that contains a stateless Gateway service type and a stateful Engine service type, the health policy for the stateless and stateful service can be configured differently. Specifying policy per service types allows a more granular control of the health of the service.

### Service Type Health Policy
The service type health policy specifies how to evaluate and aggregate children on service. Contains:
- **MaxPercentUnhealthyPartitionsPerService**. Maximum tolerated percentage of unhealthy partitions before a service is considered unhealthy. Default: 0%.
- **MaxPercentUnhealthyReplicasPerPartition**. Maximum tolerated percentage of unhealthy replicas before a partition is considered unhealthy. Default: 0%.
- **MaxPercentUnhealthyServices**. Maximum tolerated percentage of unhealthy services before the application is considered unhealthy. Default: 0%

The following is an excerpt from an application manifest:
```xml
    <Policies>
        <HealthPolicy ConsiderWarningAsError="true" MaxPercentUnhealthyDeployedApplications="20">
            <DefaultServiceTypeHealthPolicy MaxPercentUnhealthyServices="0" MaxPercentUnhealthyPartitionsPerService="10" MaxPercentUnhealthyReplicasPerPartition="0"/>
            <ServiceTypeHealthPolicy ServiceTypeName="FrontEndServiceType"                MaxPercentUnhealthyServices="0" MaxPercentUnhealthyPartitionsPerService="20" MaxPercentUnhealthyReplicasPerPartition="0"/>
            <ServiceTypeHealthPolicy ServiceTypeName="BackEndServiceType"                MaxPercentUnhealthyServices="20" MaxPercentUnhealthyPartitionsPerService="0" MaxPercentUnhealthyReplicasPerPartition="0">
            </ServiceTypeHealthPolicy>
        </HealthPolicy>
    </Policies>
```

## Entity Health Evaluation
Users or automated services can evaluate any entity at any point in time. To evaluate an entity health, the Health Store aggregates all health reports on the entity and evaluates all its children (if applicable). The health aggregation algorithm uses health policies that specify how to evaluate health reports as well as how to aggregate children health states (if applicable).

### Health Reports Aggregation
One entity can have multiple health reports sent by different “reporters” (system components or watchdogs) on different properties. The aggregation uses the associated health policies, in particular the ConsisderWarningAsError member which specifies how to evaluate warnings.

The aggregated health state is triggered by the “worst” health reports on the entity. If there is at least one Error health report, the aggregated health state is Error.
![Health Report Aggregation with Error Report.][2] Error health report triggers the health entity to be in Error state.
[2]: ./media/service-fabric-health\servicefabric-health-report-eval-error.png

If there are no Error reports, and one or more Warning, the aggregated health state is either Warning or Error, depending on the  ConsiderWarningAsError policy flag.
![Health Report Aggregation with Warning Report and ConsierWarningAsError false.][3] Health Report Aggregation with Warning Report and ConsierWarningAsError false (default).
[3]: ./media/service-fabric-health\servicefabric-health-report-eval-warning.png

### Children Entities Health Aggregation
The aggregated health state of an entity reflects the children health states (when applicable). The algorithm for aggregating children health states uses the health policies applicable based on the entity type.

![Children entities health aggregation.][4] Children aggregation based on health policies.
[4]: ./media/service-fabric-health\servicefabric-health-hierarchy-eval.png

After evaluating all children, the Health Store aggregates the health states based on the configured max percent unhealthy taken from the policy based on the entity and child type.
- If all children have Ok states, the children aggregated health state is Ok.
- If children have Ok and Warning states, the children aggregated health state is Warning.
- If there are children with Error states that do not respect max allowed percentage of unhealthy children, the aggregated health state is error.
- If the children with Error states respect the max allowed percentage of unhealthy children, the aggregated health state is Warning.

## Health Reporting
System components and internal/external watchdogs can report against the system entities.
When reporting, the *reporters* make a **local** determination of the health of the monitored entity based on some conditions they are monitoring. The *repoters* don't need to look at any global state to report aggregated, potentially useful information to a central store.

This allows the cloud services and the underlying Service Fabric platform to scale, because the monitoring and health determination is distributed among the different monitors within the cluster.
Other systems have a single centralized service at the cluster level parsing all the “potentially” useful information emitted by all services. This hinders their scalability and it doesn't allow them to collect very specific information to help identify issues and potential issues as close to the root cause as possible.

## Next Steps
[View Azure Service Fabric Entities Aggregated Health](service-fabric-view-entities-aggregated-health.md)

[Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
