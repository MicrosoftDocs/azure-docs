---
title: Azure Functions runtime 1.x legacy reference
description: Review historical behavior and reference resources for apps that use the retired Azure Functions runtime 1.x.
ms.service: azure-functions
ms.topic: reference
ms.date: 09/16/2026
---

# Azure Functions runtime 1.x legacy reference

> [!IMPORTANT]
> [Support ended for version 1.x of the Azure Functions runtime on September 14, 2026](https://aka.ms/azure-functions-retirements/hostv1). [Migrate your apps to version 4.x](/azure/azure-functions/migrate-version-1-version-4) for full support.

This article preserves key historical information and links to detailed references for function apps that still use runtime 1.x. Don't use runtime 1.x for new function apps.

## Runtime 1.x scope

Azure Functions runtime 1.x reached end of support on September 14, 2026, and isn't supported for new or existing function apps. Runtime 1.x had the following characteristics:

- It ran only on Windows.
- It supported C# apps that targeted .NET Framework and JavaScript apps.
- C# apps ran in-process. Runtime 1.x didn't support the isolated worker model.
- It used version 1.x of Azure Functions Core Tools for local development. Core Tools 1.x runs only on Windows.
- The runtime included its supported bindings. Later runtime versions use separately versioned binding extensions or extension bundles.

## Runtime, extension, and programming model versions

The Azure Functions runtime version isn't the same as the versions used by binding extensions, extension bundles, or language programming models. A version label on another component doesn't indicate that an app uses Azure Functions runtime 1.x. For example:

- The Python v1 and v2 programming models run on runtime 4.x.
- The Node.js v3 and v4 programming models run on runtime 4.x.
- Extension bundle and binding extension package versions are independent of the runtime version.

## Migrate to runtime 4.x

To return an app to full support, [migrate it from runtime 1.x to runtime 4.x](/azure/azure-functions/migrate-version-1-version-4). The migration guide covers these tasks:

- Identify apps that target runtime 1.x.
- Choose a supported target for C# or JavaScript.
- Update the project, bindings, app settings, and *host.json* file.
- Test the app locally and update the function app in Azure.

Don't change only the `FUNCTIONS_EXTENSION_VERSION` app setting. Runtime upgrades can require project, code, binding, and configuration changes.

## App settings specific to runtime 1.x

The deprecated `AzureWebJobsDashboard` setting is supported only by runtime 1.x. It contains an optional general-purpose storage account connection string used to store logs and display them in the **Monitor** tab in the Azure portal.

| Key | Sample value |
| --- | --- |
| `AzureWebJobsDashboard` | `DefaultEndpointsProtocol=https;AccountName=...` |

Runtime 1.x doesn't support the `AZURE_FUNCTIONS_ENVIRONMENT` app setting.

The `FUNCTIONS_EXTENSION_VERSION` value `~1` pins a function app to runtime 1.x. File-system key storage (`AzureWebJobsSecretStorageType=files`) is the default.

The `functionsRuntimeAdminIsolationEnabled` site property isn't available in runtime 1.x. The `FUNCTIONS_V2_COMPATIBILITY_MODE` setting doesn't apply to runtime 1.x apps.

## Project and language differences

Runtime 1.x C# class library projects targeted .NET Framework and used the 1.x version of the `Microsoft.NET.Sdk.Functions` package. They could use `TraceWriter` for logging. For the current C# project model and migration considerations, see the [.NET class library developer guide](/azure/azure-functions/functions-dotnet-class-library) and the [runtime 1.x migration guide](/azure/azure-functions/migrate-version-1-version-4?pivots=programming-language-csharp).

### C# class library projects

The following example shows the relevant parts of a runtime 1.x project file:

```xml
<PropertyGroup>
  <TargetFramework>net48</TargetFramework>
</PropertyGroup>
<ItemGroup>
  <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="1.0.24" />
</ItemGroup>
```

The `Microsoft.NET.Sdk.Functions` package dependencies include triggers and bindings. A 1.x project refers to 1.x triggers and bindings because they target .NET Framework. The package also depends on `Newtonsoft.Json` and indirectly on `WindowsAzure.Storage`. These dependencies ensure that the project uses versions compatible with the targeted Functions runtime. For example, the Functions runtime that targets .NET Framework 4.6.1 is compatible with `Newtonsoft.Json` 9.0.1, not version 11.

Runtime 1.x used `TraceWriter` for Application Insights logging. `TraceWriter` doesn't support structured logging.

The following example creates a `TelemetryClient` and uses `TrackEvent`, `TrackMetric`, and `TrackDependency` to record custom telemetry. It also uses the function execution context to correlate the custom telemetry with the current invocation.

#### Custom telemetry example

```csharp
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace functionapp0915
{
	public static class HttpTrigger2
	{
		private static string key = TelemetryConfiguration.Active.InstrumentationKey =
			Environment.GetEnvironmentVariable(
				"APPINSIGHTS_INSTRUMENTATIONKEY", EnvironmentVariableTarget.Process);

		private static TelemetryClient telemetryClient =
			new TelemetryClient() { InstrumentationKey = key };

		[FunctionName("HttpTrigger2")]
		public static async Task<HttpResponseMessage> Run(
			[HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
			HttpRequestMessage req, ExecutionContext context, ILogger log)
		{
			log.LogInformation("C# HTTP trigger function processed a request.");
			DateTime start = DateTime.UtcNow;
			string name = req.GetQueryNameValuePairs()
				.FirstOrDefault(q => string.Compare(q.Key, "name", true) == 0)
				.Value;
			dynamic data = await req.Content.ReadAsAsync<object>();
			name = name ?? data?.name;

			var evt = new EventTelemetry("Function called");
			UpdateTelemetryContext(evt.Context, context, name);
			telemetryClient.TrackEvent(evt);

			var metric = new MetricTelemetry("Test Metric", DateTime.Now.Millisecond);
			UpdateTelemetryContext(metric.Context, context, name);
			telemetryClient.TrackMetric(metric);

			var dependency = new DependencyTelemetry
			{
				Name = "GET api/planets/1/",
				Target = "swapi.co",
				Data = "https://swapi.co/api/planets/1/",
				Timestamp = start,
				Duration = DateTime.UtcNow - start,
				Success = true
			};
			UpdateTelemetryContext(dependency.Context, context, name);
			telemetryClient.TrackDependency(dependency);
		}

		private static void UpdateTelemetryContext(
			TelemetryContext context,
			ExecutionContext functionContext,
			string userName)
		{
			context.Operation.Id = functionContext.InvocationId.ToString();
			context.Operation.ParentId = functionContext.InvocationId.ToString();
			context.Operation.Name = functionContext.FunctionName;
			context.User.Id = userName;
		}
	}
}
```

Runtime 1.x also supported C# script (`.csx`) and JavaScript functions. C# script isn't specific to runtime 1.x, so use the [C# script developer reference](/azure/azure-functions/functions-reference-csharp) for general script guidance. Use the migration guide for runtime-specific changes.

For examples of the earlier C# syntax, see the [runtime 1.x function templates](https://github.com/Azure/azure-functions-templates/tree/v1.x/Functions.Templates/Templates).

### C# script assemblies and packages

In runtime 1.x C# script functions, you could reference the following assemblies by simple name:

- `Newtonsoft.Json`
- `Microsoft.WindowsAzure.Storage`
- `Microsoft.ServiceBus`
- `Microsoft.AspNet.WebHooks.Receivers`
- `Microsoft.AspNet.WebHooks.Common`

Runtime 1.x used a *project.json* file to define dependencies. The following example adds the `Microsoft.ProjectOxford.Face` NuGet package:

```json
{
	"frameworks": {
		"net46": {
			"dependencies": {
				"Microsoft.ProjectOxford.Face": "1.1.0"
			}
		}
	}
}
```

Extension bundles aren't supported by runtime 1.x. To use a custom NuGet feed, specify the feed in a *NuGet.Config* file in the function app root folder. For more information, see [Configuring NuGet behavior](/nuget/consume-packages/configuring-nuget-behavior).

## Local development with Core Tools 1.x

Version 1.x of Azure Functions Core Tools is paired with runtime 1.x and runs only on Windows. To start the runtime, you ran `func host start`. For current local development guidance, see [Develop Azure Functions locally using Core Tools](/azure/azure-functions/functions-run-local).

Visual Studio stored runtime 1.x Core Tools versions in `%USERPROFILE%\AppData\Local\Azure.Functions.Cli` and used the latest version stored there. You could see the selected version in the console output when running the project:

```output
[3/1/2018 9:59:53 AM] Starting Host (HostId=contoso2-1518597420, Version=2.0.11353.0, ProcessId=22020, Debug=False, Attempt=0, FunctionsExtensionVersion=)
```

## Runtime 1.x host.json reference

The *host.json* schema and settings changed after runtime 1.x. See the [runtime 1.x host.json reference](functions-host-json-v1.md) when reviewing an existing configuration, and compare it with the [current host.json reference](/azure/azure-functions/functions-host-json) during migration.

## Monitor runtime 1.x apps with Application Insights

Runtime 1.x uses the following Application Insights log categories:

| Category | Table | Description |
| --- | --- | --- |
| `Function` | **traces** | User-generated logs, which can be any log level. |
| `Host.Aggregator` | **customMetrics** | Counts and averages of function invocations over a configurable period. The default is 30 seconds or 1,000 results, whichever comes first. These logs are written at the `Information` level. |
| `Host.Executor` | **traces** | Function started and completed logs. Successful runs use `Information`, exceptions use `Error`, and conditions such as poison-queue messages use `Warning`. |
| `Host.Results` | **requests** | Success or failure of function executions. These logs are written at the `Information` level. |

### Configure log levels

Runtime 1.x configures log levels under `logger.categoryFilter` in *host.json*:

```json
{
	"logger": {
		"categoryFilter": {
			"defaultLevel": "Warning",
			"categoryLevels": {
				"Host.Results": "Information",
				"Host.Aggregator": "Trace",
				"Function": "Information"
			}
		}
	}
}
```

When multiple category names start with the same string, the more specific category is matched first. The following example logs everything except `Host.Aggregator` at the `Error` level:

```json
{
	"logger": {
		"categoryFilter": {
			"defaultLevel": "Information",
			"categoryLevels": {
				"Host": "Error",
				"Function": "Error",
				"Host.Aggregator": "Information"
			}
		}
	}
}
```

### Configure sampling

The default maximum telemetry rate is five items per second. Runtime 1.x configures sampling under `applicationInsights.sampling`:

```json
{
	"applicationInsights": {
		"sampling": {
			"isEnabled": true,
			"maxTelemetryItemsPerSecond": 5
		}
	}
}
```

The following example combines category filtering and sampling:

```json
{
	"logger": {
		"categoryFilter": {
			"defaultLevel": "Warning",
			"categoryLevels": {
				"Function": "Error",
				"Host.Aggregator": "Error",
				"Host.Results": "Information",
				"Host.Executor": "Warning"
			}
		}
	},
	"applicationInsights": {
		"sampling": {
			"isEnabled": true,
			"maxTelemetryItemsPerSecond": 5
		}
	}
}
```

Runtime 1.x doesn't support configuration per function.

### Application Insights capabilities

Runtime 1.x automatically collected requests, exceptions, and performance counters. It didn't automatically collect HTTP, Service Bus, Event Hubs, or SQL dependencies. It supported QuickPulse/Live Metrics without a secure control channel and supported sampling, but it didn't support heartbeats, Service Bus or Event Hubs correlation, or fully configurable telemetry collection.

## Unsupported features and behavior in runtime 1.x

- Retry policies aren't supported.
- Dynamic scale monitoring of virtual network triggers isn't supported.
- On Premium and Dedicated plans, the default function execution timeout is unbounded. On the Consumption plan, the default timeout is five minutes and the maximum is 10 minutes.
- A function app that uses a remote deployment package can't run without an Azure Files share.

## Bindings included in runtime 1.x

Azure Functions runtime 1.x is retired. When you migrate to runtime 4.x, use current binding extensions or an extension bundle and review each binding for configuration and type changes.

The following bindings were included with runtime 1.x. The C# attribute column shows the short names used in code. The corresponding class names have an `Attribute` suffix, such as `BlobTriggerAttribute`. C# script functions instead define bindings in the *function.json* file.

| Type | Trigger | Input | Output | C# attributes |
| ---- | :-----: | :---: | :----: | --- |
| [Blob Storage](/azure/azure-functions/functions-bindings-storage-blob) | Yes | Yes | Yes | `[BlobTrigger]` (trigger)<br/>`[Blob]` (input/output) |
| [Azure Cosmos DB](functions-bindings-cosmosdb.md) | Yes | Yes | Yes | `[CosmosDBTrigger]` (trigger)<br/>`[DocumentDB]` (input/output) |
| [Event Grid](/azure/azure-functions/functions-bindings-event-grid) | Yes | No | No | `[EventGridTrigger]` |
| [Event Hubs](/azure/azure-functions/functions-bindings-event-hubs) | Yes | No | Yes | `[EventHubTrigger]` (trigger)<br/>`[EventHub]` (output) |
| [HTTP and webhooks](/azure/azure-functions/functions-bindings-http-webhook) | Yes | No | Yes | `[HttpTrigger]` |
| [IoT Hub](/azure/azure-functions/functions-bindings-event-iot) | Yes | No | No | `[EventHubTrigger]` |
| [Mobile Apps](functions-bindings-mobile-apps.md) | No | Yes | Yes | `[MobileTable]` |
| [Notification Hubs](functions-bindings-notification-hubs.md) | No | No | Yes | `[NotificationHub]` |
| [Queue Storage](/azure/azure-functions/functions-bindings-storage-queue) | Yes | No | Yes | `[QueueTrigger]` (trigger)<br/>`[Queue]` (output) |
| [SendGrid](/azure/azure-functions/functions-bindings-sendgrid) | No | No | Yes | `[SendGrid]` |
| [Service Bus](/azure/azure-functions/functions-bindings-service-bus) | Yes | No | Yes | `[ServiceBusTrigger]` (trigger)<br/>`[ServiceBus]` (output) |
| [Table Storage](/azure/azure-functions/functions-bindings-storage-table) | No | Yes | Yes | `[Table]` |
| [Timer](/azure/azure-functions/functions-bindings-timer) | Yes | No | No | `[TimerTrigger]` |
| [Twilio](/azure/azure-functions/functions-bindings-twilio) | No | No | Yes | `[TwilioSms]` |

Function apps that use runtime 1.x automatically reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package (version 2.x).

The Blob Storage, Queue Storage, and Table Storage triggers and bindings use version 7.2.1 of the [WindowsAzure.Storage](https://www.nuget.org/packages/WindowsAzure.Storage/7.2.1) NuGet package. If you reference a different version of the Storage SDK and bind to a Storage SDK type in your function signature, the Functions runtime might report that it can't bind to that type. Make sure your project references WindowsAzure.Storage 7.2.1.

## Blob Storage bindings in runtime 1.x

Runtime 1.x exposed types from the deprecated [Microsoft.WindowsAzure.Storage](/dotnet/api/microsoft.windowsazure.storage) namespace. Newer types from [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs) require a later extension and runtime 4.x.

## Queue Storage bindings in runtime 1.x

Runtime 1.x exposed types from the deprecated [Microsoft.WindowsAzure.Storage](/dotnet/api/microsoft.windowsazure.storage) namespace. Newer types from [Azure.Storage.Queues](/dotnet/api/azure.storage.queues) require a later extension and runtime 4.x.

For Queue Storage binding settings, see the [queues section of the runtime 1.x host.json reference](functions-host-json-v1.md#queues). In runtime 1.x, the `maxPollingInterval` setting is expressed in milliseconds. In later runtime versions, its data type is `TimeSpan`.

## Table Storage bindings in runtime 1.x

Runtime 1.x exposed types from the deprecated [Microsoft.WindowsAzure.Storage.Table](/dotnet/api/microsoft.windowsazure.storage.table) namespace. Newer types from [Azure.Data.Tables](/dotnet/api/azure.data.tables) require the Azure Tables extension and runtime 4.x.

### Input examples

The following C# function reads a single table row. For every message sent to the queue, the function is triggered. The row key value `{queueTrigger}` binds the row key to the message metadata, which is the message string.

```csharp
public class TableStorage
{
	public class MyPoco
	{
		public string PartitionKey { get; set; }
		public string RowKey { get; set; }
		public string Text { get; set; }
	}

	[FunctionName("TableInput")]
	public static void TableInput(
		[QueueTrigger("table-items")] string input,
		[Table("MyTable", "MyPartition", "{queueTrigger}")] MyPoco poco,
		ILogger log)
	{
		log.LogInformation($"PK={poco.PartitionKey}, RK={poco.RowKey}, Text={poco.Text}");
	}
}
```

The following C# function reads multiple table rows where the `MyPoco` class derives from `TableEntity`.

```csharp
public class TableStorage
{
	public class MyPoco : TableEntity
	{
		public string Text { get; set; }
	}

	[FunctionName("TableInput")]
	public static void TableInput(
		[QueueTrigger("table-items")] string input,
		[Table("MyTable", "MyPartition")] IQueryable<MyPoco> pocos,
		ILogger log)
	{
		foreach (MyPoco poco in pocos)
		{
			log.LogInformation($"PK={poco.PartitionKey}, RK={poco.RowKey}, Text={poco.Text}");
		}
	}
}
```

### Input usage

To return a specific entity by key, use a binding parameter that derives from [TableEntity](/dotnet/api/microsoft.windowsazure.storage.table.tableentity). The specific `TableName`, `PartitionKey`, and `RowKey` are used to try to get a specific entity from the table.

To execute queries that return multiple entities, bind to an `IQueryable<T>` of a type that inherits from [TableEntity](/dotnet/api/microsoft.windowsazure.storage.table.tableentity).

### Output usage

The following types are supported for `out` parameters and return types:

- A plain-old CLR object (POCO) that includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity` or inheriting `TableEntity`.
- `ICollector<T>` or `IAsyncCollector<T>` where `T` includes the `PartitionKey` and `RowKey` properties. You can accompany these properties by implementing `ITableEntity` or inheriting `TableEntity`.

You can also bind to `CloudTable` [from the Storage SDK](/dotnet/api/microsoft.windowsazure.storage.table.cloudtable) as a method parameter. You can then use that object to write to the table.

## Event Hubs bindings in runtime 1.x

Runtime 1.x included the Event Hubs binding and didn't require a separate extension. It exposed the deprecated [Microsoft.Azure.EventHubs.EventData](/dotnet/api/microsoft.azure.eventhubs.eventdata) type. Event Hubs triggers supported `EventData`, JSON-serializable types, `string`, and `byte[]` for a single event, and `EventData[]` and `string[]` for a batch. Output bindings supported `EventData`, JSON-serializable types, `string`, and `byte[]`.

For an Event Hubs trigger or output binding in *function.json*, runtime 1.x uses the `path` property for the event hub name. Later runtime versions use `eventHubName`. When the event hub name is also present in the connection string, that value overrides the property at runtime.

The runtime 1.x *host.json* file uses a top-level `eventHub` object:

```json
{
	"eventHub": {
		"maxBatchSize": 64,
		"prefetchCount": 256,
		"batchCheckpointFrequency": 1
	}
}
```

| Property | Default | Description |
| --- | --- | --- |
| `maxBatchSize` | 64 | The maximum event count received per receive loop. |
| `prefetchCount` | 300 | The default prefetch count used by the underlying `EventProcessorHost`. |
| `batchCheckpointFrequency` | 1 | The number of event batches to process before creating an Event Hubs cursor checkpoint. |

For the complete configuration reference, see the [`eventHub` section of the runtime 1.x host.json reference](functions-host-json-v1.md#eventhub).

## Event Grid bindings in runtime 1.x

Event Grid extension versions earlier than 3.x don't support the [CloudEvents schema](/azure/event-grid/cloudevents-schema#azure-functions). To consume this schema, use an HTTP trigger or migrate to runtime 4.x and Event Grid extension 3.x.

The Event Grid output binding is only available for runtime 2.x and later.

### Binding types

The runtime 1.x extension supports the following parameter types. It doesn't support the CloudEvents schema, which requires Event Grid extension 3.x.

| Binding | Parameter types |
| - | - |
| Event Grid trigger | `Newtonsoft.Json.Linq.JObject`<br/>`string` |

### Trigger usage

In-process C# class library functions support the following Event Grid trigger types:

- `Newtonsoft.Json.Linq.JObject`
- `System.String`

### Webhook endpoint and system key

The hosted webhook endpoint for a runtime 1.x Event Grid trigger uses the following URL pattern:

```http
https://{functionappname}.azurewebsites.net/admin/extensions/EventGridExtensionConfig?functionName={functionname}&code={systemkey}
```

To get the Event Grid system key from the administrator API, use the function app master key in the following request:

```http
https://{functionappname}.azurewebsites.net/admin/host/systemkeys/eventgridextensionconfig_extension?code={masterkey}
```

For local testing, the Event Grid trigger endpoint uses the following URL pattern:

```http
http://localhost:7071/admin/extensions/EventGridExtensionConfig?functionName={FUNCTION_NAME}
```

## Service Bus bindings in runtime 1.x

Runtime 1.x exposed types from the deprecated [Microsoft.ServiceBus.Messaging](/dotnet/api/microsoft.servicebus.messaging) namespace. Newer types from [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus) require Service Bus extension 5.x or later and runtime 4.x.

On September 30, 2026, the Azure Service Bus SDK libraries WindowsAzure.ServiceBus, Microsoft.Azure.ServiceBus, and com.microsoft.azure.servicebus will retire. These libraries don't conform to Azure SDK guidelines. Support for the Service Bus Messaging Protocol (SBMP) will also end. Although you can continue to use the older libraries after retirement, they will no longer receive official support and updates from Microsoft. For more information, see the [support retirement announcement](https://azure.microsoft.com/updates/retirement-notice-update-your-azure-service-bus-sdk-libraries-by-30-september-2026/).

### Trigger usage

The queue or topic message trigger supports the following parameter types:

- [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) gives you the deserialized message with the [BrokeredMessage.GetBody<T>()](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage.getbody#Microsoft_ServiceBus_Messaging_BrokeredMessage_GetBody__1) method.
- [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) receives and acknowledges messages from the message container. This type is required when `autoComplete` is set to `false`.

In C# class libraries, the attribute's constructor takes the name of the queue or the topic and subscription. You can also specify the connection's access rights. If you don't specify access rights, the default is `Manage`.

### Service Bus account selection

Use the [ServiceBusAccountAttribute](https://github.com/Azure/azure-functions-servicebus-extension/blob/master/src/Microsoft.Azure.WebJobs.Extensions.ServiceBus/ServiceBusAccountAttribute.cs) to specify the Service Bus account. The constructor takes the name of an app setting that contains a Service Bus connection string. Apply the attribute at the parameter, method, or class level. The following example shows class-level and method-level attributes:

```csharp
[ServiceBusAccount("ClassLevelServiceBusAppSetting")]
public static class AzureFunctions
{
	[ServiceBusAccount("MethodLevelServiceBusAppSetting")]
	[FunctionName("ServiceBusQueueTriggerCSharp")]
	public static void Run(
		[ServiceBusTrigger("myqueue", AccessRights.Manage)]
		string myQueueItem, ILogger log)
	{
		// ...
	}
}
```

The following order determines which Service Bus account to use:

1. The `ServiceBusTrigger` attribute's `Connection` property.
1. The `ServiceBusAccount` attribute applied to the same parameter as the `ServiceBusTrigger` attribute.
1. The `ServiceBusAccount` attribute applied to the function.
1. The `ServiceBusAccount` attribute applied to the class.
1. The `AzureWebJobsServiceBus` app setting.

### Message metadata

The following properties are members of the [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) and [MessageReceiver](/dotnet/api/microsoft.azure.servicebus.core.messagereceiver) classes.

| Property | Type | Description |
| - | - | - |
| `ContentType` | `string` | A content type identifier used by the sender and receiver for application-specific logic. |
| `CorrelationId` | `string` | The correlation ID. |
| `DeadLetterSource` | `string` | The dead-letter source. |
| `DeliveryCount` | `Int32` | The number of deliveries. |
| `EnqueuedTimeUtc` | `DateTime` | The enqueued time in Coordinated Universal Time (UTC). |
| `ExpiresAtUtc` | `DateTime` | The expiration time in UTC. |
| `Label` | `string` | The application-specific label. |
| `MessageId` | `string` | A user-defined value that Service Bus can use to identify duplicate messages, if enabled. |
| `MessageReceiver` | `MessageReceiver` | Service Bus message receiver. Can be used to abandon, complete, or dead-letter the message. |
| `MessageSession` | `MessageSession` | A message receiver specifically for session-enabled queues and topics. |
| `ReplyTo` | `string` | The reply-to queue address. |
| `SequenceNumber` | `long` | The unique number assigned to a message by Service Bus. |
| `To` | `string` | The send-to address. |
| `UserProperties` | `IDictionary<string, object>` | Properties set by the sender. |

### Output usage

Use the [BrokeredMessage](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage) type when sending messages with metadata. Define parameters as `return` type attributes. If the parameter value is null when the function exits, Functions doesn't create a message.

For *function.json* bindings, `accessRights` accepts `manage` or `listen` and defaults to `manage`. If the connection string doesn't have **Manage** permission, set `accessRights` to `listen` to prevent the runtime from attempting management operations.

The runtime creates the queue if it doesn't exist and you set `accessRights` to `manage`.

### Host settings

For Service Bus binding settings, see the [runtime 1.x host.json reference](functions-host-json-v1.md#servicebus).

## HTTP and webhook bindings in runtime 1.x

An HTTP-triggered function returns `HTTP 200 OK` with an empty body by default. Later runtime versions return `HTTP 204 No Content`.

For an HTTP trigger in *function.json*, use the `webHookType` property to configure the trigger to act as a webhook receiver for the specified provider. This property is specific to runtime 1.x.

Runtime 1.x doesn't support access to authenticated client information.

### Webhook mode

Webhook templates provide extra validation for webhook payloads. The `webHookType` binding property shows the webhook provider and controls the supported payload:

| Type value | Description |
| --- | --- |
| `genericJson` | A general-purpose webhook endpoint without logic for a specific provider. This setting restricts requests to HTTP POST with the `application/json` content type. |
| `github` | The function responds to [GitHub webhooks](https://developer.github.com/webhooks/). Don't use the `authLevel` property with GitHub webhooks. |
| `slack` | The function responds to [Slack webhooks](https://api.slack.com/outgoing-webhooks). Don't use the `authLevel` property with Slack webhooks. |

When you set `webHookType`, don't set the `methods` property.

To respond to GitHub webhooks, create the function with an HTTP trigger, set `webHookType` to `github`, and copy its URL and API key into the **Add webhook** page of the GitHub repository.

The Slack webhook generates a token, so configure a function-specific key with that token.

The webhook receiver component handles webhook authorization. The mechanism varies by webhook type, but each mechanism relies on a key. By default, the function key named `default` is used. To use another key, configure the webhook provider to send the key name in one of the following ways:

- In the `clientid` query string parameter, such as `https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?clientid=<KEY_NAME>`.
- In the `x-functions-clientid` request header.

For HTTP binding settings, see the [HTTP section of the runtime 1.x host.json reference](functions-host-json-v1.md#http).

## Warmup trigger in runtime 1.x

Runtime 1.x doesn't support the warmup trigger.

## SendGrid binding in runtime 1.x

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid), version 2.x.

For SendGrid binding settings, see the [SendGrid section of the runtime 1.x host.json reference](functions-host-json-v1.md#sendgrid).

## Twilio binding in runtime 1.x

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Twilio), version 1.x.

For runtime 1.x, use the following binding configuration properties in the *function.json* file:

| function.json property | Description |
| --- | --- |
| **type** | Set to `twilioSms`. |
| **direction** | Set to `out`. |
| **name** | Variable name used in function code for the Twilio SMS text message. |
| **accountSid** | Set to the name of an app setting that holds your Twilio Account Sid (`TwilioAccountSid`). When not set, the default app setting name is `AzureWebJobsTwilioAccountSid`. |
| **authToken** | Set to the name of an app setting that holds your Twilio authentication token (`TwilioAccountAuthToken`). When not set, the default app setting name is `AzureWebJobsTwilioAuthToken`. |
| **to** | Set to the phone number that the SMS text is sent to. |
| **from** | Set to the phone number that the SMS text is sent from. |
| **body** | Use to hard code the SMS text message if you don't need to set it dynamically in the code for your function. |

Use the preserved binding information in this article only to understand an existing app. Follow the runtime migration guide and the current binding documentation when you update the app.

## Frequently asked questions

### Is Azure Functions runtime 1.x still supported?

No. Support for Azure Functions runtime 1.x ended on September 14, 2026. Migrate affected apps to runtime 4.x for full support.

### Does a Python v1 or Node.js v4 programming model use runtime 1.x?

No. Language programming model versions are independent of the runtime version. The Python v1 and v2 programming models and the Node.js v3 and v4 programming models run on runtime 4.x.

## Related resources

- [Compare Azure Functions runtime versions](/azure/azure-functions/functions-versions)
- [Azure Functions runtime 1.x support announcement](https://aka.ms/azure-functions-retirements/hostv1)
- [Migrate apps from Azure Functions runtime 1.x to 4.x](/azure/azure-functions/migrate-version-1-version-4)