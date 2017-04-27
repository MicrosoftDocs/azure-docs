---
title: Control routing and virtual appliances using the Azure CLI 2.0 | Microsoft Docs
description: Learn how to control routing and virtual appliances using the Azure CLI 2.0.
services: virtual-network
documentationcenter: na
author: jimdial
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: 5452a0b8-21a6-4699-8d6a-e2d8faf32c25
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/12/2017
ms.author: jdial

---
# Create User-Defined Routes (UDR) using the Azure CLI 2.0

> [!div class="op_single_selector"]
> * [PowerShell](virtual-network-create-udr-arm-ps.md)
> * [Azure CLI](virtual-network-create-udr-arm-cli.md)
> * [Template](virtual-network-create-udr-arm-template.md)
> * [PowerShell (Classic deployment)](virtual-network-create-udr-classic-ps.md)
> * [CLI (Classic deployment)](virtual-network-create-udr-classic-cli.md)

## CLI versions to complete the task 

You can complete the task using one of the following CLI versions: 

- [Azure CLI 1.0](virtual-network-create-udr-arm-cli-nodejs.md) – our CLI for the classic and resource management deployment models 
- [Azure CLI 2.0](#Create-the-UDR-for-the-front-end-subnet) - our next generation CLI for the resource management deployment model (this article)

[!INCLUDE [virtual-networks-create-nsg-intro-include](../../includes/virtual-networks-create-nsg-intro-include.md)]

[!INCLUDE [virtual-networks-create-nsg-scenario-include](../../includes/virtual-networks-create-nsg-scenario-include.md)]

[!INCLUDE [virtual-network-create-udr-intro-include.md](../../includes/virtual-network-create-udr-intro-include.md)]

[!INCLUDE [virtual-network-create-udr-scenario-include.md](../../includes/virtual-network-create-udr-scenario-include.md)]

The sample Azure CLI commands below expect a simple environment already created based on the scenario above. If you want to run the commands as they are displayed in this document, first build the test environment by deploying [this template](http://github.com/telmosampaio/azure-templates/tree/master/IaaS-NSG-UDR-Before), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.


## Create the UDR for the front-end subnet
To create the route table and route needed for the front end subnet based on the scenario above, follow the steps below.

1. Create a route table for the front-end subnet with the [az network route-table create](/cli/azure/network/route-table#create) command:

	```azurecli
	az network route-table create \
	--resource-group testrg \
	--location centralus \
	--name UDR-FrontEnd
	```

	Output:

	```json
	{
	"etag": "W/\"<guid>\"",
	"id": "/subscriptions/<guid>/resourceGroups/testrg/providers/Microsoft.Network/routeTables/UDR-FrontEnd",
	"location": "centralus",
	"name": "UDR-FrontEnd",
	"provisioningState": "Succeeded",
	"resourceGroup": "testrg",
	"routes": [],
	"subnets": null,
	"tags": null,
	"type": "Microsoft.Network/routeTables"
	}
	```

2. Create a route that sends all traffic destined to the back-end subnet (192.168.2.0/24) to the **FW1** VM (192.168.0.4) using the [az network route-table route create](/cli/azure/network/route-table/route#create) command:

	```azurecli 
	az network route-table route create \
	--resource-group testrg \
	--name RouteToBackEnd \
	--route-table-name UDR-FrontEnd \
	--address-prefix 192.168.2.0/24 \
	--next-hop-type VirtualAppliance \
	--next-hop-ip-address 192.168.0.4
	```

	Output:

	```json
	{
	"addressPrefix": "192.168.2.0/24",
	"etag": "W/\"<guid>\"",
	"id": "/subscriptions/<guid>/resourceGroups/testrg/providers/Microsoft.Network/routeTables/UDR-FrontEnd/routes/RouteToBackEnd",
	"name": "RouteToBackEnd",
	"nextHopIpAddress": "192.168.0.4",
	"nextHopType": "VirtualAppliance",
	"provisioningState": "Succeeded",
	"resourceGroup": "testrg"
	}
	```
	Parameters:

	* **--route-table-name**. Name of the route table where the route will be added. For our scenario, *UDR-FrontEnd*.
	* **--address-prefix**. Address prefix for the subnet where packets are destined to. For our scenario, *192.168.2.0/24*.
	* **--next-hop-type**. Type of object traffic will be sent to. Possible values are *VirtualAppliance*, *VirtualNetworkGateway*, *VNETLocal*, *Internet*, or *None*.
	* **--next-hop-ip-address**. IP address for next hop. For our scenario, *192.168.0.4*.

3. Run the [az network vnet subnet update](/cli/azure/network/vnet/subnet#update) command to associate the route table created above with the **FrontEnd** subnet:

	```azurecli
	az network vnet subnet update \
	--resource-group testrg \
	--vnet-name testvnet \
	--name FrontEnd \
	--route-table UDR-FrontEnd
	```

	Output:

	```json
	{
	"addressPrefix": "192.168.1.0/24",
	"etag": "W/\"<guid>\"",
	"id": "/subscriptions/<guid>/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/FrontEnd",
	"ipConfigurations": null,
	"name": "FrontEnd",
	"networkSecurityGroup": null,
	"provisioningState": "Succeeded",
	"resourceGroup": "testrg",
	"resourceNavigationLinks": null,
	"routeTable": {
		"etag": null,
		"id": "/subscriptions/<guid>/resourceGroups/testrg/providers/Microsoft.Network/routeTables/UDR-FrontEnd",
		"location": null,
		"name": null,
		"provisioningState": null,
		"resourceGroup": "testrg",
		"routes": null,
		"subnets": null,
		"tags": null,
		"type": null
		}
	}
	```

	Parameters:
	
	* **--vnet-name**. Name of the VNet where the subnet is located. For our scenario, *TestVNet*.

## Create the UDR for the back-end subnet

To create the route table and route needed for the back-end subnet based on the scenario above, complete the following steps:

1. Run the following command to create a route table for the back-end subnet:

	```azurecli
	az network route-table create \
	--resource-group testrg \
	--name UDR-BackEnd \
	--location centralus
	```

2. Run the following command to create a route in the route table to send all traffic destined to the front-end subnet (192.168.1.0/24) to the **FW1** VM (192.168.0.4):

	```azurecli
	az network route-table route create \
	--resource-group testrg \
	--name RouteToFrontEnd \
	--route-table-name UDR-BackEnd \
	--address-prefix 192.168.1.0/24 \
	--next-hop-type VirtualAppliance \
	--next-hop-ip-address 192.168.0.4
	```

3. Run the following command to associate the route table with the **BackEnd** subnet:

	```azurecli
	az network vnet subnet update \
	--resource-group testrg \
	--vnet-name testvnet \
	--name BackEnd \
	--route-table UDR-BackEnd
	```

## Enable IP forwarding on FW1

To enable IP forwarding in the NIC used by **FW1**, complete the following steps:

1. Run the [az network nic show](/cli/az/network/nic#show) command with a JMESPATH filter to display the current **enable-ip-forwarding** value for **Enable IP forwarding**. It should be set to *false*.

	```azurecli
	az network nic show \
	--resource-group testrg \
	--nname nicfw1 \
	--query 'enableIpForwarding' -o tsv
	```

	Output:

		false

2. Run the following command to enable IP forwarding:

	```azurecli
	az network nic update \
	--resource-group testrg \
	--name nicfw1 \
	--ip-forwarding true
	```

	You can examine the output streamed to the console, or just retest for the specific **enableIpForwarding** value:

	```azurecli
	az network nic show -g testrg -n nicfw1 --query 'enableIpForwarding' -o tsv
	```

	Output:

		true

	Parameters:

	**--ip-forwarding**: *true* or *false*.

