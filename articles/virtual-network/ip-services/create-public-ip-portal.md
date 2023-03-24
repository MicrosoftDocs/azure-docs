---
title: 'Quickstart: Create a public IP address - Azure portal'
titleSuffix: Azure Virtual Network
description: In this quickstart, you learn how to create a public IP address for a Standard SKU and a Basic SKU. You also learn about routing preferences and tiers.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 03/24/2023
ms.custom: template-quickstart, mode-ui
---

# Quickstart: Create a public IP address using the Azure portal

In this quickstart, you learn how to create Azure public IP addresses, which you use for public connections to Azure resources. Public IP addresses are available in two SKUs: Basic and Standard. Two tiers of public IP addresses are available: regional and global. You can also set the routing preference of a public IP address when you create it: Microsoft network or Internet.

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

---

# [**Standard SKU**](#tab/option-1-create-public-ip-standard)

A public IP address with a Standard SKU is recommended for production workloads. For more information about SKUs, see [Public IP addresses](public-ip-addresses.md#sku).

## Create a Standard SKU public IP address

Follow these steps to create a public IPv4 address with a Standard SKU named myStandardPublicIP. To create an IPv6 address instead, choose **IPv6** for the **IP Version**:

1. In the portal, search for and select **Public IP addresses**.

1. On the **Public IP addresses** page, select **Create**.

1. On the **Basics** tab of the **Create public IP address** screen, enter or select the following values:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the group *TestRG*.
   - **Region**: Select **(US) East US 2**.
   - **Name**: Enter *myStandardPublicIP*.
   - **IP Version**: Select **IPv4**.
   - **SKU**: Select **Standard**.
   - **Availability zone**: Select **No Zone**.
   - **Tier**: Select **Regional**.
   - **IP address assignment**: Only option is **Static**.
   - **Routing preference**: Select **Microsoft network**.
   - **Idle timeout (minutes)**: Keep the default of **4**.
   - **DNS name label**: Leave the value blank.

   :::image type="content" source="./media/create-public-ip-portal/create-standard-ip.png" alt-text="Screenshot that shows the Create public IP address Basics tab settings for a Standard SKU.":::

1. Select **Review + create**. After validation succeeds, select **Create**.

> [!NOTE]
> In regions with [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select **No Zone** (default), a specific zone, or **Zone-redundant**. The choice depends on your specific domain failure requirements. In regions without availability zones, this field doesn't appear.

You can associate the public IP address you created with a Windows or Linux [virtual machine](../../virtual-machines/overview.md). For more information, see [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md#azure-cli). You can also associate a public IP address with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md) by assigning it to the load balancer front-end configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

# [**Basic SKU**](#tab/option-1-create-public-ip-basic)

>[!NOTE]
>A public IP address with a Standard SKU is recommended for production workloads. For more information about SKUs, see [Public IP addresses](public-ip-addresses.md#sku). Basic SKU public IPs don't support availability zones. If it's acceptable for the IP address to change over time, you can set **IP address assignment** to **Dynamic** instead of **Static**.

## Create a Basic SKU public IP address

Follow these steps to create a public IPv4 address with a Basic SKU named myBasicPublicIP:

1. In the portal, search for and select **Public IP addresses**.

1. On the **Public IP addresses** page, select **Create**.

1. On the **Basics** tab of the **Create public IP address** screen, enter or select the following values:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the group *TestRG*.
   - **Region**: Select **(US) East US 2**.
   - **Name**: Enter *myBasicPublicIP*.
   - **IP Version**: Select **IPv4**.
   - **SKU**: Select **Basic**.
   - **IP address assignment**: Select **Static**.
   - **Idle timeout (minutes)**: Keep the default of **4**.
   - **DNS name label**: Leave the value blank.

   :::image type="content" source="./media/create-public-ip-portal/create-basic-ip.png" alt-text="Screenshot that shows the Create public IP address Basics tab settings for a Basic SKU.":::

1. Select **Review + create**. After validation succeeds, select **Create**.

# [**Routing preference**](#tab/option-1-create-public-ip-routing-preference)

This section shows you how to configure the [routing preference](routing-preference-overview.md) for an ISP network (**Internet** option) for a public IP address. After you create the public IP address, you can associate it with the following Azure resources:

- Azure Virtual Machines
- Azure Virtual Machine Scale Set
- Azure Kubernetes Service
- Azure Load Balancer
- Azure Application Gateway
- Azure Firewall

By default, the routing preference for a public IP address is set to the Microsoft global network for all Azure services and can be associated with any Azure service.

> [!NOTE]
> Although you can create a public IP address with either an IPv4 or IPv6 address, the **Internet** option of **Routing preference** supports only IPv4.

## Create a public IP with internet routing

Follow these steps to create a public IPv4 address with a Standard SKU and routing preference of **Internet** named myStandardPublicIP-RP:

1. In the portal, search for and select **Public IP addresses**.

1. On the **Public IP addresses** page, select **Create**.

1. On the **Basics** tab of the **Create public IP address** screen, enter or select the following values:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the group *TestRG*.
   - **Region**: Select **(US) East US 2**.
   - **Name**: Enter *myStandardPublicIP-RP*.
   - **IP Version**: Select **IPv4**.
   - **SKU**: Select **Standard**.
   - **Availability zone**: Select **Zone-redundant**.
   - **Tier**: Select **Regional**.
   - **IP address assignment**: Only option is **Static**.
   - **Routing preference**: Select **Internet**.
   - **Idle timeout (minutes)**: Keep the default of **4**.
   - **DNS name label**: Leave the value blank.

1. Select **Review + create**. After validation succeeds, select **Create**.

:::image type="content" source="./media/create-public-ip-portal/routing-preference.png" alt-text="Screenshot that shows the Create public IP address Basics tab for a Standard SKU and internet routing setting.":::

> [!NOTE]
> In regions with [availability zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones), you have the option to select **No Zone** (default), a specific zone, or **Zone-redundant**. The choice depends on your specific domain failure requirements. In regions without availability zones, this field doesn't appear.

You can associate the public IP address you created with a Windows or Linux [virtual machine](../../virtual-machines/overview.md). For more information, see [Associate a public IP address to a virtual machine](./associate-public-ip-address-vm.md#azure-cli). You can also associate a public IP address with an [Azure Load Balancer](../../load-balancer/load-balancer-overview.md) by assigning it to the load balancer front-end configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

# [**Tier**](#tab/option-1-create-public-ip-tier)

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions and is required for the front ends of cross-region load balancers. For a **Global** tier, **Region** must be a home region. For more information, see [Cross-region load balancer](../../load-balancer/cross-region-overview.md) and [Home regions](/azure/load-balancer/cross-region-overview#home-regions).

## Create a global tier public IP

Follow these steps to create a public IPv4 address with a Standard SKU and a global tier named myStandardPublicIP-Global:

1. In the portal, search for and select **Public IP addresses**.

1. On the **Public IP addresses** page, select **Create**.

1. On the **Basics** tab of the **Create public IP address** screen, enter or select the following values:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the group *TestRG*.
   - **Region**: Select **(US) East US 2**.
   - **Name**: Enter *myStandardPublicIP-Global*.
   - **IP Version**: Select **IPv4**.
   - **SKU**: Select **Standard**.
   - **Availability zone**: Select **Zone-redundant**.
   - **Tier**: Select **Global**.
   - **IP address assignment**: Only option is **Static**.
   - **Routing preference**: Select **Microsoft network**.
   - **Idle timeout (minutes)**: Keep the default of **4**.
   - **DNS name label**: Leave the value blank.

1. Select **Review + create**. After validation succeeds, select **Create**.

:::image type="content" source="./media/create-public-ip-portal/tier.png" alt-text="Screenshot that shows the Create public IP address Basics tab for a Standard SKU and global tier setting.":::

You can associate the IP address you created with a cross-region load balancer. For more information, see [Tutorial: Create a cross-region load balancer using the Azure portal](../../load-balancer/tutorial-cross-region-portal.md).

---

## Clean up resources

When you're finished, delete the resource group and all of the resources it contains:

1. In the portal, search for and select **TestRG**.

1. From the **TestRG** screen, select **Delete resource group**.

1. Enter *TestRG* for **Enter resource group name to confirm deletion**, and then select **Delete**.

## Next steps

Advance to the next article to learn how to create a public IP prefix:
> [!div class="nextstepaction"]
> [Create a public IP prefix using the Azure portal](create-public-ip-prefix-portal.md)
