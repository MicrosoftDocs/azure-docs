---
title: "Tutorial: Use App Configuration dynamic configuration in ASP.NET Core"
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to dynamically update the configuration data for ASP.NET Core apps
services: azure-app-configuration
documentationcenter: ''
author: AlexandraKemperMS
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 09/1/2020
ms.author: alkemper
ms.custom: "devx-track-csharp, mvc"

#Customer intent: I want to dynamically update my app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in an ASP.NET Core app

ASP.NET Core has a pluggable configuration system that can read configuration data from a variety of sources. It can handle changes dynamically without causing an application to restart. ASP.NET Core supports the binding of configuration settings to strongly typed .NET classes. It injects them into your code by using `IOptionsSnapshot<T>`, which automatically reloads the application's configuration when the underlying data changes.

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

A *sentinel key* is a special key that you update after you complete the change of all other keys. Your application monitors the sentinel key. When a change is detected, your application refreshes all configuration values. This approach helps to ensure the consistency of configuration in your application and reduces the overall number of requests made to App Configuration, compared to monitoring all keys for changes.

1. In the Azure portal, select **Configuration Explorer > Create > Key-value**.
1. For **Key**, enter *TestApp:Settings:Sentinel*. For **Value**, enter 1. Leave **Label** and **Content type** blank.
1. Select **Apply**.

> [!NOTE]
> If you aren't using a sentinel key, you need to manually register every key you want to monitor.

## Reload data from App Configuration

1. Add a reference to the `Microsoft.Azure.AppConfiguration.AspNetCore` NuGet package by running the following command:

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    ```

1. Open *Program.cs*, and update the `CreateWebHostBuilder` method to add the `config.AddAzureAppConfiguration()` method.

   #### [.NET 5.x](#tab/core5x)

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
    ---

    In the `ConfigureRefresh` method, you register keys within your App Configuration store that you want to monitor for changes. The `refreshAll` parameter to the `Register` method indicates that all configuration values should be refreshed if the registered key changes. The `SetCacheExpiration` method specifies the minimum time that must elapse before a new request is made to App Configuration to check for any configuration changes. In this example, you override the default expiration time of 30 seconds specifying a time of 5 minutes instead. This reduces the potential number of requests made to your App Configuration store.

    > [!NOTE]
    > For testing purposes, you may want to lower the cache refresh expiration time.

    To actually trigger a configuration refresh, you'll use the App Configuration middleware. You'll see how to do this in a later step.

1. Add a *Settings.cs* file in the Controllers directory that defines and implements a new `Settings` class. Replace the namespace with the name of your project. 

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

1. Open *Startup.cs*, and update the `ConfigureServices` method. Call `Configure<Settings>` to bind configuration data to the `Settings` class. Call `AddAzureAppConfiguration` to add App Configuration components to the service collection of your application.

    #### [.NET 5.x](#tab/core5x)

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<Settings>(Configuration.GetSection("TestApp:Settings"));
        services.AddControllersWithViews();
        services.AddAzureAppConfiguration();
    }
    ```
    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<Settings>(Configuration.GetSection("TestApp:Settings"));
        services.AddControllersWithViews();
        services.AddAzureAppConfiguration();
    }
    ```
    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<Settings>(Configuration.GetSection("TestApp:Settings"));
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        services.AddAzureAppConfiguration();
    }
    ```
    ---

1. Update the `Configure` method, and add a call to `UseAzureAppConfiguration`. It enables your application to use the App Configuration middleware to handle the configuration updates for you automatically.

    #### [.NET 5.x](#tab/core5x)

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
    ---
    
    > [!NOTE]
    > The App Configuration middleware monitors the sentinel key or any other keys you registered for refreshing in the `ConfigureRefresh` call in the previous step. The middleware is triggered upon every incoming request to your application. However, the middleware will only send requests to check the value in App Configuration when the cache expiration time you set has passed. When a change is detected, it will either update all the configuration if the sentinel key is used or update the registered keys' values only.
    > - If a request to App Configuration for change detection fails, your application will continue to use the cached configuration. Another check will be made when the configured cache expiration time has passed again, and there are new incoming requests to your application.
    > - The configuration refresh happens asynchronously to the processing of your application incoming requests. It will not block or slow down the incoming request that triggered the refresh. The request that triggered the refresh may not get the updated configuration values, but subsequent requests will do.
    > - To ensure the middleware is triggered, call `app.UseAzureAppConfiguration()` as early as appropriate in your request pipeline so another middleware will not short-circuit it in your application.

## Use the latest configuration data

1. Open *HomeController.cs* in the Controllers directory, and add a reference to the `Microsoft.Extensions.Options` package.

    ```csharp
    using Microsoft.Extensions.Options;
    ```

2. Update the `HomeController` class to receive `Settings` through dependency injection, and make use of its values.

    #### [.NET 5.x](#tab/core5x)

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
    ---
    > [!Tip]
    > To learn more about the options pattern when reading configuration values, see [Options Patterns in ASP.NET Core](/aspnet/core/fundamentals/configuration/options).

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

    ```console
        dotnet build
    ```

1. After the build successfully completes, run the following command to run the web app locally:

    ```console
        dotnet run
    ```

1. Open a browser window, and go to the URL shown in the `dotnet run` output.

    ![Launching quickstart app locally](./media/quickstarts/aspnet-core-app-launch-local-before.png)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store instance that you created in the quickstart.

1. Select **Configuration Explorer**, and update the values of the following keys. Remember to update the sentinel key at last.

    | Key | Value |
    |---|---|
    | TestApp:Settings:BackgroundColor | green |
    | TestApp:Settings:FontColor | lightGray |
    | TestApp:Settings:Message | Data from Azure App Configuration - now with live updates! |
    | TestApp:Settings:Sentinel | 2 |

1. Refresh the browser page to see the new configuration settings. You may need to refresh more than once for the changes to be reflected, or change your cache expiration time to less than 5 minutes. 

    ![Launching updated quickstart app locally](./media/quickstarts/aspnet-core-app-launch-local-after.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your ASP.NET Core web app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure-managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
