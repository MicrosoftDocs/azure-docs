---
title: Node autoprovisioning (Preview)
description: Learn about Azure Kubernetes Service (AKS) Node autoprovisioning
ms.topic: article
ms.date: 10/19/2023
ms.author: juda
#Customer intent: As a cluster operator or developer, how to scale my cluster based on workload requirements and right size my nodes automatically
---

# Node autoprovision
When deploying workloads onto AKS, you need to make a decision about the node pool configuration regarding the VM size needed.  As your workloads become more complex, and require different CPU, Memory and capabilities to run, the overhead of having to design your VM configuration for numerous resource requests becomes difficult.

Node autoprovision (NAP) decides based on pending pod resource requirements the optimal VM configuration to run those workloads in the most efficient and cost effective manner.


## Before you begin

- You need an Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- You need the [Azure CLI installed](/cli/azure/install-azure-cli).
- [Install the `aks-preview` Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
- [Register the NodeAutoProvisioningPreviewfeature flag](#register-the-aks-nodeautoprovisioning-feature-flag).

### Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the `aks-preview` extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the `aks-preview` extension using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Register the `NodeAutoProvisioningPreview` feature flag

1. Register the `NodeAutoProvisioningPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "NodeAutoProvisioningPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "NodeAutoProvisioningPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```


## Enable Node autoprovision
To enable node autoprovision, you need to use overlay networking and the cilium network policy.

```azure-cli
az aks create --name karpuktest --resource-group karpuk --node-provisioning-mode Auto --network-plugin azure --network-plugin-mode overlay --network-dataplane cilium

```

## Node Pools
Node autoprovision uses a list of VM SKUs as a starting point to decide which is best suited for the workloads that are in a pending state.  Having control over what SKU you want in the initial pool allows you to specify specific SKU families, or VM types as well as the maximum amount of resources a provisioner will use.

If you have specific VM SKUs that are reserved instances for example, you may wish to only use those as the starting pool of VM types to choose from.

You can have multiple node pool definitions in a cluster, but AKS will deploy a default provisioner for you that you can modify:


```yaml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: general-purpose
spec:
  disruption:
    consolidationPolicy: WhenUnderutilized
    expireAfter: Never
  template:
    spec:
      nodeClassRef:
        name: default

      # Requirements that constrain the parameters of provisioned nodes.
      # These requirements are combined with pod.spec.affinity.nodeAffinity rules.
      # Operators { In, NotIn, Exists, DoesNotExist, Gt, and Lt } are supported.
      # https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#operators
      requirements:
      - key: kubernetes.io/arch
        operator: In
        values:
        - amd64
      - key: kubernetes.io/os
        operator: In
        values:
        - linux
      - key: karpenter.sh/capacity-type
        operator: In
        values:
        - on-demand
      - key: karpenter.azure.com/sku-family
        operator: In
        values:
        - D
```

### Supported node provisioner requirements 

#### SKU selectors with well known labels 

|  Selector | Description | Example |
---|---|---|
| karpenter.k8s.azure/sku-series |  VM SKU Series / version | DSv3 |
| karpenter.k8s.azure/sku-name | Explicit SKU name | Standard_A1_v2 |
| karpenter.sh/capacity-type | VM allocation type (Spot / On Demand) | spot or on-demand |
| karpenter.k8s.azure/sku-cpu | Minimum number of CPUs in VM | 16 |
| karpenter.k8s.azure/sku-memory | Minimum memory in VM in Mb | 131072 |
| karpenter.k8s.azure/sku-gpu-count | Minimum GPU count per VM | 2 |
| karpenter.k8s.azure/sku-gpu-memory | Minimum GPU memory per VM | 64 |
| topology.kubernetes.io/zone | The Availability Zone(s)         | [1,2,3]  | 
| kubernetes.io/os    | Operating System (Linux only during preview)                                           | linux       |                    
| kubernetes.io/arch    | CPU architecture (AMD64 or ARM64)                                         | [amd64, arm64]       |
                     


## Nodepool limits
By default, NAP will attempt to schedule your workloads within the Azure quota you have available.  You can also specify the upper limit of resources that can be used by a Nodepool by specifying limits within the Nodepool spec. 

```
  # Resource limits constrain the total size of the cluster.
  # Limits prevent Karpenter from creating new instances once the limit is exceeded.
  limits:
    cpu: "1000"
    memory: 1000Gi
```


## Nodepool weights
When you have multiple Nodepools defined, it is possible to set a preference of where a workload should be scheduled.  This can be accomplished by setting a relative weight on your Nodepool definitions.

```
  # Priority given to the NodePool when the scheduler considers which NodePool
  # to select. Higher weights indicate higher priority when comparing NodePools.
  # Specifying no weight is equivalent to specifying a weight of 0.
  weight: 10
```

## Kubernetes and Node image updates 
AKS with Node autoprovisionin manages the Kubernetes version upgrades as well as VM OS disk updates for you by default.

### Kubernetes upgrades
Kubernetes upgrades for NAP node pools will be dictated by the Control Plane Kubernetes version.  If you perform a cluster upgrade, your NAP nodes will be updated automatically to follow the same versioning.

### Node image updates
By default NAP node pool virtual machines will be automatically updated when a new image is available.  If you wish to pin a node pool at a certain node image version, you can set the imageVersion on the node class:

```kubectl
kubectl edit aksnodeclass default
```

Within the node class definition, set the imageVersion to one of the published releases listed on the [AKS Release notes](release-notes).

The imageVersion is the date portion on the Node Image as only Ubuntu 22.04 is supported; for example "AKSUbuntu-2204-202311.07.0" would be "202311.07.0"

```
apiVersion: karpenter.azure.com/v1alpha2
kind: AKSNodeClass
metadata:
  annotations:
    kubernetes.io/description: General purpose AKSNodeClass for running Ubuntu2204
      nodes
    meta.helm.sh/release-name: aks-managed-karpenter-overlay
    meta.helm.sh/release-namespace: kube-system
  creationTimestamp: "2023-11-16T23:59:06Z"
  generation: 1
  labels:
    app.kubernetes.io/managed-by: Helm
    helm.toolkit.fluxcd.io/name: karpenter-overlay-main-adapter-helmrelease
    helm.toolkit.fluxcd.io/namespace: 6556abcb92c4ce0001202e78
  name: default
  resourceVersion: "1792"
  uid: 929a5b07-558f-4649-b78b-eb25e9b97076
spec:
  imageFamily: Ubuntu2204
  imageVersion: 202311.07.0
  osDiskSizeGB: 128
  ```

Removing the imageVersion spec would revert the node pool to be updated to the latest node image version.


## Node disruption

When the workloads on your nodes scale down, or are removed, Node autoprovisioning will use disruption rules on the Nodepool specification to decide when and how to remove those nodes and potentially re-schedule your workloads to be more efficient.

You can remove a node manually using ```kubectl delete node```, but NAP can also control when it should optimise your nodes.


```
  disruption:
    # Describes which types of Nodes NAP should consider for consolidation
    consolidationPolicy: WhenUnderutilized | WhenEmpty
    # 'WhenUnderutilized', NAP will consider all nodes for consolidation and attempt to remove or replace Nodes when it discovers that the Node is underutilized and could be changed to reduce cost

    #  `WhenEmpty`, NAP will only consider nodes for consolidation that contain no workload pods
    
    # The amount of time NAP should wait after discovering a consolidation decision
    # This value can currently only be set when the consolidationPolicy is 'WhenEmpty'
    # You can choose to disable consolidation entirely by setting the string value 'Never'

    consolidateAfter: 30s
    
    # The amount of time a Node can live on the cluster before being removed
    # Avoiding long-running Nodes helps to reduce security vulnerabilities by forcing a node image update as well as to reduce the chance of issues that can affect Nodes with long uptimes such as file fragmentation or memory leaks from processes
    # You can choose to disable expiration entirely by setting the string value 'Never'
    expireAfter: 720h

```

## Monitoring selection events 
Node autoprovision produces cluster events that can be used to monitor deployment and scheduling decisions being made.  You can list these using the Kubernetes events stream.

```
kubectl get events -A --field-selector source=karpenter -w
```

## Limitations
* NAP is not available in  WestUS, WestUS2, EastUS, EastUS2, SouthCentralUS regions.
* Windows and Azure Linux Nodepools are not supported


[release-notes]: https://github.com/Azure/AKS/blob/master/CHANGELOG.md