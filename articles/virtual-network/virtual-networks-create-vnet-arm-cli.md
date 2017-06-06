---
title: Create a virtual network - Azure CLI 2.0 | Microsoft Docs
description: Learn how to create a virtual network using the Azure CLI 2.0.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 75966bcc-0056-4667-8482-6f08ca38e77a
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Create a virtual network using the Azure CLI 2.0

[!INCLUDE [virtual-networks-create-vnet-intro](../../includes/virtual-networks-create-vnet-intro-include.md)]

Azure has two deployment models: Azure Resource Manager and classic. Microsoft recommends creating resources through the Resource Manager deployment model. To learn more about the differences between the two models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md) article.

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](virtual-networks-create-vnet-cli-nodejs.md) – our CLI for the classic and resource management deployment models
- [Azure CLI 2.0](#create-a-virtual-network) - our next generation CLI for the resource management deployment model (this article)`
 
    You can also create a VNet through Resource Manager using other tools or create a VNet through the classic deployment model by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Portal](virtual-networks-create-vnet-arm-pportal.md)
> * [PowerShell](virtual-networks-create-vnet-arm-ps.md)
> * [CLI](virtual-networks-create-vnet-arm-cli.md)
> * [Template](virtual-networks-create-vnet-arm-template-click.md)
> * [Portal (Classic)](virtual-networks-create-vnet-classic-pportal.md)
> * [PowerShell (Classic)](virtual-networks-create-vnet-classic-netcfg-ps.md)
> * [CLI (Classic)](virtual-networks-create-vnet-classic-cli.md)

[!INCLUDE [virtual-networks-create-vnet-scenario-include](../../includes/virtual-networks-create-vnet-scenario-include.md)]


## Create a virtual network

To create a virtual network using the Azure CLI 2.0, complete the following steps:

1. Install and configure the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) and log in to an Azure account using [az login](/cli/azure/#login).

2. Create a resource group for your VNet using the [az group create](/cli/azure/group#create) command with the `--name` and `--location` arguments:

	```azurecli
	az group create --name TestRG --location centralus
	```

3. Create a VNet and a subnet:

	```azurecli
	az network vnet create \
	--name TestVNet \
	--resource-group TestRG \
	--location centralus \
	--address-prefix 192.168.0.0/16 \
	--subnet-name FrontEnd \
	--subnet-prefix 192.168.1.0/24
	```

	Expected output:
	
	```json
	{
		"newVNet": {
			"addressSpace": {
			"addressPrefixes": [
			"192.168.0.0/16"
			]
			},
			"dhcpOptions": {
			"dnsServers": []
			},
			"provisioningState": "Succeeded",
			"resourceGuid": "<guid>",
			"subnets": [
			{
				"etag": "W/\"<guid>\"",
				"id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
				"name": "FrontEnd",
				"properties": {
				"addressPrefix": "192.168.1.0/24",
				"provisioningState": "Succeeded"
				},
				"resourceGroup": "TestRG"
			}
			]
			}
	}
	```

	Parameters used:

	- `--name TestVNet`: Name of the VNet to be created.
	- `--resource-group TestRG`: # The resource group name that controls the resource. 
	- `--location centralus`: The location into which to deploy.
	- `--address-prefix 192.168.0.0/16`: The address prefix and block.  
	- `--subnet-name FrontEnd`: The name of the subnet.
	- `--subnet-prefix 192.168.1.0/24`: The address prefix and block.

	To list the basic information to use in the next command, you can query the VNet using a [query filter](/cli/azure/query-az-cli2):

	```azurecli
	az network vnet list --query '[?name==`TestVNet`].{Where:location,Name:name,Group:resourceGroup}' -o table
	```

    Which produces the following output:

		Where      Name      Group

		centralus  TestVNet  TestRG

4. Create a subnet:

	```azurecli
	az network vnet subnet create \
	--address-prefix 192.168.2.0/24 \
	--name BackEnd \
	--resource-group TestRG \
	--vnet-name TestVNet
	```

	Expected output:

    ```json
    {
    "addressPrefix": "192.168.2.0/24",
    "etag": "W/\"<guid> \"",
    "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/BackEnd",
    "ipConfigurations": null,
    "name": "BackEnd",
    "networkSecurityGroup": null,
    "provisioningState": "Succeeded",
    "resourceGroup": "TestRG",
    "resourceNavigationLinks": null,
    "routeTable": null
    }
    ```

	Parameters used:

    - `--address-prefix 192.168.2.0/24`: Subnet CIDR block.
    - `--name BackEnd`: Name of the new subnet.
    - `--resource-group TestRG`: The resource group.
    - `--vnet-name TestVNet`: The name of the owning VNet.

5. Query the properties of the new VNet:

	```azurecli
	az network vnet show \
    -g TestRG \
    -n TestVNet \
    --query '{Name:name,Where:location,Group:resourceGroup,Status:provisioningState,SubnetCount:subnets | length(@)}' \
    -o table
	```

	Expected output:

		Name      Where      Group    Status       SubnetCount

		TestVNet  centralus  TestRG   Succeeded              2

6. Query the properties of the subnets:

    ```azurecli
    az network vnet subnet list \
    -g TestRG \
    --vnet-name testvnet \
    --query '[].{Name:name,CIDR:addressPrefix,Status:provisioningState}' \
    -o table
    ```

	Expected output:

		Name      CIDR            Status

		FrontEnd  192.168.1.0/24  Succeeded
		BackEnd   192.168.2.0/24  Succeeded

## Next steps

Learn how to connect:

- A virtual machine (VM) to a virtual network by reading the [Create a Linux VM](../virtual-machines/linux/quick-create-cli.md) article. Instead of creating a VNet and subnet in the steps of the articles, you can select an existing VNet and subnet to connect a VM to.
- The virtual network to other virtual networks by reading the [Connect VNets](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article.
- The virtual network to an on-premises network using a site-to-site virtual private network (VPN) or ExpressRoute circuit. Learn how by reading the [Connect a VNet to an on-premises network using a site-to-site VPN](../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md) and [Link a VNet to an ExpressRoute circuit](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md).