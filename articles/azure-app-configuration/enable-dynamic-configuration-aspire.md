---
title: "Tutorial: Use dynamic configuration in an Aspire solution"
titleSuffix: Azure App Configuration
description:  In this tutorial, you learn how to dynamically update the configuration data for Aspire solutions.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 12/4/2025
zone_pivot_groups: appconfig-aspire
ms.author: zhiyuanliang
#Customer intent: As an Aspire developer, I want to learn the centralized configuration cloud-native solution for Aspire.
---

# Tutorial: Use dynamic configuration in an Aspire solution

This tutorial shows how you can enable dynamic configuration updates in an Aspire solution. It builds on the web app introduced in the quickstart. Your app will leverage the App Configuration provider library for its built-in configuration caching and refreshing capabilities. Before you continue, finish [Create an Aspire solution with Azure App Configuration](./quickstart-aspire.md) first.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your app to update its configuration in response to changes in an App Configuration store.
> * Inject the latest configuration into your app.

## Prerequisites

Finish the quickstart: [Create an Aspire solution with Azure App Configuration](./quickstart-aspire.md).

## Reload data from App Configuration

1. Navigate into the `Web` project's directory (created in the [Prerequisites](./enable-dynamic-configuration-aspire.md#prerequisites) steps).  Run the following command to add the [`Microsoft.Azure.AppConfiguration.AspNetCore`](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore) Nuget package. 

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```

1. Open *AppHost.cs*, and update the `AddAzureAppConfiguration` method you added during the quickstart.

    ```csharp
    builder.AddAzureAppConfiguration(
        "appconfiguration",
        configureOptions: options =>
        {
            // Load all keys that start with `TestApp:` and have no label.
            options.Select("TestApp:*", LabelFilter.Null);
            // Reload configuration if any selected key-values have changed.
            options.ConfigureRefresh(refreshOptions =>
                refreshOptions.RegisterAll());
        });
    ```

    The `Select` method is used to load all key-values whose key name starts with *TestApp:* and that have *no label*. You can call the `Select` method more than once to load configurations with different prefixes or labels. If you share one App Configuration store with multiple apps, this approach helps load configuration only relevant to your current app instead of loading everything from your store.
    
    Inside the `ConfigureRefresh` method, you call the `RegisterAll` method to instruct the App Configuration provider to reload the entire configuration whenever it detects a change in any of the selected key-values (those starting with *TestApp:* and having no label). For more information about monitoring configuration changes, see [Best practices for configuration refresh](./howto-best-practices.md#configuration-refresh).

1. Add Azure App Configuration middleware to the service collection of your app.

    Update *Program.cs* with the following code. 

    ```csharp
    // Existing code in Program.cs
    // ... ...

    // Add Azure App Configuration middleware to the container of services.
    builder.Services.AddAzureAppConfiguration();

    var app = builder.Build();

    // The rest of existing code in program.cs
    // ... ...
    ```

1. Call the `UseAzureAppConfiguration` method. It enables your app to use the App Configuration middleware to update the configuration for you automatically.

    Update *Program.cs* with the following code. 

    ```csharp
    // Existing code in Program.cs
    // ... ...

    var app = builder.Build();

    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Error");
        app.UseHsts();
    }

    // Use Azure App Configuration middleware for dynamic configuration refresh.
    app.UseAzureAppConfiguration();

    // The rest of existing code in program.cs
    // ... ...
    ```

## Request-driven configuration refresh

The configuration refresh is triggered by the incoming requests to your web app. No refresh will occur if your app is idle. When your app is active, the App Configuration middleware monitors any keys you registered for refreshing in the `ConfigureRefresh` call. The middleware is triggered upon every incoming request to your app. However, the middleware will only send requests to check the value in App Configuration when the refresh interval you set has passed.

- If a request to App Configuration for change detection fails, your app will continue to use the cached configuration. New attempts to check for changes will be made periodically while there are new incoming requests to your app.
- The configuration refresh happens asynchronously to the processing of your app's incoming requests. It will not block or slow down the incoming request that triggered the refresh. The request that triggered the refresh may not get the updated configuration values, but later requests will get new configuration values.
- To ensure the middleware is triggered, call the `app.UseAzureAppConfiguration()` method as early as appropriate in your request pipeline so another middleware won't skip it in your app.

:::zone target="docs" pivot="azure"

## Run the app locally

1. Run the `AppHost` project. Go to the Aspire dashboard and open the web app.

    :::image type="content" source="media/aspire/original-message.png" alt-text="Screenshot of a web app with the original message from Azure App Configuration." lightbox="media/aspire/original-message.png":::

1. In the Azure portal, navigate to the **Configuration explorer** of your App Configuration store, and update the value of the following key.

    | Key                        | Value                                           |
    |----------------------------|-------------------------------------------------|
    | *TestApp:Settings:Message* | *Hello from Azure App Configuration - Updated!* |

1. Refresh the browser a few times. When the refresh interval elapses after 30 seconds, the page shows with updated content.

    :::image type="content" source="media/aspire/refreshed-message.png" alt-text="Screenshot of a web app with the updated message from Azure App Configuration." lightbox="media/aspire/refreshed-message.png":::

1. Go to the Aspire dashboard and open the structured logs. You see that the `webfrontend` resource has a log with message "Configuration reloaded.".

    :::image type="content" source="media/aspire/dashboard-logs.png" alt-text="Screenshot of the Aspire dashboard showing structured logs." lightbox="media/aspire/dashboard-logs.png":::

:::zone-end

:::zone target="docs" pivot="emulator"

## Run the app locally

1. Run the `AppHost` project. Go to the Aspire dashboard and open the web app.

    :::image type="content" source="media/aspire/original-message.png" alt-text="Screenshot of a web app with the original message from Azure App Configuration." lightbox="media/aspire/original-message.png":::

1. Go to the emulator UI, edit the value of the following key.

    | Key                        | Value                                           |
    |----------------------------|-------------------------------------------------|
    | *TestApp:Settings:Message* | *Hello from Azure App Configuration - Updated!* |

1. Refresh the browser a few times. When the refresh interval elapses after 30 seconds, the page shows with updated content.

    :::image type="content" source="media/aspire/refreshed-message.png" alt-text="Screenshot of a web app with the updated message from Azure App Configuration." lightbox="media/aspire/refreshed-message.png":::

1. Go to the Aspire dashboard and open the structured logs. You see that the `webfrontend` resource has a log with message "Configuration reloaded.".

    :::image type="content" source="media/aspire/dashboard-logs.png" alt-text="Screenshot of the Aspire dashboard showing structured logs." lightbox="media/aspire/dashboard-logs.png":::

:::zone-end

## Next steps

In this tutorial, you enabled your Aspire app to dynamically refresh configuration settings from App Configuration. To learn how to enable dynamic configuration in an ASP.NET Web Application, continue to the next tutorial:

> [!div class="nextstepaction"]
> [Enable dynamic configuration in ASP.NET Web Applications](./enable-dynamic-configuration-aspnet-netfx.md)
