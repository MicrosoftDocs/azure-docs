---
title: Enable conditional features with a custom filter in an ASP.NET Core application
titleSuffix: Azure App Configuration
description: Learn how to implement a custom feature filter to enable conditional feature flags for your ASP.NET Core application.
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 03/28/2024
---

# Tutorial: Enable conditional features with a custom filter in an ASP.NET Core application

Feature flags can use feature filters to enable features conditionally. To learn more about feature filters, see [Tutorial: Enable conditional features with feature filters](./howto-feature-filters.md).

The example used in this tutorial is based on the ASP.NET Core application introduced in the feature management [quickstart](./quickstart-feature-flag-aspnet-core.md). Before proceeding further, complete the quickstart to create an ASP.NET Core application with a *Beta* feature flag. Once completed, you must [add a custom feature filter](./howto-feature-filters.md) to the *Beta* feature flag in your App Configuration store. 

In this tutorial, you'll learn how to implement a custom feature filter and use the feature filter to enable features conditionally.

## Prerequisites

- Create an [ASP.NET Core app with a feature flag](./quickstart-feature-flag-aspnet-core.md).
- [Add a custom feature filter to the feature flag](./howto-feature-filters.md)

## Implement a custom feature filter

You've added a custom feature filter named **Random** with a **Percentage** parameter for your *Beta* feature flag in the prerequisites. Next, you'll implement the feature filter to enable the *Beta* feature flag based on the chance defined by the **Percentage** parameter.

1. Add a `RandomFilter.cs` file with the following code.

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

    You added a `RandomFilter` class that implements the `IFeatureFilter` interface from the `Microsoft.FeatureManagement` library. The `IFeatureFilter` interface has a single method named `EvaluateAsync`, which is called whenever a feature flag is evaluated. In `EvaluateAsync`, a feature filter enables a feature flag by returning `true`.

    You decorated a `FilterAliasAttribute` to the `RandomFilter` to give your filter an alias **Random**, which matches the filter name you set in the *Beta* feature flag in Azure App Configuration.

1. Open the *Program.cs* file and register the `RandomFilter` by calling the `AddFeatureFilter` method. 

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

Relaunch the application and refresh the browser a few times. Without manually toggling the feature flag, you will see that the **Beta** menu sometimes appears and sometimes doesn't.

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu hidden.](./media/quickstarts/aspnet-core-feature-flag-local-before.png)

> [!div class="mx-imgBorder"]
> ![Screenshot of browser with Beta menu.](./media/quickstarts/aspnet-core-feature-flag-local-after.png)

## Next steps

To learn more about the built-in feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)
