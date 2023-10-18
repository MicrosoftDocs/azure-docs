---
title: Azure Kubernetes Service cost analysis
description: Learn how to use cost analysis to surface cost management information in your Azure Kubernetes Service (AKS) cluster
author: nickomang
ms.author: nickoman
ms.service: azure-kubernetes-service
ms.topic: how-to
ms.date: 11/06/2023

#CustomerIntent: As a cluster operator, I want to obtain cost management information, perform cost attribution, and improve my cluster footprint
---

# Azure Kubernetes Service cost analysis

<!-- This section could change a lot, I think it makes sense to align what we have here with an abbreviated version of the docs on the MCM side -->

An Azure Kubernetes Service (AKS) cluster is reliant on Azure resources like virtual machines, virtual disks, load-balancers and public IP addresses. These resources can be used by multiple applications, which could be maintained by several different teams within your organization. Resource consumption patterns of those applications are often nonuniform, and thus their contribution towards the total cluster resource cost is often nonuniform. Some applications can also have footprints across multiple clusters. This can pose a challenge when performing cost attribution and cost management.

Previously, [Microsoft Cost Management (MCM)](../cost-management-billing/cost-management-billing-overview.md) aggregated cluster resource consumption under the cluster resource group. You could use MCM to analyze costs, but there were several challenges:

* Costs were reported per cluster. There was no breakdown into discrete categories such as compute (including CPU cores and memory), storage, and networking.

* There was no Azure-native functionality to distinguish between types of costs. MCM aggregated the cost of resources used by applications, costs of resources shared across applications, such as system costs, and costs of resources that are associated with the cluster but are idle.

* There was no Azure-native capability to display cluster resource usage at a level more granular than a cluster.

* There was no Azure-native mechanism to analyze costs across multiple clusters in the same subscription scope.

As a result, you might have used third-party solutions, like Kubecost, to gather and analyze resource consumption and costs at different granularity levels. This solution requires effort to deploy, fine-tune, and maintain for each AKS cluster. In some cases, you even need to pay for advanced features.

To address these challenges, AKS has integrated with MCM to offer fully detailed cost information. Microsoft Cost Management is the source of truth for bill reconciliation for other Azure services, and can now be treated as the same source of truth for AKS cost analysis.

## Prerequisites and limitations

<!-- Any other prereqs/limitations we should add? -->

* Your cluster must be either `Standard` or `Premium` tier, not the `Free` tier.

* To view cost analysis information, you must have one of the following roles on the subscription hosting the cluster: Owner, Contributor, Reader, Cost management contributor, or Cost management reader.

* Once cost analysis has been enabled, you can't downgrade your cluster to the `Free` tier without first disabling cost analysis.

## Enable cost analysis on your AKS cluster

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

## Disable cost analysis

You can disable cost analysis at any time. When you disable it, you retain access to past cost data that was collected during the duration when cost analysis was enabled, but no new data will be populated. Should you re-enable the feature, there will be a gap in data for the period in which cost analysis was disabled, but historical and new data won't be impacted.

> [!NOTE]
> If you intend to downgrade your cluster from the `Standard` or `Premium` tiers to the `Free` tier while cost analysis is enabled, you must first explicitly disable cost analysis as shown here.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup –-disable-cost-analysis
```

### [Azure portal](#tab/portal)

<!-- I need usable screens (sufficient size, actual portal design assets, finalized UX) for enabling/disabling cost analysis using portal -->

---

## View cost information

You can view cost information from the Azure portal.

1. In the Azure portal, search for *Cost* and select *Cost analysis*.

    :::image type="content" source="./media/cost-analysis/cost-analysis-entry-inline.png" alt-text="The default Azure portal page is shown, with 'Cost' entered into the search field and 'Cost analysis' highlighted in the results." lightbox="./media/cost-analysis/cost-analysis-entry.png":::

1. Several views are shown. Expand the section for *Kubernetes views* to see cost across your clusters or namespaces.

    :::image type="content" source="./media/cost-analysis/cost-analysis-overview-inline.png" alt-text="The Azure portal cost analysis overview page is shown with the 'Kubernetes views' section highlighted." lightbox="./media/cost-analysis/cost-analysis-overview.png":::

    1. After selecting *Kubernetes namespaces*, you'll see costs associated with your various Kubernetes namespaces.

        :::image type="content" source="./media/cost-analysis/cost-analysis-namespaces-inline.png" alt-text="The Azure portal page for cost analysis is shown with the `Kubernetes namespaces`` view expanded." lightbox="./media/cost-analysis/cost-analysis-namespaces.png":::

    1. After selecting *Kubernetes clusters*, you'll see costs associated with each cluster.

        :::image type="content" source="./media/cost-analysis/cost-analysis-clusters-inline.png" alt-text="The Azure portal page for cost analysis is shown with the 'Kubernetes clusters' view expanded." lightbox="./media/cost-analysis/cost-analysis-clusters.png":::

1. From the clusters page, hover over a cluster and select *...*, then select *Kubernetes assets* to get a granular breakdown of compute, storage, networking, and more associated with that cluster.

    :::image type="content" source="./media/cost-analysis/cost-analysis-cluster-select-inline.png" alt-text="The Azure portal page for cost analysis is shown with the 'Kubernetes clusters' view expanded. A cluster has been selected and options for 'Kubernetes assets' and 'Namespaces' are highlighted." lightbox="./media/cost-analysis/cost-analysis-cluster-select.png":::

    :::image type="content" source="./media/cost-analysis/cost-analysis-assets-inline.png" alt-text="The Azure portal page for cost analysis is shown, with the 'Kubernetes assets' view expanded." lightbox="./media/cost-analysis/cost-analysis-assets.png":::

1. Expand each section for a more detailed view of each asset group.

    :::image type="content" source="./media/cost-analysis/cost-analysis-asset-breakdown-inline.png" alt-text="The Azure portal page for cost analysis is shown, with the 'Kubernetes assets' view expanded and individual sections for each Kubernetes asset expanded." lightbox="./media/cost-analysis/cost-analysis-asset-breakdown.png":::
