---
title: Python feature management - Azure App Configuration
description: Overview of Python Feature Management library
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: tutorial
ms.date: 06/18/2024
ms.author: mametcal
ms.custom: devx-track-python
#Customer intent: I want to control feature availability in my app by using the Python Feature Management library.
---

# Python Feature Management

The Python Feature Management library provides a way to develop and expose application functionality based on feature flags. Once a new feature is developed, many applications have special requirements, such as when the feature should be enabled and under what conditions. This library provides a way to define these relationships.

Feature flags provide a way for Python applications to turn features on or off dynamically. Developers can use feature flags in simple use cases like conditional statements. Feature flags are built on top of a Python dictionary and any usage that can result in [Feature Management 2.0 schema](https://github.com/Azure/AppConfiguration/blob/main/docs/FeatureManagement/FeatureManagement.v2.0.0.schema.json) can be used to load feature flags.

Here are some of the benefits of using .NET feature management library:

* A common convention for feature management
* Low barrier-to-entry
  * Supports JSON file feature flag setup
* Feature Flag lifetime management
  * Configuration values can change in real-time; feature flags can be consistent across the entire request
* Simple to Complex Scenarios Covered
  * Toggle on/off features through declarative configuration file
  * Dynamically evaluate state of feature based on call to server

  The Python feature management library is open source. For more information, visit the [GitHub repo](https://github.com/microsoft/FeatureManagement-Python).

To access the Python feature manager, your app must have the Python `FeatureManagement` library installed, `pip install featuremanagement`.

## Feature flags
Feature flags are composed of two parts, a name and a list of feature-filters that are used to turn on the feature.

### Feature filters
Feature filters define a scenario for when a feature should be enabled. When a feature is evaluated for whether it is on or off, its list of feature filters is traversed until one of the filters decides the feature should be enabled. At this point, the feature is considered enabled and traversal through the feature filters stops. If no feature filter indicates that the feature should be enabled, it's considered disabled.

As an example, a Microsoft Edge browser feature filter could be designed. This feature filter would activate any features it's attached to as long as an HTTP request is coming from Microsoft Edge.

## Feature flag configuration

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

By convention, the `feature_management` section of this JSON document is used for feature flag settings. The `feature_flags` section of this JSON document is for a list of the defined feature flags. The prior example shows three feature flags, with the final one which uses a filter defined in the `client_filters` property:

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

## Feature Filters


Feature filters enable dynamic evaluation of feature flags. The Python feature management library includes two built-in filters:

- `Microsoft.TimeWindow` - Enables a feature flag based on a time window.
- `Microsoft.Targeting` - Enables a feature flag based on a list of users, groups, or rollout percentages.

#### Time Window Filter

The Time Window Filter enables a feature flag based on a time window. It has two parameters:

- `Start` - The start time of the time window.
- `End` - The end time of the time window.

```json
{
    "name": "Microsoft.TimeWindow",
    "parameters": {
        "Start": "2020-01-01T00:00:00Z",
        "End": "2020-12-31T00:00:00Z"
    }
}
```

Both parameters are optional, but at least one is required. The time window filter is enabled after the start time and before the end time. If the start time is not specified, it is enabled immediately. If the end time is not specified, it will remain enabled after the start time.

#### Targeting Filter

Targeting is a feature management strategy that enables developers to progressively roll out new features to their user base. The strategy is built on the concept of targeting a set of users known as the target audience. An audience is made up of specific users, groups, excluded users/groups, and a designated percentage of the entire user base. The groups that are included in the audience can be broken down further into percentages of their total members.

The following steps demonstrate an example of a progressive rollout for a new 'Beta' feature:

1. Individual users Jeff and Alicia are granted access to the Beta
1. Another user, Mark, asks to opt-in and is included.
1. Twenty percent of a group known as "Ring1" users are included in the Beta.
1. The number of "Ring1" users included in the beta is bumped up to 100 percent.
1. Five percent of the user base is included in the beta.
1. The rollout percentage is bumped up to 100 percent and the feature is completely rolled out.

This strategy for rolling out a feature is built in to the library through the included Microsoft.Targeting feature filter.

##### Defining a Targeting Feature Filter

The Targeting Filter provides the capability to enable a feature for a target audience. The filter parameters include an `Audience` object which describes users, groups, excluded users/groups, and a default percentage of the user base that should have access to the feature. The `Audience` object contains the following fields:

- `Users` - A list of users that the feature flag is enabled for.
- `Groups` - A list of groups that the feature flag is enabled for and a rollout percentage for each group.
  - `Name` - The name of the group.
  - `RolloutPercentage` - A percentage value that the feature flag is enabled for in the given group.
- `DefaultRolloutPercentage` - A percentage value that the feature flag is enabled for.
- `Exclusion` - An object that contains a list of users and groups that the feature flag is disabled for.
  - `Users` - A list of users that the feature flag is disabled for.
  - `Groups` - A list of groups that the feature flag is disabled for.

```json
{
    "name": "Microsoft.Targeting",
    "parameters": {
        "Audience": {
            "Users": ["user1", "user2"],
            "Groups": [
                {
                    "Name": "group1",
                    "RolloutPercentage": 100
                }
            ],
            "DefaultRolloutPercentage": 50,
            "Exclusion": {
                "Users": ["user3"],
                "Groups": ["group2"]
            }
        }
    }
}
```

##### Using Targeting Feature Filter

You can provide the current user info through `kwargs` when calling `isEnabled`.

```python
from featuremanagement import FeatureManager, TargetingContext

# Returns true, because user1 is in the Users list
feature_manager.is_enabled("Beta", TargetingContext(user_id="user1", groups=["group1"]))

# Returns false, because group2 is in the Exclusion.Groups list
feature_manager.is_enabled("Beta", TargetingContext(user_id="user1", groups=["group2"]))

# Has a 50% chance of returning true, but will be conisistent for the same user
feature_manager.is_enabled("Beta", TargetingContext(user_id="user4"))
```

## Implementing a Feature Filter

Creating a feature filter provides a way to enable features based on criteria that you define. To implement a feature filter, the `FeatureFilter` abstract class must be use. `FeatureFilter` has a single method named `evaluate`. When a feature specifies that it can be enabled for a feature filter, the `evaluate` method is called. If `evaluate` returns `true`, it means the feature should be enabled.

The following snippet demonstrates how to add a customized feature filter `MyCriteriaFilter`.

```python
class MyCriteriaFilter(FeatureFilter):
    def evaluate(self, context, **kwargs):
        ...
        return True
```

``` python
feature_manager = FeatureManager(feature_flags, feature_filters=[MyCriteriaFilter()])
```

Feature filters are registered by adding them to the optional `feature_filters` parameter while creating the `FeatureManager`. 

You can modify the name of a feature flag by using the `@FeatureFilter.alias` decorator. The alias overrides the name of the feature filter and needs to match the name of the feature filter in the feature flag json.

```python
@FeatureFilter.alias("CriteriaFilter")
class MyCriteriaFilter(FeatureFilter):
    ...
```

## Next steps

In this tutorial, you learned how to implement feature flags in your Python application by using the `FeatureManagement` library. For more information about feature management support in Python and App Configuration, see the following resources:

* [Python feature flag sample code](./quickstart-feature-flag-python.md)
* [FeatureManagement API documentation](https://microsoft.github.io/FeatureManagement-Python/html/index.html)
* [Manage feature flags](./manage-feature-flags.md)
