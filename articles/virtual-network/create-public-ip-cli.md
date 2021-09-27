---
title: Create a public IP - Azure CLI
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP using Azure CLI
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 05/05/2021
ms.author: allensu

---
# Create a public IP address using Azure CLI

This article shows you how to create a public IP address resource using Azure CLI. 

For more information on resources that support public IPs, see [Public IP addresses](./public-ip-addresses.md).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create standard SKU public IP with zones

In this section, you'll create a public IP with zones. Public IP addresses can be zone-redundant or zonal.

### Zone redundant

>[!NOTE]
>The following command works for API version 2020-08-01 or later.  For more information about the API version currently being used, please refer to [Resource Providers and Types](../azure-resource-manager/management/resource-providers-and-types.md).

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a standard zone-redundant public IPv4 address named **myStandardZRPublicIP** in **myResourceGroup**.  

To create an IPv6 address, modify the **version** parameter to **IPv6**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myStandardZRPublicIP \
    --version IPv4 \
    --sku Standard \
    --zone 1 2 3
```
> [!IMPORTANT]
> For versions of the API older than 2020-08-01, execute the command without specifying a zone parameter to create a zone-redundant IP address. 
>

### Zonal

To create a standard zonal public IPv4 address in Zone 2 named **myStandardZonalPublicIP** in **myResourceGroup**, use the following command.

To create an IPv6 address, modify the **version** parameter to **IPv6**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupLB \
    --name myStandardZonalPublicIP \
    --version IPv4 \
    --sku Standard \
    --zone 2
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).


## Create standard public IP without zones

In this section, you'll create a non-zonal IP address.  

>[!NOTE]
>The following command works for API version 2020-08-01 or later.  For more information about the API version currently being used, please refer to [Resource Providers and Types](../azure-resource-manager/management/resource-providers-and-types.md).

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a standard public IPv4 address as a non-zonal resource named **myStandardPublicIP** in **myResourceGroup**. 

To create an IPv6 address, modify the **version** parameter to **IPv6**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myStandardPublicIP \
    --version IPv4 \
    --sku Standard
```
The removal of the **zone** parameter in the command is valid in all regions.  

The removal of the **zone** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

## Create a basic public IP

In this section, you'll create a basic IP. Basic public IPs don't support availability zones.

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a basic static public IPv4 address named **myBasicPublicIP** in **myResourceGroup**.

To create an IPv6 address, modify the **version** parameter to **IPv6**. 

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myBasicPublicIP \
    --version IPv4 \
    --sku Basic \
    --allocation-method Static
```
If it's acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the AllocationMethod to **Dynamic**. 

>[!NOTE]
> A basic IPv6 address must always be 'Dynamic'.

## Routing Preference and Tier

Standard SKU static public IPv4 addresses support Routing Preference or the Global Tier feature.

### Routing Preference

By default, the routing preference for public IP addresses is set to "Microsoft network", which delivers traffic over Microsoft's global wide area network to the user.  

The selection of **Internet** minimizes travel on Microsoft's network, instead using the transit ISP network to deliver traffic at a cost-optimized rate.  

For more information on routing preference, see [What is routing preference (preview)?](./routing-preference-overview.md).

The command creates a new standard zone-redundant public IPv4 address with a routing preference of type **Internet**:

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myStandardZRPublicIP-RP \
    --version IPv4 \
    --ip-tags 'RoutingPreference=Internet' \
    --sku Standard \
    --zone 1 2 3
```

### Tier

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers.  

For more information, see [Cross-region load balancer](../load-balancer/cross-region-overview.md).

The following command creates a global IPv4 address. This address can be associated with the frontend of a cross-region load balancer.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myStandardPublicIP-Global \
    --version IPv4 \
    --tier global \
    --sku Standard \
```
>[!NOTE]
>Global tier addresses don't support Availability Zones.

## Additional information 

For more information on the individual parameters listed in this how-to, see [Manage public IP addresses](./virtual-network-public-ip-address.md#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](./associate-public-ip-address-vm.md#azure-portal).
- Learn more about [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
