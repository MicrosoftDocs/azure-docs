---
title: Create node pools in Azure Kubernetes Service (AKS)
description: Learn how to create multiple node pools for a cluster in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: event-tier1-build-2022, ignite-2022, devx-track-azurecli, build-2023
ms.date: 07/18/2023
---

# Create node pools for a cluster in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), nodes of the same configuration are grouped together into *node pools*. These node pools contain the underlying VMs that run your applications. When you create an AKS cluster, you define the initial number of nodes and their size (SKU), which creates a [*system node pool*][use-system-pool].

To support applications that have different compute or storage demands, you can create *user node pools*. System node pools serve the primary purpose of hosting critical system pods such as CoreDNS and `konnectivity`. User node pools serve the primary purpose of hosting your application pods. For example, use more user node pools to provide GPUs for compute-intensive applications, or access to high-performance SSD storage. However, if you wish to have only one pool in your AKS cluster, you can schedule application pods on system node pools.

> [!NOTE]
> This feature enables more control over creating and managing multiple node pools and requires separate commands for create/update/delete operations. Previously, cluster operations through `az aks create` or `az aks update` used the managedCluster API and were the only options to change your control plane and a single node pool. This feature exposes a separate operation set for agent pools through the agentPool API and requires use of the `az aks nodepool` command set to execute operations on an individual node pool.

This article shows you how to create one or more node pools in an AKS cluster.

## Before you begin

* You need the Azure CLI version 2.2.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Review [Storage options for applications in Azure Kubernetes Service][aks-storage-concepts] to plan your storage configuration.

## Limitations

The following limitations apply when you create AKS clusters that support multiple node pools:

* See [Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)](quotas-skus-regions.md).
* You can delete system node pools if you have another system node pool to take its place in the AKS cluster.
* System pools must contain at least one node, and user node pools may contain zero or more nodes.
* The AKS cluster must use the Standard SKU load balancer to use multiple node pools. The feature isn't supported with Basic SKU load balancers.
* The AKS cluster must use Virtual Machine Scale Sets for the nodes.
* The name of a node pool may only contain lowercase alphanumeric characters and must begin with a lowercase letter.
  * For Linux node pools, the length must be between 1-11 characters.
  * For Windows node pools, the length must be between 1-6 characters.
* All node pools must reside in the same virtual network.
* When you create multiple node pools at cluster creation time, the Kubernetes versions for the node pools must match the version set for the control plane.

## Create an AKS cluster

> [!IMPORTANT]
> If you run a single system node pool for your AKS cluster in a production environment, we recommend you use at least three nodes for the node pool. If one node goes down, you lose control plane resources and redundancy is compromised. You can mitigate this risk by having more control plane nodes.

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

2. Create an AKS cluster with a single node pool using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --vm-set-type VirtualMachineScaleSets \
        --node-count 2 \
        --generate-ssh-keys \
        --load-balancer-sku standard
    ```

    It takes a few minutes to create the cluster.

3. When the cluster is ready, get the cluster credentials using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Add a node pool

The cluster created in the previous step has a single node pool. In this section, we add a second node pool to the cluster.

1. Create a new node pool using the [`az aks nodepool add`][az-aks-nodepool-add] command. The following example creates a node pool named *mynodepool* that runs *three* nodes:

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name mynodepool \
        --node-count 3
    ```

2. Check the status of your node pools using the [`az aks node pool list`][az-aks-nodepool-list] command and specify your resource group and cluster name.

    ```azurecli-interactive
    az aks nodepool list --resource-group myResourceGroup --cluster-name myAKSCluster
    ```

    The following example output shows *mynodepool* has been successfully created with three nodes. When the AKS cluster was created in the previous step, a default *nodepool1* was created with a node count of *2*.

    ```output
    [
      {
        ...
        "count": 3,
        ...
        "name": "mynodepool",
        "orchestratorVersion": "1.15.7",
        ...
        "vmSize": "Standard_DS2_v2",
        ...
      },
      {
        ...
        "count": 2,
        ...
        "name": "nodepool1",
        "orchestratorVersion": "1.15.7",
        ...
        "vmSize": "Standard_DS2_v2",
        ...
      }
    ]
    ```

## ARM64 node pools

The ARM64 processor provides low power compute for your Kubernetes workloads. To create an ARM64 node pool, you need to choose a [Dpsv5][arm-sku-vm1], [Dplsv5][arm-sku-vm2] or [Epsv5][arm-sku-vm3] series Virtual Machine.

### Limitations

* ARM64 node pools aren't supported on Defender-enabled clusters.
* FIPS-enabled node pools aren't supported with ARM64 SKUs.

### Add an ARM64 node pool

* Add an ARM64 node pool into your existing cluster using the [`az aks nodepool add`][az-aks-nodepool-add].

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name armpool \
        --node-count 3 \
        --node-vm-size Standard_D2pds_v5
    ```

## Azure Linux node pools

The Azure Linux container host for AKS is an open-source Linux distribution available as an AKS container host. It provides high reliability, security, and consistency. It only includes the minimal set of packages needed for running container workloads, which improve boot times and overall performance.

### Add an Azure Linux node pool

* Add an Azure Linux node pool into your existing cluster using the [`az aks nodepool add`][az-aks-nodepool-add] command and specify `--os-sku AzureLinux`.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name azlinuxpool \
        --os-sku AzureLinux
    ```

### Migrate Ubuntu nodes to Azure Linux nodes

1. [Add an Azure Linux node pool into your existing cluster](#add-an-azure-linux-node-pool).

    > [!NOTE]
    > When adding a new Azure Linux node pool, you need to add at least one as `--mode System`. Otherwise, AKS won't allow you to delete your existing Ubuntu node pool.

2. [Cordon the existing Ubuntu nodes](resize-node-pool.md#cordon-the-existing-nodes).
3. [Drain the existing Ubuntu nodes](resize-node-pool.md#drain-the-existing-nodes).
4. Remove the existing Ubuntu nodes using the [`az aks delete`][az-aks-delete] command.

    ```azurecli-interactive
    az aks nodepool delete \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name mynodepool
    ```

## Node pools with unique subnets

A workload may require splitting cluster nodes into separate pools for logical isolation. Separate subnets dedicated to each node pool in the cluster can help support this isolation, which can address requirements such as having noncontiguous virtual network address space to split across node pools.

> [!NOTE]
> Make sure to use Azure CLI version `2.35.0` or later.

### Limitations

* All subnets assigned to node pools must belong to the same virtual network.
* System pods must have access to all nodes and pods in the cluster to provide critical functionality, such as DNS resolution and tunneling kubectl logs/exec/port-forward proxy.
* If you expand your VNET after creating the cluster, you must update your cluster before adding a subnet outside the original CIDR block. While AKS errors-out on the agent pool add, the `aks-preview` Azure CLI extension (version 0.5.66+) now supports running `az aks update -g <resourceGroup> -n <clusterName>` without any optional arguments. This command performs an update operation without making any changes, which can recover a cluster stuck in a failed state.
* In clusters with Kubernetes version < 1.23.3, kube-proxy will SNAT traffic from new subnets, which can cause Azure Network Policy to drop the packets.
* Windows nodes SNAT traffic to the new subnets until the node pool is reimaged.
* Internal load balancers default to one of the node pool subnets.

### Add a node pool with a unique subnet

* Add a node pool with a unique subnet into your existing cluster using the [`az aks nodepool add`][az-aks-nodepool-add] command and specify the `--vnet-subnet-id`.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name mynodepool \
        --node-count 3 \
        --vnet-subnet-id <YOUR_SUBNET_RESOURCE_ID>
    ```

## FIPS-enabled node pools

For more information on enabling Federal Information Process Standard (FIPS) for your AKS cluster, see [Enable Federal Information Process Standard (FIPS) for Azure Kubernetes Service (AKS) node pools][enable-fips-nodes].

## Windows Server node pools with `containerd`

Beginning in Kubernetes version 1.20 and higher, you can specify `containerd` as the container runtime for Windows Server 2019 node pools. Starting with Kubernetes 1.23, `containerd` is the default and only container runtime for Windows.

> [!IMPORTANT]
> When using `containerd` with Windows Server 2019 node pools:
>
> * Both the control plane and Windows Server 2019 node pools must use Kubernetes version 1.20 or greater.
> * When you create or update a node pool to run Windows Server containers, the default value for `--node-vm-size` is *Standard_D2s_v3*, which was minimum recommended size for Windows Server 2019 node pools prior to Kubernetes 1.20. The minimum recommended size for Windows Server 2019 node pools using `containerd` is *Standard_D4s_v3*. When setting the `--node-vm-size` parameter, please check the list of [restricted VM sizes][restricted-vm-sizes].
> * We highly recommended using [taints or labels][aks-taints] with your Windows Server 2019 node pools running `containerd` and tolerations or node selectors with your deployments to guarantee your workloads are scheduled correctly.

### Add a Windows Server node pool with `containerd`

* Add a Windows Server node pool with `containerd` into your existing cluster using the [`az aks nodepool add`][az-aks-nodepool-add].

    > [!NOTE]
    > If you don't specify the `WindowsContainerRuntime=containerd` custom header, the node pool still uses `containerd` as the container runtime by default.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --os-type Windows \
        --name npwcd \
        --node-vm-size Standard_D4s_v3 \
        --kubernetes-version 1.20.5 \
        --aks-custom-headers WindowsContainerRuntime=containerd \
        --node-count 1
    ```

### Upgrade a specific existing Windows Server node pool to `containerd`

* Upgrade a specific node pool from Docker to `containerd` using the [`az aks nodepool upgrade`][az-aks-nodepool-upgrade] command.

    ```azurecli-interactive
    az aks nodepool upgrade \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name npwd \
        --kubernetes-version 1.20.7 \
        --aks-custom-headers WindowsContainerRuntime=containerd
    ```

### Upgrade all existing Windows Server node pools to `containerd`

* Upgrade all node pools from Docker to `containerd` using the [`az aks nodepool upgrade`][az-aks-nodepool-upgrade] command.

    ```azurecli-interactive
    az aks nodepool upgrade \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --kubernetes-version 1.20.7 \
        --aks-custom-headers WindowsContainerRuntime=containerd
    ```

## Delete a node pool

If you no longer need a node pool, you can delete it and remove the underlying VM nodes.

> [!CAUTION]
> When you delete a node pool, AKS doesn't perform cordon and drain, and there are no recovery options for data loss that may occur when you delete a node pool. If pods can't be scheduled on other node pools, those applications become unavailable. Make sure you don't delete a node pool when in-use applications don't have data backups or the ability to run on other node pools in your cluster. To minimize the disruption of rescheduling pods currently running on the node pool you want to delete, perform a cordon and drain on all nodes in the node pool before deleting.

* Delete a node pool using the [`az aks nodepool delete`][az-aks-nodepool-delete] command and specify the node pool name.

    ```azurecli-interactive
    az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster --name mynodepool --no-wait
    ```

    It takes a few minutes to delete the nodes and the node pool.

## Next steps

In this article, you learned how to create multiple node pools in an AKS cluster. To learn about how to manage multiple node pools, see [Manage multiple node pools for a cluster in Azure Kubernetes Service (AKS)](manage-node-pools.md).

<!-- LINKS -->
[aks-storage-concepts]: concepts-storage.md
[arm-sku-vm1]: ../virtual-machines/dpsv5-dpdsv5-series.md
[arm-sku-vm2]: ../virtual-machines/dplsv5-dpldsv5-series.md
[arm-sku-vm3]: ../virtual-machines/epsv5-epdsv5-series.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-delete]: /cli/azure/aks#az_aks_delete
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az_aks_nodepool_list
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az_aks_nodepool_upgrade
[az-aks-nodepool-delete]: /cli/azure/aks/nodepool#az_aks_nodepool_delete
[az-group-create]: /cli/azure/group#az_group_create
[enable-fips-nodes]: enable-fips-nodes.md
[install-azure-cli]: /cli/azure/install-azure-cli
[use-system-pool]: use-system-pools.md
[restricted-vm-sizes]: ../virtual-machines/sizes.md
[aks-taints]: manage-node-pools.md#set-node-pool-taints
