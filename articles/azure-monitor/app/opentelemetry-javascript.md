---
title: Azure Monitor OpenTelemetry for JavaScript | Microsoft Docs
description: Provides guidance on how to enable Azure Monitor on JavaScript Applications using OpenTelemetry
ms.topic: conceptual
ms.date: 09/28/2021
author: mattmccleary
ms.author: mmcc
---

# Azure Monitor OpenTelemetry Exporter for JavaScript applications (Preview)

This article describes how to enable and configure the OpenTelemetry-based Azure Monitor Preview offering. When you complete the instructions in this article, you’ll be able to use Azure Monitor Application Insights to monitor your application.

> [!IMPORTANT]
> We currently recommend OpenTelemetry JavaScript for Node.js environments only. Use the [Application Insights JavaScript SDK](javascript.md) for web/browser.

## Limitations of preview release

Please consider carefully whether this preview is right for you. It enables distributed tracing only and _excludes_ the following:
 - Metrics API (custom metrics, [Pre-aggregated metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics))
 - [Live Metrics](live-stream.md)
 - Logging API (console logs, logging libraries, etc.)
 - Auto-capture of unhandled exceptions
 - Offline disk storage
 - [Azure AD Authentication](azure-ad-authentication.md)
 - Cloud Role Name and Cloud Role Instance Auto-population in Azure environments
 - [Sampling](sampling.md)
 
Those who require a full-feature experience should use the existing [Application Insights Node.js SDK](nodejs.md) until the OpenTelemetry-based offering matures.

## Get started

### Prerequisites

- JavaScript application using Node.js version X.X+
- [Azure Subscription](https://azure.microsoft.com/free/) (Free to create)
- [Application Insights Resource](create-workspace-resource.md#create-workspace-based-resource) (Free to create)

### Enable Azure Monitor Application Insights

**1. Install package**

Add code to xyz.file in your application

```javascript
Placeholder
```

**2. Add connection string**

Replace placeholder `<Your Connection String>` with YOUR connection string from Application Insights resource.

Find the connection string on your Application Insights Resource.

:::image type="content" source="media/opentelemetry/connection-string.png" alt-text="Screenshot of Application Insights Connection String.":::


**3. Confirm data is flowing**

Generate requests in your application and open your Application Insights Resource.

> [!NOTE]
> It may take a couple minutes for data to show up in the Portal.

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of Application Insights Overview tab with server requests and server response time highlighted.":::


> [!IMPORTANT]
> If you have two or more micro-services using the same connection string, you are required to set  role names to represent them properly on the Application Map.

> [!NOTE]
> OpenTelemetry does not populate operation name on dependency telemetry, which adversely impacts your experience in the Failures and Performance Blades. You can mitigate this impact by [joining request and dependency data in the Logs Blade](java-standalone-upgrade-from-2x.md#operation-name-on-dependencies).

## Set Cloud Role Name and Cloud Role Instance
You may set [Cloud Role Name](app-map.md#understanding-cloud-role-name-within-the-context-of-the-application-map) and Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. This updates Cloud Role Name and Cloud Role Instance from its default value to something that makes sense to your team. It will surface on the Application Map as the name underneath a node. Cloud Role Name uses `service.namespace` and `service.name` attributes (combined using `.` separator), though it falls back to `service.name` if `service.namespace` is not set. Cloud Role Instance uses the `service.instance.id` attribute value.

```javascript
Placeholder
```

For more information, see [GitHub Repo](link).

## Sampling

While sampling is supported in OpenTelemetry, it is not supported in Azure Monitor OpenTelemetry Exporter at this time.

> [!WARNING]
> Enabling sampling alongside the existing Application Insights SDKs will result in broken traces. It will also make standard and log-based metrics extremely inaccurate which will adversely impact all Application Insights experiences.

## Instrumentation libraries
The following libraries are validated to work with the Preview Release:

> [!WARNING]
> Instrumentation libraries are based on experimental OpenTelemetry specifications. Microsoft’s **preview** support commitment is to ensure the libraries listed below emit data to Azure Monitor Application Insights, but it’s possible that breaking changes or experimental mapping will block some data elements.

### HTTP
- XYZ (version X.X)

### Database
- XYZ (version X.X)

> [!NOTE]
> The **preview** offering only includes instrumentations that handle HTTP and Database requests. See [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) to learn more.

## Modify telemetry

### Add span attributes
You may use X to add attributes to spans. These attributes may include adding a custom business dimension to your telemetry. You may also use attributes to set optional fields in the Application Insights Schema such as User ID or Client IP. Below are three examples that show common scenarios.

For more information, see [GitHub Repo](link).

#### Add custom dimension
Populate the _customDimensions_ field in the requests and dependencies table.

```javascript
Placeholder
```
<!---
#### Set User ID or Authenticated User ID
Populate the _user_Id_ or _user_Authenticatedid_ field in the requests, dependencies, and/or exceptions table. User ID is an anonymous user identifier and Authenticated User ID is a known user identifier.

> [!TIP]
> Instrument with the the [JavaScript SDK](javascript.md) to automatically populate User ID.

> [!IMPORTANT]
> Consult applicable privacy laws before setting Authenticated User ID.

```javascript
Placeholder
```
--->
#### Set user IP

Populate the _client_IP_ field in the requests and dependencies table. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

> [!TIP]
> Instrument with the the [JavaScript SDK](javascript.md) to automatically populate User IP.

```javascript
Placeholder
```

### Override span name

You may use X to override trace name. This updates Operation Name from its default value to something that makes sense to your team. It will surface on the Failures and Performance Blade when you pivot by Operations.

```javascript
Placeholder
```

For more information, see [GitHub Repo](link).

### Filter telemetry

You may use a Span Processor to filter out telemetry before leaving your application. Span Processors may be used to mask telemetry for privacy reasons or block unneeded telemetry to reduce ingestion costs.

```javascript
Placeholder
```

For more information, see [GitHub Repo](link).
<!---
### Get Trace ID or Span ID
You may use X or Y to get trace ID and/or span ID. Adding trace ID and/or span ID to existing logging telemetry enables better correlation when debugging and diagnosing issues.

> [!NOTE]
> If you are manually creating spans for log-based metrics and alerting, you will need to update them to use the metrics API (after it is released) to ensure accuracy.

```javascript
Placeholder
```

For more information, see [GitHub Repo](link).
--->
## Enable OTLP Exporter
You may want to enable the OTLP Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

Add the code to xyz.file in your application.

```javascript
Placeholder
```

> [!NOTE]
> OTLP exporter is shown for convenience only. We do not officially support the OTLP Exporter or any components or third-party experiences downstream of it. We suggest you [open an issue with the OpenTelemetry community](https://github.com/open-telemetry/opentelemetry-js/issues/new/choose) for OpenTelemetry issues outside the Azure Support Boundary.

## Troubleshooting

### Enable diagnostic logging
Placeholder

### Known issues
Placeholder 

## Support

- Review troubleshooting steps in this article.
- For Azure support issues, file an Azure SDK GitHub issue or open an [Azure Support Ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry community](https://opentelemetry.io/community/) directly.

## OpenTelemetry feedback

- Fill out the OpenTelemetry community’s [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft a bit about yourself by joining our [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Add your feature requests to the [Azure Monitor Application Insights UserVoice](https://feedback.azure.com/forums/357324-azure-monitor-application-insights).

## Next steps

- [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter)
- [Azure Monitor Exporter NPM Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter)
- [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples/v1/javascript)
- [OpenTelemetry JavaScript GitHub Repository](https://github.com/open-telemetry/opentelemetry-js)
- [Enable web/browser user monitoring](javascript.md)
