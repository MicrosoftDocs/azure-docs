---
title: Azure Linux Container Host for AKS tutorial - Migrating to Azure Linux
description: In this Azure Linux Container Host for AKS tutorial, you will learn how to migrate your nodes to Azure Linux nodes.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: tutorial
ms.date: 04/18/2023
---

# Tutorial: Migrate nodes to Azure Linux

In this tutorial, part three of five, you will migrate your existing nodes to Azure Linux. You will learn how to: 

> [!div class="checklist"]
> * Cordon the existing nodes.
> * Drain the existing nodes.
> * Remove the existing nodes using the `az aks delete` command.

If you do not have any existing nodes to migrate to Azure Linux, skip to the [next tutorial](./tutorial-azure-linux-telemetry-monitor.md). In later tutorials, you'll learn how to enable telemetry and monitoring in your clusters and upgrade Azure Linux nodes.

## Prerequisites

- In previous tutorials, you created and deployed an Azure Linux Container Host for AKS cluster. To complete this tutorial, you need to add an Azure Linux node pool to your existing cluster. If you haven't done this step and would like to follow along, start with [Tutorial 2: Add an Azure Linux node pool to your existing AKS cluster](./tutorial-azure-linux-add-nodepool.md).

> [!NOTE]
> When adding a new Azure Linux node pool, you need to add at least one as `--mode System`. Otherwise, AKS won't allow you to delete your existing node pool.

- You need the latest version of Azure CLI. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## 1 - Cordon existing nodes

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

```bash
node/aks-nodepool1-31721111-vmss000000 cordoned
node/aks-nodepool1-31721111-vmss000001 cordoned
node/aks-nodepool1-31721111-vmss000002 cordoned
```

## 2 - Drain the existing nodes

> [!IMPORTANT]
> To successfully drain nodes and evict running pods, ensure that any PodDisruptionBudgets (PDBs) allow for at least 1 pod replica to be moved at a time, otherwise the drain/evict operation will fail. To check this, you can run `kubectl get pdb -A` and make sure `ALLOWED DISRUPTIONS` is at least 1 or higher.

Draining nodes will cause pods running on them to be evicted and recreated on the other, schedulable nodes.

To drain nodes, use `kubectl drain <node-names> --ignore-daemonsets --delete-emptydir-data`, again using a space-separated list of node names:

> [!IMPORTANT]
> Using `--delete-emptydir-data` is required to evict the AKS-created `coredns` and `metrics-server` pods. If this flag isn't used, an error is expected. For more information, see the [documentation on emptydir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir).

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

## 3 - Remove the existing nodes

To remove the existing nodes use the `az aks delete` command. The final result is the AKS cluster having a single, Azure Linux node pool with the desired SKU size and all the applications and pods properly running.

```azurecli-interactive
az aks nodepool delete \
    --resource-group testAzureLinuxResourceGroup \
    --cluster-name testAzureLinuxCluster \
    --name myExistingNodePool
```

## Next steps

In this tutorial, you migrated existing nodes to Azure Linux. You learned how to: 

> [!div class="checklist"]
> * Cordon the existing nodes.
> * Drain the existing nodes.
> * Remove the existing nodes using the `az aks delete` command.

In the next tutorial, you'll learn how to enable telemetry to monitor  your clusters.

> [!div class="nextstepaction"]
> [Enable telemetry and monitoring](./tutorial-azure-linux-telemetry-monitor.md)