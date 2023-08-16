---
title: "Tutorial: Use dynamic configuration in an ASP.NET Core app"
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to dynamically update the configuration data for ASP.NET Core apps.
services: azure-app-configuration
documentationcenter: ""
author: zhenlan
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: tutorial
ms.date: 09/30/2022
ms.author: zhenlwa
ms.custom: devx-track-csharp
---

# Tutorial: Use dynamic configuration in an ASP.NET Core app

This tutorial shows how you can enable dynamic configuration updates in an ASP.NET Core app. It builds on the web app introduced in the quickstarts. Your app will leverage the App Configuration provider library for its built-in configuration caching and refreshing capabilities. Before you continue, finish [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your app to update its configuration in response to changes in an App Configuration store.
> * Inject the latest configuration into your app.

## Prerequisites

Finish the quickstart: [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md).

## Add a sentinel key

A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your App Configuration store, compared to monitoring all keys for changes.

1. In the Azure portal, open your App Configuration store and select **Configuration Explorer > Create > Key-value**.
1. For **Key**, enter *TestApp:Settings:Sentinel*. For **Value**, enter 1. Leave **Label** and **Content type** blank.
1. Select **Apply**.

## Reload data from App Configuration

1. Open *Program.cs*, and update the `AddAzureAppConfiguration` method you added previously during the quickstart.

    #### [.NET 6.0+](#tab/core6x)
    ```csharp
    // Load configuration from Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(connectionString)
               // Load all keys that start with `TestApp:` and have no label
               .Select("TestApp:*", LabelFilter.Null)
               // Configure to reload configuration if the registered sentinel key is modified
               .ConfigureRefresh(refreshOptions =>
                    refreshOptions.Register("TestApp:Settings:Sentinel", refreshAll: true));
    });
    ```

    #### [.NET Core 3.x](#tab/core3x)
    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.ConfigureAppConfiguration(config =>
                {
                    //Retrieve the Connection String from the secrets manager
                    IConfiguration settings = config.Build();
                    string connectionString = settings.GetConnectionString("AppConfig");

                    // Load configuration from Azure App Configuration
                    config.AddAzureAppConfiguration(options =>
                    {
                        options.Connect(connectionString)
                               // Load all keys that start with `TestApp:` and have no label
                               .Select("TestApp:*", LabelFilter.Null)
                               // Configure to reload configuration if the registered sentinel key is modified
                               .ConfigureRefresh(refreshOptions =>
                                    refreshOptions.Register("TestApp:Settings:Sentinel", refreshAll: true));
                    });
                });

                webBuilder.UseStartup<Startup>();
            });
    ```
    ---

    The `Select` method is used to load all key-values whose key name starts with *TestApp:* and that have *no label*. You can call the `Select` method more than once to load configurations with different prefixes or labels. If you share one App Configuration store with multiple apps, this approach helps load configuration only relevant to your current app instead of loading everything from your store.

    In the `ConfigureRefresh` method, you register keys you want to monitor for changes in your App Configuration store. The `refreshAll` parameter to the `Register` method indicates that all configurations you specified by the `Select` method will be reloaded if the registered key changes.

    > [!TIP]
    > You can add a call to the `refreshOptions.SetCacheExpiration` method to specify the minimum time between configuration refreshes. In this example, you use the default value of 30 seconds. Adjust to a higher value if you need to reduce the number of requests made to your App Configuration store.

1. Add Azure App Configuration middleware to the service collection of your app.

    #### [.NET 6.0+](#tab/core6x)
    Update *Program.cs* with the following code. 

    ```csharp
    // Existing code in Program.cs
    // ... ...

    builder.Services.AddRazorPages();

    // Add Azure App Configuration middleware to the container of services.
    builder.Services.AddAzureAppConfiguration();

    // Bind configuration "TestApp:Settings" section to the Settings object
    builder.Services.Configure<Settings>(builder.Configuration.GetSection("TestApp:Settings"));

    var app = builder.Build();

    // The rest of existing code in program.cs
    // ... ...
    ```

    #### [.NET Core 3.x](#tab/core3x)
    Open *Startup.cs*, and update the `ConfigureServices` method.

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddRazorPages();

        // Add Azure App Configuration middleware to the container of services.
        services.AddAzureAppConfiguration();

        // Bind configuration "TestApp:Settings" section to the Settings object
        services.Configure<Settings>(Configuration.GetSection("TestApp:Settings"));
    }   
    ```
    ---

1. Call the `UseAzureAppConfiguration` method. It enables your app to use the App Configuration middleware to update the configuration for you automatically.

    #### [.NET 6.0+](#tab/core6x)
    Update *Program.cs* withe the following code. 

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

    #### [.NET Core 3.x](#tab/core3x)
    Update the `Configure` method in *Startup.cs*.

    ```csharp
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        // Use Azure App Configuration middleware for dynamic configuration refresh.
        app.UseAzureAppConfiguration();

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapRazorPages();
        });
    }
    ```
    ---

You've set up your app to use the [options pattern in ASP.NET Core](/aspnet/core/fundamentals/configuration/options) during the quickstart. When the underlying configuration of your app is updated from App Configuration, your strongly typed `Settings` object obtained via `IOptionsSnapshot<T>` is updated automatically. Note that you shouldn't use the `IOptions<T>` if dynamic configuration update is desired because it doesn't read configuration data after the app has started.
    
## Request-driven configuration refresh

The configuration refresh is triggered by the incoming requests to your web app. No refresh will occur if your app is idle. When your app is active, the App Configuration middleware monitors the sentinel key, or any other keys you registered for refreshing in the `ConfigureRefresh` call. The middleware is triggered upon every incoming request to your app. However, the middleware will only send requests to check the value in App Configuration when the cache expiration time you set has passed.

- If a request to App Configuration for change detection fails, your app will continue to use the cached configuration. New attempts to check for changes will be made periodically while there are new incoming requests to your app.
- The configuration refresh happens asynchronously to the processing of your app's incoming requests. It will not block or slow down the incoming request that triggered the refresh. The request that triggered the refresh may not get the updated configuration values, but later requests will get new configuration values.
- To ensure the middleware is triggered, call the `app.UseAzureAppConfiguration()` method as early as appropriate in your request pipeline so another middleware won't skip it in your app.

## Build and run the app locally

1. To build the app by using the .NET Core CLI, run the following command in the command shell:

    ```console
        dotnet build
    ```

1. After the build successfully completes, run the following command to run the web app locally:

    ```console
        dotnet run
    ```

1. Open a browser window, and go to the URL shown in the `dotnet run` output.

    ![Launching quickstart app locally](./media/quickstarts/aspnet-core-app-launch-local-before.png)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store that you created in the quickstart.

1. Select **Configuration explorer**, and update the values of the following keys. Remember to update the sentinel key at last.

    | Key | Value |
    |---|---|
    | TestApp:Settings:BackgroundColor | green |
    | TestApp:Settings:FontColor | lightGray |
    | TestApp:Settings:Message | Data from Azure App Configuration - now with live updates! |
    | TestApp:Settings:Sentinel | 2 |

1. Refresh the browser a few times. When the cache expires after 30 seconds, the page shows with updated content.

    ![Launching updated quickstart app locally](./media/quickstarts/aspnet-core-app-launch-local-after.png)

## Logging and monitoring

Logs are output upon configuration refresh and contain detailed information on key-values retrieved from your App Configuration store and configuration changes made to your application.

- A default `ILoggerFactory` is added automatically when `services.AddAzureAppConfiguration()` is invoked. The App Configuration provider uses this `ILoggerFactory` to create an instance of `ILogger`, which outputs these logs. ASP.NET Core uses `ILogger` for logging by default, so you don't need to make additional code changes to enable logging for the App Configuration provider.
- Logs are output at different log levels. The default level is `Information`.

    | Log Level | Description |
    |---|---|
    | Debug | Logs include the key and label of key-values your application monitors for changes from your App Configuration store. The information also includes whether the key-value has changed compared with what your application has already loaded. Enable logs at this level to troubleshoot your application if a configuration change didn't happen as expected. |
    | Information | Logs include the keys of configuration settings updated during a configuration refresh. Values of configuration settings are omitted from the log to avoid leaking sensitive data. You can monitor logs at this level to ensure your application picks up expected configuration changes. |
    | Warning | Logs include failures and exceptions that occurred during configuration refresh. Occasional occurrences can be ignored because the configuration provider will continue using the cached data and attempt to refresh the configuration next time. You can monitor logs at this level for repetitive warnings that may indicate potential issues. For example, you rotated the connection string but forgot to update your application. |

    You can enable logging at the `Debug` log level by adding the following example to your `appsettings.json` file. This example applies to all other log levels as well.
    ```json
    "Logging": {
        "LogLevel": {
            "Microsoft.Extensions.Configuration.AzureAppConfiguration": "Debug"
        }
    }
    ```
- The logging category is `Microsoft.Extensions.Configuration.AzureAppConfiguration.Refresh`, which appears before each log. Here are some example logs at each log level:
    ```console
    dbug: Microsoft.Extensions.Configuration.AzureAppConfiguration.Refresh[0]
        Key-value read from App Configuration. Change:'Modified' Key:'ExampleKey' Label:'ExampleLabel' Endpoint:'https://examplestore.azconfig.io'

    info: Microsoft.Extensions.Configuration.AzureAppConfiguration.Refresh[0]
        Setting updated. Key:'ExampleKey'

    warn: Microsoft.Extensions.Configuration.AzureAppConfiguration.Refresh[0]
        A refresh operation failed while resolving a Key Vault reference.
    Key vault error. ErrorCode:'SecretNotFound' Key:'ExampleKey' Label:'ExampleLabel' Etag:'6LaqgBQM9C_Do2XyZa2gAIfj_ArpT52-xWwDSLb2hDo' SecretIdentifier:'https://examplevault.vault.azure.net/secrets/ExampleSecret'
    ```

Using `ILogger` is the preferred method in ASP.NET applications and is prioritized as the logging source if an instance of `ILoggerFactory` is present. However, if `ILoggerFactory` is not available, logs can alternatively be enabled and configured through the [instructions for .NET Core apps](./enable-dynamic-configuration-dotnet-core.md#logging-and-monitoring). For more information, see [logging in .NET Core and ASP.NET Core](/aspnet/core/fundamentals/logging).

> [!NOTE]
> Logging is available if you use version **6.0.0** or later of any of the following packages.
> - `Microsoft.Extensions.Configuration.AzureAppConfiguration`
> - `Microsoft.Azure.AppConfiguration.AspNetCore`
> - `Microsoft.Azure.AppConfiguration.Functions.Worker`

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your ASP.NET Core web app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure-managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Access App Configuration using managed identity](./howto-integrate-azure-managed-service-identity.md)
