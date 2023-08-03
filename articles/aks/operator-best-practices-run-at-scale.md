---
title: Best practices for running Azure Kubernetes Service (AKS) at scale 
titleSuffix: Azure Kubernetes Service
description: Learn the AKS cluster operator best practices and special considerations for running large clusters at 500 node scale and beyond 
ms.topic: conceptual
ms.date: 07/14/2023
 
---

# Best practices for creating and running Azure Kubernetes Service (AKS) clusters at scale

If your AKS clusters satisfy any of the following criteria, we recommend using the [Standard tier that comes with the Uptime SLA feature][standard-tier] for higher reliability and scalability of the Kubernetes control plane:

* Clusters running production workloads or availability-sensitive, mission-critical workloads
* Clusters running more than 10 nodes on average
* Clusters that need to scale beyond 1000 nodes

To scale AKS clusters beyond 1000 nodes, you need to request a node limit quota increase by [raising a support ticket in the Azure portal][support-ticket] up to a maximum of 5000 nodes per cluster. Increasing the node limit doesn't increase other AKS service quota limits, like the number of pods per node. For more information, see [Limits, quotas, and restrictions for AKS resources][quotas-skus-regions].

To increase the node limit beyond 1000, you must have the following pre-requisites:

* An existing AKS cluster that needs the node limit increase. This cluster shouldn't be deleted as that will remove the limit increase.
* Clusters using the Standard tier.
* Clusters using Kubernetes version 1.23 or above.

> [!NOTE]
> It may take up to a week to enable your clusters with the increased node limit.

## Networking considerations and best practices

* Use Managed NAT for cluster egress with at least 2 public IPs on the NAT Gateway. For more information, see [Managed NAT Gateway with AKS][Managed NAT Gateway - Azure Kubernetes Service].
* Use Azure CNI with Dynamic IP allocation for optimum IP utilization, and scale up to 50k application pods per cluster with one routable IP per pod. For more information, see [Configure Azure CNI networking for dynamic allocation of IPs and enhanced subnet support in AKS][Configure Azure CNI networking for dynamic allocation of IPs and enhanced subnet support in Azure Kubernetes Service (AKS)].
* When using internal Kubernetes services behind an internal load balancer, we recommend creating an internal load balancer or internal service below 750 node scale for optimal scaling performance and load balancer elasticity.

> [!NOTE]
> [Azure Policy Network Manager (Azure NPM)][azure-npm] doesn't support clusters that have more than 250 nodes, and you can't update a cluster with more than 250 nodes managed by Cluster Autoscaler across all agent pools.

## Node pool scaling considerations and best practices

* For system node pools, use the *Standard_D16ds_v5* SKU or equivalent core/memory VM SKUs with ephemeral OS disks to provide sufficient compute resources for *kube-system* pods.
* Since there's a limit of 1000 nodes per node pool, we recommend creating at least five user node pools to scale up to 5000 nodes.
* When running at-scale AKS clusters, use the cluster autoscaler whenever possible to ensure dynamic scaling of node pools based on the demand for compute resources. For more information, see [Automatically scale an AKS cluster to meet application demands][cluster-autoscaler].
* If you're scaling beyond 1000 nodes without using the cluster autoscaler, we recommend scaling in batches of a maximum 500 to 700 nodes at a time. These scaling operations should also have a two-minute to five-minute wait time between consecutive scale-ups to prevent Azure API throttling. For more information, see [API Management: Caching and throttling policies][throttling-policies].

> [!NOTE]
> You can't use the [Stop and Start feature][Stop and Start feature] with clusters enabled with the greater than 1000 node limit.

## Cluster upgrade considerations and best practices

* The hard limit of 5000 nodes per AKS cluster prevents clusters at this limit from performing upgrades. This limit prevents these upgrades from performing because there's no more capacity to perform rolling updates with the max surge property. If you have a cluster at this limit, we recommend scaling the cluster down below 3000 nodes before doing cluster upgrades to provide extra capacity for node churn, and to minimize the control plane load.
* AKS configures upgrades to surge with one extra node through the max surge settings by default. This default value allows AKS to minimize workload disruption by creating an extra node before the cordon/drain of existing applications to replace an older-versioned node. When you upgrade clusters with a large number of nodes, using the default max surge settings can cause an upgrade to take several hours to complete. The completion process can take so long because the upgrade needs to churn through a large number of nodes. You can customize the max surge settings per node pool to enable a trade-off between upgrade speed and upgrade disruption. When you increase the the max surge settings, the upgrade process completes faster, but you may experience disruptions during the upgrade process.
* We don't recommend upgrading a cluster with greater than 500 nodes with the default max surge configuration of one node. Instead, we recommend increasing the max surge settings to somewhere between 10 to 20 percent, with up to a maximum max surge of 500 nodes. Base these settings on your workload disruption tolerance. For more information, see [Customize node surge upgrade][max surge].
* For more cluster upgrade information, see [Upgrade an AKS cluster][cluster upgrades].

<!-- Links - External -->
[Managed NAT Gateway - Azure Kubernetes Service]: nat-gateway.md
[Configure Azure CNI networking for dynamic allocation of IPs and enhanced subnet support in Azure Kubernetes Service (AKS)]: configure-azure-cni-dynamic-ip-allocation.md
[max surge]: upgrade-cluster.md?tabs=azure-cli#customize-node-surge-upgrade
[support-ticket]: https://portal.azure.com/#create/Microsoft.Support/Parameters/%7B%0D%0A%09%22subId%22%3A+%22%22%2C%0D%0A%09%22pesId%22%3A+%225a3a423f-8667-9095-1770-0a554a934512%22%2C%0D%0A%09%22supportTopicId%22%3A+%2280ea0df7-5108-8e37-2b0e-9737517f0b96%22%2C%0D%0A%09%22contextInfo%22%3A+%22AksLabelDeprecationMarch22%22%2C%0D%0A%09%22caller%22%3A+%22Microsoft_Azure_ContainerService+%2B+AksLabelDeprecationMarch22%22%2C%0D%0A%09%22severity%22%3A+%223%22%0D%0A%7D
[standard-tier]: free-standard-pricing-tiers.md
[throttling-policies]: https://azure.microsoft.com/blog/api-management-advanced-caching-and-throttling-policies/

<!-- LINKS - Internal -->
[quotas-skus-regions]: quotas-skus-regions.md
[cluster upgrades]: upgrade-cluster.md
[Stop and Start feature]: start-stop-cluster.md
[azure-npm]: ../virtual-network/kubernetes-network-policies.md
[cluster-autoscaler]: cluster-autoscaler.md
