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

Once the Defender profile/extension has been deployed, a default workspace will be automatically assigned because of the auto-provision option. You can assign a custom workspace through Azure Policy.

**To check if you have a workspace assigned**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Search for, and select **Policy**.

    :::image type="content" source="../media/defender-for-containers/find-policy.png" alt-text="Screenshot that shows how to locate the policy page for ARC." lightbox="../media/defender-for-containers/find-policy.png":::

1. Select **Definitions**.

1. Search for policy ID `708b60a6-d253-4fe0-9114-4be4c00f012c`.

    :::image type="content" source="../media/defender-for-containers/policy-search-arc.png" alt-text="Screenshot that shows where to search for the policy by I D number for ARC." lightbox="../media/defender-for-containers/policy-search-arc.png":::

1. Select **\[Preview]: Configure Azure Kubernetes Service clusters to enable Defender profile**.

1. Select **Assignment**.

1. Select the [No workspace assigned](#no-workspace-assigned) steps if you have no assigned workspace. Or, select the [Workspace already assigned](#workspace-already-assigned) steps if a workspace is already assigned.

#### No workspace assigned

If you have no workspace assigned, you will see `Assignments (0)`.

:::image type="content" source="../media/defender-for-containers/no-assignment-arc.png" alt-text="Screenshot showing that no workspace has been assigned for ARC.":::

**To assign custom workspace**:

1. Select **Assign**.

1. In the **Parameters** tab, deselect the **Only show parameters that need input or review** option.

1. Select a LogAnalyticsWorkspaceResource ID from the drop down menu.

   :::image type="content" source="../media/defender-for-containers/drop-down-menu-arc.png" alt-text="Screenshot showing where the drop down menu is located for ARC."::: 

1. Select **Review + create**.

1. Select **Create**.

#### Workspace already assigned

If it already assigned to a workspace you will see `Assignments (1)`. 

> [!NOTE]
> If you have more than one subscription the number may be higher

:::image type="content" source="../media/defender-for-containers/already-assigned-arc.png" alt-text="Screenshot that shows Assignment (1), meaning a workspace has already been assigned for ARC.":::

**To assign custom workspace**:

1. Select the relevant assignment.

    :::image type="content" source="../media/defender-for-containers/relevant-assignment-arc.png" alt-text="Screenshot that shows where to select the relevant assignment from for ARC.":::

1. Select **Edit assignment**.

1. In the **Parameters** tab, deselect the **Only show parameters that need input or review** option.

1. Select a LogAnalyticsWorkspaceResource ID from the drop down menu.

   :::image type="content" source="../media/defender-for-containers/drop-down-menu-arc.png" alt-text="Screenshot showing where the drop down menu is located for ARC."::: 

1. Select **Review + create**.

1. Select **Create**.
