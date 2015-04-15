<properties
   pageTitle="View Service Fabric entities aggregated health"
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
   ms.date="04/15/2015"
   ms.author="oanapl"/>

# View Azure Service Fabric entities aggregated health
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) comprised of health entities on which System components and watchdogs can report local conditions they are monitoring. The [Health Store](service-fabric-health-introduction.md#Health-Store) aggregates all health data to determine whether entities are healthy.

Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md).

Service Fabric allows multiple ways to get the entities aggregated health: issue health queries through Powerhsell/API/REST, issue general queries through Powershell/API/REST and through tools like ServiceFabricExplorer.

## Health Queries
Service Fabric exposes health queries for each of the supported [entity types](service-fabric-health-introduction.md#Health-Entities-and-Hierarchy). They can be accessed trough API (methods on FabricClient.HealthClient), Powershell cmdlets and REST.
These queries return complete health information about the entity, including aggregated health state, health events reported on the entity, children health states (when applicable) and unhealthy evaluations in case the entity is not healthy.

> [AZURE.NOTE] A health entity is returned to the user when it is completely populated in the health store: the entity has a System report, it's active and parent entities on the hierarchy chain have System reports. If any of these conditions is not satisfied, the health queries return an exception showing why the entity is not returned.

The health queries require passing in the entity identifier, which depends on the entity type. They accept optional health policy parameters. If not specified, the [health policies](service-fabric-health-introduction.md#health-policies) from cluster or application manifest are used for evaluation. They also accept filters for returning only partial children or events, the ones that respect the specified filters.

> [AZURE.NOTE] The output filters are applied on the server side, so the message reply size is reduced. It is recommended to use the filters to limit the data returned rather than apply filters on the client side.

### Entity health
An entity health contains the following information:
- The aggregated health state of the entity. This is computed by the Health Store based on entity health reports, children health states (when applicable) and health policies. Read more at [Entity health evaluation](service-fabric-health-introduction.md#entity-health-evaluation).  
- The health events on the entity.
- For the entities that can have children, collection of health states for all children. The health states contain the entity identifier and the aggregated health state.
- If the entity is not healthy, the unhealthy evaluations which point to the report that triggered the state of the entity.

### Health events
The health events are generated from [health reports](service-fabric-report-health.md#health-reports), with added metadata for:
- SourceUtcTimestamp: the time the report was given to the health client (Utc)
- LastModifiedUtcTimestamp: the time the report was last modified on the server side (Utc)
- IsExpired: flag to indicate whether the report was expired at the time the query was executed by the Health Store. An event can be expired only if RemoveWhenExpired is false; otherwise, it wouldn't be used for evaluation.
- LastOkTransitionAt, LastWarningTransitionAt, LastErrorTransitionAt: last time for Ok/Warning/Error transitions. These fields give the histore of the transition of the health states for the event.

The state transition fields can be used for smarter alerting or "historical" health event information. They enable scenarios like:
- Alert when a property has been at Warning/Error for more than X minutes. This avoids alerting on temporary conditions.Eg: alert if the health state has been Warning for more than 5 minutes can be translated into (HealthState == Warning and Now - LastWarningTransitionTime > 5 minutes).
- Alert on conditions that changed in the last X minutes. If a report is at Error since before that, it can be ignored.
- If a property is toggling between Warning and Error, determine how long it has been unhealthy (i.e. not Ok). Eg: alert if the property wasn't healthy for more than 5 minutes can be translated into: (HealthState != Ok and Now - LastOkTransitionTime > 5 minutes).

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
