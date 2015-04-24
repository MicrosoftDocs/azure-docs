<properties
   pageTitle="Diagnose and troubleshoot a Service Fabric service"
   description="Conceptual information and tutorials that help you understand how to diagnose and troubleshoot a Service Fabric service."
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
   ms.date="04/21/2015"
   ms.author="ryanwi"/>

# Diagnose and troubleshoot a Service Fabric service
Monitoring, detecting, diagnosing and troubleshooting allows for services to continue with minimal disruption to user experience. To learn more, read:

- [How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
- [Troubleshooting Application Upgrade Failures](service-fabric-application-upgrade-troubleshooting.md)

## Health model
Service Fabric introduces a health model that provides a rich, flexible and extensible reporting and evaluation functionality for Service Fabric entities. Service Fabric components report health out of the box on all entities. User services can enrich the health data with information specific to their logic, reported on themselves or other entities in the cluster. To learn more, read:

- [Introduction to Service Fabric Health Monitoring](service-fabric-health-introduction.md)
- [How to view Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)
- [Using System health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
- [Adding custom Service Fabric health reports](service-fabric-report-health.md)
