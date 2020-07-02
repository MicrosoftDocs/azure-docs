---
title: "Tutorial: Use App Configuration dynamic configuration in ASP.NET Core"
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to dynamically update the configuration data for ASP.NET Core apps
services: azure-app-configuration
documentationcenter: ''
author: lisaguthrie
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 02/24/2019
ms.author: lcozzens
ms.custom: mvc

#Customer intent: I want to dynamically update my app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in an ASP.NET Core app

ASP.NET Core has a pluggable configuration system that can read configuration data from a variety of sources. It can handle changes dynamically without causing an application to restart. ASP.NET Core supports the binding of configuration settings to strongly typed .NET classes. It injects them into your code by using the various `IOptions<T>` patterns. One of these patterns, specifically `IOptionsSnapshot<T>`, automatically reloads the application's configuration when the underlying data changes. You can inject `IOptionsSnapshot<T>` into controllers in your application to access the most recent configuration stored in Azure App Configuration.

You also can set up the App Configuration ASP.NET Core client library to refresh a set of configuration settings dynamically using a middleware. The configuration settings get updated with the configuration store each time as long as the web app receives requests.

App Configuration automatically caches each setting to avoid too many calls to the configuration store. The refresh operation waits until the cached value of a setting expires to update that setting, even when its value changes in the configuration store. The default cache expiration time is 30 seconds. You can override this expiration time, if necessary.

This tutorial shows how you can implement dynamic configuration updates in your code. It builds on the web app introduced in the quickstarts. Before you continue, finish [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

You can use any code editor to do the steps in this tutorial. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option that's available on the Windows, macOS, and Linux platforms.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your application to update its configuration in response to changes in an App Configuration store.
> * Inject the latest configuration in your application's controllers.

## Prerequisites

To do this tutorial, install the [.NET Core SDK](https://dotnet.microsoft.com/download).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

Before you continue, finish [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

## Add a sentinel key

A *sentinel key* is a special key used to signal when configuration has changed. Your app monitors the sentinel key for changes. When a change is detected, you refresh all configuration values. This approach reduces the overall number of requests made by your app to App Configuration, compared to monitoring all keys for changes.

1. In the Azure portal, select **Configuration Explorer > Create > Key-value**.

1. For **Key**, enter *TestApp:Settings:Sentinel*. For **Value**, enter 1. Leave **Label** and **Content type** blank.

1. Select **Apply**.

## Reload data from App Configuration

1. Add a reference to the `Microsoft.Azure.AppConfiguration.AspNetCore` NuGet package by running the following command:

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```

1. Open *Program.cs*, and update the `CreateWebHostBuilder` method to add the `config.AddAzureAppConfiguration()` method.

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();

                config.AddAzureAppConfiguration(options =>
                {
                    options.Connect(settings["ConnectionStrings:AppConfig"])
                           .ConfigureRefresh(refresh =>
                                {
                                    refresh.Register("TestApp:Settings:Sentinel", refreshAll: true)
                                           .SetCacheExpiration(new TimeSpan(0, 5, 0));
                                });
                });
            })
            .UseStartup<Startup>();
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
                webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var settings = config.Build();
                    config.AddAzureAppConfiguration(options =>
                    {
                        options.Connect(settings["ConnectionStrings:AppConfig"])
                               .ConfigureRefresh(refresh =>
                                    {
                                        refresh.Register("TestApp:Settings:Sentinel", refreshAll: true)
                                               .SetCacheExpiration(new TimeSpan(0, 5, 0));
                                    });
                    });
                })
            .UseStartup<Startup>());
    ```
    ---

    The `ConfigureRefresh` method is used to specify the settings used to update the configuration data with the App Configuration store when a refresh operation is triggered. The `refreshAll` parameter to the `Register` method indicates that all configuration values should be refreshed if the sentinel key changes.

    Also, the `SetCacheExpiration` method overrides the default cache expiration time of 30 seconds, specifying a time of 5 minutes instead. This reduces the number of requests made to App Configuration.

    > [!NOTE]
    > For testing purposes, you may want to lower the cache expiration time.

    To actually trigger a refresh operation, you'll need to configure a refresh middleware for the application to refresh the configuration data when any change occurs. You'll see how to do this in a later step.

2. Add a *Settings.cs* file that defines and implements a new `Settings` class.

    ```csharp
    namespace TestAppConfig
    {
        public class Settings
        {
            public string BackgroundColor { get; set; }
            public long FontSize { get; set; }
            public string FontColor { get; set; }
            public string Message { get; set; }
        }
    }
    ```

3. Open *Startup.cs*, and use `IServiceCollection.Configure<T>` in the `ConfigureServices` method to bind configuration data to the `Settings` class.

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<Settings>(Configuration.GetSection("TestApp:Settings"));
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
    }
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<Settings>(Configuration.GetSection("TestApp:Settings"));
        services.AddControllersWithViews();
    }
    ```
    ---

4. Update the `Configure` method, adding the `UseAzureAppConfiguration` middleware to allow the configuration settings registered for refresh to be updated while the ASP.NET Core web app continues to receive requests.


    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        app.UseAzureAppConfiguration();

        services.Configure<CookiePolicyOptions>(options =>
        {
            options.CheckConsentNeeded = context => true;
            options.MinimumSameSitePolicy = SameSiteMode.None;
        });

        app.UseMvc();
    }
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            // Add the following line:
            app.UseAzureAppConfiguration();

            app.UseHttpsRedirection();
            
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
    }
    ```
    ---
    
    The middleware uses the refresh configuration specified in the `AddAzureAppConfiguration` method in `Program.cs` to trigger a refresh for each request received by the ASP.NET Core web app. For each request, a refresh operation is triggered and the client library checks if the cached value for the registered configuration setting has expired. If it's expired, it's refreshed.

## Use the latest configuration data

1. Open *HomeController.cs* in the Controllers directory, and add a reference to the `Microsoft.Extensions.Options` package.

    ```csharp
    using Microsoft.Extensions.Options;
    ```

2. Update the `HomeController` class to receive `Settings` through dependency injection, and make use of its values.

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public class HomeController : Controller
    {
        private readonly Settings _settings;
        public HomeController(IOptionsSnapshot<Settings> settings)
        {
            _settings = settings.Value;
        }

        public IActionResult Index()
        {
            ViewData["BackgroundColor"] = _settings.BackgroundColor;
            ViewData["FontSize"] = _settings.FontSize;
            ViewData["FontColor"] = _settings.FontColor;
            ViewData["Message"] = _settings.Message;

            return View();
        }
    }
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public class HomeController : Controller
    {
        private readonly Settings _settings;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, IOptionsSnapshot<Settings> settings)
        {
            _logger = logger;
            _settings = settings.Value;
        }

        public IActionResult Index()
        {
            ViewData["BackgroundColor"] = _settings.BackgroundColor;
            ViewData["FontSize"] = _settings.FontSize;
            ViewData["FontColor"] = _settings.FontColor;
            ViewData["Message"] = _settings.Message;

            return View();
        }

        // ...
    }
    ```
    ---



3. Open *Index.cshtml* in the Views > Home directory, and replace its content with the following script:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <style>
        body {
            background-color: @ViewData["BackgroundColor"]
        }
        h1 {
            color: @ViewData["FontColor"];
            font-size: @ViewData["FontSize"]px;
        }
    </style>
    <head>
        <title>Index View</title>
    </head>
    <body>
        <h1>@ViewData["Message"]</h1>
    </body>
    </html>
    ```

## Build and run the app locally

1. To build the app by using the .NET Core CLI, run the following command in the command shell:

        dotnet build

1. After the build successfully completes, run the following command to run the web app locally:

        dotnet run
1. Open a browser window, and go to the URL shown in the `dotnet run` output.

    ![Launching quickstart app locally](./media/quickstarts/aspnet-core-app-launch-local-before.png)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store instance that you created in the quickstart.

1. Select **Configuration Explorer**, and update the values of the following keys:

    | Key | Value |
    |---|---|
    | TestApp:Settings:BackgroundColor | green |
    | TestApp:Settings:FontColor | lightGray |
    | TestApp:Settings:Message | Data from Azure App Configuration - now with live updates! |
    | TestApp:Settings:Sentinel | 2 |

1. Refresh the browser page to see the new configuration settings. You may need to refresh more than once for the changes to be reflected.

    ![Launching updated quickstart app locally](./media/quickstarts/aspnet-core-app-launch-local-after.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your ASP.NET Core web app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure-managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
