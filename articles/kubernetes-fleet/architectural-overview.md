---
title: "Azure Kubernetes Fleet Manager architectural overview"
description: This article provides an architectural overview of Azure Kubernetes Fleet Manager
ms.date: 11/06/2023
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: ignite-2023
ms.topic: conceptual
---

# Architectural overview of Azure Kubernetes Fleet Manager

Azure Kubernetes Fleet Manager (Fleet) is meant to solve at-scale and multi-cluster problems of Azure Kubernetes Service (AKS) clusters. This document provides an architectural overview of topological relationship between a Fleet resource and AKS clusters. This document also provides a conceptual overview of scenarios available on top of Fleet resource like Kubernetes resource propagation and multi-cluster Layer-4 load balancing.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Relationship between Fleet and Azure Kubernetes Service clusters

[ ![Diagram that shows relationship between Fleet and Azure Kubernetes Service clusters.](./media/conceptual-fleet-aks-relationship.png) ](./media/conceptual-fleet-aks-relationship.png#lightbox)

Fleet supports joining the following types of existing AKS clusters as member clusters:

* AKS clusters across same or different resource groups within same subscription
* AKS clusters across different subscriptions of the same Microsoft Entra tenant
* AKS clusters from different regions but within the same tenant

You can join up to 100 AKS clusters as member clusters to the same fleet resource.

If you want to use fleet only for the update orchestration scenario, you can create a fleet resource without the hub cluster. The fleet resource is treated just as a grouping resource, and does not have its own data plane. This is the default behavior when creating a new fleet resource.

If you want to use fleet for Kubernetes object propagation and multi-cluster load balancing in addition to update orchestration, then you need to create the fleet resource with the hub cluster enabled. If you have a hub cluster data plane for the fleet, you can use it to check the member clusters joined.

Once a cluster is joined to a fleet resource, a MemberCluster custom resource is created on the fleet. Note that once a fleet resource has been created, it is not possible to change the hub mode (with/without) for the fleet resource.

The member clusters can be viewed by running the following command:

```bash
kubectl get memberclusters -o yaml
```

The complete specification of the `MemberCluster` custom resource can be viewed by running the following command:

```bash
kubectl get crd memberclusters.fleet.azure.com -o yaml
```

The following labels are added automatically to all member clusters, which can then be used for target cluster selection in resource propagation.

* `fleet.azure.com/location`
* `fleet.azure.com/resource-group`
* `fleet.azure.com/subscription-id`

## Update orchestration across multiple clusters

Platform admins managing Kubernetes fleets with large number of clusters often have problems with staging their updates in a safe and predictable way across multiple clusters. To address this pain point, Fleet allows orchestrating updates across multiple clusters using update runs, stages, and groups.

:::image type="content" source="./media/conceptual-update-orchestration-inline.png" alt-text="A diagram showing an upgrade run containing two update stages, each containing two update groups with two member clusters." lightbox="./media/conceptual-update-orchestration.png":::

* **Update group**: A group of AKS clusters for which updates are done sequentially one after the other. Each member cluster of the fleet can only be a part of one update group.
* **Update stage**: Update stages allow pooling together update groups for which the updates need to be run in parallel. It can be used to define wait time between two different collections of update groups.
* **Update run**: An update being applied to a collection of AKS clusters in a sequential or stage-by-stage manner. An update run can be stopped and started. An update run can either upgrade clusters one-by-one or in a stage-by-stage fashion using update stages and update groups.
* **Update strategy**: Update strategy allows you to store templates for your update runs instead of creating them individually for each update run.

Currently, the only supported update operations on the cluster are upgrades. Within upgrades, you can either upgrade both the Kubernetes control plane version and the node image or you can choose to upgrade only the node image. Node image upgrades currently only allow upgrading to either the latest available node image for each cluster, or applying the same consistent node image across all clusters of the update run. As it's possible for an update run to have AKS clusters across multiple regions where the latest available node images can be different (check [release tracker](../aks/release-tracker.md) for more information). The update run picks the **latest common** image across all these regions to achieve consistency.

## Kubernetes resource propagation

Fleet provides `ClusterResourcePlacement` as a mechanism to control how cluster-scoped Kubernetes resources are propagated to member clusters. For more details, see the [resource propagation documentation](resource-propagation.md).

[ ![Diagram that shows how Kubernetes resource are propagated to member clusters.](./media/conceptual-resource-propagation.png) ](./media/conceptual-resource-propagation.png#lightbox)

## Multi-cluster load balancing

Fleet can be used to set up layer 4 multi-cluster load balancing across workloads deployed across a fleet's member clusters.

[ ![Diagram that shows how multi-cluster load balancing works.](./media/conceptual-load-balancing.png) ](./media/conceptual-load-balancing.png#lightbox)

For multi-cluster load balancing, Fleet requires target clusters to be using [Azure CNI networking](../aks/configure-azure-cni.md). Azure CNI networking enables pod IPs to be directly addressable on the Azure virtual network so that they can be routed to from the Azure Load Balancer.

The ServiceExport itself can be propagated from the fleet cluster to a member cluster using the Kubernetes resource propagation feature, or it can be created directly on the member cluster. Once this ServiceExport resource is created, it results in a ServiceImport being created on the fleet cluster, and all other member clusters to build the awareness of the service

The user can then create a `MultiClusterService` custom resource to indicate that they want to set up Layer 4 multi-cluster load balancing. This `MultiClusterService` results in the member cluster mapped Azure Load Balancer being configured to load balance incoming traffic across endpoints of this service on multiple member clusters.

## Next steps

* Create an [Azure Kubernetes Fleet Manager resource and join member clusters](./quickstart-create-fleet-and-members.md)
