---
title: Best practices for running AKS at scale 
titleSuffix: Azure Kubernetes Service
description: Learn the cluster operator best practices and special considerations for running large clusters at 500 node scale and beyond 
services: container-service
ms.topic: conceptual
ms.date: 10/04/2022
 
---

# Best practices for creating and running Azure Kubernetes Service (AKS) clusters at scale

AKS clusters that satisfy any of the below criteria should use the [Uptime SLA][Uptime SLA] feature for higher reliability and scalability of the Kubernetes control plan:
* Clusters running greater than 10 nodes on average
* Clusters that need to scale beyond 1000 nodes 
* Clusters running production workloads or availability sensitive mission critical workloads

To scale AKS clusters beyond 1000 nodes, you need to request a node limit quota increase by raising a support ticket via the [portal][Azure Portal] up-to a maximum of 5000 nodes per cluster. 

To increase the node limit beyond 1000, you must have the following pre-requisites:
- An existing AKS cluster that needs the node limit increase. This cluster shouldn't be deleted as that will remove the limit increase.
- Uptime SLA enabled on your cluster.

> [!NOTE] 
> It may take up to a week to enable your clusters with the larger node limit.

> [!IMPORTANT]
> Raising the node limit does not increase other AKS service quota limits, such as the number of pods per node. For more details, [Limits for resources, SKUs, regions][quotas-skus-regions].

## Networking considerations and best practices

* Use Managed NAT for cluster egress with at least 2 public IPs on the NAT Gateway. For more information, see [Managed NAT Gateway - Azure Kubernetes Service][Managed NAT Gateway - Azure Kubernetes Service].
* Use Azure CNI with Dynamic IP allocation for optimum IP utilization and scale up to 50k application pods per cluster with one routable IP per pod. For more information, see [Configure Azure CNI networking in Azure Kubernetes Service (AKS)][Configure Azure CNI networking in Azure Kubernetes Service (AKS)].
* When using internal Kubernetes services behind an internal load balancer, it's recommended to create an internal load balancer or internal service below 750 node scale for best scaling performance and load balancer elasticity.

> [!NOTE] 
> You can't use NPM with clusters greater than 500 Nodes 

## Node pool scaling considerations and best practices

* For system node pools, use the *Standard_D16ds_v5* SKU or equivalent core/memory VM SKUs with ephemeral OS disks to provide sufficient compute resources for *kube-system* pods.
* Create at-least five user node pools to scale up to 5,000 nodes since there's a 1000 nodes per node pool limit.
* Use cluster autoscaler wherever possible when running at-scale AKS clusters to ensure dynamic scaling of node pools based on the demand for compute resources.
* When scaling beyond 1000 nodes without cluster autoscaler, it's recommended to scale in batches of a maximum 500 to 700 nodes at a time. These scaling operations should also have 2 mins to 5-mins sleep time between consecutive scale-ups to prevent Azure API throttling.

> [!NOTE] 
> You can't use [Stop and Start feature][Stop and Start feature] on clusters enabled with the greater than 1000 node limit

## Cluster upgrade best practices

* AKS clusters have a hard limit of 5000 nodes. This limit prevents clusters from upgrading that are running at this limit since there's no more capacity do a rolling update with the max surge property. We recommend scaling the cluster down below 3000 nodes before doing cluster upgrades to provide extra capacity for node churn and minimize control plane load.
* By default, AKS configures upgrades to surge with one extra node through the max surge settings. This default value allows AKS to minimize workload disruption by creating an extra node before the cordon/drain of existing applications to replace an older versioned node. When you are upgrading clusters with a large number of nodes, using the default max surge settings can force an upgrade to take several hours to complete as the upgrade churns through a large number of nodes. You can customize the max surge settings per node pool to enable a trade-off between upgrade speed and upgrade disruption. By increasing the max surge settings, the upgrade process completes faster but may cause disruptions during the upgrade process.
* It isn't recommended to upgrade a cluster with greater than 500 nodes with the default max-surge configuration of one node. We suggest increasing the max surge settings to between 10 to 20 percent with up to a maximum of 500 nodes max-surge based on your workload disruption tolerance. 
* For more information, see [Upgrade an Azure Kubernetes Service (AKS) cluster][cluster upgrades].

<!-- Links - External -->
[Managed NAT Gateway - Azure Kubernetes Service]: nat-gateway.md
[Configure Azure CNI networking in Azure Kubernetes Service (AKS)]: configure-azure-cni.md#dynamic-allocation-of-ips-and-enhanced-subnet-support
[max surge]: upgrade-cluster.md?tabs=azure-cli#customize-node-surge-upgrade
[Azure Portal]: https://ms.portal.azure.com/#create/Microsoft.Support/Parameters/%7B%0D%0A%09%22subId%22%3A+%22%22%2C%0D%0A%09%22pesId%22%3A+%225a3a423f-8667-9095-1770-0a554a934512%22%2C%0D%0A%09%22supportTopicId%22%3A+%2280ea0df7-5108-8e37-2b0e-9737517f0b96%22%2C%0D%0A%09%22contextInfo%22%3A+%22AksLabelDeprecationMarch22%22%2C%0D%0A%09%22caller%22%3A+%22Microsoft_Azure_ContainerService+%2B+AksLabelDeprecationMarch22%22%2C%0D%0A%09%22severity%22%3A+%223%22%0D%0A%7D
[uptime SLA]: uptime-sla.md

<!-- LINKS - Internal -->
[quotas-skus-regions]: quotas-skus-regions.md
[cluster upgrades]: upgrade-cluster.md
[Stop and Start feature]: start-stop-cluster.md
