<properties 
   pageTitle="Manage NSGs using PowerShell in the classic deployment model | Microsoft Azure"
   description="Learn how to manage exising NSGs using PowerShell in the classic deployment model"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/14/2016"
   ms.author="telmos" />

# Manage NSGs (classic) using PowerShell

[AZURE.INCLUDE [virtual-network-manage-classic-selectors-include.md](../../includes/virtual-network-manage-nsg-classic-selectors-include.md)]

[AZURE.INCLUDE [virtual-network-manage-nsg-intro-include.md](../../includes/virtual-network-manage-nsg-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](virtual-network-manage-ps.md).

[AZURE.INCLUDE [virtual-network-manage-nsg-classic-scenario-include.md](../../includes/virtual-network-manage-nsg-classic-scenario-include.md)]

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

## Retrieve Information

You can view your existing NSGs, retrieve rules for an existing NSG, and find out what resources an NSG is associated to.

### View existing NSGs
To view all existing NSGs in a subscription, run the `Get-AzureNetworkSecurityGroup` cmdlet as shown below.

	Get-AzureNetworkSecurityGroup

Expected result:

	Name         Location   Label               
	----         --------   -----               
	NSG-BackEnd  Central US Back end subnet NSG                    
	NSG-FrontEnd Central US Front end subnet NSG
		 
### List all rules for an NSG

To view the rules of an NSG named **NSG-FrontEnd**, run the `Get-AzureNetworkSecurityGroup` cmdlet as shown below. 

	Get-AzureNetworkSecurityGroup -Name NSG-FrontEnd -Detailed

Expected output:
	
	Name     : NSG-FrontEnd
	Location : Central US
	Label    : Front end subnet NSG
	Rules    : 
	           
	              Type: Inbound
	           
	           Name                 Priority  Action   Source Address  Source Port   Destination      Destination    Protocol
	                                                   Prefix          Range         Address Prefix   Port Range             
	           ----                 --------  ------   --------------- ------------- ---------------- -------------- --------
	           rdp-rule             100       Allow    INTERNET        *             *                3389           TCP     
	           web-rule             200       Allow    INTERNET        *             *                80             TCP     
	           ALLOW VNET INBOUND   65000     Allow    VIRTUAL_NETWORK *             VIRTUAL_NETWORK  *              *       
	           ALLOW AZURE LOAD     65001     Allow    AZURE_LOADBALAN *             *                *              *       
	           BALANCER INBOUND                        CER                                                                   
	           DENY ALL INBOUND     65500     Deny     *               *             *                *              *       
	           
	           
	              Type: Outbound
	           
	           Name                 Priority  Action   Source Address  Source Port   Destination      Destination    Protocol
	                                                   Prefix          Range         Address Prefix   Port Range             
	           ----                 --------  ------   --------------- ------------- ---------------- -------------- --------
	           ALLOW VNET OUTBOUND  65000     Allow    VIRTUAL_NETWORK *             VIRTUAL_NETWORK  *              *       
	           ALLOW INTERNET       65001     Allow    *               *             INTERNET         *              *       
	           OUTBOUND                                                                                                      
	           DENY ALL OUTBOUND    65500     Deny     *               *             *                *              *

### View NSGs associations

To view what resources the **NSG-FrontEnd** NSG is associate with, run the `Get-AzureRmNetworkSecurityGroup` cmdlet as shown below.

	Get-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG -Name NSG-FrontEnd

Look for the **NetworkInterfaces** and **Subnets** properties as shown below:

	NetworkInterfaces    : []
	Subnets              : [
	                         {
	                           "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
	                           "IpConfigurations": []
	                         }
	                       ]

In the example above, the NSG is not associated to any network interfaces (NICs), and it is associated to a subnet named **FrontEnd**.

## Manage rules

You can add rules to an existing NSG, edit existing rules, and remove rules.

### Add a rule

To add a rule allowing **inbound** traffic to port **443** from any machine to the **NSG-FrontEnd** NSG, follow the steps below.

1. Run the `Get-AzureRmNetworkSecurityGroup` cmdlet to retrieve the existing NSG and store it in a variable, as shown below.

		$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG `
		    -Name NSG-FrontEnd

2. Run the `Add-AzureRmNetworkSecurityRuleConfig` cmdlet, as shown below.

		Add-AzureRmNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg `
		    -Name https-rule `
		    -Description "Allow HTTPS" `
		    -Access Allow `
		    -Protocol Tcp `
		    -Direction Inbound `
		    -Priority 102 `
		    -SourceAddressPrefix * `
		    -SourcePortRange * `
		    -DestinationAddressPrefix * `
		    -DestinationPortRange 443

3. To save the changes made to the NSG, run the `Set-AzureRmNetworkSecurityGroup` cmdlet as shown below.

		Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $nsg

	Expected output showing only the security rules:

		Name                 : NSG-FrontEnd
		...
		SecurityRules        : [
		                         {
		                           "Name": "rdp-rule",
		                           ...
		                         },
		                         {
		                           "Name": "web-rule",
		                           ...
		                         },
		                         {
		                           "Name": "https-rule",
		                           "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
		                           "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd/securityRules/https-rule",
		                           "Description": "Allow HTTPS",
		                           "Protocol": "Tcp",
		                           "SourcePortRange": "*",
		                           "DestinationPortRange": "443",
		                           "SourceAddressPrefix": "*",
		                           "DestinationAddressPrefix": "*",
		                           "Access": "Allow",
		                           "Priority": 102,
		                           "Direction": "Inbound",
		                           "ProvisioningState": "Succeeded"
		                         }
		                       ]

### Change a rule

To change the rule created above to allow inbound traffic from the **Internet** only, follow the steps below.

1. Run the `Get-AzureRmNetworkSecurityGroup` cmdlet to retrieve the existing NSG and store it in a variable, as shown below.

		$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG `
		    -Name NSG-FrontEnd

2. Run the `Set-AzureRmNetworkSecurityRuleConfig` cmdlet, as shown below.

		Set-AzureRmNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg `
		    -Name https-rule `
		    -Description "Allow HTTPS" `
		    -Access Allow `
		    -Protocol Tcp `
		    -Direction Inbound `
		    -Priority 102 `
		    -SourceAddressPrefix * `
		    -SourcePortRange Internet `
		    -DestinationAddressPrefix * `
		    -DestinationPortRange 443

3. To save the changes made to the NSG, run the `Set-AzureRmNetworkSecurityGroup` cmdlet as shown below.

		Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $nsg

	Expected output showing only the security rules:

		Name                 : NSG-FrontEnd
		...
		SecurityRules        : [
		                         {
		                           "Name": "rdp-rule",
		                           ...
		                         },
		                         {
		                           "Name": "web-rule",
		                           ...
		                         },
		                         {
		                           "Name": "https-rule",
		                           "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
		                           "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd/securityRules/https-rule",
		                           "Description": "Allow HTTPS",
		                           "Protocol": "Tcp",
		                           "SourcePortRange": "*",
		                           "DestinationPortRange": "443",
		                           "SourceAddressPrefix": "Internet",
		                           "DestinationAddressPrefix": "*",
		                           "Access": "Allow",
		                           "Priority": 102,
		                           "Direction": "Inbound",
		                           "ProvisioningState": "Succeeded"
		                         }
		                       ]

### Delete a rule

1. Run the `Get-AzureRmNetworkSecurityGroup` cmdlet to retrieve the existing NSG and store it in a variable, as shown below.

		$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG `
		    -Name NSG-FrontEnd

2. Run the `Remove-AzureRmNetworkSecurityRuleConfig` cmdlet, as shown below.

		Remove-AzureRmNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg `
		    -Name https-rule

3. To save the changes made to the NSG, run the `Set-AzureRmNetworkSecurityGroup` cmdlet as shown below.

		Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $nsg

	Expected output showing only the security rules, notice the **https-rule** is no longer listed:

		Name                 : NSG-FrontEnd
		...
		SecurityRules        : [
		                         {
		                           "Name": "rdp-rule",
		                           ...
		                         },
		                         {
		                           "Name": "web-rule",
		                           ...
		                         }
		                       ]

## Manage associations

You can associate an NSG to subnets and NICs. You can also dissociate an NSG from any resource it's associated to.

### Associate an NSG to a NIC

To associate the **NSG-FrontEnd** NSG to the **TestNICWeb1** NIC, follow the steps below.

1. Run the `Get-AzureRmNetworkSecurityGroup` cmdlet to retrieve the existing NSG and store it in a variable, as shown below.

		$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG `
		    -Name NSG-FrontEnd

2. Run the `Get-AzureRmNetworkInterface` cmdlet to retrieve the existing NIC and store it in a variable, as shown below.

		$nic = Get-AzureRmNetworkInterface -ResourceGroupName RG-NSG `
		    -Name TestNICWeb1

3. Set the **NetworkSecurityGroup** property of the **NIC** variable to the value of the **NSG** variable, as shown below.

		$nic.NetworkSecurityGroup = $nsg

4. To save the changes made to the NIC, run the `Set-AzureRmNetworkInterface` cmdlet as shown below.

		Set-AzureRmNetworkInterface -NetworkInterface $nic

	Expected output showing only the **NetworkSecurityGroup** property:

		NetworkSecurityGroup : {
		                         "SecurityRules": [],
		                         "DefaultSecurityRules": [],
		                         "NetworkInterfaces": [],
		                         "Subnets": [],
		                         "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd"
		                       }

### Dissociate an NSG from a NIC

To dissociate the **NSG-FrontEnd** NSG from the **TestNICWeb1** NIC, follow the steps below.

1. Run the `Get-AzureRmNetworkSecurityGroup` cmdlet to retrieve the existing NSG and store it in a variable, as shown below.

		$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG `
		    -Name NSG-FrontEnd

2. Run the `Get-AzureRmNetworkInterface` cmdlet to retrieve the existing NIC and store it in a variable, as shown below.

		$nic = Get-AzureRmNetworkInterface -ResourceGroupName RG-NSG `
		    -Name TestNICWeb1

3. Set the **NetworkSecurityGroup** property of the **NIC** variable to **$null**, as shown below.

		$nic.NetworkSecurityGroup = $null

4. To save the changes made to the NIC, run the `Set-AzureRmNetworkInterface` cmdlet as shown below.

		Set-AzureRmNetworkInterface -NetworkInterface $nic

	Expected output showing only the **NetworkSecurityGroup** property:

		NetworkSecurityGroup : null

### Dissociate an NSG from a subnet

To dissociate the **NSG-FrontEnd** NSG from the **FrontEnd** subnet, follow the steps below.

1. Run the `Get-AzureRmVirtualNetwork` cmdlet to retrieve the existing VNet and store it in a variable, as shown below.

		$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName RG-NSG `
		    -Name TestVNet

2. Run the `Get-AzureRmVirtualNetworkSubnetConfig` cmdlet to retrieve the **FrontEnd** subnet and store it in a variable, as shown below.

		$subnet = Get-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet `
		    -Name FrontEnd 

3. Set the **NetworkSecurityGroup** property of the **subnet** variable to **$null**, as shown below.

		$subnet.NetworkSecurityGroup = $null

4. To save the changes made to the subnet, run the `Set-AzureRmVirtualNetwork` cmdlet as shown below.

		Set-AzureRmVirtualNetwork -VirtualNetwork $vnet

	Expected output showing only the properties of the **FrontEnd** subnet. Notice there isn't a property for **NetworkSecurityGroup**:

			...
			Subnets           : [
			                      {
			                        "Name": "FrontEnd",
			                        "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
			                        "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
			                        "AddressPrefix": "192.168.1.0/24",
			                        "IpConfigurations": [
			                          {
			                            "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/networkInterfaces/TestNICWeb2/ipConfigurations/ipconfig1"
			                          },
			                          {
			                            "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/networkInterfaces/TestNICWeb1/ipConfigurations/ipconfig1"
			                          }
			                        ],
			                        "ProvisioningState": "Succeeded"
			                      },
									...
			                    ]

### Associate an NSG to a subnet

To associate the **NSG-FrontEnd** NSG to the **FronEnd** subnet again, follow the steps below.

1. Run the `Get-AzureRmVirtualNetwork` cmdlet to retrieve the existing VNet and store it in a variable, as shown below.

		$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName RG-NSG `
		    -Name TestVNet

2. Run the `Get-AzureRmVirtualNetworkSubnetConfig` cmdlet to retrieve the **FrontEnd** subnet and store it in a variable, as shown below.

		$subnet = Get-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet `
		    -Name FrontEnd 

1. Run the `Get-AzureRmNetworkSecurityGroup` cmdlet to retrieve the existing NSG and store it in a variable, as shown below.

		$nsg = Get-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG `
		    -Name NSG-FrontEnd

3. Set the **NetworkSecurityGroup** property of the **subnet** variable to **$null**, as shown below.

		$subnet.NetworkSecurityGroup = $nsg

4. To save the changes made to the subnet, run the `Set-AzureRmVirtualNetwork` cmdlet as shown below.

		Set-AzureRmVirtualNetwork -VirtualNetwork $vnet

	Expected output showing only the **NetworkSecurityGroup** property of the **FrontEnd** subnet:

		...
		"NetworkSecurityGroup": {
		                          "SecurityRules": [],
		                          "DefaultSecurityRules": [],
		                          "NetworkInterfaces": [],
		                          "Subnets": [],
		                          "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/RG-NSG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd"
		                        }
		...

## Delete an NSG

You can only delete an NSG if it's not associated to any resource. To delete an NSG, follow the steps below.

1. To check the resources associated to an NSG, run the `azure network nsg show` as shown in [View NSGs associations](#View-NSGs-associations).
2. If the NSG is associated to any NICs, run the `azure network nic set` as shown in [Dissociate an NSG from a NIC](#Dissociate-an-NSG-from-a-NIC) for each NIC. 
3. If the NSG is associated to any subnet, run the `azure network vnet subnet set` as shown in [Dissociate an NSG from a subnet](#Dissociate-an-NSG-from-a-subnet) for each subnet.
4. To delete the NSG, run the `Remove-AzureRmNetworkSecurityGroup` cmdlet as shown below.

		Remove-AzureRmNetworkSecurityGroup -ResourceGroupName RG-NSG -Name NSG-FrontEnd -Force

	>[AZURE.NOTE] The **-Force** parameter ensures you don't need to confirm the deletion.

## Next steps

- [Enable logging](virtual-network-nsg-manage-log.md) for NSGs.