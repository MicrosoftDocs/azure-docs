<properties
   pageTitle="Understand and troubleshoot with System health reports"
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
   ms.date="03/17/2015"
   ms.author="oanapl"/>

# Understand and troubleshoot with System health reports
Service Fabric components report out of the box on all entities in the cluster. The [Health Store](service-fabric-health-introduction.md#Health-Store) creates and deletes entities based on the system reports, and organizes them in an hierarchy that captures entity interactions.

> [AZURE.NOTE] Read more about the Service Fabric [Health Model](service-fabric-health-introduction.md) to understand health related concepts.

The System health reports provide visibility into cluster and application functionality and flag issues through health. For application and services, the System health reports verify that entities are implemented and are behaving correctly from Service Fabric perspective. The reports do not provide any health monitoring of the business logic of the service or detection of hung processes. User services can enrich the health data with information specific to their logic.

> [AZURE.NOTE] Watchdogs health reports are only visible **after** the system components create an entity. When an entity is deleted, the Health Store automatically deletes all health reports associated with it. Same when a new instance of the entity is created (eg. a new service replica instance is created): all reports associated with the old instance are deleted and cleaned up from store.

The System components reports are identified by the source, which starts with *"System."* prefix. Watchdogs can't use the same prefix for their sources, as reports will be rejected with invalid parameters.
Next, we will look at some system reports and understand what triggers them and how to correct possible issues they represent.

> [AZURE.NOTE] Service Fabric continues to add reports for conditions of interest that would improve visibility into what is happening in the cluster/application.

## Cluster System health reports
The cluster health entity is created automatically in the health store, so if everything works properly it doesn't have a system report.

### Neighborhood loss
System.Federation reports an Error when it detects a neighborhood loss. The report is from individual nodes and node id is included in the property name. If there is one neighborhood loss in the entire Service Fabric ring, typically we can expect two events (both sides of the gap will report). If there are more neighborhoods lost, there will be more events.
The report specifies Global Lease timeout as the TTL and the report is re-sent every half of the TTL as long as the condition is still active. The event is automatically removed when expired, so if the reporting node is down, it is still correctly cleaned up from Health Store.
- SourceId: System.Federation
- Property: starts with "Neighborhood" and includes node information.
- Next step: investigate why the neighborhood is lost. Eg. Check communication between cluster nodes.

## Node System health reports
System.FM is the authority that manages information about cluster nodes. Any node should have one report from System.FM showing its state. The node entities are removed when the node is disabled.

### Node up/down
System.FM reports Ok when the node joins the ring (it's up and running) and Error when the node departs the ring (it's down, either for upgrading, or simply failed).  The health hierarchy built by the Health Store takes action on deployed entities in correlation with System.FM node reports. It considers node a virtual parent of all deployed entities. The deployed entities on that node are not exposed through queries if the node is down or not reported, or the node has a different instance than the instance associated with the entities. When FM reports the node down or restarted (new instance), the Health Store automatically cleans up the deployed entities that can only exist on the down node or the previous instance of the node.
- SourceId: System.FM
- Property: State
- Next steps: If the node is down for upgrade, it should come up once upgraded, in which case the health state should be switched back to Ok. If the node doesn't come back or it failed, it needs more investigation.

### Certificate expiration
System.FabricNode reports Warning when certificates used by the node are close to expiration. There are three certificates per node: Certificate_cluster, Certificate_server and Certificate_default_client.
When the expiration is at least two weeks away, the report type is OK; if the expiration is within two weeks, the report type is Warning. TTL of these events is infinite, they are removed when a node leaves the cluster.
- SourceId: System.FabricNode
- Property: starts with "Certificate" and contains more information about certificate type.
- Next steps: Update the certificates.

### Load capacity violation
The Service Fabric load balancer
 reports Warning if it detects a node capacity violation.
 - SourceId: System.PLB
 - Property: starts with "Capacity".
 - Next steps: Check provided metrics and view the current capacity on the node.

## Application System health reports
### State
System.CM is the authority for applications. It reports Ok when the application is created or updated. It informs the Health Store when the application is deleted, so it can be removed from store.
- SourceId: System.CM
- Property: State
- Next steps: If the application is created, it should have the CM health report. Otherwise, check the state of the application by issuing a query (eg Powershell cmdlet Get-ServiceFabricApplication -ApplicationName <applicationName>).

## Service System health reports
### State
System.FM is the authority for service state. It reports Ok when the service is created. It deletes the entity from Health Store when the service is deleted.
- SourceId: System.FM
- Property: State.

### Unplaced replicas violation
System.PLB reports Warning if it was unable to find a placement for one or more of the service replica. The report is removed when expired.
- SourceId: System.FM
- Property: State.
- Next steps: Check the service constraints. Check the current state of the placement.

## Partition System health reports
### State
System.FM is the authority for partition state. It reports Ok when the partition is created and healthy. It deletes the entity from Health Store when the partition is deleted.
If the partition is below min replica count, it reports Error.
If the partition is not below min replica count, but it is below target replica count, it reports Warning.
If the partition is in quorum loss, FM reports error.
Other important events are: Warning when the reconfiguration takes longer than expected and when the build is taking longer than expected. The expected times for build or reconfiguration are configurable based on service scenarios. Eg. if a service has TB of state, like SQL Azure, the build will take longer than a service with a small amount of state.
- SourceId: System.FM
- Property: State.
- Next steps: if health state is not Ok, check why the replicas are not created/opened/promoted to primary or secondary correctly. In many instances, the root cause is a service bug in the open or change role implementation.

### Replica constraint violation
System.PLB reports Warning if it detects replica constraint violation and can't place replicas of the partition.
- SourceId: System.PLB
- Property: starts with "ReplicaConstraintViolation".

## Replica System health reports
System.RA is the authority for replica state.

### State
System.RA reports Ok when the replica is created.
- SourceId: System.RA
- Property: State.

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
- Next steps: Investigate why the activation failed.

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
[View Azure Service Fabric Entities Aggregated Health](service-fabric-view-entities-aggregated-health.md)

[How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Service Fabric Application Upgrade](service-fabric-application-upgrade.md)
