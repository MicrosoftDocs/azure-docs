---
title: Quickstart for adding feature flags to Go console apps
titleSuffix: Azure App Configuration
description: Learn to implement feature flags in your Go console application using feature management and Azure App Configuration. Dynamically manage feature rollouts and control feature visibility without redeploying the app.
services: azure-app-configuration
author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.topic: quickstart
ms.custom: devx-track-go, mode-other
ms.date: 07/03/2025
ms.author: linglingye
#Customer intent: As a Go developer, I want to use feature flags to control feature availability quickly and confidently.
---

# Quickstart: Add feature flags to a Go console app

In this quickstart, you'll create a feature flag in Azure App Configuration and use it to dynamically control the availability of features in a Go console app.

The feature management support extends the dynamic configuration feature in App Configuration. This example demonstrates how to integrate feature flags into a Go console application with real-time monitoring capabilities.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Go 1.21 or later. For information on installing Go, see the [Go downloads page](https://golang.org/dl/).
- [Azure App Configuration Go provider](https://pkg.go.dev/github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration) v1.1.0 or later.

## Create a feature flag

Add a feature flag called *Beta* to the App Configuration store and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store using the Azure portal or the CLI, go to [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag).

:::image type="content" source="./media/add-beta-feature-flag.png" alt-text="Screenshot of creating a feature flag.":::

## Use a feature flag

1. Create a new directory for your Go project and navigate into it:

    ```console
    mkdir go-feature-flag-quickstart
    cd go-feature-flag-quickstart
    ```

1. Initialize a new Go module:

    ```console
    go mod init go-feature-flag-quickstart
    ```

1. Install the required Go packages for Azure App Configuration and feature management:

    ```console
    go get github.com/microsoft/Featuremanagement-Go/featuremanagement
    go get github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig
    ```

1. Create a file named `appconfig.go` with the following content. You can connect to your App Configuration store using Microsoft Entra ID (recommended) or a connection string.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    ```golang
    package main

    import (
        "context"
        "log"
        "os"

        "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    )

    func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.AzureAppConfiguration, error) {
        // Get the endpoint from environment variable
        endpoint := os.Getenv("AZURE_APPCONFIG_ENDPOINT")
        if endpoint == "" {
            log.Fatal("AZURE_APPCONFIG_ENDPOINT environment variable is not set")
        }

        // Create a credential using DefaultAzureCredential
        credential, err := azidentity.NewDefaultAzureCredential(nil)
        if err != nil {
            log.Fatalf("Failed to create credential: %v", err)
        }

        // Set up authentication options with endpoint and credential
        authOptions := azureappconfiguration.AuthenticationOptions{
            Endpoint:   endpoint,
            Credential: credential,
        }

        // Configure feature flag options
        options := &azureappconfiguration.Options{
            FeatureFlagOptions: azureappconfiguration.FeatureFlagOptions{
                Enabled: true,
                RefreshOptions: azureappconfiguration.RefreshOptions{
                    Enabled: true,
                },
            },
        }

        // Load configuration from Azure App Configuration
        appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
        if err != nil {
            log.Fatalf("Failed to load configuration: %v", err)
        }

        return appConfig, nil
    }
    ```

    ### [Connection string](#tab/connection-string)

    ```golang
    package main

    import (
        "context"
        "log"
        "os"

        "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
    )

    func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.AzureAppConfiguration, error) {
        // Get the connection string from environment variable
        connectionString := os.Getenv("AZURE_APPCONFIG_CONNECTION_STRING")
        if connectionString == "" {
            log.Fatal("AZURE_APPCONFIG_CONNECTION_STRING environment variable is not set")
        }

        // Set up authentication options with connection string
        authOptions := azureappconfiguration.AuthenticationOptions{
            ConnectionString: connectionString,
        }

        // Configure feature flag options
        options := &azureappconfiguration.Options{
            FeatureFlagOptions: azureappconfiguration.FeatureFlagOptions{
                Enabled: true,
                RefreshOptions: azureappconfiguration.RefreshOptions{
                    Enabled: true,
                },
            },
        }

        // Load configuration from Azure App Configuration
        appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
        if err != nil {
            log.Fatalf("Failed to load configuration: %v", err)
        }

        return appConfig, nil
    }
    ```

    ---

    > [!TIP]
    > When no selector is specified in `FeatureFlagOptions`, it loads *all* feature flags with *no label* in your App Configuration store. The default refresh interval of feature flags is 30 seconds. You can customize this behavior via the `RefreshOptions` parameter. For example, the following code snippet loads only feature flags that start with *TestApp:* in their *key name* and have the label *dev*. The code also changes the refresh interval time to 5 minutes. Note that this refresh interval time is separate from that for regular key-values.
    >
    > ```golang
    > azureappconfiguration.FeatureFlagOptions{
    >     Enabled: true,
    >     Selectors: []azureappconfiguration.Selector{
    >         {
    >             KeyFilter:   "TestApp:*",
    >             LabelFilter: "dev",
    >         },
    >     },
    >     RefreshOptions: azureappconfiguration.RefreshOptions{
    >         Enabled: true,
    >         Interval: 5 * time.Minute,
    >     },
    > }
    > ```

1. Create the main application file `main.go`:

    ```golang
    package main

    import (
    	"context"
    	"fmt"
    	"log"
    	"os"
    	"time"

    	"github.com/microsoft/Featuremanagement-Go/featuremanagement"
    	"github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig"
    )

    func main() {
        ctx := context.Background()

        // Load Azure App Configuration
        appConfig, err := loadAzureAppConfiguration(ctx)
        if err != nil {
            log.Fatalf("Error loading Azure App Configuration: %v", err)
        }

        // Create feature flag provider
        featureFlagProvider, err := azappconfig.NewFeatureFlagProvider(appConfig)
        if err != nil {
            log.Fatalf("Error creating feature flag provider: %v", err)
        }

        // Create feature manager
        featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, nil)
        if err != nil {
            log.Fatalf("Error creating feature manager: %v", err)
        }

        // Monitor the Beta feature flag
        fmt.Println("Monitoring 'Beta' feature flag (press Ctrl+C to exit):")
        fmt.Println("Toggle the Beta feature flag in Azure portal to see real-time updates...")
        fmt.Println()

        ticker := time.NewTicker(5 * time.Second)
        defer ticker.Stop()

        for {
            select {
            case <-ticker.C:
                // Refresh configuration to get latest feature flag settings
                if err := appConfig.Refresh(ctx); err != nil {
                    log.Printf("Error refreshing configuration: %v", err)
                    continue
                }

                // Evaluate the Beta feature flag
                isEnabled, err := featureManager.IsEnabled("Beta")
                if err != nil {
                    log.Printf("Error checking if Beta feature is enabled: %v", err)
                    continue
                }

                // Print timestamp and feature status
                timestamp := time.Now().Format("15:04:05")
                fmt.Printf("[%s] Beta is enabled: %t\n", timestamp, isEnabled)

            case <-ctx.Done():
                fmt.Println("\nShutting down...")
                return
            }
        }
    }
    ```

## Run the application

1. Run the application:

    ```console
    go mod tidy
    go run .
    ```
    ---

1. The application starts monitoring the *Beta* feature flag and displays its current state every 5 seconds:

    ```console
    Monitoring 'Beta' feature flag (press Ctrl+C to exit):
    Toggle the Beta feature flag in Azure portal to see real-time updates...

    [14:30:15] Beta is enabled: false
    [14:30:20] Beta is enabled: false
    [14:30:25] Beta is enabled: false
    ```

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store that you created previously.

1. Select **Feature manager** and locate the *Beta* feature flag. Enable the flag by selecting the checkbox under **Enabled**.

1. Return to your console application. After a few seconds, you should see the feature flag status change:

    ```console
    [14:30:30] Beta is enabled: false
    [14:30:35] Beta is enabled: true
    [14:30:40] Beta is enabled: true
    ```

1. You can toggle the feature flag on and off in the Azure portal to see real-time updates in your console application without restarting it.

1. Press **Ctrl+C** to stop the application.

## Clean up resources

[!INCLUDE[Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a feature flag in Azure App Configuration and used it in a Go console application. The [Feature Management Go library](https://github.com/microsoft/FeatureManagement-Go) provides rich feature flag capabilities that integrate seamlessly with Azure App Configuration. For more features, continue to the following document.

> [!div class="nextstepaction"]
> [Go Feature Management reference](https://pkg.go.dev/github.com/microsoft/Featuremanagement-Go/featuremanagement)

While a feature flag allows you to activate or deactivate functionality in your app, you may want to customize a feature flag based on your app's logic. Feature filters allow you to enable a feature flag conditionally. For more information, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

Azure App Configuration offers built-in feature filters that enable you to activate a feature flag only during a specific period or to a particular targeted audience of your app. For more information, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)