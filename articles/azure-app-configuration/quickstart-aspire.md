---
title: Quickstart for Azure App Configuration with Aspire
description: Create an Aspire solution with Azure App Configuration to centralize storage and management of application settings.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 12/3/2025
zone_pivot_groups: appconfig-aspire
ms.author: zhiyuanliang
#Customer intent: As an Aspire developer, I want to learn the centralized configuration cloud-native solution for Aspire.
---

# Quickstart: Create an Aspire solution with Azure App Configuration

In this quickstart, you'll use Azure App Configuration to externalize storage and management of your app settings for an Aspire project. You will use Azure App Configuration Aspire integration libraries to provision an App Configuration resource and use App Configuration in each distributed app.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Set up the development environment](https://aspire.dev/get-started/prerequisites) for Aspire.
- [Create a new Aspire solution](https://aspire.dev/get-started/first-app/?lang=csharp) using the Aspire Starter template.
- An OCI compliant container runtime, such as [Docker Desktop](https://www.docker.com/products/docker-desktop).

## Test the app locally

The Aspire Starter template includes a frontend web app that communicates with a Minimal API project. The API project is used to provide fake weather data to the frontend. The frontend app is configured to use service discovery to connect to the API project. There is also an [`AppHost`](/dotnet/aspire/fundamentals/app-host-overview) project which orchestrates all distributed applications in the Aspire solution.

1. Run the `AppHost` project. You see the Aspire dashboard in your browser.

    :::image type="content" source="media/aspire/dashboard.png" alt-text="Screenshot of the Aspire dashboard with web frontend and API service resources." lightbox="media/aspire/dashboard.png":::

1. Click the URL of the web frontend. You see a page with a welcome message.

    :::image type="content" source="media/aspire/web-app.png" alt-text="Screenshot of a web app with a welcome message." lightbox="media/aspire/web-app.png":::

:::zone target="docs" pivot="azure"

## Add Azure App Configuration to the Aspire solution

1. Navigate into to the `AppHost` project's directory. Run the following command to add the [`Aspire.Hosting.Azure.AppConfiguration`](https://www.nuget.org/packages/Aspire.Hosting.Azure.AppConfiguration) Nuget package.

    ```dotnetcli
    dotnet add package Aspire.Hosting.Azure.AppConfiguration
    ```

1. Open the *AppHost.csproj* file to verify packages. You should see a package named `Aspire.Hosting.AppHost` being referenced. Ensure that the `Aspire.Hosting.AppHost` package version is at least as high as the version of `Aspire.Hosting.Azure.AppConfiguration` that was installed.

1. Open the *AppHost.cs* file and add the following code.

    ```csharp
    var builder = DistributedApplication.CreateBuilder(args);

    // Add an Azure App Configuration resource
    var appConfiguration = builder.AddAzureAppConfiguration("appconfiguration");
    ```

    > [!IMPORTANT]
    > When you call `AddAzureAppConfiguration`, you instruct the app to generate Azure resources dynamically during app startup. The app must configure the appropriate subscription and location. For more information, see [Local Azure provisioning](https://aspire.dev/integrations/cloud/azure/local-provisioning/#configuration).
    > If you are using the latest Aspire SDK, you can configure the subscription information through the Aspire dashboard.
    > :::image type="content" source="media/aspire/azure-subscription.png" alt-text="Screenshot of Aspire dashboard asking for Azure Subscription information." lightbox="media/aspire/azure-subscription.png":::

    > [!NOTE]
    > You must have either the **Owner** or **User Access Administrator** role assigned on the Azure subscription. These roles are required to create role assignments as part of the provisioning process.

    > [!TIP]
    > You can reference existing App Configuration resources by chaining a call `RunAsExisting()` on `builder.AddAzureAppConfiguration("appconfig")`. For more information, go to [Use existing Azure resources](https://aspire.dev/integrations/cloud/azure/overview/#use-existing-azure-resources).

1. Add the reference of App Configuration resource and configure the `webfrontend` project to wait for it.

    ```csharp
    builder.AddProject<Projects.AspireApp_Web>("webfrontend")
        .WithExternalHttpEndpoints()
        .WithHttpHealthCheck("/health")
        .WithReference(apiService)
        .WaitFor(apiService)
        .WithReference(appConfiguration) // reference the App Configuration resource
        .WaitFor(appConfiguration); // wait for the App Configuration resource to enter the Running state before starting the resource
    ```

1. Run the `AppHost` project. You see the Azure App Configuration resource is provisioning.

    :::image type="content" source="media/aspire/resource-provisioning.png" alt-text="Screenshot of Aspire dashboard provisioning Azure App Configuration resource." lightbox="media/aspire/resource-provisioning.png":::

1. Wait for a few minutes and you see the Azure App Configuration resource is provisioned and is running.

    :::image type="content" source="media/aspire/resource-provisioned.png" alt-text="Screenshot of Aspire dashboard with Azure App Configuration resource running." lightbox="media/aspire/resource-provisioned.png":::

1. Go to the Azure portal by clicking the deployment URL on the Aspire dashboard. You see the deployment is complete and you can go to your Azure App Configuration resource.

    :::image type="content" source="media/aspire/deployment-complete.png" alt-text="Screenshot of Azure portal showing the App Configuration deployment is complete." lightbox="media/aspire/deployment-complete.png":::

## Add a key-value

Add the following key-value to your App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                                 |
|----------------------------|---------------------------------------|
| *TestApp:Settings:Message* | *Hello from Azure App Configuration!* |

:::zone-end

:::zone target="docs" pivot="emulator"

## Add Azure App Configuration to the Aspire solution

1. Navigate into to the `AppHost` project's directory. Run the following command to add the [`Aspire.Hosting.Azure.AppConfiguration`](https://www.nuget.org/packages/Aspire.Hosting.Azure.AppConfiguration) Nuget package.

    ```dotnetcli
    dotnet add package Aspire.Hosting.Azure.AppConfiguration
    ```

1. Open the *AppHost.csproj*. Make sure that the `Aspire.Hosting.AppHost` package version is not earlier than the version you installed. Otherwise, you need to upgrade the `Aspire.Hosting.AppHost` package.

1. Open the *AppHost.cs* file and add the following code.

    ```csharp
    var builder = DistributedApplication.CreateBuilder(args);

    // Add an Azure App Configuration resource
    var appConfiguration = builder.AddAzureAppConfiguration("appconfiguration")
        .RunAsEmulator(emulator => { // use the App Configuration emulator
            emulator.WithDataBindMount();
        });
    ```

    > [!IMPORTANT]
    > When you call `RunAsEmulator`, it pulls the [App Configuration emulator image](https://mcr.microsoft.com/artifact/mar/azure-app-configuration/app-configuration-emulator/about) and runs a container as the App Configuration resource. Make sure that you have an OCI compliant container runtime on your machine. For more information, go to [Aspire Container Runtime](https://aspire.dev/get-started/prerequisites/#install-an-oci-compliant-container-runtime).

    > [!TIP]
    > You can call `WithDataBindMount` or `WithDataVolume` to configure the emulator resource for persistent container storage so that you don't need to recreate key values each time.

1. Add the reference of App Configuration resource and configure the `webfrontend` project to wait for it.

    ```csharp
    builder.AddProject<Projects.AspireApp_Web>("webfrontend")
        .WithExternalHttpEndpoints()
        .WithHttpHealthCheck("/health")
        .WithReference(apiService)
        .WaitFor(apiService)
        .WithReference(appConfiguration) // reference the App Configuration resource
        .WaitFor(appConfiguration); // wait for the App Configuration resource to enter the Running state before starting the resource
    ```

1. Start your container runtime. In this tutorial, we use Docker Desktop.

1. Run the `AppHost` project. Go to the Aspire dashboard. You see the App Configuration emulator resource is running.

    :::image type="content" source="media/aspire/dashboard-emulator.png" alt-text="Screenshot of the Aspire dashboard showing the App Configuration emulator resource." lightbox="media/aspire/dashboard-emulator.png":::

   A container is started to run the App Configuration emulator.

   :::image type="content" source="media/aspire/docker.png" alt-text="Screenshot of the docker desktop running a container." lightbox="media/aspire/docker.png":::

## Add a key-value

1. Click the URL of the `appconfiguration` resource. You see the App Configuration emulator UI.

1. Click the `Create` button on the upper-right corner.

    :::image type="content" source="media/aspire/emulator-ui.png" alt-text="Screenshot of the App Configuration emulator UI.":::

1. Add the following key-value.

    | Key                        | Value                                 |
    |----------------------------|---------------------------------------|
    | *TestApp:Settings:Message* | *Hello from Azure App Configuration!* |

1. Click the `Save` button.

    :::image type="content" source="media/aspire/emulator-create-key.png" alt-text="Screenshot of the App Configuration emulator UI of creating a new key value." lightbox="media/aspire/emulator-create-key.png":::

:::zone-end

## Use App Configuration in the web application

1. Navigate into to the `Web` project's directory. Run the following command to add the [`Aspire.Microsoft.Extensions.Configuration.AzureAppConfiguration`](https://www.nuget.org/packages/Aspire.Microsoft.Extensions.Configuration.AzureAppConfiguration) Nuget package.

    ```dotnetcli
    dotnet add package Aspire.Microsoft.Extensions.Configuration.AzureAppConfiguration
    ```

1. Open the *Program.cs* file and add the following code.

    ```csharp
    var builder = WebApplication.CreateBuilder(args);

    // Use Azure App Configuration
    builder.AddAzureAppConfiguration("appconfiguration"); // use the resource name defined in the AppHost project
    ```

1. Open the *Components/Pages/Home.razor* file and update it with the following code.

    ```cs
    @page "/"

    @inject IConfiguration Configuration

    <PageTitle>Home</PageTitle>

    <h1>Hello, world!</h1>

    @if (!string.IsNullOrWhiteSpace(message))
    {
        <div class="alert alert-info">@message</div>
    }
    else
    {
        <div class="alert alert-info">Welcome to your new app.</div>
    }

    @code {
        private string? message;

        protected override void OnInitialized()
        {
            string msg = Configuration["TestApp:Settings:Message"];
            message = string.IsNullOrWhiteSpace(msg) ? null : msg;
        }
    }
    ```

1. **Restart** the `AppHost` project. Go to the Aspire dashboard and click the URL of the web frontend. 

    :::image type="content" source="media/aspire/dashboard-updated.png" alt-text="Screenshot of Aspire dashboard showing resources." lightbox="media/aspire/dashboard-updated.png":::

1. You see a page with a welcome message from Azure App Configuration.

    :::image type="content" source="media/aspire/web-app-message.png" alt-text="Screenshot of a web app with a welcome message from Azure App Configuration." lightbox="media/aspire/web-app-message.png":::

## Next steps

In this quickstart, you:

* Added an Azure App Configuration resource in an Aspire solution.
* Read your key-values from Azure App Configuration with the App Configuration Aspire integration library.
* Displayed a web page using the settings you configured in your App Configuration.

To learn how to configure your Aspire app to dynamically refresh configuration settings, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration](./enable-dynamic-configuration-aspire.md)

To learn how to use feature flags in your Aspire app, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Use feature flags in Aspire](./quickstart-feature-flag-aspire.md)

To learn more about the Azure App Configuration emulator, continue to the following document.

> [!div class="nextstepaction"]
> [Azure App Configuration emulator overview](./emulator-overview.md)