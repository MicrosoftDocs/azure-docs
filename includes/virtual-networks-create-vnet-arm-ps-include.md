## How to create a VNet using PowerShell
To create a VNet by using PowerShell, follow the steps below.

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md) and follow the instructions all the way to the end to sign into Azure and select your subscription.
	
3. If necessary, create a new resource group, as shown below. For our scenario, create a resource group named *TestRG*. For more information about resource groups, visit [Azure Resource Manager Overview](resource-group-overview.md/#resource-groups).

		New-AzureResourceGroup -Name TestRG -Location centralus

	Expected output:
	
		ResourceGroupName : TestRG
		Location          : centralus
		ProvisioningState : Succeeded
		Tags              :
		Permissions       :
		                    Actions  NotActions
		                    =======  ==========
		                    *
		
		ResourceId        : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG	

4. Create a new VNet named *TestVNet*, as shown below.

		New-AzureVirtualNetwork -ResourceGroupName TestRG -Name TestVNet `
			-AddressPrefix 192.168.0.0/16 -Location centralus	
		
	Expected output:

		Name              : TestVNet
		ResourceGroupName : TestRG
		Location          : centralus
		Id                : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
		Etag              : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
		ProvisioningState : Succeeded
		Tags              :
		AddressSpace      : {
		                      "AddressPrefixes": [
		                        "192.168.0.0/16"
		                      ]
		                    }
		DhcpOptions       : {
		                      "DnsServers": null
		                    }
		NetworkInterfaces : null
		Subnets           : []

5. Store the virtual network object in a variable, as shown below.

		$vnet = Get-AzureVirtualNetwork -ResourceGroupName TestRG -Name TestVNet
	
	>[AZURE.TIP] You can combine steps 4 and 5 by running **$vnet = New-AzureVirtualNetwork -ResourceGroupName TestRG -Name TestVNet -AddressPrefix 192.168.0.0/16 -Location centralus**.

6. Add a subnet to the new VNet variable, as shown below.

		Add-AzureVirtualNetworkSubnetConfig -Name FrontEnd `
			-VirtualNetwork $vnet -AddressPrefix 192.168.1.0/24
		
	Expected output:

		Name              : TestVNet
		ResourceGroupName : TestRG
		Location          : centralus
		Id                : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
		Etag              : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
		ProvisioningState : Succeeded
		Tags              :
		AddressSpace      : {
		                      "AddressPrefixes": [
		                        "192.168.0.0/16"
		                      ]
		                    }
		DhcpOptions       : {
		                      "DnsServers": null
		                    }
		NetworkInterfaces : null
		Subnets           : [
		                      {
		                        "Name": "FrontEnd",
		                        "Etag": null,
		                        "Id": null,
		                        "AddressPrefix": "192.168.1.0/24",
		                        "IpConfigurations": null,
		                        "NetworkSecurityGroup": null,
		                        "RouteTable": null,
		                        "ProvisioningState": null
		                      }
		                    ]

7. Repeat step 6 above for each subnet you want to create. The command below creates the *BackEnd* subnet for our scenario.

		Add-AzureVirtualNetworkSubnetConfig -Name BackEnd `
			-VirtualNetwork $vnet -AddressPrefix 192.168.2.0/24

8. Although you create subnets, they currently only exist in the local variable used to retrieve the VNet you create in step 4 above. To save the changes to Azure, run the **Set-AzureVirtualNetwork** cmdlet, as shown below.

		Set-AzureVirtualNetwork -VirtualNetwork $vnet	
		
	Expected output:

		Name              : TestVNet
		ResourceGroupName : TestRG
		Location          : centralus
		Id                : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
		Etag              : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
		ProvisioningState : Succeeded
		Tags              :
		AddressSpace      : {
		                      "AddressPrefixes": [
		                        "192.168.0.0/16"
		                      ]
		                    }
		DhcpOptions       : {
		                      "DnsServers": []
		                    }
		NetworkInterfaces : null
		Subnets           : [
		                      {
		                        "Name": "FrontEnd",
		                        "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
		                        "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
		                        "AddressPrefix": "192.168.1.0/24",
		                        "IpConfigurations": [],
		                        "NetworkSecurityGroup": null,
		                        "RouteTable": null,
		                        "ProvisioningState": "Succeeded"
		                      },
		                      {
		                        "Name": "BackEnd",
		                        "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
		                        "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/BackEnd",
		                        "AddressPrefix": "192.168.2.0/24",
		                        "IpConfigurations": [],
		                        "NetworkSecurityGroup": null,
		                        "RouteTable": null,
		                        "ProvisioningState": "Succeeded"
		                      }
		                    ]