---
title: Automatically upgrade an Azure Kubernetes Service (AKS) cluster
description: Learn how to automatically upgrade an Azure Kubernetes Service (AKS) cluster to get the latest features and security updates.
ms.topic: article
ms.author: nickoman
author: nickomang
ms.date: 07/07/2022
---

# Automatically upgrade an Azure Kubernetes Service (AKS) cluster

Part of the AKS cluster lifecycle involves performing periodic upgrades to the latest Kubernetes version. It’s important you apply the latest security releases, or upgrade to get the latest features. Before learning about auto-upgrade, make sure you understand upgrade fundamentals by reading [Upgrade an AKS cluster][upgrade-aks-cluster].

> [!NOTE]
> Any upgrade operation, whether performed manually or automatically, will upgrade the node image version if not already on the latest. The latest version is contingent on a full AKS release, and can be determined by visiting the [AKS release tracker][release-tracker].
>
> Auto-upgrade will first upgrade the control plane, and then proceed to upgrade agent pools one by one.

## Why use cluster auto-upgrade

Cluster auto-upgrade provides a set once and forget mechanism that yields tangible time and operational cost benefits. By enabling auto-upgrade, you can ensure your clusters are up to date and don't miss the latest AKS features or patches from AKS and upstream Kubernetes.

AKS follows a strict versioning window with regard to supportability. With properly selected auto-upgrade channels, you can avoid clusters falling into an unsupported version. For more on the AKS support window, see [Alias minor versions][supported-kubernetes-versions].

## Cluster auto-upgrade limitations

If you’re using cluster auto-upgrade, you can no longer upgrade the control plane first and then upgrade the individual node pools. Cluster auto-upgrade will always upgrade the control plane and the node pools together. There is no ability of upgrading the control plane only, and trying to run the command `az aks upgrade --control-plane-only` will raise the error: `NotAllAgentPoolOrchestratorVersionSpecifiedAndUnchanged: Using managed cluster api, all Agent pools' OrchestratorVersion must be all specified or all unspecified. If all specified, they must be stay unchanged or the same with control plane.`

If using the `node-image` cluster auto-upgrade channel or the `NodeImage` node image auto-upgrade channel, Linux [unattended upgrades][unattended-upgrades] will be disabled by default.

## Using cluster auto-upgrade

Automatically completed upgrades are functionally the same as manual upgrades. The timing of upgrades is determined by the selected channel. When making changes to auto-upgrade, allow 24 hours for the changes to take effect.

The following upgrade channels are available:

|Channel| Action | Example
|---|---|---|
| `none`| disables auto-upgrades and keeps the cluster at its current version of Kubernetes| Default setting if left unchanged|
| `patch`| automatically upgrade the cluster to the latest supported patch version when it becomes available while keeping the minor version the same.| For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster is upgraded to *1.17.9*|
| `stable`| automatically upgrade the cluster to the latest supported patch release on minor version *N-1*, where *N* is the latest supported minor version.| For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster is upgraded to *1.18.6*.
| `rapid`| automatically upgrade the cluster to the latest supported patch release on the latest supported minor version.| In cases where the cluster is at a version of Kubernetes that is at an *N-2* minor version where *N* is the latest supported minor version, the cluster first upgrades to the latest supported patch version on *N-1* minor version. For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster first is upgraded to *1.18.6*, then is upgraded to *1.19.1*. 
| `node-image`| automatically upgrade the node image to the latest version available.| Microsoft provides patches and new images for image nodes frequently (usually weekly), but your running nodes won't get the new images unless you do a node image upgrade. Turning on the node-image channel will automatically update your node images whenever a new version is available. If you use this channel, Linux [unattended upgrades] will be disabled by default.|

> [!NOTE]
> Cluster auto-upgrade only updates to GA versions of Kubernetes and will not update to preview versions.

> [!NOTE]
> With AKS, you can create a cluster without specifying the exact patch version. When you create a cluster without designating a patch, the cluster will run the minor version's latest GA patch. To Learn more [AKS support window][supported-kubernetes-versions]

> [!NOTE]
> Auto-upgrade requires the cluster's Kubernetes version to be within the [AKS support window][supported-kubernetes-versions], even if using the `node-image` channel.

> [!NOTE]
> If using the preview API `11-02-preview` or later, if you select the `node-image` cluster auto-upgrade channel the [node image auto-upgrade channel][node-image-auto-upgrade] will automatically be set to `NodeImage`.

Automatically upgrading a cluster follows the same process as manually upgrading a cluster. For more information, see [Upgrade an AKS cluster][upgrade-aks-cluster].

To set the auto-upgrade channel when creating a cluster, use the *auto-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable --generate-ssh-keys
```

To set the auto-upgrade channel on existing cluster, update the *auto-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks update --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable
```

## Auto-upgrade in the Azure portal

If you're using the Azure portal, you can find auto-upgrade settings under the *Settings* > *Cluster configuration* blade by selecting *Upgrade version*. By default, the `Patch` channel is selected.

:::image type="content" source="./media/auto-upgrade-cluster/portal-upgrade.png" alt-text="The screenshot of the upgrade blade for an AKS cluster in the Azure portal. The automatic upgrade field shows 'patch' selected, and several APIs deprecated between the selected Kubernetes version and the cluster's current version are described.":::

The Azure portal also highlights all the deprecated APIs between your current version and newer, available versions you intend to migrate to. For more information, see [the Kubernetes API Removal and Deprecation process][k8s-deprecation].

## Using auto-upgrade with Planned Maintenance

If you’re using Planned Maintenance and cluster auto-upgrade, your upgrade will start during your specified maintenance window. 

> [!NOTE]
> To ensure proper functionality, use a maintenance window of four hours or more.

For more information on Planned Maintenance, see [Use Planned Maintenance to schedule maintenance windows for your Azure Kubernetes Service (AKS) cluster][planned-maintenance].

## Best practices for cluster auto-upgrade

The following best practices will help maximize your success when using auto-upgrade:

- In order to keep your cluster always in a supported version (i.e within the N-2 rule), choose either `stable` or `rapid` channels.
- If you're interested in getting the latest patches as soon as possible, use the `patch` channel. The `node-image` channel is a good fit if you want your agent pools to always be running the most recent node images.
- To automatically upgrade node images while using a different cluster upgrade channel, consider using the [node image auto-upgrade][node-image-auto-upgrade] `NodeImage` channel.
- Follow [Operator best practices][operator-best-practices-scheduler].
- Follow [PDB best practices][pdb-best-practices].

<!-- INTERNAL LINKS -->
[supported-kubernetes-versions]: supported-kubernetes-versions.md
[upgrade-aks-cluster]: upgrade-cluster.md
[planned-maintenance]: planned-maintenance.md
[operator-best-practices-scheduler]: operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets
[node-image-auto-upgrade]: auto-upgrade-node-image.md 

<!-- EXTERNAL LINKS -->
[pdb-best-practices]: https://kubernetes.io/docs/tasks/run-application/configure-pdb/
[release-tracker]: release-tracker.md
[k8s-deprecation]: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#:~:text=A%20deprecated%20API%20is%20one%20that%20has%20been,point%20you%20must%20migrate%20to%20using%20the%20replacement
[unattended-upgrades]: https://help.ubuntu.com/community/AutomaticSecurityUpdates