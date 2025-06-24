---
title: "Tutorial - Use dynamic configuration in a Go console app"
titleSuffix: Azure App Configuration
description: In this quickstart, learn how to dynamically refresh Azure App Configuration data in a Go console application
ms.service: azure-app-configuration
services: azure-app-configuration
author: linglingye
ms.devlang: golang
ms.topic: quickstart
ms.custom: quickstart, mode-other, devx-track-go
ms.date: 05/22/2025
ms.author: linglingye
---

# Tutorial: Enable dynamic configuration refresh in a Go console app

In this quickstart, you'll enhance a basic Go console application to dynamically refresh configuration from Azure App Configuration. This allows your application to pick up configuration changes without requiring a restart.

## Prerequisites

- Complete the [Quickstart: Create a Go console app with Azure App Configuration](./quickstart-go-console-app.md) as the starting point for this quickstart

## Reload data from App Configuration

1. Open the file *`appconfig.go`*. Inside the `loadAzureAppConfiguration` function, update the `options` to enable refresh. Go provider will reload the entire configuration whenever it detects a change in any of the selected key-values (those starting with *Config.* and having no label). For more information about monitoring configuration changes, see [Best practices for configuration refresh](./howto-best-practices.md#configuration-refresh).

    ```golang
    options := &azureappconfiguration.Options{
        Selectors: []azureappconfiguration.Selector{
            {
                KeyFilter: "Config.*",
            },
        },
        TrimKeyPrefixes: []string{"Config."},
        RefreshOptions: azureappconfiguration.KeyValueRefreshOptions{
            Enabled:  true,
        },
    }
    ```

    > [!TIP]
    > You can set the `Interval` property of the `RefreshOptions` to specify the minimum time between configuration refreshes. In this example, you use the default value of 30 seconds. Adjust to a higher value if you need to reduce the number of requests made to your App Configuration store.

2. Open the file *`unmarshal_sample.go`* and add the following code to your main function:

    ```golang
    // Existing code in unmarshal_sample.go
    // ... ...
    fmt.Printf("Timeout: %d seconds\n", config.App.Settings.Timeout)
    fmt.Printf("Retry Count: %d\n", config.App.Settings.RetryCount)

    // Register refresh callback to update and display the configuration
    provider.OnRefreshSuccess(func() {
        // Re-unmarshal the configuration
        err := appCfgProvider.Unmarshal(&updatedConfig, nil)
        if err != nil {
            log.Printf("Error unmarshalling updated configuration: %s", err)
            return
        }
        
        // Display the updated configuration
        displayConfig(config)
    })

    // Setup a channel to listen for termination signals
    done := make(chan os.Signal, 1)
    signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)

    fmt.Println("\nWaiting for configuration changes...")
    fmt.Println("(Update values in Azure App Configuration to see refresh in action)")
    fmt.Println("Press Ctrl+C to exit")

    // Start a ticker to periodically trigger refresh
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()

    // Keep the application running until terminated
    for {
        select {
        case <-ticker.C:
            // Trigger refresh in background
            go func() {
                ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
                defer cancel()
                
                if err := provider.Refresh(ctx); err != nil {
                    log.Printf("Error refreshing configuration: %s", err)
                }
            }()
        case <-done:
            fmt.Println("\nExiting...")
            return
        }
    }
    ```

## Run the application

1. Run your application:

   ```bash
   go run unmarshal_sample.go
   ```

2. Keep the application running.

3. Navigate to your App Configuration store and update the value of the `Config.Message` key.

    | Key                    | Value                                  | Content type       |
    |------------------------|----------------------------------------|--------------------|
    | *Config.Message*       | *Hello World - updated!*               | Leave empty        |

4. Observe your console application - within 30 seconds, it should detect the change and display the updated configuration.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]
