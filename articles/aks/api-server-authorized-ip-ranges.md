---
title: API server authorized IP ranges in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address range for access to the API server in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 05/06/2019
ms.author: mlearned

#Customer intent: As a cluster operator, I want to increase the security of my cluster by limiting access to the API server to only the IP addresses that I specify.
---

# Secure access to the API server using authorized IP address ranges in Azure Kubernetes Service (AKS)

In Kubernetes, the API server receives requests to perform actions in the cluster such as to create resources or scale the number of nodes. The API server is the central way to interact with and manage a cluster. To improve cluster security and minimize attacks, the API server should only be accessible from a limited set of IP address ranges.

This article shows you how to use API server authorized IP address ranges to limit which IP addresses and CIDRs can access control plane.

> [!IMPORTANT]
> On new clusters, API server authorized IP address ranges are only supported on the *Standard* SKU load balancer. Existing clusters with the *Basic* SKU load balancer and API server authorized IP address ranges configured will continue work as is. Those existing clusers can also be upgrade and they will continue to work.

## Before you begin

This article assumes you are working with clusters that use [kubenet][kubenet].  With [Azure Container Networking Interface (CNI)][cni-networking] based clusters, you will not have the required route table needed to secure access.  You will need to create the route table manually.  See [managing route tables](https://docs.microsoft.com/azure/virtual-network/manage-route-table) for more information.

API server authorized IP ranges only work for new AKS clusters that you create. This article shows you how to create an AKS cluster using the Azure CLI.

You need the Azure CLI version 2.0.76 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Limitations

The following limitations apply when you configure API server authorized IP ranges:

* You cannot currently use Azure Dev Spaces as the communication with the API server is also blocked.

## Overview of API server authorized IP ranges

The Kubernetes API server is how the underlying Kubernetes APIs are exposed. This component provides the interaction for management tools, such as `kubectl` or the Kubernetes dashboard. AKS provides a single-tenant cluster master, with a dedicated API server. By default, the API server is assigned a public IP address, and you should control access using role-based access controls (RBAC).

To secure access to the otherwise publicly accessible AKS control plane / API server, you can enable and use authorized IP ranges. These authorized IP ranges only allow defined IP address ranges to communicate with the API server. A request made to the API server from an IP address that is not part of these authorized IP ranges is blocked. You should continue to use RBAC to then authorize users and the actions they request.

For more information about the API server and other cluster components, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

## Create an AKS cluster

API server authorized IP ranges only work for new AKS clusters. You can't enable authorized IP ranges as part of the cluster create operation. If you try to enable authorized IP ranges as part of the cluster create process, the cluster nodes are unable to access the API server during deployment as the egress IP address isn't defined at that point.

First, create a cluster using the [az aks create][az-aks-create] command. The following example creates a single-node cluster named *myAKSCluster* in the resource group named *myResourceGroup*.

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location eastus

# Create an AKS cluster
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --generate-ssh-keys

# Get credentials to access the cluster
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Update cluster with authorized IP ranges

By default, your cluster uses the [Standard SKU load balancer][standard-sku-lb], which you can use to configure the outbound gateway. Use [az network public-ip list][az-network-public-ip-list] and specify the resource group of your AKS cluster, which usually starts with *MC_*. This displays the public IP for your cluster, which you can allow. Use the [az aks update][az-aks-update] command and specify the *--api-server-authorized-ip-ranges* parameter to allow the IP of the cluster. For example:

```azurecli-interactive
RG=$(az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv)
SLB_PublicIP=$(az network public-ip list --resource-group $RG --query [].ipAddress -o tsv)
az aks update --api-server-authorized-ip-ranges $SLB_PublicIP --resource-group myResourceGroup --name myAKSCluster
```

To enable API server authorized IP ranges, use [az aks update][az-aks-update] command and specify the *--api-server-authorized-ip-ranges* parameter to provide a list of authorized IP address ranges. These IP address ranges are usually address ranges used by your on-premises networks or public IPs. When you specify a CIDR range, start with the first IP address in the range. For example, *137.117.106.90/29* is a valid range, but make sure you specify the first IP address in the range, such as *137.117.106.88/29*.

The following example enables API server authorized IP ranges on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address ranges to authorize are *172.0.0.0/16* (Pod/Nodes Address Range) and *168.10.0.0/18* (ServiceCidr):

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges 172.0.0.0/16,168.10.0.0/18
```

> [!NOTE]
> You should add these ranges to an allow list:
> - The firewall public IP address
> - The service CIDR
> - The address range for the subnets, with the nodes and pods
> - Any range that represents networks that you'll administer the cluster from

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
[kubenet]: https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#kubenet

<!-- LINKS - internal -->
[az-aks-update]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-network-public-ip-list]: /cli/azure/network/public-ip#az-network-public-ip-list
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[concepts-security]: concepts-security.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md
[standard-sku-lb]: load-balancer-standard.md
