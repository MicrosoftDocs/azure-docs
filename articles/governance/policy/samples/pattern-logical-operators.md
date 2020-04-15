---
title: "Pattern: Logical operators in a policy definition"
description: This Azure Policy pattern provides examples of how to use the logical operators in a policy definition.
ms.date: 04/15/2020
ms.topic: sample
---
# Azure Policy pattern: logical operators

A policy definition can contain several conditional statements. You might need each statement to be
true or only need some of them to be true. To support these needs, the language has
[logical operators](../concepts/definition-structure.md#logical-operators) for **not**, **allOf**,
and **anyOf**. They're optional and can be nested to create complex scenarios.

## Sample 1: One logical operator

This policy definition evaluates CosmosDB accounts to see if automatic failovers and multiple write
locations are configured. When they aren't, the [audit](../concepts/effects.md#audit) triggers
and creates a log entry when the non-compliant resource is created or updated.

:::code language="json" source="~/policy-templates/patterns/pattern-logical-operators-1.json":::

### Sample 1: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-logical-operators-1.json" range="6-22" highlight="3":::

The **policyRule.if** block uses a single **allOf** to ensure that all three conditions are true.
Only when all of these conditions evaluate to true does the **audit** effect trigger.

## Sample 2: Multiple logical operators

This policy definition evaluates resources for a naming pattern. If a resource doesn't match, it's
[denied](../concepts/effects.md#deny).

:::code language="json" source="~/policy-templates/patterns/pattern-logical-operators-2.json":::

### Sample 2: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-logical-operators-2.json" range="7-21" highlight="2,3,9":::

This **policyRule.if** block also includes a single **allOf**, but each condition is wrapped with
the **not** logical operator. The conditional inside the **not** logical operator evaluates first
and then evaluates the **not** to determine if the entire clause is true or false. If both **not**
logical operators evaluate to true, the policy effect triggers.

## Sample 3: Combining logical operators

This policy definition evaluates Java Spring accounts to see if either trace isn't enabled or if
trace isn't in a successful state.

:::code language="json" source="~/policy-templates/patterns/pattern-logical-operators-3.json":::

### Sample 3: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-logical-operators-3.json" range="6-28" highlight="3,8":::

This **policyRule.if** block includes both the **allOf** and **anyOf** logical operators. The
**anyOf** logical operator evaluates true as long as one included condition is true. As the _type_
is at the core of the **allOf**, it must always evaluate true. If the _type_ and one of the
conditions in the **anyOf** are true, the policy effect triggers.

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).