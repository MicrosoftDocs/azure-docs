---
title: Filtering and preprocessing in the Azure Application Insights SDK | Microsoft Docs
description: Write Telemetry Processors and Telemetry Initializers for the SDK to filter or add properties to the data before the telemetry is sent to the Application Insights portal.
ms.topic: conceptual
ms.date: 11/23/2016

---

# Filtering and preprocessing telemetry in the Application Insights SDK

You can write and configure plug-ins for the Application Insights SDK to customize how telemetry can be enriched and processed before it's sent to the Application Insights service.

* [Sampling](sampling.md) reduces the volume of telemetry without affecting your statistics. It keeps together related data points so that you can navigate between them when diagnosing a problem. In the portal, the total counts are multiplied to compensate for the sampling.
* Filtering with Telemetry Processors lets you filter out telemetry in the SDK before it is sent to the server. For example, you could reduce the volume of telemetry by excluding requests from robots. Filtering is a more basic approach to reducing traffic than sampling. It allows you more control over what is transmitted, but you have to be aware that it affects your statistics - for example, if you filter out all successful requests.
* [Telemetry Initializers add or modify properties](#add-properties) to any telemetry sent from your app, including telemetry from the standard modules. For example, you could add calculated values; or version numbers by which to filter the data in the portal.
* [The SDK API](../../azure-monitor/app/api-custom-events-metrics.md) is used to send custom events and metrics.

Before you start:

* Install the appropriate SDK for your application: [ASP.NET](asp-net.md), [ASP.NET Core](asp-net-core.md), [Non HTTP/Worker for .NET/.NET Core](worker-service.md), or [JavaScript](javascript.md)

<a name="filtering"></a>

## Filtering

This technique gives you direct control over what is included or excluded from the telemetry stream. Filtering can be used to drop telemetry items from being sent to Application Insights. You can use it in conjunction with Sampling, or separately.

To filter telemetry, you write a telemetry processor and register it with the `TelemetryConfiguration`. All telemetry goes through your processor, and you can choose to drop it from the stream or give it to the next processor in the chain. This includes telemetry from the standard modules such as the HTTP request collector and the dependency collector, and telemetry you have tracked yourself. You can, for example, filter out telemetry about requests from robots, or successful dependency calls.

> [!WARNING]
> Filtering the telemetry sent from the SDK using processors can skew the statistics that you see in the portal, and make it difficult to follow related items.
>
> Instead, consider using [sampling](../../azure-monitor/app/sampling.md).
>
>

### Create a telemetry processor (C#)

1. To create a filter, implement `ITelemetryProcessor`.

    Notice that Telemetry Processors construct a chain of processing. When you instantiate a telemetry processor, you are given a reference to the next processor in the chain. When a telemetry data point is passed to the Process method, it does its work and then calls (or not calls) the next Telemetry Processor in the chain.

    ```csharp
    using Microsoft.ApplicationInsights.Channel;
    using Microsoft.ApplicationInsights.Extensibility;

    public class SuccessfulDependencyFilter : ITelemetryProcessor
    {
        private ITelemetryProcessor Next { get; set; }

        // next will point to the next TelemetryProcessor in the chain.
        public SuccessfulDependencyFilter(ITelemetryProcessor next)
        {
            this.Next = next;
        }

        public void Process(ITelemetry item)
        {
            // To filter out an item, return without calling the next processor.
            if (!OKtoSend(item)) { return; }

            this.Next.Process(item);
        }

        // Example: replace with your own criteria.
        private bool OKtoSend (ITelemetry item)
        {
            var dependency = item as DependencyTelemetry;
            if (dependency == null) return true;

            return dependency.Success != true;
        }
    }
    ```

2. Add your processor.

**ASP.NET apps**
Insert this snippet in ApplicationInsights.config:

```xml
<TelemetryProcessors>
  <Add Type="WebApplication9.SuccessfulDependencyFilter, WebApplication9">
     <!-- Set public property -->
     <MyParamFromConfigFile>2-beta</MyParamFromConfigFile>
  </Add>
</TelemetryProcessors>
```

You can pass string values from the .config file by providing public named properties in your class.

> [!WARNING]
> Take care to match the type name and any property names in the .config file to the class and property names in the code. If the .config file references a non-existent type or property, the SDK may silently fail to send any telemetry.
>

**Alternatively,** you can initialize the filter in code. In a suitable initialization class - for example AppStart in `Global.asax.cs` - insert your processor into the chain:

```csharp
var builder = TelemetryConfiguration.Active.DefaultTelemetrySink.TelemetryProcessorChainBuilder;
builder.Use((next) => new SuccessfulDependencyFilter(next));

// If you have more processors:
builder.Use((next) => new AnotherProcessor(next));

builder.Build();
```

TelemetryClients created after this point will use your processors.

**ASP.NET Core/ Worker Service apps**

> [!NOTE]
> Adding processor using `ApplicationInsights.config` or using `TelemetryConfiguration.Active` is not valid for ASP.NET Core applications or if you are using Microsoft.ApplicationInsights.WorkerService SDK.

For apps written using [ASP.NET Core](asp-net-core.md#adding-telemetry-processors) or [WorkerService](worker-service.md#adding-telemetry-processors), adding a new `TelemetryProcessor` is done by using `AddApplicationInsightsTelemetryProcessor` extension method on `IServiceCollection`, as shown below. This method is called in `ConfigureServices` method of your `Startup.cs` class.

```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        // ...
        services.AddApplicationInsightsTelemetry();
        services.AddApplicationInsightsTelemetryProcessor<SuccessfulDependencyFilter>();

        // If you have more processors:
        services.AddApplicationInsightsTelemetryProcessor<AnotherProcessor>();
    }
```

### Example filters

#### Synthetic requests

Filter out bots and web tests. Although Metrics Explorer gives you the option to filter out synthetic sources, this option reduces traffic and ingestion size by filtering them at the SDK itself.

```csharp
public void Process(ITelemetry item)
{
  if (!string.IsNullOrEmpty(item.Context.Operation.SyntheticSource)) {return;}

  // Send everything else:
  this.Next.Process(item);
}
```

#### Failed authentication

Filter out requests with a "401" response.

```csharp
public void Process(ITelemetry item)
{
    var request = item as RequestTelemetry;

    if (request != null &&
    request.ResponseCode.Equals("401", StringComparison.OrdinalIgnoreCase))
    {
        // To filter out an item, return without calling the next processor.
        return;
    }

    // Send everything else
    this.Next.Process(item);
}
```

#### Filter out fast remote dependency calls

If you only want to diagnose calls that are slow, filter out the fast ones.

> [!NOTE]
> This will skew the statistics you see on the portal.
>
>

```csharp
public void Process(ITelemetry item)
{
    var request = item as DependencyTelemetry;

    if (request != null && request.Duration.TotalMilliseconds < 100)
    {
        return;
    }
    this.Next.Process(item);
}
```

#### Diagnose dependency issues

[This blog](https://azure.microsoft.com/blog/implement-an-application-insights-telemetry-processor/) describes a project to diagnose dependency issues by automatically sending regular pings to dependencies.

<a name="add-properties"></a>

### JavaScript Web applications

**Filtering using ITelemetryInitializer**

1. Create a telemetry initializer callback function. The callback function takes `ITelemetryItem` as a parameter, which is the event that is being processed. Returning `false` from this callback results in the telemetry item to be filtered out.  

   ```JS
   var filteringFunction = (envelope) => {
     if (envelope.data.someField === 'tobefilteredout') {
         return false;
     }
  
     return true;
   };
   ```

2. Add your telemetry initializer callback:

   ```JS
   appInsights.addTelemetryInitializer(filteringFunction);
   ```

## Add/modify properties: ITelemetryInitializer


Use telemetry initializers to enrich telemetry with additional information and/or to override telemetry properties set by the standard telemetry modules.

For example, the Application Insights for Web package collect telemetry about HTTP requests. By default, it flags as failed any request with a response code >= 400. But if you want to treat 400 as a success, you can provide a telemetry initializer that sets the Success property.

If you provide a telemetry initializer, it is called whenever any of the Track*() methods are called. This includes `Track()` methods called by the standard telemetry modules. By convention, these modules do not set any property that has already been set by an initializer. Telemetry initializers are called before calling telemetry processors. So any enrichments done by initializers are visible to processors.

**Define your initializer**

*C#*

```csharp
using System;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

namespace MvcWebRole.Telemetry
{
  /*
   * Custom TelemetryInitializer that overrides the default SDK
   * behavior of treating response codes >= 400 as failed requests
   *
   */
  public class MyTelemetryInitializer : ITelemetryInitializer
  {
    public void Initialize(ITelemetry telemetry)
    {
        var requestTelemetry = telemetry as RequestTelemetry;
        // Is this a TrackRequest() ?
        if (requestTelemetry == null) return;
        int code;
        bool parsed = Int32.TryParse(requestTelemetry.ResponseCode, out code);
        if (!parsed) return;
        if (code >= 400 && code < 500)
        {
            // If we set the Success property, the SDK won't change it:
            requestTelemetry.Success = true;

            // Allow us to filter these requests in the portal:
            requestTelemetry.Properties["Overridden400s"] = "true";
        }
        // else leave the SDK to set the Success property
    }
  }
}
```

**ASP.NET apps: Load your initializer**

In ApplicationInsights.config:

```xml
<ApplicationInsights>
  <TelemetryInitializers>
    <!-- Fully qualified type name, assembly name: -->
    <Add Type="MvcWebRole.Telemetry.MyTelemetryInitializer, MvcWebRole"/>
    ...
  </TelemetryInitializers>
</ApplicationInsights>
```

*Alternatively,* you can instantiate the initializer in code, for example in Global.aspx.cs:

```csharp
protected void Application_Start()
{
    // ...
    TelemetryConfiguration.Active.TelemetryInitializers.Add(new MyTelemetryInitializer());
}
```

[See more of this sample.](https://github.com/Microsoft/ApplicationInsights-Home/tree/master/Samples/AzureEmailService/MvcWebRole)

**ASP.NET Core/ Worker Service apps: Load your initializer**

> [!NOTE]
> Adding initializer using `ApplicationInsights.config` or using `TelemetryConfiguration.Active` is not valid for ASP.NET Core applications or if you are using Microsoft.ApplicationInsights.WorkerService SDK.

For apps written using [ASP.NET Core](asp-net-core.md#adding-telemetryinitializers) or [WorkerService](worker-service.md#adding-telemetryinitializers), adding a new `TelemetryInitializer` is done by adding it to the Dependency Injection container, as shown below. This is done in `Startup.ConfigureServices` method.

```csharp
 using Microsoft.ApplicationInsights.Extensibility;
 using CustomInitializer.Telemetry;
 public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<ITelemetryInitializer, MyTelemetryInitializer>();
}
```
### JavaScript telemetry initializers
*JavaScript*

Insert a telemetry initializer immediately after the initialization code that you got from the portal:

```JS
<script type="text/javascript">
    // ... initialization code
    ...({
        instrumentationKey: "your instrumentation key"
    });
    window.appInsights = appInsights;


    // Adding telemetry initializer.
    // This is called whenever a new telemetry item
    // is created.

    appInsights.queue.push(function () {
        appInsights.context.addTelemetryInitializer(function (envelope) {
            var telemetryItem = envelope.data.baseData;

            // To check the telemetry items type - for example PageView:
            if (envelope.name == Microsoft.ApplicationInsights.Telemetry.PageView.envelopeType) {
                // this statement removes url from all page view documents
                telemetryItem.url = "URL CENSORED";
            }

            // To set custom properties:
            telemetryItem.properties = telemetryItem.properties || {};
            telemetryItem.properties["globalProperty"] = "boo";

            // To set custom metrics:
            telemetryItem.measurements = telemetryItem.measurements || {};
            telemetryItem.measurements["globalMetric"] = 100;
        });
    });

    // End of inserted code.

    appInsights.trackPageView();
</script>
```

For a summary of the non-custom properties available on the telemetryItem, see [Application Insights Export Data Model](../../azure-monitor/app/export-data-model.md).

You can add as many initializers as you like, and they are called in the order they are added.

### OpenCensus Python telemetry processors

Telemetry processors in OpenCensus Python are simply callback functions called to process telemetry before they are exported. The callback function must accept an [envelope](https://github.com/census-instrumentation/opencensus-python/blob/master/contrib/opencensus-ext-azure/opencensus/ext/azure/common/protocol.py#L86) data type as its parameter. To filter out telemetry from being exported,make sure the callback function returns `False`. You can see the schema for Azure Monitor data types in the envelopes [here](https://github.com/census-instrumentation/opencensus-python/blob/master/contrib/opencensus-ext-azure/opencensus/ext/azure/common/protocol.py).

> [!NOTE]
> You can modify the `cloud_RoleName` by changing the `ai.cloud.role` attribute in the `tags` field.

```python
def callback_function(envelope):
    envelope.tags['ai.cloud.role'] = 'new_role_name'
```

```python
# Example for log exporter
import logging

from opencensus.ext.azure.log_exporter import AzureLogHandler

logger = logging.getLogger(__name__)

# Callback function to append '_hello' to each log message telemetry
def callback_function(envelope):
    envelope.data.baseData.message += '_hello'
    return True

handler = AzureLogHandler(connection_string='InstrumentationKey=<your-instrumentation_key-here>')
handler.add_telemetry_processor(callback_function)
logger.addHandler(handler)
logger.warning('Hello, World!')
```
```python
# Example for trace exporter
import requests

from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace import config_integration
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

config_integration.trace_integrations(['requests'])

# Callback function to add os_type: linux to span properties
def callback_function(envelope):
    envelope.data.baseData.properties['os_type'] = 'linux'
    return True

exporter = AzureExporter(
    connection_string='InstrumentationKey=<your-instrumentation-key-here>'
)
exporter.add_telemetry_processor(callback_function)
tracer = Tracer(exporter=exporter, sampler=ProbabilitySampler(1.0))
with tracer.span(name='parent'):
response = requests.get(url='https://www.wikipedia.org/wiki/Rabbit')
```

```python
# Example for metrics exporter
import time

from opencensus.ext.azure import metrics_exporter
from opencensus.stats import aggregation as aggregation_module
from opencensus.stats import measure as measure_module
from opencensus.stats import stats as stats_module
from opencensus.stats import view as view_module
from opencensus.tags import tag_map as tag_map_module

stats = stats_module.stats
view_manager = stats.view_manager
stats_recorder = stats.stats_recorder

CARROTS_MEASURE = measure_module.MeasureInt("carrots",
                                            "number of carrots",
                                            "carrots")
CARROTS_VIEW = view_module.View("carrots_view",
                                "number of carrots",
                                [],
                                CARROTS_MEASURE,
                                aggregation_module.CountAggregation())

# Callback function to only export the metric if value is greater than 0
def callback_function(envelope):
    return envelope.data.baseData.metrics[0].value > 0

def main():
    # Enable metrics
    # Set the interval in seconds in which you want to send metrics
    exporter = metrics_exporter.new_metrics_exporter(connection_string='InstrumentationKey=<your-instrumentation-key-here>')
    exporter.add_telemetry_processor(callback_function)
    view_manager.register_exporter(exporter)

    view_manager.register_view(CARROTS_VIEW)
    mmap = stats_recorder.new_measurement_map()
    tmap = tag_map_module.TagMap()

    mmap.measure_int_put(CARROTS_MEASURE, 1000)
    mmap.record(tmap)
    # Default export interval is every 15.0s
    # Your application should run for at least this amount
    # of time so the exporter will meet this interval
    # Sleep can fulfill this
    time.sleep(60)

    print("Done recording metrics")

if __name__ == "__main__":
    main()
```
You can add as many processors as you like, and they are called in the order they are added. If one processor should throw an exception, it does not impact the following processors.

### Example TelemetryInitializers

#### Add custom property

The following sample initializer adds a custom property to every tracked telemetry.

```csharp
public void Initialize(ITelemetry item)
{
  var itemProperties = item as ISupportProperties;
  if(itemProperties != null && !itemProperties.Properties.ContainsKey("customProp"))
    {
        itemProperties.Properties["customProp"] = "customValue";
    }
}
```

#### Add cloud role name

The following sample initializer sets cloud role name to every tracked telemetry.

```csharp
public void Initialize(ITelemetry telemetry)
{
    if (string.IsNullOrEmpty(telemetry.Context.Cloud.RoleName))
    {
        telemetry.Context.Cloud.RoleName = "MyCloudRoleName";
    }
}
```

#### Add information from HttpContext

The following sample initializer reads data from the [`HttpContext`](https://docs.microsoft.com/aspnet/core/fundamentals/http-context?view=aspnetcore-3.1) and appends it to a `RequestTelemetry` instance. The `IHttpContextAccessor` is automatically provided through constructor dependency injection.

```csharp
public class HttpContextRequestTelemetryInitializer : ITelemetryInitializer
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public HttpContextRequestTelemetryInitializer(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor =
            httpContextAccessor ??
            throw new ArgumentNullException(nameof(httpContextAccessor));
    }

    public void Initialize(ITelemetry telemetry)
    {
        var requestTelemetry = telemetry as RequestTelemetry;
        if (requestTelemetry == null) return;

        var claims = this.httpContextAccessor.HttpContext.User.Claims;
        Claim oidClaim = claims.FirstOrDefault(claim => claim.Type == "oid");
        requestTelemetry.Properties.Add("UserOid", oidClaim?.Value);
    }
}
```

## ITelemetryProcessor and ITelemetryInitializer

What's the difference between telemetry processors and telemetry initializers?

* There are some overlaps in what you can do with them: both can be used to add or modify properties of telemetry, though it is recommended to use initializers for that purpose.
* TelemetryInitializers always run before TelemetryProcessors.
* TelemetryInitializers may be called more than once. By convention, they do not set any property that has already been set.
* TelemetryProcessors allow you to completely replace or discard a telemetry item.
* All registered TelemetryInitializers are guaranteed to be called for every telemetry item. For Telemetry processors, SDK guarantees calling the very first telemetry processor. Whether the rest of the processors are called or not, is decided by the preceding telemetry processors.
* Use TelemetryInitializers to enrich telemetry with additional properties, or override existing one. Use TelemetryProcessor to filter out telemetry.

## Troubleshooting ApplicationInsights.config

* Confirm that the fully qualified type name and assembly name are correct.
* Confirm that the applicationinsights.config file is in your output directory and contains any recent changes.

## Reference docs

* [API Overview](../../azure-monitor/app/api-custom-events-metrics.md)
* [ASP.NET reference](https://msdn.microsoft.com/library/dn817570.aspx)

## SDK Code

* [ASP.NET Core SDK](https://github.com/Microsoft/ApplicationInsights-aspnetcore)
* [ASP.NET SDK](https://github.com/Microsoft/ApplicationInsights-dotnet)
* [JavaScript SDK](https://github.com/Microsoft/ApplicationInsights-JS)

## <a name="next"></a>Next steps
* [Search events and logs](../../azure-monitor/app/diagnostic-search.md)
* [Sampling](../../azure-monitor/app/sampling.md)
* [Troubleshooting](../../azure-monitor/app/troubleshoot-faq.md)
