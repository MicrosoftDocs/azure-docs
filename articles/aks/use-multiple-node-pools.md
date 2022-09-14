---
title: Use multiple node pools in Azure Kubernetes Service (AKS)
description: Learn how to create and manage multiple node pools for a cluster in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.custom: event-tier1-build-2022
ms.date: 05/16/2022
---

# Create and manage multiple node pools for a cluster in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), nodes of the same configuration are grouped together into *node pools*. These node pools contain the underlying VMs that run your applications. The initial number of nodes and their size (SKU) is defined when you create an AKS cluster, which creates a [system node pool][use-system-pool]. To support applications that have different compute or storage demands, you can create additional *user node pools*. System node pools serve the primary purpose of hosting critical system pods such as CoreDNS and tunnelfront. User node pools serve the primary purpose of hosting your application pods. However, application pods can be scheduled on system node pools if you wish to only have one pool in your AKS cluster. User node pools are where you place your application-specific pods. For example, use these additional user node pools to provide GPUs for compute-intensive applications, or access to high-performance SSD storage.

> [!NOTE]
> This feature enables higher control over how to create and manage multiple node pools. As a result, separate commands are required for create/update/delete. Previously cluster operations through `az aks create` or `az aks update` used the managedCluster API and were the only options to change your control plane and a single node pool. This feature exposes a separate operation set for agent pools through the agentPool API and require use of the `az aks nodepool` command set to execute operations on an individual node pool.

This article shows you how to create and manage multiple node pools in an AKS cluster.

## Before you begin

You need the Azure CLI version 2.2.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

* See [Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)][quotas-skus-regions].
* You can delete system node pools, provided you have another system node pool to take its place in the AKS cluster.
* System pools must contain at least one node, and user node pools may contain zero or more nodes.
* The AKS cluster must use the Standard SKU load balancer to use multiple node pools, the feature isn't supported with Basic SKU load balancers.
* The AKS cluster must use virtual machine scale sets for the nodes.
* You can't change the VM size of a node pool after you create it.
* The name of a node pool may only contain lowercase alphanumeric characters and must begin with a lowercase letter. For Linux node pools the length must be between 1 and 12 characters, for Windows node pools the length must be between 1 and 6 characters.
* All node pools must reside in the same virtual network.
* When creating multiple node pools at cluster create time, all Kubernetes versions used by node pools must match the version set for the control plane. This can be updated after the cluster has been provisioned by using per node pool operations.

## Create an AKS cluster

> [!IMPORTANT]
> If you run a single system node pool for your AKS cluster in a production environment, we recommend you use at least three nodes for the node pool.

To get started, create an AKS cluster with a single node pool. The following example uses the [az group create][az-group-create] command to create a resource group named *myResourceGroup* in the *eastus* region. An AKS cluster named *myAKSCluster* is then created using the [az aks create][az-aks-create] command.

> [!NOTE]
> The *Basic* load balancer SKU is **not supported** when using multiple node pools. By default, AKS clusters are created with the *Standard* load balancer SKU from the Azure CLI and Azure portal.

```azurecli-interactive
# Create a resource group in East US
az group create --name myResourceGroup --location eastus

# Create a basic single-node AKS cluster
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --vm-set-type VirtualMachineScaleSets \
    --node-count 2 \
    --generate-ssh-keys \
    --load-balancer-sku standard
```

It takes a few minutes to create the cluster.

> [!NOTE]
> To ensure your cluster operates reliably, you should run at least 2 (two) nodes in the default node pool, as essential system services are running across this node pool.

When the cluster is ready, use the [az aks get-credentials][az-aks-get-credentials] command to get the cluster credentials for use with `kubectl`:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Add a node pool

The cluster created in the previous step has a single node pool. Let's add a second node pool using the [az aks nodepool add][az-aks-nodepool-add] command. The following example creates a node pool named *mynodepool* that runs *3* nodes:

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-count 3
```

> [!NOTE]
> The name of a node pool must start with a lowercase letter and can only contain alphanumeric characters. For Linux node pools the length must be between 1 and 12 characters, for Windows node pools the length must be between 1 and 6 characters.

To see the status of your node pools, use the [az aks node pool list][az-aks-nodepool-list] command and specify your resource group and cluster name:

```azurecli-interactive
az aks nodepool list --resource-group myResourceGroup --cluster-name myAKSCluster
```

The following example output shows that *mynodepool* has been successfully created with three nodes in the node pool. When the AKS cluster was created in the previous step, a default *nodepool1* was created with a node count of *2*.

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

> [!TIP]
> If no *VmSize* is specified when you add a node pool, the default size is *Standard_D2s_v3* for Windows node pools and *Standard_DS2_v2* for Linux node pools. If no *OrchestratorVersion* is specified, it defaults to the same version as the control plane.

### Add an ARM64 node pool

The ARM64 processor provides low power compute for your Kubernetes workloads. To create an ARM64 node pool, you will need to choose a [Dpsv5][arm-sku-vm1], [Dplsv5][arm-sku-vm2] or [Epsv5][arm-sku-vm3] series Virtual Machine.

Use `az aks nodepool add` command to add an ARM64 node pool.

```azurecli
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name armpool \
    --node-count 3 \
    --node-vm-size Standard_Dpds_v5
```

### Add a node pool with a unique subnet

A workload may require splitting a cluster's nodes into separate pools for logical isolation. This isolation can be supported with separate subnets dedicated to each node pool in the cluster. This can address requirements such as having non-contiguous virtual network address space to split across node pools.

> [!NOTE]
> Make sure to use Azure CLI version `2.35.0` or later.

#### Limitations

* All subnets assigned to node pools must belong to the same virtual network.
* System pods must have access to all nodes/pods in the cluster to provide critical functionality such as DNS resolution and tunneling kubectl logs/exec/port-forward proxy.
* If you expand your VNET after creating the cluster you must update your cluster (perform any managed cluster operation but node pool operations don't count) before adding a subnet outside the original cidr. AKS will error-out on the agent pool add now though we originally allowed it. The `aks-preview` Azure CLI extension (version 0.5.66+) now supports running `az aks update -g <resourceGroup> -n <clusterName>` without any optional arguments. This command will perform an update operation without making any changes, which can recover a cluster stuck in a failed state.
* In clusters with Kubernetes version < 1.23.3, kube-proxy will SNAT traffic from new subnets, which can cause Azure Network Policy to drop the packets.
* Windows nodes will SNAT traffic to the new subnets until the node pool is reimaged.
* Internal load balancers default to one of the node pool subnets (usually the first subnet of the node pool at cluster creation). To override this behavior, you can [specify the load balancer's subnet explicitly using an annotation][internal-lb-different-subnet].

To create a node pool with a dedicated subnet, pass the subnet resource ID as an additional parameter when creating a node pool.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --node-count 3 \
    --vnet-subnet-id <YOUR_SUBNET_RESOURCE_ID>
```

## Upgrade a node pool

> [!NOTE]
> Upgrade and scale operations on a cluster or node pool cannot occur simultaneously, if attempted an error is returned. Instead, each operation type must complete on the target resource prior to the next request on that same resource. Read more about this on our [troubleshooting guide](./troubleshooting.md#im-receiving-errors-when-trying-to-upgrade-or-scale-that-state-my-cluster-is-being-upgraded-or-has-failed-upgrade).

The commands in this section explain how to upgrade a single specific node pool. The relationship between upgrading the Kubernetes version of the control plane and the node pool are explained in the [section below](#upgrade-a-cluster-control-plane-with-multiple-node-pools).

> [!NOTE]
> The node pool OS image version is tied to the Kubernetes version of the cluster. You will only get OS image upgrades, following a cluster upgrade.

Since there are two node pools in this example, we must use [az aks nodepool upgrade][az-aks-nodepool-upgrade] to upgrade a node pool. To see the available upgrades use [az aks get-upgrades][az-aks-get-upgrades]

```azurecli-interactive
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster
```

Let's upgrade the *mynodepool*. Use the [az aks nodepool upgrade][az-aks-nodepool-upgrade] command to upgrade the node pool, as shown in the following example:

```azurecli-interactive
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name mynodepool \
    --kubernetes-version KUBERNETES_VERSION \
    --no-wait
```

List the status of your node pools again using the [az aks node pool list][az-aks-nodepool-list] command. The following example shows that *mynodepool* is in the *Upgrading* state to *KUBERNETES_VERSION*:

```azurecli
az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
```

```output
[
  {
    ...
    "count": 3,
    ...
    "name": "mynodepool",
    "orchestratorVersion": "KUBERNETES_VERSION",
    ...
    "provisioningState": "Upgrading",
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
    "provisioningState": "Succeeded",
    ...
    "vmSize": "Standard_DS2_v2",
    ...
  }
]
```

It takes a few minutes to upgrade the nodes to the specified version.

As a best practice, you should upgrade all node pools in an AKS cluster to the same Kubernetes version. The default behavior of `az aks upgrade` is to upgrade all node pools together with the control plane to achieve this alignment. The ability to upgrade individual node pools lets you perform a rolling upgrade and schedule pods between node pools to maintain application uptime within the above constraints mentioned.

## Upgrade a cluster control plane with multiple node pools

> [!NOTE]
> Kubernetes uses the standard [Semantic Versioning](https://semver.org/) versioning scheme. The version number is expressed as *x.y.z*, where *x* is the major version, *y* is the minor version, and *z* is the patch version. For example, in version *1.12.6*, 1 is the major version, 12 is the minor version, and 6 is the patch version. The Kubernetes version of the control plane and the initial node pool are set during cluster creation. All additional node pools have their Kubernetes version set when they are added to the cluster. The Kubernetes versions may differ between node pools as well as between a node pool and the control plane.

An AKS cluster has two cluster resource objects with Kubernetes versions associated.

1. A cluster control plane Kubernetes version.
2. A node pool with a Kubernetes version.

A control plane maps to one or many node pools. The behavior of an upgrade operation depends on which Azure CLI command is used.

Upgrading an AKS control plane requires using `az aks upgrade`. This command upgrades the control plane version and all node pools in the cluster.

Issuing the `az aks upgrade` command with the `--control-plane-only` flag upgrades only the cluster control plane. None of the associated node pools in the cluster are changed.

Upgrading individual node pools requires using `az aks nodepool upgrade`. This command upgrades only the target node pool with the specified Kubernetes version

### Validation rules for upgrades

The valid Kubernetes upgrades for a cluster's control plane and node pools are validated by the following sets of rules.

* Rules for valid versions to upgrade node pools:
   * The node pool version must have the same *major* version as the control plane.
   * The node pool *minor* version must be within two *minor* versions of the control plane version.
   * The node pool version can't be greater than the control `major.minor.patch` version.

* Rules for submitting an upgrade operation:
   * You can't downgrade the control plane or a node pool Kubernetes version.
   * If a node pool Kubernetes version isn't specified, behavior depends on the client being used. Declaration in Resource Manager templates falls back to the existing version defined for the node pool if used, if none is set the control plane version is used to fall back on.
   * You can either upgrade or scale a control plane or a node pool at a given time, you can't submit multiple operations on a single control plane or node pool resource simultaneously.

## Scale a node pool manually

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

```azurecli
az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
```

```output
[
  {
    ...
    "count": 5,
    ...
    "name": "mynodepool",
    "orchestratorVersion": "1.15.7",
    ...
    "provisioningState": "Scaling",
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
    "provisioningState": "Succeeded",
    ...
    "vmSize": "Standard_DS2_v2",
    ...
  }
]
```

It takes a few minutes for the scale operation to complete.

## Scale a specific node pool automatically by enabling the cluster autoscaler

AKS offers a separate feature to automatically scale node pools with a feature called the [cluster autoscaler](cluster-autoscaler.md). This feature can be enabled per node pool with unique minimum and maximum scale counts per node pool. Learn how to [use the cluster autoscaler per node pool](cluster-autoscaler.md#use-the-cluster-autoscaler-with-multiple-node-pools-enabled).

## Delete a node pool

If you no longer need a pool, you can delete it and remove the underlying VM nodes. To delete a node pool, use the [az aks node pool delete][az-aks-nodepool-delete] command and specify the node pool name. The following example deletes the *mynodepool* created in the previous steps:

> [!CAUTION]
> When you delete a node pool, AKS doesn't perform cordon and drain, and there are no recovery options for data loss that may occur when you delete a node pool. If pods can't be scheduled on other node pools, those applications become unavailable. Make sure you don't delete a node pool when in-use applications don't have data backups or the ability to run on other node pools in your cluster. To minimize the disruption of rescheduling pods currently running on the node pool you are going to delete, perform a cordon and drain on all nodes in the node pool before deleting. For more information, see [cordon and drain node pools][cordon-and-drain].

```azurecli-interactive
az aks nodepool delete -g myResourceGroup --cluster-name myAKSCluster --name mynodepool --no-wait
```

The following example output from the [az aks node pool list][az-aks-nodepool-list] command shows that *mynodepool* is in the *Deleting* state:

```azurecli
az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
```

```output
[
  {
    ...
    "count": 5,
    ...
    "name": "mynodepool",
    "orchestratorVersion": "1.15.7",
    ...
    "provisioningState": "Deleting",
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
    "provisioningState": "Succeeded",
    ...
    "vmSize": "Standard_DS2_v2",
    ...
  }
]
```

It takes a few minutes to delete the nodes and the node pool.

## Associate capacity reservation groups to node pools (preview)

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

As your application workloads demands, you may associate node pools to capacity reservation groups created prior. This ensures guaranteed capacity is allocated for your node pools.  

For more information on the capacity reservation groups, please refer to [Capacity Reservation Groups][capacity-reservation-groups].

Associating a node pool with an existing capacity reservation group can be done using [az aks nodepool add][az-aks-nodepool-add] command and specifying a capacity reservation group with the --capacityReservationGroup flag" The capacity reservation group should already exist, otherwise the node pool will be added to the cluster with a warning and no capacity reservation group gets associated. 

```azurecli-interactive
az aks nodepool add -g MyRG --cluster-name MyMC -n myAP --capacityReservationGroup myCRG
```

Associating a system node pool with an existing capacity reservation group can be done using [az aks create][az-aks-create] command. If the capacity reservation group specified doesn't exist, then a warning is issued and the cluster gets created without any capacity reservation group association. 

```azurecli-interactive
az aks create -g MyRG --cluster-name MyMC --capacityReservationGroup myCRG
```

Deleting a node pool command will implicitly dissociate a node pool from any associated capacity reservation group, before that node pool is deleted.

```azurecli-interactive
az aks nodepool delete -g MyRG --cluster-name MyMC -n myAP
```

Deleting a cluster command implicitly dissociates all node pools in a cluster from their associated capacity reservation groups.

```azurecli-interactive
az aks delete -g MyRG --cluster-name MyMC
```

## Specify a VM size for a node pool

In the previous examples to create a node pool, a default VM size was used for the nodes created in the cluster. A more common scenario is for you to create node pools with different VM sizes and capabilities. For example, you may create a node pool that contains nodes with large amounts of CPU or memory, or a node pool that provides GPU support. In the next step, you [use taints and tolerations](#setting-nodepool-taints) to tell the Kubernetes scheduler how to limit access to pods that can run on these nodes.

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

```azurecli
az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
```

```output
[
  {
    ...
    "count": 1,
    ...
    "name": "gpunodepool",
    "orchestratorVersion": "1.15.7",
    ...
    "provisioningState": "Creating",
    ...
    "vmSize": "Standard_NC6",
    ...
  },
  {
    ...
    "count": 2,
    ...
    "name": "nodepool1",
    "orchestratorVersion": "1.15.7",
    ...
    "provisioningState": "Succeeded",
    ...
    "vmSize": "Standard_DS2_v2",
    ...
  }
]
```

It takes a few minutes for the *gpunodepool* to be successfully created.

## Specify a taint, label, or tag for a node pool

When creating a node pool, you can add taints, labels, or tags to that node pool. When you add a taint, label, or tag, all nodes within that node pool also get that taint, label, or tag.

> [!IMPORTANT]
> Adding taints, labels, or tags to nodes should be done for the entire node pool using `az aks nodepool`. Applying taints, labels, or tags to individual nodes in a node pool using `kubectl` is not recommended.  

### Setting nodepool taints

To create a node pool with a taint, use [az aks nodepool add][az-aks-nodepool-add]. Specify the name *taintnp* and use the `--node-taints` parameter to specify *sku=gpu:NoSchedule* for the taint.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name taintnp \
    --node-count 1 \
    --node-taints sku=gpu:NoSchedule \
    --no-wait
```

The following example output from the [az aks nodepool list][az-aks-nodepool-list] command shows that *taintnp* is *Creating* nodes with the specified *nodeTaints*:

```azurecli
az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
```

```output
[
  {
    ...
    "count": 1,
    ...
    "name": "taintnp",
    "orchestratorVersion": "1.15.7",
    ...
    "provisioningState": "Creating",
    ...
    "nodeTaints":  [
      "sku=gpu:NoSchedule"
    ],
    ...
  },
 ...
]
```

The taint information is visible in Kubernetes for handling scheduling rules for nodes. The Kubernetes scheduler can use taints and tolerations to restrict what workloads can run on nodes.

* A **taint** is applied to a node that indicates only specific pods can be scheduled on them.
* A **toleration** is then applied to a pod that allows them to *tolerate* a node's taint.

For more information on how to use advanced Kubernetes scheduled features, see [Best practices for advanced scheduler features in AKS][taints-tolerations]

In the previous step, you applied the *sku=gpu:NoSchedule* taint when you created your node pool. The following basic example YAML manifest uses a toleration to allow the Kubernetes scheduler to run an NGINX pod on a node in that node pool.

Create a file named `nginx-toleration.yaml` and copy in the following example YAML:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - image: mcr.microsoft.com/oss/nginx/nginx:1.15.9-alpine
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

Schedule the pod using the `kubectl apply -f nginx-toleration.yaml` command:

```console
kubectl apply -f nginx-toleration.yaml
```

It takes a few seconds to schedule the pod and pull the NGINX image. Use the [kubectl describe pod][kubectl-describe] command to view the pod status. The following condensed example output shows the *sku=gpu:NoSchedule* toleration is applied. In the events section, the scheduler has assigned the pod to the *aks-taintnp-28993262-vmss000000* node:

```console
kubectl describe pod mypod
```

```output
[...]
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
                 sku=gpu:NoSchedule
Events:
  Type    Reason     Age    From                Message
  ----    ------     ----   ----                -------
  Normal  Scheduled  4m48s  default-scheduler   Successfully assigned default/mypod to aks-taintnp-28993262-vmss000000
  Normal  Pulling    4m47s  kubelet             pulling image "mcr.microsoft.com/oss/nginx/nginx:1.15.9-alpine"
  Normal  Pulled     4m43s  kubelet             Successfully pulled image "mcr.microsoft.com/oss/nginx/nginx:1.15.9-alpine"
  Normal  Created    4m40s  kubelet             Created container
  Normal  Started    4m40s  kubelet             Started container
```

Only pods that have this toleration applied can be scheduled on nodes in *taintnp*. Any other pod would be scheduled in the *nodepool1* node pool. If you create additional node pools, you can use additional taints and tolerations to limit what pods can be scheduled on those node resources.

### Setting nodepool labels

For more information on using labels with node pools, see [Use labels in an Azure Kubernetes Service (AKS) cluster][use-labels].

### Setting nodepool Azure tags

For more information on using Azure tags with node pools, see [Use Azure tags in Azure Kubernetes Service (AKS)][use-tags].

## Add a FIPS-enabled node pool

For more information on enabling Federal Information Process Standard (FIPS) for your AKS cluster, see [Enable Federal Information Process Standard (FIPS) for Azure Kubernetes Service (AKS) node pools][enable-fips-nodes].

## Manage node pools using a Resource Manager template

When you use an Azure Resource Manager template to create and managed resources, you can typically update the settings in your template and redeploy to update the resource. With node pools in AKS, the initial node pool profile can't be updated once the AKS cluster has been created. This behavior means that you can't update an existing Resource Manager template, make a change to the node pools, and redeploy. Instead, you must create a separate Resource Manager template that updates only the node pools for an existing AKS cluster.

Create a template such as `aks-agentpools.json` and paste the following example manifest. This example template configures the following settings:

* Updates the *Linux* node pool named *myagentpool* to run three nodes.
* Sets the nodes in the node pool to run Kubernetes version *1.15.7*.
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
            "aks": "2020-01-01"
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
            "apiVersion": "2020-01-01",
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
                "orchestratorVersion": "1.15.7"
            }
        }
    ]
}
```

Deploy this template using the [az deployment group create][az-deployment-group-create] command, as shown in the following example. You're prompted for the existing AKS cluster name and location:

```azurecli-interactive
az deployment group create \
    --resource-group myResourceGroup \
    --template-file aks-agentpools.json
```

> [!TIP]
> You can add a tag to your node pool by adding the *tag* property in the template, as shown in the following example.
> 
> ```json
> ...
> "resources": [
> {
>   ...
>   "properties": {
>     ...
>     "tags": {
>       "name1": "val1"
>     },
>     ...
>   }
> }
> ...
> ```

It may take a few minutes to update your AKS cluster depending on the node pool settings and operations you define in your Resource Manager template.

## Assign a public IP per node for your node pools

AKS nodes don't require their own public IP addresses for communication. However, scenarios may require nodes in a node pool to receive their own dedicated public IP addresses. A common scenario is for gaming workloads, where a console needs to make a direct connection to a cloud virtual machine to minimize hops. This scenario can be achieved on AKS by using Node Public IP.

First, create a new resource group.

```azurecli-interactive
az group create --name myResourceGroup2 --location eastus
```

Create a new AKS cluster and attach a public IP for your nodes. Each of the nodes in the node pool receives a unique public IP. You can verify this by looking at the Virtual Machine Scale Set instances.

```azurecli-interactive
az aks create -g MyResourceGroup2 -n MyManagedCluster -l eastus  --enable-node-public-ip
```

For existing AKS clusters, you can also add a new node pool, and attach a public IP for your nodes.

```azurecli-interactive
az aks nodepool add -g MyResourceGroup2 --cluster-name MyManagedCluster -n nodepool2 --enable-node-public-ip
```

### Use a public IP prefix

There are a number of [benefits to using a public IP prefix][public-ip-prefix-benefits]. AKS supports using addresses from an existing public IP prefix for your nodes by passing the resource ID with the flag `node-public-ip-prefix` when creating a new cluster or adding a node pool.

First, create a public IP prefix using [az network public-ip prefix create][az-public-ip-prefix-create]:

```azurecli-interactive
az network public-ip prefix create --length 28 --location eastus --name MyPublicIPPrefix --resource-group MyResourceGroup3
```

View the output, and take note of the `id` for the prefix:

```output
{
  ...
  "id": "/subscriptions/<subscription-id>/resourceGroups/myResourceGroup3/providers/Microsoft.Network/publicIPPrefixes/MyPublicIPPrefix",
  ...
}
```

Finally, when creating a new cluster or adding a new node pool, use the flag `node-public-ip-prefix` and pass in the prefix's resource ID:

```azurecli-interactive
az aks create -g MyResourceGroup3 -n MyManagedCluster -l eastus --enable-node-public-ip --node-public-ip-prefix /subscriptions/<subscription-id>/resourcegroups/MyResourceGroup3/providers/Microsoft.Network/publicIPPrefixes/MyPublicIPPrefix
```

### Locate public IPs for nodes

You can locate the public IPs for your nodes in various ways:

* Use the Azure CLI command [az vmss list-instance-public-ips][az-list-ips].
* Use [PowerShell or Bash commands][vmss-commands]. 
* You can also view the public IPs in the Azure portal by viewing the instances in the Virtual Machine Scale Set.

> [!Important]
> The [node resource group][node-resource-group] contains the nodes and their public IPs. Use the node resource group when executing commands to find the public IPs for your nodes.

```azurecli
az vmss list-instance-public-ips -g MC_MyResourceGroup2_MyManagedCluster_eastus -n YourVirtualMachineScaleSetName
```

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

You can also delete the additional cluster you created for the public IP for node pools scenario.

```azurecli-interactive
az group delete --name myResourceGroup2 --yes --no-wait
```

## Next steps

* Learn more about [system node pools][use-system-pool].

* In this article, you learned how to create and manage multiple node pools in an AKS cluster. For more information about how to control pods across node pools, see [Best practices for advanced scheduler features in AKS][operator-best-practices-advanced-scheduler].

* To create and use Windows Server container node pools, see [Create a Windows Server container in AKS][aks-quickstart-windows-cli].

* Use [proximity placement groups][reduce-latency-ppg] to reduce latency for your AKS applications.

<!-- EXTERNAL LINKS -->

[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-taint]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#taint
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubernetes-labels]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
[kubernetes-label-syntax]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set
[capacity-reservation-groups]:/azure/virtual-machines/capacity-reservation-associate-virtual-machine-scale-set

<!-- INTERNAL LINKS -->
[arm-sku-vm1]: ../virtual-machines/dpsv5-dpdsv5-series.md
[arm-sku-vm2]: ../virtual-machines/dplsv5-dpldsv5-series.md
[arm-sku-vm3]: ../virtual-machines/epsv5-epdsv5-series.md
[aks-quickstart-windows-cli]: ./learn/quick-windows-container-deploy-cli.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az_aks_nodepool_list
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az_aks_nodepool_update
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az_aks_nodepool_upgrade
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool#az_aks_nodepool_scale
[az-aks-nodepool-delete]: /cli/azure/aks/nodepool#az_aks_nodepool_delete
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[az-deployment-group-create]: /cli/azure/deployment/group#az_deployment_group_create
[az-aks-nodepool-add]: /cli/azure/aks#az_aks_nodepool_add
[enable-fips-nodes]: enable-fips-nodes.md
[gpu-cluster]: gpu-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[quotas-skus-regions]: quotas-skus-regions.md
[supported-versions]: supported-kubernetes-versions.md
[tag-limitation]: ../azure-resource-manager/management/tag-resources.md
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[vm-sizes]: ../virtual-machines/sizes.md
[use-system-pool]: use-system-pools.md
[node-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[vmss-commands]: ../virtual-machine-scale-sets/virtual-machine-scale-sets-networking.md#public-ipv4-per-virtual-machine
[az-list-ips]: /cli/azure/vmss#az_vmss_list_instance_public_ips
[reduce-latency-ppg]: reduce-latency-ppg.md
[public-ip-prefix-benefits]: ../virtual-network/ip-services/public-ip-address-prefix.md
[az-public-ip-prefix-create]: /cli/azure/network/public-ip/prefix#az_network_public_ip_prefix_create
[node-image-upgrade]: node-image-upgrade.md
[use-tags]: use-tags.md
[use-labels]: use-labels.md
[cordon-and-drain]: resize-node-pool.md#cordon-the-existing-nodes
[internal-lb-different-subnet]: internal-lb.md#specify-a-different-subnet
