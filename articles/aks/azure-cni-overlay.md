---
title: Configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS), including deploying an AKS cluster into an existing virtual network and subnet.
services: container-service
ms.topic: article
ms.custom: references_regions
ms.date: 08/29/2022
---

# Configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS)

The traditional [Azure Container Networking Interface (CNI)](./configure-azure-cni.md) assigns a VNet IP address to every Pod either from a pre-reserved set of IPs on every node or from a separate subnet reserved for pods. This approach requires IP address planning and could lead to address exhaustion and difficulties in scaling your clusters as your application demands grow.

With Azure CNI Overlay, the cluster nodes are deployed into an Azure Virtual Network subnet, whereas pods are assigned IP addresses from a private CIDR logically different from the VNet hosting the nodes. Pod and node traffic within the cluster use an overlay network, and Network Address Translation (via the node's IP address) is used to reach resources outside the cluster. This solution saves a significant amount of VNet IP addresses and enables you to seamlessly scale your cluster to very large sizes. An added advantage is that the private CIDR can be reused in different AKS clusters, truly extending the IP space available for containerized applications in AKS.

> [!NOTE]
> Azure CNI Overlay is currently available in the following regions:
> - North Central US
> - West Central US
## Overview of overlay networking

In overlay networking, only the Kubernetes cluster nodes are assigned IPs from a subnet. Pods receive IPs from a private CIDR that is provided at the time of cluster creation. Each node is assigned a `/24` address space carved out from the same CIDR. Additional nodes that are created when you scale out a cluster automatically receive `/24` address spaces from the same CIDR. Azure CNI assigns IPs to pods from this `/24` space.

A separate routing domain is created in the Azure Networking stack for the pod's private CIDR space, which creates an overlay network for direct communication between pods. There is no need to provision custom routes on the cluster subnet or use an encapsulation method to tunnel traffic between pods. This provides connectivity performance between pods on par with VMs in a VNet. 

:::image type="content" source="media/azure-cni-overlay/azure-cni-overlay.png" alt-text="A diagram showing two nodes with three pods each running in an overlay network. Pod traffic to endpoints outside the cluster is routed via NAT.":::

Communication with endpoints outside the cluster, such as on-premises and peered VNets, happens using the node IP through Network Address Translation. Azure CNI translates the source IP (overlay IP of the pod) of the traffic to the primary IP address of the VM, which enables the Azure Networking stack to route the traffic to the destination. Endpoints outside the cluster can't connect to a pod directly. You will have to publish the pod's application as a Kubernetes Load Balancer service to make it reachable on the VNet.

Outbound (egress) connectivity to the internet for overlay pods can be provided using a [Standard SKU Load Balancer](./egress-outboundtype.md#outbound-type-of-loadbalancer) or [Managed NAT Gateway](./nat-gateway.md). You can also control egress traffic by directing it to a firewall using [User Defined Routes on the cluster subnet](./egress-outboundtype.md#outbound-type-of-userdefinedrouting).

Ingress connectivity to the cluster can be achieved using an ingress controller such as Nginx or [HTTP application routing](./http-application-routing.md).

## Difference between Kubenet and Azure CNI Overlay

Like Azure CNI Overlay, Kubenet assigns IP addresses to pods from an address space logically different from the VNet but has scaling and other limitations. The below table provides a detailed comparison between Kubenet and Azure CNI Overlay. If you do not want to assign VNet IP addresses to pods due to IP shortage, then Azure CNI Overlay is the recommended solution.

| Area | Azure CNI Overlay | Kubenet |
| -- | :--: | -- |
| Cluster scale | 1000 nodes and 250 pods/node | 400 nodes and 250 pods/node |
| Network configuration | Simple - no additional configuration required for pod networking | Complex - requires route tables and UDRs on cluster subnet for pod networking |
| Pod connectivity performance | Performance on par with VMs in a VNet | Additional hop adds minor latency |
| Kubernetes Network Policies | Azure Network Policies, Calico | Calico |
| OS platforms supported | Linux only | Linux only |

## IP address planning

* **Cluster Nodes**: Cluster nodes go into a subnet in your VNet, so ensure that you have a subnet big enough to account for future scale. A simple `/24` subnet can host up to 251 nodes (the first three IP addresses in a subnet are reserved for management operations).

* **Pods**: The overlay solution assigns a `/24` address space for pods on every node from the private CIDR that you specify during cluster creation. The `/24` size is fixed and can't be increased or decreased. You can run up to 250 pods on a node. When planning the pod address space, ensure that the private CIDR is large enough to provide `/24` address spaces for new nodes to support future cluster expansion. 
The following are additional factors to consider when planning pod address space:
   * Pod CIDR space must not overlap with the cluster subnet range.
   * Pod CIDR space must not overlap with IP ranges used in on-premises networks and peered networks.
   * The same pod CIDR space can be used on multiple independent AKS clusters in the same VNet.

* **Kubernetes service address range**: The size of the service address CIDR depends on the number of cluster services you plan to create. It must be smaller than `/12`. This range should also not overlap with the pod CIDR range, cluster subnet range, and IP range used in peered VNets and on-premises networks.

* **Kubernetes DNS service IP address**: This is an IP address within the Kubernetes service address range that will be used by cluster service discovery. Don't use the first IP address in your address range. The first address in your subnet range is used for the kubernetes.default.svc.cluster.local address.

## Maximum pods per node

You can configure the maximum number of pods per node at the time of cluster creation or when you add a new node pool. The default for Azure CNI Overlay is 30. The maximum value that you can specify in Azure CNI Overlay is 250, and the minimum value is 10. The maximum pods per node value configured during creation of a node pool applies to the nodes in that node pool only.

## Choosing a network model to use

Azure CNI offers two IP addressing options for pods- the traditional configuration that assigns VNet IPs to pods, and overlay networking. The choice of which option to use for your AKS cluster is a balance between flexibility and advanced configuration needs. The following considerations help outline when each network model may be the most appropriate.

Use overlay networking when:

* You would like to scale to a large number of Pods but have limited IP address space in your VNet.
* Most of the pod communication is within the cluster.
* You don't need advanced AKS features, such as virtual nodes.

Use the traditional VNet option when:

* You have available IP address space.
* Most of the pod communication is to resources outside of the cluster.
* Resources outside the cluster need to reach pods directly.
* You need AKS advanced features, such as virtual nodes.

## Limitations with Azure CNI Overlay

The overlay solution has the following limitations today

* Only available for Linux and not for Windows.
* You can't deploy multiple overlay clusters in the same subnet.
* Overlay can be enabled only for new clusters. Existing (already deployed) clusters can't be configured to use overlay.
* You can't use Application Gateway as an Ingress Controller (AGIC) for an overlay cluster.
* v5 VM SKUs are not currently supported.

## Steps to set up overlay clusters

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

The following example walks through the steps to create a new virtual network with a subnet for the cluster nodes and an AKS cluster that uses Azure CNI Overlay. Be sure to replace the variables with your own values. 

First, opt into the feature by running the following command:

```azurecli-interactive
az feature register --namespace Microsoft.ContainerService --name AzureOverlayPreview
```

Create a virtual network with a subnet for the cluster nodes.

```azurecli-interactive
resourceGroup="myResourceGroup"
vnet="myVirtualNetwork"
location="westcentralus"

# Create the resource group
az group create --name $resourceGroup --location $location

# Create a VNet and a subnet for the cluster nodes 
az network vnet create -g $resourceGroup --location $location --name $vnet --address-prefixes 10.0.0.0/8 -o none
az network vnet subnet create -g $resourceGroup --vnet-name $vnet --name nodesubnet --address-prefix 10.10.0.0/16 -o none
```

Create a cluster with Azure CNI Overlay. Use `--network-plugin-mode` to specify that this is an overlay cluster. If the pod CIDR is not specified then AKS assigns a default space, viz. 10.244.0.0/16. 

```azurecli-interactive
clusterName="myOverlayCluster"
subscription="aaaaaaa-aaaaa-aaaaaa-aaaa"

az aks create -n $clusterName -g $resourceGroup --location $location --network-plugin azure --network-plugin-mode overlay --pod-cidr 192.168.0.0/16 --vnet-subnet-id /subscriptions/$subscription/resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/nodesubnet
```

## Frequently asked questions

* *How do pods and cluster nodes communicate with each other?*

  Pods and nodes talk to each other directly without any SNAT requirements.


* *Can I configure the size of the address space assigned to each space?*

  No, this is fixed at `/24` today and can't be changed.


* *Can I add more private pod CIDRs to a cluster after the cluster has been created?*

  No, a private pod CIDR can only be specified at the time of cluster creation.


* *What are the max nodes and pods per cluster supported by Azure CNI Overlay?*

  The max scale in terms of nodes and pods per cluster is the same as the max limits supported by AKS today.