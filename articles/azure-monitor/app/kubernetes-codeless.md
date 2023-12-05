---
title: Monitor applications on AKS with Application Insights - Azure Monitor | Microsoft Docs
description: Azure Monitor integrates seamlessly with your application running on Azure Kubernetes Service and allows you to spot the problems with your apps quickly.
ms.topic: conceptual
ms.custom: devx-track-extended-java
ms.date: 11/15/2022
ms.reviewer: abinetabate
---

# Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights

> [!IMPORTANT]
> Currently, you can enable monitoring for your Java apps running on Azure Kubernetes Service (AKS) without instrumenting your code by using the [Java standalone agent](./opentelemetry-enable.md?tabs=java).
> While the solution to seamlessly enable application monitoring is in process for other languages, use the SDKs to monitor your apps running on AKS. Use [ASP.NET Core](./asp-net-core.md), [ASP.NET](./asp-net.md), [Node.js](./nodejs.md), [JavaScript](./javascript.md), and [Python](/previous-versions/azure/azure-monitor/app/opencensus-python).

## Application monitoring without instrumenting the code
Currently, only Java lets you enable application monitoring without instrumenting the code. To monitor applications in other languages, use the SDKs.

For a list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

## Java
After the Java agent is enabled, it automatically collects a multitude of requests, dependencies, logs, and metrics from the most widely used libraries and frameworks.

Follow [the detailed instructions](./opentelemetry-enable.md?tabs=java) to monitor your Java apps running in Kubernetes apps and other environments.

## Other languages

For the applications in other languages, we currently recommend using the SDKs:
* [ASP.NET Core](./asp-net-core.md)
* [ASP.NET](./asp-net.md)
* [Node.js](./nodejs.md) 
* [JavaScript](./javascript.md)
* [Python](/previous-versions/azure/azure-monitor/app/opencensus-python)

## Troubleshooting

Troubleshoot the following issue.

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Next steps

* Learn more about [Azure Monitor](../overview.md) and [Application Insights](./app-insights-overview.md).
* Get an overview of [distributed tracing](distributed-tracing-telemetry-correlation.md) and see what [Application Map](./app-map.md?tabs=net) can do for your business.
