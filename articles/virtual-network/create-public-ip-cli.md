---
title: Create a public IP - Azure CLI
description: Learn how to create a public IP using Azure CLI
services: virtual-network
documentationcenter: na
author: blehr
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/28/2020
ms.author: blehr

---
# Quickstart: Create a public IP address using Azure CLI

This article shows you how to create a public IP address resource using Azure CLI. For more information on which resources this can be associated to, the difference between Basic and Standard SKU, and other related information, please see [Public IP addresses](./public-ip-addresses.md).  For this example, we will focus on IPv4 addresses only; for more information on IPv6 addresses, see [IPv6 for Azure VNet](./ipv6-overview.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create) named **myResourceGroup** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location eastus2
```

## Create public IP

---
# [**Standard SKU - Using zones**](#tab/option-create-public-ip-standard-zones)

>[!NOTE]
>The following command works for API version 2020-08-01 or later.  For more information about the API version currently being used, please refer to [Resource Providers and Types](../azure-resource-manager/management/resource-providers-and-types.md).

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a standard zone-redundant public IP address named **myStandardZRPublicIP** in **myResourceGroup**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myStandardZRPublicIP \
    --sku Standard
    --zone 1 2 3
```
> [!IMPORTANT]
> For versions of the API older than 2020-08-01, run the command above without specifying a zone parameter to create a zone-redundant IP address. 
>

In order to create a standard zonal public IP address in Zone 2 named **myStandardZonalPublicIP** in **myResourceGroup**, use the following command:

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroupLB \
    --name myStandardZonalPublicIP \
    --sku Standard \
    --zone 2
```

Note that the above options for zones are only valid selections in regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

# [**Standard SKU - No zones**](#tab/option-create-public-ip-standard)

>[!NOTE]
>The following command works for API version 2020-08-01 or later.  For more information about the API version currently being used, please refer to [Resource Providers and Types](../azure-resource-manager/management/resource-providers-and-types.md).

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a standard public IP address as a non-zonal resource named **myStandardPublicIP** in **myResourceGroup**.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myStandardPublicIP \
    --sku Standard
```
This selection is valid in all regions and is the default selection for Standard Public IP addresses in regions without [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

# [**Basic SKU**](#tab/option-create-public-ip-basic)

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a basic static public IP address named **myBasicPublicIP** in **myResourceGroup**.  Basic Public IPs do not have the concept of availability zones.

```azurecli-interactive
  az network public-ip create \
    --resource-group myResourceGroup \
    --name myBasicPublicIP \
    --sku Basic \
    --allocation-method Static
```
If it is acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the allocation-method to 'Dynamic'.

---

## Additional information 

For more details on the individual variables listed above, please see [Manage public IP addresses](./virtual-network-public-ip-address.md#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](./associate-public-ip-address-vm.md#azure-portal).
- Learn more about [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
