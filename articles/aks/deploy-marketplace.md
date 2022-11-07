---
title: Deploy an Azure container offer from Azure Marketplace 
description: Learn how to deploy Azure container offers from Azure Marketplace on an Azure Kubernetes Service (AKS) cluster.
author: nickomang
ms.author: nickoman
ms.service: container-service
ms.topic: how-to
ms.date: 09/30/2022
ms.custom: devx-track-azurecli, ignite-fall-2022, references_regions
---

# Deploy a container offer from Azure Marketplace (preview)

[Azure Marketplace][azure-marketplace] is an online store that contains thousands of IT software applications and services built by industry-leading technology companies. In Azure Marketplace, you can find, try, buy, and deploy the software and services that you need to build new solutions and manage your cloud infrastructure. The catalog includes solutions for different industries and technical areas, free trials, and consulting services from Microsoft partners.

Included among these solutions are Kubernetes application-based container offers. These offers contain applications that are meant to run on Kubernetes clusters such as Azure Kubernetes Service (AKS). In this article, you'll learn how to:

- Browse offers in Azure Marketplace.
- Purchase an application.
- Deploy the application on your AKS cluster.
- Monitor usage and billing information.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!NOTE]
> This feature is currently supported only in the following regions:
>
> - West Central US
> - West Europe
> - East US

## Register resource providers

Before you deploy a container offer, you must register the  `Microsoft.ContainerService` and `Microsoft.KubernetesConfiguration` providers on your subscription by using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
```

## Select and deploy a Kubernetes offer

1. In the [Azure portal](https://ms.portal.azure.com/), search for **Marketplace** on the top search bar. In the results, under **Services**, select **Marketplace**.

1. You can search for an offer or publisher directly by name, or you can browse all offers. To find Kubernetes application offers, use the **Product Type** filter for **Azure Containers**. 

   :::image type="content" source="./media/deploy-marketplace/browse-marketplace-inline.png" alt-text="Screenshot of Azure Marketplace offers in the Azure portal, with the filter for product type set to Azure containers." lightbox="./media/deploy-marketplace/browse-marketplace-full.png":::

   > [!IMPORTANT]
   > The **Azure Containers** category includes both Kubernetes applications and standalone container images. This walkthrough is specific to Kubernetes applications. If you find that the steps to deploy an offer differ in some way, you're most likely trying to deploy a container image-based offer instead of a Kubernetes application-based offer.
   >
   > To ensure that you're searching for Kubernetes applications, include the term **KubernetesApps** in your search.

1. After you decide on an application, select the offer.

1. On the **Plans + Pricing** tab, select an option. Ensure that the terms are acceptable, and then select **Create**.

   :::image type="content" source="./media/deploy-marketplace/plans-pricing-inline.png" alt-text="Screenshot of the offer purchasing page in the Azure portal, including plan and pricing information." lightbox="./media/deploy-marketplace/plans-pricing-full.png":::

1. Follow each page in the wizard, all the way through **Review + Create**. Fill in information for your resource group, your cluster, and any configuration options that the application requires. You can decide to deploy on a new AKS cluster or use an existing cluster.

   :::image type="content" source="./media/deploy-marketplace/purchase-experience-inline.png" alt-text="Screenshot of the Azure portal wizard for deploying a new offer, with the selector for creating a new cluster or using an existing cluster." lightbox="./media/deploy-marketplace/purchase-experience-full.png":::

   When the application is deployed, the portal shows **Your deployment is complete**, along with details of the deployment.

   :::image type="content" source="./media/deploy-marketplace/deployment-inline.png" alt-text="Screenshot of the Azure portal that shows a successful resource deployment to the cluster." lightbox="./media/deploy-marketplace/deployment-full.png":::

1. Verify the deployment by using the following command to list the extensions that are running on your cluster:

   ```azurecli-interactive
   az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
   ```

## Manage the offer lifecycle

For lifecycle management, an Azure Kubernetes offer is represented as a cluster extension for AKS. For more information, see [Cluster extensions for AKS][cluster-extensions].

Purchasing an offer from Azure Marketplace creates a new instance of the extension on your AKS cluster. You can view the extension instance from the cluster by using the following command:

```azurecli-interactive
az k8s-extension show --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

## Monitor billing and usage information

To monitor billing and usage information for the offer that you deployed:

1. In the Azure portal, go to the page for your cluster's resource group.

1. Select **Cost Management** > **Cost analysis**. Under **Product**, you can see a cost breakdown for the plan that you selected.

   :::image type="content" source="./media/deploy-marketplace/billing-inline.png" alt-text="Screenshot of the Azure portal page for a resource group, with billing information broken down by offer plan." lightbox="./media/deploy-marketplace/billing-full.png":::

## Remove an offer

You can delete a purchased plan for an Azure container offer by deleting the extension instance on the cluster. For example:

```azurecli-interactive
az k8s-extension delete --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

## Next steps

- Learn more about [exploring and analyzing costs][billing].

<!-- LINKS -->
[azure-marketplace]: /marketplace/azure-marketplace-overview
[cluster-extensions]: ./cluster-extensions.md
[billing]: ../cost-management-billing/costs/quick-acm-cost-analysis.md
