---
title: Azure Monitor OpenTelemetry for .NET | Microsoft Docs
description: Provides guidance on how to enable Azure Monitor on .NET Applications using OpenTelemetry
ms.topic: conceptual
ms.date: 08/24/2021
author: mattmccleary
ms.author: mmcc
---

# Azure Monitor OpenTelemetry Exporter for .NET Applications **(Preview)**

This article describes how to enable and configure the OpenTelemetry-based Azure Monitor Preview offering. When you complete the instructions in this article, you’ll be able to use Azure Monitor Application Insights to monitor your application.

> [!WARNING]
> Please consider carefully whether this preview is right for you. It enables distributed tracing only and _excludes_ the following:
> - Metrics API (custom metrics, [Pre-aggregated metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics))
> - [Live Metrics](live-stream.md)
> - Logging API (console logs, logging libraries, etc.)
> - Auto-capture of unhandled exceptions
> - [Profiler](profiler-overview.md)
> - [Snapshot Debugger](snapshot-debugger.md)
> - Offline disk storage
> - [AAD Authentication](azure-ad-authentication.md)
>
> Those who require a full-feature experience should use the existing Application Insights [ASP.NET](asp-net.md) or [ASP.NET Core](asp-net-core.md) SDK until the OpenTelemetry-based offering matures.

> [!WARNING]
> Enabling sampling will result in broken traces if used alongside the existing Application Insights SDKs, and it will make standard and log-based metrics extremely inaccurate which will adversely impact all Application Insights experiences.

## Get Started
### Prerequisites
- Application using officially supported version of [.NET
  Core](https://dotnet.microsoft.com/download/dotnet) or [.NET
  Framework](https://dotnet.microsoft.com/download/dotnet-framework) except for
  versions lower than `.NET Framework 4.6.1`.
- Azure Subscription (Free to [create](https://azure.microsoft.com/free/))
- Application Insights Resource (Free to [create](create-workspace-resource.md#create-workspace-based-resource))

### Enable Azure Monitor Application Insights
**1. Getting Started**

Create a new console application as follows

```sh
dotnet new console --output getting-started
```

Install the latest [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) nuget package

```sh
dotnet add package Azure.Monitor.OpenTelemetry.Exporter
```

Copy the following code in `program.cs`

```csharp
using Azure.Monitor.OpenTelemetry.Exporter;
using System.Diagnostics;
using OpenTelemetry;
using OpenTelemetry.Trace;

public class Program
{
    private static readonly ActivitySource MyActivitySource = new ActivitySource(
        "OTel.AzureMonitor.Demo");

    public static void Main()
    {
        using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo")
            .AddAzureMonitorTraceExporter(o =>
            {
                o.ConnectionString = "<Your Connection String>";
            })
            .Build();

        using (var activity = MyActivitySource.StartActivity("TestActivity"))
        {
            activity?.SetTag("CustomTag1", "Value1");
            activity?.SetTag("CustomTag2", "Value2");
        }

        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
}
```
Replace placeholder `<Your Connection String>` with YOUR connection string from Application Insights resource.

**Note**: The above example shows how to collect traces in Azure Monitor using OpenTelemetry in console application. For details on how to configure OpenTelemetry for other types of applications such as ASP.NET and ASP.NET Core, refer to examples [here](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/examples). For all the application types extension method `AddAzureMonitorTraceExporter` to send data to application insights is applicable.



:::image type="content" source="media/opentelemetry-python/connection-string.png" alt-text="Screenshot of Application Insights Connection String.":::

**2. Confirm Data is Flowing**

Run your application and open your Application Insights Resource.

> [!NOTE]
> It may take a few minutes for data to show up in the Portal.

:::image type="content" source="media/opentelemetry-python/server-requests.png" alt-text="Screenshot of Application Insights Overview tab with server requests and server response time highlighted.":::


> [!IMPORTANT]
> If you have two or more micro-services using the same connection string, you are required to set cloud role names to represent them properly on the Application Map.

<!-- > [!NOTE]
> OpenTelemetry does not populate operation name on dependency telemetry, which adversely impacts your experience in the Failures and Performance Blades. You can mitigate this impact by [joining request and dependency data in the Logs Blade](java-standalone-upgrade-from-2x.md#operation-name-on-dependencies). -->

## Set Cloud Role Name and Cloud Role Instance
You may set Cloud Role Name and Cloud Role Instance by setting [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. This updates Cloud Role Name and Cloud Role Instance from its default value to something that makes sense to your team. It will surface on the Application Map as the name underneath a node. Cloud Role Name will be set to `service.namespace` and `service.name` attributes combined using `.` separator. By default the Cloud Role Name will be initialized by `service.name` if `service.namespace` attribute is not set. Cloud Role Instance will be set to `service.instance.id` attribute value.

```csharp
var resourceAttributes = new Dictionary<string, object> { { "service.name", "my-service" }, { "service.namespace", "my-namespace" }, {"service.instance.id", "my-instance" } };
var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);

using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .SetResourceBuilder(resourceBuilder) // Sets cloud_RoleName as my-namespace.my-service and cloud_RoleInstance as my-instance
            .AddSource("Azure.Monitor.Exporter.Test")
            .AddAzureMonitorTraceExporter(o =>
            {
                o.ConnectionString = "<Your Connection String>";
            })
            .Build();
```

Reference: [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md)

<!-- For more information, see [GitHub Repo](link). -->

## Sampling
OpenTelemetry SDKs provide built-in sampling as a way to control data volume and ingestion costs. To learn how to enable built-in sampling, see [OpenTelemetry Python SDK on trace sampling](https://opentelemetry-python.readthedocs.io/en/latest/sdk/trace.sampling.html).

> [!WARNING]
> We do not recommend enabling sampling in the preview release because it will result in broken traces if used alongside the existing Application Insights SDKs and it will make standard and log-based metrics extremely inaccurate which will adversely impact all Application Insights experiences.

## Instrumentation Libraries
Microsoft has tested and validated that the following instrumentation libraries will work with the **Preview** Release.

> [!WARNING]
> Instrumentation libraries are based on experimental OpenTelemetry specifications. Microsoft’s **preview** support commitment is to ensure the libraries listed below emit data to Azure Monitor Application Insights, but it’s possible that breaking changes or experimental mapping will block some data elements.

### HTTP
* [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.AspNet/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet/1.0.0-rc7)
* [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/1.0.0-rc7)
* [HTTP
  clients](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.Http/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/1.0.0-rc7)

### Database
- [SQL
  client](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Instrumentation.SqlClient/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient/1.0.0-rc7)

> [!NOTE]
> The **preview** offering only includes instrumentations that handle HTTP and Database requests. In the future, we plan to support other request types. See [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) to learn more.

## Modify Telemetry

### Add Activity Attributes
Activity attributes can be added using either of the following two options.
1. Enrich option provided by the instrumentation libraries. Refer to Readme document of individual [instrumentation libraries](#Instrumentation-Libraries) for more details.
2. Adding your custom processor:

If using custom processor, make sure to add the processor before the Azure monitor exporter as shown below in the code.

```csharp
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo")
            .AddProcessor(new ActivityEnrichingProcessor())
            .AddAzureMonitorTraceExporter(o =>
            {
                    o.ConnectionString = "<Your Connection String>"
            })
            .Build();
```

Add `ActivityEnrichingProcessor.cs` to your project with the code below.

```csharp
using System.Diagnostics;
using OpenTelemetry;
using OpenTelemetry.Trace;

public class MyProcessor : BaseProcessor<Activity>
    {
        private readonly string name;

        public MyProcessor(string name = "ActivityEnrichingProcesor")
        {
            this.name = name;
        }

        public override void OnEnd(Activity activity)
        {
            // Azure Monitor will receive the following updated activity.
            activity.DisplayName = "Updated-" + activity.DisplayName;
            activity.SetTag("CustomDimension1", "Value1");
            activity.SetTag("CustomDimension2", "Value2");
        }
    }
```
These attributes may include adding a custom business dimension to your telemetry. You may also use attributes to set optional fields in the Application Insights Schema such as <!--- User ID or ---> Client IP. Below are three examples that show common scenarios.

For more information, see [GitHub Repo](link).

#### Add Custom Dimension
Any [custom attributes](#Add-Activity-Attributes) which are added to activity will be exported as custom dimensions.

<!---
#### Set User ID or Authenticated User ID
Populate the _user_Id_ or _user_Authenticatedid_ field in the requests, dependencies, and/or exceptions table. User ID is an anonymous user identifier and Authenticated User ID is a known user identifier.

> [!TIP]
> Instrument with the the [JavaScript SDK](javascript.md) to automatically populate User ID.

> [!IMPORTANT]
> Consult applicable privacy laws before setting Authenticated User ID.

```C#
Placeholder
```
--->
#### Set User IP
You can populate the client_IP field for requests by setting `http.client_ip` attribute on activity. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

> [!TIP]
> Instrument with the the [JavaScript SDK](javascript.md) to automatically populate User IP.

### Override Activity Display Name
You may use Enrich option from [instrumentation libraries](#Instrumentation-Libraries) or custom processor shown [here](#Add-Activity-Attributes) to override Activity display name. This updates Operation Name from its default value to something that makes sense to your team. It will surface on the Failures and Performance Blade when you pivot by Operations.
NOTE: Operation for Dependency telemetry is not supported for preview.

**Note** : Operation name is only available for requests, Operation Name for dependencies will not be populated.

<!-- For more information, see [GitHub Repo](link). -->

### Filter Telemetry
You may use following two ways to filter out telemetry before leaving your application. 
1. Filter option provided by many instrumentation libraries. Refer to Readme document of individual [instrumentation libraries](#Instrumentation-Libraries) for more details.

2. Using custom processor:

```csharp
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo")
            .AddProcessor(new ActivityFilteringProcessor())
            .AddAzureMonitorTraceExporter(o =>
            {
                    o.ConnectionString = "<Your Connection String>"
            })
            .Build();
```

Add `ActivityFilteringProcessor.cs` to your project with the code below.

```csharp
using System.Diagnostics;
using OpenTelemetry;
using OpenTelemetry.Trace;

public class MyProcessor : BaseProcessor<Activity>
    {
        private readonly string name;

        public MyProcessor(string name = "FilteringProcessor")
        {
            this.name = name;
        }

        public override void OnStart(Activity activity)
        {
            activity.IsAllDataRequested = False;
        }
    }
```

For more information, see [GitHub Repo](link).
<!---
### Get Trace ID or Span ID
You may use X or Y to get trace ID and/or span ID. Adding trace ID and/or span ID to existing logging telemetry enables better correlation when debugging and diagnosing issues.

> [!NOTE]
> If you are manually creating spans for log-based metrics and alerting, you will need to update them to use the metrics API (after it is released) to ensure accuracy.

```C#
Placeholder
```

For more information, see [GitHub Repo](link).
--->

## Enable OTLP Exporter
You may want to enable the OTLP Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

```csharp
// sends data to Application Insights as well as OTLP
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo")
            .AddAzureMonitorTraceExporter(o =>
            {
                    o.ConnectionString = "<Your Connection String>"
            })
            .AddOtlpExporter()
            .Build();
```

> [!NOTE]
> OTLP exporter is shown for convenience only. We do not officially support the OTLP Exporter or any components or third-party experiences downstream of it. We suggest you open an issue with the OpenTelemetry community for OpenTelemetry issues outside the Azure Support Boundary.

## Troubleshooting
### Enable Diagnostic Logging
The Azure Monitor exporter logs event using the .NET EventSource to emit information. The exporter logs are available to any EventListener by opting into the source named "OpenTelemetry-TraceExporter-AzureMonitor".
For OpenTelemetry SDK refer [Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting)

## Support
- Review Troubleshooting steps in this article
- For Azure support issues, file an Azure SDK GitHub issue or open a CSS Ticket.
- For OpenTelemetry issues, contact the [OpenTelemetry community](https://opentelemetry.io/community/) directly.

## OpenTelemetry Feedback
- Fill out the OpenTelemetry community’s [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft a bit about yourself by joining our [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Add your feature requests to the [Azure Monitor Application Insights UserVoice](https://feedback.azure.com/forums/357324-azure-monitor-application-insights).

## Next Steps
- [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter)
- [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter/)
- [Azure Monitor Sample Application]()
- [OpenTelemetry .NET GitHub Repository](https://github.com/open-telemetry/opentelemetry-dotnet)
- [Enable web/browser user monitoring](javascript.md)
