---
title: Deploy an Azure container offer from Azure Marketplace 
description: Learn how to deploy Azure container offers from Azure Marketplace on an Azure Kubernetes Service (AKS) cluster.
author: nickomang
ms.author: nickoman
ms.topic: how-to
ms.date: 09/30/2022
ms.custom: ignite-fall-2022, references_regions
---

# Deploy a container offer from Azure Marketplace (preview)

[Azure Marketplace][azure-marketplace] is an online store that contains thousands of IT software applications and services built by industry-leading technology companies. In Azure Marketplace, you can find, try, buy, and deploy the software and services that you need to build new solutions and manage your cloud infrastructure. The catalog includes solutions for different industries and technical areas, free trials, and consulting services from Microsoft partners.

Included among these solutions are Kubernetes application-based container offers. These offers contain applications that are meant to run on Kubernetes clusters such as Azure Kubernetes Service (AKS). In this article, you'll learn how to:

- Browse offers in Azure Marketplace.
- Purchase an application.
- Deploy the application on your AKS cluster.
- Monitor usage and billing information.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Limitations

This feature is currently supported only in the following regions:

- East US
- West US
- Central US
- West Central US
- South Central US
- East US 2
- West US 2
- West Europe
- North Europe
- Canada Central
- Southeast Asia
- Australia East
- Central India

Kubernetes application-based container offers cannot be deployed on AKS for Azure Stack HCI or AKS Edge Essentials.

## Register resource providers

Before you deploy a container offer, you must register the  `Microsoft.ContainerService` and `Microsoft.KubernetesConfiguration` providers on your subscription by using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
```

## Select and deploy a Kubernetes offer

1. In the [Azure portal](https://portal.azure.com/), search for **Marketplace** on the top search bar. In the results, under **Services**, select **Marketplace**.

1. You can search for an offer or publisher directly by name, or you can browse all offers. To find Kubernetes application offers, on the left side under **Categories** select **Containers**.

   :::image type="content" source="./media/deploy-marketplace/containers-inline.png" alt-text="Screenshot of Azure Marketplace offers in the Azure portal, with the container category on the left side highlighted." lightbox="./media/deploy-marketplace/containers.png":::

   > [!IMPORTANT]
   > The **Containers** category includes both Kubernetes applications and standalone container images. This walkthrough is specific to Kubernetes applications. If you find that the steps to deploy an offer differ in some way, you're most likely trying to deploy a container image-based offer instead of a Kubernetes application-based offer.

1. You will see several Kubernetes application offers displayed on the page. To view all of the Kubernetes application offers, select **See more**.

   :::image type="content" source="./media/deploy-marketplace/see-more-inline.png" alt-text="Screenshot of Azure Marketplace K8s offers in the Azure portal" lightbox="./media/deploy-marketplace/see-more.png":::

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

## Troubleshooting

If you experience issues, see the [troubleshooting checklist for failed deployments of a Kubernetes offer][marketplace-troubleshoot].

## Next steps

- Learn more about [exploring and analyzing costs][billing].

<!-- LINKS -->
[azure-marketplace]: /marketplace/azure-marketplace-overview
[cluster-extensions]: ./cluster-extensions.md
[billing]: ../cost-management-billing/costs/quick-acm-cost-analysis.md
[marketplace-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-failed-kubernetes-deployment-offer
