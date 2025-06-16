---
title: "Tutorial: Use dynamic configuration in a Gin web app"
titleSuffix: Azure App Configuration
description: In this quickstart, learn how to dynamically update configuration data for Gin web applications
author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.topic: quickstart
ms.date: 05/27/2025
ms.author: linglingye
ms.custom: devx-track-go
---

# Tutorial: Use dynamic configuration in a Gin web app

This tutorial shows how you can implement dynamic configuration updates in a Gin web application using Azure App Configuration. It builds on the web app introduced in the previous quickstart.

## Prerequisites

Finish the quickstart: [Create a Gin web app with Azure App Configuration](./quickstart-go-web-app.md)

## Reload data from App Configuration

1. Open the file *`appconfig.go`*. Inside the `loadAzureAppConfiguration` function, update the `options` to enable refresh. Go provider will reload the entire configuration whenever it detects a change in any of the selected key-values. For more information about monitoring configuration changes, see [Best practices for configuration refresh](./howto-best-practices.md#configuration-refresh).

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

2. Update your `main.go` file to register a callback function for configuration updates:

    ```golang
    // Existing code
    // ... ...
    var config Config
    if err := provider.Unmarshal(&config, nil); err != nil {
        log.Fatalf("Failed to unmarshal configuration: %v", err)
    }

    // Register refresh callback
    provider.OnRefreshSuccess(func() {
        // Re-unmarshal the configuration
        err := provider.Unmarshal(&config, nil)
        if err != nil {
            log.Printf("Failed to unmarshal updated configuration: %s", err)
            return
        }
    })
    ```

3. Add a configuration refresh middleware. Update *`main.go`* with the following code.

    ```golang
    func configRefreshMiddleware(provider *azureappconfiguration.AzureAppConfiguration) gin.HandlerFunc {
        return func(c *gin.Context) {
            // Start refresh in a goroutine to avoid blocking the request
            go func() {
                ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
                defer cancel()

                if err := provider.Refresh(ctx); err != nil {
                    log.Printf("Error refreshing configuration: %s", err)
                }
            }()

            c.Next()
        }
    }
    ```

4. Use the configuration refresh middleware:

    ```golang
    // Existing code
    // ... ...
    router := gin.Default()

    // Use the configuration refresh middleware
    router.Use(configRefreshMiddleware(provider))

    // The rest of existing code
    //... ...
    ```

## Request-driven configuration refresh

The configuration refresh is triggered by the incoming requests to your web app. No refresh will occur if your app is idle. When your app is active, the configuration refresh middleware monitors the selected key-values you configured in `azureappconfiguration.Options`. The middleware is triggered upon every incoming request to your app. However, the middleware will only send requests to check the value in App Configuration when the refresh interval you set has passed.

- If a request to App Configuration for change detection fails, your app will continue to use the cached configuration. New attempts to check for changes will be made periodically while there are new incoming requests to your app.
- The configuration refresh happens asynchronously to the processing of your app's incoming requests. It will not block or slow down the incoming request that triggered the refresh. The request that triggered the refresh may not get the updated configuration values, but later requests will get new configuration values.
- To ensure the middleware is triggered, use the configuration refresh middleware as early as appropriate in your request pipeline so another middleware won't skip it in your app.

## Run the web application

Now that you've set up dynamic configuration refresh, let's test it to see it in action.

1. Run the application.

   ```bash
   go run main.go
   ```

2. Open a web browser and navigate to `http://localhost:8080` to access your application. The web page looks like this:

    :::image type="content" source="./media/quickstarts/gin-app-refresh-before.png" alt-text="Screenshot of the gin web app refresh before.":::

3. Navigate to your App Configuration store and update the value of the `Config.Message` key.

    | Key                    | Value                                  | Content type       |
    |------------------------|----------------------------------------|--------------------|
    | *Config.Message*       | *Hello from Azure App Configuration - now with live updates!*               | Leave empty        |

4. After refreshing the browser a few times, you'll see the updated content once the ConfigMap is updated in 30 seconds.

    :::image type="content" source="./media/quickstarts/gin-app-refresh-after.png" alt-text="Screenshot of the gin web app refresh after.":::


## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]
