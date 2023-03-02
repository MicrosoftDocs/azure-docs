---
title: 'Quickstart: Create a public IP address prefix - Azure portal'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP address prefix using the Azure portal.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 10/01/2021
ms.author: allensu
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

In this section, you'll create a public IP prefix using the Azure portal.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP Prefixes**.

3. Select **+ Create**.

4. In **Create public IP prefix**, enter, or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**. </br> Enter **myRG**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myPublicIPPrefix**. |
    | Region | Select **(US) West US 2**. |
    | IP version | Leave the default of **IPv4**. |
    | Prefix ownership | Leave the default of **Microsoft owned** |
    | Prefix size | Select your prefix size. |
    | Availability Zone | Leave the default of **Zone-redundant** |

    :::image type="content" source="./media/create-public-ip-prefix-portal/create-public-ip-prefix.png" alt-text="Screenshot of create public IP address prefix in the Azure portal":::
    
    > [!NOTE]
    >To create an IPv6 prefix, choose **IPv6** for the **IP Version**.

     :::image type="content" source="./media/create-public-ip-prefix-portal/create-public-ipv6-prefix.png" alt-text="Screenshot of create public IPv6 address prefix in the Azure portal":::

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

## Create a static public IP address from a prefix

Once you create a prefix, you must create static IP addresses from the prefix. In this section, you'll create a static IP address from the prefix you created earlier.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP Prefixes**.

3. In **Public IP Prefixes**, select **myPublicIPPrefix**.

4. In **Overview** of **myPublicIPPrefix**, select **+ Add IP address**.

    :::image type="content" source="./media/create-public-ip-prefix-portal/add-ip-address.png" alt-text="Screenshot of create public IP address from prefix in the Azure portal":::

5. Enter **myPublicIP** in **Name**. 

6. Leave the rest of the selections at the default.

7. Select **Add**.

    >[!NOTE]
    >Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](./public-ip-addresses.md#public-ip-addresses).

8. Select **Public IP addresses** in **Settings** to view the created IP address.

## Delete a prefix

In this section, you'll learn how to view or delete a prefix.

1. In the search box at the top of the portal, enter **Public IP**.

2. In the search results, select **Public IP Prefixes**.

3. In **Public IP Prefixes**, select **myPublicIPPrefix**.

4. Select **Delete** in the **Overview** section.

    >[!NOTE]
    >If addresses within the prefix are associated to public IP address resources, you must first delete the public IP address resources. See [delete a public IP address](virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address).

## Clean up resources

In this article, you created a public IP prefix and a public IP from that prefix. 

When you're done with the public IP prefix, delete the resource group and all of the resources it contains:

1. Search for and select **QuickStartCreateIPPrefix-rg**.

2. Select **Delete resource group**.

3. Enter **QuickStartCreateIPPrefix-rg** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.
## Next steps

Advance to the next article to learn how to create a public IP address:
> [!div class="nextstepaction"]
> [Create public IP address using the Azure portal](create-public-ip-portal.md)
