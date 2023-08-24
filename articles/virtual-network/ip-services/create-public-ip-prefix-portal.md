---
title: 'Quickstart: Create a public IP address prefix - Azure portal'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP address prefix using the Azure portal.
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 08/24/2023
ms.custom: mode-ui
---

# Quickstart: Create a public IP address prefix using the Azure portal

Learn about a public IP address prefix and how to create, change, and delete one. A public IP address prefix is a contiguous range of standard SKU public IP addresses. 

When you create a public IP address resource, you can assign a static public IP address from the prefix and associate the address to virtual machines, load balancers, or other resources. For more information, see [Public IP address prefix overview](public-ip-address-prefix.md).

## Prerequisites

- If you don't already have an Azure account, sign up for a [free trial account](https://azure.microsoft.com/free).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a public IP address prefix

### IPv4

In this section, you create a public IP prefix using the Azure portal. Use the following examples to create a IPv4 public IP prefix. To create a IPv6 public IP prefix, see [IPv6](#ipv6).

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP Prefixes**.

3. Select **+ Create**.

4. In **Create public IP prefix**, enter, or select the following information in the **Basics** tab:

# [**Default**](#tab/create-default)

| Setting | Value |
|---|---|
| **Project details** |  |
| Resource group | Select **Create new** and enter **test-rg**. </br> Select **OK**. |
| **Instance details** |  |
| Name | Enter **public-ip-prefix**. |
| Region | Select **East US 2**. |
| IP version | Select **IPv4**. |
| Prefix ownership | Select **Microsoft owned**. |
| Prefix size | Select your prefix size. |
| Tier | Leave the default of **Regional**. |
| Routing preference | Leave the default of **Microsoft network**. |
| Availability zone | Leave the default of **Zone-redundant**. |

:::image type="content" source="./media/create-public-ip-prefix-portal/create-prefix-ipv4.png" alt-text="Screenshot of create public IP address prefix with default settings in the Azure portal.":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

# [**Routing preference**](#tab/create-routing-preference)

This section shows you how to configure the [routing preference](routing-preference-overview.md) for an ISP network (**Internet** option) for a public IP prefix. After you create the public IP prefix, you can create public IP addresses and associate them with the following Azure resources:

- Azure Virtual Machines
- Azure Virtual Machine Scale Set
- Azure Kubernetes Service
- Azure Load Balancer
- Azure Application Gateway
- Azure Firewall

By default, the routing preference for a public IP address is set to the Microsoft global network for all Azure services and can be associated with any Azure service.

> [!NOTE]
> Although you can create a public IP prefix with either an IPv4 or IPv6 prefix, the **Internet** option of **Routing preference** supports only IPv4.

| Setting | Value |
|---|---|
| **Project details** |  |
| Resource group | Select **Create new** and enter **test-rg**. </br> Select **OK**. |
| **Instance details** |  |
| Name | Enter **public-ip-prefix**. |
| Region | Select **East US 2**. |
| IP version | Select **IPv4**. |
| Prefix ownership | Select **Microsoft owned**. |
| Prefix size | Select your prefix size. |
| Tier | Leave the default of **Regional**. |
| Routing preference | Select **Internet**. |

:::image type="content" source="./media/create-public-ip-prefix-portal/create-prefix-ipv4-routing.png" alt-text="Screenshot of create public IP address prefix with routing preference in the Azure portal.":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

# [**Tier**](#tab/create-tier)

Public IP prefixes are associated with a single region. The **Global** tier spans an IP address across multiple regions and is required for the front ends of cross-region load balancers. For a **Global** tier, **Region** must be a home region. For more information, see [Cross-region load balancer](../../load-balancer/cross-region-overview.md) and [Home regions](/azure/load-balancer/cross-region-overview#home-regions).

| Setting | Value |
|---|---|
| **Project details** |  |
| Resource group | Select **Create new** and enter **test-rg**. </br> Select **OK**. |
| **Instance details** |  |
| Name | Enter **public-ip-prefix**. |
| Region | Select **East US 2**. |
| IP version | Select **IPv4**. |
| Prefix ownership | Select **Microsoft owned**. |
| Prefix size | Select your prefix size. |
| Tier | Select **Global**. |

:::image type="content" source="./media/create-public-ip-prefix-portal/create-prefix-ipv4-tier.png" alt-text="Screenshot of create public IP address prefix with global tier in the Azure portal.":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

---

### IPv6

In this section, you create a public IP prefix using the Azure portal. Use the following examples to create a IPv6 public IP prefix.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP Prefixes**.

3. Select **+ Create**.

4. In **Create public IP prefix**, enter, or select the following information in the **Basics** tab:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Resource group | Select **Create new** and enter **test-rg**. </br> Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **public-ip-prefix**. |
    | Region | Select **East US 2**. |
    | IP version | Select **IPv6**. |
    | Prefix size | Select your prefix size. |
    | Availability zone | Leave the default of **Zone-redundant**. |

    :::image type="content" source="./media/create-public-ip-prefix-portal/create-prefix-ipv6.png" alt-text="Screenshot of create IPv6 public IP address prefix in the Azure portal.":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

## Create a static public IP address from a prefix

Once you create a prefix, you must create static IP addresses from the prefix. In this section, you create a static IP address from the prefix you created earlier.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP Prefixes**.

3. In **Public IP Prefixes**, select **public-ip-prefix**.

4. In **Overview** of **public-ip-prefix**, select **+ Add IP address**.

    :::image type="content" source="./media/create-public-ip-prefix-portal/add-ip-address.png" alt-text="Screenshot of add an IP address to public IP address prefix in the Azure portal.":::

5. Enter **public-ip-1** in **Name**. 

6. Leave the rest of the selections at the default.

7. Select **Add**.

    >[!NOTE]
    >Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](./public-ip-addresses.md#public-ip-addresses).

8. Select **Public IP addresses** in **Settings** to view the created IP address.

## Delete a prefix

In this section, you learn how to view or delete a prefix.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP Prefixes**.

3. In **Public IP Prefixes**, select **public-ip-prefix**.

4. Select **Delete** in the **Overview** section.

    >[!NOTE]
    >If addresses within the prefix are associated to public IP address resources, you must first delete the public IP address resources. See [delete a public IP address](virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address).

## Clean up resources

In this article, you created a public IP prefix and a public IP from that prefix. 

When you're done with the public IP prefix, delete the resource group and all of the resources it contains:

1. Search for and select **test-rg**.

2. Select **Delete resource group**.

3. Enter **test-rg** in **Enter resource group name to confirm deletion** and select **Delete**.

## Next steps

Advance to the next article to learn how to create a public IP address:
> [!div class="nextstepaction"]
> [Create public IP address using the Azure portal](create-public-ip-portal.md)
