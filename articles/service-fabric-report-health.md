<properties
   pageTitle="Report Health on Azure Service Fabric entities"
   description="Describes how to send Azure Service Fabric health reports against health entities: design and implementation"
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

# Report Health on Azure Service Fabric entities
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) designed to flag unhealthy conditions based on health reports sent by System components and watchdogs. The reporters are monitoring conditions of interest to them. They report on those conditions based on their local view. The [Health Store](service-fabric-health-introduction.md#Health-Store) aggregates health data sent by all reporters to determine whether entities are globally healthy. The model is intended to be rich, flexible and easy to use.
The quality of the health reports determines how accurate the health view of the cluster is. Therefore, some thought is needed to provide reports that capture conditions of interest in the best possible way.

To design and implement health reporting, watchdogs and System components must:
- Define the condition they are interested in, the way it is monitored and the impact on the cluster/application functionality. This defines the health report property and health state.
- Determine the [entity](service-fabric-health-introduction.md#Health-Entities-and-Hierarchy) the report applies to.
- Determine the report source. It's possible to report from:
  - The monitored Service Fabric service replica.
  - Internal watchdogs deployed as a Service Fabric service. Eg. a Service Fabric stateless service that monitors conditions and issues report. The watchdogs can be deployed an all nodes or can be affinitized to the monitored service).
  - Internal Watchdogs that run on the Service Fabric nodes but are **not** implemented as Service Fabric services.
  - External watchdogs that are probing the resource from **outside** the Service Fabric cluster. Eg. Gomez like monitoring service.
- Define a source used to identify the reporter.
- Determine how they prefer to report, either periodically or on transitions. The recommended way is periodically, as it requires simpler code and is therefore less prone to errors.
- Determine how long the report for unhealthy conditions should stay in health store and how it should be cleared. This defines the report time to live and remove on expiration behavior.

> [AZURE.NOTE] Out of the box, the cluster is populated with health reports sent by the system components. Read more at [Understand and troubleshoot with System health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md). The user reports must be sent on [health entities](service-fabric-health-introduction.md#health-entities-and-hierarchy) already created by the system.

Service Fabric allows sending health reports through API (FabricClient.HealthClient.ReportHealth), Powershell and REST. Internally, all methods use the HealthClient from within a FabricClient. There are configuration knobs to batch reports for improved performance.

## Health reports
The health reports for each of the entities in the cluster contain the following information:
- SourceId. A string that uniquely identifies the reporter of the health event.
- Entity identifier. Identifies the entity on which the report is applied on. It differs based on the [entity type](service-fabric-health-introduction.md#health-entities-and-hierarchy):
  - Cluster: none
  - Node: node name  (string).
  - Application:  application name (URI). Represents the name of the application instance deployed in the cluster.
  - Service: service name (URI). Represents the name of the service instance deployed in the cluster.
  - Partition: partition id (GUID). Represents the partition unique identifier.
  - Replica: the sateful service replica id or the stateless service instance id (Int64).
  - DeployedApplication: application name (URI) and node name (string).
  - DeployedServicePackage: application name (URI), node name (string) and service manifest name (string).
- Property. A string, not a fixed enumeration, that allows the reporter to categorize the health event for a specific property of the entity. For example, reporter A can report health on Node01 "storage" property and reporter B can report health on Node01 "connectivity" property. Both these reports are treated as separate health events in the health store for the Node01 entity.
- Description. A string that allows the reporter to provide detail information about the health event. SourceId, Property and HealthState should fully describe the report. The description adds human readable information about the report to make it easier for administrators and users to understand.
- Health State. An [enumeration](service-fabric-health-introduction.md#health-states) that describes the health state of the report. The accepted values are OK, Warning, and Error.
- Time to Live. A timespan value, specified in seconds, that indicates how long the health report is valid. Coupled with RemoveWhenExpired, it let's the HealthStore know how to evaluate expired events. By default, the value is infinite and the report is valid forever.
- RemoveWhenExpired. A boolean. If set to true, the health report is automatically removed from health store and it doesn't impact entity health evaluation. This is used when the report is valid for a period of time only and the reporter doesn't need to explicitly clear it out. It's also used to delete reports from health store. If set to false, the expired report is treated as an error on health evaluation. It signals to the health store that the source should report periodically on this property; if it doesn't, then there must be something wrong with the watchdog. This watchdog health is captured by considering the event as error.
- Sequence Number. A positive integer that needs to be ever increasing, as it represents the order of the reports. It is used by health store to detect stale reports, received late because of network delays or other issues. Reports are rejected if the sequence number is less or equal the latest applied one for the same entity, source and property. The sequence number is auto-generated if not specified. It is only necessary to put in the sequence number when reporting on state transitions: the source needs to remember what reports it sent and persist the information for recovery on failover.

Reports on the same entity from the same source and for the same property override previous reports.
