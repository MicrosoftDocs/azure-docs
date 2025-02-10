---
title: Enable conditional features with a custom filter in a Node.js application
titleSuffix: Azure App Configuration
description: Learn how to implement a custom feature filter to enable conditional feature flags for your Node.js application.
ms.service: azure-app-configuration
ms.devlang: javascript
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.custom: mode-other, devx-track-js
ms.date: 09/26/2024
---

# Enable conditional features with a custom filter in a JavaScript application

Feature flags can use feature filters to enable features conditionally. To learn more about feature filters, see [Enable conditional features with feature filters](./howto-feature-filters.md).

The example used in this guide is based on the Node.js application introduced in the feature management [quickstart](./quickstart-feature-flag-javascript.md). Before proceeding further, complete the quickstart to create a Node.js application with a *Beta* feature flag. Once completed, you must [add a custom feature filter](./howto-feature-filters.md) to the *Beta* feature flag in your App Configuration store. 

In this article, you learn how to implement a custom feature filter and use the feature filter to enable features conditionally. We are using the Node.js console app as an example, but you can also use the custom feature filter in other JavaScript applications.

## Prerequisites

- Create a [console app with a feature flag](./quickstart-feature-flag-javascript.md).
- [Add a custom feature filter to the feature flag](./howto-feature-filters.md)

## Implement a custom feature filter

You've added a custom feature filter named **Random** with a **Percentage** parameter for your *Beta* feature flag in the prerequisites. Next, you implement the feature filter to enable the *Beta* feature flag based on the chance defined by the **Percentage** parameter.

1. Open the file *app.js* and add the `RandomFilter` with the following code.

    ``` javascript
    class RandomFilter {
        name = "Random";
        evaluate(context) {
            const percentage = context.parameters.Percentage;
            const randomNumber = Math.random() * 100;
            return randomNumber <= percentage;
        }
    }
    ```

    You added a `RandomFilter` class that has a single method named `evaluate`, which is called whenever a feature flag is evaluated. In `evaluate`, a feature filter enables a feature flag by returning `true`.

    You set the name to of `RandomFilter` to **Random**, which matches the filter name you set in the *Beta* feature flag in Azure App Configuration.

1. Register the `RandomFilter` when creating the `FeatureManager`.

    ``` javascript
    const fm = new FeatureManager(ffProvider, {customFilters: [new RandomFilter()]});
    ```

## Feature filter in action

When you run the application the configuration provider will load the *Beta* feature flag from Azure App Configuration. The result of the `isEnabled("Beta")` method will be printed to the console. As the `RandomFilter` is implemented and used by the *Beta* feature flag, the result will be `True` 50 percent of the time and `False` the other 50 percent of the time.

Running the application will show that the *Beta* feature flag is sometimes enabled and sometimes not.

``` bash
Beta is enabled: true
Beta is enabled: false
Beta is enabled: false
Beta is enabled: true
Beta is enabled: true
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: true
Beta is enabled: true
```

## Next steps

To learn more about the built-in feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)