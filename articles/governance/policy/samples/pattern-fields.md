---
title: "Pattern: Field properties in a policy definition"
description: This Azure Policy pattern provides an example of how to use field properties in a policy definition.
ms.date: 08/17/2021
ms.topic: sample
---
# Azure Policy pattern: field properties

The [field](../concepts/definition-structure.md#fields) operator evaluates the specified property or
[alias](../concepts/definition-structure.md#aliases) to a provided value for a given
[condition](../concepts/definition-structure.md#conditions).

## Sample policy definition

This policy definition enables you to define allowed regions that meet your organization's
geo-location requirements. The allowed resources are defined in parameter **listOfAllowedLocations**
(_array_). Resources that match the definition are [denied](../concepts/effects.md#deny).

:::code language="json" source="~/policy-templates/patterns/pattern-fields.json":::

### Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-fields.json" range="18-36" highlight="3,7,11":::

The **field** operator is used three times within the
[logical operator](../concepts/definition-structure.md#logical-operators) **allOf**.

- The first use evaluates the `location` property with the **notIn** condition to the
  **listOfAllowedLocations** parameter. **notIn** works as it expects an _array_ and the parameter
  is an _array_. If the `location` of the created or updated resource isn't in the approved list,
  this element evaluates to true.
- The second use also evaluates the `location` property, but uses the **notEquals** condition to see
  if the resource is _global_. If the `location` of the created or updated resource isn't _global_,
  this element evaluates to true.
- The last use evaluates the `type` property and uses the **notEquals** condition to validate the
  resource type isn't _Microsoft.AzureActiveDirectory/b2cDirectories_. If it isn't, this element
  evaluates to true.

If all three condition statements in the **allOf** logical operator evaluate true, the resource
creation or update is blocked by Azure Policy.

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).