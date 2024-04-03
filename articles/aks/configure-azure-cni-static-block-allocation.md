---
title: Configure Azure CNI for static allocation of CIDR blocks - (Preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to configure Azure CNI Networking for static allocation of CIDR blocks in Azure Kubernetes Service (AKS)
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: article
ms.date: 03/18/2024
ms.custom: references_regions, devx-track-azurecli
---

# Configure Azure CNI Networking for static allocation of CIDR blocks and enhanced subnet support in Azure Kubernetes Service (AKS) - (Preview)

A limitation of [Azure CNI Dynamic IP Allocation](configure-azure-cni-dynamic-ip-allocation.md) is the scalability of the pod subnet size beyond a /16 subnet. Even with a large subnet, large clusters may still be limited to 65k pods due to an Azure address mapping limit. 
The new static block allocation capability in Azure CNI solves this problem by assigning CIDR blocks to Nodes rather than individual IPs.

It offers the following benefits:

- **Better IP Scalability**: CIDR blocks are statically allocated to the cluster nodes and are present for the lifetime of the node, as opposed to the traditional dynamic allocation of individual IPs with traditional CNI. This enables routing based on CIDR blocks and helps scale the cluster limit up to 1 million pods from the traditional 65K pods per cluster. Your Azure Virtual Network must be large enough to accommodate the scale of your cluster. 
- **Flexibility**: Node and pod subnets can be scaled independently. A single pod subnet can be shared across multiple node pools of a cluster or across multiple AKS clusters deployed in the same VNet. You can also configure a separate pod subnet for a node pool.  
- **High performance**: Since pods are assigned virtual network IPs, they have direct connectivity to other cluster pods and resources in the VNet.
- **Separate VNet policies for pods**: Since pods have a separate subnet, you can configure separate VNet policies for them that are different from node policies. This enables many useful scenarios such as allowing internet connectivity only for pods and not for nodes, fixing the source IP for pod in a node pool using an Azure NAT Gateway, and using NSGs to filter traffic between node pools.  
- **Kubernetes network policies**: Cilium, Azure NPM, and Calico work with this new solution.

This article shows you how to use Azure CNI Networking for static allocation of CIDRs and enhanced subnet support in AKS.

## Prerequisites

> [!NOTE]
> When using static block allocation of CIDRs, exposing an application as a Private Link Service using a Kubernetes Load Balancer Service isn't supported.

- Review the [prerequisites][azure-cni-prereq] for configuring basic Azure CNI networking in AKS, as the same prerequisites apply to this article.
- Review the [deployment parameters][azure-cni-deployment-parameters] for configuring basic Azure CNI networking in AKS, as the same parameters apply.
- AKS Engine and DIY clusters aren't supported.
- Azure CLI version `2.37.0` or later with extension aks-preview of version '2.0.0b2' or later
- If you have an existing cluster, you need to enable Container Insights for monitoring IP subnet usage. You can enable Container Insights using the [`az aks enable-addons`][az-aks-enable-addons] command, as shown in the following example:
- Register the subscription-level feature flag for your subscription: 'Microsoft.ContainerService/AzureVnetScalePreview'

    ```azurecli-interactive
    az aks enable-addons --addons monitoring --name <cluster-name> --resource-group <resource-group-name>
    ```

## Limitations

Below are some of the limitations of using Azure CNI Static Block allocation:
- Minimum Kubernetes Version required is 1.28
- Maximum subnet size supported is x.x.x.x/12 ~ 1 million IPs
- Not supported for Windows node pools (Windows support coming soon)
- Not supported for Cilium Data Plane (support coming soon)
- Only a single mode of operation can be used per subnet. If a subnet uses Static Block allocation mode, it cannot be use Dynamic IP allocation mode in a different cluster or node pool with the same subnet and vice versa.
- Only supported in new clusters or when adding node pools with a different subnet to existing clusters. Migrating or updating existing clusters or node pools is not supported.
- Across all the CIDR blocks assigned to a node in the node pool, one IP will be selected as the primary IP of the node. Thus, for network administrators selecting the `--max-pods` value try to use the calculation below to best serve your needs and have optimal usage of IPs in the subnet:  
`max_pods` = (N * 16) - 1`
where N is any positive integer and N > 0

### Region availability 

This feature is **_not_** available in the following regions:

- US South
- East US 2
- West US
- West US 2

## Plan IP addressing

Planning your IP addressing is more flexible and granular. Since the nodes and pods scale independently, their address spaces can also be planned separately. Since pod subnets can be configured to the granularity of a node pool, you can always add a new subnet when you add a node pool. The system pods in a cluster/node pool also receive IPs from the pod subnet, so this behavior needs to be accounted for.

In this scenario, CIDR blocks of /28 (16 IPs) are allocated to nodes based on your '--max-pod' configuration for your node pool which defines the maximum number of pods per node. 1 IP is reserved on each node from all the available IPs on that node for internal purposes. 

Thus while determining and planning your IPs it is essential to define your '--max-pods' configuration and it can be calculated best as below:
`max_pods_per_node = (16 * N) - 1`
where N is any positive integer greater than 0

Ideal values with no IP wastage would require the max pods value to conform to the above expression.

**Example 1:** max_pods = 30, CIDR Blocks allocated per node = 2, Total IPs available for pods = (16 * 2) - 1 = 32 - 1 = 31, IP wastage per node = 31 - 30 = 1 **[Low wastage - Acceptable Case]**
**Example 2:** max_pods = 31, CIDR Blocks allocated per node = 2, Total IPs available for pods = (16 * 2) - 1 = 32 - 1 = 31, IP wastage per node = 31 - 31 = 0 **[Ideal Case]**
**Example 3:** max_pods = 32, CIDR Blocks allocated per node = 3, Total IPs available for pods = (16 * 3) - 1 = 48 - 1 = 47, IP wastage per node = 47 - 32 = 15 **[High Wastage - Not Recommended Case]**

The planning of IPs for Kubernetes services remain unchanged.

> [!NOTE]
> Ensure your VNet has a sufficiently large and contiguous address space to support your cluster's scale.

## Deployment parameters

The [deployment parameters][azure-cni-deployment-parameters]for configuring basic Azure CNI networking in AKS are all valid, with two exceptions:

- The **vnet subnet id** parameter now refers to the subnet related to the cluster's nodes.
- The parameter **pod subnet id** is used to specify the subnet whose IP addresses will be statically or dynamically allocated to pods in the node pool.
- The **pod ip allocation mode** parameter specifies whether to use dynamic individual or static block allocation.

## Before you begin

- If using the Azure CLI, you need the `aks-preview` extension. See [Install the `aks-preview` Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
- If using ARM or the REST API, the AKS API version must be _2024-01-02-preview or later_.

### Install the `aks-preview` Azure CLI extension

1. Install the `aks-preview` extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command. The extension should have a version of '2.0..0b2' or later

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Register the `AzureVnetScalePreview` feature flag

1. Register the `AzureVnetScalePreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "AzureVnetScalePreview"
    ```

    It takes a few minutes for the status to show _Registered_.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "AzureVnetScalePreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the _Microsoft.ContainerService_ resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Configure networking with static allocation of CIDR blocks and enhanced subnet support - Azure CLI

Using static allocation of CIDR blocks in your cluster is similar to the default method for configuring a cluster Azure CNI for dynamic IP allocation. The following example walks through creating a new virtual network with a subnet for nodes and a subnet for pods and creating a cluster that uses Azure CNI with static allocation of CIDR blocks. Be sure to replace variables such as `$subscription` with your values.

Create the virtual network with two subnets.

```azurecli-interactive
resourceGroup="myResourceGroup"
vnet="myVirtualNetwork"
location="myRegion"

# Create the resource group
az group create --name $resourceGroup --location $location

# Create our two subnet network 
az network vnet create -resource-group $resourceGroup --location $location --name $vnet --address-prefixes 10.0.0.0/8 -o none 
az network vnet subnet create --resource-group $resourceGroup --vnet-name $vnet --name nodesubnet --address-prefixes 10.240.0.0/16 -o none 
az network vnet subnet create --resource-group $resourceGroup --vnet-name $vnet --name podsubnet --address-prefixes 10.40.0.0/13 -o none 
```

Create the cluster, referencing the node subnet using `--vnet-subnet-id`, the pod subnet using `--pod-subnet-id`, the `--pod-ip-allocation-mode` to define the ip allocation mode, and enable the monitoring add-on.

```azurecli-interactive
clusterName="myAKSCluster"
subscription="aaaaaaa-aaaaa-aaaaaa-aaaa"

az aks create --name $clusterName --resource-group $resourceGroup --location $location \
    --max-pods 250 \
    --node-count 2 \
    --network-plugin azure \
    --pod-ip-allocation-mode StaticBlock \
    --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/nodesubnet \
    --pod-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/podsubnet \
    --enable-addons monitoring \
    --kubernetes-version 1.28
```

### Adding node pool

When adding node pool, reference the node subnet using `--vnet-subnet-id`, the pod subnet using `--pod-subnet-id` and allocation mode using '--pod-ip-allocation-mode'. The following example creates two new subnets that are then referenced in the creation of a new node pool:

```azurecli-interactive
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name node2subnet --address-prefixes 10.242.0.0/16 -o none 
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name pod2subnet --address-prefixes 10.243.0.0/16 -o none 

az aks nodepool add --cluster-name $clusterName -g $resourceGroup  -n newnodepool \
    --max-pods 250 \
    --node-count 2 \
    --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/node2subnet \
    --pod-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/pod2subnet \
    --pod-ip-allocation-mode StaticBlock \
    --no-wait
```

## Static allocation of CIDR blocks and enhanced subnet support FAQs

- **Can I assign multiple pod subnets to a cluster?**

  Multiple subnets can be assigned to a cluster but only one subnet can be assigned to each node pool. Different node pools across the same/different cluster can share the same subnet.

- **Can I assign Pod subnets from a different VNet altogether?**

  No, the pod subnet should be from the same VNet as the cluster.  

- **Can some node pools in a cluster use Dynamic IP allocation while others use the new Static Block allocation?**

Yes, different node pools can use different allocation modes. However, once a subnet is used in one allocation mode it can only be used in the same allocation mode across all the node pools it is associated.

## Next steps

Learn more about networking in AKS in the following articles:

- [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)
- [Use an internal load balancer with Azure Kubernetes Service (AKS)](internal-lb.md)
- [Use the application routing addon in Azure Kubernetes Service (AKS)](app-routing.md)

<!-- LINKS - External -->
[github]: https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml

<!-- LINKS - Internal -->
[azure-cni-prereq]: ./configure-azure-cni.md#prerequisites
[azure-cni-deployment-parameters]: ./azure-cni-overview.md#deployment-parameters
[az-aks-enable-addons]: /cli/azure/aks#az_aks_enable_addons
