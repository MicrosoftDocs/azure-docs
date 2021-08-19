---
title: "Pattern: Using tags in a policy definition"
description: This Azure Policy pattern provides examples of how to add parameterized tags or inherit tags from a resource group in a policy definition.
ms.date: 08/17/2021
ms.topic: sample
---
# Azure Policy pattern: tags

[Tags](../../../azure-resource-manager/management/tag-resources.md) are an important part of
managing, organizing, and governing your Azure resources. Azure Policy makes it possible to
configure tags on your new and existing resources at scale with the
[modify](../concepts/effects.md#modify) effect and
[remediation tasks](../how-to/remediate-resources.md).

## Sample 1: Parameterize tags

This policy definition uses two parameters, **tagName** and **tagValue** to set what the policy
assignment is looking for on resource groups. This format allows the policy definition to be used
for any number of tag name and tag value combinations, but only maintain a single policy definition.

> [!NOTE]
> While this policy definition pattern is similar to the one in
> [Pattern: Parameters - Sample #1](./pattern-parameters.md#sample-1-string-parameters), this sample
> uses **mode** _All_ and targets resource groups.

:::code language="json" source="~/policy-templates/patterns/pattern-tags-1.json":::

### Sample 1: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-tags-1.json" range="2-8" highlight="3":::

In this sample, **mode** is set to _All_ since it targets a resource group. In most cases, **mode**
should be set to _Indexed_ when working with tags. For more information, see
[modes](../concepts/definition-structure.md#resource-manager-modes).

:::code language="json" source="~/policy-templates/patterns/pattern-tags-1.json" range="26-36" highlight="7-8":::

In this portion of the policy definition, `concat` combines the parameterized **tagName** parameter
and the `tags['name']` format to tell **field** to evaluate that tag for the parameter **tagValue**.
As **notEquals** is used, if **tags\[tagName\]** doesn't equal **tagValue**, the **modify** effect
is triggered.

:::code language="json" source="~/policy-templates/patterns/pattern-tags-1.json" range="43-47" highlight="3-4":::

Here, the same format for using the parameterized tag values is used by the **addOrReplace**
operation to create or update the tag to the desired value on the evaluated resource group.

## Sample 2: Inherit tag value from resource group

This policy definition uses the parameter **tagName** to determine which tag's value to inherit from
the parent resource group.

:::code language="json" source="~/policy-templates/patterns/pattern-tags-2.json":::

### Sample 2: Explanation

:::code language="json" source="~/policy-templates/patterns/pattern-tags-2.json" range="2-8" highlight="3":::

In this sample, **mode** is set to _Indexed_ since it doesn't target a resource group or
subscription even though it gets the value from a resource group. For more information, see
[modes](../concepts/definition-structure.md#resource-manager-modes).

:::code language="json" source="~/policy-templates/patterns/pattern-tags-2.json" range="19-29" highlight="3-4,7-8":::

The **policyRule.if** uses `concat` like [Sample #1](#sample-1-parameterize-tags) to evaluate the
**tagName**'s value, but uses the `resourceGroup()` function to compare it to the value of the same
tag on the parent resource group. The second clause here checks that the tag on the resource group
has a value and isn't null.

:::code language="json" source="~/policy-templates/patterns/pattern-tags-2.json" range="36-40" highlight="3-4":::

Here, the value being assigned to the **tagName** tag on the resource also uses the
`resourceGroup()` function to get the value from the parent resource group. In this way, you can
inherit tags from parent resource groups. If you already created the resource but didn't add the
tag, this same policy definition and a [remediation task](../how-to/remediate-resources.md) can
update existing resources.

## Next steps

- Review other [patterns and built-in definitions](./index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
