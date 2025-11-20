---
title: Deploy a NAT gateway after moving resources between regions
titleSuffix: Azure NAT gateway
description: Get started learning how to deploy and configure a new Azure NAT Gateway for resources moved to another region.
author: asudbring
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: how-to
ms.date: 09/12/2025
ms.custom: template-how-to
# Customer intent: As a network administrator, I want to create and configure a Azure NAT Gateway after moving resources to another region.
---

# Create and configure NAT gateway after moving resources to another region

In this article, you'll learn how to set up a NAT gateway after moving resources to a different region. You might want to move resources to a new Azure region that better suits your customers' location or meets your organization's needs and policies. 

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

> [!NOTE]
> NAT gateway instances can't directly be moved from one region to another. A workaround is to use Azure Resource Mover to move all the resources associated with the existing NAT gateway to the new region. You then create a new instance of NAT gateway in the new region and then associate the moved resources with the new instance. After the new NAT gateway is functional in the new region, you delete the old instance in the previous region.  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- **Owner** access in the subscription in which resources you want to move are located. 

- Resources from previous region moved to new region. For more information on moving resources to another region, see [Move resources to another region with Azure Resource Mover](../resource-mover/move-region-within-resource-group.md). Follow the steps in that article to move the resources in your previous region that are associated with the NAT gateway. After successful move of the resources, continue with the steps in this article.

## Create a new NAT gateway

After you move all the resources associated with the original NAT gateway instance to the new region and verify them, you can create a new NAT gateway instance. Then, you can associate the moved resources with the new NAT gateway.

1. In the search box at the top of the Azure portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **Create**.

1. Enter or select the following information in the **Basics** tab of **Create network address translation (NAT) gateway**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg** or your resource group or the existing resource group with the moved resources. |
    | **Instance details** |  |
    | NAT gateway name | Enter **nat-gateway**. |
    | Region | Select your region. This example uses **East US 2**. |
    | SKU | Select **Standard V2**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next**.

1. In the **Outbound IP** tab, select **+ Add public IP addresses or prefixes**.

1. In **Add public IP addresses or prefixes**, select **Public IP addresses**. Select an existing public IP address in your subscription or create a new public IP. In this example, it's **public-ip**.

1. Select **Next**.

1. In the **Networking** tab, in **Virtual network**, select your virtual network. In this example, it's **vnet-1**.

1. Leave the checkbox for **Default to all subnets** unchecked.

1. In **Select specific subnets**, select your subnet. In this example, it's **subnet-1**.

1. Select **Review + create**, then select **Create**.


## Test NAT gateway in new region

For steps on how to test the NAT gateway, see [Quickstart: Create a NAT gateway - Azure portal](quickstart-create-nat-gateway-portal.md#test-nat-gateway).

## Delete old instance of NAT gateway 

After you create the new NAT gateway and test the deployment, you can delete the source resources from the old region including the old NAT gateway instance.

## Next steps

For more information on moving resources in Azure, see:

- [Move NSGs to another region](../virtual-network/move-across-regions-nsg-portal.md).
- [Move public IP addresses to another region](../virtual-network/move-across-regions-publicip-portal.md).
- [Move a storage account to another region](../storage/common/storage-account-move.md?tabs=azure-portal)


