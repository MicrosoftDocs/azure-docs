---
title: OpenTelemetry on Azure 
description: This article provides an overview of OpenTelemetry on Azure.
ms.topic: conceptual
ms.date: 06/21/2024
ms.reviewer: quying
---

# OpenTelemetry on Azure

Azure's integration with OpenTelemetry provides a suite of products for:

> [!div class="checklist"]
> - Collection of telemetry data in a standardized way
> - Consumption of data using curated experiences on Azure Monitor and local tools

This article guides you through our OpenTelemetry offerings to help you understand Microsoft’s strategic investments.

For more information about OpenTelemetry on Azure, see [our OpenTelemetry Roadmap](https://techcommunity.microsoft.com/t5/azure-observability-blog/making-azure-the-best-place-to-observe-your-apps-with/ba-p/3995896).

## Data collection

The **Azure Monitor OpenTelemetry Distro** is Microsoft’s customized, supported, and open-sourced version of the OpenTelemetry software development kits (SDKs). It supports .NET, Java, JavaScript (Node.js), and Python. We recommend the Azure Monitor OpenTelemetry Distro for most customers, and we continue to invest in adding new capabilities to it.

It focuses on ease-of-enablement by bundling together:

> [!div class="checklist"]
> - The OpenTelemetry SDK and API
> - Instrumentation Libraries across logs, metrics, and traces

In addition, Azure Monitor OpenTelemetry Distro-based automatic instrumentation solutions are integrated into App Service for Java and Python apps and into Java Functions.

- [Enable Azure Monitor OpenTelemetry for .NET, Java, Node.js, and Python applications](./opentelemetry-enable.md)
- [Diagnose with Live Metrics](./live-stream.md)
- [Migrating Azure Monitor Application Insights Python from OpenCensus to OpenTelemetry](./opentelemetry-python-opencensus-migrate.md)
- [Monitor Azure app services performance Python (Preview)](./azure-web-apps-python.md)
- [Monitor Azure app services performance Java](./azure-web-apps-java.md)
- [Monitor applications running on Azure Functions with Application Insights](./monitor-functions.md)

**Azure SDKs** are instrumented with OpenTelemetry APIs to power end-to-end observability. All supported languages are instrumented to emit OpenTelemetry HTTP and/or Messaging Tracing Semantics; .NET and Java are being instrumented to emit OpenTelemetry HTTP Metrics Semantics.

- [Azure SDK semantic conventions](https://github.com/Azure/azure-sdk/blob/main/docs/tracing/distributed-tracing-conventions.md)
- [Tracing in the Azure SDK for Java](/azure/developer/java/sdk/tracing)
- [Azure Cosmos DB SDK observability](/azure/cosmos-db/nosql/sdk-observability)

The **.NET** OpenTelemetry implementation uses logging, metrics, and activity APIs in the framework for instrumentation. The OpenTelemetry SDK collects telemetry from those APIs and other sources (via instrumentation libraries) and then exports the data to an application performance monitoring (APM) system for storage and analysis.

- [.NET Observability with OpenTelemetry](/dotnet/core/diagnostics/observability-with-otel)

**Azure Monitor pipeline at edge** is a powerful solution designed to facilitate high-scale data ingestion and routing from edge environments to seamlessly enable observability across cloud, edge, and multicloud. It uses the OpenTelemetry Collector. Currently, in public preview, it can be deployed on a single Arc-enabled Kubernetes cluster, and it can collect OpenTelemetry Protocol (OTLP) logs.

- [Accelerate your observability journey with Azure Monitor pipeline (preview)](https://techcommunity.microsoft.com/t5/azure-observability-blog/accelerate-your-observability-journey-with-azure-monitor/ba-p/4124852)
- [Configure Azure Monitor pipeline for edge and multicloud](../essentials/edge-pipeline-configure.md)

**OpenTelemetry Collector Azure Data Explorer Exporter** is a data exporter component that can be plugged into the OpenTelemetry Collector. It supports ingestion of data from many receivers into to Azure Data Explorer, Azure Synapse Data Explorer, and Real-Time Analytics in Fabric. 

- [Data ingestion from OpenTelemetry to Azure Data Explorer](/azure/data-explorer/open-telemetry-connector)
- [GitHub repository of Azure Data Explorer Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuredataexplorerexporter)
- [Azure Synapse Data Explorer](/azure/synapse-analytics/data-explorer/data-explorer-overview)
- [Real-Time Intelligence](/fabric/real-time-intelligence/overview)

**Azure Functions** allows exporting log and trace data in OTLP format. It supports telemetry from both the host process and the worker process. When enabled, the data can be sent to any OpenTelemetry-compliant endpoints.

- [Use OpenTelemetry with Azure Functions](/azure/azure-functions/opentelemetry-howto)
- [Monitor Azure Functions](/azure/azure-functions/monitor-functions)

## Data platform and consumption

**.NET Aspire** is an opinionated cloud-native stack that includes observability by default with OpenTelemetry. Part of it's a "Developer Dashboard" to observe OpenTelemetry signals in real-time during debugging. It collects logs, metrics, and traces using OTLP from applications of any OpenTelemetry-supported languages besides .NET.

- [.NET Aspire: Simplifying Cloud-Native Development with .NET 8](https://devblogs.microsoft.com/dotnet/introducing-dotnet-aspire-simplifying-cloud-native-development-with-dotnet-8/)
- [.NET Aspire dashboard overview](/dotnet/aspire/fundamentals/dashboard/overview)

**Azure Monitor Application Insights** is Azure’s APM that supports cloud-scale application monitoring and excels at observability for both cloud-native applications and VM-based applications. Application Insights provides experiences powered by OpenTelemetry to enhance the performance, reliability, and quality of your applications. For example, Application map is a visual overview of application architecture and components' interactions; Transaction search helps identify issues and optimize performance.

- [Application Insights overview](./app-insights-overview.md)
- [Application map in Azure Application Insights](./app-map.md)
- [Transaction Search and Diagnostics](./transaction-search-and-diagnostics.md)
- [Live Metrics](./live-stream.md)
