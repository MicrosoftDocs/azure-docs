---
title: Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with Azure CNI Powered by Cilium.
services: container-service
ms.topic: article
ms.custom: references_regions
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

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## IP Address Management (IPAM) with Azure CNI Powered by Cilium

Azure CNI Powered by Cilium can be deployed using two different methods for assigning pod IPs: 

- assign IP addresses from a VNet (similar to existing Azure CNI with Dynamic Pod IP Assignment)
- assign IP addresses from an overlay network (similar to Azure CNI Overlay mode)
 
> [!NOTE]
> Azure CNI Overlay networking currently requires the `Microsoft.ContainerService/AzureOverlayPreview` feature and may be available only in certain regions. For more information, see [Azure CNI Overlay networking](./azure-cni-overlay.md).

If you aren't sure which option to select, read ["Choosing a network model to use"](./azure-cni-overlay.md#choosing-a-network-model-to-use).

## Network Policy Enforcement

Cilium enforces [network policies to allow or deny traffic between pods](./operator-best-practices-network.md#control-traffic-flow-with-network-policies). With Cilium, you don't need to install a separate network policy engine such as Azure Network Policy Manager or Calico.

## Limitations

Azure CNI powered by Cilium currently has the following limitations:

* Available only for new clusters.
* Available only for Linux and not for Windows.
* Cilium L7 policy enforcement is disabled.
* Hubble is disabled.
* Kubernetes services with `internalTrafficPolicy=Local` aren't supported ([Cilium issue #17796](https://github.com/cilium/cilium/issues/17796)).
* Multiple Kubernetes services can't use the same host port with different protocols (for example, TCP or UDP) ([Cilium issue #14287](https://github.com/cilium/cilium/issues/14287)).
* Network policies may be enforced on reply packets when a pod connects to itself via service cluster IP ([Cilium issue #19406](https://github.com/cilium/cilium/issues/19406)).

## Prerequisites

* Azure CLI version 2.41.0 or later. Run `az --version` to see the currently installed version. If you need to install or upgrade, see [Install Azure CLI][/cli/azure/install-azure-cli].
* Azure CLI with aks-preview extension 0.5.109 or later.
* If using ARM templates or the REST API, the AKS API version must be 2022-09-02-preview or later.

### Install the aks-preview CLI extension

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `CiliumDataplanePreview` preview feature

To create an AKS cluster with Azure CNI powered by Cilium, you must enable the `CiliumDataplanePreview` feature flag on your subscription.

Register the `CiliumDataplanePreview` feature flag by using the `az feature register` command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "CiliumDataplanePreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the `az feature list` command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/CiliumDataplanePreview')].{Name:name,State:properties.state}"
```

When the feature has been registered, refresh the registration of the *Microsoft.ContainerService* resource provider by using the `az provider register` command:

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

Create the cluster using `--enable-cilium-dataplane`:

```azurecli-interactive
az aks create -n <clusterName> -g <resourceGroupName> -l <location> \
  --max-pods 250 \
  --node-count 2 \
  --network-plugin azure \
  --vnet-subnet-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/nodesubnet \
  --pod-subnet-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/podsubnet \
  --enable-cilium-dataplane
```

### Option 2: Assign IP addresses from an overlay network

Run these commands to create a resource group and VNet with a single subnet:

```azurecli-interactive
# Create the resource group
az group create --name <resourceGroupName> --location <location>
```

```azurecli-interactive
# Create a VNet with a subnet for nodes and a subnet for pods
az network vnet create -g <resourceGroupName> --location <location> --name <vnetName> --address-prefixes <address prefix, example: 10.0.0.0/8> -o none 
az network vnet subnet create -g <resourceGroupName> --vnet-name <vnetName> --name nodesubnet --address-prefixes <address prefix, example: 10.240.0.0/16> -o none 
```

Then create the cluster using `--enable-cilium-dataplane`:

```azurecli-interactive
az aks create -n <clusterName> -g <resourceGroupName> -l <location> \
  --max-pods 250 \
  --node-count 2 \
  --network-plugin azure \
  --network-plugin-mode overlay \
  --pod-cidr 192.168.0.0/16 \
  --vnet-subnet-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/nodesubnet \
  --enable-cilium-dataplane
```

## Frequently asked questions

- *Can I customize Cilium configuration?*

    No, the Cilium configuration is managed by AKS and can't be modified. We recommend that customers who require more control use [AKS BYO CNI](./use-byo-cni.md) and install Cilium manually.

- *Can I use `CiliumNetworkPolicy` custom resources instead of Kubernetes `NetworkPolicy` resources?*

    `CiliumNetworkPolicy` custom resources aren't officially supported. We recommend that customers use Kubernetes `NetworkPolicy` resources to configure network policies.

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
