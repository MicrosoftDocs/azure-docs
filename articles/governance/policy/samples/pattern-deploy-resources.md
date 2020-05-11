---
title: "Pattern: Deploy resources with a policy definition"
description: This Azure Policy pattern provides an example of how to deploy resources with a policy definition.
ms.date: 01/31/2020
ms.topic: sample
---
# Azure Policy pattern: deploy resources

The [deployIfNotExists](../concepts/effects.md#deployifnotexists) effect makes it possible to deploy
an [Azure Resource Manager template](../../../azure-resource-manager/templates/overview.md) when
creating or updating a resource that isn't compliant. This approach can be preferred to using the
[deny](../concepts/effects.md#deny) effect as it lets resources continue to be created, but ensures
the changes are made to make them compliant.

## Sample policy definition

This policy definition uses the **field** operator to evaluate the `type` of resource created or
updated. When that resource is a _Microsoft.Network/virtualNetworks_, the policy looks for a network
watcher in the location of the new or updated resource. If a matching network watcher isn't located,
the Resource Manager template is deployed to create the missing resource.

:::code language="json" source="~/policy-templates/patterns/pattern-deploy-resources.json":::

### Explanation

#### existenceCondition

:::code language="json" source="~/policy-templates/patterns/pattern-deploy-resources.json" range="18-23":::

The **properties.policyRule.then.details** block tells Azure Policy what to look for related to the
created or updated resource in the **properties.policyRule.if** block. In this example, a network
watcher in the resource group **networkWatcherRG** must exist with **field** `location` equal to the
location of the new or updated resource. Using the `field()` function allows the
**existenceCondition** to access properties on the new or updated resource, specifically the
`location` property.

#### roleDefinitionIds

:::code language="json" source="~/policy-templates/patterns/pattern-deploy-resources.json" range="24-26":::

The **roleDefinitionIds** _array_ property in the **properties.policyRule.then.details** block tells
the policy definition which rights the managed identity needs to deploy the included Resource
Manager template. This property must be set to include roles that have the permissions needed by the
template deployment, but should use the concept of 'principle of least privilege' and only have the
needed operations and nothing more.

#### Deployment template

The **deployment** portion of the policy definition has a **properties** block that defines the
three core components:

- **mode** - This property sets the
  [deployment mode](../../../azure-resource-manager/templates/deployment-modes.md) of the template.

- **template** - This property includes the template itself. In this example, the **location**
  template parameter sets the location of the new network watcher resource.

  :::code language="json" source="~/policy-templates/patterns/pattern-deploy-resources.json" range="30-44":::
  
- **parameters** - This property defines parameters that are provided to the **template**. The
  parameter names must match what are defined in **template**. In this example, the parameter is
  named **location** to match. The value of **location** uses the `field()` function again to get
  the value of the evaluated resource, which is the virtual network in the **policyRule.if** block.

  :::code language="json" source="~/policy-templates/patterns/pattern-deploy-resources.json" range="45-49":::

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).