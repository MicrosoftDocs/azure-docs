---
title: Enable features on a schedule in a Node.js application
titleSuffix: Azure App Configuration
description: Learn how to enable feature flags on a schedule in a Node.js application.
ms.service: azure-app-configuration
ms.devlang: javascript
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.custom: mode-other, devx-track-js
ms.date: 09/26/2024
---

# Tutorial: Enable features on a schedule in a Node.js application

In this tutorial, you use the time window filter to enable a feature on a schedule for a Node.js application. 

The example used in this tutorial is based on the Node.js application introduced in the feature management [quickstart](./quickstart-feature-flag-javascript.md). Before proceeding further, complete the quickstart to create a Node.js application with a *Beta* feature flag. Once completed, you must [add a time window filter](./howto-timewindow-filter.md) to the *Beta* feature flag in your App Configuration store.

## Prerequisites

- Create a [Node.js application with a feature flag](./quickstart-feature-flag-javascript.md).
- [Add a time window filter to the feature flag](./howto-timewindow-filter.md)

## Use the time window filter

You've added a time window filter for your *Beta* feature flag in the prerequisites. Next, you'll use the feature flag with the time window filter in your Node.js application.

When you create a feature manager, the built-in feature filters are automatically added to its feature filter collection.

``` javascript
const fm = new FeatureManager(ffProvider);
```

## Time window filter in action

When you run the application, the configuration provider loads the *Beta* feature flag from Azure App Configuration. The result of the `isEnabled("Beta")` method will be printed to the console. If your current time is earlier than the start time set for the time window filter, the *Beta* feature flag will be disabled by the time window filter.

You'll see the following console outputs.

``` bash
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
```

Once the start time has passed, you'll notice that the *Beta* feature flag is enabled by the time window filter.

You'll see the console outputs change as the *Beta* is enabled.

``` bash
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: true
Beta is enabled: true
Beta is enabled: true
Beta is enabled: true
```

## Next steps

To learn more about the feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)
