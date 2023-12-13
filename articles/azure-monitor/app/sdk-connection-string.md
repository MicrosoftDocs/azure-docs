---
title: Connection strings in Application Insights | Microsoft Docs
description: This article shows how to use connection strings.
ms.topic: conceptual
ms.date: 09/12/2023
ms.custom: devx-track-csharp
ms.reviewer: cogoodson
---

# Connection strings

This article shows how to use connection strings.

## Overview

Connection strings define where to send telemetry data.

Key-value pairs provide an easy way for users to define a prefix suffix combination for each Application Insights service or product.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Scenario overview

Scenarios most affected by this change:

- Firewall exceptions or proxy redirects:

    In cases where monitoring for intranet web server is required, our earlier solution asked you to add individual service endpoints to your configuration. For more information, see the [Can I monitor an intranet web server?](./ip-addresses.md#can-i-monitor-an-intranet-web-server). Connection strings offer a better alternative by reducing this effort to a single setting. A simple prefix, suffix amendment, allows automatic population and redirection of all endpoints to the right services.

- Sovereign or hybrid cloud environments:

    Users can send data to a defined [Azure Government region](../../azure-government/compare-azure-government-global-azure.md#application-insights). By using connection strings, you can define endpoint settings for your intranet servers or hybrid cloud settings.

## Get started

Review the following sections to get started.

### Find your connection string

Your connection string appears in the **Overview** section of your Application Insights resource.

:::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows the Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

### Schema

Schema elements are explained in the following sections.

#### Max length

The connection has a maximum supported length of 4,096 characters.

#### Key-value pairs

A connection string consists of a list of settings represented as key-value pairs separated by a semicolon:
`key1=value1;key2=value2;key3=value3`

#### Syntax

- `InstrumentationKey` (for example, 00000000-0000-0000-0000-000000000000).
   `InstrumentationKey` is a *required* field.
- `Authorization` (for example, ikey). This setting is optional because today we only support ikey authorization.
- `EndpointSuffix` (for example, applicationinsights.azure.cn).
   Setting the endpoint suffix tells the SDK which Azure cloud to connect to. The SDK assembles the rest of the endpoint for individual services.
- Explicit endpoints.
  Any service can be explicitly overridden in the connection string:
   - `IngestionEndpoint` (for example, `https://dc.applicationinsights.azure.com`)
   - `LiveEndpoint` (for example, `https://live.applicationinsights.azure.com`)
   - `ProfilerEndpoint` (for example, `https://profiler.monitor.azure.com`)
   - `SnapshotEndpoint` (for example, `https://snapshot.monitor.azure.com`)

#### Endpoint schema

`<prefix>.<suffix>`
- Prefix: Defines a service.
- Suffix: Defines the common domain name.

##### Valid suffixes

- applicationinsights.azure.cn
- applicationinsights.us

For more information, see [Regions that require endpoint modification](./create-new-resource.md#regions-that-require-endpoint-modification).

##### Valid prefixes

- [Telemetry Ingestion](./app-insights-overview.md): `dc`
- [Live Metrics](./live-stream.md): `live`
- [Profiler](./profiler-overview.md): `profiler`
- [Snapshot](./snapshot-debugger.md): `snapshot`

#### Is the connection string a secret?

The connection string contains an ikey, which is a unique identifier used by the ingestion service to associate telemetry to a specific Application Insights resource. These ikey unique identifiers aren't security tokens or security keys. If you want to protect your AI resource from misuse, the ingestion endpoint provides authenticated telemetry ingestion options based on [Microsoft Entra ID](azure-ad-authentication.md#microsoft-entra-authentication-for-application-insights).

> [!NOTE]
> The Application Insights JavaScript SDK requires the connection string to be passed in during initialization and configuration. It's viewable in plain text in client browsers. There's no easy way to use the [Microsoft Entra ID-based authentication](azure-ad-authentication.md#microsoft-entra-authentication-for-application-insights) for browser telemetry. We recommend that you consider creating a separate Application Insights resource for browser telemetry if you need to secure the service telemetry.

## Connection string examples

Here are some examples of connection strings.

### Connection string with an endpoint suffix

`InstrumentationKey=00000000-0000-0000-0000-000000000000;EndpointSuffix=ai.contoso.com;`

In this example, the connection string specifies the endpoint suffix and the SDK constructs service endpoints:

- Authorization scheme defaults to "ikey"
- Instrumentation key: 00000000-0000-0000-0000-000000000000
- The regional service URIs are based on the provided endpoint suffix:
   - Ingestion: `https://dc.ai.contoso.com`
   - Live metrics: `https://live.ai.contoso.com`
   - Profiler: `https://profiler.ai.contoso.com`
   - Debugger: `https://snapshot.ai.contoso.com`

### Connection string with explicit endpoint overrides

`InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://custom.com:111/;LiveEndpoint=https://custom.com:222/;ProfilerEndpoint=https://custom.com:333/;SnapshotEndpoint=https://custom.com:444/;`

In this example, the connection string specifies explicit overrides for every service. The SDK uses the exact endpoints provided without modification:

- Authorization scheme defaults to "ikey"
- Instrumentation key: 00000000-0000-0000-0000-000000000000
- The regional service URIs are based on the explicit override values:
   - Ingestion: `https://custom.com:111/`
   - Live metrics: `https://custom.com:222/`
   - Profiler: `https://custom.com:333/`
   - Debugger: `https://custom.com:444/`

### Connection string with an explicit region

`InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://southcentralus.in.applicationinsights.azure.com/`

In this example, the connection string specifies the South Central US region:

- Authorization scheme defaults to "ikey"
- Instrumentation key: 00000000-0000-0000-0000-000000000000
- The regional service URIs are based on the explicit override values:
   - Ingestion: `https://southcentralus.in.applicationinsights.azure.com/`

Run the following command in the [Azure CLI](/cli/azure/account?view=azure-cli-latest#az-account-list-locations&preserve-view=true) to list available regions:

`az account list-locations -o table`

## Set a connection string

Connection strings are supported in the following SDK versions:
- .NET v2.12.0
- Java v2.5.1 and Java 3.0
- JavaScript v2.3.0
- NodeJS v1.5.0
- Python v1.0.0

You can set a connection string in code or by using an environment variable or a configuration file.

### Environment variable

Connection string: `APPLICATIONINSIGHTS_CONNECTION_STRING`

### Code samples

# [.NET 5.0+](#tab/dotnet5)

1. Set the connection string in the `appsettings.json` file:

    ```json
    {
      "ApplicationInsights": {
        "ConnectionString" : "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://{region}.in.applicationinsights.azure.com/;LiveEndpoint=https://{region}.livediagnostics.monitor.azure.com/"
        }
    }
    ```

2. Retrieve the connection string in `Program.cs` when registering the `ApplicationInsightsTelemetry` service:

    ```csharp
    var options = new ApplicationInsightsServiceOptions { ConnectionString = app.Configuration["ApplicationInsights:ConnectionString"] };
    builder.Services.AddApplicationInsightsTelemetry(options: options);
    ```

# [.NET Framework](#tab/dotnet-framework)

Set the property [TelemetryConfiguration.ConnectionString](https://github.com/microsoft/ApplicationInsights-dotnet/blob/add45ceed35a817dc7202ec07d3df1672d1f610d/BASE/src/Microsoft.ApplicationInsights/Extensibility/TelemetryConfiguration.cs#L271-L274) or [ApplicationInsightsServiceOptions.ConnectionString](https://github.com/microsoft/ApplicationInsights-dotnet/blob/81288f26921df1e8e713d31e7e9c2187ac9e6590/NETCORE/src/Shared/Extensions/ApplicationInsightsServiceOptions.cs#L66-L69).

Explicitly set the connection string in code:

```csharp
var configuration = new TelemetryConfiguration
{
    ConnectionString = "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://{region}.in.applicationinsights.azure.com/;LiveEndpoint=https://{region}.livediagnostics.monitor.azure.com/"
};
```

Set the connection string using a configuration file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
    <ConnectionString>InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://{region}.in.applicationinsights.azure.com/;LiveEndpoint=https://{region}.livediagnostics.monitor.azure.com/</ConnectionString>
</ApplicationInsights>
```

# [Java](#tab/java)

You can set the connection string in the `applicationinsights.json` configuration file:

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://{region}.in.applicationinsights.azure.com/;LiveEndpoint=https://{region}.livediagnostics.monitor.azure.com/"
}
```

For more information, see [Connection string configuration](./java-standalone-config.md#connection-string).

# [JavaScript](#tab/js)

JavaScript doesn't support the use of environment variables. You have two options:

- To use the JavaScript (Web) SDK Loader Script, see [JavaScript (Web) SDK Loader Script](./javascript-sdk.md?tabs=javascriptwebsdkloaderscript#get-started).
- Manual setup:
   ```javascript
   import { ApplicationInsights } from '@microsoft/applicationinsights-web'

   const appInsights = new ApplicationInsights({ config: {
     connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;'
     /* ...Other Configuration Options... */
   } });
   appInsights.loadAppInsights();
   appInsights.trackPageView();
   ```

# [Node.js](#tab/nodejs)

```javascript
const appInsights = require("applicationinsights");
appInsights.setup("InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://{region}.in.applicationinsights.azure.com/;LiveEndpoint=https://{region}.livediagnostics.monitor.azure.com/");
appInsights.start();
```

# [Python](#tab/python)

We recommend that users set the environment variable.

To explicitly set the connection string:

```python
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

tracer = Tracer(exporter=AzureExporter(connection_string='InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://{region}.in.applicationinsights.azure.com/;LiveEndpoint=https://{region}.livediagnostics.monitor.azure.com/'), sampler=ProbabilitySampler(1.0))
```

---

## Frequently asked questions

This section provides answers to common questions.

### Do new Azure regions require the use of connection strings?

New Azure regions *require* the use of connection strings instead of instrumentation keys. Connection string identifies the resource that you want to associate with your telemetry data. It also allows you to modify the endpoints your resource uses as a destination for your telemetry. Copy the connection string and add it to your application's code or to an environment variable.

### Should I use connection strings or instrumentation keys?

We recommend that you use connection strings instead of instrumentation keys.

## Next steps

Get started at runtime with:

* [Azure VM and Azure Virtual Machine Scale Sets IIS-hosted apps](./azure-vm-vmss-apps.md)
* [IIS server](./application-insights-asp-net-agent.md)
* [Web Apps feature of Azure App Service](./azure-web-apps.md)

Get started at development time with:

* [ASP.NET](./asp-net.md)
* [ASP.NET Core](./asp-net-core.md)
* [Java](./opentelemetry-enable.md?tabs=java)
* [Node.js](./nodejs.md)
* [Python](/previous-versions/azure/azure-monitor/app/opencensus-python)
