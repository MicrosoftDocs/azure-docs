---
title: 'Quickstart: Create a public IP address - Azure portal'
titleSuffix: Azure Virtual Network
description: In this quickstart, learn how to create a standard or basic SKU public IP address. You'll also learn about routing preference and tier.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 07/13/2022
ms.custom: template-quickstart, mode-ui
---

# Quickstart: Create a public IP address using the Azure portal

In this quickstart, you'll learn how to create an Azure public IP address. Public IP addresses in Azure are used for public connections to Azure resources. Public IP addresses are available in two SKUs: basic, and standard. Two tiers of public IP addresses are available: regional, and global.  The routing preference of a public IP address is set when created. Internet routing and Microsoft Network routing are the available choices.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

---

# [**Standard SKU**](#tab/option-1-create-public-ip-standard)

>[!NOTE]
>Standard SKU public IP is recommended for production workloads.  For more information about SKUs, see **[Public IP addresses](public-ip-addresses.md)**.

## Create a standard SKU public IP address

Use the following steps to create a standard public IPv4 address named **myStandardPublicIP**. 

> [!NOTE]
>To create an IPv6 address, choose **IPv6** for the **IP Version** parameter. If your deployment requires a dual stack configuration (IPv4 and IPv6 address), choose **Both**.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP addresses**.

3. Select **+ Create**.

4. In **Create public IP address**, enter, or select the following information:

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4              |    
    | SKU                     | Select **Standard**         |
    | Tier                   | Select **Regional**     |
    | Name                    | Enter **myStandardPublicIP**          |
    | IP address assignment   | Locked as **Static**                |
    | Routing Preference     | Select **Microsoft network**. |
    | Idle Timeout (minutes)  | Leave the default of **4**.        |
    | DNS name label          | Leave the value blank.    |
    | Subscription            | Select your subscription   |
    | Resource group          | Select **Create new**, enter **QuickStartCreateIP-rg**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**     |
    | Availability Zone       | Select **No Zone** |

5. Select **Create**.

:::image type="content" source="./media/create-public-ip-portal/create-standard-ip.png" alt-text="Screenshot of create standard IP address in Azure portal" border="false":::

> [!NOTE]
> In regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../../availability-zones/az-overview.md).

You can associate the above created public IP address with a [Windows](../../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md#azure-cli) to associate the public IP to your VM. You can also associate the public IP address created above with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

# [**Basic SKU**](#tab/option-1-create-public-ip-basic)

>[!NOTE]
>Standard SKU public IP is recommended for production workloads.  For more information about SKUs, see **[Public IP addresses](public-ip-addresses.md)**.

## Create a basic SKU public IP address

In this section, create a basic public IPv4 address named **myBasicPublicIP**. 

> [!NOTE]
> Basic public IPs don't support availability zones.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP addresses**.

3. Select **+ Create**.

4. On the **Create public IP address** page enter, or select the following information: 

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select **IPv4**                |    
    | SKU                     | Select **Basic**         |
    | Name                    | Enter **myBasicPublicIP**          |
    | IP address assignment   | Select **Static**            |
    | Idle Timeout (minutes)  | Leave the default of **4**.       |
    | DNS name label          | Leave the value blank    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new**, enter **QuickStartCreateIP-rg**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**      |

5. Select **Create**.

:::image type="content" source="./media/create-public-ip-portal/create-basic-ip.png" alt-text="Screenshot of create basic IP address in Azure portal" border="true":::

If it's acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the AllocationMethod to **Dynamic**. 

# [**Routing Preference**](#tab/option-1-create-public-ip-routing-preference)

This section shows you how to configure [routing preference](routing-preference-overview.md) via ISP network (**Internet** option) for a public IP address. After you create the public IP address, you can associate it with the following Azure resources:

* Virtual machine
* Virtual machine scale set
* Azure Kubernetes Service (AKS)
* Internet-facing load balancer
* Application Gateway
* Azure Firewall

By default, the routing preference for public IP address is set to the Microsoft global network for all Azure services and can be associated with any Azure service.

> [!NOTE]
>To create an IPv6 address, choose **IPv6** for the **IP Version** parameter. If your deployment requires a dual stack configuration (IPv4 and IPv6 address), choose **Both**.

## Create a public IP with Internet routing

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP addresses**.

3. Select **+ Create**.

4. In **Create public IP address**, enter, or select the following information:

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4              |    
    | SKU                     | Select **Standard**         |
    | Tier                   | Select **Regional**     |
    | Name                    | Enter **myStandardPublicIP-RP**          |
    | IP address assignment   | Locked as **Static**                |
    | Routing Preference     | Select **Internet**. |
    | Idle Timeout (minutes)  | Leave the default of **4**.        |
    | DNS name label          | Leave the value blank.    |
    | Subscription            | Select your subscription   |
    | Resource group          | Select **Create new**, enter **QuickStartCreateIP-rg**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**     |
    | Availability Zone       | Select **Zone redundant** |

5. Select **Create**.

:::image type="content" source="./media/create-public-ip-portal/routing-preference.png" alt-text="Screenshot of configure routing preference in the Azure portal" border="true":::

> [!NOTE]
> Public IP addresses are created with an IPv4 or IPv6 address. However, routing preference only supports IPV4 currently.

> [!NOTE]
> In regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select no-zone (default option), a specific zone, or zone-redundant. The choice will depend on your specific domain failure requirements. In regions without Availability Zones, this field won't appear. </br> For more information on availability zones, see [Availability zones overview](../../availability-zones/az-overview.md).

You can associate the above created public IP address with a [Windows](../../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md#azure-cli) to associate the public IP to your VM. You can also associate the public IP address created above with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

# [**Tier**](#tab/option-1-create-public-ip-tier)

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers.  

For more information, see [Cross-region load balancer](../../load-balancer/cross-region-overview.md).

## Create a global tier public IP

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP addresses**.

3. Select **+ Create**.

4. In **Create public IP address**, enter, or select the following information:

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4              |    
    | SKU                     | Select **Standard**         |
    | Tier                   | Select **Global**     |
    | Name                    | Enter **myStandardPublicIP-Global**          |
    | IP address assignment   | Locked as **Static**                |
    | Routing Preference     | Select **Microsoft**. |
    | Idle Timeout (minutes)  | Leave the default of **4**.        |
    | DNS name label          | Leave the value blank.    |
    | Subscription            | Select your subscription   |
    | Resource group          | Select **Create new**, enter **QuickStartCreateIP-rg**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**     |
    | Availability Zone       | Select **Zone redundant** |

5. Select **Create**.

:::image type="content" source="./media/create-public-ip-portal/tier.png" alt-text="Screenshot of configure tier in the Azure portal" border="true":::

You can associate the above created IP address with a cross-region load balancer. For more information, see [Tutorial: Create a cross-region load balancer using the Azure portal](../../load-balancer/tutorial-cross-region-portal.md).

---

## Clean up resources

If you're not going to continue to use this application, delete the public IP address with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. In the search results, select **Resource groups**.

3. Select **QuickStartCreateIP-rg**

4. Select **Delete resource group**.

5. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

Advance to the next article to learn how to create a public IP prefix:
> [!div class="nextstepaction"]
> [Create public IP prefix using the Azure portal](create-public-ip-prefix-portal.md)
