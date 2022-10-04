---
title: Best practices for running AKS at sccale 
titleSuffix: Azure Kubernetes Service
description: Learn the cluster operator best practices and special considerations for running large clusters at 500 node scale and beyond 
services: container-service
ms.topic: conceptual
ms.date: 10/04/2022
 
---

# Best practices for creating and running Azure Kubernetes Service (AKS) clusters at scale(beyond 500 nodes)

You can lift the 1000 node default node limit for an AKS cluster by raising a support ticket here ; with a maximum node limit of up-to 5,000 Nodes per cluster. It may take up to a week to enable your clusters with the larger node limit so please plan accordingly.
To increase the node limit beyond 1,000 there are two pre-requisites that the customer must ensure:
1.	Existing AKS cluster that needs the node limit increase (the cluster should not be deleted as that will remove the limit increase)
2.	Cluster must be using “Uptime-SLA” feature.

> **Important**: Raising the node limit does not increase other AKS service quota limits such as no. of pods per node etc. For more information, please refer to the documentation [quotas-skus-regions][quotas-skus-regions].

**Networking consideration and best practice:**

* Use Managed NAT for Egress with at least 2 public Ips on the NAT Gateway. To learn more click [Managed NAT Gateway - Azure Kubernetes Service][Managed NAT Gateway - Azure Kubernetes Service]
* Use Azure CNI with Dynamic IP allocation to be drive better IP allocation and scale up to 50k application pods per cluster with 1 routable IP per pod . To learn more click [Configure Azure CNI networking in Azure Kubernetes Service (AKS)][Configure Azure CNI networking in Azure Kubernetes Service (AKS)]

> **Note**: Currently, you cannot use NPM with clusters greater than 500 Nodes 

> **Best practice Guidance**: When using internal Kubernetes services behind an Internal Load Balancer – it is recommended to create an ILB or internal service at < 750 Node scale for best scaling performance and load balancer elasticity

**Nodepool scaling Considerations and best practices:**

* For your system Node pools we suggest using Standard_D16ds_v5 VM or equivalent core/memory VM SKUs
* Create 5 user pools using VMSS to be able to scale up to 5,000 Nodes as the per Node pool limit is 1,000
* We recommend customers to use cluster Autoscaler wherever possible when running at-scale AKS clusters to ensure dynamic scaling of node pools based on the demand for compute resources
* For scaling beyond 1,000 nodes (when not using Cluster Autoscaler) – it is recommended to pace the cluster scaling by scaling in batches of 500-700 nodes at a time with 2-4 mins of sleep time between consecutive scale-ups

**Cluster Upgrade best practices:**

* Due to the 5,000 node hard limit, you cannot upgrade a AKS cluster running at 5,000 nodes scale as there is not headroom to do a rolling update with the max surge property. We recommend scaling the cluster down below 3,000 nodes before doing cluster upgrades to provide headroom for node churn and minimize control plane load.
* It is not recommended to upgrade a cluster with greater than 500 nodes with the default max-surge configuration of 1 node as it may take several hours to complete the upgrade. We suggest increasing the max-surge value to between 10-20% with up to a maximum of 500 nodes max-surge based on your workload disruption tolerance. Please read more about cluster upgrades and [max surge][max surge].

<!-- Links - External -->
[Managed NAT Gateway - Azure Kubernetes Service]: https://learn.microsoft.com/en-us/azure/aks/nat-gateway
[Configure Azure CNI networking in Azure Kubernetes Service (AKS)]: https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni#dynamic-allocation-of-ips-and-enhanced-subnet-support
[max surge]: https://learn.microsoft.com/en-us/azure/aks/upgrade-cluster?tabs=azure-cli#customize-node-surge-upgrade

<!-- LINKS - Internal -->
[quotas-skus-regions]: ../articles/aks/quotas-skus-regions.md
