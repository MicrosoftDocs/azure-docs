---
title: Create a public IP - Azure portal
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP using the Azure portal
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 05/04/2021
ms.author: allensu

---
# Create a public IP address using the Azure portal

This article shows how to create a public IP address resource using the Azure portal. 

For more information on resources this public IP can be associated to and the difference between the basic and standard SKUs, see [Public IP addresses](./public-ip-addresses.md). 

## Create a standard SKU public IP address

Use the following steps to create a standard public IPv4 address named **myStandardPublicIP**.  

> [!NOTE]
>To create an IPv6 address, choose **IPv6** for the **IP Version** parameter. If your deployment requires a dual stack configuration (IPv4 and IPv6 address), choose **Both**.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Public IP**.

3. In the search results, select **Public IP addresses**.

4. Select **+ Create**.

5. In **Create public IP address**, enter, or select the following information:

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4              |    
    | SKU                     | Select **Standard**         |
    | Tier                   | Select **Regional**    </br> For more information, see [Routing Preference and Tier](#routing-preference-and-tier)     |
    | Name                    | Enter **myStandardPublicIP**          |
    | IP address assignment   | Locked as **Static**                |
    | Routing Preference     | Select **Microsoft network**. </br> For more information, see [Routing Preference and Tier](#routing-preference-and-tier) |
    | Idle Timeout (minutes)  | Leave the default of **4**.        |
    | DNS name label          | Leave the value blank.    |
    | Subscription            | Select your subscription   |
    | Resource group          | Select **Create new**, enter **myResourceGroup**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**     |
    | Availability Zone       | Select **No Zone** |

6. Select **Create**.

:::image type="content" source="./media/create-public-ip-portal/create-standard-ip.png" alt-text="Create standard IP address in Azure portal" border="false":::

> [!NOTE]
> In regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../availability-zones/az-overview.md).

> [!NOTE]
> IPv6 isn't currently supported with Routing Preference or Cross-region load-balancing (Global Tier).

## Create a basic SKU public IP address

In this section, create a basic public IPv4 address named **myBasicPublicIP**. 

> [!NOTE]
> Basic public IPs don't support availability zones.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource**. 
3. In the search box, enter **Public IP address**. Select **Public IP address** in the search results.
4. In the **Public IP address** page, select **Create**.
5. On the **Create public IP address** page enter, or select the following information: 

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4                 |    
    | SKU                     | Select **Basic**         |
    | Name                    | Enter **myBasicPublicIP**          |
    | IP address assignment   | Select **Static**            |
    | Idle Timeout (minutes)  | Leave the default of **4**.       |
    | DNS name label          | Leave the value blank    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new**, enter **myResourceGroup**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**      |

6. Select **Create**.

:::image type="content" source="./media/create-public-ip-portal/create-basic-ip.png" alt-text="Create basic IP address in Azure portal" border="false":::

If it's acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the AllocationMethod to **Dynamic**. 

---

## Routing Preference and Tier

Standard SKU static public IPv4 addresses support Routing Preference or the Global Tier feature. Choose the routing preference and tier when creating a new public IP address.

### Routing Preference

By default, the routing preference for public IP addresses is set to "Microsoft network", which delivers traffic over Microsoft's global wide area network to the user.  

The selection of **Internet** minimizes travel on Microsoft's network, instead using the transit ISP network to deliver traffic at a cost-optimized rate.  

For more information on routing preference, see [What is routing preference (preview)?](./routing-preference-overview.md).

:::image type="content" source="./media/create-public-ip-portal/routing-preference.png" alt-text="Configure routing preference in the Azure portal" border="false":::

### Tier

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers.  

For more information, see [Cross-region load balancer](../load-balancer/cross-region-overview.md).

:::image type="content" source="./media/create-public-ip-portal/tier.png" alt-text="Configure tier in the Azure portal" border="false":::

## Additional information 

For more information on the individual fields listed above, see [Manage public IP addresses](./virtual-network-public-ip-address.md#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](./associate-public-ip-address-vm.md#azure-portal)
- Learn more about [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).