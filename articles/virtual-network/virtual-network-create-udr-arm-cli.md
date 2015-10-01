<properties 
   pageTitle="Create User Defined Routes (UDR) in Resource Manager mode using the Azure CLI | Microsoft Azure"
   description="Learn how to create UDRs in Resource Manager mode using the Azure CLI"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/30/2015"
   ms.author="telmos" />

#Create User Defined Routes (UDR) in the Azure CLI

[AZURE.INCLUDE [virtual-network-create-udr-arm-selectors-include.md](../../includes/virtual-network-create-udr-arm-selectors-include.md)]

[AZURE.INCLUDE [virtual-network-create-udr-intro-include.md](../../includes/virtual-network-create-udr-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the Resource Manager deployment model. You can also [create UDRs in the classic deployment model](virtual-networks-udr-how-to.md).

[AZURE.INCLUDE [virtual-network-create-udr-scenario-include.md](../../includes/virtual-network-create-udr-scenario-include.md)]

The sample PowerShell commands below expect a simple environment already created based on the scenario above. If you want to run the commands as they are displayed in this document, first build the test environment by deploying [this template](http://github.com/telmosampaio/azure-templates/tree/master/IaaS-NSG-UDR-Before), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

## How to create the UDR for the front end subnet
To create the route table and route needed for the front end subnet based on the scenario above, follow the steps below.

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](xplat-cli.md) and follow the instructions up to the point where you select your Azure account and subscription.

2. Run the **azure config mode** command to switch to Resource Manager mode, as follows.

		azure config mode arm

	Expected output:

		info:    New mode is arm

3. Run the **azure network create route-table** command to create a route table for the front end subnet.

		azure network route-table create -g TestRG -n UDR-FrontEnd -l westus

	Parameters:
	- **-g (or --resource-group)**. Name of the resource group where the NSG will be created. For our scenario, *TestRG*.
	- **-l (or --location)**. Azure region where the new NSG will be created. For our scenario, *westus*.
	- **-n (or --name)**. Name for the new NSG. For our scenario, *NSG-FrontEnd*.

4. Run the **azure network route-table route create** command to create a route in the route table created above to send all traffic destined to the back end subnet (192.168.2.0/24) to the **FW1** VM (192.168.0.4).

		azure network route-table route create -g TestRG -r UDR-FrontEnd -n RouteToBackEnd -a 192.168.2.0/24 -y VirtualAppliance -p 192.168.0.4

	Parameters:
	- **-r (or --route-table-name)**. Name of the route table where the route will be added. For our scenario, *UDR-FrontEnd*.
	- **-a (or --address-prefix)**. Address prefix for the subnet where packets are destined to. For our scenario, *192.168.2.0/24*.
	- **-y (or --next-hopt-type)**. Type of object traffic will be sent to. Possible values are *VirtualAppliance*, *VirtualNetworkGateway*, *VNETLocal*, *Internet*, or *None*.
	- **-p (or --next-hop-ip-address**). IP address for next hop. For our scenario, *192.168.0.4*.

5. Run the **azure network vnet subnet set** command to associate the route table created above with the **FrontEnd** subnet.

		azure network vnet subnet set -g TestRG -e TestVNet -n FrontEnd -r UDR-FrontEnd

Parameters:
	- **-e (or --vnet-name)**. Name of the VNet where the subnet is located. For our scenario, *TestVNet*.
 
## How to create the UDR for the back end subnet
To create the route table and route needed for the back end subnet based on the scenario above, follow the steps below.

1. Run the **azure network create route-table** command to create a route table for the back end subnet.

		azure network route-table create -g TestRG -n UDR-BackEnd -l westus

4. Run the **azure network route-table route create** command to create a route in the route table created above to send all traffic destined to the front end subnet (192.168.1.0/24) to the **FW1** VM (192.168.0.4).

		azure network route-table route create -g TestRG -r UDR-BackEnd -n RouteToFrontEnd -a 192.168.1.0/24 -y VirtualAppliance -p 192.168.0.4

5. Run the **azure network vnet subnet set** command to associate the route table created above with the **BackEnd** subnet.

		azure network vnet subnet set -g TestRG -e TestVNet -n BackEnd -r UDR-BackEnd
