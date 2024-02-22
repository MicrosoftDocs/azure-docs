---
title: Stop and start an Azure Kubernetes Service (AKS) cluster
description: Learn how to stop and start an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.date: 03/14/2023
author: palma21
---

# Stop and start an Azure Kubernetes Service (AKS) cluster

You may not need to continuously run your Azure Kubernetes Service (AKS) workloads. For example, you may have a development cluster that you only use during business hours. This means there are times where your cluster might be idle, running nothing more than the system components. You can reduce the cluster footprint by [scaling all `User` node pools to 0](scale-cluster.md#scale-user-node-pools-to-0), but your [`System` pool](use-system-pools.md) is still required to run the system components while the cluster is running.

To better optimize your costs during these periods, you can turn off, or stop, your cluster. This action stops your control plane and agent nodes, allowing you to save on all the compute costs, while maintaining all objects except standalone pods. The cluster state is stored for when you start it again, allowing you to pick up where you left off.

## Before you begin

This article assumes you have an existing AKS cluster. If you need an AKS cluster, you can create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or the [Azure portal][aks-quickstart-portal].

### About the cluster stop/start feature

When using the cluster stop/start feature, the following conditions apply:

- This feature is only supported for Virtual Machine Scale Set backed clusters.
- The cluster state of a stopped AKS cluster is preserved for up to 12 months. If your cluster is stopped for more than 12 months, you can't recover the state. For more information, see the [AKS support policies](support-policies.md).
- You can only perform start or delete operations on a stopped AKS cluster. To perform other operations, like scaling or upgrading, you need to start your cluster first.
- If you provisioned PrivateEndpoints linked to private clusters, they need to be deleted and recreated again when starting a stopped AKS cluster.
- Because the stop process drains all nodes, any standalone pods (i.e. pods not managed by a Deployment, StatefulSet, DaemonSet, Job, etc.) will be deleted.
- When you start your cluster back up, the following behavior is expected:
  - The IP address of your API server may change.
  - If you're using cluster autoscaler, when you start your cluster, your current node count may not be between the min and max range values you set. The cluster starts with the number of nodes it needs to run its workloads, which isn't impacted by your autoscaler settings. When your cluster performs scaling operations, the min and max values will impact your current node count, and your cluster will eventually enter and remain in that desired range until you stop your cluster.

## Stop an AKS cluster

### [Azure CLI](#tab/azure-cli)

1. Use the [`az aks stop`][az-aks-stop] command to stop a running AKS cluster, including the nodes and control plane. The following example stops a cluster named *myAKSCluster*:

    ```azurecli-interactive
    az aks stop --name myAKSCluster --resource-group myResourceGroup
    ```

2. Verify your cluster has stopped using the [`az aks show`][az-aks-show] command and confirming the `powerState` shows as `Stopped`.

    ```azurecli-interactive
    az aks show --name myAKSCluster --resource-group myResourceGroup
    ```

    Your output should look similar to the following condensed example output:

    ```json
    {
    [...]
      "nodeResourceGroup": "MC_myResourceGroup_myAKSCluster_westus2",
      "powerState":{
        "code":"Stopped"
      },
      "privateFqdn": null,
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
    [...]
    }
    ```

    If the `provisioningState` shows `Stopping`, your cluster hasn't fully stopped yet.

### [Azure PowerShell](#tab/azure-powershell)

1. Use the [`Stop-AzAksCluster`][stop-azakscluster] cmdlet to stop a running AKS cluster, including the nodes and control plane. The following example stops a cluster named *myAKSCluster*:

    ```azurepowershell-interactive
    Stop-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup
    ```

2. Verify your cluster has stopped using the [`Get-AzAksCluster`][get-azakscluster] cmdlet and confirming the `ProvisioningState` shows as `Succeeded`.

    ```azurepowershell-interactive
    Get-AzAKSCluster -Name myAKSCluster -ResourceGroupName myResourceGroup
    ```

    Your output should look similar to the following condensed example output:

    ```Output
    ProvisioningState       : Succeeded
    MaxAgentPools           : 100
    KubernetesVersion       : 1.20.7
    ...
    ```

    If the `ProvisioningState` shows `Stopping`, your cluster hasn't fully stopped yet.

---

> [!IMPORTANT]
> If you're using [pod disruption budgets](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/), the stop operation can take longer, as the drain process will take more time to complete.

## Start an AKS cluster

> [!CAUTION]
> Don't repeatedly stop and start your clusters. This can result in errors. Once your cluster is stopped, you should wait at least 15-30 minutes before starting it again.

### [Azure CLI](#tab/azure-cli)

1. Use the [`az aks start`][az-aks-start] command to start a stopped AKS cluster. The cluster restarts with the previous control plane state and number of agent nodes. The following example starts a cluster named *myAKSCluster*:

    ```azurecli-interactive
    az aks start --name myAKSCluster --resource-group myResourceGroup
    ```

2. Verify your cluster has started using the [`az aks show`][az-aks-show] command and confirming the `powerState` shows `Running`.

    ```azurecli-interactive
    az aks show --name myAKSCluster --resource-group myResourceGroup
    ```

    Your output should look similar to the following condensed example output:

    ```json
    {
    [...]
      "nodeResourceGroup": "MC_myResourceGroup_myAKSCluster_westus2",
      "powerState":{
        "code":"Running"
     },
     "privateFqdn": null,
     "provisioningState": "Succeeded",
     "resourceGroup": "myResourceGroup",
    [...]
    }
    ```

    If the `provisioningState` shows `Starting`, your cluster hasn't fully started yet.

### [Azure PowerShell](#tab/azure-powershell)

1. Use the [`Start-AzAksCluster`][start-azakscluster] cmdlet to start a stopped AKS cluster. The cluster restarts with the previous control plane state and number of agent nodes. The following example starts a cluster named *myAKSCluster*:

    ```azurepowershell-interactive
    Start-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup
    ```

2. Verify your cluster has started using the [`Get-AzAksCluster`][get-azakscluster] cmdlet and confirming the `ProvisioningState` shows `Succeeded`.

    ```azurepowershell-interactive
    Get-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup
    ```

    Your output should look similar to the following condensed example output:

    ```Output
    ProvisioningState       : Succeeded
    MaxAgentPools           : 100
    KubernetesVersion       : 1.20.7
    ...
    ```

    If the `ProvisioningState` shows `Starting`, your cluster hasn't fully started yet.

---

## Next steps

- To learn how to scale `User` pools to 0, see [Scale `User` pools to 0](scale-cluster.md#scale-user-node-pools-to-0).
- To learn how to save costs using Spot instances, see [Add a spot node pool to AKS](spot-node-pool.md).
- To learn more about the AKS support policies, see [AKS support policies](support-policies.md).

<!-- LINKS - external -->

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[az-aks-show]: /cli/azure/aks#az_aks_show
[stop-azakscluster]: /powershell/module/az.aks/stop-azakscluster
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[start-azakscluster]: /powershell/module/az.aks/start-azakscluster
[az-aks-stop]: /cli/azure/aks#az_aks_stop
[az-aks-start]: /cli/azure/aks#az_aks_start
