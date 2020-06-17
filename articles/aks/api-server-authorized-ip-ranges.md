---
title: API server authorized IP ranges in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address range for access to the API server in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 11/05/2019


#Customer intent: As a cluster operator, I want to increase the security of my cluster by limiting access to the API server to only the IP addresses that I specify.
---

# Secure access to the API server using authorized IP address ranges in Azure Kubernetes Service (AKS)

In Kubernetes, the API server receives requests to perform actions in the cluster such as to create resources or scale the number of nodes. The API server is the central way to interact with and manage a cluster. To improve cluster security and minimize attacks, the API server should only be accessible from a limited set of IP address ranges.

This article shows you how to use API server authorized IP address ranges to limit which IP addresses and CIDRs can access control plane.

> [!IMPORTANT]
> On new clusters, API server authorized IP address ranges are only supported on the *Standard* SKU load balancer. Existing clusters with the *Basic* SKU load balancer and API server authorized IP address ranges configured will continue work as is but cannot be migrated to a *Standard* SKU load balancer. Those existing clusters will also continue to work if their Kubernetes version or control plane are upgraded.

## Before you begin

API server authorized IP ranges only work for new AKS clusters that you create. This article shows you how to create an AKS cluster using the Azure CLI.

You need the Azure CLI version 2.0.76 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Overview of API server authorized IP ranges

The Kubernetes API server is how the underlying Kubernetes APIs are exposed. This component provides the interaction for management tools, such as `kubectl` or the Kubernetes dashboard. AKS provides a single-tenant cluster master, with a dedicated API server. By default, the API server is assigned a public IP address, and you should control access using role-based access controls (RBAC).

To secure access to the otherwise publicly accessible AKS control plane / API server, you can enable and use authorized IP ranges. These authorized IP ranges only allow defined IP address ranges to communicate with the API server. A request made to the API server from an IP address that is not part of these authorized IP ranges is blocked. Continue to use RBAC to authorize users and the actions they request.

For more information about the API server and other cluster components, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

## Create an AKS cluster with API server authorized IP ranges enabled

API server authorized IP ranges only work for new AKS clusters and are not supported for private AKS clusters. Create a cluster using the [az aks create][az-aks-create] and specify the *--api-server-authorized-ip-ranges* parameter to provide a list of authorized IP address ranges. These IP address ranges are usually address ranges used by your on-premises networks or public IPs. When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

> [!IMPORTANT]
> By default, your cluster uses the [Standard SKU load balancer][standard-sku-lb] which you can use to configure the outbound gateway. When you enable API server authorized IP ranges during cluster creation, the public IP for your cluster is also allowed by default in addition to the ranges you specify. If you specify *""* or no value for *--api-server-authorized-ip-ranges*, API server authorized IP ranges will be disabled. Note that if you're using PowerShell, use *--api-server-authorized-ip-ranges=""* (with equals sign) to avoid any parsing issues.

The following example creates a single-node cluster named *myAKSCluster* in the resource group named *myResourceGroup* with API server authorized IP ranges enabled. The IP address ranges allowed are *73.140.245.0/24*:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --api-server-authorized-ip-ranges 73.140.245.0/24 \
    --generate-ssh-keys
```

> [!NOTE]
> You should add these ranges to an allow list:
> - The firewall public IP address
> - Any range that represents networks that you'll administer the cluster from
> - If you are using Azure Dev Spaces on your AKS cluster, you have to allow [additional ranges based on your region][dev-spaces-ranges].

> The upper limit for the number of IP ranges you can specify is 3500. 

### Specify the outbound IPs for the Standard SKU load balancer

When creating an AKS cluster, if you specify the outbound IP addresses or prefixes for the cluster, those addresses or prefixes are allowed as well. For example:

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --api-server-authorized-ip-ranges 73.140.245.0/24 \
    --load-balancer-outbound-ips <publicIpId1>,<publicIpId2> \
    --generate-ssh-keys
```

In the above example, all IPs provided in the parameter *--load-balancer-outbound-ip-prefixes* are allowed along with the IPs in the *--api-server-authorized-ip-ranges* parameter.

Alternatively, you can specify the *--load-balancer-outbound-ip-prefixes* parameter to allow outbound load balancer IP prefixes.

### Allow only the outbound public IP of the Standard SKU load balancer

When you enable API server authorized IP ranges during cluster creation, the outbound public IP for the Standard SKU load balancer for your cluster is also allowed by default in addition to the ranges you specify. To allow only the outbound public IP of the Standard SKU load balancer, use *0.0.0.0/32* when specifying the *--api-server-authorized-ip-ranges* parameter.

In the following example, only the outbound public IP of the Standard SKU load balancer is allowed, and you can only access the API server from the nodes within the cluster.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --api-server-authorized-ip-ranges 0.0.0.0/32 \
    --generate-ssh-keys
```

## Update a cluster's API server authorized IP ranges

To update the API server authorized IP ranges on an existing cluster, use [az aks update][az-aks-update] command and use the *--api-server-authorized-ip-ranges*, *--load-balancer-outbound-ip-prefixes*, *--load-balancer-outbound-ips*, or *--load-balancer-outbound-ip-prefixes* parameters.

The following example updates API server authorized IP ranges on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address range to authorize is *73.140.245.0/24*:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges  73.140.245.0/24
```

You can also use *0.0.0.0/32* when specifying the *--api-server-authorized-ip-ranges* parameter to allow only the public IP of the Standard SKU load balancer.

## Disable authorized IP ranges

To disable authorized IP ranges, use [az aks update][az-aks-update] and specify an empty range to disable API server authorized IP ranges. For example:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges ""
```

## Next steps

In this article, you enabled API server authorized IP ranges. This approach is one part of how you can run a secure AKS cluster.

For more information, see [Security concepts for applications and clusters in AKS][concepts-security] and [Best practices for cluster security and upgrades in AKS][operator-best-practices-cluster-security].

<!-- LINKS - external -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[dev-spaces-ranges]: ../dev-spaces/configure-networking.md#aks-cluster-network-requirements
[kubenet]: https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#kubenet

<!-- LINKS - internal -->
[az-aks-update]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-network-public-ip-list]: /cli/azure/network/public-ip#az-network-public-ip-list
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[concepts-security]: concepts-security.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[route-tables]: ../virtual-network/manage-route-table.md
[standard-sku-lb]: load-balancer-standard.md
