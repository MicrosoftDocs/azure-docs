---
title: Deploy an Azure Kubernetes Service (AKS) Cluster in an Extended Zone
description: Learn how to deploy an Azure Kubernetes Service (AKS) cluster in an Azure extended zone by using the Azure portal.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 02/25/2026
---

# Deploy an Azure Kubernetes Service (AKS) cluster in an Azure extended zone

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage clusters. In this article, you learn how to create an AKS cluster in extended zones.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

- An Azure account with an active subscription.
- Access to an extended zone. For more information, see [Request access to an Azure extended zone](request-access.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Create an AKS cluster in an extended zone

In this section, you create an AKS cluster in an extended zone. Los Angeles is used as the example for this article.

> [!NOTE]
> To help you quickly get started with provisioning an AKS cluster in an extended zone, this article includes steps to deploy a cluster with default settings for evaluation purposes only. Before you deploy a production-ready cluster, we recommend that you familiarize yourself with our [baseline reference architecture](/azure/architecture/reference-architectures/containers/aks/baseline-aks?toc=/azure/extended-zones/toc.json) to consider how it aligns with your business requirements.

1. In the search box at the top of the portal, enter **Kubernetes**. Select **Kubernetes services** from the search results.

    :::image type="content" source="./media/deploy-aks-cluster/portal-search.png" alt-text="Screenshot that shows how to search for Azure Kubernetes Service in the Azure portal." lightbox="./media/deploy-aks-cluster/portal-search.png":::

1. On the **Kubernetes services** page, select **+ Create** and then select **Create a Kubernetes cluster**.

1. On the **Basics** tab on the **Create Kubernetes cluster** pane, enter or select the following information.

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new**.</br> In **Name**, enter **myResourceGroup**.</br> Select **OK**. |
    | **Cluster details** |  |
    | Cluster preset configuration | Select **Production Standard**. You can modify preset configurations at any time. |
    | Storage account name | Enter **myAKSCluster**. |
    | Region* | Select the target extended zone's parent region (its `homeLocation`), and then select **Deploy to an Azure Extended Zone**.</br> Under **Azure Extended Zones**, select the respective extended zone.</br> Choose **Select**. |

    *If no extended zone is paired with the selected region, you can't select an extended zone location.

    :::image type="content" source="./media/deploy-aks-cluster/aks-basics.png" alt-text="Screenshot that shows the Basics tab open on the Create Kubernetes cluster pane in the Azure portal." lightbox="./media/deploy-aks-cluster/aks-basics.png":::

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

    It takes a few minutes to create the AKS cluster.

1. When your deployment is finished, go to your resource by selecting **Go to resource**.

## Clean up resources

When your resources are no longer needed, delete the AKS cluster and its resource group to avoid Azure charges.

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. On the **Delete a resource group** pane, enter **myResourceGroup**, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Related content

- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Deploy a storage account in an extended zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
