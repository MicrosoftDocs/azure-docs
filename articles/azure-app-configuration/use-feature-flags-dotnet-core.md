---
title: Tutorial for using feature flags in a .NET Core app | Microsoft Docs
description: In this tutorial, you learn how to implement feature flags in .NET Core apps.
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

#Customer intent: I want to control feature availability in my app by using the .NET Core Feature Manager library.
---

# Tutorial: Use feature flags in an ASP.NET Core app

The .NET Core Feature Management libraries provide idiomatic support for implementing feature flags in a .NET or ASP.NET Core application. These libraries allow you to declaratively add feature flags to your code so that you don't have to write all the `if` statements for them manually.

The Feature Management libraries also manage feature flag lifecycles behind the scenes. For example, the libraries refresh and cache flag states, or guarantee a flag state to be immutable during a request call. In addition, the ASP.NET Core library offers out-of-the-box integrations, including MVC controller actions, views, routes, and middleware.

The [Add feature flags to an ASP.NET Core app Quickstart](./quickstart-feature-flag-aspnet-core.md) shows several ways to add feature flags in an ASP.NET Core application. This tutorial explains these methods in more detail. For a complete reference, see the [ASP.NET Core feature management documentation](https://go.microsoft.com/fwlink/?linkid=2091410).

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Add feature flags in key parts of your application to control feature availability.
> * Integrate with App Configuration when you're using it to manage feature flags.

## Set up feature management

The .NET Core feature manager `IFeatureManager` gets feature flags from the framework's native configuration system. As a result, you can define your application's feature flags by using any configuration source that .NET Core supports, including the local *appsettings.json* file or environment variables. `IFeatureManager` relies on .NET Core dependency injection. You can register the feature management services by using standard conventions:

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

By default, the feature manager retrieves feature flags from the `"FeatureManagement"` section of the .NET Core configuration data. The following example tells the feature manager to read from a different section called `"MyFeatureFlags"` instead:

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

If you use filters in your feature flags, you need to include an additional library and register it. The following example shows how to use a built-in feature filter called `PercentageFilter`:

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

We recommend that you keep feature flags outside the application and manage them separately. Doing so allows you to modify flag states at any time and have those changes take effect in the application right away. App Configuration provides a centralized place for organizing and controlling all your feature flags through a dedicated portal UI. App Configuration also delivers the flags to your application directly through its .NET Core client libraries.

The easiest way to connect your ASP.NET Core application to App Configuration is through the configuration provider `Microsoft.Azure.AppConfiguration.AspNetCore`. Follow these steps to use this NuGet package.

1. Open *Program.cs* file and add the following code.

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

2. Open *Startup.cs* and update the `Configure` method to add a middleware to allow the feature flag values to be refreshed at a recurring interval while the ASP.NET Core web app continues to receive requests.

   ```csharp
   public void Configure(IApplicationBuilder app, IHostingEnvironment env)
   {
       app.UseAzureAppConfiguration();
       app.UseMvc();
   }
   ```

Feature flag values are expected to change over time. By default, the feature flag values are cached for a period of 30 seconds, so a refresh operation triggered when the middleware receives a request would not update the value until the cached value expires. The following code shows how to change the cache expiration time or polling interval to 5 minutes in the `options.UseFeatureFlags()` call.

```csharp
config.AddAzureAppConfiguration(options => {
    options.Connect(settings["ConnectionStrings:AppConfig"])
           .UseFeatureFlags(featureFlagOptions => {
                featureFlagOptions.CacheExpirationTime = TimeSpan.FromMinutes(5);
           });
});
```

## Feature flag declaration

Each feature flag has two parts: a name and a list of one or more filters that are used to evaluate if a feature's state is *on* (that is, when its value is `True`). A filter defines a use case for when a feature should be turned on.

When a feature flag has multiple filters, the filter list is traversed in order until one of the filters determines the feature should be enabled. At that point, the feature flag is *on*, and any remaining filter results are skipped. If no filter indicates the feature should be enabled, the feature flag is *off*.

The feature manager supports *appsettings.json* as a configuration source for feature flags. The following example shows how to set up feature flags in a JSON file:

```JSON
"FeatureManagement": {
    "FeatureA": true, // Feature flag set to on
    "FeatureB": false, // Feature flag set to off
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

By convention, the `FeatureManagement` section of this JSON document is used for feature flag settings. The prior example shows three feature flags with their filters defined in the `EnabledFor` property:

* `FeatureA` is *on*.
* `FeatureB` is *off*.
* `FeatureC` specifies a filter named `Percentage` with a `Parameters` property. `Percentage` is a configurable filter. In this example, `Percentage` specifies a 50-percent probability for the `FeatureC` flag to be *on*.

## Feature flag references

So that you can easily reference feature flags in code, you should define them as `enum` variables:

```csharp
public enum MyFeatureFlags
{
    FeatureA,
    FeatureB,
    FeatureC
}
```

## Feature flag checks

The basic pattern of feature management is to first check if a feature flag is set to *on*. If so, the feature manager then runs the actions that the feature contains. For example:

```csharp
IFeatureManager featureManager;
...
if (await featureManager.IsEnabledAsync(nameof(MyFeatureFlags.FeatureA)))
{
    // Run the following code
}
```

## Dependency injection

In ASP.NET Core MVC, you can access the feature manager `IFeatureManager` through dependency injection:

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

## Controller actions

In MVC controllers, you use the `FeatureGate` attribute to control whether a whole controller class or a specific action is enabled. The following `HomeController` controller requires `FeatureA` to be *on* before any action the controller class contains can be executed:

```csharp
[FeatureGate(MyFeatureFlags.FeatureA)]
public class HomeController : Controller
{
    ...
}
```

The following `Index` action requires `FeatureA` to be *on* before it can run:

```csharp
[FeatureGate(MyFeatureFlags.FeatureA)]
public IActionResult Index()
{
    return View();
}
```

When an MVC controller or action is blocked because the controlling feature flag is *off*, a registered `IDisabledFeaturesHandler` interface is called. The default `IDisabledFeaturesHandler` interface returns a 404 status code to the client with no response body.

## MVC views

In MVC views, you can use a `<feature>` tag to render content based on whether a feature flag is enabled:

```html
<feature name="FeatureA">
    <p>This can only be seen if 'FeatureA' is enabled.</p>
</feature>
```

To display alternate content when the requirements are not met the `negate` attribute can be used.

```html
<feature name="FeatureA" negate="true">
    <p>This will be shown if 'FeatureA' is disabled.</p>
</feature>
```

The feature `<feature>` tag can also be used to show content if any or all features in a list are enabled.

```html
<feature name="FeatureA, FeatureB" requirement="All">
    <p>This can only be seen if 'FeatureA' and 'FeatureB' are enabled.</p>
</feature>
<feature name="FeatureA, FeatureB" requirement="Any">
    <p>This can be seen if 'FeatureA', 'FeatureB', or both are enabled.</p>
</feature>
```

## MVC filters

You can set up MVC filters so that they're activated based on the state of a feature flag. The following code adds an MVC filter named `SomeMvcFilter`. This filter is triggered within the MVC pipeline only if `FeatureA` is enabled. This capability is limited to `IAsyncActionFilter`. 

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

## Middleware

You can also use feature flags to conditionally add application branches and middleware. The following code inserts a middleware component in the request pipeline only when `FeatureA` is enabled:

```csharp
app.UseMiddlewareForFeature<ThirdPartyMiddleware>(nameof(MyFeatureFlags.FeatureA));
```

This code builds off the more-generic capability to branch the entire application based on a feature flag:

```csharp
app.UseForFeature(featureName, appBuilder => {
    appBuilder.UseMiddleware<T>();
});
```

## Next steps

In this tutorial, you learned how to implement feature flags in your ASP.NET Core application by using the `Microsoft.FeatureManagement` libraries. For more information about feature management support in ASP.NET Core and App Configuration, see the following resources:

* [ASP.NET Core feature flag sample code](/azure/azure-app-configuration/quickstart-feature-flag-aspnet-core)
* [Microsoft.FeatureManagement documentation](https://docs.microsoft.com/dotnet/api/microsoft.featuremanagement)
* [Manage feature flags](./manage-feature-flags.md)
