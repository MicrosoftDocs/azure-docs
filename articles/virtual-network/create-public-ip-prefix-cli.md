---
title: Create a public IP address prefix - Azure CLI
titlesuffix: Azure Virtual Network
description: Learn how to create a public IP address prefix using Azure CLI.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 07/13/2021
ms.author: allensu
---

# Create a public IP address prefix using Azure CLI

Learn about a public IP address prefix and how to create, change, and delete one. A public IP address prefix is a contiguous range of standard SKU public IP addresses. 

When you create a public IP address resource, you can assign a static public IP address from the prefix and associate the address to virtual machines, load balancers, or other resources. For more information, see [Public IP address prefix overview](public-ip-address-prefix.md).

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

## Create a public IP address prefix

In this section, you'll create a zone redundant, zonal, and non-zonal public IP prefix using Azure PowerShell. 

The prefixes in the examples are:

* **IPv4** - /28 (16 addresses)

* **IPv6** - /124 (16 addresses)

For more information on available prefix sizes, see [Prefix sizes](public-ip-address-prefix.md#prefix-sizes).

Create a public IP prefix with [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az_network_public_ip_prefix_create) named **myPublicIpPrefix** in the **eastus2** location.

### Zone redundant IPv4 prefix

To create a IPv4 public IP prefix, enter **IPv4** in the **IpAddressVersion** parameter. To create a zone redundant IPv4 prefix, enter **1,2,3** in the **Zone** parameter.

```azurecli-interactive
  az network public-ip prefix create \
    --length 28 \
    --name myPublicIpPrefix \
    --resource-group myResourceGroup \
    --location eastus2 \
    --version IPv4 \
    --zone 1 2 3
```

### Zonal IPv4 prefix

To create a IPv4 public IP prefix, enter **IPv4** in the **IpAddressVersion** parameter. Enter **2** in the **Zone** parameter to create a zonal IP prefix in zone 2.

```azurecli-interactive
  az network public-ip prefix create \
    --length 28 \
    --name myPublicIpPrefix \
    --resource-group myResourceGroup \
    --location eastus2 \
    --version IPv4 \
    --zone 2
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

### Non-zonal IPv4 prefix

To create a IPv4 public IP prefix, enter **IPv4** in the **IpAddressVersion** parameter. Remove the **Zone** parameter to create a non-zonal IP prefix.

```azurecli-interactive
  az network public-ip prefix create \
    --length 28 \
    --name myPublicIpPrefix \
    --resource-group myResourceGroup \
    --location eastus2 \
    --version IPv4
```

The removal of the **zone** parameter in the command is valid in all regions.  

The removal of the **zone** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

### Zone redundant IPv6 prefix

To create a IPv4 public IP prefix, enter **IPv6** in the **IpAddressVersion** parameter. To create a zone redundant IPv6 prefix, enter **1,2,3** in the **Zone** parameter.

```azurecli-interactive
  az network public-ip prefix create \
    --length 124 \
    --name myPublicIpPrefix \
    --resource-group myResourceGroup \
    --location eastus2 \
    --version IPv6 \
    --zone 1 2 3
```

### Zonal IPv6 prefix

To create a IPv6 public IP prefix, enter **IPv6** in the **IpAddressVersion** parameter. Enter **2** in the **Zone** parameter to create a zonal IP prefix in zone 2.

```azurecli-interactive
  az network public-ip prefix create \
    --length 124 \
    --name myPublicIpPrefix \
    --resource-group myResourceGroup \
    --location eastus2 \
    --version IPv6 \
    --zone 2
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

### Non-zonal IPv6 prefix

To create a IPv6 public IP prefix, enter **IPv6** in the **IpAddressVersion** parameter. Remove the **Zone** parameter to create a non-zonal IP prefix.

```azurecli-interactive
  az network public-ip prefix create \
    --length 124 \
    --name myPublicIpPrefix \
    --resource-group myResourceGroup \
    --location eastus2 \
    --version IPv6
```

The removal of the **zone** parameter in the command is valid in all regions.  

The removal of the **zone** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

## Create a static public IP address from a prefix

Once you create a prefix, you must create static IP addresses from the prefix. In this section, you'll create a static IP address from the prefix you created earlier.

Create a public IP address with [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) in the **myPublicIpPrefix** prefix.

### IPv4 address

To create a IPv4 public IP address, enter **IPv4** in the **IpAddressVersion** parameter.

```azurecli-interactive
  az network public-ip create \
    --name myPublicIP \
    --resource-group myResourceGroup \
    --allocation-method Static \
    --public-ip-prefix myPublicIpPrefix \
    --sku Standard \
    --version IPv4
```

### IPv6 address

To create a IPv6 public IP prefix, enter **IPv6** in the **IpAddressVersion** parameter.

```azurecli-interactive
  az network public-ip create \
    --name myPublicIP \
    --resource-group myResourceGroup \
    --allocation-method Static \
    --public-ip-prefix myPublicIpPrefix \
    --sku Standard \
    --version IPv6
```

>[!NOTE]
>Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](./public-ip-addresses.md#public-ip-addresses).

## Delete a prefix

In this section, you'll learn how to delete a prefix.

To delete a public IP prefix, use [az network public-ip prefix delete](/cli/azure/network/public-ip/prefix#az_network_public_ip_prefix_delete).

```azurecli-interactive
  az network public-ip prefix delete \
    --name myPublicIpPrefix \
    --resource-group myResourceGroup
```

>[!NOTE]
>If addresses within the prefix are associated to public IP address resources, you must first delete the public IP address resources. See [delete a public IP address](virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address).

## Clean up resources

In this article, you created a public IP prefix and a public IP from that prefix. 


When you're done with the public IP prefix, delete the resource group and all of the resources it contains with [az group delete](/cli/azure/group#az_group_delete).

```azurecli-interactive
  az group delete \
    --name myResourceGroup
```

## Next steps

- Learn about scenarios and benefits of using a [public IP prefix](public-ip-address-prefix.md).
