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
The Health Store keeps health related information about entities in the cluster for easy retrieval and evaluation. It is implemented as a Service Fabric persisted stateful service to ensure high availability and scalability.

### Health Hierarchy
The health entities are organized in a logical hierarchy that captures interactions and dependencies between different entities. The entities and the hierarchy are automatically built by the Health Store based on reports received from the Service Fabric components.

> [AZURE.NOTE] The health entities mirror the Service Fabric entities (eg. health application entity matches an application instance deployed in the cluster, health node entity matches a Service Fabric cluster node). The health hierarchy captures the interactions of the system entities and is used for advanced health evaluation.

These entities allow an accurate, **granular** representation of the health of the many moving pieces in the cluster. The granularity makes it easier to detect issues and perform corrective actions. For example, if a service is not responding, it is feasible to report that the application instance is unhealthy, however it is not ideal because the issue might not be affecting all other services within that application. The availability of granular entities for reporting allows for more effective reporting and corrective actions to be taken to resolve the issue.
Pushing these decisions about how to report and respond to health at a granular level to design time makes large cloud services easier to debug, monitor, and subsequently operate.

The health hierarchy represents the latest state of the system based on the latest health reports, which is almost real-time information.
Internal and external watchdogs can report on the same entities based on application specific logic or custom monitored conditions. The user reports co-exist with the system reports.

### Entity Evaluation
Users or automated services can evaluate any entity at any point in time. When asked to evaluate the health of an entity, the Health Store aggregates all health reports on the entity and also evaluates its children. The health aggregation algorithm uses the health policies specified in the cluster or the application configurations. The health evaluation policies can also be passed in in the evaluate requests.

### Health States
Service Fabric uses three health states to describe whether an entity is healthy or not. Any report sent to the Health Store must specify one of these states. Any entity evaluation results in one of this states. The possible health states are:
- Ok: The entity is healthy. There are no known issues noticed or reported.
- Warning: The entity experiences some issues but is not yet unhealthy (i.e., unexpected delay that  it is not causing any functional issue and may fix itself without any special intervention).
- Error: The entity is unhealthy. Action should be taken to fix the state of the entity, as it can't function properly.

### Health Reporting
As mentioned, system components and internal/external wathdogs can report against the system entities.
When reporting, the *reporters* make a **local** determination of the health of the monitored entity based on some conditions they are monitoring. The *repoters* don't need to look at any global state to report aggregated, potentially useful information to a central store.

This allows the cloud services and the underlying Service Fabric platform to scale, because the monitoring and health determination is distributed among the different monitors within the cluster.
Other systems have a single centralized service at the cluster level parsing all the “potentially” useful information emitted by all services. This hinders their scalability and it doesn't allow them to collect very specific information to help identify issues and potential issues as close to the root cause as possible.
