---
title: Profile production apps in Azure with Application Insights Profiler
description: Identify the hot path in your web server code with a low-footprint profiler
ms.contributor: charles.weininger
ms.topic: conceptual
ms.date: 07/06/2022
ms.reviewer: jogrima
---

# Profile production applications in Azure with Application Insights

Azure Application Insights Profiler provides performance traces for applications running in production in Azure. Profiler:
- Captures the data automatically at scale without negatively affecting your users. 
- Helps you identify the “hot” code path spending the most time handling a particular web request. 

## Enable Application Insights Profiler for your application

### Supported in Profiler

Profiler works with .NET applications deployed on the following Azure services. View specific instructions for enabling Profiler for each service type in the links below.

| Compute platform | .NET (>= 4.6) | .NET Core | Java |
| ---------------- | ------------- | --------- | ---- |
| [Azure App Service](profiler.md) | Yes | Yes | No |
| [Azure Virtual Machines and virtual machine scale sets for Windows](profiler-vm.md) | Yes | Yes | No |
| [Azure Virtual Machines and virtual machine scale sets for Linux](profiler-aspnetcore-linux.md) | No | Yes | No |
| [Azure Cloud Services](profiler-cloudservice.md) | Yes | Yes | N/A |
| [Azure Container Instances for Windows](profiler-containers.md) | No | Yes | No |
| [Azure Container Instances for Linux](profiler-containers.md) | No | Yes | No |
| Kubernetes | No | Yes | No |
| Azure Functions | Yes | Yes | No |
| Azure Spring Cloud | N/A | No | No |
| [Azure Service Fabric](profiler-servicefabric.md) | Yes | Yes | No |

If you've enabled Profiler but aren't seeing traces, check our [Troubleshooting guide](profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).

## Limitations

The default data retention period is five days. 

There are no charges for using the Profiler service. To use it, your web app must be hosted in the basic tier of the Web Apps feature of Azure App Service, at minimum.

## Overhead and sampling algorithm

Profiler randomly runs two minutes/hour on each virtual machine hosting the application with Profiler enabled for capturing traces. When Profiler is running, it adds from 5-15% CPU overhead to the server.

## Next steps
Enable Application Insights Profiler for your Azure application. Also see:
* [App Services](profiler.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric](profiler-servicefabric.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines and virtual machine scale sets](profiler-vm.md?toc=/azure/azure-monitor/toc.json)

[performance-blade]: ./media/profiler-overview/performance-blade-v2-examples.png
[trace-explorer]: ./media/profiler-overview/trace-explorer.png
