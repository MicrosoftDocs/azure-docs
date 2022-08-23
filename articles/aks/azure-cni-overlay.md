---
title: Configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS)
description: Learn how to configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS), including deploying an AKS cluster into an existing virtual network and subnet.
---

# Configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS)
The traditional [Azure CNI](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni) assigns a VNet IP address to every Pod either from a pre-reserved set of IPs on every node or from a separate subnet reserved for Pods. This approach requires IP address planning and could lead to address exhaustion and difficulties in scaling your clusters as your application demands grow.

With Azure CNI Overlay the cluster nodes are deployed into an Azure Virtual Network subnet whereas Pods are assigned IP addresses from a logically different address space from the VNet hosting the Pods. Pods communicate with each other in an overlay network and use the node’s IP address (through Network Address Translation) to reach resources in the VNet. The solution provides huge saving of VNet IP addresses and enables you to seamlessly scale your cluster to very large sizes.

## Overview of Overlay Networking
In overlay networking only the Kubernetes cluster nodes are assigned IPs from a subnet. Pods receive IPs from a private CIDR that is provided at the time of cluster creation. Each node is assigned a /24 address space carved out from this CIDR. Additional nodes that come up when you scale out a cluster automatically receive /24 address space from the same CIDR. Azure CNI assigns IPs to Pods from the /24 space.

A separate routing domain is created in the Azure Networking stack for the Pod private CIDR space which creates an overlay network for direct communication between Pods. There is no need to provision custom routes on the cluster subnet or use an encapsulation method to tunnel traffic between Pods. This provides on-the-wire connectivity performance between Pods, at par with VMs in a VNet. 

![Azure CNI Overlay network model with an AKS cluster](media/azure-cni-overlay/AzureCNI-Overlay.png)

Communication with endpoints outside the cluster, such as on-premises and peered VNets, happens using the node IP through Network Address Translation. Azure CNI translates the source IP (overlay IP of the Pod) of the traffic to the primary IP address of VM which enables the Azure Networking stack to route the traffic to the destination. Endpoints outside the cluster cannot connect to a Pod directly. You will have to publish the Pod application as a Kubernetes Load Balancer service to make it reachable on the VNet.

Outbound (egress) connectivity to the internet for overlay Pods can be provided using a [Standard SKU Load Balancer](https://docs.microsoft.com/en-us/azure/aks/egress-outboundtype#outbound-type-of-loadbalancer) or [Managed NAT Gateway](https://docs.microsoft.com/en-us/azure/aks/nat-gateway). You can also control egress traffic by directing it to a Firewall using [UDRs on the cluster subnet](https://docs.microsoft.com/en-us/azure/aks/egress-outboundtype#outbound-type-of-userdefinedrouting).

Ingress connectivity to the cluster can be achieved using an Ingress Controller such as NGINX or HTTP application routing. 

## Difference between Kubenet and Azure CNI Overlay
Kubenet assigns IP addresses to Pods from a logically different address space from the VNet just like Azure CNI Overlay but has scale and other limitations. The below table provides a detailed comparison between Kubenet and Overlay. If you do not want to assign VNet IP addresses to Pods due to IP shortage, then Azure CNI Overlay is the recommended CNI solution.

| Area | Azure CNI Overlay | Kubenet |
| -- | :--: | -- |
| Cluster scale | Max nodes and Pods supported by AKS | 400 nodes |
| Network configuration | Simple - no additional configuration required for Pod networking | Complex - requires route tables and UDRs on cluster subnet for Pod networking |
| Pod connectivity performance | On-the-wire performance at par with VMs in a VNet | Additional hop adds minor latency |
| Kubernetes Network Policies | Azure Network Policies | Calico |
| OS platforms supported | Linux only | Linux only |

## IP Address Planning
* **Cluster Nodes**: Cluster nodes go into a subnet in your VNet so ensure that you have a subnet big enough to account for future scale. A simple /24 subnet can host up to 251 nodes (the first three IP addresses in a subnet are reserved for management operations).

* **Pods**: The overlay solution assigns a /24 address space for Pods on every node from the private CIDR that you specify during cluster creation. The /24 size is fixed and cannot be increased or decreased. You can run up to 250 Pods on a node. When planning the Pod address space ensure that the private CIDR is large enough to provide /24 address spaces for new nodes when the cluster expands in future. 
The following are additional factors to consider when planning Pod address space
- Pod CIDR space must not overlap with the cluster subnet range.
- Pod CIDR space must not overlap with IP ranges used in on-premises networks and peered networks.
- The same Pod CIDR space can be used on multiple independent AKS clusters in the same VNet.

* **Kubernetes service address range**: The size of the Service address CIDR depends on the number of cluster services you plan to create. It must be smaller than /12. This range should also not overlap with the Pod CIDR range, cluster subnet range and Ip range used in peered VNets and on-premises networks.

* **Kubernetes DNS service IP address**: This is an IP address within the Kubernetes service address range that will be used by cluster service discovery. Don't use the first IP address in your address range. The first address in your subnet range is used for the kubernetes.default.svc.cluster.local address.

## Maximum pods per node
You can configure the maximum number of Pods per node at the time of cluster creation or when you add a new node pool. The default for Azure CNI Overlay is 30. The maximum value that you can specify for maximum Pods in Azure CNI Overlay is 250. The minimum value that you can specify is 10. The maximum Pods value configured during creation of a node pool applies to the nodes in that node pool only.

## Choosing a Network Model to use
Azure CNI offers two IP addressing options for Pods, one that assigns VNet IPs to Pods and Overlay. The choice of which option to use for your AKS cluster is usually a balance between flexibility and advanced configuration needs. The following considerations help outline when each network model may be the most appropriate.

Use Overlay option when:
* You have limited IP address space.
* Most of the pod communication is within the cluster.
* You don't need advanced AKS features, viz. virtual nodes.

Use VNet option when:
* You have available IP address space.
* Most of the pod communication is to resources outside of the cluster.
* Resources outside the cluster need to reach Pods directly.
* You need AKS advanced features, viz. virtual nodes.

## Limitations with Azure CNI Overlay
The Overlay solution has the following limitations today
* Only available for Linux and not for Windows.
* You cannot deploy multiple overlay clusters in the same subnet
* Overlay can be enabled only for new clusters. Existing (already deployed) clusters cannot be configured to use Overlay.
* You cannot use Application Gateway as an Ingress Controller (AGIC) for an overlay cluster.
* Calico policies dont work in overlay clusters.

## Steps to setup Overlay Clusters
The following example walks through the steps to create a new virtual network with a subnet for the cluster nodes and then creating an AKS cluster that uses Azure CNI Overlay. Be sure to replace the variables with your own values. 

First, opt into the feature by running the following command

```azurecli-interactive
az feature register --namespace Microsoft.ContainerService --name AzureOverlayPreview
```

Create a virtual network with a subnet for the cluster nodes

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

Create a cluster with Azure CNI Overlay. Use -network-plugin-mode to specify that this is an Overlay cluster. 

```azurecli-interactive
clusterName="myOverlayCluster"
subscription="aaaaaaa-aaaaa-aaaaaa-aaaa"

az aks create -n $clusterName -g $resourceGroup --location $location --network-plugin azure --network-plugin-mode overlay --pod-cidr 192.168.0.0/16 --vnet-subnet-id /subscriptions/$subscription /resourceGroups/$resourceGroup/providers/Microsoft.Network/virtualNetworks/$vnet/subnets/nodesubnet
```

## Frequently asked questions
* *How do Pods and cluster nodes communicate with each other*
  Pods and nodes talk to each other directly without any SNAT requirements.

* *Can I configure the size of the address space assigned to each space?*
  No, this is fixed at /24 today and cannot be changed.

* *Can I add more private Pod CIDRs to a cluster after the cluster has been created?*
  No, a private Pod CIDR can only be specified at the time of cluster creation.

* *What is the max nodes and Pods per cluster supported by Overlay?*
  The max scale in terms of nodes and Pods per cluster is the same as the max limits supported by AKS today.