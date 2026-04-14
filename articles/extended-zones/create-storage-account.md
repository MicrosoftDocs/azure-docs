---
title: Deploy a Storage Account in an Azure Extended Zone
description: Learn how to deploy a storage account in an Azure extended zone.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 02/25/2026
---

# Create a storage account in an Azure extended zone

In this article, you learn how to create an Azure storage account in an extended zone.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- Access to an extended zone. For more information, see [Request access to an Azure extended zone](request-access.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create a storage account in an extended zone

In this section, you create a storage account in an extended zone.

1. In the search box at the top of the portal, enter **storage**. Select **Storage accounts** from the search results.

    :::image type="content" source="./media/create-storage-account/portal-search.png" alt-text="Screenshot that shows how to search for storage accounts in the Azure portal.":::

1. On the **Storage accounts** page, select **+ Create**.

1. On the **Basics** tab on the **Create a storage account** pane, enter or select the following information.

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**.</br> In **Name**, enter **myResourceGroup**.</br> Select **OK**. |
    | **Instance details** |  |
    | Storage account name | Enter a unique name. |
    | Region* | Select the target extended zone's parent region (its `homeLocation`), and then select **Deploy to an Azure Extended Zone**.</br> Under **Azure Extended Zones**, select the respective extended zone.</br> Choose **Select**. |
    | Performance | **Premium** is the only available option for an extended zone. |
    | Premium account type | Select **Page blobs**. Other available options are **Block blobs** and **File shares**. |
    | Redundancy | **Locally-redundant storage (LRS)** is the only available option for an extended zone. |

     *If no extended zone is paired with the selected region, you can't select an extended zone location.

    :::image type="content" source="./media/create-storage-account/create-storage-account-basics.png" alt-text="Screenshot that shows the Basics tab used to create a storage account in an Azure extended zone." lightbox="./media/create-storage-account/create-storage-account-basics.png":::

    > [!NOTE]
    > Azure Extended Zones supports only premium storage accounts with locally redundant storage redundancy.

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Clean up resources

When you no longer need the storage account, delete it and its resource group.

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. On the **Delete a resource group** pane, enter **myResourceGroup**, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Related content

- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Deploy an Azure Kubernetes Service (AKS) cluster in an extended zone](deploy-aks-cluster.md)
- [Frequently asked questions](faq.md)
