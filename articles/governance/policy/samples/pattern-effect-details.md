---
title: "Pattern: Effects of a policy definition"
description: This Azure Policy pattern provides example of how to use the different effects of a policy definition.
ms.date: 06/29/2020
ms.topic: sample
---
# Azure Policy pattern: effects

Azure Policy has a number of [effects](../concepts/effects.md) that determine how the service reacts
to non-compliant resources. Some effects are simple and require no additional properties in the
policy definition while others require several properties.

## Sample 1: Simple effect

This policy definition checks to see if the tag defined in parameter **tagName** exists on the
evaluated resource. If the tag doesn't yet exist, the [modify](../concepts/effects.md#modify) effect
is triggered to add the tag with the value in parameter **tagValue**.

:::code language="json" source="~/policy-templates/patterns/pattern-effect-details-1.json":::

### Sample 1: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-effect-details-1.json" range="40-50":::

A **modify** effect requires the **policyRule.then.details** block that defines
**roleDefinitionIds** and **operations**. These parameters inform Azure Policy what roles are needed
to add the tag and remediate the resource and which **modify** operation to perform. In this
example, the **operation** is _add_ and the parameters are used to set the tag and its value.

## Sample 2: Complex effect

This policy definition audits each virtual machine for when an extension, defined in parameters
**publisher** and **type**, doesn't exist. It uses
[auditIfNotExists](../concepts/effects.md#auditifnotexists) to check a resource related to the
virtual machine to see if an instance exists that matches the defined parameters. This example
checks the **extensions** type.

:::code language="json" source="~/policy-templates/patterns/pattern-effect-details-2.json":::

### Sample 2: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-effect-details-2.json" range="45-58":::

An **auditIfNotExists** effect requires the **policyRule.then.details** block to define both a
**type** and the **existenceCondition** to look for. The **existenceCondition** uses policy language
elements, such as [logical operators](../concepts/definition-structure.md#logical-operators), to
determine if a matching related resource exists. In this example, the values checked against each
[alias](../concepts/definition-structure.md#aliases) are defined in parameters.

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).