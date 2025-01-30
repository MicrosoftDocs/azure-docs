---
title: Reliability in Azure Kubernetes Service (AKS)
description: Find out about reliability in Azure Kubernetes Service (AKS), including availability zones and multi-region deployments.
author: schaffererin
ms.author: schaffererin
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions #Required  - use references_regions if specific regions are mentioned.
ms.service: azure-kubernetes-service
ms.date: 01/30/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who need to understand the details of how AKS works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure Kubernetes Service (AKS)

This article describes reliability support in Azure Kubernetes Service (AKS), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

When you create an AKS cluster, the Azure platform automatically creates and configures a control plane. AKS offers three pricing tiers for cluster management: **Free**, **Standard**, and **Premium**. For more information, see [Free, Standard, and Premium pricing tiers for Azure Kubernetes Service (AKS) cluster management](/azure/aks/free-standard-pricing-tiers).

## Production deployment recommendations

- [Deployment and cluster reliability best practices for Azure Kubernetes Service (AKS)](/azure/aks/best-practices-app-cluster-reliability)
- [High availability and disaster recovery overview for Azure Kubernetes Service (AKS)](/azure/aks/ha-dr-overview)
- [Zone resiliency considerations for Azure Kubernetes Service (AKS)](/azure/aks/aks-zone-resiliency)

## Redundancy

## Transient faults

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

You can configure AKS to be *zone redundant*, which means your resources are spread across multiple availability zones. Zone redundancy helps you achieve resiliency and reliability for your production workloads.

### Region support

You can deploy zone-redundant AKS resources into any [Azure region that supports availability zones](./availability-zones-region-support.md).

### Requirements

### Considerations

When using availability zones in AKS, consider the following:

- You can only define availability zones during creation of the cluster or node pool.
- It's not possible to update an existing non-availability zone cluster to use availability zones after creating the cluster.
- The chosen node size (VM SKU) selected must be available across all availability zones selected.
- Clusters with availability zones enabled require using Azure Standard Load Balancers for distribution across zones. You can only define this load balancer type at cluster create time. For more information and the limitations of the standard load balancer, see [Azure load balancer standard SKU limitations](/azure/aks/load-balancer-standard#limitaitons).
- When implementing **availability zones with the [cluster autoscaler](/azure/aks/cluster-autoscaler-overview)**, we recommend using a single node pool for each zone. You can set the `--balance-similar-node-groups` parameter to `true` to maintain a balanced distribution of nodes across zones for your workloads during scale up operations. When this approach isn't implemented, scale down operations can disrupt the balance of nodes across zones. This configuration doesn't guarantee that similar node groups will have the same number of nodes:
  - Currently, balancing happens during scale up operations only. The cluster autoscaler scales down underutilized nodes regardless of the relative sizes of the node groups.
  - The cluster autoscaler only adds as many nodes as required to run all existing pods. Some groups might have more nodes than others if they have more pods scheduled.
  - The cluster autoscaler only balances between node groups that can support the same set of pending pods.
- You can use Azure zone-redundant storage (ZRS) disks to replicate your storage across three availability zones in the region you select. A ZRS disk lets you recover from availability zone failure without data loss. For more information, see [ZRS for managed disks](/azure/virtual-machines/disks-redundancy#zone-redundant-storage-for-managed-disks).

### Cost

### Configure availability zone support

[Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones)

### Capacity planning and management

### Traffic routing between zones

### Data replication between zones

### Zone-down experience

### Failback

### Testing for zone failures  

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