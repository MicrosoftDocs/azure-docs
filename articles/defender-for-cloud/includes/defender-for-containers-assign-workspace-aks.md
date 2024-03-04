---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 07/06/2022
ms.author: dacurwin
author: dcurwin
---

## Default Log Analytics workspace for AKS

The Log Analytics workspace is used by the Defender agent as a data pipeline to send data from the cluster to Defender for Cloud without retaining any data in the Log Analytics workspace itself. As a result, users won't be billed in this use case.

The Defender agent uses a default Log Analytics workspace. If you don't already have a default Log Analytics workspace, Defender for Cloud will create a new resource group and default workspace when the Defender agent is installed. The default workspace is created based on your [region](../faq-data-collection-agents.yml).

The naming convention for the default Log Analytics workspace and resource group is:

- **Workspace**: DefaultWorkspace-\[subscription-ID]-\[geo]
- **Resource Group**: DefaultResourceGroup-\[geo]

### Assign a custom workspace

When you enable the auto-provision option, a default workspace will be automatically assigned. You can assign a custom workspace through Azure Policy.

**To check if you have a workspace assigned**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Policy**.

    :::image type="content" source="../media/defender-for-containers/find-policy.png" alt-text="Screenshot that shows how to locate the policy page." lightbox="../media/defender-for-containers/find-policy.png":::

1. Select **Definitions**.

1. Search for policy ID `64def556-fbad-4622-930e-72d1d5589bf5`.

    :::image type="content" source="../media/defender-for-containers/policy-search-aks.png" alt-text="Screenshot that shows where to search for the policy by ID number." lightbox="../media/defender-for-containers/policy-search-aks.png":::

1. Select **Configure Azure Kubernetes Service clusters to enable Defender profile**.

1. Select **Assignment**.

    :::image type="content" source="../media/defender-for-containers/assignments-tab-aks.png" alt-text="Screenshot showing where to locate the assignments tab." lightbox="../media/defender-for-containers/assignments-tab-aks.png":::

1. Follow the [Create a new assignment with custom workspace](#create-a-new-assignment-with-custom-workspace) steps if the policy hasn't yet been assigned to the relevant scope. Or, follow the [Update assignment with custom workspace](#update-assignment-with-custom-workspace) steps if the policy is already assigned and you want to change it to use a custom workspace.

#### Create a new assignment with custom workspace

If the policy hasn't been assigned, you'll see `Assignments (0)`.

:::image type="content" source="../media/defender-for-containers/no-assignment.png" alt-text="Screenshot showing that no workspace has been assigned." lightbox="../media/defender-for-containers/no-assignment.png":::

**To assign custom workspace**:

1. Select **Assign**.

1. In the **Parameters** tab, deselect the **Only show parameters that need input or review** option.

1. Select a LogAnalyticsWorkspaceResource ID from the dropdown menu.

   :::image type="content" source="../media/defender-for-containers/drop-down-menu.png" alt-text="Screenshot showing where the dropdown menu is located." lightbox="../media/defender-for-containers/drop-down-menu.png":::

1. Select **Review + create**.

1. Select **Create**.

#### Update assignment with custom workspace

If the policy has already been assigned to a workspace, you'll see `Assignments (1)`.

:::image type="content" source="../media/defender-for-containers/already-assigned.png" alt-text="Screenshot that shows Assignment (1), meaning a workspace has already been assigned." lightbox="../media/defender-for-containers/already-assigned.png":::

> [!NOTE]
> If you have more than one subscription the number may be higher.

**To assign custom workspace**:

1. Select the relevant assignment.

    :::image type="content" source="../media/defender-for-containers/relevant-assignment.png" alt-text="Screenshot that shows where to select the relevant assignment from." lightbox="../media/defender-for-containers/relevant-assignment.png":::

1. Select **Edit assignment**.

1. In the **Parameters** tab, deselect the **Only show parameters that need input or review** option.

1. Select a LogAnalyticsWorkspaceResource ID from the dropdown menu.

   :::image type="content" source="../media/defender-for-containers/drop-down-menu.png" alt-text="Screenshot showing where the dropdown menu is located." lightbox="../media/defender-for-containers/drop-down-menu.png":::

1. Select **Review + save**.

1. Select **Save**.
