---
title: Azure Service Fabric Event List | Microsoft Docs
description: Comprehensive list of events provided by Azure Service Fabric to help monitor clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
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

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 29627 | ClusterUpgradeStartOperational | CM | Informational | 1 |
| 29628 | ClusterUpgradeCompleteOperational | CM | Informational | 1 |
| 29629 | ClusterUpgradeRollbackStartOperational | CM | Informational | 1 |
| 29630 | ClusterUpgradeRollbackCompleteOperational | CM | Informational | 1 |
| 29631 | ClusterUpgradeDomainCompleteOperational | CM | Informational | 1 |

**Cluster health report events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 54428 | ProcessClusterReportOperational | HM | Informational | 1 |
| 54437 | ExpiredClusterEventOperational | HM | Informational | 1 |

**Chaos service events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 50021 | ChaosStartedEvent | Testability | Informational | 1 |
| 50023 | ChaosStoppedEvent | Testability | Informational | 1 |

## Node events

**Node lifecycle events** 

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 18602 | DeactivateNodeCompletedOperational | FM | Informational | 1 |
| 18603 | NodeUpOperational | FM | Informational | 1 |
| 18604 | NodeDownOperational | FM | Informational | 1 |
| 18605 | NodeAddedOperational | FM | Informational | 1 |
| 18606 | NodeRemovedOperational | FM | Informational | 1 |
| 18607 | DeactivateNodeStartOperational | FM | Informational | 1 |
| 25620 | NodeOpening | FabricNode | Informational | 1 |
| 25621 | NodeOpenedSuccess | FabricNode | Informational | 1 |
| 25622 | NodeOpenedFailed | FabricNode | Informational | 1 |
| 25623 | NodeClosing | FabricNode | Informational | 1 |
| 25624 | NodeClosed | FabricNode | Informational | 1 |
| 25625 | NodeAborting | FabricNode | Informational | 1 |
| 25626 | NodeAborted | FabricNode | Informational | 1 |

**Node health report events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 54423 | ProcessNodeReportOperational | HM | Informational | 1 |
| 54432 | ExpiredNodeEventOperational | HM | Informational | 1 |

**Chaos node events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 50033 | ChaosRestartNodeFaultScheduledEvent | Testability | Informational | 1 |
| 50087 | ChaosRestartNodeFaultCompletedEvent | Testability | Informational | 1 |

## Application events

**Application lifecycle events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 29620 | ApplicationCreatedOperational | CM | Informational | 1 |
| 29625 | ApplicationDeletedOperational | CM | Informational | 1 |
| 23083 | ProcessExitedOperational | Hosting | Informational | 1 |

**Application upgrade events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 29621 | ApplicationUpgradeStartOperational | CM | Informational | 1 |
| 29622 | ApplicationUpgradeCompleteOperational | CM | Informational | 1 |
| 29623 | ApplicationUpgradeRollbackStartOperational | CM | Informational | 1 |
| 29624 | ApplicationUpgradeRollbackCompleteOperational | CM | Informational | 1 |
| 29626 | ApplicationUpgradeDomainCompleteOperational | CM | Informational | 1 |

**Application health report events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 54425 | ProcessApplicationReportOperational | HM | Informational | 1 |
| 54426 | ProcessDeployedApplicationReportOperational | HM | Informational | 1 |
| 54427 | ProcessDeployedServicePackageReportOperational | HM | Informational | 1 |
| 54434 | ExpiredApplicationEventOperational | HM | Informational | 1 |
| 54435 | ExpiredDeployedApplicationEventOperational | HM | Informational | 1 |
| 54436 | ExpiredDeployedServicePackageEventOperational | HM | Informational | 1 |

**Chaos application events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 50053 | ChaosRestartCodePackageFaultScheduledEvent | Testability | Informational | 1 |
| 50101 | ChaosRestartCodePackageFaultCompletedEvent | Testability | Informational | 1 |

## Service events

**Service lifecycle events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 18602 | ServiceCreatedOperational | FM | Informational | 1 |
| 18658 | ServiceDeletedOperational | FM | Informational | 1 |

**Service health report events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 54424 | ProcessServiceReportOperational | HM | Informational | 1 |
| 54433 | ExpiredServiceEventOperational | HM | Informational | 1 |

## Partition events

**Partition move events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 18940 | ReconfigurationCompleted | RA | Informational | 1 |

**Partition health report events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 54422 | ProcessPartitionReportOperational | HM | Informational | 1 |
| 54431 | ExpiredPartitionEventOperational | HM | Informational | 1 |

**Chaos partition events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 50069 | ChaosMovePrimaryFaultScheduledEvent | Testability | Informational | 1 |
| 50077 | ChaosMoveSecondaryFaultScheduledEvent | Testability | Informational | 1 |

**Partition analysis events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 65003 | PrimaryMoveAnalysisEvent | Testability | Informational | 1 |

## Replica events

**Replica health report events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 54429 | ProcessStatefulReplicaReportOperational | HM | Informational | 1 |
| 54430 | ProcessStatelessInstanceReportOperational | HM | Informational | 1 |
| 54438 | ExpiredStatefulReplicaEventOperational | HM | Informational | 1 |
| 54439 | ExpiredStatelessInstanceEventOperational | HM | Informational | 1 |

**Chaos replica events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 50047 | ChaosRestartReplicaFaultScheduledEvent | Testability | Informational | 1 |
| 50051 | ChaosRemoveReplicaFaultScheduledEvent | Testability | Informational | 1 |
| 50093 | ChaosRemoveReplicaFaultCompletedEvent | Testability | Informational | 1 |

## Container events

**Container lifecycle events** 

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 23074 | ContainerActivatedOperational | Hosting | Informational | 1 |
| 23075 | ContainerDeactivatedOperational | Hosting | Informational | 1 |
| 23082 | ContainerExitedOperational | Hosting | Informational | 1 |

## Other events

**Correlation events**

| EventId | Name | Source (Task) | Level | Version |
| --- | --- | --- | --- | --- |
| 65011 | CorrelationOperational | Testability | Informational | 1 |

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
