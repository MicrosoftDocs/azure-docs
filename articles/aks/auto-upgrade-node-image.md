---
title: Automatically upgrade Azure Kubernetes Service (AKS) cluster node operating system images
description: Learn how to automatically upgrade Azure Kubernetes Service (AKS) cluster node operating system images.
ms.topic: article
ms.author: nickoman
author: nickomang
ms.date: 02/03/2023
---

# Automatically upgrade Azure Kubernetes Service cluster node operating system images (preview)

AKS supports upgrading the images on a node so your cluster is up to date with the newest operating system (OS) and runtime updates. AKS regularly provides new node OS images with the latest updates, so it's beneficial to upgrade your node's images regularly for the latest AKS features and to maintain security. Before learning about auto-upgrade, make sure you understand upgrade fundamentals by reading [Upgrade an AKS cluster][upgrade-aks-cluster].

The latest AKS node image information can be found by visiting the [AKS release tracker][release-tracker].

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Why use node OS auto-upgrade

Node OS auto-upgrade provides a set once and forget mechanism that yields tangible time and operational cost benefits. By enabling auto-upgrade, you can ensure your clusters are up to date and don't miss the latest AKS features or patches from AKS.

## Prerequisites

- Must be using API version `11-02-preview` or later

- If using Azure CLI, the `aks-preview` CLI extension version `0.5.127` or later must be installed

- If using the `SecurityPatch` channel, the `NodeOsUpgradeChannelPreview` feature flag must be enabled on your subscription

### Register the 'NodeOsUpgradeChannelPreview' feature flag

Register the `NodeOsUpgradeChannelPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "NodeOsUpgradeChannelPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "NodeOsUpgradeChannelPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Limitations

If using the `node-image` cluster auto-upgrade channel or the `NodeImage` node image auto-upgrade channel, Linux [unattended upgrades][unattended-upgrades] will be disabled by default.

## Using node OS auto-upgrade

Automatically completed upgrades are functionally the same as manual upgrades. The timing of upgrades is determined by the selected channel. When making changes to auto-upgrade, allow 24 hours for the changes to take effect. By default, a cluster's node OS auto-upgrade channel is set to `Unmanaged`.

> [!NOTE]
> Node OS image auto-upgrade won't affect the cluster's Kubernetes version, but it still still requires the cluster to be in a supported version to function properly.

The following upgrade channels are available:

|Channel|Description|OS-specific behavior|
|---|---|
| `None`| Your nodes won't have security updates applied automatically. This means you're solely responsible for your security updates|N/A|
| `Unmanaged`|OS updates will be applied automatically through the OS built-in patching infrastructure. Newly allocated machines will be unpatched initially and will be patched at some point by the OS's infrastructure|Ubuntu applies security patches through unattended upgrade roughly once a day around 06:00 UTC. Windows and Mariner don't apply security patches automatically, so this option behaves equivalently to `None`|
| `SecurityPatch`|AKS will update the node's virtual hard disk (VHD) with patches from the image maintainer labeled "security only" on a regular basis. Where possible, patches will also be applied without disruption to existing nodes. Some patches, such as kernel patches, can't be applied to existing nodes without disruption. For such patches, the VHD will be updated and existing machines will be upgraded to that VHD following maintenance windows and surge settings. This option incurs the extra cost of hosting the VHDs in your node resource group.|N/A|
| `NodeImage`|AKS will update the nodes with a newly patched VHD containing security fixes and bug fixes on a weekly cadence. The update to the new VHD is disruptive, following maintenance windows and surge settings. No extra VHD cost is incurred when choosing this option. If you use this channel, Linux [unattended upgrades][unattended-upgrades] will be disabled by default.|

To set the node OS auto-upgrade channel when creating a cluster, use the *node-os-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-os-upgrade-channel SecurityPatch
```

To set the auto-upgrade channel on existing cluster, update the *node-os-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks update --resource-group myResourceGroup --name myAKSCluster --node-os-upgrade-channel SecurityPatch
```

## Using node OS auto-upgrade with Planned Maintenance

If you’re using Planned Maintenance and node OS auto-upgrade, your upgrade will start during your specified maintenance window.

> [!NOTE]
> To ensure proper functionality, use a maintenance window of four hours or more.

For more information on Planned Maintenance, see [Use Planned Maintenance to schedule maintenance windows for your Azure Kubernetes Service (AKS) cluster][planned-maintenance].

<!-- LINKS -->
[planned-maintenance]: planned-maintenance.md
[release-tracker]: release-tracker.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[upgrade-aks-cluster]: upgrade-cluster.md
[unattended-upgrades]: https://help.ubuntu.com/community/AutomaticSecurityUpdates
