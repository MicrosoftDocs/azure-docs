---
title: Enable features on a schedule in an ASP.NET Core application
titleSuffix: Azure App Configuration
description: Learn how to enable feature flags on a schedule in an ASP.NET Core application.
ms.service: azure-app-configuration
ms.devlang: csharp
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 03/26/2024
---

# Tutorial: Enable features on a schedule in an ASP.NET Core application

In this tutorial, you use the time window filter to enable a feature on a schedule for an ASP.NET Core application. 

The example used in this tutorial is based on the ASP.NET Core application introduced in the feature management [quickstart](./quickstart-feature-flag-aspnet-core.md). Before proceeding further, complete the quickstart to create an ASP.NET Core application with a *Beta* feature flag. Once completed, you must [add a time window filter](./howto-timewindow-filter.md) to the *Beta* feature flag in your App Configuration store.

## Prerequisites

- Create an [ASP.NET Core application with a feature flag](./quickstart-feature-flag-aspnet-core.md).
- [Add a time window filter to the feature flag](./howto-timewindow-filter.md)
- Update the [`Microsoft.FeatureManagement.AspNetCore`](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) package to version **3.0.0** or later.

## Use the time window filter

You've added a time window filter for your *Beta* feature flag in the prerequisites. Next, you'll use the feature flag with the time window filter in your ASP.NET Core application.

Starting with version *3.0.0* of `Microsoft.FeatureManagement`, the following [built-in filters](https://github.com/microsoft/FeatureManagement-Dotnet#built-in-feature-filters) are registered automatically as part of the `AddFeatureManagement` call. You don't need to add `TimeWindowFilter` manually.

- `TimeWindowFilter`
- `ContextualTargetingFilter`
- `PercentageFilter`

```csharp
// This call will also register built-in filters to the container of services.
builder.Services.AddFeatureManagement();
```

## Time window filter in action

Relaunch the application. If your current time is earlier than the start time set for the time window filter, the **Beta** menu item won't appear on the toolbar. This is because the *Beta* feature flag is disabled by the time window filter.

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu hidden.](./media/quickstarts/aspnet-core-feature-flag-local-before.png)

Once the start time has passed, refresh your browser a few times. You'll notice that the **Beta** menu item now appears. This is because the *Beta* feature flag is now enabled by the time window filter.

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu.](./media/quickstarts/aspnet-core-feature-flag-local-after.png)

## Next steps

To learn more about the feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)
