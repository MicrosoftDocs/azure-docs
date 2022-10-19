---
title: Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with Azure CNI Powered by Cilium.
services: container-service
ms.topic: article
ms.custom: references_regions
ms.date: 10/24/2022
---

# Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)

Azure CNI powered by Cilium combines the robust control plane of Azure CNI with the dataplane of [Cilium](https://cilium.io/) to provide high-performance networking and security.

## Network Policy Enforcement

Cilium enforces [network policies to allow or deny traffic between pods](./operator-best-practices-network.md#control-traffic-flow-with-network-policies). With Cilium, you do not need to install a separate network policy engine such as Azure NPM or Calico.

## Limitations

Azure CNI powered by Cilium currently has the following limitations:

* Can be enabled only for new clusters.
* Available only for Linux and not for Windows.
* Cilium L7 policy enforcement is disabled.
* Hubble is disabled.
* Kubernetes services with `internalTrafficPolicy=Local` are not supported ([Cilium issue #17796](https://github.com/cilium/cilium/issues/17796)).
* Multiple Kubernetes services cannot use the same host port with different protocols (e.g. TCP or UDP) ([Cilium issue #14287](https://github.com/cilium/cilium/issues/14287)).
* Network policies may be enforced on reply packets when a pod connects to itself via service cluster IP ([Cilium issue #19406](https://github.com/cilium/cilium/issues/19406)).

> [!NOTE]
> - Azure CNI Powered by Cilium is currently only available in the following regions: TODO

## Before you begin

1. [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
2. Install the aks-preview extension by running `az extension add --name aks-preview`
3. Check the version of Azure CLI by running `az --version`.
    * azure-cli must have version 2.41.0 or later. You can upgrade to the latest version by running `az upgrade`.
    * aks-preview extension should be installed and must be version 0.5.109 or later. You can upgrade the extension by running `az extension update --name aks-preview`
4. Enable the feature by running:
```azurecli-interactive
az feature register --namespace Microsoft.ContainerService --name CiliumDataplanePreview
```

## Steps to Create an AKS Cluster with Azure CNI Powered by Cilium

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

First, decide whether to assign IP addresses from a VNet or from an overlay network. If you aren't sure, read ["Choosing a network model to use"](./azure-cni-overlay.md#choosing-a-network-model-to-use).

### Option 1: Assign IP addresses from a VNet

Run these commands to create a resource group and VNet with a subnet for nodes and a subnet for pods:

```azurecli-interactive
resourceGroup="myResourceGroup"
vnet="myVirtualNetwork"
location="westcentralus"

# Create the resource group
az group create --name $resourceGroup --location $location

# Create a VNet with a subnet for nodes and a subnet for pods
az network vnet create -g $resourceGroup --location $location --name $vnet --address-prefixes 10.0.0.0/8 -o none 
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name nodesubnet --address-prefixes 10.240.0.0/16 -o none 
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name podsubnet --address-prefixes 10.241.0.0/16 -o none 
```

Then create the cluster using `--enable-cilium-dataplane`:

```azurecli-interactive
clusterName="myAKSCluster"
subscription="aaaaaaa-aaaaa-aaaaaa-aaaa"

az aks create -n $clusterName -g $resourceGroup -l $location \
  --max-pods 250 \
  --node-count 2 \
  --network-plugin azure \
  --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/nodesubnet \
  --pod-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/podsubnet \
  --enable-cilium-dataplane
```

### Option 2: Assign IP addresses from an overlay network

Run these commands to create a resource group and VNet with a single subnet:

```azurecli-interactive
resourceGroup="myResourceGroup"
vnet="myVirtualNetwork"
location="westcentralus"

# Create the resource group
az group create --name $resourceGroup --location $location

# Create a VNet and a subnet for nodes 
az network vnet create -g $resourceGroup --location $location --name $vnet --address-prefixes 10.0.0.0/8 -o none
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name nodesubnet --address-prefix 10.10.0.0/16 -o none
```

Then create the cluster using `--enable-cilium-dataplane`:

```azurecli-interactive
clusterName="myAKSCluster"
subscription="aaaaaaa-aaaaa-aaaaaa-aaaa"

az aks create -n $clusterName -g $resourceGroup --location $location \
  --network-plugin azure \
  --network-plugin-mode overlay \
  --pod-cidr 192.168.0.0/16 \
  --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/nodesubnet \
  --enable-cilium-dataplane
```

## Frequently asked questions

1. *Can I enable Cilium in an existing (already deployed) cluster?*

    No, Cilium can be enabled only when creating a new cluster.

2. *Do I need to specify `--network-policy` when creating a cluster?*

    Cilium enforces network policies, so you do not need to specify a separate network policy engine.

3. *Can I customize Cilium configuration?*

    No, the Cilium configuration is managed by AKS cannot be modified. We recommend that customers who require additional control use [AKS BYO CNI](./use-byo-cni.md) and install Cilium manually.

4. *Can I enable Hubble?*

    No, it is not currently possible to enable Hubble.

5. *Can I use `CiliumNetworkPolicy` custom resources instead of Kubernetes `NetworkPolicy` resources?*

    `CiliumNetworkPolicy` custom resources are not officially supported. We recommend that customers use Kubernetes `NetworkPolicy` resources to configure network policies.
