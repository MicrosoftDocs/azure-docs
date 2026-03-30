---
title: .NET Feature Flag Management
titleSuffix: Azure App Configuration
description: Find information about using the .NET feature management library and Azure App Configuration to implement feature flags in .NET and ASP.NET Core applications.
services: azure-app-configuration
author: rossgrambo
ms.author: rossgrambo
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.topic: article
ms.date: 07/23/2025
# customer intent: As a developer, I want to access reference information about the .NET feature management library so that I can control feature availability in my app without redeploying the app.
---

# .NET feature management

[![Microsoft.FeatureManagement](https://img.shields.io/nuget/v/Microsoft.FeatureManagement?label=Microsoft.FeatureManagement)](https://www.nuget.org/packages/Microsoft.FeatureManagement)<br>
[![Microsoft.FeatureManagement.AspNetCore](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.AspNetCore?label=Microsoft.FeatureManagement.AspNetCore)](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore)<br>
[![Microsoft.FeatureManagement.Telemetry.ApplicationInsights](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.Telemetry.ApplicationInsights?label=Microsoft.FeatureManagement.Telemetry.ApplicationInsights)](https://www.nuget.org/packages/Microsoft.FeatureManagement.Telemetry.ApplicationInsights)<br>

The .NET feature management library provides a way to develop and expose application functionality based on feature flags. When a new feature is developed, many applications have special requirements, such as when the feature should be enabled and under what conditions. This library provides a way to define these relationships. It also integrates with common .NET code patterns to make exposing these features possible.

Feature flags provide a way for .NET and ASP.NET Core applications to turn features on or off dynamically. You can use feature flags in basic use cases like conditional statements. You can also use feature flags in more advanced scenarios like conditionally adding routes or model–view–controller (MVC) filters. Feature flags are built on top of the .NET Core configuration system. Any .NET Core configuration provider is capable of acting as the backbone for feature flags.

Here are some of the benefits of using the .NET feature management library:

* It uses common conventions for feature management.
* It has a low barrier to entry:
  * It's built on the `IConfiguration` interface.
  * It supports JSON file feature flag setup.
* It provides feature flag lifetime management.
  * Configuration values can change in real time.
  * Feature flags can be consistent across the entire request.
* It covers basic to complex scenarios by offering support for the following capabilities:
  * Turning features on and off through a declarative configuration file
  * Presenting different variants of a feature to different users
  * Dynamically evaluating the state of a feature based on a call to a server
* It provides API extensions for ASP.NET Core and MVC framework in the following areas:
  * Routing
  * Filters
  * Action attributes

The .NET feature management library is open source. For more information, see the [FeatureManagement-Dotnet](https://github.com/microsoft/FeatureManagement-Dotnet) GitHub repo.

## Feature flags
Feature flags can be either enabled or disabled. The state of a flag can be made conditional by using feature filters.

### Feature filters

Feature filters define a scenario for when a feature should be enabled. To evaluate the state of a feature, its list of feature filters are traversed until one of the filters determines the feature is enabled. At this point, traversal through the feature filters stops. If no feature filter indicates that the feature should be enabled, it's considered disabled.

For example, suppose you design a Microsoft Edge browser feature filter. If an HTTP request comes from Microsoft Edge, your feature filter activates any features it's attached to.

### Feature flag configuration

The .NET Core configuration system is used to determine the state of feature flags. The foundation of this system is the `IConfiguration` interface. Any provider for `IConfiguration` can be used as the feature state provider for the feature flag library. This system supports scenarios ranging from the *appsettings.json* configuration file to Azure App Configuration.

### Feature flag declaration

The feature management library supports the *appsettings.json* configuration file as a feature flag source because it's a provider for the .NET Core `IConfiguration` system. Feature flags are declared by using the [`Microsoft Feature Management schema`](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureManagement.v2.0.0.schema.json). This schema is language agnostic in origin and is supported across all Microsoft feature management libraries.

The code in the following example declares feature flags in a JSON file:

```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Warning"
        }
    },

    // Define feature flags in a JSON file.
    "feature_management": {
        "feature_flags": [
            {
                "id": "FeatureT",
                "enabled": false
            },
            {
                "id": "FeatureU",
                "enabled": true,
                "conditions": {}
            },
            {
                "id": "FeatureV",
                "enabled": true,
                "conditions": {
                    "client_filters": [
                        {  
                            "name": "Microsoft.TimeWindow",
                            "parameters": {
                                "Start": "Sun, 01 Jun 2025 13:59:59 GMT",
                                "End": "Fri, 01 Aug 2025 00:00:00 GMT"
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

The `feature_management` section of the JSON document is used by convention to load feature flag settings. You must list feature flag objects in the `feature_flags` array in this section. This code lists three feature flags. Each feature flag object has an `id` and an `enabled` property.

* The `id` value is the name you use to identify and reference the feature flag.
* The `enabled` property specifies the enabled state of the feature flag.

A feature is off if `enabled` is `false`. If `enabled` is `true`, the state of the feature depends on the `conditions` property. The `conditions` property declares the conditions that are used to dynamically enable the feature.

* If a feature flag doesn't have a `conditions` property, the feature is on.
* If a feature flag has a `conditions` property and its conditions are met, the feature is on.
* If a feature flag has a `conditions` property and its conditions aren't met, the feature is off.

Feature filters are defined in the `client_filters` array. In the preceding code, the `FeatureV` feature flag has a feature filter named `Microsoft.TimeWindow`. This filter is an example of a configurable feature filter. In this code, this filter has a `parameters` property. This property is used to configure the filter. In this case, the start and end times for the feature to be active are configured.

**Advanced:** The colon character (`:`) is forbidden in feature flag names.

#### Requirement type

Within the `conditions` property, the `requirement_type` property is used to determine whether the filters should use `Any` or `All` logic when evaluating the state of a feature. If `requirement_type` isn't specified, the default value is `Any`. The  `requirement_type` values result in the following behavior:

* `Any`: Only one filter needs to evaluate to `true` for the feature to be enabled. 
* `All`: Every filter needs to evaluate to `true` for the feature to be enabled.

A `requirement_type` of `All` changes the way the filters are traversed:

* If no filters are listed, the feature is disabled.
* If filters are listed, they're traversed until the conditions of one specify that the feature should be disabled. If no filter indicates that the feature should be disabled, it's considered enabled.

```json
{
    "id": "FeatureW",
    "enabled": true,
    "conditions": {
        "requirement_type": "All",
        "client_filters": [
            {
                "name": "Microsoft.TimeWindow",
                "parameters": {
                    "Start": "Sun, 01 Jun 2025 13:59:59 GMT",
                    "End": "Fri, 01 Aug 00:00:00 GMT"
                }
            },
            {
                "name": "Microsoft.Percentage",
                "parameters": {
                    "Value": "50"
                }
            }
        ]
    }
}
```

In this example, the `FeatureW` feature flag has a `requirement_type` value of `All`. As a result, all its filters must evaluate to `true` for the feature to be enabled. In this case, the feature is enabled for 50 percent of users during the specified time window.

#### Handling multiple configuration sources

Starting with v4.3.0, you can opt in to custom merging for Microsoft schema feature flags (the `feature_management` section). When the same feature flag ID appears in multiple configuration sources, an instance of the built-in `ConfigurationFeatureDefinitionProvider` class merges those definitions according to configuration provider registration order. If there's a conflict, the last feature flag definition is used. This behavior differs from the default array index-based merging in .NET.

The following code enables custom feature flag configuration merging through dependency injection:

```C#
IConfiguration configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .AddJsonFile("appsettings.prod.json")
    .Build();

services.AddSingleton(configuration);
services.AddFeatureManagement();
services.Configure<ConfigurationFeatureDefinitionProviderOptions>(o =>
{
        o.CustomConfigurationMergingEnabled = true;
});
```

You can also enable custom merging when you construct an instance of `ConfigurationFeatureDefinitionProvider`:

```C#
var featureManager = new FeatureManager(
    new ConfigurationFeatureDefinitionProvider(
            configuration,
            new ConfigurationFeatureDefinitionProviderOptions
            {
                    CustomConfigurationMergingEnabled = true
            }));
```

Example behavior:

```javascript
// appsettings.json
{
    "feature_management": {
        "feature_flags": [
            { "id": "FeatureA", "enabled": true },
            { "id": "FeatureB", "enabled": false }
        ]
    }
}

// appsettings.prod.json (added later in ConfigurationBuilder)
{
    "feature_management": {
        "feature_flags": [
            { "id": "FeatureB", "enabled": true }
        ]
    }
}
```

When you enable custom merging, `FeatureA` remains enabled and `FeatureB` resolves to enabled, because the last declaration is used. When you use default .NET merging, where custom merging is disabled, arrays are merged by index. This approach can yield unexpected results if sources don't align by position.

### .NET Feature Management schema

In previous versions of the feature management library, the primary schema was the [.NET feature management schema](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/schemas/FeatureManagement.Dotnet.v1.0.0.schema.json).

Starting with version 4.0.0 of the library, new features, including variants and telemetry, aren't supported in the .NET feature management schema.

> [!NOTE]
> If the feature flag configuration includes a declaration that's listed in both the `feature_management` and `FeatureManagement` sections, the one from the `feature_management` section gets adopted.

## Consumption

In a basic implementation, feature management checks whether a feature flag is enabled. Then it performs actions based on the result. This check is done through the `IsEnabledAsync` method of `IVariantFeatureManager`.

```csharp
…
IVariantFeatureManager featureManager;
…
if (await featureManager.IsEnabledAsync("FeatureX"))
{
    // Do something.
}
```

### Service registration

Feature management relies on .NET Core dependency injection. As the following code shows, you can use standard conventions to register feature management services:

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

By default, the feature manager retrieves the feature flag configuration from the `feature_management` or `FeatureManagement` section of the .NET Core configuration data. If neither section exists, the configuration is considered empty.

> [!NOTE]
> You can also specify that the feature flag configuration should be retrieved from a different configuration section by passing the section to `AddFeatureManagement`. The following example specifies that the feature manager should read from a section called `MyFeatureFlags` instead:
>
> ```csharp
> services.AddFeatureManagement(configuration.GetSection("MyFeatureFlags"));
> ```

### Dependency injection

When you use the feature management library with MVC, you can obtain the object that implements `IVariantFeatureManager` by using dependency injection.

```csharp
public class HomeController : Controller
{
    private readonly IVariantFeatureManager _featureManager;
    
    public HomeController(IVariantFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }
}
```

### Scoped feature management services

The `AddFeatureManagement` method adds feature management services as singletons within an application. Some scenarios require feature management services to be added as scoped services instead. For example, you might want to use feature filters that consume scoped services for context information. In this case, you should use the `AddScopedFeatureManagement` method. This method ensures that feature management services, including feature filters, are added as scoped services.

```csharp
services.AddScopedFeatureManagement();
```

## ASP.NET Core integration

The feature management library provides functionality in ASP.NET Core and MVC to enable common feature flag scenarios in web applications. These capabilities are available by referencing the [Microsoft.FeatureManagement.AspNetCore](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) NuGet package.

### Controllers and actions

An MVC controller and actions can require that a given feature, or one of any list of features, be enabled in order to run. You can fulfill this requirement by using a `FeatureGateAttribute` object. The `FeatureGateAttribute` class is defined in the `Microsoft.FeatureManagement.Mvc` namespace. 

```csharp
[FeatureGate("FeatureX")]
public class HomeController : Controller
{
    …
}
```

In the preceding example, the `HomeController` class is gated by `FeatureX`. `HomeController` actions can run only if the `FeatureX` feature is enabled.

```csharp
[FeatureGate("FeatureX")]
public IActionResult Index()
{
    return View();
}
```

In the preceding example, the `Index` MVC action can run only if the `FeatureX` feature is enabled. 

### Disabled action handling

When an MVC controller or action is blocked because none of the features it specifies are enabled, a registered implementation of `IDisabledFeaturesHandler` is invoked. By default, a minimalistic handler is registered that returns an HTTP 404 error. You can override this handler by using `IFeatureManagementBuilder` when you register feature flags.

```csharp
public interface IDisabledFeaturesHandler
{
    Task HandleDisabledFeatures(IEnumerable<string> features, ActionExecutingContext context);
}
```

### View

In MVC views, you can use `<feature>` tags  to conditionally render content. You can base the rendering conditions on whether a feature is enabled or whether a specific variant of a feature is assigned. For more information, see [Variants](#variants), later in this article.

```HTML+Razor
<feature name="FeatureX">
  <p>This content appears only when 'FeatureX' is enabled.</p>
</feature>
```

```HTML+Razor
<feature name="FeatureX" variant="Alpha">
  <p>This content appears only when variant 'Alpha' of 'FeatureX' is assigned.</p>
</feature>
```

You can also negate the tag helper evaluation if you want to display content when a feature or set of features are disabled. If you specify `negate="true"`, as in the following examples, the content is rendered only when `FeatureX` is disabled.

```HTML+Razor
<feature negate="true" name="FeatureX">
  <p>This content appears only when 'FeatureX' is disabled.</p>
</feature>
```

```HTML+Razor
<feature negate="true" name="FeatureX" variant="Alpha">
  <p>This content appears only when variant 'Alpha' of 'FeatureX' isn't assigned.</p>
</feature>
```

You can use the `<feature>` tag to reference multiple features. To do so, specify a comma-separated list of features in the `name` attribute.

```HTML+Razor
<feature name="FeatureX,FeatureY">
  <p>This content appears only when 'FeatureX' and 'FeatureY' are enabled.</p>
</feature>
```

By default, all listed features must be enabled for the feature tag to be rendered. You can override this behavior by adding the `requirement` attribute, as the following example shows.

```HTML+Razor
<feature name="FeatureX,FeatureY" requirement="Any">
  <p>This content appears only when 'FeatureX,' 'FeatureY,' or both are enabled.</p>
</feature>
```

You can also use the `<feature>` tag to reference multiple variants. To do so, use a `requirement` value of `Any` and specify a comma-separated list of variants in the `variant` attribute.

```HTML+Razor
<feature name="FeatureX" variant="Alpha,Beta" requirement="Any">
  <p>This content appears only when variant 'Alpha' or 'Beta' of 'FeatureX' is assigned.</p>
</feature>
```

> [!NOTE]
> * If you specify a variant, you should specify only *one* feature. 
> * If you specify multiple variants and use a `requirement` value of `And`, an error is thrown. You can't assign multiple variants.

The `<feature>` tag requires a tag helper to work. To use the tag, add the feature management tag helper to the [\_ViewImports.cshtml](/aspnet/core/mvc/views/layout#importing-shared-directives) file.

```HTML+Razor
@addTagHelper *, Microsoft.FeatureManagement.AspNetCore
```

### MVC filters

You can set up MVC action filters that you apply conditionally based on the state of a feature. To set up these filters, you register them in a feature-aware manner. The feature management pipeline supports async MVC action filters that implement the `IAsyncActionFilter` interface.

```csharp
services.AddMvc(o => 
{
    o.Filters.AddForFeature<SomeMvcFilter>("FeatureX");
});
```

The preceding code registers an MVC filter named `SomeMvcFilter`. This filter is only triggered within the MVC pipeline if `FeatureX` is enabled.

### Razor pages

MVC Razor pages can require that a given feature, or one of any list of features, be enabled in order to run. You can add this requirement by using a `FeatureGateAttribute` object. The `FeatureGateAttribute` class is defined in the `Microsoft.FeatureManagement.Mvc` namespace.

```csharp
[FeatureGate("FeatureX")]
public class IndexModel : PageModel
{
    public void OnGet()
    {
    }
}
```

The preceding code sets up a Razor page that requires that `FeatureX` is enabled. If the feature isn't enabled, the page generates an HTTP 404 (NotFound) result.

When you use a `FeatureGateAttribute` object on Razor pages, you must place `FeatureGateAttribute` on the page handler type. You can't place it on individual handler methods.

### Application building

You can use the feature management library to add application branches and middleware that run conditionally based on the state of a feature.

```csharp
app.UseMiddlewareForFeature<ThirdPartyMiddleware>("FeatureX");
```

In the preceding code, the application adds a middleware component that appears in the request pipeline only if the `FeatureX` feature is enabled. If the feature is enabled or disabled during runtime, the middleware pipeline can be changed dynamically.

As the following code shows, this functionality builds off the more generic capability to branch the entire application based on a feature.

```csharp
app.UseForFeature(featureName, appBuilder => 
{
    appBuilder.UseMiddleware<T>();
});
```

## Implement a feature filter

Creating a feature filter provides a way to enable features based on criteria that you define. To implement a feature filter, you must implement the `IFeatureFilter` interface. `IFeatureFilter` has a single method named `EvaluateAsync`. When a feature specifies that it can be enabled for a feature filter, the `EvaluateAsync` method is called. If `EvaluateAsync` returns `true`, the feature should be enabled.

The following code demonstrates how to add a customized feature filter called `MyCriteriaFilter`.

```csharp
services.AddFeatureManagement()
        .AddFeatureFilter<MyCriteriaFilter>();
```

You can register a feature filter by calling `AddFeatureFilter<T>` on the `IFeatureManagementBuilder` implementation that `AddFeatureManagement` returns. The feature filter has access to the services in the service collection that you use to add feature flags. You can use dependency injection to retrieve these services.

> [!NOTE]
> When you reference filters in feature flag settings (for example, *appsettings.json*), you should omit the `Filter` part of the type name. For more information, see [Filter alias attribute](#filter-alias-attribute), later in this article.

### Parameterized feature filters

Some feature filters require parameters to evaluate whether a feature should be turned on. For example, a browser feature filter might turn on a feature for a certain set of browsers. You might want to turn on a feature in the Microsoft Edge and Chrome browsers but not in Firefox.

To implement this filtering, you can design a feature filter to expect parameters. You specify these parameters in the feature configuration. In code, you access them via the `FeatureFilterEvaluationContext` parameter of `IFeatureFilter.EvaluateAsync`.

```csharp
public class FeatureFilterEvaluationContext
{
    /// <summary>
    /// The name of the feature being evaluated
    /// </summary>
    public string FeatureName { get; set; }

    /// <summary>
    /// The settings provided for the feature filter to use when evaluating whether the feature should be enabled
    /// </summary>
    public IConfiguration Parameters { get; set; }
}
```

The `FeatureFilterEvaluationContext` class has a property named `Parameters`. The parameters of this property represent a raw configuration that the feature filter can use when evaluating whether the feature should be enabled. In the browser feature filter example, the filter can use the `Parameters` property to extract a set of allowed browsers that are specified for the feature. The filter can then check whether the request is from one of those browsers.

```csharp
[FilterAlias("Browser")]
public class BrowserFilter : IFeatureFilter
{
    …

    public Task<bool> EvaluateAsync(FeatureFilterEvaluationContext context)
    {
        BrowserFilterSettings settings = context.Parameters.Get<BrowserFilterSettings>() ?? new BrowserFilterSettings();

        //
        // Use the settings to check whether the request is from a browser in BrowserFilterSettings.AllowedBrowsers.
    }
}
```

### Filter alias attribute

When you register a feature filter for a feature flag, the alias you use in configuration is the name of the feature filter type with the `Filter` suffix, if any, removed. For example, you should refer to `MyCriteriaFilter` as `MyCriteria` in configuration.

```json
{
    "id": "MyFeature",
    "enabled": true,
    "conditions": {
        "client_filters": [
            {
                "name": "MyCriteria"
            }
        ]
    }
}
```
You can override this name by using the `FilterAliasAttribute` class. To declare a name to use in configuration to reference a feature filter within a feature flag, you can decorate the feature filter with this attribute.

### Missing feature filters

Suppose you configure a feature to be enabled for a specific feature filter. If that feature filter isn't registered, an exception is thrown when the feature is evaluated. As the following code shows, you can disable the exception by using feature management options. 

```csharp
services.Configure<FeatureManagementOptions>(options =>
{
    options.IgnoreMissingFeatureFilters = true;
});
```

### Use HttpContext

Feature filters can evaluate whether a feature should be enabled based on the properties of an HTTP request. This check is performed by inspecting the HTTP context. As the following code shows, a feature filter can get a reference to the HTTP context by using dependency injection to obtain an implementation of `IHttpContextAccessor`.

```csharp
public class BrowserFilter : IFeatureFilter
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BrowserFilter(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }
}
```

You must add the `IHttpContextAccessor` implementation to the dependency injection container on startup for it to be available. You can use the following method to register the implementation in the `IServiceCollection` services.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    …
    services.AddHttpContextAccessor();
    …
}
```

**Advanced:** `IHttpContextAccessor` and `HttpContext` shouldn't be used in the Razor components of server-side Blazor apps. The [recommended approach](/aspnet/core/blazor/components/httpcontext) for passing HTTP context in Blazor apps is to copy the data into a scoped service. For Blazor apps, you should use `AddScopedFeatureManagement` to register feature management services. For more information, see [Scoped feature management services](#scoped-feature-management-services), earlier in this article.

## Provide a context for feature evaluation

In console applications, there's no ambient context such as `HttpContext` that feature filters can use to check whether a feature should be on. In this case, applications need to provide an object that represents a context to the feature management system for use by feature filters. You can use `IVariantFeatureManager.IsEnabledAsync<TContext>(string featureName, TContext appContext)` to provide this context. To evaluate the state of a feature, feature filters can use the `appContext` object that you provide to the feature manager.

```csharp
MyAppContext context = new MyAppContext
{
    AccountId = current.Id
};

if (await featureManager.IsEnabledAsync(feature, context))
{
…
}
```

### Contextual feature filters

Contextual feature filters implement the `IContextualFeatureFilter<TContext>` interface. These special feature filters can take advantage of the context that's passed in when `IVariantFeatureManager.IsEnabledAsync<TContext>` is called. The `TContext` type parameter in `IContextualFeatureFilter<TContext>` describes the context type that the filter can handle. When you develop a contextual feature filter, you can establish the requirements for using the filter by specifying a context type.

Because every type is a descendant of the `Object` class, a filter that implements `IContextualFeatureFilter<object>` can be called for any provided context. The following code provides an example of a specific contextual feature filter. In this code, a feature is enabled if an account is in a configured list of enabled accounts.

```csharp
public interface IAccountContext
{
    string AccountId { get; set; }
}

[FilterAlias("AccountId")]
class AccountIdFilter : IContextualFeatureFilter<IAccountContext>
{
    public Task<bool> EvaluateAsync(FeatureFilterEvaluationContext featureEvaluationContext, IAccountContext accountId)
    {
        //
        // Evaluate whether the feature should be on by using the IAccountContext that's provided.
    }
}
```

The `AccountIdFilter` class requires an object that implements `IAccountContext` to be provided to be able to evaluate the state of a feature. When you use this feature filter, the caller needs to make sure that the passed-in object implements `IAccountContext`.

> [!NOTE]
> Only a single feature filter interface can be implemented by a single type. Trying to add a feature filter that implements more than a single feature filter interface results in an `ArgumentException` exception.

### Use contextual and non-contextual filters with the same alias

Filters that implement `IFeatureFilter` and `IContextualFeatureFilter` can share the same alias. Specifically, you can have one filter alias shared by zero or one `IFeatureFilter` implementations and zero or *N* `IContextualFeatureFilter<ContextType>` implementations if there's at most one applicable filter for `ContextType`.

To understand the process of selecting a filter when contextual and non-contextual filters of the same name are registered in an application, consider the following example.

Three filters share the `SharedFilterName` alias:

* A non-contextual filter called `FilterA`
* A contextual filter called `FilterB` that accepts a `TypeB` context
* A contextual filter called `FilterC` that accepts a `TypeC` context

A feature flag called `MyFeature` uses the `SharedFilterName` feature filter in its configuration.

If all three filters are registered:

* When you call `IsEnabledAsync("MyFeature")`, the `FilterA` filter is used to evaluate the feature flag.
* When you call `IsEnabledAsync("MyFeature", context)`:
  * If the type of `context` is `TypeB`, `FilterB` is used.
  * If the type of `context` is `TypeC`, `FilterC` is used.
  * If the type of `context` is `TypeF`, `FilterA` is used.

## Built-in feature filters

There are a few feature filters that come with the `Microsoft.FeatureManagement` package: `PercentageFilter`, `TimeWindowFilter`, `ContextualTargetingFilter`, and `TargetingFilter`. All filters except `TargetingFilter` are added **automatically** when you use the `AddFeatureManagement` method to register feature management. `TargetingFilter` is added by using the `WithTargeting` method. For more information, see [Targeting](#targeting), later in this article.

Each of the built-in feature filters has its own parameters. The following sections describe these feature filters and provide examples.

### Microsoft.Percentage

The `Microsoft.Percentage` filter provides a way to enable a feature based on a set percentage.

```json
{
    "id": "EnhancedPipeline",
    "enabled": true,
    "conditions": {
        "client_filters": [
            {
                "name": "Microsoft.Percentage",
                "parameters": {
                    "Value": 50
                }
            }
        ]
    }
}
```

### Microsoft.TimeWindow

The `Microsoft.TimeWindow` filter provides a way to enable a feature based on a time window.

- If you specify only an `End` value, the feature is considered on until that time.
- If you specify only a `Start` value, the feature is considered on at all points after that time.

```json
{
    "id": "EnhancedPipeline",
    "enabled": true,
    "conditions": {
        "client_filters": [
            {
                "name": "Microsoft.TimeWindow",
                "parameters": {
                    "Start": "Sun, 01 Jun 2025 13:59:59 GMT",
                    "End": "Fri, 01 Aug 2025 00:00:00 GMT"
                }
            }
        ]
    }
}
```

You can configure the filter to apply a time window on a recurring basis. This capability can be useful when you need to turn on a feature during a low-traffic or high-traffic period of a day or certain days of a week. To expand an individual time window to a recurring time window, you use a `Recurrence` parameter to specify a recurrence rule.

> [!NOTE]
> To use recurrence, you must specify `Start` and `End` values. With recurrence, the date part of the `End` value doesn't specify an end date for considering the filter active. Instead, the filter uses the end date, relative to the start date, to define the duration of the time window that recurs.

```json
{
    "id": "EnhancedPipeline",
    "enabled": true,
    "conditions": {
        "client_filters": [
            {
                "name": "Microsoft.TimeWindow",
                "parameters": {
                    "Start": "Fri, 22 Mar 2024 20:00:00 GMT",
                    "End": "Sat, 23 Mar 2024 02:00:00 GMT",
                    "Recurrence": {
                        "Pattern": {
                            "Type": "Daily",
                            "Interval": 1
                        },
                        "Range": {
                            "Type": "NoEnd"
                        }
                    }
                }
            }
        ]
    }
}
```

The `Recurrence` settings are made up of two parts:

* The `Pattern` settings specify how often the time window repeats.
* The `Range` settings specify for how long the recurrence pattern repeats. 

#### Recurrence pattern

There are two possible recurrence pattern types: `Daily` and `Weekly`. For example, a time window can repeat every day, every three days, every Monday, or every other Friday. 

Depending on the type, certain fields of the `Pattern` settings are required, optional, or ignored.

* `Daily`
    
  The daily recurrence pattern causes the time window to repeat based on a specified number of days between each occurrence.

  | Property | Relevance | Description |
  |----------|-----------|-------------|
  | `Type` | Required | The recurrence pattern type. Must be set to `Daily`. |
  | `Interval` | Optional | The number of days between each occurrence. The default value is `1`. |

* `Weekly`

  The weekly recurrence pattern causes the time window to repeat on the same day or days of the week. But you can specify the number of weeks between each set of occurrences.

  | Property | Relevance | Description |
  |----------|-----------|-------------|
  | `Type` | Required | The recurrence pattern type. Must be set to `Weekly`. |
  | `DaysOfWeek` | Required | The days of the week the event occurs on. |
  | `Interval` | Optional | The number of weeks between each set of occurrences. The default value is `1`. |
  | `FirstDayOfWeek` | Optional | The day to use as the first day of the week. The default value is `Sunday`. |

  The following example repeats the time window every other Monday and Tuesday:

  ```json
  "Pattern": {
      "Type": "Weekly",
      "Interval": 2,
      "DaysOfWeek": ["Monday", "Tuesday"]
  }
  ```

> [!NOTE]
> The `Start` value must be a valid first occurrence that fits the recurrence pattern. Also, the duration of the time window can't be longer than how frequently it occurs. For example, a 25-hour time window can't recur every day.

#### Recurrence range

There are three possible recurrence range types: `NoEnd`, `EndDate`, and `Numbered`.

* `NoEnd`

  The `NoEnd` range causes the recurrence to occur indefinitely.

  | Property | Relevance | Description |
  |----------|-----------|-------------|
  | `Type` | Required | The recurrence range type. Must be set to `NoEnd`. |

* `EndDate`

  The `EndDate` range causes the time window to occur on all days that fit the applicable pattern until the end date.

  | Property | Relevance | Description |
  |----------|-----------|-------------|
  | `Type` | Required | The recurrence range type. Must be set to `EndDate`. |
  | `EndDate` | Required | 	The date and time to stop applying the pattern. If the start time of the last occurrence falls before the end date, the end time of that occurrence can extend beyond it. |

  In the following example, the time window repeats every day until the last occurrence on April 1, 2024.

  ```json
  "Start": "Fri, 22 Mar 2024 18:00:00 GMT",
  "End": "Fri, 22 Mar 2024 20:00:00 GMT",
  "Recurrence":{
      "Pattern": {
          "Type": "Daily",
          "Interval": 1
      },
      "Range": {
          "Type": "EndDate",
          "EndDate": "Mon, 1 Apr 2024 20:00:00 GMT"
      }
  }
  ```

* `Numbered`

  The `Numbered` range causes the time window to occur a specified number of times.

  | Property | Relevance | Description |
  |----------|-----------|-------------|
  | `Type` | Required | The recurrence range type. Must be set to `Numbered`. |
  | `NumberOfOccurrences` | Required | The number of occurrences. |

  In the following example, the time window repeats on Monday and Tuesday for a total of three occurrences, which happen on the following dates:

  * Monday, April 1
  * Tuesday, April 2
  * Monday, April 8

  ```json
  "Start": "Mon, 1 Apr 2024 18:00:00 GMT",
  "End": "Mon, 1 Apr 2024 20:00:00 GMT",
  "Recurrence":{
      "Pattern": {
          "Type": "Weekly",
          "Interval": 1,
          "DaysOfWeek": ["Monday", "Tuesday"]
      },
      "Range": {
          "Type": "Numbered",
          "NumberOfOccurrences": 3
      }
  }
  ```

To create a recurrence rule, you must specify both `Pattern` and `Range` settings. Any pattern type can work with any range type.

**Advanced:** The time zone offset of the `Start` property is applied to the recurrence settings.

### Microsoft.Targeting

The `Microsoft.Targeting` filter provides a way to enable a feature for a target audience. For an in-depth explanation of targeting, see [Targeting](#targeting), later in this article.

The filter parameters include an `Audience` object that describes who has access to the feature. Within the `Audience` object, you can specify users, groups, excluded users and groups, and a default percentage of the user base.

For each group object that you list in the `Groups` section, you must also specify what percentage of the group's members should have access.

For each user, the feature is evaluated in the following way:

* If the user is excluded, the feature is disabled for the user. You can exclude the user by:
  * Listing their name under `Users` in the `Exclusion` section.
  * Listing a group they belong to under `Groups` in the `Exclusion` section.

* If the user isn't excluded, the feature is enabled if any of the following conditions are met:
  * The user is listed in the `Users` section.
  * The user is in the included percentage of any of the group rollouts.
  * The user falls into the default rollout percentage.

* If none of the previous cases apply, the feature is disabled for the user. For instance, if the user isn't in an included percentage, the feature is disabled.

```json
{
    "id": "EnhancedPipeline",
    "enabled": true,
    "conditions": {
        "client_filters": [
            {
                "name": "Microsoft.Targeting",
                "parameters": {
                    "Audience": {
                        "Users": [
                            "Jeff",
                            "Alicia"
                        ],
                        "Groups": [
                            {
                                "Name": "Ring0",
                                "RolloutPercentage": 100
                            },
                            {
                                "Name": "Ring1",
                                "RolloutPercentage": 50
                            }
                        ],
                        "DefaultRolloutPercentage": 20,
                        "Exclusion": {
                            "Users": [
                                "Ross"
                            ],
                            "Groups": [
                                "Ring2"
                            ]
                        }
                    }
                }
            }
        ]
    }
}
```

### Feature filter alias namespaces

All built-in feature filter aliases are in the `Microsoft` feature filter namespace. Being in this namespace prevents conflicts with other feature filters that share the same alias. The segments of a feature filter namespace are split by the `.` character. You can reference a feature filter by its fully qualified alias, such as `Microsoft.Percentage`. Or you can reference the last segment, such as `Percentage`.

## Targeting

Targeting is a feature management strategy that you can use to progressively roll out new features to your user base. The strategy is built on the concept of targeting a set of users known as the target *audience*. An audience is made up of specific users, groups, excluded users and groups, and a designated percentage of the entire user base. The groups that are included in the audience can be broken down further into percentages of their total members.

The following steps demonstrate an example of a progressive rollout for a new feature called Beta:

1. Individual users Jeff and Alicia are granted access to the Beta feature.
1. Another user, Mark, asks to opt in and is included.
1. Twenty percent of the users in the Ring1 group are included in the Beta feature.
1. The number of Ring1 users included is bumped up to 100 percent.
1. Five percent of the user base is included in the Beta feature.
1. The rollout percentage is bumped up to 100 percent to completely roll out the feature.

The library supports this strategy for rolling out a feature through the built-in [Microsoft.Targeting](#microsofttargeting) feature filter.

### Targeting in a web application

For an example of a web application that uses the targeting feature filter, see the [FeatureFlagDemo](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples/FeatureFlagDemo) example project.

To begin using `TargetingFilter` in an application, you must add it to the application's service collection just like any other feature filter. Unlike other built-in filters, `TargetingFilter` relies on another service to be added to the application's service collection. That service is an `ITargetingContextAccessor` implementation.

The `Microsoft.FeatureManagement.AspNetCore` library provides a [default implementation](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement.AspNetCore/DefaultHttpTargetingContextAccessor.cs) of `ITargetingContextAccessor` that extracts targeting information from a request's `HttpContext` value. You can use the default targeting context accessor when you set up targeting by using the nongeneric `WithTargeting` overload on `IFeatureManagementBuilder`.

To register the default targeting context accessor and `TargetingFilter`, you call `WithTargeting` on `IFeatureManagementBuilder`.

```csharp
services.AddFeatureManagement()
        .WithTargeting();
```

You can also register a customized implementation for `ITargetingContextAccessor` and `TargetingFilter` by calling `WithTargeting<T>`. The following code sets up feature management in a web application to use `TargetingFilter` with an implementation of `ITargetingContextAccessor` called `ExampleTargetingContextAccessor`.

```csharp
services.AddFeatureManagement()
        .WithTargeting<ExampleTargetingContextAccessor>();
```

#### ITargetingContextAccessor

To use `TargetingFilter` in a web application, an implementation of `ITargetingContextAccessor` is required. The reasoning behind this requirement is that contextual information, such as information about the user, is needed for targeting evaluations. This information is stored in instances of the [`TargetingContext`](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement/Targeting/TargetingContext.cs) class. Different applications extract this information from different places, such as a request's HTTP context or a database.

For an example that extracts targeting context information from an application's HTTP context, see [`DefaultHttpTargetingContextAccessor`](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement.AspNetCore/DefaultHttpTargetingContextAccessor.cs) in the `Microsoft.FeatureManagement.AspNetCore` package. It extracts the following information:

* Targeting information from the `HttpContext.User` property
* `UserId` information from the `Identity.Name` field
* `Groups` information from claims of type [`Role`](/dotnet/api/system.security.claims.claimtypes.role)

This implementation relies on the use of `IHttpContextAccessor`. For more information about `IHttpContextAccessor`, see [Use HttpContext](#use-httpcontext), earlier in this article.

### Targeting in a console application

The targeting filter relies on a targeting context to evaluate whether a feature should be turned on. This targeting context contains information such as the user that's being evaluated and the groups the user belongs to. In console applications, there's typically no ambient context available for passing this information to the targeting filter. As a result, you must pass it directly when you call `FeatureManager.IsEnabledAsync`. This type of context is supported by using `ContextualTargetingFilter`. Applications that need to send the targeting context to the feature manager should use `ContextualTargetingFilter` instead of `TargetingFilter.`

Because `ContextualTargetingFilter` implements [`IContextualTargetingFilter<ITargetingContext>`](#contextual-feature-filters), you must pass an implementation of `ITargetingContext` to `IVariantFeatureManager.IsEnabledAsync` for it to be able to evaluate and turn on a feature.

```csharp
IVariantFeatureManager fm;
…
// The userId and groups variables are defined earlier in the application.
TargetingContext targetingContext = new TargetingContext
{
   UserId = userId,
   Groups = groups
};

await fm.IsEnabledAsync(featureName, targetingContext);
```

`ContextualTargetingFilter` uses the feature filter alias `Microsoft.Targeting`, so the configuration for this filter is consistent with the information in [Microsoft.Targeting](#microsofttargeting), earlier in this article.

For an example that uses `ContextualTargetingFilter` in a console application, see the [TargetingConsoleApp](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples/TargetingConsoleApp) example project.

### Targeting evaluation options

Options are available to customize how targeting evaluation is performed across all features. You can configure these options when you set up feature management.

```csharp
services.Configure<TargetingEvaluationOptions>(options =>
{
    options.IgnoreCase = true;
});
```

### Targeting exclusion

When you define an audience, you can exclude users and groups from the audience. This functionality is useful when you roll out a feature to a group of users but you need to exclude a few users or groups from the rollout. To specify users and groups to exclude, you use the `Exclusion` property of an audience.

```json
"Audience": {
    "Users": [
        "Jeff",
        "Alicia"
    ],
    "Groups": [
        {
            "Name": "Ring0",
            "RolloutPercentage": 100
        }
    ],
    "DefaultRolloutPercentage": 0,
    "Exclusion": {
        "Users": [
            "Mark"
        ]
    }
}
```

The preceding code enables a feature for users named `Jeff` and `Alicia`. The feature is also enabled for users in the group named `Ring0`. However, the feature is disabled for the user named `Mark`, even if that user is in the `Ring0` group. Exclusions take priority over the rest of the targeting filter.

## Variants

Sometimes when you add a new feature to an application, the feature has multiple proposed design options. A/B testing provides a common solution for deciding on a design. A/B testing involves providing a different version of the feature to different segments of the user base and then choosing a version based on user interaction. In the .NET feature management library, you can implement A/B testing by using variants to represent various configurations of a feature.

Variants provide a way for a feature flag to become more than a basic on/off flag. A variant represents a value of a feature flag that can be a string, a number, a Boolean, or even a configuration object. A feature flag that declares variants should define the circumstances under which each variant should be used. For more information, see [Allocate variants](#allocate-variants), later in this article.

```csharp
public class Variant
{
    /// <summary>
    /// The name of the variant
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// The configuration of the variant
    /// </summary>
    public IConfigurationSection Configuration { get; set; }
}
```

### Retrieve variants

For each feature, you can retrieve a variant by using the `GetVariantAsync` method of the `IVariantFeatureManager` interface.

```csharp
…
IVariantFeatureManager featureManager;
…
Variant variant = await featureManager.GetVariantAsync("MyVariantFeatureFlag", CancellationToken.None);

IConfigurationSection variantConfiguration = variant.Configuration;

// Do something with the resulting variant and its configuration.
```

After you retrieve a variant, you can use its configuration directly as an implementation of `IConfigurationSection` from the variant's `Configuration` property. Another option is to bind the configuration to an object by using the .NET configuration binding pattern.

```csharp
IConfigurationSection variantConfiguration = variant.Configuration;

MyFeatureSettings settings = new MyFeatureSettings();

variantConfiguration.Bind(settings);
```

The variant that's returned depends on the user who's being evaluated. You can obtain information on the user from an instance of `TargetingContext`. You can pass in this context when you call `GetVariantAsync`. Or it can be automatically retrieved from an implementation of [`ITargetingContextAccessor`](#itargetingcontextaccessor) if one is registered.

### Variant feature flag declaration

Compared to standard feature flags, variant feature flags have two extra properties: `variants` and `allocation`. The `variants` property is an array that contains the variants defined for the feature. The `allocation` property defines how these variants should be allocated for the feature. Just like declaring standard feature flags, you can set up variant feature flags in a JSON file. The following code is an example of a variant feature flag:

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "MyVariantFeatureFlag",
                "enabled": true,
                "allocation": {
                    "default_when_enabled": "Small",
                    "group": [
                        {
                            "variant": "Big",
                            "groups": [
                                "Ring1"
                            ]
                        }
                    ]
                },
                "variants": [
                    { 
                        "name": "Big"
                    },  
                    { 
                        "name": "Small"
                    } 
                ]
            }
        ]
    }
}
```

#### Define variants

Each variant has two properties: a name and a configuration. The name is used to refer to a specific variant, and the configuration is the value of that variant. You can use the `configuration_value` property to specify the configuration. The `configuration_value` property is an inline configuration that can be a string, number, Boolean, or configuration object. If you don't configure the `configuration_value` property, the returned variant's `Configuration` property is `null`.

To specify all possible variants for a feature, you list them under the `variants` property.

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "MyVariantFeatureFlag",
                "variants": [
                    { 
                        "name": "Big", 
                        "configuration_value": {
                            "Size": 500
                        }
                    },  
                    { 
                        "name": "Small", 
                        "configuration_value": {
                            "Size": 300
                        }
                    } 
                ]
            }
        ]
    }
}
```

#### Allocate variants

To allocate a feature's variants, you use the `allocation` property of the feature.

```json
"allocation": { 
    "default_when_enabled": "Small", 
    "default_when_disabled": "Small",  
    "user": [ 
        { 
            "variant": "Big", 
            "users": [ 
                "Marsha" 
            ] 
        } 
    ], 
    "group": [ 
        { 
            "variant": "Big", 
            "groups": [ 
                "Ring1" 
            ] 
        } 
    ],
    "percentile": [ 
        { 
            "variant": "Big", 
            "from": 0, 
            "to": 10 
        } 
    ], 
    "seed": "13973240" 
},
"variants": [
    { 
        "name": "Big", 
        "configuration_value": "500px"
    },  
    { 
        "name": "Small", 
        "configuration_value": "300px"
    } 
]
```

The `allocation` setting has the following properties:

| Property | Description |
| ---------------- | ---------------- |
| `default_when_disabled` | The variant to use when a variant is requested while the feature is considered disabled. |
| `default_when_enabled` | The variant to use when a variant is requested while the feature is considered enabled and no other variant is assigned to the user. |
| `user` | A variant and a list of users to assign the variant to. | 
| `group` | A variant and a list of groups. The variant is assigned if the current user is in at least one of the groups. |
| `percentile` | A variant and a percentage range that the user's calculated percentage has to fit into for the variant to be assigned. |
| `seed` | The value that percentage calculations for `percentile` are based on. The percentage calculation for a specific user is the same across all features if the same `seed` value is used. If no `seed` value is specified, a default seed is created based on the feature name. |

If a feature isn't enabled, the feature manager assigns the variant specified for `default_when_disabled` to the current user. In the preceding example, that feature is called `Small`.

If the feature is enabled, the feature manager checks the `user`, `group`, and `percentile` allocations in that order to assign a variant. In the preceding example, the specified variant, `Big`, is assigned to the user in the following cases:

* The user being evaluated is named `Marsha`.
* The user is in the `Ring1` group.
* The user happens to fall between the zeroth and tenth percentile.

If none of these allocations match, the `default_when_enabled` variant is assigned to the user. In the example, that variant is `Small`.

Allocation logic is similar to the logic you use for the [Microsoft.Targeting](#microsofttargeting) feature filter. But there are some parameters that are present in targeting that aren't in allocation, and vice versa. The outcomes of targeting and allocation aren't related.

> [!NOTE]
> To allocate feature variants, you need to register `ITargetingContextAccessor` by calling the `WithTargeting<T>` method.

### Override enabled state by using a variant

You can use variants to override the enabled state of a feature flag. When you take advantage of this functionality, you can extend the evaluation of a feature flag. During the call to `IsEnabledAsync` on a flag with variants, the feature manager checks whether the variant assigned to the current user is configured to override the result.

You can implement overriding by using the optional variant property `status_override`. This property can have the following values:

* `None`: The variant doesn't affect whether the flag is considered enabled or disabled. `None` is the default value.
* `Enabled`: When the variant is chosen, the feature flag is evaluated as enabled.
* `Disabled`: When the variant is chosen, the feature flag is evaluated as disabled.

You can't override a feature with an `enabled` state of `false`.

If you use a feature flag with binary variants, the `status_override` property can be helpful. You can continue to use APIs like `IsEnabledAsync` and `FeatureGateAttribute` in your application. But you can also benefit from the features that come with variants, such as percentile allocation and using a seed value for percentage calculations.

```json
{
    "id": "MyVariantFeatureFlag",
    "enabled": true,
    "allocation": {
        "percentile": [
            {
                "variant": "On",
                "from": 10,
                "to": 20
            }
        ],
        "default_when_enabled":  "Off",
        "seed": "Enhanced-Feature-Group"
    },
    "variants": [
        {
            "name": "On"
        },
        {
            "name": "Off",
            "status_override": "Disabled"
        }
    ]
}
```

In the preceding example, the feature is always enabled. If the current user is in the calculated percentile range of 10 to 20, the `On` variant is returned. Otherwise, the `Off` variant is returned, and because the `status_override` value is `Disabled`, the feature is considered disabled.

### Variants in dependency injection

You can use variant feature flags together with dependency injection to expose different implementations of a service to different users. The `IVariantServiceProvider<TService>` interface provides a way to accomplish this combination.

```csharp
IVariantServiceProvider<IAlgorithm> algorithmServiceProvider;
...

IAlgorithm forecastAlgorithm = await algorithmServiceProvider.GetServiceAsync(cancellationToken); 
```

In the preceding code, the `IVariantServiceProvider<IAlgorithm>` implementation retrieves an implementation of `IAlgorithm` from the dependency injection container. The chosen implementation is dependent on:

* The feature flag that the `IAlgorithm` service is registered with.
* The allocated variant for that feature.

The `IVariantServiceProvider<T>` implementation is made available to the application by calling `IFeatureManagementBuilder.WithVariantService<T>(string featureName)`, as the following example shows. The call in this code makes `IVariantServiceProvider<IAlgorithm>` available in the service collection.

```csharp
services.AddFeatureManagement() 
        .WithVariantService<IAlgorithm>("ForecastAlgorithm");
```

You must add each implementation of `IAlgorithm` separately via an add method such as `services.AddSingleton<IAlgorithm, SomeImplementation>()`. The implementation of `IAlgorithm` that `IVariantServiceProvider` uses depends on the `ForecastAlgorithm` variant feature flag. If no implementation of `IAlgorithm` is added to the service collection, the `IVariantServiceProvider<IAlgorithm>.GetServiceAsync()` returns a task with a `null` result.

```json
{
    // The example variant feature flag
    "id": "ForecastAlgorithm",
    "enabled": true,
    "variants": [
        { 
            "Name": "AlgorithmBeta" 
        },
        ...
    ] 
}
```

#### Variant service alias attribute

The variant service provider uses the type names of implementations to match the allocated variant. If a variant service is decorated with `VariantServiceAliasAttribute`, the name declared in this attribute should be used in configuration to reference this variant service.

```csharp
[VariantServiceAlias("Beta")]
public class AlgorithmBeta : IAlgorithm
{
    ...
}
```

## Telemetry

When you deploy a feature flag change, it's often important to analyze its effect on an application. For example, here are a few questions that can arise:

* Are the flags enabled and disabled as expected?
* Are targeted users getting access to a certain feature as expected?
* Which variant is a particular user seeing?

The emission and analysis of feature flag evaluation events can help you answer these types of questions. The .NET feature management library uses the [`System.Diagnostics.Activity`](/dotnet/api/system.diagnostics.activity) API to produce tracing telemetry during feature flag evaluation.

### Enable telemetry

By default, feature flags don't have telemetry emitted. To publish telemetry for a given feature flag, the flag *must* declare that it's enabled for telemetry emission.

For feature flags defined in *appsettings.json*, you can enable telemetry by using the `telemetry` property.

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "MyFeatureFlag",
                "enabled": true,
                "telemetry": {
                    "enabled": true
                }
            }
        ]
    }
}
```

The preceding code from an *appsettings.json* file defines a feature flag named `MyFeatureFlag` that's enabled for telemetry. The telemetry state is indicated by the `telemetry` object that sets `enabled` to `true`. The value of the `enabled` property must be `true` to publish telemetry for the flag.

The `telemetry` section of a feature flag has the following properties:

| Property | Description |
| ---------------- | ---------------- |
| `enabled` | A Boolean value that specifies whether telemetry should be published for the feature flag. |
| `metadata` | A collection of key-value pairs, modeled as a dictionary, that you can use to attach custom metadata about the feature flag to evaluation events. |

> [!NOTE]
> When you use the .NET configuration provider with Azure App Configuration, [additional telemetry metadata](./reference-dotnet-provider.md#feature-flag-telemetry) is added to feature flag evaluation when telemetry is enabled.

### Custom telemetry publishing

The feature manager has its own `ActivitySource` instance named `Microsoft.FeatureManagement`. If telemetry is enabled for a feature flag:

* When a feature flag evaluation starts, the feature manager starts an instance of `Activity`.
* When a feature flag evaluation finishes, the feature manager adds an `ActivityEvent` instance named `FeatureFlag` to the current activity.

The `FeatureFlag` event has tags that include the information about the feature flag evaluation. The tags use the fields defined in the [FeatureEvaluationEvent](https://github.com/microsoft/FeatureManagement/tree/main/Schema/FeatureEvaluationEvent) schema.

> [!NOTE]
> All key-value pairs specified in the `telemetry.metadata` property of the feature flag are also included in the tags.

To enable custom telemetry publishing, you can create an instance of [`ActivityListener`](/dotnet/api/system.diagnostics.activitylistener) and listen to the `Microsoft.FeatureManagement` activity source. The following code shows you how to listen to the feature management activity source and add a callback when a feature is evaluated.

```csharp
ActivitySource.AddActivityListener(new ActivityListener()
{
    ShouldListenTo = (activitySource) => activitySource.Name == "Microsoft.FeatureManagement",
    Sample = (ref ActivityCreationOptions<ActivityContext> options) => ActivitySamplingResult.AllData,
    ActivityStopped = (activity) =>
    {
        ActivityEvent? evaluationEvent = activity.Events.FirstOrDefault((activityEvent) => activityEvent.Name == "FeatureFlag");

        if (evaluationEvent.HasValue && evaluationEvent.Value.Tags.Any())
        {
            // Do something.
        }
    }
});
```

For more information, see [Collect a distributed trace](/dotnet/core/diagnostics/distributed-tracing-collection-walkthroughs).

### Application Insights telemetry

The `Microsoft.FeatureManagement.Telemetry.ApplicationInsights` package provides a built-in telemetry publisher that sends feature flag evaluation data to [Application Insights](/azure/azure-monitor/app/app-insights-overview). The `Microsoft.FeatureManagement.Telemetry.ApplicationInsights` package also provides a telemetry initializer that automatically tags all events with `TargetingId` so that events can be linked to flag evaluations. To take advantage of this functionality, add a reference to the package and register the Application Insights telemetry. The following code provides an example:

```csharp
builder.services
    .AddFeatureManagement()
    .AddApplicationInsightsTelemetry();
```

> [!NOTE]
> To help ensure Application Insights telemetry works as expected, you should use the `TargetingHttpContextMiddleware` class.

To enable persistence of targeting context in the current activity, you can use the [`TargetingHttpContextMiddleware`](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement.AspNetCore/TargetingHttpContextMiddleware.cs) class.

```csharp
app.UseMiddleware<TargetingHttpContextMiddleware>();
```

For an example of its usage, see the [VariantAndTelemetryDemo](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples/VariantAndTelemetryDemo) example.

#### Prerequisite

The telemetry publisher that the `Microsoft.FeatureManagement.Telemetry.ApplicationInsights` package provides requires Application Insights to be [set up](/azure/azure-monitor/app/asp-net#enable-application-insights-server-side-telemetry-no-visual-studio) and registered as an application service. For sample code, see the [VariantAndTelemetryDemo](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/examples/VariantAndTelemetryDemo/Program.cs#L22-L32) example application.

## Caching

Feature state is provided by the `IConfiguration` system. Configuration providers are expected to handle any caching and dynamic updating. The feature manager asks `IConfiguration` for the latest value of a feature's state whenever it evaluates whether a feature is enabled.

### Snapshot

Some scenarios require the state of a feature to remain consistent during the lifetime of a request. The values returned from a standard `IVariantFeatureManager` implementation can change if the `IConfiguration` source that it pulls from is updated during the request.

You can prevent this behavior by using `IVariantFeatureManagerSnapshot`. You can retrieve `IVariantFeatureManagerSnapshot` in the same manner as `IVariantFeatureManager`. `IVariantFeatureManagerSnapshot` implements the `IVariantFeatureManager` interface, but `IVariantFeatureManagerSnapshot` caches the first evaluated state of a feature during a request. It returns that state during the lifetime of the feature.

## Custom feature providers

When you implement a custom feature provider, you can pull feature flags from sources such as a database or a feature management service. The default feature provider pulls feature flags from the .NET Core configuration system. This system provides support for defining features in an [appsettings.json](/aspnet/core/fundamentals/configuration/#jcp) file or in configuration providers like [Azure App Configuration](./quickstart-feature-flag-aspnet-core.md). You can customize this behavior to control where feature definitions are read from.

To customize the loading of feature definitions, you must implement the `IFeatureDefinitionProvider` interface.

```csharp
public interface IFeatureDefinitionProvider
{
    Task<FeatureDefinition> GetFeatureDefinitionAsync(string featureName);

    IAsyncEnumerable<FeatureDefinition> GetAllFeatureDefinitionsAsync();
}
```

To use an implementation of `IFeatureDefinitionProvider`, you must add it into the service collection before you add feature management. The following example adds an implementation of `IFeatureDefinitionProvider` named `InMemoryFeatureDefinitionProvider`.

```csharp
services.AddSingleton<IFeatureDefinitionProvider, InMemoryFeatureDefinitionProvider>()
        .AddFeatureManagement()
```

## Next steps

To find out how to use feature flags in your applications, see the following quickstarts:

> [!div class="nextstepaction"]
> [ASP.NET Core](./quickstart-feature-flag-aspnet-core.md)

> [!div class="nextstepaction"]
> [Aspire](./quickstart-feature-flag-aspire.md)

> [!div class="nextstepaction"]
> [.NET/.NET Framework console app](./quickstart-feature-flag-dotnet.md)

> [!div class="nextstepaction"]
> [.NET background service](./quickstart-feature-flag-dotnet-background-service.md)

To find out how to use feature filters, see the following tutorials:

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)
