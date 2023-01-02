---
title: "Pattern: The value operator in a policy definition"
description: This Azure Policy pattern provides an example of how to use the value operator in a policy definition.
ms.date: 08/17/2021
ms.topic: sample
---
# Azure Policy pattern: the value operator

The [value](../concepts/definition-structure.md#value) operator evaluates
[parameters](../concepts/definition-structure.md#parameters),
[supported template functions](../concepts/definition-structure.md#policy-functions), or literals
to a provided value for a given [condition](../concepts/definition-structure.md#conditions).

> [!WARNING]
> If the result of a _template function_ is an error, policy evaluation fails. A failed evaluation
> is an implicit **deny**. For more information, see
> [avoiding template failures](../concepts/definition-structure.md#avoiding-template-failures).

## Sample policy definition

This policy definition adds or replaces the tag specified in the parameter **tagName** (_string_) on
resources and inherits the value for **tagName** from the resource group the resource is in. This
evaluation happens when the resource is created or updated. As a
[modify](../concepts/effects.md#modify) effect, the remediation may be run on existing resources
through a [remediation task](../how-to/remediate-resources.md).

:::code language="json" source="~/policy-templates/patterns/pattern-value-operator.json":::

### Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-value-operator.json" range="20-30" highlight="7,8":::

The **value** operator is used within the **policyRule.if** block within **properties**. In this
example, the [logical operator](../concepts/definition-structure.md#logical-operators) **allOf** is
used to state that both conditional statements must be true for the effect, **modify**, to take
place.

**value** evaluates the result of the template function
[resourceGroup()](../../../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)
to the condition **notEquals** of a blank value. If the tag name provided in **tagName** on the
parent resource group exists, the conditional evaluates to true.

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).