---
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/14/2024
ms.topic: include
ms.service: dev-box
---

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

   :::image type="content" source="../media/create-dev-center-steps/discover-dev-centers.png" alt-text="Screenshot that shows the Azure portal with the search box and the result for dev centers." lightbox="../media/create-dev-center-steps/discover-dev-centers.png":::

1. On the **Dev centers** page, select **Create**.

   :::image type="content" source="../media/create-dev-center-steps/create-dev-center.png" alt-text="Screenshot that shows the Azure portal with the Create button on the page for dev centers." lightbox="../media/create-dev-center-steps/create-dev-center.png":::

1. On the **Create a dev center** pane, on the **Basics** tab, enter the following values:

   | Setting | Value |
   |---|---|
   | **Subscription** | Select the subscription in which you want to create the dev center. |
   | **Resource Group** | Select an existing resource group, or select **Create new** and then enter a name for the new resource group. |
   | **Name** | Enter a name for your dev center. |
   | **Location** | Select the location or region where you want the dev center to be created. |
   | **Attach a quick start catalog** | Clear both checkboxes. |

   :::image type="content" source="../media/create-dev-center-steps/create-dev-center-basics.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a dev center." lightbox="../media/create-dev-center-steps/create-dev-center-basics.png":::

   The Dev Box quick start catalog contains tasks and scripts that you can use to configure your dev box during the final stage of the creation process. You can attach a quick start catalog to a dev center later. For more information, see [Create reusable dev box customizations](../how-to-customize-dev-box-setup-tasks.md).

   For a list of the currently supported Azure locations with capacity, see [Frequently asked questions about Microsoft Dev Box](https://aka.ms/devbox_acom).

1. On the **Settings** tab, enter the following values:

   | Setting | Value | Description |
   |---|---|---|
   | **Project level catalog** | Select to enable Project Admins to attach catalogs to projects. | Project-level catalogs enable you to provide customizations for each development team. |
   | **Allow Microsoft hosted network in projects** | Select to enable Project Admins to specify that dev boxes created from a pool deploy to a Microsoft-hosted network.  | [Microsoft-hosted networks](/windows-365/enterprise/deployment-options#microsoft-hosted-network) are isolated networks managed by Microsoft. Using a Microsoft hosted network can reduce administrative overhead.   |
   | **Azure Monitor Agent** | Select to enable all dev boxes in the dev center to install the Azure Monitor Agent. | The [Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-overview) collects monitoring data from the dev box and sends it to Azure Monitor. |

   :::image type="content" source="../media/create-dev-center-steps/create-dev-center-settings.png" alt-text="Screenshot that shows the Settings tab on the pane for creating a dev center." lightbox="../media/create-dev-center-steps/create-dev-center-settings.png":::

1. (Optional) On the **Tags** tab, enter a name/value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Track the progress of the dev center creation from any page in the Azure portal by opening the **Notifications** pane.

   :::image type="content" source="../media/create-dev-center-steps/notifications-pane.png" alt-text="Screenshot that shows the Notifications pane in the Azure portal." lightbox="../media/create-dev-center-steps/notifications-pane.png":::

1. When the deployment completes, select **Go to resource**. Confirm that the dev center page appears.