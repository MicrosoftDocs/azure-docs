---
title: Azure Policy definitions disabled effect
description: Azure Policy definitions disabled effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Disabled

The `disabled` effect is useful for testing situations or for when the policy definition has parameterized the effect. This flexibility makes it possible to disable a single assignment instead of disabling all of that policy's assignments.

> [!NOTE]
> Policy definitions that use the `disabled` effect have the default compliance state **Compliant** after assignment.

An alternative to the `disabled` effect is `enforcementMode`, which is set on the policy assignment. When `enforcementMode` is `disabled`, resources are still evaluated. Logging, such as Activity logs, and the policy effect don't occur. For more information, see [policy assignment - enforcement mode](./assignment-structure.md#enforcement-mode).

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
