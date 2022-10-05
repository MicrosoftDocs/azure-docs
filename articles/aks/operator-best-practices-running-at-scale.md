---
title: Best practices for running AKS at sccale 
titleSuffix: Azure Kubernetes Service
description: Learn the cluster operator best practices and special considerations for running large clusters at 500 node scale and beyond 
services: container-service
ms.topic: conceptual
ms.date: 10/04/2022
 
---

# Best practices for creating and running Azure Kubernetes Service (AKS) clusters at scale(beyond 500 nodes)

AKS Clusters whcih satisfy any of the below criteria should use the [Uptime SLA][Uptime SLA] feature for higher reliability and scalability of the Kubernetes control plan:
* Clusters running greater than 10 nodes on average
* Clusters that need to scale beyond 1000 nodes 
* Clusters running production workloads or aviability sensitive mission critical workloads

If you want to scale AKS clusters beyond 1000 nodes default limit, you can request a node limit quota increase by raising a support ticket via the [Azure Portal][Azure Portal] with a maximum node limit of up-to 5000 nodes per cluster. 

To increase the node limit beyond 1,000, you must have the following:
1.	Existing AKS cluster that needs the node limit increase (the cluster should not be deleted as that will remove the limit increase)
2.	Cluster must be using “Uptime-SLA” feature.

> **Note**: It may take up to a week to enable your clusters with the larger node limit.

> **Important**: Raising the node limit does not increase other AKS service quota limits such as no. of pods per node etc. For more information, please refer to the documentation [quotas-skus-regions][quotas-skus-regions].

**Networking consideration and best practice:**

* Use Managed NAT for cluster egress with at least 2 public IPs on the NAT Gateway. To learn more click [Managed NAT Gateway - Azure Kubernetes Service][Managed NAT Gateway - Azure Kubernetes Service]
* Use Azure CNI with Dynamic IP allocation for optimum IP utilization and scale up to 50k application pods per cluster with 1 routable IP per pod. To learn more click [Configure Azure CNI networking in Azure Kubernetes Service (AKS)][Configure Azure CNI networking in Azure Kubernetes Service (AKS)]

> **Note**: Currently, you cannot use NPM with clusters greater than 500 Nodes 

> **Best practice Guidance**: When using internal Kubernetes services behind an Internal Load Balancer – it is recommended to create an ILB or internal service at < 750 Node scale for best scaling performance and load balancer elasticity

**Nodepool scaling Considerations and best practices:**

* For system node pools use Standard_D16ds_v5 VM or equivalent core/memory VM SKUs to provide sufficient compute resources for kube-system pods
* Create 5 user pools using VMSS to scale up to 5,000 Nodes as the per Node pool limit is 1000
* Use cluster Autoscaler wherever possible when running at-scale AKS clusters to ensure dynamic scaling of node pools based on the demand for compute resources
* For scaling beyond 1000 nodes (when not using Cluster Autoscaler) – it is recommended to pace the cluster scaling by scaling in batches of max. 500-700 nodes at a time with 2-5 mins sleep time between consecutive scale-ups to prevent Azure API throttling

**Cluster Upgrade best practices:**

AKS clusters currently have a hard node limit of 5000, hence you cannot upgrade a AKS cluster already running 5000 nodes as there is not headroom to do a rolling update with the max surge property. We recommend scaling the cluster down below 3,000 nodes before doing cluster upgrades to provide headroom for node churn and minimize control plane load.

By default, AKS configures upgrades to surge with one extra node. A default value of one for the max surge settings will enable AKS to minimize workload disruption by creating an extra node before the cordon/drain of existing applications to replace an older versioned node. When upgrading clusters with a large no. of nodes, using the default value of max-surge means that it can take several hours to upgrade the entire cluster as AKS churns through 100s of nodes. You can customize the max-surge property per node pool to enable a trade-off between upgrade speed and upgrade disruption. By increasing the max surge value, the upgrade process completes faster, but setting a large value for max surge may cause disruptions during the upgrade process.
* It is not recommended to upgrade a cluster with greater than 500 nodes with the default max-surge configuration of 1 node.
* We suggest increasing the max-surge value to between 10-20% with up to a maximum of 500 nodes max-surge based on your workload disruption tolerance. 
* Please read more about [cluster upgrades][cluster upgrades] and [max surge][max surge].

<!-- Links - External -->
[Managed NAT Gateway - Azure Kubernetes Service]: https://learn.microsoft.com/azure/aks/nat-gateway
[Configure Azure CNI networking in Azure Kubernetes Service (AKS)]: https://learn.microsoft.com/azure/aks/configure-azure-cni#dynamic-allocation-of-ips-and-enhanced-subnet-support
[max surge]: https://learn.microsoft.com/azure/aks/upgrade-cluster?tabs=azure-cli#customize-node-surge-upgrade
[Azure Portal]: https://ms.portal.azure.com/#create/Microsoft.Support/Parameters/%7B%0D%0A%09%22subId%22%3A+%22%22%2C%0D%0A%09%22pesId%22%3A+%225a3a423f-8667-9095-1770-0a554a934512%22%2C%0D%0A%09%22supportTopicId%22%3A+%2280ea0df7-5108-8e37-2b0e-9737517f0b96%22%2C%0D%0A%09%22contextInfo%22%3A+%22AksLabelDeprecationMarch22%22%2C%0D%0A%09%22caller%22%3A+%22Microsoft_Azure_ContainerService+%2B+AksLabelDeprecationMarch22%22%2C%0D%0A%09%22severity%22%3A+%223%22%0D%0A%7D
[uptime SLA]: https://learn.microsoft.com/azure/aks/uptime-sla

<!-- LINKS - Internal -->
[quotas-skus-regions]: ../articles/aks/quotas-skus-regions.md
[cluster upgrades]: ../articles/aks/upgrade-cluster.md
