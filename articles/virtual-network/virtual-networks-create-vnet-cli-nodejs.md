---
title: Create a virtual network using the Azure CLI 1.0 | Microsoft Docs
description: Learn how to create a virtual network using the Azure CLI 1.0 | Resource Manager.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: carmonm
editor: ''
tags: azure-resource-manager


ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/16/2017
ms.author: jdial

---
# Create a virtual network using the Azure CLI

[!INCLUDE [virtual-networks-create-vnet-intro](../../includes/virtual-networks-create-vnet-intro-include.md)]

Azure has two deployment models: Azure Resource Manager and classic. Microsoft recommends creating resources through the Resource Manager deployment model. To learn more about the differences between the two models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md) article.

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 2.0](virtual-networks-create-vnet-arm-cli.md) - our next generation CLI for the resource management deployment model
- [Azure CLI 1.0](#create-a-virtual-network) – our CLI for the classic and resource management deployment models (this article)

 
[!INCLUDE [virtual-networks-create-vnet-scenario-include](../../includes/virtual-networks-create-vnet-scenario-include.md)]

## Create a virtual network

To create a virtual network using the Azure CLI, complete the following steps:

1. Install and configure the Azure CLI by following the steps in the [Install and Configure the Azure CLI](../cli-install-nodejs.md) article.

2. Create a VNet and a subnet:

	```azurecli
	azure network vnet create --vnet TestVNet -e 192.168.0.0 -i 16 -n FrontEnd -p 192.168.1.0 -r 24 -l "Central US"
	```

    Expected output:
   
            info:    Executing command network vnet create
            + Looking up network configuration
            + Looking up locations
            + Setting network configuration
            info:    network vnet create command OK

	Parameters used:

   * **--vnet**. Name of the VNet to be created. For our scenario, *TestVNet*
   * **-e (or --address-space)**. VNet address space. For our scenario, *192.168.0.0*
   * **-i (or -cidr)**. Network mask in CIDR format. For our scenario, *16*.
   * **-n (or --subnet-name**). Name of the first subnet. For our scenario, *FrontEnd*.
   * **-p (or --subnet-start-ip)**. Starting IP address for subnet, or subnet address space. For our scenario, *192.168.1.0*.
   * **-r (or --subnet-cidr)**. Network mask in CIDR format for subnet. For our scenario, *24*.
   * **-l (or --location)**. Azure region where the VNet is created. For our scenario, *Central US*.

3. Create a subnet:

	```azurecli
	azure network vnet subnet create -t TestVNet -n BackEnd -a 192.168.2.0/24
	```
   
	Expected output:

            info:    Executing command network vnet subnet create
            + Looking up network configuration
            + Creating subnet "BackEnd"
            + Setting network configuration
            + Looking up the subnet "BackEnd"
            + Looking up network configuration
            data:    Name                            : BackEnd
            data:    Address prefix                  : 192.168.2.0/24
            info:    network vnet subnet create command OK

	Parameters used:

   * **-t (or --vnet-name**. Name of the VNet where the subnet will be created. For our scenario, *TestVNet*.
   * **-n (or --name)**. Name of the new subnet. For our scenario, *BackEnd*.
   * **-a (or --address-prefix)**. Subnet CIDR block. Four our scenario, *192.168.2.0/24*.
   
4. To view the properties of the new VNet:

	```azurecli
	azure network vnet show
	```
   
	Expected output:
   
            info:    Executing command network vnet show
            Virtual network name: TestVNet
            + Looking up the virtual network sites
            data:    Name                            : TestVNet
            data:    Location                        : Central US
            data:    State                           : Created
            data:    Address space                   : 192.168.0.0/16
            data:    Subnets:
            data:      Name                          : FrontEnd
            data:      Address prefix                : 192.168.1.0/24
            data:
            data:      Name                          : BackEnd
            data:      Address prefix                : 192.168.2.0/24
            data:
            info:    network vnet show command OK

## Next steps

Learn how to connect:

- A virtual machine (VM) to a virtual network by reading the [Create a Linux VM](../virtual-machines/linux/quick-create-cli.md) article. Instead of creating a VNet and subnet in the steps of the articles, you can select an existing VNet and subnet to connect a VM to.
- The virtual network to other virtual networks by reading the [Connect VNets](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article.
- The virtual network to an on-premises network using a site-to-site virtual private network (VPN) or ExpressRoute circuit. Learn how by reading the [Connect a VNet to an on-premises network using a site-to-site VPN](../vpn-gateway/vpn-gateway-howto-multi-site-to-site-resource-manager-portal.md) and [Link a VNet to an ExpressRoute circuit](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md).