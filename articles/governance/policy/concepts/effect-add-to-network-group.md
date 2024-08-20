---
title: Azure Policy definitions addToNetworkGroup effect
description: Azure Policy definitions addToNetworkGroup effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions addToNetworkGroup effect

The `addToNetworkGroup` effect is used in Azure Virtual Network Manager to define dynamic network group membership. This effect is specific to `Microsoft.Network.Data` [policy mode](./definition-structure.md#resource-provider-modes) definitions only.

With network groups, your policy definition includes your conditional expression for matching virtual networks meeting your criteria, and specifies the destination network group where any matching resources are placed. The `addToNetworkGroup` effect is used to place resources in the destination network group.

To learn more, go to [Configuring Azure Policy with network groups in Azure Virtual Network Manager](../../../virtual-network-manager/concept-azure-policy-integration.md).

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
