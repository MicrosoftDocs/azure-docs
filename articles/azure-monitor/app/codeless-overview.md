---
title: Monitor your apps without code changes - auto-instrumentation for Azure Monitor Application Insights | Microsoft Docs
description: Overview of auto-instrumentation for Azure Monitor Application Insights - codeless application performance management
ms.topic: conceptual
author: MS-jgol
ms.author: jgol
ms.date: 05/31/2020

ms.reviewer: mbullwin
---

# What is auto-instrumentation or codeless attach - Azure Monitor Application Insights?

Auto-instrumentation, or codeless attach, allows you to enable application monitoring with Application Insights without changing your code.  

Application Insights is integrated with various resource providers and works on different environments. In essence, all you have to do is enable and - in some cases - configure the agent, which will collect the telemetry out of the box. In no time, you'll see the metrics, data, and dependencies in your Application Insights resource, which will allow you to spot the source of potential problems before they occur, and analyze the root cause with end-to-end transaction view.

## Supported environments, languages, and resource providers

As we're adding more and more integrations, the auto-instrumentation capability matrix becomes complex. The table below shows you the current state of the matter as far as support for various resource providers, languages, and environments go.

|Environment/Resource Provider | .NET            | .NET Core       | Java            | Node.js         |
|------------------------------|-----------------|-----------------|-----------------|-----------------|
|Azure App Service on Windows  | GA, OnBD*       | GA, opt-in      | Private Preview | Private Preview |
|Azure App Service on Linux    | N/A             | Not supported   | Public Preview  | Public Preview  |
|Azure App Service on AKS      | N/A             | In design       | In design       | In design       |
|Azure Functions - basic       | GA, OnBD*       | GA, OnBD*       | GA, OnBD*       | GA, OnBD*       |
|Azure Functions - dependencies| Not supported   | Not supported   | Public Preview  | Not supported   |
|Azure Kubernetes Service      | N/A             | In design       | Through agent   | In design       |
|Azure VMs Windows             | Public Preview  | Not supported   | Not supported   | Not supported   |
|On-Premises VMs Windows       | GA, opt-in      | Not supported   | Through agent   | Not supported   |
|Standalone agent - any env.   | Not supported   | Not supported   | Public Preview  | Not supported   |

*OnBD is short for On by Default - the Application Insights will be enabled automatically once you deploy your app in supported environments. 

## Azure App Service

### Windows

[Application monitoring on Azure App Service](https://docs.microsoft.com/azure/azure-monitor/app/azure-web-apps?tabs=net) is available for .NET application and is enabled by default, .NET Core can be enabled with one click, and Java and Node.js are in private preview.

### Linux 

Monitoring of Java and Node.js applications in App Service is in public preview and can be enabled in Azure portal, available in all regions.

## Azure Functions

The basic monitoring for Azure Functions is enabled by default to collects log, performance, error data, and HTTP requests. For Java applications, you can enable richer monitoring with distributed tracing and get the end-to-end transaction details. This functionality for Java is in public preview and you can [enable it in Azure portal](https://docs.microsoft.com/azure/azure-monitor/app/monitor-functions).

## Azure Kubernetes Service

Codeless instrumentation of Azure Kubernetes Service is currently available for Java applications through the [standalone agent](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent). 

## Azure Windows VMs and virtual machine scale set

[Auto-instrumentation for Azure VMs and virtual machine scale set](https://docs.microsoft.com/azure/azure-monitor/app/azure-vm-vmss-apps) is available for .NET applications 

## On-premises servers
You can easily enable monitoring for your [on-premises Windows servers for .NET applications](https://docs.microsoft.com/azure/azure-monitor/app/status-monitor-v2-overview) and for [Java apps](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent).

## Other environments
The versatile Java standalone agent works on any environment, there's no need to instrument your code. [Follow the guide](https://docs.microsoft.com/azure/azure-monitor/app/java-in-process-agent) to enable Application Insights and read about the amazing capabilities of the Java agent. The agent is in public preview and available on all regions. 

## Next steps

* [Application Insights Overview](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)
* [Application map](./../../azure-monitor/app/app-map.md)
* [End-to-end performance monitoring](./../../azure-monitor/learn/tutorial-performance.md)
