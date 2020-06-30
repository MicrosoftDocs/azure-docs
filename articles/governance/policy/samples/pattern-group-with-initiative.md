---
title: "Pattern: Group policy definitions with initiatives"
description: This Azure Policy pattern provides an example of how to group policy definitions into an initiative
ms.date: 06/29/2020
ms.topic: sample
---
# Azure Policy pattern: group policy definitions

An initiative is a group of policy definitions. By grouping related policy definitions into a single
object, you can create a single assignment that would have been multiple assignments.

## Sample initiative definition

This initiative deploys two policy definitions, each of which takes the **tagName** and **tagValue**
parameters. The initiative itself has two parameters: **costCenterValue** and **productNameValue**.
These initiative parameters are each provided to each of the grouped policy definitions. This design
maximizes reuse of the existing policy definitions while limiting the number of assignments created
to implement them as needed.

:::code language="json" source="~/policy-templates/patterns/pattern-group-with-initiative.json":::

### Explanation

#### Initiative parameters

An initiative can define it's own parameters that are then passed to the grouped policy definitions.
In this example, both **costCenterValue** and **productNameValue** are defined as initiative
parameters. The values are provided when the initiative is assigned.

:::code language="json" source="~/policy-templates/patterns/pattern-group-with-initiative.json" range="5-18":::

#### Includes policy definitions

Each included policy definition must provide the **policyDefinitionId** and a **parameters** array
if the policy definition accepts parameters. In the snippet below, the included policy definition
takes two parameters: **tagName** and **tagValue**. **tagName** is defined with a literal, but
**tagValue** uses the parameter **costCenterValue** defined by the initiative. This passthrough of
values improves reuse.

:::code language="json" source="~/policy-templates/patterns/pattern-group-with-initiative.json" range="30-40":::

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).