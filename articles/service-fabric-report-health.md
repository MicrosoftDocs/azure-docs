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
Service Fabric introduces a [Health Model](service-fabric-health-introduction.md) designed to flag unhealthy cluster or application conditions on specific entities to allow easy and fast diagnosis and repair. This is accomplished by using **health reporters** (System components and watchdogs). The reporters are monitoring conditions of interest to them. They report on those conditions based on their local view. The [Health Store](service-fabric-health-introduction.md#Health-Store) aggregates health data sent by all reporters to determine whether entities are globally healthy. The model is intended to be rich, flexible and easy to use.
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

## Implement health reporting
Once the health reporting design is clear, sending health reports is easy. It can be done through API using FabricClient.HealthClilent.ReportHealth, through Powershell and REST. Internally, all methods use a health client contained inside a fabric client.

> [AZURE.NOTE] Report health is sync and only represents the validation work on client side. The fact that the report is accepted by the health client doesn't mean it is applied in store; it will be sent asynchronously, possibly batched with other reports and the processing on the server may fail (eg. stale sequence number, the entity on which the report must be applied has been deleted etc).

### ReportHealth API
In order to report through API, users need to create a health report specific to the entity type they want to report on and then give it to a health client.
