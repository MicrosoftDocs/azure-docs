---
title: Enable Azure Monitor OpenTelemetry for .NET, JavaScript, and Python applications
description: Provides guidance on how to enable Azure Monitor on applications using OpenTelemetry
ms.topic: conceptual
ms.date: 09/28/2021
---

# Enable Azure Monitor OpenTelemetry Exporter for .NET, JavaScript, and Python applications (Preview)

This article describes how to enable and configure the OpenTelemetry-based Azure Monitor Preview offering. When you complete the instructions in this article, you will be able to send OpenTelemetry traces to Azure Monitor Application Insights.

## Limitations of preview release

### [.NET](#tab/net)

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

### [JavaScript](#tab/javascript)

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

> [!WARNING] 
> At present, this exporter only works for Node.js serverside environments. Use the [Application Insights JavaScript SDK](javascript.md) for web/browser scenarios.

### [Python](#tab/python)

Please consider carefully whether this preview is right for you. It **enables distributed tracing only** and _excludes_ the following:
 - Metrics API (custom metrics, [Pre-aggregated metrics](pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics))
 - [Live Metrics](live-stream.md)
 - Logging API (console logs, logging libraries, etc.)
 - Auto-capture of unhandled exceptions
 - Offline disk storage
 - [Azure AD Authentication](azure-ad-authentication.md)
 - Cloud Role Name and Cloud Role Instance Auto-population in Azure environments
 - [Sampling](sampling.md)

 Those who require a full-feature experience should use the existing [Application Insights Python-OpenCensus SDK](opencensus-python.md) until the OpenTelemetry-based offering matures.

---


## Get started

Follow the five steps in this section and you will be able to instrument OpenTelemetry with your application.

### Prerequisites

### [.NET](#tab/net)

- Application using officially supported version of [.NET Core](https://dotnet.microsoft.com/download/dotnet) or [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework) except for versions lower than `.NET Framework 4.6.1`.
- Azure subscription - [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- Once you have your Azure subscription, if you don't already have one, [create an Application Insights resource](create-workspace-resource.md#create-workspace-based-resource) in the Azure portal to get your connection string.


### [JavaScript](#tab/javascript)

- JavaScript application using Node.js version X.X+
- [Azure Subscription](https://azure.microsoft.com/free/) (Free to create)
- [Application Insights Resource](create-workspace-resource.md#create-workspace-based-resource) (Free to create)

### [Python](#tab/python)

- Python Application using version 3.6+
- [Azure Subscription](https://azure.microsoft.com/free/) (Free to create)
- [Application Insights Resource](create-workspace-resource.md#create-workspace-based-resource) (Free to create)

---

### Set up your environment

#### [.NET](#tab/net)

##### 1. Prepare the C# application

If you already have a C# application to instrument OpenTelemetry, you could skip this section.

In a console window (such as cmd, PowerShell, or Bash), use the dotnet new command to create a new console app with the name `azuremonitor-otel-getting-started`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`.

```dotnetcli
dotnet new console --output azuremonitor-otel-getting-started
```

##### 2. Install the NuGet libraries

Change your directory to the application folder and install the latest [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) nuget package.

```dotnetcli
# Switch to the app directory
cd azuremonitor-otel-getting-started 

# Install the latest package
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter 
```

> [!NOTE]
> If you're not able to install the library, please go to [Troubleshooting](#specifying-nuget-source).

#### [JavaScript](#tab/javascript)

Add code to xyz.file in your application

```javascript
Placeholder
```


#### [Python](#tab/python)

##### 1. Install Pypi Package

```sh
pip install azure-monitor-opentelemetry-exporter 
```
---

### Enable OpenTelemetry

#### 3. Add OpenTelemetry instrumentation code

##### [.NET](#tab/net)

The following code demonstrates enabling OpenTelemetry in the newly created "Hello World" console app. You could copy the code and replace everything in `Program.cs` of the "HelloWorld" app, or add similar logic to your own application.

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

> [!NOTE]
> Are you wondering why the terms `ActivitySource` and `Activity` are used instead of `Tracer` and `Span` per the OpenTelemetry specification? It's because parts of the OpenTelemetry tracing API are incorporated directly into the .NET runtime. At a high-level, this means is that the `Activity` and `ActivitySource` classes from the .NET runtime represent the OpenTelemetry concepts of `Span` and `Tracer` respectively. [Learn more](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Api/README.md#introduction-to-opentelemetry-net-tracing-api).

##### [JavaScript](#tab/javascript)

placeholder

##### [Python](#tab/python)

The following code demonstrates enabling OpenTelemetry in a simple Python application.

```python
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter

exporter = AzureMonitorTraceExporter.from_connection_string(
    os.environ["APPLICATIONINSIGHTS_CONNECTION_STRING"]
)

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)
span_processor = BatchSpanProcessor(exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

with tracer.start_as_current_span("hello"):
    print("Hello, World!")

```
---


#### 4. Set Application Insights connection string

Replace placeholder `<Your Connection String>` in the above code with YOUR connection string from the Application Insights resource.

Find the connection string on your Application Insights Resource.

:::image type="content" source="media/opentelemetry/connection-string.png" alt-text="Screenshot of Application Insights Connection String.":::

#### 5. Confirm data is flowing

Run your application and open your Application Insights Resource blade on the Azure portal. It may take a few minutes for data to show up in the Portal.

> [!NOTE]
> If you're not able to run the application or not getting data as expected, please go to [Troubleshooting](#troubleshooting).

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of Application Insights Overview tab with server requests and server response time highlighted.":::

> [!IMPORTANT]
> If you have two or more micro-services using the same connection string, you are required to [set cloud role names](#set-cloud-role-name-and-cloud-role-instance) to represent them properly on the Application Map.

## Set Cloud Role Name and Cloud Role Instance

You may set [Cloud Role Name](app-map.md#understanding-cloud-role-name-within-the-context-of-the-application-map) and Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. This updates Cloud Role Name and Cloud Role Instance from its default value to something that makes sense to your team. It will surface on the Application Map as the name underneath a node. Cloud Role Name uses `service.namespace` and `service.name` attributes (combined using `.` separator), though it falls back to `service.name` if `service.namespace` is not set. Cloud Role Instance uses the `service.instance.id` attribute value.

### [.NET](#tab/net)

```csharp
var resourceAttributes = new Dictionary<string, object> {
                                        { "service.name", "my-service" },
                                        { "service.namespace", "my-namespace" },
                                        { "service.instance.id", "my-instance" }};
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


### [JavaScript](#tab/javascript)

```javascript
Placeholder
```

For more information, see [GitHub Repo](link).

### [Python](#tab/python)

```python
...
from opentelemetry.sdk.resources import SERVICE_NAME, SERVICE_NAMESPACE, SERVICE_INSTANCE_ID, Resource
trace.set_tracer_provider(
    TracerProvider(
        resource=Resource.create(
            {
                SERVICE_NAME: "my-helloworld-service",
                SERVICE_NAMESPACE: "my-namespace",
                SERVICE_INSTANCE_ID: "my-instance",
            }
        )
    )
)
...
```

Reference: [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/semantic_conventions/README.md)

<!-- For more information, see [GitHub Repo](link). -->

---

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

#### [.NET](#tab/net)

- [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNet/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNet/1.0.0-rc7)
- [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.AspNetCore/1.0.0-rc7)
- [HTTP
  clients](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.Http/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Http/1.0.0-rc7)

#### [JavaScript](#tab/javascript)

- XYZ (version X.X)

#### [Python](#tab/python)

- [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-django/0.24b0/)
- [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-flask/0.24b0/)
- [Requests](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-requests) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-requests/0.24b0/)

---

### Database

#### [.NET](#tab/net)

- [SQL
  client](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc7/src/OpenTelemetry.Instrumentation.SqlClient/README.md) Version:
  [1.0.0-rc7](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.SqlClient/1.0.0-rc7)

#### [JavaScript](#tab/javascript)

- XYZ (version X.X)

#### [Python](#tab/python)

- [Psycopg2](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-psycopg2) Version:
  [0.24b0](https://pypi.org/project/opentelemetry-instrumentation-psycopg2/0.24b0/)

---

> [!NOTE]
> The **preview** offering only includes instrumentations that handle HTTP and Database requests. See [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) to learn more.

## Modify telemetry

### Add activity/span attributes

Activity/span attributes can be added using either of the following two options.
1. Enrich option provided by the instrumentation libraries. Refer to Readme document of individual [instrumentation libraries](#instrumentation-libraries) for more details.
2. Adding a custom processor.

These attributes may include adding a custom business property to your telemetry. You may also use attributes to set optional fields in the Application Insights Schema such as User ID or Client IP. Below are three examples that show common scenarios.

#### Add custom property

Any [attributes](#add-activityspan-attributes) which are added to activity/span will be exported as custom properties. They'll populate the _customDimensions_ field in the requests and/or dependencies tables in Application Insights.

##### [.NET](#tab/net)

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


##### [JavaScript](#tab/javascript)

If using custom processor, make sure to add the processor before the Azure monitor exporter as shown below in the code.

```javascript
Placeholder
```

##### [Python](#tab/python)

If using custom processor, make sure to add the processor before the Azure monitor exporter as shown below in the code.

```python
...
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

trace.set_tracer_provider(TracerProvider())
span_processor = BatchSpanProcessor(exporter)
span_enrich_processor = SpanEnrichingProcessor()
trace.get_tracer_provider().add_span_processor(span_enrich_processor)
trace.get_tracer_provider().add_span_processor(span_processor)
...
```

Add `SpanEnrichingProcessor.py` to your project with the code below.

```python
from opentelemetry.sdk.trace import SpanProcessor

class SpanEnrichingProcessor(SpanProcessor):

    def on_end(self, span):
        span._name = "Updated-" + span.name
        span._attributes["CustomDimension1"] = "Value1"
        span._attributes["CustomDimension2"] = "Value2"

```
---

#### Set user IP

You can populate the _client_IP_ field for requests by setting `http.client_ip` attribute on activity/span. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

> [!IMPORTANT]
> Consult applicable privacy laws before setting Authenticated User ID.

##### [.NET](#tab/net)

Use the add [custom property example](#add-custom-property), except change out the following lines of code in `ActivityEnrichingProcessor.cs`:

```C#
activity.SetTag("http.client_ip", "<IP Address>");
```

> [!TIP]
> The .NET exporter will automatically populate User IP if you instrument with the [Application Insights JavaScript SDK](javascript.md).

##### [JavaScript](#tab/javascript)

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

```javascript
Placeholder
```

> [!TIP]
> The JavaScript exporter will automatically populate User IP if you instrument with the [Application Insights JavaScript SDK](javascript.md).

##### [Python](#tab/python)

Use the add [custom property example](#add-custom-property), except change out the following lines of code in `SpanEnrichingProcessor.py`:

```python
span._attributes["http.client_ip"] = "<IP Address>"
```

> [!TIP]
> The Python exporter will automatically populate User IP if you instrument with the [Application Insights JavaScript SDK](javascript.md).

---

#### Set user ID or authenticated user ID

You can populate the _user_Id_ or _user_Authenticatedid_ field for requests by setting `xyz` or `xyz` attribute on activity/span. User ID is an anonymous user identifier and Authenticated User ID is a known user identifier.

##### [.NET](#tab/net)

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

```C#
Placeholder
```

> [!TIP]
> The .NET exporter will automtically populate User ID if you instrument with the [Application Insights JavaScript SDK](javascript.md).

##### [JavaScript](#tab/javascript)

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

```javascript
Placeholder
```

> [!TIP]
> The JavaScript exporter will automtically populate User ID if you instrument with the [Application Insights JavaScript SDK](javascript.md).

##### [Python](#tab/python)

Use the add [custom property example](#add-custom-property), except change out the following lines of code:

```python
Placeholder
```

> [!TIP]
> The Python exporter will automtically populate User ID if you instrument with the [Application Insights JavaScript SDK](javascript.md).

---

### Override activity display or span name

#### [.NET](#tab/net)

You may use Enrich option from [instrumentation libraries](#instrumentation-libraries) or [custom processor](#add-activityspan-attributes) to override Activity display name. This updates Operation Name from its default value to something that makes sense to your team. It will surface on the Failures and Performance Blade when you pivot by Operations.

> [!NOTE]
> Operation name is only available for requests, Operation for Dependency telemetry is not supported for preview.g

<!-- For more information, see [GitHub Repo](link). -->

#### [JavaScript](#tab/javascript)

Populate the _client_IP_ field in the requests and dependencies table. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

> [!TIP]
> Instrument with the the [JavaScript SDK](javascript.md) to automatically populate User IP.

```javascript
Placeholder
```

#### [Python](#tab/python)

You may use Request/Response hook option from [instrumentation libraries](#instrumentation-libraries) or [custom processor](#add-activityspan-attributes) to override span name. This updates Operation Name from its default value to something that makes sense to your team. It will surface on the Failures and Performance Blade when you pivot by Operations.

> [!NOTE]
> Operation name is only available for requests, Operation for Dependency telemetry is not supported for preview.

Below is an example of how to use request/reponse hooks using the [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/blob/main/instrumentation/opentelemetry-instrumentation-django) instrumentation.

```python
...
def request_hook(span, request):
    span._name = "Override" + request.method

def response_hook(span, request, response):
    pass

DjangoInstrumentation().instrument(request_hook=request_hook, response_hook=response_hook)
...
```

---

### Filter Telemetry

You may use following ways to filter out telemetry before leaving your application.

1. Filter option provided by many instrumentation libraries. Refer to Readme document of individual [instrumentation libraries](#instrumentation-libraries) for more details.

#### [.NET](#tab/net)


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

#### [JavaScript](#tab/javascript)

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

#### [Python](#tab/python)

You may use a Span Processor to filter out telemetry before leaving your application. Span Processors may be used to mask telemetry for privacy reasons or block unneeded telemetry to reduce ingestion costs.

```python
Placeholder
```

For more information, see [GitHub Repo](link).
<!---
### Get Trace ID or Span ID
You may use X or Y to get trace ID and/or span ID. Adding trace ID and/or span ID to existing logging telemetry enables better correlation when debugging and diagnosing issues.

> [!NOTE]
> If you are manually creating spans for log-based metrics and alerting, you will need to update them to use the metrics API (after it is released) to ensure accuracy.

```python
Placeholder
```

For more information, see [GitHub Repo](link).
--->

---

## Enable OTLP Exporter

You may want to enable the OTLP Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

> [!NOTE]
> OTLP exporter is shown for convenience only. We do not officially support the OTLP Exporter or any components or third-party experiences downstream of it. We suggest you [open an issue with the OpenTelemetry community](https://github.com/open-telemetry/opentelemetry-dotnet/issues/new/choose) for OpenTelemetry issues outside the Azure Support Boundary.

#### [.NET](#tab/net)

1. Install the [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://www.nuget.org/packages/OpenTelemetry.Exporter.OpenTelemetryProtocol/) package along with [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) in your project.

2. Add following code snippet. This example assumes you have a OpenTelemetry Collector with an OTLP receiver running. For details refer to example [here](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/examples/Console/TestOtlpExporter.cs).

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


#### [JavaScript](#tab/javascript)
You may want to enable the OTLP Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

Add the code to xyz.file in your application.

```javascript
Placeholder
```


#### [Python](#tab/python)

You may want to enable the OTLP Exporter alongside your Azure Monitor Exporter to send your telemetry to two locations.

Add the code to xyz.file in your application.

```python
Placeholder
```

---

## Troubleshooting

### Enable diagnostic logging

#### [.NET](#tab/net)

The Azure Monitor exporter uses EventSource for its own internal logging. The
exporter logs are available to any EventListener by opting into the source named
"OpenTelemetry-AzureMonitor-Exporter". Refer to
[ OpenTelemetry Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting)
for detailed troubleshooting steps.

#### [JavaScript](#tab/javascript)

Placeholder

#### [Python](#tab/python)

Placeholder

---

### Other steps

#### [.NET](#tab/net)

#### Specifying nuget source

If you try to install the package and get errors like the following, it's mostly due to missing NuGet package sources.

```dotnetcli
error: There are no versions available for the package 'Azure.Monitor.OpenTelemetry.Exporter'.
```

You could try to specify the source with `-s` option.

```dotnetcli
# Install the latest package with NuGet package source specified
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter -s https://api.nuget.org/v3/index.json
```

#### [JavaScript](#tab/javascript)

Placeholder

#### [Python](#tab/python)

Placeholder

---

### Known issues

#### [.NET](#tab/net)

Placeholder

#### [JavaScript](#tab/javascript)

Placeholder

#### [Python](#tab/python)

Placeholder

---

## Support

- Review troubleshooting steps in this article.
- For Azure support issues, file an Azure SDK GitHub issue or open an [Azure Support Ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry dotnet community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.

## OpenTelemetry feedback

- Fill out the OpenTelemetry community’s [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft a bit about yourself by joining our [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Add your feature requests to the [Azure Monitor Application Insights UserVoice](https://feedback.azure.com/forums/357324-azure-monitor-application-insights).

## Next steps

### [.NET](#tab/net)

- Review the source code at the [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter).
- To install the NuGet package, check for updates, or view release notes, visit the [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter/) page.
- Become more familiar Azure Monitor Application Insights and OpenTelemetry with the [Azure Monitor Example Application]().
- To learn more about OpenTelemetry and it's community, visit the [OpenTelemetry .NET GitHub Repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- [Enable web/browser user monitoring](javascript.md) to enabled usage experiences.


### [JavaScript](#tab/javascript)

- Review the source code at the  [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter).
- To install the NPM package, check for updates, or view release notes, visit the [Azure Monitor Exporter NPM Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) page.
- Become more familiar Azure Monitor Application Insights and OpenTelemetry with the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples/v1/javascript).
- To learn more about OpenTelemetry and it's community, visit the [OpenTelemetry JavaScript GitHub Repository](https://github.com/open-telemetry/opentelemetry-js).
- [Enable web/browser user monitoring](javascript.md) to enabled usage experiences.

### [Python](#tab/python)

- Review the source code at the [Azure Monitor Exporter GitHub Repository](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-opentelemetry-exporter/README.md).
- To install the PyPI package, check for updates, or view release notes, visit the [Azure Monitor Exporter  PyPI Package](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) page.
-  Become more familiar Azure Monitor Application Insights and OpenTelemetry with the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python).
- To learn more about OpenTelemetry and it's community, visit the [OpenTelemetry Python GitHub Repository](https://github.com/open-telemetry/opentelemetry-python).
- [Enable web/browser user monitoring](javascript.md) to enabled usage experiences.
