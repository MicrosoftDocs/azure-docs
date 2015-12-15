<properties
   pageTitle="Diagnose and troubleshoot a Service Fabric service | Microsoft Azure"
   description="Conceptual information and tutorials that help you diagnose, monitor, and troubleshoot a Service Fabric service."
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/25/2015"
   ms.author="ryanwi"/>

# Diagnose and monitor a Service Fabric service
Monitoring, detecting, diagnosing, and troubleshooting allows for services to continue with minimal disruption to the user experience. To learn more, read:

- [Monitor and diagnose services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
- [Troubleshooting Application Upgrade Failures](service-fabric-application-upgrade-troubleshooting.md)
- [Diagnostics and performance monitoring for Reliable Actors](service-fabric-reliable-actors-diagnostics.md)
- [Diagnostics and performance monitoring for Reliable Services](service-fabric-reliable-services-diagnostics.md)

## Troubleshoot a cluster
The following information will help you troubleshoot your local development cluster:

- [Troubleshoot your local development cluster setup](service-fabric-troubleshoot-local-cluster-setup.md)

## Health model
Azure Service Fabric introduces a health model that provides rich, flexible, and extensible reporting and evaluation functionality for Service Fabric entities. Service Fabric components report health out of the box on all entities. User services can enrich the health data with information specific to their logic, reported on themselves or other entities in the cluster. To learn more, read:

- [Introduction to Service Fabric health monitoring](service-fabric-health-introduction.md)
- [View Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)
- [Use system health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
- [Add custom Service Fabric health reports](service-fabric-report-health.md)
