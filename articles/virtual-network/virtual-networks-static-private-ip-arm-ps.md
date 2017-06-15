---
title: Configure private IP addresses for VMs - Azure PowerShell | Microsoft Docs
description: Learn how to configure private IP addresses for virtual machines using PowerShell.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: d5f18929-15e3-40a2-9ee3-8188bc248ed8
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/23/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Configure private IP addresses for a virtual machine using PowerShell

[!INCLUDE [virtual-networks-static-private-ip-selectors-arm-include](../../includes/virtual-networks-static-private-ip-selectors-arm-include.md)]

[!INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

Azure has two deployment models: Azure Resource Manager and classic. Microsoft recommends creating resources through the Resource Manager deployment model. To learn more about the differences between the two models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md) article. This article covers the Resource Manager deployment model. You can also [manage static private IP address in the classic deployment model](virtual-networks-static-private-ip-classic-ps.md).

[!INCLUDE [virtual-networks-static-ip-scenario-include](../../includes/virtual-networks-static-ip-scenario-include.md)]

The sample PowerShell commands below expect a simple environment already created based on the scenario above. If you want to run the commands as they are displayed in this document, first build the test environment described in [create a vnet](virtual-networks-create-vnet-arm-ps.md).

## Create a VM with a static private IP address
To create a VM named *DNS01* in the *FrontEnd* subnet of a VNet named *TestVNet* with a static private IP of *192.168.1.101*, follow the steps below:

1. Set variables for the storage account, location, resource group, and credentials to be used. You will need to enter a user name and password for the VM. The storage account and resource group must already exist.

	```powershell
	$stName  = "vnetstorage"
	$locName = "Central US"
	$rgName  = "TestRG"
	$cred    = Get-Credential -Message "Type the name and password of the local administrator account."
	```

2. Retrieve the virtual network and subnet you want to create the VM in.

	```powershell
	$vnet   = Get-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet
	$subnet = $vnet.Subnets[0].Id
	```

3. If necessary, create a public IP address to access the VM from the Internet.

	```powershell
	$pip = New-AzureRmPublicIpAddress -Name TestPIP -ResourceGroupName $rgName `
	-Location $locName -AllocationMethod Dynamic
	```

4. Create a NIC using the static private IP address you want to assign to the VM. Make sure the IP is from the subnet range you are adding the VM to. This is the main step for this article, where you set the private IP to be static.

	```powershell
	$nic = New-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName $rgName `
	-Location $locName -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id `
	-PrivateIpAddress 192.168.1.101
	```

5. Create the VM using the NIC created above.

	```powershell
	$vm = New-AzureRmVMConfig -VMName DNS01 -VMSize "Standard_A1"
	$vm = Set-AzureRmVMOperatingSystem -VM $vm -Windows -ComputerName DNS01 `
	-Credential $cred -ProvisionVMAgent -EnableAutoUpdate
	$vm = Set-AzureRmVMSourceImage -VM $vm -PublisherName MicrosoftWindowsServer `
	-Offer WindowsServer -Skus 2012-R2-Datacenter -Version "latest"
	$vm = Add-AzureRmVMNetworkInterface -VM $vm -Id $nic.Id
	$osDiskUri = $storageAcc.PrimaryEndpoints.Blob.ToString() + "vhds/WindowsVMosDisk.vhd"
	$vm = Set-AzureRmVMOSDisk -VM $vm -Name "windowsvmosdisk" -VhdUri $osDiskUri `
	-CreateOption fromImage
	New-AzureRmVM -ResourceGroupName $rgName -Location $locName -VM $vm 
	```

	Expected output:
	
        EndTime             : [Date and time]
        Error               : 
        Output              : 
        StartTime           : [Date and time]
        Status              : Succeeded
        TrackingOperationId : [Id]
        RequestId           : [Id]
        StatusCode          : OK 

## Retrieve static private IP address information for a network interface
To view the static private IP address information for the VM created with the script above, run the following PowerShell command and observe the values for *PrivateIpAddress* and *PrivateIpAllocationMethod*:

```powershell
Get-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName TestRG
```

Expected output:

    Name                 : TestNIC
    ResourceGroupName    : TestRG
    Location             : centralus
    Id                   : /subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC
    Etag                 : W/"[Id]"
    ProvisioningState    : Succeeded
    Tags                 : 
    VirtualMachine       : {
                             "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/DNS01"
                           }
    IpConfigurations     : [
                             {
                               "Name": "ipconfig1",
                               "Etag": "W/\"[Id]\"",
                               "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC/ipConfigurations/ipconfig1",
                               "PrivateIpAddress": "192.168.1.101",
                               "PrivateIpAllocationMethod": "Static",
                               "Subnet": {
                                 "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd"
                               },
                               "PublicIpAddress": {
                                 "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/TestPIP"
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

## Remove a static private IP address from a network interface
To remove the static private IP address added to the VM in the script above, run the following PowerShell commands:

```powershell
$nic=Get-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName TestRG
$nic.IpConfigurations[0].PrivateIpAllocationMethod = "Dynamic"
Set-AzureRmNetworkInterface -NetworkInterface $nic
```

Expected output:

    Name                 : TestNIC
    ResourceGroupName    : TestRG
    Location             : centralus
    Id                   : /subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC
    Etag                 : W/"[Id]"
    ProvisioningState    : Succeeded
    Tags                 : 
    VirtualMachine       : {
                             "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/WindowsVM"
                           }
    IpConfigurations     : [
                             {
                               "Name": "ipconfig1",
                               "Etag": "W/\"[Id]\"",
                               "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC/ipConfigurations/ipconfig1",
                               "PrivateIpAddress": "192.168.1.101",
                               "PrivateIpAllocationMethod": "Dynamic",
                               "Subnet": {
                                 "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd"
                               },
                               "PublicIpAddress": {
                                 "Id": "/subscriptions/[Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/TestPIP"
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

## Add a static private IP address to a network interface
To add a static private IP address to the VM created using the script above, run the following commands:

```powershell
$nic=Get-AzureRmNetworkInterface -Name TestNIC -ResourceGroupName TestRG
$nic.IpConfigurations[0].PrivateIpAllocationMethod = "Static"
$nic.IpConfigurations[0].PrivateIpAddress = "192.168.1.101"
Set-AzureRmNetworkInterface -NetworkInterface $nic
```
## Change the allocation method for a private IP address assigned to a network interface

A private IP address is assigned to a NIC with the static or dynamic allocation method. Dynamic IP addresses can change after starting a VM that was previously in the stopped (deallocated) state. This can potentially cause issues if the VM is hosting a service that requires the same IP address, even after restarts from a stopped (deallocated) state. Static IP addresses are retained until the VM is deleted. To change the allocation method of an IP address, run the following script, which changes the allocation method from dynamic to static. If the allocation method for the current private IP address is static, change *Static* to *Dynamic* before executing the script.

```powershell
$RG = "TestRG"
$NIC_name = "testnic1"

$nic = Get-AzureRmNetworkInterface -ResourceGroupName $RG -Name $NIC_name
$nic.IpConfigurations[0].PrivateIpAllocationMethod = 'Static'
Set-AzureRmNetworkInterface -NetworkInterface $nic 
$IP = $nic.IpConfigurations[0].PrivateIpAddress

Write-Host "The allocation method is now set to"$nic.IpConfigurations[0].PrivateIpAllocationMethod"for the IP address" $IP"." -NoNewline
```

If you don't know the name of the NIC, you can view a list of NICs within a resource group by entering the following command:

```powershell
Get-AzureRmNetworkInterface -ResourceGroupName $RG | Where-Object {$_.ProvisioningState -eq 'Succeeded'} 
```

## Next steps
* Learn about [reserved public IP](virtual-networks-reserved-public-ip.md) addresses.
* Learn about [instance-level public IP (ILPIP)](virtual-networks-instance-level-public-ip.md) addresses.
* Consult the [Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx).

