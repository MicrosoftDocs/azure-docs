<properties
   pageTitle="How to View Service Fabric Entities Aggregated Health"
   description="Describes how to query, view and evaluate the Azure Service Fabric health entities"
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

# How to View Azure Service Fabric Entities Aggregated Health
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md)  comprised of health entities on which System components and watchdogs can report local conditions they are monitoring. The [Health Store](service-fabric-health-introduction.md#Health-Store) aggregates all health data to determine whether entities are healthy.

Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Understanding System Health Reports](service-fabric-understanding-system-health-reports.md).

Service Fabric allows multiple ways to get the entities aggregated health: use health queries through Powerhsell/API/REST, general queries through Powershell/API/REST and tools like ServiceFabricExplorer.

## Health Queries
Service Fabric exposes health queries for each of the supported [entity types](service-fabric-health-introduction.md#Health-Entities-and-Hierarchy). They can be accessed trough API (methods on FabricClient.HealthClient), Powershell cmdlets and REST.
These queries return complete health information about the entity, including aggregated health state, health events reported on the entity, children health states (when applicable) and unhealthy evaluations in case the entity is not healthy.

> [AZURE.NOTE] A health entity is returned to the user when it is completely populated in the health store: the entity has a System report, it's active and parent entities on the hierarchy chain have System reports. If any of these conditions is not satisfied, the health queries return an exception showing why the entity is not returned.

The health queries require passing in the entity identifier, which depends on the entity type. They accept optional health policy parameters. If not specified, the health policies from cluster or application manifest are used for evaluation. Read more about [Health Policies](service-fabric-health-introduction.md#Health-Policies). They also accept filters for returning only partial children or events, the ones that respect the specified filters.

### Entity Health
An entity health contains the following information:
- The aggregated health state of the entity. This is computed by the Health Store based on entity health reports, children health states (when applicable) and health policies. Read more at [Entity Health Evaluation](service-fabric-health-introduction.md#Entity-Health-Evaluation).  
- The health events on the entity. The events are generated from the health reports, with added metadata like last time the report had Ok/Warning/Error health state, last time it was modified, flag to show whether it is expired etc.
- For the entities that can have children, collection of health states for all children. The health states contain the entity identifier and the aggregated health state.
- If the entity is not healthy, the unhealthy evaluations which point to the actual report that triggered the state of the entity.

### Get Cluster Health
Returns the health of the cluster entity. Contains the health states of applications and the nodes children of the cluster.
Input:
- [optional] Application health policy map with health policies used to override the application manifest policies.
- [optional] Filter to return only events, nodes, applications with certain health state (eg. return only errors or warning or errors etc).  

## General Queries
Use general queries to get the list of Service Fabric entities. Exposed trough API (methods on FabricClient.QueryClient), Powershell cmdlets and REST. These queries aggregate sub-queries from multiple components. One of them is the [Health Store](service-fabric-health-introduction.md#Health-Store), which populates the aggregated health state for each query result.  

> [AZURE.NOTE] The general queries return the aggregated health state of the entity and do not contain the rich health data. If an entity is not healthy, you can follow up with health queries to get all health information, like events, children health states and unhealthy evaluations.

- Use Service Fabric Explorer or other tools that give a graphic view of the cluster and its entities. Internally, these tools use same mechanisms as above, general queries and health queries.

If the general queries return Unknown health state for an entity, it's possible that the Health Store doesn't have complete data about the entity or the sub-query to the Health Store wasn't successful (eg. communication error, health store was throttled etc). Follow up with a health query for the entity. This may succeed, if the sub-query encountered transient errors (eg. network issues), or will give more details about why the entity is not exposed from Health store.
