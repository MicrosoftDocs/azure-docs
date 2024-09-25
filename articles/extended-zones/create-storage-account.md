---
title: Deploy a storage account in an Azure Extended Zone
description: Learn how to deploy a storage account in an Azure Extended Zone.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 08/02/2024
---

# Create a storage account in an Azure Extended Zone

> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you learn how to create an Azure storage account in Los Angeles Extended Zone.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Access to Los Angeles Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).

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
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Storage account name | Enter a unique name. |
    | Region | Select **(US) West US** and then select **Deploy to an Azure Extended Zone**. </br> In  **Azure Extended Zones**, select **Los Angeles**. </br> Select the **Select** button. |
    | Performance | **Premium** is the only available option for an Extended Zone. |
    | Premium account type | Select **Page blobs**. Other available options are **Block blobs** and **File shares**. |
    | Redundancy | **Locally-redundant storage (LRS)** is the only available option for an Extended Zone. |

    :::image type="content" source="./media/create-storage-account/create-storage-account-basics.png" alt-text="Screenshot that shows the Basics tab of creating a storage account in an Azure Extended Zone." lightbox="./media/create-storage-account/create-storage-account-basics.png":::

    > [!NOTE]
    > Azure Extended Zones only supports premium storage accounts with locally-redundant storage (LRS) redundancy.

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

## Clean up resources

When no longer needed, delete the storage account and its resource group:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Related content

- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Frequently asked questions](faq.md)
