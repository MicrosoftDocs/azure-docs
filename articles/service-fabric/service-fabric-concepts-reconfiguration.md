---
title: Reconfiguration in Azure Service Fabric 
description: Learn about configurations for stateful service replicas and the process of reconfiguration Service Fabric uses to maintain consistency and availability during the change.
author: appi101

ms.topic: conceptual
ms.date: 01/10/2018
ms.author: aprameyr
---

# Reconfiguration in Azure Service Fabric
A *configuration* is defined as the replicas and their roles for a partition of a stateful service.

A *reconfiguration* is the process of moving one configuration to another configuration. It makes a change to the replica set for a partition of a stateful service. The old configuration is called the *previous configuration (PC)*, and the new configuration is called the *current configuration (CC)*. The reconfiguration protocol in Azure Service Fabric preserves consistency and maintains availability during any changes to the replica set.

Failover Manager initiates reconfigurations in response to different events in the system. For instance, if the primary fails then a reconfiguration is initiated to promote an active secondary to a primary. Another example is in response to application upgrades when it might be necessary to move the primary to another node in order to upgrade the node.

## Reconfiguration types
Reconfigurations can be classified into two types:

- Reconfigurations where the primary is changing:
    - **Failover**: Failovers are reconfigurations in response to the failure of a running primary.
    - **SwapPrimary**: Swaps are reconfigurations where Service Fabric needs to move a running primary from one node to another, usually in response to load balancing or an upgrade.

- Reconfigurations where the primary is not changing.

## Reconfiguration phases
A reconfiguration proceeds in several phases:

- **Phase0**: This phase happens in swap-primary reconfigurations where the current primary transfers its state to the new primary and transitions to active secondary.

- **Phase1**: This phase happens during reconfigurations where the primary is changing. During this phase, Service Fabric identifies the correct primary among the current replicas. This phase is not needed during swap-primary reconfigurations because the new primary has already been chosen. 

- **Phase2**: During this phase, Service Fabric ensures that all data is available in a majority of the replicas of the current configuration.

There are several other phases that are for internal use only.

## Stuck reconfigurations
Reconfigurations can get *stuck* for a variety of reasons. Some of the common reasons include:

- **Down replicas**: Some reconfiguration phases require a majority of the replicas in the configuration to be up.
- **Network or communication problems**: Reconfigurations require network connectivity between different nodes.
- **API failures**: The reconfiguration protocol requires that service implementations finish certain APIs. For example, not honoring the cancellation token in a reliable service causes SwapPrimary reconfigurations to get stuck.

Use health reports from system components, such as System.FM, System.RA, and System.RAP, to diagnose where a reconfiguration is stuck. The [system health report page](service-fabric-understand-and-troubleshoot-with-system-health-reports.md) describes these health reports.

## Next steps
For more information on Service Fabric concepts, see the following articles:

- [Reliable Services lifecycle - C#](service-fabric-reliable-services-lifecycle.md)
- [System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
- [Replicas and instances](service-fabric-concepts-replica-lifecycle.md)
