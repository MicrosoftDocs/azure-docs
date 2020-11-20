---
title: Create a public IP - Azure portal
description: Learn how to create a public IP in the Azure portal
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
# Quickstart: Create a public IP address using the Azure portal

This article shows you how to create a public IP address resource using the Azure portal. For more information on which resources this can be associated to, the difference between Basic and Standard SKU, and other related information, please see [Public IP addresses](https://docs.microsoft.com/azure/virtual-network/public-ip-addresses).  For this example, we will focus on IPv4 addresses only; for more information on IPv6 addresses, see [IPv6 for Azure VNet](https://docs.microsoft.com/azure/virtual-network/ipv6-overview).

# [**Standard SKU - Using zones**](#tab/option-create-public-ip-standard-zones)

Use the following steps to create a standard zone-redundant public IP address named **myStandardZRPublicIP**.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource**. 
3. In the search box, type *Public IP address*.
4. In the search results, select **Public IP address**. Next, in the **Public IP address** page, select **Create**.
5. On the **Create public IP address** page, enter or select the following information: 

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4                 |    
    | SKU                     | Select **Standard**         |
    | Name                    | Enter *myStandardZRPublicIP*          |
    | IP address assignment   | Note this will be locked as "Static"                                        |
    | Idle Timeout (minutes)  | Leave the value at 4        |
    | DNS name label          | Leave the value as blank    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new** , enter myResourceGroup, then select **OK** |
    | Location                | Select **East US 2**      |
    | Availability Zone       | Select **Zone-Redundant** or pick specific Zone (see note below) |

Note that these are only valid selections in regions with [Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview?toc=/azure/virtual-network/toc.json#availability-zones).  (You can also select a specific zone in these regions, though it will not be resilient to zonal failure.)

# [**Standard SKU - No zones**](#tab/option-create-public-ip-standard)

Use the following steps to create a standard public IP address as a non-zonal resource named **myStandardPublicIP**.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource**. 
3. In the search box, type *Public IP address*.
4. In the search results, select **Public IP address**. Next, in the **Public IP address** page, select **Create**.
5. On the **Create public IP address** page, enter or select the following information: 

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4                 |    
    | SKU                     | Select **Standard**         |
    | Name                    | Enter *myStandardPublicIP*          |
    | IP address assignment   | Note this will be locked as "Static"                                        |
    | Idle Timeout (minutes)  | Leave the value at 4        |
    | DNS name label          | Leave the value as blank    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new** , enter myResourceGroup, then select **OK** |
    | Location                | Select **East US 2**      |
    | Availability Zone       | Select **No Zone** (and see note below) |

This selection is valid in all regions and is the default selection for Standard Public IP addresses in regions without without [Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview?toc=/azure/virtual-network/toc.json#availability-zones).

# [**Basic SKU**](#tab/option-create-public-ip-basic)

Use the following steps to create a basic static public IP address named **myBasicPublicIP**.  Basic Public IPs do not have the concept of availability zones.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Create a resource**. 
3. In the search box, type *Public IP address*.
4. In the search results, select **Public IP address**. Next, in the **Public IP address** page, select **Create**.
5. On the **Create public IP address** page, enter or select the following information: 

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4                 |    
    | SKU                     | Select **Standard**         |
    | Name                    | Enter *myBasicPublicIP*          |
    | IP address assignment   | Choose **Static** (see note below)                                     |
    | Idle Timeout (minutes)  | Leave the value at 4        |
    | DNS name label          | Leave the value as blank    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new** , enter myResourceGroup, then select **OK** |
    | Location                | Select **East US 2**      |

If it is acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected.

---

## Additional information 

For more details on the individual fields listed above, please see [Manage public IP addresses](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address#create-a-public-ip-address).

## Next steps
- Associate a [public IP address to a Virtual Machine](https://docs.microsoft.com/azure/virtual-network/associate-public-ip-address-vm#azure-portal)
- Learn more about [public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses) in Azure.
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).