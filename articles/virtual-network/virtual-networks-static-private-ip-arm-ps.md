<properties 
   pageTitle="How to set a static private IP address in Azure Resource Manager by using PowerShell| Microsoft Azure"
   description="Understanding static private IP addresses and how to manage them in Azure Resource Manager by using PowerShell"
   services="virtual-network"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor="tysonn"
   tags="azure-resource-manager"
/>
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/23/2016"
   ms.author="jdial" />

# How to set a static private IP address in Resource Manager by using PowerShell

[AZURE.INCLUDE [virtual-networks-static-private-ip-selectors-arm-include](../../includes/virtual-networks-static-private-ip-selectors-arm-include.md)]

[AZURE.INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the Resource Manager deployment model. You can also [manage static private IP address in the classic deployment model](virtual-networks-static-private-ip-classic-ps.md).

[AZURE.INCLUDE [virtual-networks-static-ip-scenario-include](../../includes/virtual-networks-static-ip-scenario-include.md)]

The sample PowerShell commands below expect a simple environment already created based on the scenario above. If you want to run the commands as they are displayed in this document, first build the test environment described in [create a vnet](virtual-networks-create-vnet-arm-ps.md).

## How to specify a static private IP address when creating a VM
To create a VM named *DNS01* in the *FrontEnd* subnet of a VNet named *TestVNet* with a static private IP of *192.168.1.101*, follow the steps below:

[AZURE.INCLUDE [powershell-preview-include.md](../../includes/powershell-preview-include.md)]

1. Set variables for the storage account, location, resource group, and credentials to be used. You will need to enter a user name and password for the VM. The storage account and resource group must already exist.

		$stName = "vnetstorage"
		$locName = "Central US"
		$rgName = "TestRG"
	    $cred = Get-Credential -Message "Type the name and password of the local administrator account."

3. Retrieve the virtual network and subnet you want to create the VM in.

	    $vnet = Get-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet	
	    $subnet = $vnet.Subnets[0].Id

4. If necessary, create a public IP address to access the VM from the Internet.

		$pip = New-AzureRmPublicIpAddress -Name TestPIP -ResourceGroupName $rgName -Location $locName -AllocationMethod Dynamic

5. Create a NIC using the static private IP address you want to assign to the VM. Make sure the IP is from the subnet range you are adding the VM to. This is the main step for this article, where you set the private IP to be static.

		$nic = New-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName $rgName -Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -PrivateIpAddress 192.168.1.101

6. Create the VM using the NIC created above.

		$vm = New-AzureRmVMConfig -VMName DNS01 -VMSize "Standard_A1"
		$vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName DNS01  -Credential $cred -ProvisionVMAgent -EnableAutoUpdate
		$vm = Set-AzureRmVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
		$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
		$osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/WindowsVMosDisk.vhd"
		$vm = Set-AzureRmVMOSDisk -VM $vm -Name "windowsvmosdisk" -VhdUri $osDiskUri -CreateOption fromImage
		New-AzureRmVM -ResourceGroupName $rgName -Location $locName -VM $vm 

	Expected output:

		EndTime             : 9/8/2015 2:32:09 PM -07:00
		Error               : 
		Output              : 
		StartTime           : 9/8/2015 2:27:42 PM -07:00
		Status              : Succeeded
		TrackingOperationId : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
		RequestId           : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
		StatusCode          : OK 


## How to retrieve static private IP address information for a VM
To view the static private IP address information for the VM created with the script above, run the following PowerShell command and observe the values for *PrivateIpAddress* and *PrivateIpAllocationMethod*:

	Get-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName TestRG

Expected output:

	Name                 : TestNIC
	ResourceGroupName    : TestRG
	Location             : centralus
	Id                   : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/Te
	                       stNIC
	Etag                 : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
	ProvisioningState    : Succeeded
	Tags                 : 
	VirtualMachine       : {
	                         "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMach
	                       ines/DNS01"
	                       }
	IpConfigurations     : [
	                         {
	                           "Name": "ipconfig1",
	                           "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
	                           "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkIn
	                       terfaces/TestNIC/ipConfigurations/ipconfig1",
	                           "PrivateIpAddress": "192.168.1.101",
	                           "PrivateIpAllocationMethod": "Static",
	                           "Subnet": {
	                             "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtual
	                       Networks/TestVNet/subnets/FrontEnd"
	                           },
	                           "PublicIpAddress": {
	                             "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/publicI
	                       PAddresses/TestPIP"
	                           },
	                           "LoadBalancerBackendAddressPools": [],
	                           "LoadBalancerInboundNatRules": [],
	                           "ProvisioningState": "Succeeded"
	                         }
	                       ]
	DnsSettings          : {
	                         "DnsServers": [],
	                         "AppliedDnsServers": [],
	                         "InternalDnsNameLabel": null,
	                         "InternalFqdn": null
	                       }
	EnableIPForwarding   : False
	NetworkSecurityGroup : null
	Primary              : True

## How to remove a static private IP address from a VM
To remove the static private IP address added to the VM in the script above, run the following PowerShell commands:
	
	$nic=Get-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName TestRG
	$nic.IpConfigurations[0].PrivateIpAllocationMethod = "Dynamic"
	Set-AzureRmNetworkInterface -NetworkInterface $nic

Expected output:

	Name                 : TestNIC
	ResourceGroupName    : TestRG
	Location             : centralus
	Id                   : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/Te
	                       stNIC
	Etag                 : W/"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
	ProvisioningState    : Succeeded
	Tags                 : 
	VirtualMachine       : {
	                         "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMach
	                       ines/WindowsVM"
	                       }
	IpConfigurations     : [
	                         {
	                           "Name": "ipconfig1",
	                           "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
	                           "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkIn
	                       terfaces/TestNIC/ipConfigurations/ipconfig1",
	                           "PrivateIpAddress": "192.168.1.101",
	                           "PrivateIpAllocationMethod": "Dynamic",
	                           "Subnet": {
	                             "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtual
	                       Networks/TestVNet/subnets/FrontEnd"
	                           },
	                           "PublicIpAddress": {
	                             "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/publicI
	                       PAddresses/TestPIP"
	                           },
	                           "LoadBalancerBackendAddressPools": [],
	                           "LoadBalancerInboundNatRules": [],
	                           "ProvisioningState": "Succeeded"
	                         }
	                       ]
	DnsSettings          : {
	                         "DnsServers": [],
	                         "AppliedDnsServers": [],
	                         "InternalDnsNameLabel": null,
	                         "InternalFqdn": null
	                       }
	EnableIPForwarding   : False
	NetworkSecurityGroup : null
	Primary              : True

## How to add a static private IP address to an existing VM
To add a static private IP address to the VM created using the script above, runt he following command:

	$nic=Get-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName TestRG
	$nic.IpConfigurations[0].PrivateIpAllocationMethod = "Static"
	$nic.IpConfigurations[0].PrivateIpAddress = "192.168.1.101"
	Set-AzureRmNetworkInterface -NetworkInterface $nic

## Next steps

- Learn about [reserved public IP](virtual-networks-reserved-public-ip.md) addresses.
- Learn about [instance-level public IP (ILPIP)](virtual-networks-instance-level-public-ip.md) addresses.
- Consult the [Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx).