---
title: Guide for Using Azure Functions with Aspire
description: Learn how to use Azure Functions with Aspire, which simplifies authoring of distributed applications in the cloud.
ms.service: azure-functions
ms.topic: conceptual
ms.date: 10/31/2025
---

# Azure Functions with Aspire

[Aspire](/dotnet/aspire/get-started/aspire-overview) is an opinionated stack that simplifies development of distributed applications in the cloud. The integration of Aspire with Azure Functions enables you to develop, debug, and orchestrate an Azure Functions .NET project as part of the Aspire app host.

## Prerequisites

Set up your development environment for using Azure Functions with Aspire:

- [Install the Aspire Prerequisites](/dotnet/aspire/fundamentals/setup-tooling#install-aspire-prerequisites).
    - Full support for the Azure Functions integration requires Aspire 13.1 or later. Aspire 13.0 also includes a preview version of `Aspire.Hosting.Azure.Functions` which acts as a release candidate with go-live support.
- Install the [Azure Functions Core Tools](./functions-run-local.md).

If you use Visual Studio, update to version 17.12 or later. You must also have the latest version of the Azure Functions tools for Visual Studio. To check for updates:
  1. Go to **Tools** > **Options**.
  1. Under **Projects and Solutions**, select **Azure Functions**.
  1. Select **Check for updates** and install updates as prompted.

## Solution structure

A solution that uses Azure Functions and Aspire has multiple projects, including an [app host project](/dotnet/aspire/fundamentals/app-host-overview) and one or more Functions projects.

The app host project is the entry point for your application. It orchestrates the setup of the components of your application, including the Functions project.

The solution typically also includes a *service defaults* project. This project provides a set of default services and configurations to be used across projects in your application.

### App host project

To successfully configure the integration, make sure that the app host project meets the following requirements:

- The app host project must reference [Aspire.Hosting.Azure.Functions]. This package defines the necessary logic for the integration.
- The app host project needs to have a project reference for each Functions project that you want to include in the orchestration.
- In the app host's `AppHost.cs` file, you must include the project by calling `AddAzureFunctionsProject<TProject>()` on your `IDistributedApplicationBuilder` instance. You use this method instead of using the `AddProject<TProject>()` method that you use for other project types in Aspire. If you use `AddProject<TProject>()`, the Functions project can't start properly.

The following example shows a minimal `AppHost.cs` file for an app host project:

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

The following example shows a minimal `Program.cs` file for a Functions project used in Aspire:

```csharp
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.ConfigureFunctionsWebApplication();

builder.Build().Run();
```

This example doesn't include the default Application Insights configuration that appears in many other `Program.cs` examples and in the Azure Functions templates. Instead, you configure OpenTelemetry integration in Aspire by calling the `builder.AddServiceDefaults` method.

To get the most out of the integration, consider the following guidelines:

- Don't include any direct Application Insights integrations in the Functions project. Monitoring in Aspire is instead handled through its OpenTelemetry support. You can configure Aspire to export data to Azure Monitor through the service defaults project.
- Don't define custom app settings in the `local.settings.json`  file for the Functions project. The only setting that should be in `local.settings.json` is `"FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"`. Set all other app configurations through the app host project.

## Connection configuration with Aspire

The app host project defines resources and helps you create connections between them by using code. This section shows how to configure and customize connections that your Azure Functions project uses.

Aspire includes default connection permissions that can help you get started. However, these permissions might not be appropriate or sufficient for your application.

For scenarios that use Azure role-based access control (RBAC), you can customize permissions by calling the `WithRoleAssignments()` method on the project resource. When you call `WithRoleAssignments()`, all default role assignments are removed, and you must explicitly define the full set role assignments that you want. If you host your application on Azure Container Apps, using `WithRoleAssignments()` also requires that you call `AddAzureContainerAppEnvironment()` on `DistributedApplicationBuilder`.

### Azure Functions host storage

Azure Functions requires a [host storage connection (`AzureWebJobsStorage`)][host-storage-identity] for several of its core behaviors. When you call `AddAzureFunctionsProject<TProject>()` in your app host project, an `AzureWebJobsStorage` connection is created by default and provided to the Functions project. This default connection uses the Azure Storage emulator for local development runs and automatically provisions a storage account when it's deployed. For more control, you can replace this connection by calling `.WithHostStorage()` on the Functions project resource.

The default permissions that Aspire sets for the host storage connection depends on whether you call `WithHostStorage()` or not. Adding `WithHostStorage()` removes a [Storage Account Contributor] assignment. The following table lists the default permissions that Aspire sets for the host storage connection:

| Host storage connection | Default roles                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------------------|
| No call to `WithHostStorage()`  | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor],<br/>[Storage Account Contributor] |
| Calling `WithHostStorage()` | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |

The following example shows a minimal `AppHost.cs` file for an app host project that replaces the host storage and specifies a role assignment:

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
> [Storage Blob Data Owner] is the role that we recommend for the [basic needs of the host storage connection][host-storage-identity]. Your app might encounter problems if the connection to the blob service has only the Aspire default of [Storage Blob Data Contributor].
>
> For production scenarios, include calls to both `WithHostStorage()` and `WithRoleAssignments()`. You can then set this role explicitly, along with any others that you need.

### Trigger and binding connections

Your triggers and bindings reference connections by name. The following Aspire integrations provide these connections through a call to `WithReference()` on the project resource:

| Aspire integration                                                          | Default roles                                                                                             |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [Azure Blob Storage](/dotnet/aspire/storage/azure-storage-blobs-integration)       | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Queue Storage](/dotnet/aspire/storage/azure-storage-queues-integration)     | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Event Hubs](/dotnet/aspire/messaging/azure-event-hubs-integration)   | [Azure Event Hubs Data Owner]                                                                               |
| [Azure Service Bus](/dotnet/aspire/messaging/azure-service-bus-integration) | [Azure Service Bus Data Owner]                                                                              |

The following example shows a minimal `AppHost.cs` file for an app host project that configures a queue trigger. In this example, the corresponding queue trigger has its `Connection` property set to `MyQueueTriggerConnection`, so the call to `WithReference()` specifies the name.

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var myAppStorage = builder.AddAzureStorage("myAppStorage").RunAsEmulator();
var queues = myAppStorage.AddQueues("queues");

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithReference(queues, "MyQueueTriggerConnection");

builder.Build().Run();
```

For other integrations, calls to `WithReference` set the configuration in a different way. They make the configuration available to [Aspire client integrations](/dotnet/aspire/fundamentals/integrations-overview#client-integrations), but not to triggers and bindings. For these integrations, call `WithEnvironment()` to pass the connection information for the trigger or binding to resolve.

The following example shows how to set the environment variable `MyBindingConnection` for a resource that exposes a connection string expression:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection", otherIntegration.Resource.ConnectionStringExpression);
```

If you want both Aspire client integrations and the system of triggers and bindings to use a connection, you can configure both `WithReference()` and `WithEnvironment()`.

For some resources, the structure of a connection might be different between when you run it locally and when you publish it to Azure. In the previous example, `otherIntegration` could be a resource that runs as an emulator, so `ConnectionStringExpression` would return an emulator connection string. However, when the resource is published, Aspire might set up an identity-based connection, and `ConnectionStringExpression` would return the service's URI. In this case, to set up [identity-based connections for Azure Functions](./functions-reference.md#configure-an-identity-based-connection), you might need to provide a different environment variable name.

The following example uses `builder.ExecutionContext.IsPublishMode` to conditionally add the necessary suffix:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection" + (builder.ExecutionContext.IsPublishMode ? "__serviceUri" : ""), otherIntegration.Resource.ConnectionStringExpression);
```

For details on the connection formats that each binding supports, and the permissions that those formats require, consult the binding's [reference pages](./functions-triggers-bindings.md#supported-bindings).

## Hosting the application

Aspire supports two different ways to host your Functions project in Azure:

- [Publish as a container app (default)](#publish-as-a-container-app)
- [Publish as a function app](#publish-as-a-function-app) using preview App Service integration

In both cases, your project is deployed as a container. Aspire takes care of building the container image for you and pushing it to Azure Container Registry.

### Publish as a container app

By default, when you publish an Aspire project to Azure, it's deployed to Azure Container Apps. The system sets up scaling rules for your Functions project using [KEDA](https://keda.sh/). When using Azure Container Apps, additional setup is needed for function keys. See [Access keys on Azure Container Apps](#access-keys-on-azure-container-apps) for more information.

#### Access keys on Azure Container Apps

Several Azure Functions scenarios use access keys to provide a basic mitigation against unwanted access. For example, HTTP trigger functions by default require an access key to be invoked, though this requirement can be disabled using the [`AuthLevel` property](./functions-bindings-http-webhook-trigger.md#attributes). See [Work with access keys in Azure Functions](./function-keys-how-to.md) for scenarios which may require a key.

When you deploy a Functions project using Aspire to Azure Container Apps, the system doesn't automatically create or manage Functions access keys. If you need to use access keys, you can manage them as part of your App Host setup. This section shows you how to create an extension method that you can call from your app host's `Program.cs` file to create and manage access keys. This approach uses Azure Key Vault to store the keys and mounts them into the container app as secrets.

> [!NOTE]
> The behavior here relies on the `ContainerApps` secret provider, which is only available starting with Functions host version `4.1044.0`. This version is not yet available in all regions, and until it is, when you publish your Aspire project, the base image used for the Functions project may not include the necessary changes.

These steps require Bicep version `0.38.3` or later. You can check your Bicep version by running `bicep --version` from a command prompt. If you have the Azure CLI installed, you can use `az bicep upgrade` to quickly update Bicep to the latest version.

Add the following NuGet packages to your app host project:
- [Aspire.Hosting.Azure.AppContainers](https://www.nuget.org/packages/Aspire.Hosting.Azure.AppContainers)
- [Aspire.Hosting.Azure.KeyVault](https://www.nuget.org/packages/Aspire.Hosting.Azure.KeyVault)

Create a new class in your app host project and include the following code:

```csharp
using Aspire.Hosting.Azure;
using Azure.Provisioning.AppContainers;

namespace Aspire.Hosting;

internal static class Extensions
{
    private record SecretMapping(string OriginalName, IAzureKeyVaultSecretReference Reference);

    public static IResourceBuilder<T> PublishWithContainerAppSecrets<T>(
        this IResourceBuilder<T> builder,
        IResourceBuilder<AzureKeyVaultResource>? keyVault = null,
        string[]? hostKeyNames = null,
        string[]? systemKeyExtensionNames = null)
        where T : AzureFunctionsProjectResource
    {
        if (!builder.ApplicationBuilder.ExecutionContext.IsPublishMode)
        {
            return builder;
        }

        keyVault ??= builder.ApplicationBuilder.AddAzureKeyVault("functions-keys");

        var hostKeysToAdd = (hostKeyNames ?? []).Append("default").Select(k => $"host-function-{k}");
        var systemKeysToAdd = systemKeyExtensionNames?.Select(k => $"host-systemKey-{k}_extension") ?? [];
        var secrets = hostKeysToAdd.Union(systemKeysToAdd)
            .Select(secretName => new SecretMapping(
                secretName,
                CreateSecretIfNotExists(builder.ApplicationBuilder, keyVault, secretName.Replace("_", "-"))
            )).ToList();

        return builder
            .WithReference(keyVault)
            .WithEnvironment("AzureWebJobsSecretStorageType", "ContainerApps")
            .PublishAsAzureContainerApp((infra, app) => ConfigureFunctionsContainerApp(infra, app, builder.Resource, secrets));
    }

    private static void ConfigureFunctionsContainerApp(
        AzureResourceInfrastructure infrastructure, 
        ContainerApp containerApp, 
        IResource resource, 
        List<SecretMapping> secrets)
    {
        const string volumeName = "functions-keys";
        const string mountPath = "/run/secrets/functions-keys";

        var appIdentityAnnotation = resource.Annotations.OfType<AppIdentityAnnotation>().Last();
        var containerAppIdentityId = appIdentityAnnotation.IdentityResource.Id.AsProvisioningParameter(infrastructure);

        var containerAppSecretsVolume = new ContainerAppVolume
        {
            Name = volumeName,
            StorageType = ContainerAppStorageType.Secret
        };

        foreach (var mapping in secrets)
        {
            var secret = mapping.Reference.AsKeyVaultSecret(infrastructure);

            containerApp.Configuration.Secrets.Add(new ContainerAppWritableSecret()
            {
                Name = mapping.Reference.SecretName.ToLowerInvariant(),
                KeyVaultUri = secret.Properties.SecretUri,
                Identity = containerAppIdentityId
            });

            containerAppSecretsVolume.Secrets.Add(new SecretVolumeItem
            {
                Path = mapping.OriginalName.Replace("-", "."),
                SecretRef = mapping.Reference.SecretName.ToLowerInvariant()
            });
        }

        containerApp.Template.Containers[0].Value!.VolumeMounts.Add(new ContainerAppVolumeMount
        {
            VolumeName = volumeName,
            MountPath = mountPath
        });
        containerApp.Template.Volumes.Add(containerAppSecretsVolume);
    }

    public static IAzureKeyVaultSecretReference CreateSecretIfNotExists(
        IDistributedApplicationBuilder builder,
        IResourceBuilder<AzureKeyVaultResource> keyVault,
        string secretName)
    {
        var secretParameter = ParameterResourceBuilderExtensions.CreateDefaultPasswordParameter(builder, $"param-{secretName}", special: false);
        builder.AddBicepTemplateString($"key-vault-key-{secretName}", """
                param location string = resourceGroup().location
                param keyVaultName string
                param secretName string
                @secure()
                param secretValue string    

                // Reference the existing Key Vault
                resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
                  name: keyVaultName
                }

                // Deploy the secret only if it does not already exist
                @onlyIfNotExists()
                resource newSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
                  parent: keyVault
                  name: secretName
                  properties: {
                      value: secretValue
                  }
                }
                """)
            .WithParameter("keyVaultName", keyVault.GetOutput("name"))
            .WithParameter("secretName", secretName)
            .WithParameter("secretValue", secretParameter);

        return keyVault.GetSecret(secretName);
    }
}
```

You can then use this method in your app host's `Program.cs` file:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
       .WithHostStorage(storage)
       .WithExternalHttpEndpoints()
       .PublishWithContainerAppSecrets(systemKeyExtensionNames: ["mcp"]);
```

This example uses a default key vault created by the extension method. It results in a default key and a system key for use with the [Model Context Protocol extension](./functions-bindings-mcp.md#connect-to-your-mcp-server).

To use these keys from clients, you need to retrieve them from the key vault.

### Publish as a function app

> [!NOTE]
> Publishing as a function app requires the Aspire Azure App Service integration, which is currently in preview.

You can configure Aspire to deploy to a function app using the [Aspire Azure App Service integration](/dotnet/aspire/azure/azure-app-service-integration). Because Aspire publishes the Functions project as a container, the hosting plan for your function app must support deploying containerized applications.

To publish your Aspire Functions project as a function app, follow these steps:

1. Add a reference to the [Aspire.Hosting.Azure.AppService] NuGet package in your app host project.
1. In the `AppHost.cs` file, call `AddAzureAppServiceEnvironment()` on your `IDistributedApplicationBuilder` instance to create an App Service plan. Note that despite the name, this does not provision an App Service Environment resource. 
1. On the Functions project resource, call `.WithExternalHttpEndpoints()`. This is required for deploying with the Aspire Azure App Service integration.
1. On the Functions project resource, call `.PublishAsAzureAppServiceWebsite((infra, app) => app.Kind = "functionapp,linux")` to publish that project to the plan.

> [!IMPORTANT]
> Make sure that you set the `app.Kind` property to `"functionapp,linux"`. This setting ensures the resource is created as a function app, which affects experiences for working with your application.

The following example shows a minimal `AppHost.cs` file for an app host project that publishes a Functions project as a function app:

```csharp
var builder = DistributedApplication.CreateBuilder(args);
builder.AddAzureAppServiceEnvironment("functions-env");
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithExternalHttpEndpoints()
    .PublishAsAzureAppServiceWebsite((infra, app) => app.Kind = "functionapp,linux");
```

This configuration creates a Premium V3 plan. When using a dedicated App Service plan SKU, scaling isn't event-based. Instead, scaling is managed through the App Service plan settings.

## Considerations and best practices

Consider the following points when you're evaluating the integration of Azure Functions with Aspire:

- Trigger and binding configuration through Aspire is currently limited to specific integrations. For details, see [Connection configuration with Aspire](#connection-configuration-with-aspire) in this article.

- Your function project's `Program.cs` file should use the `IHostApplicationBuilder` version of [host instance startup](./dotnet-isolated-process-guide.md#start-up-and-configuration). `IHostApplicationBuilder` allows you to call `builder.AddServiceDefaults()` to add [Aspire service defaults](/dotnet/aspire/fundamentals/service-defaults) to your Functions project.

- Aspire uses OpenTelemetry for monitoring. You can configure Aspire to export data to Azure Monitor through the service defaults project.

  In many other Azure Functions contexts, you might include direct integration with Application Insights by registering the worker service. We don't recommend this kind of integration in Aspire. It can lead to runtime errors with version 2.22.0 of `Microsoft.ApplicationInsights.WorkerService`, though version 2.23.0 addresses this problem. When you're using Aspire, remove any direct Application Insights integrations from your Functions project.

- For Functions projects enlisted into a Aspire orchestration, most of the application configuration should come from the Aspire app host project. Avoid setting things in `local.settings.json`, other than the `FUNCTIONS_WORKER_RUNTIME` setting. If you set the same environment variable in `local.settings.json` and Aspire, the system uses the Aspire version.

- Don't configure the Azure Storage emulator for any connections in `local.settings.json`. Many Functions starter templates include the emulator as a default for `AzureWebJobsStorage`. However, emulator configuration can prompt some developer tooling to start a version of the emulator that can conflict with the version that Aspire uses.

[host-storage-identity]: ./functions-reference.md#connecting-to-host-storage-with-an-identity

[Microsoft.Azure.Functions.Worker]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/
[Microsoft.Azure.Functions.Worker.Sdk]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/
[Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore/

[Aspire.Hosting.Azure.Functions]: https://www.nuget.org/packages/Aspire.Hosting.Azure.Functions
[Aspire.Hosting.Azure.AppService]: https://www.nuget.org/packages/Aspire.Hosting.Azure.AppService

[Storage Account Contributor]: ../role-based-access-control/built-in-roles.md#storage-account-contributor
[Storage Blob Data Owner]: ../role-based-access-control/built-in-roles.md#storage-blob-data-owner
[Storage Blob Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-blob-data-contributor
[Storage Queue Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-queue-data-contributor
[Storage Table Data Contributor]: ../role-based-access-control/built-in-roles.md#storage-table-data-contributor
[Azure Event Hubs Data Owner]: ../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner
[Azure Service Bus Data Owner]: ../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner
