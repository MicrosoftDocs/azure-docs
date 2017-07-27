---
title: Monitoring in Microsoft Azure | Microsoft Docs
description:  Choices when you want to monitor anything in Microsoft Azure. Azure Monitor, Application Insights Log Analytics
author: rboucher
manager: carmonm
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: 1b962c74-8d36-4778-b816-a893f738f92d
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/12/2017
ms.author: robb

---

# Overview of Monitoring in Microsoft Azure
This article provides an overview of tools available for monitoring Microsoft Azure. It applies to 
- monitoring applications running in Microsoft Azure 
- tools/services that run outside of Azure that can monitor objects in Azure. 

It discusses the various products and services available and how they work together. It can assist you to determine which tools are most appropriate for you in what cases.  

## Why use Monitoring and Diagnostics?

Performance issues in your cloud app can impact your business. With multiple interconnected components and frequent releases, degradations can happen at any time. And if you’re developing an app, your users usually discover issues that you didn’t find in testing. You should know about these issues immediately, and have tools for diagnosing and fixing the problems. Microsoft Azure has a range of tools for identifying these problems.

## How do I monitor my Azure cloud apps?

There is a range of tools for monitoring Azure applications and services. Some of their features overlap. This is partly for historical reasons and partly due to the blurring between development and operation of an application. 

Here are the principal tools:

-	**Azure Monitor** is basic tool for monitoring services running on Azure. It gives you infrastructure-level data about the throughput of a service and the surrounding environment. If you are managing your apps all in Azure, deciding whether to scale up or down resources, then Azure Monitor gives you what you use to start.

-	**Application Insights** can be used for development and as a production monitoring solution. It works by installing a package into your app, and so gives you a more internal view of what’s going on. Its data includes response times of dependencies, exception traces, debugging snapshots, execution profiles. It provides powerful smart tools for analyzing all this telemetry both to help you debug an app and to help you understand what users are doing with it. You can tell whether a spike in response times is due to something in an app, or some external resourcing issue. If you use Visual Studio and the app is at fault, you can be taken right to the problem line(s) of code so you can fix it.  

-	**Log Analytics** is for those who need to tune performance and plan maintenance on applications running in production. It is based in Azure. It collects and aggregates data from many sources, though with a delay of 10 to 15 minutes. It provides a holistic IT management solution for Azure, on-premises, and third-party cloud-based infrastructure (such as Amazon Web Services). It provides richer tools to analyze data across more sources, allows complex queries across all logs, and can proactively alert on specified conditions.  You can even collect custom data into its central repository so can query and visualize it. 

-	**System Center Operations Manager (SCOM)** is for managing and monitoring large cloud installations. You might be already familiar with it as a management tool for on-premises Windows Sever and Hyper-V based-clouds, but it can also integrate with and manage Azure apps. Among other things, it can install Application Insights on existing live apps.  If an app goes down, it tells you in seconds. Note that Log Analytics does not replace SCOM. It works well in conjunction with it.  


## Accessing monitoring in the Azure portal
All Azure monitoring services are now available in a single UI pane. For more information on how to access this area, see [Get started with Azure Monitor](monitoring-get-started.md). 

You can also access monitoring functions for specific resources by highlighting those resources and drilling down into their monitoring options. 

## Examples of when to use which tool 

The following sections show some basic scenarios and which tools should be used together. 

### Scenario 1 – Fix errors in an Azure Application under development   

**The best option is to use Application Insights, Azure Monitor, and Visual Studio together**

Azure now provides the full power of the Visual Studio debugger in the cloud. Configure Azure Monitor to send telemetry to Application Insights. Enable Visual Studio to include the Application Insights SDK in your application. Once in Application Insights, you can use the Application Map to discover visually which parts of your running application are unhealthy or not. For those parts that are not healthy, errors and exceptions are already available for exploration. You can use the various analytics in Application Insights to go deeper. If you are not sure about the error, you can use the Visual Studio debugger to trace into code and pin point a problem further. 

For more information, see [Monitoring Web Apps](../application-insights/app-insights-azure-web-apps.md) and refer to the table of contents on the left for instructions on various types of apps and languages.  

### Scenario 2 – Debug an Azure .NET web application for errors that only show in production 

> [!NOTE]
> These features are in preview. 

**The best option is to use Application Insights and if possible Visual Studio for the full debugging experience.**

Use the Application Insights Snapshot Debugger to debug your app. When a certain error threshold occurs with production components, the system automatically captures telemetry in windows of time called “snapshots." The amount captured is safe for a production cloud because it’s small enough not to affect performance but significant enough to allow tracing.  The system can capture multiple snapshots. You can look at a point in time in the Azure portal or use Visual Studio for the full experience. With Visual Studio, developers can walk through that snapshot as if they were debugging in real-time. Local variables, parameters, memory, and frames are all available. Developers must be granted access to this production data via an RBAC role.  

For more information, see [Snapshot debugging](../application-insights/app-insights-snapshot-debugger.md). 

### Scenario 3 – Debug an Azure application that uses containers or microservices 

**Same as scenario 1. Use Application Insights, Azure Monitor, and Visual Studio together**
Application Insights also supports gathering telemetry from processes running inside containers and from microservices (Kubernetes, Docker, Azure Service Fabric). For more information, [see this video on debugging containers and microservices](https://go.microsoft.com/fwlink/?linkid=848184). 


### Scenario 4 – Fix performance issues in your Azure application

The [Application Insights profiler](../application-insights/app-insights-profiler.md) is designed to help troubleshoot these types of issues. You can identify and troubleshoot performance issues for applications running in App Services (Web Apps, Logic Apps, Mobile Apps, API Apps) and other compute resources such as Virtual Machines, Virtual machine scale sets (VMSS), Cloud Services, and Service Fabric. 

> [!NOTE]
> Ability to profile Virtual Machines, Virtual machine scale sets (VMSS), Cloud Services and Services Fabric is in preview.   

In addition, you are proactively notified by email about certain types of errors, such as slow page load times, by the Smart Detection tool.  You don’t need to do any configuration on this tool. For more information, see [Smart Detection - Performance Anomalies](../application-insights/app-insights-proactive-performance-diagnostics.md) and [Smart Detection - Performance Anomalies](https://azure.microsoft.com/blog/Enhancments-ApplicationInsights-SmartDetection/preview).



## Next steps
Learn more about

* [Azure Monitor in a video from Ignite 2016](https://myignite.microsoft.com/videos/4977)
* [Getting Started with Azure Monitor](monitoring-get-started.md)
* [Azure Diagnostics](../azure-diagnostics.md) if you are attempting to diagnose problems in your Cloud Service, Virtual Machine, Virtual machine scale set, or Service Fabric application.
* [Application Insights](https://azure.microsoft.com/documentation/services/application-insights/) if you are trying to diagnostic problems in your App Service Web app.
* [Log Analytics](https://azure.microsoft.com/documentation/services/log-analytics/) and the [Operations Management Suite](https://www.microsoft.com/oms/)
production monitoring solution