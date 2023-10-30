---
title: Configure Azure Monitor OpenTelemetry for .NET, Java, Node.js, and Python applications
description: This article provides configuration guidance for .NET, Java, Node.js, and Python applications.
ms.topic: conceptual
ms.date: 10/10/2023
ms.devlang: csharp, javascript, typescript, python
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-python
ms.reviewer: mmcc
---

# Configure Azure Monitor OpenTelemetry

This article covers configuration settings for the Azure Monitor OpenTelemetry distro.


## Connection string

A connection string in Application Insights defines the target location for sending telemetry data, ensuring it reaches the appropriate resource for monitoring and analysis.

### [ASP.NET Core](#tab/aspnetcore)

Use one of the following three ways to configure the connection string:

- Add `UseAzureMonitor()` to your application startup. Depending on your version of .NET, it is in either your `startup.cs` or `program.cs` class.
    ```csharp
    // Create a new ASP.NET Core web application builder.    
    var builder = WebApplication.CreateBuilder(args);

    // Add the OpenTelemetry telemetry service to the application.
    // This service will collect and send telemetry data to Azure Monitor.
    builder.Services.AddOpenTelemetry().UseAzureMonitor(options => {
        options.ConnectionString = "<Your Connection String>";
    });

    // Build the ASP.NET Core web application.
    var app = builder.Build();

    // Start the ASP.NET Core web application.    
    app.Run();
    ```
- Set an environment variable:
   ```console
   APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
   ```
- Add the following section to your `appsettings.json` config file:
  ```json
  {
    "AzureMonitor": {
        "ConnectionString": "<Your Connection String>"
    }
  }
  ```
  
> [!NOTE]
> If you set the connection string in more than one place, we adhere to the following precedence:
> 1. Code
> 2. Environment Variable
> 3. Configuration File

### [.NET](#tab/net)

Use one of the following two ways to configure the connection string:

- Add the Azure Monitor Exporter to each OpenTelemetry signal in application startup.
    ```csharp
    // Create a new OpenTelemetry tracer provider.
    // It is important to keep the TracerProvider instance active throughout the process lifetime.
    var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddAzureMonitorTraceExporter(options =>
    {
        options.ConnectionString = "<Your Connection String>";
    });

    // Create a new OpenTelemetry meter provider.
    // It is important to keep the MetricsProvider instance active throughout the process lifetime.
    var metricsProvider = Sdk.CreateMeterProviderBuilder()
        .AddAzureMonitorMetricExporter(options =>
        {
            options.ConnectionString = "<Your Connection String>";
        });

    // Create a new logger factory.
    // It is important to keep the LoggerFactory instance active throughout the process lifetime.
    var loggerFactory = LoggerFactory.Create(builder =>
    {
        builder.AddOpenTelemetry(options =>
        {
            options.AddAzureMonitorLogExporter(options =>
            {
                options.ConnectionString = "<Your Connection String>";
            });
        });
    });
    ```
- Set an environment variable:
   ```console
   APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
   ```

> [!NOTE]
> If you set the connection string in more than one place, we adhere to the following precedence:
> 1. Code
> 2. Environment Variable

### [Java](#tab/java)

[!INCLUDE [azure-monitor-app-insights-opentelemetry-java-connection-string](../includes/azure-monitor-app-insights-opentelemetry-java-connection-string.md)]

### [Node.js](#tab/nodejs)

Use one of the following two ways to configure the connection string:

- Set an environment variable:
        
   ```console
   APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
   ```

- Use configuration object:

    ```typescript
   // Import the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions class from the @azure/monitor-opentelemetry package.
    const { useAzureMonitor, AzureMonitorOpenTelemetryOptions } = require("@azure/monitor-opentelemetry");

    // Create a new AzureMonitorOpenTelemetryOptions object.
    const options: AzureMonitorOpenTelemetryOptions = {
      azureMonitorExporterOptions: {
        connectionString: "<your connection string>"
      }
    };

    // Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
    useAzureMonitor(options);
    ```

### [Python](#tab/python)

Use one of the following two ways to configure the connection string:

- Set an environment variable:
        
   ```console
   APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
   ```

- Pass into `configure_azure_monitor`:

```python
# Import the `configure_azure_monitor()` function from the `azure.monitor.opentelemetry` package.
from azure.monitor.opentelemetry import configure_azure_monitor

# Configure OpenTelemetry to use Azure Monitor with the specified connection string.
# Replace `<your-connection-string>` with the connection string of your Azure Monitor Application Insights resource.
configure_azure_monitor(
    connection_string="<your-connection-string>",
)
```

---

## Set the Cloud Role Name and the Cloud Role Instance

You might want to update the [Cloud Role Name](app-map.md#understand-the-cloud-role-name-within-the-context-of-an-application-map) and the Cloud Role Instance from the default values to something that makes sense to your team. They appear on the Application Map as the name underneath a node.

### [ASP.NET Core](#tab/aspnetcore)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/README.md).

```csharp
// Setting role name and role instance

// Create a dictionary of resource attributes.
var resourceAttributes = new Dictionary<string, object> {
    { "service.name", "my-service" },
    { "service.namespace", "my-namespace" },
    { "service.instance.id", "my-instance" }};

// Create a new ASP.NET Core web application builder.
var builder = WebApplication.CreateBuilder(args);

// Add the OpenTelemetry telemetry service to the application.
// This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor();

// Configure the OpenTelemetry tracer provider to add the resource attributes to all traces.
builder.Services.ConfigureOpenTelemetryTracerProvider((sp, builder) => 
    builder.ConfigureResource(resourceBuilder => 
        resourceBuilder.AddAttributes(resourceAttributes)));

// Build the ASP.NET Core web application.
var app = builder.Build();

// Start the ASP.NET Core web application.
app.Run();
```

### [.NET](#tab/net)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/README.md).

```csharp
// Setting role name and role instance

// Create a dictionary of resource attributes.
var resourceAttributes = new Dictionary<string, object> {
    { "service.name", "my-service" },
    { "service.namespace", "my-namespace" },
    { "service.instance.id", "my-instance" }};

// Create a resource builder.
var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);

// Create a new OpenTelemetry tracer provider and set the resource builder.
// It is important to keep the TracerProvider instance active throughout the process lifetime.
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    // Set ResourceBuilder on the TracerProvider.
    .SetResourceBuilder(resourceBuilder)
    .AddAzureMonitorTraceExporter();

// Create a new OpenTelemetry meter provider and set the resource builder.
// It is important to keep the MetricsProvider instance active throughout the process lifetime.
var metricsProvider = Sdk.CreateMeterProviderBuilder()
    // Set ResourceBuilder on the MeterProvider.
    .SetResourceBuilder(resourceBuilder)
    .AddAzureMonitorMetricExporter();

// Create a new logger factory and add the OpenTelemetry logger provider with the resource builder.
// It is important to keep the LoggerFactory instance active throughout the process lifetime.
var loggerFactory = LoggerFactory.Create(builder =>
{
    builder.AddOpenTelemetry(options =>
    {
        // Set ResourceBuilder on the Logging config.
        options.SetResourceBuilder(resourceBuilder);
        options.AddAzureMonitorLogExporter();
    });
});
```

### [Java](#tab/java)

To set the cloud role name, see [cloud role name](java-standalone-config.md#cloud-role-name).

To set the cloud role instance, see [cloud role instance](java-standalone-config.md#cloud-role-instance).

### [Node.js](#tab/nodejs)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/README.md).

```typescript
// Import the useAzureMonitor function, the AzureMonitorOpenTelemetryOptions class, the Resource class, and the SemanticResourceAttributes class from the @azure/monitor-opentelemetry, @opentelemetry/resources, and @opentelemetry/semantic-conventions packages, respectively.
const { useAzureMonitor, AzureMonitorOpenTelemetryOptions } = require("@azure/monitor-opentelemetry");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");

// Create a new Resource object with the following custom resource attributes:
//
// * service_name: my-service
// * service_namespace: my-namespace
// * service_instance_id: my-instance
const customResource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "my-service",
  [SemanticResourceAttributes.SERVICE_NAMESPACE]: "my-namespace",
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: "my-instance",
});

// Create a new AzureMonitorOpenTelemetryOptions object and set the resource property to the customResource object.
const options: AzureMonitorOpenTelemetryOptions = {
  resource: customResource
};

// Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
useAzureMonitor(options);
```

### [Python](#tab/python)

Set the Cloud Role Name and the Cloud Role Instance via [Resource](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/resource/sdk.md#resource-sdk) attributes. Cloud Role Name uses `service.namespace` and `service.name` attributes, although it falls back to `service.name` if `service.namespace` isn't set. Cloud Role Instance uses the `service.instance.id` attribute value. For information on standard attributes for resources, see [OpenTelemetry Semantic Conventions](https://github.com/open-telemetry/semantic-conventions/blob/main/docs/README.md).

Set Resource attributes using the `OTEL_RESOURCE_ATTRIBUTES` and/or `OTEL_SERVICE_NAME` environment variables. `OTEL_RESOURCE_ATTRIBUTES` takes series of comma-separated key-value pairs. For example, to set the Cloud Role Name to `my-namespace.my-helloworld-service` and set Cloud Role Instance to `my-instance`, you can set `OTEL_RESOURCE_ATTRIBUTES` and `OTEL_SERVICE_NAME` as such:
```
export OTEL_RESOURCE_ATTRIBUTES="service.namespace=my-namespace,service.instance.id=my-instance"
export OTEL_SERVICE_NAME="my-helloworld-service"
```

If you don't set the `service.namespace` Resource attribute, you can alternatively set the Cloud Role Name with only the OTEL_SERVICE_NAME environment variable or the `service.name` Resource attribute. For example, to set the Cloud Role Name to `my-helloworld-service` and set Cloud Role Instance to `my-instance`, you can set `OTEL_RESOURCE_ATTRIBUTES` and `OTEL_SERVICE_NAME` as such:
```
export OTEL_RESOURCE_ATTRIBUTES="service.instance.id=my-instance"
export OTEL_SERVICE_NAME="my-helloworld-service"
```

---

## Enable Sampling

You might want to enable sampling to reduce your data ingestion volume, which reduces your cost. Azure Monitor provides a custom *fixed-rate* sampler that populates events with a sampling ratio, which Application Insights converts to `ItemCount`. The *fixed-rate* sampler ensures accurate experiences and event counts. The sampler is designed to preserve your traces across services, and it's interoperable with older Application Insights SDKs. For more information, see [Learn More about sampling](sampling.md#brief-summary).

> [!NOTE] 
> Metrics and Logs are unaffected by sampling.

#### [ASP.NET Core](#tab/aspnetcore)

The sampler expects a sample rate of between 0 and 1 inclusive. A rate of 0.1 means approximately 10% of your traces are sent.

```csharp
// Create a new ASP.NET Core web application builder.
var builder = WebApplication.CreateBuilder(args);

// Add the OpenTelemetry telemetry service to the application.
// This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor(o =>
{
    // Set the sampling ratio to 10%. This means that 10% of all traces will be sampled and sent to Azure Monitor.
    o.SamplingRatio = 0.1F;
});

// Build the ASP.NET Core web application.
var app = builder.Build();

// Start the ASP.NET Core web application.
app.Run();
```

#### [.NET](#tab/net)

The sampler expects a sample rate of between 0 and 1 inclusive. A rate of 0.1 means approximately 10% of your traces are sent.

```csharp
// Create a new OpenTelemetry tracer provider.
// It is important to keep the TracerProvider instance active throughout the process lifetime.
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddAzureMonitorTraceExporter(options =>
    {   
        // Set the sampling ratio to 10%. This means that 10% of all traces will be sampled and sent to Azure Monitor.
        options.SamplingRatio = 0.1F;
    });
```

#### [Java](#tab/java)

Starting from 3.4.0, rate-limited sampling is available and is now the default. For more information about sampling, see [Java sampling]( java-standalone-config.md#sampling).

#### [Node.js](#tab/nodejs)

The sampler expects a sample rate of between 0 and 1 inclusive. A rate of 0.1 means approximately 10% of your traces are sent.

```typescript
// Import the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions class from the @azure/monitor-opentelemetry package.
const { useAzureMonitor, AzureMonitorOpenTelemetryOptions } = require("@azure/monitor-opentelemetry");

// Create a new AzureMonitorOpenTelemetryOptions object and set the samplingRatio property to 0.1.
const options: AzureMonitorOpenTelemetryOptions = {
  samplingRatio: 0.1
};

// Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
useAzureMonitor(options);
```

#### [Python](#tab/python)

The `configure_azure_monitor()` function automatically utilizes
ApplicationInsightsSampler for compatibility with Application Insights SDKs and
to sample your telemetry. The `OTEL_TRACES_SAMPLER_ARG` environment variable can be used to specify
the sampling rate, with a valid range of 0 to 1, where 0 is 0% and 1 is 100%.
For example, a value of 0.1 means 10% of your traces are sent.

```
export OTEL_TRACES_SAMPLER_ARG=0.1
```

---

> [!TIP]
> When using fixed-rate/percentage sampling and you aren't sure what to set the sampling rate as, start at 5% (i.e., 0.05 sampling ratio) and adjust the rate based on the accuracy of the operations shown in the failures and performance blades. A higher rate generally results in higher accuracy. However, ANY sampling will affect accuracy so we recommend alerting on [OpenTelemetry metrics](opentelemetry-add-modify.md#metrics), which are unaffected by sampling.

<a name='enable-entra-id-formerly-azure-ad-authentication'></a>

## Enable Microsoft Entra ID (formerly Azure AD) authentication

You might want to enable Microsoft Entra authentication for a more secure connection to Azure, which prevents unauthorized telemetry from being ingested into your subscription.

#### [ASP.NET Core](#tab/aspnetcore)

We support the credential classes provided by [Azure Identity](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity#credential-classes).

- We recommend `DefaultAzureCredential` for local development.
- We recommend `ManagedIdentityCredential` for system-assigned and user-assigned managed identities.
  - For system-assigned, use the default constructor without parameters.
  - For user-assigned, provide the client ID to the constructor.
- We recommend `ClientSecretCredential` for service principals.
  - Provide the tenant ID, client ID, and client secret to the constructor.

1. Install the latest [Azure.Identity](https://www.nuget.org/packages/Azure.Identity) package:
    ```dotnetcli
    dotnet add package Azure.Identity
    ```
    
1. Provide the desired credential class:
    ```csharp
    // Create a new ASP.NET Core web application builder.    
    var builder = WebApplication.CreateBuilder(args);

    // Add the OpenTelemetry telemetry service to the application.
    // This service will collect and send telemetry data to Azure Monitor.
    builder.Services.AddOpenTelemetry().UseAzureMonitor(options => {
        // Set the Azure Monitor credential to the DefaultAzureCredential.
        // This credential will use the Azure identity of the current user or
        // the service principal that the application is running as to authenticate
        // to Azure Monitor.
        options.Credential = new DefaultAzureCredential();
    });

    // Build the ASP.NET Core web application.
    var app = builder.Build();

    // Start the ASP.NET Core web application.
    app.Run();
    ```

#### [.NET](#tab/net)

We support the credential classes provided by [Azure Identity](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity#credential-classes).

- We recommend `DefaultAzureCredential` for local development.
- We recommend `ManagedIdentityCredential` for system-assigned and user-assigned managed identities.
  - For system-assigned, use the default constructor without parameters.
  - For user-assigned, provide the client ID to the constructor.
- We recommend `ClientSecretCredential` for service principals.
  - Provide the tenant ID, client ID, and client secret to the constructor.

1. Install the latest [Azure.Identity](https://www.nuget.org/packages/Azure.Identity) package:
    ```dotnetcli
    dotnet add package Azure.Identity
    ```

1. Provide the desired credential class:    
    ```csharp
    // Create a DefaultAzureCredential.
    var credential = new DefaultAzureCredential();

    // Create a new OpenTelemetry tracer provider and set the credential.
    // It is important to keep the TracerProvider instance active throughout the process lifetime.
    var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddAzureMonitorTraceExporter(options =>
        {
            options.Credential = credential;
        });

    // Create a new OpenTelemetry meter provider and set the credential.
    // It is important to keep the MetricsProvider instance active throughout the process lifetime.
    var metricsProvider = Sdk.CreateMeterProviderBuilder()
        .AddAzureMonitorMetricExporter(options =>
        {
            options.Credential = credential;
        });

    // Create a new logger factory and add the OpenTelemetry logger provider with the credential.
    // It is important to keep the LoggerFactory instance active throughout the process lifetime.
    var loggerFactory = LoggerFactory.Create(builder =>
    {
        builder.AddOpenTelemetry(options =>
        {
            options.AddAzureMonitorLogExporter(options =>
            {
                options.Credential = credential;
            });
        });
    });
    ```
    
#### [Java](#tab/java)

For more information about Java, see the [Java supplemental documentation](java-standalone-config.md).

#### [Node.js](#tab/nodejs)

We support the credential classes provided by [Azure Identity](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#credential-classes).

```typescript
// Import the useAzureMonitor function, the AzureMonitorOpenTelemetryOptions class, and the ManagedIdentityCredential class from the @azure/monitor-opentelemetry and @azure/identity packages, respectively.
const { useAzureMonitor, AzureMonitorOpenTelemetryOptions } = require("@azure/monitor-opentelemetry");
const { ManagedIdentityCredential } = require("@azure/identity");

// Create a new ManagedIdentityCredential object.
const credential = new ManagedIdentityCredential();

// Create a new AzureMonitorOpenTelemetryOptions object and set the credential property to the credential object.
const options: AzureMonitorOpenTelemetryOptions = {
    azureMonitorExporterOptions: {
        credential: credential
    }
};

// Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
useAzureMonitor(options);
```

#### [Python](#tab/python)
    
```python
# Import the `ManagedIdentityCredential` class from the `azure.identity` package.
from azure.identity import ManagedIdentityCredential
# Import the `configure_azure_monitor()` function from the `azure.monitor.opentelemetry` package.
from azure.monitor.opentelemetry import configure_azure_monitor

# Configure OpenTelemetry to use Azure Monitor with a managed identity credential.
# This will allow OpenTelemetry to authenticate to Azure Monitor without requiring you to provide a connection string.
configure_azure_monitor(
    credential=ManagedIdentityCredential(),
)
```

---


## Offline Storage and Automatic Retries

To improve reliability and resiliency, Azure Monitor OpenTelemetry-based offerings write to offline/local storage by default when an application loses its connection with Application Insights. It saves the application telemetry to disk and periodically tries to send it again for up to 48 hours. In high-load applications, telemetry is occasionally dropped for two reasons. First, when the allowable time is exceeded, and second, when the maximum file size is exceeded or the SDK doesn't have an opportunity to clear out the file. If we need to choose, the product saves more recent events over old ones. [Learn More](/previous-versions/azure/azure-monitor/app/data-retention-privacy#does-the-sdk-create-temporary-local-storage)

### [ASP.NET Core](#tab/aspnetcore)

The Distro package includes the AzureMonitorExporter, which by default uses one of the following locations for offline storage (listed in order of precedence):

- Windows
  - %LOCALAPPDATA%\Microsoft\AzureMonitor
  - %TEMP%\Microsoft\AzureMonitor
- Non-Windows
  - %TMPDIR%/Microsoft/AzureMonitor
  - /var/tmp/Microsoft/AzureMonitor
  - /tmp/Microsoft/AzureMonitor

To override the default directory, you should set `AzureMonitorOptions.StorageDirectory`.

```csharp
// Create a new ASP.NET Core web application builder.
var builder = WebApplication.CreateBuilder(args);

// Add the OpenTelemetry telemetry service to the application.
// This service will collect and send telemetry data to Azure Monitor.
builder.Services.AddOpenTelemetry().UseAzureMonitor(options =>
{
    // Set the Azure Monitor storage directory to "C:\\SomeDirectory".
    // This is the directory where the OpenTelemetry SDK will store any telemetry data that cannot be sent to Azure Monitor immediately.
    options.StorageDirectory = "C:\\SomeDirectory";
});

// Build the ASP.NET Core web application.
var app = builder.Build();

// Start the ASP.NET Core web application.
app.Run();
```

To disable this feature, you should set `AzureMonitorOptions.DisableOfflineStorage = true`.

### [.NET](#tab/net)

By default, the AzureMonitorExporter uses one of the following locations for offline storage (listed in order of precedence):

- Windows
  - %LOCALAPPDATA%\Microsoft\AzureMonitor
  - %TEMP%\Microsoft\AzureMonitor
- Non-Windows
  - %TMPDIR%/Microsoft/AzureMonitor
  - /var/tmp/Microsoft/AzureMonitor
  - /tmp/Microsoft/AzureMonitor

To override the default directory, you should set `AzureMonitorExporterOptions.StorageDirectory`.

```csharp
// Create a new OpenTelemetry tracer provider and set the storage directory.
// It is important to keep the TracerProvider instance active throughout the process lifetime.
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddAzureMonitorTraceExporter(options =>
    {
        // Set the Azure Monitor storage directory to "C:\\SomeDirectory".
        // This is the directory where the OpenTelemetry SDK will store any trace data that cannot be sent to Azure Monitor immediately.
        options.StorageDirectory = "C:\\SomeDirectory";
    });

// Create a new OpenTelemetry meter provider and set the storage directory.
// It is important to keep the MetricsProvider instance active throughout the process lifetime.
var metricsProvider = Sdk.CreateMeterProviderBuilder()
    .AddAzureMonitorMetricExporter(options =>
    {
        // Set the Azure Monitor storage directory to "C:\\SomeDirectory".
        // This is the directory where the OpenTelemetry SDK will store any metric data that cannot be sent to Azure Monitor immediately.
        options.StorageDirectory = "C:\\SomeDirectory";
    });

// Create a new logger factory and add the OpenTelemetry logger provider with the storage directory.
// It is important to keep the LoggerFactory instance active throughout the process lifetime.
var loggerFactory = LoggerFactory.Create(builder =>
{
    builder.AddOpenTelemetry(options =>
    {
        options.AddAzureMonitorLogExporter(options =>
        {
            // Set the Azure Monitor storage directory to "C:\\SomeDirectory".
            // This is the directory where the OpenTelemetry SDK will store any log data that cannot be sent to Azure Monitor immediately.
            options.StorageDirectory = "C:\\SomeDirectory";
        });
    });
});
```

To disable this feature, you should set `AzureMonitorExporterOptions.DisableOfflineStorage = true`.

### [Java](#tab/java)

Configuring Offline Storage and Automatic Retries isn't available in Java.

For a full list of available configurations, see [Configuration options](./java-standalone-config.md).

### [Node.js](#tab/nodejs)

By default, the AzureMonitorExporter uses one of the following locations for offline storage.

- Windows
  - %TEMP%\Microsoft\AzureMonitor
- Non-Windows
  - %TMPDIR%/Microsoft/AzureMonitor
  - /var/tmp/Microsoft/AzureMonitor

To override the default directory, you should set `storageDirectory`.

For example:


```typescript
// Import the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions class from the @azure/monitor-opentelemetry package.
const { useAzureMonitor, AzureMonitorOpenTelemetryOptions } = require("@azure/monitor-opentelemetry");

// Create a new AzureMonitorOpenTelemetryOptions object and set the azureMonitorExporterOptions property to an object with the following properties:
//
// * connectionString: The connection string for your Azure Monitor Application Insights resource.
// * storageDirectory: The directory where the Azure Monitor OpenTelemetry exporter will store telemetry data when it is offline.
// * disableOfflineStorage: A boolean value that specifies whether to disable offline storage.
const options: AzureMonitorOpenTelemetryOptions = {
  azureMonitorExporterOptions: {
    connectionString: "<Your Connection String>",
    storageDirectory: "C:\\SomeDirectory",
    disableOfflineStorage: false
  }
};

// Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
useAzureMonitor(options);
```

To disable this feature, you should set `disableOfflineStorage = true`.

### [Python](#tab/python)

By default, Azure Monitor exporters use the following path:

`<tempfile.gettempdir()>/Microsoft/AzureMonitor/opentelemetry-python-<your-instrumentation-key>`

To override the default directory, you should set `storage_directory` to the directory you want.

For example:
```python
...
# Configure OpenTelemetry to use Azure Monitor with the specified connection string and storage directory.
# Replace `your-connection-string` with the connection string to your Azure Monitor Application Insights resource.
# Replace `C:\\SomeDirectory` with the directory where you want to store the telemetry data before it is sent to Azure Monitor.
configure_azure_monitor(
    connection_string="your-connection-string",
    storage_directory="C:\\SomeDirectory",
)
...

```

To disable this feature, you should set `disable_offline_storage` to `True`. Defaults to `False`.

For example:
```python
...
# Configure OpenTelemetry to use Azure Monitor with the specified connection string and disable offline storage.
# Replace `your-connection-string` with the connection string to your Azure Monitor Application Insights resource.
configure_azure_monitor(
    connection_string="your-connection-string",
    disable_offline_storage=True,
)
...

```

---

## Enable the OTLP Exporter

You might want to enable the OpenTelemetry Protocol (OTLP) Exporter alongside the Azure Monitor Exporter to send your telemetry to two locations.

> [!NOTE]
> The OTLP Exporter is shown for convenience only. We don't officially support the OTLP Exporter or any components or third-party experiences downstream of it.

#### [ASP.NET Core](#tab/aspnetcore)

1. Install the [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://www.nuget.org/packages/OpenTelemetry.Exporter.OpenTelemetryProtocol/) package in your project.

    ```dotnetcli
    dotnet add package --prerelease OpenTelemetry.Exporter.OpenTelemetryProtocol
    ```

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see the [example on GitHub](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/examples/Console/TestOtlpExporter.cs).

    ```csharp
    // Create a new ASP.NET Core web application builder.
    var builder = WebApplication.CreateBuilder(args);

    // Add the OpenTelemetry telemetry service to the application.
    // This service will collect and send telemetry data to Azure Monitor.
    builder.Services.AddOpenTelemetry().UseAzureMonitor();
    
    // Add the OpenTelemetry OTLP exporter to the application.
    // This exporter will send telemetry data to an OTLP receiver, such as Prometheus
    builder.Services.AddOpenTelemetry().WithTracing(builder => builder.AddOtlpExporter());
    builder.Services.AddOpenTelemetry().WithMetrics(builder => builder.AddOtlpExporter());

    // Build the ASP.NET Core web application.
    var app = builder.Build();

    // Start the ASP.NET Core web application.
    app.Run();
    ```

#### [.NET](#tab/net)

1. Install the [OpenTelemetry.Exporter.OpenTelemetryProtocol](https://www.nuget.org/packages/OpenTelemetry.Exporter.OpenTelemetryProtocol/) package in your project.

    ```dotnetcli
    dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol
    ```

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see the [example on GitHub](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/examples/Console/TestOtlpExporter.cs).
    
    ```csharp
    // Create a new OpenTelemetry tracer provider and add the Azure Monitor trace exporter and the OTLP trace exporter.
    // It is important to keep the TracerProvider instance active throughout the process lifetime.
    var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddAzureMonitorTraceExporter()
        .AddOtlpExporter();

    // Create a new OpenTelemetry meter provider and add the Azure Monitor metric exporter and the OTLP metric exporter.
    // It is important to keep the MetricsProvider instance active throughout the process lifetime.
    var metricsProvider = Sdk.CreateMeterProviderBuilder()
        .AddAzureMonitorMetricExporter()
        .AddOtlpExporter();
    ```

#### [Java](#tab/java)

For more information about Java, see the [Java supplemental documentation](java-standalone-config.md).

#### [Node.js](#tab/nodejs)

1. Install the [OpenTelemetry Collector Trace Exporter](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-http) and other OpenTelemetry packages in your project.

    ```sh
        npm install @opentelemetry/api
        npm install @opentelemetry/exporter-trace-otlp-http
        npm install @opentelemetry/sdk-trace-base
        npm install @opentelemetry/sdk-trace-node
    ```

2. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see the [example on GitHub](https://github.com/open-telemetry/opentelemetry-js/tree/main/examples/otlp-exporter-node).

    ```typescript
    // Import the useAzureMonitor function, the AzureMonitorOpenTelemetryOptions class, the trace module, the ProxyTracerProvider class, the BatchSpanProcessor class, the NodeTracerProvider class, and the OTLPTraceExporter class from the @azure/monitor-opentelemetry, @opentelemetry/api, @opentelemetry/sdk-trace-base, @opentelemetry/sdk-trace-node, and @opentelemetry/exporter-trace-otlp-http packages, respectively.
    const { useAzureMonitor, AzureMonitorOpenTelemetryOptions } = require("@azure/monitor-opentelemetry");
    const { trace, ProxyTracerProvider } = require("@opentelemetry/api");
    const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
    const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

    // Enable Azure Monitor integration.
    useAzureMonitor();

    // Create a new OTLPTraceExporter object.
    const otlpExporter = new OTLPTraceExporter();

    // Get the NodeTracerProvider instance.
    const tracerProvider = ((trace.getTracerProvider() as ProxyTracerProvider).getDelegate() as NodeTracerProvider);

    // Add a BatchSpanProcessor to the NodeTracerProvider instance.
    tracerProvider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));
    ```

#### [Python](#tab/python)

1. Install the [opentelemetry-exporter-otlp](https://pypi.org/project/opentelemetry-exporter-otlp/) package.

1. Add the following code snippet. This example assumes you have an OpenTelemetry Collector with an OTLP receiver running. For details, see this [README](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/monitor/azure-monitor-opentelemetry-exporter/samples/traces#collector).
    
    ```python
    # Import the `configure_azure_monitor()`, `trace`, `OTLPSpanExporter`, and `BatchSpanProcessor` classes from the appropriate packages.    
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace.export import BatchSpanProcessor

    # Configure OpenTelemetry to use Azure Monitor with the specified connection string.
    # Replace `<your-connection-string>` with the connection string to your Azure Monitor Application Insights resource.
    configure_azure_monitor(
        connection_string="<your-connection-string>",
    )
    
    # Get the tracer for the current module.
    tracer = trace.get_tracer(__name__) 
    
    # Create an OTLP span exporter that sends spans to the specified endpoint.
    # Replace `http://localhost:4317` with the endpoint of your OTLP collector.
    otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
    
    # Create a batch span processor that uses the OTLP span exporter.
    span_processor = BatchSpanProcessor(otlp_exporter)
    
    # Add the batch span processor to the tracer provider.
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    # Start a new span with the name "test".
    with tracer.start_as_current_span("test"):
        print("Hello world!")
    ```

---

## OpenTelemetry configurations

The following OpenTelemetry configurations can be accessed through environment variables while using the Azure Monitor OpenTelemetry Distros.
### [ASP.NET Core](#tab/aspnetcore)

| Environment variable       | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Set it to the connection string for your Application Insights resource. |
| `APPLICATIONINSIGHTS_STATSBEAT_DISABLED` | Set it to `true` to opt-out of internal metrics collection. |
| `OTEL_RESOURCE_ATTRIBUTES` | Key-value pairs to be used as resource attributes. For more information about resource attributes, see the [Resource SDK specification](https://github.com/open-telemetry/opentelemetry-specification/blob/v1.5.0/specification/resource/sdk.md#specifying-resource-information-via-an-environment-variable). |
| `OTEL_SERVICE_NAME`        | Sets the value of the `service.name` resource attribute. If `service.name` is also provided in `OTEL_RESOURCE_ATTRIBUTES`, then `OTEL_SERVICE_NAME` takes precedence. |


### [.NET](#tab/net)

| Environment variable       | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Set it to the connection string for your Application Insights resource. |
| `APPLICATIONINSIGHTS_STATSBEAT_DISABLED` | Set it to `true` to opt-out of internal metrics collection. |
| `OTEL_RESOURCE_ATTRIBUTES` | Key-value pairs to be used as resource attributes. For more information about resource attributes, see the [Resource SDK specification](https://github.com/open-telemetry/opentelemetry-specification/blob/v1.5.0/specification/resource/sdk.md#specifying-resource-information-via-an-environment-variable). |
| `OTEL_SERVICE_NAME`        | Sets the value of the `service.name` resource attribute. If `service.name` is also provided in `OTEL_RESOURCE_ATTRIBUTES`, then `OTEL_SERVICE_NAME` takes precedence. |

### [Java](#tab/java)

For more information about Java, see the [Java supplemental documentation](java-standalone-config.md).

### [Node.js](#tab/nodejs)

For more information about OpenTelemetry SDK configuration, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/concepts/sdk-configuration). 

### [Python](#tab/python)

For more information about OpenTelemetry SDK configuration, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/concepts/sdk-configuration) and [Azure monitor Distro Usage](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry#usage).

---

[!INCLUDE [azure-monitor-app-insights-opentelemetry-faqs](../includes/azure-monitor-app-insights-opentelemetry-faqs.md)]

[!INCLUDE [azure-monitor-app-insights-opentelemetry-support](../includes/azure-monitor-app-insights-opentelemetry-support.md)]
