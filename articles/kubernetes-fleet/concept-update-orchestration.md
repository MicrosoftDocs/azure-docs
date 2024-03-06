---
title: "Update orchestration across multiple member clusters"
description: This article describes the concept of update orchestration across multiple clusters
ms.date: 03/04/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Update orchestration across multiple member clusters

Platform admins managing large number of clusters often have problems with staging the updates of multiple clusters (e.g., upgrading node OS image versions, upgrading Kubernetes versions) in a safe and predictable way. To address this pain point, Azure Kubernetes Fleet Manager (Fleet) allows you to orchestrate updates across multiple clusters using update runs, stages, groups, and strategies.

:::image type="content" source="./media/conceptual-update-orchestration-inline.png" alt-text="A diagram showing an upgrade run containing two update stages, each containing two update groups with two member clusters." lightbox="./media/conceptual-update-orchestration.png":::

* **Update run**: An update run represents an update being applied to a collection of AKS clusters. An update run updates clusters in a predictable fashion by defining update stages and update groups. An update run can be stopped and started.
* **Update stage**: Update runs are divided into stages which are applied sequentially. For example, a first update stage might update test environment member clusters, and a second update stage would then subsequently update production environment member clusters. A wait time can be specified to delay between the application of subsequent update stages.
* **Update group**: Each update stage contains one or more update groups, which are used to select the member clusters to be updated. Update groups are also used to order the application of updates to member clusters. Within an update stage, updates are applied to all the different update groups in parallel; within an update group, member clusters update sequentially. Each member cluster of the fleet can only be a part of one update group.
* **Update strategy**: Update strategies allows you to store templates for your update runs instead of creating them individually for each update run.

Currently, the supported update operations on the cluster are upgrades. Within upgrades, you can either upgrade both the Kubernetes control plane version and the node image, or you can choose to upgrade only the node image. The latest available node image for a given cluster may vary based on its region (check [release tracker](../aks/release-tracker.md) for more information). Node image upgrades currently support upgrading each cluster to the latest node image available in its region, or applying a consistent node image across all clusters of the update run, regardless of the cluster regions. In this case the update run picks the **latest common** image across all these regions to achieve consistency.

## Next steps

* [Orchestrate updates across multiple member clusters](./update-orchestration.md).
