---
title: .NET feature flag management
titleSuffix: Azure App Configuration
description: Learn to implement feature flags in your .NET and ASP.NET Core applications using feature management and Azure App Configuration. Dynamically manage feature rollouts, conduct A/B testing, and control feature visibility without redeploying the app.
services: azure-app-configuration
author: rossgrambo
ms.author: rossgrambo
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-dotnet
ms.topic: tutorial
ms.date: 01/07/2024
#Customer intent: I want to control feature availability in my app by using the Feature Management library.
---

# .NET Feature Management

[![Microsoft.FeatureManagement](https://img.shields.io/nuget/v/Microsoft.FeatureManagement?label=Microsoft.FeatureManagement)](https://www.nuget.org/packages/Microsoft.FeatureManagement)<br>
[![Microsoft.FeatureManagement.AspNetCore](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.AspNetCore?label=Microsoft.FeatureManagement.AspNetCore)](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore)<br>
[![Microsoft.FeatureManagement.Telemetry.ApplicationInsights](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.Telemetry.ApplicationInsights?label=Microsoft.FeatureManagement.Telemetry.ApplicationInsights)](https://www.nuget.org/packages/Microsoft.FeatureManagement.Telemetry.ApplicationInsights)<br>

.NET feature management library provides a way to develop and expose application functionality based on feature flags. Once a new feature is developed, many applications have special requirements, such as when the feature should be enabled and under what conditions. This library provides a way to define these relationships, and also integrates into common .NET code patterns to make exposing these features possible.

Feature flags provide a way for .NET and ASP.NET Core applications to turn features on or off dynamically. Developers can use feature flags in simple use cases like conditional statements to more advanced scenarios like conditionally adding routes or MVC filters. Feature flags are built on top of the .NET Core configuration system. Any .NET Core configuration provider is capable of acting as the backbone for feature flags.

Here are some of the benefits of using .NET feature management library:

* A common convention for feature management
* Low barrier-to-entry
  * Built on `IConfiguration`
  * Supports JSON file feature flag setup
* Feature Flag lifetime management
  * Configuration values can change in real-time; feature flags can be consistent across the entire request
* Simple to Complex Scenarios Covered
  * Toggle on/off features through declarative configuration file
  * Surface different variants of a feature to different users
  * Dynamically evaluate state of feature based on call to server
* API extensions for ASP.NET Core and MVC framework
  * Routing
  * Filters
  * Action Attributes

  The .NET feature management library is open source. For more information, visit the [GitHub repo](https://github.com/microsoft/FeatureManagement-Dotnet).

## Feature Flags
Feature flags can be either enabled or disabled. The state of a flag can be made conditional through the use of feature filters.

### Feature Filters
Feature filters define a scenario for when a feature should be enabled. When a feature is evaluated as on or off, its list of feature filters are traversed until one of the filters determines the feature is enabled. At this point, traversal through the feature filters stops. If no feature filter indicates that the feature should be enabled, it is considered disabled.

As an example, a Microsoft Edge browser feature filter could be designed. This feature filter would activate any features it is attached to as long as an HTTP request is coming from Microsoft Edge.

### Feature Flag Configuration

The .NET Core configuration system is used to determine the state of feature flags. The foundation of this system is `IConfiguration`. Any provider for `IConfiguration` can be used as the feature state provider for the feature flag library. This system enables scenarios ranging from appsettings.json to Azure App Configuration and more.

### Feature Flag Declaration

The feature management library supports appsettings.json as a feature flag source since it's a provider for .NET Core's `IConfiguration` system. Feature flags are declared using the [`Microsoft Feature Management schema`](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureManagement.v2.0.0.schema.json). This schema is language agnostic in origin and is supported across all Microsoft feature management libraries.

The following example declares feature flags in a json file.

``` JavaScript
{
    "Logging": {
        "LogLevel": {
            "Default": "Warning"
        }
    },

    // Define feature flags in a json file
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
                                "Start": "Mon, 01 May 2023 13:59:59 GMT",
                                "End": "Sat, 01 July 2023 00:00:00 GMT"
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

The `feature_management` section of the json document is used by convention to load feature flag settings. Feature flag objects must be listed in the `feature_flags` array under the `feature_management` section. In the previous section, we see that we have provided three different features. A feature flag has `id` and `enabled` properties. The `id` is the name used to identify and reference the feature flag. The `enabled` property specifies the enabled state of the feature flag. A feature is *OFF* if `enabled` is false. If `enabled` is true, then the state of the feature depends on the `conditions`. If there are no `conditions`, then the feature is *ON*. If there are `conditions`, and they're met, then the feature is *ON*. If there are `conditions` and they aren't met then the feature is *OFF*. The `conditions` property declares the conditions used to dynamically enable the feature. Features define their feature filters in the `client_filters` array. `FeatureV` specifies a feature filter named `Microsoft.TimeWindow`. This filter is an example of a configurable feature filter. We can see in the example that the filter has a `Parameters` property. This property is used to configure the filter. In this case, the start and end times for the feature to be active are configured.

**Advanced:** The usage of colon ':' is forbidden in feature flag names.

#### Requirement type

The `requirement_type` property of `conditions` is used to determine if the filters should use `Any` or `All` logic when evaluating the state of a feature. If `requirement_type` isn't specified, the default value is `Any`.

* `Any` means only one filter needs to evaluate to true for the feature to be enabled. 
* `All` means every filter needs to evaluate to true for the feature to be enabled.

A `requirement_type` of `All` changes the traversal. First, if there is no filter, the feature is disabled. If there are filters, then the feature filters are traversed until one of the filters decides that the feature should be disabled. If no filter indicates that the feature should be disabled, then it is considered enabled.

``` JavaScript
{
    "id": "FeatureW",
    "enabled": true,
    "conditions": {
        "requirement_type": "All",
        "client_filters": [
            {
                "name": "Microsoft.TimeWindow",
                "parameters": {
                    "Start": "Mon, 01 May 2023 13:59:59 GMT",
                    "End": "Sat, 01 Jul 2023 00:00:00 GMT"
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

In this example, `FeatureW` specifies a `requirement_type` of `All`, meaning all of its filters must evaluate to true for the feature to be enabled. In this case, the feature is enabled for 50% of users during the specified time window.

### .NET Feature Management schema

In previous versions, the primary schema for the feature management library was the [`.NET feature management schema`](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/schemas/FeatureManagement.Dotnet.v1.0.0.schema.json). Starting from v4.0.0, new features including variants and telemetry are not supported for the .NET feature management schema.

> [!NOTE]
> If there is a feature flag declaration that can be found in both the `feature_management` and `FeatureManagement` sections, the one from the `feature_management` section will be adopted.

## Consumption

The basic form of feature management is checking if a feature flag is enabled and then performing actions based on the result. This check is done through the `IVariantFeatureManager`'s `IsEnabledAsync` method.

``` C#
…
IVariantFeatureManager featureManager;
…
if (await featureManager.IsEnabledAsync("FeatureX"))
{
    // Do something
}
```

### Service Registration

Feature management relies on .NET Core dependency injection. We can register the feature management services using standard conventions.

``` C#
using Microsoft.FeatureManagement;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddFeatureManagement();
    }
}
```

By default, the feature manager retrieves feature flag configuration from the "FeatureManagement" section of the .NET Core configuration data. If the "FeatureManagement" section doesn't exist, the configuration is considered empty.

> [!NOTE]
> You can also specify that feature flag configuration should be retrieved from a different configuration section by passing the section to `AddFeatureManagement`. The following example tells the feature manager to read from a different section called "MyFeatureFlags" instead:
>
> ``` C#
> services.AddFeatureManagement(configuration.GetSection("MyFeatureFlags"));
> ```

### Dependency Injection

When using the feature management library with MVC, the `IVariantFeatureManager` can be obtained through dependency injection.

``` C#
public class HomeController : Controller
{
    private readonly IVariantFeatureManager _featureManager;
    
    public HomeController(IVariantFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }
}
```

### Scoped Feature Management Services

The `AddFeatureManagement` method adds feature management services as singletons within the application, but there are scenarios where it may be necessary for feature management services to be added as scoped services instead. For example, users may want to use feature filters that consume scoped services for context information. In this case, the `AddScopedFeatureManagement` method should be used instead. This method ensures that feature management services, including feature filters, are added as scoped services.

``` C#
services.AddScopedFeatureManagement();
```

## ASP.NET Core Integration

The feature management library provides functionality in ASP.NET Core and MVC to enable common feature flag scenarios in web applications. These capabilities are available by referencing the [Microsoft.FeatureManagement.AspNetCore](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) NuGet package.

### Controllers and Actions

MVC controller and actions can require that a given feature, or one of any list of features, be enabled in order to execute. This requirement can be done by using a `FeatureGateAttribute`, which can be found in the `Microsoft.FeatureManagement.Mvc` namespace. 

``` C#
[FeatureGate("FeatureX")]
public class HomeController : Controller
{
    …
}
```

In this example, the `HomeController` is gated by "FeatureX". "FeatureX" must be enabled before any action the `HomeController` contains can be executed. 

``` C#
[FeatureGate("FeatureX")]
public IActionResult Index()
{
    return View();
}
```

In this example, the `Index` MVC action requires "FeatureX" to be enabled before it can be executed. 

### Disabled Action Handling

When an MVC controller or action is blocked because none of the features it specifies are enabled, a registered `IDisabledFeaturesHandler` is invoked. By default, a minimalistic handler is registered which returns HTTP 404. This handler can be overridden using the `IFeatureManagementBuilder` when registering feature flags.

``` C#
public interface IDisabledFeaturesHandler
{
    Task HandleDisabledFeature(IEnumerable<string> features, ActionExecutingContext context);
}
```

### View

In MVC views `<feature>` tags can be used to conditionally render content based on whether a feature is enabled or whether specific variant of a feature is assigned. For more information, see the [variants](#variants) section.

``` HTML+Razor
<feature name="FeatureX">
  <p>This can only be seen if 'FeatureX' is enabled.</p>
</feature>
```

``` HTML+Razor
<feature name="FeatureX" variant="Alpha">
  <p>This can only be seen if variant 'Alpha' of 'FeatureX' is assigned.</p>
</feature>
```

You can also negate the tag helper evaluation to display content when a feature or set of features are disabled. By setting `negate="true"` in the following example, the content is only rendered if `FeatureX` is disabled.

``` HTML+Razor
<feature negate="true" name="FeatureX">
  <p>This can only be seen if 'FeatureX' is disabled.</p>
</feature>
```

``` HTML+Razor
<feature negate="true" name="FeatureX" variant="Alpha">
  <p>This can only be seen if variant 'Alpha' of 'FeatureX' isn't assigned.</p>
</feature>
```

The `<feature>` tag can reference multiple features/variants by specifying a comma separated list of features/variants in the `name`/`variant` attribute. 

``` HTML+Razor
<feature name="FeatureX,FeatureY">
  <p>This can only be seen if 'FeatureX' and 'FeatureY' are enabled.</p>
</feature>
```

``` HTML+Razor
<feature name="FeatureX" variant="Alpha,Beta">
  <p>This can only be seen if variant 'Alpha' or 'Beta' of 'FeatureX' is assigned.</p>
</feature>
```

> [!NOTE]
> If `variant` is specified, only *one* feature should be specified. 

By default, all listed features must be enabled for the feature tag to be rendered. This behavior can be overridden by adding the `requirement` attribute as seen in the following example.

> [!NOTE]
> If a `requirement` of `And` is used in conjunction with `variant` an error will be thrown, as multiple variants can never be assigned.

``` HTML+Razor
<feature name="FeatureX,FeatureY" requirement="Any">
  <p>This can only be seen if either 'FeatureX' or 'FeatureY' or both are enabled.</p>
</feature>
```

The `<feature>` tag requires a tag helper to work. To use the tag, add the feature management tag helper to the _ViewImports.cshtml_ file.
``` HTML+Razor
@addTagHelper *, Microsoft.FeatureManagement.AspNetCore
```

### MVC Filters

MVC action filters can be set up to conditionally execute based on the state of a feature. This is done by registering MVC filters in a feature aware manner.
The feature management pipeline supports async MVC Action filters, which implement `IAsyncActionFilter`.

``` C#
services.AddMvc(o => 
{
    o.Filters.AddForFeature<SomeMvcFilter>("FeatureX");
});
```

This code adds an MVC filter named `SomeMvcFilter`. This filter is only triggered within the MVC pipeline if "FeatureX" is enabled.

### Razor Pages

MVC Razor pages can require that a given feature, or one of any list of features, be enabled in order to execute. This requirement can be added by using a `FeatureGateAttribute`, which can be found in the `Microsoft.FeatureManagement.Mvc` namespace. 

``` C#
[FeatureGate("FeatureX")]
public class IndexModel : PageModel
{
    public void OnGet()
    {
    }
}
```

The code above sets up a Razor page to require the "FeatureX" to be enabled. If the feature is not enabled, the page generates an HTTP 404 (NotFound) result.

When used on Razor pages, the `FeatureGateAttribute` must be placed on the page handler type. It can't be placed on individual handler methods.

### Application building

The feature management library can be used to add application branches and middleware that execute conditionally based on feature state.

``` C#
app.UseMiddlewareForFeature<ThirdPartyMiddleware>("FeatureX");
```

With the above call, the application adds a middleware component that only appears in the request pipeline if the feature "FeatureX" is enabled. If the feature is enabled/disabled during runtime, the middleware pipeline can be changed dynamically.

This builds off the more generic capability to branch the entire application based on a feature.

``` C#
app.UseForFeature(featureName, appBuilder => 
{
    appBuilder.UseMiddleware<T>();
});
```

## Implementing a Feature Filter

Creating a feature filter provides a way to enable features based on criteria that you define. To implement a feature filter, the `IFeatureFilter` interface must be implemented. `IFeatureFilter` has a single method named `EvaluateAsync`. When a feature specifies that it can be enabled for a feature filter, the `EvaluateAsync` method is called. If `EvaluateAsync` returns `true`, it means the feature should be enabled.

The following snippet demonstrates how to add a customized feature filter `MyCriteriaFilter`.

``` C#
services.AddFeatureManagement()
        .AddFeatureFilter<MyCriteriaFilter>();
```

Feature filters are registered by calling `AddFeatureFilter<T>` on the `IFeatureManagementBuilder` returned from `AddFeatureManagement`. These feature filters have access to the services that exist within the service collection that was used to add feature flags. Dependency injection can be used to retrieve these services.

> [!NOTE]
> When filters are referenced in feature flag settings (for example, appsettings.json), the _Filter_ part of the type name should be omitted. For more information, see the [`Filter Alias Attribute`](#filter-alias-attribute) section.

### Parameterized Feature Filters

Some feature filters require parameters to decide whether a feature should be turned on or not. For example, a browser feature filter may turn on a feature for a certain set of browsers. It may be desired that Edge and Chrome browsers enable a feature, while Firefox does not. To do this filtering, a feature filter can be designed to expect parameters. These parameters would be specified in the feature configuration, and in code would be accessible via the `FeatureFilterEvaluationContext` parameter of `IFeatureFilter.EvaluateAsync`.

``` C#
public class FeatureFilterEvaluationContext
{
    /// <summary>
    /// The name of the feature being evaluated.
    /// </summary>
    public string FeatureName { get; set; }

    /// <summary>
    /// The settings provided for the feature filter to use when evaluating whether the feature should be enabled.
    /// </summary>
    public IConfiguration Parameters { get; set; }
}
```

`FeatureFilterEvaluationContext` has a property named `Parameters`. These parameters represent a raw configuration that the feature filter can use to decide how to evaluate whether the feature should be enabled or not. To use the browser feature filter as an example once again, the filter could use `Parameters` to extract a set of allowed browsers that would be specified for the feature and then check if the request is being sent from one of those browsers.

``` C#
[FilterAlias("Browser")]
public class BrowserFilter : IFeatureFilter
{
    …

    public Task<bool> EvaluateAsync(FeatureFilterEvaluationContext context)
    {
        BrowserFilterSettings settings = context.Parameters.Get<BrowserFilterSettings>() ?? new BrowserFilterSettings();

        //
        // Here we would use the settings and see if the request was sent from any of BrowserFilterSettings.AllowedBrowsers
    }
}
```

### Filter Alias Attribute

When a feature filter is registered for a feature flag, the alias used in configuration is the name of the feature filter type with the _Filter_ suffix, if any, removed. For example, `MyCriteriaFilter` would be referred to as _MyCriteria_ in configuration.

``` JavaScript
"MyFeature": {
    "EnabledFor": [
        {
            "Name": "MyCriteria"
        }
    ]
}
```
This name can be overridden by using the `FilterAliasAttribute`. A feature filter can be decorated with this attribute to declare the name that should be used in configuration to reference this feature filter within a feature flag.

### Missing Feature Filters

If a feature is configured to be enabled for a specific feature filter and that feature filter isn't registered, an exception is thrown when the feature is evaluated. The exception can be disabled by using the feature management options. 

``` C#
services.Configure<FeatureManagementOptions>(options =>
{
    options.IgnoreMissingFeatureFilters = true;
});
```

### Using HttpContext

Feature filters can evaluate whether a feature should be enabled based on the properties of an HTTP Request. This is performed by inspecting the HTTP Context. A feature filter can get a reference to the HTTP Context by obtaining an `IHttpContextAccessor` through dependency injection.

``` C#
public class BrowserFilter : IFeatureFilter
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BrowserFilter(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
    }
}
```

The `IHttpContextAccessor` must be added to the dependency injection container on startup for it to be available. It can be registered in the `IServiceCollection` using the following method.

``` C#
public void ConfigureServices(IServiceCollection services)
{
    …
    services.AddHttpContextAccessor();
    …
}
```

**Advanced:** `IHttpContextAccessor`/`HttpContext` should not be used in the Razor components of server-side Blazor apps. [The recommended approach](/aspnet/core/blazor/security/server/interactive-server-side-rendering#ihttpcontextaccessorhttpcontext-in-razor-components) for passing http context in Blazor apps is to copy the data into a scoped service. For Blazor apps, `AddScopedFeatureManagement` should be used to register the feature management services. For more information, see the [`Scoped Feature Management Services`](#scoped-feature-management-services) section.

## Provide a Context For Feature Evaluation

In console applications, there's no ambient context such as `HttpContext` that feature filters can acquire and utilize to check if a feature should be on or off. In this case, applications need to provide an object representing a context into the feature management system for use by feature filters. This context can be given using `IVariantFeatureManager.IsEnabledAsync<TContext>(string featureName, TContext appContext)`. The appContext object that is provided to the feature manager can be used by feature filters to evaluate the state of a feature.

``` C#
MyAppContext context = new MyAppContext
{
    AccountId = current.Id;
}

if (await featureManager.IsEnabledAsync(feature, context))
{
…
}
```

### Contextual Feature Filters

Contextual feature filters implement the `IContextualFeatureFilter<TContext>` interface. These special feature filters can take advantage of the context that is passed in when `IVariantFeatureManager.IsEnabledAsync<TContext>` is called. The `TContext` type parameter in `IContextualFeatureFilter<TContext>` describes what context type the filter is capable of handling. This allows the developer of a contextual feature filter to describe what is required for those who wish to utilize it. Since every type is a descendant of object, a filter that implements `IContextualFeatureFilter<object>` can be called for any provided context. To illustrate an example of a more specific contextual feature filter, consider a feature that is enabled if an account is in a configured list of enabled accounts. 

``` C#
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
        // Evaluate if the feature should be on with the help of the provided IAccountContext
    }
}
```

We can see that the `AccountIdFilter` requires an object that implements `IAccountContext` to be provided to be able to evaluate the state of a feature. When using this feature filter, the caller needs to make sure that the passed in object implements `IAccountContext`.

> [!NOTE]
> Only a single feature filter interface can be implemented by a single type. Trying to add a feature filter that implements more than a single feature filter interface results in an `ArgumentException`.

### Using Contextual and Non-contextual Filters With the Same Alias

Filters of `IFeatureFilter` and `IContextualFeatureFilter` can share the same alias. Specifically, you can have one filter alias shared by 0 or 1 `IFeatureFilter` and 0 or N `IContextualFeatureFilter<ContextType>`, so long as there is at most one applicable filter for `ContextType`.

The following passage describes the process of selecting a filter when contextual and non-contextual filters of the same name are registered in an application.

Let's say you have a non-contextual filter called `FilterA` and two contextual filters `FilterB` and FilterC that accept `TypeB` and `TypeC` contexts respectively. All three filters share the same alias `SharedFilterName`.

You also have a feature flag `MyFeature` that uses the feature filter `SharedFilterName` in its configuration.

If all of three filters are registered:
* When you call IsEnabledAsync("MyFeature"), the `FilterA` is used to evaluate the feature flag.
* When you call IsEnabledAsync("MyFeature", context), if context's type is `TypeB`, `FilterB` is used. If context's type is `TypeC`, `FilterC` is used.
* When you call IsEnabledAsync("MyFeature", context), if context's type is `TypeF`, `FilterA` is used.

## Built-In Feature Filters

There are a few feature filters that come with the `Microsoft.FeatureManagement` package: `PercentageFilter`, `TimeWindowFilter`, `ContextualTargetingFilter` and `TargetingFilter`. All filters, except for the `TargetingFilter`, are added **automatically** when feature management is registered by `AddFeatureManagement` method. The `TargetingFilter` is added with the `WithTargeting` method that is detailed in the `Targeting` section.

Each of the built-in feature filters has its own parameters. Here's the list of feature filters along with examples.

### Microsoft.Percentage

This filter provides the capability to enable a feature based on a set percentage.

``` JavaScript
"EnhancedPipeline": {
    "EnabledFor": [
        {
            "Name": "Microsoft.Percentage",
            "Parameters": {
                "Value": 50
            }
        }
    ]
}
```

### Microsoft.TimeWindow

This filter provides the capability to enable a feature based on a time window. If only `End` is specified, the feature is considered on until that time. If only `Start` is specified, the feature is considered on at all points after that time.

``` JavaScript
"EnhancedPipeline": {
    "EnabledFor": [
        {
            "Name": "Microsoft.TimeWindow",
            "Parameters": {
                "Start": "Wed, 01 May 2019 13:59:59 GMT",
                "End": "Mon, 01 Jul 2019 00:00:00 GMT"
            }
        }
    ]
}
```

The time window can be configured to recur periodically. This can be useful for the scenarios where one may need to turn on a feature during a low or high traffic period of a day or certain days of a week. To expand the individual time window to recurring time windows, the recurrence rule should be specified in the `Recurrence` parameter.

> [!NOTE]
> `Start` and `End` must be both specified to enable `Recurrence`.

``` JavaScript
"EnhancedPipeline": {
    "EnabledFor": [
        {
            "Name": "Microsoft.TimeWindow",
            "Parameters": {
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
```

The `Recurrence` settings are made up of two parts: `Pattern` (how often the time window repeats) and `Range` (for how long the recurrence pattern repeats). 

#### Recurrence Pattern

There are two possible recurrence pattern types: `Daily` and `Weekly`. For example, a time window could repeat "every day", "every three days", "every Monday" or "every other Friday". 

Depending on the type, certain fields of the `Pattern` are required, optional, or ignored.

- `Daily`
    
    The daily recurrence pattern causes the time window to repeat based on a number of days between each occurrence.

    | Property | Relevance | Description |
    |----------|-----------|-------------|
    | **Type** | Required | Must be set to `Daily`. |
    | **Interval** | Optional | Specifies the number of days between each occurrence. Default value is 1. |

- `Weekly`

    The weekly recurrence pattern causes the time window to repeat on the same day or days of the week, based on the number of weeks between each set of occurrences.

    | Property | Relevance | Description |
    |----------|-----------|-------------|
    | **Type** | Required | Must be set to `Weekly`. |
    | **DaysOfWeek** | Required | Specifies on which days of the week the event occurs. |
    | **Interval** | Optional | Specifies the number of weeks between each set of occurrences. Default value is 1. |
    | **FirstDayOfWeek** | Optional | Specifies which day is considered the first day of the week. Default value is `Sunday`. |

    The following example repeats the time window every other Monday and Tuesday

    ``` javascript
    "Pattern": {
        "Type": "Weekly",
        "Interval": 2,
        "DaysOfWeek": ["Monday", "Tuesday"]
    }
    ```

> [!NOTE]
> `Start` must be a valid first occurrence that fits the recurrence pattern. Additionally, the duration of the time window can't be longer than how frequently it occurs. For example, it's invalid to have a 25-hour time window recur every day.

#### Recurrence Range

There are three possible recurrence range types: `NoEnd`, `EndDate` and `Numbered`.

- `NoEnd`

    The `NoEnd` range causes the recurrence to occur indefinitely.

    | Property | Relevance | Description |
    |----------|-----------|-------------|
    | **Type** | Required | Must be set to `NoEnd`. |

- `EndDate`

    The `EndDate` range causes the time window to occur on all days that fit the applicable pattern until the end date.

    | Property | Relevance | Description |
    |----------|-----------|-------------|
    | **Type** | Required | Must be set to `EndDate`. |
    | **EndDate** | Required | 	Specifies the date time to stop applying the pattern. As long as the start time of the last occurrence falls before the end date, the end time of that occurrence is allowed to extend beyond it. |

    The following example will repeat the time window every day until the last occurrence happens on April 1, 2024.

    ``` javascript
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

- `Numbered`

    The `Numbered` range causes the time window to occur a fixed number of times (based on the pattern).

    | Property | Relevance | Description |
    |----------|-----------|-------------|
    | **Type** | Required | Must be set to `Numbered`. |
    | **NumberOfOccurrences** | Required | 	Specifies the number of occurrences. |

    The following example will repeat the time window on Monday and Tuesday until there are three occurrences, which respectively happen on April 1(Mon), April 2(Tue) and April 8(Mon).

    ``` javascript
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

To create a recurrence rule, you must specify both `Pattern` and `Range`. Any pattern type can work with any range type.

**Advanced:** The time zone offset of the `Start` property is applied to the recurrence settings.

### Microsoft.Targeting

This filter provides the capability to enable a feature for a target audience. An in-depth explanation of targeting is explained in the [targeting](#targeting) section. The filter parameters include an `Audience` object that describes users, groups, excluded users/groups, and a default percentage of the user base that should have access to the feature. Each group object that is listed in the `Groups` section must also specify what percentage of the group's members should have access. If a user is specified in the `Exclusion` section, either directly or if the user is in an excluded group, the feature is disabled. Otherwise, if a user is specified in the `Users` section directly, or if the user is in the included percentage of any of the group rollouts, or if the user falls into the default rollout percentage then that user will have the feature enabled.

``` JavaScript
"EnhancedPipeline": {
    "EnabledFor": [
        {
            "Name": "Microsoft.Targeting",
            "Parameters": {
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
```

### Feature Filter Alias Namespaces

All of the built-in feature filter alias' are in the `Microsoft` feature filter namespace. This namespace is to prevent conflicts with other feature filters that may share the same alias. The segments of a feature filter namespace are split by the '.' character. A feature filter can be referenced by its fully qualified alias such as `Microsoft.Percentage` or by the last segment which in the case of `Microsoft.Percentage` is `Percentage`.

## Targeting

Targeting is a feature management strategy that enables developers to progressively roll out new features to their user base. The strategy is built on the concept of targeting a set of users known as the target _audience_. An audience is made up of specific users, groups, excluded users/groups, and a designated percentage of the entire user base. The groups that are included in the audience can be broken down further into percentages of their total members.

The following steps demonstrate an example of a progressive rollout for a new 'Beta' feature:

1. Individual users Jeff and Alicia are granted access to the Beta
2. Another user, Mark, asks to opt in and is included.
3. Twenty percent of a group known as "Ring1" users are included in the Beta.
5. The number of "Ring1" users included in the beta is bumped up to 100 percent.
5. Five percent of the user base is included in the beta.
6. The rollout percentage is bumped up to 100 percent and the feature is completely rolled out.

This strategy for rolling out a feature is built into the library through the included [Microsoft.Targeting](#microsofttargeting) feature filter.

### Targeting in a Web Application

An example web application that uses the targeting feature filter is available in the [FeatureFlagDemo](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples/FeatureFlagDemo) example project.

To begin using the `TargetingFilter` in an application, it must be added to the application's service collection just as any other feature filter. Unlike other built-in filters, the `TargetingFilter` relies on another service to be added to the application's service collection. That service is an `ITargetingContextAccessor`.

`Microsoft.FeatureManagement.AspNetCore` provides a [default implementation](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement.AspNetCore/DefaultHttpTargetingContextAccessor.cs) of `ITargetingContextAccessor` which will extract targeting info from a request's `HttpContext`. You can use the default targeting context accessor when setting up targeting by using the non-generic `WithTargeting` overload on the `IFeatureManagementBuilder`.

The default targeting context accessor and `TargetingFilter` are registered by calling `WithTargeting` on the `IFeatureManagementBuilder`.

``` C#
services.AddFeatureManagement()
        .WithTargeting();
```

You can also register a customized implementation for `ITargetingContextAccessor` and `TargetingFilter` by calling `WithTargeting<T>`. Here's an example setting up feature management in a web application to use the `TargetingFilter` with an implementation of `ITargetingContextAccessor` called `ExampleTargetingContextAccessor`.

``` C#
services.AddFeatureManagement()
        .WithTargeting<ExampleTargetingContextAccessor>();
```

#### ITargetingContextAccessor

To use the `TargetingFilter` in a web application, an implementation of `ITargetingContextAccessor` is required. This requirement is because when a targeting evaluation is being performed, contextual information such as what user is currently being evaluated is needed. This information is known as the [`TargetingContext`](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement/Targeting/TargetingContext.cs). Different applications may extract this information from different places. Some common examples of where an application may pull the targeting context are the request's HTTP context or a database.

An example that extracts targeting context information from the application's HTTP context is the [`DefaultHttpTargetingContextAccessor`](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement.AspNetCore/DefaultHttpTargetingContextAccessor.cs) provided by the `Microsoft.FeatureManagement.AspNetCore` package. It will extract targeting info from `HttpContext.User`. `UserId` information will be extracted from the `Identity.Name` field and `Groups` information will be extracted from claims of type [`Role`](/dotnet/api/system.security.claims.claimtypes.role). This implementation relies on the use of `IHttpContextAccessor`, which is discussed [here](#using-httpcontext).

### Targeting in a Console Application

The targeting filter relies on a targeting context to evaluate whether a feature should be turned on. This targeting context contains information such as what user is currently being evaluated, and what groups the user in. In console applications, there's typically no ambient context available to flow this information into the targeting filter, thus it must be passed directly when `FeatureManager.IsEnabledAsync` is called. This type of context is supported by using the `ContextualTargetingFilter`. Applications that need to float the targeting context into the feature manager should use this instead of the `TargetingFilter.`

Since `ContextualTargetingFilter` is an [`IContextualTargetingFilter<ITargetingContext>`](#contextual-feature-filters), an implementation of `ITargetingContext` must be passed in to `IVariantFeatureManager.IsEnabledAsync` for it to be able to evaluate and turn on a feature.

``` C#
IVariantFeatureManager fm;
…
// userId and groups defined somewhere earlier in application
TargetingContext targetingContext = new TargetingContext
{
   UserId = userId,
   Groups = groups
};

await fm.IsEnabledAsync(featureName, targetingContext);
```

The `ContextualTargetingFilter` still uses the feature filter alias [Microsoft.Targeting](#microsofttargeting), so the configuration for this filter is consistent with what is mentioned in that section.

An example that uses the `ContextualTargetingFilter` in a console application is available in the [TargetingConsoleApp](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples/TargetingConsoleApp) example project.

### Targeting Evaluation Options

Options are available to customize how targeting evaluation is performed across all features. These options can be configured when setting up feature management.

``` C#
services.Configure<TargetingEvaluationOptions>(options =>
{
    options.IgnoreCase = true;
});
```

### Targeting Exclusion

When defining an Audience, users and groups can be excluded from the audience. Excluding is useful when a feature is being rolled out to a group of users, but a few users or groups need to be excluded from the rollout. Exclusion is defined by adding a list of users and groups to the `Exclusion` property of the audience.
``` JavaScript
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

In the above example, the feature is enabled for users named `Jeff` and `Alicia`. It's also enabled for users in the group named `Ring0`. However, if the user is named `Mark`, the feature is disabled, regardless of if they are in the group `Ring0` or not. Exclusions take priority over the rest of the targeting filter.

## Variants

When new features are added to an application, there may come a time when a feature has multiple different proposed design options. A common solution for deciding on a design is some form of A/B testing, which involves providing a different version of the feature to different segments of the user base and choosing a version based on user interaction. In this library, this functionality is enabled by representing different configurations of a feature with variants.

Variants enable a feature flag to become more than a simple on/off flag. A variant represents a value of a feature flag that can be a string, a number, a boolean, or even a configuration object. A feature flag that declares variants should define under what circumstances each variant should be used, which is covered in greater detail in the [Allocating Variants](#allocating-variants) section.

``` C#
public class Variant
{
    /// <summary>
    /// The name of the variant.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// The configuration of the variant.
    /// </summary>
    public IConfigurationSection Configuration { get; set; }
}
```

### Getting Variants

For each feature, a variant can be retrieved using the `IVariantFeatureManager`'s `GetVariantAsync` method.

``` C#
…
IVariantFeatureManager featureManager;
…
Variant variant = await featureManager.GetVariantAsync("MyVariantFeatureFlag", CancellationToken.None);

IConfigurationSection variantConfiguration = variant.Configuration;

// Do something with the resulting variant and its configuration
```

Once a variant is retrieved, the configuration of a variant can be used directly as an `IConfigurationSection` from the variant's `Configuration` property. Another option is to bind the configuration to an object using .NET's configuration binding pattern.

``` C#
IConfigurationSection variantConfiguration = variant.Configuration;

MyFeatureSettings settings = new MyFeatureSettings();

variantConfiguration.Bind(settings);
```

The variant returned is dependent on the user currently being evaluated, and that information is obtained from an instance of `TargetingContext`. This context can either be passed in when calling `GetVariantAsync` or it can be automatically retrieved from an implementation of [`ITargetingContextAccessor`](#itargetingcontextaccessor) if one is registered.

### Variant Feature Flag Declaration

Compared to normal feature flags, variant feature flags have two additional properties: `variants` and `allocation`. The `variants` property is an array that contains the variants defined for this feature. The `allocation` property defines how these variants should be allocated for the feature. Just like declaring normal feature flags, you can set up variant feature flags in a json file. Here is an example of a variant feature flag.

``` javascript
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

#### Defining Variants

Each variant has two properties: a name and a configuration. The name is used to refer to a specific variant, and the configuration is the value of that variant. The configuration can be set using `configuration_value` property. `configuration_value` is an inline configuration that can be a string, number, boolean, or configuration object. If `configuration_value` is not specified, the returned variant's `Configuration` property will be null.

A list of all possible variants is defined for each feature under the `variants` property.

``` javascript
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

#### Allocating Variants

The process of allocating a feature's variants is determined by the `allocation` property of the feature.

``` javascript
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

The `allocation` setting of a feature has the following properties:

| Property | Description |
| ---------------- | ---------------- |
| `default_when_disabled` | Specifies which variant should be used when a variant is requested while the feature is considered disabled. |
| `default_when_enabled` | Specifies which variant should be used when a variant is requested while the feature is considered enabled and no other variant was assigned to the user. |
| `user` | Specifies a variant and a list of users to whom that variant should be assigned. | 
| `group` | Specifies a variant and a list of groups. The variant will be assigned if the user is in at least one of the groups. |
| `percentile` | Specifies a variant and a percentage range the user's calculated percentage has to fit into for that variant to be assigned. |
| `seed` | The value which percentage calculations for `percentile` are based on. The percentage calculation for a specific user will be the same across all features if the same `seed` value is used. If no `seed` is specified, then a default seed is created based on the feature name. |

In the above example, if the feature is not enabled, the feature manager will assign the variant marked as `default_when_disabled` to the current user, which is `Small` in this case.

If the feature is enabled, the feature manager will check the `user`, `group`, and `percentile` allocations in that order to assign a variant. For this particular example, if the user being evaluated is named `Marsha`, in the group named `Ring1`, or the user happens to fall between the 0 and 10th percentile, then the specified variant is assigned to the user. In this case, all of these would return the `Big` variant. If none of these allocations match, the user is assigned the `default_when_enabled` variant, which is `Small`.

Allocation logic is similar to the [Microsoft.Targeting](#microsofttargeting) feature filter, but there are some parameters that are present in targeting that aren't in allocation, and vice versa. The outcomes of targeting and allocation aren't related.

> [!NOTE]
> To allow allocating feature variants, you need to register `ITargetingContextAccessor` by calling the `WithTargeting<T>` method.

### Overriding Enabled State with a Variant

You can use variants to override the enabled state of a feature flag. This gives variants an opportunity to extend the evaluation of a feature flag. When calling `IsEnabled` on a flag with variants, the feature manager will check if the variant assigned to the current user is configured to override the result. Overriding is done using the optional variant property `status_override`. By default, this property is set to `None`, which means the variant doesn't affect whether the flag is considered enabled or disabled. Setting `status_override` to `Enabled` allows the variant, when chosen, to override a flag to be enabled. Setting `status_override` to `Disabled` provides the opposite functionality, therefore disabling the flag when the variant is chosen. A feature with an `enabled` state of `false` can't be overridden.

If you're using a feature flag with binary variants, the `status_override` property can be very helpful. It allows you to continue using APIs like `IsEnabledAsync` and `FeatureGateAttribute` in your application, all while benefiting from the new features that come with variants, such as percentile allocation and seed.

``` javascript
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

In the above example, the feature is always enabled. If the current user is in the calculated percentile range of 10 to 20, then the `On` variant is returned. Otherwise, the `Off` variant is returned and because `status_override` is equal to `Disabled`, the feature will now be considered disabled.

### Variants in Dependency Injection

Variant feature flags can be used in conjunction with dependency injection to surface different implementations of a service for different users. This combination is accomplished by using the `IVariantServiceProvider<TService>` interface.

``` C#
IVariantServiceProvider<IAlgorithm> algorithmServiceProvider;
...

IAlgorithm forecastAlgorithm = await algorithmServiceProvider.GetServiceAsync(cancellationToken); 
```

In the snippet above, the `IVariantServiceProvider<IAlgorithm>` retrieves an implementation of `IAlgorithm` from the dependency injection container. The chosen implementation is dependent upon:
* The feature flag that the `IAlgorithm` service was registered with.
* The allocated variant for that feature.

The `IVariantServiceProvider<T>` is made available to the application by calling `IFeatureManagementBuilder.WithVariantService<T>(string featureName)`. See the following example.

``` C#
services.AddFeatureManagement() 
        .WithVariantService<IAlgorithm>("ForecastAlgorithm");
```

The call above makes `IVariantServiceProvider<IAlgorithm>` available in the service collection. Implementations of `IAlgorithm` must be added separately via an add method such as `services.AddSingleton<IAlgorithm, SomeImplementation>()`. The implementation of `IAlgorithm` that the `IVariantServiceProvider` uses depends on the `ForecastAlgorithm` variant feature flag. If no implementation of `IAlgorithm` is added to the service collection, the `IVariantServiceProvider<IAlgorithm>.GetServiceAsync()` returns a task with a *null* result.

``` javascript
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

#### Variant Service Alias Attribute

``` C#
[VariantServiceAlias("Beta")]
public class AlgorithmBeta : IAlgorithm
{
    ...
}
```

The variant service provider will use the type names of implementations to match the allocated variant. If a variant service is decorated with the `VariantServiceAliasAttribute`, the name declared in this attribute should be used in configuration to reference this variant service.

## Telemetry

When a feature flag change is deployed, it's often important to analyze its effect on an application. For example, here are a few questions that may arise:

* Are my flags enabled/disabled as expected?
* Are targeted users getting access to a certain feature as expected?
* Which variant is a particular user seeing?


These types of questions can be answered through the emission and analysis of feature flag evaluation events. This library uses the [`System.Diagnostics.Activity`](/dotnet/api/system.diagnostics.activity) API to produce tracing telemetry during feature flag evaluation.

### Enabling Telemetry

By default, feature flags don't have telemetry emitted. To publish telemetry for a given feature flag, the flag *MUST* declare that it is enabled for telemetry emission.

For feature flags defined in `appsettings.json`, telemetry can be enabled using the `telemetry` property.

``` javascript
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

The appsettings snippet above defines a feature flag named `MyFeatureFlag` that is enabled for telemetry. The telemetry state is indicated by the `telemetry` object that sets `enabled` to true. The value of the `enabled` property must be `true` to publish telemetry for the flag.

The `telemetry` section of a feature flag has the following properties:

| Property | Description |
| ---------------- | ---------------- |
| `enabled` | Specifies whether telemetry should be published for the feature flag. |
| `metadata` | A collection of key-value pairs, modeled as a dictionary, which can be used to attach custom metadata about the feature flag to evaluation events. |

### Custom Telemetry Publishing

The feature manager has its own `ActivitySource` named "Microsoft.FeatureManagement". If `telemetry` is enabled for a feature flag, whenever the evaluation of the feature flag is started, the feature manager will start an `Activity`. When the feature flag evaluation is finished, the feature manager will add an `ActivityEvent` named `FeatureFlag` to the current activity. The `FeatureFlag` event will have tags which include the information about the feature flag evaluation, following the fields defined in the [FeatureEvaluationEvent](https://github.com/microsoft/FeatureManagement/tree/main/Schema/FeatureEvaluationEvent) schema.

> [!NOTE]
> All key value pairs specified in `telemetry.metadata` of the feature flag will also be included in the tags.

To enable custom telemetry publishing, you can create an [`ActivityListener`](/dotnet/api/system.diagnostics.activitylistener) and listen to the `Microsoft.FeatureManagement` activity source. Here is an example showing how to listen to the feature management activity source and add a callback when a feature is evaluated.

``` C#
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

For more information, please go to [Collect a distributed trace](/dotnet/core/diagnostics/distributed-tracing-collection-walkthroughs).

### Application Insights Telemetry

The `Microsoft.FeatureManagement.Telemetry.ApplicationInsights` package provides a built-in telemetry publisher that sends feature flag evaluation data to [Application Insights](/azure/azure-monitor/app/app-insights-overview). The `Microsoft.FeatureManagement.Telemetry.ApplicationInsights` package also provides a telemetry initializer that automatically tags all events with `TargetingId` so that events may be linked to flag evaluations. To take advantage of this, add a reference to the package and register the Application Insights telemetry as in the following example.

``` C#
builder.services
    .AddFeatureManagement()
    .AddApplicationInsightsTelemetry();
```

> [!NOTE]
> To ensure Application Insights telemetry works as expected, the `TargetingHttpContextMiddleware` should be used.

To enable persistence of targeting context in the current activity, you can use the [`TargetingHttpContextMiddleware`](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement.AspNetCore/TargetingHttpContextMiddleware.cs).

``` C#
app.UseMiddleware<TargetingHttpContextMiddleware>();
```

An example of its usage can be found in the [VariantAndTelemetryDemo](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples/VariantAndTelemetryDemo) example.

#### Prerequisite

This telemetry publisher depends on Application Insights already being set up registered as an application service. For example, that is done [here](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/examples/VariantAndTelemetryDemo/Program.cs#L22-L32) in the example application.

This telemetry publisher depends on Application Insights already being [setup](/azure/azure-monitor/app/asp-net-core#enable-application-insights-server-side-telemetry-no-visual-studio) and registered as an application service.

## Caching

Feature state is provided by the `IConfiguration` system. Any caching and dynamic updating is expected to be handled by configuration providers. The feature manager asks `IConfiguration` for the latest value of a feature's state whenever a feature is checked to be enabled.

### Snapshot

There are scenarios that require the state of a feature to remain consistent during the lifetime of a request. The values returned from the standard `IVariantFeatureManager` may change if the `IConfiguration` source that it's pulling from is updated during the request. This can be prevented by using `IVariantFeatureManagerSnapshot`. `IVariantFeatureManagerSnapshot` can be retrieved in the same manner as `IVariantFeatureManager`. `IVariantFeatureManagerSnapshot` implements the interface of `IVariantFeatureManager`, but it caches the first evaluated state of a feature during a request and returns the same state of a feature during its lifetime.

## Custom Feature Providers

Implementing a custom feature provider enables developers to pull feature flags from sources such as a database or a feature management service. The included feature provider that is used by default pulls feature flags from .NET Core's configuration system. This allows for features to be defined in an [appsettings.json](/aspnet/core/fundamentals/configuration/#jcp) file or in configuration providers like [Azure App Configuration](./quickstart-feature-flag-aspnet-core.md). This behavior can be substituted to provide complete control of where feature definitions are read from.

To customize the loading of feature definitions, one must implement the `IFeatureDefinitionProvider` interface.

``` C#
public interface IFeatureDefinitionProvider
{
    Task<FeatureDefinition> GetFeatureDefinitionAsync(string featureName);

    IAsyncEnumerable<FeatureDefinition> GetAllFeatureDefinitionsAsync();
}
```

To use an implementation of `IFeatureDefinitionProvider`, it must be added into the service collection before adding feature management. The following example adds an implementation of `IFeatureDefinitionProvider` named `InMemoryFeatureDefinitionProvider`.

``` C#
services.AddSingleton<IFeatureDefinitionProvider, InMemoryFeatureDefinitionProvider>()
        .AddFeatureManagement()
```

## Next steps

To learn how to use feature flags in your applications, continue to the following quickstarts.

> [!div class="nextstepaction"]
> [ASP.NET Core](./quickstart-feature-flag-aspnet-core.md)

> [!div class="nextstepaction"]
> [.NET/.NET Framework console app](./quickstart-feature-flag-dotnet.md)

> [!div class="nextstepaction"]
> [.NET background service](./quickstart-feature-flag-dotnet-background-service.md)

To learn how to use feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)
