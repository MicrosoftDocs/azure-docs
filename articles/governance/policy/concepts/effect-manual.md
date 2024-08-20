---
title: Azure Policy definitions manual effect
description: Azure Policy definitions manual effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions manual effect

The new `manual` effect enables you to self-attest the compliance of resources or scopes. Unlike other policy definitions that actively scan for evaluation, the Manual effect allows for manual changes to the compliance state. To change the compliance of a resource or scope targeted by a manual policy, you need to create an [attestation](attestation-structure.md). The [best practice](attestation-structure.md#best-practices) is to design manual policies that target the scope that defines the boundary of resources whose compliance need attesting.

> [!NOTE]
> Support for manual policy is available through various Microsoft Defender
> for Cloud regulatory compliance initiatives. If you are a Microsoft Defender for Cloud [Premium tier](https://azure.microsoft.com/pricing/details/defender-for-cloud/) customer, refer to their experience overview.

The following are examples of regulatory policy initiatives that include policy definitions with the `manual` effect:

- FedRAMP High
- FedRAMP Medium
- HIPAA
- HITRUST
- ISO 27001
- Microsoft CIS 1.3.0
- Microsoft CIS 1.4.0
- NIST SP 800-171 Rev. 2
- NIST SP 800-53 Rev. 4
- NIST SP 800-53 Rev. 5
- PCI DSS 3.2.1
- PCI DSS 4.0
- SWIFT CSP CSCF v2022

The following example targets Azure subscriptions and sets the initial compliance state to `Unknown`.

```json
{
  "if": {
    "field": "type",
    "equals": "Microsoft.Resources/subscriptions"
  },
  "then": {
    "effect": "manual",
    "details": {
      "defaultState": "Unknown"
    }
  }
}
```

The `defaultState` property has three possible values:

- `Unknown`: The initial, default state of the targeted resources.
- `Compliant`: Resource is compliant according to your manual policy standards
- `Non-compliant`: Resource is non-compliant according to your manual policy standards

The Azure Policy compliance engine evaluates all applicable resources to the default state specified in the definition (`Unknown` if not specified). An `Unknown` compliance state indicates that you must manually attest the resource compliance state. If the effect state is unspecified, it defaults to `Unknown`. The `Unknown` compliance state indicates that you must attest the compliance state yourself.

The following screenshot shows how a manual policy assignment with the `Unknown` state appears in the Azure portal:

:::image type="content" source="../media/effect-manual/manual-policy-portal.png" alt-text="Screenshot of Resource compliance table in the Azure portal that shows an assigned manual policy with a compliance reason of unknown.":::

When a policy definition with `manual` effect is assigned, you can set the compliance states of targeted resources or scopes through custom [attestations](attestation-structure.md). Attestations also allow you to provide optional supplemental information through the form of metadata and links to **evidence** that accompany the chosen compliance state. The person assigning the manual policy can recommend a default storage location for evidence by specifying the `evidenceStorages` property of the [policy assignment's metadata](../concepts/assignment-structure.md#metadata).


## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
