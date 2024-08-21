---
title: Enable conditional features with a custom filter in a Python application
titleSuffix: Azure App Configuration
description: Learn how to implement a custom feature filter to enable conditional feature flags for your Python application.
ms.service: azure-app-configuration
ms.devlang: python
ms.custom: devx-track-python
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 06/05/2024
---

# Tutorial: Enable conditional features with a custom filter in a Python application

Feature flags can use feature filters to enable features conditionally. To learn more about feature filters, see [Tutorial: Enable conditional features with feature filters](./howto-feature-filters.md).

The example used in this tutorial is based on the Python application introduced in the feature management [quickstart](./quickstart-feature-flag-python.md). Before proceeding further, complete the quickstart to create a Python application with a *Beta* feature flag. Once completed, you must [add a custom feature filter](./howto-feature-filters.md) to the *Beta* feature flag in your App Configuration store.

In this tutorial, you'll learn how to implement a custom feature filter and use the feature filter to enable features conditionally.

## Prerequisites

- Create a [Python app with a feature flag](./quickstart-feature-flag-python.md).
- [Add a custom feature filter to the feature flag](./howto-feature-filters.md)

## Implement a custom feature filter

You've added a custom feature filter named **Random** with a **Percentage** parameter for your *Beta* feature flag in the prerequisites. Next, you implement the feature filter to enable the *Beta* feature flag based on the chance defined by the **Percentage** parameter.

1. Add a `RandomFilter.py` file with the following code.

    ```python
    import random
    from featuremanagement import FeatureFilter
    
    @FeatureFilter.alias("Random")
    class RandomFilter(FeatureFilter):
    
        def evaluate(self, context, **kwargs):
            value = context.get("parameters", {}).get("Value", 0)
            if value < random.randint(0, 100):
                return True
            return False
    ```

    You added a `RandomFilter` class that implements the `FeatureFilter` abstract class from the `FeatureManagement` library. The `FeatureFilter` class has a single method named `evaluate`, which is called whenever a feature flag is evaluated. In `evaluate`, a feature filter enables a feature flag by returning `true`.

    You decorated a `FeatureFilter.alias` to the `RandomFilter` to give your filter an alias **Random**, which matches the filter name you set in the *Beta* feature flag in Azure App Configuration.

1. Open the *app.py* file and register the `RandomFilter` when creating the `FeatureManager`. Also, modify the code to not automatically refresh and to also access the *Beta* feature flag a few times, as seen below.

    ```python
    from featuremanagement import FeatureManager
    from azure.appconfiguration.provider import load
    from azure.identity import DefaultAzureCredential
    import os
    
    endpoint = os.environ.get("APPCONFIGURATION_ENDPOINT_STRING")
    
    # Connect to Azure App Configuration using and Endpoint and Azure Entra ID
    # feature_flag_enabled makes it so that the provider will load feature flags from Azure App Configuration
    # feature_flag_refresh_enabled makes it so that the provider will refresh feature flags
    # from Azure App Configuration, when the refresh operation is triggered
    config = load(endpoint=endpoint, credential=DefaultAzureCredential(), feature_flag_enabled=True)
    
    feature_manager = FeatureManager(config, feature_filters=[RandomFilter()])
    
    for i in range(0, 10):
        print("Beta is", feature_manager.is_enabled("Beta"))
    ```

## Feature filter in action

When you run the application the configuration provider will load the *Beta* feature flag from Azure App Configuration. The result of the `is_enabled("Beta")` method will be printed to the console. As the `RandomFilter` is implemented and used by the *Beta* feature flag, the result will be `True` 50 percent of the time and `False` the other 50 percent of the time.

Running the application will show that the *Beta* feature flag is sometimes enabled and sometimes not.

```bash
Beta is True
Beta is False
Beta is True
Beta is True
Beta is True
Beta is False
Beta is False
Beta is False
Beta is True
Beta is True
```

## Next steps

To learn more about the built-in feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)
