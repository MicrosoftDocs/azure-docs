---
title: Node autoprovision (Preview)
description: Learn about Azure Kubernetes Service (AKS) Node autoprovision
ms.topic: article
ms.date: 10/19/2023
ms.author: juda
#Customer intent: As a cluster operator or developer, how to scale my cluster based on workload requirements and right size my nodes automatically
---

# Node autoprovision
When deploying workloads onto AKS, you need to make a decision about the nodepool configuration regarding the VM size needed.  As your workloads become more complex, and require different CPU, Memory and capabilities to run, the overhead of having to design your VM configuration for numerous resource requests becomes difficult.

Node autoprovision (NAP) will decide based on pending pod resource requirements the optimal VM configuration to run those workloads in the most efficient and cost effective manner.


## Before you begin

- You need an Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- You need the [Azure CLI installed](/cli/azure/install-azure-cli).
- [Install the `aks-preview` Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
- [Register the `NodeAutoprovision` feature flag](#register-the-aks-kedapreview-feature-flag).

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
To enable node autoprovision, you will need to use overlay networking and the cilium network policy.

```azure-cli
az aks create --name karpuktest --resource-group karpuk --node-provisioning-mode Auto --network-plugin azure --network-plugin-mode overlay --network-dataplane cilium

```

## Node Pools
Node autoprovision will use a list of VM SKUs as a starting point to decide which of those will be the best suited for the workloads that are in a pending state (ready to be provisioned on nodes).  Having control over what SKU you want in the initial pool allows you to specify specific SKU families, or VM types as well as the maximum amount of resources a provisioner will ever deploy.

If you have specific VM SKUs that are reserved instances for example, you may wish to only use those as the starting pool of VM types to choose from.

You can have multiple  in a cluster, but AKS will deploy a default provisioner for you which you can modify:


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
| kubernetes.io/arch    | CPU architecture (AMD64 during preview)                                         | amd64       |
                     



[add-ons]: integrations.md#add-ons