---
title: View Kubernetes costs (Preview)
description: This article helps you view Azure Kubernetes Service (AKS) cost in Microsoft Cost management.
author: bandersmsft
ms.author: banders
ms.date: 11/15/2023
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.custom:
  - ignite-2023
ms.reviewer: sadoulta
---

# View Kubernetes costs (Preview)

This article helps you view Azure Kubernetes Service (AKS) cost in Microsoft Cost management. You use the following views to analyze your Kubernetes costs, which are available at the subscription scope.

- **Kubernetes clusters** – Shows aggregated costs of clusters in a subscription.
- **Kubernetes namespaces** – Shows aggregated costs of namespaces for all clusters in a subscription.
- **Kubernetes assets** – Shows costs of assets running within a cluster.

Visibility into a Kubernetes cluster cost helps you identify opportunities for optimization. It also enables cost allocation to different teams running their applications on shared clusters in different namespaces.

## Prerequisites

- You must install the AKS cost analysis addon on the cluster to view its costs. For more information about how to install the addon and setting up your cluster, see [AKS cost analysis addon](https://aka.ms/aks/costanalysis). If you have multiple clusters running in a subscription, you must install the addon on every cluster. For more information about prerequisites and how to enable cost analysis for clusters, see [Azure Kubernetes Service cost analysis (preview)](../../aks/cost-analysis.md).
- Kubernetes cost views are available only for the following subscription agreement types:
  - Enterprise Agreement
  - Microsoft Customer Agreement  
 Other agreement types aren't supported.
- You must have one of the following roles on the subscription hosting the cluster.
  - Owner
  - Contributor
  - Reader
  - Cost management reader
  - Cost management contributor

## Access Kubernetes cost views

Use any of the following ways to view AKS costs.

### View from the Subscription page

To view AKS costs from the Subscription page:

1. Sign in to [Azure portal](https://portal.azure.com/) and navigate to **Subscriptions**.
2. Search for the subscription hosting your clusters and select it.
3. In the left navigation menu under Cost Management, select **Cost analysis**.
4. In the View list, select the list drop-down item and then select **Kubernetes clusters**.  
    :::image type="content" source="./media/view-kubernetes-costs/view-list-kubernetes.png" alt-text="Screenshot showing the Kubernetes clusters view." lightbox="./media/view-kubernetes-costs/view-list-kubernetes.png" :::

### View from the Cost Management page

To view AKS costs from the Cost Management page:

1. Sign in to [Azure portal](https://portal.azure.com/) and search for **Cost analysis**.
2. Verify that you are at the correct scope. If necessary, select **change** to select the correct subscription scope that hosts your Kubernetes clusters.  
    :::image type="content" source="./media/view-kubernetes-costs/scope-change.png" alt-text="Screenshot showing the scope change item." lightbox="./media/view-kubernetes-costs/scope-change.png" :::
1. Select the **All views** tab, then under Customizable views, select a view under **Kubernetes views (preview)**.  
    :::image type="content" source="./media/view-kubernetes-costs/kubernetes-views.png" alt-text="Screenshot showing the Kubernetes views (preview) items." lightbox="./media/view-kubernetes-costs/kubernetes-views.png" :::

## Kubernetes clusters view

The Kubernetes clusters view shows the costs of all clusters in a subscription. With this view, you can drill down into namespaces or assets for a cluster. Select the **ellipsis** ( **…** ) to see the other views.

:::image type="content" source="./media/view-kubernetes-costs/Kubernetes-clusters-view.png" alt-text="Screenshot showing the ellipsis item to show more views." lightbox="./media/view-kubernetes-costs/Kubernetes-clusters-view.png" :::

## Kubernetes namespaces view

The Kubernetes namespaces view shows the costs of namespaces for the cluster along with Idle and System charges. Service charges, which represent the charges for Uptime SLA, are also shown.

:::image type="content" source="./media/view-kubernetes-costs/kubernetes-namespaces-view.png" alt-text="Screenshot showing the Kubernetes namespaces view." lightbox="./media/view-kubernetes-costs/kubernetes-namespaces-view.png" :::

## Kubernetes assets view

The Kubernetes assets view shows the costs of assets in a cluster categorized under one of the service categories: Compute, Networking, and Storage. The uptime SLA charges are under the Service category.

:::image type="content" source="./media/view-kubernetes-costs/kubernetes-assets-view.png" alt-text="Screenshot showing the Kubernetes assets view." lightbox="./media/view-kubernetes-costs/kubernetes-assets-view.png" :::

## View amortized costs

By default, all Kubernetes views show actual costs. You can view amortized costs by selecting **Customize** at the top of the view and then select **Amortize reservation and savings plan purchases**.

:::image type="content" source="./media/view-kubernetes-costs/customize-view-amortize.png" alt-text="Screenshot showing the amortize display option." lightbox="./media/view-kubernetes-costs/customize-view-amortize.png" :::

## Next steps

For more information about splitting shared costs with cost allocation rules, see [Create and manage Azure cost allocation rules](allocate-costs.md).
