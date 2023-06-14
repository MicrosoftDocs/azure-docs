---
title: "Azure Kubernetes Fleet Manager architectural overview"
description: This article provides an architectural overview of Azure Kubernetes Fleet Manager
ms.date: 10/03/2022
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom: ignite-2022, build-2023
ms.topic: conceptual
---

# Architectural overview of Azure Kubernetes Fleet Manager

Azure Kubernetes Fleet Manager (Fleet) is meant to solve at-scale and multi-cluster problems of Azure Kubernetes Service (AKS) clusters. This document provides an architectural overview of topological relationship between a Fleet resource and AKS clusters. This document also provides a conceptual overview of scenarios available on top of Fleet resource like Kubernetes resource propagation and multi-cluster Layer-4 load balancing.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Relationship between Fleet and Azure Kubernetes Service clusters

[ ![Diagram that shows relationship between Fleet and Azure Kubernetes Service clusters.](./media/conceptual-fleet-aks-relationship.png) ](./media/conceptual-fleet-aks-relationship.png#lightbox)

Fleet supports joining the following types of existing AKS clusters as member clusters:

* AKS clusters across same or different resource groups within same subscription
* AKS clusters across different subscriptions of the same Azure AD tenant
* AKS clusters from different regions but within the same tenant

During preview, you can join up to 20 AKS clusters as member clusters to the same fleet resource.

Once a cluster is joined to a fleet resource, a MemberCluster custom resource is created on the fleet.

The member clusters can be viewed by running the following command:

```bash
kubectl get crd memberclusters.fleet.azure.com -o yaml
```

The complete specification of the `MemberCluster` custom resource can be viewed by running the following command:

```bash
kubectl get crd memberclusters -o yaml
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

Currently the only supported update operations on the cluster are upgrades. Within upgrades, you can either upgrade both the Kubernetes control plane version and the node image or you can choose to upgrade only the node image. Node image upgrades currently only allow upgrading to the latest available node image for each cluster.

## Kubernetes resource propagation

Fleet provides `ClusterResourcePlacement` as a mechanism to control how cluster-scoped Kubernetes resources are propagated to member clusters. 

[ ![Diagram that shows how Kubernetes resource are propagated to member clusters.](./media/conceptual-resource-propagation.png) ](./media/conceptual-resource-propagation.png#lightbox)

A `ClusterResourcePlacement` has two parts to it:

* **Resource selection**: The `ClusterResourcePlacement` custom resource is used to select which cluster-scoped Kubernetes resource objects need to be propagated from the fleet cluster and to select which member clusters to propagate these objects to. It supports the following forms of resource selection:
    * Select resources by specifying just the *<group, version, kind>*. This selection propagates all resources with matching *<group, version, kind>*.
    * Select resources by specifying the *<group, version, kind>* and name. This selection propagates only one resource that matches the *<group, version, kind>* and name.
    * Select resources by specifying the *<group, version, kind>* and a set of labels using `ClusterResourcePlacement` -> `LabelSelector`. This selection propagates all resources that match the *<group, version, kind>* and label specified.
    
    > [!NOTE]
    > `ClusterResourcePlacement` can be used to select and propagate namespaces, which are cluster-scoped resources. When a namespace is selected, all the namespace-scoped objects under this namespace are propagated to the selected member clusters along with this namespace. 

* **Target cluster selection**: The `ClusterResourcePlacement` custom resource can also be used to limit propagation of selected resources to a specific subset of member clusters. The following forms of target cluster selection are supported:

    * Select all the clusters by specifying empty policy under `ClusterResourcePlacement`
    * Select clusters by listing names of `MemberCluster` custom resources
    * Select clusters using cluster selectors to match labels present on `MemberCluster` custom resources

## Multi-cluster load balancing

Fleet can be used to set up layer 4 multi-cluster load balancing across workloads deployed across a fleet's member clusters.

[ ![Diagram that shows how multi-cluster load balancing works.](./media/conceptual-load-balancing.png) ](./media/conceptual-load-balancing.png#lightbox)

For multi-cluster load balancing, Fleet requires target clusters to be using [Azure CNI networking](../aks/configure-azure-cni.md). Azure CNI networking enables pod IPs to be directly addressable on the Azure virtual network so that they can be routed to from the Azure Load Balancer.

The ServiceExport itself can be propagated from the fleet cluster to a member cluster using the Kubernetes resource propagation feature, or it can be created directly on the member cluster. Once this ServiceExport resource is created, it results in a ServiceImport being created on the fleet cluster, and all other member clusters to build the awareness of the service

The user can then create a `MultiClusterService` custom resource to indicate that they want to set up Layer 4 multi-cluster load balancing. This `MultiClusterService` results in the member cluster mapped Azure Load Balancer being configured to load balance incoming traffic across endpoints of this service on multiple member clusters.

## Next steps

* Create an [Azure Kubernetes Fleet Manager resource and join member clusters](./quickstart-create-fleet-and-members.md)
