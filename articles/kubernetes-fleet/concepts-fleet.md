---
title: "Azure Kubernetes Fleet Manager and member clusters"
description: This article provides a conceptual overview of Azure Kubernetes Fleet Manager and member clusters.
ms.date: 03/04/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Azure Kubernetes Fleet Manager and member clusters

Azure Kubernetes Fleet Manager (Fleet) solves at-scale and multi-cluster problems for Kubernetes clusters.  This document provides a conceptual overview of fleet and its relationship with its member Kubernetes clusters. Right now Fleet supports joining AKS clusters as member clusters.

[ ![Diagram that shows relationship between Fleet and Azure Kubernetes Service clusters.](./media/conceptual-fleet-aks-relationship.png) ](./media/conceptual-fleet-aks-relationship.png#lightbox)

## Fleet scenarios

A fleet is an Azure resource you can use to group and manage multiple Kubernetes clusters. Currently fleet supports the following scenarios:
  * Create a Fleet resource and group AKS clusters as member clusters.
  * Orchestrate latest or consistent Kubernetes version and node image upgrades across multiple clusters by using update runs, stages, and groups
  * Create Kubernetes resource objects on the Fleet resource's hub cluster and control their propagation to member clusters (preview).
  * Export and import services between member clusters, and load balance incoming L4 traffic across service endpoints on multiple clusters (preview).

## What are member clusters?

You can join Azure Kubernetes Service (AKS) clusters to a fleet as member clusters. Member clusters must reside in the same Microsoft Entra tenant as the fleet. But they can be in different regions, different resource groups, and/or different subscriptions.

## What is a hub cluster (preview)?

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

Certain scenarios of fleet such as update runs don't require a Kubernetes API and thus don't require a hub cluster. Fleet can be created without the hub cluster for such scenarios. In this mode, Fleet just acts as a grouping entity in Azure Resource Manager.

For other scenarios such as Kubernetes resource propagation, a hub cluster is required. This hub cluster is a special AKS cluster whose lifecycle (creation, upgrades, deletion) is managed by the fleet resource. Any Kubernetes objects provided to the hub cluster are only stored as configurations on this cluster. Pod creation is disabled on this locked down hub cluster. Thus Fleet doesn't allow running any user workloads on the hub cluster and instead only allows using hub cluster for storing configurations that need to be propagated to other clusters or configurations that control cross-cluster orchestration.

The following table lists the differences between a fleet without hub cluster and a fleet with hub cluster:

| Feature Dimension | Without hub cluster | With hub cluster (preview) |
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
No during hub cluster preview, to be supported once hub clusters become generally available.

## Next steps

* [Create a fleet and join member clusters](./quickstart-create-fleet-and-members.md).