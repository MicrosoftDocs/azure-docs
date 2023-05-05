---
title: Profile production apps in Azure with Application Insights Profiler
description: Identify the hot path in your web server code with a low-footprint profiler.
ms.contributor: charles.weininger
ms.topic: conceptual
ms.date: 07/15/2022
ms.reviewer: jogrima
---

# Profile production applications in Azure with Application Insights Profiler

Diagnosing performance issues can be difficult, especially when your application is running on a production environment in the cloud. The cloud is dynamic. Machines come and go, and user input and other conditions are constantly changing. There's also potential for high scale. Slow responses in your application could be caused by infrastructure, framework, or application code handling the request in the pipeline.

With Application Insights Profiler, you can capture and view performance traces for your application in all these dynamic situations. The process occurs automatically at scale and doesn't negatively affect your users. Profiler captures the following information so that you can easily identify performance issues while your app is running in Azure:

- Identifies the median, fastest, and slowest response times for each web request made by your customers.
- Helps you identify the "hot" code path spending the most time handling a particular web request.

Enable the Profiler on all your Azure applications to catch issues early and prevent your customers from being widely affected. When you enable Profiler, it gathers data with these triggers:

- **Sampling trigger**: Starts Profiler randomly about once an hour for two minutes.
- **CPU trigger**: Starts Profiler when the CPU usage percentage is over 80 percent.
- **Memory trigger**: Starts Profiler when memory usage is above 80 percent.

Each of these triggers can be configured, enabled, or disabled on the [Configure Profiler page](./profiler-settings.md#trigger-settings).

## Overhead and sampling algorithm

Profiler randomly runs two minutes per hour on each virtual machine hosting the application with Profiler enabled for capturing traces. When Profiler is running, it adds from 5 percent to 15 percent CPU overhead to the server.

## Supported in Profiler

Profiler works with .NET applications deployed on the following Azure services. View specific instructions for enabling Profiler for each service type in the following links.

| Compute platform | .NET (>= 4.6) | .NET Core | Java |
| ---------------- | ------------- | --------- | ---- |
| [Azure App Service](profiler.md) | Yes | Yes | No |
| [Azure Virtual Machines and Virtual Machine Scale Sets for Windows](profiler-vm.md) | Yes | Yes | No |
| [Azure Virtual Machines and Virtual Machine Scale Sets for Linux](profiler-aspnetcore-linux.md) | No | Yes | No |
| [Azure Cloud Services](profiler-cloudservice.md) | Yes | Yes | N/A |
| [Azure Container Instances for Windows](profiler-containers.md) | No | Yes | No |
| [Azure Container Instances for Linux](profiler-containers.md) | No | Yes | No |
| Kubernetes | No | Yes | No |
| [Azure Functions](./profiler-azure-functions.md) | Yes | Yes | No |
| Azure Spring Cloud | N/A | No | No |
| [Azure Service Fabric](profiler-servicefabric.md) | Yes | Yes | No |

If you've enabled Profiler but aren't seeing traces, see the [Troubleshooting guide](profiler-troubleshooting.md).

## Limitations

- **Data retention**: The default data retention period is five days.
- **Profiling web apps**:
   - Although you can use Profiler at no extra cost, your web app must be hosted in the basic tier of the Web Apps feature of Azure App Service, at minimum.
   - You can attach only one profiler to each web app.

## Next steps
Learn how to enable Profiler on your Azure service:
- [Azure App Service](./profiler.md)
- [Azure Functions app](./profiler-azure-functions.md)
- [Azure Cloud Services](./profiler-cloudservice.md)
- [Azure Service Fabric app](./profiler-servicefabric.md)
- [Azure Virtual Machines](./profiler-vm.md)
- [ASP.NET Core application hosted in Linux on Azure App Service](./profiler-aspnetcore-linux.md)
- [ASP.NET Core application running in containers](./profiler-containers.md)
