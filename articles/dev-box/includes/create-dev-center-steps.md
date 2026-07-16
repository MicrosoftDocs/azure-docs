---
author: RoseHJM
ms.author: rosemalcolm
ms.date: 11/19/2025
ms.topic: include
ms.service: dev-box
---

1. In the [Azure portal](https://portal.azure.com), search for and then select **Dev centers**.
1. On the **Dev centers** page, select **Create**.

   :::image type="content" source="../media/create-dev-center-steps/create-dev-center.png" alt-text="Screenshot that shows the Azure portal with the Create button on the page for dev centers.":::

1. On the **Basics** tab of the **Create a dev center** screen, complete the following information:

   - **Subscription**: Select the subscription where you want to create the dev center.
   - **Resource group**: Select an existing resource group, or select **Create new** and enter a name for the new resource group.
   - **Name**: Enter a name for the dev center.
   - **Location**: Select the Azure region to create the dev center in. For a list of the currently supported Azure locations with capacity, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=dev-box).
   - **Attach the environment definition quick start catalog (recommended)**: Select to attach a quick start catalog of predefined environment configurations to the dev center. You can also create and attach your own catalogs.

1. Select **Review + Create**, or optionally select **Next: Settings** to configure more settings.

   :::image type="content" source="../media/create-dev-center-steps/create-dev-center-basics.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a dev center.":::

1. On the **Settings** tab of the **Create a dev center** screen, the following options are already enabled by default. Change this configuration if desired.

   - **Project level catalogs**. Resources from catalogs attached to a dev center are available to all projects within it. This option allows project admins to also attach project-level catalogs to provide customizations for different development teams.
   - **Microsoft hosted network in projects**. Lets project admins specify using [Microsoft-hosted networks](/windows-365/enterprise/deployment-options#microsoft-hosted-network) to host dev boxes in their projects. Microsoft-hosted networks offer network isolation, easy customization, and low administrative overhead. Projects in organizations that require customized networking should use [network connection resources](../how-to-configure-network-connections.md) instead.
   - **Azure Monitor Agent**. Configures all dev boxes in the dev center to automatically install the [Azure Monitor agent](/azure/azure-monitor/agents/azure-monitor-agent-overview). The agent collects monitoring data from the dev box and sends it to Azure Monitor.

1. Select **Review + Create** or optionally select **Next: Tags** to assign tags.

1. On the **Tags** tab, enter any name-value tags that you want to assign to resources in the dev center, and then select **Review + Create**.

1. Select **Create**.

1. Track the progress of the dev center creation in the **Notifications** pane.

   :::image type="content" source="../media/create-dev-center-steps/notifications-pane.png" alt-text="Screenshot that shows the Notifications pane in the Azure portal.":::

1. When the deployment completes, select **Go to resource** and confirm that the dev center page appears.