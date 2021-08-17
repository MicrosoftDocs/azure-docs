---
title: Monitor your apps without code changes - auto-instrumentation for Azure Monitor Application Insights | Microsoft Docs
description: Overview of auto-instrumentation for Azure Monitor Application Insights - codeless application performance management
ms.topic: conceptual
author: MS-jgol
ms.author: jgol
ms.date: 05/17/2021

ms.reviewer: mbullwin
---

# What is auto-instrumentation or codeless attach - Azure Monitor Application Insights?

Auto-instrumentation, or codeless attach, allows you to enable application monitoring with Application Insights without changing your code.  

Application Insights is integrated with various resource providers and works on different environments. In essence, all you have to do is enable and - in some cases - configure the agent, which will collect the telemetry automatically box. In no time, you'll see the metrics, data, and dependencies in your Application Insights resource, which will allow you to spot the source of potential problems before they occur, and analyze the root cause with end-to-end transaction view.

## Supported environments, languages, and resource providers

As we're adding additional integrations, the auto-instrumentation capability matrix becomes complex. The table below shows you the current state of the matter as far as support for various resource providers, languages, and environments go.

|Environment/Resource Provider          | .NET            | .NET Core       | Java            | Node.js         | Python          |
|---------------------------------------|-----------------|-----------------|-----------------|-----------------|-----------------|
|Azure App Service on Windows           | GA, OnBD*       | GA, opt-in      | Public Preview  | Public Preview  | Not supported   |
|Azure App Service on Linux             | N/A             | Not supported   | Public Preview  | Public Preview  | Not supported   |
|Azure Functions - basic                | GA, OnBD*       | GA, OnBD*       | GA, OnBD*       | GA, OnBD*       | GA, OnBD*       |
|Azure Functions Windows - dependencies | Not supported   | Not supported   | Public Preview  | Not supported   | Not supported   |
|Azure Spring Cloud                     | Not supported   | Not supported   | Public Preview  | Not supported   | Not supported   |
|Azure Kubernetes Service               | N/A             | In design       | Through agent   | In design       | Not supported   |
|Azure VMs Windows                      | Public Preview  | Not supported   | Through agent | Not supported   | Not supported   |
|On-Premises VMs Windows                | GA, opt-in      | Not supported   | Through agent   | Not supported   | Not supported   |
|Standalone agent - any env.            | Not supported   | Not supported   | GA              | Not supported   | Not supported   |

*OnBD is short for On by Default - the Application Insights will be enabled automatically once you deploy your app in supported environments. 

## Azure App Service

### Windows

Application monitoring on Azure App Service on Windows is available for **[.NET](./azure-web-apps.md?tabs=net)** (enabled by default), **[.NET Core](./azure-web-apps.md?tabs=netcore)**, **[Java](./azure-web-apps.md?tabs=java)** (in public preview), and **[Node.js](./azure-web-apps.md?tabs=nodejs)** applications. To monitor a Python app, add the [SDK](./opencensus-python.md) to your code.

> [!NOTE]
> Application monitoring is currently available for Windows code-based applications on App Service. Monitoring for apps on Windows Containers on App Service is not yet supported through the integration with Application Insights.

### Linux
You can enable monitoring for **[Java](./azure-web-apps.md?tabs=java)** and **[Node.js](./azure-web-apps.md?tabs=nodejs)** apps running on Linux in App Service through the portal - the experience for both languages is in public preview and available in all regions. 

For other languages - [.NET Core](./asp-net-core.md) and [Python](./opencensus-python.md), use the SDK.

## Azure Functions

The basic monitoring for Azure Functions is enabled by default to collects log, performance, error data, and HTTP requests. For Java applications, you can enable richer monitoring with distributed tracing and get the end-to-end transaction details. This functionality for Java is in public preview for Windows and you can [enable it in Azure portal](./monitor-functions.md).

## Azure Spring Cloud

### Java 
Application monitoring for Java apps running in Azure Spring Cloud is integrated into the portal, you can enable Application Insights directly from the Azure portal, both for the existing and newly created Azure Spring Cloud resources.  

## Azure Kubernetes Service

Codeless instrumentation of Azure Kubernetes Service is currently available for Java applications through the [standalone agent](./java-in-process-agent.md). 

## Azure Windows VMs and virtual machine scale set

Auto-instrumentation for Azure VMs and virtual machine scale set is available for [.NET](./azure-vm-vmss-apps.md) and [Java](./java-in-process-agent.md).  

## On-premises servers
You can easily enable monitoring for your [on-premises Windows servers for .NET applications](./status-monitor-v2-overview.md) and for [Java apps](./java-in-process-agent.md).

## Other environments
The versatile Java standalone agent works on any environment, there's no need to instrument your code. [Follow the guide](./java-in-process-agent.md) to enable Application Insights and read about the amazing capabilities of the Java agent. The agent is in public preview and available on all regions. 

## Next steps

* [Application Insights Overview](./app-insights-overview.md)
* [Application map](./app-map.md)
* [End-to-end performance monitoring](../app/tutorial-performance.md)
