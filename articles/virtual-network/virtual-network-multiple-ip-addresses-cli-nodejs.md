---
title: VM with multiple IP addresses using the Azure CLI 1.0 | Microsoft Docs
description: Learn how to assign multiple IP addresses to a virtual machine using the Azure CLI 1.0 | Resource Manager.
services: virtual-network
documentationcenter: na
author: anavinahar
manager: narayan
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/17/2016
ms.author: annahar

---
# Assign multiple IP addresses to virtual machines using Azure CLI 1.0

[!INCLUDE [virtual-network-multiple-ip-addresses-intro.md](../../includes/virtual-network-multiple-ip-addresses-intro.md)]

This article explains how to create a virtual machine (VM) through the Azure Resource Manager deployment model using the Azure CLI 1.0. Multiple IP addresses cannot be assigned to resources created through the classic deployment model. To learn more about Azure deployment models, read the [Understand deployment models](../resource-manager-deployment-model.md) article.

[!INCLUDE [virtual-network-multiple-ip-addresses-template-scenario.md](../../includes/virtual-network-multiple-ip-addresses-scenario.md)]

## <a name = "create"></a>Create a VM with multiple IP addresses

You can complete this task using the Azure CLI 1.0 (this article) or the [Azure CLI 2.0](virtual-network-multiple-ip-addresses-cli.md). The steps that follow explain how to create an example VM with multiple IP addresses, as described in the scenario. Change variable names and IP address types as required for your implementation.

1. Install and configure the Azure CLI 1.0 by following the steps in the [Install and Configure the Azure CLI](../cli-install-nodejs.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article and log into your Azure account with the `azure-login` command.

2. [Create a resource group](../virtual-machines/virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-network%2ftoc.json#create-resource-groups-and-choose-deployment-locations) followed by a [virtual network and subnet](../virtual-machines/virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-network%2ftoc.json#create-a-virtual-network-and-subnet). Change the ` --address-prefixes` and `--address-prefix` fields to the following to follow the exact scenario outlined in this article:

		--address-prefixes 10.0.0.0/16
		--address-prefix 10.0.0.0/24

	>[!NOTE] 
	>The referenced article above uses West Europe as the location to create resources, but this article uses West Central US. Make location changes appropriately.

3. [Create  a storage account](../virtual-machines/virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-network%2ftoc.json#create-a-storage-account) for your VM.

4. Create the NIC and the IP configurations you want to assign to the NIC. You can add, remove, or change the configurations as necessary. The following configurations are described in the scenario:

	**IPConfig-1**

	Enter the commands that follow to create:

	- A public IP address resource with a static public IP address
	- An IP configuration with the public IP address resource and a dynamic private IP address

	```bash
	azure network public-ip create \
	--resource-group myResourceGroup \
	--location westcentralus \
	--name myPublicIP \
	--domain-name-label mypublicdns \
	--allocation-method Static
	```

	> [!NOTE]
	> Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There is a limit to the number of public IP addresses that can be used in a subscription. To learn more about the limits, read the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article.

	```bash
	azure network nic create \
	--resource-group myResourceGroup \
	--location westcentralus \
	--subnet-vnet-name myVnet \
	--subnet-name mySubnet \
	--name myNic1 \
	--public-ip-name myPublicIP
	```

	**IPConfig-2**

	 Enter the following commands to create a new public IP address resource and a new IP configuration with a static public IP address and a static private IP address:
	
	```bash
	azure network public-ip create \
	--resource-group myResourceGroup \
	--location westcentralus \
	--name myPublicIP2 \
	--domain-name-label mypublicdns2 \
	--allocation-method Static

	azure network nic ip-config create \
	--resource-group myResourceGroup \
	--nic-name myNic1 \
	--name IPConfig-2 \
	--private-ip-address 10.0.0.5 \
	--public-ip-name myPublicIP2
	```

	**IPConfig-3**

	Enter the following commands to create an IP configuration with a dynamic private IP address and no public IP address:

	```bash
	azure network nic ip-config create \
	--resource-group myResourceGroup \
	--nic-name myNic1 \
	--name IPConfig-3
	```

	>[!NOTE] 
	>Though this article assigns all IP configurations to a single NIC, you can also assign multiple IP configurations to any NIC in a VM. To learn how to create a VM with multiple NICs, read the Create a VM with multiple NICs article.

5. [Create a Linux VM](../virtual-machines/virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-network%2ftoc.json#create-the-linux-vms) article. Be sure to remove the ```  --availset-name myAvailabilitySet \ ``` property as it is not required for this scenario. Use the appropriate location based on your scenario. 

	>[!WARNING] 
	> Step 6 in the Create a VM article fails if the VM size is not supported in the location you selected. Run the following command to get a full list of VMs in US West Central, for example:
	> `azure vm sizes --location westcentralus`
	> This location name can be changed based on your scenario.

	To change the VM size to Standard DS2 v2, for example, simply add the following property `--vm-size Standard_DS3_v2` to the `azure vm create` command in step 6.

6. Enter the following command to view the NIC and the associated IP configurations:

	```bash
	azure network nic show \
	--resource-group myResourceGroup \
	--name myNic1
	```
7. Add the private IP addresses to the VM operating system by completing the steps for your operating system in the [Add IP addresses to a VM operating system](#os-config) section of this article.

## <a name="add"></a>Add IP addresses to a VM

You can add additional private and public IP addresses to an existing NIC by completing the steps that follow. The examples build upon the [scenario](#Scenario) described in this article.

1. Open Azure CLI and complete the remaining steps in this section within a single CLI session. If you don't already have Azure CLI installed and configured, complete the steps in the [Install and Configure the Azure CLI](../cli-install-nodejs.md?toc=%2fazure%2fvirtual-network%2ftoc.json) article and log into your Azure account.

2. Complete the steps in one of the following sections, based on your requirements:

	- **Add a private IP address**
	
		To add a private IP address to a NIC, you must create an IP configuration using the command below.  If you want to add a dynamic private IP address, remove `-PrivateIpAddress 10.0.0.7` before entering the command. When specifying a static IP address, it must be an unused address for the subnet.

		```bash
		azure network nic ip-config create \
		--resource-group myResourceGroup \
		--nic-name myNic1 \
		--private-ip-address 10.0.0.7 \
		--name IPConfig-4
		```
		Create as many configurations as you require, using unique configuration names and private IP addresses (for configurations with static IP addresses).

	- **Add a public IP address**
	
		A public IP address is added by associating it to either a new IP configuration or an existing IP configuration. Complete the steps in one of the sections that follow, as you require.

		> [!NOTE]
		> Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page. There is a limit to the number of public IP addresses that can be used in a subscription. To learn more about the limits, read the [Azure limits](../azure-subscription-service-limits.md#networking-limits) article.
		>

		- **Associate the resource to a new IP configuration**
	
			Whenever you add a public IP address in a new IP configuration, you must also add a private IP address, because all IP configurations must have a private IP address. You can either add an existing public IP address resource, or create a new one. To create a new one, enter the following command:
	
			```bash
  			azure network public-ip create \
			--resource-group myResourceGroup \
			--location westcentralus \
			--name myPublicIP3 \
			--domain-name-label mypublicdns3
			```

 			To create a new IP configuration with a dynamic private IP address and the associated *myPublicIP3* public IP address resource, enter the following command:

			```bash
			azure network nic ip-config create \
			--resource-group myResourceGroup \
			--nic-name myNic \
			--name IPConfig-4 \
			--public-ip-name myPublicIP3
			```

		- **Associate the resource to an existing IP configuration**

			A public IP address resource can only be associated to an IP configuration that doesn't already have one associated. You can determine whether an IP configuration has an associated public IP address by entering the following command:

			```bash
			azure network nic ip-config list \
			--resource-group myResourceGroup \
			--nic-name myNic1
			```

			Look for a line similar to the one that follows for IPConfig-3 in the returned output: <br>
			
				Name               Provisioning state  Primary  Private IP allocation  Private IP version  Private IP address  Subnet    Public IP
			
				default-ip-config  Succeeded           true     Dynamic                IPv4                10.0.0.4            mySubnet  myPublicIP
				IPConfig-2         Succeeded           false    Static                 IPv4                10.0.0.5            mySubnet  myPublicIP2
				IPConfig-3         Succeeded           false    Dynamic                IPv4                10.0.0.6            mySubnet

			Since the **Public IP** column for *IpConfig-3* is blank, no public IP address resource is currently associated to it. You can add an existing public IP address resource to IpConfig-3, or enter the following command to create one:

			```bash
			azure network public-ip create \
			--resource-group  myResourceGroup \
			--location westcentralus \
			--name myPublicIP3 \
			--domain-name-label mypublicdns3 \
			--allocation-method Static
			```
	
			Enter the following command to associate the public IP address resource to the existing IP configuration named *IPConfig-3*:
	
			```bash
			azure network nic ip-config set \
			--resource-group myResourceGroup \
			--nic-name myNic1 \
			--name IPConfig-3 \
			--public-ip-name myPublicIP3
			```

3. View the private IP addresses and the public IP address resources assigned to the NIC by entering the following command:

	```bash
	azure network nic ip-config list \
	--resource-group myResourceGroup \
	--nic-name myNic1
	```

	The returned output is similar to the following: <br>

		Name               Provisioning state  Primary  Private IP allocation  Private IP version  Private IP address  Subnet    Public IP
		
		default-ip-config  Succeeded           true     Dynamic                IPv4                10.0.0.4            mySubnet  myPublicIP
		IPConfig-2         Succeeded           false    Static                 IPv4                10.0.0.5            mySubnet  myPublicIP2
		IPConfig-3         Succeeded           false    Dynamic                IPv4                10.0.0.6            mySubnet  myPublicIP3

4. Add the private IP addresses you added to the NIC to the VM operating system by following the instructions in the [Add IP addresses to a VM operating system](#os-config) section of this article. Do not add the public IP addresses to the operating system.

[!INCLUDE [virtual-network-multiple-ip-addresses-os-config.md](../../includes/virtual-network-multiple-ip-addresses-os-config.md)]
