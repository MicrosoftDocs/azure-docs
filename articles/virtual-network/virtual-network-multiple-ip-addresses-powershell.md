---
title: Multiple IP addresses for Azure virtual machines - PowerShell | Microsoft Docs
description: Learn how to assign multiple IP addresses to a virtual machine using PowerShell. | Resource Manager
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
ms.subservice: ip-services
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/24/2017
ms.author: allensu

---

# Assign multiple IP addresses to virtual machines using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [virtual-network-multiple-ip-addresses-intro.md](../../includes/virtual-network-multiple-ip-addresses-intro.md)]

This article explains how to create a virtual machine (VM) through the Azure Resource Manager deployment model using PowerShell. Multiple IP addresses cannot be assigned to resources created through the classic deployment model. To learn more about Azure deployment models, read the [Understand deployment models](../resource-manager-deployment-model.md) article.

[!INCLUDE [virtual-network-multiple-ip-addresses-scenario.md](../../includes/virtual-network-multiple-ip-addresses-scenario.md)]

## <a name = "create"></a>Create a VM with multiple IP addresses

The steps that follow explain how to create an example VM with multiple IP addresses, as described in the scenario. Change variable values as required for your implementation.

1. Open a PowerShell command prompt and complete the remaining steps in this section within a single PowerShell session. If you don't already have PowerShell installed and configured, complete the steps in the [How to install and configure Azure PowerShell](/powershell/azure/overview) article.
2. Login to your account with the `Connect-AzAccount` command.
3. Replace *myResourceGroup* and *westus* with a name and location of your choosing. Create a resource group. A resource group is a logical container into which Azure resources are deployed and managed.

   ```powershell
   $RgName   = "MyResourceGroup"
   $Location = "westus"

   New-AzResourceGroup `
   -Name $RgName `
   -Location $Location
   ```

4. Create a virtual network (VNet) and subnet in the same location as the resource group:

   ```powershell

   # Create a subnet configuration
   $SubnetConfig = New-AzVirtualNetworkSubnetConfig `
   -Name MySubnet `
   -AddressPrefix 10.0.0.0/24

   # Create a virtual network
   $VNet = New-AzVirtualNetwork `
   -ResourceGroupName $RgName `
   -Location $Location `
   -Name MyVNet `
   -AddressPrefix 10.0.0.0/16 `
   -Subnet $subnetConfig

   # Get the subnet object
   $Subnet = Get-AzVirtualNetworkSubnetConfig -Name $SubnetConfig.Name -VirtualNetwork $VNet
   ```

5. Create a network security group (NSG) and a rule. The NSG secures the VM using inbound and outbound rules. In this case, an inbound rule is created for port 3389, which allows incoming remote desktop connections.

	```powershell
	
	# Create an inbound network security group rule for port 3389

	$NSGRule = New-AzNetworkSecurityRuleConfig `
	-Name MyNsgRuleRDP `
	-Protocol Tcp `
	-Direction Inbound `
	-Priority 1000 `
	-SourceAddressPrefix * `
	-SourcePortRange * `
	-DestinationAddressPrefix * `
	-DestinationPortRange 3389 -Access Allow
	
	# Create a network security group
	$NSG = New-AzNetworkSecurityGroup `
	-ResourceGroupName $RgName `
	-Location $Location `
	-Name MyNetworkSecurityGroup `
	-SecurityRules $NSGRule
    ```

6. Define the primary IP configuration for the NIC. Change 10.0.0.4 to a valid address in the subnet you created, if you didn't use the value defined previously. Before assigning a static IP address, it's recommended that you first confirm it's not already in use. Enter the command `Test-AzPrivateIPAddressAvailability -IPAddress 10.0.0.4 -VirtualNetwork $VNet`. If the address is available, the output returns *True*. If it's not available, the output returns *False* and a list of addresses that are available. 

	In the following commands, **Replace \<replace-with-your-unique-name> with the unique DNS name to use.** The name must be unique across all public IP addresses within an Azure region. This is an optional parameter. It can be removed if you only want to connect to the VM using the public IP address.

	```powershell
	
	# Create a public IP address
	$PublicIP1 = New-AzPublicIpAddress `
	-Name "MyPublicIP1" `
	-ResourceGroupName $RgName `
	-Location $Location `
	-DomainNameLabel <replace-with-your-unique-name> `
	-AllocationMethod Static
		
	#Create an IP configuration with a static private IP address and assign the public IP address to it
	$IpConfigName1 = "IPConfig-1"
	$IpConfig1     = New-AzNetworkInterfaceIpConfig `
	-Name $IpConfigName1 `
	-Subnet $Subnet `
	-PrivateIpAddress 10.0.0.4 `
	-PublicIpAddress $PublicIP1 `
	-Primary
    ```

	When you assign multiple IP configurations to a NIC, one configuration must be assigned as the *-Primary*.

	> [!NOTE]
	> Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There is a limit to the number of public IP addresses that can be used in a subscription. To learn more about the limits, read the [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits) article.

7. Define the secondary IP configurations for the NIC. You can add or remove configurations as necessary. Each IP configuration must have a private IP address assigned. Each configuration can optionally have one public IP address assigned.

	```powershell
	
	# Create a public IP address
	$PublicIP2 = New-AzPublicIpAddress `
	-Name "MyPublicIP2" `
	-ResourceGroupName $RgName `
	-Location $Location `
	-AllocationMethod Static
		
	#Create an IP configuration with a static private IP address and assign the public IP address to it
	$IpConfigName2 = "IPConfig-2"
	$IpConfig2     = New-AzNetworkInterfaceIpConfig `
	-Name $IpConfigName2 `
	-Subnet $Subnet `
	-PrivateIpAddress 10.0.0.5 `
	-PublicIpAddress $PublicIP2
		
	$IpConfigName3 = "IpConfig-3"
	$IpConfig3 = New-AzNetworkInterfaceIpConfig `
	-Name $IPConfigName3 `
	-Subnet $Subnet `
	-PrivateIpAddress 10.0.0.6
    ```

8. Create the NIC and associate the three IP configurations to it:

   ```powershell
   $NIC = New-AzNetworkInterface `
   -Name MyNIC `
   -ResourceGroupName $RgName `
   -Location $Location `
   -NetworkSecurityGroupId $NSG.Id `
   -IpConfiguration $IpConfig1,$IpConfig2,$IpConfig3
   ```

   >[!NOTE]
   >Though all configurations are assigned to one NIC in this article, you can assign multiple IP configurations to every NIC attached to the VM. To learn how to create a VM with multiple NICs, read the [Create a VM with multiple NICs](../virtual-machines/windows/multiple-nics.md) article.

9. Create the VM by entering the following commands:

	```powershell
	
	# Define a credential object. When you run these commands, you're prompted to enter a username and password for the VM you're creating.
	$cred = Get-Credential
	
	# Create a virtual machine configuration
	$VmConfig = New-AzVMConfig `
	-VMName MyVM `
	-VMSize Standard_DS1_v2 | `
	Set-AzVMOperatingSystem -Windows `
	-ComputerName MyVM `
	-Credential $cred | `
	Set-AzVMSourceImage `
	-PublisherName MicrosoftWindowsServer `
	-Offer WindowsServer `
	-Skus 2016-Datacenter `
	-Version latest | `
	Add-AzVMNetworkInterface `
	-Id $NIC.Id
	
	# Create the VM
	New-AzVM `
	-ResourceGroupName $RgName `
	-Location $Location `
	-VM $VmConfig
    ```

10. Add the private IP addresses to the VM operating system by completing the steps for your operating system in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP addresses to the operating system.

## <a name="add"></a>Add IP addresses to a VM

You can add private and public IP addresses to the Azure network interface by completing the steps that follow. The examples in the following sections assume that you already have a VM with the three IP configurations described in the [scenario](#scenario) in this article, but it's not required that you do.

1. Open a PowerShell command prompt and complete the remaining steps in this section within a single PowerShell session. If you don't already have PowerShell installed and configured, complete the steps in the [How to install and configure Azure PowerShell](/powershell/azure/overview) article.
2. Change the "values" of the following $Variables to the name of the NIC you want to add IP address to and the resource group and location the NIC exists in:

   ```powershell
   $NicName  = "MyNIC"
   $RgName   = "MyResourceGroup"
   $Location = "westus"
   ```

   If you don't know the name of the NIC you want to change, enter the following commands, then change the values of the previous variables:

   ```powershell
   Get-AzNetworkInterface | Format-Table Name, ResourceGroupName, Location
   ```

3. Create a variable and set it to the existing NIC by typing the following command:

   ```powershell
   $MyNIC = Get-AzNetworkInterface -Name $NicName -ResourceGroupName $RgName
   ```

4. In the following commands, change *MyVNet* and *MySubnet* to the names of the VNet and subnet the NIC is connected to. Enter the commands to retrieve the VNet and subnet objects the NIC is connected to:

   ```powershell
   $MyVNet = Get-AzVirtualnetwork -Name MyVNet -ResourceGroupName $RgName
   $Subnet = $MyVnet.Subnets | Where-Object { $_.Name -eq "MySubnet" }
   ```

   If you don't know the VNet or subnet name the NIC is connected to, enter the following command:

   ```powershell
   $MyNIC.IpConfigurations
   ```

   In the output, look for text similar to the following example output:

   ```
   "Id": "/subscriptions/[Id]/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/MyVNet/subnets/MySubnet"
   ```

	In this output, *MyVnet* is the VNet and *MySubnet* is the subnet the NIC is connected to.

5. Complete the steps in one of the following sections, based on your requirements:

   **Add a private IP address**

   To add a private IP address to a NIC, you must create an IP configuration. The following command creates a configuration with a static IP address of 10.0.0.7. When specifying a static IP address, it must be an unused address for the subnet. It's recommended that you first test the address to ensure it's available by entering the `Test-AzPrivateIPAddressAvailability -IPAddress 10.0.0.7 -VirtualNetwork $myVnet` command. If the IP address is available, the output returns *True*. If it's not available, the output returns *False*, and a list of addresses that are available.

   ```powershell
   Add-AzNetworkInterfaceIpConfig -Name IPConfig-4 -NetworkInterface `
   $MyNIC -Subnet $Subnet -PrivateIpAddress 10.0.0.7
   ```

   Create as many configurations as you require, using unique configuration names and private IP addresses (for configurations with static IP addresses).

   Add the private IP address to the VM operating system by completing the steps for your operating system in the [Add IP addresses to a VM operating system](#os-config) section of this article.

   **Add a public IP address**

   A public IP address is added by associating a public IP address resource to either a new IP configuration or an existing IP configuration. Complete the steps in one of the sections that follow, as you require.

   > [!NOTE]
   > Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There is a limit to the number of public IP addresses that can be used in a subscription. To learn more about the limits, read the [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits) article.
   >

   **Associate the public IP address resource to a new IP configuration**

   Whenever you add a public IP address in a new IP configuration, you must also add a private IP address, because all IP configurations must have a private IP address. You can either add an existing public IP address resource, or create a new one. To create a new one, enter the following command:

   ```powershell
   $myPublicIp3 = New-AzPublicIpAddress `
   -Name "myPublicIp3" `
   -ResourceGroupName $RgName `
   -Location $Location `
   -AllocationMethod Static
   ```

   To create a new IP configuration with a static private IP address and the associated *myPublicIp3* public IP address resource, enter the following command:

   ```powershell
   Add-AzNetworkInterfaceIpConfig `
   -Name IPConfig-4 `
   -NetworkInterface $myNIC `
   -Subnet $Subnet `
   -PrivateIpAddress 10.0.0.7 `
   -PublicIpAddress $myPublicIp3
   ```

   **Associate the public IP address resource to an existing IP configuration**

   A public IP address resource can only be associated to an IP configuration that doesn't already have one associated. You can determine whether an IP configuration has an associated public IP address by entering the following command:

   ```powershell
   $MyNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
   ```

   You see output similar to the following:

   ```
   Name       PrivateIpAddress PublicIpAddress                                           Primary

   IPConfig-1 10.0.0.4         Microsoft.Azure.Commands.Network.Models.PSPublicIpAddress    True
   IPConfig-2 10.0.0.5         Microsoft.Azure.Commands.Network.Models.PSPublicIpAddress   False
   IpConfig-3 10.0.0.6                                                                     False
   ```

   Since the **PublicIpAddress** column for *IpConfig-3* is blank, no public IP address resource is currently associated to it. You can add an existing public IP address resource to IpConfig-3, or enter the following command to create one:

   ```powershell
   $MyPublicIp3 = New-AzPublicIpAddress `
   -Name "MyPublicIp3" `
   -ResourceGroupName $RgName `
   -Location $Location -AllocationMethod Static
   ```

   Enter the following command to associate the public IP address resource to the existing IP configuration named *IpConfig-3*:

   ```powershell
   Set-AzNetworkInterfaceIpConfig `
   -Name IpConfig-3 `
   -NetworkInterface $mynic `
   -Subnet $Subnet `
   -PublicIpAddress $myPublicIp3
   ```

6. Set the NIC with the new IP configuration by entering the following command:

   ```powershell
   Set-AzNetworkInterface -NetworkInterface $MyNIC
   ```

7. View the private IP addresses and the public IP address resources assigned to the NIC by entering the following command:

   ```powershell
   $MyNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
   ```

8. Add the private IP address to the VM operating system by completing the steps for your operating system in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP address to the operating system.

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../includes/virtual-network-multiple-ip-addresses-os-config.md)]