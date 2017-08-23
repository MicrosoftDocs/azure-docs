To create a VNet in the Resource Manager deployment model by using the Azure portal, follow the steps below. Use the [example values](#values) if you are using these steps as a tutorial. If you are not doing these steps as a tutorial, be sure to replace the values with your own. For more information about working with virtual networks, see the [Virtual Network Overview](../articles/virtual-network/virtual-networks-overview.md).

1. From a browser, navigate to the [Azure portal](http://portal.azure.com) and sign in with your Azure account.
2. Click **New**. In the **Search the marketplace** field, type 'Virtual Network'. Locate **Virtual Network** from the returned list and click to open the **Virtual Network** blade.
3. Near the bottom of the Virtual Network blade, from the **Select a deployment model** list, select **Resource Manager**, and then click **Create**. This opens the 'Create virtual network' blade.

    ![Create virtual network blade](./media/vpn-gateway-basic-vnet-s2s-rm-portal-include/createvnet.png "Create virtual network blade")
4. On the **Create virtual network** blade, configure the VNet settings. When you fill in the fields, the red exclamation mark becomes a green check mark when the characters entered in the field are valid.

  - **Name**: Enter the name for your virtual network. In this example, we use TestVNet1.
  - **Address space**: Enter the address space. If you have multiple address spaces to add, add your first address space. You can add additional address spaces later, after creating the VNet. Make sure that the address space that you specify does not overlap with the address space for your on-premises location.
  - **Subnet name**: Add the first subnet name and subnet address range. You can add additional subnets and the gateway subnet later, after creating this VNet. 
  - **Subscription**: Verify that the subscription listed is the correct one. You can change subscriptions by using the drop-down.
  - **Resource group**: Select an existing resource group, or create a new one by typing a name for your new resource group. If you are creating a new group, name the resource group according to your planned configuration values. For more information about resource groups, visit [Azure Resource Manager Overview](../articles/azure-resource-manager/resource-group-overview.md#resource-groups).
  - **Location**: Select the location for your VNet. The location determines where the resources that you deploy to this VNet will reside.

5. Select **Pin to dashboard** if you want to be able to find your VNet easily on the dashboard, and then click **Create**. After clicking **Create**, you will see a tile on your dashboard that will reflect the progress of your VNet. The tile changes as the VNet is being created.