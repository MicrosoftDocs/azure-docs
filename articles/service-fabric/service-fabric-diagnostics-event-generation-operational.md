---
title: Azure Service Fabric Event List | Microsoft Docs
description: Comprehensive list of events provided by Azure Service Fabric to help monitor clusters.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: reference
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/23/2018
ms.author: dekapur

---

# List of Service Fabric events 

Service Fabric exposes a primary set of cluster events to inform you of the status of your cluster as [Service Fabric Events](service-fabric-diagnostics-events.md). These are based on actions performed by Service Fabric on your nodes and your cluster or management decisions made by a cluster owner/operator. These events can be accessed by configuring in a number of ways including configuring [Log Analytics with your cluster](service-fabric-diagnostics-oms-setup.md), or querying the [EventStore](service-fabric-diagnostics-eventstore.md). On Windows machines, these events are fed into the EventLog - so you can see Service Fabric Events in Event Viewer. 

Here are some characteristics of these events
* Each event is tied to a specific entity in the cluster e.g. Application, Service, Node, Replica.
* Each event contains a set of common fields: EventInstanceId, EventName, and Category.
* Each event contains fields that tie the event back to the entity it is associated with. For instance, the ApplicationCreated event would have fields that identify the name of the application created.
* Events are structured in such a way that they can be consumed in a variety of tools to do further analysis. Additionally, relevant details for an event are defined as separate properties as opposed to a long String. 
* Events are written by different subsystems in Service Fabric are identified by Source(Task) below. More information is available on these subsystems in [Service Fabric Architecture](service-fabric-architecture.md) and [Service Fabric Technical Overview](service-fabric-technical-overview.md).

Here is a list of these Service Fabric events organized by entity.

## Cluster events

**Cluster upgrade events**

More details on cluster upgrades can be found [here](service-fabric-cluster-upgrade-windows-server.md).

| EventId | Name | Category | Description |Source (Task) | Level | 
| --- | --- | --- | --- | --- | --- | 
| 29627 | ClusterUpgradeStarted | Upgrade | A cluster upgrade has started | CM | Informational |
| 29628 | ClusterUpgradeCompleted | Upgrade | A cluster upgrade has completed | CM | Informational | 
| 29629 | ClusterUpgradeRollbackStarted | Upgrade | A cluster upgrade has started to rollback  | CM | Warning | 
| 29630 | ClusterUpgradeRollbackCompleted | Upgrade | A cluster upgrade has completed rolling back | CM | Warning | 
| 29631 | ClusterUpgradeDomainCompleted | Upgrade | An upgrade domain has finished upgrading during a cluster upgrade | CM | Informational | 

## Node events

**Node lifecycle events** 

| EventId | Name | Category | Description |Source (Task) | Level |
| --- | --- | ---| --- | --- | --- | 
| 18602 | NodeDeactivateCompleted | StateTransition | Deactivation of a node has completed | FM | Informational | 
| 18603 | NodeUp | StateTransition | The cluster has detected a node has started up | FM | Informational | 
| 18604 | NodeDown | StateTransition | The cluster has detected a node has shut down. During a node restart, you will see a NodeDown event followed by a NodeUp event |  FM | Error | 
| 18605 | NodeAddedToCluster | StateTransition |  A new node has been added to the cluster and Service Fabric can deploy applications to this node | FM | Informational | 
| 18606 | NodeRemovedFromCluster | StateTransition |  A node has been removed from the cluster. Service Fabric will no longer deploy applications to this node | FM | Informational | 
| 18607 | NodeDeactivateStarted | StateTransition |  Deactivation of a node has started | FM | Informational | 
| 25621 | NodeOpenSucceeded | StateTransition |  A node started successfully | FabricNode | Informational | 
| 25622 | NodeOpenFailed | StateTransition |  A node failed to start and join the ring | FabricNode | Error | 
| 25624 | NodeClosed | StateTransition |  A node shut down successfully | FabricNode | Informational | 
| 25626 | NodeAborted | StateTransition |  A node has ungracefully shut down | FabricNode | Error | 

## Application events

**Application lifecycle events**

| EventId | Name | Category | Description |Source (Task) | Level | 
| --- | --- | --- | --- | --- | --- | 
| 29620 | ApplicationCreated | LifeCycle | A new application was created | CM | Informational | 
| 29625 | ApplicationDeleted | LifeCycle | An existing application was deleted | CM | Informational | 
| 23083 | ApplicationProcessExited | LifeCycle | A process within an application has exited | Hosting | Informational | 

**Application upgrade events**

More details on application upgrades can be found [here](service-fabric-application-upgrade.md).

| EventId | Name | Category | Description |Source (Task) | Level | 
| --- | --- | ---| --- | --- | --- | 
| 29621 | ApplicationUpgradeStarted | Upgrade | An application upgrade has started | CM | Informational | 
| 29622 | ApplicationUpgradeCompleted | Upgrade | An application upgrade has completed | CM | Informational | 
| 29623 | ApplicationUpgradeRollbackStarted | Upgrade | An application upgrade has started to rollback |CM | Warning | 
| 29624 | ApplicationUpgradeRollbackCompleted | Upgrade | An application upgrade has completed rolling back | CM | Warning | 
| 29626 | ApplicationUpgradeDomainCompleted | Upgrade | An upgrade domain has finished upgrading during an application upgrade | CM | Informational | 

## Service events

**Service lifecycle events**

| EventId | Name | Category | Description |Source (Task) | Level | 
| --- | --- | ---| --- | --- | --- |
| 18657 | ServiceCreated | LifeCycle | A new service was created | FM | Informational | 
| 18658 | ServiceDeleted | LifeCycle | An existing service was deleted | FM | Informational | 

## Partition events

**Partition move events**

| EventId | Name | Category | Description |Source (Task) | Level | 
| --- | --- | ---| --- | --- | --- |
| 18940 | PartitionReconfigured | LifeCycle | A partition reconfiguration has completed | RA | Informational | 

## Container events

**Container lifecycle events** 

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 23074 | ContainerActivated | A container has started | Hosting | Informational | 1 |
| 23075 | ContainerDeactivated | A container has stopped | Hosting | Informational | 1 |
| 23082 | ContainerExited | A container has exited - Check the UnexpectedTermination flag | Hosting | Informational | 1 |

## Health reports

The [Service Fabric Health Model](service-fabric-health-introduction.md) provides a rich, flexible, and extensible health evaluation and reporting. Starting Service Fabric version 6.2, health data is written as Platform events to provide historical records of health. To keep the volume of health events low, we only write the following as Service Fabric events:

* All `Error` or `Warning` health reports
* `Ok` health reports during transitions
* When an `Error` or `Warning` health event expires. This can be used to determine how long an entity was unhealthy

**Cluster health report events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | --- | --- | --- | --- |
| 54428 | ClusterNewHealthReport | A new cluster health report is available | HM | Informational | 1 |
| 54437 | ClusterHealthReportExpired | An existing cluster health report has expired | HM | Informational | 1 |

**Node health report events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 54423 | NodeNewHealthReport | A new node health report is available | HM | Informational | 1 |
| 54432 | NodeHealthReportExpired | An existing node health report has expired | HM | Informational | 1 |

**Application health report events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 54425 | ApplicationNewHealthReport | A new application health report was created. This is for undeployed applications. | HM | Informational | 1 |
| 54426 | DeployedApplicationNewHealthReport | A new deployed application health report was created | HM | Informational | 1 |
| 54427 | DeployedServicePackageNewHealthReport | A new deployed service health report was created | HM | Informational | 1 |
| 54434 | ApplicationHealthReportExpired | An existing application health report has expired | HM | Informational | 1 |
| 54435 | DeployedApplicationHealthReportExpired | An existing deployed application health report has expired | HM | Informational | 1 |
| 54436 | DeployedServicePackageHealthReportExpired | An existing deployed service health report has expired | HM | Informational | 1 |

**Service health report events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 54424 | ServiceNewHealthReport | A new service health report was created | HM | Informational | 1 |
| 54433 | ServiceHealthReportExpired | An existing service health report has expired | HM | Informational | 1 |

**Partition health report events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 54422 | PartitionNewHealthReport | A new partition health report was created | HM | Informational | 1 |
| 54431 | PartitionHealthReportExpired | An existing partition health report has expired | HM | Informational | 1 |

**Replica health report events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 54429 | StatefulReplicaNewHealthReport | A stateful replica health report was created | HM | Informational | 1 |
| 54430 | StatelessInstanceNewHealthReport | A new stateless instance health report was created | HM | Informational | 1 |
| 54438 | StatefulReplicaHealthReportExpired | An existing stateful replica health report has expired | HM | Informational | 1 |
| 54439 | StatelessInstanceHealthReportExpired | An existing stateless instance health report has expired | HM | Informational | 1 |

## Chaos testing events 

**Chaos session events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 50021 | ChaosStarted | A Chaos testing session has started | Testability | Informational | 1 |
| 50023 | ChaosStopped | A Chaos testing session has stopped | Testability | Informational | 1 |

**Chaos node events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 50033 | ChaosNodeRestartScheduled | A node has scheduled to restart as part of a Chaos testing session | Testability | Informational | 1 |
| 50087 | ChaosNodeRestartCompleted | A node has finished restarting as part of a Chaos testing session | Testability | Informational | 1 |

**Chaos application events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 50053 | ChaosCodePackageRestartScheduled | A code package restart has been scheduled during a Chaos testing session | Testability | Informational | 1 |
| 50101 | ChaosCodePackageRestartCompleted | A code package restart has completed during a Chaos testing session | Testability | Informational | 1 |

**Chaos partition events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 50069 | ChaosPartitionPrimaryMoveScheduled | A primary partition has scheduled to move as part of a Chaos testing session | Testability | Informational | 1 |
| 50077 | ChaosPartitionSecondaryMoveScheduled | A secondary partition has scheduled to move as part of a Chaos testing session | Testability | Informational | 1 |
| 65003 | PartitionPrimaryMoveAnalysis | The deeper analysis of the primary partition move is available | Testability | Informational | 1 |

**Chaos replica events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 50047 | ChaosReplicaRestartScheduled | A replica restart has been scheduled as part of a Chaos testing session | Testability | Informational | 1 |
| 50051 | ChaosReplicaRemovalScheduled | A replica removal has been scheduled as part of a Chaos testing session | Testability | Informational | 1 |
| 50093 | ChaosReplicaRemovalCompleted | A replica removal has completed as part of a Chaos testing session | Testability | Informational | 1 |

## Other events

**Correlation events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 65011 | CorrelationOperational | A correlation has been detacted | Testability | Informational | 1 |

## Events prior to version 6.2

Here is a comprehensive list of events provided by Service Fabric prior to version 6.2.

| EventId | Name | Source (Task) | Level |
| --- | --- | --- | --- |
| 25620 | NodeOpening | FabricNode | Informational |
| 25621 | NodeOpenedSuccess | FabricNode | Informational |
| 25622 | NodeOpenedFailed | FabricNode | Informational |
| 25623 | NodeClosing | FabricNode | Informational |
| 25624 | NodeClosed | FabricNode | Informational |
| 25625 | NodeAborting | FabricNode | Informational |
| 25626 | NodeAborted | FabricNode | Informational |
| 29627 | ClusterUpgradeStart | CM | Informational |
| 29628 | ClusterUpgradeComplete | CM | Informational |
| 29629 | ClusterUpgradeRollback | CM | Informational |
| 29630 | ClusterUpgradeRollbackComplete | CM | Informational |
| 29631 | ClusterUpgradeDomainComplete | CM | Informational |
| 23074 | ContainerActivated | Hosting | Informational |
| 23075 | ContainerDeactivated | Hosting | Informational |
| 29620 | ApplicationCreated | CM | Informational |
| 29621 | ApplicationUpgradeStart | CM | Informational |
| 29622 | ApplicationUpgradeComplete | CM | Informational |
| 29623 | ApplicationUpgradeRollback | CM | Informational |
| 29624 | ApplicationUpgradeRollbackComplete | CM | Informational |
| 29625 | ApplicationDeleted | CM | Informational |
| 29626 | ApplicationUpgradeDomainComplete | CM | Informational |
| 18566 | ServiceCreated | FM | Informational |
| 18567 | ServiceDeleted | FM | Informational |

## Next steps

* Get an overview of [diagnostics in Service Fabric](service-fabric-diagnostics-overview.md)
* Learn more about the EventStore in [Service Fabric Eventstore Overview](service-fabric-diagnostics-eventstore.md)
* Modifying your [Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md) configuration to collect more logs
* [Setting up Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) to see your Operational channel logs
