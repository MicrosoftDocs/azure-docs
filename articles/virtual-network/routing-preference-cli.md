---
title: Configure routing preference for a public IP address using Azure CLI
titlesuffix: Azure Virtual Network
description: Learn how to create a public IP with an Internet traffic routing preference
services: virtual-network
documentationcenter: na
author: KumudD
manager: mtillman
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/18/2020
ms.author: mnayak

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

> [!IMPORTANT]
> Routing preference is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]
If you decide to install and use Azure CLI locally instead, this quickstart requires you to use Azure CLI version 2.0.49 or later. To find your installed version, run `az --version`. See [Install Azure CLI](/cli/azure/install-azure-cli) for install or upgrade info.

## Register the feature for your subscription
The Routing Preference feature is currently in preview. Register the feature for your subscription as follows:
```azurecli
az feature register --namespace Microsoft.Network --name AllowRoutingPreferenceFeature
```

## Create a resource group
Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group in the **East US** Azure region:

```azurecli
  az group create --name myResourceGroup --location eastus
```
## Create a public IP address

Create a Public IP Address with routing preference of "Internet" type using command [az network public-ip create](/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create), with the format as shown below.

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

You can associate the above created public IP address with a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](associate-public-ip-address-vm.md#azure-cli) to associate the Public IP to your VM. You can also associate the public IP address created above with with an [Azure Load Balancer](../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

## Next steps

- Learn more about [routing preference in public IP addresses](routing-preference-overview.md). 
- [Configure routing preference for a VM using the Azure CLI](configure-routing-preference-virtual-machine-cli.md).

