---
title: Configure routing preference for a public IP address using Azure CLI
titlesuffix: Azure Virtual Network
description: Learn how to create a public IP with an Internet traffic routing preference by using the Azure CLI.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli
ms.date: 02/22/2021
ms.author: allensu
---

# Configure routing preference for a public IP address using Azure CLI

This article shows you how to configure routing preference via ISP network (**Internet** option) for a public IP address using Azure CLI. After creating the public IP address, you can associate it with the following Azure resources for inbound and outbound traffic to the internet:

* Virtual machine
* Virtual machine scale set
* Azure Kubernetes Service (AKS)
* Internet-facing load balancer
* Application Gateway
* Azure Firewall

By default, the routing preference for public IP address is set to the Microsoft global network for all Azure services and can be associated with any Azure service.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.49 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group
Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group in the **East US** Azure region:

```azurecli
  az group create --name myResourceGroup --location eastus
```
## Create a public IP address

Create a Public IP Address with routing preference of **Internet** type using command [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create), with the format as shown below.

The following command creates a new public IP with **Internet** routing preference in the **East US** Azure region.

```azurecli
az network public-ip create \
--name MyRoutingPrefIP \
--resource-group MyResourceGroup \
--location eastus \
--ip-tags 'RoutingPreference=Internet' \
--sku STANDARD \
--allocation-method static \
--version IPv4
```

> [!NOTE]
>  Currently, routing preference only supports IPV4 public IP addresses.

You can associate the above created public IP address with a [Windows](../../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md#azure-cli) to associate the Public IP to your VM. You can also associate the public IP address created above with with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

## Next steps

- Learn more about [routing preference in public IP addresses](routing-preference-overview.md). 
- [Configure routing preference for a VM using the Azure CLI](./configure-routing-preference-virtual-machine-cli.md).
