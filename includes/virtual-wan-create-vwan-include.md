---
ms.author: cherylmc
author: cherylmc
ms.date: 07/30/2021
ms.service: virtual-wan
ms.topic: include
---

From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. In the portal, in the **Search resources** bar, type **Virtual WAN** into the search box and select **Enter**.

1. Select **Virtual WANs** from the results. On the Virtual WANs page, select **+ Create** to open the Create WAN page.

1. On the **Create WAN** page, on the **Basics** tab, fill in the fields. You can modify the example values to apply to your environment.

   :::image type="content" source="./media/virtual-wan-create-vwan-include/basics.png" alt-text="Screenshot shows the Create WAN pane with the Basics tab selected.":::

   * **Subscription** - Select the subscription that you want to use.
   * **Resource group** - Create new or use existing.
   * **Resource group location** - Choose a resource location from the dropdown. A WAN is a global resource and does not live in a particular region. However, you must select a region in order to manage and locate the WAN resource that you create.
   * **Name** - Type the Name that you want to call your WAN.
   * **Type** - Basic or Standard. Select **Standard**. If you select Basic, understand that Basic virtual WANs can only contain Basic hubs. Basic hubs can only be used for site-to-site connections.

1. After you finish filling out the fields, at the bottom of the page, select **Review +Create**.

1. Once validation passes, select **Create** to create the virtual WAN.
