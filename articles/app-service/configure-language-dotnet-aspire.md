---
title: Configure Aspire apps
description: Learn how to configure Aspire apps deployed to Azure App Service, including App Service plan settings, Application Insights, dashboard, and health probes.
ms.devlang: csharp
ms.topic: how-to
ms.date: 01/31/2026
author: cephalin
ms.author: cephalin
#customer intent: As a .NET developer, I want to configure my Aspire app deployment to Azure App Service so that I can customize the hosting infrastructure and app behavior.
ms.service: azure-app-service
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - devx-track-extended-azdevcli
---

# Configure an Aspire app for Azure App Service

This article describes how to configure [Aspire](/dotnet/aspire/get-started/aspire-overview) apps deployed to [Azure App Service](overview.md). Aspire provides a streamlined, opinionated way to build observable, production-ready cloud-native applications, and App Service integration allows you to customize the underlying Azure infrastructure through code.

If you haven't deployed an Aspire app to App Service yet, see the [quickstart guide](quickstart-dotnet-aspire.md) first.

## Prerequisites

- An existing Aspire app with the Azure App Service hosting integration. See [Quickstart: Deploy an Aspire app to Azure App Service](quickstart-dotnet-aspire.md).
- The [Aspire.Hosting.Azure.AppService](https://www.nuget.org/packages/Aspire.Hosting.Azure.AppService) package added to your AppHost project.

## Understand what gets provisioned

When you call `AddAzureAppServiceEnvironment`, Aspire provisions the following Azure resources by default:

| Resource | Description |
|----------|-------------|
| **App Service Plan** | A Premium P0V3 Linux-based hosting plan |
| **Azure Container Registry** | A Basic SKU registry for storing container images |
| **User-assigned Managed Identity** | For secure access between App Service and Container Registry |
| **Role Assignments** | ACR Pull role assigned to the managed identity |

These resources provide the infrastructure needed to deploy containerized Aspire apps to Azure App Service.

## Connect to an existing App Service plan

If you have an existing Azure App Service plan, you can connect to it instead of provisioning a new one. Use the `AsExisting` method to reference existing resources:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var existingAppServicePlanName = builder.AddParameter("existingAppServicePlanName");
var existingResourceGroup = builder.AddParameter("existingResourceGroup");

var appServiceEnv = builder.AddAzureAppServiceEnvironment("app-service-env")
    .AsExisting(existingAppServicePlanName, existingResourceGroup);

builder.AddProject<Projects.WebApi>("api")
    .PublishAsAzureAppServiceWebsite((infra, website) =>
    {
        // Optional: customize the Azure App Service website here
    });

builder.Build().Run();
```

This approach is useful when you want to:

- Share an App Service plan across multiple applications
- Use an App Service plan that was provisioned outside of Aspire
- Connect to resources in a different resource group

## Publish projects as App Service websites

Use the `PublishAsAzureAppServiceWebsite` method to deploy compute resources as Azure App Service websites:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var appServiceEnv = builder.AddAzureAppServiceEnvironment("app-service-env");

builder.AddProject<Projects.WebApi>("api")
    .PublishAsAzureAppServiceWebsite((infra, website) =>
    {
        // Optional: customize the Azure App Service website here
    });

builder.Build().Run();
```

During local development (when running with F5 or `dotnet run`), the project runs locally. When you publish your app with `azd up`, the project is deployed as an Azure App Service website within the provisioned environment.

## Configure App Service plan SKU and tier

You can customize the App Service plan SKU, tier, and capacity by using the `ConfigureInfrastructure` method. This approach lets you access and modify the underlying Azure resources that Aspire provisions.

In your *AppHost.cs* file, configure the App Service environment with custom plan settings:

```csharp
using Azure.Provisioning.AppService;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureAppServiceEnvironment("app-service-env")
    .ConfigureInfrastructure((infra) =>
    {
        var plan = infra.GetProvisionableResources().OfType<AppServicePlan>().Single();
        plan.Sku = new AppServiceSkuDescription
        {
            Name = "P1V3",
            Tier = "Premium"
        };
    });

builder.Build().Run();
```

The `ConfigureInfrastructure` callback gives you direct access to the Azure provisioning resources. In this example:

- `GetProvisionableResources()` returns all Azure resources being provisioned.
- `OfType<AppServicePlan>()` filters to get the App Service plan.
- You can then modify properties like `Sku.Name`, `Sku.Tier`, and `Sku.Capacity` (number of instances).

## Configure the Aspire Dashboard

The Aspire Dashboard is included by default when deploying to Azure App Service, giving you visibility into your deployed applications:

```csharp
builder.AddAzureAppServiceEnvironment("app-service-env");
// Dashboard is included by default at https://[prefix]-aspiredashboard-[unique string].azurewebsites.net
```

The deployed dashboard provides the same experience as local development: view logs, traces, metrics, and application topology for your production environment.

To disable the dashboard:

```csharp
builder.AddAzureAppServiceEnvironment("app-service-env")
    .WithDashboard(enable: false);
```

## Configure Azure Application Insights

Enable Azure Application Insights for comprehensive monitoring and telemetry:

```csharp
builder.AddAzureAppServiceEnvironment("app-service-env")
    .WithAzureApplicationInsights();
```

When enabled, Aspire automatically:

- Creates a Log Analytics workspace.
- Creates an Application Insights resource.
- Configures all App Service web apps with the connection string.
- Injects `APPLICATIONINSIGHTS_CONNECTION_STRING` into your applications.

You can also reference an existing Application Insights resource:

```csharp
var insights = builder.AddAzureApplicationInsights("insights");

builder.AddAzureAppServiceEnvironment("app-service-env")
    .WithAzureApplicationInsights(insights);
```

## Configure app settings

You can add custom app settings to your App Service apps by using the `PublishAsAzureAppServiceWebsite` method with infrastructure configuration.

```csharp
builder.AddProject<Projects.aspire_starter_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService)
    .PublishAsAzureAppServiceWebsite((infra, website) =>
    {
        website.SiteConfig.AppSettings.Add(new AppServiceNameValuePair
        {
            Name = "WEBSITE_LOAD_CERTIFICATES",
            Value = "*"
        });
        website.SiteConfig.AppSettings.Add(new AppServiceNameValuePair
        {
            Name = "MyCustomSetting",
            Value = "MyCustomValue"
        });
    });
```

You can add any App Service app settings through the `SiteConfig.AppSettings` collection.

## Add tags to resources

Tags help you organize and manage your Azure resources. You can add tags to both websites and the App Service plan.

Add tags to a website:

```csharp
builder.AddProject<Projects.aspire_starter_Web>("webfrontend")
    .PublishAsAzureAppServiceWebsite((infra, website) =>
    {
        website.Tags.Add("Environment", "Production");
        website.Tags.Add("Team", "Engineering");
    });
```

Add tags to the App Service plan:

```csharp
builder.AddAzureAppServiceEnvironment("app-service-env")
    .ConfigureInfrastructure(infra =>
    {
        var plan = infra.GetProvisionableResources().OfType<AppServicePlan>().Single();
        plan.Tags.Add("Environment", "Production");
        plan.Tags.Add("CostCenter", "Engineering");
    });
```

## Configure health probes

Health probes allow Azure App Service to monitor your application's health and make routing decisions. You can configure different probe types using the `WithHttpProbe` method.

```csharp
#pragma warning disable ASPIREPROBES001
builder.AddProject<Projects.aspire_starter_Web>("webfrontend")
    .WithHttpProbe(ProbeType.Liveness, "/healthz")
    // ... other configuration
#pragma warning restore ASPIREPROBES001
```

> [!NOTE]
> Using `WithHttpProbe` may require suppressing the `ASPIREPROBES001` diagnostic warning, as this feature is in preview.

Make sure your application exposes the health check endpoints. For ASP.NET Core apps, you can use the built-in health checks middleware:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();

var app = builder.Build();

app.MapHealthChecks("/healthz");

app.Run();
```

## Configure external endpoints

When deploying Aspire apps to App Service, service-to-service communication requires external HTTP endpoints. Unlike Container Apps, App Service currently doesn't manage traffic between apps through internal endpoints.

```csharp
var apiService = builder.AddProject<Projects.aspire_starter_ApiService>("apiservice")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health");

builder.AddProject<Projects.aspire_starter_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService);
```

The `WithExternalHttpEndpoints()` method configures the project to be accessible via public HTTP endpoints. This is required for:

- Backend services that other services in your Aspire app need to call
- Frontend applications that users access directly

## Related content

- [Quickstart: Deploy an Aspire app to Azure App Service](quickstart-dotnet-aspire.md)
- [Aspire documentation](/dotnet/aspire/)
- [Azure App Service integration for Aspire](https://www.nuget.org/packages/Aspire.Hosting.Azure.AppService)
- [Configure an ASP.NET Core app for Azure App Service](configure-language-dotnetcore.md)
