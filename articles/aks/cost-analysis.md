---
title: Azure Kubernetes Service Cost Analysis
description: Learn how to use Cost Analysis to surface cost management information in your Azure Kubernetes Service (AKS) cluster
author: nickomang
ms.author: nickoman
ms.service: azure-kubernetes-service
ms.topic: how-to
ms.date: 11/06/2023

#CustomerIntent: As a cluster operator, I want to obtain cost management information, perform cost attribution, and improve my cluster footprint
---

# Azure Kubernetes Service Cost Analysis

<!-- This section could change a lot, I think it makes sense to align what we have here with an abbreviated version of the docs on the ACM side -->

An Azure Kubernetes Service (AKS) cluster is reliant on Azure resources like virtual machines, virtual disks, load-balancers and public IP addresses. These resources may be used by multiple applications, which may be maintained by several different teams within your organization. Resource consumption patterns of those applications are often non-uniform, and thus their contribution towards the total cluster resource cost is often non-uniform. Some applications may also have footprints across multiple clusters. This can pose a challenge when performing cost attribution and cost management.

Previously, [Azure Cost Management (ACM)](../cost-management-billing/cost-management-billing-overview.md) aggregated cluster resource consumption under the cluster resource group. You could use ACM to analyze costs, but there were several challenges:

* Costs were reported per cluster. There was no breakdown into discrete categories such as compute (including CPU cores and memory), storage, and networking.

* There was no Azure-native functionality to distinguish between types of costs. ACM aggregated the cost of resources used by applications, costs of resources shared across applications, such as system costs, and costs of resources that are associated with the cluster but are idle.

* There was no Azure-native capability to display cluster resource usage at a level more granular than a cluster.

* There was no Azure-native mechanism to analyze costs across multiple clusters in the same subscription scope.

As a result, you may use or have used third-party solutions, like Kubecost, to gather and analyze resource consumption and costs at different granularity levels. This solution requires effort to deploy, fine-tune, and maintain for each AKS cluster. You may even need to pay for advanced features.

To address these challenges, AKS has integrated with ACM to offer fully-detailed cost information. Azure Cost Management is the source of truth for bill reconciliation for other Azure services, and can now be treated as the same source of truth for AKS cost analysis.

## Prerequisites and limitations

<!-- Any other prereqs/limitations we should add? -->

* Your cluster must be either `Standard` or `Premium` tier, not the `Free` tier.

* To view cost analysis information, you must have one of the following roles on the subscription hosting the cluster: Owner, Contributor, Reader, Cost management contributor, or Cost management reader.

* Once cost analysis has been enabled, you cannot downgrade your cluster to the `Free` tier without first disabling cost analysis.

## Enable Cost Analysis on your AKS cluster

### [Azure CLI](#tab/azure-cli)

Cost analysis can be enabled during one of the following operations:

* Create a `Standard` or `Premium` tier AKS cluster

* Update an AKS cluster that is already in `Standard` or `Premium` tier.

* Upgrade a `Free` or `Standard` cluster to `Premium`.

* Downgrade a `Premium` cluster to `Standard` tier.

To enable the feature, use the flag `--enable-cost-analysis` in combination with one of these operations. For example, the following command will create a new AKS cluster in the `Standard` tier with cost analysis enabled:

```azurecli-interactive
az aks create --name myAKSCluster --resource-group myResourceGroup --tier Standard –-enable-cost-analysis
```

### [Azure portal](#tab/portal)

<!-- I need usable screens (sufficient size, actual portal design assets, finalized UX) for enabling/disabling cost analysis using portal -->

---

## Disable Cost Analysis

Cost analysis can be disabled at any time. When you disable it, you retain access to past cost data that was collected during the duration when cost analysis was enabled, but no new data will be populated. Should you customer re-enable the feature, there will be a gap in data for the period in which cost analysis was disabled, but historical and new data will not be impacted.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup –-disable-cost-analysis
```

### [Azure portal](#tab/portal)

<!-- I need usable screens (sufficient size, actual portal design assets, finalized UX) for enabling/disabling cost analysis using portal -->

---

## View Cost Analysis information

Cost analysis information can be viewed from the Azure portal.

1. In the Azure portal, search for *Cost* and select *Cost Analysis*.

    :::image type="content" source="./media/cost-analysis/cost-analysis-entry-inline.png" alt-text="{alt-text}" lightbox="./media/cost-analysis/cost-analysis-entry.png":::

1. Several views are shown. Navigate to the section for *Kubernetes Views* to see cost across your clusters or namespaces.

    :::image type="content" source="./media/cost-analysis/cost-analysis-overview-inline.png" alt-text="{alt-text}" lightbox="./media/cost-analysis/cost-analysis-overview.png":::

1. After selecting *Kubernetes clusters*, you will see a costs associated with each cluster.

    :::image type="content" source="./media/cost-analysis/cost-analysis-clusters-inline.png" alt-text="{alt-text}" lightbox="./media/cost-analysis/cost-analysis-clusters.png":::

1. Hover over a cluster and select *...*, then select *Kubernetes assets* to get a granular breakdown of compute, storage, networking, and more associated with that cluster.

    :::image type="content" source="./media/cost-analysis/cost-analysis-cluster-select-inline.png" alt-text="{alt-text}" lightbox="./media/cost-analysis/cost-analysis-cluster-select.png":::

    :::image type="content" source="./media/cost-analysis/cost-analysis-assets-inline.png" alt-text="{alt-text}" lightbox="./media/cost-analysis/cost-analysis-assets.png":::

1. Expand each section for a more detailed view of each asset.

    :::image type="content" source="./media/cost-analysis/cost-analysis-asset-breakdown-inline.png" alt-text="{alt-text}" lightbox="./media/cost-analysis/cost-analysis-asset-breakdown.png":::
