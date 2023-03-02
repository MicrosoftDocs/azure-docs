---
title: "Pattern: The count operator in a policy definition"
description: This Azure Policy pattern provides an example of how to use the count operator in a policy definition.
ms.date: 08/17/2021
ms.topic: sample
---
# Azure Policy pattern: the count operator

The [count](../concepts/definition-structure.md#count) operator evaluates members of a \[\*\] alias.

## Sample policy definition

This policy definition [audits](../concepts/effects.md#audit) Network Security Groups configured to
allow inbound Remote Desktop Protocol (RDP) traffic.

:::code language="json" source="~/policy-templates/patterns/pattern-count-operator.json":::

### Explanation

The core components of the **count** operator are _field_, _where_, and the condition. Each is
highlighted in the following snippet.

- _field_ tells count which [alias](../concepts/definition-structure.md#aliases) to evaluate members
  of. Here, we're looking at the **securityRules\[\*\]** alias _array_ of the network security
  group.
- _where_ uses the policy language to define which _array_ members meet the criteria. In this
  example, an **allOf** logical operator groups three different condition evaluations of alias
  _array_ properties: _direction_, _access_, and _destinationPortRange_.
- The count condition in this example is **greater**. Count evaluates as true when one or more
  members of the alias _array_ matches the _where_ clause.

:::code language="json" source="~/policy-templates/patterns/pattern-count-operator.json" range="12-32" highlight="3,4,20":::

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
