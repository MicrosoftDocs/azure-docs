---
title: "Fleets and member clusters"
description: This article describes the concepts of fleets and member clusters
ms.date: 03/04/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Fleets and member clusters

Azure Kubernetes Fleet Manager (Fleet) enables at-scale management of multiple Kubernetes clusters.
This document provides a conceptual overview of a fleet and its relationship with Kubernetes clusters managed by it.

The following diagram depicts the high-level relationship between a fleet and the member clusters managed by the fleet.
[ ![Diagram that shows relationship between Fleet and Azure Kubernetes Service clusters.](./media/conceptual-fleet-aks-relationship.png) ](./media/conceptual-fleet-aks-relationship.png#lightbox)

## What is a fleet?

A fleet is a regional Azure resource you can use to manage multiple Kubernetes clusters.

## What are member clusters?

You can join AKS clusters to a fleet.
Once joined, they become member clusters of the fleet.

Member clusters must reside in the same Microsoft Entra tenant as the fleet. But they can be in different regions, different resource groups, and/or different subscription

## What is a hub cluster (preview)?

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

You can create a fleet with or without a hub cluster. The hub cluster is a special AKS cluster whose lifecycle (i.e., creation, updating, upgrading, and deletion) is fully managed by Fleet.
The hub cluster serves as the control plane for member clusters.
Certain Fleet features require the existence of the hub cluster.

The following table lists the differences between a fleet without hub cluster and a fleet with hub cluster.

| | Without hub cluster | With hub cluster (preview) |
|-|-|-|
| Hub cluster hosting (preview) | :x: | :white_check_mark: |
| Member cluster limit | Up to 100 clusters | Up to 20 clusters |
| Update orchestration across multiple clusters | :white_check_mark: | :white_check_mark: |
| Kubernetes resource object propagation (preview) | :x: | :white_check_mark: |
| Multi-cluster L4 load balancing (preview) | :x: | :white_check_mark: |

### Hub cluster lockdown

Fleet automatically creates hub clusters in the same subscription as the fleet resource under managed resource groups with the name prefix `FL_`.

To ensure reliability of hub clusters, Fleet locks down hub clusters by denying any user initiated mutations to the corresponding AKS clusters (under Fleet-managed resource group `FL_`) and their underlying Azure resources like VMs (under AKS-managed resource group with name prefix `MC_FL_`) via Azure deny assignments.

Fleet also exempts hub clusters from Azure policies to avoid undesirable policy effects upon hub clusters.

## Billing

The fleet resource is free of charge.

If your fleet contains a hub cluster, the hub cluster is a standard tier AKS cluster created in the fleet subscription and paid by you.

## FAQs

### Can I change a fleet without hub cluster to a fleet with hub cluster?
No during hub cluster preview. It will be supported once hub clusters become generally available.

## Next steps

* [Create a fleet and join member clusters](./quickstart-create-fleet-and-members.md).