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

## Provisioners
Node autoprovision will use a list of VM SKUs as a starting point to decide which of those will be the best suited for the workloads that are in a pending state (ready to be provisioned on nodes).  Having control over what SKU you want in the initial pool allows you to specify specific SKU families, or VM types as well as the maximum amount of resources a provisioner will ever deploy.

If you have specific VM SKUs that are reserved instances for example, you may wish to only use those as the starting pool of VM types to choose from.

You can have multiple provisioners in a cluster, but AKS will deploy a default provisioner for you which you can modify.

```yaml
apiVersion: karpenter.sh/v1alpha5
kind: Provisioner
metadata:
  name: default
spec:
  # References cloud provider-specific custom resource, see your cloud provider specific documentation
  providerRef:
    name: default

  # Provisioned nodes will have these taints
  # Taints may prevent pods from scheduling if they are not tolerated by the pod.
  taints:
    - key: example.com/special-taint
      effect: NoSchedule

  # Provisioned nodes will have these taints, but pods do not need to tolerate these taints to be provisioned by this
  # provisioner. These taints are expected to be temporary and some other entity (e.g. a DaemonSet) is responsible for
  # removing the taint after it has finished initializing the node.
  startupTaints:
    - key: example.com/another-taint
      effect: NoSchedule

  # Labels are arbitrary key-values that are applied to all nodes
  labels:
    billing-team: my-team

  # Annotations are arbitrary key-values that are applied to all nodes
  annotations:
    example.com/owner: "my-team"

  # Requirements that constrain the parameters of provisioned nodes.
  # These requirements are combined with pod.spec.affinity.nodeAffinity rules.
  # Operators { In, NotIn, Exists, DoesNotExist, Gt, and Lt } are supported.
  # https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#operators
  requirements:
    - key: "kubernetes.azure.com/instance-family"
      operator: In
      values: ["c", "m", "r"]
    - key: "kubernetes.azure.com/instance-cpu"
      operator: In
      values: ["4", "8", "16", "32"]
    - key: "topology.kubernetes.io/zone"
      operator: In
      values: ["1", "2"]
    - key: "karpenter.sh/capacity-type" # If not included, default to on-demand
      operator: In
      values: ["spot", "on-demand"]

  # Resource limits constrain the total size of the cluster.
  # Limits prevent Karpenter from creating new instances once the limit is exceeded.
  limits:
    resources:
      cpu: "1000"
      memory: 1000Gi

  # Enables consolidation which attempts to reduce cluster cost by both removing un-needed nodes and down-sizing those
  # that can't be removed.  Mutually exclusive with the ttlSecondsAfterEmpty parameter.
  consolidation:
    enabled: true

  # If omitted, the feature is disabled and nodes will never expire.  If set to less time than it requires for a node
  # to become ready, the node may expire before any pods successfully start.
  ttlSecondsUntilExpired: 2592000 # 30 Days = 60 * 60 * 24 * 30 Seconds;

  # If omitted, the feature is disabled, nodes will never scale down due to low utilization
  ttlSecondsAfterEmpty: 30

  # Priority given to the provisioner when the scheduler considers which provisioner
  # to select. Higher weights indicate higher priority when comparing provisioners.
  # Specifying no weight is equivalent to specifying a weight of 0.
  weight: 10
```


### Supported node provisioner requirements 

#### SKU selections 

|  Selector | Description | Example |
---|---|---|
| karpenter.k8s.azure/sku-series |  VM SKU Series / version | DSv3 |
| karpenter.k8s.azure/sku-name | Explicit SKU name | Standard_A1_v2 |
| karpenter.sh/capacity-type | VM allocation type (Spot / On Demand) | spot or on-demand |
| karpenter.k8s.azure/sku-cpu | Minimum number of CPUs in VM | 16 |
| karpenter.k8s.azure/sku-memory | Minimum memory in VM in Mb | 131072 |
| karpenter.k8s.azure/sku-gpu-count | Minimum GPU count per VM | 2 |
| karpenter.k8s.azure/sku-gpu-memory | Minimum GPU memory per VM | 64 |



Constraints

B series not on by default, must be explicit

Default to Ephemeral


[add-ons]: integrations.md#add-ons