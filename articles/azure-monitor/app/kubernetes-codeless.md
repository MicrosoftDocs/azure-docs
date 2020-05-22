---
title: Monitor applications on Azure Kubernetes Service (AKS) with Application Insights - Azure Monitor | Microsoft Docs
description: Azure Monitor seamlessly integrates with your application running on Kubernetes, and allows you to spot the problems with your apps in no time.
ms.topic: conceptual
author: MS-jgol
ms.author: jgol
ms.date: 05/13/2020

---

# Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights

> [!IMPORTANT]
>  Currently you can enable monitoring for your Java apps running on Kubernetes without instrumenting your code - use the [Java standalone agent](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent). 
> While the solution to seamlessly enabling application monitoring is in the works for other languages, use the SDKs to monitor your apps running on AKS: [ASP.NET Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core), [ASP.NET](https://docs.microsoft.com/azure/azure-monitor/app/asp-net), [Node.js](https://docs.microsoft.com/azure/azure-monitor/app/nodejs), [JavaScript](https://docs.microsoft.com/azure/azure-monitor/app/javascript), and [Python](https://docs.microsoft.com/azure/azure-monitor/app/opencensus-python).

## Application monitoring without instrumenting the code
Currently, only Java lets you enable application monitoring without instrumenting the code. To monitor applications in other languages use the SDKs. 

## Java
Once enabled, the Java agent will automatically collect a multitude of requests, dependencies, logs, and metrics from the most widely used libraries and frameworks.

Follow [the detailed instructions](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent) to monitor your Java apps running in Kubernetes apps, as well as other environments. 

## Other languages

For the applications in other languages we currently recommend using the SDKs:
* [ASP.NET Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core)
* [ASP.NET](https://docs.microsoft.com/azure/azure-monitor/app/asp-net)
* [Node.js](https://docs.microsoft.com/azure/azure-monitor/app/nodejs) 
* [JavaScript](https://docs.microsoft.com/azure/azure-monitor/app/javascript)
* [Python](https://docs.microsoft.com/azure/azure-monitor/app/opencensus-python)

## Next steps

* Learn more about [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/overview) and [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)
* Get an overview of [Distributed Tracing](https://docs.microsoft.com/azure/azure-monitor/app/distributed-tracing) and see what [Application Map](https://docs.microsoft.com/azure/azure-monitor/app/app-map?tabs=net) can do for your business