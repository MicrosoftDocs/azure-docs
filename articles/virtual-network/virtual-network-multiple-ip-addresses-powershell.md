---
title: Multiple IP addresses for Azure virtual machines - PowerShell | Microsoft Docs
description: Learn how to assign multiple IP addresses to a virtual machine using PowerShell | Resource Manager.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: c44ea62f-7e54-4e3b-81ef-0b132111f1f8
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/30/2016
ms.author: jdial;annahar

---
# Assign multiple IP addresses to virtual machines using PowerShell

[!INCLUDE [virtual-network-multiple-ip-addresses-intro.md](../../includes/virtual-network-multiple-ip-addresses-intro.md)]

This article explains how to create a virtual machine (VM) through the Azure Resource Manager deployment model using PowerShell. Multiple IP addresses cannot be assigned to resources created through the classic deployment model. To learn more about Azure deployment models, read the [Understand deployment models](../resource-manager-deployment-model.md) article.

[!INCLUDE [virtual-network-preview](../../includes/virtual-network-preview.md)]

[!INCLUDE [virtual-network-multiple-ip-addresses-template-scenario.md](../../includes/virtual-network-multiple-ip-addresses-scenario.md)]

## <a name = "create"></a>Create a VM with multiple IP addresses

The steps that follow explain how to create an example VM with multiple IP addresses, as described in the scenario. Change variable names and IP address types as required for your implementation.

1. Open a PowerShell command prompt and complete the remaining steps in this section within a single PowerShell session. If you don't already have PowerShell installed and configured, complete the steps in the [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) article.
2. Register for the preview by running the following commands in PowerShell after you login and select the appropriate subscription:
	```
	Register-AzureRmProviderFeature -FeatureName AllowMultipleIpConfigurationsPerNic -ProviderNamespace Microsoft.Network

	Register-AzureRmProviderFeature -FeatureName AllowLoadBalancingonSecondaryIpconfigs -ProviderNamespace Microsoft.Network
	
	Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
	```
	Do not attempt to complete the remaining steps until you see the following output when you run the ```Get-AzureRmProviderFeature``` command:
		
	```powershell
	FeatureName                            ProviderName      RegistrationState
	-----------                            ------------      -----------------      
	AllowLoadBalancingOnSecondaryIpConfigs Microsoft.Network Registered       
	AllowMultipleIpConfigurationsPerNic    Microsoft.Network Registered       
	```
		
	>[!NOTE] 
	>This may take a few minutes.

3. Complete steps 1-4 of the [Create a Windows VM](../virtual-machines/virtual-machines-windows-ps-create.md) article. Do not complete step 5 (creation of public IP resource and network interface). If you change the names of any variables used in that article, change the names of the variables in the remaining steps too. To create a Linux VM, select a Linux operating system instead of Windows.
4. Create a variable to store the subnet object created in Step 4 (Create a VNet) of the Create a Windows VM article by typing the following command:

	```powershell
	$SubnetName = $mySubnet.Name
	$Subnet = $myVnet.Subnets | Where-Object { $_.Name -eq $SubnetName }
	```
5. Define the IP configurations you want to assign to the NIC. You can add, remove, or change the configurations as necessary. The following configurations are described in the scenario:

	**IPConfig-1**

	Enter the commands that follow to create:
	- A public IP address resource with a static public IP address
	- An IP configuration with the public IP address resource and a dynamic private IP address

	```powershell
	$myPublicIp1     = New-AzureRmPublicIpAddress -Name "myPublicIp1" -ResourceGroupName $myResourceGroup -Location $location -AllocationMethod Static
	$IpConfigName1  = "IPConfig-1"
	$IpConfig1      = New-AzureRmNetworkInterfaceIpConfig -Name $IpConfigName1 -Subnet $Subnet -PublicIpAddress $myPublicIp1 -Primary
	```

	Note the `-Primary` switch in the previous command. When you assign multiple IP configurations to a NIC, one configuration must be assigned as the *Primary*.

	> [!NOTE]
	> Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There is a limit to the number of public IP addresses that can be used in a subscription. To learn more about the limits, read the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article.
	>

	**IPConfig-2**

	Change the value of the **$IPAddress** variable that follows to an available, valid address on the subnet you created. To check whether the address 10.0.0.5 is available on the subnet, enter the command `Test-AzureRmPrivateIPAddressAvailability -IPAddress 10.0.0.5 -VirtualNetwork $myVnet`. If the address is available, the output returns *True*. If it's not available, the output returns *False* and a list of addresses that are available. Enter the following commands to create a new public IP address resource and a new IP configuration with a static public IP address and a static private IP address:
	
	```powershell
	$IpConfigName2 = "IPConfig-2"
	$IPAddress     = 10.0.0.5
	$myPublicIp2   = New-AzureRmPublicIpAddress -Name "myPublicIp2" -ResourceGroupName $myResourceGroup `
	-Location $location -AllocationMethod Static
	$IpConfig2     = New-AzureRmNetworkInterfaceIpConfig -Name $IpConfigName2 `
	-Subnet $Subnet -PrivateIpAddress $IPAddress -PublicIpAddress $myPublicIp2
	```

	**IPConfig-3**

	Enter the following commands to create an IP configuration with a dynamic private IP address and no public IP address:

	```powershell
	$IpConfigName3 = "IpConfig-3"
	$IpConfig3 = New-AzureRmNetworkInterfaceIpConfig -Name $IPConfigName3 -Subnet $Subnet
	```
6. Create the NIC using the IP configurations defined in the previous step by entering the following command:

	```powershell
	$myNIC = New-AzureRmNetworkInterface -Name myNIC -ResourceGroupName $myResourceGroup `
	-Location $location -IpConfiguration $IpConfig1,$IpConfig2,$IpConfig3
	```
	> [!NOTE]
	> Though this article assigns all IP configurations to a single NIC, you can also assign multiple IP configurations to any NIC in a VM. To learn how to create a VM with multiple NICs, read the [Create a VM with multiple NICs](virtual-network-deploy-multinic-arm-ps.md) article.

7. Complete step 6 of the [Create a VM](../virtual-machines/virtual-machines-windows-ps-create.md) article. 

	> [!WARNING]
	> Step 6 in the Create a VM article fails if:
	> - You changed the variable named $myNIC to something else in step 6 of this article.
	> - You haven't completed the previous steps of this article and the Create a VM article.
	>
8. Enter the following command to view the private IP addresses and public IP address resources assigned to the NIC:

	```powershell
	$myNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
	```
9. Add the private IP addresses to the VM operating system by completing the steps for your operating system in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP addresses to the operating system.

## <a name="add"></a>Add IP addresses to a VM

You can add private and public IP addresses to a NIC by completing the steps that follow. The examples in the following sections assume that you already have a VM with the three IP configurations described in the [scenario](#Scenario) in this article, but it's not required that you do.

1. Open a PowerShell command prompt and complete the remaining steps in this section within a single PowerShell session. If you don't already have PowerShell installed and configured, complete the steps in the [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) article.
2. Register for the public preview by following step 2 in the **Create a VM with multiple IP addresses** section.
3. Change the "values" of the following $Variables to the name of the NIC you want to add IP address to and the resource group and location the NIC exists in:

	```powershell
	$NICname         = "myNIC"
	$myResourceGroup = "myResourceGroup"
	$location        = "westcentralus"
	```

	If you don't know the name of the NIC you want to change, enter the following commands, then change the values of the previous variables:

	```powershell
	Get-AzureRmNetworkInterface | Format-Table Name, ResourceGroupName, Location
	```
4. Create a variable and set it to the existing NIC by typing the following command:

	```powershell
	$myNIC = Get-AzureRmNetworkInterface -Name $NICname -ResourceGroupName $myResourceGroup
	```
5. In the following commands, change *myVNet* and *mySubnet* to the names of the VNet and subnet the NIC is connected to. Enter the commands to retrieve the VNet and subnet objects the NIC is connected to:

	```powershell
	$myVnet = Get-AzureRMVirtualnetwork -Name myVNet -ResourceGroupName $myResourceGroup
	$Subnet = $myVnet.Subnets | Where-Object { $_.Name -eq "mySubnet" }
	```
	If you don't know the VNet or subnet name the NIC is connected to, enter the following command:
	```powershell
	$mynic.IpConfigurations
	```
	Look for text similar to the following text in the returned output:

		Subnet   : {
					 "Id": "/subscriptions/[Id]/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"

	In this output, *myVnet* is the VNet and *mySubnet* is the subnet the NIC is connected to.

6. Complete the steps in one of the following sections, based on your requirements:

	**Add a private IP address**

	To add a private IP address to a NIC, you must create an IP configuration. The following command creates a configuration with a static IP address of 10.0.0.7. If you want to add a dynamic private IP address, remove `-PrivateIpAddress 10.0.0.7` before entering the command. When specifying a static IP address, it must be an unused address for the subnet. It's recommended that you first test the address to ensure it's available by entering the `Test-AzureRmPrivateIPAddressAvailability -IPAddress 10.0.0.7 -VirtualNetwork $myVnet` command. If the IP address is available, the output returns *True*. If it's not available, the output returns *False*, and a list of addresses that are available.

	```powershell
	Add-AzureRmNetworkInterfaceIpConfig -Name IPConfig-4 -NetworkInterface `
	 $myNIC -Subnet $Subnet -PrivateIpAddress 10.0.0.7
	```

	Create as many configurations as you require, using unique configuration names and private IP addresses (for configurations with static IP addresses).

	Add the private IP address to the VM operating system by completing the steps for your operating system in the [Add IP addresses to a VM operating system](#os-config) section of this article.

	**Add a public IP address**

	A public IP address is added by associating a public IP address resource to either a new IP configuration or an existing IP configuration. Complete the steps in one of the sections that follow, as you require.

	> [!NOTE]
	> Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There is a limit to the number of public IP addresses that can be used in a subscription. To learn more about the limits, read the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article.
	>

	**Associate the public IP address resource to a new IP configuration**
	
	Whenever you add a public IP address in a new IP configuration, you must also add a private IP address, because all IP configurations must have a private IP address. You can either add an existing public IP address resource, or create a new one. To create a new one, enter the following command:
	
	```powershell
	$myPublicIp3   = New-AzureRmPublicIpAddress -Name "myPublicIp3" -ResourceGroupName $myResourceGroup `
	-Location $location -AllocationMethod Static
	```

 	To create a new IP configuration with a dynamic private IP address and the associated *myPublicIp3* public IP address resource, enter the following command:

	```powershell
	Add-AzureRmNetworkInterfaceIpConfig -Name IPConfig-4 -NetworkInterface `
	 $myNIC -Subnet $Subnet -PublicIpAddress $myPublicIp3
	```

	**Associate the public IP address resource to an existing IP configuration**

	A public IP address resource can only be associated to an IP configuration that doesn't already have one associated. You can determine whether an IP configuration has an associated public IP address by entering the following command:

	```powershell
	$myNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
	```

	Look for a line similar to the one that follows in the returned output:

		Name       PrivateIpAddress PublicIpAddress                                           Primary
		----       ---------------- ---------------                                           -------
		IPConfig-1 10.0.0.4         Microsoft.Azure.Commands.Network.Models.PSPublicIpAddress    True
		IPConfig-2 10.0.0.5         Microsoft.Azure.Commands.Network.Models.PSPublicIpAddress   False
		IpConfig-3 10.0.0.6                                                                     False

	Since the **PublicIpAddress** column for *IpConfig-3* is blank, no public IP address resource is currently associated to it. You can add an existing public IP address resource to IpConfig-3, or enter the following command to create one:

	```powershell
	$myPublicIp3   = New-AzureRmPublicIpAddress -Name "myPublicIp3" -ResourceGroupName $myResourceGroup `
	-Location $location -AllocationMethod Static
	```

	Enter the following command to associate the public IP address resource to the existing IP configuration named *IpConfig-3*:
	
	```powershell
	Set-AzureRmNetworkInterfaceIpConfig -Name IpConfig-3 -NetworkInterface $mynic -Subnet $Subnet -PublicIpAddress $myPublicIp3
	```

7. Set the NIC with the new IP configuration by entering the following command:

	```powershell
	Set-AzureRmNetworkInterface -NetworkInterface $myNIC
	```

8. View the private IP addresses and the public IP address resources assigned to the NIC by entering the following command:

	```powershell   
	$myNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
	```
9. Add the private IP address to the VM operating system by completing the steps for your operating system in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP address to the operating system.

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../includes/virtual-network-multiple-ip-addresses-os-config.md)]
