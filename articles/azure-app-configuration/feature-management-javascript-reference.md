---
title: JavaScript feature flag management
titleSuffix: Azure App Configuration
description: Learn to implement feature flags in your JavaScript applications using feature management and Azure App Configuration. Dynamically manage feature rollouts, conduct A/B testing, and control feature visibility without redeploying the app.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.devlang: javascript
ms.custom: devx-track-javascript
ms.topic: tutorial
ms.date: 04/06/2025
zone_pivot_groups: feature-management
#Customer intent: I want to control feature availability in my app by using the Feature Management library.
---

# JavaScript feature management

[![feature-management-npm-package](https://img.shields.io/npm/v/@microsoft/feature-management?label=@microsoft/feature-management)](https://www.npmjs.com/package/@microsoft/feature-management)

JavaScript feature management library provides a way to develop and expose application functionality based on feature flags. Once a new feature is developed, many applications have special requirements, such as when the feature should be enabled and under what conditions. This library provides a way to define these relationships, and also integrates into common JavaScript code patterns to make exposing these features possible.

Feature flags provide a way for JavaScript applications to turn features on or off dynamically. Developers can use feature flags in simple use cases like conditional statements.

Here are some of the benefits of using JavaScript feature management library:

* A common convention for feature management
* Low barrier to entry
  * Supports both JSON objects and map-based feature flag sources
  * Supports usage in both Node.js and browser environments
* Feature flag lifetime management with Azure App Configuration
  * Configuration values can change in real-time
* Simple to complex scenarios covered
  * Toggle on/off features through declarative configuration file
  * Dynamically evaluate state of feature based on call to server

The JavaScript feature management library is open source. For more information, visit the [GitHub repo](https://github.com/microsoft/FeatureManagement-JavaScript).

> [!NOTE]
> It is recommended to use the feature management library together with Azure App Configuration. Azure App Configuration provides a solution for centrally managing application settings and feature flags. For more details, please refer to this [section](#use-feature-flags-from-azure-app-configuration).

## Feature flags

Feature flags are composed of two parts, a name and a list of feature-filters that are used to turn on the feature.

### Feature filters

Feature filters define a scenario for when a feature should be enabled. When a feature is evaluated for whether it is on or off, its list of feature filters is traversed until one of the filters decides the feature should be enabled. At this point, the feature is considered enabled and traversal through the feature filters stops. If no feature filter indicates that the feature should be enabled, it's considered disabled.

As an example, a Microsoft Edge browser feature filter could be designed. This feature filter would activate any features attached to it, as long as an HTTP request is coming from Microsoft Edge.

## Feature flag configuration

In JavaScript, developers commonly use objects or maps as the primary data structures to represent configurations. The JavaScript feature management library supports both of the configuration approaches, providing developers with the flexibility to choose the option that best fits their needs. The `FeatureManager` can read feature flags from different types of configuration using the built-in `ConfigurationObjectFeatureFlagProvider` and `ConfigurationMapFeatureFlagProvider`.

### [Use map configuration](#tab/map-configuration)

```typescript
const config = new Map([
    ["feature_management", {
        "feature_flags": [
            {
                "id": "FeatureT",
                "enabled": true
            },
            {
                "id": "FeatureU",
                "enabled": false
            }
        ]
    }],
    ["some other configuration", " some value"]
]);

import { ConfigurationMapFeatureFlagProvider, FeatureManager } from "@microsoft/feature-management";
const featureProvider = new ConfigurationMapFeatureFlagProvider(config);
const featureManager = new FeatureManager(featureProvider);
```

### [Use object configuration](#tab/object-configuration)

```typescript
const config = {
    "feature_management": {
        "feature_flags": [
            {
                "id": "FeatureT",
                "enabled": true
            },
            {
                "id": "FeatureX",
                "enabled": false
            }
        ]
    },
    "some other configuration": " some value"
}

import { ConfigurationObjectFeatureFlagProvider, FeatureManager } from "@microsoft/feature-management";
const featureProvider = new ConfigurationObjectFeatureFlagProvider(config);
const featureManager = new FeatureManager(featureProvider);
```

The object can also be parsed from a JSON file:

```typescript
const config = JSON.parse(await fs.readFile("path/to/config.json"));
const featureProvider = new ConfigurationObjectFeatureFlagProvider(config);
const featureManager = new FeatureManager(featureProvider);
```

---

### Use feature flags from Azure App Configuration

Rather than hard coding your feature flags into your application, we recommend that you keep feature flags outside the application and manage them separately. Doing so allows you to modify flag states at any time and have those changes take effect in the application right away. The Azure App Configuration service provides a dedicated portal UI for managing all of your feature flags. See the [tutorial](./manage-feature-flags.md).

The Azure App Configuration service also delivers the feature flags to your application directly through its JavaScript client library [@azure/app-configuration-provider](https://www.npmjs.com/package/@azure/app-configuration-provider). The following example shows how to use the library.

The App Configuration JavaScript provider provides feature flags in a `Map` object. The built-in `ConfigurationMapFeatureFlagProvider` helps to load feature flags in this case.

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { load } from "@azure/app-configuration-provider";
import { ConfigurationMapFeatureFlagProvider, FeatureManager } from "@microsoft/feature-management";
const appConfig = await load("YOUR_APP-CONFIG-ENDPOINT",
                             new DefaultAzureCredential(), // For more information: https://learn.microsoft.com/javascript/api/overview/azure/identity-readme
                             { featureFlagOptions: { enabled: true } }); // load feature flags from Azure App Configuration service
const featureProvider = new ConfigurationMapFeatureFlagProvider(appConfig);
const featureManager = new FeatureManager(featureProvider);
```

#### Use Azure App Configuration to dynamically control the state of the feature flag

Azure App Configuration is not only a solution to externalize storage and centralized management of your feature flags, but also it allows to dynamically turn on/off the feature flags.

To enable the dynamic refresh for feature flags, you need to configure the `refresh` property of `featureFlagOptions` when loading feature flags from Azure App Configuration.

``` typescript
const appConfig = await load("YOUR_APP-CONFIG-ENDPOINT",  new DefaultAzureCredential(),  { 
    featureFlagOptions: { 
        enabled: true,
        refresh: {
            enabled: true, // enable the dynamic refresh for feature flags
            refreshIntervalInMs: 30_000
        }
    } 
});

const featureProvider = new ConfigurationMapFeatureFlagProvider(appConfig);
const featureManager = new FeatureManager(featureProvider);
```

You need to call the `refresh` method to get the latest feature flag state.

```typescript
await appConfig.refresh(); // Refresh to get the latest feature flags
const isBetaEnabled = await featureManager.isEnabled("Beta");
console.log(`Beta is enabled: ${isBetaEnabled}`);
```

> [!NOTE]
> For more information about how to use feature management library with Azure App Configuration, please go to the [quickstart](./quickstart-javascript.md).

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

The `feature_management` section is used by convention to load feature flag settings. The `feature_flags` section is a list of the feature flags that are loaded into the library. In the section above, we see three different features. Features define their feature filters using the `client_filters` property, inside of `conditions`. In the feature filters for `FeatureT`, we see `enabled` is `true` with no filters defined, resulting in `FeatureT` always returning `true` . `FeatureU` is the same as `FeatureT` but with `enabled` is `false` resulting in the feature always returning `false`. `FeatureV` specifies a feature filter named `Microsoft.TimeWindow`. `FeatureV` is an example of a configurable feature filter. We can see in the example that the filter has a `parameters` property. The `parameters` property is used to configure the filter. In this case, the start and end times for the feature to be active are configured.

The detailed schema of the `feature_management` section can be found [here](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureManagement.v2.0.0.schema.json).

**Advanced:** The usage of colon ':' is forbidden in feature flag names.

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
                "enabled": true,
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

The basic form of feature management is checking if a feature flag is enabled and then performing actions based on the result. Checking the state of a feature flag is done through `FeatureManager`'s `isEnabled` method.

### [Use map configuration](#tab/map-configuration)

```typescript
import { ConfigurationMapFeatureFlagProvider, FeatureManager } from "@microsoft/feature-management";
const featureProvider = new ConfigurationMapFeatureFlagProvider(config);
const featureManager = new FeatureManager(featureProvider);

const isBetaEnabled = await featureManager.isEnabled("Beta");
if (isBetaEnabled) {
    // Do something
}
```

### [Use object configuration](#tab/object-configuration)

```typescript
import { ConfigurationObjectFeatureFlagProvider, FeatureManager } from "@microsoft/feature-management";
const featureProvider = new ConfigurationObjectFeatureFlagProvider(config);
const featureManager = new FeatureManager(featureProvider);

const isBetaEnabled = await featureManager.isEnabled("Beta");
if (isBetaEnabled) {
    // Do something
}
```

---

## Implementing a feature filter

Creating a feature filter provides a way to enable features based on criteria that you define. To implement a feature filter, the `IFeatureFilter` interface must be implemented. `IFeatureFilter` has a `name` property and a method named `evaluate`. The `name` should be used in configuration to reference the feature filter within a feature flag. When a feature specifies that it can be enabled for a feature filter, the `evaluate` method is called. If `evaluate` returns `true`, it means the feature should be enabled.

```typescript
interface IFeatureFilter {
    name: string;
    evaluate(context: IFeatureFilterEvaluationContext, appContext?: unknown): boolean | Promise<boolean>;
}
```

The following snippet demonstrates how to implement a customized feature filter with name `MyCriteria`.

```typescript
    class MyCriteriaFilter {
        name = "MyCriteria";
        evaluate(context, appContext) {
            if (satisfyCriteria()) {
                return true;
            }
            else {
                return false;
            }
        }
    }
```

You need to register the custom filter under the `customFilters` property of the `FeatureManagerOptions` object passed to the `FeatureManager` constructor.

```typescript
const featureManager = new FeatureManager(ffProvider, {
    customFilters: [
        new MyCriteriaFilter() // add custom feature filters under FeatureManagerOptions.customFilters
    ]
});
```

### Parameterized feature filters

Some feature filters require parameters to decide whether a feature should be turned on or not. For example, a browser feature filter may turn on a feature for a certain set of browsers. It may be desired that Edge and Chrome browsers enable a feature, while Firefox does not. To do this, a feature filter can be designed to expect parameters. These parameters would be specified in the feature configuration, and in code would be accessible via the `IFeatureFilterEvaluationContext` parameter of `IFeatureFilter.Evaluate`.

```typescript
interface IFeatureFilterEvaluationContext {
    featureName: string;
    parameters?: unknown;
}
```

`IFeatureFilterEvaluationContext` has a property named `parameters`. These parameters represent a raw configuration that the feature filter can use to decide how to evaluate whether the feature should be enabled or not. To use the browser feature filter as an example once again, the filter could use `parameters` to extract a set of allowed browsers that would be specified for the feature and then check if the request is being sent from one of those browsers.

### Use application context for feature evaluation

A feature filter may need runtime application context to evaluate a feature flag. You can pass in the context as a parameter when calling `isEnabled`.

```typescript
featureManager.isEnabled("Beta", { userId : "Sam" })
```

The feature filter can take advantage of the context that is passed in when `isEnabled` is called. The application context will be passed in as the second parameter of `IFeatureFilter.Evaluate`.

## Built-in feature filters

There are two feature filters that come with the `FeatureManagement` package: `TimeWindowFilter` and `TargetingFilter`. All built-in feature filters will be added by default when constructing `FeatureManager`.

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

```typescript
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

### Targeting a user with targeting context

The targeting filter relies on a targeting context to evaluate whether a feature should be turned on. This targeting context contains information such as what user is currently being evaluated, and what groups the user is in. The targeting context must be passed directly when `isEnabled` is called.

```typescript
featureManager.isEnabled("Beta", { userId: "Aiden", groups: ["Ring1"] })
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

### Targeting in a Web Application

An example web application that uses the targeting feature filter is available in this [example](https://github.com/microsoft/FeatureManagement-JavaScript/tree/preview/examples/express-app) project.

In web applications, especially those with multiple components or layers, passing targeting context (`userId` and `groups`) to every feature flag check can become cumbersome and repetitive. This scenario is referred to as "ambient targeting context," where the user identity information is already available in the application context (such as in session data or authentication context) but needs to be accessible to feature management evaluations throughout the application.

#### ITargetingContextAccessor

The library provides a solution through the `ITargetingContextAccessor` pattern. 

``` typescript
interface ITargetingContext {
    userId?: string;
    groups?: string[];
}

interface ITargetingContextAccessor {
    getTargetingContext: () => ITargetingContext | undefined;
}
```

Instead of explicitly passing the targeting context with each `isEnabled` or `getVariant` call, you can provide a function that knows how to retrieve the current user's targeting information from your application's context:

```typescript
import { FeatureManager, ConfigurationObjectFeatureFlagProvider } from "@microsoft/feature-management";

// Create a targeting context accessor that uses your application's auth system
const targetingContextAccessor = {
    getTargetingContext: () => {
        // In a web application, this might access request context or session data
        // This is just an example - implement based on your application's architecture
        return {
            userId: getCurrentUserId(), // Your function to get current user
            groups: getUserGroups()     // Your function to get user groups
        };
    }
};

// Configure the feature manager with the accessor
const featureManager = new FeatureManager(featureProvider, {
    targetingContextAccessor: targetingContextAccessor
});

// Now you can call isEnabled without explicitly providing targeting context
// The feature manager will use the accessor to get the current user context
const isBetaEnabled = await featureManager.isEnabled("Beta");
```

This pattern is particularly useful in server-side web applications where user context may be available in a request scope or in client applications where user identity is managed centrally.

#### Using AsyncLocalStorage for request context

One common challenge when implementing the targeting context accessor pattern is maintaining request context throughout an asynchronous call chain. In Node.js web applications, user identity information is typically available in the request object, but becomes inaccessible once you enter asynchronous operations.

Node.js provides [`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage) from the `async_hooks` module to solve this problem. It creates a store that persists across asynchronous operations within the same logical "context" - perfect for maintaining request data throughout the entire request lifecycle.

Here's how to implement a targeting context accessor using AsyncLocalStorage in an express application:

```typescript
import { AsyncLocalStorage } from "async_hooks";
import express from "express";

const requestAccessor = new AsyncLocalStorage();

const app = express();
// Middleware to store request context
app.use((req, res, next) => {
    // Store the request in AsyncLocalStorage for this request chain
    requestAccessor.run(req, () => {
        next();
    });
});

// Create targeting context accessor that retrieves user data from the current request
const targetingContextAccessor = {
    getTargetingContext: () => {
        // Get the current request from AsyncLocalStorage
        const request = requestAccesor.getStore();
        if (!request) {
            return undefined; // Return undefined if there's no current request
        }
        // Extract user data from request (from session, auth token, etc.)
        return {
            userId: request.user?.id,
            groups: request.user?.groups || []
        };
    }
};
```

## Variants

When new features are added to an application, there may come a time when a feature has multiple different proposed design options. A common solution for deciding on a design is some form of A/B testing, which involves providing a different version of the feature to different segments of the user base and choosing a version based on user interaction. In this library, this functionality is enabled by representing different configurations of a feature with variants.

Variants enable a feature flag to become more than a simple on/off flag. A variant represents a value of a feature flag that can be a string, a number, a boolean, or even a configuration object. A feature flag that declares variants should define under what circumstances each variant should be used, which is covered in greater detail in the [Allocating variants](#allocating-variants) section.

### Getting a variant with targeting context

For each feature, a variant can be retrieved using the `FeatureManager`'s `getVariant` method. The variant assignment is dependent on the user currently being evaluated, and that information is obtained from the targeting context you passed in. If you have registered a targeting context accessor to the `FeatureManager`, the targeting context will be automatically retrieved from it. But you can still override it by manually passing targeting context when calling `getVariant`. 

```typescript
const variant = await featureManager.getVariant("MyVariantFeatureFlag", { userId: "Sam" });

const variantName = variant.name;
const variantConfiguration = variant.configuration;

// Do something with the resulting variant and its configuration
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

Each variant has two properties: a name and a configuration. The name is used to refer to a specific variant, and the configuration is the value of that variant. The configuration can be set using `configuration_value` property. `configuration_value` is an inline configuration that can be a string, number, boolean, or configuration object. If `configuration_value` isn't specified, the returned variant's `configuration` property is `undefined`.

A list of all possible variants is defined for each feature under the `variants` property.

```json
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

```json
"allocation": { 
    "default_when_disabled": "Small",  
    "default_when_enabled": "Small", 
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


These types of questions can be answered through the emission and analysis of feature flag evaluation events.

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

### Custom telemetry publishing

You can register an `onFeatureEvaluated` callback function when creating `FeatureManager`. This callback is called whenever a feature flag is evaluated and telemetry is enabled for that flag. The callback function will take the feature evaluation result as the parameter.

The following example shows how to implement a custom callback function to send telemetry with the information extracted from the feature evaluation result and register it to the feature manager.

```typescript
const sendTelemetry = (evaluationResult) => {
    const featureId = evaluationResult.feature.id;
    const featureEnabled = evaluationResult.enabled;
    const targetingId = evaluationResult.targetingId;
    const variantName = evaluationResult.variant?.name;
    const variantAssignmentReason = evaluationResult.variantAssignmentReason;
    // custom code to send the telemetry
    // ...
}
const featureManager = new FeatureManager(featureProvider, { onFeatureEvaluated :  sendTelemtry});
```

### Application Insights integration

The JavaScript feature management library provides extension packages that integrate with [Application Insights](/azure/azure-monitor/app/app-insights-overview) SDKs.

The Application Insights offers different SDKs for [web](https://www.npmjs.com/package/@microsoft/applicationinsights-web) and [Node.js](https://www.npmjs.com/package/applicationinsights) scenarios. Please select the correct extension packages for your application.

### [Browser](#tab/browser)

If your application runs in the browser, install the [`"@microsoft/feature-management-applicationinsights-browser"`](https://www.npmjs.com/package/@microsoft/feature-management-applicationinsights-browser) package. The following example shows how you can create a built-in Application Insights telemetry publisher and register it to the feature manager.

```typescript
import { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { FeatureManager, ConfigurationObjectFeatureFlagProvider } from "@microsoft/feature-management";
import { createTelemetryPublisher, trackEvent } from "@microsoft/feature-management-applicationinsights-browser";

const appInsights = new ApplicationInsights({ config: {
    connectionString: "<APPINSIGHTS_CONNECTION_STRING>"
}});
appInsights.loadAppInsights();

const publishTelemetry = createTelemetryPublisher(appInsights);
const provider = new ConfigurationObjectFeatureFlagProvider(jsonObject);
const featureManager = new FeatureManager(provider, {onFeatureEvaluated: publishTelemetry});

// FeatureEvaluation event will be emitted when a feature flag is evaluated
featureManager.getVariant("TestFeature", {userId : TARGETING_ID}).then((variant) => { /* do something*/ });

// Emit a custom event with targeting id attached.
trackEvent(appInsights, TARGETING_ID, {name: "TestEvent"}, {"Tag": "Some Value"});
```

### [Node.js](#tab/nodejs)

If your application runs in the Node.js, install the [`"@microsoft/feature-management-applicationinsights-node"`](https://www.npmjs.com/package/@microsoft/feature-management-applicationinsights-node) package. The following example shows how you can create a built-in Application Insights telemetry publisher and register it to the feature manager.

```typescript
const appInsights = require("applicationinsights");
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

const { FeatureManager, ConfigurationObjectFeatureFlagProvider } = require("@microsoft/feature-management");
const { createTelemetryPublisher, trackEvent } = require("@microsoft/feature-management-applicationinsights-node");

const publishTelemetry = createTelemetryPublisher(appInsights.defaultClient);
const provider = new ConfigurationObjectFeatureFlagProvider(jsonObject);
const featureManager = new FeatureManager(provider, {onFeatureEvaluated: publishTelemetry});

// FeatureEvaluation event will be emitted when a feature flag is evaluated
featureManager.getVariant("TestFeature", {userId : "<TARGETING_ID>"}).then((variant) => { /* do something*/ });

// Emit a custom event with targeting id attached.
trackEvent(appInsights.defaultClient, "<TARGETING_ID>", {name: "TestEvent",  properties: {"Tag": "Some Value"}});
```

---

The telemetry publisher sends `FeatureEvaluation` custom events to the Application Insights when a feature flag enabled with telemetry is evaluated. The custom event follows the [FeatureEvaluationEvent](https://github.com/microsoft/FeatureManagement/tree/main/Schema/FeatureEvaluationEvent) schema.

### Targeting telemetry processor

If you have implemented [`ITargetingContextAccessor`](#itargetingcontextaccessor), you can use the built-in Application Insights telemetry processor to automatically attach targeting ID information to all telemetry by calling the `createTargetingTelemetryProcessor` function.

```typescript
const appInsights = require("applicationinsights");
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

const { createTargetingTelemetryProcessor } = require("@microsoft/feature-management-applicationinsights-node");
appInsights.defaultClient.addTelemetryProcessor(
    createTargetingTelemetryProcessor(targetingContextAccessor)
);
```

This ensures that every telemetry item sent to Application Insights includes the user's targeting ID information (userId and groups), allowing you to correlate feature flag usage with specific users or groups in your analytics.

If you are using the targeting telemetry processor, instead of calling the `trackEvent` method provided by the feature management package, you can directly call the `trackEvent` method from the Application Insights SDK. The targeting ID information will be automatically attached to the custom event telemetry's `customDimensions`.

```typescript
// Instead of calling trackEvent and passing the app insights client
// trackEvent(appInsights.defaultClient, "<TARGETING_ID>", {name: "TestEvent",  properties: {"Tag": "Some Value"}});

// directly call trackEvent method provided by App Insights SDK
appInsights.defaultClient.trackEvent({ name: "TestEvent" });
```

## Next steps

To learn how to use feature flags in your applications, continue to the following quickstarts.

> [!div class="nextstepaction"]
> [Python](./quickstart-feature-flag-javascript.md)

To learn how to use feature filters, continue to the following tutorials.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter.md)
