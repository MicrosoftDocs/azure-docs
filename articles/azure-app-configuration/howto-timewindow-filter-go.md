---
title: Enable features on a schedule in a Go Gin web application
titleSuffix: Azure App Configuration
description: Learn how to enable feature flags on a schedule in a Go Gin web application by using time window filters.
ms.service: azure-app-configuration
ms.devlang: golang
author: linglingye
ms.author: linglingye
ms.topic: how-to
ms.custom: devx-track-go, mode-other
ms.date: 07/25/2025
---

# Enable features on a schedule in a Go Gin web application

In this guide, you use the time window filter to enable a feature on a schedule for a Go Gin web application. 

The example used in this article is based on the Go Gin web application introduced in the feature management [quickstart](./quickstart-feature-flag-go-gin.md). Before proceeding further, complete the quickstart to create a Go Gin web application with a *Beta* feature flag. Once completed, you must [add a time window filter](./howto-timewindow-filter.md) to the *Beta* feature flag in your App Configuration store.

## Prerequisites

- Create a [Go Gin web application with a feature flag](./quickstart-feature-flag-go-gin.md).
- [Add a time window filter to the feature flag](./howto-timewindow-filter.md)

## Use the time window filter

You added a time window filter for your *Beta* feature flag in the prerequisites. Next, you'll use the feature flag with the time window filter in your Go Gin web application.

When you create a feature manager, the built-in feature filters are automatically added to its feature filter collection

The existing code from the quickstart already handles time window filters through the feature manager:

```golang
// Create feature flag provider
featureFlagProvider, err := azappconfig.NewFeatureFlagProvider(appConfig)
if err != nil {
    log.Fatalf("Error creating feature flag provider: %v", err)
}

// Create feature manager (supports built-in filters including TimeWindowFilter)
featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, nil)
if err != nil {
    log.Fatalf("Error creating feature manager: %v", err)
}
```

The feature evaluation in your middleware will now respect the time window filter:

```golang
func (app *WebApp) featureMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Check if Beta feature is enabled (TimeWindowFilter is automatically evaluated)
        betaEnabled, err := app.featureManager.IsEnabled("Beta")
        if err != nil {
            log.Printf("Error checking Beta feature: %v", err)
        }

        // Store feature flag status for use in templates
        c.Set("betaEnabled", betaEnabled)
        c.Next()
    }
}
```

## Time window filter in action

Relaunch the application. If your current time is earlier than the start time set for the time window filter, the **Beta** menu item won't appear on the toolbar. This is because the *Beta* feature flag is disabled by the time window filter.

:::image type="content" source="./media/quickstarts/gin-app-feature-flag-before.png" alt-text="Screenshot of Gin web app with Beta menu hidden.":::

Once the start time has passed, refresh your browser a few times. You'll notice that the **Beta** menu item now appears. This is because the *Beta* feature flag is now enabled by the time window filter.

:::image type="content" source="./media/quickstarts/gin-app-feature-flag-after.png" alt-text="Screenshot of Gin web app with Beta menu.":::

## Next steps

To learn more about the feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)

For the full feature rundown of the Go feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [Go Feature Management reference](https://pkg.go.dev/github.com/microsoft/Featuremanagement-Go/featuremanagement)