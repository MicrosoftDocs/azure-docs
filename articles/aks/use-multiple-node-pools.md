---
title: Use multiple node pools in Azure Kubernetes Service (AKS)
description: Learn how to create and manage multiple node pools for a cluster in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 05/17/2019
ms.author: mlearned
---

# Preview - Create and manage multiple node pools for a cluster in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), nodes of the same configuration are grouped together into *node pools*. These node pools contain the underlying VMs that run your applications. The initial number of nodes and their size (SKU) are defined when you create an AKS cluster, which creates a *default node pool*. To support applications that have different compute or storage demands, you can create additional node pools. For example, use these additional node pools to provide GPUs for compute-intensive applications, or access to high-performance SSD storage.

This article shows you how to create and manage multiple node pools in an AKS cluster. This feature is currently in preview.

> [!IMPORTANT]
> AKS preview features are self-service, opt-in. They are provided to gather feedback and bugs from our community. In preview, these features aren't meant for production use. Features in public preview fall under 'best effort' support. Assistance from the AKS technical support teams is available during business hours Pacific timezone (PST) only. For additional information, please see the following support articles:
>
> * [AKS Support Policies][aks-support-policies]
> * [Azure Support FAQ][aks-faq]

## Before you begin

You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Install aks-preview CLI extension

To use multiple nodepools, you need the *aks-preview* CLI extension version 0.4.1 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command::

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register multiple node pool feature provider

To create an AKS cluster that can use multiple node pools, first enable two feature flags on your subscription. Multi-node pool clusters use a virtual machine scale set (VMSS) to manage the deployment and configuration of the Kubernetes nodes. Register the *MultiAgentpoolPreview* and *VMSSPreview* feature flags using the [az feature register][az-feature-register] command as shown in the following example:

> [!CAUTION]
> When you register a feature on a subscription, you can't currently un-register that feature. After you enable some preview features, defaults may be used for all AKS clusters then created in the subscription. Don't enable preview features on production subscriptions. Use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name MultiAgentpoolPreview --namespace Microsoft.ContainerService
az feature register --name VMSSPreview --namespace Microsoft.ContainerService
```

> [!NOTE]
> Any AKS cluster you create after you've successfully registered the *MultiAgentpoolPreview* use this preview cluster experience. To continue to create regular, fully-supported clusters, don't enable preview features on production subscriptions. Use a separate test or development Azure subscription for testing preview features.

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/MultiAgentpoolPreview')].{Name:name,State:properties.state}"
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/VMSSPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

* Multiple node pools are only available for clusters created after you've successfully registered the *MultiAgentpoolPreview* and *VMSSPreview* features for your subscription. You can't add or manage node pools with an existing AKS cluster created before these features were successfully registered.
* You can't delete the first node pool.
* The HTTP application routing add-on can't be used.
* You can't add/update/delete node pools using an existing Resource Manager template as with most operations. Instead, [use a separate Resource Manager template](#manage-node-pools-using-a-resource-manager-template) to make changes to node pools in an AKS cluster.

While this feature is in preview, the following additional limitations apply:

* The AKS cluster can have a maximum of eight node pools.
* The AKS cluster can have a maximum of 400 nodes across those eight node pools.
* All node pools must reside in the same subnet

## Create an AKS cluster

To get started, create an AKS cluster with a single node pool. The following example uses the [az group create][az-group-create] command to create a resource group named *myResourceGroup* in the *eastus* region. An AKS cluster named *myAKSCluster* is then created using the [az aks create][az-aks-create] command. A *--kubernetes-version* of *1.12.6* is used to show how to update a node pool in a following step. You can specify any [supported Kubernetes version][supported-versions].

```azurecli-interactive
# Create a resource group in East US
az group create --name myResourceGroup --location eastus

# Create a basic single-node AKS cluster
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-vmss \
    --node-count 1 \
    --generate-ssh-keys \
    --kubernetes-version 1.12.6
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

The following example output shows that *mynodepool* has been successfully created with three nodes in the node pool. When the AKS cluster was created in the previous step, a default *nodepool1* was created with a node count of *1*.

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name        OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    ResourceGroup         VmSize
-----------------------  -------  ---------  ----------  ---------------------  --------------  --------  -------------------  --------------------  ---------------
VirtualMachineScaleSets  3        110        mynodepool  1.12.6                 100             Linux     Succeeded            myResourceGroupPools  Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1   1.12.6                 100             Linux     Succeeded            myResourceGroupPools  Standard_DS2_v2
```

> [!TIP]
> If no *OrchestratorVersion* or *VmSize* is specified when you add a node pool, the nodes are created based on the defaults for the AKS cluster. In this example, that was Kubernetes version *1.12.6* and node size of *Standard_DS2_v2*.

## Upgrade a node pool

When your AKS cluster was created in the first step, a `--kubernetes-version` of *1.12.6* was specified. Let's upgrade the *mynodepool* to Kubernetes *1.12.7*. Use the [az aks node pool upgrade][az-aks-nodepool-upgrade] command to upgrade the node pool, as shown in the following example:

```azurecli-interactive
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --kubernetes-version 1.12.7 \
    --no-wait
```

List the status of your node pools again using the [az aks node pool list][az-aks-nodepool-list] command. The following example shows that *mynodepool* is in the *Upgrading* state to *1.12.7*:

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name        OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    ResourceGroup    VmSize
-----------------------  -------  ---------  ----------  ---------------------  --------------  --------  -------------------  ---------------  ---------------
VirtualMachineScaleSets  3        110        mynodepool  1.12.7                 100             Linux     Upgrading            myResourceGroup  Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1   1.12.6                 100             Linux     Succeeded            myResourceGroup  Standard_DS2_v2
```

It takes a few minutes to upgrade the nodes to the specified version.

As a best practice, you should upgrade all node pools in an AKS cluster to the same Kubernetes version. The ability to upgrade individual node pools lets you perform a rolling upgrade and schedule pods between node pools to maintain application uptime.

## Scale a node pool

As your application workload demands change, you may need to scale the number of nodes in a node pool. The number of nodes can be scaled up or down.

<!--If you scale down, nodes are carefully [cordoned and drained][kubernetes-drain] to minimize disruption to running applications.-->

To scale the number of nodes in a node pool, use the [az aks node pool scale][az-aks-nodepool-scale] command. The following example scales the number of nodes in *mynodepool* to *5*:

```azurecli-interactive
az aks nodepool scale \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-count 5 \
    --no-wait
```

List the status of your node pools again using the [az aks node pool list][az-aks-nodepool-list] command. The following example shows that *mynodepool* is in the *Scaling* state with a new count of *5* nodes:

```console
$ az aks nodepool list -g myResourceGroupPools --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name        OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    ResourceGroup         VmSize
-----------------------  -------  ---------  ----------  ---------------------  --------------  --------  -------------------  --------------------  ---------------
VirtualMachineScaleSets  5        110        mynodepool  1.12.7                 100             Linux     Scaling              myResourceGroupPools  Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1   1.12.6                 100             Linux     Succeeded            myResourceGroupPools  Standard_DS2_v2
```

It takes a few minutes for the scale operation to complete.

## Delete a node pool

If you no longer need a pool, you can delete it and remove the underlying VM nodes. To delete a node pool, use the [az aks node pool delete][az-aks-nodepool-delete] command and specify the node pool name. The following example deletes the *mynoodepool* created in the previous steps:

> [!CAUTION]
> There are no recovery options for data loss that may occur when you delete a node pool. If pods can't be scheduled on other node pools, those applications are unavailable. Make sure you don't delete a node pool when in-use applications don't have data backups or the ability to run on other node pools in your cluster.

```azurecli-interactive
az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster --name mynodepool --no-wait
```

The following example output from the [az aks node pool list][az-aks-nodepool-list] command shows that *mynodepool* is in the *Deleting* state:

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name        OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    ResourceGroup         VmSize
-----------------------  -------  ---------  ----------  ---------------------  --------------  --------  -------------------  --------------------  ---------------
VirtualMachineScaleSets  5        110        mynodepool  1.12.7                 100             Linux     Deleting             myResourceGroupPools  Standard_DS2_v2
VirtualMachineScaleSets  1        110        nodepool1   1.12.6                 100             Linux     Succeeded            myResourceGroupPools  Standard_DS2_v2
```

It takes a few minutes to delete the nodes and the node pool.

## Specify a VM size for a node pool

In the previous examples to create a node pool, a default VM size was used for the nodes created in the cluster. A more common scenario is for you to create node pools with different VM sizes and capabilities. For example, you may create a node pool that contains nodes with large amounts of CPU or memory, or a node pool that provides GPU support. In the next step, you [use taints and tolerations](#schedule-pods-using-taints-and-tolerations) to tell the Kubernetes scheduler how to limit access to pods that can run on these nodes.

In the following example, create a GPU-based node pool that uses the *Standard_NC6* VM size. These VMs are powered by the NVIDIA Tesla K80 card. For information on available VM sizes, see [Sizes for Linux virtual machines in Azure][vm-sizes].

Create a node pool using the [az aks node pool add][az-aks-nodepool-add] command again. This time, specify the name *gpunodepool*, and use the `--node-vm-size` parameter to specify the *Standard_NC6* size:

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name gpunodepool \
    --node-count 1 \
    --node-vm-size Standard_NC6 \
    --no-wait
```

The following example output from the [az aks node pool list][az-aks-nodepool-list] command shows that *gpunodepool* is *Creating* nodes with the specified *VmSize*:

```console
$ az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster -o table

AgentPoolType            Count    MaxPods    Name         OrchestratorVersion    OsDiskSizeGb    OsType    ProvisioningState    ResourceGroup         VmSize
-----------------------  -------  ---------  -----------  ---------------------  --------------  --------  -------------------  --------------------  ---------------
VirtualMachineScaleSets  1        110        gpunodepool  1.12.6                 100             Linux     Creating             myResourceGroupPools  Standard_NC6
VirtualMachineScaleSets  1        110        nodepool1    1.12.6                 100             Linux     Succeeded            myResourceGroupPools  Standard_DS2_v2
```

It takes a few minutes for the *gpunodepool* to be successfully created.

## Schedule pods using taints and tolerations

You now have two node pools in your cluster - the default node pool initially created, and the GPU-based node pool. Use the [kubectl get nodes][kubectl-get] command to view the nodes in your cluster. The following example output shows one node in each node pool:

```console
$ kubectl get nodes

NAME                                 STATUS   ROLES   AGE     VERSION
aks-gpunodepool-28993262-vmss000000  Ready    agent   4m22s   v1.12.6
aks-nodepool1-28993262-vmss000000    Ready    agent   115m    v1.12.6
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

Only pods that have this taint applied can be scheduled on nodes in *gpunodepool*. Any other pod would be scheduled in the *nodepool1* node pool. If you create additional node pools, you can use additional taints and tolerations to limit what pods can be scheduled on those node resources.

## Manage node pools using a Resource Manager template

When you use an Azure Resource Manager template to create and managed resources, you can typically update the settings in your template and redeploy to update the resource. With node pools in AKS, the initial node pool profile can't be updated once the AKS cluster has been created. This behavior means that you can't update an existing Resource Manager template, make a change to the node pools, and redeploy. Instead, you must create a separate Resource Manager template that updates only the agent pools for an existing AKS cluster.

Create a template such as `aks-agentpools.json` and paste the following example manifest. This example template configures the following settings:

* Updates the *Linux* agent pool named *myagentpool* to run three nodes.
* Sets the nodes in the node pool to run Kubernetes version *1.12.8*.
* Defines the node size as *Standard_DS2_v2*.

Edit these values as need to update, add, or delete node pools as needed:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string",
      "metadata": {
        "description": "The name of your existing AKS cluster."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "The location of your existing AKS cluster."
      }
    },
    "agentPoolName": {
      "type": "string",
      "defaultValue": "myagentpool",
      "metadata": {
        "description": "The name of the agent pool to create or update."
      }
    },
    "vnetSubnetId": {
      "type": "string",
      "defaultValue": "",
      "metadata": {
        "description": "The Vnet subnet resource ID for your existing AKS cluster."
      }
    }
  },
  "variables": {
    "apiVersion": {
      "aks": "2019-04-01"
    },
    "agentPoolProfiles": {
      "maxPods": 30,
      "osDiskSizeGB": 0,
      "agentCount": 3,
      "agentVmSize": "Standard_DS2_v2",
      "osType": "Linux",
      "vnetSubnetId": "[parameters('vnetSubnetId')]"
    }
  },
  "resources": [
    {
      "apiVersion": "2019-04-01",
      "type": "Microsoft.ContainerService/managedClusters/agentPools",
      "name": "[concat(parameters('clusterName'),'/', parameters('agentPoolName'))]",
      "location": "[parameters('location')]",
      "properties": {
            "maxPods": "[variables('agentPoolProfiles').maxPods]",
            "osDiskSizeGB": "[variables('agentPoolProfiles').osDiskSizeGB]",
            "count": "[variables('agentPoolProfiles').agentCount]",
            "vmSize": "[variables('agentPoolProfiles').agentVmSize]",
            "osType": "[variables('agentPoolProfiles').osType]",
            "storageProfile": "ManagedDisks",
      "type": "VirtualMachineScaleSets",
            "vnetSubnetID": "[variables('agentPoolProfiles').vnetSubnetId]",
            "orchestratorVersion": "1.12.8"
      }
    }
  ]
}
```

Deploy this template using the [az group deployment create][az-group-deployment-create] command, as shown in the following example. You are prompted for the existing AKS cluster name and location:

```azurecli-interactive
az group deployment create \
    --resource-group myResourceGroup \
    --template-file aks-agentpools.json
```

It may take a few minutes to update your AKS cluster depending on the node pool settings and operations you define in your Resource Manager template.

## Clean up resources

In this article, you created an AKS cluster that includes GPU-based nodes. To reduce unnecessary cost, you may want to delete the *gpunodepool*, or the whole AKS cluster.

To delete the GPU-based node pool, use the [az aks nodepool delete][az-aks-nodepool-delete] command as shown in following example:

```azurecli-interactive
az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster --name gpunodepool
```

To delete the cluster itself, use the [az group delete][az-group-delete] command to delete the AKS resource group:

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps

In this article, you learned how to create and manage multiple node pools in an AKS cluster. For more information about how to control pods across node pools, see [Best practices for advanced scheduler features in AKS][operator-best-practices-advanced-scheduler].

To create and use Windows Server container node pools, see [Create a Windows Server container in AKS][aks-windows].

<!-- EXTERNAL LINKS -->
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
[az-aks-nodepool-add]: /cli/azure/ext/aks-preview/aks/nodepool#ext-aks-preview-az-aks-nodepool-add
[az-aks-nodepool-list]: /cli/azure/ext/aks-preview/aks/nodepool#ext-aks-preview-az-aks-nodepool-list
[az-aks-nodepool-upgrade]: /cli/azure/ext/aks-preview/aks/nodepool#ext-aks-preview-az-aks-nodepool-upgrade
[az-aks-nodepool-scale]: /cli/azure/ext/aks-preview/aks/nodepool#ext-aks-preview-az-aks-nodepool-scale
[az-aks-nodepool-delete]: /cli/azure/ext/aks-preview/aks/nodepool#ext-aks-preview-az-aks-nodepool-delete
[vm-sizes]: ../virtual-machines/linux/sizes.md
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[gpu-cluster]: gpu-cluster.md
[az-group-delete]: /cli/azure/group#az-group-delete
[install-azure-cli]: /cli/azure/install-azure-cli
[supported-versions]: supported-kubernetes-versions.md
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[aks-windows]: windows-container-cli.md
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
