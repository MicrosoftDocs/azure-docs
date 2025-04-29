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
#Customer intent: I want to learn how to use Azure App Configuration .NET client library.
---

# .NET Configuration Provider

[![Microsoft.Extensions.Configuration.AzureAppConfiguration](https://img.shields.io/nuget/v/Microsoft.Extensions.Configuration.AzureAppConfiguration?label=Microsoft.Extensions.Configuration.AzureAppConfiguration)](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.AzureAppConfiguration)

Azure App Configuration is a managed service that helps developers centralize their application configurations simply and securely. The .NET configuration provider library enables loading configuration from an Azure App Configuration store in a managed way. This client library adds additional [functionality](./configuration-provider-overview.md#feature-development-status) above the Azure SDK for .NET.

## Load configuration

The Azure App Configuration .NET configuration provider integrates with the .NET configuration system, making it easy to load configuration values from your Azure App Configuration store. You can add the provider during application startup and use it alongside other configuration sources. 

To use .NET configuration provider, install the package:

```console
dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
```

Connect to your Azure App Configuration store by calling the `Connect` method on the `AzureAppConfigurationOptions`. The configuration provider follows a builder pattern, accepting an `Action<AzureAppConfigurationOptions>` delegate parameter that allows you to configure the provider.

### [Microsoft Entra ID](#tab/entra-id)

You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role.

```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Azure.Identity;

var builder = new ConfigurationBuilder();
builder.AddAzureAppConfiguration(options =>
    {
        string endpoint = Environment.GetEnvironmentVariable("Endpoint");
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

### JSON Content Type Handling

You can create JSON key-values in App Configuration. For more information, go to [Use content type to store JSON key-values in App Configuration](./howto-leverage-json-content-type.md).

### Load specific key-values using selectors

By default, the configuration provider will load all key-values with no label from the App Configuration. You can selectively load key-values from your App Configuration store by calling `Select` method on `AzureAppConfigurationOptions`.

```csharp
builder.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(endpoint), new DefaultAzureCredential())
        // Load configuration values with prefix "TestApp:" and no label
        .Select("App:Settings:*")
        // Load configuration values with prefix "TestApp:" and "Prod" label
        .Select("App:Settings:*", "Prod")
});
```

The `Select` method takes two parameters, the first parameter is a key filter that specifies which keys to load, and the second parameter is a label filter that specifies which key-values with specific labels to load.

> [!NOTE]
> When multiple `Select` calls include overlapping keys, later calls take precedence over earlier ones.

#### Key Filter

The key filter parameter determines which configuration keys to include:

- **Exact match**: Using a specific string will match only keys that exactly match the filter.
- **Prefix match**: Adding an asterisk (`*`) at the end creates a prefix filter (e.g., `App:Settings:*` loads all keys starting with "App:Settings:").
- **Multiple key selection**: Using a comma (`,`) allows selection of multiple explicit keys (e.g., `Key1,Key2,Key3`).
- **Reserved characters**: The characters asterisk (`*`), comma (`,`), and backslash (`\`) are reserved and must be escaped with a backslash when used in key names (e.g. the key filter `a\\b\,\*c*` returns all key-values whose key starts with `a\b,*c`.).

> [!NOTE]
> You cannot combine wildcard prefix matching with comma-separated filters in the same `Select` call. For example, `abc*,def` is not supported, but you can make separate `Select` calls with `abc*` and `def`.

#### Label Filter

The label filter parameter selects key-values with a specific label. If not specified, the built-in `LabelFilter.Null` will be used.

> [!NOTE]
> The characters asterisk (`*`) and comma (`,`), are not supported for label filter. Backslash (`\`) character is reserved and must be escaped using another backslash (`\`).

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

## Geo-replication

For information about using geo-replication, go to [Enable geo-replication](./howto-geo-replication.md).

## Next steps

To learn how to use the JavaScript configuration provider, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Enable dynamic configuration in an ASP.NET web app](./enable-dynamic-configuration-aspnet-netfx.md)