---
title: "Pattern: Parameters in a policy definition"
description: This Azure Policy pattern provides an example of how to use parameters in a policy definition.
ms.date: 01/31/2020
ms.topic: sample
---
# Azure Policy pattern: parameters

A policy definition can be made dynamic to reduce the number of policy definitions that are needed
by using [parameters](../concepts/definition-structure.md#parameters). The parameter is defined
during policy assignment. Parameters have a set of pre-defined properties that describe the
parameter and how it's used.

## Sample 1: String parameters

This policy definition uses two parameters, **tagName** and **tagValue** to set what the policy
assignment is looking for on resources. This format allows the policy to be used for any number of
tag name and tag value combinations, but only maintain a single policy definition.

:::code language="json" source="~/policy-templates/patterns/pattern-parameters-1.json":::

### Sample 1: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-parameters-1.json" range="8-13":::

In this portion of the policy definition, the **tagName** parameter is defined as a _string_ and a
description is provided for its use.

The parameter is then used in the **policyRule.if** block to make the policy dynamic. Here, it's
used to define the field that is evaluated, which is a tag with the value of **tagName**.

:::code language="json" source="~/policy-templates/patterns/pattern-parameters-1.json" range="22-27" highlight="3":::

## Sample 2: Array parameters

This policy definition uses a single parameter, **listOfBandwidthinMbps**, to check if the Express
Route Circuit resource has configured the bandwidth setting to one of the approved values. If it
doesn't match, the creation or update to the resource is [denied](../concepts/effects.md#deny).

:::code language="json" source="~/policy-templates/patterns/pattern-parameters-2.json":::

### Sample 2: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-parameters-2.json" range="6-12":::

In this portion of the policy definition, the **listOfBandwidthinMbps** parameter is defined as an
_array_ and a description is provided for its use. As an _array_, it has multiple values to match.

The parameter is then used in the **policyRule.if** block. As an _array_ parameter, an _array_
[condition](../concepts/definition-structure.md#conditions)'s **in** or **notIn** must be used.
Here, it's used against the **serviceProvider.bandwidthInMbps** alias as one of the defined values.

:::code language="json" source="~/policy-templates/patterns/pattern-parameters-2.json" range="21-24" highlight="3":::

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).