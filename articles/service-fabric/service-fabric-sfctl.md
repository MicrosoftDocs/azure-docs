---
title: Azure Service Fabric CLI- sfctl 
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands and subgroups.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl
Commands for managing Service Fabric clusters and entities. This version is compatible with Service Fabric 7.0 runtime.

Commands follow the noun-verb pattern. See subgroups for more information.

## Subgroups
|Subgroup|Description|
| --- | --- |
| [application](service-fabric-sfctl-application.md) | Create, delete, and manage applications and application types. |
| [chaos](service-fabric-sfctl-chaos.md) | Start, stop, and report on the chaos test service. |
| [cluster](service-fabric-sfctl-cluster.md) | Select, manage, and operate Service Fabric clusters. |
| [compose](service-fabric-sfctl-compose.md) | Create, delete, and manage Docker Compose applications. |
| [container](service-fabric-sfctl-container.md) | Run container related commands on a cluster node. |
| [events](service-fabric-sfctl-events.md) | Retrieve events from the events store (if EventStore service is already installed). |
| [is](service-fabric-sfctl-is.md) | Query and send commands to the infrastructure service. |
| [mesh](service-fabric-sfctl-mesh.md) | Delete and manage Service Fabric Mesh applications. |
| [node](service-fabric-sfctl-node.md) | Manage the nodes that form a cluster. |
| [partition](service-fabric-sfctl-partition.md) | Query and manage partitions for any service. |
| [property](service-fabric-sfctl-property.md) | Store and query properties under Service Fabric names. |
| [replica](service-fabric-sfctl-replica.md) | Manage the replicas that belong to service partitions. |
| [rpm](service-fabric-sfctl-rpm.md) | Query and send commands to the repair manager service. |
| [sa-cluster](service-fabric-sfctl-sa-cluster.md) | Manage stand-alone Service Fabric clusters. |
| [service](service-fabric-sfctl-service.md) | Create, delete and manage service, service types and service packages. |
| [settings](service-fabric-sfctl-settings.md) | Configure settings local to this instance of sfctl. |
| [store](service-fabric-sfctl-store.md) | Perform basic file level operations on the cluster image store. |

## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).