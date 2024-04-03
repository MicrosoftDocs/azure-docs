---
title: "Update orchestration across multiple member clusters"
description: This article describes the concept of update orchestration across multiple clusters.
ms.date: 03/04/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.topic: conceptual
---

# Update orchestration across multiple member clusters

Platform admins managing large number of clusters often have problems with staging the updates of multiple clusters (for example, upgrading node OS image versions, upgrading Kubernetes versions) in a safe and predictable way. To address this pain point, Azure Kubernetes Fleet Manager (Fleet) allows you to orchestrate updates across multiple clusters using update runs, stages, groups, and strategies.

:::image type="content" source="./media/conceptual-update-orchestration-inline.png" alt-text="A diagram showing an upgrade run containing two update stages, each containing two update groups with two member clusters." lightbox="./media/conceptual-update-orchestration.png":::

* **Update run**: An update run represents an update being applied to a collection of AKS clusters, consisting of the update goal and sequence. The update goal describes the desired updates (for example, upgrading to Kubernetes version 1.28.3). The update sequence describes the exact order to apply the updates to multiple member clusters, expressed using stages and groups. If unspecified, all the member clusters are updated one by one sequentially. An update run can be stopped and started.
* **Update stage**: Update runs are divided into stages, which are applied sequentially. For example, a first update stage might update test environment member clusters, and a second update stage would then later update production environment member clusters. A wait time can be specified to delay between the application of subsequent update stages.
* **Update group**: Each update stage contains one or more update groups, which are used to select the member clusters to be updated. Update groups are also used to order the application of updates to member clusters. Within an update stage, updates are applied to all the different update groups in parallel; within an update group, member clusters update sequentially. Each member cluster of the fleet can only be a part of one update group.
* **Update strategy**: An update strategy describes the update sequence with stages and groups. You can reuse a strategy in your update runs instead of defining the sequence repeatedly in each run.

Currently, the supported update operations on the cluster are upgrades. There are two types of upgrades you can choose from:

- Upgrade Kubernetes versions for the Kubernetes control plane and the nodes (which includes upgrading the node images).
- Upgrade only the node images.

You can specify the target Kubernetes version to upgrade to, but you can't specify the exact target node image versions as the latest available node image versions may vary depending on the region of the cluster (check [release tracker](../aks/release-tracker.md) for more information).
The target node image versions are automatically selected for you based on your preferences:

- `Latest`: Use the latest node images available in the region of a cluster when the upgrade of the cluster starts. As a result, different image versions could be used depending on which region a cluster is in and when its upgrade actually starts.
- `Consistent`: When the update run starts, it picks the **latest common** image versions across the regions of the member clusters in this run, such that the same, consistent image versions are used across clusters.

You should choose `Latest` to use fresher image versions and minimize security risks, and choose `Consistent` to improve reliability by using and verifying those images in clusters in earlier stages before using them in later clusters.

## Next steps

* [Orchestrate updates across multiple member clusters](./update-orchestration.md).
