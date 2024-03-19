---
title: Use feature filters to enable conditional feature flags
titleSuffix: Azure App Configuration
description: Learn how to use feature filters in Azure App Configuration to enable conditional feature flags for your app.
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
author: zhiyuanliang
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 02/28/2024
#Customerintent: As a developer, I want to create a feature filter to activate a feature flag depending on a specific scenario.
---

# Use feature filters to enable conditional feature flags

Feature flags allow you to activate or deactivate functionality in your application. A simple feature flag is either on or off. The application always behaves the same way. For example, you could roll out a new feature behind a feature flag. When the feature flag is enabled, all users see the new feature. Disabling the feature flag hides the new feature.

In contrast, a _conditional feature flag_ allows the feature flag to be enabled or disabled dynamically. The application may behave differently, depending on the feature flag criteria. Suppose you want to show your new feature to a small subset of users at first. A conditional feature flag allows you to enable the feature flag for some users while disabling it for others. _Feature filters_ determine the state of the feature flag each time it's evaluated.

The `Microsoft.FeatureManagement` library includes the following built-in feature filters accessible from the Azure App Configuration portal.

- **Time window filter** enables the feature flag during a specified window of time.
- **Targeting filter** enables the feature flag for specified users and groups.

You can also create your own feature filter that implements the `Microsoft.FeatureManagement.IFeatureFilter` interface. For more information, see [Implementing a Feature Filter](https://github.com/microsoft/FeatureManagement-Dotnet#implementing-a-feature-filter).

## Prerequisites

- Follow the instructions in [Quickstart: Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md) to create a web app with a feature flag.
- Install the [`Microsoft.FeatureManagement.AspNetCore`](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) package of version **3.0.0** or later.

## Register a feature filter

If you have a [custom feature filter](https://github.com/microsoft/FeatureManagement-Dotnet#implementing-a-feature-filter), you can register it by calling the `AddFeatureFilter` method.

```csharp
services.AddFeatureManagement()
        .AddFeatureFilter<MyCriteriaFilter>();
```

Starting with version *3.0.0* of `Microsoft.FeatureManagement`, the following [built-in filters](https://github.com/microsoft/FeatureManagement-Dotnet#built-in-feature-filters) are registered automatically as part of the `AddFeatureManagement` call, so you don't need to register them.

- `TimeWindowFilter`
- `ContextualTargetingFilter`
- `PercentageFilter`

> [!TIP]
> For more information on using `TargetingFilter`, see [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md).

## Add a feature filter to a feature flag

In this section, you will learn how to add a feature filter to the **Beta** feature flag you created in the [Quickstart](./quickstart-feature-flag-aspnet-core.md). The following steps use the built-in `TimeWindowFilter` as an example.

1. In the Azure portal, go to your configuration store and select **Feature manager**.

    :::image type="content" source="./media/feature-filters/edit-beta-feature-flag.png" alt-text="Screenshot of the Azure portal, selecting the Edit option for the **Beta** feature flag, under Feature manager.":::

1. On the line with the **Beta** feature flag you created in the quickstart, select the context menu and then **Edit**.

1. In the **Edit feature flag** pane that opens, check the **Enable feature flag** checkbox if it isn't already enabled. Then check the **Use feature filter** checkbox and select **Create**.

    :::image type="content" source="./media/feature-filters/edit-a-feature-flag.png" alt-text="Screenshot of the Azure portal, filling out the form 'Edit feature flag'.":::

1. The pane **Create a new filter** opens. Under **Filter type**, select **Time window filter**.

    :::image type="content" source="./media/feature-filters/add-time-window-filter.png" alt-text="Screenshot of the Azure portal, creating a new time window filter.":::

1. Set the **Start date** to **Custom** and select a time a few minutes ahead of your current time. Set the **Expiry date** to **Never**

1. Select **Add** to save the new feature filter and return to the **Edit feature flag** screen.

1. The feature filter you created is now listed in the feature flag details. Select **Apply** to save the new feature flag settings.

    :::image type="content" source="./media/feature-filters/feature-flag-edit-apply-filter.png" alt-text="Screenshot of the Azure portal, applying new time window filter.":::

1. On the **Feature manager** page, the feature flag now has a **Feature filter(s)** value of **1**.

    :::image type="content" source="./media/feature-filters/updated-feature-flag.png" alt-text="Screenshot of the Azure portal, displaying updated feature flag.":::

## Feature filters in action

Relaunch the application you created in the [Quickstart](./quickstart-feature-flag-aspnet-core.md). If your current time is earlier than the start time set for the time window filter, the **Beta** menu item will not appear on the toolbar. This is because the **Beta** feature flag is disabled by the time window filter.

Once the start time has passed, refresh your browser a few times. You will notice that the **Beta** menu item will now appear. This is because the **Beta** feature flag is now enabled by the time window filter.

## Next steps

> [!div class="nextstepaction"]
> [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md)
