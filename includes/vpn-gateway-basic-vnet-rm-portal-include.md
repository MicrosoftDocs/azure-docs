---
author: cherylmc
ms.author: cherylmc
ms.service: vpn-gateway
ms.topic: include
ms.date: 08/08/2023
---

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In **Search resources, service, and docs (G+/)** at the top of the portal page, type ***virtual network***. Select **Virtual network** from the **Marketplace** results to open the **Virtual network** page.
1. On the **Virtual network** page, select **Create**. This opens the **Create virtual network** page.
1. On the **Basics** tab, configure the VNet settings for **Project details** and **Instance details**. You'll see a green check mark when the values you enter are validated. The values shown in the example can be adjusted according to the settings that you require.

   :::image type="content" source="./media/vpn-gateway-basic-vnet-rm-portal-include/basics.png" alt-text="Screenshot shows the Basics tab." lightbox="./media/vpn-gateway-basic-vnet-rm-portal-include/basics.png":::

   * **Subscription**: Verify that the subscription listed is the correct one. You can change subscriptions by using the drop-down.
   * **Resource group**: Select an existing resource group, or select **Create new** to create a new one. For more information about resource groups, see [Azure Resource Manager overview](../articles/azure-resource-manager/management/overview.md#resource-groups).
   * **Name**: Enter the name for your virtual network.
   * **Region**: Select the location for your VNet. The location determines where the resources that you deploy to this VNet will live.

1. Select **Next** or **Security** to advance to the Security tab. For this exercise, leave the default values for all the services on this page.

1. Select **IP Addresses** to advance to the IP Addresses tab. On the **IP Addresses** tab, configure the settings.

   * **IPv4 address space**: By default, an address space is automatically created. You can select the address space and adjust it to reflect your own values. You can also add a different address space and remove the default that was automatically created. For example, you can specify the starting address as **10.1.0.0** and specify the address space size as **/16**, then **Add** that address space.
   * **+ Add subnet**: If you use the default address space, a default subnet is created automatically. If you change the address space, add a new subnet within that address space. Select **+ Add subnet** to open the **Add subnet** window. Configure the following settings, then select **Add** at the bottom of the page to add the values.
      * **Subnet name**: Example: **FrontEnd**.
      * **Subnet address range**: The address range for this subnet. For example, **10.1.0.0** and **/24**.

1. Review the **IP addresses** page and remove any address spaces or subnets that you don't need.
1. Select **Review + create** to validate the virtual network settings.
1. After the settings have been validated, select **Create** to create the virtual network.
