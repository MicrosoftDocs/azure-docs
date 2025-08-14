---
title: .NET Configuration Provider
titleSuffix: Azure App Configuration
description: Learn to load configurations and feature flags from the Azure App Configuration service in .NET application.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.topic: tutorial
ms.date: 04/29/2025
#Customer intent: I want to learn how to use the Azure App Configuration .NET configuration provider library.
---

# .NET configuration provider

[![Microsoft.Extensions.Configuration.AzureAppConfiguration](https://img.shields.io/nuget/v/Microsoft.Extensions.Configuration.AzureAppConfiguration?label=Microsoft.Extensions.Configuration.AzureAppConfiguration)](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.AzureAppConfiguration)

Azure App Configuration is a managed service that helps developers centralize their application configurations simply and securely. The .NET configuration provider library enables loading configuration from an Azure App Configuration store in a managed way. This client library adds additional [functionality](./configuration-provider-overview.md#feature-development-status) on top of the Azure SDK for .NET.

## Load configuration

The Azure App Configuration .NET configuration provider integrates with the .NET configuration system, making it easy to load configuration values from your Azure App Configuration store. You can add the provider during application startup and use it alongside other configuration sources. 

To use .NET configuration provider, install the package:

```console
dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
```

You call `AddAzureAppConfiguration` extension method on `IConfigurationBuilder` to add Azure App Configuration as a configuration provider of your application.

The configuration provider library implements a combined **Options Pattern** and **Builder Pattern** to provide a clean, declarative way to configure the `AzureAppConfigurationOptions`. The `AddAzureAppConfiguration` method accepts an `Action<AzureAppConfigurationOptions>` delegate parameter that lets you configure the provider through a fluent API.

To connect to your Azure App Configuration store, call the `Connect` method on the `AzureAppConfigurationOptions` instance, which returns the same options object to enable method chaining.

### [Microsoft Entra ID](#tab/entra-id)

You can use the `DefaultAzureCredential`, or any other [token credential implementation](/dotnet/api/azure.identity.defaultazurecredential), to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role.

```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Azure.Identity;

var builder = new ConfigurationBuilder();
builder.AddAzureAppConfiguration(options =>
    {
        string endpoint = Environment.GetEnvironmentVariable("AppConfigurationEndpoint");
        options.Connect(new Uri(endpoint), new DefaultAzureCredential());
    });

var config = builder.Build();
Console.WriteLine(config["TestApp:Settings:Message"] ?? "Hello world!");
```

> [!NOTE]
> In an ASP.NET Core application or a background service, you might call `AddAzureAppConfiguration` on `builder.Configuration`.
> ```csharp
> var builder = WebApplication.CreateBuilder(args);
> builder.Configuration.AddAzureAppConfiguration(options =>
>     {
>         string endpoint = Environment.GetEnvironmentVariable("Endpoint");
>         options.Connect(new Uri(endpoint), new DefaultAzureCredential());
>     });
> ```

### [Connection string](#tab/connection-string)

```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Azure.Identity;

var builder = new ConfigurationBuilder();
builder.AddAzureAppConfiguration(options =>
    {
        string connectionString = Environment.GetEnvironmentVariable("ConnectionString");
        options.Connect(connectionString);
    });

var config = builder.Build();
Console.WriteLine(config["TestApp:Settings:Message"] ?? "Hello world!");
```

> [!NOTE]
> In an ASP.NET Core application or a background service, you might call `AddAzureAppConfiguration` on `builder.Configuration`.
> ```csharp
> var builder = WebApplication.CreateBuilder(args);
> builder.Configuration.AddAzureAppConfiguration(options =>
>     {
>         string connectionString = Environment.GetEnvironmentVariable("ConnectionString");
>         options.Connect(connectionString);
>     });
> ```

---

### Consume configuration

After adding the Azure App Configuration provider, you can access your configuration values in several ways:

#### 1. Direct access

The simplest approach is to retrieve values directly from the `IConfiguration` instance:

```csharp
// Directly get the configuration
string message = configuration["TestApp:Settings:Message"];

IConfigurationSection settingsSection = configuration.GetSection("TestApp:Settings");
```

#### 2. Dependency injection with IConfiguration

In services or controllers, you can inject and use the `IConfiguration` interface directly:

```csharp
public class WeatherService
{
    private readonly IConfiguration _configuration;

    public WeatherService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<WeatherForecast> GetForecastAsync()
    {
        // Access configuration values directly from the injected instance
        string apiEndpoint = _configuration["TestApp:Weather:ApiEndpoint"];

        ...

        return Task.FromResult(new WeatherForecast());
    }
}
```

#### 3. Options pattern for strongly-typed configuration

```csharp
// Define a strongly-typed settings class
public class Settings
{
    public string BackgroundColor { get; set; }
    public long FontSize { get; set; }
    public string FontColor { get; set; }
    public string Message { get; set; }
}

builder.Services.Configure<Settings>(builder.Configuration.GetSection("TestApp:Settings"));
```

For more information about options pattern in .NET, go to the [documentation](/dotnet/core/extensions/options/).

### JSON content type handling

You can create JSON key-values in App Configuration. When a key-value with the content type `"application/json"` is read, the configuration provider will flatten it into individual settings inside of `IConfiguration`. For more information, go to [Use content type to store JSON key-values in App Configuration](./howto-leverage-json-content-type.md).

### Load specific key-values using selectors

By default, the configuration provider loads all key-values with no label from App Configuration. You can selectively load key-values from your App Configuration store by calling the `Select` method on `AzureAppConfigurationOptions`.

```csharp
builder.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(endpoint), new DefaultAzureCredential())
        // Load configuration values with prefix "TestApp:" and no label
        .Select("App:Settings:*")
        // Load configuration values with prefix "TestApp:" and "Prod" label
        .Select("App:Settings:*", "Prod")
        // Load configuration values with prefix "TestApp:" and "Prod" label that have the tag "Group" with value "Contoso"
        .Select("App:Settings:*", "Prod", new[] { "Group=Contoso" })
});
```

The `Select` method takes three parameters. The first parameter is a key filter that specifies which keys to load, the second parameter is a label filter that specifies which key-values with specific labels to load, and the third parameter specifies a collection of tag filters that all must be present on a key-value to load.

> [!NOTE]
> When multiple `Select` calls include overlapping keys, later calls take precedence over earlier ones.

#### Key filter

The key filter parameter determines which configuration keys to include:

- **Exact match**: Using a specific string matches only keys that exactly match the filter.
- **Prefix match**: Adding an asterisk (`*`) at the end creates a prefix filter (e.g., `App:Settings:*` loads all keys starting with "App:Settings:").
- **Multiple key selection**: Using a comma (`,`) allows selection of multiple explicit keys (e.g., `Key1,Key2,Key3`).
- **Reserved characters**: The characters asterisk (`*`), comma (`,`), and backslash (`\`) are reserved and must be escaped with a backslash when used in key names (e.g. the key filter `a\\b\,\*c*` returns all key-values whose key starts with `a\b,*c`.).

> [!NOTE]
> You cannot combine wildcard prefix matching with comma-separated filters in the same `Select` call. For example, `abc*,def` is not supported, but you can make separate `Select` calls with `abc*` and `def`.

#### Label filter

The label filter parameter selects key-values with a specific label. If not specified, the built-in `LabelFilter.Null` is used.

> [!NOTE]
> The characters asterisk (`*`) and comma (`,`), are not supported for label filter. Backslash (`\`) character is reserved and must be escaped using another backslash (`\`).

#### Tag filters

The tag filters parameter selects key-values with specific tags. A key-value is only loaded if it has all of the tags and corresponding values specified in the filters. To specify a null value for a tag, the built-in `TagValue.Null` can be used.

> [!NOTE]
> The characters asterisk (`*`), comma (`,`), and backslash (`\`) are reserved and must be escaped with a backslash when used in a tag filter.

### Trim prefix from keys

When loading configuration values with specific prefixes, you can use the `TrimKeyPrefix` method to remove those prefixes from the keys in your configuration. This creates cleaner configuration keys in your application while maintaining organization in your App Configuration store.

```csharp
builder.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(endpoint), new DefaultAzureCredential())
        // Load configuration values with prefix "TestApp:" and trim the prefix
        .Select("TestApp:*")
        .TrimKeyPrefix("TestApp:");
});
```

For example, if your App Configuration store contains a key named `TestApp:Settings:Message`, it will be accessible in your application as `Settings:Message` after trimming the `TestApp:` prefix.

### Configuration setting mapping

When loading key-values from Azure App Configuration, the provider first retrieves them as `ConfigurationSetting` objects before adding them to the .NET configuration system. The `Map` API enables you to transform these settings during this pipeline, giving you control over how configurations appear in your application.

The `Map` method accepts a delegate function that receives a `ConfigurationSetting` object, allows you to modify it, and returns a `ValueTask<ConfigurationSetting>`. This is particularly useful for key name transformations or value formatting based on runtime conditions.

The following example demonstrates using the `Map` API to replace double underscores (`__`) with colons (`:`) in configuration keys. This transformation preserves the hierarchical structure expected by .NET configuration when keys need to use alternative characters in App Configuration:

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())
        .Map((setting) =>
        {
            // Transform keys from format "App__Settings__Message" to "App:Settings:Message"
            setting.Key = setting.Key.Replace("__", ":");
            
            return new ValueTask<ConfigurationSetting>(setting);
        });
});
```

> [!TIP] 
> The `Map` operation is applied to all configuration settings retrieved from App Configuration, so ensure your transformation logic handles all possible key formats correctly.

## Configuration refresh

Configuring refresh enables the application to pull the latest values from the App Configuration store without having to restart. You can call the `ConfigureRefresh` method to configure the key-value refresh.

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())
        // Load all keys that start with `TestApp:` and have no label
        .Select(keyFilter: "TestApp:*", labelFilter: LabelFilter.Null)
        .ConfigureRefresh(refreshOptions => {
            // Trigger full configuration refresh when any selected key changes.
            refreshOptions.RegisterAll()
            // Check for changes no more often than every 60 seconds
                .SetRefreshInterval(TimeSpan.FromSeconds(60));
        });
});
```

Inside the `ConfigureRefresh` method, you call the `RegisterAll` method to instruct the App Configuration provider to reload configuration whenever it detects a change in any of the selected key-values (those starting with TestApp: and having no label).

You can add a call to the `SetRefreshInterval` method to specify the minimum time between configuration refreshes. If not set, the default refresh interval is 30 seconds.

### Trigger refresh

To trigger refresh, you need to call the `TryRefreshAsync` method of the `IConfigurationRefresher`. Azure App Configuration provides several patterns for implementation depending on your application architecture.

#### 1. Dependency injection

For applications using dependency injection (including ASP.NET Core and background services), register the refresher service:

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())            
           .ConfigureRefresh(refreshOptions =>
           {
                refreshOptions.RegisterAll()
                    .SetRefreshInterval(TimeSpan.FromSeconds(60));
           })
});

// Register refresher service with the DI container
builder.Services.AddAzureAppConfiguration();
```

`builder.Services.AddAzureAppConfiguration()` adds the `IConfigurationRefreshProvider` service to the DI container, which gives you access to the refreshers of all Azure App Configuration sources in the application's configuration.

##### ASP.NET Core applications

For ASP.NET Core applications, you can use the `Microsoft.Azure.AppConfiguration.AspNetCore` package to achieve [request-driven configuration refresh](./enable-dynamic-configuration-aspnet-core.md#request-driven-configuration-refresh) with a built-in middleware.

```console
dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
```

After registering the service, call the `UseAzureAppConfiguration` to add the `AzureAppConfigurationRefreshMiddleware` to your application pipeline to automatically refresh configuration on incoming requests:

```csharp
...

// Call the AddAzureAppConfiguration to add refresher service to the DI container
builder.Services.AddAzureAppConfiguration();

var app = builder.Build();

// Call the app.UseAzureAppConfiguration() method as early as appropriate in your request pipeline so another middleware doesn't skip it
app.UseAzureAppConfiguration();

// Continue with other middleware registration
app.UseRouting();
...
```

The `AzureAppConfigurationRefreshMiddleware` automatically checks for configuration changes at the configured refresh interval. This approach is efficient as it only refreshes when both conditions are met: an HTTP request is received and the refresh interval has elapsed.

##### Background services

For background services, you can inject the `IConfigurationRefresherProvider` service and manually refresh each of the registered refreshers.

```csharp
public class Worker : BackgroundService
{
    private readonly IConfiguration _configuration;
    private readonly IEnumerable<IConfigurationRefresher> _refreshers;

    public Worker(IConfiguration configuration, IConfigurationRefresherProvider refresherProvider)
    {
        _configuration = configuration;
        _refreshers = refresherProvider.Refreshers;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        foreach (IConfigurationRefresher refresher in _refreshers)
        {
            refresher.TryRefreshAsync();
        }

        ...
    }
}
```

#### 2. Direct access

For applications not using dependency injection, you can obtain the refresher directly from the options:

```csharp
IConfigurationRefresher refresher = null;
var builder = new ConfigurationBuilder();
builder.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())            
           .ConfigureRefresh(refreshOptions =>
           {
               refreshOptions.RegisterAll();
           });

    // Store the refresher for later use
    refresher = options.GetRefresher();
});

IConfiguration config = builder.Build();

// Later in your code, trigger refresh when needed
if (refresher != null)
{
    await refresher.TryRefreshAsync()
}

Console.WriteLine(config["TestApp:Settings:Message"]);
```

> [!NOTE] 
> Even if the refresh call fails for any reason, your application continues to use the cached configuration. Another attempt is made after a short period based on your application activity. Calling refresh is a no-op before the configured refresh interval elapses, so its performance impact is minimal even if it's called frequently.

### Refresh on sentinel key

A sentinel key is a key that you update after you complete the change of all other keys. The configuration provider monitors the sentinel key instead of all selected key-values. When a change is detected, your app refreshes all configuration values.

This approach is useful when updating multiple key-values. By updating the sentinel key only after all other configuration changes are completed, you ensure your application reloads configuration just once, maintaining consistency.

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())
        // Load all keys that start with `TestApp:` and have no label
        .Select(keyFilter: "TestApp:*", labelFilter: LabelFilter.Null)
        .ConfigureRefresh(refreshOptions => {
            // Trigger full configuration refresh only if the `SentinelKey` changes.
            refreshOptions.Register("SentinelKey", refreshAll: true);
        });
});
```

> [!IMPORTANT] 
> Key-values are not automatically registered for refresh monitoring. You must explicitly call `ConfigureRefresh` and then register keys using either the `RegisterAll` method (to monitor all loaded keys) or the `Register` method (to monitor an individual key).

For more information about refresh configuration, go to [Tutorial: Use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md).

## Feature flag

[Feature flags](./manage-feature-flags.md#create-a-feature-flag) in Azure App Configuration provide a modern way to control feature availability in your applications. Unlike regular configuration values, feature flags must be explicitly loaded using the `UseFeatureFlags` method. You can configure on `FeatureFlagOptions` to load specific feature flags using selectors and set feature flag refresh interval.

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())
        .UseFeatureFlags(featureFlagOptions => {
            // Load feature flags with prefix "TestApp:" and "dev" label
            featureFlagOptions.Select("TestApp:*", "dev")
            // Check for changes no more often than every 60 seconds
                .SetRefreshInterval(TimeSpan.FromSeconds(60));
        });
});
```

Inside the `UseFeatureFlags` method, you call the `Select` method to selectively load feature flags. You can use [key filter](#key-filter), [label filter](#label-filter), and [tag filters](#tag-filters) to select the feature flags you want to load. If no `Select` method is called, `UseFeatureFlags` loads all feature flags with no label by default.

Different from key-values, feature flags are automatically registered for refresh without requiring explicit `ConfigureRefresh` call. You can specify the minimum time between feature flag refreshes through the `SetRefreshInterval` method. The default refresh interval is 30 seconds.

### Feature management

The feature management library provides a way to develop and expose application functionality based on feature flags. The feature management library is designed to work in conjunction with the configuration provider library. Install the [`Microsoft.FeatureManagement`](./feature-management-dotnet-reference.md) package:

```console
dotnet add package Microsoft.FeatureManagement
```

You can call `AddFeatureManagement` to register `IVariantFeatureManager` and related services in the DI container. This registration makes feature flag functionality available throughout your application through dependency injection.

```csharp
using Microsoft.FeatureManagement;

...

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential());
    // Use feature flags
    options.UseFeatureFlags();
});

// Register feature management services
builder.Services.AddFeatureManagement();
```

The following example demonstrating how to use the feature manager service through dependency injection:

```csharp
public class WeatherForecastController : ControllerBase
{
    private readonly IFeatureManager _featureManager;

    public WeatherForecastController(IVariantFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // Check if a feature flag is enabled
        if (await _featureManager.IsEnabledAsync("WeatherForecast"))
        {
            var forecast = GenerateWeatherForecast();
            return Ok(forecast);
        }
        
        return NotFound("Weather forecast feature is not available");
    }
}
```

For more information about how to use the feature management library, go to the [feature flag quickstart](./quickstart-feature-flag-aspnet-core.md).

## Key Vault reference

Azure App Configuration supports referencing secrets stored in Azure Key Vault. In App Configuration, you can create keys that map to secrets stored in Key Vault. The secrets are securely stored in Key Vault, but can be accessed like any other configuration once loaded.

The configuration provider library retrieves Key Vault references, just as it does for any other keys stored in App Configuration. Because the client recognizes the keys as Key Vault references, they have a unique content-type, and the client connects to Key Vault to retrieve their values for your application. 

### Connect to Key Vault

You need to call the `ConfigureKeyVault` method to configure how to connect to Key Vault. The Azure App Configuration provider offers multiple ways to authenticate and access your Key Vault secrets.

#### 1. Register `SecretClient` instance

You can register specified `SecretClient` instances to use to resolve key vault references for secrets from associated key vault.

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

...

var secretClient = new SecretClient(new Uri(vaultUri), new DefaultAzureCredential());

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())  
        .ConfigureKeyVault(kv =>
        {
            // Register a SecretClient instance
            kv.Register(secretClient);
        });
});
```

#### 2. Use credential

You can set the credential used to authenticate to key vaults that have no registered `SecretClient`.

```csharp
using Azure.Identity;

...

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())  
        .ConfigureKeyVault(kv =>
        {
            // Use DefaultAzureCredential to access all Key Vaults
            kv.SetCredential(new DefaultAzureCredential());
        });
});
```

#### 3. Use custom secret resolver

You can also call `SetSecretResolver` to add a custom secret resolver which is used when no registered `SecretClient` is available or the provided credential fails to authenticate to Key Vault. This method accepts a delegate function that resolves a Key Vault URI to a secret value. The following example demonstrates using a secret resolver that retrieves a secret from environment variables in development and uses fallback values when it fails to get the secret from Key Vault.

```csharp
var secretClient = new SecretClient(new Uri(vaultUri), new DefaultAzureCredential());

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())  
        .ConfigureKeyVault(kv =>
        {
            // Add a custom secret resolver function
            kv.SetSecretResolver(async (Uri secretUri) =>
            {                
                if (builder.Environment.IsDevelopment())
                {
                    return Environment.GetEnvironmentVariable("FALLBACK_SECRET_VALUE");
                }

                try 
                {
                    var secret = await secretClient.GetSecretAsync(secretName);
                    return secret.Value;
                }
                catch (Exception ex)
                {
                    logger.LogWarning($"Failed to retrieve secret from {secretUri}: {ex.Message}");
                    
                    return Environment.GetEnvironmentVariable("FALLBACK_SECRET_VALUE");
                }
            });
        });
});
```

> [!NOTE] 
> When resolving Key Vault references, the provider follows this order:
> 1. Registered `SecretClient` instances
> 1. Default credential
> 1. Custom secret resolver

> [!IMPORTANT]
> If your application loads key-values containing Key Vault references without proper Key Vault configuration, an **exception** will be thrown at startup. Ensure you've properly configured Key Vault access or secret resolver.

> [!TIP]
> You can use a custom secret resolver to handle cases where Key Vault references are accidentally added to your App Configuration store. The resolver can provide fallback values, log warnings, or gracefully handle missing proper credential to access Key Vault instead of throwing exceptions.

### Key Vault secret refresh

Azure App Configuration enables you to configure secret refresh intervals independently of your configuration refresh cycle. This is crucial for security because while the Key Vault reference URI in App Configuration remains unchanged, the underlying secret in Key Vault might be rotated as part of your security practices.

To ensure your application always uses the most current secret values, configure the `SetSecretRefreshInterval` method. This forces the provider to retrieve fresh secret values from Key Vault when:

- Your application calls `IConfigurationRefresher.TryRefreshAsync`
- The configured refresh interval for the secret has elapsed

This mechanism works even when no changes are detected in your App Configuration store, ensuring your application stays in sync with rotated secrets.

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())
        .ConfigureKeyVault(kv =>
        {
            kv.SetCredential(new DefaultAzureCredential());

            // Option 1: Set refresh interval for specific secrets
            kv.SetSecretRefreshInterval("ApiKey", TimeSpan.FromHours(12)); 
            
            // Option 2: Set a global refresh interval for all secrets with no refresh interval specified
            kv.SetSecretRefreshInterval(TimeSpan.FromHours(24));
        })
        .ConfigureRefresh(refreshOptions => refreshOptions.RegisterAll());
});
```

For more information about how to use Key Vault reference, go to the [Tutorial: Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md).

## Snapshot

[Snapshot](./concept-snapshots.md) is a named, immutable subset of an App Configuration store's key-values. The key-values that make up a snapshot are chosen during creation time through the usage of key and label filters. Once a snapshot is created, the key-values within are guaranteed to remain unchanged.

You can call `SelectSnapshot` to load key-values from a snapshot.

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential());
    // Select an existing snapshot by name. This adds all of the key-values and feature flags from the snapshot to this application's configuration.
    options.SelectSnapshot("SnapshotName");
});
```

For information about using snapshots, go to [Create and use snapshots](./howto-create-snapshots.md).

## Startup retry

Configuration loading is a critical path operation during application startup. To ensure reliability, the Azure App Configuration provider implements a robust retry mechanism during the initial configuration load. This helps protect your application from transient network issues that might otherwise prevent successful startup.

You can customize this behavior using the `ConfigureStartupOptions` method:

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(appConfigEndpoint), new DefaultAzureCredential())
        .ConfigureStartupOptions(startupOptions =>
        {
            // Set the time-out for the initial configuration load
            startupOptions.Timeout = TimeSpan.FromSeconds(60);
        });
});
```

## Geo-replication

For information about using geo-replication, go to [Enable geo-replication](./howto-geo-replication.md).

## Distributed tracing

The Azure App Configuration .NET provider includes built-in support for distributed tracing, allowing you to monitor and troubleshoot configuration operations across your application. The provider exposes an `ActivitySource` named `"Microsoft.Extensions.Configuration.AzureAppConfiguration"` that starts `Activity` for key operations like loading configuration and refreshing configuration.

The following example demonstrates how to configure OpenTelemetry to capture and monitor distributed traces generated by the configuration provider:

```csharp
List<Activity> exportedActivities = new();
builder.Services.AddOpenTelemetry()
    .WithTracing(traceBuilder => {
        traceBuilder.AddSource(["Microsoft.Extensions.Configuration.AzureAppConfiguration"]);
            .AddInMemoryExporter(exportedActivities)
    });
```

For more information about OpenTelemetry in .NET, see the [OpenTelemetry .NET documentation](https://github.com/open-telemetry/opentelemetry-dotnet).

## Next steps

To learn how to use the .NET configuration provider, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration in an ASP.NET web app](./enable-dynamic-configuration-aspnet-netfx.md)