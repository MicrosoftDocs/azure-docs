---
title: Auto-upgrade Node OS Images 
description: Learn how to choose an upgrade channel that best supports your needs for cluster's node OS security and maintenance. 
ms.topic: article
ms.custom: build-2023, devx-track-azurecli
ms.author: kaarthis
author: kaarthis
ms.subservice: aks-upgrade
ms.date: 05/10/2024
---

# Auto-upgrade node OS images

AKS provides multiple auto-upgrade channels dedicated to timely node-level OS security updates. This channel is different from cluster-level Kubernetes version upgrades and supersedes it.

## Interactions between node OS auto-upgrade and cluster auto-upgrade

Node-level OS security updates are released at a faster rate than Kubernetes patch or minor version updates. The node OS auto-upgrade channel grants you flexibility and enables a customized strategy for node-level OS security updates. Then, you can choose a separate plan for cluster-level Kubernetes version [auto-upgrades][Autoupgrade].
It's best to use both cluster-level [auto-upgrades][Autoupgrade] and the node OS auto-upgrade channel together. Scheduling can be fine-tuned by applying two separate sets of [maintenance windows][planned-maintenance] - `aksManagedAutoUpgradeSchedule` for the cluster [auto-upgrade][Autoupgrade] channel and `aksManagedNodeOSUpgradeSchedule` for the node OS auto-upgrade channel.

## Channels for node OS image upgrades

The selected channel determines the timing of upgrades. When making changes to node OS auto-upgrade channels, allow up to 24 hours for the changes to take effect. Once you change from one channel to another channel, a reimage is triggered leading to rolling nodes.

> [!NOTE]
> Node OS image auto-upgrade won't affect the cluster's Kubernetes version.

The following upgrade channels are available. You're allowed to choose one of these options:

|Channel|Description|OS-specific behavior|
|---|---|
| `None`| Your nodes don't have security updates applied automatically. This means you're solely responsible for your security updates.|N/A|
| `Unmanaged`|OS updates are applied automatically through the OS built-in patching infrastructure. Newly allocated machines are unpatched initially. The OS's infrastructure patches them at some point.|Ubuntu and Azure Linux (CPU node pools) apply security patches through unattended upgrade/dnf-automatic roughly once per day around 06:00 UTC. Windows doesn't automatically apply security patches, so this option behaves equivalently to `None`. You need to manage the reboot process by using a tool like [kured][kured].|
| `SecurityPatch`|OS security patches, which are AKS-tested, fully managed, and applied with safe deployment practices. AKS regularly updates the node's virtual hard disk (VHD) with patches from the image maintainer labeled "security only." There might be disruptions when the security patches are applied to the nodes, however AKS is limiting disruptions by only reimaging your nodes only when necessary, such as for certain kernel security packages. When the patches are applied, the VHD is updated and existing machines are upgraded to that VHD, honoring maintenance windows and surge settings. If AKS decides reimaging nodes isn't necessary, it patches nodes live without draining pods and performs no VHD update. This option incurs the extra cost of hosting the VHDs in your node resource group. If you use this channel, Linux [unattended upgrades][unattended-upgrades] are disabled by default.|Azure Linux doesn't support this channel on GPU-enabled VMs. `SecurityPatch` works on kubernetes patch versions that are deprecated, so long as the minor Kubernetes version is still supported.|
| `NodeImage`|AKS updates the nodes with a newly patched VHD containing security fixes and bug fixes on a weekly cadence. The update to the new VHD is disruptive, following maintenance windows and surge settings. No extra VHD cost is incurred when choosing this option. If you use this channel, Linux [unattended upgrades][unattended-upgrades] are disabled by default. Node image upgrades support patch versions that are deprecated, so long as the minor Kubernetes version is still supported. Node images are AKS-tested, fully managed, and applied with safe deployment practices|

## Set the node OS auto-upgrade channel on a new cluster

### [Azure CLI](#tab/azure-cli)

* Set the node OS auto-upgrade channel on a new cluster using the [`az aks create`][az-aks-create] command with the `--node-os-upgrade-channel` parameter. The following example sets the node OS auto-upgrade channel to `SecurityPatch`.

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --node-os-upgrade-channel SecurityPatch
    ```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, select **Create a resource** > **Containers** > **Azure Kubernetes Service (AKS)**.
2. In the **Basics** tab, under **Cluster details**, select the desired channel type from the **Node security channel type** dropdown.

    :::image type="content" source="./media/auto-upgrade-node-os-image/set-nodeimage-channel-portal.png" alt-text="A screenshot of the Azure portal showing the node security channel type option in the Basics tab of the AKS cluster creation page.":::

3. Select **Security channel scheduler** and choose the desired maintenance window using the [Planned Maintenance feature](./planned-maintenance.md). We recommend selecting the default option **Every week on Sunday (recommended)**.

    :::image type="content" source="./media/auto-upgrade-node-os-image/set-nodeimage-maintenance-window-portal.png" alt-text="A screenshot of the Azure portal showing the security channel scheduler option in the Basics tab of the AKS cluster creation page.":::

4. Complete the remaining steps to create the cluster.

---

## Set the node OS auto-upgrade channel on an existing cluster

### [Azure CLI](#tab/azure-cli)

* Set the node os auto-upgrade channel on an existing cluster using the [`az aks update`][az-aks-update] command with the `--node-os-upgrade-channel` parameter. The following example sets the node OS auto-upgrade channel to `SecurityPatch`.

    ```azurecli-interactive
    az aks update --resource-group myResourceGroup --name myAKSCluster --node-os-upgrade-channel SecurityPatch
    ```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to your AKS cluster.
2. In the **Settings** section, select **Cluster configuration**.
3. Under **Security updates**, select the desired channel type from the **Node security channel type** dropdown.

    :::image type="content" source="./media/auto-upgrade-node-os-image/set-nodeimage-channel-portal-existing.png" alt-text="A screenshot of the Azure portal showing the node security channel type option in the Cluster configuration page of an existing AKS cluster.":::

4. For **Security channel scheduler**, select **Add schedule**.
5. On the **Add maintenance schedule** page, configure the following maintenance window settings using the [Planned Maintenance feature](./planned-maintenance.md):

    * **Repeats**: Select the desired frequency for the maintenance window. We recommend selecting **Weekly**.
    * **Frequency**: Select the desired day of the week for the maintenance window. We recommend selecting **Sunday**.
    * **Maintenance start date**: Select the desired start date for the maintenance window.
    * **Maintenance start time**: Select the desired start time for the maintenance window.
    * **UTC offset**: Select the desired UTC offset for the maintenance window. If not set, the default is **+00:00**.

    :::image type="content" source="./media/auto-upgrade-node-os-image/set-nodeimage-maintenance-window-portal-existing.png" alt-text="A screenshot of the Azure portal showing the maintenance schedule configuration options in the Add maintenance schedule page of an existing AKS cluster.":::

6. Select **Save** > **Apply**.

---

## Update ownership and schedule

The default cadence means there's no planned maintenance window applied.

|Channel|Updates Ownership|Default cadence|
|---|---|
| `Unmanaged`|OS driven security updates. AKS has no control over these updates.|Nightly around 6AM UTC for Ubuntu and Azure Linux. Monthly for Windows.|
| `SecurityPatch`|AKS-tested, fully managed, and applied with safe deployment practices. For more information, refer to [Increased security and resiliency of Canonical workloads on Azure][Blog].|Weekly.|
| `NodeImage`|AKS-tested, fully managed, and applied with safe deployment practices. For more real time information on releases, look up [AKS Node Images in Release tracker][release-tracker] |Weekly.|

> [!NOTE]
> While Windows security updates are released on a monthly basis, using the `Unmanaged` channel will not automatically apply these updates to Windows nodes. If you choose the `Unmanaged` channel, you need to manage the reboot process for Windows nodes. 


## Node channel known limitations

- Currently, when you set the [cluster auto-upgrade channel][Autoupgrade] to `node-image`, it also automatically sets the node OS auto-upgrade channel to `NodeImage`. You can't change node OS auto-upgrade channel value if your cluster auto-upgrade channel is `node-image`. In order to set the node OS auto-upgrade channel value, check the [cluster auto-upgrade channel][Autoupgrade] value isn't `node-image`. 

- The `SecurityPatch` channel isn't supported on Windows OS node pools. 
 
 > [!NOTE]
 >  Use CLI version 2.61.0 or above for the `SecurityPatch` channel.


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

 * Why is `SecurityPatch` recommended over `Unmanaged` channel?

On the `Unmanaged` channel, AKS has no control over how and when the security updates are delivered. With `SecurityPatch`, the security updates are fully tested and follow safe deployment practices. `SecurityPatch` also honors maintenance windows. For more details, see [Increased security and resiliency of Canonical workloads on Azure][Blog].

* Does `SecurityPatch` always lead to a reimage of my nodes?

AKS limits reimages to only when absolutely necessary, such as certain kernel packages that may require a reimage to get fully applied. `SecurityPatch` is designed to minimize disruptions as much as possible. If AKS decides reimaging nodes isn't necessary, it will patch nodes live without draining pods and no VHD update is performed in such cases.

 * How do I know if a `SecurityPatch` or `NodeImage` upgrade is applied on my node?
 
 Run the following command to obtain node labels:
 
```azurecli-interactive
kubectl get nodes --show-labels
```

Among the returned labels, you should see a line similar to the following output:

```output
kubernetes.azure.com/node-image-version=AKSUbuntu-2204gen2containerd-202311.07.0
```

Here, the base node image version is `AKSUbuntu-2204gen2containerd`. If applicable, the security patch version typically follows. In the above example, it's `202311.07.0`.  

The same details also be looked up in the Azure portal under the node label view:

:::image type="content" source="./media/auto-upgrade-node-os-image/nodeimage-securitypatch-inline.png" alt-text="A screenshot of the nodes page for an AKS cluster in the Azure portal. The label for node image version clearly shows the base node image and the latest applied security patch date." lightbox="./media/auto-upgrade-node-os-image/nodeimage-securitypatch.png":::

## Next steps

For a detailed discussion of upgrade best practices and other considerations, see [AKS patch and upgrade guidance][upgrade-operators-guide].


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
[upgrade-operators-guide]: /azure/architecture/operator-guides/aks/aks-upgrade-practices
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update

<!-- LINKS - external -->
[Blog]: https://techcommunity.microsoft.com/t5/linux-and-open-source-blog/increased-security-and-resiliency-of-canonical-workloads-on/ba-p/3970623

