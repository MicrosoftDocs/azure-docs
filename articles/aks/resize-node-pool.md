---
title: Resize node pools in Azure Kubernetes Service (AKS)
description: Learn how to resize node pools for a cluster in Azure Kubernetes Service (AKS) by cordoning and draining.
ms.topic: how-to
ms.custom:
ms.date: 02/08/2023
#Customer intent: As a cluster operator, I want to resize my node pools so that I can run more or larger workloads.
---

# Resize node pools in Azure Kubernetes Service (AKS)

Due to an increasing number of deployments or to run a larger workload, you may want to change the virtual machine scale set plan or resize AKS instances. However, as per [support policies for AKS][aks-support-policies]:

> AKS agent nodes appear in the Azure portal as regular Azure IaaS resources. But these virtual machines are deployed into a custom Azure resource group (usually prefixed with MC_*). You cannot do any direct customizations to these nodes using the IaaS APIs or resources. Any custom changes that are not done via the AKS API will not persist through an upgrade, scale, update or reboot.

This lack of persistence also applies to the resize operation, thus, resizing AKS instances in this manner isn't supported. In this how-to guide, you'll learn the recommended method to address this scenario.

> [!IMPORTANT]
> This method is specific to virtual machine scale set-based AKS clusters. When using virtual machine availability sets, you are limited to only one node pool per cluster.

## Example resources

Assume you want to resize an existing node pool, called `nodepool1`, from SKU size Standard_DS2_v2 to Standard_DS3_v2. To accomplish this task, you'll need to create a new node pool using Standard_DS3_v2, move workloads from `nodepool1` to the new node pool, and remove `nodepool1`. In this example, we'll call this new node pool `mynodepool`.

:::image type="content" source="./media/resize-node-pool/node-pool-ds2.png" alt-text="Screenshot of the Azure portal page for the cluster, navigated to Settings > Node pools. One node pool, named node pool 1, is shown.":::

```bash
kubectl get nodes

NAME                                STATUS   ROLES   AGE   VERSION
aks-nodepool1-31721111-vmss000000   Ready    agent   10d   v1.21.9
aks-nodepool1-31721111-vmss000001   Ready    agent   10d   v1.21.9
aks-nodepool1-31721111-vmss000002   Ready    agent   10d   v1.21.9
```

```bash
kubectl get pods -o wide -A

NAMESPACE     NAME                                  READY   STATUS    RESTARTS   AGE     IP           NODE                                NOMINATED NODE   READINESS GATES
default       sampleapp2-74b4b974ff-676sz           1/1     Running   0          93m     10.244.1.6   aks-nodepool1-31721111-vmss000002   <none>           <none>
default       sampleapp2-76b6c4c59b-pfgbh           1/1     Running   0          94m     10.244.1.5   aks-nodepool1-31721111-vmss000002   <none>           <none>
kube-system   azure-ip-masq-agent-4n66k             1/1     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002   <none>           <none>
kube-system   azure-ip-masq-agent-9p4c8             1/1     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000   <none>           <none>
kube-system   azure-ip-masq-agent-nb7mx             1/1     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001   <none>           <none>
kube-system   coredns-845757d86-dtvvs               1/1     Running   0          10d     10.244.0.2   aks-nodepool1-31721111-vmss000000   <none>           <none>
kube-system   coredns-845757d86-x27pp               1/1     Running   0          10d     10.244.2.3   aks-nodepool1-31721111-vmss000001   <none>           <none>
kube-system   coredns-autoscaler-5f85dc856b-nfrmh   1/1     Running   0          10d     10.244.2.4   aks-nodepool1-31721111-vmss000001   <none>           <none>
kube-system   csi-azuredisk-node-9nfzt              3/3     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000   <none>           <none>
kube-system   csi-azuredisk-node-bblsb              3/3     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001   <none>           <none>
kube-system   csi-azuredisk-node-tjhj4              3/3     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002   <none>           <none>
kube-system   csi-azurefile-node-9pcr8              3/3     Running   0          3d10h   10.240.0.6   aks-nodepool1-31721111-vmss000002   <none>           <none>
kube-system   csi-azurefile-node-bh2pc              3/3     Running   0          3d10h   10.240.0.5   aks-nodepool1-31721111-vmss000001   <none>           <none>
kube-system   csi-azurefile-node-h75gq              3/3     Running   0          3d10h   10.240.0.4   aks-nodepool1-31721111-vmss000000   <none>           <none>
kube-system   konnectivity-agent-6cd55c69cf-ngdlb   1/1     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002   <none>           <none>
kube-system   konnectivity-agent-6cd55c69cf-rvvqt   1/1     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000   <none>           <none>
kube-system   kube-proxy-4wzx7                      1/1     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000   <none>           <none>
kube-system   kube-proxy-g5tvr                      1/1     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002   <none>           <none>
kube-system   kube-proxy-mrv54                      1/1     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001   <none>           <none>
kube-system   metrics-server-774f99dbf4-h52hn       1/1     Running   1          3d10h   10.244.1.3   aks-nodepool1-31721111-vmss000002   <none>           <none>
```

## Create a new node pool with the desired SKU

### [Azure CLI](#tab/azure-cli)

Use the [az aks nodepool add][az-aks-nodepool-add] command to create a new node pool called `mynodepool` with three nodes using the `Standard_DS3_v2` VM SKU:

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-count 3 \
    --node-vm-size Standard_DS3_v2 \
    --mode System \
    --no-wait
```

> [!NOTE]
> Every AKS cluster must contain at least one system node pool with at least one node. In the example above, we are using a `--mode` of `System`, as the cluster is assumed to have only one node pool, necessitating a `System` node pool to replace it. A node pool's mode can be [updated at any time][update-node-pool-mode].

When resizing, be sure to consider other requirements and configure your node pool accordingly. You may need to modify the above command. For a full list of the configuration options, see the [az aks nodepool add][az-aks-nodepool-add] reference page.

After a few minutes, the new node pool has been created:

:::image type="content" source="./media/resize-node-pool/node-pool-both.png" alt-text="Screenshot of the Azure portal page for the cluster, navigated to Settings > Node pools. Two node pools, named node pool 1 and my node pool are shown.":::

```bash
kubectl get nodes

NAME                                 STATUS   ROLES   AGE   VERSION
aks-mynodepool-20823458-vmss000000   Ready    agent   23m   v1.21.9
aks-mynodepool-20823458-vmss000001   Ready    agent   23m   v1.21.9
aks-mynodepool-20823458-vmss000002   Ready    agent   23m   v1.21.9
aks-nodepool1-31721111-vmss000000    Ready    agent   10d   v1.21.9
aks-nodepool1-31721111-vmss000001    Ready    agent   10d   v1.21.9
aks-nodepool1-31721111-vmss000002    Ready    agent   10d   v1.21.9
```

### [Azure PowerShell](#tab/azure-powershell)

Use the [New-AzAksNodePool][new-azaksnodepool] cmdlet to create a new node pool called `mynodepool` with three nodes using the `Standard_DS3_v2` VM SKU:

```azurepowershell-interactive
$params = @{
    ResourceGroupName = 'myResourceGroup'
    ClusterName       = 'myAKSCluster'
    Name              = 'mynodepool'
    Count             = 3
    VMSize            = 'Standard_DS3_v2'
}
New-AzAksNodePool @params
```

After a few minutes, the new node pool has been created:

:::image type="content" source="./media/resize-node-pool/node-pool-both.png" alt-text="Screenshot of the Azure portal page for the cluster, navigated to Settings > Node pools. Two node pools, named node pool 1 and my node pool are shown.":::

```bash
kubectl get nodes

NAME                                 STATUS   ROLES   AGE   VERSION
aks-mynodepool-20823458-vmss000000   Ready    agent   23m   v1.21.9
aks-mynodepool-20823458-vmss000001   Ready    agent   23m   v1.21.9
aks-mynodepool-20823458-vmss000002   Ready    agent   23m   v1.21.9
aks-nodepool1-31721111-vmss000000    Ready    agent   10d   v1.21.9
aks-nodepool1-31721111-vmss000001    Ready    agent   10d   v1.21.9
aks-nodepool1-31721111-vmss000002    Ready    agent   10d   v1.21.9
```

> [!NOTE]
> Every AKS cluster must contain at least one system node pool with at least one node. In the example below, we are updating a node pool's mode to `System`, as the cluster is assumed to have only one node pool, necessitating a `System` node pool to replace it. A node pool's mode can be [updated at any time][update-node-pool-mode].

```azurepowershell-interactive
$myAKSCluster = Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster
($myAKSCluster.AgentPoolProfiles | Where-Object Name -eq 'mynodepool').Mode = 'System'
$myAKSCluster | Set-AzAksCluster
```

When resizing, be sure to consider other requirements and configure your node pool accordingly. You may need to modify the above command. For a full list of the configuration options, see the [New-AzAksNodePool][new-azaksnodepool] reference page.

---

## Cordon the existing nodes

Cordoning marks specified nodes as unschedulable and prevents any more pods from being added to the nodes.

First, obtain the names of the nodes you'd like to cordon with `kubectl get nodes`. Your output should look similar to the following:

```bash
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-31721111-vmss000000   Ready    agent   7d21h   v1.21.9
aks-nodepool1-31721111-vmss000001   Ready    agent   7d21h   v1.21.9
aks-nodepool1-31721111-vmss000002   Ready    agent   7d21h   v1.21.9
```

Next, using `kubectl cordon <node-names>`, specify the desired nodes in a space-separated list:

```bash
kubectl cordon aks-nodepool1-31721111-vmss000000 aks-nodepool1-31721111-vmss000001 aks-nodepool1-31721111-vmss000002
```

```output
node/aks-nodepool1-31721111-vmss000000 cordoned
node/aks-nodepool1-31721111-vmss000001 cordoned
node/aks-nodepool1-31721111-vmss000002 cordoned
```

## Drain the existing nodes

> [!IMPORTANT]
> To successfully drain nodes and evict running pods, ensure that any PodDisruptionBudgets (PDBs) allow for at least one pod replica to be moved at a time. Otherwise, the drain/evict operation will fail. To check this, you can run `kubectl get pdb -A` and verify `ALLOWED DISRUPTIONS` is at least one or higher.

Draining nodes will cause pods running on them to be evicted and recreated on the other, schedulable nodes.

To drain nodes, use `kubectl drain <node-names> --ignore-daemonsets --delete-emptydir-data`, again using a space-separated list of node names:

> [!IMPORTANT]
> Using `--delete-emptydir-data` is required to evict the AKS-created `coredns` and `metrics-server` pods. If this flag isn't used, an error is expected. For more information, see the [documentation on emptydir][empty-dir].

```bash
kubectl drain aks-nodepool1-31721111-vmss000000 aks-nodepool1-31721111-vmss000001 aks-nodepool1-31721111-vmss000002 --ignore-daemonsets --delete-emptydir-data
```

After the drain operation finishes, all pods other than those controlled by daemon sets are running on the new node pool:

```bash
kubectl get pods -o wide -A

NAMESPACE     NAME                                  READY   STATUS    RESTARTS   AGE     IP           NODE                                 NOMINATED NODE   READINESS GATES
default       sampleapp2-74b4b974ff-676sz           1/1     Running   0          15m     10.244.4.5   aks-mynodepool-20823458-vmss000002   <none>           <none>
default       sampleapp2-76b6c4c59b-rhmzq           1/1     Running   0          16m     10.244.4.3   aks-mynodepool-20823458-vmss000002   <none>           <none>
kube-system   azure-ip-masq-agent-4n66k             1/1     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
kube-system   azure-ip-masq-agent-9p4c8             1/1     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
kube-system   azure-ip-masq-agent-nb7mx             1/1     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
kube-system   azure-ip-masq-agent-sxn96             1/1     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
kube-system   azure-ip-masq-agent-tsq98             1/1     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
kube-system   azure-ip-masq-agent-xzrdl             1/1     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
kube-system   coredns-845757d86-d2pkc               1/1     Running   0          17m     10.244.3.2   aks-mynodepool-20823458-vmss000000   <none>           <none>
kube-system   coredns-845757d86-f8g9s               1/1     Running   0          17m     10.244.5.2   aks-mynodepool-20823458-vmss000001   <none>           <none>
kube-system   coredns-autoscaler-5f85dc856b-f8xh2   1/1     Running   0          17m     10.244.4.2   aks-mynodepool-20823458-vmss000002   <none>           <none>
kube-system   csi-azuredisk-node-7md2w              3/3     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
kube-system   csi-azuredisk-node-9nfzt              3/3     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
kube-system   csi-azuredisk-node-bblsb              3/3     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
kube-system   csi-azuredisk-node-lcmtz              3/3     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
kube-system   csi-azuredisk-node-mmncr              3/3     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
kube-system   csi-azuredisk-node-tjhj4              3/3     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
kube-system   csi-azurefile-node-29w6z              3/3     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
kube-system   csi-azurefile-node-4nrx7              3/3     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
kube-system   csi-azurefile-node-9pcr8              3/3     Running   0          3d11h   10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
kube-system   csi-azurefile-node-bh2pc              3/3     Running   0          3d11h   10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
kube-system   csi-azurefile-node-gqqnv              3/3     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
kube-system   csi-azurefile-node-h75gq              3/3     Running   0          3d11h   10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
kube-system   konnectivity-agent-6cd55c69cf-2bbp5   1/1     Running   0          17m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
kube-system   konnectivity-agent-6cd55c69cf-7xzxj   1/1     Running   0          16m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
kube-system   kube-proxy-4wzx7                      1/1     Running   0          10d     10.240.0.4   aks-nodepool1-31721111-vmss000000    <none>           <none>
kube-system   kube-proxy-7h8r5                      1/1     Running   0          49m     10.240.0.7   aks-mynodepool-20823458-vmss000000   <none>           <none>
kube-system   kube-proxy-g5tvr                      1/1     Running   0          10d     10.240.0.6   aks-nodepool1-31721111-vmss000002    <none>           <none>
kube-system   kube-proxy-mrv54                      1/1     Running   0          10d     10.240.0.5   aks-nodepool1-31721111-vmss000001    <none>           <none>
kube-system   kube-proxy-nqmnj                      1/1     Running   0          49m     10.240.0.9   aks-mynodepool-20823458-vmss000002   <none>           <none>
kube-system   kube-proxy-zn77s                      1/1     Running   0          49m     10.240.0.8   aks-mynodepool-20823458-vmss000001   <none>           <none>
kube-system   metrics-server-774f99dbf4-2x6x8       1/1     Running   0          16m     10.244.4.4   aks-mynodepool-20823458-vmss000002   <none>           <none>
```

### Troubleshooting

You may see an error like the following:
> Error when evicting pods/[podname] -n [namespace] (will retry after 5s): Cannot evict pod as it would violate the pod's disruption budget.

By default, your cluster has AKS_managed pod disruption budgets (such as `coredns-pdb` or `konnectivity-agent`) with a `MinAvailable` of 1. If, for example, there are two `coredns` pods running, while one of them is getting recreated and is unavailable, the other is unable to be affected due to the pod disruption budget. This resolves itself after the initial `coredns` pod is scheduled and running, allowing the second pod to be properly evicted and recreated.

> [!TIP]
> Consider draining nodes one-by-one for a smoother eviction experience and to avoid throttling. For more information, see:
> * [Plan for availability using a pod disruption budget][pod-disruption-budget]
> * [Specifying a Disruption Budget for your Application][specify-disruption-budget]
> * [Disruptions][disruptions]

## Remove the existing node pool

### [Azure CLI](#tab/azure-cli)

To delete the existing node pool, use the Azure portal or the [az aks nodepool delete][az-aks-nodepool-delete] command:

```azurecli-interactive
az aks nodepool delete \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name nodepool1
```

### [Azure PowerShell](#tab/azure-powershell)

To delete the existing node pool, use the Azure portal or the [Remove-AzAksNodePool][remove-azaksnodepool] cmdlet:

> [!IMPORTANT]
> When you delete a node pool, AKS doesn't perform cordon and drain. To minimize the disruption of rescheduling pods currently running on the node pool you are going to delete, perform a cordon and drain on all nodes in the node pool before deleting.

```azurepowershell-interactive
$params = @{
    ResourceGroupName = 'myResourceGroup'
    ClusterName       = 'myAKSCluster'
    Name              = 'nodepool1'
    Force             = $true
}
Remove-AzAksNodePool @params
```

---

After completion, the final result is the AKS cluster having a single, new node pool with the new, desired SKU size and all the applications and pods properly running:

:::image type="content" source="./media/resize-node-pool/node-pool-ds3.png" alt-text="Screenshot of the Azure portal page for the cluster, navigated to Settings > Node pools. One node pool, named my node pool, is shown.":::

```bash
kubectl get nodes

NAME                                 STATUS   ROLES   AGE   VERSION
aks-mynodepool-20823458-vmss000000   Ready    agent   63m   v1.21.9
aks-mynodepool-20823458-vmss000001   Ready    agent   63m   v1.21.9
aks-mynodepool-20823458-vmss000002   Ready    agent   63m   v1.21.9
```

## Next steps

After resizing a node pool by cordoning and draining, learn more about [using multiple node pools][use-multiple-node-pools].

<!-- LINKS -->
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[new-azaksnodepool]: /powershell/module/az.aks/new-azaksnodepool
[az-aks-nodepool-delete]: /cli/azure/aks/nodepool#az_aks_nodepool_delete
[remove-azaksnodepool]: /powershell/module/az.aks/remove-azaksnodepool
[aks-support-policies]: support-policies.md#user-customization-of-agent-nodes
[update-node-pool-mode]: use-system-pools.md#update-existing-cluster-system-and-user-node-pools
[pod-disruption-budget]: operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets
[empty-dir]: https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
[specify-disruption-budget]: https://kubernetes.io/docs/tasks/run-application/configure-pdb/
[disruptions]: https://kubernetes.io/docs/concepts/workloads/pods/disruptions/
[use-multiple-node-pools]: create-node-pools.md
