---
title: Use multiple node pools in Azure Kubernetes Service (AKS)
description: Learn how to create and manage multiple node pools for a cluster in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 03/15/2019
ms.author: iainfou
---

# Preview - Create and manage multiple node pools for a cluster in Azure Kubernetes Service (AKS)

This article shows you how to create and manage multiple node pools in an AKS cluster. This feature is currently in preview.

> [!IMPORTANT]
> AKS preview features are self-service and opt-in. Previews are provided to gather feedback and bugs from our community. However, they are not supported by Azure technical support. If you create a cluster, or add these features to existing clusters, that cluster is unsupported until the feature is no longer in preview and graduates to general availability (GA).
>
> If you encounter issues with preview features, [open an issue on the AKS GitHub repo][aks-github] with the name of the preview feature in the bug title.

## Before you begin

You need the Azure CLI version 2.0.60 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Install aks-preview CLI extension

AKS clusters that support the cluster autoscaler must use virtual machine scale sets and run Kubernetes version *1.12.4* or later. This scale set support is in preview. To opt in and create clusters that use scale sets, first install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, as shown in the following example:

```azurecli-interactive
az extension add --name aks-preview
```

> [!NOTE]
> If you have previously installed the *aks-preview* extension, install any available updates using the the `az extension update --name aks-preview` command.

### Register scale set feature provider

To create an AKS cluster that can use multiple node pools, first enable two feature flags on your subscription. Multiple-nodepool clusters use a virtual machine scale set (VMSS) to manage the deployment and configuration of the Kubernetes nodes. Register the *MultiAgentpoolPreview* and *VMSSPreview* feature flags using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --name MultiAgentpoolPreview --namespace Microsoft.ContainerService
az feature register --name VMSSPreview --namespace Microsoft.ContainerService
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/MultiAgentpoolPreview')].{Name:name,State:properties.state}"
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/VMSSPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Preview limitations

* Cannot delete the first node pool
* Phase 1 allows only 4 node pools max
* Cannot scale/upgrade 2 node pools at the same time

## Create an AKS cluster

To get, first create a basic AKS cluster with a single node pool. The following example uses the [az group create][az-group-create] command to create a resource group named *myResourceGroup* in the *eastus* region. An AKS cluster named *myAKSCluster* is then created using the [az aks create][az-aks-create] command:

```azurecli-interactive
# Create a resource group in Canada East
az group create --name myResourceGroup --location eastus

# Create a basic single-node AKS cluster
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-vmss \
    --node-count 1 \
    --generate-ssh-keys \
    --kubernetes-version 1.12.5
```

It takes a few minutes to create the cluster.

When the cluster is ready, use the [az aks get-credentials][az-aks-get-credentials] command to get the cluster credentials for use with `kubectl`:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Add a node pool

The cluster created in the previous step has a single node pool. Let's add a second node pool using the [az aks node pool add][az-aks-nodepool-add] command. The following example creates a node pool named *mynodepool* that runs *3* nodes:

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-count 3
```

To see the status of your node pools, use the [az aks node pool list][az-aks-nodepool-list] command and specify your resource group and cluster name:

```azurecli-interactive
az aks nodepool list --resource-group myResourceGroup --cluster-name myAKSCluster -o table
```

The following example output shows that *mynodepool* :

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name        OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    VmSize
-----------------------  -------  ---------  ----------  ---------------------  --------------  --------  -------------------  ---------------
VirtualMachineScaleSets  3        110        mynodepool  1.12.5                 30              Linux     Succeeded            Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1   1.12.5                 30              Linux     Succeeded            Standard_DS2_v2
```

## Upgrade a node pool

**IS UPGRADING SUPPORT IN PHASE 1? RECEIVED: "Deployment failed. Correlation ID: 10d22fa4-a3f0-43ab-9779-95cf2f1d0e1a. Operation Upgrading not supported."**

When your AKS cluster was created in the first step, a `--kubernetes-version` of *1.12.5* was specified. Let's upgrade the *mynodepool* to Kubernetes *1.12.6*. Use the [az aks node pool upgrade][az-aks-nodepool-upgrade] command to upgrade the node pool, as shown in the following example:

```azurecli-interactive
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --kubernetes-version 1.12.6
```

List the status of your node pools again using the [az aks node pool list][az-aks-nodepool-list] command. The following example shows that *mynodepool* is in the *Upgrading* state to *1.12.6*:

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name        OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    VmSize
-----------------------  -------  ---------  ----------  ---------------------  --------------  --------  -------------------  ---------------
VirtualMachineScaleSets  3        110        mynodepool  1.12.5                 30              Linux     Succeeded            Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1   1.12.6                 30              Linux     Upgrading            Standard_DS2_v2
```

## Scale a node pool

As your application workload demands change, you may need to scale the number of nodes in a node pool. The number of nodes can be scaled up or down. If you scale down, nodes are carefully [cordoned and drained][kubernetes-drain] to minimize disruption to running applications.

To scale the number of nodes in a node pool, use the [az aks node pool scale][az-aks-nodepool-scale] command. The following example scales the number of nodes in *mynodepool* to *5*:

```azurecli-interactive
az aks nodepool scale \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-count 5
```

List the status of your node pools again using the [az aks node pool list][az-aks-nodepool-list] command. The following example shows that *mynodepool* is in the *Scaling* state with a new count of *5* nodes:

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name        OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    VmSize
-----------------------  -------  ---------  ----------  ---------------------  --------------  --------  -------------------  ---------------
VirtualMachineScaleSets  5        110        mynodepool  1.12.6                 30              Linux     Scaling              Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1   1.12.5                 30              Linux     Succeeded            Standard_DS2_v2
```

## Delete a node pool

If you no longer need a pool, you can delete it and remove the underlying VM nodes. To delete a node pool, use the [az aks node pool delete][az-aks-nodepool-delete] command and specify the node pool name. The following example deletes the *mynoodepool* created in the previous steps:

```azurecli-interactive
az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster --name mynodepool
```

The following example output from the [az aks node pool list][az-aks-nodepool-list] command shows that *mynodepool* is in the *Deleting* state:

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name          OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    VmSize
-----------------------  -------  ---------  -----------   ---------------------  --------------  --------  -------------------  ---------------
VirtualMachineScaleSets  5        110        mynodepool    1.12.6                 30              Linux     Deleting             Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1     1.12.5                 30              Linux     Succeeded            Standard_DS2_v2
```

## Specify a VM size for a node pool

In the previous examples to create a node pool, a default VM size was used for the nodes created in the cluster. A more common scenario is for you create node pools with different VM sizes and capabilities. For example, you may create a node pool that contains nodes with large amounts of CPU or memory, or a node pool that provides GPU support. In the next step, you use taints and tolerations to tell the Kubernetes scheduler how to limit access to pods that can run on these nodes.

In the following example, create a GPU-based node pool that uses the *Standard_NC6* VM size. These VMs are powered by the NVIDIA Tesla K80 card. For information on available VM sizes, see [Sizes for Linux virtual machines in Azure][vm-sizes].

Create a node pool using the [az aks node pool add][az-aks-nodepool-add] command again. This time, specify the name *gpunodepool*, and use the `--node-vm-size` parameter to specify the *Standard_NC6* size:

```azurecli-interactive
az aks nodepool add -g myResourceGroup --cluster-name myAKSCluster --name gpunodepool --node-count 1 --node-vm-size Standard_NC6
```

The following example output from the [az aks node pool list][az-aks-nodepool-list] command shows that *gpunodepool* is *Creating* nodes with the specified *VmSize*:

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name         OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    VmSize
-----------------------  -------  ---------  ---------    ---------------------  --------------  --------  -------------------  ---------------
VirtualMachineScaleSets  1        110        gpunodepool  1.12.5                 30              Linux     Creating             Standard_NC6
VirtualMachineScaleSets  1        110        nodepool1    1.12.5                 30              Linux     Succeeded            Standard_DS2_v2
```

## Schedule pods using taints and tolerations

You now have two node pools in your cluster - the default node pool initially created, and the GPU-based node pool. Use the [kubectl get nodes][kubectl-get] command to view the nodes in your cluster. The following example output shows one node in each node pool:

```console
$ kubectl get nodes

NAME                                 STATUS   ROLES   AGE     VERSION
aks-gpunodepool-28993262-vmss000000  Ready    agent   4m22s   v1.12.5
aks-nodepool1-28993262-vmss000000    Ready    agent   115m    v1.12.5
```

The Kubernetes scheduler can use taints and tolerations to restrict what workloads can run on nodes.

* A **taint** is applied to a node that indicates only specific pods can be scheduled on them.
* A **toleration** is then applied to a pod that allows them to *tolerate* a node's taint.

For more information on how to use advanced Kubernetes scheduled features, see [Best practices for advanced scheduler features in AKS][taints-tolerations]

In this example, apply a taint to your GPU-based node using the [kubectl taint node][kubectl-taint] command. Specify the name of your GPU-based node from the output of the previous `kubectl get nodes` command. The taint is applied as a *key:value* and then a scheduling option. The following example uses the *sku=gpu* pair and defines pods otherwise have the *NoSchedule* ability:

```console
kubectl taint node aks-gpunodepool-28993262-vmss000000 sku=gpu:NoSchedule
```

The following basic example YAML manifest uses a toleration to allow the Kubernetes scheduler to run an NGINX pod on the GPU-based node. For a more appropriate, but time-intensive example to run a Tensorflow job against the MNIST dataset, see [Use GPUs for compute-intensive workloads on AKS][gpu-cluster].

Create a file named `gpu-toleration.yaml` and copy in the following example YAML:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - image: nginx:1.15.9
    name: mypod
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 1
        memory: 2G
  tolerations:
  - key: "sku"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
```

Schedule the pod using the `kubectl apply -f gpu-toleration.yaml` command:

```console
kubectl apply -f gpu-toleration.yaml
```

It takes a few seconds to schedule the pod and pull the NGINX image. Use the [kubectl describe pod][kubectl-describe] command to view the pod status. The following condensed example output shows the *sku=gpu:NoSchedule* toleration is applied. In the events section, the scheduler has assigned the pod to the *aks-gpunodepool-28993262-vmss000000* GPU-based node:

```console
$ kubectl describe pod mypod

[...]
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
                 sku=gpu:NoSchedule
Events:
  Type    Reason     Age    From                                          Message
  ----    ------     ----   ----                                          -------
  Normal  Scheduled  4m48s  default-scheduler                             Successfully assigned default/mypod to aks-gpunodepool-28993262-vmss000000
  Normal  Pulling    4m47s  kubelet, aks-gpunodepool-28993262-vmss000000  pulling image "nginx:1.15.9"
  Normal  Pulled     4m43s  kubelet, aks-gpunodepool-28993262-vmss000000  Successfully pulled image "nginx:1.15.9"
  Normal  Created    4m40s  kubelet, aks-gpunodepool-28993262-vmss000000  Created container
  Normal  Started    4m40s  kubelet, aks-gpunodepool-28993262-vmss000000  Started container
```

## Clean up resources

In this article, you created an AKS cluster that includes GPU-based nodes. To reduce unnecessary cost, you may want to delete the *gpunodepool*, or the whole AKS cluster.

To delete the GPU-based node pool, use the [az aks node pool delete][az-aks-nodepool-delete] command as shown in following example:

```azurecli-interactive
az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster --name gpunodepool
```

To delete the cluster itself, use the [az group delete][az-group-delete] command to delete the AKS resource group:

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps

<!-- EXTERNAL LINKS -->
[aks-github]: https://github.com/azure/aks/issues]
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-taint]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#taint
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe

<!-- INTERNAL LINKS -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-nodepool-add]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-nodepool-add
[az-aks-nodepool-list]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-nodepool-list
[az-aks-nodepool-upgrade]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-nodepool-upgrade
[az-aks-nodepool-scale]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-nodepool-scale
[az-aks-nodepool-delete]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-nodepool-de;ete
[vm-sizes]: ../virtual-machines/linux/sizes.md
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[gpu-cluster]: gpu-cluster.md
[az-group-delete]: /cli/azure/group#az-group-delete
