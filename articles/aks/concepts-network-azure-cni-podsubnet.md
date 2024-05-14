---
title: Concepts - Azure CNI Pod Subnet
description: Learn about CNI networking in Azure Kubernetes Service (AKS)
ms.topic: conceptual
ms.date: 04/05/2024
author: schaffererin
ms.author: schaffererin

ms.custom: fasttrack-edit
---

# Azure CNI Pod Subnet

## Dynamic IP Allocation Mode

A drawback with the traditional CNI is the exhaustion of pod IP addresses as the AKS cluster grows, which results in the need to rebuild your entire cluster in a bigger subnet. The new dynamic IP allocation capability in Azure CNI solves this problem by allocating pod IPs from a subnet separate from the subnet hosting the AKS cluster.

It offers the following benefits:

* **Better IP utilization**: IPs are dynamically allocated to cluster Pods from the Pod subnet. This leads to better utilization of IPs in the cluster compared to the traditional CNI solution, which does static allocation of IPs for every node.
* **Scalable and flexible**: Node and pod subnets can be scaled independently. A single pod subnet can be shared across multiple node pools of a cluster or across multiple AKS clusters deployed in the same VNet. You can also configure a separate pod subnet for a node pool.  
* **High performance**: Since pod are assigned virtual network IPs, they have direct connectivity to other cluster pod and resources in the VNet. The solution supports very large clusters without any degradation in performance.
* **Separate VNet policies for pods**: Since pods have a separate subnet, you can configure separate VNet policies for them that are different from node policies. This enables many useful scenarios such as allowing internet connectivity only for pods and not for nodes, fixing the source IP for pod in a node pool using an Azure NAT Gateway, and using NSGs to filter traffic between node pools.  
* **Kubernetes network policies**: Both the Azure Network Policies and Calico work with this new solution.

This article shows you how to use Azure CNI networking for dynamic allocation of IPs and enhanced subnet support in AKS.

## Prerequisites

> [!NOTE]
> When using dynamic allocation of IPs, exposing an application as a Private Link Service using a Kubernetes Load Balancer Service isn't supported.

* Review the [prerequisites][azure-cni-prereq] for configuring basic Azure CNI networking in AKS, as the same prerequisites apply to this article.
* Review the [deployment parameters][azure-cni-deployment-parameters] for configuring basic Azure CNI networking in AKS, as the same parameters apply.
* AKS Engine and DIY clusters aren't supported.
* Azure CLI version `2.37.0` or later.
* If you have an existing cluster, you need to enable Container Insights for monitoring IP subnet usage. You can enable Container Insights using the [`az aks enable-addons`][az-aks-enable-addons] command, as shown in the following example:

    ```azurecli-interactive
    az aks enable-addons --addons monitoring --name <cluster-name> --resource-group <resource-group-name>
    ```

## Plan IP addressing

Planning your IP addressing is much simpler with this feature. Since the nodes and pods scale independently, their address spaces can also be planned separately. Since pod subnets can be configured to the granularity of a node pool, you can always add a new subnet when you add a node pool. The system pods in a cluster/node pool also receive IPs from the pod subnet, so this behavior needs to be accounted for.

IPs are allocated to nodes in batches of 16. Pod subnet IP allocation should be planned with a minimum of 16 IPs per node in the cluster; nodes will request 16 IPs on startup and will request another batch of 16 any time there are <8 IPs unallocated in their allotment.

The planning of IPs for Kubernetes services and Docker bridge remain unchanged.

## Static Block Allocation Mode - Preview

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