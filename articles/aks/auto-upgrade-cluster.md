---
title: Automatically upgrade an Azure Kubernetes Service (AKS) cluster
description: Learn how to automatically upgrade an Azure Kubernetes Service (AKS) cluster to get the latest features and security updates.
ms.topic: article
ms.author: nickoman
author: nickomang
ms.date: 05/01/2023
---

# Automatically upgrade an Azure Kubernetes Service (AKS) cluster

Part of the AKS cluster lifecycle involves performing periodic upgrades to the latest Kubernetes version. It’s important you apply the latest security releases or upgrade to get the latest features. Before learning about auto-upgrade, make sure you understand the [AKS cluster upgrade fundamentals][upgrade-aks-cluster].

> [!NOTE]
> Any upgrade operation, whether performed manually or automatically, upgrades the node image version if it's not already on the latest version. The latest version is contingent on a full AKS release and can be determined by visiting the [AKS release tracker][release-tracker].
>
> Auto-upgrade first upgrades the control plane, and then upgrades agent pools one by one.

## Why use cluster auto-upgrade

Cluster auto-upgrade provides a "set once and forget" mechanism that yields tangible time and operational cost benefits. By enabling auto-upgrade, you can ensure your clusters are up to date and don't miss the latest features or patches from AKS and upstream Kubernetes.

AKS follows a strict supportability versioning window. With properly selected auto-upgrade channels, you can avoid clusters falling into an unsupported version. For more on the AKS support window, see [Alias minor versions][supported-kubernetes-versions].

## Customer versus AKS-initiated auto-upgrades

You can specify cluster auto-upgrade specifics using the following guidance. The upgrades occur based on your specified cadence and are recommended to remain on supported Kubernetes versions.

AKS also initiates auto-upgrades for unsupported clusters. When a cluster in an n-3 version (where n is the latest supported AKS GA minor version) is about to drop to n-4, AKS automatically upgrades the cluster to n-2 to remain in an AKS support [policy][supported-kubernetes-versions]. Automatically upgrading a platform supported cluster to a supported version is enabled by default. Stopped nodepools will be upgraded during an auto-upgrade operation. The upgrade will apply to nodes when the node pool is started.

For example, Kubernetes v1.25 will upgrade to v1.26 during the v1.29 GA release. To minimize disruptions, set up [maintenance windows][planned-maintenance].

## Cluster auto-upgrade limitations

If you’re using cluster auto-upgrade, you can no longer upgrade the control plane first, and then upgrade the individual node pools. Cluster auto-upgrade always upgrades the control plane and the node pools together. You can't upgrade the control plane only. Running the `az aks upgrade --control-plane-only` command raises the following error: `NotAllAgentPoolOrchestratorVersionSpecifiedAndUnchanged: Using managed cluster api, all Agent pools' OrchestratorVersion must be all specified or all unspecified. If all specified, they must be stay unchanged or the same with control plane.`

If using the `node-image` cluster auto-upgrade channel or the `NodeImage` node image auto-upgrade channel, Linux [unattended upgrades][unattended-upgrades] is disabled by default.

## Use cluster auto-upgrade

Automatically completed upgrades are functionally the same as manual upgrades. The [selected auto-upgrade channel][planned-maintenance] determines the timing of upgrades. When making changes to auto-upgrade, allow 24 hours for the changes to take effect. Automatically upgrading a cluster follows the same process as manually upgrading a cluster. For more information, see [Upgrade an AKS cluster][upgrade-aks-cluster].

The following upgrade channels are available:

|Channel| Action | Example
|---|---|---|
| `none`| disables auto-upgrades and keeps the cluster at its current version of Kubernetes.| Default setting if left unchanged.|
| `patch`| automatically upgrades the cluster to the latest supported patch version when it becomes available while keeping the minor version the same.| For example, if a cluster runs version *1.17.7*, and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, the cluster upgrades to *1.17.9*.|
| `stable`| automatically upgrades the cluster to the latest supported patch release on minor version *N-1*, where *N* is the latest supported minor version.| For example, if a cluster runs version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, the cluster upgrades to *1.18.6*.|
| `rapid`| automatically upgrades the cluster to the latest supported patch release on the latest supported minor version.| In cases where the cluster's Kubernetes version is an *N-2* minor version, where *N* is the latest supported minor version, the cluster first upgrades to the latest supported patch version on *N-1* minor version. For example, if a cluster runs version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, the cluster first upgrades to *1.18.6*, then upgrades to *1.19.1*.|
| `node-image`| automatically upgrades the node image to the latest version available.| Microsoft provides patches and new images for image nodes frequently (usually weekly), but your running nodes don't get the new images unless you do a node image upgrade. Turning on the node-image channel automatically updates your node images whenever a new version is available. If you use this channel, Linux [unattended upgrades] are disabled by default. Node image upgrades will work on patch versions that are deprecated, so long as the minor Kubernetes version is still supported.|

> [!NOTE]
>
> Keep the following information in mind when using cluster auto-upgrade:
>
> * Cluster auto-upgrade only updates to GA versions of Kubernetes and doesn't update to preview versions.
>
> * With AKS, you can create a cluster without specifying the exact patch version. When you create a cluster without designating a patch, the cluster runs the minor version's latest GA patch. To learn more, see [AKS support window][supported-kubernetes-versions].
>
> * Auto-upgrade requires the cluster's Kubernetes version to be within the [AKS support window][supported-kubernetes-versions], even if using the `node-image` channel.
>
> * If you're using the preview API `11-02-preview` or later, and you select the `node-image` cluster auto-upgrade channel, the [node image auto-upgrade channel][node-image-auto-upgrade] automatically sets to `NodeImage`.
>
> * Each cluster can only be associated with a single auto-upgrade channel. This is because your specified channel determines the Kubernetes version that runs on the cluster.

### Use cluster auto-upgrade with a new AKS cluster

* Set the auto-upgrade channel when creating a new cluster using the [`az aks create`][az-aks-create] command and the `auto-upgrade-channel` parameter.

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable --generate-ssh-keys
    ```

### Use cluster auto-upgrade with an existing AKS cluster

* Set the auto-upgrade channel on an existing cluster using the [`az aks update`][az-aks-update] command with the `auto-upgrade-channel` parameter.

    ```azurecli-interactive
    az aks update --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable
    ```

## Auto-upgrade in the Azure portal

If using the Azure portal, you can find auto-upgrade settings under the **Settings** > **Cluster configuration** blade by selecting **Upgrade version**. The `Patch` channel is selected by default.

:::image type="content" source="./media/auto-upgrade-cluster/portal-upgrade.png" alt-text="The screenshot of the upgrade blade for an AKS cluster in the Azure portal. The automatic upgrade field shows 'patch' selected, and several APIs deprecated between the selected Kubernetes version and the cluster's current version are described.":::

The Azure portal also highlights all the deprecated APIs between your current version and newer, available versions you intend to migrate to. For more information, see the [Kubernetes API removal and deprecation process][k8s-deprecation].

## Use auto-upgrade with Planned Maintenance

If using  Planned Maintenance and cluster auto-upgrade, your upgrade starts during your specified maintenance window.

> [!NOTE]
> To ensure proper functionality, use a maintenance window of *four hours or more*.

For more information on Planned Maintenance, see [Use Planned Maintenance to schedule maintenance windows for your Azure Kubernetes Service (AKS) cluster][planned-maintenance].

## Best practices for cluster auto-upgrade

Use the following best practices to help maximize your success when using auto-upgrade:

* To ensure your cluster is always in a supported version (i.e within the N-2 rule), choose either `stable` or `rapid` channels.
* If you're interested in getting the latest patches as soon as possible, use the `patch` channel. The `node-image` channel is a good fit if you want your agent pools to always run the most recent node images.
* To automatically upgrade node images while using a different cluster upgrade channel, consider using the [node image auto-upgrade][node-image-auto-upgrade] `NodeImage` channel.
* Follow [Operator best practices][operator-best-practices-scheduler].
* Follow [PDB best practices][pdb-best-practices].
* For upgrade troubleshooting information, see the [AKS troubleshooting documentation][aks-troubleshoot-docs].

<!-- INTERNAL LINKS -->
[supported-kubernetes-versions]: ./supported-kubernetes-versions.md
[upgrade-aks-cluster]: ./upgrade-cluster.md
[planned-maintenance]: ./planned-maintenance.md
[operator-best-practices-scheduler]: operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets
[node-image-auto-upgrade]: auto-upgrade-node-image.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[aks-troubleshoot-docs]: /support/azure/azure-kubernetes/welcome-azure-kubernetes

<!-- EXTERNAL LINKS -->
[pdb-best-practices]: https://kubernetes.io/docs/tasks/run-application/configure-pdb/
[release-tracker]: release-tracker.md
[k8s-deprecation]: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#:~:text=A%20deprecated%20API%20is%20one%20that%20has%20been,point%20you%20must%20migrate%20to%20using%20the%20replacement
[unattended-upgrades]: https://help.ubuntu.com/community/AutomaticSecurityUpdates