---
title: OpenTelemetry Overview | Microsoft Docs
description: Provides an overview of how to use OpenTelemetry with Azure Monitor
ms.topic: conceptual
ms.date: 08/12/2021
author: mattmccleary
ms.author: mmcc
---

# Azure Monitor OpenTelemetry Exporter for Python Applications **(Preview)**

This article describes how to enable and configure the OpenTelemetry-based Azure Monitor Preview offering. When you complete the instructions in this article, you’ll be able to use Azure Monitor Application Insights to monitor your application.

> [!WARNING]
> Please consider carefully whether this preview is right for you. It enables distributed tracing only and excludes custom metrics, live metrics, logs, profiler, snapshot debugger, offline disk storage, and AAD Authentication. Enabling sampling will result in broken traces if used alongside the existing Application Insights SDKs, and it will make standard and log-based metrics inaccurate. Dependency collection support is limited to select libraries listed below. This release is for early adopters who want to use OpenTelemetry’s vendor-neutral instrumentation to power basic experiences including the Application Map, Failures Blade, and Performance Blade. However, those who require a full-feature experience should use the existing Application Insights SDKs until the OpenTelemetry-based offering matures. 

## Get Started
### Prerequisites
- Python Application using version 3.6+
- Azure Subscription (Free to [create](https://azure.microsoft.com/free/))
- Application Insights Resource (Free to [create](https://docs.microsoft.com/azure/azure-monitor/app/create-workspace-resource#create-workspace-based-resource))

### Enable Azure Monitor Application Insights
1. Install package

Add code to xyz.file in your application

    ```python
    Placeholder
    ```
2. Add connection string

Replace placeholder connection string with YOUR connection string.

//language specific screen shot here

Find the connection string on your Application Insights Resource.

//screen shot

3. Confirm Data is Flowing
Generate requests in your application and open your Application Insights Resource.
It may take up to a couple minutes for data to start flowing.

//screen shot

## Enable OTLP Exporter
You may want to enable the OTLP Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

Add the code to xyz.file in your application.

    ```python
    Placeholder
    ```

> [!NOTE]
> OTLP exporter is shown for convenience only. We do not officially support the OTLP Exporter or any components or third-party experiences downstream of it. We suggest you open an issue with the OpenTelemetry community for OpenTelemetry issues outside the Azure Support Boundary.

## Sampling
OpenTelemetry SDKs provide built-in sampling as a way to control data volume and ingestion costs. Learn how to enable it [here](https://opentelemetry-python.readthedocs.io/en/latest/sdk/trace.sampling.html).

> [!WARNING]
> We do not recommend enabling sampling in the preview release because it will result in broken traces if used alongside the existing Application Insights SDKs and it will make standard and log-based metrics inaccurate.

## Modify Telemetry
### Filter Telemetry
You may use a Span Processor to filter out telemetry prior to leaving your application.

    ```python
    Placeholder
    ```

See [GitHub Repo](link) for more details.

### Set Cloud Role Name
You may use the Resource API to set Cloud Role Name.

    ```python
    Placeholder
    ```

See [GitHub Repo](link) for more details.

### Add Span Attributes
You may use X to add attributes such as business-specific dimensions.

    ```python
    Placeholder
    ```

See [GitHub Repo](link) for more details.

## Instrumentation Libraries
Microsoft has tested and validated that the following instrumentation libraries will work with the **Preview** Release.

> [!NOTE]
> Instrumentation libraries are based on experimental OpenTelemetry specifications. Microsoft’s **preview** support commitment is to ensure the libraries listed below emit data to Azure Monitor Application Insights, but it’s possible that breaking changes or experimental mapping will block some data elements.

### HTTP
- XYZ (version X.X)

### Database
- XYZ (version X.X)

> [!NOTE]
> The **preview** offering only includes instrumentations that handle HTTP and Database requests. In the future, we plan to support other request types. See [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) to learn more.

## Troubleshooting
### Enable Diagnostic Logging
Placeholder

## Support
- Review Troubleshooting steps in this article
- For Azure support issues, file an Azure SDK GitHub issue or open a CSS Ticket.
- For OpenTelemetry issues, reach out directly to the [OpenTelemetry community](https://opentelemetry.io/community/).

## Feedback
- Fill out the OpenTelemetry community’s [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft a bit about yourself by joining our [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Add your feature requests to the [Azure Monitor Application Insights UserVoice](https://feedback.azure.com/forums/357324-azure-monitor-application-insights).
- Open a GitHub issue against this official documentation page.

## Next Steps
- [Azure Monitor Exporter Github Repository](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-opentelemetry-exporter/README.md)
- [Azure Montor PyPI Package](https://pypi.org/project/pip/)
- [Azure Monitor Sample Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python)
- [OpenTelemetry Community Language GitHub Repository](https://github.com/open-telemetry/opentelemetry-python)
