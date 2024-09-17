---
title: Deploy an Azure Kubernetes Service (AKS) cluster in an Extended Zone
description: Learn how to deploy an Azure Kubernetes Service (AKS) cluster in an Azure Extended Zone using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 08/02/2024
---

# Deploy an Azure Kubernetes Service (AKS) cluster in an Azure Extended Zone

> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this article, you learn how to create an AKS cluster in Los Angeles Extended Zone.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

- Access to Los Angeles Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create an AKS cluster in an Extended Zone

In this section, you create an AKS cluster in Los Angeles.

> [!NOTE]
> To quickly get started with provisioning an AKS cluster in an Extended Zone, this article includes steps to deploy a cluster with default settings for evaluation purposes only. Before deploying a production-ready cluster, we recommend that you familiarize yourself with our [baseline reference architecture](/azure/architecture/reference-architectures/containers/aks/baseline-aks?toc=/azure/extended-zones/toc.json) to consider how it aligns with your business requirements.

1. In the search box at the top of the portal, enter ***Kubernetes***. Select **Kubernetes services** from the search results.

    :::image type="content" source="./media/deploy-aks-cluster/portal-search.png" alt-text="Screenshot that shows how to search for Azure Kubernetes Service in the Azure portal." lightbox="./media/deploy-aks-cluster/portal-search.png":::

1. In the **Kubernetes services** page, select **+ Create** and then select **Create a Kubernetes cluster**.

1. On the **Basics** tab of **Create Kubernetes cluster**,  enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Cluster details** |  |
    | Cluster preset configuration | Select **Production Standard**. You can modify preset configurations at any time. |
    | Storage account name | Enter *myAKSCluster*. |
    | Region | Select **(US) West US** and then select **Deploy to an Azure Extended Zone**. </br> In  **Azure Extended Zones**, select **Los Angeles**. </br> Select the **Select** button. |

    :::image type="content" source="./media/deploy-aks-cluster/aks-basics.png" alt-text="Screenshot that shows the Basics tab of create an AKS cluster in the Azure portal." lightbox="./media/deploy-aks-cluster/aks-basics.png":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

    It takes a few minutes to create the AKS cluster. 

1. When your deployment is complete, go to your resource by selecting **Go to resource**.

## Clean up resources

When no longer needed, delete the AKS cluster and its resource group to avoid Azure charges:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Related content

- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Deploy a storage account in an Extended Zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
