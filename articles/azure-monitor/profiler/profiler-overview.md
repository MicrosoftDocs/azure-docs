---
title: Profile production apps in Azure with Application Insights Profiler
description: Identify the hot path in your web server code with a low-footprint profiler
ms.contributor: charles.weininger
ms.topic: conceptual
ms.date: 07/15/2022
ms.reviewer: jogrima
---

# Profile production applications in Azure with Application Insights Profiler

Diagnosing performance issues can prove difficult, especially when your application is running on production environment in the cloud. The cloud is dynamic, with machines coming and going, user input and other conditions constantly changing, and the potential for high scale. Slow responses in your application could be caused by infrastructure, framework, or application code handling the request in the pipeline.

With Application Insights Profiler, you can capture and view performance traces for your application in all these dynamic situations, automatically at-scale, without negatively affecting your end users. The Profiler captures the following information so you can easily identify performance issues while your app is running in Azure:

- The median, fastest, and slowest response times for each web request made by your customers.
- Helps you identify the “hot” code path spending the most time handling a particular web request. 

Enable the Profiler on all of your Azure applications to catch issues early and prevent your customers from being widely impacted. When you enable the Profiler, it will gather data with these triggers:

- **Sampling Trigger**: starts the Profiler randomly about once an hour for 2 minutes.
- **CPU Trigger**: starts the Profiler when the CPU usage percentage is over 80%.
- **Memory Trigger**: starts the Profiler when memory usage is above 80%.

Each of these triggers can be configured, enabled, or disabled on the [Configure Profiler page](./profiler-settings.md#trigger-settings).

## Overhead and sampling algorithm

Profiler randomly runs two minutes/hour on each virtual machine hosting the application with Profiler enabled for capturing traces. When Profiler is running, it adds from 5-15% CPU overhead to the server.

## Supported in Profiler

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
| [Azure Functions](./profiler-azure-functions.md) | Yes | Yes | No |
| Azure Spring Cloud | N/A | No | No |
| [Azure Service Fabric](profiler-servicefabric.md) | Yes | Yes | No |

If you've enabled Profiler but aren't seeing traces, check our [Troubleshooting guide](profiler-troubleshooting.md).

## Limitations

- **Data retention**: The default data retention period is five days. 
- **Profiling web apps**: 
   - While you can use the Profiler at no extra cost, your web app must be hosted in the basic tier of the Web Apps feature of Azure App Service, at minimum.
   - You can only attach 1 profiler to each web app. 

## Next steps
Learn how to enable Profiler on your Azure service:
- [Azure App Service](./profiler.md)
- [Azure Functions app](./profiler-azure-functions.md)
- [Cloud Service](./profiler-cloudservice.md)
- [Service Fabric app](./profiler-servicefabric.md)
- [Azure Virtual Machine](./profiler-vm.md)
- [ASP.NET Core application hosted in Linux on Azure App Service](./profiler-aspnetcore-linux.md)
- [ASP.NET Core application running in containers](./profiler-containers.md)
