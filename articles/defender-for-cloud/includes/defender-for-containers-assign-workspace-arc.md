---
author: ElazarK
ms.service: defender-for-cloud
ms.topic: include
ms.date: 06/15/2022
ms.author: elkrieger
---

## Default Log Analytics workspace for ARC

The Log Analytics workspace is used by the Defender profile/extension as a data pipeline to send data from the cluster to Defender for Cloud without retaining any data in the Log Analytics workspace itself. As a result, users will not be billed in this use case.

The Defender profile/extension uses a default Log Analytics workspace. If you do not already have a default Log Analytics workspace, Defender for Cloud will create a new resource group and default workspace when the Defender profile/extension is installed. The default workspace is created based on your [region](../faq-data-collection-agents.yml).

The naming convention for the default Log Analytics workspace and resource group is:
- **Workspace**: DefaultWorkspace-\[subscription-ID]-\[geo]
- **Resource Group**: DefaultResourceGroup-\[geo]

### Assign a custom workspace

Once the Defender profile/extension has been deployed, a default workspace will be automatically assigned. You can assign a custom workspace through Azure Policy.

**To assign custom workspace**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Search for, and select **Policy**.

    :::image type="content" source="../media/defender-for-containers/find-policy.png" alt-text="Screenshot that shows how to locate the policy page." lightbox="../media/defender-for-containers/find-policy.png":::

1. Select **Definitions**.

1. Search for policy ID `708b60a6-d253-4fe0-9114-4be4c00f012c`.

    :::image type="content" source="../media/defender-for-containers/policy-search-arc.png" alt-text="Screenshot that shows where to search for this policy by I D number." lightbox="../media/defender-for-containers/policy-search-arc.png":::

1. Select **\[Preview]: Configure Azure Kubernetes Service clusters to enable Defender profile**.

1. Select **Assign**.

1. In the **Parameters** tab, deselect the **Only show parameters that need input or review** option.

1. Enter `LogAnalyticsWorkspaceResource`.

1. Select **Review + create**.

1. Select **Create**.

If you already assigned the policy to a custom workspace you can change the assignment to your custom, or any other workspace.

**To change the assignment**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Search for, and select **Policy**.

1. Select **Assignments**.

1. Search for policy ID `708b60a6-d253-4fe0-9114-4be4c00f012c`.

    :::image type="content" source="../media/defender-for-containers/assigned-arc.png" alt-text="Screenshot that shows which workspaces has the policy assigned to them." lightbox="../media/defender-for-containers/assigned-arc.png":::

1. Select the relevant workspace.

1.  