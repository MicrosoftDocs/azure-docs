---
title: Tutorial for using feature flags in a Python app | Microsoft Docs
description: In this tutorial, you learn how to implement feature flags in Python apps.
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: tutorial
ms.date: 06/04/2024
ms.author: mametcal
ms.custom: devx-track-python
#Customer intent: I want to control feature availability in my app by using the Python Feature Manager library.
---

# Tutorial: Use feature flags in a Python app

The Python Feature Management library provides idiomatic support for implementing feature flags in a Python application. This libray allow you to declaratively add feature flags to your code so that you don't have to manually write code to enable or disable features with `if` statements.

The Feature Management library also manages the feature flag lifecycles behind the scenes. For example, the library refresh and cache flag states.

For the Python feature management API reference documentation, see [FeatureManagement-Python API Docs](https://microsoft.github.io/FeatureManagement-Python/html/index.html).

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Add feature flags in key parts of your application to control feature availability.
> * Integrate with App Configuration to manage feature flags.

## Prerequisites

- The [Add feature flags to a Python app quickstart](./quickstart-feature-flag-python.md) shows a simple example of how to use feature flags in a Python application. This tutorial shows additional setup options and capabilities of the Feature Management library. You can use the sample app created in the quickstart to try out the sample code shown in this tutorial.

## Set up feature management

To access the Python feature manager, your app must have the Python `FeatureManagement` library installed, `pip install featuremanagement`.

The Python feature manager is configured from a Python `dict`. As a result, you can define your application's feature flag settings by using any configuration source that can be read into a `dict`, such as loading via json or the Azure App Configuration provider.

By default, the feature manager retrieves feature flag configuration from the `"feature_management"` section of the dictionary.

```python
from featuremanagement import FeatureManager
import json
import os
import sys

script_directory = os.path.dirname(os.path.abspath(sys.argv[0]))

f = open(script_directory + "/my_json_file.json", "r")

feature_flags = json.load(f)

feature_manager = FeatureManager(feature_flags)
```

You can use feature filters to enable conditional feature flags. To use either built-in feature filters or create your own, see [Enable conditional features with feature filters](./howto-feature-filters.md).

Rather than hard coding your feature flags into your application, we recommend that you keep feature flags outside of the application and manage them separately. Doing so allows you to modify flag states at any time and have those changes take effect in the application right away. The Azure App Configuration service provides a dedicated portal UI for managing all of your feature flags. App Configuration also delivers the feature flags to your application directly through its Python client library.

The easiest way to connect your Python application to App Configuration is through the configuration provider included in the `azure-appconfiguration-python` package. After installing the package, follow these steps to use it.

1. Open the *app.py* file and add the following code.

    ```python
    from featuremanagement import FeatureManager
    from azure.appconfiguration.provider import load
    from azure.identity import DefaultAzureCredential
    import os
    
    endpoint = os.environ.get("APPCONFIGURATION_ENDPOINT_STRING")
    
    config = load(endpoint=endpoint, credential=DefaultAzureCredential(), feature_flag_enabled=True)
    
    feature_manager = FeatureManager(config)
    ```

In a typical scenario, you update your feature flag values periodically as you deploy and enable different features of your application. By default, the feature flag values are cached for a period of 30 seconds. You can update your app to periodically do a refresh operation. The following code shows how to change the cache expiration time or polling interval to 5 minutes.

```python
config = load(endpoint=endpoint, credential=DefaultAzureCredential(), feature_flag_enabled=True, refresh_interval=300)

...

# Refresh your configurations
config.refresh()
```

Because the feature manager has access to the configuration provider, it automatically gets the refreshed values of the feature flags.

## Feature flag declaration

Each feature flag declaration has three main parts: a name, enabled, and a set of zero or more filters that are used to evaluate if a feature's state is *on* (that is, when its value is `True`). A filter defines a criterion for when a feature should be turned on.

By default, when a feature flag has multiple filters, the filter set is traversed in order until one of the filters determines the feature should be enabled. At that point, the feature flag is *on*, and any remaining filter results are skipped. If no filter indicates the feature should be enabled, the feature flag is *off*.

This default behavior can be changed by setting the `requirement_type` property of the feature flag to `All`. When `requirement_type` is set to `All`, all filters must indicate that the feature should be enabled. For more information on `requirement_type`, see [Requirement Type](#requirement-type).

The following example shows how to set up feature flags in a JSON file:

```JSON
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "FeatureA",
                "description": "A feature flag that is always on.",
                "enabled": true
            },
            {
                "id": "FeatureB",
                "description": "A feature flag that is always off.",
                "enabled": false
            },
            {
                "id": "FeatureC",
                "description": "A feature flag that is on 50% of the time when inside the time window, otherwise it is off.",
                "conditions": {
                    "requirement_type": "All",
                    "client_filters": [
                        {
                            "name": "Percentage",
                            "parameters": {
                                "Value": 50
                            }
                        },
                        {
                            "name": "TimeWindow",
                            "parameters": {
                                "Start": "2021-01-01T00:00:00Z",
                                "End": "2021-12-31T23:59:59Z"
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

By convention, the `feature_management` section of this JSON document is used for feature flag settings. The `feature_flags` section of this JSON document is for a list of the defined feature flags. The prior example shows three feature flags, with the final one which uses a filter defined in the `enabled_for` property:

* `FeatureA` is *on*.
* `FeatureB` is *off*.
* `FeatureC` specifies a filter named `Percentage` with a `parameters` property. `Percentage` is a configurable filter. Then a second filter named `TimeWindow` which has the `parameters` `Start` and `End` which specifies durring which times the flag can be on. In this example, `Percentage` specifies a 50-percent probability for the `FeatureC` flag to be *on*, but because `requirement_type` is set to `All` it will only be enabled between the specifed dates. For a how-to guide on using feature filters, see [Use feature filters to enable conditional feature flags](./howto-feature-filters-python.md).

## Feature flag checks

A common pattern of feature management is to check if a feature flag is set to *on* and if so, run a section of code. For example:

```python
if feature_manager.is_enabled("FeatureA"):
    // Run the following code
```

## Requirement Type

The `requirement_type` property of a feature flag is used to determine if the filters should use `Any` or `All` logic when evaluating the state of a feature. If RequirementType isn't specified, the default value is `Any`.

* `Any` means only one filter needs to evaluate to true for the feature to be enabled.
* `All` means every filter needs to evaluate to true for the feature to be enabled.

A `requirement_type` of `All` changes the traversal. First, if there are no filters, the feature is disabled. Then, the feature filters are traversed until one of the filters decides that the feature should be disabled. If no filter indicates that the feature should be disabled, it's considered enabled.


```json
{
    "id": "FeatureC",
    "conditions": {
        "requirement_type": "All",
        "enabled_for": [
            {
                "name": "Percentage",
                "parameters": {
                    "Value": 50
                }
            },
            {
                "name": "TimeWindow",
                "parameters": {
                    "Start": "2021-01-01T00:00:00Z",
                    "End": "2021-12-31T23:59:59Z"
                }
            }
        ]
    }
}
```

In the above example, `FeatureC` specifies a `requirement_type` of `All`, meaning all of its filters must evaluate to true for the feature to be enabled. In this case, the feature is enabled for 50% of users during the specified time window.


## Next steps

In this tutorial, you learned how to implement feature flags in your Python application by using the `FeatureManagement` library. For more information about feature management support in Python and App Configuration, see the following resources:

* [Python feature flag sample code](./quickstart-feature-flag-python.md)
* [FeatureManagement API documentation](https://microsoft.github.io/FeatureManagement-Python/html/index.html)
* [Manage feature flags](./manage-feature-flags.md)
