---
title: Scale an Azure Kubernetes Service (AKS) cluster
description: Learn how to scale the number of nodes in an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.date: 03/27/2023
---

# Scale the node count in an Azure Kubernetes Service (AKS) cluster

If the resource needs of your applications change, your cluster performance may be impacted due to low capacity on CPU, memory, PID space, or disk sizes. To address these changes, you can manually scale your AKS cluster to run a different number of nodes. When you scale down, nodes are carefully [cordoned and drained][kubernetes-drain] to minimize disruption to running applications. When you scale up, AKS waits until nodes are marked **Ready** by the Kubernetes cluster before pods are scheduled on them.

## Scale the cluster nodes

> [!NOTE]
> Removing nodes from a node pool using the kubectl command is not supported. Doing so can create scaling issues with your AKS cluster.

### [Azure CLI](#tab/azure-cli)

1. Get the *name* of your node pool using the [`az aks show`][az-aks-show] command. The following example gets the node pool name for the cluster named *myAKSCluster* in the *myResourceGroup* resource group:

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --query agentPoolProfiles
    ```

    The following example output shows that the *name* is *nodepool1*:

    ```output
    [
      {
        "count": 1,
        "maxPods": 110,
        "name": "nodepool1",
        "osDiskSizeGb": 30,
        "osType": "Linux",
        "storageProfile": "ManagedDisks",
        "vmSize": "Standard_DS2_v2"
      }
    ]
    ```

2. Scale the cluster nodes using the [`az aks scale`][az-aks-scale] command. The following example scales a cluster named *myAKSCluster* to a single node. Provide your own `--nodepool-name` from the previous command, such as *nodepool1*:

    ```azurecli-interactive
    az aks scale --resource-group myResourceGroup --name myAKSCluster --node-count 1 --nodepool-name <your node pool name>
    ```

    The following example output shows the cluster has successfully scaled to one node, as shown in the *agentPoolProfiles* section:

    ```json
    {
      "aadProfile": null,
      "addonProfiles": null,
      "agentPoolProfiles": [
        {
          "count": 1,
          "maxPods": 110,
          "name": "nodepool1",
          "osDiskSizeGb": 30,
          "osType": "Linux",
          "storageProfile": "ManagedDisks",
          "vmSize": "Standard_DS2_v2",
          "vnetSubnetId": null
        }
      ],
      [...]
    }
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the *name* of your node pool using the [`Get-AzAksCluster`][get-azakscluster] command. The following example gets the node pool name for the cluster named *myAKSCluster* in the *myResourceGroup* resource group:

    ```azurepowershell-interactive
    Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
     Select-Object -ExpandProperty AgentPoolProfiles
    ```

    The following example output shows that the *name* is *nodepool1*:

    ```output
    Name                   : nodepool1
    Count                  : 1
    VmSize                 : Standard_D2_v2
    OsDiskSizeGB           : 128
    VnetSubnetID           :
    MaxPods                : 30
    OsType                 : Linux
    MaxCount               :
    MinCount               :
    Mode                   : System
    EnableAutoScaling      :
    Type                   : VirtualMachineScaleSets
    OrchestratorVersion    : 1.23.3
    ProvisioningState      : Succeeded
    ...
    ```

2. Scale the cluster nodes using the [Set-AzAksCluster][set-azakscluster] command. The following example scales a cluster named *myAKSCluster* to a single node. Provide your own `-NodeName` from the previous command, such as *nodepool1*:

    ```azurepowershell-interactive
    Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -NodeCount 1 -NodeName <your node pool name>
    ```

    The following example output shows the cluster has successfully scaled to one node, as shown in the *AgentPoolProfiles* property:

    ```output
    Name                   : nodepool1
    Count                  : 1
    VmSize                 : Standard_D2_v2
    OsDiskSizeGB           : 128
    VnetSubnetID           :
    MaxPods                : 30
    OsType                 : Linux
    MaxCount               :
    MinCount               :
    Mode                   : System
    EnableAutoScaling      :
    Type                   : VirtualMachineScaleSets
    OrchestratorVersion    : 1.23.3
    ProvisioningState      : Succeeded
    ...
    ```

---

## Scale `User` node pools to 0

Unlike `System` node pools that always require running nodes, `User` node pools allow you to scale to 0. To learn more on the differences between system and user node pools, see [System and user node pools](use-system-pools.md).

### [Azure CLI](#tab/azure-cli)

* To scale a user pool to 0, you can use the [az aks nodepool scale][az-aks-nodepool-scale] in alternative to the above `az aks scale` command, and set 0 as your node count.

    ```azurecli-interactive
    az aks nodepool scale --name <your node pool name> --cluster-name myAKSCluster --resource-group myResourceGroup  --node-count 0 
    ```

* You can also autoscale `User` node pools to 0 nodes, by setting the `--min-count` parameter of the [Cluster Autoscaler](cluster-autoscaler.md) to 0.

### [Azure PowerShell](#tab/azure-powershell)

* To scale a user pool to 0, you can use the [Update-AzAksNodePool][update-azaksnodepool] in alternative to the above `Set-AzAksCluster` command, and set 0 as your node count.

    ```azurepowershell-interactive
    Update-AzAksNodePool -Name <your node pool name> -ClusterName myAKSCluster -ResourceGroupName myResourceGroup -NodeCount 0
    ```

* You can also autoscale `User` node pools to 0 nodes, by setting the `-NodeMinCount` parameter of the [Cluster Autoscaler](cluster-autoscaler.md) to 0.

---

## Next steps

In this article, you manually scaled an AKS cluster to increase or decrease the number of nodes. You can also use the [cluster autoscaler][cluster-autoscaler] to automatically scale your cluster.

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[az-aks-show]: /cli/azure/aks#az_aks_show
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[az-aks-scale]: /cli/azure/aks#az_aks_scale
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[cluster-autoscaler]: cluster-autoscaler.md
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool#az_aks_nodepool_scale
[update-azaksnodepool]: /powershell/module/az.aks/update-azaksnodepool
