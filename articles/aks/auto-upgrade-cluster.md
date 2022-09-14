---
title: Automatically upgrade an Azure Kubernetes Service (AKS) cluster
description: Learn how to automatically upgrade an Azure Kubernetes Service (AKS) cluster to get the latest features and security updates.
services: container-service
ms.topic: article
ms.author: nickoman
author: nickomang
ms.date: 07/07/2022
---

# Automatically upgrade an Azure Kubernetes Service (AKS) cluster

Part of the AKS cluster lifecycle involves performing periodic upgrades to the latest Kubernetes version. It’s important you apply the latest security releases, or upgrade to get the latest features. Before learning about auto-upgrade, make sure you understand upgrade fundamentals by reading [Upgrade an AKS cluster][upgrade-aks-cluster].

## Why use auto-upgrade

Auto-upgrade provides a set once and forget mechanism that yields tangible time and operational cost benefits. By enabling auto-upgrade, you can ensure your clusters are up to date and don't miss the latest AKS features or patches from AKS and upstream Kubernetes.

AKS follows a strict versioning window with regard to supportability. With properly selected auto-upgrade channels, you can avoid clusters falling into an unsupported version. For more on the AKS support window, see [Supported Kubernetes versions][supported-kubernetes-versions].

## Using auto-upgrade

Automatically completed upgrades are functionally the same as manual upgrades. The timing of upgrades is determined by the selected channel.

The following upgrade channels are available:

|Channel| Action | Example
|---|---|---|
| `none`| disables auto-upgrades and keeps the cluster at its current version of Kubernetes| Default setting if left unchanged|
| `patch`| automatically upgrade the cluster to the latest supported patch version when it becomes available while keeping the minor version the same.| For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster is upgraded to *1.17.9*|
| `stable`| automatically upgrade the cluster to the latest supported patch release on minor version *N-1*, where *N* is the latest supported minor version.| For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster is upgraded to *1.18.6*.
| `rapid`| automatically upgrade the cluster to the latest supported patch release on the latest supported minor version.| In cases where the cluster is at a version of Kubernetes that is at an *N-2* minor version where *N* is the latest supported minor version, the cluster first upgrades to the latest supported patch version on *N-1* minor version. For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster first is upgraded to *1.18.6*, then is upgraded to *1.19.1*. 
| `node-image`| automatically upgrade the node image to the latest version available.| Microsoft provides patches and new images for image nodes frequently (usually weekly), but your running nodes won't get the new images unless you do a node image upgrade. Turning on the node-image channel will automatically update your node images whenever a new version is available. |

> [!NOTE]
> Cluster auto-upgrade only updates to GA versions of Kubernetes and will not update to preview versions.

Automatically upgrading a cluster follows the same process as manually upgrading a cluster. For more information, see [Upgrade an AKS cluster][upgrade-aks-cluster].

To set the auto-upgrade channel when creating a cluster, use the *auto-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable --generate-ssh-keys
```

To set the auto-upgrade channel on existing cluster, update the *auto-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks update --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable
```

## Using auto-upgrade with Planned Maintenance

If you’re using Planned Maintenance and Auto-Upgrade, your upgrade will start during your specified maintenance window. For more information on Planned Maintenance, see [Use Planned Maintenance to schedule maintenance windows for your Azure Kubernetes Service (AKS) cluster][planned-maintenance].

## Best practices for auto-upgrade

The following best practices will help maximize your success when using auto-upgrade:

- In order to keep your cluster always in a supported version (i.e within the N-2 rule), choose either `stable` or `rapid` channels.
- If you're interested in getting the latest patches as soon as possible, use the `patch` channel. The `node-image` channel is a good fit if you want your agent pools to always be running the most recent node images.
- Follow [Operator best practices][operator-best-practices-scheduler].
- Follow [PDB best practices][pdb-best-practices].

<!-- INTERNAL LINKS -->
[supported-kubernetes-versions]: supported-kubernetes-versions.md
[upgrade-aks-cluster]: upgrade-cluster.md
[planned-maintenance]: planned-maintenance.md
[operator-best-practices-scheduler]: operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets


<!-- EXTERNAL LINKS -->
[pdb-best-practices]: https://kubernetes.io/docs/tasks/run-application/configure-pdb/
