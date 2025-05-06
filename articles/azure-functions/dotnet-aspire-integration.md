---
title: Guide for using Azure Functions with .NET Aspire
description: Learn how to use Azure Functions with .NET Aspire, which simplifies authoring of distributed applications in the cloud.
ms.service: azure-functions
ms.topic: conceptual
ms.date: 04/21/2025
---

# Azure Functions with .NET Aspire (Preview)

[.NET Aspire](/dotnet/aspire/get-started/aspire-overview) is an opinionated stack that simplifies development of distributed applications in the cloud. The .NET Aspire Azure Functions integration enables you to develop, debug, and orchestrate an Azure Functions .NET project as part of the .NET Aspire app host.

> [!IMPORTANT]
> The .NET Aspire Azure Functions integration is currently in preview and is subject to change.

## Prerequisites

Set up your development environment for Azure Functions with .NET Aspire:

- Install the [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) and [Aspire 9.0 or later](/dotnet/aspire/fundamentals/setup-tooling). Although the .NET 9 SDK is required, Aspire 9.0 supports the .NET 8 and .NET 9 frameworks.
- If you use Visual Studio, update to version 17.12 or later. You must also have the latest version of the Functions tools for Visual Studio. To check for updates, navigate to **Tools** > **Options**, choose **Azure Functions** under **Projects and Solutions**. Select **Check for updates** and install updates as prompted.

## Solution structure

An Azure Functions and .NET Aspire solution has multiple projects, including an [app host project](/dotnet/aspire/fundamentals/app-host-overview) and one or more Azure Functions projects. The app host project is the entry point for your application and orchestrates the setup of the different components of your application, including the Azure Functions project. The solution typically also includes a service defaults project, which provides a set of default services and configurations to be used across projects in your application.

### App host project

To successfully configure the integration, the app host project must meet the following requirements:

- The app host project must reference [Aspire.Hosting.Azure.Functions]. This package defines the logic needed for the integration.
- The app host project needs to have a project reference for each Azure Functions project that you want to include in the orchestration.
- In the app host's `Program.cs`, you must also include the project by calling `AddAzureFunctionsProject<TProject>()` on your `IDistributedApplicationBuilder`. This method is used instead of the `AddProject<TProject>()` that you use for other project types in .NET Aspire. If you just use `AddProject<TProject>()`, the Functions project can't start properly.

The following example shows a minimal `Program.cs` for an App Host project:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject");

builder.Build().Run();
```

### Azure Functions project

To successfully configure the integration, the Azure Functions project must meet the following requirements:

- The Azure Functions project must reference the [2.x versions](./dotnet-isolated-process-guide.md#version-2x) of [Microsoft.Azure.Functions.Worker] and [Microsoft.Azure.Functions.Worker.Sdk]. You must also update any references you have to [Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore] to the 2.x version as well.
- Your `Program.cs` should use the `IHostApplicationBuilder` version of [host instance startup](./dotnet-isolated-process-guide.md#start-up-and-configuration). This means you should use `FunctionsApplication.CreateBuilder(args)`.
- If your solution includes a service defaults project, you should also ensure your Functions project is configured to use it:

    - The Azure Functions project should include a project reference to the service defaults project. 
    - Before building your `IHostApplicationBuilder` in `Program.cs`, you should also include a call to `builder.AddServiceDefaults()`.

The following example shows a minimal `Program.cs` for an Azure Functions project used in Aspire:

```csharp
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.ConfigureFunctionsWebApplication();

builder.Build().Run();
```

This example doesn't include the default Application Insights configuration that you see in many of other `Program.cs` examples and from the Azure Functions templates. Instead, Aspire's OpenTelemetry integration is configured through the `builder.AddServiceDefaults()` call.

To get the most out of the integration, you should also consider the following guidelines:

- The Azure Functions project shouldn't include any direct Application Insights integrations. Monitoring in Aspire is instead handled through its OpenTelemetry support. You can configure .NET Aspire to export telemetry to Azure Monitor through the service defaults project.
-  The Azure Functions project shouldn't keep custom configuration in `local.settings.json`. The only setting needed in `local.settings.json` is `FUNCTIONS_WORKER_RUNTIME`, which should be set to `dotnet-isolated`. All other configuration should be set through the app host project.

## Connection configuration with Aspire

The app host project defines resources and helps you create connections between them using code. This section shows how to configure and customize connections to be used by your Azure Functions project.

.NET Aspire includes default connection permissions which can help you get started. However, these permissions may not be appropriate or sufficient for your application. For scenarios using Azure Role-based Access Control (RBAC), you can customize permissions by calling the `WithRoleAssignments()` method on the project resource. When you call `WithRoleAssignments()`, all default role assignments are removed, and you must explicitly define the full set role assignments you want. If you host your application on Azure Container Apps, using `WithRoleAssignments()` also requires that you call `AddAzureContainerAppEnvironment()` on the `DistributedApplicationBuilder`.

### Azure Functions host storage

Azure Functions requires a [host storage connection (`AzureWebJobsStorage`)][host-storage-identity] for several of its core behaviors. When you call `AddAzureFunctionsProject<TProject>()` in your app host project, by default, an `AzureWebJobsStorage` connection is created and provided to the Functions project. This default connection uses the Storage emulator for local development runs and automatically provisions a storage account when deployed. For more control, you can replace this connection by calling `.WithHostStorage()` on the Functions project resource.

.NET Aspire sets different default permissions for the host storage connection depending on whether you call `WithHostStorage()` or not. Adding `WithHostStorage()` removes a [Storage Account Contributor] assignment. The default permissions set by .NET Aspire for the host storage connection are as follows:

| Host storage connection | Default roles                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------------------|
| No call to `WithHostStorage()`  | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor],<br/>[Storage Account Contributor] |
| Calling `WithHostStorage()` | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |

The following example shows a minimal `Program.cs` for an app host project that replaces the host storage and specifies a role assignment:

```csharp
using Azure.Provisioning.Storage;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("myEnv");

var myHostStorage = builder.AddAzureStorage("myHostStorage");

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithHostStorage(myHostStorage)
    .WithRoleAssignments(myHostStorage, StorageBuiltInRole.StorageBlobDataOwner);

builder.Build().Run();
```

> [!NOTE]
> [Storage Blob Data Owner] is the recommended role for the [basic needs for the host storage connection][host-storage-identity]. Your app may encounter issues if the connection to the blob service only has the Aspire default of [Storage Blob Data Contributor]. For production scenarios, you should include calls to both `WithHostStorage()` and `WithRoleAssignments()` so you can set this role explicitly, along with any others you need.

### Trigger and binding connections

Your triggers and bindings reference connections by name. Some Aspire integrations are enabled to provide these through a call to `WithReference()` on the project resource:

| Aspire integration                                                          | Default roles                                                                                             |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [Azure Blobs](/dotnet/aspire/storage/azure-storage-blobs-integration)       | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Queues](/dotnet/aspire/storage/azure-storage-queues-integration)     | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Event Hubs](/dotnet/aspire/messaging/azure-event-hubs-integration)   | [Azure Event Hubs Data Owner]                                                                               |
| [Azure Service Bus](/dotnet/aspire/messaging/azure-service-bus-integration) | [Azure Service Bus Data Owner]                                                                              |

The following example shows a minimal `Program.cs` for an app host project that configures a queue trigger. In this example, the corresponding queue trigger has its `Connection` property set to "MyQueueTriggerConnection", so the call to `WithReference()` specifies the name.

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var myAppStorage = builder.AddAzureStorage("myAppStorage").RunAsEmulator();
var queues = myAppStorage.AddQueues("queues");

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithReference(queues, "MyQueueTriggerConnection");

builder.Build().Run();
```

For other integrations, calls to `WithReference` set the configuration in a different way, making it available to [Aspire client integrations](/dotnet/aspire/fundamentals/integrations-overview#client-integrations), but not to triggers and bindings. For these integrations, you should call `WithEnvironment()` to pass the connection information for the trigger or binding to resolve. The following example shows how to set the environment variable "MyBindingConnection" for a resource that exposes a connection string expression:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection", otherIntegration.Resource.ConnectionStringExpression);
```

You can configure both `WithReference()` and `WithEnvironment()` if you want a connection to be used both by Aspire client integrations and the triggers and bindings system.

For some resources, the structure of a connection might be different between when you run it locally and when you publish it to Azure. In the previous example, `otherIntegration` could be a resource that runs as an emulator, so `ConnectionStringExpression` would return an emulator connection string. However, when the resource is published, Aspire might set up an identity-based connection, and `ConnectionStringExpression` would return the service's URI. In this case, to set up [identity based connections for Azure Functions](./functions-reference.md#configure-an-identity-based-connection), you might need to provide a different environment variable name. The following example uses `builder.ExecutionContext.IsPublishMode` to conditionally add the necessary suffix:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection" + (builder.ExecutionContext.IsPublishMode ? "__serviceUri" : ""), otherIntegration.Resource.ConnectionStringExpression);
```

Consult each binding's [reference pages](./functions-triggers-bindings.md#supported-bindings) for details on the connection formats it supports and the permissions those formats require.

## Hosting the application

By default, when you publish an Azure Functions project to Azure, it is deployed to Azure Container Apps.

### Azure Container Apps

During the preview period, the container app resources do not support event-driven scaling. Azure Functions support is not available for apps deployed in this mode. If you need to open a support ticket, you should select the Azure Container Apps resource type.

## Considerations and best practices

Consider the following points when evaluating Azure Functions with .NET Aspire:

- Support for Azure Functions with .NET Aspire is currently in preview.

- During the preview period, when you publish the Aspire solution to Azure, Functions projects are deployed as Azure Container Apps resources without event-driven scaling. Azure Functions support is not available for apps deployed in this mode. See [Hosting in Azure](#hosting-the-application) for details.

- Trigger and binding configuration through Aspire is currently limited to specific integrations. See [Connection configuration with Aspire](#connection-configuration-with-aspire) for details.

- Your `Program.cs` should use the `IHostApplicationBuilder` version of [host instance startup](./dotnet-isolated-process-guide.md#start-up-and-configuration). The `IHostApplicationBuilder` allows you to call `builder.AddServiceDefaults()` to add [.NET Aspire service defaults](/dotnet/aspire/fundamentals/service-defaults) to your Functions project.

- Aspire uses OpenTelemetry for monitoring. You can configure Aspire to export telemetry to Azure Monitor through the service defaults project. In many other Azure Functions contexts, you might include direct integration with Application Insights by registering the telemetry worker service. Doing so is not recommended in Aspire. It can also lead to runtime errors with version 2.22.0 of `Microsoft.ApplicationInsights.WorkerService`, though this is addressed in version 2.23.0. You should remove any direct Application Insights integrations from your Functions project when using Aspire.

- For Functions projects enlisted into an Aspire orchestration, most of the application configuration should come from the Aspire app host project. You should typically avoid setting things in `local.settings.json`, other than the `FUNCTIONS_WORKER_RUNTIME` setting. If you set the same environment variable in `local.settings.json` and Aspire, the system uses the Aspire version.

- Do not configure the Storage emulator for any connections in `local.settings.json`. Many Functions starter templates include the emulator as a default for `AzureWebJobsStorage`. However, emulator configuration can prompt some developer tooling to start a version of the emulator that can conflict with the version that Aspire uses.

[aspire-doc]: /dotnet/aspire/serverless/functions

[host-storage-identity]: ./functions-reference.md#connecting-to-host-storage-with-an-identity

[Microsoft.Azure.Functions.Worker]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/
[Microsoft.Azure.Functions.Worker.Sdk]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/
[Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore/

[Aspire.Hosting.Azure.Functions]: https://www.nuget.org/packages/Aspire.Hosting.Azure.Functions

[Storage Account Contributor]: ../role-based-access-control/built-in-roles.md#storage-account-contributor
[Storage Blob Data Owner]: ../role-based-access-control/built-in-roles.md#storage-blob-data-owner
[Storage Blob Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-blob-data-contributor
[Storage Queue Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-queue-data-contributor
[Storage Table Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-table-data-contributor
[Azure Event Hubs Data Owner]: ../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner
[Azure Service Bus Data Owner]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner
