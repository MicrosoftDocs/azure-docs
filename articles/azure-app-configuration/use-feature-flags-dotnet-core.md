---
title: Tutorial for using feature flags in a .NET Core app | Microsoft Docs
description: In this tutorial, you learn how to implement feature flags in .NET Core apps
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 04/19/2019
ms.author: yegu
ms.custom: mvc

#Customer intent: I want to control feature availability in my app using .NET Core Feature Manager library.
---
# Tutorial: Use feature flags in a .NET Core app

The .NET Core Feature Management libraries provide idiomatic support for implementing feature flags in an .NET or ASP.NET Core application. They allow you to add feature flags to your code more declaratively so that you do not have to write all the `if` statements for them manually. They manage feature flag lifecycles (for example, refresh and cache flag states, guarantee a flag state to be immutable during a request call) behind the scenes. In addition, the ASP.NET Core library offers out-of-the-box integrations including MVC controller actions, views, routes, and middleware.

The [Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md) quickstart shows a number of ways to add feature flags in an ASP.NET Core application. This tutorial explains these in more details. See the [ASP.NET Core feature management documentation](https://go.microsoft.com/fwlink/?linkid=2091410) for a complete reference.

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Add feature flags in key parts of your application to control feature availability.
> * Integrate with App Configuration when using it to manage feature flags.

## Setup

The .NET Core feature manager `IFeatureManager` gets feature flags from the framework's native configuration system. As a result, you can define your application's feature flags using any configuration source that .NET Core supports, including the local *appsettings.json* file or environment variables. Feature manager relies on .NET Core dependency injection. You can register the feature management services using standard conventions.

```csharp
using Microsoft.FeatureManagement;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddFeatureManagement();
    }
}
```

The feature manager retrieves feature flags from the "FeatureManagement" section of the .NET Core configuration data by default. The following example tells it to read from a different section called "MyFeatureFlags" instead.

```csharp
using Microsoft.FeatureManagement;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddFeatureManagement(options =>
        {
                options.UseConfiguration(Configuration.GetSection("MyFeatureFlags"));
        });
    }
}
```

If you use filters in your feature flags, you need to include an additional library and register it. The following example shows how to use a built-in feature filter called **PercentageFilter"**.

```csharp
using Microsoft.FeatureManagement;
using Microsoft.FeatureManagement.FeatureFilters;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddFeatureManagement()
                .AddFeatureFilter<PercentageFilter>();
    }
}
```

To operate effectively, you should keep feature flags outside of the application and manage them separately. Doing so allows you to modify flag states at any time and have those changes taking effect in the application immediately. App Configuration provides a centralized place for organizing and controlling all your feature flags through a dedicated portal UI and delivers the flags to your application directly through its .NET Core client libraries. The easiest way to connect your ASP.NET Core application to App Configuration is through the configuration provider `Microsoft.Extensions.Configuration.AzureAppConfiguration`. You can use this NuGet package in your code by adding the following to the *Program.cs* file:

```csharp
using Microsoft.Extensions.Configuration.AzureAppConfiguration;

public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
           .ConfigureAppConfiguration((hostingContext, config) => {
               var settings = config.Build();
               config.AddAzureAppConfiguration(options => {
                   options.Connect(settings["ConnectionStrings:AppConfig"])
                          .UseFeatureFlags();
                });
           })
           .UseStartup<Startup>();
```

Feature flag values are expected to change over time. By default, the feature manager will refresh feature flag values every 30 seconds. You can use a different polling interval in the `options.UseFeatureFlags()` call above.

```csharp
config.AddAzureAppConfiguration(options => {
    options.Connect(settings["ConnectionStrings:AppConfig"])
           .UseFeatureFlags(featureFlagOptions => {
                featureFlagOptions.PollInterval = TimeSpan.FromSeconds(5);
           });
});
```

## Feature flag declaration

Each feature flag has two parts: a name and a list of one or more filters that are used to evaluate if a feature's state is *on* (that is, when its value is `True`). A filter defines a use case for which a feature should be turned on. If a feature flag has multiple filters, the filter list is traversed in order until one of the filters determines that the feature should be enabled. At this point, the feature flag is considered as *on* and any remaining filter results are skipped. If no filter indicates that the feature should be enabled, the feature flag is *off*.

The feature manager supports *appsettings.json* as a configuration source for feature flags. The following example shows how to set up feature flags in a json file.

```JSON
"FeatureManagement": {
    "FeatureX": true, // Feature flag set to on
    "FeatureY": false, // Feature flag set to off
    "FeatureC": {
        "EnabledFor": [
            {
                "Name": "Percentage",
                "Parameters": {
                    "Value": 50
                }
            }
        ]
    }
}
```

By convention, the `FeatureManagement` section of this json document is used for feature flag settings. The above example shows three feature flags with their filters defined in the *EnabledFor* property:

* **FeatureA** is *on*.
* **FeatureB** is *off*.
* **FeatureC** specifies a filter named *Percentage* with a *Parameters* property. *Percentage* is an example of a configurable filter and it specifies a 50% probability for the **FeatureC** flag to be *on*.

## Referencing

Though not required, feature flags should be defined as `enum` variables so that they can be referenced easily in code.

```csharp
public enum MyFeatureFlags
{
    FeatureA,
    FeatureB,
    FeatureC
}
```

## Feature flag check

The basic pattern of feature management is to first check if a feature flag is set to *on* and then perform the enclosed actions if that is the case.

```csharp
IFeatureManager featureManager;
...
if (featureManager.IsEnabled(nameof(MyFeatureFlags.FeatureA)))
{
    // Run the following code
}
```

## Dependency injection

In ASP.NET Core MVC, the feature manager `IFeatureManager` can be accessed through dependency injection.

```csharp
public class HomeController : Controller
{
    private readonly IFeatureManager _featureManager;

    public HomeController(IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }
}
```

## Controller action

In MVC controllers, a `Feature` attribute can be used to control whether a whole controller class or a specific action is enabled. The following `HomeController` controller requires *FeatureA* to be *on* before any action it contains can be executed.

```csharp
[Feature(MyFeatureFlags.FeatureA)]
public class HomeController : Controller
{
    ...
}
```

The following `Index` action above requires *FeatureA* to be *on* before it can run.

```csharp
[Feature(MyFeatureFlags.FeatureA)]
public IActionResult Index()
{
    return View();
}
```

When an MVC controller or action is blocked because the controlling feature flag is *off*, a registered `IDisabledFeatureHandler` is called. The default `IDisabledFeatureHandler` returns a 404 status code to the client with no response body.

## View

In MVC views, a `<feature>` tag can be used to render content based on whether a feature flag is enabled or not.

```html
<feature name="FeatureA">
    <p>This can only be seen if 'FeatureA' is enabled.</p>
</feature>
```

## MVC filter

MVC filters can be set up such that they are activated based on the state of a feature flag. The following adds an MVC filter named `SomeMvcFilter`. This filter is triggered within the MVC pipeline only if *FeatureA* is enabled.

```csharp
using Microsoft.FeatureManagement.FeatureFilters;

IConfiguration Configuration { get; set;}

public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc(options => {
        options.Filters.AddForFeature<SomeMvcFilter>(nameof(MyFeatureFlags.FeatureA));
    });
}
```

## Route

Routes can be exposed dynamically based on feature flags. The following adds a route, which sets `Beta` as the default controller, only when *FeatureA* is enabled.

```csharp
app.UseMvc(routes => {
    routes.MapRouteForFeature(nameof(MyFeatureFlags.FeatureA), "betaDefault", "{controller=Beta}/{action=Index}/{id?}");
});
```

## Middleware

Feature flags can be used to add application branches and middleware conditionally. The following inserts a middleware component in the request pipeline only when *FeatureA* is enabled.

```csharp
app.UseMiddlewareForFeature<ThirdPartyMiddleware>(nameof(MyFeatureFlags.FeatureA));
```

This builds off the more generic capability to branch the entire application based on a feature flag.

```csharp
app.UseForFeature(featureName, appBuilder => {
    appBuilder.UseMiddleware<T>();
});
```

## Next steps

In this tutorial, you learned how to implement feature flags in your ASP.NET Core application by utilizing the `Microsoft.FeatureManagement` libraries. See the following resources for more information on feature management support in ASP.NET Core and App Configuration.

* [ASP.NET Core feature flag sample code](/azure/azure-app-configuration/quickstart-feature-flag-aspnet-core)
* [Microsoft.FeatureManagement documentation](https://docs.microsoft.com/dotnet/api/microsoft.featuremanagement)
* [Manage feature flags](./manage-feature-flags.md)
