---
title: Manage node pools in Azure Kubernetes Service (AKS)
description: Learn how to manage node pools for a cluster in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: event-tier1-build-2022, ignite-2022, devx-track-azurecli, build-2023
ms.date: 07/19/2023
---

# Manage node pools for a cluster in Azure Kubernetes Service (AKS)

In Azure Kubernetes Service (AKS), nodes of the same configuration are grouped together into *node pools*. These node pools contain the underlying VMs that run your applications. When you create an AKS cluster, you define the initial number of nodes and their size (SKU). As application demands change, you may need to change the settings on your node pools. For example, you may need to scale the number of nodes in a node pool or upgrade the Kubernetes version of a node pool.

This article shows you how to manage one or more node pools in an AKS cluster.

## Before you begin

* Review [Create node pools for a cluster in Azure Kubernetes Service (AKS)][create-node-pools] to learn how to create node pools for your AKS clusters.
* You need the Azure CLI version 2.2.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Review [Storage options for applications in Azure Kubernetes Service][aks-storage-concepts] to plan your storage configuration.

## Limitations

The following limitations apply when you create and manage AKS clusters that support multiple node pools:

* See [Quotas, virtual machine size restrictions, and region availability in Azure Kubernetes Service (AKS)][quotas-skus-regions].
* [System pools][use-system-pool] must contain at least one node, and user node pools may contain zero or more nodes.
* You can't change the VM size of a node pool after you create it.
* When you create multiple node pools at cluster creation time, all Kubernetes versions used by node pools must match the version set for the control plane. You can make updates after provisioning the cluster using per node pool operations.
* You can't simultaneously run upgrade and scale operations on a cluster or node pool. If you attempt to run them at the same time, you receive an error. Each operation type must complete on the target resource prior to the next request on that same resource. For more information, see the [troubleshooting guide](./troubleshooting.md#im-receiving-errors-when-trying-to-upgrade-or-scale-that-state-my-cluster-is-being-upgraded-or-has-failed-upgrade).

## Upgrade a single node pool

> [!NOTE]
> The node pool OS image version is tied to the Kubernetes version of the cluster. You only get OS image upgrades, following a cluster upgrade.

In this example, we upgrade the *mynodepool* node pool. Since there are two node pools, we must use the [`az aks nodepool upgrade`][az-aks-nodepool-upgrade] command to upgrade.

1. Check for any available upgrades using the [`az aks get-upgrades`][az-aks-get-upgrades] command.

    ```azurecli-interactive
    az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster
    ```

2. Upgrade the *mynodepool* node pool using the [`az aks nodepool upgrade`][az-aks-nodepool-upgrade] command.

    ```azurecli-interactive
    az aks nodepool upgrade \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name mynodepool \
        --kubernetes-version KUBERNETES_VERSION \
        --no-wait
    ```

3. List the status of your node pools using the [`az aks nodepool list`][az-aks-nodepool-list] command.

    ```azurecli-interactive
    az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
    ```

     The following example output shows *mynodepool* is in the *Upgrading* state:

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

As a best practice, you should upgrade all node pools in an AKS cluster to the same Kubernetes version. The default behavior of [`az aks upgrade`][az-aks-upgrade] is to upgrade all node pools together with the control plane to achieve this alignment. The ability to upgrade individual node pools lets you perform a rolling upgrade and schedule pods between node pools to maintain application uptime within the above constraints mentioned.

## Upgrade a cluster control plane with multiple node pools

> [!NOTE]
> Kubernetes uses the standard [Semantic Versioning](https://semver.org/) versioning scheme. The version number is expressed as *x.y.z*, where *x* is the major version, *y* is the minor version, and *z* is the patch version. For example, in version *1.12.6*, 1 is the major version, 12 is the minor version, and 6 is the patch version. The Kubernetes version of the control plane and the initial node pool are set during cluster creation. Other node pools have their Kubernetes version set when they are added to the cluster. The Kubernetes versions may differ between node pools and between a node pool and the control plane.

An AKS cluster has two cluster resource objects with Kubernetes versions associated to them:

1. The cluster control plane Kubernetes version, and
2. A node pool with a Kubernetes version.

The control plane maps to one or many node pools. The behavior of an upgrade operation depends on which Azure CLI command you use.

* [`az aks upgrade`][az-aks-upgrade] upgrades the control plane and all node pools in the cluster to the same Kubernetes version.
* [`az aks upgrade`][az-aks-upgrade] with the `--control-plane-only` flag upgrades only the cluster control plane and leaves all node pools unchanged.
* [`az aks nodepool upgrade`][az-aks-nodepool-upgrade] upgrades only the target node pool with the specified Kubernetes version.

### Validation rules for upgrades

Kubernetes upgrades for a cluster control plane and node pools are validated using the following sets of rules:

* **Rules for valid versions to upgrade node pools**:
  * The node pool version must have the same *major* version as the control plane.
  * The node pool *minor* version must be within two *minor* versions of the control plane version.
  * The node pool version can't be greater than the control `major.minor.patch` version.

* **Rules for submitting an upgrade operation**:
  * You can't downgrade the control plane or a node pool Kubernetes version.
  * If a node pool Kubernetes version isn't specified, the behavior depends on the client. In Resource Manager templates, declaration falls back to the existing version defined for the node pool. If nothing is set, it uses the control plane version to fall back on.
  * You can't simultaneously submit multiple operations on a single control plane or node pool resource. You can either upgrade or scale a control plane or a node pool at a given time.

## Scale a node pool manually

As your application workload demands change, you may need to scale the number of nodes in a node pool. The number of nodes can be scaled up or down.

1. Scale the number of nodes in a node pool using the [`az aks node pool scale`][az-aks-nodepool-scale] command.

    ```azurecli-interactive
    az aks nodepool scale \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name mynodepool \
        --node-count 5 \
        --no-wait
    ```

2. List the status of your node pools using the [`az aks node pool list`][az-aks-nodepool-list] command.

    ```azurecli-interactive
    az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
    ```

     The following example output shows *mynodepool* is in the *Scaling* state with a new count of five nodes:

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

## Scale a specific node pool automatically using the cluster autoscaler

AKS offers a separate feature to automatically scale node pools with a feature called the [cluster autoscaler](cluster-autoscaler.md). You can enable this feature with unique minimum and maximum scale counts per node pool.

For more information, see [use the cluster autoscaler](cluster-autoscaler.md#use-the-cluster-autoscaler-on-multiple-node-pools).

## Associate capacity reservation groups to node pools (preview)

As your workload demands change, you can associate existing capacity reservation groups to node pools to guarantee allocated capacity for your node pools.  

For more information, see [capacity reservation groups][capacity-reservation-groups].

### Register preview feature

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the `aks-preview` extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

3. Register the `CapacityReservationGroupPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "CapacityReservationGroupPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

4. Verify the registration status using the [`az feature show][az-feature-show`] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "CapacityReservationGroupPreview"
    ```

5. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

### Manage capacity reservations

> [!NOTE]
> The capacity reservation group should already exist, otherwise the node pool is added to the cluster with a warning and no capacity reservation group gets associated.

#### Associate an existing capacity reservation group to a node pool

* Associate an existing capacity reservation group to a node pool using the [`az aks nodepool add`][az-aks-nodepool-add] command and specify a capacity reservation group with the `--capacityReservationGroup` flag.

    ```azurecli-interactive
    az aks nodepool add -g MyRG --cluster-name MyMC -n myAP --capacityReservationGroup myCRG
    ```

#### Associate an existing capacity reservation group to a system node pool

* Associate an existing capacity reservation group to a system node pool using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create -g MyRG --cluster-name MyMC --capacityReservationGroup myCRG
    ```

> [!NOTE]
> Deleting a node pool implicitly dissociates that node pool from any associated capacity reservation group before the node pool is deleted. Deleting a cluster implicitly dissociates all node pools in that cluster from their associated capacity reservation groups.

## Specify a VM size for a node pool

You may need to create node pools with different VM sizes and capabilities. For example, you may create a node pool that contains nodes with large amounts of CPU or memory or a node pool that provides GPU support. In the next section, you [use taints and tolerations](#set-node-pool-taints) to tell the Kubernetes scheduler how to limit access to pods that can run on these nodes.

In the following example, we create a GPU-based node pool that uses the *Standard_NC6s_v3* VM size. These VMs are powered by the NVIDIA Tesla K80 card. For information, see [Available sizes for Linux virtual machines in Azure][vm-sizes].

1. Create a node pool using the [`az aks node pool add`][az-aks-nodepool-add] command. Specify the name *gpunodepool* and use the `--node-vm-size` parameter to specify the *Standard_NC6* size.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name gpunodepool \
        --node-count 1 \
        --node-vm-size Standard_NC6s_v3 \
        --no-wait
    ```

2. Check the status of the node pool using the [`az aks nodepool list`][az-aks-nodepool-list] command.

    ```azurecli-interactive
    az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
    ```

    The following example output shows the *gpunodepool* node pool is *Creating* nodes with the specified *VmSize*:

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
        "vmSize": "Standard_NC6s_v3",
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

When creating a node pool, you can add taints, labels, or tags to it. When you add a taint, label, or tag, all nodes within that node pool also get that taint, label, or tag.

> [!IMPORTANT]
> Adding taints, labels, or tags to nodes should be done for the entire node pool using `az aks nodepool`. We don't recommend using `kubectl` to apply taints, labels, or tags to individual nodes in a node pool.

### Set node pool taints

1. Create a node pool with a taint using the [`az aks nodepool add`][az-aks-nodepool-add] command. Specify the name *taintnp* and use the `--node-taints` parameter to specify *sku=gpu:NoSchedule* for the taint.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name taintnp \
        --node-count 1 \
        --node-taints sku=gpu:NoSchedule \
        --no-wait
    ```

2. Check the status of the node pool using the [`az aks nodepool list`][az-aks-nodepool-list] command.

    ```azurecli-interactive
    az aks nodepool list -g myResourceGroup --cluster-name myAKSCluster
    ```

    The following example output shows that the *taintnp* node pool is *Creating* nodes with the specified *nodeTaints*:

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

### Set node pool tolerations

In the previous step, you applied the *sku=gpu:NoSchedule* taint when creating your node pool. The following example YAML manifest uses a toleration to allow the Kubernetes scheduler to run an NGINX pod on a node in that node pool.

1. Create a file named `nginx-toleration.yaml` and copy in the following example YAML.

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

2. Schedule the pod using the `kubectl apply` command.

    ```azurecli-interactive
    kubectl apply -f nginx-toleration.yaml
    ```

    It takes a few seconds to schedule the pod and pull the NGINX image.

3. Check the status using the [`kubectl describe pod`][kubectl-describe] command.

    ```azurecli-interactive
    kubectl describe pod mypod
    ```

    The following condensed example output shows the *sku=gpu:NoSchedule* toleration is applied. In the events section, the scheduler assigned the pod to the *aks-taintnp-28993262-vmss000000* node:

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

    Only pods that have this toleration applied can be scheduled on nodes in *taintnp*. Any other pods are scheduled in the *nodepool1* node pool. If you create more node pools, you can use taints and tolerations to limit what pods can be scheduled on those node resources.

### Setting node pool labels

For more information, see [Use labels in an Azure Kubernetes Service (AKS) cluster][use-labels].

### Setting node pool Azure tags

For more information, see [Use Azure tags in Azure Kubernetes Service (AKS)][use-tags].

## Manage node pools using a Resource Manager template

When you use an Azure Resource Manager template to create and manage resources, you can change settings in your template and redeploy it to update resources. With AKS node pools, you can't update the initial node pool profile once the AKS cluster has been created. This behavior means you can't update an existing Resource Manager template, make a change to the node pools, and then redeploy the template. Instead, you must create a separate Resource Manager template that updates the node pools for the existing AKS cluster.

1. Create a template, such as `aks-agentpools.json`, and paste in the following example manifest. Make sure to edit the values as needed. This example template configures the following settings:

   * Updates the *Linux* node pool named *myagentpool* to run three nodes.
   * Sets the nodes in the node pool to run Kubernetes version *1.15.7*.
   * Defines the node size as *Standard_DS2_v2*.

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

2. Deploy the template using the [`az deployment group create`][az-deployment-group-create] command.

    ```azurecli-interactive
    az deployment group create \
        --resource-group myResourceGroup \
        --template-file aks-agentpools.json
    ```

    > [!TIP]
    > You can add a tag to your node pool by adding the *tag* property in the template, as shown in the following example:
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

## Next steps

* For more information about how to control pods across node pools, see [Best practices for advanced scheduler features in AKS][operator-best-practices-advanced-scheduler].
* Use [proximity placement groups][reduce-latency-ppg] to reduce latency for your AKS applications.
* Use [instance-level public IP addresses](use-node-public-ips.md) to enable your nodes to directly serve traffic.

<!-- EXTERNAL LINKS -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[capacity-reservation-groups]:/azure/virtual-machines/capacity-reservation-associate-virtual-machine-scale-set

<!-- INTERNAL LINKS -->
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
[aks-storage-concepts]: concepts-storage.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az_aks_nodepool_list
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az_aks_nodepool_upgrade
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool#az_aks_nodepool_scale
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-deployment-group-create]: /cli/azure/deployment/group#az_deployment_group_create
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[quotas-skus-regions]: quotas-skus-regions.md
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[vm-sizes]: ../virtual-machines/sizes.md
[use-system-pool]: use-system-pools.md
[reduce-latency-ppg]: reduce-latency-ppg.md
[use-tags]: use-tags.md
[use-labels]: use-labels.md
[cordon-and-drain]: resize-node-pool.md#cordon-the-existing-nodes
[internal-lb-different-subnet]: internal-lb.md#specify-a-different-subnet
[drain-nodes]: resize-node-pool.md#drain-the-existing-nodes
[create-node-pools]: create-node-pools.md
[use-labels]: use-labels.md
[use-tags]: use-tags.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
