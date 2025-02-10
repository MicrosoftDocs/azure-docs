---
title: Python feature flag management
titleSuffix: Azure App Configuration
description: Learn to implement feature flags in your Python applications using feature management and Azure App Configuration. Dynamically manage feature rollouts, conduct A/B testing, and control feature visibility without redeploying the app.
services: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.service: azure-app-configuration
ms.devlang: python
ms.custom: devx-track-python
ms.topic: tutorial
ms.date: 11/15/2024
#Customer intent: I want to control feature availability in my app by using the Feature Management library.
---

# Python feature management

Python feature management library provides a way to develop and expose application functionality based on feature flags. Once a new feature is developed, many applications have special requirements, such as when the feature should be enabled and under what conditions. This library provides a way to define these relationships, and also integrates into common Python code patterns to make exposing these features possible.

Feature flags provide a way for Python applications to turn features on or off dynamically. Developers can use feature flags in simple use cases like conditional statements.

Here are some of the benefits of using Python feature management library:

* A common convention for feature management
* Low barrier to entry
  * Supports JSON feature flag setup
* Feature flag lifetime management
  * Configuration values can change in real-time; feature flags can be consistent across the entire request
* Simple to complex scenarios covered
  * Toggle on/off features through declarative configuration file
  * Dynamically evaluate state of feature based on call to server

  The Python feature management library is open source. For more information, visit the [GitHub repo](https://github.com/microsoft/FeatureManagement-Python).

## Feature flags
Feature flags are composed of two parts, a name and a list of feature-filters that are used to turn on the feature.

### Feature filters
Feature filters define a scenario for when a feature should be enabled. When a feature is evaluated for whether it is on or off, its list of feature filters is traversed until one of the filters decides the feature should be enabled. At this point, the feature is considered enabled and traversal through the feature filters stops. If no feature filter indicates that the feature should be enabled, it's considered disabled.

As an example, a Microsoft Edge browser feature filter could be designed. This feature filter would activate any features attached to it, as long as an HTTP request is coming from Microsoft Edge.

### Feature flag configuration

A Python dictionary is used to define feature flags. The dictionary is composed of feature names as keys and feature flag objects as values. The feature flag object is a dictionary that contains a `conditions` key, which itself contains the `client_filters` key. The `client_filters` key is a list of feature filters that are used to determine if the feature should be enabled.

### Feature flag declaration

The feature management library supports json as a feature flag source. Below we have an example of the format used to set up feature flags in a JSON file.

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "FeatureT",
                "enabled": "true"
            },
            {
                "id": "FeatureU",
                "enabled": "false"
            },
            {
                "id": "FeatureV",
                "enabled": "true",
                "conditions": {
                    "client_filters": [
                        {
                            "name": "Microsoft.TimeWindow",
                            "parameters": {
                                "Start": "Wed, 01 May 2019 13:59:59 GMT",
                                "End": "Mon, 01 Jul 2019 00:00:00 GMT"
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

The `feature_management` section of the json document is used by convention to load feature flag settings. The `feature_flags` section is a list of the feature flags that are loaded into the library. In the section above, we see three different features. Features define their feature filters using the `client_filters` property, inside of `conditions`. In the feature filters for `FeatureT`, we see `enabled` is on with no filters defined, resulting in `FeatureT` always returning `true` . `FeatureU` is the same as `FeatureT` but with `enabled` is `false` resulting in the feature always returning `false`. `FeatureV` specifies a feature filter named `Microsoft.TimeWindow`. `FeatureV` is an example of a configurable feature filter. We can see in the example that the filter has a `parameters` property. The `parameters` property is used to configure the filter. In this case, the start and end times for the feature to be active are configured.

The detailed schema of the `feature_management` section can be found [here](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureManagement.v2.0.0.schema.json).

**Advanced:** The usage of colon ':' is forbidden in feature flag names.

#### On/off declaration
 
The following snippet demonstrates an alternative way to define a feature that can be used for on/off features. 

``` json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "FeatureT",
                "enabled": "true"
            },
            {
                "id": "FeatureX",
                "enabled": "false"
            }
        ]
    }
}
```

#### Requirement_type

The `requirement_type` property of a feature flag is used to determine if the filters should use `Any` or `All` logic when evaluating the state of a feature. If `requirement_type` isn't specified, the default value is `Any`.

* `Any` means only one filter needs to evaluate to true for the feature to be enabled. 
* `All` means every filter needs to evaluate to true for the feature to be enabled.

A `requirement_type` of `All` changes the traversal. First, if there are no filters, the feature is disabled. Then, the feature filters are traversed until one of the filters decides that the feature should be disabled. If no filter indicates that the feature should be disabled, it's considered enabled.

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "FeatureW",
                "enabled": "true",
                "conditions": {
                    "requirement_type": "All",
                    "client_filters": [
                        {
                            "name": "Microsoft.TimeWindow",
                            "parameters": {
                                "Start": "Wed, 01 May 2019 13:59:59 GMT",
                                "End": "Mon, 01 Jul 2019 00:00:00 GMT"
                            }
                        },
                        {
                            "name": "Percentage",
                            "parameters": {
                                "Value": "50"
                            }
                        }
                    ]
                }
            },
        ]
    }
}
```

In the above example, `FeatureW` specifies a `requirement_type` of `All`, meaning all of its filters must evaluate to true for the feature to be enabled. In this case, the feature is enabled for 50% of users during the specified time window.

## Consumption

The basic form of feature management is checking if a feature flag is enabled and then performing actions based on the result. Checking the state of a feature flag is done through `FeatureManager`'s `is_enabled` method.

```python
…
feature_manager = FeatureManager(feature_flags)
…
if feature_manager.is_enabled("FeatureX"):
    # Do something
```

The `feature_flags` provided to `FeatureManager` can either be the `AzureAppConfigurationProvider` or a dictionary of feature flags.

## Implementing a feature filter

Creating a feature filter provides a way to enable features based on criteria that you define. To implement a feature filter, the `FeatureFilter` interface must be implemented. `FeatureFilter` has a single method named `evaluate`. When a feature specifies that it can be enabled for a feature filter, the `evaluate` method is called. If `evaluate` returns `true`, it means the feature should be enabled.

The following snippet demonstrates how to add a customized feature filter `MyCustomFilter`.

```python
feature_manager = FeatureManager(feature_flags, feature_filters=[MyCustomFilter()])
```

Feature filters are registered by providing them to the property `feature_filters` when creating `FeatureManager`. If a custom feature filter needs any context, they can be passed in when calling `is_enabled` using `kwargs`.

### Filter alias attribute

When a feature filter is registered for a feature flag, the name of the filter is used as the alias by default.

The identifier for the feature filter can be overridden by using the `@FeatureFilter.alias("MyFilter")`. A feature filter can be decorated with this attribute to declare the name that should be used in configuration to reference this feature filter within a feature flag.

### Missing feature filters

If a feature is configured to be enabled for a specific feature filter and that feature filter isn't registered, a `ValueError` exception is raised when the feature is evaluated.

## Built-in feature filters

There are a two feature filters that come with the `FeatureManagement` package: `TimeWindowFilter`, and `TargetingFilter`.

Each of the built-in feature filters has its own parameters. Here's the list of feature filters along with examples.


### Microsoft.TimeWindow

This filter provides the capability to enable a feature based on a time window. If only `End` is specified, the feature is considered on until that time. If only `Start` is specified, the feature is considered on at all points after that time.

```json
"client_filters": [
    {
        "name": "Microsoft.TimeWindow",
        "parameters": {
            "Start": "Wed, 01 May 2019 13:59:59 GMT",
            "End": "Mon, 01 Jul 2019 00:00:00 GMT"
        }
    }
]     
```

### Microsoft.Targeting

This filter provides the capability to enable a feature for a target audience. An in-depth explanation of targeting is explained in the [targeting](#targeting) section below. The filter parameters include an `Audience` object that describes users, groups, excluded users/groups, and a default percentage of the user base that should have access to the feature. Each group object that is listed in the `Groups` section must also specify what percentage of the group's members should have access. If a user is specified in the `Exclusion` section, either directly or if the user is in an excluded group, the feature is disabled. Otherwise, if a user is specified in the `Users` section directly, or if the user is in the included percentage of any of the group rollouts, or if the user falls into the default rollout percentage then that user will have the feature enabled.

``` JavaScript
"client_filters": [
    {
        "name": "Microsoft.Targeting",
        "parameters": {
            "Audience": {
                "Users": [
                    "Jeff",
                    "Alicia"
                ],
                "Groups": [
                    {
                        "Name": "Ring0",
                        "RolloutPercentage": 100
                    },
                    {
                        "Name": "Ring1",
                        "RolloutPercentage": 50
                    }
                ],
                "DefaultRolloutPercentage": 20,
                "Exclusion": {
                    "Users": [
                        "Ross"
                    ],
                    "Groups": [
                        "Ring2"
                    ]
                }
            }
        }
    }
]
```

## Targeting

Targeting is a feature management strategy that enables developers to progressively roll out new features to their user base. The strategy is built on the concept of targeting a set of users known as the target _audience_. An audience is made up of specific users, groups, excluded users/groups, and a designated percentage of the entire user base. The groups that are included in the audience can be broken down further into percentages of their total members.

The following steps demonstrate an example of a progressive rollout for a new 'Beta' feature:

1. Individual users Jeff and Alicia are granted access to the Beta
2. Another user, Mark, asks to opt in and is included.
3. Twenty percent of a group known as "Ring1" users are included in the Beta.
5. The number of "Ring1" users included in the beta is bumped up to 100 percent.
5. Five percent of the user base is included in the beta.
6. The rollout percentage is bumped up to 100 percent and the feature is completely rolled out.

This strategy for rolling out a feature is built in to the library through the included [Microsoft.Targeting](#microsofttargeting) feature filter.

### Targeting a user

Either a user can be specified directly in the `is_enabled` call or a `TargetingContext` can be used to specify the user and optional group.

```python
# Directly specifying the user
result = is_enabled(feature_flags, "test_user")

# Using a TargetingContext
result = is_enabled(feature_flags, TargetingContext(user_id="test_user", groups=["Ring1"]))
```

### Targeting exclusion

When defining an audience, users and groups can be excluded from the audience. Exclusions are useful for when a feature is being rolled out to a group of users, but a few users or groups need to be excluded from the rollout. Exclusion is defined by adding a list of users and groups to the `Exclusion` property of the audience.

```json
"Audience": {
    "Users": [
        "Jeff",
        "Alicia"
    ],
    "Groups": [
        {
            "Name": "Ring0",
            "RolloutPercentage": 100
        }
    ],
    "DefaultRolloutPercentage": 0
    "Exclusion": {
        "Users": [
            "Mark"
        ]
    }
}
```

In the above example, the feature is enabled for users named `Jeff` and `Alicia`. It's also enabled for users in the group named `Ring0`. However, if the user is named `Mark`, the feature is disabled, regardless of if they are in the group `Ring0` or not. Exclusions take priority over the rest of the targeting filter.

## Variants

When new features are added to an application, there may come a time when a feature has multiple different proposed design options. A common solution for deciding on a design is some form of A/B testing. A/B testing involves providing a different version of the feature to different segments of the user base and choosing a version based on user interaction. In this library, this functionality is enabled by representing different configurations of a feature with variants.

Variants enable a feature flag to become more than a simple on/off flag. A variant represents a value of a feature flag that can be a string, a number, a boolean, or even a configuration object. A feature flag that declares variants should define under what circumstances each variant should be used, which is covered in greater detail in the [Allocating variants](#allocating-variants) section.

```python
class Variant:
    def __init__(self, name: str, configuration: Any):
        self._name = name
        self._configuration = configuration

    @property
    def name(self) -> str:
        """
        The name of the variant.
        :rtype: str
        """
        return self._name

    @property
    def configuration(self) -> Any:
        """
        The configuration of the variant.
        :rtype: Any
        """
        return self._configuration
```

### Getting variants

For each feature, a variant can be retrieved using the `FeatureManager`'s `get_variant` method.

```python
…
variant = print(feature_manager.get_variant("TestVariants", TargetingContext(user_id="Adam"))

variantConfiguration = variant.configuration;

// Do something with the resulting variant and its configuration
```

The variant returned is dependent on the user currently being evaluated, and that information is obtained from an instance of `TargetingContext`. 

### Variant feature flag declaration

Compared to normal feature flags, variant feature flags have two more properties: `variants` and `allocation`. The `variants` property is an array that contains the variants defined for this feature. The `allocation` property defines how these variants should be allocated for the feature. Just like declaring normal feature flags, you can set up variant feature flags in a JSON file. Here's an example of a variant feature flag.

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "MyVariantFeatureFlag",
                "enabled": true,
                "allocation": {
                    "default_when_enabled": "Small",
                    "group": [
                        {
                            "variant": "Big",
                            "groups": [
                                "Ring1"
                            ]
                        }
                    ]
                },
                "variants": [
                    { 
                        "name": "Big"
                    },  
                    { 
                        "name": "Small"
                    } 
                ]
            }
        ]
    }
}
```

#### Defining variants

Each variant has two properties: a name and a configuration. The name is used to refer to a specific variant, and the configuration is the value of that variant. The configuration can be set using `configuration_value` property. `configuration_value` is an inline configuration that can be a string, number, boolean, or configuration object. If `configuration_value` isn't specified, the returned variant's `Configuration` property is `None`.

A list of all possible variants is defined for each feature under the `variants` property.

``` javascript
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "MyVariantFeatureFlag",
                "variants": [
                    { 
                        "name": "Big", 
                        "configuration_value": {
                            "Size": 500
                        }
                    },  
                    { 
                        "name": "Small", 
                        "configuration_value": {
                            "Size": 300
                        }
                    } 
                ]
            }
        ]
    }
}
```

#### Allocating variants

The process of allocating a feature's variants is determined by the `allocation` property of the feature.

``` javascript
"allocation": { 
    "default_when_enabled": "Small", 
    "default_when_disabled": "Small",  
    "user": [ 
        { 
            "variant": "Big", 
            "users": [ 
                "Marsha" 
            ] 
        } 
    ], 
    "group": [ 
        { 
            "variant": "Big", 
            "groups": [ 
                "Ring1" 
            ] 
        } 
    ],
    "percentile": [ 
        { 
            "variant": "Big", 
            "from": 0, 
            "to": 10 
        } 
    ], 
    "seed": "13973240" 
},
"variants": [
    { 
        "name": "Big", 
        "configuration_value": "500px"
    },  
    { 
        "name": "Small", 
        "configuration_value": "300px"
    } 
]
```

The `allocation` setting of a feature has the following properties:

| Property | Description |
| ---------------- | ---------------- |
| `default_when_disabled` | Specifies which variant should be used when a variant is requested while the feature is considered disabled. |
| `default_when_enabled` | Specifies which variant should be used when a variant is requested while the feature is considered enabled and no other variant was assigned to the user. |
| `user` | Specifies a variant and a list of users to whom that variant should be assigned. | 
| `group` | Specifies a variant and a list of groups. The variant is assigned if the user is in at least one of the groups. |
| `percentile` | Specifies a variant and a percentage range the user's calculated percentage has to fit into for that variant to be assigned. |
| `seed` | The value which percentage calculations for `percentile` are based on. The percentage calculation for a specific user will be the same across all features if the same `seed` value is used. If no `seed` is specified, then a default seed is created based on the feature name. |

If the feature isn't enabled, the feature manager assigns the variant marked as `default_when_disabled` to the current user, which is `Small` in this case.

If the feature is enabled, the feature manager checks the `user`, `group`, and `percentile` allocations in that order to assign a variant. For this particular example, if the user being evaluated is named `Marsha`, in the group named `Ring1`, or the user happens to fall between the 0 and 10th percentile, then the specified variant is assigned to the user. In this case, all of the assigned users would return the `Big` variant. If none of these allocations match, the user is assigned the `default_when_enabled` variant, which is `Small`.

Allocation logic is similar to the [Microsoft.Targeting](#microsofttargeting) feature filter, but there are some parameters that are present in targeting that aren't in allocation, and vice versa. The outcomes of targeting and allocation aren't related.


### Overriding enabled state with a variant

You can use variants to override the enabled state of a feature flag. Overriding gives variants an opportunity to extend the evaluation of a feature flag. When calling `is_enabled` on a flag with variants, the feature manager will check if the variant assigned to the current user is configured to override the result. Overriding is done using the optional variant property `status_override`. By default, this property is set to `None`, which means the variant doesn't affect whether the flag is considered enabled or disabled. Setting `status_override` to `Enabled` allows the variant, when chosen, to override a flag to be enabled. Setting `status_override` to `Disabled` provides the opposite functionality, therefore disabling the flag when the variant is chosen. A feature with an `enabled` state of `false` can't be overridden.

If you're using a feature flag with binary variants, the `status_override` property can be helpful. It allows you to continue using APIs like `is_enabled` in your application, all while benefiting from the new features that come with variants, such as percentile allocation and seed.

```json
{
    "id": "MyVariantFeatureFlag",
    "enabled": true,
    "allocation": {
        "percentile": [
            {
                "variant": "On",
                "from": 10,
                "to": 20
            }
        ],
        "default_when_enabled":  "Off",
        "seed": "Enhanced-Feature-Group"
    },
    "variants": [
        {
            "name": "On"
        },
        {
            "name": "Off",
            "status_override": "Disabled"
        }
    ]
}
```

In the above example, the feature is always enabled. If the current user is in the calculated percentile range of 10 to 20, then the `On` variant is returned. Otherwise, the `Off` variant is returned and because `status_override` is equal to `Disabled`, the feature will now be considered disabled.

## Telemetry

When a feature flag change is deployed, it's often important to analyze its effect on an application. For example, here are a few questions that may arise:

* Are my flags enabled/disabled as expected?
* Are targeted users getting access to a certain feature as expected?
* Which variant is a particular user seeing?


These types of questions can be answered through the emission and analysis of feature flag evaluation events. This library optionally enables `AzureMonitor` produce tracing telemetry during feature flag evaluation via `OpenTelemetry`.

### Enabling telemetry

By default, feature flags don't have telemetry emitted. To publish telemetry for a given feature flag, the flag _MUST_ declare that it's enabled for telemetry emission.

For feature flags defined in json, enabling is done by using the `telemetry` property.

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "MyFeatureFlag",
                "enabled": true,
                "telemetry": {
                    "enabled": true
                }
            }
        ]
    }
}
```

The snippet above defines a feature flag named `MyFeatureFlag` that is enabled for telemetry. The `telemetry` object's `enabled` property is set to `true`. The value of the `enabled` property must be `true` to publish telemetry for the flag.

The `telemetry` section of a feature flag has the following properties:

| Property | Description |
| ---------------- | ---------------- |
| `enabled` | Specifies whether telemetry should be published for the feature flag. |
| `metadata` | A collection of key-value pairs, modeled as a dictionary, that can be used to attach custom metadata about the feature flag to evaluation events. |

In addition, when creating `FeatureManager`, a callback must be registered to handle telemetry events. This callback is called whenever a feature flag is evaluated and telemetry is enabled for that flag.

```python
feature_manager = FeatureManager(feature_flags, on_feature_evaluated=publish_telemetry)
```

### Application Insights telemetry

The feature management library provides a built-in telemetry publisher that sends feature flag evaluation data to [Application Insights](/azure/azure-monitor/app/app-insights-overview). To enable Application Insights, the feature management library can be installed with Azure Monitor via `pip install FeatureManagement[AzureMonitor]`. This command installs the `azure-monitor-events-extension` package, which is used to style telemetry to Application Insights using OpenTelemetry.

> [!NOTE]
> The `azure-monitor-events-extension` package only adds the telemetry to the Open Telemetry pipeline. Registering Application Insights is still required.

```python
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor(
        connection_string="InstrumentationKey=00000000-0000-0000-0000-000000000000"
    )
```

### Custom telemetry publishing

Because the telemetry callback is a function, it can be customized to publish telemetry to any desired destination. For example, telemetry could be published to a logging service, a database, or a custom telemetry service.

When a feature flag is evaluated and telemetry is enabled, the feature manager calls the telemetry callback with an `EvaluationEvent` parameter. `EvaluationEvent` contains the following properties:

| Tag | Description |
| ---------------- | ---------------- |
| `feature` | The feature flag used. |
| `user` | The user ID used for targeting. |
| `enabled` | Whether the feature flag is evaluated as enabled. |
| `Variant` | The assigned variant. |
| `VariantAssignmentReason` | The reason why the variant is assigned. |

## Next steps

To learn how to use feature flags in your applications, continue to the following quickstarts.

> [!div class="nextstepaction"]
> [Python](./quickstart-feature-flag-python.md)

To learn how to use feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)