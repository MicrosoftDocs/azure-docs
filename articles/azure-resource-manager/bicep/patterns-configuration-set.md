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

A single Bicep file often defines many resources, and each resource might need to use a different configuration depending on the environment you're deploying it to. For example, you might build a Bicep file that deploys an App Service plan and a storage account. Each of these resources has multiple options that affect its cost, availability, and resiliency. For production environments, you want to use one set of configuration. For test environments, you want to use a different set of configuration.

While you could create parameters for each configuration setting, this has some drawbacks:

- This approach creates a burden on your template users, since they need to understand the values to use for each resource, and the impact of doing so.
- The number of parameters in your template increases with each new resource you define.
- Users may select configurations or sets of configurations that haven't been tested or that won't work correctly.

## Solution

Instead of creating multiple parameters to specify each configuration setting, create a single parameter to specify the environment type. Automatically select the configuration for each resource based on the value of the parameter.

> [!NOTE]
> Sometimes this pattern is called _t-shirt sizing_. When you buy a t-shirt, you don't specify every measurement - you just buy a small, medium, or large size and the measurements are predefined. Similarly, when you use the configuration map pattern, your template's users specify a single value and your template automatically chooses other values based on their selection.

## Example

Suppose you have a template that can be deployed to two types of environment: test and production. Depending on the environment type, the configuration you need is different:

| Resource | Property | Test environments | Production environments |
|-|-|-|-|
| App Service plan | SKU name | S2 | P2V3 |
| App Service plan | Capacity (number of instances) | 1 | 3 |
| Storage account | SKU name | LRS | ZRS |

You could use the configuration set pattern for this template.

Accept a single parameter that indicates the environment type, such as production or test. Use the `@allowedValues` parameter decorator to ensure that your template's users only provide values that you expect:

::: code language="bicep" source="code/patterns-configuration-set/main.bicep" range="5-9" :::

Then create a _map variable_, which is an object that defines the specific configuration depending on the environment type:

::: code language="bicep" source="code/patterns-configuration-set/main.bicep" range="15-42" :::

When you define the resources, use the configuration map to define the resource properties:

::: code language="bicep" source="code/patterns-configuration-set/main.bicep" range="44-55" highlight="4, 11" :::

## Next steps

[Return to the list of patterns for Bicep code.](patterns-overview.md)
