---
title: Regulatory Compliance in initiative definitions
description: Describes how to use an initiative definition to group policies by regulatory domain such as Access Control, Configuration Management, and others.
ms.date: 05/11/2020
ms.topic: conceptual
---
# Regulatory Compliance in Azure Policy

Regulatory Compliance in Azure Policy provides built-in initiative definitions to view a list of the
**controls** and **compliance domains** based on responsibility (_Customer_, _Microsoft_, _Shared_).
For Microsoft-responsible controls, we provide additional details of our audit results based on
third-party attestation and our implementation details to achieve that compliance.
Microsoft-responsible controls are of `type` [static](./definition-structure.md#type).

> [!NOTE]
> Regulatory Compliance is a Preview feature. For updated built-ins, the initiatives
> controls map to the corresponding compliance standard. Existing compliance standard initiatives
> are in the process of being updated to support Regulatory Compliance.

## Regulatory Compliance defined

Regulatory Compliance is built on the
[grouping](./initiative-definition-structure.md#policy-definition-groups) portion of an initiative
definition. In built-ins, each grouping in the initiative definition defines a name (**control**), a
category (**compliance domain**), and provides a reference to the
[policyMetadata](./initiative-definition-structure.md#metadata-objects) object that has information
about that **control**. A Regulatory Compliance initiative definition must have the `category`
property set to **Regulatory Compliance**. As an otherwise standard initiative definition,
Regulatory Compliance initiatives support
[parameters](./initiative-definition-structure.md#parameters) to create dynamic assignments.

Customers can create their own Regulatory Compliance initiatives. These definitions can be original
or copied from existing built-in definitions. If using a built-in Regulatory Compliance initiative
definition as a reference, it's recommended to monitor the source of the Regulatory Compliance
definitions in the
[Azure Policy GitHub repo](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance).

To link a custom Regulatory Compliance initiative to your Azure Security Center dashboard, see
[Azure Security Center - Using custom security policies](../../../security-center/custom-security-policies.md).

## Regulatory Compliance in portal

When an initiative definition has been created with
[groups](./initiative-definition-structure.md#policy-definition-groups), the **Compliance** details
page in portal for that initiative has additional information. 

A new tab, **Controls** is added to the page. Filtering is available by **compliance domain** and
policy definitions are grouped by the `title` field from the **policyMetadata** object. Each row
represents a **control** that shows its compliance state, the **compliance domain** it's part of,
responsibility information, and how many non-compliant and compliant policy definitions make up that
**control**.

:::image type="content" source="../media/regulatory-compliance/regulatory-compliance-overview.png" alt-text="A sample of the Regulatory Compliance overview for the NIST SP 800-53 R4 built-in definition.":::

Selecting a **control** opens a page of details about that control. The **Overview** contains the
information from `description` and `requirements`. Under the **Policies** tab are all the individual
policy definitions in the initiative that contribute to this **control**. The **Resource
compliance** tab provides a granular view of each resource that's evaluated by a member policy of
the currently viewed **control**.

> [!NOTE]
> An evaluation type of **Microsoft managed** is for a [static](./definition-structure.md#type)
> policy definition `type`.

:::image type="content" source="../media/regulatory-compliance/regulatory-compliance-policies.png" alt-text="A sample of the Regulatory Compliance policy definitions in the Boundary Protection control of the System and Communications Protection domain of the NIST SP 800-53 R4 built-in definition.":::

From the same **control** page, changing to the **Resource compliance** tab shows all resources this
**control**'s policy definitions include. Filters are available for name or ID, compliance state,
resource type, and location.

:::image type="content" source="../media/regulatory-compliance/regulatory-compliance-resources.png" alt-text="A sample of the Regulatory Compliance resources impacted by policy definitions in the Boundary Protection control of the System and Communications Protection domain of the NIST SP 800-53 R4 built-in definition.":::

## Regulatory Compliance in SDK

If Regulatory Compliance is enabled on an initiative definition, the evaluation scan record, events,
and policy states SDK each return additional properties. These additional properties are grouped by
compliance state and provide information on how many groups are in each state.

The following code is an example of added results from a `summarize` call:

```json
"policyGroupDetails": [{
        "complianceState": "noncompliant",
        "count": 4
    },
    {
        "complianceState": "compliant",
        "count": 76
    }
]
```

## Next steps

- See the [initiative definition structure](./initiative-definition-structure.md)
- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](./effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
