---
title: Guide for Using Azure Functions with .NET Aspire
description: Learn how to use Azure Functions with .NET Aspire, which simplifies authoring of distributed applications in the cloud.
ms.service: azure-functions
ms.topic: conceptual
ms.date: 04/21/2025
---

# Azure Functions with .NET Aspire (preview)

[.NET Aspire](/dotnet/aspire/get-started/aspire-overview) is an opinionated stack that simplifies development of distributed applications in the cloud. The integration of .NET Aspire with Azure Functions enables you to develop, debug, and orchestrate an Azure Functions .NET project as part of the .NET Aspire app host.

> [!IMPORTANT]
> The integration of .NET Aspire with Azure Functions is currently in preview and is subject to change.

## Prerequisites

Set up your development environment for using Azure Functions with .NET Aspire:

- Install the [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) and [.NET Aspire 9.0 or later](/dotnet/aspire/fundamentals/setup-tooling). Although the .NET 9 SDK is required, .NET Aspire 9.0 supports the .NET 8 and .NET 9 frameworks.
- If you use Visual Studio, update to version 17.12 or later. You must also have the latest version of the Azure Functions tools for Visual Studio. To check for updates:
  1. Go to **Tools** > **Options**.
  1. Under **Projects and Solutions**, select **Azure Functions**.
  1. Select **Check for updates** and install updates as prompted.

## Solution structure

A solution that uses Azure Functions and .NET Aspire has multiple projects, including an [app host project](/dotnet/aspire/fundamentals/app-host-overview) and one or more Functions projects.

The app host project is the entry point for your application. It orchestrates the setup of the components of your application, including the Functions project.

The solution typically also includes a *service defaults* project. This project provides a set of default services and configurations to be used across projects in your application.

### App host project

To successfully configure the integration, make sure that the app host project meets the following requirements:

- The app host project must reference [Aspire.Hosting.Azure.Functions]. This package defines the necessary logic for the integration.
- The app host project needs to have a project reference for each Functions project that you want to include in the orchestration.
- In the app host's `Program.cs` file, you must include the project by calling `AddAzureFunctionsProject<TProject>()` on your `IDistributedApplicationBuilder` instance. You use this method instead of using the `AddProject<TProject>()` method that you use for other project types in .NET Aspire. If you use `AddProject<TProject>()`, the Functions project can't start properly.

The following example shows a minimal `Program.cs` file for an app host project:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject");

builder.Build().Run();
```

### Azure Functions project

To successfully configure the integration, make sure that the Azure Functions project meets the following requirements:

- The Functions project must reference the [2.x versions](./dotnet-isolated-process-guide.md#version-2x) of [Microsoft.Azure.Functions.Worker] and [Microsoft.Azure.Functions.Worker.Sdk]. You must also update any [Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore] references to the 2.x version.
- Your `Program.cs` file must use the `IHostApplicationBuilder` version of the [host instance startup](./dotnet-isolated-process-guide.md#start-up-and-configuration). This requirement means that you must use `FunctionsApplication.CreateBuilder(args)`.
- If your solution includes a service defaults project, ensure that your Functions project is configured to use it:

  - The Functions project should include a project reference to the service defaults project.
  - Before you build `IHostApplicationBuilder` in `Program.cs`, include a call to `builder.AddServiceDefaults()`.

The following example shows a minimal `Program.cs` file for a Functions project used in .NET Aspire:

```csharp
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.ConfigureFunctionsWebApplication();

builder.Build().Run();
```

This example doesn't include the default Application Insights configuration that appears in many other `Program.cs` examples and in the Azure Functions templates. Instead, you configure OpenTelemetry integration in .NET Aspire by calling the `builder.AddServiceDefaults` method.

To get the most out of the integration, consider the following guidelines:

- Don't include any direct Application Insights integrations in the Functions project. Monitoring in .NET Aspire is instead handled through its OpenTelemetry support. You can configure .NET Aspire to export data to Azure Monitor through the service defaults project.
- Don't define custom app settings in the `local.settings.json`  file for the Functions project. The only setting that should be in `local.settings.json` is `"FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"`. Set all other app configurations through the app host project.

## <a name = "connection-configuration-with-aspire"></a>Connection configuration with .NET Aspire

The app host project defines resources and helps you create connections between them by using code. This section shows how to configure and customize connections that your Azure Functions project uses.

.NET Aspire includes default connection permissions that can help you get started. However, these permissions might not be appropriate or sufficient for your application.

For scenarios that use Azure role-based access control (RBAC), you can customize permissions by calling the `WithRoleAssignments()` method on the project resource. When you call `WithRoleAssignments()`, all default role assignments are removed, and you must explicitly define the full set role assignments that you want. If you host your application on Azure Container Apps, using `WithRoleAssignments()` also requires that you call `AddAzureContainerAppEnvironment()` on `DistributedApplicationBuilder`.

### Azure Functions host storage

Azure Functions requires a [host storage connection (`AzureWebJobsStorage`)][host-storage-identity] for several of its core behaviors. When you call `AddAzureFunctionsProject<TProject>()` in your app host project, an `AzureWebJobsStorage` connection is created by default and provided to the Functions project. This default connection uses the Azure Storage emulator for local development runs and automatically provisions a storage account when it's deployed. For more control, you can replace this connection by calling `.WithHostStorage()` on the Functions project resource.

The default permissions that .NET Aspire sets for the host storage connection depends on whether you call `WithHostStorage()` or not. Adding `WithHostStorage()` removes a [Storage Account Contributor] assignment. The following table lists the default permissions that .NET Aspire sets for the host storage connection:

| Host storage connection | Default roles                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------------------|
| No call to `WithHostStorage()`  | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor],<br/>[Storage Account Contributor] |
| Calling `WithHostStorage()` | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |

The following example shows a minimal `Program.cs` file for an app host project that replaces the host storage and specifies a role assignment:

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
> [Storage Blob Data Owner] is the role that we recommend for the [basic needs of the host storage connection][host-storage-identity]. Your app might encounter problems if the connection to the blob service has only the .NET Aspire default of [Storage Blob Data Contributor].
>
> For production scenarios, include calls to both `WithHostStorage()` and `WithRoleAssignments()`. You can then set this role explicitly, along with any others that you need.

### Trigger and binding connections

Your triggers and bindings reference connections by name. The following .NET Aspire integrations provide these connections through a call to `WithReference()` on the project resource:

| .NET Aspire integration                                                          | Default roles                                                                                             |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [Azure Blob Storage](/dotnet/aspire/storage/azure-storage-blobs-integration)       | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Queue Storage](/dotnet/aspire/storage/azure-storage-queues-integration)     | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Event Hubs](/dotnet/aspire/messaging/azure-event-hubs-integration)   | [Azure Event Hubs Data Owner]                                                                               |
| [Azure Service Bus](/dotnet/aspire/messaging/azure-service-bus-integration) | [Azure Service Bus Data Owner]                                                                              |

The following example shows a minimal `Program.cs` file for an app host project that configures a queue trigger. In this example, the corresponding queue trigger has its `Connection` property set to `MyQueueTriggerConnection`, so the call to `WithReference()` specifies the name.

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var myAppStorage = builder.AddAzureStorage("myAppStorage").RunAsEmulator();
var queues = myAppStorage.AddQueues("queues");

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithReference(queues, "MyQueueTriggerConnection");

builder.Build().Run();
```

For other integrations, calls to `WithReference` set the configuration in a different way. They make the configuration available to [.NET Aspire client integrations](/dotnet/aspire/fundamentals/integrations-overview#client-integrations), but not to triggers and bindings. For these integrations, call `WithEnvironment()` to pass the connection information for the trigger or binding to resolve.

The following example shows how to set the environment variable `MyBindingConnection` for a resource that exposes a connection string expression:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection", otherIntegration.Resource.ConnectionStringExpression);
```

If you want both .NET Aspire client integrations and the system of triggers and bindings to use a connection, you can configure both `WithReference()` and `WithEnvironment()`.

For some resources, the structure of a connection might be different between when you run it locally and when you publish it to Azure. In the previous example, `otherIntegration` could be a resource that runs as an emulator, so `ConnectionStringExpression` would return an emulator connection string. However, when the resource is published, .NET Aspire might set up an identity-based connection, and `ConnectionStringExpression` would return the service's URI. In this case, to set up [identity-based connections for Azure Functions](./functions-reference.md#configure-an-identity-based-connection), you might need to provide a different environment variable name.

The following example uses `builder.ExecutionContext.IsPublishMode` to conditionally add the necessary suffix:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection" + (builder.ExecutionContext.IsPublishMode ? "__serviceUri" : ""), otherIntegration.Resource.ConnectionStringExpression);
```

For details on the connection formats that each binding supports, and the permissions that those formats require, consult the binding's [reference pages](./functions-triggers-bindings.md#supported-bindings).

## Hosting the application

By default, when you publish an Azure Functions project to Azure, it's deployed to Azure Container Apps.

During the preview period, the container app resources don't support event-driven scaling. Azure Functions support is not available for apps deployed in this mode. If you need to open a support ticket, select the Azure Container Apps resource type.

## Considerations and best practices

Consider the following points when you're evaluating the integration of Azure Functions with .NET Aspire:

- Support for the integration is currently in preview.

- Trigger and binding configuration through .NET Aspire is currently limited to specific integrations. For details, see [Connection configuration with .NET Aspire](#connection-configuration-with-net-aspire) in this article.

- Your `Program.cs` file should use the `IHostApplicationBuilder` version of [host instance startup](./dotnet-isolated-process-guide.md#start-up-and-configuration). `IHostApplicationBuilder` allows you to call `builder.AddServiceDefaults()` to add [.NET Aspire service defaults](/dotnet/aspire/fundamentals/service-defaults) to your Functions project.

- .NET Aspire uses OpenTelemetry for monitoring. You can configure .NET Aspire to export data to Azure Monitor through the service defaults project.

  In many other Azure Functions contexts, you might include direct integration with Application Insights by registering the worker service. We don't recommend this kind of integration in .NET Aspire. It can lead to runtime errors with version 2.22.0 of `Microsoft.ApplicationInsights.WorkerService`, though version 2.23.0 addresses this problem. When you're using .NET Aspire, remove any direct Application Insights integrations from your Functions project.

- For Functions projects enlisted into a .NET Aspire orchestration, most of the application configuration should come from the .NET Aspire app host project. Avoid setting things in `local.settings.json`, other than the `FUNCTIONS_WORKER_RUNTIME` setting. If you set the same environment variable in `local.settings.json` and .NET Aspire, the system uses the .NET Aspire version.

- Don't configure the Azure Storage emulator for any connections in `local.settings.json`. Many Functions starter templates include the emulator as a default for `AzureWebJobsStorage`. However, emulator configuration can prompt some developer tooling to start a version of the emulator that can conflict with the version that .NET Aspire uses.

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
