## How to create VNet Peering in Azure portal

To create a VNet peering based on the scenario above by using the Azure portal, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.
2. To establish VNET peering, you need to create two links, one for each direction, between two VNets. You can create VNET peering link for VNET1 to VNET2 first. On the portal, 
Click **Browse** > **choose Virtual Networks** 

	![Create VNet peering in Azure portal](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure01.png)

3. In Virtual Networks blade, choose VNET1, click Peerings, then click Add

	![Choose peering](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure02.png)

4. In the Add Peering blade, give a peering link name LinkToVnet2, choose the subscription and the peer Virtual Network VNET2, click OK.

	![Link to VNet](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure03.png)

5. Once this VNET peering link is created. You can see the link state as following:

	![Link State](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure04.png)

6. Next create the VNET peering link for VNET2 to VNET1. In Virtual Networks blade, choose VNET2, click Peerings, then click Add 

	![Peer from other VNet](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure05.png)

7. In the Add Peering blade, give a peering link name LinkToVnet1, choose the subscription and the peer Virtual Network, Click OK.

	![Creating virtual network tile](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure06.png)

8. Once this VNET peering link is created. You can see the link state as following:

	![Final link state](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure07.png)

9. Check the state for LinkToVnet2 and it now changes to Connected as well.  

	![Final link state 2](./media/virtual-networks-create-vnetpeering-arm-pportal-include/figure08.png)

10. NOTE: VNET peering is only established if both links are connected. 

