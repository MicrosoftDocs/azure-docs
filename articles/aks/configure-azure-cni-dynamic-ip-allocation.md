---
title: Configure Azure CNI networking for dynamic allocation of IPs and enhanced subnet support
titleSuffix: Azure Kubernetes Service
description: Learn how to configure Azure CNI (advanced) networking for dynamic allocation of IPs and enhanced subnet support in Azure Kubernetes Service (AKS)
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: article
ms.date: 04/20/2023
ms.custom: references_regions, devx-track-azurecli
---

# Configure Azure CNI networking for dynamic allocation of IPs and enhanced subnet support in Azure Kubernetes Service (AKS)

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

## Plan IP addressing

Planning your IP addressing is much simpler with this feature. Since the nodes and pods scale independently, their address spaces can also be planned separately. Since pod subnets can be configured to the granularity of a node pool, you can always add a new subnet when you add a node pool. The system pods in a cluster/node pool also receive IPs from the pod subnet, so this behavior needs to be accounted for.

IPs are allocated to nodes in batches of 16. Pod subnet IP allocation should be planned with a minimum of 16 IPs per node in the cluster; nodes will request 16 IPs on startup and will request another batch of 16 any time there are <8 IPs unallocated in their allotment.

The planning of IPs for Kubernetes services and Docker bridge remain unchanged.

## Maximum pods per node in a cluster with dynamic allocation of IPs and enhanced subnet support

The pods per node values when using Azure CNI with dynamic allocation of IPs slightly differ from the traditional CNI behavior:

|CNI|Default|Configurable at deployment|
|--| :--: |--|
|Traditional Azure CNI|30|Yes (up to 250)|
|Azure CNI with dynamic allocation of IPs|250|Yes (up to 250)|

All other guidance related to configuring the maximum pods per node remains the same.

## Deployment parameters

The [deployment parameters][azure-cni-deployment-parameters]for configuring basic Azure CNI networking in AKS are all valid, with two exceptions:

* The **subnet** parameter now refers to the subnet related to the cluster's nodes.
* An additional parameter **pod subnet** is used to specify the subnet whose IP addresses will be dynamically allocated to pods.

## Configure networking with dynamic allocation of IPs and enhanced subnet support - Azure CLI

Using dynamic allocation of IPs and enhanced subnet support in your cluster is similar to the default method for configuring a cluster Azure CNI. The following example walks through creating a new virtual network with a subnet for nodes and a subnet for pods, and creating a cluster that uses Azure CNI with dynamic allocation of IPs and enhanced subnet support. Be sure to replace variables such as `$subscription` with your own values.

Create the virtual network with two subnets.

```azurecli-interactive
resourceGroup="myResourceGroup"
vnet="myVirtualNetwork"
location="westcentralus"

# Create the resource group
az group create --name $resourceGroup --location $location

# Create our two subnet network 
az network vnet create -g $resourceGroup --location $location --name $vnet --address-prefixes 10.0.0.0/8 -o none 
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name nodesubnet --address-prefixes 10.240.0.0/16 -o none 
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name podsubnet --address-prefixes 10.241.0.0/16 -o none 
```

Create the cluster, referencing the node subnet using `--vnet-subnet-id` and the pod subnet using `--pod-subnet-id`.

```azurecli-interactive
clusterName="myAKSCluster"
subscription="aaaaaaa-aaaaa-aaaaaa-aaaa"

az aks create -n $clusterName -g $resourceGroup -l $location \
    --max-pods 250 \
    --node-count 2 \
    --network-plugin azure \
    --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/nodesubnet \
    --pod-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/podsubnet  
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

```azurecli

    $s="subscriptionId"

    $rg="resourceGroup"

    $c="ClusterName"

    az account set -s $s

    az aks get-credentials -n $c -g $rg

```

### Apply the config

1.	Open terminal in the folder the downloaded **container-azm-ms-agentconfig.yaml** file is saved.

2.	First, apply the config using the command: `kubectl apply -f container-azm-ms-agentconfig.yaml`

3.	This will restart the pod and after 5-10 minutes, the metrics will be visible.

4.	To view the metrics on the cluster, go to Workbooks on the cluster page in the Azure portal, and find the workbook named "Subnet IP Usage". Your view will look similar to the following:

    :::image type="content" source="media/configure-azure-cni-dynamic-ip-allocation/ip-subnet-usage.png" alt-text="A diagram of the Azure portal's workbook blade is shown, and metrics for an AKS cluster's subnet IP usage are displayed.":::

## Dynamic allocation of IP addresses and enhanced subnet support FAQs

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

* [Create a basic ingress controller with external network connectivity][aks-ingress-basic]
* [Enable the HTTP application routing add-on][aks-http-app-routing]
* [Create an ingress controller that uses an internal, private network and IP address][aks-ingress-internal]
* [Create an ingress controller with a dynamic public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-tls]
* [Create an ingress controller with a static public IP and configure Let's Encrypt to automatically generate TLS certificates][aks-ingress-static-tls]

<!-- LINKS - External -->
[github]: https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml

<!-- LINKS - Internal -->
[aks-ingress-basic]: ingress-basic.md
[aks-ingress-tls]: ingress-tls.md
[aks-ingress-static-tls]: ingress-static-ip.md
[aks-http-app-routing]: http-application-routing.md
[aks-ingress-internal]: ingress-internal-ip.md
[azure-cni-prereq]: ./configure-azure-cni.md#prerequisites
[azure-cni-deployment-parameters]: ./azure-cni-overview.md#deployment-parameters
