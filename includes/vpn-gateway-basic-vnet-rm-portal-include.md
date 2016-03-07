To create a VNet based on the scenario above by using the Azure portal, follow the steps below. If are doing these steps as an exercise, be sure to replace the values with those that are specified for this article. The values below don't necessarily match the steps for this exercise.

1. From a browser, navigate to the [Azure Portal](http://portal.azure.com) and, if necessary, sign in with your Azure account.

2. Click **NEW** > **Networking** > **Virtual network**, then click **Resource Manager** from the **Select a deployment model** list, and then click **Create**.

3. On the **Create virtual network** blade, configure the VNet settings as shown in the figure below.

	![Create virtual network blade](./media/vpn-gateway-create-vnet-arm-pportal-include/vnet-create-arm-pportal-figure2.png)

4. Click **Resource group** and select a resource group to add the VNet to, or click **Create new** to add the VNet to a new resource group. In the example below, the  new resource group is called **TestRG**. For more information about resource groups, visit [Azure Resource Manager Overview](resource-group-overview.md/#resource-groups).

	![Resource group](./media/vpn-gateway-create-vnet-arm-pportal-include/vnet-create-arm-pportal-figure3.png)

5. If necessary, change the **Subscription** and **Location** settings for your VNet. 

6. Click **Create** and notice the tile named **Creating Virtual network** as shown in the figure below.

	![Creating virtual network tile](./media/vpn-gateway-create-vnet-arm-pportal-include/vnet-create-arm-pportal-figure4.png)

7. Wait for the VNet to be created, then in the **Virtual network** blade, click **All settings** > **Subnets** > **Add**.

8. Specify the subnet settings for any additional subnets. In this example we are adding the  *BackEnd* subnet. Click **OK**. 

	![Subnet settings](./media/vpn-gateway-create-vnet-arm-pportal-include/vnet-create-arm-pportal-figure6.png)

9. View the list of subnets.

	![List of subnets in VNet](./media/vpn-gateway-create-vnet-arm-pportal-include/vnet-create-arm-pportal-figure7.png)