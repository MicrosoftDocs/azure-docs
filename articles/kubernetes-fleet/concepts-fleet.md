---
title: "Azure Kubernetes Fleet Manager and member clusters"
description: This article provides a conceptual overview of Azure Kubernetes Fleet Manager and member clusters.
ms.date: 04/23/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Azure Kubernetes Fleet Manager and member clusters

This article provides a conceptual overview of fleets, member clusters, and hub clusters in Azure Kubernetes Fleet Manager (Fleet).

## What are fleets?

A fleet resource acts as a grouping entity for multiple AKS clusters. You can use them to manage multiple AKS clusters as a single entity, orchestrate updates across multiple clusters, propagate Kubernetes resources across multiple clusters, and provide a single pane of glass for managing multiple clusters. You can create a fleet with or without a [hub cluster](#what-is-a-hub-cluster-preview).

A fleet consists of the following components:

:::image type="content" source="./media/concepts-fleet/fleet-architecture.png" alt-text="This screenshot shows a diagram of the fleet resource, including the hub cluster agent and the member cluster agent.":::

* **fleet-hub-agent**: A Kubernetes controller that creates and reconciles all the fleet-related custom resources (CRs) in the hub cluster.
* **fleet-member-agent**: A Kubernetes controller that creates and reconciles all the fleet-related CRs in the member clusters. This controller pulls the latest CRs from the hub cluster and consistently reconciles the member clusters to match the desired state.

## What are member clusters?

The `MemberCluster` represents a cluster-scoped API established within the hub cluster, serving as a representation of a cluster within the fleet. This API offers a dependable, uniform, and automated approach for multi-cluster applications to identify registered clusters within a fleet. It also facilitates applications in querying a list of clusters managed by the fleet or in observing cluster statuses for subsequent actions.

You can join Azure Kubernetes Service (AKS) clusters to a fleet as member clusters. Member clusters must reside in the same Microsoft Entra tenant as the fleet, but they can be in different regions, different resource groups, and/or different subscriptions.

### Taints

Member clusters support the specification of taints, which apply to the `MemberCluster` resource. Each taint object consists of the following fields:

* `key`: The key of the taint.
* `value`: The value of the taint.
* `effect`: The effect of the taint, such as `NoSchedule`.

Once a `MemberCluster` is tainted, it lets the [scheduler](./concepts-scheduler-scheduling-framework.md) know that the cluster shouldn't receive resources as part of the [resource propagation](./concepts-resource-propagation.md) from the hub cluster. The `NoSchedule` effect is a signal to the scheduler to avoid scheduling resources from a [`ClusterResourcePlacement`](./concepts-resource-propagation.md#what-is-a-clusterresourceplacement) to the `MemberCluster`.

For more information, see [the upstream Fleet documentation](https://github.com/Azure/fleet/blob/main/docs/concepts/MemberCluster/README.md).

## What is a hub cluster (preview)?

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

Certain scenarios of fleet such as update runs don't require a Kubernetes API and thus don't require a hub cluster. Fleet can be created without the hub cluster for such scenarios. In this mode, Fleet just acts as a grouping entity in Azure Resource Manager.

For other scenarios such as Kubernetes resource propagation, a hub cluster is required. This hub cluster is a special AKS cluster whose lifecycle (creation, upgrades, deletion) is managed by the fleet resource. Any Kubernetes objects provided to the hub cluster are only stored as configurations on this cluster. Pod creation is disabled on this locked down hub cluster. Thus Fleet doesn't allow running any user workloads on the hub cluster and instead only allows using hub cluster for storing configurations that need to be propagated to other clusters or configurations that control cross-cluster orchestration.

The following table lists the differences between a fleet without hub cluster and a fleet with hub cluster:

| Feature dimension | Without hub cluster | With hub cluster (preview) |
|-|-|-|
| Hub cluster hosting (preview) | :x: | :white_check_mark: |
| Member cluster limit | Up to 100 clusters | Up to 20 clusters |
| Update orchestration across multiple clusters | :white_check_mark: | :white_check_mark: |
| Kubernetes resource object propagation (preview) | :x: | :white_check_mark: |
| Multi-cluster L4 load balancing (preview) | :x: | :white_check_mark: |

Upon the creation of a fleet, a hub cluster is automatically created in the same subscription as the fleet under a managed resource group named as `FL_*`.

To improve reliability, hub clusters are locked down by denying any user initiated mutations to the corresponding AKS clusters (under the Fleet-managed resource group `FL_*`) and their underlying Azure resources like VMs (under the AKS-managed resource group `MC_FL_*`) via Azure deny assignments.

Hub clusters are exempted from Azure policies to avoid undesirable policy effects upon hub clusters.

## Billing

The fleet resource without hub cluster is currently free of charge. If your fleet contains a hub cluster, the hub cluster is a standard tier AKS cluster created in the fleet subscription and paid by you.

## FAQs

### Can I change a fleet without hub cluster to a fleet with hub cluster?

Not during hub cluster preview. This is planned to be supported once hub clusters become generally available.

## Next steps

* [Create a fleet and join member clusters](./quickstart-create-fleet-and-members.md).
