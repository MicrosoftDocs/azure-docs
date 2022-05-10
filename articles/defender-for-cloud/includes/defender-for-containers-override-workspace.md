---
author: ElazarK
ms.service: defender-for-cloud
ms.topic: include
ms.date: 05/10/2022
ms.author: elkrieger
---

## Learn about the default workspace

The Log Analytics workspace is used as a data pipeline to send data from the Defender profile/extension to Defender for Cloud without retaining any data in the Log Analytics workspace itself. As a result, users will not be billed in this use case.

When you enable the plan through the Azure Portal, [Microsoft Defender for Containers](../defender-for-containers-introduction.md) is configured to auto provision (automatically install) required components to provide the protections offered by plan, including the assignment of a default workspace. You can [override the default workspace](/azure/defender-for-cloud/defender-for-containers-enable?tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-aks) through Azure Policy.

The Defender profile/extension uses a default Log Analytics workspace. If you do not already have a default Log Analytics workspace, Defender for Cloud will creates a new resource group and default workspace when the Defender for Containers plan is enabled. The default workspace is created based on your [region](../faq-data-collection-agents.yml), and connects the Defender profile/extension to that workspace.

The naming convention for the default Log Analytics workspace and resource group is:
- **Workspace**: DefaultWorkspace-\[subscription-ID]-\[geo]
- **Resource Group**: DefaultResourceGroup-\[geo]

### Override the default workspace

Once the Defender profile/extension has been deployed, a default workspace will be automatically assigned. You can override the default workspace through Azure Policy.

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