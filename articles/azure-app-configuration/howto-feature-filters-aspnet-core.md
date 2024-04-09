---
title: Enable conditional features with a custom filter in an ASP.NET Core app
titleSuffix: Azure App Configuration
description: Learn how to implement a custom feature filter to enable conditional feature flags for your ASP.NET Core app.
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
author: zhiyuanliang
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 03/28/2024
---

# Tutorial: Enable conditional features with a custom filter in an ASP.NET Core app

Feature flags can use feature filters to enable features conditionally. To learn more about feature filters, see [Tutorial: Enable conditional features with feature filters](./howto-feature-filters.md).

The example used in this tutorial is based on the ASP.NET Core app introduced in the feature management [quickstart](./quickstart-feature-flag-aspnet-core.md). Before proceeding further, complete the quickstart to create an ASP.NET Core app with a *Beta* feature flag. Once completed, you must [add a custom feature filter](./howto-feature-filters.md) to the *Beta* feature flag in your App Configuration store. 

In this tutorial, you'll learn how to implement a custom feature filter and use the feature filter to enable features conditionally.

## Prerequisites

- Create an [ASP.NET Core app with a feature flag](./quickstart-feature-flag-aspnet-core.md).
- [Add a custom feature filter to the feature flag](./howto-feature-filters.md)

## Implement a custom feature filter

You've added a custom filter called *Random* filter with a configurable parameter *Percentage* for your feature flag in the prerequisites. In this example, you'll implement it to enable the feature flag at the random rate specified by the *Percentage* parameter.

1. Add `RandomFilter.cs` file.

    ```csharp
    using Microsoft.FeatureManagement;

    namespace TestAppConfig
    {
        [FilterAlias("Random")]
        public class RandomFilter : IFeatureFilter
        {
            private readonly Random _random;

            public RandomFilter()
            {
                _random = new Random();
            }

            public Task<bool> EvaluateAsync(FeatureFilterEvaluationContext context)
            {
                int percentage = context.Parameters.GetSection("Percentage").Get<int>();

                int randomNumber = _random.Next(100);

                return Task.FromResult(randomNumber <= percentage);
            }
        }
    }
    ```

    *RandomFilter* implements the `IFeatureFilter` interface provided by the `Microsoft.FeatureManagement` library. The `IFeatureFilter` has a single method named `EvaluateAsync`. When a feature specifies that it can be enabled for a feature filter, the `EvaluateAsync` method is called. If `EvaluateAsync` returns true, it means the feature should be enabled.

1. Open the *Program.cs" and register the *Random* filter by calling the `AddFeatureFilter` method. 

    ```csharp
    // The rest of existing code in Program.cs
    // ... ...

    // Add feature management to the container of services.
    builder.Services.AddFeatureManagement()
                    .AddFeatureFilter<RandomFilter>();

    // The rest of existing code in Program.cs
    // ... ...
    ```

## Feature filter in action

Relaunch the application you created in the [Quickstart](./quickstart-feature-flag-aspnet-core.md). This time, you don't toggle the *Beta* feature flag anymore. The *Beta* menu shows up based on the filter condition. Refresh the browser a few times, and you'll see that sometimes the *Beta* menu appears and sometimes it does not.

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu hidden.](./media/quickstarts/aspnet-core-feature-flag-local-before.png)

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu.](./media/quickstarts/aspnet-core-feature-flag-local-after.png)

## Next steps

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeting audience](./howto-targetingfilter.md)
