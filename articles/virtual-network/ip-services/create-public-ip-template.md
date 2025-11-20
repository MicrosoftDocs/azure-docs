---
title: 'Quickstart: Create a public IP using a Resource Manager template'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP using a Resource Manager template
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 11/05/2025
# Customer intent: As a cloud administrator, I want to create a public IP address using a Resource Manager template, so that I can efficiently manage IP allocation and configurations for my cloud resources.
---

# Quickstart: Create a public IP address using a Resource Manager template

This article shows how to create a public IP address resource within a Resource Manager template.

:::image type="content" source="./media/create-public-ip-portal/public-ip-example-resources.png" alt-text="Diagram of an example use of a public IP address. A public IP address is assigned to a load balancer.":::

For more information on resources this public IP can be associated to, see [Public IP addresses](public-ip-addresses.md). 

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
* A resource group in your Azure subscription.
* An Azure Resource Manager template for the public IP sections.

## Create standard SKU public IP

In this section, you create a standard SKU public IP. Public IP addresses can be zone-redundant or zonal.

### Zone redundant (Standard)

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
>The above options for zones are only valid selections in regions with [Availability Zones](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

### Zone redundant (Standardv2)

The code in this section creates a standard v2 zone-redundant public IPv4 address named **myStandardv2PublicIP**. Standard v2 SKU public IP is required for use of the Standard v2 NAT Gateway with zone-redundancy.

To create an IPv6 address, modify the **`publicIPAddressVersion`** parameter to **IPv6**.

Template section to add:

```JSON
{
  "apiVersion": "2020-08-01",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "myStandardv2PublicIP",
  "location": "[resourceGroup().location]",
  "sku": {
    "name": "Standardv2"
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
>The above options for zones are only valid selections in regions with [Availability Zones](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

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