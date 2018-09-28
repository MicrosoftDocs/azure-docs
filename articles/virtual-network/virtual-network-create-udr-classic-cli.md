---
title: Control routing in an Azure Virtual Network - CLI - Classic | Microsoft Docs
description: Learn how to control routing in VNets using the Azure CLI in the classic deployment model
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: ''
tags: azure-service-management

ms.assetid: ca2b4638-8777-4d30-b972-eb790a7c804f
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2016
ms.author: genli

---
# Control routing and use virtual appliances (classic) using the Azure CLI

> [!div class="op_single_selector"]
> * [PowerShell](tutorial-create-route-table-powershell.md)
> * [Azure CLI](tutorial-create-route-table-cli.md)
> * [PowerShell (Classic)](virtual-network-create-udr-classic-ps.md)
> * [CLI (Classic)](virtual-network-create-udr-classic-cli.md)

[!INCLUDE [virtual-network-create-udr-intro-include.md](../../includes/virtual-network-create-udr-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]

This article covers the classic deployment model. You can also [control routing and use virtual appliances in the Resource Manager deployment model](tutorial-create-route-table-cli.md).

[!INCLUDE [virtual-network-create-udr-scenario-include.md](../../includes/virtual-network-create-udr-scenario-include.md)]

The sample Azure CLI commands below expect a simple environment already created based on the scenario above. If you want to run the commands as they are displayed in this document, create the environment shown in [create a VNet (classic) using the Azure CLI](virtual-networks-create-vnet-classic-cli.md).

[!INCLUDE [azure-cli-prerequisites-include.md](../../includes/azure-cli-prerequisites-include.md)]

## Create the UDR for the front end subnet
To create the route table and route needed for the front end subnet based on the scenario above, follow the steps below.

1. Run the following command to switch to classic mode:

	```azurecli
	azure config mode asm
	```

	Output:

        info:    New mode is asm

2. Run the following command to create a route table for the front-end subnet:

	```azurecli
	azure network route-table create -n UDR-FrontEnd -l uswest
	```
   
    Output:
   
        info:    Executing command network route-table create
        info:    Creating route table "UDR-FrontEnd"
        info:    Getting route table "UDR-FrontEnd"
        data:    Name                            : UDR-FrontEnd
        data:    Location                        : West US
        info:    network route-table create command OK
   
    Parameters:
   
   * **-l (or --location)**. Azure region where the new NSG will be created. For our scenario, *westus*.
   * **-n (or --name)**. Name for the new NSG. For our scenario, *NSG-FrontEnd*.
3. Run the following command to create a route in the route table to send all traffic destined to the back-end subnet (192.168.2.0/24) to the **FW1** VM (192.168.0.4):

	```azurecli
	azure network route-table route set -r UDR-FrontEnd -n RouteToBackEnd -a 192.168.2.0/24 -t VirtualAppliance -p 192.168.0.4
	```

    Output:
   
        info:    Executing command network route-table route set
        info:    Getting route table "UDR-FrontEnd"
        info:    Setting route "RouteToBackEnd" in a route table "UDR-FrontEnd"
        info:    network route-table route set command OK
   
    Parameters:
   
   * **-r (or --route-table-name)**. Name of the route table where the route will be added. For our scenario, *UDR-FrontEnd*.
   * **-a (or --address-prefix)**. Address prefix for the subnet where packets are destined to. For our scenario, *192.168.2.0/24*.
   * **-t (or --next-hop-type)**. Type of object traffic will be sent to. Possible values are *VirtualAppliance*, *VirtualNetworkGateway*, *VNETLocal*, *Internet*, or *None*.
   * **-p (or --next-hop-ip-address**). IP address for next hop. For our scenario, *192.168.0.4*.
4. Run the following command to associate the route table created with the **FrontEnd** subnet:

	```azurecli
	azure network vnet subnet route-table add -t TestVNet -n FrontEnd -r UDR-FrontEnd
	```
   
    Output:
   
        info:    Executing command network vnet subnet route-table add
        info:    Looking up the subnet "FrontEnd"
        info:    Looking up network configuration
        info:    Looking up network gateway route tables in virtual network "TestVNet" subnet "FrontEnd"
        info:    Associating route table "UDR-FrontEnd" and subnet "FrontEnd"
        info:    Looking up network gateway route tables in virtual network "TestVNet" subnet "FrontEnd"
        data:    Route table name                : UDR-FrontEnd
        data:      Location                      : West US
        data:      Routes:
        info:    network vnet subnet route-table add command OK    
   
    Parameters:
   
   * **-t (or --vnet-name)**. Name of the VNet where the subnet is located. For our scenario, *TestVNet*.
   * **-n (or --subnet-name**. Name of the subnet the route table will be added to. For our scenario, *FrontEnd*.

## Create the UDR for the back-end subnet
To create the route table and route needed for the back-end subnet based on the scenario, complete the following steps:

1. Run the following command to create a route table for the back-end subnet:

	```azurecli
	azure network route-table create -n UDR-BackEnd -l uswest
	```

2. Run the following command to create a route in the route table to send all traffic destined to the front-end subnet (192.168.1.0/24) to the **FW1** VM (192.168.0.4):

	```azurecli
	azure network route-table route set -r UDR-BackEnd -n RouteToFrontEnd -a 192.168.1.0/24 -t VirtualAppliance -p 192.168.0.4
	```

3. Run the following command to associate the route table with the **BackEnd** subnet:

	```azurecli
	azure network vnet subnet route-table add -t TestVNet -n BackEnd -r UDR-BackEnd
	```

