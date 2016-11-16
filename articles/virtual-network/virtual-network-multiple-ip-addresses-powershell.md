---
title: Multiple IP addresses for virtual machines - PowerShell | Microsoft Docs
description: Learn how to assign multiple IP addresses to a virtual machine using PowerShell | Resource Manager.
services: virtual-network
documentationcenter: na
author: jimdial
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: c44ea62f-7e54-4e3b-81ef-0b132111f1f8
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/16/2016
ms.author: jdial;annahar

---
# Assign multiple IP addresses to virtual machines using PowerShell

> [!div class="op_single_selector"]
> * [Azure portal](virtual-network-multiple-ip-addresses-portal.md)
> * [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)
> 

An Azure Virtual Machine (VM) has one or more network interfaces (NIC) attached to it. Any NIC can have one or more static or dynamic public and private IP addresses assigned to it. Assigning multiple IP addresses to a VM enables the following capabilities:

* Hosting multiple websites or services with different IP addresses and SSL certificates on a single server.
* Serve as a network virtual appliance, such as a firewall or load balancer.
* The ability to add any of the private IP addresses for any of the NICs to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool. To learn more about how to load balance multiple IP configurations, read the [Load balancing multiple IP configurations](../load-balancer/load-balancer-multiple-ip.md) article.

Every NIC attached to a VM has one or more IP configurations associated to it. Each configuration is assigned one static or dynamic private IP address. Each configuration may also have one public IP address resource associated to it. A public IP address resource has either a dynamic or static IP address assigned to it. If you're not familiar with IP addresses in Azure, read the [IP addresses in Azure](virtual-network-ip-addresses-overview-arm.md) article to learn more about them.

This article explains how to use PowerShell to assign multiple IP addresses to a VM created through the Azure Resource Manager deployment model. Multiple IP addresses cannot be assigned to resources created through the classic deployment model. To learn more about Azure deployment models, read the [Understand deployment models](../resource-manager-deployment-model.md) article.

[!INCLUDE [virtual-network-preview](../../includes/virtual-network-preview.md)]

## Scenario
A VM with a single NIC is created and connected to a virtual network. The VM requires 3 different *private* IP addresses and two *public* IP addresses. The IP addresses are assigned to the following IP configurations:

* **IPConfig-1:** Assigns a *dynamic* private IP address (default) and a *static* public IP address.
* **IPConfig-2:** Assigns a *static* private IP address and a *static* public IP address.
* **IPConfig-3:** Assigns a *dynamic* private IP address and no public IP address.
  
	![Multiple IP addresses](./media/virtual-network-multiple-ip-addresses-powershell/OneNIC-3IP.png)

The IP configurations are associated to the NIC when the NIC is created and the NIC is attached to the VM when the VM is created. The types of IP addresses used for the scenario are for illustration. You can assign whatever IP address and assignment types you require.

## <a name = "create"></a>Create a VM with multiple IP addresses

The steps that follow explain how to create an example VM with multiple IP addresses, as described in the scenario. Change variable names and IP address types as required for your implementation.

1. Open a PowerShell command prompt and complete the remaining steps in this section within a single PowerShell session. If you don't already have PowerShell installed and configured, complete the steps in the [How to install and configure Azure PowerShell](../powershell-install-configure.md) article.
2. Register for the preview by sending an email to [Multiple IPs](mailto:MultipleIPsPreview@microsoft.com?subject=Request%20to%20enable%20subscription%20%3csubscription%20id%3e) with your subscription ID and intended use. Do not attempt to complete the remaining steps until after you receive an e-mail notifying you that you've been accepted into the preview and follow the instructions within it, or some of the following steps will fail.
3. Complete steps 1-4 of the [Create a Windows VM](../virtual-machines/virtual-machines-windows-ps-create.md) article. Do not complete step 5 (creation of public IP resource and network interface). If you change the names of any variables used in that article, you'll need to change the names of those variables that follow accordingly.
4. Create a variable to store the subnet object created in Step 4 (Create a VNet) of the Create a Windows VM article by typing the following command:

	```powershell
	$SubnetName = $mySubnet.Name
	$Subnet = $myVnet.Subnets | Where-Object { $_.Name -eq $SubnetName }
	```
5. Define the IP configurations you want to assign to the NIC. You can add, remove, or change the following configurations below as necessary. The following configurations are those described in the scenario:

	**IPConfig-1**

	Enter the following commands to create a public IP address resource with a static public IP address and an IP configuration with the public IP address resource and a dynamic private IP address:

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

	Change the value of the **$IPAddress** variable that follows to an available, valid address on the subnet you created. To check whether or not the address 10.0.0.5 is avaialble on the subnet enter the command `Test-AzureRmPrivateIPAddressAvailability -IPAddress 10.0.0.5 -VirtualNetwork $myVnet`. If it's avaialble the output will return *True*. If it's not available, the output will return *False* and a list of addresses that are available. Enter the following commands to create a new public IP address resource and a new IP configuration with a static public IP address and a static private IP address:
	
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
	> Step 6 in the Create a VM article will fail if you changed the variable named $myNIC to something else in step 6 of this article, or haven't completed the previous steps of this article or the Create a VM article.
	>
8. View the private IP addresses that Azure DHCP assigned to the NIC and the public IP address resource assigned to the NIC by entering the following command:

	```powershell
	$myNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
	```
9. <a name="os"></a>After the VM is created, connect and login to it. You must manually add all the private IP addresses (including the primary) to the TCP/IP configuration in the operating system by completing the steps in one of the following sections:

	**Windows**

	1. From a command prompt, type *ipconfig /all*.  You only see the *Primary* private IP address (through DHCP).
	2. Next type *ncpa.cpl* in the command prompt window. This will open a new window.
	3. Open the properties for **Local Area Connection**.
	4. Double-click Internet Protocol version 4 (IPv4).
	5. Select **Use the following IP address** and enter the following values:
   	
		* **IP address**: Enter the *Primary* private IP address
		* **Subnet mask**: Set based on your subnet. For example, if the subnet is a /24 subnet then the subnet mask is 255.255.255.0.
		* **Default gateway**: The first IP address in the subnet. If your subnet is 10.0.0.0/24, then the gateway IP address is 10.0.0.1.
		* Click **Use the following DNS server addresses** and enter the following values:
			* **Preferred DNS server**:** Enter 168.63.129.16 if you are not using your own DNS server.  If you are, enter the IP address for your DNS server.
		* Click the **Advanced** button and add additional IP addresses. Add each of the secondary private IP addresses listed in step 8 to the NIC with the same subnet specified for the primary IP address.
		* Click **OK** to close out the TCP/IP settings and then **OK** again to close the adapter settings. This will then reestablish your RDP connection.
	6. From a command prompt, type *ipconfig /all*. All IP addresses you added are shown and DHCP is turned off.
	
	**Linux (Ubuntu)**

	1. Open a terminal window.
	2. Make sure you are the root user. If you are not, you can do this by using the following command:

		```bash
		sudo -i
		```
	3. Update the configuration file of the network interface (assuming ‘eth0’).

		* Keep the existing line item for dhcp. This will configure the primary IP address as it used to be earlier.
		* Add a configuration for an additional static IP address with the following commands:

			```bash
			cd /etc/network/interfaces.d/
			ls
			```

		You should see a .cfg file.
	4. Open the file: vi *filename*.
	
		You should see the following lines at the end of the file:

		```bash
		auto eth0
		iface eth0 inet dhcp
		```
	5. Add the following lines after the lines that exist in this file:

		```bash
		iface eth0 inet static
		address <your private IP address here>
		```
	6. Save the file by using the following command:

		```bash
		:wq
		```
	7. Reset the network interface with the following command:

		```bash
		sudo ifdown eth0 && sudo ifup eth0
		```

		> [!IMPORTANT]
		> Run both ifdown and ifup in the same line if using a remote connection.
		>

	8. Verify the IP address is added to the network interface with the following command:

		```bash
		Ip addr list eth0
		```

		You should see the IP address you added as part of the list.
	
	**Linux (Redhat, CentOS, and others)**
	
	1. Open a terminal window.
	2. Make sure you are the root user. If you are not, you can do this by using the following command:

		```bash
		sudo -i
		```
	3. Enter your password and follow instructions as prompted. Once you are the root user, navigate to the network scripts folder with the following command:

		```bash
		cd /etc/sysconfig/network-scripts
		```
	4. List the related ifcfg files using the following command:

		```bash
		ls ifcfg-*
		```

		You should see *ifcfg-eth0* as one of the files.
	5. Copy the *ifcfg-eth0* file and name it *ifcfg-eth0:0* with the following command:

		```bash
		cp ifcfg-eth0 ifcfg-eth0:0
		```
	6. Edit the *ifcfg-eth0:0* file with the following command:
	
		```bash
		vi ifcfg-eth1
		```
	7. Change the device to the appropriate name in the file; *eth0:0* in this case, with the following command:

		```bash
		DEVICE=eth0:0
		```
	8. Change the *IPADDR = YourPrivateIPAddress* line to reflect the IP address.
	9. Save the file with the following command:

		```bash
		:wq
		```
	10. Restart the network services and make sure the changes are successful by running the following commands:

		```bash
		/etc/init.d/network restart
		Ipconfig
		```

		You should see the IP address you added, *eth0:0*, in the list returned.

## <a name="add"></a>Add IP addresses to a VM

You can add additional private and public IP addresses to an existing NIC by completing the steps that follow. The examples build upon the [scenario](#Scenario) described in this article.

1. Open a PowerShell command prompt and complete the remaining steps in this section within a single PowerShell session. If you don't already have PowerShell installed and configured, complete the steps in the [How to install and configure Azure PowerShell](../powershell-install-configure.md) article.
2. Change the "values" of the following $Variables to the name of the NIC you want to add IP address to and the resource group and location the NIC exists in:

	```powershell
	$NICname         = "myNIC"
	$myResourceGroup = "myResourceGroup"
	$location        = "westcentralus"
	```

	If you don't know the name of the NIC you want to change, enter the following commands, then change the values of the previous variables:

	```powershell
	Get-AzureRmNetworkInterface | Format-Table Name, ResourceGroupName, Location
	```
3. Create a variable and set it to the existing NIC by typing the following command:

	```powershell
	$myNIC = Get-AzureRmNetworkInterface -Name $NICname -ResourceGroupName $myResourceGroup
	```
4. In the following commands, change *myVNet* and *mySubnet* to the names of the VNet and subnet the NIC is connected to, then enter the commands to retrieve the VNet and subnet objects the NIC is connected to:

	```powershell
	$myVnet = Get-AzureRMVirtualnetwork -Name myVNet -ResourceGroupName $myResourceGroup
	$Subnet = $myVnet.Subnets | Where-Object { $_.Name -eq "mySubnet" }
	```
	If you don't know the VNet or subnet name the NIC is connected to, enter the following command:
	```powershell
	$mynic.IpConfigurations
	```
	In the output returned, look for a line similar to the following:

		Subnet   : {
					 "Id": "/subscriptions/[Id]/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet"

	In this output, *myVnet* is the VNet and *mySubnet* is the subnet the NIC is connected to.

5. Complete the steps in one of the following sections, based on your requirements:

	**Add a private IP address**
	You must create a new IP configuration to add a private IP address to a NIC. The following command creates a configuration with a static IP address of 10.0.0.7. If you want to add a dynamic private IP address, remove `-PrivateIpAddress 10.0.0.7` before entering the command. When specifying a static IP address, it must be an unused address for the subnet. It's recommended that you first test the address to ensure it's available by entering the `Test-AzureRmPrivateIPAddressAvailability -IPAddress 10.0.0.7 -VirtualNetwork $myVnet` command. If it's available the output will return *True*. If it's not available, the output will return *False* and a list of addresses that are available.

	```powershell
	Add-AzureRmNetworkInterfaceIpConfig -Name IPConfig-4 -NetworkInterface `
	 $myNIC -Subnet $Subnet -PrivateIpAddress 10.0.0.7
	```
	Create as many configurations as you require, using unique configuration names and private IP addresses (for configurations with static IP addresses).

	**Add a public IP address**
	A public IP address can be added by associating it to either a new IP configuration or an existing IP configuration. Complete the steps in one of the sections that follow, as you require.

	> [!NOTE]
	> Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There is a limit to the number of public IP addresses that can be used in a subscription. To learn more about the limits, read the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article.
	>

	**Associate the resource to a new IP configuration**
	You can't associate a public IP address resource to a new IP configuration without also adding a private IP address, because all IP configurations must have a private IP address. You can either add an existing public IP address resource, or create a new one. To create a new one, enter the following command:
	
	```powershell
	$myPublicIp3   = New-AzureRmPublicIpAddress -Name "myPublicIp3" -ResourceGroupName $myResourceGroup `
	-Location $location -AllocationMethod Static
	```

 	Enter the following command to create a new IP configuration with a dynamic private IP address and the associated *myPublicIp3* public IP address resource:

	```powershell
	Add-AzureRmNetworkInterfaceIpConfig -Name IPConfig-4 -NetworkInterface `
	 $myNIC -Subnet $Subnet -PublicIpAddress $myPublicIp3
	```

	**Associate the resource to an existing IP configuration**
	A public IP address resource can only be associated to an IP configuration that doesn't already have one associated. You can determine whether or not an IP configuration has an associated public IP address by entering the following command:

	```powershell
	$myNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
	```

	The output from the previous command will look similar to the following:

		Name       PrivateIpAddress PublicIpAddress                                           Primary
		----       ---------------- ---------------                                           -------
		IPConfig-1 10.0.0.4         Microsoft.Azure.Commands.Network.Models.PSPublicIpAddress    True
		IPConfig-2 10.0.0.5         Microsoft.Azure.Commands.Network.Models.PSPublicIpAddress    True
		IpConfig-3 10.0.0.6                                                                     False

	Since the **PublicIpAddress** column for *IpConfig-3* is blank, no public IP address resource is currently associated to it. You can add an existing public IP address resource to IpConfig-3, or enter the following command to creation one:

	```powershell
	$myPublicIp3   = New-AzureRmPublicIpAddress -Name "myPublicIp3" -ResourceGroupName $myResourceGroup `
	-Location $location -AllocationMethod Static
	```

	Enter the following command to associate the public IP address resource to the existing IP configuration named *IpConfig-3*:
	
	```powershell
	Set-AzureRmNetworkInterfaceIpConfig -Name IpConfig-3 -NetworkInterface $mynic -Subnet $Subnet -PublicIpAddress $myPublicIp3
	```

6. Set the NIC with the new IP configuration by entering the following command:

	```powershell
	Set-AzureRmNetworkInterface -NetworkInterface $myNIC
	```

7. View the private IP addresses that Azure DHCP assigned to the NIC and the public IP address resource assigned to the NIC by entering the following command:

	```powershell   
	$myNIC.IpConfigurations | Format-Table Name, PrivateIPAddress, PublicIPAddress, Primary
	```

8. Add the IP addresses you added to the NIC to the VM operating system by following the instructions in [step 9](#os) of the Create a VM with multiple IP addresses section of this article.
