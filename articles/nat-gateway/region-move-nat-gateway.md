---
title: Create and configure NAT gateway after moving resources to another region
description: Learn how to configure a new NAT gateway for resources moved to another region.
author: asudbring
ms.author: allensu
ms.service: nat-gateway
ms.topic: how-to
ms.date: 01/04/2022
ms.custom: template-how-to
---

# Create and configure NAT gateway after moving resources to another region

In this article, learn how to configure a NAT gateway after moving resources to a different region. You might want to move resources to take advantage of a new Azure region that is better suited to your customers' geographical presence, other needs, or to meet internal policy and governance requirements, or to take advantage of your organization’s infrastructure.  

> [!NOTE]
> NAT gateway instances can't directly be moved from one region to another. A workaround is to use Azure Resource Mover to move all the resources associated with the existing NAT gateway to the new region. You then create a new instance of NAT gateway in the new region and then associate the moved resources with the new instance. After the new NAT gateway is functional in the new region, you delete the old instance in the previous region.  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- **Owner** access in the subscription in which resources you want to move are located. 

- Resources from previous region moved to new region. For more information on moving resources to another region, see [Move resources to another region with Azure Resource Mover](../resource-mover/move-region-within-resource-group.md). Follow the steps in that article to move the resources in your previous region that are associated with the NAT gateway. After successful move of the resources, continue with the steps in this article.

## Create a new NAT gateway

After you have moved all the resources associated with the original instance of NAT gateway to the new region and verified them, the following steps will enable you to create a new instance of NAT gateway. This new NAT gateway can then be associated with the moved resources. 

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways**.

2. Select **+ Create**.

3. In **Create network address translation (NAT) gateway**, enter or select the following information in the **Basics** tab.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup** in **Name**. </br> Select **OK**. </br> Instead, you can select the existing resource group associated with the moved resources in the subscription. |
    | **Instance details** |   |
    | Name | Enter **myNATgateway**. |
    | Region | Select the name of the new region. |
    | Availability Zone | Select **None**. Instead, you can select the zone of the moved resources if applicable. |
    | Idle timeout (minutes) | Enter **10**. |

4. Select the **Outbound IP** tab, or select **Next: Outbound IP** at the bottom of the page.

5. In the **Outbound IP** tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | Public IP addresses | Select **Create a new public IP address**. </br> Enter **myNATPublicIP** in **Name**. </br> Select **OK**. </br> Instead, you can select an existing public IP in your subscription if applicable. |

6. Select the **Subnet** tab, or select **Next: Subnet** at the bottom of the page.

7. Select the pull-down box under **Virtual network** in the **Subnet** tab. Select the **Virtual Network** that you **moved** using Azure Resource Mover.

8. In **Subnet name**, select the **subnet** that you **moved** using Azure Resource Mover.

9. Select the **Review + create** tab, or select the **Review + create** button at the bottom of the page.

10. Select **Create**.

## Test NAT gateway in new region

For steps on how to test the NAT gateway, see [Quickstart: Create a NAT gateway - Azure portal](quickstart-create-nat-gateway-portal.md#test-nat-gateway).

## Delete old instance of NAT gateway 

After you have created new NAT gateway and have tested it, you can delete the source resources from the old region. This step will automatically delete the original NAT gateway. 

## Next steps

For more information on moving resources in Azure, see:

- [Move NSGs to another region](../virtual-network/move-across-regions-nsg-portal.md).
- [Move public IP addresses to another region](../virtual-network/move-across-regions-publicip-portal.md).
- [Move a storage account to another region](../storage/common/storage-account-move.md?tabs=azure-portal)


