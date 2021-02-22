---
title: Create a public IP - Azure portal
description: Learn how to create a public IP in the Azure portal
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 02/22/2021
ms.author: allensu

---
# Create a public IP address using the Azure portal

This article shows you how to create a public IP address resource using the Azure portal. For more information on which resources this can be associated to, the difference between Basic and Standard SKU, and other related information, please see [Public IP addresses](./public-ip-addresses.md).  For this example, we will focus on IPv4 addresses only; for more information on IPv6 addresses, see [IPv6 for Azure VNet](./ipv6-overview.md).

# [**Standard SKU**](#tab/option-create-public-ip-standard-zones)

Use the following steps to create a standard zone-redundant public IP address named **myStandardZRPublicIP**.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource**. 
3. In the search box, enter **Public IP address**. Select **Public IP address** in the search results.
4. In the **Public IP address** page, select **Create**.
5. On the **Create public IP address** page, enter or select the following information: 

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4                 |    
    | SKU                     | Select **Standard**         |
    | Tier*                   | Select **Regional**         |
    | Name                    | Enter **myStandardZRPublicIP**          |
    | IP address assignment   | Note this will be locked as "Static"                                        |
    | Routing Preference      | Leave the default of **Microsoft network**. </br> For more information on routing preference, see [What is routing preference (preview)?](./routing-preference-overview.md). |
    | Idle Timeout (minutes)  | Leave the default of **4**.        |
    | DNS name label          | Leave the value blank.    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new** , enter **myResourceGroup**, then select **OK** |
    | Location                | Select **East US 2**      |
    | Availability Zone       | Select **Zone-Redundant**, No Zone, or pick specific Zone (see note below) |

:::image type="content" source="./media/create-public-ip-portal/create-standard-ip.png" alt-text="Create standard IP address in Azure portal" border="false":::


Note that these are only valid selections in regions with [Availability Zones](../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).  (You can also select a specific zone in these regions, though it will not be resilient to zonal failure.)  For more information on availability zones, see [Availability zones overview](https://docs.microsoft.com/azure/availability-zones/az-overview).

\* = Tier relates to the [Cross-region load balancer](../load-balancer/cross-region-overview.md) functionality, currently in Preview.

# [**Basic SKU**](#tab/option-create-public-ip-basic)

Use the following steps to create a basic static public IP address named **myBasicPublicIP**.  Basic Public IPs do not have the concept of availability zones.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource**. 
3. In the search box, enter **Public IP address**. Select **Public IP address** in the search results.
4. In the **Public IP address** page, select **Create**.
5. On the **Create public IP address** page, enter or select the following information: 

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4                 |    
    | SKU                     | Select **Basic**         |
    | Name                    | Enter *myBasicPublicIP*          |
    | Routing Preference      | Leave the default of **Microsoft network**. </br> For more information on routing preference, see [What is routing preference (preview)?](./routing-preference-overview.md). |
    | IP address assignment   | Select **Static** (see note below)                                     |
    | Idle Timeout (minutes)  | Leave the default of **4**.       |
    | DNS name label          | Leave the value blank    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new** , enter **myResourceGroup**, then select **OK** |
    | Location                | Select **East US 2**      |

:::image type="content" source="./media/create-public-ip-portal/create-standard-ip.png" alt-text="Create standard IP address in Azure portal" border="false":::

If it is acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected.

---

## Additional information 

For more details on the individual fields listed above, please see [Manage public IP addresses](./virtual-network-public-ip-address.md#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](./associate-public-ip-address-vm.md#azure-portal)
- Learn more about [public IP addresses](./public-ip-addresses.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).
