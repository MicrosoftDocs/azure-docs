---
title: Configure Azure CNI VNet networking for static allocation of IP blocks - (Preview)
titleSuffix: Azure Kubernetes Service
description: Learn how to configure Azure CNI VNet networking for static allocation of IP blocks in Azure Kubernetes Service (AKS)
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: article
ms.date: 02/29/2024
ms.custom: references_regions, devx-track-azurecli
---

# Configure Azure CNI Networking for static allocation of CIDR blocks and enhanced subnet support in Azure Kubernetes Service (AKS) - (Preview)

A limitation of [Azure CNI Dynamic IP Allocation](configure-azure-cni-dynamic-ip-allocation.md) is the exhaustion of pod IP addresses as the AKS cluster grows, which results in the need to rebuild your entire cluster in a bigger subnet but still be limit the cluster size to 65K pods. The new static block allocation capability in Azure CNI solves this problem by assigning CIDR blocks to Nodes rather than individual IPs.

It offers the following benefits:

* **Better IP Scalability**: CIDR blocks are statically allocated to the cluster nodes and are present for the lifetime of the node, as opposed to the traditional dynamic allocation of individual IPs with traditional CNI. This enables routing based on CIDR blocks and helps scale the cluster limit up to 1 million pods from the traditional 65K pods per cluster.
* **Flexibility**: Node and pod subnets can be scaled independently. A single pod subnet can be shared across multiple node pools of a cluster or across multiple AKS clusters deployed in the same VNet. You can also configure a separate pod subnet for a node pool.  
* **High performance**: Since pods are assigned virtual network IPs, they have direct connectivity to other cluster pods and resources in the VNet. The solution supports very large clusters without any degradation in performance.
* **Separate VNet policies for pods**: Since pods have a separate subnet, you can configure separate VNet policies for them that are different from node policies. This enables many useful scenarios such as allowing internet connectivity only for pods and not for nodes, fixing the source IP for pod in a node pool using an Azure NAT Gateway, and using NSGs to filter traffic between node pools.  
* **Kubernetes network policies**: Cilium, Azure NPM, and Calico work with this new solution.

This article shows you how to use Azure CNI Networking for static allocation of CIDRs and enhanced subnet support in AKS.

## Prerequisites

> [!NOTE]
> When using static block allocation of CIDRs, exposing an application as a Private Link Service using a Kubernetes Load Balancer Service isn't supported.

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

IPs are allocated to nodes based on your max pods settings and in blocks of 16 (15 useable) IP addresses (blocks of /28 - 1 IP for routing purposes). This means that if you have a max Pods set to 30, when a node is provisioned, two blocks of 16 IPs will be allocated to the node and not able to be reused until that node is removed. Subnet IP allocation should be planned with a minimum of 16 IPs per node in the cluster and the max pod count per node when considering scaling. 

The planning of IPs for Kubernetes services and Docker bridge remain unchanged.

## Deployment parameters

The [deployment parameters][azure-cni-deployment-parameters]for configuring basic Azure CNI networking in AKS are all valid, with two exceptions:

* The **subnet** parameter now refers to the subnet related to the cluster's nodes.
* The parameter **pod subnet** is used to specify the subnet whose IP addresses will be statically or dynamically allocated to pods.
* The **pod ip allocation mode** parameter specifies whether to use dynamic or static block ip allocation.

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

* Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

* Update to the latest version of the extension released using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Configure networking with static allocation of IP blocks and enhanced subnet support - Azure CLI

Using static allocation of IP blocks in your cluster is similar to the default method for configuring a cluster Azure CNI. The following example walks through creating a new virtual network with a subnet for nodes and a subnet for pods, and creating a cluster that uses Azure CNI with static allocation of IP blocks. Be sure to replace variables such as `$subscription` with your own values.

Create the virtual network with two subnets.

```azurecli-interactive
resourceGroup="myResourceGroup"
vnet="myVirtualNetwork"
location="westcentralus"

# Create the resource group
az group create --name $resourceGroup --location $location

# Create our two subnet network 
az network vnet create -resource-group $resourceGroup --location $location --name $vnet --address-prefixes 10.0.0.0/8 -o none 
az network vnet subnet create --resource-group $resourceGroup --vnet-name $vnet --name nodesubnet --address-prefixes 10.240.0.0/16 -o none 
az network vnet subnet create --resource-group $resourceGroup --vnet-name $vnet --name podsubnet --address-prefixes 10.241.0.0/16 -o none 
```

Create the cluster, referencing the node subnet using `--vnet-subnet-id` and the pod subnet using `--pod-subnet-id` and enabling the monitoring add-on.

```azurecli-interactive
clusterName="myAKSCluster"
subscription="aaaaaaa-aaaaa-aaaaaa-aaaa"

az aks create --name $clusterName --resource-group $resourceGroup --location $location \
    --max-pods 250 \
    --node-count 2 \
    --network-plugin azure \
    --pod-ip-allocation-mode staticblock \
    --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/nodesubnet \
    --pod-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/podsubnet \
    --enable-addons monitoring
```

### Adding node pool

When adding node pool, reference the node subnet using `--vnet-subnet-id` and the pod subnet using `--pod-subnet-id`. The following example creates two new subnets that are then referenced in the creation of a new node pool:

```azurecli-interactive
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name node2subnet --address-prefixes 10.242.0.0/16 -o none 
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name pod2subnet --address-prefixes 10.243.0.0/16 -o none 

az aks nodepool add --cluster-name $clusterName -g $resourceGroup  -n newnodepool \
    --max-pods 250 \
    --node-count 2 \
    --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/node2subnet \
    --pod-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/pod2subnet \
    --no-wait
```

## Monitor IP subnet usage

Azure CNI provides the capability to monitor IP subnet usage. To enable IP subnet usage monitoring, follow the steps below:

### Get the YAML file

1. Download or grep the file named container-azm-ms-agentconfig.yaml from [GitHub][github].

2. Find **`azure_subnet_ip_usage`** in integrations. Set `enabled` to `true`.

3. Save the file.

### Get the AKS credentials

Set the variables for subscription, resource group and cluster. Consider the following as examples:

```azurecli-interactive
az account set -s $subscription
az aks get-credentials -n $clusterName -g $resourceGroup
```

### Apply the config

1.	Open terminal in the folder the downloaded **container-azm-ms-agentconfig.yaml** file is saved.

2.	First, apply the config using the command: `kubectl apply -f container-azm-ms-agentconfig.yaml`

3.	This will restart the pod and after 5-10 minutes, the metrics will be visible.

4.	To view the metrics on the cluster, go to Workbooks on the cluster page in the Azure portal, and find the workbook named "Subnet IP Usage". Your view will look similar to the following:

    :::image type="content" source="media/configure-azure-cni-dynamic-ip-allocation/ip-subnet-usage.png" alt-text="A diagram of the Azure portal's workbook blade is shown, and metrics for an AKS cluster's subnet IP usage are displayed.":::

## Static allocation of IP blocks and enhanced subnet support FAQs

* **Can I assign multiple pod subnets to a cluster/node pool?**

  Only one subnet can be assigned to a cluster or node pool. However, multiple clusters or node pools can share a single subnet.

* **Can I assign Pod subnets from a different VNet altogether?**

  No, the pod subnet should be from the same VNet as the cluster.  

* **Can some node pools in a cluster use the traditional CNI while others use the new CNI?**

  The entire cluster should use only one type of CNI.

## Next steps

Learn more about networking in AKS in the following articles:

* [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)
* [Use an internal load balancer with Azure Kubernetes Service (AKS)](internal-lb.md)
* [Use the application routing addon in Azure Kubernetes Service (AKS)](app-routing.md)

<!-- LINKS - External -->
[github]: https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml

<!-- LINKS - Internal -->
[azure-cni-prereq]: ./configure-azure-cni.md#prerequisites
[azure-cni-deployment-parameters]: ./azure-cni-overview.md#deployment-parameters
[az-aks-enable-addons]: /cli/azure/aks#az_aks_enable_addons
