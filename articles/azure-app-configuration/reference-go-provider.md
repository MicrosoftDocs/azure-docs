---
title: Go Configuration Provider
titleSuffix: Azure App Configuration
description: Learn to load configurations and feature flags from the Azure App Configuration service in Go applications.
services: azure-app-configuration
author: linglingye
ms.author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.custom: devx-track-go
ms.topic: tutorial
ms.date: 08/13/2025
#Customer intent: I want to learn how to use the Azure App Configuration Go provider library.
---

# Go configuration provider

Azure App Configuration is a managed service that helps developers centralize their application configurations simply and securely. The Go configuration provider library enables loading configuration from an Azure App Configuration store in a managed way. This client library adds additional [functionality](./configuration-provider-overview.md#feature-development-status) on top of the Azure SDK for Go.

## Load configuration

The Azure App Configuration Go provider allows you to load configuration values from your Azure App Configuration store into your Go applications. You can connect using either Microsoft Entra ID authentication or a connection string.

To use the Go configuration provider, install the package:

```bash
go get github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration
```

You call the `Load` function from the `azureappconfiguration` package to load configuration from Azure App Configuration. The `Load` function accepts authentication options and configuration options to customize the loading behavior.

### [Microsoft Entra ID](#tab/entra-id)

You can use the `DefaultAzureCredential`, or any other [token credential implementation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azcore#TokenCredential), to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role.

```golang
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
)

func main() {
	ctx := context.Background()
	
	// Get the endpoint from environment variable
	endpoint := os.Getenv("AZURE_APPCONFIG_ENDPOINT")
	
	// Create a credential using DefaultAzureCredential
	credential, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("Failed to create credential: %v", err)
	}

	// Set up authentication options
	authOptions := azureappconfiguration.AuthenticationOptions{
		Endpoint:   endpoint,
		Credential: credential,
	}

	// Load configuration from Azure App Configuration
	appConfig, err := azureappconfiguration.Load(ctx, authOptions, nil)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
}
```

### [Connection string](#tab/connection-string)

```golang
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
)

func main() {
	ctx := context.Background()
	
	// Get the connection string from environment variable
	connectionString := os.Getenv("AZURE_APPCONFIG_CONNECTION_STRING")
	
	// Set up authentication options
	authOptions := azureappconfiguration.AuthenticationOptions{
		ConnectionString: connectionString,
	}

	// Load configuration from Azure App Configuration
	appConfig, err := azureappconfiguration.Load(ctx, authOptions, nil)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
}
```

---

### Load specific key-values using selectors

By default, the configuration provider loads all key-values with no label from App Configuration. You can selectively load key-values by configuring the `Selectors` field in the `Options` struct.

```golang
options := &azureappconfiguration.Options{
	Selectors: []azureappconfiguration.Selector{
		{
			// Load configuration values with prefix "App:" and no label
			KeyFilter:   "App:*",
			LabelFilter: "",
		},
		{
			// Load configuration values with prefix "App:" and "Prod" label
			KeyFilter:   "App:*",
			LabelFilter: "Prod",
		},
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

The `Selector` struct supports the following fields:

- **KeyFilter**: Determines which configuration keys to include. Use exact matches, prefix matching with `*`, or comma-separated multiple keys.
- **LabelFilter**: Selects key-values with a specific label. If empty, loads key-values with no label.

> [!NOTE]
> When multiple selectors include overlapping keys, later selectors take precedence over earlier ones.

#### Tag filters

The `TagFilters` parameter selects key-values with specific tags. A key-value is only loaded if it has all of the tags and corresponding values specified in the filters.

```golang
options := &azureappconfiguration.Options{
	Selectors: []azureappconfiguration.Selector{
		{
			// Load configuration values with prefix "App:" and specific tags
			KeyFilter:   "App:*",
			TagFilters: []string{"env=prod"},
		},
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

> [!NOTE]
> The characters asterisk (`*`), comma (`,`), and backslash (`\`) are reserved and must be escaped with a backslash when used in a tag filter.

### Trim prefix from keys

When loading configuration values with specific prefixes, you can use the `TrimKeyPrefixes` option to remove those prefixes from the keys in your configuration. This creates cleaner configuration keys in your application while maintaining organization in your App Configuration store.

```golang
options := &azureappconfiguration.Options{
	// Load configuration values with prefix "TestApp:" and trim the prefix
	Selectors: []azureappconfiguration.Selector{
		{
			KeyFilter: "TestApp:*",
		},
	},
	TrimKeyPrefixes: []string{"TestApp:"},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

For example, if your App Configuration store contains a key named `TestApp:Settings:Message`, it will be accessible in your application as `Settings:Message` after trimming the `TestApp:` prefix.

### JSON content type handling

You can create JSON key-values in App Configuration. When a key-value with the content type `"application/json"` is read, the configuration provider will parse it into nested structures. For more information, go to [Use content type to store JSON key-values in App Configuration](./howto-leverage-json-content-type.md).

> [!NOTE]
> Starting with version *1.2.0*, the configuration provider allows comments, as defined in ([JSONC](https://jsonc.org/)), in key-values with an `application/json` content type.

## Consume configuration

The `AzureAppConfiguration` type returned by the `Load` function provides several methods to access your configuration data:

### Unmarshal to structs

The `Unmarshal` method provides a type-safe way to load configuration values into Go structs. This approach prevents runtime errors from mistyped configuration keys and makes your code more maintainable. The method accepts an optional `ConstructionOptions` parameter to customize how configuration keys are mapped to struct fields.

```golang
type Config struct {
	Message string
	App     struct {
		Name     string
		Debug    bool
		Settings struct {
			Timeout    int
			RetryCount int
		}
	}
}

func main() {
	// ... load configuration ...
	
	// Create a configuration struct and unmarshal into it
	var config Config
	if err := appConfig.Unmarshal(&config, nil); err != nil {
		log.Fatalf("Failed to unmarshal configuration: %v", err)
	}

	// Access configuration values
	fmt.Printf("Message: %s\n", config.Message)
	fmt.Printf("App Name: %s\n", config.App.Name)
	fmt.Printf("Debug Mode: %t\n", config.App.Debug)
	fmt.Printf("Timeout: %d seconds\n", config.App.Settings.Timeout)
}
```

#### Custom key separators

You can customize how configuration keys are mapped to struct fields using `ConstructionOptions`. This is useful when your configuration keys use different separators than the default dot (`.`):

```golang
// Configuration keys using colon separator: "App:Name", "App:Settings:Timeout"
constructionOptions := &azureappconfiguration.ConstructionOptions{
	Separator: ":",
}

var config Config
if err := appConfig.Unmarshal(&config, constructionOptions); err != nil {
	log.Fatalf("Failed to unmarshal configuration: %v", err)
}
```

The `ConstructionOptions` struct supports the following separators: `.`, `,`, `;`, `-`, `_`, `__`, `/`, `:`. If not specified, the default separator `.` is used.

### Get raw JSON bytes

The `GetBytes` method retrieves your configuration as raw JSON data, offering flexibility for integration with JSON processing libraries or configuration frameworks like [`viper`](https://github.com/spf13/viper). This method also accepts an optional `ConstructionOptions` parameter to control key hierarchy mapping.

```golang
// Get configuration as JSON bytes with default separator
jsonBytes, err := appConfig.GetBytes(nil)
if err != nil {
	log.Fatalf("Failed to get configuration as bytes: %v", err)
}

fmt.Println("Raw JSON Configuration:")
fmt.Println(string(jsonBytes))

// Get configuration with custom separator
constructionOptions := &azureappconfiguration.ConstructionOptions{
	Separator: ":",
}
jsonBytes, err = appConfig.GetBytes(constructionOptions)
if err != nil {
	log.Fatalf("Failed to get configuration as bytes: %v", err)
}

// Example: Use with viper
v := viper.New()
v.SetConfigType("json")
if err := v.ReadConfig(bytes.NewBuffer(jsonBytes)); err != nil {
	log.Fatalf("Failed to read config into viper: %v", err)
}
```

## Configuration refresh

Configuring refresh enables the application to pull the latest values from the App Configuration store without having to restart. You can configure refresh options using the `RefreshOptions` field in the `Options` struct. The loaded configuration will be updated when any change of selected key-values is detected on the server. By default, a refresh interval of 30 seconds is used, but you can override it with the `Interval` property.

```golang
options := &azureappconfiguration.Options{
	// Load all keys that start with `TestApp:` and have no label
	Selectors: []azureappconfiguration.Selector{
		{
			KeyFilter:   "TestApp:*",
			LabelFilter: "",
		},
	},
	// Trigger full configuration refresh when any selected key changes
	RefreshOptions: azureappconfiguration.KeyValueRefreshOptions{
		Enabled:  true,
		// Check for changes no more often than every 60 seconds
		Interval: 60 * time.Second,
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

Setting up `RefreshOptions` alone won't automatically refresh the configuration. You need to call the `Refresh` method on the `AzureAppConfiguration` instance to trigger a refresh.

```golang
// Trigger a refresh
if err := appConfig.Refresh(ctx); err != nil {
	log.Printf("Failed to refresh configuration: %v", err)
}
```

This design prevents unnecessary requests to App Configuration when your application is idle. You should include the `Refresh` call where your application activity occurs. This is known as **activity-driven configuration refresh**. For example, you can call `Refresh` when processing an incoming request or inside an iteration where you perform a complex task.

> [!NOTE]
> Even if the refresh call fails for any reason, your application continues to use the cached configuration. Another attempt will be made when the configured refresh interval has passed and the refresh call is triggered by your application activity. Calling `Refresh` is a no-op before the configured refresh interval elapses, so its performance impact is minimal even if it's called frequently.

### Refresh on sentinel key

A sentinel key is a key that you update after you complete the change of all other keys. The configuration provider monitors the sentinel key instead of all selected key-values. When a change is detected, your app refreshes all configuration values.

This approach is useful when updating multiple key-values. By updating the sentinel key only after all other configuration changes are completed, you ensure your application reloads configuration just once, maintaining consistency.

```golang
options := &azureappconfiguration.Options{
	// Load all keys that start with `TestApp:` and have no label
	Selectors: []azureappconfiguration.Selector{
		{
			KeyFilter:   "TestApp:*",
			LabelFilter: "",
		},
	},
	// Trigger full configuration refresh only if the `SentinelKey` changes
	RefreshOptions:  azureappconfiguration.KeyValueRefreshOptions{
		Enabled: true,
		WatchedSettings: []azureappconfiguration.WatchedSetting{
			{
				Key:   "SentinelKey",
				Label: "",
			},
		},
	},
}
```

### Custom refresh callback

The `OnRefreshSuccess` method registers a callback function that will be executed whenever the configuration is successfully refreshed and actual changes were detected.

```golang
var config Config
if err := appConfig.Unmarshal(&config, nil); err != nil {
    log.Fatalf("Failed to unmarshal configuration: %v", err)
}

// Register refresh callback
appConfig.OnRefreshSuccess(func() {
    // Re-unmarshal the configuration
    err := appConfig.Unmarshal(&config, nil)
    if err != nil {
        log.Printf("Failed to unmarshal updated configuration: %s", err)
        return
    }
})
```

## Feature flags

[Feature flags](./manage-feature-flags.md#create-a-feature-flag) in Azure App Configuration provide a modern way to control feature availability in your applications. Unlike regular configuration values, feature flags must be explicitly loaded using the `FeatureFlagOptions` field in the `Options` struct.

```golang
options := &azureappconfiguration.Options{
	FeatureFlagOptions: azureappconfiguration.FeatureFlagOptions{
		Enabled: true,
		// Load feature flags that start with `TestApp:` and have `dev` label
		Selectors: []azureappconfiguration.Selector{
			{
				KeyFilter:   "TestApp:*",
				LabelFilter: "dev",
			},
		},
		RefreshOptions: azureappconfiguration.RefreshOptions{
			Enabled:  true,
			Interval: 60 * time.Second,
		},
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

> [!TIP]
> When no selector is specified in `FeatureFlagOptions`, it loads *all* feature flags with *no label* in your App Configuration store. The default refresh interval of feature flags is 30 seconds.

> [!IMPORTANT]
> To effectively consume and manage feature flags loaded from Azure App Configuration, install and use the [`featuremanagement`](https://pkg.go.dev/github.com/microsoft/Featuremanagement-Go/featuremanagement) package. This library provides a structured way to control feature behavior in your application.

### Feature management

The [Feature Management Go library](https://github.com/microsoft/FeatureManagement-Go) provides a structured way to develop and expose application functionality based on feature flags. The feature management library is designed to work in conjunction with the configuration provider library.

To use feature flags with the feature management library, install the required packages:

```bash
go get github.com/microsoft/Featuremanagement-Go/featuremanagement
go get github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig
```

The following example demonstrates how to integrate the feature management library with the configuration provider to dynamically control feature availability:

```golang
import (
	"github.com/microsoft/Featuremanagement-Go/featuremanagement"
	"github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig"
)

func main() {
	// Set up authentication options
	authOptions := azureappconfiguration.AuthenticationOptions{
		Endpoint:   endpoint,
		Credential: credential,
	}

	// Load configuration with feature flags enabled
	options := &azureappconfiguration.Options{
		FeatureFlagOptions: azureappconfiguration.FeatureFlagOptions{
			Enabled: true,
			RefreshOptions: azureappconfiguration.RefreshOptions{
				Enabled: true,
			},
		},
	}

	appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Create feature flag provider using the Azure App Configuration
	featureFlagProvider, err := azappconfig.NewFeatureFlagProvider(appConfig)
	if err != nil {
		log.Fatalf("Error creating feature flag provider: %v", err)
	}

	// Create feature manager
	featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, nil)
	if err != nil {
		log.Fatalf("Error creating feature manager: %v", err)
	}

	// Use the feature manager to check feature flags
	isEnabled, err := featureManager.IsEnabled("Beta")
	if err != nil {
		log.Printf("Error checking feature flag: %v", err)
		return
	}

	if isEnabled {
		fmt.Println("Beta feature is enabled!")
		// Execute beta functionality
	} else {
		fmt.Println("Beta feature is disabled")
		// Execute standard functionality
	}
}
```

For more information about how to use the Go feature management library, go to the [feature flag quickstart](./quickstart-feature-flag-go-console.md).

## Key Vault reference

Azure App Configuration supports referencing secrets stored in Azure Key Vault. In App Configuration, you can create keys that map to secrets stored in Key Vault, but can be accessed like any other configuration once loaded.

The configuration provider library retrieves Key Vault references, just as it does for any other keys stored in App Configuration. You need to configure Key Vault access using the `KeyVaultOptions` field in the `Options` struct.

### Connect to Key Vault

You can configure Key Vault access by providing credentials that can authenticate to your Key Vault instances.

```golang
import (
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
)

// Create a credential for Key Vault access
credential, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
	log.Fatalf("Failed to create credential: %v", err)
}

options := &azureappconfiguration.Options{
	KeyVaultOptions: azureappconfiguration.KeyVaultOptions{
		Credential: credential,
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

### Custom secret resolver

You can also provide a custom secret resolver function to handle Key Vault references when the default credential-based approach is not suitable:

```golang
options := &azureappconfiguration.Options{
	KeyVaultOptions: azureappconfiguration.KeyVaultOptions{
		SecretResolver: func(ctx context.Context, keyVaultReference url.URL) (string, error) {
			// Custom logic to resolve secrets
			// This could integrate with your existing secret management system
			// or provide fallback values for development environments
			
			if isDevelopment {
				return os.Getenv("FALLBACK_SECRET_VALUE"), nil
			}
			
			// Implement your custom secret retrieval logic here
			return retrieveSecret(keyVaultReference)
		},
	},
}
```

> [!IMPORTANT]
> If your application loads key-values containing Key Vault references without proper Key Vault configuration, an **error** will be returned during the load operation. Ensure you've properly configured Key Vault access or a secret resolver.

### Key Vault secret refresh

Azure App Configuration enables you to configure secret refresh intervals independently of your configuration refresh cycle. This is crucial for security because while the Key Vault reference URI in App Configuration remains unchanged, the underlying secret in Key Vault might be rotated as part of your security practices.

To ensure your application always uses the most current secret values, configure the `RefreshOptions` field in the `KeyVaultOptions` struct.

```golang
import (
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
)

// Create a credential for Key Vault access
credential, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
	log.Fatalf("Failed to create credential: %v", err)
}

options := &azureappconfiguration.Options{
	KeyVaultOptions: azureappconfiguration.KeyVaultOptions{
		Credential: credential,
		RefreshOptions: azureappconfiguration.RefreshOptions{
			Enabled: true,
			Interval: 5 * time.Minute,
		},
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

## Snapshot

[Snapshot](./concept-snapshots.md) is a named, immutable subset of an App Configuration store's key-values. The key-values that make up a snapshot are chosen during creation time through the usage of key and label filters. Once a snapshot is created, the key-values within are guaranteed to remain unchanged.

You can configure `SnapshotName` filed in the `Selector` struct to load key-values from a snapshot:

```golang
options := &azureappconfiguration.Options{
	Selectors: []azureappconfiguration.Selector{
		{KeyFilter: "app*", LabelFilter: "prod"},
		{SnapshotName: "my-snapshot"},
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

## Geo-replication

For information about using geo-replication, go to [Enable geo-replication](./howto-geo-replication.md).

## Startup retry

Configuration loading is a critical path operation during application startup. To ensure reliability, the Azure App Configuration provider implements a robust retry mechanism during the initial configuration load. This helps protect your application from transient network issues that might otherwise prevent successful startup.

You can customize this behavior via the `Options.StartupOptions`:

```golang
options := &azureappconfiguration.Options{
	StartupOptions: azureappconfiguration.StartupOptions{
		Timeout: 5 * time.Minute,
	},
}

appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
```

## Next steps

To learn how to use the Go configuration provider, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Use dynamic configuration in Go Console app](./enable-dynamic-configuration-go-console-app.md)

> [!div class="nextstepaction"]
> [Use dynamic configuration in Go Gin web app](./enable-dynamic-configuration-gin-web-app.md)