---
title: "Kubernetes resource propagation from hub cluster to member clusters (preview)"
description: This article describes the concept of Kubernetes resource propagation from hub cluster to member clusters
ms.date: 03/04/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Kubernetes resource propagation from hub cluster to member clusters (preview)

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

Platform admins often need to deploy Kubernetes resources into multiple clusters, for example:
* Roles and role bindings to manage who can access what.
* An infrastructure application that needs to be on all clusters, e.g., Prometheus, Flux.

Application developers often need to deploy Kubernetes resources into multiple clusters, for example:
* Deploy a video serving application into multiple clusters, one per region to offer low latency watching experience.
* Deploy a shopping cart application into two paired regions for customers to continue to shop during a single region outage.
* Deploy a batch compute application into clusters with inexpensive spot node pools available.

It is tedious to create and update these Kubernetes resources across tens or even hundreds of clusters, and track their current status in each cluster.
Azure Kubernetes Fleet Manager (Fleet) provides Kubernetes resource propagation to enable at-scale management of Kubernetes resources.

You can create Kubernetes resources in the hub cluster and propagate them to selected member clusters via Kubernetes Customer Resources: `MemberCluster` and `ClusterResourcePlacement`.
These custom resources are offered by Fleet based on an [open-source cloud-native multi-cluster solution][fleet-github].

## What is `MemberCluster`?

Once a cluster joins a fleet, a corresponding `MemberCluster` custom resource is created on the hub cluster.
You can use it to select target clusters in resource propagation.

The following labels are added automatically to all member clusters, which can be used for target cluster selection in resource propagation.

* `fleet.azure.com/location`
* `fleet.azure.com/resource-group`
* `fleet.azure.com/subscription-id`

You can find the API reference of `MemberCluster` [here](membercluster-api).

## What is `ClusterResourcePlacement`?

Fleet provides `ClusterResourcePlacement` as a mechanism to control how cluster-scoped Kubernetes resources are propagated to member clusters.

Via `ClusterResourcePlacement`, you can:
- Select which cluster-scoped Kubernetes resources to propagate to member clusters
- Specify placement policies to manually or automatically select a subset or all of the member clusters as target clusters
- Specify rollout strategies to safely roll out any updates of the selected Kubernetes resources to multiple target clusters
- View the propagation progress towards each target cluster

In order to propagate namespace-scoped resources, you can select a namespace which by default selecting both the namespace and all the namespace-scoped resources under it.

The following diagram shows a sample `ClusterResourcePlacement`.
[ ![Diagram that shows how Kubernetes resource are propagated to member clusters.](./media/conceptual-resource-propagation.png) ](./media/conceptual-resource-propagation.png#lightbox)

You can find the API reference of `ClusterResourcePlacement` [here](clusterresourceplacement-api).

## Next Steps

* [Set up Kubernetes resource propagation from hub cluster to member clusters](./resource-propagation.md).

<!-- LINKS - external -->
[fleet-github]: https://github.com/Azure/fleet
[membercluster-api]: https://github.com/Azure/fleet/blob/main/docs/api-references.md#membercluster
[clusterresourceplacement-api]: https://github.com/Azure/fleet/blob/main/docs/api-references.md#clusterresourceplacement