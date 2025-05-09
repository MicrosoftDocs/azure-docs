---
title: Use the Azure WebJobs SDK
description: Learn how to write code for the Azure WebJobs SDK. Create event-driven background processing jobs that access data in Azure and third-party services.
author: ggailey777

ms.devlang: csharp
ms.custom: devx-track-csharp
ms.topic: how-to
ms.date: 05/09/2025
ms.author: glenga
#Customer intent: As an Azure App Service developer, I want use the WebJobs SDK to run event-driven code in Azure.
---

# Use the Azure WebJobs SDK for event-driven background processing

This article describes how to work with the Azure WebJobs SDK. To quickly get started with WebJobs, see [Get started with the Azure WebJobs SDK](webjobs-sdk-get-started.md).

## WebJobs SDK versions

The key differences between version 3.*x* and version 2.*x* of the WebJobs SDK are:

* Version 3.*x* adds support for .NET Core.
* In version 3.*x*, you install the Storage binding extension that's required by the WebJobs SDK. In version 2.*x*, the Storage bindings are included in the SDK.
* Visual Studio 2019 tooling for .NET Core (3.*x*) projects differs from tooling for .NET Framework (2.*x*) projects. For more information, see [Develop and deploy WebJobs using Visual Studio](webjobs-dotnet-deploy-vs.md).

Some examples in this article are provided for both WebJobs version 3.*x* and WebJobs version 2.*x*.

[Azure Functions](../azure-functions/functions-overview.md) is built on the WebJobs SDK:
  
* Azure Functions version 2.*x* is built on WebJobs SDK version 3.*x*.
* Azure Functions version 1.*x* is built on WebJobs SDK version 2.*x*.
  
Source code repositories for both Azure Functions and the WebJobs SDK use the WebJobs SDK numbering. Several sections of this article link to Azure Functions documentation.

For more information, see [Compare the WebJobs SDK and Azure Functions](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md#compare-functions-and-webjobs).

## WebJobs host

The WebJobs host is a runtime container for functions. The host listens for triggers and calls functions. In version 3.*x*, the host is an implementation of `IHost`. In version 2.*x*, you use the `JobHost` object. You create a host instance in your code and write code to customize its behavior.

This architectural change is a key difference between using the WebJobs SDK directly and using it indirectly through Azure Functions. In Azure Functions, the service controls the host. You can't customize the host by writing code. In Azure Functions, you customize host behavior through settings in the `host.json` file. Those settings are strings, not code, and use of these strings limits the kinds of customizations you can do.

### Host connections

The WebJobs SDK looks for Azure Storage and Azure Service Bus connections in the `local.settings.json` file when you run locally or in the environment of the WebJob when you run in Azure. By default, the WebJobs SDK requires a storage connection named `AzureWebJobsStorage`.

When the connection name resolves to a single exact value, the runtime identifies the value as a connection string, which typically includes a secret. The details of a connection string depend on the service to which you connect. However, a connection name can also refer to a collection of multiple configuration items. This method is useful for configuring identity-based connections. You can treat environment variables as a collection by using a shared prefix that ends in double underscores (`__`). You can then reference the group by setting the connection name to this prefix.

For example, the `connection` property for an Azure Blob Storage trigger definition might be `Storage1`. As long as there's no single string value configured by an environment variable named `Storage1`,  an environment variable named `Storage1__blobServiceUri` could be used to inform the `blobServiceUri` property of the connection. The connection properties are different for each service. Refer to the documentation for the component that uses the connection.

#### Identity-based connections

To use identity-based connections in the WebJobs SDK, make sure that you use the latest versions of WebJobs packages in your project. Also ensure that you have a reference to [Microsoft.Azure.WebJobs.Host.Storage](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Host.Storage).

The following example shows what your project file might look like after you make these updates:

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net48</TargetFramework>
    <IsWebJobProject>true</IsWebJobProject>
    <WebJobName>$(AssemblyName)</WebJobName>
    <WebJobType>Continuous</WebJobType>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs" Version="3.0.42" />
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.Storage.Queues" Version="5.3.1" />
    <PackageReference Include="Microsoft.Azure.WebJobs.Host.Storage" Version="5.0.1" />
    <PackageReference Include="Microsoft.Extensions.Logging.Console" Version="2.1.1" />
  </ItemGroup>

  <ItemGroup>
    <None Update="appsettings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
  </ItemGroup>
</Project>
```

When you set up WebJobs in your HostBuilder instance, make sure that you include a call to `AddAzureStorageCoreServices`. This call allows `AzureWebJobsStorage` and other Storage triggers and bindings to use the identity.

Here's an example:

```csharp
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        // Other configurations...
    });
```

You can then configure the `AzureWebJobsStorage` connection by setting environment variables (or application settings when your code is hosted in Azure App Service):

| Environment variable | Description  | Example value   
|-----|-----------|-----------------------|
| `AzureWebJobsStorage__blobServiceUri` | The data plane URI of the blob service of the storage account. It uses the HTTPS scheme. | https://<storage_account_name>.blob.core.windows.net |
| `AzureWebJobsStorage__queueServiceUri` | The data plane URI of the queue service of the storage account. It uses the HTTPS scheme. | https://<storage_account_name>.queue.core.windows.net |

If you provide your configuration by any means other than environment variables, such as in an `appsettings.json` config file, you instead must provide a structured configuration for the connection and its properties:

```json
{
    "AzureWebJobsStorage": {
        "blobServiceUri": "https://<storage_account_name>.blob.core.windows.net",
        "queueServiceUri": "https://<storage_account_name>.queue.core.windows.net"
    }
}
```

You can omit the `queueServiceUri` property if you don't plan to use blob triggers.

When your code runs locally, the default is to use your developer identity as described for [`DefaultAzureCredential`](/dotnet/api/azure.identity.defaultazurecredential).

When your code is hosted in App Service, the configuration in the preceding example defaults to the [system-assigned managed identity](./overview-managed-identity.md#add-a-system-assigned-identity) for the resource. To instead use a [user-assigned identity](./overview-managed-identity.md#add-a-user-assigned-identity) that's assigned to the app, you must add properties for your connection to specify which identity to use. The `credential` property (`AzureWebJobsStorage__credential` as an environment variable) should be set to the string `managedidentity`. The `clientId` property (`AzureWebJobsStorage__clientId` as an environment variable) should be set to the client ID of the user-assigned managed identity to use.

As a structured configuration, the complete object would be similar to this example:

```json
{
    "AzureWebJobsStorage": {
        "blobServiceUri": "https://<storage_account_name>.blob.core.windows.net",
        "queueServiceUri": "https://<storage_account_name>.queue.core.windows.net",
        "credential": "managedidentity",
        "clientId": "<user-assigned-identity-client-id>"
    }
}
```

The identity used for `AzureWebJobsStorage` should have role assignments that grant it the [Storage Blob Data Owner], [Storage Queue Data Contributor], and [Storage Account Contributor] roles. You can omit the [Storage Queue Data Contributor] and [Storage Account Contributor] roles if you don't plan to use blob triggers.

The following table shows built-in roles that we recommend when you use triggers in bindings in normal operation. Your application might require more permissions, depending on the code you write.

| Binding | Example built-in roles     |
|------|--------------|
| Blob trigger | [Storage Blob Data Owner] *and* [Storage Queue Data Contributor]<br/>Also see the preceding requirements for `AzureWebJobsStorage`. |
| Blob (input)  | [Storage Blob Data Reader]                     |
| Blob (output)                   | [Storage Blob Data Owner]                                                                                                           |
| Queue trigger                   | [Storage Queue Data Reader], [Storage Queue Data Message Processor]                                                                 |
| Queue (output)                  | [Storage Queue Data Contributor], [Storage Queue Data Message Sender]                                                               |
| Service Bus trigger<sup>1</sup> | [Azure Service Bus Data Receiver], [Azure Service Bus Data Owner]              |
| Service Bus (output)  | [Azure Service Bus Data Sender]      |

<sup>1</sup> For triggering from Service Bus topics, the role assignment must have effective scope over the Service Bus subscription resource. If only the topic is included, an error occurs. Some clients, such as the Azure portal, don't expose the Service Bus subscription resource as a scope for role assignment. In these scenarios, you can use the Azure CLI instead. For more information, see [Azure built-in roles for Azure Service Bus][role-assignment-scope].

[Storage Blob Data Reader]: ../role-based-access-control/built-in-roles.md#storage-blob-data-reader
[Storage Blob Data Owner]: ../role-based-access-control/built-in-roles.md#storage-blob-data-owner
[Storage Queue Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-queue-data-contributor
[Storage Account Contributor]: ../role-based-access-control/built-in-roles.md#storage-account-contributor
[Storage Queue Data Reader]: ../role-based-access-control/built-in-roles.md#storage-queue-data-reader
[Storage Queue Data Message Processor]: ../role-based-access-control/built-in-roles.md#storage-queue-data-message-processor
[Storage Queue Data Message Sender]: ../role-based-access-control/built-in-roles.md#storage-queue-data-message-sender
[Azure Service Bus Data Receiver]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver
[Azure Service Bus Data Sender]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-sender
[Azure Service Bus Data Owner]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner
[role-assignment-scope]: ../service-bus-messaging/service-bus-managed-service-identity.md#resource-scope

#### Connection strings in version 2.*x*

Version 2.*x* of the SDK doesn't require a specific name for connection strings. In version 2.*x*, you can use your own names for these connection strings, and you can store them elsewhere. You can set names in code by using [`JobHostConfiguration`], like in this example:

```csharp
static void Main(string[] args)
{
    var _storageConn = ConfigurationManager
        .ConnectionStrings["MyStorageConnection"].ConnectionString;

    //// Dashboard logging is deprecated; use Application Insights.
    //var _dashboardConn = ConfigurationManager
    //    .ConnectionStrings["MyDashboardConnection"].ConnectionString;

    JobHostConfiguration config = new JobHostConfiguration();
    config.StorageConnectionString = _storageConn;
    //config.DashboardConnectionString = _dashboardConn;
    JobHost host = new JobHost(config);
    host.RunAndBlock();
}
```

> [!NOTE]
> Because version 3.*x* uses the default .NET Core configuration APIs, no API exists to change connection string names. For more information, see [Develop and deploy WebJobs by using Visual Studio](webjobs-dotnet-deploy-vs.md).

### Host development settings

You can run the host in development mode to make local development more efficient. Here are some of the settings that automatically change when you run in development mode:

| Property | Development setting |
| ------------- | ------------- |
| `Tracing.ConsoleLevel` | `TraceLevel.Verbose` to maximize log output. |
| `Queues.MaxPollingInterval`  | A low value to ensure that queue methods trigger immediately.  |
| `Singleton.ListenerLockPeriod` | 15 seconds to help with rapid iterative development. |

The process for enabling development mode depends on the SDK version.

#### Version 3.*x*

In version 3.*x*, you use the standard ASP.NET Core APIs to change the host environment. Call the [`UseEnvironment`](/dotnet/api/microsoft.extensions.hosting.hostinghostbuilderextensions.useenvironment) method on the [`HostBuilder`](/dotnet/api/microsoft.extensions.hosting.hostbuilder) instance. Pass a string named `development`, as in this example:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.UseEnvironment("development");
    builder.ConfigureWebJobs(b =>
            {
                b.AddAzureStorageCoreServices();
            });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

#### Version 2.*x*

The `JobHostConfiguration` class has a `UseDevelopmentSettings` method that enables development mode. The following example shows how to use development settings. To make `config.IsDevelopment` return `true` when it runs locally, set a local environment variable named `AzureWebJobsEnv` that has the value `Development`.

```csharp
static void Main()
{
    config = new JobHostConfiguration();

    if (config.IsDevelopment)
    {
        config.UseDevelopmentSettings();
    }

    var host = new JobHost(config);
    host.RunAndBlock();
}
```

### <a name="jobhost-servicepointmanager-settings"></a>Manage concurrent connections (version 2.*x*)

In version 3.*x*, the connection limit defaults to infinite connections. If for some reason you need to change this limit, you can use the [`MaxConnectionsPerServer`](/dotnet/api/system.net.http.winhttphandler.maxconnectionsperserver) property of the [`WinHttpHandler`](/dotnet/api/system.net.http.winhttphandler) class.

In version 2.*x*, you control the number of concurrent connections to a host by using the [`ServicePointManager.DefaultConnectionLimit`](/dotnet/api/system.net.servicepointmanager.defaultconnectionlimit#System_Net_ServicePointManager_DefaultConnectionLimit) property. In 2.*x*, you should increase this value from the default of `2` before you start your WebJobs host.

All outgoing HTTP requests that you make from a function by using `HttpClient` flow through `ServicePointManager`. After you reach the value set in `DefaultConnectionLimit`, `ServicePointManager` starts queueing requests before sending them. Suppose your `DefaultConnectionLimit` is set to `2` and your code makes 1,000 HTTP requests. Initially, only 2 requests are allowed through to the OS. The other 998 requests are queued until there's room for them. Your `HttpClient` might time out because it appears to have made the request, but the request was never sent by the OS to the destination server. You might see behavior that doesn't seem to make sense: your local `HttpClient` is taking 10 seconds to complete a request, but your service is returning every request in 200 ms.

The default value for ASP.NET applications is `Int32.MaxValue`, and that's likely to work well for WebJobs running in a Basic or higher App Service plan. WebJobs typically need the **Always On** setting, and that's supported only by Basic and higher App Service plans.

If your WebJob is running in a Free or Shared App Service plan, your application is restricted by the App Service sandbox, which currently has a [connection limit of 600](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#per-sandbox-per-appper-site-numerical-limits). If you have an unbound connection limit in `ServicePointManager`, it's more likely that the sandbox connection threshold is reached, and the site shuts down. In that case, setting `DefaultConnectionLimit` to something lower, like 200, can prevent this scenario from occurring and still allow sufficient throughput.

The setting must be configured before any HTTP requests are made. For this reason, the WebJobs host shouldn't adjust the setting automatically. There might be HTTP requests that occur before the host starts, which can lead to unexpected behavior. The best approach is to set the value immediately in your `Main` method before you initialize `JobHost`, as shown in this example:

```csharp
static void Main(string[] args)
{
    // Set this immediately so that it's used by all requests.
    ServicePointManager.DefaultConnectionLimit = Int32.MaxValue;

    var host = new JobHost();
    host.RunAndBlock();
}
```

## Triggers

The WebJobs SDK supports the same set of triggers and binding that [Azure Functions](../azure-functions/functions-triggers-bindings.md) uses. In the WebJobs SDK, triggers are function-specific and not related to the WebJob deployment type. WebJobs that have event-triggered functions created by using the SDK should always be published as a *continuous* WebJob, with **Always on** enabled.

Functions must be public methods, and they must have one trigger attribute or the [`NoAutomaticTrigger`](#manual-triggers) attribute.

### Automatic triggers

Automatic triggers call a function in response to an event. Consider this example of a function that's triggered by a message added to Azure Queue Storage. The function responds by reading a blob from Blob storage:

```csharp
public static void Run(
    [QueueTrigger("myqueue-items")] string myQueueItem,
    [Blob("samples-workitems/{queueTrigger}", FileAccess.Read)] Stream myBlob,
    ILogger log)
{
    log.LogInformation($"BlobInput processed blob\n Name:{myQueueItem} \n Size: {myBlob.Length} bytes");
}
```

The `QueueTrigger` attribute tells the runtime to call the function whenever a queue message appears in `myqueue-items`. The `Blob` attribute tells the runtime to use the queue message to read a blob in the `sample-workitems` container. The name of the blob item in the `samples-workitems` container is obtained directly from the queue trigger as a binding expression (`{queueTrigger}`).

[!INCLUDE [webjobs-always-on-note](../../includes/webjobs-always-on-note.md)]

### Manual triggers

To trigger a function manually, use the `NoAutomaticTrigger` attribute:

```csharp
[NoAutomaticTrigger]
public static void CreateQueueMessage(
ILogger logger,
string value,
[Queue("outputqueue")] out string message)
{
    message = value;
    logger.LogInformation("Creating queue message: ", message);
}
```

The process for manually triggering the function depends on the SDK version.

#### Version 3.*x*

```csharp
static async Task Main(string[] args)
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddAzureStorage();
    });
    var host = builder.Build();
    using (host)
    {
        var jobHost = host.Services.GetService(typeof(IJobHost)) as JobHost;
        var inputs = new Dictionary<string, object>
        {
            { "value", "Hello world!" }
        };

        await host.StartAsync();
        await jobHost.CallAsync("CreateQueueMessage", inputs);
        await host.StopAsync();
    }
}
```

#### Version 2.*x*

```csharp
static void Main(string[] args)
{
    JobHost host = new JobHost();
    host.Call(typeof(Program).GetMethod("CreateQueueMessage"), new { value = "Hello world!" });
}
```

## Input and output bindings

Input bindings provide a declarative way to make data from Azure or third-party services available to your code. Output bindings provide a way to update data. The [Get started](webjobs-sdk-get-started.md) article shows an example of each.

You can use a method return value for an output binding by applying the attribute to the method return value. See the example in [Using the Azure Function return value](../azure-functions/functions-bindings-return-value.md).

### Binding types

The process for installing and managing binding types depends on whether you're using version 3.*x* or version 2.*x* of the SDK. You can find the package to install for a particular binding type in the "Packages" section of that binding type's Azure Functions [reference article](#binding-reference-information). An exception is the Files trigger and binding (for the local file system), which Azure Functions doesn't support.

#### Version 3.*x*

In version 3.*x*, the storage bindings are included in the `Microsoft.Azure.WebJobs.Extensions.Storage` package. Call the `AddAzureStorage` extension method in the `ConfigureWebJobs` method:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
            {
                b.AddAzureStorageCoreServices();
                b.AddAzureStorage();
            });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

To use other trigger and binding types, install the NuGet package that contains them and call the `Add<binding>` extension method implemented in the extension. For example, if you want to use an Azure Cosmos DB binding, install `Microsoft.Azure.WebJobs.Extensions.CosmosDB` and call `AddCosmosDB`:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
            {
                b.AddAzureStorageCoreServices();
                b.AddCosmosDB();
            });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

To use the Timer trigger or the Files binding, which are part of core services, call the `AddTimers` or `AddFiles` extension methods.

#### Version 2.*x*

These trigger and binding types are included in version 2.*x* of the `Microsoft.Azure.WebJobs` package:

* Blob storage
* Queue storage
* Table storage

To use other trigger and binding types, install the NuGet package that contains them and call a `Use<binding>` method on the `JobHostConfiguration` object. For example, if you want to use a Timer trigger, install `Microsoft.Azure.WebJobs.Extensions` and call `UseTimers` in the `Main` method:

```csharp
static void Main()
{
    config = new JobHostConfiguration();
    config.UseTimers();
    var host = new JobHost(config);
    host.RunAndBlock();
}
```

To use the Files binding, install `Microsoft.Azure.WebJobs.Extensions` and call `UseFiles`.

### ExecutionContext

In WebJobs, you can bind to an [`ExecutionContext`] instance. With this binding, you can access [`ExecutionContext`] as a parameter in your function signature. For example, the following code uses the context object to access the invocation ID, which you can use to correlate all logs produced by a given function invocation.  

```csharp
public class Functions
{
    public static void ProcessQueueMessage([QueueTrigger("queue")] string message,
        ExecutionContext executionContext,
        ILogger logger)
    {
        logger.LogInformation($"{message}\n{executionContext.InvocationId}");
    }
}
```

The process for binding to [`ExecutionContext`] depends on your SDK version.

#### Version 3.*x*

Call the `AddExecutionContextBinding` extension method in the `ConfigureWebJobs` method:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
            {
                b.AddAzureStorageCoreServices();
                b.AddExecutionContextBinding();
            });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

#### Version 2.*x*

The `Microsoft.Azure.WebJobs.Extensions` package mentioned earlier also provides a special binding type that you can register by calling the `UseCore` method. You can use the binding to define an [`ExecutionContext`] parameter in your function signature:

```csharp
class Program
{
    static void Main()
    {
        config = new JobHostConfiguration();
        config.UseCore();
        var host = new JobHost(config);
        host.RunAndBlock();
    }
}
```

### Binding configuration

You can configure the behavior of some triggers and bindings. The process for configuring them depends on the SDK version.

* **Version 3.*x*:** Set configuration when the `Add<Binding>` method is called in `ConfigureWebJobs`.
* **Version 2.*x*:** Set configuration by setting properties in a configuration object that you pass in to `JobHost`.

These binding-specific settings are equivalent to settings in the [`host.json` project file](../azure-functions/functions-host-json.md) in Azure Functions.

You can configure the following bindings:

* [Azure Cosmos DB trigger](#azure-cosmos-db-trigger-configuration-version-3x)
* [Event Hubs trigger](#azure-event-hubs-trigger-configuration-version-3x)
* [Queue storage trigger](#queue-storage-trigger-configuration)
* [SendGrid binding](#sendgrid-binding-configuration-version-3x)
* [Service Bus trigger](#service-bus-trigger-configuration-version-3x)

#### Azure Cosmos DB trigger configuration (version 3.*x*)

This example shows how to configure the Azure Cosmos DB trigger:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddCosmosDB(a =>
        {
            a.ConnectionMode = ConnectionMode.Gateway;
            a.Protocol = Protocol.Https;
            a.LeaseOptions.LeasePrefix = "prefix1";

        });
    });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

For more information, see [Azure Cosmos DB binding](../azure-functions/functions-bindings-cosmosdb-v2.md#hostjson-settings).

#### Azure Event Hubs trigger configuration (version 3.*x*)

This example shows how to configure the Event Hubs trigger:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddEventHubs(a =>
        {
            a.BatchCheckpointFrequency = 5;
            a.EventProcessorOptions.MaxBatchSize = 256;
            a.EventProcessorOptions.PrefetchCount = 512;
        });
    });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

For more information, see [Event Hubs binding](../azure-functions/functions-bindings-event-hubs.md#hostjson-settings).

#### Queue storage trigger configuration

The following examples show how to configure the Queue storage trigger.

##### Version 3.*x*

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddAzureStorage(a => {
            a.BatchSize = 8;
            a.NewBatchThreshold = 4;
            a.MaxDequeueCount = 4;
            a.MaxPollingInterval = TimeSpan.FromSeconds(15);
        });
    });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

For more information, see [Queue storage binding](../azure-functions/functions-bindings-storage-queue-trigger.md#hostjson-properties).

##### Version 2.*x*

```csharp
static void Main(string[] args)
{
    JobHostConfiguration config = new JobHostConfiguration();
    config.Queues.BatchSize = 8;
    config.Queues.NewBatchThreshold = 4;
    config.Queues.MaxDequeueCount = 4;
    config.Queues.MaxPollingInterval = TimeSpan.FromSeconds(15);
    JobHost host = new JobHost(config);
    host.RunAndBlock();
}
```

For more information, see the [`host.json` v1.x reference](../azure-functions/functions-host-json-v1.md#queues).

#### SendGrid binding configuration (version 3.*x*)

This example shows how to configure the SendGrid output binding:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddSendGrid(a =>
        {
            a.FromAddress.Email = "samples@functions.com";
            a.FromAddress.Name = "Azure Functions";
        });
    });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

For more information, see [`SendGrid` binding](../azure-functions/functions-bindings-sendgrid.md#hostjson-settings).

#### Service Bus trigger configuration (version 3.*x*)

This example shows how to configure the Service Bus trigger:

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddServiceBus(sbOptions =>
        {
            sbOptions.MessageHandlerOptions.AutoComplete = true;
            sbOptions.MessageHandlerOptions.MaxConcurrentCalls = 16;
        });
    });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

For more information, see [Service Bus binding](../azure-functions/functions-bindings-service-bus.md).

#### Configuration for other bindings

Some trigger and binding types define their own custom configuration types. For example, you can use the File trigger to specify the root path to monitor, as in the following examples.

##### Version 3.*x*

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
        b.AddFiles(a => a.RootPath = @"c:\data\import");
    });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

##### Version 2.*x*

```csharp
static void Main()
{
    config = new JobHostConfiguration();
    var filesConfig = new FilesConfiguration
    {
        RootPath = @"c:\data\import"
    };
    config.UseFiles(filesConfig);
    var host = new JobHost(config);
    host.RunAndBlock();
}
```

### Binding expressions

In attribute constructor parameters, you can use expressions that resolve to values from various sources. For example, in the following code, the path for the `BlobTrigger` attribute creates an expression named `filename`. When used for the output binding, `filename` resolves to the name of the triggering blob.

```csharp
public static void CreateThumbnail(
    [BlobTrigger("sample-images/{filename}")] Stream image,
    [Blob("sample-images-sm/{filename}", FileAccess.Write)] Stream imageSmall,
    string filename,
    ILogger logger)
{
    logger.Info($"Blob trigger processing: {filename}");
    // ...
}
```

For more information about binding expressions, see [Binding expressions and patterns](../azure-functions/functions-bindings-expressions-patterns.md) in the Azure Functions documentation.

### Custom binding expressions

Sometimes you want to specify a queue name, a blob name or container, or a table name in code rather than hard-coding it. For example, you might want to specify the queue name for the `QueueTrigger` attribute in a configuration file or environment variable.

You can assign a queue name to the attribute by passing a custom name resolver during configuration. You include placeholders in trigger or binding attribute constructor parameters, and your resolver code provides the actual values to be used in place of those placeholders. You identify placeholders by surrounding them with percent (`%`) signs:

```csharp
public static void WriteLog([QueueTrigger("%logqueue%")] string logMessage)
{
    Console.WriteLine(logMessage);
}
```

In this code, you use a queue named `logqueuetest` in the test environment and a queue named `logqueueprod` in production. Instead of a hard-coded queue name, you specify the name of an entry in the `appSettings` collection.

A default resolver takes effect if you don't provide a custom one. The default gets values from app settings or environment variables.

Starting in .NET Core 3.1, the [`ConfigurationManager`](/dotnet/api/system.configuration.configurationmanager) instance you use requires the [`System.Configuration.ConfigurationManager` NuGet package](https://www.nuget.org/packages/System.Configuration.ConfigurationManager). The sample requires the following `using` statement:

```csharp
using System.Configuration;
```

Your `NameResolver` class gets the queue name from app settings:

```csharp
public class CustomNameResolver : INameResolver
{
    public string Resolve(string name)
    {
        return ConfigurationManager.AppSettings[name].ToString();
    }
}
```

#### Version 3.*x*

You configure the resolver by using dependency injection. These samples require the following `using` statement:

```csharp
using Microsoft.Extensions.DependencyInjection;
```

You add the resolver by calling the [`ConfigureServices`] extension method on [`HostBuilder`](/dotnet/api/microsoft.extensions.hosting.hostbuilder), as in this example:

```csharp
static async Task Main(string[] args)
{
    var builder = new HostBuilder();
    var resolver = new CustomNameResolver();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
    });
    builder.ConfigureServices(s => s.AddSingleton<INameResolver>(resolver));
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

#### Version 2.*x*

Pass your `NameResolver` class in to the `JobHost` object:

```csharp
 static void Main(string[] args)
{
    JobHostConfiguration config = new JobHostConfiguration();
    config.NameResolver = new CustomNameResolver();
    JobHost host = new JobHost(config);
    host.RunAndBlock();
}
```

Azure Functions implements `INameResolver` to get values from app settings, as shown in the example. When you use the WebJobs SDK directly, you can write a custom implementation that gets placeholder replacement values from whatever source you prefer.

### Binding at runtime

If you need to do some work in your function before you use a binding attribute like `Queue`, `Blob`, or `Table`, you can use the `IBinder` interface.

The following example takes an input queue message and creates a new message that has the same content in an output queue. The output queue name is set by code in the body of the function.

```csharp
public static void CreateQueueMessage(
    [QueueTrigger("inputqueue")] string queueMessage,
    IBinder binder)
{
    string outputQueueName = "outputqueue" + DateTime.Now.Month.ToString();
    QueueAttribute queueAttribute = new QueueAttribute(outputQueueName);
    CloudQueue outputQueue = binder.Bind<CloudQueue>(queueAttribute);
    outputQueue.AddMessageAsync(new CloudQueueMessage(queueMessage));
}
```

For more information, see [Binding at runtime](../azure-functions/functions-dotnet-class-library.md#binding-at-runtime) in the Azure Functions documentation.

### Binding reference information

The Azure Functions documentation provides reference information about each binding type. The following information is in each binding reference article. (This example is based on a Storage queue.)

* [Packages](../azure-functions/functions-bindings-storage-queue.md). The package you need to install to include support for the binding in a WebJobs SDK project.
* [Examples](../azure-functions/functions-bindings-storage-queue-trigger.md). Code samples. The C# class library example applies to the WebJobs SDK. Just omit the `FunctionName` attribute.
* [Attributes](../azure-functions/functions-bindings-storage-queue-trigger.md#attributes). The attributes to use for the binding type.
* [Configuration](../azure-functions/functions-bindings-storage-queue-trigger.md#configuration). Explanations of the attribute properties and constructor parameters.
* [Usage](../azure-functions/functions-bindings-storage-queue-trigger.md#usage). The types you can bind to and information about how the binding works. For example, a polling algorithm or poison queue processing.

> [!NOTE]
> The HTTP, Webhooks, and Event Grid bindings are supported only by Azure Functions, not by the WebJobs SDK.
  
For a full list of bindings supported in the Azure Functions runtime, see [Supported bindings](../azure-functions/functions-triggers-bindings.md#supported-bindings).  

## Attributes: Disable, Timeout, and Singleton

You can use these attributes to control function triggering, cancel functions, and ensure that only one instance of a function runs.

### Disable attribute

Use the [`Disable`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/DisableAttribute.cs) attribute to control whether a function can be triggered.

In the following example, if the app setting `Disable_TestJob` has a value of `1` or `True` (not case specific), the function doesn't run. In that scenario, the runtime creates the log message *Function 'Functions.TestJob' is disabled*.

```csharp
[Disable("Disable_TestJob")]
public static void TestJob([QueueTrigger("testqueue2")] string message)
{
    Console.WriteLine("Function with Disable attribute executed!");
}
```

When you change app setting values in the Azure portal, the WebJob restarts to pick up the new setting.

The attribute can be declared at the parameter, method, or class level. The setting name can also contain binding expressions.

### Timeout attribute

The [`Timeout`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/TimeoutAttribute.cs) attribute causes a function to be canceled if it doesn't finish within a specified amount of time. In the following example, the function would run for one day without the `Timeout` attribute. Timeout causes the function to be canceled after 15 seconds. When the `Timeout` attribute `throwOnError` parameter is set to `true`, the function invocation is terminated by having an exception thrown by the WebJobs SDK when the timeout interval is exceeded. The default value of `throwOnError` is `false`. When the `Timeout` attribute is used, the default behavior is to cancel the function invocation by setting the cancellation token while allowing the invocation to run indefinitely until the function code returns or throws an exception.

```csharp
[Timeout("00:00:15")]
public static async Task TimeoutJob(
    [QueueTrigger("testqueue2")] string message,
    CancellationToken token,
    TextWriter log)
{
    await log.WriteLineAsync("Job starting");
    await Task.Delay(TimeSpan.FromDays(1), token);
    await log.WriteLineAsync("Job completed");
}
```

You can apply the `Timeout` attribute at the class level or the method level, and you can specify a global timeout by using `JobHostConfiguration.FunctionTimeout`. Class-level or method-level timeouts override global timeouts.

### Singleton attribute

The [`Singleton`](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/SingletonAttribute.cs) attribute ensures that only one instance of a function runs, even when there are multiple instances of the host web app. The `Singleton` attribute uses [distributed locking](#viewing-lease-blobs) to ensure that only one instance runs.

In this example, only a single instance of the `ProcessImage` function runs at any given time:

```csharp
[Singleton]
public static async Task ProcessImage([BlobTrigger("images")] Stream image)
{
     // Process the image.
}
```

#### SingletonMode.Listener

Some triggers have built-in support for concurrency management:

* **QueueTrigger**. Set `JobHostConfiguration.Queues.BatchSize` to `1`.
* **ServiceBusTrigger**. Set `ServiceBusConfiguration.MessageOptions.MaxConcurrentCalls` to `1`.
* **FileTrigger**. Set `FileProcessor.MaxDegreeOfParallelism` to `1`.

You can use these settings to ensure that your function runs as a singleton on a single instance. To ensure that only a single instance of the function is running when the web app scales out to multiple instances, apply a listener-level singleton lock on the function (`[Singleton(Mode = SingletonMode.Listener)]`). Listener locks are acquired when the JobHost starts. If three scaled-out instances all start at the same time, only one of the instances acquires the lock and only one listener starts.

> [!NOTE]
> To learn more about how `SingletonMode.Function` works, see the [SingletonMode GitHub repo](https://github.com/Azure/azure-webjobs-sdk/blob/master/src/Microsoft.Azure.WebJobs/SingletonMode.cs).

#### Scope values

You can specify a *scope expression/value* on a singleton. The expression/value ensures that all executions of the function at a specific scope are serialized. Implementing more granular locking in this way can allow for some level of parallelism for your function while serializing other invocations as dictated by your requirements. For example, in the following code, the scope expression binds to the `Region` value of the incoming message. When the queue contains three messages in regions East, East, and West, the messages that have region East are run serially. The message with region West runs in parallel with the messages in region East.

```csharp
[Singleton("{Region}")]
public static async Task ProcessWorkItem([QueueTrigger("workitems")] WorkItem workItem)
{
     // Process the work item.
}

public class WorkItem
{
     public int ID { get; set; }
     public string Region { get; set; }
     public int Category { get; set; }
     public string Description { get; set; }
}
```

#### SingletonScope.Host

The default scope for a lock is `SingletonScope.Function`. The lock scope (the blob lease path) is tied to the fully qualified function name. To lock across functions, specify `SingletonScope.Host` and use a scope ID name that's the same across all functions that you don't want to run simultaneously. In the following example, only one instance of `AddItem` or `RemoveItem` runs at a time:

```csharp
[Singleton("ItemsLock", SingletonScope.Host)]
public static void AddItem([QueueTrigger("add-item")] string message)
{
     // Perform the add operation.
}

[Singleton("ItemsLock", SingletonScope.Host)]
public static void RemoveItem([QueueTrigger("remove-item")] string message)
{
     // Perform the remove operation.
}
```

## Viewing lease blobs

The WebJobs SDK uses [Azure blob leases](../storage/blobs/concurrency-manage.md#pessimistic-concurrency-for-blobs) to implement distributed locking. The lease blobs used by `Singleton` can be found in the `azure-webjobs-host` container in the `AzureWebJobsStorage` storage account under the path "locks." For example, the lease blob path for the first `ProcessImage` example shown earlier might be `locks/061851c758f04938a4426aa9ab3869c0/WebJobs.Functions.ProcessImage`. All paths include the JobHost ID, in this case 061851c758f04938a4426aa9ab3869c0.

## Async functions

For information about how to code async functions, see the [Azure Functions documentation](../azure-functions/functions-dotnet-class-library.md#async).

## Cancellation tokens

For information about how to handle cancellation tokens, see the Azure Functions documentation on [cancellation tokens and graceful shutdown](../azure-functions/functions-dotnet-class-library.md#cancellation-tokens).

## Multiple instances

If your web app runs on multiple instances, a continuous WebJob runs on each instance, listening for triggers and calling functions. The various trigger bindings are designed to efficiently share work collaboratively across instances, so that scaling out to more instances allows you to handle more load.

While some triggers might result in double-processing, queue and blob storage triggers automatically prevent a function from processing a queue message or blob more than once. For more information, see [Designing for identical input](../azure-functions/functions-idempotent.md) in the Azure Functions documentation.

The timer trigger automatically ensures that only one instance of the timer runs, so you don't get more than one function instance running at a given scheduled time.

If you want to ensure that only one instance of a function runs, even when there are multiple instances of the host web app, you can use the [`Singleton`](#singleton-attribute) attribute.

## Filters

Function Filters (preview) provide a way to customize the WebJobs execution pipeline by using your own logic. These filters are similar to [ASP.NET Core filters](/aspnet/core/mvc/controllers/filters). You can implement them as declarative attributes that are applied to your functions or classes. For more information, see [Function Filters](https://github.com/Azure/azure-webjobs-sdk/wiki/Function-Filters).

## Logging and monitoring

We recommend that you use the logging framework that was developed for ASP.NET. The [Get started](webjobs-sdk-get-started.md) article shows how to use it.

### Log filtering

Every log created by an `ILogger` instance has associated `Category` and `Level` values. [`LogLevel`](/dotnet/api/microsoft.extensions.logging.loglevel) is an enumeration, and the integer code indicates relative importance:

|LogLevel    |Code|
|------------|---|
|Trace       | 0 |
|Debug       | 1 |
|Information | 2 |
|Warning     | 3 |
|Error       | 4 |
|Critical    | 5 |
|None        | 6 |

You can independently filter each category to a particular [`LogLevel`](/dotnet/api/microsoft.extensions.logging.loglevel) value. For example, you might want to see all logs for blob trigger processing, but only `Error` and higher for everything else.

#### Version 3.*x*

Version 3.*x* of the SDK relies on the filtering that's built into .NET Core. Use the `LogCategories` class to define categories for specific functions, triggers, or users. The `LogCategories` class also defines filters for specific host states, like `Startup` and `Results`, so you can fine-tune the logging output. If no match is found in the defined categories, the filter falls back to the `Default` value when determining whether to filter the message.

`LogCategories` requires the following `using` statement:

```csharp
using Microsoft.Azure.WebJobs.Logging; 
```

The following example constructs a filter that, by default, filters all logs at the `Warning` level. The `Function` and `results` categories (equivalent to `Host.Results` in version 2.*x*) are filtered at the `Error` level. The filter compares the current category to all registered levels in the `LogCategories` instance and chooses the longest match. So the `Debug` level registered for `Host.Triggers` matches `Host.Triggers.Queue` or `Host.Triggers.Blob`. You can control broader categories without needing to add each one.

```csharp
static async Task Main(string[] args)
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
    });
    builder.ConfigureLogging(logging =>
            {
                logging.SetMinimumLevel(LogLevel.Warning);
                logging.AddFilter("Function", LogLevel.Error);
                logging.AddFilter(LogCategories.CreateFunctionCategory("MySpecificFunctionName"),
                    LogLevel.Debug);
                logging.AddFilter(LogCategories.Results, LogLevel.Error);
                logging.AddFilter("Host.Triggers", LogLevel.Debug);
            });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

#### Version 2.*x*

In version 2.*x* of the SDK, you use the `LogCategoryFilter` class to control filtering. The `LogCategoryFilter` has a `Default` property with an initial value of `Information`, meaning that any messages at the `Information`, `Warning`, `Error`, or `Critical` levels are logged, but any messages at the `Debug` or `Trace` levels are filtered away.

As with `LogCategories` in version 3.*x*, the `CategoryLevels` property allows you to specify log levels for specific categories so you can fine-tune the logging output. If no match is found within the `CategoryLevels` dictionary, the filter falls back to the `Default` value when determining whether to filter the message.

The following example constructs a filter that by default filters all logs at the `Warning` level. The `Function` and `Host.Results` categories are filtered at the `Error` level. The `LogCategoryFilter` compares the current category to all registered `CategoryLevels` and chooses the longest match. So the `Debug` level registered for `Host.Triggers` matches `Host.Triggers.Queue` or `Host.Triggers.Blob`. You can control broader categories without needing to add each one.

```csharp
var filter = new LogCategoryFilter();
filter.DefaultLevel = LogLevel.Warning;
filter.CategoryLevels[LogCategories.Function] = LogLevel.Error;
filter.CategoryLevels[LogCategories.Results] = LogLevel.Error;
filter.CategoryLevels["Host.Triggers"] = LogLevel.Debug;

config.LoggerFactory = new LoggerFactory()
    .AddApplicationInsights(instrumentationKey, filter.Filter)
    .AddConsole(filter.Filter);
```

### Custom telemetry for Application Insights

The process for implementing custom telemetry for [Application Insights](/azure/azure-monitor/app/app-insights-overview) depends on the SDK version. To learn how to configure Application Insights, see [Add Application Insights logging](webjobs-sdk-get-started.md#enable-application-insights-logging).

#### Version 3.*x*

Because version 3.*x* of the WebJobs SDK relies on the .NET Core generic host, a custom telemetry factory is no longer provided. But you can add custom telemetry to the pipeline by using dependency injection. The examples in this section require the following `using` statements:

```csharp
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.Channel;
```

You can use the following custom implementation of [`ITelemetryInitializer`] to add your own [`ITelemetry`](/dotnet/api/microsoft.applicationinsights.channel.itelemetry) instance to the default [`TelemetryConfiguration`].

```csharp
internal class CustomTelemetryInitializer : ITelemetryInitializer
{
    public void Initialize(ITelemetry telemetry)
    {
        // Do something with telemetry.
    }
}
```

Call [`ConfigureServices`] in the builder to add a custom [`ITelemetryInitializer`] instance to the pipeline.

```csharp
static async Task Main()
{
    var builder = new HostBuilder();
    builder.ConfigureWebJobs(b =>
    {
        b.AddAzureStorageCoreServices();
    });
    builder.ConfigureLogging((context, b) =>
    {
        // Add logging providers.
        b.AddConsole();

        // If this key exists in any config, use it to enable Application Insights.
        string appInsightsKey = context.Configuration["APPINSIGHTS_INSTRUMENTATIONKEY"];
        if (!string.IsNullOrEmpty(appInsightsKey))
        {
            // This code uses the options callback to explicitly set the instrumentation key.
            b.AddApplicationInsights(o => o.InstrumentationKey = appInsightsKey);
        }
    });
    builder.ConfigureServices(services =>
        {
            services.AddSingleton<ITelemetryInitializer, CustomTelemetryInitializer>();
        });
    var host = builder.Build();
    using (host)
    {
        await host.RunAsync();
    }
}
```

When [`TelemetryConfiguration`] is constructed, all registered types of [`ITelemetryInitializer`] are included. For more information, see [Application Insights API for custom events and metrics](/azure/azure-monitor/app/api-custom-events-metrics).

In version 3.*x*, you don't have to flush [`TelemetryClient`] when the host stops. The .NET Core dependency injection system automatically disposes of the registered `ApplicationInsightsLoggerProvider` instance, which flushes the [`TelemetryClient`].

#### Version 2.*x*

In version 2.*x*, the [`TelemetryClient`] instance created internally by the Application Insights provider for the WebJobs SDK uses [`ServerTelemetryChannel`](https://github.com/microsoft/ApplicationInsights-dotnet/tree/develop/.publicApi/Microsoft.AI.ServerTelemetryChannel.dll). When the Application Insights endpoint is unavailable or is throttling incoming requests, this channel [saves requests in the web app's file system and resubmits them later](https://apmtips.com/posts/2015-09-03-more-telemetry-channels/).

[`TelemetryClient`] is created by a class that implements `ITelemetryClientFactory`. By default, this class is [`DefaultTelemetryClientFactory`](https://github.com/Azure/azure-webjobs-sdk/blob/dev/src/Microsoft.Azure.WebJobs.Logging.ApplicationInsights/).

If you want to modify any part of the Application Insights pipeline, you can supply your own instance of `ITelemetryClientFactory`. The host then uses your class to construct [`TelemetryClient`]. For example, this code overrides `DefaultTelemetryClientFactory` to modify a property of `ServerTelemetryChannel`:

```csharp
private class CustomTelemetryClientFactory : DefaultTelemetryClientFactory
{
    public CustomTelemetryClientFactory(string instrumentationKey, Func<string, LogLevel, bool> filter)
        : base(instrumentationKey, new SamplingPercentageEstimatorSettings(), filter)
    {
    }

    protected override ITelemetryChannel CreateTelemetryChannel()
    {
        ServerTelemetryChannel channel = new ServerTelemetryChannel();

        // Change the default from 30 seconds to 15 seconds.
        channel.MaxTelemetryBufferDelay = TimeSpan.FromSeconds(15);

        return channel;
    }
}
```

The `SamplingPercentageEstimatorSettings` object configures [adaptive sampling](/azure/azure-monitor/app/sampling). In this scenario, in certain high-volume scenarios, Applications Insights sends a selected subset of telemetry data to the server.

After you create the telemetry factory, you pass it in to the Application Insights logging provider:

```csharp
var clientFactory = new CustomTelemetryClientFactory(instrumentationKey, filter.Filter);

config.LoggerFactory = new LoggerFactory()
    .AddApplicationInsights(clientFactory);
```

## <a id="nextsteps"></a> Related content

This article provides code snippets that show how to handle common scenarios for working with the WebJobs SDK. For complete samples, see [azure-webjobs-sdk-samples](https://github.com/Azure/azure-webjobs-sdk/tree/dev/sample/SampleHost).

[`ExecutionContext`]: https://github.com/Azure/azure-webjobs-sdk-extensions/blob/v2.x/src/WebJobs.Extensions/Extensions/Core/ExecutionContext.cs
[`TelemetryClient`]: /dotnet/api/microsoft.applicationinsights.telemetryclient
[`ConfigureServices`]: /dotnet/api/microsoft.extensions.hosting.hostinghostbuilderextensions.configureservices
[`ITelemetryInitializer`]: /dotnet/api/microsoft.applicationinsights.extensibility.itelemetryinitializer
[`TelemetryConfiguration`]: /dotnet/api/microsoft.applicationinsights.extensibility.telemetryconfiguration
[`JobHostConfiguration`]: https://github.com/Azure/azure-webjobs-sdk/blob/v2.x/src/Microsoft.Azure.WebJobs.Host/JobHostConfiguration.cs
