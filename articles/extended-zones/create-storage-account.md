---
title: "Tutorial: Deploy a storage account in an Extended Zone"
description: Learn how to deploy a storage account in an Azure Extended Zone.
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: tutorial
ms.date: 05/30/2024

---

# Tutorial: Create a storage account in an Azure Extended Zone

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a storage account in an Extended Zone.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a storage account in an Extended Zone

In this section, you create a storage account in an Extended Zone.

1. In the search box at the top of the portal, enter ***storage***. Select **Storage accounts** from the search results.

    :::image type="content" source="./media/create-storage-account/portal-search.png" alt-text="Screenshot that shows how to search for storage accounts in the Azure portal.":::

1. In the **Storage accounts** page, select **+ Create**.

1. On the **Basics** tab of **Create a storage account**, enter, or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project Details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Storage account name | Enter *myVNet*. |
    | Region | Select **Deploy to an Azure Extended Zone**. </br> In  **Azure Extended Zones**, select **Los Angeles**. </br> Select the **Select** button. |



## Clean up resources

If you're not going to continue to use this application, delete the resources that you created in this tutorial.

## Related content

- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Frequently asked questions](faq.md)
