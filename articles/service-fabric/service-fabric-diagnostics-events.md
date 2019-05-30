---
title: Azure Service Fabric Events | Microsoft Docs
description: Learn about the Service Fabric events provided out of the box to help you monitor your Azure Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: chackdan
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/21/2018
ms.author: srrengar
---

# Service Fabric events 

The Service Fabric platform writes several structured events for key operational activities happening within your cluster. These range from cluster upgrades to replica placement decisions. Each event that Service Fabric exposes maps to one of the following entities in the cluster:
* Cluster
* Application
* Service
* Partition
* Replica 
* Container

To see a full list of events exposed by the platform - [List of Service Fabric events](service-fabric-diagnostics-event-generation-operational.md).

Here are some examples of scenarios that you should see events for in your cluster. 
* Node lifecycle events: as nodes come up, go down, scale in/out, restart, and are activated/deactivated, these events will be exposed showing you what happened, and help you identify if there's something wrong with the machine itself or if there was an API that was called through SF to modify the status of a node.
* Cluster upgrade: as your cluster is upgraded (SF version or configuration change), you will see the upgrade initiate, roll through each of your Upgrade Domains, and complete (or rollback). 
* Application upgrades: just like cluster upgrades, there is a comprehensive set of events as the upgrade rolls through. These events can be useful to understand when an upgrade was scheduled, the current state of an upgrade, and the overall sequence of events. This is useful for looking back to see what upgrades have been rolled out successfully or whether a rollback was triggered.
* Application/Service deployment / deletion: there are events for each application, service, and container, being created or deleted and useful when scaling in or out e.g. increasing the number of replicas
* Partition moves (reconfiguration): whenever a stateful partition goes through a reconfiguration (a change in the replica set), an event is logged. This is useful if you are trying to understand how often your partition replica set is changing or failing over, or track which node was running your primary replica at any point in time.
* Chaos Events: when using Service Fabric's [Chaos](service-fabric-controlled-chaos.md) service, you will see events every time the service is started or stopped, or when it injects a fault in the system.
* Health Events: Service Fabric exposes health events every time a Warning or an Error health report is created, or an entity goes back to an OK health state, or a health report expires. These events are very helpful to track historical health statistics for an entity. 

## How to access events

There are a few different ways through which Service Fabric events can be accessed:
* The events are logged through standard channels such as ETW/Windows Event logs and can be visualized by any monitoring tool that supports these such as Azure Monitor logs. By default, clusters created in the portal have diagnostics turned on and have the Windows Azure diagnostics agent sending the events to Azure table storage, but you still need to integrate this with your log analytics resource. Read more about configuring the [Azure Diagnostics agent](service-fabric-diagnostics-event-aggregation-wad.md) to modify the diagnostics configuration of your cluster to pick up more logs or performance counters and the [Azure Monitor logs integration](service-fabric-diagnostics-event-analysis-oms.md)
* EventStore service's Rest APIs that allow you to query the cluster directly, or through the Service Fabric Client Library. See [Query EventStore APIs for cluster events](service-fabric-diagnostics-eventstore-query.md).

## Next steps
* More information on monitoring your cluster - [Monitoring the cluster and platform](service-fabric-diagnostics-event-generation-infra.md).
* Learn more about the EventStore service - [EventStore service overview](service-fabric-diagnostics-eventstore.md)
