---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 07/09/2020
 ms.author: cherylmc
 ms.custom: include file
---

From a browser, navigate to the Azure portal and sign in with your Azure account.

1. Navigate to the Virtual WAN page. In the portal, click **+Create a resource**. Type **Virtual WAN** into the search box and select Enter.
1. Select **Virtual WAN** from the results. On the Virtual WAN page, click **Create** to open the Create WAN page.
1. On the **Create WAN** page, on the **Basics** tab, fill in the following fields:

   :::image type="content" source="./media/virtual-wan-create-vwan-include/basics.png" alt-text="Screenshot shows the Create WAN pane with the Basics tab selected.":::

   * **Subscription** - Select the subscription that you want to use.
   * **Resource group** - Create new or use existing.
   * **Resource group location** - Choose a resource location from the dropdown. A WAN is a global resource and does not live in a particular region. However, you must select a region in order to more easily manage and locate the WAN resource that you create.
   * **Name** - Type the Name that you want to call your WAN.
   * **Type** - Basic or Standard. If you create a Basic WAN, you can create only a Basic hub. Basic hubs are capable of VPN site-to-site connectivity only.
1. After you finish filling out the fields, select **Review +Create**.
1. Once validation passes, select **Create** to create the virtual WAN.
