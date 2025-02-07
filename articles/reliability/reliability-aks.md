---
title: Reliability in Azure Kubernetes Service (AKS)
description: Find out about reliability in Azure Kubernetes Service (AKS), including availability zones and multi-region deployments.
author: schaffererin
ms.author: schaffererin
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions #Required  - use references_regions if specific regions are mentioned.
ms.service: azure-kubernetes-service
ms.date: 02/07/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who need to understand the details of how AKS works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure Kubernetes Service (AKS)

This article describes how you can make your Azure Kubernetes Service (AKS) workloads more resilient. It covers topics such as cluster configuration best practices for zonal/regional resiliency and recommended Kubernetes configurations for high availability.

## AKS cluster architecture

When you create an AKS cluster, the Azure platform automatically creates and configures a [control plane](/azure/aks/core-aks-concepts#control-plane) with the API server, etcd, the scheduler, and other pods required to manage your workload. The control plane is managed by AKS and doesn't require any configuration or management by you. AKS also deploys a [system node pool](/azure/aks/use-system-pools) to your subscription that hosts your add-ons and additional pods running in the *kube-system* namespace. Once this initial setup is complete, you can [add or delete node pools](/azure/aks/create-node-pools) for your own user workloads.

**Resiliency is a shared responsibility between you and Microsoft**. While AKS can ensure the reliability of the managed components, it's important to take your workload requirements into consideration when deploying your applications and selecting your node pool configurations.

AKS offers three pricing tiers for cluster management: **Free**, **Standard**, and **Premium**. For more information, see [Free, Standard, and Premium pricing tiers for Azure Kubernetes Service (AKS) cluster management](/azure/aks/free-standard-pricing-tiers). The Free tier enables you to use AKS to test your workloads. The Standard and Premium tiers are designed for production workloads.

## Production deployment recommendations

For recommendations on how to deploy production workloads in AKS, see the following articles:

- [Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)](/azure/aks/best-practices-app-cluster-reliability)
- [High availability and disaster recovery overview for Azure Kubernetes Service (AKS)](/azure/aks/ha-dr-overview)
- [Zone resiliency considerations for Azure Kubernetes Service (AKS)](/azure/aks/aks-zone-resiliency)

## Redundancy

To achieve redundancy in AKS, we recommend **deploying at least two replicas of your application** using [Azure Kubernetes Fleet Manager](/azure/kubernetes-fleet/overview) or an [active-active high availability solution](/azure/aks/active-active-solution). If deploying multiple clusters in multiple regions, make sure you [configure load balancing](/azure/aks/best-practices-app-cluster-reliability#standard-load-balancer) across pods.

## Transient faults

To protect against transient faults, we recommend the following:

- **[Pod Disruption Budgets (PDBs)](/azure/aks/best-practices-app-cluster-reliability#pod-disruption-budgets-pdbs)**: Ensures that a minimum number of pods remain available during voluntary disruptions.
- **[`maxUnavailable`](/azure/aks/best-practices-app-cluster-reliability#maxunavailable)**: Defines the maximum number of pods that can be unavailable during a rolling update of a deployment.
- **[Pod topology spread constraints](/azure/aks/best-practices-app-cluster-reliability#pod-topology-spread-constraints)**: Ensures that pods are spread across different nodes or zones to improve availability and reliability.

<!-- Add information about AKS reaction to unforeseen downtime of nodes (e.g. if the underlying host becomes unresponsive) -->

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

You can configure AKS to be *zone redundant*, which means your resources are spread across multiple availability zones. Zone redundancy helps you achieve resiliency and reliability for your production workloads. You can help ensure this by using the following best practices:

- **Run multiple replicas** to make the most of the zone redundancy. For example, if you have a three-zone cluster, run at least three replicas of your application.
- **Enable automatic scaling** through the [cluster autoscaler](/azure/aks/cluster-autoscaler) or [node autoprovisioning (NAP)](/azure/aks/node-autoprovision) to help ensure that your application can handle traffic spikes.
- **Use [zone redundant storage (ZRS)](/azure/aks/aks-zone-resiliency#make-your-storage-disk-decision)** for stateful workloads.
- **[Configure networking for zone resiliency](/azure/aks/aks-zone-resiliency#configure-az-aware-networking)** using [Azure VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways), [Azure Application Gateway v2](/azure/application-gateway/overview-v2), or [Azure Front Door](/azure/frontdoor/front-door-overview).

You can deploy zone redundant AKS resources into any [Azure region that supports availability zones](./availability-zones-region-support.md).

<!-- Add information about the different types of node pools customers can deploy (maybe we add another subsection for this? -->

### Region support

<!-- Add information on HA/DR docs, how to load balance across multiple clusters, Fleet -->

### Requirements

### Considerations

When using availability zones in AKS, consider the following:

- You can only define availability zones during creation of the cluster or node pool.
- It's not possible to update an existing non-availability zone cluster to use availability zones after creating the cluster.
- Clusters with availability zones enabled require using Azure Standard Load Balancer for distribution across zones. You can only define this load balancer type at cluster create time. For more information and the limitations of the standard load balancer, see [Azure load balancer standard SKU limitations](/azure/aks/load-balancer-standard#limitaitons).
- When implementing **availability zones with the [cluster autoscaler](/azure/aks/cluster-autoscaler-overview)**, we recommend using a single node pool for each zone. You can set the `--balance-similar-node-groups` parameter to `true` to maintain a balanced distribution of nodes across zones for your workloads during scale up operations. When this approach isn't implemented, scale down operations can disrupt the balance of nodes across zones. This configuration doesn't guarantee that similar node groups will have the same number of nodes:
  - Currently, balancing happens during scale up operations only. The cluster autoscaler scales down underutilized nodes regardless of the relative sizes of the node groups.
  - The cluster autoscaler adds nodes based on pending pods and the requests of the pods to calculate the number of nodes to add.
  - The cluster autoscaler only balances between node groups that can support the same set of pending pods.
- You can use Azure zone-redundant storage (ZRS) disks to replicate your storage across three availability zones in the region you select. A ZRS disk lets you recover from availability zone failure without data loss. For more information, see [ZRS for managed disks](/azure/virtual-machines/disks-redundancy#zone-redundant-storage-for-managed-disks).

### Cost

Availability zones are free to use. You only pay for the virtual machines (VMs) and other resources that you deploy in the availability zones.

### Configure availability zone support

[Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones)

### Capacity planning and management

We recommend that you use the following best practices for capacity planning and management:

- [Node autoprovisioning (NAP)](/azure/aks/node-autoprovision)
- [Single instance VM node pools](/azure/aks/virtual-machines-node-pools)
- [Go multi-region with Azure Kubernetes Fleet Manager](/azure/kubernetes-fleet-overview)

### Traffic routing between zones

### Data replication between zones

### Zone-down experience

### Failback

### Testing for zone failures

You can test for resiliency to failures using the following methods:

- [Cordon and drain nodes in a single availability zone](/azure/aks/aks-zone-resiliency#method-1-cordon-and-drain-nodes-in-a-single-az)
- [Simulate an availability zone failure using Azure Chaos Studio](/azure/aks/aks-zone-resiliency#method-2-simulate-an-az-failure-using-azure-chaos-studio)

## Multi-region support

To provide multi-region support for your AKS workloads, you can use Azure Kubernetes Fleet Manager. For more information, see the [Azure Kubernetes Fleet Manager documentation](/azure/kubernetes-fleet-overview).

## Backups

Azure Backup supports backing up AKS cluster resources and persistent volumes attached to the cluster using a backup extension. The Backup vault communicates with the AKS cluster through the extension to perform backup and restore operations.

For more information, see the following articles:

- [About AKS backup using Azure Backup (preview)](/azure/backup/azure-kubernetes-service-backup-overview)
- [Back up AKS using Azure Backup (preview)](/azure/backup/azure-kubernetes-service-cluster-backup)

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [link to article about how backups contribute to a resiliency strategy].

## Service-level agreement

The service-level agreement (SLA) for AKS describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [link to SLA for [service-name]].

## Related content

<!-- 10.Related content ---------------------------------------------------------------------
Required: Include any related content that points to a relevant task to accomplish,
or to a related topic. 

- [Reliability in Azure](/azure/availability-zones/overview.md)
-->