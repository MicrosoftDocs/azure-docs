---
title: Azure Monitor OpenTelemetry for .NET | Microsoft Docs
description: Provides guidance on how to enable Azure Monitor on .NET Applications using OpenTelemetry
ms.topic: conceptual
ms.date: 09/28/2021
author: mattmccleary
ms.author: mmcc
---

# Azure Monitor OpenTelemetry Exporter for .NET applications (Preview)

This article describes how to enable and configure the OpenTelemetry-based Azure Monitor Preview offering. When you complete the instructions in this article, you will be able to send OpenTelemetry traces to Azure Monitor Application Insights.

## Limitations of preview release

Please consider carefully whether this preview is right for you. It **enables distributed tracing only** and _excludes_ the following:
 - Metrics API (custom metrics, [Pre-aggregated metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics))
 - [Live Metrics](live-stream.md)
 - Logging API (console logs, logging libraries, etc.)
 - Auto-capture of unhandled exceptions
 - [Profiler](profiler-overview.md)
 - [Snapshot Debugger](snapshot-debugger.md)
 - Offline disk storage
 - [Azure AD Authentication](azure-ad-authentication.md)
 - Cloud Role Name and Cloud Role Instance Auto-population in Azure environments
 - [Sampling](sampling.md)
 

 Those who require a full-feature experience should use the existing Application Insights [ASP.NET](asp-net.md) or [ASP.NET Core](asp-net-core.md) SDK until the OpenTelemetry-based offering matures.

## Get started

### Prerequisites
- Application using officially supported version of [.NET
  Core](https://dotnet.microsoft.com/download/dotnet) or [.NET
  Framework](https://dotnet.microsoft.com/download/dotnet-framework) except for
  versions lower than `.NET Framework 4.6.1`.
- [Azure Subscription](https://azure.microsoft.com/free/) (Free to create)
- [Application Insights Resource](create-workspace-resource.md#create-workspace-based-resource) (Free to create)

### Enable Azure Monitor Application Insights

**1. Getting started**

Create a new console application as follows

```sh
dotnet new console --output getting-started
```

Install the latest [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) nuget package

```sh
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter
```

Copy the following code in `Program.cs`

```csharp
using System.Diagnostics;
using Azure.Monitor.OpenTelemetry.Exporter;
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

> [!NOTE]
> The above example shows how to collect traces in Azure Monitor using OpenTelemetry in console application. For details on how to configure OpenTelemetry for other types of applications such as ASP.NET and ASP.NET Core, refer to [OpenTelemetry examples on GitHub](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/examples). For all the application types extension method `AddAzureMonitorTraceExporter` to send data to Application Insights is applicable.

**2. Add connection string**

Replace placeholder `<Your Connection String>` with YOUR connection string from Application Insights resource.

Find the connection string on your Application Insights Resource.

:::image type="content" source="media/opentelemetry/connection-string.png" alt-text="Screenshot of Application Insights Connection String.":::

**3. Confirm Data is flowing**

Run your application and open your Application Insights Resource.

> [!NOTE]
> It may take a few minutes for data to show up in the Portal.

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of Application Insights Overview tab with server requests and server response time highlighted.":::


> [!IMPORTANT]
> If you have two or more micro-services using the same connection string, you are required to set role names to represent them properly on the Application Map.

## Set Cloud Role Name and Cloud Role Instance
You may set [Cloud Role Name](app-map.md#understanding-cloud-role-name-within-the-context-of-the-application-map) and Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. This updates Cloud Role Name and Cloud Role Instance from its default value to something that makes sense to your team. It will surface on the Application Map as the name underneath a node. Cloud Role Name uses `service.namespace` and `service.name` attributes (combined using `.` separator), though it falls back to `service.name` if `service.namespace` is not set. Cloud Role Instance uses the `service.instance.id` attribute value.

```csharp
var resourceAttributes = new Dictionary<string, object> {
                                        { "service.name", "my-service" },
                                        { "service.namespace", "my-namespace" },
                                        { "service.instance.id", "my-instance" }};

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

While sampling is supported in OpenTelemetry, it is not supported in Azure Monitor OpenTelemetry Exporter at this time.

> [!WARNING]
> Enabling sampling alongside the existing Application Insights SDKs will result in broken traces. It will also make standard and log-based metrics extremely inaccurate which will adversely impact all Application Insights experiences.


## Instrumentation libraries
<!-- Microsoft has tested and validated that the following instrumentation libraries will work with the **Preview** Release. -->
The following libraries are validated to work with the Preview Release:

> [!WARNING]
> Instrumentation libraries are based on experimental OpenTelemetry specifications. Microsoft’s **preview** support commitment is to ensure the libraries listed below emit data to Azure Monitor Application Insights, but it’s possible that breaking changes or experimental mapping will block some data elements.

### HTTP
* [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNet/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet/1.0.0-rc7)
* [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/1.0.0-rc7)
* [HTTP
  clients](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.Http/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/1.0.0-rc7)

### Database
- [SQL
  client](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.SqlClient/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient/1.0.0-rc7)

> [!NOTE]
> The **preview** offering only includes instrumentations that handle HTTP and Database requests. See [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) to learn more.

## Modify telemetry

### Add activity attributes

Activity attributes can be added using either of the following two options.
1. Enrich option provided by the instrumentation libraries. Refer to Readme document of individual [instrumentation libraries](#instrumentation-libraries) for more details.
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

public class ActivityEnrichingProcessor : BaseProcessor<Activity>
{
    public override void OnEnd(Activity activity)
    {
        // The updated activity will be available to all processors which are called after this processor.
        activity.DisplayName = "Updated-" + activity.DisplayName;
        activity.SetTag("CustomDimension1", "Value1");
        activity.SetTag("CustomDimension2", "Value2");
    }
}
```
These attributes may include adding a custom business dimension to your telemetry. You may also use attributes to set optional fields in the Application Insights Schema such as <!--- User ID or ---> Client IP. Below are three examples that show common scenarios.

For more information, see [GitHub Repo](link).

#### Add custom dimension

Any [attributes](#add-activity-attributes) which are added to activity will be exported as custom dimensions to Application Insights.

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
#### Set user IP
You can populate the client_IP field for requests by setting `http.client_ip` attribute on activity. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

> [!TIP]
> Instrument with the the [JavaScript SDK](javascript.md) to automatically populate User IP.

### Override activity display name
You may use Enrich option from [instrumentation libraries](#instrumentation-libraries) or [custom processor](#add-activity-attributes) to override Activity display name. This updates Operation Name from its default value to something that makes sense to your team. It will surface on the Failures and Performance Blade when you pivot by Operations.

> [!NOTE]
> Operation name is only available for requests, Operation for Dependency telemetry is not supported for preview.g

<!-- For more information, see [GitHub Repo](link). -->

### Filter Telemetry

You may use following three ways to filter out telemetry before leaving your application. 
1. Filter option provided by many instrumentation libraries. Refer to Readme document of individual [instrumentation libraries](#instrumentation-libraries) for more details.

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
    
    public class ActivityFilteringProcessor : BaseProcessor<Activity>
    {
        public override void OnStart(Activity activity)
        {
            // prevents all exporters from exporting internal activities
            if (activity.Kind == ActivityKind.Internal)
            {
                activity.IsAllDataRequested = false;
            }
        }
    }
    ```

3. If a particular source is not explicitly added using `AddSource("ActivitySourceName")`, then none of the activities created using that source will be exported.
    
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
> OTLP exporter is shown for convenience only. We do not officially support the OTLP Exporter or any components or third-party experiences downstream of it. We suggest you [open an issue with the OpenTelemetry community](https://github.com/open-telemetry/opentelemetry-dotnet/issues/new/choose) for OpenTelemetry issues outside the Azure Support Boundary.

## Troubleshooting

### Enable diagnostic logging
The Azure Monitor exporter uses EventSource for its own internal logging. The
exporter logs are available to any EventListener by opting into the source named
"OpenTelemetry-AzureMonitor-Exporter". Refer to
[ OpenTelemetry Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting)
for detailed troubleshooting steps.

### Known issues
Placeholder 

## Support
- Review troubleshooting steps in this article.
- For Azure support issues, file an Azure SDK GitHub issue or open an [Azure Support Ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry dotnet community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.

## OpenTelemetry feedback

- Fill out the OpenTelemetry community’s [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft a bit about yourself by joining our [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Add your feature requests to the [Azure Monitor Application Insights UserVoice](https://feedback.azure.com/forums/357324-azure-monitor-application-insights).

## Next steps

- [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter)
- [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter/)
- [Azure Monitor Example Application]()
- [OpenTelemetry .NET GitHub Repository](https://github.com/open-telemetry/opentelemetry-dotnet)
- [Enable web/browser user monitoring](javascript.md) to enabled usage experiences
