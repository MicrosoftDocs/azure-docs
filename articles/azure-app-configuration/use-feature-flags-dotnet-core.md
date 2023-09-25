---
title: Tutorial for using feature flags in a .NET app | Microsoft Docs
description: In this tutorial, you learn how to implement feature flags in .NET Core apps.
services: azure-app-configuration
documentationcenter: ''
author: maud-lv
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 07/11/2023
ms.author: malev
ms.custom: devx-track-csharp, mvc, devx-track-dotnet
#Customer intent: I want to control feature availability in my app by using the .NET Core Feature Manager library.
---

# Tutorial: Use feature flags in an ASP.NET Core app

The .NET Feature Management libraries provide idiomatic support for implementing feature flags in a .NET or ASP.NET Core application. These libraries allow you to declaratively add feature flags to your code so that you don't have to manually write code to enable or disable features with `if` statements.

The Feature Management libraries also manage feature flag lifecycles behind the scenes. For example, the libraries refresh and cache flag states, or guarantee a flag state to be immutable during a request call. In addition, the ASP.NET Core library offers out-of-the-box integrations, including MVC controller actions, views, routes, and middleware.

The [Add feature flags to an ASP.NET Core app Quickstart](./quickstart-feature-flag-aspnet-core.md) shows a simple example of how to use feature flags in an ASP.NET Core application. This tutorial shows additional setup options and capabilities of the Feature Management libraries. You can use the sample app created in the quickstart to try out the sample code shown in this tutorial. 

For the ASP.NET Core feature management API reference documentation, see [Microsoft.FeatureManagement Namespace](/dotnet/api/microsoft.featuremanagement).

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Add feature flags in key parts of your application to control feature availability.
> * Integrate with App Configuration when you're using it to manage feature flags.

## Set up feature management

To access the .NET feature manager, your app must have references to the `Microsoft.FeatureManagement.AspNetCore` NuGet package.

The .NET feature manager is configured from the framework's native configuration system. As a result, you can define your application's feature flag settings by using any configuration source that .NET supports, including the local `appsettings.json` file or environment variables.

By default, the feature manager retrieves feature flag configuration from the `"FeatureManagement"` section of the .NET Core configuration data. To use the default configuration location, call the [AddFeatureManagement](/dotnet/api/microsoft.featuremanagement.servicecollectionextensions.addfeaturemanagement) method of the **IServiceCollection** passed into the **ConfigureServices** method of the **Startup** class.

### [.NET 6.0+](#tab/core6x)

```csharp
using Microsoft.FeatureManagement;

builder.Services.AddFeatureManagement();
```

### [.NET Core 3.x](#tab/core3x)

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

---

You can specify that feature management configuration should be retrieved from a different configuration section by calling [Configuration.GetSection](/dotnet/api/microsoft.web.administration.configuration.getsection) and passing in the name of the desired section. The following example tells the feature manager to read from a different section called `"MyFeatureFlags"` instead:

### [.NET 6.0+](#tab/core6x)

```csharp
using Microsoft.FeatureManagement;

builder.Services.AddFeatureManagement(Configuration.GetSection("MyFeatureFlags"));
```

### [.NET Core 3.x](#tab/core3x)

```csharp
using Microsoft.FeatureManagement;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        ...
        services.AddFeatureManagement(Configuration.GetSection("MyFeatureFlags"));
    }
}
```

---

If you use filters in your feature flags, you must include the [Microsoft.FeatureManagement.FeatureFilters](/dotnet/api/microsoft.featuremanagement.featurefilters) namespace and add a call to [AddFeatureFilter](/dotnet/api/microsoft.featuremanagement.ifeaturemanagementbuilder.addfeaturefilter) specifying the type name of the filter you want to use as the generic type of the method. For more information on using feature filters to dynamically enable and disable functionality, see [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md).

The following example shows how to use a built-in feature filter called `PercentageFilter`:

### [.NET 6.0+](#tab/core6x)

```csharp
using Microsoft.FeatureManagement;

builder.Services.AddFeatureManagement()
    .AddFeatureFilter<PercentageFilter>();
```

### [.NET Core 3.x](#tab/core3x)

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

---

Rather than hard coding your feature flags into your application, we recommend that you keep feature flags outside the application and manage them separately. Doing so allows you to modify flag states at any time and have those changes take effect in the application right away. The Azure App Configuration service provides a dedicated portal UI for managing all of your feature flags. The Azure App Configuration service also delivers the feature flags to your application directly through its .NET Core client libraries.

The easiest way to connect your ASP.NET Core application to App Configuration is through the configuration provider included in the `Microsoft.Azure.AppConfiguration.AspNetCore` NuGet package. After including a reference to the package, follow these steps to use this NuGet package.

1. Open *Program.cs* file and add the following code.

    ### [.NET 6.0+](#tab/core6x)
    
    ```csharp
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;

    var builder = WebApplication.CreateBuilder(args);
    
    builder.Configuration.AddAzureAppConfiguration(options =>
        options.Connect(
            builder.Configuration["ConnectionStrings:AppConfig"])
            .UseFeatureFlags());
    ```

    ### [.NET Core 3.x](#tab/core3x)
    
    ```csharp
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;

    public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
            webBuilder.ConfigureAppConfiguration(config =>
            {
                var settings = config.Build();
                config.AddAzureAppConfiguration(options =>
                    options.Connect(settings["ConnectionStrings:AppConfig"]).UseFeatureFlags());
            }).UseStartup<Startup>());
    ```
    ---

2. Update the middleware and service configurations for your app using the following code.

    ### [.NET 6.0+](#tab/core6x)

    Inside the `program.cs` class, register the Azure App Configuration services and middleware on the `builder` and `app` objects:

    ```csharp
    builder.Services.AddAzureAppConfiguration();

    app.UseAzureAppConfiguration();
    ```

    ### [.NET Core 3.x](#tab/core3x)

    Open `Startup.cs` and update the `Configure` and `ConfigureServices` method to add the built-in middleware called `UseAzureAppConfiguration`. This middleware allows the feature flag values to be refreshed at a recurring interval while the ASP.NET Core web app continues to receive requests.

    ```csharp
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseAzureAppConfiguration();
    }
    ```

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAzureAppConfiguration();
    }
    ```

    ---
   
In a typical scenario, you will update your feature flag values periodically as you deploy and enable and different features of your application. By default, the feature flag values are cached for a period of 30 seconds, so a refresh operation triggered when the middleware receives a request would not update the value until the cached value expires. The following code shows how to change the cache expiration time or polling interval to 5 minutes by setting the [CacheExpirationInterval](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.featuremanagement.featureflagoptions.cacheexpirationinterval) in the call to **UseFeatureFlags**.

### [.NET 6.0+](#tab/core6x)

```csharp
config.AddAzureAppConfiguration(options =>
    options.Connect(
        builder.Configuration["ConnectionStrings:AppConfig"])
            .UseFeatureFlags(featureFlagOptions => {
                featureFlagOptions.CacheExpirationInterval = TimeSpan.FromMinutes(5);
    }));
```

### [.NET Core 3.x](#tab/core3x)

```csharp
config.AddAzureAppConfiguration(options =>
    options.Connect(settings["ConnectionStrings:AppConfig"]).UseFeatureFlags(featureFlagOptions => {
        featureFlagOptions.CacheExpirationInterval = TimeSpan.FromMinutes(5);
    }));
```

---

## Feature flag declaration

Each feature flag declaration has two parts: a name, and a list of one or more filters that are used to evaluate if a feature's state is *on* (that is, when its value is `True`). A filter defines a criterion for when a feature should be turned on.

When a feature flag has multiple filters, the filter list is traversed in order until one of the filters determines the feature should be enabled. At that point, the feature flag is *on*, and any remaining filter results are skipped. If no filter indicates the feature should be enabled, the feature flag is *off*.

The feature manager supports *appsettings.json* as a configuration source for feature flags. The following example shows how to set up feature flags in a JSON file:

```JSON
{"FeatureManagement": {
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
}
```

By convention, the `FeatureManagement` section of this JSON document is used for feature flag settings. The prior example shows three feature flags with their filters defined in the `EnabledFor` property:

* `FeatureA` is *on*.
* `FeatureB` is *off*.
* `FeatureC` specifies a filter named `Percentage` with a `Parameters` property. `Percentage` is a configurable filter. In this example, `Percentage` specifies a 50-percent probability for the `FeatureC` flag to be *on*. For a how-to guide on using feature filters, see [Use feature filters to enable conditional feature flags](./howto-feature-filters-aspnet-core.md).

## Use dependency injection to access IFeatureManager 

For some operations, such as manually checking feature flag values, you need to get an instance of [IFeatureManager](/dotnet/api/microsoft.featuremanagement.ifeaturemanager). In ASP.NET Core MVC, you can access the feature manager `IFeatureManager` through dependency injection. In the following example, an argument of type `IFeatureManager` is added to the signature of the constructor for a controller. The runtime automatically resolves the reference and provides an implementation of the interface when calling the constructor. If you're using an application template in which the controller already has one or more dependency injection arguments in the constructor, such as `ILogger`, you can just add `IFeatureManager` as an additional argument:

### [.NET 6.0+](#tab/core6x)
    
```csharp
using Microsoft.FeatureManagement;

public class HomeController : Controller
{
    private readonly IFeatureManager _featureManager;

    public HomeController(ILogger<HomeController> logger, IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }
}
```

### [.NET Core 3.x](#tab/core3x)

```csharp
using Microsoft.FeatureManagement;

public class HomeController : Controller
{
    private readonly IFeatureManager _featureManager;

    public HomeController(ILogger<HomeController> logger, IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }
}
```

---

## Feature flag references

Define feature flags as string variables in order to reference them from code:

```csharp
public static class MyFeatureFlags
{
    public const string FeatureA = "FeatureA";
    public const string FeatureB = "FeatureB";
    public const string FeatureC = "FeatureC";
}
```

## Feature flag checks

A common pattern of feature management is to check if a feature flag is set to *on* and if so, run a section of code. For example:

```csharp
IFeatureManager featureManager;
...
if (await featureManager.IsEnabledAsync(MyFeatureFlags.FeatureA))
{
    // Run the following code
}
```

## Controller actions

With MVC controllers, you can use the `FeatureGate` attribute to control whether a whole controller class or a specific action is enabled. The following `HomeController` controller requires `FeatureA` to be *on* before any action the controller class contains can be executed:

```csharp
using Microsoft.FeatureManagement.Mvc;

[FeatureGate(MyFeatureFlags.FeatureA)]
public class HomeController : Controller
{
    ...
}
```

The following `Index` action requires `FeatureA` to be *on* before it can run:

```csharp
using Microsoft.FeatureManagement.Mvc;

[FeatureGate(MyFeatureFlags.FeatureA)]
public IActionResult Index()
{
    return View();
}
```

When an MVC controller or action is blocked because the controlling feature flag is *off*, a registered [IDisabledFeaturesHandler](/dotnet/api/microsoft.featuremanagement.mvc.idisabledfeatureshandler) interface is called. The default `IDisabledFeaturesHandler` interface returns a 404 status code to the client with no response body.

## MVC views

Open *_ViewImports.cshtml* in the *Views* directory, and add the feature manager tag helper:

```html
@addTagHelper *, Microsoft.FeatureManagement.AspNetCore
```

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

You can set up MVC filters so that they're activated based on the state of a feature flag. This capability is limited to filters that implement [IAsyncActionFilter](/dotnet/api/microsoft.aspnetcore.mvc.filters.iasyncactionfilter). The following code adds an MVC filter named `ThirdPartyActionFilter`. This filter is triggered within the MVC pipeline only if `FeatureA` is enabled.  

```csharp
using Microsoft.FeatureManagement.FeatureFilters;

IConfiguration Configuration { get; set;}

public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc(options => {
        options.Filters.AddForFeature<ThirdPartyActionFilter>(MyFeatureFlags.FeatureA);
    });
}
```

## Middleware

You can also use feature flags to conditionally add application branches and middleware. The following code inserts a middleware component in the request pipeline only when `FeatureA` is enabled:

```csharp
app.UseMiddlewareForFeature<ThirdPartyMiddleware>(MyFeatureFlags.FeatureA);
```

This code builds off the more-generic capability to branch the entire application based on a feature flag:

```csharp
app.UseForFeature(featureName, appBuilder => {
    appBuilder.UseMiddleware<T>();
});
```

## Next steps

In this tutorial, you learned how to implement feature flags in your ASP.NET Core application by using the `Microsoft.FeatureManagement` libraries. For more information about feature management support in ASP.NET Core and App Configuration, see the following resources:

* [ASP.NET Core feature flag sample code](./quickstart-feature-flag-aspnet-core.md)
* [Microsoft.FeatureManagement documentation](/dotnet/api/microsoft.featuremanagement)
* [Manage feature flags](./manage-feature-flags.md)
