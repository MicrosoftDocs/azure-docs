---
title: Go feature management
titleSuffix: Azure App Configuration
description: Learn to implement feature flags in your Go applications using feature management and Azure App Configuration. Dynamically manage feature rollouts, conduct A/B testing, and control feature visibility without redeploying the app.
services: azure-app-configuration
author: linglingye
ms.author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.custom: devx-track-go
ms.topic: tutorial
ms.date: 08/25/2025
#Customer intent: I want to control feature availability in my app by using the Feature Management library.
---

# Go feature management

Go feature management library provides a way to develop and expose application functionality based on feature flags. Once a new feature is developed, many applications have special requirements, such as when the feature should be enabled and under what conditions. This library provides a way to define these relationships, and also integrates into common Go code patterns to make exposing these features possible.

Feature flags provide a way for Go applications to turn features on or off dynamically. Developers can use feature flags in simple use cases like conditional statements.

Here are some of the benefits of using Go feature management library:

* A common convention for feature management
* Low barrier to entry
  * Azure App Configuration feature flag source
* Feature flag lifetime management
  * Configuration values can change in real-time
* Simple to complex scenarios covered
  * Toggle on/off features
  * Dynamically evaluate state of feature based on call to server

The Go feature management library is open source. For more information, visit the [GitHub repo](https://github.com/microsoft/FeatureManagement-Go).

## Feature flags

Feature flags can be either enabled or disabled. The state of a flag can be made conditional through the use of feature filters.

### Feature filters

Feature filters define a scenario for when a feature should be enabled. When a feature is evaluated for whether it is on or off, its list of feature filters is traversed until one of the filters decides the feature should be enabled. At this point, the feature is considered enabled and traversal through the feature filters stops. If no feature filter indicates that the feature should be enabled, it's considered disabled.

As an example, a Microsoft Edge browser feature filter could be designed. This feature filter would activate any features attached to it, as long as an HTTP request is coming from Microsoft Edge.

### Feature flag configuration

The Go feature management supports consuming feature flags defined in Azure App Configuration by the built-in feature flag provider [`azappconfig`](https://pkg.go.dev/github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig), as well as an extensibility point via the `FeatureFlagProvider` interface to consume feature flags defined by other providers.

```golang
import (
    "context"
    "log"

    "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
    "github.com/microsoft/Featuremanagement-Go/featuremanagement"
    "github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig"
)


// ... ...
// Load Azure App Configuration
appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
if err != nil {
    log.Fatalf("Failed to load configuration: %v", err)
}


// Create feature flag provider
featureFlagProvider, err := azappconfig.NewFeatureFlagProvider(appConfig)
if err != nil {
    log.Fatalf("Error creating feature flag provider: %v", err)
}

// Create feature manager
featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, nil)
if err != nil {
    log.Fatalf("Error creating feature manager: %v", err)
}
```

### Feature flag declaration

The following example shows the format used to set up feature flags in a JSON file.

```json
{
    "feature_management": {
        "feature_flags": [
            {
                "id": "FeatureT",
                "enabled": true
            },
            {
                "id": "FeatureU",
                "enabled": false
            },
            {
                "id": "FeatureV",
                "enabled": true,
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

The `feature_management` section of the JSON document is used by convention to load feature flag settings. Feature flag objects must be listed in the `feature_flags` array under the `feature_management` section. 

In the section above, we see three different features. A feature flag has `id` and `enabled` properties. The `id` is the name used to identify and reference the feature flag. The `enabled` property specifies the enabled state of the feature flag. A feature is *OFF* if enabled is false. If `enabled` is true, then the state of the feature depends on the conditions. If there are no conditions, then the feature is *ON*. If there are conditions, and they're met, then the feature is *ON*. If there are conditions and they aren't met then the feature is *OFF*. The conditions property declares the conditions used to dynamically enable the feature. Features define their feature filters in the *client_filters* array. `FeatureV` specifies a feature filter named `Microsoft.TimeWindow`. This filter is an example of a configurable feature filter. We can see in the example that the filter has a `Parameters` property. This property is used to configure the filter. In this case, the start and end times for the feature to be active are configured.

The detailed schema of the `feature_management` section can be found [here](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureManagement.v2.0.0.schema.json).

**Advanced:** The usage of colon ':' is forbidden in feature flag names.

#### On/off declaration
 
The following snippet demonstrates an alternative way to define a feature for simple on/off features.

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

#### Requirement type

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

The basic form of feature management is checking if a feature flag is enabled and then performing actions based on the result. Checking the state of a feature flag is done through `FeatureManager`'s `IsEnabled` method.

```golang
// Create feature flag provider
featureFlagProvider, err := azappconfig.NewFeatureFlagProvider(appConfig)
if err != nil {
    log.Fatalf("Error creating feature flag provider: %v", err)
}

// Create feature manager
featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, nil)
if err != nil {
    log.Fatalf("Error creating feature manager: %v", err)
}

// Check if feature is enabled
enabled, err := featureManager.IsEnabled("FeatureX")
if err != nil {
    log.Printf("Error checking feature: %v", err)
    return
}

if enabled {
    // Do something
}
```

## Implementing a feature filter

Creating a feature filter provides a way to enable features based on criteria that you define. To implement a feature filter, the `FeatureFilter` interface must be implemented. `FeatureFilter` has a method named `Evaluate`. When a feature is associated with a filter, the `Evaluate` method is invoked during evaluation. If `Evaluate` returns `true`, the feature is considered enabled.

```golang
type FeatureFilter interface {
	// Name returns the identifier for this filter
	Name() string

	// Evaluate determines whether a feature should be enabled based on the provided contexts
	Evaluate(evalCtx FeatureFilterEvaluationContext, appCtx any) (bool, error)
}

type FeatureFilterEvaluationContext struct {
	// FeatureName is the name of the feature being evaluated
	FeatureName string

	// Parameters contains the filter-specific configuration parameters
	Parameters map[string]any
}
```

The following snippet demonstrates how to implement a customized feature filter.

```golang
type MyCustomFilter struct{}

func (f *MyCustomFilter) Evaluate(ctx context.Context, context *FeatureFilterEvaluationContext) bool {
    // Custom logic to determine if feature should be enabled
    if satisfyCriteria() {
        return true
    }
    return false
}

func (f *MyCustomFilter) Name() string {
    return "MyCustomFilter"
}
```

Feature filters are registered by providing them when creating the `FeatureManager`. If a custom feature filter needs any context, they can be passed in through the `FeatureFilterEvaluationContext` parameter.

```golang
// Register custom filters
options := &featuremanagement.Options{
    Filters: []featuremanagement.FeatureFilter{
        &MyCustomFilter{},
    },
}

// Create feature manager with custom filters
featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, options)
if err != nil {
    log.Fatalf("Error creating feature manager: %v", err)
}
```

### Filter alias attribute

When a feature filter is registered for a feature flag, its name is used as the default alias. You can override this identifier by implementing the `Name()` method, which specifies the name to be used in configuration when referencing the filter within a feature flag.

### Missing feature filters

If a feature is configured to be enabled for a specific feature filter and that feature filter isn't registered, an error is returned when the feature is evaluated.

## Built-in feature filters

There are two feature filters that come with the `featuremanagement` package: `TimeWindowFilter`, and `TargetingFilter`.

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

```json
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

1. Individual users Jeff and Alicia are granted access to the Beta.
1. Another user, Mark, asks to opt in and is included.
1. Twenty percent of a group known as "Ring1" users are included in the Beta.
1. The number of "Ring1" users included in the Beta is bumped up to 100 percent.
1. Five percent of the user base is included in the Beta.
1. The rollout percentage is bumped up to 100 percent and the feature is completely rolled out.

This strategy for rolling out a feature is built into the library through the included [Microsoft.Targeting](#microsofttargeting) feature filter.

### Targeting a user

The targeting filter relies on a targeting context to evaluate whether a feature should be turned on. This targeting context contains information such as what user is currently being evaluated, and what groups the user is in. The targeting context must be passed directly when `IsEnabledWithAppContext` is called.

```golang
// ... ...
// Create targeting context
targetingCtx := featuremanagement.TargetingContext{
    UserID: "test_user",
    Groups: []string{"Ring1"},
}

// Check if feature is enabled for the user
enabled, err := featureManager.IsEnabledWithAppContext("Beta", targetingCtx)
if err != nil {
    log.Printf("Error checking feature: %v", err)
    return
}

if enabled {
    // Feature is enabled for this user
}
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
    "DefaultRolloutPercentage": 0,
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

```golang
type Variant struct {
	// Name uniquely identifies this variant
	Name string

	// ConfigurationValue holds the value for this variant
	ConfigurationValue any
}
```

### Getting variants

For each feature, a variant can be retrieved using the `FeatureManager`'s `GetVariant` method. The variant assignment is dependent on the user currently being evaluated, and that information is obtained from the targeting context you passed in. 

```golang
targetingCtx := featuremanagement.TargetingContext{
    UserID: "Adam",
}

variant, err := featureManager.GetVariant("TestVariants", targetingCtx)
if err != nil {
    log.Printf("Error getting variant: %v", err)
    return
}

if variant != nil {
    variantConfiguration := variant.Configuration

    // Do something with the resulting variant and its configuration
}

``` 

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

Each variant has two properties: a name and a configuration. The name is used to refer to a specific variant, and the configuration is the value of that variant. The configuration can be set using `configuration_value` property. `configuration_value` is an inline configuration that can be a string, number, boolean, or configuration object. If `configuration_value` isn't specified, the returned variant's `Configuration` property is `nil`.

A list of all possible variants is defined for each feature under the `variants` property.

``` json
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

``` json
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

You can use variants to override the enabled state of a feature flag. Overriding gives variants an opportunity to extend the evaluation of a feature flag. When calling `IsEnabledWithAppContext` on a flag with variants, the feature manager will check if the variant assigned to the current user is configured to override the result. Overriding is done using the optional variant property `status_override`. By default, this property is set to `None`, which means the variant doesn't affect whether the flag is considered enabled or disabled. Setting `status_override` to `Enabled` allows the variant, when chosen, to override a flag to be enabled. Setting `status_override` to `Disabled` provides the opposite functionality, therefore disabling the flag when the variant is chosen. A feature with an `enabled` state of `false` can't be overridden.

If you're using a feature flag with binary variants, the `status_override` property can be helpful. It allows you to continue using APIs like `IsEnabledaWithAppContext` in your application, all while benefiting from the new features that come with variants, such as percentile allocation and seed.

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


## Next steps

To learn how to use feature flags in your applications, continue to the following quickstarts.

> [!div class="nextstepaction"]
> [Go Gin web app](./quickstart-feature-flag-go-gin.md)

To learn how to use feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)