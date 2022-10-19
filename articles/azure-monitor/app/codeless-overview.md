---
title: Monitor your apps without code changes - auto-instrumentation for Azure Monitor Application Insights | Microsoft Docs
description: Overview of auto-instrumentation for Azure Monitor Application Insights - codeless application performance management
ms.topic: conceptual
ms.date: 08/31/2021
ms.reviewer: abinetabate
---

# What is auto-instrumentation for Azure Monitor application insights?

Auto-instrumentation allows you to enable application monitoring with Application Insights without changing your code.  

Application Insights is integrated with various resource providers and works on different environments. In essence, all you have to do is enable and - in some cases - configure the agent, which will collect the telemetry automatically. In no time, you'll see the metrics, requests, and dependencies in your Application Insights resource. This telemetry will allow you to spot the source of potential problems before they occur, and analyze the root cause with end-to-end transaction view.

> [!NOTE] 
> Auto-instrumentation used to be known as "codeless attach" before October 2021.


## Supported environments, languages, and resource providers

As we're adding new integrations, the auto-instrumentation capability matrix becomes complex. The table below shows you the current state of the matter as far as support for various resource providers, languages, and environments go.

|Environment/Resource Provider                    | .NET                                                                                                                       | .NET Core                                                                                                                  | Java                                                                                                                       | Node.js                                                          | Python  |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------|
|Azure App Service on Windows - Publish as Code   | :white_check_mark: <sup>[1](#OnBD)</sup> [link](./azure-web-apps-net.md)                                                                    | :white_check_mark: [^1] [link](./azure-web-apps-net-core.md)                                                               | :white_check_mark: [link](./azure-web-apps-java.md)                                                                        | :white_check_mark: [^1] [link](./azure-web-apps-nodejs.md)       | :x:     |
|Azure App Service on Windows - Publish as Docker | :white_check_mark: [^2] [link](https://azure.github.io/AppService/2022/04/11/windows-containers-app-insights-preview.html) | :white_check_mark: [^2] [link](https://azure.github.io/AppService/2022/04/11/windows-containers-app-insights-preview.html) | :white_check_mark: [^2] [link](https://azure.github.io/AppService/2022/04/11/windows-containers-app-insights-preview.html) | :x:                                                              | :x:     |
|Azure App Service on Linux                       | :no_entry: [^3]                                                                                                                     | :white_check_mark: [^2] [link](./azure-web-apps-net-core.md?tabs=linux)                                                    | :white_check_mark: [link](./azure-web-apps-java.md)                                                                        | :white_check_mark: [link](./azure-web-apps-nodejs.md?tabs=linux) | :x:     |
|Azure Functions - basic                          | GA, OnBD*                                       | GA, OnBD*       | GA, OnBD*       | GA, OnBD*       | GA, OnBD*       |
|Azure Functions - dependencies                   | :x:                                   | :x:   | Public Preview  | :x:   | Through [extension](monitor-functions.md#distributed-tracing-for-python-function-apps)      |
|Azure Spring Cloud                               | :x:                                   | :x:   | GA              | :x:   | —    |
|Azure Kubernetes Service (AKS)                   | :no_entry: [^3]                                          | Not supported   | Through agent   | Not supported   | Not supported   |
|Azure VMs Windows                                | Public Preview                                  | Public Preview  | Through agent   | Not supported   | Not supported   |
|On-Premises VMs Windows                          | GA, opt-in                                      | Public Preview  | Through agent   | Not supported   | Not supported   |
|Standalone agent - any env.                      | :x:                                   | :x:   | GA              | Not supported   | Not supported   |

[^1]: Application Insights will be enabled automatically.
[^2]: This feature is in public preview. [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)
[^3]: This combination is not available.

<a name="OnBD">1</a>: Application Insights is enabled automatically.

<a name="Preview">2</a>: This feature is in public preview. [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

<a name="NA">3</a>: This combination is not available.


## Azure Functions

The basic monitoring for Azure Functions is enabled by default to collect log, performance, error data, and HTTP requests. For Java applications, you can enable richer monitoring with distributed tracing and get the end-to-end transaction details. This functionality for Java is in public preview for Windows and you can [enable it in Azure portal](./monitor-functions.md).

## Azure Spring Cloud

### Java 
Application monitoring for Java apps running in Azure Spring Cloud is integrated into the portal, you can enable Application Insights directly from the Azure portal, both for the existing and newly created Azure Spring Cloud resources.  

## Azure Kubernetes Service (AKS)

Codeless instrumentation of Azure Kubernetes Service (AKS) is currently available for Java applications through the [standalone agent](./java-in-process-agent.md). 

## Azure Windows VMs and virtual machine scale set

Auto-instrumentation for Azure VMs and virtual machine scale set is available for [.NET](./azure-vm-vmss-apps.md) and [Java](./java-in-process-agent.md) - this experience isn't integrated into the portal. The monitoring is enabled through a few steps with a stand-alone solution and doesn't require any code changes.  

## On-premises servers
You can easily enable monitoring for your [on-premises Windows servers for .NET applications](./status-monitor-v2-overview.md) and for [Java apps](./java-in-process-agent.md).

## Other environments
The versatile Java standalone agent works on any environment, there's no need to instrument your code. [Follow the guide](./java-in-process-agent.md) to enable Application Insights and read about the amazing capabilities of the Java agent. The agent is in public preview and available on all regions. 

## Next steps

* [Application Insights Overview](./app-insights-overview.md)
* [Application map](./app-map.md)
* [End-to-end performance monitoring](../app/tutorial-performance.md)
