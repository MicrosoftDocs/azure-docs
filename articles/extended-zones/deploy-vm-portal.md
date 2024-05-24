---
title: "Deploy a virtual machine in an Extended Zone - Portal"
description: Learn how to deploy a virtual machine in an Azure Extended Zone using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: quickstart  #Don't change
ms.date: 05/23/2024

---
  
# Quickstart: Deploy a virtual machine in an Extended Zone using the Azure portal
 
In this quickstart, you use the Azure portal to deploy a virtual machine in an Azure Extended Zone. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a virtual network in an Extended Zone

In this section, you create a virtual network in the Azure Extended Zone that you want to deploy a virtual machine to.

1. In the search box at the top of the portal, enter ***virtual network***. Select **Virtual networks** from the search results.

    :::image type="content" source="./media/deploy-vm-portal/portal-search.png" alt-text="Screenshot that shows how to search for virtual machines in the Azure portal.":::

1. In the **Virtual networks** page, select **+ Create**.

1. On the **Basics** tab of **Create virtual network**, enter or select the following information:

   | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Virtual network name | Enter *myVNet*. |
    | Region | Select **Deploy to an Azure Extended Zone**. </br> In  **Azure Extended Zones**, select the Azure extended zone that you want to create your virtual machine in. </br> Select the **Select** button. |

    :::image type="content" source="./media/deploy-vm-portal/create-vnet-basics.png" alt-text="Screenshot that shows the Basics tab of creating a virtual network in the Azure portal." lightbox="./media/deploy-vm-portal/create-vnet-basics.png":::

1. Select **Review + create**.

    :::image type="content" source="./media/deploy-vm-portal/review-create-vnet.png" alt-text="Screenshot that shows the Basics tab of creating a virtual network after selecting the Extended Zone." lightbox="./media/deploy-vm-portal/review-create-vnet.png":::

1. Review the settings, and then select **Create**.



## Related content

- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Deploy a storage account in an Extended Zone](deploy-storage-account.md)
- [Frequently asked questions](faq.md)
