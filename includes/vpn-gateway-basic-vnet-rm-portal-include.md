---
author: cherylmc
ms.author: cherylmc
ms.service: vpn-gateway
ms.topic: include
ms.date: 04/16/2024
---

1. Sign in to the Azure portal.
1. In **Search resources, service, and docs (G+/)** at the top of the portal page, enter **virtual network**. Select **Virtual network** from the **Marketplace** search results to open the **Virtual network** page.
1. On the **Virtual network** page, select **Create** to open the **Create virtual network** page.
1. On the **Basics** tab, configure the virtual network settings for **Project details** and **Instance details**. You see a green check mark when the values you enter are validated. You can adjust the values shown in the example according to the settings that you require.

   :::image type="content" source="./media/vpn-gateway-basic-vnet-rm-portal-include/basics.png" alt-text="Screenshot that shows the Basics tab." lightbox="./media/vpn-gateway-basic-vnet-rm-portal-include/basics.png":::

   * **Subscription**: Verify that the subscription listed is the correct one. You can change subscriptions by using the dropdown box.
   * **Resource group**: Select an existing resource group or select **Create new** to create a new one. For more information about resource groups, see [Azure Resource Manager overview](../articles/azure-resource-manager/management/overview.md#resource-groups).
   * **Name**: Enter the name for your virtual network.
   * **Region**: Select the location for your virtual network. The location determines where the resources that you deploy to this virtual network will reside.

1. Select **Next** or **Security** to go to the **Security** tab. For this exercise, leave the default values for all the services on this page.

1. Select **IP Addresses** to go to the **IP Addresses** tab. On the **IP Addresses** tab, configure the settings.

   * **IPv4 address space**: By default, an address space is automatically created. You can select the address space and adjust it to reflect your own values. You can also add a different address space and remove the default that was automatically created. For example, you can specify the starting address as **10.1.0.0** and specify the address space size as **/16**. Then select **Add** to add that address space.
   * **+ Add subnet**: If you use the default address space, a default subnet is created automatically. If you change the address space, add a new subnet within that address space. Select **+ Add subnet** to open the **Add subnet** window. Configure the following settings, and then select **Add** at the bottom of the page to add the values.

     * **Subnet name**: An example is **FrontEnd**.
     * **Subnet address range**: The address range for this subnet. Examples are **10.1.0.0** and **/24**.

1. Review the **IP addresses** page and remove any address spaces or subnets that you don't need.
1. Select **Review + create** to validate the virtual network settings.
1. After the settings are validated, select **Create** to create the virtual network.
