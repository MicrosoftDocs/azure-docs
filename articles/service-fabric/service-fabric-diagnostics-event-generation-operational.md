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
ms.date: 04/25/2018
ms.author: dekapur

---

# List of Service Fabric events 

Service Fabric exposes a primary set of cluster events to inform you of the status of your cluster as [Service Fabric Events](service-fabric-diagnostics-events.md). These are based on actions performed by Service Fabric on your nodes and your cluster or management decisions made by a cluster owner/operator. These events can be accessed by querying the [EventStore](service-fabric-diagnostics-eventstore.md) in your cluster, or through the operational channel. On Windows machines, the operational channel is also hooked up to the EventLog - so you can see Service Fabric Events in Event Viewer. 

>[!NOTE]
>For a list of Service Fabric events for clusters in versions < 6.2, please refer to the following section. 

Here is a list of all the events available in the platform, sorted by the entity that they map to.

## Cluster events

**Cluster upgrade events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | --- | --- | --- | --- |
| 29627 | ClusterUpgradeStarted | A cluster upgrade has started | CM | Informational | 1 |
| 29628 | ClusterUpgradeCompleted | A cluster upgrade has completed| CM | Informational | 1 |
| 29629 | ClusterUpgradeRollbackStarted | A cluster upgrade has started to rollback | CM | Informational | 1 |
| 29630 | ClusterUpgradeRollbackCompleted | A cluster upgrade has completed rolling back | CM | Informational | 1 |
| 29631 | ClusterUpgradeDomainCompleted | A domain upgrade has completed during a cluster upgrade | CM | Informational | 1 |

## Node events

**Node lifecycle events** 

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 18602 | NodeDeactivateCompleted | Deactivation of a node has completed | FM | Informational | 1 |
| 18603 | NodeUp | The cluster has detected a node has started up | FM | Informational | 1 |
| 18604 | NodeDown | The cluster has detected a node has shut down |  FM | Informational | 1 |
| 18605 | NodeAddedToCluster | A new node has been added to the cluster | FM | Informational | 1 |
| 18606 | NodeRemovedFromCluster | A node has been removed from the cluster | FM | Informational | 1 |
| 18607 | NodeDeactivateStarted | Deactivation of a node has started | FM | Informational | 1 |
| 25620 | NodeOpening | A node is starting. First stage of the node lifecycle | FabricNode | Informational | 1 |
| 25621 | NodeOpenSucceeded | A node started successfully | FabricNode | Informational | 1 |
| 25622 | NodeOpenFailed | A node failed to start | FabricNode | Informational | 1 |
| 25623 | NodeClosing | A node is shutting down. Start of the final stage of the node lifecycle | FabricNode | Informational | 1 |
| 25624 | NodeClosed | A node shut down successfully | FabricNode | Informational | 1 |
| 25625 | NodeAborting | A node is starting to ungracefully shut down | FabricNode | Informational | 1 |
| 25626 | NodeAborted | A node has ungracefully shut down | FabricNode | Informational | 1 |

## Application events

**Application lifecycle events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 29620 | ApplicationCreated | A new application was created | CM | Informational | 1 |
| 29625 | ApplicationDeleted | An existing application was deleted | CM | Informational | 1 |
| 23083 | ApplicationProcessExited | A process within an application has exited | Hosting | Informational | 1 |

**Application upgrade events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 29621 | ApplicationUpgradeStarted | An application upgrade has started | CM | Informational | 1 |
| 29622 | ApplicationUpgradeCompleted | An application upgrade has completed | CM | Informational | 1 |
| 29623 | ApplicationUpgradeRollbackStarted | An application upgrade has started to rollback |CM | Informational | 1 |
| 29624 | ApplicationUpgradeRollbackCompleted | An application upgrade has completed rolling back | CM | Informational | 1 |
| 29626 | ApplicationUpgradeDomainCompleted | An domain upgrade has completed during an application upgrade | CM | Informational | 1 |

## Service events

**Service lifecycle events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 18657 | ServiceCreated | A new service was created | FM | Informational | 1 |
| 18658 | ServiceDeleted | An existing service was deleted | FM | Informational | 1 |

## Partition events

**Partition move events**

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 18940 | PartitionReconfigured | A partition reconfiguration has completed | RA | Informational | 1 |

## Container events

**Container lifecycle events** 

| EventId | Name | Description |Source (Task) | Level | Version |
| --- | --- | ---| --- | --- | --- |
| 23074 | ContainerActivated | A container has started | Hosting | Informational | 1 |
| 23075 | ContainerDeactivated | A container has stopped | Hosting | Informational | 1 |
| 23082 | ContainerExited | A container has exited - Check the UnexpectedTermination flag | Hosting | Informational | 1 |

## Health reports

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

* Learn more about overall [event generation at the platform level](service-fabric-diagnostics-event-generation-infra.md) in Service Fabric
* Modifying your [Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md) configuration to collect more logs
* [Setting up Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) to see your Operational channel logs
