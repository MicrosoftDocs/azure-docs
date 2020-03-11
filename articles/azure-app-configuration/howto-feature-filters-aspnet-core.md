---
title: Use feature filters to enable a feature for a subset of users
titleSuffix: Azure App Configuration
description: Learn how to use feature filters to enable a feature for a subset of users
ms.service: azure-app-configuration
author: lisaguthrie

ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 3/9/2020
ms.author: lcozzens

---
# Use feature filters to enable a feature for a subset of users

Feature flags allow you to dynamically show or hide functionality in your application. A simple feature flag is either on or off. Every request experiences the same behavior. For example, you could roll out a new feature behind a feature flag. When the feature flag is enabled, all users see the new feature. Disabling the feature flag hides the new feature.

In contrast, a _conditional feature flag_ allows different requests to experience different behavior. Suppose you want to enable your new feature for a small subset of users at first. A conditional feature flag allows you to enable the feature flag for some users while disabling it for others. _Feature filters_ determine the behavior in effect for a given request.

The `Microsoft.FeatureManagement` library includes two feature filters:

- `PercentageFilter` enables the feature flag for a specified percentage of requests.
- `TimeWindowFilter` enables the feature flag during a specified window of time.

You can also create your own feature filter that implements the [Microsoft.FeatureManagement.IFeatureFilter interface](/dotnet/api/microsoft.featuremanagement.ifeaturefilter).

## Registering a feature filter

You register a feature filter by calling the `AddFeatureFilter` method, specifying the name of the feature filter. For example, the following code registers `PercentageFilter`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();
    services.AddFeatureManagement().AddFeatureFilter<PercentageFilter>();
}
```

## Configuring a feature filter in Azure App Configuration

Some feature filters have additional settings. For example, `PercentageFilter` has a setting specifying the percentage of requests for which the feature is enabled.

You can configure these settings for feature flags defined in Azure App Configuration. For example, follow these steps to use `PercentageFilter` to enable the feature flag for 50% of requests:

1. Follow the instructions in [Quickstart: Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md) to create a web app with a feature flag.

1. In the Azure portal, go to your configuration store and click **Feature Manager**.

1. Click on the context menu for the *Beta* feature flag that you created in the quickstart. Click **Edit**.

    > [!div class="mx-imgBorder"]
    > ![Edit Beta feature flag](./media/edit-beta-feature-flag.png)

1. In the **Edit** screen, select the **On** radio button if it isn't already selected. Then click the **Add Filter** button. (The **On** radio button's label will change to read **Conditional**.)

1. In the **Key** field, enter *Microsoft.Percentage*.

    > [!div class="mx-imgBorder"]
    > ![Add feature filter](./media/feature-flag-add-filter.png)

1. Click the context menu next to the feature filter key. Click **Edit Parameters**.

    > [!div class="mx-imgBorder"]
    > ![Edit feature filter parameters](./media/feature-flag-edit-filter-parameters.png)

1. Hover under the **Name** header so that text boxes appear in the grid. Enter a **Name** of *Value* and a **Value** of 50. The **Value** field indicates the percentage of requests for which to enable the feature filter.

    > [!div class="mx-imgBorder"]
    > ![Set feature filter parameters](./media/feature-flag-set-filter-parameters.png)

1. Click **Apply** to return to the **Edit feature flag** screen. Then click **Apply** again to save the feature flag settings.

1. The **State** of the feature flag now appears as *Conditional*. This state indicates that the feature flag will be enabled or disabled on a per-request basis, based on the criteria enforced by the feature filter.

    > [!div class="mx-imgBorder"]
    > ![Conditional feature flag](./media/feature-flag-filter-enabled.png)

## Feature filters in action

To see the effects of this feature flag, launch the application and hit the **Refresh** button in your browser multiple times. You'll see that the *Beta* item appears on the toolbar about 50% of the time. It's hidden the rest of the time, because the `PercentageFilter` dynamically enables the *Beta* feature for a subset of requests. The following video shows this behavior in action.

> [!div class="mx-imgBorder"]
> ![PercentageFilter in action](./media/feature-flags-percentagefilter.gif)

## Next steps

> [!div class="nextstepaction"]
> [Feature management overview](./concept-feature-management.md)