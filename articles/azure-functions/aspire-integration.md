---
title: Guide for Using Azure Functions with Aspire
description: Learn how to use Azure Functions with Aspire, which simplifies authoring of distributed applications in the cloud.
ms.service: azure-functions
ms.topic: integration
ms.date: 09/04/2026
---

# Azure Functions with Aspire

[Aspire](https://aspire.dev/get-started/what-is-aspire/) is a toolchain for building, running, debugging, and deploying distributed applications. The Aspire Azure Functions integration enables you to develop, debug, and orchestrate an Azure Functions project as part of an Aspire AppHost. The .NET examples in this article use the isolated worker model.

## Prerequisites

Set up your development environment for using Azure Functions with Aspire:

- [Install the Aspire prerequisites](https://aspire.dev/get-started/prerequisites/), including the .NET SDK required by your AppHost.
- [Install the Aspire CLI](https://aspire.dev/get-started/install-cli/).
- Install the Aspire Azure Functions hosting integration from the AppHost directory:

  ```bash
  aspire add Aspire.Hosting.Azure.Functions
  ```

- Install the [Azure Functions Core Tools](./functions-run-local.md).

If you use Visual Studio, install the latest Visual Studio and Azure Functions tooling updates:
  1. Go to **Tools** > **Options**.
  1. Under **Projects and Solutions**, select **Azure Functions**.
  1. Select **Check for updates** and install updates as prompted.

For more information about the integration package and supported AppHost APIs, see [Set up Azure Functions in the AppHost](https://aspire.dev/integrations/cloud/azure/azure-functions/azure-functions-host/).

## Solution structure

A solution that uses Azure Functions and Aspire has multiple projects, including an [AppHost](https://aspire.dev/get-started/app-host/) and one or more Functions projects.

The AppHost is the entry point for your application. It orchestrates the setup of the components of your application, including the Functions project.

The solution typically also includes a *service defaults* project. This project provides a set of default services and configurations to be used across projects in your application.

### AppHost project

To successfully configure the integration, make sure that the AppHost project meets the following requirements:

- The AppHost must reference [Aspire.Hosting.Azure.Functions]. This package defines the integration.
- A C# AppHost can reference a Functions project and call `AddAzureFunctionsProject<TProject>()`, or call `AddAzureFunctionsProject(name, projectPath)` with the path to the project file. TypeScript AppHosts use the project-path form of `addAzureFunctionsProject`.
- Use `AddAzureFunctionsProject` instead of `AddProject`. A Functions project added with `AddProject` can't start properly.

The following example shows a minimal `AppHost.cs` file for a C# AppHost project:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject");

builder.Build().Run();
```

### Azure Functions project

To successfully configure the integration, make sure that the Azure Functions project meets the following requirements:

- Target .NET 8 or later, use the .NET 9 SDK or later, and use the [isolated worker model](./dotnet-isolated-process-guide.md).
- Reference [Microsoft.Azure.Functions.Worker], [Microsoft.Azure.Functions.Worker.Sdk], and, for HTTP triggers, [Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore].
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

This example doesn't include the default Application Insights configuration that appears in many other `Program.cs` examples and in the Azure Functions templates. Instead, you configure OpenTelemetry integration in Aspire by calling the `builder.AddServiceDefaults()` method.

To get the most out of the integration, consider the following guidelines:

- Don't include any direct Application Insights integrations in the Functions project. Monitoring in Aspire is instead handled through its OpenTelemetry support. You can configure Aspire to export data to Azure Monitor through the service defaults project.
- When Aspire runs the Functions project, prefer settings injected by the AppHost. You can keep equivalent settings in `local.settings.json` for running the project independently with `func start`; Aspire-injected environment variables override them.

## Connection configuration with Aspire

The AppHost defines resources and helps you create connections between them by using code. This section shows how to configure and customize connections that your Azure Functions project uses.

Aspire includes default connection permissions that can help you get started. However, these permissions might not be appropriate or sufficient for your application.

For scenarios that use Azure role-based access control (RBAC), you can customize permissions by calling the `WithRoleAssignments()` method on the project resource. When you call `WithRoleAssignments()`, all default role assignments are removed, and you must explicitly define the full set role assignments that you want. If you host your application on Azure Container Apps, using `WithRoleAssignments()` also requires that you call `AddAzureContainerAppEnvironment()` on `DistributedApplicationBuilder`.

### Azure Functions host storage

Azure Functions requires a [host storage connection (`AzureWebJobsStorage`)][host-storage-identity] for several of its core behaviors. When you call `AddAzureFunctionsProject<TProject>()` in your AppHost, an `AzureWebJobsStorage` connection is created by default and provided to the Functions project. This default connection uses the Azure Storage emulator for local development runs and automatically provisions a storage account when it's deployed. For more control, you can replace this connection by calling `.WithHostStorage()` on the Functions project resource.

The default permissions that Aspire sets for the host storage connection depend on whether you call `WithHostStorage()` or not. Adding `WithHostStorage()` removes a [Storage Account Contributor] assignment. The following table lists the default permissions that Aspire sets for the host storage connection:

| Host storage connection | Default roles                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------------------|
| No call to `WithHostStorage()`  | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor],<br/>[Storage Account Contributor] |
| Calling `WithHostStorage()` | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |

The following example shows a minimal `AppHost.cs` file that replaces the host storage and specifies a role assignment:

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
| [Azure Blob Storage](https://aspire.dev/integrations/cloud/azure/azure-storage-blobs/azure-storage-blobs-get-started/) | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Queue Storage](https://aspire.dev/integrations/cloud/azure/azure-storage-queues/azure-storage-queues-get-started/) | [Storage Blob Data Contributor],<br/>[Storage Queue Data Contributor],<br/>[Storage Table Data Contributor] |
| [Azure Event Hubs](https://aspire.dev/integrations/cloud/azure/azure-event-hubs/azure-event-hubs-get-started/) | [Azure Event Hubs Data Owner] |
| [Azure Service Bus](https://aspire.dev/integrations/cloud/azure/azure-service-bus/azure-service-bus-get-started/) | [Azure Service Bus Data Owner] |

The following example shows a minimal `AppHost.cs` file that configures a queue trigger. In this example, the corresponding queue trigger has its `Connection` property set to `MyQueueTriggerConnection`, so the call to `WithReference()` specifies the name.

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var myAppStorage = builder.AddAzureStorage("myAppStorage").RunAsEmulator();
var queues = myAppStorage.AddQueues("queues");

builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithReference(queues, "MyQueueTriggerConnection");

builder.Build().Run();
```

For other integrations, calls to `WithReference` set the configuration in a different way. They make the configuration available to [Aspire client integrations](https://aspire.dev/integrations/overview/#wiring-resources-to-consuming-projects-with-references), but not to triggers and bindings. For these integrations, call `WithEnvironment()` to pass the connection information for the trigger or binding to resolve.

The following example shows how to set the environment variable `MyBindingConnection` for a resource that exposes a connection string expression:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection", otherIntegration.Resource.ConnectionStringExpression);
```

If you want both Aspire client integrations and the system of triggers and bindings to use a connection, you can configure both `WithReference()` and `WithEnvironment()`.

For some resources, the structure of a connection might be different between when you run it locally and when you publish it to Azure. In the previous example, `otherIntegration` could be a resource that runs as an emulator, so `ConnectionStringExpression` would return an emulator connection string. However, when the resource is published, Aspire might set up an identity-based connection, and `ConnectionStringExpression` would return the service's URI. In this case, to set up [identity-based connections for Azure Functions](./manage-connections.md?pivots=functions-auth-identity&tabs=bindings#define-connections), you might need to provide a different environment variable name.

The following example uses `builder.ExecutionContext.IsPublishMode` to conditionally add the necessary suffix:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithEnvironment("MyBindingConnection" + (builder.ExecutionContext.IsPublishMode ? "__serviceUri" : ""), otherIntegration.Resource.ConnectionStringExpression);
```

For details on the connection formats that each binding supports, and the permissions that those formats require, consult the binding's [reference pages](./functions-triggers-bindings.md#supported-bindings).

For more information about how Functions code reads values injected by `WithReference`, see [Azure Functions runtime configuration](https://aspire.dev/integrations/cloud/azure/azure-functions/azure-functions-connect/).

## Hosting the application

Aspire supports Azure Container Apps deployment for Functions projects. You can also use the separate preview App Service integration to target a container-capable function app:

- [Deploy as a container app](#deploy-as-a-container-app)
- [Deploy as a function app](#deploy-as-a-function-app) using the preview App Service integration

In both cases, your project is deployed as a container. Aspire takes care of building the container image for you and pushing it to Azure Container Registry.

### Deploy as a container app

When your AppHost targets Azure Container Apps, Aspire sets up scaling rules for your Functions project using [KEDA](https://keda.sh/). When using Azure Container Apps, additional setup is needed for function keys. See [Access keys on Azure Container Apps](#access-keys-on-azure-container-apps) for more information.

Deploy the configured AppHost by running `aspire deploy`. For more information, see [Deploy to Azure Container Apps](https://aspire.dev/deployment/azure/container-apps/) and [`aspire deploy`](https://aspire.dev/reference/cli/commands/aspire-deploy/).

#### Access keys on Azure Container Apps

Several Azure Functions scenarios use access keys to provide a basic mitigation against unwanted access. For example, HTTP trigger functions by default require an access key to be invoked, though this requirement can be disabled using the [`AuthLevel` property](./functions-bindings-http-webhook-trigger.md#attributes). See [Work with access keys in Azure Functions](./function-keys-how-to.md) for scenarios which may require a key.

When you deploy a Functions project using Aspire to Azure Container Apps, the system doesn't automatically create or manage Functions access keys. If you need to use access keys, you can manage them as part of your AppHost setup. This section shows you how to create an extension method that you can call from your AppHost's `AppHost.cs` file to create and manage access keys. This approach uses Azure Key Vault to store the keys and mounts them into the container app as secrets.

> [!NOTE]
> The behavior here relies on the `ContainerApps` secret provider, which requires Functions host version `4.1044.0` or later.

These steps require Bicep version `0.38.3` or later. You can check your Bicep version by running `bicep --version` from a command prompt. If you have the Azure CLI installed, you can use `az bicep upgrade` to quickly update Bicep to the latest version.

Add the following NuGet packages to your AppHost project:
- [Aspire.Hosting.Azure.AppContainers](https://www.nuget.org/packages/Aspire.Hosting.Azure.AppContainers)
- [Aspire.Hosting.Azure.KeyVault](https://www.nuget.org/packages/Aspire.Hosting.Azure.KeyVault)

Create a new class in your AppHost project and include the following code:

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

You can then use this method in your AppHost's `AppHost.cs` file:

```csharp
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
       .WithHostStorage(storage)
       .WithExternalHttpEndpoints()
       .PublishWithContainerAppSecrets(systemKeyExtensionNames: ["mcp"]);
```

This example uses a default key vault created by the extension method. It results in a default key and a system key for use with the [Model Context Protocol extension](./functions-bindings-mcp.md#connect-to-your-mcp-server).

To use these keys from clients, you need to retrieve them from the key vault.

### Deploy as a function app

> [!NOTE]
> Deploying as a function app requires the Aspire Azure App Service integration, which is currently in preview.

You can configure Aspire to deploy to a function app using the [Aspire Azure App Service integration](https://aspire.dev/integrations/cloud/azure/azure-app-service/azure-app-service-host/). Because Aspire deploys the Functions project as a container, the hosting plan for your function app must support deploying containerized applications.

To deploy your Aspire Functions project as a function app, follow these steps:

1. From the AppHost directory, run `aspire add Aspire.Hosting.Azure.AppService` to add the [Aspire.Hosting.Azure.AppService] NuGet package.
1. In the `AppHost.cs` file, call `AddAzureAppServiceEnvironment()` on your `IDistributedApplicationBuilder` instance to create an App Service plan. Note that despite the name, this does not provision an App Service Environment resource. 
1. On the Functions project resource, call `.WithExternalHttpEndpoints()`. This is required for deploying with the Aspire Azure App Service integration.
1. On the Functions project resource, call `.PublishAsAzureAppServiceWebsite((infra, app) => app.Kind = "functionapp,linux")` to customize that project as a function app in the plan.

> [!IMPORTANT]
> Make sure that you set the `app.Kind` property to `"functionapp,linux"`. This setting ensures the resource is created as a function app, which affects experiences for working with your application.

The following example shows a minimal `AppHost.cs` file that deploys a Functions project as a function app:

```csharp
var builder = DistributedApplication.CreateBuilder(args);
builder.AddAzureAppServiceEnvironment("functions-env");
builder.AddAzureFunctionsProject<Projects.MyFunctionsProject>("MyFunctionsProject")
    .WithExternalHttpEndpoints()
    .PublishAsAzureAppServiceWebsite((infra, app) => app.Kind = "functionapp,linux");

builder.Build().Run();
```

This configuration creates a Premium V3 plan. When using a dedicated App Service plan SKU, scaling isn't event-based. Instead, scaling is managed through the App Service plan settings.

## Considerations and best practices

Consider the following points when you're evaluating the integration of Azure Functions with Aspire:

- Trigger and binding configuration through Aspire is currently limited to specific integrations. For details, see [Connection configuration with Aspire](#connection-configuration-with-aspire) in this article.

- Your function project's `Program.cs` file should use the `IHostApplicationBuilder` version of [host instance startup](./dotnet-isolated-process-guide.md#start-up-and-configuration). `IHostApplicationBuilder` allows you to call `builder.AddServiceDefaults()` to add [Aspire Service Defaults](https://aspire.dev/get-started/csharp-service-defaults/) to your Functions project.

- Aspire uses OpenTelemetry for monitoring. You can configure Aspire to export data to Azure Monitor through the service defaults project.

  In many other Azure Functions contexts, you might include direct integration with Application Insights by registering the worker service. Don't register a second, direct Application Insights pipeline when you're using Aspire Service Defaults.

- For Functions projects enlisted into an Aspire orchestration, most application configuration should come from the AppHost. You can use `local.settings.json` to run the Functions project independently with `func start`. When Aspire runs the project, Aspire-injected environment variables override values with the same names in `local.settings.json`.

- Avoid starting a second Azure Storage emulator for connections that the AppHost manages. Competing emulator instances can cause port and storage conflicts.

For more information, see [Azure Functions runtime configuration](https://aspire.dev/integrations/cloud/azure/azure-functions/azure-functions-connect/) and [Aspire telemetry](https://aspire.dev/fundamentals/telemetry/).

[host-storage-identity]: ./manage-connections.md?pivots=functions-auth-identity&tabs=host#define-connections

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
