---
title: "Update orchestration across multiple member clusters"
description: This article describes the concept of update orchestration across multiple clusters.
ms.date: 03/04/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom:
  - build-2024
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

## Planned maintenance

Update runs honor [planned maintenance windows](../aks/planned-maintenance.md) that you set at the Azure Kubernetes Service (AKS) cluster level.

Within an update run (for both [One by one](./update-orchestration.md#update-all-clusters-one-by-one) or [Stages](./update-orchestration.md#update-clusters-in-a-specific-order) type update runs), update run prioritizes upgrading the clusters in the following order: 
  1. Member with an open ongoing maintenance window.
  1. Member with maintenance window opening in the next four hours.
  1. Member with no maintenance window.
  1. Member with a closed maintenance window.

## Update run states

An update run can be in one of the following states:

- **NotStarted**: State of the update run before it is started.
- **Running**: Upgrade is in progress for at least one of the clusters in the update run.
- **Pending**: 
  - **Member cluster**: A member cluster can be in the pending state for any of the following reasons and are surfaced under the message field.
    - Maintenance window is not open. Message indicates next opening time.
    - Target Kubernetes version is not yet available in the region of the member. Message links to the release tracker so that you can check status of the release across regions.
    - Target node image version is not yet available in the region of the member. Message links to the release tracker so that you can check status of the release across regions.
  - **Group**: A group is in `Pending` state if all members in the groups are in `Pending` state or not started. When a member moves to `Pending`, the update run will attempt to upgrade the next member in the group. If all members are in `Pending` status, the group moves to `Pending` state. All groups must be in terminal state before moving to the next stage. That is, if a group is in `Pending` state, the update run waits for it to complete before moving on to the next stage for execution.
  - **Stage**: A stage is in `Pending` if all groups under that stage are in `Pending` state or not started.
  - **Run**: A run is in `Pending` state if the current stage that should be running is in `Pending` state.
- **Skipped**: All levels of an update run can be skipped and this could either be system-detected or user-initiated.
  - **Member**:
    - You have skipped upgrade for a member or one of its parents.
    - Member cluster is already at the target Kubernetes version (if update run mode is `Full` or `ControlPlaneOnly`).
    - Member cluster is already at the target Kubernetes version and all node pools are at the target node image version.
    - When consistent node image is chosen for an upgrade run, if it's not possible to find the target image version for one of the node pools, then upgrade is skipped for that cluster. An example situation for this is when a new node pool with a new VM SKU is added after an update run has started.
  - **Group**:
    - All member clusters were detected as `Skipped` by the system.
    - You initiated a skip at the group level.
  - **Stage**:
    - All groups in the stage were detected as `Skipped` by the system.
    - You initiated a skip at the stage level.
  - **Run**:
    - All stages were detected as `Skipped` by the system.

- **Stopped**: All levels of an update run can be stopped. There are two possibilities for entering a stopped state:
  - You stop the update run, at which point update run stops tracking all operations. If an operation was already initiated by update run (for example, a cluster upgrade is in progress), then that operation is not aborted for that individual cluster.
  - If a failure is encountered during the update run (for example upgrades failed on one of the clusters), the entire update run enters into a stop state and operated are not attempted for any subsequent cluster in the update run.

- **Failed**: A failure to upgrade a cluster will result in the following actions:
  - Marks the `MemberUpdateStatus` as `Failed` on the member cluster.
  - Marks all parents (group -> stage -> run) as `Failed` with a summary error message.
  - Stops the update run from progressing any further.

## Next steps

* [Orchestrate updates across multiple member clusters](./update-orchestration.md).
