To create a VNet based on the scenario above by using the Azure portal, follow the steps below. If are doing these steps as an exercise, be sure to replace the values with those that are specified for this article. The values below don't necessarily match the steps for this exercise. For more information about working with virtual networks, see the [Virtual Network Overview](../articles/virtual-network/virtual-networks-overview.md).

1. From a browser, navigate to the [Azure portal](http://portal.azure.com) and, if necessary, sign in with your Azure account.

2. Click **New** **>** **Networking** **>** **Virtual Network**.

	![VNetBlade](./media/vpn-gateway-create-vnet-arm-pportal-include/newvnet650.png)

3. Near the bottom of the Virtual Network blade, from the **Select a deployment model** list, select **Resource Manager**, and then click **Create**.

	![resourcegroup](./media/vpn-gateway-create-vnet-arm-pportal-include/resourcegroup200.png)

4. On the **Create virtual network** blade, configure the VNet settings. In this blade, you'll add your first address space and a single subnet address range. After you finish creating the VNet, you can go back and add additional subnets and address spaces. This is a current limitation of the portal. The values that you use will depend on the configuration you want to create. Be sure to refer to your planned configuration values. 

	![Create virtual network blade](./media/vpn-gateway-create-vnet-arm-pportal-include/createvnet250.png)

5. Verify that the **Subscription** is the correct one. You can change subscriptions by using the dropdown.

6. Click **Resource group** and either select an existing resource group, or create a new one by typing a name for your new resource group. If you are creating a new group, name the resource group according to your planned configuration values. For more information about resource groups, visit [Azure Resource Manager Overview](resource-group-overview.md/#resource-groups).

7. Next, select the **Location** settings for your VNet. Note that the location will determine where the resources that you deploy to this VNet will reside. You can't change this later without redeploying your resources.

8. Select **Pin to dashboard** if you want to be able to find your VNet easily on the dashboard, and then click **Create**.
	
	![Pin to dashboard](./media/vpn-gateway-create-vnet-arm-pportal-include/pintodash150.png)


9. After clicking Create, you will see a tile on your dashboard that will reflect the progress of your VNet. The tile will change as the VNet is being created.

	![Creating virtual network tile](./media/vpn-gateway-create-vnet-arm-pportal-include/submitvnet150.png)

10. Once your VNet has been created, you can make changes to it such as adding additional address space, subnets, and DNS servers.

## Add additional address space and subnets to your VNet

1. To add additional address space to your VNet, on the blade for your VNet, click **All settings** to open the Settings blade. On the **Settings** blade, click **Address space** to open the Address space blade. Add the additional address space in this blade, and then click **Save** at the top of the blade.

	![Add address space](./media/vpn-gateway-create-vnet-arm-pportal-include/addaddress400.png)

	![Add address space](./media/vpn-gateway-create-vnet-arm-pportal-include/address400.png)




2. To add additional subnets to your address spaces, in the **Settings** blade, click **Subnets** to open the Subnets blade. In the Subnets blade, click **Add** to open the **Add subnet** blade. Name your new subnet and specify the address range, and then click **OK** at the bottom of the blade. Once a subnet has been created, you can use the subnets blade to view all of your subnets for a VNet.

	![Subnet settings](./media/vpn-gateway-create-vnet-arm-pportal-include/addsubnet250.png)

	![Subnet settings](./media/vpn-gateway-create-vnet-arm-pportal-include/addsub2250.png)		
