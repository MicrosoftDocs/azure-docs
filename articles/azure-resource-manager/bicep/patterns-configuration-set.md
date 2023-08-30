---
title: Configuration set pattern
description: Describes the configuration set pattern.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---
# Configuration set pattern

Rather than define lots of individual parameters, create predefined sets of values. During deployment, select the set of values to use.

## Context and problem

A single Bicep file often defines many resources. Each resource might need to use a different configuration depending on the environment you're deploying it to. For example, you might build a Bicep file that deploys an App Service plan and app, and a storage account. Each of these resources has multiple options that affect its cost, availability, and resiliency. For production environments, you want to use one set of configuration that prioritize high availability and resiliency. For non-production environments, you want to use a different set of configuration that prioritizes cost reduction.

You could create parameters for each configuration setting, but this has some drawbacks:

- This approach creates a burden on your template users, since they need to understand the values to use for each resource, and the impact of setting each parameter.
- The number of parameters in your template increases with each new resource you define.
- Users may select combinations of parameter values that haven't been tested or that won't work correctly.

## Solution

Create a single parameter to specify the environment type. Use a variable to automatically select the configuration for each resource based on the value of the parameter.

> [!NOTE]
> This approach is sometimes called _t-shirt sizing_. When you buy a t-shirt, you don't get lots of options for its length, width, sleeves, and so forth. You simply choose between small, medium, and large sizes, and the t-shirt designer has predefined those measurements based on that size.

## Example

Suppose you have a template that can be deployed to two types of environment: non-production and production. Depending on the environment type, the configuration you need is different:

| Property | Non-production environments | Production environments |
|-|-|-|
| **App Service plan** |
| SKU name | S2 | P2V3 |
| Capacity (number of instances) | 1 | 3 |
| **App Service app** |
| Always On | Disabled | Enabled |
| **Storage account** |
| SKU name | Standard_LRS | Standard_ZRS |

You could use the configuration set pattern for this template.

Accept a single parameter that indicates the environment type, such as production or non-production. Use the `@allowed` parameter decorator to ensure that your template's users only provide values that you expect:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-configuration-set/main.bicep" range="5-9" :::

Then create a _map variable_, which is an object that defines the specific configuration depending on the environment type. Notice that the variable has two objects named `Production` and `NonProduction`. These names match the allowed values for the parameter in the preceding example:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-configuration-set/main.bicep" range="16-49" :::

When you define the resources, use the configuration map to define the resource properties:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/patterns-configuration-set/main.bicep" range="51-74" highlight="4, 14, 23" :::

## Considerations

- In your map variable, consider grouping the properties by resource to simplify their definition.
- In your map variable, you can define both individual property values (like the `alwaysOn` property in the example), or object variables that set an object property (like the SKU properties in the example).
- Consider using a configuration set with [resource conditions](conditional-resource-deployment.md). This enables your Bicep code to deploy certain resources for specific environments, and not in others.

## Next steps

[Learn about the shared variable file pattern.](patterns-shared-variable-file.md)
