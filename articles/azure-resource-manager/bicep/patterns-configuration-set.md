---
title: Configuration set pattern
description: Describes the configuration set pattern.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.date: 08/08/2021
---
# Configuration set pattern

Create predefined sets of configuration for resources based on a single parameter, like an environment type. Use Bicep parameters and object variables to determine the configuration for each resource based on the parameter value.

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
| **Storage account ** |
| SKU name | Standard_LRS | Standard_ZRS |

You could use the configuration set pattern for this template.

Accept a single parameter that indicates the environment type, such as production or non-production. Use the `@allowedValues` parameter decorator to ensure that your template's users only provide values that you expect:

::: code language="bicep" source="code/patterns-configuration-set/main.bicep" range="5-9" :::

Then create a _map variable_, which is an object that defines the specific configuration depending on the environment type:

::: code language="bicep" source="code/patterns-configuration-set/main.bicep" range="16-49" :::

When you define the resources, use the configuration map to define the resource properties:

::: code language="bicep" source="code/patterns-configuration-set/main.bicep" range="51-74" highlight="4, 14, 23" :::

<!-- TODO
## Considerations

- Can use for other situations than just environment type. TODO other examples?
- Consider grouping the properties by resource, like we've done here
-->

## Next steps

[Return to the list of patterns for Bicep code.](patterns-overview.md)
