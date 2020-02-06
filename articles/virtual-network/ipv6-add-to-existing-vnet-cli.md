---
title: Add IPv6 to an IPv4 application in Azure virtual network - Azure CLI
titlesuffix: Azure Virtual Network
description: This article shows how to deploy IPv6 addresses to an existing application in Azure virtual network using Azure CLI.
services: virtual-network
documentationcenter: na
author: KumudD
manager: twooley
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/23/2019
ms.author: kumud
---

# Add IPv6 to an IPv4 application in Azure virtual network - Azure CLI (Preview)

This article shows you how to add IPv6 addresses to an application that is using IPv4 public IP address in an Azure virtual network for a Standard Load Balancer using Azure CLI. The in-place upgrade includes a virtual network and subnet, a Standard Load Balancer with IPv4 + IPV6 frontend configurations, VMs with NICs that have a IPv4 + IPv6 configurations, network security group, and public IPs.

> [!Important]
> IPv6 support for Azure Virtual Network is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use Azure CLI locally instead, this quickstart requires you to use Azure CLI version 2.0.28 or later. To find your installed version, run `az --version`. See [Install Azure CLI](/cli/azure/install-azure-cli) for install or upgrade info.

## Prerequisites

### Register the service

Before you deploy a dual stack application in Azure, you must configure your subscription for this preview feature using the following Azure CLI:

```azurecli
az feature register --name AllowIPv6VirtualNetwork --namespace Microsoft.Network
az feature register --name AllowIPv6CAOnStandardLB --namespace Microsoft.Network
```
It takes up to 30 minutes for feature registration to complete. You can check your registration status by running the following Azure CLI command:

```azurelci
az feature show --name AllowIPv6VirtualNetwork --namespace Microsoft.Network
az feature show --name AllowIPv6CAOnStandardLB --namespace Microsoft.Network
```
After the registration is complete, run the following command:

```azurelci
az provider register --namespace Microsoft.Network
```

### Create a Standard Load Balancer
This article assumes that you deployed a Standard Load Balancer as described in [Quickstart: Create a Standard Load Balancer - Azure CLI](../load-balancer/quickstart-load-balancer-standard-public-cli.md).

## Create IPv6 addresses

Create public IPv6 address with with [az network public-ip create](/cli/azure/network/public-ip) for your Standard Load Balancer. The following example creates an IPv6 public IP address named *PublicIP_v6* in the *myResourceGroupSLB* resource group:

```azurecli
  
az network public-ip create \
--name PublicIP_v6 \
--resource-group MyResourceGroupSLB \
--location EastUS \
--sku Standard \
--allocation-method static \
--version IPv6
```

## Configure IPv6 load balancer frontend

COnfigure the load balancer with the new IPv6 IP address using [az network lb frontend-ip create](https://docs.microsoft.com/cli/azure/network/lb/frontend-ip?view=azure-cli-latest#az-network-lb-frontend-ip-create) as follows:

```azurecli
az network lb frontend-ip create \
--lb-name myLoadBalancer \
--name dsLbFrontEnd_v6 \
--resource-group MyResourceGroupSLB \
--public-ip-address PublicIP_v6
```

## Configure IPv6 load balancer backend pool

Create the backend pool for NICs with IPv6 addresses using [az network lb address-pool create](https://docs.microsoft.com/cli/azure/network/lb/address-pool?view=azure-cli-latest#az-network-lb-address-pool-create) as follows:

```azurecli
az network lb address-pool create \
--lb-name myLoadBalancer \
--name dsLbBackEndPool_v6 \
--resource-group MyResourceGroupSLB
```

## Configure IPv6 load balancer rules

Create IPv6 load balancer rules with [az network lb rule create](https://docs.microsoft.com/cli/azure/network/lb/rule?view=azure-cli-latest#az-network-lb-rule-create).

```azurecli
az network lb rule create \
--lb-name myLoadBalancer \
--name dsLBrule_v6 \
--resource-group MyResourceGroupSLB \
--frontend-ip-name dsLbFrontEnd_v6 \
--protocol Tcp \
--frontend-port 80 \
--backend-port 80 \
--backend-pool-name dsLbBackEndPool_v6
```

## Add IPv6 address ranges

Add IPv6 address ranges to the virtual network and subnet hosting the load balancer as follows:

```azurecli
az network vnet update \
--name myVnet  `
--resource-group MyResourceGroupSLB \
--address-prefixes  "10.0.0.0/16"  "ace:cab:deca::/48"

az network vnet subnet update \
--vnet-name myVnet \
--name mySubnet \
--resource-group MyResourceGroupSLB \
--address-prefixes  "10.0.0.0/24"  "ace:cab:deca:deed::/64"  
```

## Add IPv6 configuration to NICs

Configure the VM NICs with an IPv6 address using [az network nic ip-config create](https://docs.microsoft.com/cli/azure/network/nic/ip-config?view=azure-cli-latest#az-network-nic-ip-config-create) as follows:

```azurecli
az network nic ip-config create \
--name dsIp6Config_NIC1 \
--nic-name myNicVM1 \
--resource-group MyResourceGroupSLB \
--vnet-name myVnet \
--subnet mySubnet \
--private-ip-address-version IPv6 \
--lb-address-pools dsLbBackEndPool_v6 \
--lb-name dsLB

az network nic ip-config create \
--name dsIp6Config_NIC2 \
--nic-name myNicVM2 \
--resource-group MyResourceGroupSLB \
--vnet-name myVnet \
--subnet mySubnet \
--private-ip-address-version IPv6 \
--lb-address-pools dsLbBackEndPool_v6 \
--lb-name myLoadBalancer

az network nic ip-config create \
--name dsIp6Config_NIC3 \
--nic-name myNicVM3 \
--resource-group MyResourceGroupSLB \
--vnet-name myVnet \
--subnet mySubnet \
--private-ip-address-version IPv6 \
--lb-address-pools dsLbBackEndPool_v6 \
--lb-name myLoadBalancer

```

## View IPv6 dual stack virtual network in Azure portal
You can view the IPv6 dual stack virtual network in Azure portal as follows:
1. In the portal's search bar, enter *myVnet*.
2. When **myVnet** appears in the search results, select it. This launches the **Overview** page of the dual stack virtual network named *myVNet*. The dual stack virtual network shows the three NICs with both IPv4 and IPv6 configurations located in the dual stack subnet named *mySubnet*.

  ![IPv6 dual stack virtual network in Azure](./media/ipv6-add-to-existing-vnet-powershell/ipv6-dual-stack-vnet.png)

> [!NOTE]
> The IPv6 for Azure virtual network is available in the Azure portal in read-only for this preview release.

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, VM, and all related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyAzureResourceGroupSLB
```

## Next steps

In this article, you updated an existing Standard Load Balancer with a IPv4 frontend IP configuration to a dual stack (IPv4 and IPv6) configuration. You also added IPv6 configurations to the NICs of the VMs in the backend pool. To learn more about IPv6 support in Azure virtual networks, see [What is IPv6 for Azure Virtual Network?](ipv6-overview.md)
