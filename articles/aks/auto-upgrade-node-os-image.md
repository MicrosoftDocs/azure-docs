---
title: Auto-upgrade Node OS Images 
description: Learn how to choose an upgrade channel that best supports your needs for cluster's node OS security and maintenance. 
ms.topic: article
ms.custom: build-2023, devx-track-azurecli
ms.author: nickoman
author: nickomang
ms.date: 11/22/2023
---

# Auto-upgrade node OS images

AKS provides multiple auto-upgrade channels dedicated to timely node-level OS security updates. This channel is different from cluster-level Kubernetes version upgrades and supersedes it.

## Interactions between node OS auto-upgrade and cluster auto-upgrade

Node-level OS security updates are released at a faster rate than Kubernetes patch or minor version updates. The node OS auto-upgrade channel grants you flexibility and enables a customized strategy for node-level OS security updates. Then, you can choose a separate plan for cluster-level Kubernetes version [auto-upgrades][Autoupgrade].
It's best to use both cluster-level [auto-upgrades][Autoupgrade] and the node OS auto-upgrade channel together. Scheduling can be fine-tuned by applying two separate sets of [maintenance windows][planned-maintenance] - `aksManagedAutoUpgradeSchedule` for the cluster [auto-upgrade][Autoupgrade] channel and `aksManagedNodeOSUpgradeSchedule` for the node OS auto-upgrade channel.

## Channels for node OS image upgrades

The selected channel determines the timing of upgrades. When making changes to node OS auto-upgrade channels, allow up to 24 hours for the changes to take effect. 

> [!NOTE]
> Node OS image auto-upgrade won't affect the cluster's Kubernetes version. It only works for a cluster in a [supported version][supported].

The following upgrade channels are available. You're allowed to choose one of these options:

|Channel|Description|OS-specific behavior|
|---|---|
| `None`| Your nodes don't have security updates applied automatically. This means you're solely responsible for your security updates.|N/A|
| `Unmanaged`|OS updates are applied automatically through the OS built-in patching infrastructure. Newly allocated machines are unpatched initially. The OS's infrastructure patches them at some point.|Ubuntu and Azure Linux (CPU node pools) apply security patches through unattended upgrade/dnf-automatic roughly once per day around 06:00 UTC. Windows doesn't automatically apply security patches, so this option behaves equivalently to `None`.|
| `SecurityPatch`|This channel is in preview and requires enabling the feature flag `NodeOsUpgradeChannelPreview`. Refer to the prerequisites section for details. AKS regularly updates the node's virtual hard disk (VHD) with patches from the image maintainer labeled "security only." There might be disruptions when the security patches are applied to the nodes. When the patches are applied, the VHD is updated and existing machines are upgraded to that VHD, honoring maintenance windows and surge settings. This option incurs the extra cost of hosting the VHDs in your node resource group. If you use this channel, Linux [unattended upgrades][unattended-upgrades] are disabled by default.|Azure Linux doesn't support this channel on GPU-enabled VMs. `SecurityPatch` works on patch versions that are deprecated, so long as the minor Kubernetes version is still supported.|
| `NodeImage`|AKS updates the nodes with a newly patched VHD containing security fixes and bug fixes on a weekly cadence. The update to the new VHD is disruptive, following maintenance windows and surge settings. No extra VHD cost is incurred when choosing this option. If you use this channel, Linux [unattended upgrades][unattended-upgrades] are disabled by default. Node image upgrades support patch versions that are deprecated, so long as the minor Kubernetes version is still supported.|

To set the node OS auto-upgrade channel when creating a cluster, use the *node-os-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-os-upgrade-channel SecurityPatch
```

To set the node os auto-upgrade channel on existing cluster, update the *node-os-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks update --resource-group myResourceGroup --name myAKSCluster --node-os-upgrade-channel SecurityPatch
```

## Update ownership and schedule

The default cadence means there's no planned maintenance window applied.

|Channel|Updates Ownership|Default cadence|
|---|---|
| `Unmanaged`|OS driven security updates. AKS has no control over these updates.|Nightly around 6AM UTC for Ubuntu and Azure Linux. Monthly for Windows.|
| `SecurityPatch`|AKS|Weekly.|
| `NodeImage`|AKS|Weekly.|

## SecurityPatch channel requirements

To use the `SecurityPatch` channel, your cluster must support these requirements.
- Must be using API version `11-02-preview` or later

- If using Azure CLI, the `aks-preview` CLI extension version `0.5.127` or later must be installed

- The `NodeOsUpgradeChannelPreview` feature flag must be enabled on your subscription

### Register NodeOsUpgradeChannelPreview

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

## Node channel known bugs

- Currently, when you set the [cluster auto-upgrade channel][Autoupgrade] to `node-image`, it also automatically sets the node OS auto-upgrade channel to `NodeImage`. You can't change node OS auto-upgrade channel value if your cluster auto-upgrade channel is `node-image`. In order to set the node OS auto-upgrade channel value, check the [cluster auto-upgrade channel][Autoupgrade] value isn't `node-image`. 

- The `SecurityPatch` channel isn't supported on Windows OS node pools. 
 
 > [!NOTE]
 > By default, any new cluster created with an API version of `06-01-2022` or later will set the node OS auto-upgrade channel value to `NodeImage`. Any existing clusters created with an API version earlier than `06-01-2022` will have the node OS auto-upgrade channel value set to `None` by default.


## Node OS planned maintenance windows

Planned maintenance for the node OS auto-upgrade starts at your specified maintenance window.

> [!NOTE]
> To ensure proper functionality, use a maintenance window of four hours or more.

For more information on Planned Maintenance, see [Use Planned Maintenance to schedule maintenance windows for your Azure Kubernetes Service (AKS) cluster][planned-maintenance].

## Node OS auto-upgrades FAQ

* How can I check the current nodeOsUpgradeChannel value on a cluster?

Run the `az aks show` command and check the "autoUpgradeProfile" to determine what value the `nodeOsUpgradeChannel` is set to:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --query "autoUpgradeProfile"
```

* How can I monitor the status of node OS auto-upgrades?

To view the status of your node OS auto upgrades, look up [activity logs][monitor-aks] on your cluster. You can also look up specific upgrade-related events as mentioned in [Upgrade an AKS cluster][aks-upgrade]. AKS also emits upgrade-related Event Grid events. To learn more, see [AKS as an Event Grid source][aks-eventgrid].

* Can I change the node OS auto-upgrade channel value if my cluster auto-upgrade channel is set to `node-image` ?

 No. Currently, when you set the [cluster auto-upgrade channel][Autoupgrade] to `node-image`, it also automatically sets the node OS auto-upgrade channel to `NodeImage`. You can't change the node OS auto-upgrade channel value if your cluster auto-upgrade channel is `node-image`. In order to be able to change the node OS auto-upgrade channel values, make sure the [cluster auto-upgrade channel][Autoupgrade] isn't `node-image`.

<!-- LINKS -->
[planned-maintenance]: planned-maintenance.md
[release-tracker]: release-tracker.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[upgrade-aks-cluster]: upgrade-cluster.md
[unattended-upgrades]: https://help.ubuntu.com/community/AutomaticSecurityUpdates
[Autoupgrade]: auto-upgrade-cluster.md
[kured]: node-updates-kured.md
[supported]: ./support-policies.md
[monitor-aks]: ./monitor-aks-reference.md
[aks-eventgrid]: ./quickstart-event-grid.md
[aks-upgrade]: ./upgrade-cluster.md
