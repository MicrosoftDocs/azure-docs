---
author: ElazarK
ms.service: defender-for-cloud
ms.topic: include
ms.date: 05/08/2022
ms.author: elkrieger
---

## Override the default workspace

Once the Defender profile has been deployed, a default workspace will be automatically assigned. You can override the default workspace through Azure Policy.

**To override the default workspace**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Search for, and select **Policy**.

    :::image type="content" source="../media/defender-for-containers/find-policy.png" alt-text="Screenshot that shows how to locate the policy page." lightbox="../media/defender-for-containers/find-policy.png":::

1. Select **Definitions**.

1. Search for policy ID `64def556-fbad-4622-930e-72d1d5589bf5`.

    :::image type="content" source="../media/defender-for-containers/policy-search.png" alt-text="Screenshot that shows where to search for the policy by ID number." lightbox="../media/defender-for-containers/policy-search.png":::

1. Select **\[Preview]: Configure Azure Kubernetes Service clusters to enable Defender profile**.

1. Select **Assign**.

1. In the **Parameters** tab, deselect the **Only show parameters that need input or review** option.

1. Enter `LogAnalyticsWorkspaceResource`.

1. Select **Review + create**.

1. Select **Create**.