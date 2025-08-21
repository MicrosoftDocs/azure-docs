---
title: Enable features on a schedule in a Python application
titleSuffix: Azure App Configuration
description: Learn how to enable feature flags on a schedule in a Python application by using time window filters.
ms.service: azure-app-configuration
ms.devlang: python
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.custom: mode-other, devx-track-python
ms.date: 07/09/2025
---

# Enable features on a schedule in a Python application

In this guide, you use the time window filter to enable a feature on a schedule for a Python application.

The example used is based on the Python application introduced in the feature management [quickstart](./quickstart-feature-flag-python.md). Before proceeding further, complete the quickstart to create a Python application with a *Beta* feature flag. Once completed, you must [add a time window filter](./howto-timewindow-filter.md) to the *Beta* feature flag in your App Configuration store.

## Prerequisites

- Create a [Python application with a feature flag](./quickstart-feature-flag-python.md).
- [Add a time window filter to the feature flag](./howto-timewindow-filter.md)

## Use the time window filter

You've added a time window filter for your *Beta* feature flag in the prerequisites. Next, you'll use the feature flag with the time window filter in your Python application.

When you create a feature manager, the built-in feature filters are automatically added to its feature filter collection.

``` python
from featuremanagement import FeatureManager

fm = FeatureManager(provider)
```

## Time window filter in action

When you run the application, the configuration provider loads the *Beta* feature flag from Azure App Configuration. The result of the `is_enabled("Beta")` method will be printed to the console. If your current time is earlier than the start time set for the time window filter, the *Beta* feature flag will be disabled by the time window filter.

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

If recurrence is enabled when you set up the time window filter, the console outputs will change to `Beta is enabled: false` once your current time passes the end time you set in the time window filter. However, it will change to `Beta is enabled: true` again according to your recurrence settings and continue this pattern until the recurrence expiration time, if set.

## Next steps

To learn more about the feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)

For the full feature rundown of the Python feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [Python Feature Management](./feature-management-python-reference.md)
