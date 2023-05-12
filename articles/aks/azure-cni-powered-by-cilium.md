---
title: Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with Azure CNI Powered by Cilium.
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.topic: article
ms.custom: references_regions, devx-track-azurecli
ms.date: 10/24/2022
---

# Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)

Azure CNI Powered by Cilium combines the robust control plane of Azure CNI with the dataplane of [Cilium](https://cilium.io/) to provide high-performance networking and security. 

By making use of eBPF programs loaded into the Linux kernel and a more efficient API object structure, Azure CNI Powered by Cilium provides the following benefits:

- Functionality equivalent to existing Azure CNI and Azure CNI Overlay plugins
- Faster service routing
- More efficient network policy enforcement
- Better observability of cluster traffic
- Support for larger clusters (more nodes, pods, and services)

## IP Address Management (IPAM) with Azure CNI Powered by Cilium

Azure CNI Powered by Cilium can be deployed using two different methods for assigning pod IPs: 

- assign IP addresses from a VNet (similar to existing Azure CNI with Dynamic Pod IP Assignment)
- assign IP addresses from an overlay network (similar to Azure CNI Overlay mode)

If you aren't sure which option to select, read ["Choosing a network model to use"](./azure-cni-overlay.md#choosing-a-network-model-to-use).

## Network Policy Enforcement

Cilium enforces [network policies to allow or deny traffic between pods](./operator-best-practices-network.md#control-traffic-flow-with-network-policies). With Cilium, you don't need to install a separate network policy engine such as Azure Network Policy Manager or Calico.

## Limitations

Azure CNI powered by Cilium currently has the following limitations:

* Available only for new clusters.
* Available only for Linux and not for Windows.
* Cilium L7 policy enforcement is disabled.
* Hubble is disabled.
* Not compatible with Istio or other sidecar-based service meshes ([Istio issue #27619](https://github.com/istio/istio/issues/27619)).
* Kubernetes services with `internalTrafficPolicy=Local` aren't supported ([Cilium issue #17796](https://github.com/cilium/cilium/issues/17796)).
* Multiple Kubernetes services can't use the same host port with different protocols (for example, TCP or UDP) ([Cilium issue #14287](https://github.com/cilium/cilium/issues/14287)).
* Network policies may be enforced on reply packets when a pod connects to itself via service cluster IP ([Cilium issue #19406](https://github.com/cilium/cilium/issues/19406)).

## Prerequisites

* Azure CLI version 2.41.0 or later. Run `az --version` to see the currently installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* Azure CLI with aks-preview extension 0.5.135 or later.
* If using ARM templates or the REST API, the AKS API version must be 2022-09-02-preview or later.

> [!NOTE]
> Previous AKS API versions (2022-09-02preview to 2023-01-02preview) used the field [`networkProfile.ebpfDataplane=cilium`](https://github.com/Azure/azure-rest-api-specs/blob/06dbe269f7d9c709cc225c92358b38c3c2b74d60/specification/containerservice/resource-manager/Microsoft.ContainerService/aks/preview/2022-09-02-preview/managedClusters.json#L6939-L6955). AKS API versions since 2023-02-02preview use the field [`networkProfile.networkDataplane=cilium`](https://github.com/Azure/azure-rest-api-specs/blob/06dbe269f7d9c709cc225c92358b38c3c2b74d60/specification/containerservice/resource-manager/Microsoft.ContainerService/aks/preview/2023-02-02-preview/managedClusters.json#L7152-L7173) to enable Azure CNI Powered by Cilium.

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

## Register the 'CiliumDataplanePreview' feature flag

Register the `CiliumDataplanePreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "CiliumDataplanePreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "CiliumDataplanePreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create a new AKS Cluster with Azure CNI Powered by Cilium

### Option 1: Assign IP addresses from a VNet

Run the following commands to create a resource group and VNet with a subnet for nodes and a subnet for pods.

```azurecli-interactive
# Create the resource group
az group create --name <resourceGroupName> --location <location>
```

```azurecli-interactive
# Create a VNet with a subnet for nodes and a subnet for pods
az network vnet create -g <resourceGroupName> --location <location> --name <vnetName> --address-prefixes <address prefix, example: 10.0.0.0/8> -o none 
az network vnet subnet create -g <resourceGroupName> --vnet-name <vnetName> --name nodesubnet --address-prefixes <address prefix, example: 10.240.0.0/16> -o none 
az network vnet subnet create -g <resourceGroupName> --vnet-name <vnetName> --name podsubnet --address-prefixes <address prefix, example: 10.241.0.0/16> -o none 
```

Create the cluster using `--network-dataplane cilium`:

```azurecli-interactive
az aks create -n <clusterName> -g <resourceGroupName> -l <location> \
  --max-pods 250 \
  --network-plugin azure \
  --vnet-subnet-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/nodesubnet \
  --pod-subnet-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/podsubnet \
  --network-dataplane cilium
```

> [!NOTE]
> The `--network-dataplane cilium` flag replaces the deprecated `--enable-ebpf-dataplane` flag used in earlier versions of the aks-preview CLI extension.

### Option 2: Assign IP addresses from an overlay network

Run this commands to create a cluster with an overlay network and Cilium. Replace the values for `<clusterName>`, `<resourceGroupName>`, and `<location>`:

```azurecli-interactive
az aks create -n <clusterName> -g <resourceGroupName> -l <location> \
  --network-plugin azure \
  --network-plugin-mode overlay \
  --pod-cidr 192.168.0.0/16 \
  --network-dataplane cilium
```

## Frequently asked questions

- *Can I customize Cilium configuration?*

    No, the Cilium configuration is managed by AKS and can't be modified. We recommend that customers who require more control use [AKS BYO CNI](./use-byo-cni.md) and install Cilium manually.

- *Can I use `CiliumNetworkPolicy` custom resources instead of Kubernetes `NetworkPolicy` resources?*

    `CiliumNetworkPolicy` custom resources aren't officially supported. We recommend that customers use Kubernetes `NetworkPolicy` resources to configure network policies.

- *Does AKS configure CPU or memory limits on the Cilium daemonset?*

    No, AKS does not configure CPU or memory limits on the Cilium daemonset because Cilium is a critical system component for pod networking and network policy enforcement.

## Next steps

Learn more about networking in AKS in the following articles:

* [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)
* [Use an internal load balancer with Azure Container Service (AKS)](internal-lb.md)

* [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
* [Enable the HTTP application routing add-on][aks-http-app-routing]
* [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
* [Create an ingress controller with a dynamic public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-tls]
* [Create an ingress controller with a static public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-static-tls]

<!-- LINKS - Internal -->
[aks-ingress-basic]: ingress-basic.md
[aks-ingress-tls]: ingress-tls.md
[aks-ingress-static-tls]: ingress-static-ip.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-internal]: ingress-internal-ip.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
