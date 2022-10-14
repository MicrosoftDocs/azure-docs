---
title: How to deploy Azure Container offers for Azure Kubernetes Service (AKS) from the Azure Marketplace 
description: Learn how to deploy Azure Container offers from the Azure Marketplace on an Azure Kubernetes Service (AKS) cluster.
author: nickomang
ms.author: nickoman
ms.service: container-service
ms.topic: how-to
ms.date: 09/30/2022
ms.custom: devx-track-azurecli, ignite-fall-2022, references_regions
---

# How to deploy a Container offer from Azure Marketplace (preview)

[Azure Marketplace][azure-marketplace] is an online store that contains thousands of IT software applications and services built by industry-leading technology companies. In Azure Marketplace you can find, try, buy, and deploy the software and services you need to build new solutions and manage your cloud infrastructure. The catalog includes solutions for different industries and technical areas, free trials, and also consulting services from Microsoft partners.

Included among these solutions are Kubernetes application-based Container offers, which contain applications meant to run on Kubernetes clusters such as Azure Kubernetes Service (AKS). In this article, you will learn how to:

- Browse offers in Azure Marketplace
- Purchase an application
- Deploy the application on your AKS cluster
- Monitor usage and billing information

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!NOTE]
> This feature is currently only supported in the following regions:
>
> - West Central US
> - West Europe
> - East US.

## Register resource providers

You must have registered the  `Microsoft.ContainerService` and `Microsoft.KubernetesConfiguration` providers on your subscription using the `az provider register` command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
```

## Browse offers

- Begin by visiting the Azure portal and searching for *"Marketplace"* in the top search bar.

- You can search for an offer or publisher directly by name or browse all offers. To find Kubernetes application offers, use the *Product type* filter for *Azure Containers*. 

- > [!IMPORTANT]
  > The *Azure Containers* category includes both Kubernetes applications and standalone container images. This walkthrough is Kubernetes application-specific. If you find the steps to deploy an offer differ in some way, you are most likely trying to deploy a container image-based offer instead of a Kubernetes-application based offer.
  >
  > To ensure you're searching for Kubernetes applications, include the term `KubernetesApps` in your search.

- Once you've decided on an application, click on the offer.

    :::image type="content" source="./media/deploy-marketplace/browse-marketplace-inline.png" alt-text="Screenshot of the Azure portal Marketplace offer page. The product type filter, set to Azure Containers, is highlighted and several offers are shown." lightbox="./media/deploy-marketplace/browse-marketplace-full.png":::

## Purchasing a Kubernetes offer

- Review the plan and prices tab, select an option, and ensure the terms are acceptable before proceeding.

    :::image type="content" source="./media/deploy-marketplace/plans-pricing-inline.png" alt-text="Screenshot of the Azure portal offer purchasing page. The tab for viewing plans and pricing information is shown." lightbox="./media/deploy-marketplace/plans-pricing-full.png":::

- Click *"Create"*.

## Deploy a Kubernetes offer

- Follow the form, filling in information for your resource group, cluster, and any configuration options required by the application. You can decide to deploy on a new AKS cluster or use an existing cluster.

    :::image type="content" source="./media/deploy-marketplace/purchase-experience-inline.png" alt-text="Screenshot of the Azure portal form for deploying a new offer. A selector for creating a new or using an existing cluster is shown." lightbox="./media/deploy-marketplace/purchase-experience-full.png":::

- After some time, the application will be deployed, as indicated by the Portal screen.

    :::image type="content" source="./media/deploy-marketplace/deployment-inline.png" alt-text="Screenshot of the Azure portal screen showing a successful resource deployment, indicating the offer has been deployed to the cluster." lightbox="./media/deploy-marketplace/deployment-full.png":::

- You can also verify by listing the extensions running on your cluster:

    ```azurecli-interactive
    az k8s-extension list --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
    ```

## Manage offer lifecycle

For lifecycle management, an Azure Kubernetes offer is represented as a cluster extension for Azure Kubernetes service(AKS). For more details, see [cluster extensions for AKS][cluster-extensions].

Purchasing an offer from the Azure Marketplace creates a new instance of the extension on your AKS cluster. The extension instance can be viewed from the cluster using the following command:

```azurecli-interactive
az k8s-extension show --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

### Removing an offer

A purchased Azure Container offer plan can be deleted by deleting the extension instance on the cluster. For example:

```azurecli-interactive
az k8s-extension delete --name <extension-name> --cluster-name <clusterName> --resource-group <resourceGroupName> --cluster-type managedClusters
```

## Monitor billing and usage information

To monitor billing and usage information for the offer you've deployed, visit Cost Management > Cost Analysis in your cluster's resource group's page in the Azure portal. You can see a breakdown of cost for the plan you've selected under "Product".

:::image type="content" source="./media/deploy-marketplace/billing-inline.png" alt-text="Screenshot of the Azure portal page for the resource group. Billing information is shown broken down by offer plan." lightbox="./media/deploy-marketplace/billing-full.png":::

## Next Steps

- Learn more about [exploring and analyzing costs][billing].

<!-- LINKS -->
[azure-marketplace]: /marketplace/azure-marketplace-overview
[cluster-extensions]: ./cluster-extensions.md
[billing]: ../cost-management-billing/costs/quick-acm-cost-analysis.md