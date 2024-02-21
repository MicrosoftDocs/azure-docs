---
title: Use feature filters to enable conditional feature flags
titleSuffix: Azure App Configuration
description: Learn how to use feature filters in Azure App Configuration to enable conditional feature flags for your app.
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
author: maud-lv
ms.author: malev
ms.topic: how-to
ms.date: 01/12/2024
#Customerintent: As a developer, I want to create a feature filter to activate a feature flag depending on a specific scenario.
---

# Use feature filters to enable conditional feature flags

Feature flags allow you to activate or deactivate functionality in your application. A simple feature flag is either on or off. The application always behaves the same way. For example, you could roll out a new feature behind a feature flag. When the feature flag is enabled, all users see the new feature. Disabling the feature flag hides the new feature.

In contrast, a _conditional feature flag_ allows the feature flag to be enabled or disabled dynamically. The application may behave differently, depending on the feature flag criteria. Suppose you want to show your new feature to a small subset of users at first. A conditional feature flag allows you to enable the feature flag for some users while disabling it for others. _Feature filters_ determine the state of the feature flag each time it's evaluated.

The `Microsoft.FeatureManagement` library includes three feature filters:

- `PercentageFilter` enables the feature flag based on a percentage.
- `TimeWindowFilter` enables the feature flag during a specified window of time.
- `TargetingFilter` enables the feature flag for specified users and groups.

You can also create your own feature filter that implements the Microsoft.FeatureManagement.IFeatureFilter interface.

## Prerequisites

- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).

## Register a feature filter

You register a feature filter by calling the `AddFeatureFilter` method, specifying the type name of the desired feature filter. For example, the following code registers `PercentageFilter`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();
    services.AddFeatureManagement().AddFeatureFilter<PercentageFilter>();
}
```

## Configure a feature filter in Azure App Configuration

Some feature filters have additional settings. For example, `PercentageFilter` activates a feature based on a percentage. It has a setting defining the percentage to use.

You can configure these settings for feature flags defined in Azure App Configuration. For example, follow these steps to use `PercentageFilter` to enable the feature flag for 50% of requests to a web app:

1. Follow the instructions in [Quickstart: Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md) to create a web app with a feature flag.

1. In the Azure portal, go to your configuration store and select **Feature manager**.

    :::image type="content" source="./media/feature-filters/edit-beta-feature-flag.png" alt-text="Screenshot of the Azure portal, selecting the Edit option for the Beta feature flag, under Feature manager.":::

1. On the line with the Beta feature flag you created in the quickstart, select the context menu and then **Edit**.

1. In the **Edit feature flag** pane that opens, check the **Enable feature flag** checkbox if it isn't already enabled. Then check the **Use feature filter** checkbox and select **Create**.

    :::image type="content" source="./media/feature-filters/edit-a-feature-flag.png" alt-text="Screenshot of the Azure portal, filling out the form 'Edit feature flag'.":::

1. The pane **Create a new filter** opens. Under **Filter type**, select **Targeting filter** to enable a new filter for specific users or a group.

    :::image type="content" source="./media/feature-filters/add-targeting-filter.png" alt-text="Screenshot of the Azure portal, creating a new targeting filter.":::

1. Optionally expand the **Evaluation flow** menu to see a graph showing how the targeting filter is evaluated in the selected scenario. Leave the **Default Percentage** at 50. The options **Override by Groups** and **Override by Users** let you enable or disable the feature flag for select groups or users. These options are disabled by default.
1. Select **Add** to save the new feature filter and return to the **Edit feature flag** screen.

1. The feature filter you created is now listed in the feature flag details. Select **Apply** to save the new feature flag settings.

    :::image type="content" source="./media/feature-filters/feature-flag-edit-apply-filter.png" alt-text="Screenshot of the Azure portal, applying new targeting filter.":::

1. On the **Feature manager** page, the feature flag now has a **Feature filter(s)** value of **1**.

    :::image type="content" source="./media/feature-filters/updated-feature-flag.png" alt-text="Screenshot of the Azure portal, displaying updated feature flag.":::

## Feature filters in action

To see the effects of this feature flag, launch the application and hit the **Refresh** button in your browser multiple times. You'll see that the *Beta* item appears on the toolbar about 50% of the time. It's hidden the rest of the time, because the `PercentageFilter` deactivates the *Beta* feature for a subset of requests. The following video shows this behavior in action.

:::image type="content" source="./media/feature-filters/feature-flags-percentagefilter.gif" alt-text="Screenshot of a web browser showing a targeting filter in action.":::

## Next steps

> [!div class="nextstepaction"]
> [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md)
