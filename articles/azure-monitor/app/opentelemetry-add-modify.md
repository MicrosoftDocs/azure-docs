---
title: Add, modify, and filter Azure Monitor OpenTelemetry for .NET, Java, Node.js, and Python applications
description: This article provides guidance on how to add, modify, and filter OpenTelemetry for applications using Azure Monitor.
ms.topic: conceptual
ms.date: 10/10/2023
ms.devlang: csharp, javascript, typescript, python
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-python
ms.reviewer: mmcc
---

# Add, modify, and filter OpenTelemetry

This article provides guidance on how to add, modify, and filter OpenTelemetry for applications using [Azure Monitor Application Insights](app-insights-overview.md#application-insights-overview).

To learn more about OpenTelemetry concepts, see the [OpenTelemetry overview](opentelemetry-overview.md) or [OpenTelemetry FAQ](./opentelemetry-enable.md#frequently-asked-questions).

<!---NOTE TO CONTRIBUTORS: PLEASE DO NOT SEPARATE OUT JAVASCRIPT AND TYPESCRIPT INTO DIFFERENT TABS.--->

## Automatic data collection

The distros automatically collect data by bundling OpenTelemetry instrumentation libraries.

### Included instrumentation libraries

#### [ASP.NET Core](#tab/aspnetcore)

Requests
- [ASP.NET
  Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.AspNetCore/README.md) ¹

Dependencies
- [HttpClient](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.Http/README.md) ¹
- [SqlClient](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.SqlClient/README.md) ¹

Logging
- `ILogger`
 
For more information about `ILogger`, see [Logging in C# and .NET](/dotnet/core/extensions/logging) and [code examples](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/logs).

#### [.NET](#tab/net)

The Azure Monitor Exporter doesn't include any instrumentation libraries.

#### [Java](#tab/java)

Requests
* JMS consumers
* Kafka consumers
* Netty
* Quartz
* RabbitMQ
* Servlets
* Spring scheduling

> [!NOTE]
> Servlet and Netty autoinstrumentation covers the majority of Java HTTP services, including Java EE, Jakarta EE, Spring Boot, Quarkus, and Micronaut.

Dependencies (plus downstream distributed trace propagation):
* Apache HttpClient
* Apache HttpAsyncClient
* AsyncHttpClient
* Google HttpClient
* gRPC
* java.net.HttpURLConnection
* Java 11 HttpClient
* JAX-RS client
* Jetty HttpClient
* JMS
* Kafka
* Netty client
* OkHttp
* RabbitMQ

Dependencies (without downstream distributed trace propagation):
* Cassandra
* JDBC
* MongoDB (async and sync)
* Redis (Lettuce and Jedis)

Metrics

* Micrometer Metrics, including Spring Boot Actuator metrics
* JMX Metrics

Logs
* Logback (including MDC properties) ¹ ³
* Log4j (including MDC/Thread Context properties) ¹ ³
* JBoss Logging (including MDC properties) ¹ ³
* java.util.logging ¹ ³

Telemetry emitted by these Azure SDKs is automatically collected by default:

* [Azure App Configuration](/java/api/overview/azure/data-appconfiguration-readme) 1.1.10+
* [Azure Cognitive Search](/java/api/overview/azure/search-documents-readme) 11.3.0+
* [Azure Communication Chat](/java/api/overview/azure/communication-chat-readme) 1.0.0+
* [Azure Communication Common](/java/api/overview/azure/communication-common-readme) 1.0.0+
* [Azure Communication Identity](/java/api/overview/azure/communication-identity-readme) 1.0.0+
* [Azure Communication Phone Numbers](/java/api/overview/azure/communication-phonenumbers-readme) 1.0.0+
* [Azure Communication SMS](/java/api/overview/azure/communication-sms-readme) 1.0.0+
* [Azure Cosmos DB](/java/api/overview/azure/cosmos-readme) 4.22.0+
* [Azure Digital Twins - Core](/java/api/overview/azure/digitaltwins-core-readme) 1.1.0+
* [Azure Event Grid](/java/api/overview/azure/messaging-eventgrid-readme) 4.0.0+
* [Azure Event Hubs](/java/api/overview/azure/messaging-eventhubs-readme) 5.6.0+
* [Azure Event Hubs - Azure Blob Storage Checkpoint Store](/java/api/overview/azure/messaging-eventhubs-checkpointstore-blob-readme) 1.5.1+
* [Azure AI Document Intelligence](/java/api/overview/azure/ai-formrecognizer-readme) 3.0.6+
* [Azure Identity](/java/api/overview/azure/identity-readme) 1.2.4+
* [Azure Key Vault - Certificates](/java/api/overview/azure/security-keyvault-certificates-readme) 4.1.6+
* [Azure Key Vault - Keys](/java/api/overview/azure/security-keyvault-keys-readme) 4.2.6+
* [Azure Key Vault - Secrets](/java/api/overview/azure/security-keyvault-secrets-readme) 4.2.6+
* [Azure Service Bus](/java/api/overview/azure/messaging-servicebus-readme) 7.1.0+
* [Azure Storage - Blobs](/java/api/overview/azure/storage-blob-readme) 12.11.0+
* [Azure Storage - Blobs Batch](/java/api/overview/azure/storage-blob-batch-readme) 12.9.0+
* [Azure Storage - Blobs Cryptography](/java/api/overview/azure/storage-blob-cryptography-readme) 12.11.0+
* [Azure Storage - Common](/java/api/overview/azure/storage-common-readme) 12.11.0+
* [Azure Storage - Files Data Lake](/java/api/overview/azure/storage-file-datalake-readme) 12.5.0+
* [Azure Storage - Files Shares](/java/api/overview/azure/storage-file-share-readme) 12.9.0+
* [Azure Storage - Queues](/java/api/overview/azure/storage-queue-readme) 12.9.0+
* [Azure Text Analytics](/java/api/overview/azure/ai-textanalytics-readme) 5.0.4+

[//]: # "Azure Cosmos DB 4.22.0+ due to https://github.com/Azure/azure-sdk-for-java/pull/25571"

[//]: # "the remaining above names and links scraped from https://azure.github.io/azure-sdk/releases/latest/java.html"
[//]: # "and version synched manually against the oldest version in maven central built on azure-core 1.14.0"
[//]: # ""
[//]: # "var table = document.querySelector('#tg-sb-content > div > table')"
[//]: # "var str = ''"
[//]: # "for (var i = 1, row; row = table.rows[i]; i++) {"
[//]: # "  var name = row.cells[0].getElementsByTagName('div')[0].textContent.trim()"
[//]: # "  var stableRow = row.cells[1]"
[//]: # "  var versionBadge = stableRow.querySelector('.badge')"
[//]: # "  if (!versionBadge) {"
[//]: # "    continue"
[//]: # "  }"
[//]: # "  var version = versionBadge.textContent.trim()"
[//]: # "  var link = stableRow.querySelectorAll('a')[2].href"
[//]: # "  str += '* [' + name + '](' + link + ') ' + version + '\n'"
[//]: # "}"
[//]: # "console.log(str)"

#### [Node.js](#tab/nodejs)

The following OpenTelemetry Instrumentation libraries are included as part of the Azure Monitor Application Insights Distro. For more information, see [OpenTelemetry officially supported instrumentations](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry#officially-supported-instrumentations).

Requests
- [HTTP/HTTPS](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http) ²

Dependencies
- [MongoDB](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mongodb)
- [MySQL](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mysql)
- [Postgres](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-pg)
- [Redis](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-redis)
- [Redis-4](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-redis-4)
- [Azure SDK](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/instrumentation/opentelemetry-instrumentation-azure-sdk)

Instrumentations can be configured using AzureMonitorOpenTelemetryOptions  

```typescript
    // Import Azure Monitor OpenTelemetry
    const { useAzureMonitor, AzureMonitorOpenTelemetryOptions } = require("@azure/monitor-opentelemetry");
    // Import OpenTelemetry HTTP Instrumentation to get config type
    const { HttpInstrumentationConfig } = require("@azure/monitor-opentelemetry");
     // Import HTTP to get type
    const { IncomingMessage } = require("http");

    // Specific Instrumentation configs could be added
    const httpInstrumentationConfig: HttpInstrumentationConfig = {
        ignoreIncomingRequestHook: (request: IncomingMessage) => {
            return false; //Return true if you want to ignore a specific request 
        },
        enabled: true
    };
    // Instrumentations configuration
    const options: AzureMonitorOpenTelemetryOptions = {
    instrumentationOptions: {
        http: httpInstrumentationConfig,
        azureSdk: { enabled: true },
        mongoDb: { enabled: true },
        mySql: { enabled: true },
        postgreSql: { enabled: true },
        redis: { enabled: true },
        redis4: { enabled: true },
    }
    };

    // Enable Azure Monitor integration
    useAzureMonitor(options);

```


#### [Python](#tab/python)

Requests
- [Django](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-django) ¹
- [FastApi](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-fastapi) ¹
- [Flask](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-flask) ¹

Dependencies
- [Psycopg2](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-psycopg2)
- [Requests](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-requests) ¹
- [`Urllib`](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-urllib) ¹
- [`Urllib3`](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation/opentelemetry-instrumentation-urllib3) ¹

Logs
- [Python logging library](https://docs.python.org/3/howto/logging.html) ⁴

Examples of using the Python logging library can be found on [GitHub](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry/samples/logging).

Telemetry emitted by Azure SDKS is automatically [collected](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry#azure-core-distributed-tracing) by default.

---

**Footnotes**
- ¹: Supports automatic reporting of *unhandled/uncaught* exceptions
- ²: Supports OpenTelemetry Metrics
- ³: By default, logging is only collected at INFO level or higher. To change this setting, see the [configuration options](./java-standalone-config.md#autocollected-logging).
- ⁴: By default, logging is only collected when that logging is performed at the WARNING level or higher.

> [!NOTE]
> The Azure Monitor OpenTelemetry Distros include custom mapping and logic to automatically emit [Application Insights standard metrics](standard-metrics.md).

> [!TIP]
> The OpenTelemetry-based offerings currently emit all OpenTelemetry metrics as [Custom Metrics](opentelemetry-add-modify.md#add-custom-metrics) and [Performance Counters](standard-metrics.md#performance-counters) in Metrics Explorer. For .NET, Node.js, and Python, whatever you set as the meter name becomes the metrics namespace.

### Add a community instrumentation library

You can collect more data automatically when you include instrumentation libraries from the OpenTelemetry community.

[!INCLUDE [azure-monitor-app-insights-opentelemetry-support](../includes/azure-monitor-app-insights-opentelemetry-community-library-warning.md)]

### [ASP.NET Core](#tab/aspnetcore)

To add a community library, use the `ConfigureOpenTelemetryMeterProvider` or `ConfigureOpenTelemetryTracerProvider` methods.

The following example demonstrates how the [Runtime Instrumentation](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Runtime) can be added to collect extra metrics.

```csharp
// Create a new ASP.NET Core web application builder.
var builder = WebApplication.CreateBuilder(args);

// Configure the OpenTelemetry meter provider to add runtime instrumentation.
builder.Services.ConfigureOpenTelemetryMeterProvider((sp, builder) => builder.AddRuntimeInstrumentation());

// Add the Azure Monitor telemetry service to the application.
// This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor();

// Build the ASP.NET Core web application.
var app = builder.Build();

// Start the ASP.NET Core web application.
app.Run();
```

### [.NET](#tab/net)

The following example demonstrates how the [Runtime Instrumentation](https://www.nuget.org/packages/OpenTelemetry.Instrumentation.Runtime) can be added to collect extra metrics.

```csharp
// Create a new OpenTelemetry meter provider and add runtime instrumentation and the Azure Monitor metric exporter.
// It is important to keep the MetricsProvider instance active throughout the process lifetime.
var metricsProvider = Sdk.CreateMeterProviderBuilder()
    .AddRuntimeInstrumentation()
    .AddAzureMonitorMetricExporter();
```

### [Java](#tab/java)
You can't extend the Java Distro with community instrumentation libraries. To request that we include another instrumentation library, open an issue on our GitHub page. You can find a link to our GitHub page in [Next Steps](#next-steps).

### [Node.js](#tab/nodejs)

Other OpenTelemetry Instrumentations are available [here](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node) and could be added using TraceHandler in ApplicationInsightsClient.

 ```javascript
    // Import the Azure Monitor OpenTelemetry plugin and OpenTelemetry API
    const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
    const { metrics, trace, ProxyTracerProvider } = require("@opentelemetry/api");

    // Import the OpenTelemetry instrumentation registration function and Express instrumentation
    const { registerInstrumentations } = require( "@opentelemetry/instrumentation");
    const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

    // Get the OpenTelemetry tracer provider and meter provider
    const tracerProvider = (trace.getTracerProvider() as ProxyTracerProvider).getDelegate();
    const meterProvider = metrics.getMeterProvider();

    // Enable Azure Monitor integration
    useAzureMonitor();
    
    // Register the Express instrumentation
    registerInstrumentations({
      // List of instrumentations to register
      instrumentations: [
        new ExpressInstrumentation(), // Express instrumentation
      ],
    // OpenTelemetry tracer provider
      tracerProvider: tracerProvider,
      // OpenTelemetry meter provider
      meterProvider: meterProvider
    });
 ```

### [Python](#tab/python)

To add a community instrumentation library (not officially supported/included in Azure Monitor distro), you can instrument directly with the instrumentations. The list of community instrumentation libraries can be found [here](https://github.com/open-telemetry/opentelemetry-python-contrib/tree/main/instrumentation).

> [!NOTE]
> Instrumenting a [supported instrumentation library](.\opentelemetry-add-modify.md?tabs=python#included-instrumentation-libraries) manually with `instrument()` in conjunction with the distro `configure_azure_monitor()` is not recommended. This is not a supported scenario and you may get undesired behavior for your telemetry.

```python
# Import the `configure_azure_monitor()`, `SQLAlchemyInstrumentor`, `create_engine`, and `text` functions from the appropriate packages.
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from sqlalchemy import create_engine, text

# Configure OpenTelemetry to use Azure Monitor.
configure_azure_monitor()

# Create a SQLAlchemy engine.
engine = create_engine("sqlite:///:memory:")

# SQLAlchemy instrumentation is not officially supported by this package, however, you can use the OpenTelemetry `instrument()` method manually in conjunction with `configure_azure_monitor()`.
SQLAlchemyInstrumentor().instrument(
    engine=engine,
)

# Database calls using the SQLAlchemy library will be automatically captured.
with engine.connect() as conn:
    result = conn.execute(text("select 'hello world'"))
    print(result.all())

```

---

## Collect custom telemetry

This section explains how to collect custom telemetry from your application.
  
Depending on your language and signal type, there are different ways to collect custom telemetry, including:
  
-	OpenTelemetry API
-	Language-specific logging/metrics libraries
-	Application Insights [Classic API](api-custom-events-metrics.md)
 
The following table represents the currently supported custom telemetry types:

| Language                                  | Custom Events | Custom Metrics | Dependencies | Exceptions | Page Views | Requests | Traces |
|-------------------------------------------|---------------|----------------|--------------|------------|------------|----------|--------|
| **ASP.NET Core**                          |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;`ILogger` API             |               |                |              |            |            |          | Yes    |
| &nbsp;&nbsp;&nbsp;AI Classic API          |               |                |              |            |            |          |        |
|                                           |               |                |              |            |            |          |        |
| **Java**                                  |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;Logback, `Log4j`, JUL   |               |                |              | Yes        |            |          | Yes    |
| &nbsp;&nbsp;&nbsp;Micrometer Metrics      |               | Yes            |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;AI Classic API          |  Yes          | Yes            | Yes          | Yes        | Yes        | Yes      | Yes    |
|                                           |               |                |              |            |            |          |        |
| **Node.js**                               |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
|                                           |               |                |              |            |            |          |        |
| **Python**                                |               |                |              |            |            |          |        |
| &nbsp;&nbsp;&nbsp;OpenTelemetry API       |               | Yes            | Yes          | Yes        |            | Yes      |        |
| &nbsp;&nbsp;&nbsp;Python Logging Module   |               |                |              |            |            |          | Yes    |
| &nbsp;&nbsp;&nbsp;Events Extension        |   Yes         |                |              |            |            |          | Yes    |

> [!NOTE]
> Application Insights Java 3.x listens for telemetry that's sent to the Application Insights [Classic API](api-custom-events-metrics.md). Similarly, Application Insights Node.js 3.x collects events created with the Application Insights [Classic API](api-custom-events-metrics.md). This makes upgrading easier and fills a gap in our custom telemetry support until all custom telemetry types are supported via the OpenTelemetry API.

### Add custom metrics

> [!NOTE]
> Custom Metrics are under preview in Azure Monitor Application Insights. Custom metrics without dimensions are available by default. To view and alert on dimensions, you need to [opt-in](pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).

Consider collecting more metrics beyond what's provided by the instrumentation libraries.

The OpenTelemetry API offers six metric "instruments" to cover various metric scenarios and you need to pick the correct "Aggregation Type" when visualizing metrics in Metrics Explorer. This requirement is true when using the OpenTelemetry Metric API to send metrics and when using an instrumentation library.

The following table shows the recommended [aggregation types](../essentials/metrics-aggregation-explained.md#aggregation-types) for each of the OpenTelemetry Metric Instruments.

| OpenTelemetry Instrument                             | Azure Monitor Aggregation Type                             |
|------------------------------------------------------|------------------------------------------------------------|
| Counter                                              | Sum                                                        |
| Asynchronous Counter                                 | Sum                                                        |
| Histogram                                            | Min, Max, Average, Sum and Count                           |
| Asynchronous Gauge                                   | Average                                                    |
| UpDownCounter                                        | Sum                                                        |
| Asynchronous UpDownCounter                           | Sum                                                        |

> [!CAUTION]
> Aggregation types beyond what's shown in the table typically aren't meaningful.

The [OpenTelemetry Specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/metrics/api.md#instrument)
describes the instruments and provides examples of when you might use each one.

> [!TIP]
> The histogram is the most versatile and most closely equivalent to the Application Insights GetMetric [Classic API](api-custom-events-metrics.md). Azure Monitor currently flattens the histogram instrument into our five supported aggregation types, and support for percentiles is underway. Although less versatile, other OpenTelemetry instruments have a lesser impact on your application's performance.

#### Histogram example

#### [ASP.NET Core](#tab/aspnetcore)

Application startup must subscribe to a Meter by name.

```csharp
// Create a new ASP.NET Core web application builder.
var builder = WebApplication.CreateBuilder(args);

// Configure the OpenTelemetry meter provider to add a meter named "OTel.AzureMonitor.Demo".
builder.Services.ConfigureOpenTelemetryMeterProvider((sp, builder) => builder.AddMeter("OTel.AzureMonitor.Demo"));

// Add the Azure Monitor telemetry service to the application.
// This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor();

// Build the ASP.NET Core web application.
var app = builder.Build();

// Start the ASP.NET Core web application.
app.Run();
```

The `Meter` must be initialized using that same name.

```csharp
// Create a new meter named "OTel.AzureMonitor.Demo".
var meter = new Meter("OTel.AzureMonitor.Demo");

// Create a new histogram metric named "FruitSalePrice".
Histogram<long> myFruitSalePrice = meter.CreateHistogram<long>("FruitSalePrice");

// Create a new Random object.
var rand = new Random();

// Record a few random sale prices for apples and lemons, with different colors.
myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "red"));
myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));
myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));
myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "green"));
myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "red"));
myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));
```

#### [.NET](#tab/net)

```csharp
public class Program
{
    // Create a static readonly Meter object named "OTel.AzureMonitor.Demo".
    // This meter will be used to track metrics about the application.
    private static readonly Meter meter = new("OTel.AzureMonitor.Demo");

    public static void Main()
    {
        // Create a new MeterProvider object using the OpenTelemetry SDK.
        // The MeterProvider object is responsible for managing meters and sending
        // metric data to exporters.
        // It is important to keep the MetricsProvider instance active
        // throughout the process lifetime.
        //
        // The MeterProviderBuilder is configured to add a meter named
        // "OTel.AzureMonitor.Demo" and an Azure Monitor metric exporter.
        using var meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddMeter("OTel.AzureMonitor.Demo")
            .AddAzureMonitorMetricExporter()
            .Build();

        // Create a new Histogram metric named "FruitSalePrice".
        // This metric will track the distribution of fruit sale prices.
        Histogram<long> myFruitSalePrice = meter.CreateHistogram<long>("FruitSalePrice");

        // Create a new Random object. This object will be used to generate random sale prices.
        var rand = new Random();
        
        // Record a few random sale prices for apples and lemons, with different colors.
        // Each record includes a timestamp, a value, and a set of attributes.
        // The attributes can be used to filter and analyze the metric data.
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "red"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "green"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "apple"), new("color", "red"));
        myFruitSalePrice.Record(rand.Next(1, 1000), new("name", "lemon"), new("color", "yellow"));

        // Display a message to the user and wait for them to press Enter.
        // This allows the user to see the message and the console before the
        // application exits.
        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
}
```

#### [Java](#tab/java)

```java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.metrics.DoubleHistogram;
import io.opentelemetry.api.metrics.Meter;

public class Program {

    public static void main(String[] args) {
        Meter meter = GlobalOpenTelemetry.getMeter("OTEL.AzureMonitor.Demo");
        DoubleHistogram histogram = meter.histogramBuilder("histogram").build();
        histogram.record(1.0);
        histogram.record(100.0);
        histogram.record(30.0);
    }
}
```

#### [Node.js](#tab/nodejs)

 ```javascript
    // Import the Azure Monitor OpenTelemetry plugin and OpenTelemetry API
    const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
    const { metrics } = require("@opentelemetry/api");

    // Enable Azure Monitor integration
    useAzureMonitor();

    // Get the meter for the "testMeter" namespace
    const meter =  metrics.getMeter("testMeter");

    // Create a histogram metric
    let histogram = meter.createHistogram("histogram");

    // Record values to the histogram metric with different tags
    histogram.record(1, { "testKey": "testValue" });
    histogram.record(30, { "testKey": "testValue2" });
    histogram.record(100, { "testKey2": "testValue" });
```

#### [Python](#tab/python)

```python
# Import the `configure_azure_monitor()` and `metrics` functions from the appropriate packages.
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import metrics

# Configure OpenTelemetry to use Azure Monitor with the specified connection string.
# Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
configure_azure_monitor(
    connection_string="<your-connection-string>",
)

# Get a meter provider and a meter with the name "otel_azure_monitor_histogram_demo".
meter = metrics.get_meter_provider().get_meter("otel_azure_monitor_histogram_demo")

# Record three values to the histogram.
histogram = meter.create_histogram("histogram")
histogram.record(1.0, {"test_key": "test_value"})
histogram.record(100.0, {"test_key2": "test_value"})
histogram.record(30.0, {"test_key": "test_value2"})

# Wait for background execution.
input()
```

---

#### Counter example

#### [ASP.NET Core](#tab/aspnetcore)

Application startup must subscribe to a Meter by name.

```csharp
// Create a new ASP.NET Core web application builder.
var builder = WebApplication.CreateBuilder(args);

// Configure the OpenTelemetry meter provider to add a meter named "OTel.AzureMonitor.Demo".
builder.Services.ConfigureOpenTelemetryMeterProvider((sp, builder) => builder.AddMeter("OTel.AzureMonitor.Demo"));

// Add the Azure Monitor telemetry service to the application.
// This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor();

// Build the ASP.NET Core web application.
var app = builder.Build();

// Start the ASP.NET Core web application.
app.Run();
```

The `Meter` must be initialized using that same name.

```csharp
// Create a new meter named "OTel.AzureMonitor.Demo".
var meter = new Meter("OTel.AzureMonitor.Demo");

// Create a new counter metric named "MyFruitCounter".
Counter<long> myFruitCounter = meter.CreateCounter<long>("MyFruitCounter");

// Record the number of fruits sold, grouped by name and color.
myFruitCounter.Add(1, new("name", "apple"), new("color", "red"));
myFruitCounter.Add(2, new("name", "lemon"), new("color", "yellow"));
myFruitCounter.Add(1, new("name", "lemon"), new("color", "yellow"));
myFruitCounter.Add(2, new("name", "apple"), new("color", "green"));
myFruitCounter.Add(5, new("name", "apple"), new("color", "red"));
myFruitCounter.Add(4, new("name", "lemon"), new("color", "yellow"));
```

#### [.NET](#tab/net)

```csharp
public class Program
{
    // Create a static readonly Meter object named "OTel.AzureMonitor.Demo".
    // This meter will be used to track metrics about the application.
    private static readonly Meter meter = new("OTel.AzureMonitor.Demo");

    public static void Main()
    {
        // Create a new MeterProvider object using the OpenTelemetry SDK.
        // The MeterProvider object is responsible for managing meters and sending
        // metric data to exporters.
        // It is important to keep the MetricsProvider instance active
        // throughout the process lifetime.
        //
        // The MeterProviderBuilder is configured to add a meter named
        // "OTel.AzureMonitor.Demo" and an Azure Monitor metric exporter.
        using var meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddMeter("OTel.AzureMonitor.Demo")
            .AddAzureMonitorMetricExporter()
            .Build();

        // Create a new counter metric named "MyFruitCounter".
        // This metric will track the number of fruits sold.
        Counter<long> myFruitCounter = meter.CreateCounter<long>("MyFruitCounter");

        // Record the number of fruits sold, grouped by name and color.
        myFruitCounter.Add(1, new("name", "apple"), new("color", "red"));
        myFruitCounter.Add(2, new("name", "lemon"), new("color", "yellow"));
        myFruitCounter.Add(1, new("name", "lemon"), new("color", "yellow"));
        myFruitCounter.Add(2, new("name", "apple"), new("color", "green"));
        myFruitCounter.Add(5, new("name", "apple"), new("color", "red"));
        myFruitCounter.Add(4, new("name", "lemon"), new("color", "yellow"));

        // Display a message to the user and wait for them to press Enter.
        // This allows the user to see the message and the console before the
        // application exits.
        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
}
```

#### [Java](#tab/java)

```Java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.Meter;

public class Program {

    public static void main(String[] args) {
        Meter meter = GlobalOpenTelemetry.getMeter("OTEL.AzureMonitor.Demo");

        LongCounter myFruitCounter = meter
                .counterBuilder("MyFruitCounter")
                .build();

        myFruitCounter.add(1, Attributes.of(AttributeKey.stringKey("name"), "apple", AttributeKey.stringKey("color"), "red"));
        myFruitCounter.add(2, Attributes.of(AttributeKey.stringKey("name"), "lemon", AttributeKey.stringKey("color"), "yellow"));
        myFruitCounter.add(1, Attributes.of(AttributeKey.stringKey("name"), "lemon", AttributeKey.stringKey("color"), "yellow"));
        myFruitCounter.add(2, Attributes.of(AttributeKey.stringKey("name"), "apple", AttributeKey.stringKey("color"), "green"));
        myFruitCounter.add(5, Attributes.of(AttributeKey.stringKey("name"), "apple", AttributeKey.stringKey("color"), "red"));
        myFruitCounter.add(4, Attributes.of(AttributeKey.stringKey("name"), "lemon", AttributeKey.stringKey("color"), "yellow"));
    }
}
```

#### [Node.js](#tab/nodejs)

```javascript
    // Import the Azure Monitor OpenTelemetry plugin and OpenTelemetry API
    const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
    const { metrics } = require("@opentelemetry/api");

    // Enable Azure Monitor integration
    useAzureMonitor();

    // Get the meter for the "testMeter" namespace
    const meter =  metrics.getMeter("testMeter");

    // Create a counter metric
    let counter = meter.createCounter("counter");

    // Add values to the counter metric with different tags
    counter.add(1, { "testKey": "testValue" });
    counter.add(5, { "testKey2": "testValue" });
    counter.add(3, { "testKey": "testValue2" });
```

#### [Python](#tab/python)

```python
# Import the `configure_azure_monitor()` and `metrics` functions from the appropriate packages.
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import metrics

# Configure OpenTelemetry to use Azure Monitor with the specified connection string.
# Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
configure_azure_monitor(
    connection_string="<your-connection-string>",
)
# Get a meter provider and a meter with the name "otel_azure_monitor_counter_demo".
meter = metrics.get_meter_provider().get_meter("otel_azure_monitor_counter_demo")

# Create a counter metric with the name "counter".
counter = meter.create_counter("counter")

# Add three values to the counter.
# The first argument to the `add()` method is the value to add.
# The second argument is a dictionary of dimensions.
# Dimensions are used to group related metrics together.
counter.add(1.0, {"test_key": "test_value"})
counter.add(5.0, {"test_key2": "test_value"})
counter.add(3.0, {"test_key": "test_value2"})

# Wait for background execution.
input()
```

---

#### Gauge Example

#### [ASP.NET Core](#tab/aspnetcore)

Application startup must subscribe to a Meter by name.

```csharp
// Create a new ASP.NET Core web application builder.
var builder = WebApplication.CreateBuilder(args);

// Configure the OpenTelemetry meter provider to add a meter named "OTel.AzureMonitor.Demo".
builder.Services.ConfigureOpenTelemetryMeterProvider((sp, builder) => builder.AddMeter("OTel.AzureMonitor.Demo"));

// Add the Azure Monitor telemetry service to the application.
// This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor();

// Build the ASP.NET Core web application.
var app = builder.Build();

// Start the ASP.NET Core web application.
app.Run();
```

The `Meter` must be initialized using that same name.

```csharp
// Get the current process.
var process = Process.GetCurrentProcess();

// Create a new meter named "OTel.AzureMonitor.Demo".
var meter = new Meter("OTel.AzureMonitor.Demo");

// Create a new observable gauge metric named "Thread.State".
// This metric will track the state of each thread in the current process.
ObservableGauge<int> myObservableGauge = meter.CreateObservableGauge("Thread.State", () => GetThreadState(process));

private static IEnumerable<Measurement<int>> GetThreadState(Process process)
{
    // Iterate over all threads in the current process.
    foreach (ProcessThread thread in process.Threads)
    {
        // Create a measurement for each thread, including the thread state, process ID, and thread ID.
        yield return new((int)thread.ThreadState, new("ProcessId", process.Id), new("ThreadId", thread.Id));
    }
}
```

#### [.NET](#tab/net)

```csharp
public class Program
{
    // Create a static readonly Meter object named "OTel.AzureMonitor.Demo".
    // This meter will be used to track metrics about the application.
    private static readonly Meter meter = new("OTel.AzureMonitor.Demo");

    public static void Main()
    {
        // Create a new MeterProvider object using the OpenTelemetry SDK.
        // The MeterProvider object is responsible for managing meters and sending
        // metric data to exporters. 
        // It is important to keep the MetricsProvider instance active
        // throughout the process lifetime.
        //
        // The MeterProviderBuilder is configured to add a meter named
        // "OTel.AzureMonitor.Demo" and an Azure Monitor metric exporter.
        using var meterProvider = Sdk.CreateMeterProviderBuilder()
            .AddMeter("OTel.AzureMonitor.Demo")
            .AddAzureMonitorMetricExporter()
            .Build();

        // Get the current process.
        var process = Process.GetCurrentProcess();
        
        // Create a new observable gauge metric named "Thread.State".
        // This metric will track the state of each thread in the current process.
        ObservableGauge<int> myObservableGauge = meter.CreateObservableGauge("Thread.State", () => GetThreadState(process));

        // Display a message to the user and wait for them to press Enter.
        // This allows the user to see the message and the console before the
        // application exits.
        System.Console.WriteLine("Press Enter key to exit.");
        System.Console.ReadLine();
    }
    
    private static IEnumerable<Measurement<int>> GetThreadState(Process process)
    {
        // Iterate over all threads in the current process.
        foreach (ProcessThread thread in process.Threads)
        {
            // Create a measurement for each thread, including the thread state, process ID, and thread ID.
            yield return new((int)thread.ThreadState, new("ProcessId", process.Id), new("ThreadId", thread.Id));
        }
    }
}
```

#### [Java](#tab/java)

```Java
import io.opentelemetry.api.GlobalOpenTelemetry;
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.Meter;

public class Program {

    public static void main(String[] args) {
        Meter meter = GlobalOpenTelemetry.getMeter("OTEL.AzureMonitor.Demo");

        meter.gaugeBuilder("gauge")
                .buildWithCallback(
                        observableMeasurement -> {
                            double randomNumber = Math.floor(Math.random() * 100);
                            observableMeasurement.record(randomNumber, Attributes.of(AttributeKey.stringKey("testKey"), "testValue"));
                        });
    }
}
```

#### [Node.js](#tab/nodejs)

```typescript
    // Import the useAzureMonitor function and the metrics module from the @azure/monitor-opentelemetry and @opentelemetry/api packages, respectively.
    const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
    const { metrics } = require("@opentelemetry/api");

    // Enable Azure Monitor integration.
    useAzureMonitor();

    // Get the meter for the "testMeter" meter name.
    const meter = metrics.getMeter("testMeter");

    // Create an observable gauge metric with the name "gauge".
    let gauge = meter.createObservableGauge("gauge");

    // Add a callback to the gauge metric. The callback will be invoked periodically to generate a new value for the gauge metric.
    gauge.addCallback((observableResult: ObservableResult) => {
      // Generate a random number between 0 and 99.
      let randomNumber = Math.floor(Math.random() * 100);

      // Set the value of the gauge metric to the random number.
      observableResult.observe(randomNumber, {"testKey": "testValue"});
    });
```

#### [Python](#tab/python)

```python
# Import the necessary packages.
from typing import Iterable

from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import metrics
from opentelemetry.metrics import CallbackOptions, Observation

# Configure OpenTelemetry to use Azure Monitor with the specified connection string.
# Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
configure_azure_monitor(
    connection_string="<your-connection-string>",
)

# Get a meter provider and a meter with the name "otel_azure_monitor_gauge_demo".
meter = metrics.get_meter_provider().get_meter("otel_azure_monitor_gauge_demo")

# Define two observable gauge generators.
# The first generator yields a single observation with the value 9.
# The second generator yields a sequence of 10 observations with the value 9 and a different dimension value for each observation.
def observable_gauge_generator(options: CallbackOptions) -> Iterable[Observation]:
    yield Observation(9, {"test_key": "test_value"})

def observable_gauge_sequence(options: CallbackOptions) -> Iterable[Observation]:
    observations = []
    for i in range(10):
        observations.append(
            Observation(9, {"test_key": i})
        )
    return observations

# Create two observable gauges using the defined generators.
gauge = meter.create_observable_gauge("gauge", [observable_gauge_generator])
gauge2 = meter.create_observable_gauge("gauge2", [observable_gauge_sequence])

# Wait for background execution.
input()
```

---

### Add custom exceptions

Select instrumentation libraries automatically report exceptions to Application Insights.
However, you may want to manually report exceptions beyond what instrumentation libraries report.
For instance, exceptions caught by your code aren't ordinarily reported. You may wish to report them
to draw attention in relevant experiences including the failures section and end-to-end transaction views.

#### [ASP.NET Core](#tab/aspnetcore)

- To log an Exception using an Activity:
  ```csharp
  // Start a new activity named "ExceptionExample".
  using (var activity = activitySource.StartActivity("ExceptionExample"))
  {
      // Try to execute some code.
      try
      {
          throw new Exception("Test exception");
      }
      // If an exception is thrown, catch it and set the activity status to "Error".
      catch (Exception ex)
      {
          activity?.SetStatus(ActivityStatusCode.Error);
          activity?.RecordException(ex);
      }
  }
  ```
- To log an Exception using `ILogger`:
  ```csharp
  // Create a logger using the logger factory. The logger category name is used to filter and route log messages.
  var logger = loggerFactory.CreateLogger(logCategoryName);

  // Try to execute some code.
  try
  {
      throw new Exception("Test Exception");
  }
  catch (Exception ex)
  {
      // Log an error message with the exception. The log level is set to "Error" and the event ID is set to 0.
      // The log message includes a template and a parameter. The template will be replaced with the value of the parameter when the log message is written.
      logger.Log(
          logLevel: LogLevel.Error,
          eventId: 0,
          exception: ex,
          message: "Hello {name}.",
          args: new object[] { "World" });
  }
  ```

#### [.NET](#tab/net)

- To log an Exception using an Activity:
  ```csharp
  // Start a new activity named "ExceptionExample".
  using (var activity = activitySource.StartActivity("ExceptionExample"))
  {
      // Try to execute some code.
      try
      {
          throw new Exception("Test exception");
      }
      // If an exception is thrown, catch it and set the activity status to "Error".
      catch (Exception ex)
      {
          activity?.SetStatus(ActivityStatusCode.Error);
          activity?.RecordException(ex);
      }
  }
  ```
- To log an Exception using `ILogger`:
  ```csharp
  // Create a logger using the logger factory. The logger category name is used to filter and route log messages.
  var logger = loggerFactory.CreateLogger("ExceptionExample");

  try
  {
      // Try to execute some code.
      throw new Exception("Test Exception");
  }
  catch (Exception ex)
  {
      // Log an error message with the exception. The log level is set to "Error" and the event ID is set to 0.
      // The log message includes a template and a parameter. The template will be replaced with the value of the parameter when the log message is written.
      logger.Log(
          logLevel: LogLevel.Error,
          eventId: 0,
          exception: ex,
          message: "Hello {name}.",
          args: new object[] { "World" });
  }
  ```

#### [Java](#tab/java)

You can use `opentelemetry-api` to update the status of a span and record exceptions.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Set status to `error` and record an exception in your code:

   ```java
    import io.opentelemetry.api.trace.Span;
    import io.opentelemetry.api.trace.StatusCode;

    Span span = Span.current();
    span.setStatus(StatusCode.ERROR, "errorMessage");
    span.recordException(e);
   ```

#### [Node.js](#tab/nodejs)

```javascript
    // Import the Azure Monitor OpenTelemetry plugin and OpenTelemetry API
    const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
    const { trace } = require("@opentelemetry/api");

    // Enable Azure Monitor integration
    useAzureMonitor();

    // Get the tracer for the "testTracer" namespace
    const tracer = trace.getTracer("testTracer");

    // Start a span with the name "hello"
    let span = tracer.startSpan("hello");

    // Try to throw an error
    try{
      throw new Error("Test Error");
    }

    // Catch the error and record it to the span
    catch(error){
      span.recordException(error);
    }
```

#### [Python](#tab/python)

The OpenTelemetry Python SDK is implemented in such a way that exceptions thrown are automatically captured and recorded. See the following code sample for an example of this behavior.

```python
# Import the necessary packages.
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

# Configure OpenTelemetry to use Azure Monitor with the specified connection string.
# Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
configure_azure_monitor(
    connection_string="<your-connection-string>",
)

# Get a tracer for the current module.
tracer = trace.get_tracer("otel_azure_monitor_exception_demo")

# Exception events
try:
    # Start a new span with the name "hello".
    with tracer.start_as_current_span("hello") as span:
        # This exception will be automatically recorded
        raise Exception("Custom exception message.")
except Exception:
    print("Exception raised")

```

If you would like to record exceptions manually, you can disable that option
within the context manager and use `record_exception()` directly as shown in the following example:

```python
...
# Start a new span with the name "hello" and disable exception recording.
with tracer.start_as_current_span("hello", record_exception=False) as span:
    try:
        # Raise an exception.
        raise Exception("Custom exception message.")
    except Exception as ex:
        # Manually record exception
        span.record_exception(ex)
...

```

---

### Add custom spans

You may want to add a custom span in two scenarios. First, when there's a dependency request not already collected by an instrumentation library. Second, when you wish to model an application process as a span on the end-to-end transaction view.
  
#### [ASP.NET Core](#tab/aspnetcore)

> [!NOTE]
> The `Activity` and `ActivitySource` classes from the `System.Diagnostics` namespace represent the OpenTelemetry concepts of `Span` and `Tracer`, respectively. You create `ActivitySource` directly by using its constructor instead of by using `TracerProvider`. Each [`ActivitySource`](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/trace/customizing-the-sdk#activity-source) class must be explicitly connected to `TracerProvider` by using `AddSource()`. That's because parts of the OpenTelemetry tracing API are incorporated directly into the .NET runtime. To learn more, see [Introduction to OpenTelemetry .NET Tracing API](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Api/README.md#introduction-to-opentelemetry-net-tracing-api).


```csharp
// Define an activity source named "ActivitySourceName". This activity source will be used to create activities for all requests to the application.
internal static readonly ActivitySource activitySource = new("ActivitySourceName");

// Create an ASP.NET Core application builder.
var builder = WebApplication.CreateBuilder(args);

// Configure the OpenTelemetry tracer provider to add a source named "ActivitySourceName". This will ensure that all activities created by the activity source are traced.
builder.Services.ConfigureOpenTelemetryTracerProvider((sp, builder) => builder.AddSource("ActivitySourceName"));

// Add the Azure Monitor telemetry service to the application. This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor();

// Build the ASP.NET Core application.
var app = builder.Build();

// Map a GET request to the root path ("/") to the specified action.
app.MapGet("/", () =>
{
    // Start a new activity named "CustomActivity". This activity will be traced and the trace data will be sent to Azure Monitor.
    using (var activity = activitySource.StartActivity("CustomActivity"))
    {
        // your code here
    }

    // Return a response message.
    return $"Hello World!";
});

// Start the ASP.NET Core application.
app.Run();
```

`StartActivity` defaults to `ActivityKind.Internal`, but you can provide any other `ActivityKind`.
`ActivityKind.Client`, `ActivityKind.Producer`, and `ActivityKind.Internal` are mapped to Application Insights `dependencies`.
`ActivityKind.Server` and `ActivityKind.Consumer` are mapped to Application Insights `requests`.

#### [.NET](#tab/net)

> [!NOTE]
> The `Activity` and `ActivitySource` classes from the `System.Diagnostics` namespace represent the OpenTelemetry concepts of `Span` and `Tracer`, respectively. You create `ActivitySource` directly by using its constructor instead of by using `TracerProvider`. Each [`ActivitySource`](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/trace/customizing-the-sdk#activity-source) class must be explicitly connected to `TracerProvider` by using `AddSource()`. That's because parts of the OpenTelemetry tracing API are incorporated directly into the .NET runtime. To learn more, see [Introduction to OpenTelemetry .NET Tracing API](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Api/README.md#introduction-to-opentelemetry-net-tracing-api).

```csharp
// Create an OpenTelemetry tracer provider builder.
// It is important to keep the TracerProvider instance active throughout the process lifetime.
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddSource("ActivitySourceName")
        .AddAzureMonitorTraceExporter()
        .Build();

// Create an activity source named "ActivitySourceName".
var activitySource = new ActivitySource("ActivitySourceName");

// Start a new activity named "CustomActivity". This activity will be traced and the trace data will be sent to Azure Monitor.
using (var activity = activitySource.StartActivity("CustomActivity"))
{
    // your code here
}
```

`StartActivity` defaults to `ActivityKind.Internal`, but you can provide any other `ActivityKind`.
`ActivityKind.Client`, `ActivityKind.Producer`, and `ActivityKind.Internal` are mapped to Application Insights `dependencies`.
`ActivityKind.Server` and `ActivityKind.Consumer` are mapped to Application Insights `requests`.

#### [Java](#tab/java)
  
##### Use the OpenTelemetry annotation

The simplest way to add your own spans is by using OpenTelemetry's `@WithSpan` annotation.

Spans populate the `requests` and `dependencies` tables in Application Insights.

1. Add `opentelemetry-instrumentation-annotations-1.21.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry.instrumentation</groupId>
     <artifactId>opentelemetry-instrumentation-annotations</artifactId>
     <version>1.21.0</version>
   </dependency>
   ```

1. Use the `@WithSpan` annotation to emit a span each time your method is executed:

   ```java
    import io.opentelemetry.instrumentation.annotations.WithSpan;

    @WithSpan(value = "your span name")
    public void yourMethod() {
    }
   ```

By default, the span ends up in the `dependencies` table with dependency type `InProc`.

For methods representing a background job not captured by autoinstrumentation, we recommend applying the attribute `kind = SpanKind.SERVER` to the `@WithSpan` annotation to ensure they appear in the Application Insights `requests` table.

##### Use the OpenTelemetry API

If the preceding OpenTelemetry `@WithSpan` annotation doesn't meet your needs,
you can add your spans by using the OpenTelemetry API.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Use the `GlobalOpenTelemetry` class to create a `Tracer`:

   ```java
    import io.opentelemetry.api.GlobalOpenTelemetry;
    import io.opentelemetry.api.trace.Tracer;

    static final Tracer tracer = GlobalOpenTelemetry.getTracer("com.example");
   ```

1. Create a span, make it current, and then end it:

   ```java
    Span span = tracer.spanBuilder("my first span").startSpan();
    try (Scope ignored = span.makeCurrent()) {
        // do stuff within the context of this 
    } catch (Throwable t) {
        span.recordException(t);
    } finally {
        span.end();
    }
   ```

#### [Node.js](#tab/nodejs)

```javascript
    // Import the Azure Monitor OpenTelemetry plugin and OpenTelemetry API
    const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
    const { trace } = require("@opentelemetry/api");

    // Enable Azure Monitor integration
    useAzureMonitor();

    // Get the tracer for the "testTracer" namespace
    const tracer = trace.getTracer("testTracer");

    // Start a span with the name "hello"
    let span = tracer.startSpan("hello");

    // End the span
    span.end();
```

#### [Python](#tab/python)

The OpenTelemetry API can be used to add your own spans, which appear in the `requests` and `dependencies` tables in Application Insights.

The code example shows how to use the `tracer.start_as_current_span()` method to start, make the span current, and end the span within its context.

```python
...
# Import the necessary packages.
from opentelemetry import trace

# Get a tracer for the current module.
tracer = trace.get_tracer(__name__)

# Start a new span with the name "my first span" and make it the current span.
# The "with" context manager starts, makes the span current, and ends the span within it's context
with tracer.start_as_current_span("my first span") as span:
    try:
        # Do stuff within the context of this span.
        # All telemetry generated within this scope will be attributed to this span.
    except Exception as ex:
        # Record the exception on the span.
        span.record_exception(ex)
...

```

By default, the span is in the `dependencies` table with a dependency type of `InProc`.

If your method represents a background job not already captured by autoinstrumentation, we recommend setting the attribute `kind = SpanKind.SERVER` to ensure it appears in the Application Insights `requests` table.

```python
...
# Import the necessary packages.
from opentelemetry import trace
from opentelemetry.trace import SpanKind

# Get a tracer for the current module.
tracer = trace.get_tracer(__name__)

# Start a new span with the name "my request span" and the kind set to SpanKind.SERVER.
with tracer.start_as_current_span("my request span", kind=SpanKind.SERVER) as span:
    # Do stuff within the context of this span.
...
```

---

<!--

### Add Custom Events

#### Span Events

The OpenTelemetry Logs/Events API is still under development. In the meantime, you can use the OpenTelemetry Span API to create "Span Events", which populate the traces table in Application Insights. The string passed in to addEvent() is saved to the message field within the trace.

> [!CAUTION]
> Span Events are only recommended for when you need additional diagnostic metadata associated with your span. For other scenarios, such as describing business events, we recommend you wait for the release of the OpenTelemetry Events API.

#### [ASP.NET Core](#tab/aspnetcore)
  
Currently unavailable.
  
#### [.NET](#tab/net)

Currently unavailable.

#### [Java](#tab/java)

You can use `opentelemetry-api` to create span events, which populate the `traces` table in Application Insights. The string passed in to `addEvent()` is saved to the `message` field within the trace.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Add span events in your code:

   ```java
    import io.opentelemetry.api.trace.Span;

    Span.current().addEvent("eventName");
   ```

#### [Node.js](#tab/nodejs)

Currently unavailable.
  
#### [Python](#tab/python)

Currently unavailable.

---

-->
  
### Send custom telemetry using the Application Insights Classic API

We recommend you use the OpenTelemetry APIs whenever possible, but there may be some scenarios when you have to use the Application Insights [Classic API](api-custom-events-metrics.md)s.
  
#### [ASP.NET Core](#tab/aspnetcore)
  
Not available in .NET.

#### [.NET](#tab/net)

Not available in .NET.

#### [Java](#tab/java)

1. Add `applicationinsights-core` to your application:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>applicationinsights-core</artifactId>
      <version>3.4.14</version>
    </dependency>
    ```

1. Create a `TelemetryClient` instance:
    
    ```java
    static final TelemetryClient telemetryClient = new TelemetryClient();
    ```

1. Use the client to send custom telemetry:

    ##### Events
    
    ```java
    telemetryClient.trackEvent("WinGame");
    ```
    
    ##### Metrics
    
    ```java
    telemetryClient.trackMetric("queueLength", 42.0);
    ```
    
    ##### Dependencies
    
    ```java
    boolean success = false;
    long startTime = System.currentTimeMillis();
    try {
        success = dependency.call();
    } finally {
        long endTime = System.currentTimeMillis();
        RemoteDependencyTelemetry telemetry = new RemoteDependencyTelemetry();
        telemetry.setSuccess(success);
        telemetry.setTimestamp(new Date(startTime));
        telemetry.setDuration(new Duration(endTime - startTime));
        telemetryClient.trackDependency(telemetry);
    }
    ```
    
    ##### Logs
    
    ```java
    telemetryClient.trackTrace(message, SeverityLevel.Warning, properties);
    ```
    
    ##### Exceptions
    
    ```java
    try {
        ...
    } catch (Exception e) {
        telemetryClient.trackException(e);
    }
    ```

#### [Node.js](#tab/nodejs)

If you want to add custom events or access the Application Insights API, replace the @azure/monitor-opentelemetry package with the `applicationinsights` [v3 Beta package](https://www.npmjs.com/package/applicationinsights/v/beta). It offers the same methods and interfaces, and all sample code for @azure/monitor-opentelemetry applies to the v3 Beta package.

You need to use the `applicationinsights` v3 Beta package to send custom telemetry using the Application Insights classic API. (https://www.npmjs.com/package/applicationinsights/v/beta)

```javascript
    // Import the TelemetryClient class from the Application Insights SDK for JavaScript.
    const { TelemetryClient } = require("applicationinsights");

    // Create a new TelemetryClient instance.
    const telemetryClient = new TelemetryClient();
```

Then use the `TelemetryClient` to send custom telemetry:

##### Events

```javascript
    // Create an event telemetry object.
    let eventTelemetry = {
      name: "testEvent"
    };

    // Send the event telemetry object to Azure Monitor Application Insights.
    telemetryClient.trackEvent(eventTelemetry);
```

##### Logs

```javascript
    // Create a trace telemetry object.
    let traceTelemetry = {
      message: "testMessage",
      severity: "Information"
    };

    // Send the trace telemetry object to Azure Monitor Application Insights.
    telemetryClient.trackTrace(traceTelemetry);
```
    
##### Exceptions

```javascript
    // Try to execute a block of code.
    try {
      ...
    }

    // If an error occurs, catch it and send it to Azure Monitor Application Insights as an exception telemetry item.
    catch (error) {
      let exceptionTelemetry = {
        exception: error,
        severity: "Critical"
      };
      telemetryClient.trackException(exceptionTelemetry);
}
```

#### [Python](#tab/python)
  
Unlike other languages, Python doesn't have an Application Insights SDK. You can meet all your monitoring needs with the Azure Monitor OpenTelemetry Distro, except for sending `customEvents`. Until the OpenTelemetry Events API stabilizes, use the [Azure Monitor Events Extension](https://pypi.org/project/azure-monitor-events-extension/0.1.0/) with the Azure Monitor OpenTelemetry Distro to send `customEvents` to Application Insights.

Install the distro and the extension:

```console
pip install azure-monitor-opentelemetry
pip install azure-monitor-events-extension
```

Use the `track_event` API offered in the extension to send customEvents.

```python
...
from azure.monitor.events.extension import track_event
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor()

# Use the track_event() api to send custom event telemetry
# Takes event name and custom dimensions
track_event("Test event", {"key1": "value1", "key2": "value2"})

input()
...
```

---

## Modify telemetry

This section explains how to modify telemetry.

### Add span attributes

These attributes might include adding a custom property to your telemetry. You might also use attributes to set optional fields in the Application Insights schema, like Client IP.

#### Add a custom property to a Span

Any [attributes](#add-span-attributes) you add to spans are exported as custom properties. They populate the _customDimensions_ field in the requests, dependencies, traces, or exceptions table.

##### [ASP.NET Core](#tab/aspnetcore)

To add span attributes, use either of the following two ways:

* Use options provided by [instrumentation libraries](opentelemetry-enable.md#install-the-client-library).
* Add a custom span processor.

> [!TIP]
> The advantage of using options provided by instrumentation libraries, when they're available, is that the entire context is available. As a result, users can select to add or filter more attributes. For example, the enrich option in the HttpClient instrumentation library gives users access to the [HttpRequestMessage](/dotnet/api/system.net.http.httprequestmessage) and the [HttpResponseMessage](/dotnet/api/system.net.http.httpresponsemessage) itself. They can select anything from it and store it as an attribute.

1. Many instrumentation libraries provide an enrich option. For guidance, see the readme files of individual instrumentation libraries:
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#enrich)
    - [HttpClient](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.Http/README.md#enrich)

1. Use a custom processor:

> [!TIP]
> Add the processor shown here *before* adding Azure Monitor.

```csharp
// Create an ASP.NET Core application builder.
var builder = WebApplication.CreateBuilder(args);

// Configure the OpenTelemetry tracer provider to add a new processor named ActivityEnrichingProcessor.
builder.Services.ConfigureOpenTelemetryTracerProvider((sp, builder) => builder.AddProcessor(new ActivityEnrichingProcessor()));

// Add the Azure Monitor telemetry service to the application. This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor();

// Build the ASP.NET Core application.
var app = builder.Build();

// Start the ASP.NET Core application.
app.Run();
```

Add `ActivityEnrichingProcessor.cs` to your project with the following code:

```csharp
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

#### [.NET](#tab/net)

To add span attributes, use either of the following two ways:

* Use options provided by instrumentation libraries.
* Add a custom span processor.

> [!TIP]
> The advantage of using options provided by instrumentation libraries, when they're available, is that the entire context is available. As a result, users can select to add or filter more attributes. For example, the enrich option in the HttpClient instrumentation library gives users access to the httpRequestMessage itself. They can select anything from it and store it as an attribute.

1. Many instrumentation libraries provide an enrich option. For guidance, see the readme files of individual instrumentation libraries:
    - [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.AspNet-1.0.0-rc9.8/src/OpenTelemetry.Instrumentation.AspNet/README.md#enrich)
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#enrich)
    - [HttpClient](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.Http/README.md#enrich)

1. Use a custom processor:

> [!TIP]
> Add the processor shown here *before* the Azure Monitor Exporter.

```csharp
// Create an OpenTelemetry tracer provider builder.
// It is important to keep the TracerProvider instance active throughout the process lifetime.
using var tracerProvider = Sdk.CreateTracerProviderBuilder()
        // Add a source named "OTel.AzureMonitor.Demo".
        .AddSource("OTel.AzureMonitor.Demo") // Add a new processor named ActivityEnrichingProcessor.
        .AddProcessor(new ActivityEnrichingProcessor()) // Add the Azure Monitor trace exporter.
        .AddAzureMonitorTraceExporter() // Add the Azure Monitor trace exporter.
        .Build();
```

Add `ActivityEnrichingProcessor.cs` to your project with the following code:

```csharp
public class ActivityEnrichingProcessor : BaseProcessor<Activity>
{
    // The OnEnd method is called when an activity is finished. This is the ideal place to enrich the activity with additional data.
    public override void OnEnd(Activity activity)
    {
        // Update the activity's display name.
        // The updated activity will be available to all processors which are called after this processor.
        activity.DisplayName = "Updated-" + activity.DisplayName;
        // Set custom tags on the activity.
        activity.SetTag("CustomDimension1", "Value1");
        activity.SetTag("CustomDimension2", "Value2");
    }
}
```

##### [Java](#tab/java)

You can use `opentelemetry-api` to add attributes to spans.

Adding one or more span attributes populates the `customDimensions` field in the `requests`, `dependencies`, `traces`, or `exceptions` table.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Add custom dimensions in your code:

   ```java
    import io.opentelemetry.api.trace.Span;
    import io.opentelemetry.api.common.AttributeKey;

    AttributeKey attributeKey = AttributeKey.stringKey("mycustomdimension");
    Span.current().setAttribute(attributeKey, "myvalue1");
   ```

##### [Node.js](#tab/nodejs)

```typescript
// Import the necessary packages.
const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
const { trace, ProxyTracerProvider } = require("@opentelemetry/api");
const { ReadableSpan, Span, SpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { SemanticAttributes } = require("@opentelemetry/semantic-conventions");

// Enable Azure Monitor integration.
useAzureMonitor();

// Get the NodeTracerProvider instance.
const tracerProvider = ((trace.getTracerProvider() as ProxyTracerProvider).getDelegate() as NodeTracerProvider);

// Create a new SpanEnrichingProcessor class.
class SpanEnrichingProcessor implements SpanProcessor {
  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }

  onStart(_span: Span): void {}

  onEnd(span: ReadableSpan) {
    // Add custom dimensions to the span.
    span.attributes["CustomDimension1"] = "value1";
    span.attributes["CustomDimension2"] = "value2";
  }
}

// Add the SpanEnrichingProcessor instance to the NodeTracerProvider instance.
tracerProvider.addSpanProcessor(new SpanEnrichingProcessor());
```

##### [Python](#tab/python)

Use a custom processor:

```python
...
# Import the necessary packages.
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

# Configure OpenTelemetry to use Azure Monitor with the specified connection string.
# Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
configure_azure_monitor(
    connection_string="<your-connection-string>",
)

# Create a SpanEnrichingProcessor instance.
span_enrich_processor = SpanEnrichingProcessor()

# Add the span enrich processor to the current TracerProvider.
trace.get_tracer_provider().add_span_processor(span_enrich_processor)
...
```

Add `SpanEnrichingProcessor.py` to your project with the following code:

```python
# Import the SpanProcessor class from the opentelemetry.sdk.trace module.
from opentelemetry.sdk.trace import SpanProcessor

class SpanEnrichingProcessor(SpanProcessor):

    def on_end(self, span):
        # Prefix the span name with the string "Updated-".
        span._name = "Updated-" + span.name
        # Add the custom dimension "CustomDimension1" with the value "Value1".
        span._attributes["CustomDimension1"] = "Value1"
         # Add the custom dimension "CustomDimension2" with the value "Value2".
        span._attributes["CustomDimension2"] = "Value2"
```

---

#### Set the user IP

You can populate the _client_IP_ field for requests by setting the `http.client_ip` attribute on the span. Application Insights uses the IP address to generate user location attributes and then [discards it by default](ip-collection.md#default-behavior).

##### [ASP.NET Core](#tab/aspnetcore)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code in `ActivityEnrichingProcessor.cs`:

```C#
// Add the client IP address to the activity as a tag.
// only applicable in case of activity.Kind == Server
activity.SetTag("http.client_ip", "<IP Address>");
```

#### [.NET](#tab/net)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code in `ActivityEnrichingProcessor.cs`:

```C#
// Add the client IP address to the activity as a tag.
// only applicable in case of activity.Kind == Server
activity.SetTag("http.client_ip", "<IP Address>");
```

##### [Java](#tab/java)

Java automatically populates this field.

##### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

```typescript
...
    // Import the SemanticAttributes class from the @opentelemetry/semantic-conventions package.
    const { SemanticAttributes } = require("@opentelemetry/semantic-conventions");

    // Create a new SpanEnrichingProcessor class.
    class SpanEnrichingProcessor implements SpanProcessor {

      onEnd(span) {
        // Set the HTTP_CLIENT_IP attribute on the span to the IP address of the client.
        span.attributes[SemanticAttributes.HTTP_CLIENT_IP] = "<IP Address>";
      }
    }
```

##### [Python](#tab/python)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code in `SpanEnrichingProcessor.py`:

```python
# Set the `http.client_ip` attribute of the span to the specified IP address.
span._attributes["http.client_ip"] = "<IP Address>"
```

---

#### Set the user ID or authenticated user ID

You can populate the _user_Id_ or _user_AuthenticatedId_ field for requests by using the following guidance. User ID is an anonymous user identifier. Authenticated User ID is a known user identifier.

> [!IMPORTANT]
> Consult applicable privacy laws before you set the Authenticated User ID.

##### [ASP.NET Core](#tab/aspnetcore)

Use the add [custom property example](#add-a-custom-property-to-a-span).

```csharp
// Add the user ID to the activity as a tag, but only if the activity is not null.
activity?.SetTag("enduser.id", "<User Id>");
```

##### [.NET](#tab/net)

Use the add [custom property example](#add-a-custom-property-to-a-span).

```csharp
// Add the user ID to the activity as a tag, but only if the activity is not null.
activity?.SetTag("enduser.id", "<User Id>");
```

##### [Java](#tab/java)

Populate the `user ID` field in the `requests`, `dependencies`, or `exceptions` table.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Set `user_Id` in your code:

   ```java
   import io.opentelemetry.api.trace.Span;

   Span.current().setAttribute("enduser.id", "myuser");
   ```

#### [Node.js](#tab/nodejs)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

```typescript
...
    // Import the SemanticAttributes class from the @opentelemetry/semantic-conventions package.
    import { SemanticAttributes } from "@opentelemetry/semantic-conventions";

    // Create a new SpanEnrichingProcessor class.
    class SpanEnrichingProcessor implements SpanProcessor {

      onEnd(span: ReadableSpan) {
        // Set the ENDUSER_ID attribute on the span to the ID of the user.
        span.attributes[SemanticAttributes.ENDUSER_ID] = "<User ID>";
      }
    }
```

##### [Python](#tab/python)

Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

```python
# Set the `enduser.id` attribute of the span to the specified user ID.
span._attributes["enduser.id"] = "<User ID>"
```

---

### Add log attributes
  
#### [ASP.NET Core](#tab/aspnetcore)

OpenTelemetry uses .NET's `ILogger`.
Attaching custom dimensions to logs can be accomplished using a [message template](/dotnet/core/extensions/logging?tabs=command-line#log-message-template).

#### [.NET](#tab/net)

OpenTelemetry uses .NET's `ILogger`.
Attaching custom dimensions to logs can be accomplished using a [message template](/dotnet/core/extensions/logging?tabs=command-line#log-message-template).

#### [Java](#tab/java)

Logback, Log4j, and java.util.logging are [autoinstrumented](#logs). Attaching custom dimensions to your logs can be accomplished in these ways:

* [Log4j 2.0 MapMessage](https://logging.apache.org/log4j/2.x/log4j-api/apidocs/org/apache/logging/log4j/message/MapMessage.html) (a `MapMessage` key of `"message"` is captured as the log message)
* [Log4j 2.0 Thread Context](https://logging.apache.org/log4j/2.x/manual/thread-context.html)
* [Log4j 1.2 MDC](https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/MDC.html)

#### [Node.js](#tab/nodejs)

```typescript
    // Import the useAzureMonitor function and the logs module from the @azure/monitor-opentelemetry and @opentelemetry/api-logs packages, respectively.
    const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
    const { logs } = require("@opentelemetry/api-logs");
    import { Logger } from "@opentelemetry/sdk-logs";

    // Enable Azure Monitor integration.
    useAzureMonitor();

    // Get the logger for the "testLogger" logger name.
    const logger = (logs.getLogger("testLogger") as Logger);

    // Create a new log record.
    const logRecord = {
      body: "testEvent",
      attributes: {
        "testAttribute1": "testValue1",
        "testAttribute2": "testValue2",
        "testAttribute3": "testValue3"
      }
    };

    // Emit the log record.
    logger.emit(logRecord);
```

#### [Python](#tab/python)
  
The Python [logging](https://docs.python.org/3/howto/logging.html) library is [autoinstrumented](.\opentelemetry-add-modify.md?tabs=python#included-instrumentation-libraries). You can attach custom dimensions to your logs by passing a dictionary into the `extra` argument of your logs.

```python
...
# Create a warning log message with the properties "key1" and "value1".
logger.warning("WARNING: Warning log with properties", extra={"key1": "value1"})
...

```

---

## Filter telemetry

You might use the following ways to filter out telemetry before it leaves your application.

### [ASP.NET Core](#tab/aspnetcore)

1. Many instrumentation libraries provide a filter option. For guidance, see the readme files of individual instrumentation libraries:
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#filter)
    - [HttpClient](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.Http/README.md#filter)

1. Use a custom processor:
    
    > [!TIP]
    > Add the processor shown here *before* adding Azure Monitor.

    ```csharp
    // Create an ASP.NET Core application builder.
    var builder = WebApplication.CreateBuilder(args);

    // Configure the OpenTelemetry tracer provider to add a new processor named ActivityFilteringProcessor.
    builder.Services.ConfigureOpenTelemetryTracerProvider((sp, builder) => builder.AddProcessor(new ActivityFilteringProcessor()));
    // Configure the OpenTelemetry tracer provider to add a new source named "ActivitySourceName".
    builder.Services.ConfigureOpenTelemetryTracerProvider((sp, builder) => builder.AddSource("ActivitySourceName"));
    // Add the Azure Monitor telemetry service to the application. This service will collect and send telemetry data to Azure Monitor.
    builder.Services.AddOpenTelemetry().UseAzureMonitor();

    // Build the ASP.NET Core application.
    var app = builder.Build();

    // Start the ASP.NET Core application.
    app.Run();
    ```
    
    Add `ActivityFilteringProcessor.cs` to your project with the following code:
    
    ```csharp
    public class ActivityFilteringProcessor : BaseProcessor<Activity>
    {
        // The OnStart method is called when an activity is started. This is the ideal place to filter activities.
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

1. If a particular source isn't explicitly added by using `AddSource("ActivitySourceName")`, then none of the activities created by using that source are exported.

### [.NET](#tab/net)

1. Many instrumentation libraries provide a filter option. For guidance, see the readme files of individual instrumentation libraries:
    - [ASP.NET](https://github.com/open-telemetry/opentelemetry-dotnet-contrib/blob/Instrumentation.AspNet-1.0.0-rc9.8/src/OpenTelemetry.Instrumentation.AspNet/README.md#filter)
    - [ASP.NET Core](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.AspNetCore/README.md#filter)
    - [HttpClient](https://github.com/open-telemetry/opentelemetry-dotnet/blob/1.0.0-rc9.14/src/OpenTelemetry.Instrumentation.Http/README.md#filter)

1. Use a custom processor:
    
    ```csharp
    // Create an OpenTelemetry tracer provider builder.
    // It is important to keep the TracerProvider instance active throughout the process lifetime.
    using var tracerProvider = Sdk.CreateTracerProviderBuilder()
            .AddSource("OTel.AzureMonitor.Demo") // Add a source named "OTel.AzureMonitor.Demo".
            .AddProcessor(new ActivityFilteringProcessor()) // Add a new processor named ActivityFilteringProcessor.
            .AddAzureMonitorTraceExporter() // Add the Azure Monitor trace exporter.
            .Build();
    ```
    
    Add `ActivityFilteringProcessor.cs` to your project with the following code:
    
    ```csharp
    public class ActivityFilteringProcessor : BaseProcessor<Activity>
    {
        // The OnStart method is called when an activity is started. This is the ideal place to filter activities.
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

1. If a particular source isn't explicitly added by using `AddSource("ActivitySourceName")`, then none of the activities created by using that source are exported.


### [Java](#tab/java)

See [sampling overrides](java-standalone-config.md#sampling-overrides-preview) and [telemetry processors](java-standalone-telemetry-processors.md).

### [Node.js](#tab/nodejs)

1. Exclude the URL option provided by many HTTP instrumentation libraries.

    The following example shows how to exclude a certain URL from being tracked by using the [HTTP/HTTPS instrumentation library](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http):
    
    ```typescript
    // Import the useAzureMonitor function and the ApplicationInsightsOptions class from the @azure/monitor-opentelemetry package.
    const { useAzureMonitor, ApplicationInsightsOptions } = require("@azure/monitor-opentelemetry");

    // Import the HttpInstrumentationConfig class from the @opentelemetry/instrumentation-http package.
    const { HttpInstrumentationConfig }= require("@opentelemetry/instrumentation-http");

    // Import the IncomingMessage and RequestOptions classes from the http and https packages, respectively.
    const { IncomingMessage } = require("http");
    const { RequestOptions } = require("https");

    // Create a new HttpInstrumentationConfig object.
    const httpInstrumentationConfig: HttpInstrumentationConfig = {
      enabled: true,
      ignoreIncomingRequestHook: (request: IncomingMessage) => {
        // Ignore OPTIONS incoming requests.
        if (request.method === 'OPTIONS') {
          return true;
        }
        return false;
      },
      ignoreOutgoingRequestHook: (options: RequestOptions) => {
        // Ignore outgoing requests with the /test path.
        if (options.path === '/test') {
          return true;
        }
        return false;
      }
    };

    // Create a new ApplicationInsightsOptions object.
    const config: ApplicationInsightsOptions = {
      instrumentationOptions: {
        http: {
          httpInstrumentationConfig
        }
      }
    };

    // Enable Azure Monitor integration using the useAzureMonitor function and the ApplicationInsightsOptions object.
    useAzureMonitor(config);
    ```

2. Use a custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set `TraceFlag` to `DEFAULT`.
Use the add [custom property example](#add-a-custom-property-to-a-span), but replace the following lines of code:

    ```typescript
    // Import the SpanKind and TraceFlags classes from the @opentelemetry/api package.
    const { SpanKind, TraceFlags } = require("@opentelemetry/api");

    // Create a new SpanEnrichingProcessor class.
    class SpanEnrichingProcessor {

      onEnd(span) {
        // If the span is an internal span, set the trace flags to NONE.
        if(span.kind == SpanKind.INTERNAL){
          span.spanContext().traceFlags = TraceFlags.NONE;
        }
      }
    }
    ```

### [Python](#tab/python)

1. Exclude the URL with the `OTEL_PYTHON_EXCLUDED_URLS` environment variable:
    ```
    export OTEL_PYTHON_EXCLUDED_URLS="http://localhost:8080/ignore"
    ```
    Doing so excludes the endpoint shown in the following Flask example:
    
    ```python
    ...
    # Import the Flask and Azure Monitor OpenTelemetry SDK libraries.
    import flask
    from azure.monitor.opentelemetry import configure_azure_monitor
    
    # Configure OpenTelemetry to use Azure Monitor with the specified connection string.
    # Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
    configure_azure_monitor(
        connection_string="<your-connection-string>",
    )
    
    # Create a Flask application.
    app = flask.Flask(__name__)

    # Define a route. Requests sent to this endpoint will not be tracked due to
    # flask_config configuration.
    @app.route("/ignore")
    def ignore():
        return "Request received but not tracked."
    ...
    ```

1. Use a custom processor. You can use a custom span processor to exclude certain spans from being exported. To mark spans to not be exported, set `TraceFlag` to `DEFAULT`.
    
    ```python
    ...
    # Import the necessary libraries.
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace

    # Configure OpenTelemetry to use Azure Monitor with the specified connection string.
    # Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
    configure_azure_monitor(
        connection_string="<your-connection-string>",
    )
    
    # Add a SpanFilteringProcessor to the tracer provider.
    trace.get_tracer_provider().add_span_processor(SpanFilteringProcessor())
    ...
    ```
    
    Add `SpanFilteringProcessor.py` to your project with the following code:
    
    ```python
    # Import the necessary libraries.
    from opentelemetry.trace import SpanContext, SpanKind, TraceFlags
    from opentelemetry.sdk.trace import SpanProcessor
    
    # Define a custom span processor called `SpanFilteringProcessor`.
    class SpanFilteringProcessor(SpanProcessor):
    
        # Prevents exporting spans from internal activities.
        def on_start(self, span):
            # Check if the span is an internal activity.
            if span._kind is SpanKind.INTERNAL:
                # Create a new span context with the following properties:
                #   * The trace ID is the same as the trace ID of the original span.
                #   * The span ID is the same as the span ID of the original span.
                #   * The is_remote property is set to `False`.
                #   * The trace flags are set to `DEFAULT`.
                #   * The trace state is the same as the trace state of the original span.
                span._context = SpanContext(
                    span.context.trace_id,
                    span.context.span_id,
                    span.context.is_remote,
                    TraceFlags.DEFAULT,
                    span.context.trace_state,
                )
    
    ```

---
    
<!-- For more information, see [GitHub Repo](link). -->

## Get the trace ID or span ID
    
You might want to get the trace ID or span ID. If you have logs sent to a destination other than Application Insights, consider adding the trace ID or span ID. Doing so enables better correlation when debugging and diagnosing issues.

### [ASP.NET Core](#tab/aspnetcore)

> [!NOTE]
> The `Activity` and `ActivitySource` classes from the `System.Diagnostics` namespace represent the OpenTelemetry concepts of `Span` and `Tracer`, respectively. That's because parts of the OpenTelemetry tracing API are incorporated directly into the .NET runtime. To learn more, see [Introduction to OpenTelemetry .NET Tracing API](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Api/README.md#introduction-to-opentelemetry-net-tracing-api).

```csharp
// Get the current activity.
Activity activity = Activity.Current;
// Get the trace ID of the activity.
string traceId = activity?.TraceId.ToHexString();
// Get the span ID of the activity.
string spanId = activity?.SpanId.ToHexString();
```

### [.NET](#tab/net)

> [!NOTE]
> The `Activity` and `ActivitySource` classes from the `System.Diagnostics` namespace represent the OpenTelemetry concepts of `Span` and `Tracer`, respectively. That's because parts of the OpenTelemetry tracing API are incorporated directly into the .NET runtime. To learn more, see [Introduction to OpenTelemetry .NET Tracing API](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry.Api/README.md#introduction-to-opentelemetry-net-tracing-api).

```csharp
// Get the current activity.
Activity activity = Activity.Current;
// Get the trace ID of the activity.
string traceId = activity?.TraceId.ToHexString();
// Get the span ID of the activity.
string spanId = activity?.SpanId.ToHexString();
```

### [Java](#tab/java)

You can use `opentelemetry-api` to get the trace ID or span ID.

1. Add `opentelemetry-api-1.0.0.jar` (or later) to your application:

   ```xml
   <dependency>
     <groupId>io.opentelemetry</groupId>
     <artifactId>opentelemetry-api</artifactId>
     <version>1.0.0</version>
   </dependency>
   ```

1. Get the request trace ID and the span ID in your code:

   ```java
   import io.opentelemetry.api.trace.Span;

   Span span = Span.current();
   String traceId = span.getSpanContext().getTraceId();
   String spanId = span.getSpanContext().getSpanId();
   ```

### [Node.js](#tab/nodejs)

Get the request trace ID and the span ID in your code:

   ```javascript
   // Import the trace module from the OpenTelemetry API.
    const { trace } = require("@opentelemetry/api");

    // Get the span ID and trace ID of the active span.
    let spanId = trace.getActiveSpan().spanContext().spanId;
    let traceId = trace.getActiveSpan().spanContext().traceId;
   ```

### [Python](#tab/python)

Get the request trace ID and the span ID in your code:

```python
# Import the necessary libraries.   
from opentelemetry import trace

# Get the trace ID and span ID of the current span.
trace_id = trace.get_current_span().get_span_context().trace_id
span_id = trace.get_current_span().get_span_context().span_id
```

---

[!INCLUDE [azure-monitor-app-insights-opentelemetry-faqs](../includes/azure-monitor-app-insights-opentelemetry-faqs.md)]

[!INCLUDE [azure-monitor-app-insights-opentelemetry-support](../includes/azure-monitor-app-insights-opentelemetry-support.md)]

## Next steps

### [ASP.NET Core](#tab/aspnetcore)

- To further configure the OpenTelemetry distro, see [Azure Monitor OpenTelemetry configuration](opentelemetry-configuration.md)
- To review the source code, see the [Azure Monitor AspNetCore GitHub repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.AspNetCore).
- To install the NuGet package, check for updates, or view release notes, see the [Azure Monitor AspNetCore NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.AspNetCore) page.
- To become more familiar with Azure Monitor and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.AspNetCore/tests/Azure.Monitor.OpenTelemetry.AspNetCore.Demo).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry .NET GitHub repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

#### [.NET](#tab/net)

- To further configure the OpenTelemetry distro, see [Azure Monitor OpenTelemetry configuration](opentelemetry-configuration.md)
- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter).
- To install the NuGet package, check for updates, or view release notes, see the [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) page.
- To become more familiar with Azure Monitor and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter/tests/Azure.Monitor.OpenTelemetry.Exporter.Demo).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry .NET GitHub repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Java](#tab/java)

- Review [Java autoinstrumentation configuration options](java-standalone-config.md).
- To review the source code, see the [Azure Monitor Java autoinstrumentation GitHub repository](https://github.com/Microsoft/ApplicationInsights-Java).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Java GitHub repository](https://github.com/open-telemetry/opentelemetry-java-instrumentation).
- To enable usage experiences, see [Enable web or browser user monitoring](javascript.md).
- See the [release notes](https://github.com/microsoft/ApplicationInsights-Java/releases) on GitHub.

### [Node.js](#tab/nodejs)

- To review the source code, see the [Azure Monitor OpenTelemetry GitHub repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry).
- To install the npm package and check for updates, see the [`@azure/monitor-opentelemetry` npm Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-node.js).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry JavaScript GitHub repository](https://github.com/open-telemetry/opentelemetry-js).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Python](#tab/python)

- To review the source code and extra documentation, see the [Azure Monitor Distro GitHub repository](https://github.com/microsoft/ApplicationInsights-Python/blob/main/azure-monitor-opentelemetry/README.md).
- To see extra samples and use cases, see [Azure Monitor Distro samples](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry/samples).
- See the [release notes](https://github.com/microsoft/ApplicationInsights-Python/releases) on GitHub.
- To install the PyPI package, check for updates, or view release notes, see the [Azure Monitor Distro PyPI Package](https://pypi.org/project/azure-monitor-opentelemetry/) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python).
- To see available OpenTelemetry instrumentations and components, see the [OpenTelemetry Contributor Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python-contrib).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).
