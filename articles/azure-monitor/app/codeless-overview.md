---
title: Autoinstrumentation for Azure Monitor Application Insights
description: Overview of autoinstrumentation for Azure Monitor Application Insights codeless application performance management.
ms.topic: conceptual
ms.custom: devx-track-js
ms.date: 10/10/2023
ms.reviewer: abinetabate
---

# What is autoinstrumentation for Azure Monitor Application Insights?

Autoinstrumentation enables [Application Insights](app-insights-overview.md) to make [telemetry](data-model-complete.md) like metrics, requests, and dependencies available in your [Application Insights resource](create-workspace-resource.md). It provides easy access to experiences such as the [application dashboard](overview-dashboard.md) and [application map](app-map.md).

If your language and platform are supported, select the corresponding link in the [Supported environments, languages, and resource providers table](#supported-environments-languages-and-resource-providers) for more detailed information. In many cases, autoinstrumentation is enabled by default.

## What are the autoinstrumentation advantages?

> [!div class="checklist"]
> - Code changes aren't required.
> - Access to source code isn't required.
> - Configuration changes aren't required.
> - Ongoing [SDK update maintenance](sdk-support-guidance.md) is eliminated.

## Supported environments, languages, and resource providers

The following table shows the current state of autoinstrumentation availability.

Links are provided to more information for each supported scenario.

|Environment/Resource provider                    | .NET Framework                                                                                                                                 | .NET Core / .NET                                                                                                                               | Java                                                                                                                                               | Node.js                                                                       | Python                                                                                           |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
|Azure App Service on Windows - Publish as Code   | [ :white_check_mark: :link: ](azure-web-apps-net.md) ¹ | :x:                                                                                              |
|Azure App Service on Windows - Publish as Docker | [ :white_check_mark: ](https://azure.github.io/AppService/2022/04/11/windows-containers-app-insights-preview.html) ²        | :x:                                                                           | :x:                                                                                              |
|Azure App Service on Linux - Publish as Code     | :x:                                                                                                                                            | [ :white_check_mark: :link: ](azure-web-apps-net-core.md?tabs=linux) ¹                                                                        | [ :white_check_mark: :link: ](azure-web-apps-nodejs.md?tabs=linux)            | :x:                                                                                              |
|Azure App Service on Linux - Publish as Docker   | :x:                                                                                                                                            | :x:                                                                                                                                            | [ :white_check_mark: :link: ](azure-web-apps-java.md)                                                                                              | [ :white_check_mark: :link: ](azure-web-apps-nodejs.md?tabs=linux)            | :x:                                                                                              |
|Azure Functions - basic                          | [ :white_check_mark: :link: ](monitor-functions.md) ¹                        |
|Azure Functions - dependencies                   | :x:                                                                                                                                            | :x:                                                                                                                                            | [ :white_check_mark: :link: ](monitor-functions.md)                                                                       | :x:                                                                           | [ :white_check_mark: :link: ](monitor-functions.md#distributed-tracing-for-python-function-apps) |
|Azure Spring Cloud                               | :x:                                                                                                                                            | :x:                                                                                                                                            | [ :white_check_mark: :link: ](azure-web-apps-java.md)                                                                                              | :x:                                                                           | :x:                                                                                              |
|Azure Kubernetes Service (AKS)                   | :x:                                                                                                                                            | :x:                                                                                                                                            | [ :white_check_mark: :link: ](opentelemetry-enable.md?tabs=java)                                                                                   | :x:                                                                           | :x:                                                                                              |
|Azure VMs Windows                                | [ :white_check_mark: :link: ](azure-vm-vmss-apps.md) ²                                           | [ :white_check_mark: :link: ](opentelemetry-enable.md?tabs=java)                                                                                   | :x:                                                                           | :x:                                                                                              |
|On-premises VMs Windows                          | [ :white_check_mark: :link: ](application-insights-asp-net-agent.md) ³                           | [ :white_check_mark: :link: ](opentelemetry-enable.md?tabs=java)                                                                                   | :x:                                                                           | :x:                                                                                              |
|Standalone agent - any environment               | :x:                                                                                                                                            | :x:                                                                                                                                            | [ :white_check_mark: :link: ](opentelemetry-enable.md?tabs=java)                                                                                   | :x:                                                                           | :x:                                                                                              |

**Footnotes**
- ¹: Application Insights is on by default and enabled automatically.
- ²: This feature is in public preview. See [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
- ³: An agent must be deployed and configured.

> [!NOTE]
> Autoinstrumentation was known as "codeless attach" before October 2021.

## JavaScript (Web) SDK Loader Script injection by configuration

When using supported SDKs, you can enable SDK injection in configuration to automatically inject JavaScript (Web) SDK Loader Script onto each page.


   | Language   
   |	:---	|
   | [ASP.NET Core](./asp-net-core.md?tabs=netcorenew%2Cnetcore6#enable-client-side-telemetry-for-web-applications) |
   | [Node.js](./nodejs.md#automatic-web-instrumentationpreview) |
   | [Java](./java-standalone-config.md#browser-sdk-loader-preview) |

For other methods to instrument your application with the Application Insights JavaScript SDK, see [Get started with the JavaScript SDK](./javascript-sdk.md).

## Next steps

* [Application Insights overview](app-insights-overview.md)
* [Application Insights overview dashboard](overview-dashboard.md)
* [Application map](app-map.md)
