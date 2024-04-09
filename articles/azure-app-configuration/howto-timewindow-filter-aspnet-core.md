---
title: Enable features on a schedule in an ASP.NET Core app
titleSuffix: Azure App Configuration
description: Learn how to enable feature flags on a schedule in an ASP.NET Core app.
ms.service: azure-app-configuration
ms.devlang: csharp
author: zhiyuanliang
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 03/26/2024
---

# Tutorial: Enable features on a schedule in an ASP.NET Core app

In this tutorial, you use the time window filter to enable a feature on a schedule for your ASP.NET Core app. For more information about the time window filter, please read this [article](./howto-timewindow-filter.md).

## Prerequisites

- Follow the instructions in [Quickstart: Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md) to create a web app with a feature flag.
- Update the [`Microsoft.FeatureManagement.AspNetCore`](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore/) package of version **3.0.0** or later.

## Use the time window filter

Starting with version *3.0.0* of `Microsoft.FeatureManagement`, the following [built-in filters](https://github.com/microsoft/FeatureManagement-Dotnet#built-in-feature-filters) are registered automatically as part of the `AddFeatureManagement` call, so you don't need to register them.

- `TimeWindowFilter`
- `ContextualTargetingFilter`
- `PercentageFilter`

> [!TIP]
> For more information on using `TargetingFilter`, see [Roll out features to targeted audience](./howto-targetingfilter-aspnet-core.md). 

You've registered the feature management service in your ASP.NET Core app in the [Quickstart](./quickstart-feature-flag-aspnet-core.md). The `TimeWindowFilter` has been added automatically as part of the AddFeatureManagement call.

```csharp
// This call will also register built-in filters to the container of services.
builder.Services.AddFeatureManagement();
```

Follow the instructions in [Enable features on a schedule](./howto-timewindow-filter.md) to add a time window filter for the **Beta** feature flag you created in the [Quickstart](./quickstart-feature-flag-aspnet-core.md).

Relaunch the application. If your current time is earlier than the start time set for the time window filter, the **Beta** menu item won't appear on the toolbar. This is because the **Beta** feature flag is disabled by the time window filter.

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu hidden.](./media/quickstarts/aspnet-core-feature-flag-local-before.png)

Once the start time has passed, refresh your browser a few times. You'll notice that the **Beta** menu item now appears. This is because the **Beta** feature flag is now enabled by the time window filter.

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu.](./media/quickstarts/aspnet-core-feature-flag-local-after.png)

## Next steps

> [!div class="nextstepaction"]
> [Feature management overview](./concept-feature-management.md)

> [!div class="nextstepaction"]
> [Enable staged rollout of features for targeted audiences](./howto-targetingfilter-aspnet-core.md)
