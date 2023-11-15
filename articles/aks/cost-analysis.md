---
title: Azure Kubernetes Service cost analysis (preview)
description: Learn how to use cost analysis to surface granular cost allocation data for your Azure Kubernetes Service (AKS) cluster.
author: nickomang
ms.author: nickoman
ms.service: azure-kubernetes-service
ms.topic: how-to
ms.date: 11/06/2023

#CustomerIntent: As a cluster operator, I want to obtain cost management information, perform cost attribution, and improve my cluster footprint
---

# Azure Kubernetes Service cost analysis (preview)

An Azure Kubernetes Service (AKS) cluster is reliant on Azure resources like virtual machines, virtual disks, load-balancers and public IP addresses. These resources can be used by multiple applications, which could be maintained by several different teams within your organization. Resource consumption patterns of those applications are often nonuniform, and thus their contribution towards the total cluster resource cost is often nonuniform. Some applications can also have footprints across multiple clusters. This can pose a challenge when performing cost attribution and cost management.

Previously, [Microsoft Cost Management (MCM)](../cost-management-billing/cost-management-billing-overview.md) aggregated cluster resource consumption under the cluster resource group. You could use MCM to analyze costs, but there were several challenges:

* Costs were reported per cluster. There was no breakdown into discrete categories such as compute (including CPU cores and memory), storage, and networking.

* There was no Azure-native functionality to distinguish between types of costs. For example, individual application versus shared costs. MCM reported the cost of resources, but there was no insight into how much of the resource cost was used to run individual applications, reserved for system processes required by the cluster, or idle cost associated with the cluster.

* There was no Azure-native capability to display cluster resource usage at a level more granular than a cluster.

* There was no Azure-native mechanism to analyze costs across multiple clusters in the same subscription scope.

As a result, you might have used third-party solutions, like Kubecost or OpenCost, to gather and analyze resource consumption and costs by Kubernetes-specific levels of granularity, such as by namespace or pod. Third-party solutions, however, require effort to deploy, fine-tune, and maintain for each AKS cluster. In some cases, you even need to pay for advance features, increasing the cluster's total cost of ownership.

To address this challenge, AKS has integrated with MCM to offer detailed cost drill down scoped to Kubernetes constructs, such as cluster and namespace, in addition to Azure Compute, Network, and Storage categories.

The AKS cost analysis addon is built on top of [OpenCost](https://www.opencost.io/), an open-source Cloud Native Computing Foundation Sandbox project for usage data collection, which gets reconciled with your Azure invoice data. Post-processed data is visible directly in the [MCM Cost Analysis portal experience](/azure/cost-management-billing/costs/quick-acm-cost-analysis).

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites and limitations

* Your cluster must be either `Standard` or `Premium` tier, not the `Free` tier.

* To view cost analysis information, you must have one of the following roles on the subscription hosting the cluster: Owner, Contributor, Reader, Cost management contributor, or Cost management reader.

* Once cost analysis has been enabled, you can't downgrade your cluster to the `Free` tier without first disabling cost analysis.

* Your cluster must be deployed with a [Microsoft Entra Workload ID](./workload-identity-overview.md) configured.

* If using the Azure CLI, you must have version `2.44.0` or later installed, and the `aks-preview` Azure CLI extension version `0.5.155` or later installed.

* The `ClusterCostAnalysis` feature flag must be registered on your subscription.

* Kubernetes cost views are available only for the following Microsoft Azure Offer types. For more information on offer types, see [Supported Microsoft Azure offers](/azure/cost-management-billing/costs/understand-cost-mgt-data#supported-microsoft-azure-offers). 
    * Enterprise Agreement
    * Microsoft Customer Agreement


### Install or update the `aks-preview` Azure CLI extension

Install the `aks-preview` Azure CLI extension using the [`az extension add`][az-extension-add] command.

```azurecli-interactive
az extension add --name aks-preview
```

If you need to update the extension version, you can do this using the [`az extension update`][az-extension-update] command.

```azurecli-interactive
az extension update --name aks-preview
```

### Register the 'ClusterCostAnalysis' feature flag

Register the `ClusterCostAnalysis` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "ClusterCostAnalysis"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "ClusterCostAnalysis"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Enable cost analysis on your AKS cluster

Cost analysis can be enabled during one of the following operations:

* Create a `Standard` or `Premium` tier AKS cluster

* Update an AKS cluster that is already in `Standard` or `Premium` tier.

* Upgrade a `Free` cluster to `Standard` or `Premium`.

* Upgrade a `Standard` cluster to `Premium`.

* Downgrade a `Premium` cluster to `Standard` tier.

To enable the feature, use the flag `--enable-cost-analysis` in combination with one of these operations. For example, the following command will create a new AKS cluster in the `Standard` tier with cost analysis enabled:

```azurecli-interactive
az aks create --resource-group <resource_group> --name <name> --location <location> --enable-managed-identity --generate-ssh-keys --tier standard --enable-cost-analysis
```

## Disable cost analysis

You can disable cost analysis at any time using `az aks update`.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup –-disable-cost-analysis
```

> [!NOTE]
> If you intend to downgrade your cluster from the `Standard` or `Premium` tiers to the `Free` tier while cost analysis is enabled, you must first explicitly disable cost analysis as shown here.

## View cost information

You can view cost allocation data in the Azure portal. To learn more about how to navigate the cost analysis UI view, see the [Cost Management documentation](/azure/cost-management-billing/costs/view-kubernetes-costs).

> [!NOTE]
> It might take up to one day for data to finalize

## Troubleshooting

See the following guide to troubleshoot [AKS cost analysis add-on issues](/troubleshoot/azure/azure-kubernetes/aks-cost-analysis-add-on-issues).

<!-- LINKS -->
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-extension-update]: /cli/azure/extension#az-extension-update