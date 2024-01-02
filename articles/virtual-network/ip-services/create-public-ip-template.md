---
title: 'Quickstart: Create a public IP using a Resource Manager template'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP using a Resource Manager template
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 08/24/2023
ms.custom: mode-other
---

# Quickstart: Create a public IP address using a Resource Manager template

This article shows how to create a public IP address resource within a Resource Manager template.

For more information on resources this public IP can be associated to and the difference between the basic and standard SKUs, see [Public IP addresses](public-ip-addresses.md). 

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A resource group in your Azure subscription.
* An Azure Resource Manager template for the public IP sections.

## Create standard SKU public IP with zones

In this section, you create a public IP with zones. Public IP addresses can be zone-redundant or zonal.

### Zone redundant

The code in this section creates a standard zone-redundant public IPv4 address named **myStandardPublicIP**.

To create an IPv6 address, modify the **`publicIPAddressVersion`** parameter to **IPv6**.

Template section to add:

```JSON
{
  "apiVersion": "2020-08-01",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "myStandardPublicIP",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "Standard"
  },
  "zones": [
    "1",
    "2",
    "3"
  ],
  "properties": {
    "publicIPAllocationMethod": "Static",
    "publicIPAddressVersion": "IPv4"
  }
```
> [!IMPORTANT]
> For API versions older than 2020-08-01, use the code above without specifying a zone parameter for a Standard SKU to create a zone-redundant IP address. 
>

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

### Zonal

The code in this section creates a standard zonal public IPv4 address named **myStandardPublicIP-zonal**. 

To create a standard zonal public IP address in Zone 2, the **"zones"** property contains a '2'.

Template section to add:

```JSON
{
  "apiVersion": "2020-08-01",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "myStandardPublicIP-zonal",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "Standard"
  },
  "zones": [
    "2"
  ],
  "properties": {
    "publicIPAllocationMethod": "Static",
    "publicIPAddressVersion": "IPv4"
  }
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

## Create standard public IP without zones

In this section, you create a non-zonal IP address. 

The code in this section creates a standard no-zone public IPv4 address named **myStandardPublicIP**. The code section is valid for all regions with or without [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

To create an IPv6 address, modify the **publicIPAddressVersion** parameter to **IPv6**.

Template section to add:

```JSON
{
  "apiVersion": "2020-08-01",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "myStandardPublicIP-nozone",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "Standard"
  },
  "properties": {
    "publicIPAllocationMethod": "Static",
    "publicIPAddressVersion": "IPv4"
  }
```
> [!IMPORTANT]
> For API versions older than 2020-08-01, not specifying a zone parameter for a Standard SKU will create a zone-redundant IP address. 
>


## Create a basic public IP

In this section, you create a basic IP. Basic public IPs don't support availability zones. 

The code in this section creates a basic public IPv4 address named **myBasicPublicIP**.

To create an IPv6 address, modify the **publicIPAddressVersion** parameter to **IPv6**. 

Template section to add:

```JSON
{
  "apiVersion": "2020-08-01",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "myBasicPublicIP",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "Basic"
  },
  "properties": {
    "publicIPAllocationMethod": "Static",
    "publicIPAddressVersion": "IPv4"
  }
```

If it's acceptable for the IP address to change over time, **publicIPAllocationMethod** IP assignment can be selected by changing the AllocationMethod to **Dynamic**. 

>[!NOTE]
> A basic IPv6 address must always be 'Dynamic'.

## Routing preference and tier

Standard SKU static public IPv4 addresses support Routing Preference or the Global Tier feature.

### Routing preference

By default, the routing preference for public IP addresses is set to **Microsoft network**, which delivers traffic over Microsoft's global wide area network to the user.  

The selection of **Internet** minimizes travel on Microsoft's network, instead using the transit ISP network to deliver traffic at a cost-optimized rate.  

For more information on routing preference, see [What is routing preference (preview)?](routing-preference-overview.md).

To use Internet Routing preference for a standard zone-redundant public IPv4 address, the template section should look similar to:

```JSON
{
  "apiVersion": "2020-08-01",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "myStandardZRPublicIP-RP",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "Standard"
  },
  "zones": [
    "1",
    "2",
    "3"
  ],
  "properties": {
    "publicIPAllocationMethod": "Static",
    "publicIPAddressVersion": "IPv4",
    "ipTags": [
      {
        "ipTagType": "RoutingPreference",
        "tag": "Internet"
      }
    ]
  }
}
```

### Tier

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers.  

For more information, see [Cross-region load balancer](../../load-balancer/cross-region-overview.md).

To use a standard global public IPv4 address, the template section should look similar to:

```JSON
{
  "apiVersion": "2020-08-01",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "myStandardPublicIP-Global",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "Standard",
    "tier": "Global"
  },
  "properties": {
    "publicIPAllocationMethod": "Static",
    "publicIPAddressVersion": "IPv4"
  }
```

## Additional information 

For more information on the public IP properties listed in this article, see [Manage public IP addresses](virtual-network-public-ip-address.md#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](./associate-public-ip-address-vm.md)
- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
