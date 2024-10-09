---
title: Azure Policy definitions mutate (preview) effect
description: Azure Policy definitions mutate (preview) effect determines how compliance is managed and reported.
ms.date: 04/08/2024
ms.topic: conceptual
---

# Azure Policy definitions mutate (preview) effect

Mutation is used in Azure Policy for Kubernetes to remediate Azure Kubernetes Service (AKS) cluster components, like pods. This effect is specific to _Microsoft.Kubernetes.Data_ [policy mode](./definition-structure.md#resource-provider-modes) definitions only.

To learn more, go to [Understand Azure Policy for Kubernetes clusters](./policy-for-kubernetes.md).

## Mutate properties

- `mutationInfo` (optional)
  - Can't be used with `constraint`, `constraintTemplate`, `apiGroups`, or `kinds`.
  - Can't be parameterized.
  - `sourceType` (required)
    - Defines the type of source for the constraint. Allowed values: `PublicURL` or `Base64Encoded`.
    - If `PublicURL`, paired with property `url` to provide location of the mutation template. The location must be publicly accessible.
      > [!WARNING]
      > Don't use SAS URIs or tokens in `url` or anything else that could expose a secret.

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](definition-structure-basics.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review [Azure management groups](../../management-groups/overview.md).
