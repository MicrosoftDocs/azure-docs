---
title: Add IPv6 to an IPv4 application in Azure virtual network - Azure CLI
titlesuffix: Azure Load Balancer
description: This article shows how to deploy IPv6 addresses to an existing application in an Azure virtual network for a Standard Load Balancer using Azure CLI.
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 09/30/2024
ms.author: mbender
ms.custom: devx-track-azurecli, template-how-to
ms.devlang: azurecli
ROBOTS: NOINDEX
---

# Add IPv6 to an IPv4 application in Azure virtual network using Azure CLI

This article shows you how to add IPv6 addresses to an application that is using IPv4 public IP address in an Azure virtual network for a Standard Load Balancer using Azure CLI. The in-place upgrade includes a virtual network and subnet, a Standard Load Balancer with IPv4 + IPV6 frontend configurations, VMs with NICs that have a IPv4 + IPv6 configurations, network security group, and public IPs.

## Prerequisites

- This article assumes that you deployed a Standard Load Balancer as described in [Quickstart: Create a Standard Load Balancer - Azure CLI](../load-balancer/quickstart-load-balancer-standard-public-cli.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create IPv6 addresses

Create public IPv6 address with [az network public-ip create](/cli/azure/network/public-ip) for your Standard Load Balancer. The following example creates an IPv6 public IP address named *PublicIP_v6* in the *myResourceGroupSLB* resource group:

```azurecli-interactive
az network public-ip create \
--name PublicIP_v6 \
--resource-group MyResourceGroupSLB \
--location EastUS \
--sku Standard \
--allocation-method static \
--version IPv6
```

## Configure IPv6 load balancer frontend

Configure the load balancer with the new IPv6 IP address using [az network lb frontend-ip create](/cli/azure/network/lb/frontend-ip#az-network-lb-frontend-ip-create) as follows:

```azurecli-interactive
az network lb frontend-ip create \
--lb-name myLoadBalancer \
--name dsLbFrontEnd_v6 \
--resource-group MyResourceGroupSLB \
--public-ip-address PublicIP_v6
```

## Configure IPv6 load balancer backend pool

Create the backend pool for NICs with IPv6 addresses using [az network lb address-pool create](/cli/azure/network/lb/address-pool#az-network-lb-address-pool-create) as follows:

```azurecli-interactive
az network lb address-pool create \
--lb-name myLoadBalancer \
--name dsLbBackEndPool_v6 \
--resource-group MyResourceGroupSLB
```

## Configure IPv6 load balancer rules

Create IPv6 load balancer rules with [az network lb rule create](/cli/azure/network/lb/rule#az-network-lb-rule-create).

```azurecli-interactive
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

```azurecli-interactive
az network vnet update \
--name myVnet  \
--resource-group MyResourceGroupSLB \
--address-prefixes  "10.0.0.0/16"  "fd00:db8:deca::/48"

az network vnet subnet update \
--vnet-name myVnet \
--name mySubnet \
--resource-group MyResourceGroupSLB \
--address-prefixes  "10.0.0.0/24"  "fd00:db8:deca:deed::/64"  
```

## Add IPv6 configuration to NICs

Configure the VM NICs with an IPv6 address using [az network nic ip-config create](/cli/azure/network/nic/ip-config#az-network-nic-ip-config-create) as follows:

```azurecli-interactive
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

## View IPv6 dual-stack virtual network in Azure portal

You can view the IPv6 dual-stack virtual network in Azure portal as follows:
1. In the portal's search bar, enter **virtual networks** and 
1. In the **Virtual Networks** window, select **myVNet**.
1.  Select **Connected devices** under **Settings** to view the attached network interfaces. The dual stack virtual network shows the three NICs with both IPv4 and IPv6 configurations.

    :::image type="content" source="media/ipv6-add-to-existing-vnet-powershell/ipv6-dual-stack-addresses.png" alt-text="Screenshot of connected devices settings displaying IPv4 and IPv6 addresses on network interfaces.":::


## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, VM, and all related resources.

```azurecli-interactive
 az group delete --name MyAzureResourceGroupSLB
```

## Next steps

In this article, you updated an existing Standard Load Balancer with a IPv4 frontend IP configuration to a dual stack (IPv4 and IPv6) configuration. You also added IPv6 configurations to the NICs of the VMs in the backend pool. To learn more about IPv6 support in Azure virtual networks, see [What is IPv6 for Azure Virtual Network?](../virtual-network/ip-services/ipv6-overview.md)
