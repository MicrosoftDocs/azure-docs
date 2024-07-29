---
title: Concepts - Azure CNI Overlay networking in AKS
description: Learn about Azure CNI Overlay in Azure Kubernetes Service (AKS)
ms.topic: conceptual
ms.date: 05/14/2024
author: schaffererin
ms.author: schaffererin

ms.custom: fasttrack-edit
---

# Azure Container Networking Interface (CNI) Overlay networking


With Azure CNI Overlay, the cluster nodes are deployed into an Azure Virtual Network (VNet) subnet. Pods are assigned IP addresses from a private CIDR logically different from the VNet hosting the nodes. Pod and node traffic within the cluster use an Overlay network. Network Address Translation (NAT) uses the node's IP address to reach resources outside the cluster. This solution saves a significant amount of VNet IP addresses and enables you to scale your cluster to large sizes. An extra advantage is that you can reuse the private CIDR in different AKS clusters, which extends the IP space available for containerized applications in Azure Kubernetes Service (AKS).

## Overview of Overlay networking

In Overlay networking, only the Kubernetes cluster nodes are assigned IPs from subnets. Pods receive IPs from a private CIDR provided at the time of cluster creation. Each node is assigned a `/24` address space carved out from the same CIDR. Extra nodes created when you scale out a cluster automatically receive `/24` address spaces from the same CIDR. Azure CNI assigns IPs to pods from this `/24` space.

A separate routing domain is created in the Azure Networking stack for the pod's private CIDR space, which creates an Overlay network for direct communication between pods. There's no need to provision custom routes on the cluster subnet or use an encapsulation method to tunnel traffic between pods, which provides connectivity performance between pods on par with VMs in a VNet. Workloads running within the pods are not even aware that network address manipulation is happening.

:::image type="content" source="media/azure-cni-Overlay/azure-cni-overlay.png" alt-text="A diagram showing two nodes with three pods each running in an Overlay network. Pod traffic to endpoints outside the cluster is routed via NAT.":::

Communication with endpoints outside the cluster, such as on-premises and peered VNets, happens using the node IP through NAT. Azure CNI translates the source IP (Overlay IP of the pod) of the traffic to the primary IP address of the VM, which enables the Azure Networking stack to route the traffic to the destination. Endpoints outside the cluster can't connect to a pod directly. You have to publish the pod's application as a Kubernetes Load Balancer service to make it reachable on the VNet.

You can provide outbound (egress) connectivity to the internet for Overlay pods using a [Standard SKU Load Balancer](./egress-outboundtype.md#outbound-type-of-loadbalancer) or [Managed NAT Gateway](./nat-gateway.md). You can also control egress traffic by directing it to a firewall using [User Defined Routes on the cluster subnet](./egress-outboundtype.md#outbound-type-of-userdefinedrouting).

You can configure ingress connectivity to the cluster using an ingress controller, such as Nginx or [HTTP application routing](./http-application-routing.md). You cannot configure ingress connectivity using Azure App Gateway. For details see [Limitations with Azure CNI Overlay](#limitations-with-azure-cni-overlay).

## Differences between kubenet and Azure CNI Overlay

The following table provides a detailed comparison between kubenet and Azure CNI Overlay:

| Area                         | Azure CNI Overlay                                            | kubenet                                                                       |
|------------------------------|--------------------------------------------------------------|-------------------------------------------------------------------------------|
| Cluster scale                | 5000 nodes and 250 pods/node                                 | 400 nodes and 250 pods/node                                                   |
| Network configuration        | Simple - no extra configurations required for pod networking | Complex - requires route tables and UDRs on cluster subnet for pod networking |
| Pod connectivity performance | Performance on par with VMs in a VNet                        | Extra hop adds minor latency                                                  |
| Kubernetes Network Policies  | Azure Network Policies, Calico, Cilium                       | Calico                                                                        |
| OS platforms supported       | Linux and Windows Server 2022, 2019                          | Linux only                                                                    |

## IP address planning

### Cluster nodes

When setting up your AKS cluster, make sure your VNet subnets have enough room to grow for future scaling. You can assign each node pool to a dedicated subnet.

A `/24` subnet can fit up to 251 nodes since the first three IP addresses are reserved for management tasks.

### Pods

The Overlay solution assigns a `/24` address space for pods on every node from the private CIDR that you specify during cluster creation. The `/24` size is fixed and can't be increased or decreased. You can run up to 250 pods on a node. 

When planning IP address space for pods, consider the following factors:

* Ensure the private CIDR is large enough to provide `/24` address spaces for new nodes to support future cluster expansion.
* The same pod CIDR space can be used on multiple independent AKS clusters in the same VNet.
* Pod CIDR space must not overlap with the cluster subnet range.
* Pod CIDR space must not overlap with directly connected networks (like VNet peering, ExpressRoute, or VPN). If external traffic has source IPs in the podCIDR range, it needs translation to a non-overlapping IP via SNAT to communicate with the cluster.

### Kubernetes service address range

The size of the service address CIDR depends on the number of cluster services you plan to create. It must be smaller than `/12`. This range shouldn't overlap with the pod CIDR range, cluster subnet range, and IP range used in peered VNets and on-premises networks.

### Kubernetes DNS service IP address

This IP address is within the Kubernetes service address range used by cluster service discovery. Don't use the first IP address in your address range, as this address is used for the `kubernetes.default.svc.cluster.local` address.

## Network security groups

Pod to pod traffic with Azure CNI Overlay isn't encapsulated, and subnet [network security group][nsg] rules are applied. If the subnet NSG contains deny rules that would impact the pod CIDR traffic, make sure the following rules are in place to ensure proper cluster functionality (in addition to all [AKS egress requirements][aks-egress]):

- Traffic from the node CIDR to the node CIDR on all ports and protocols
- Traffic from the node CIDR to the pod CIDR on all ports and protocols (required for service traffic routing)
- Traffic from the pod CIDR to the pod CIDR on all ports and protocols (required for pod to pod and pod to service traffic, including DNS)

Traffic from a pod to any destination outside of the pod CIDR block utilizes SNAT to set the source IP to the IP of the node where the pod runs.

If you wish to restrict traffic between workloads in the cluster, we recommend using [network policies][aks-network-policies].

## Maximum pods per node

You can configure the maximum number of pods per node at the time of cluster creation or when you add a new node pool. The default and maximum value for Azure CNI Overlay is 250., and the minimum value is 10. The maximum pods per node value configured during creation of a node pool applies to the nodes in that node pool only.

## Choosing a network model to use

Azure CNI offers two IP addressing options for pods: The traditional configuration that assigns VNet IPs to pods and Overlay networking. The choice of which option to use for your AKS cluster is a balance between flexibility and advanced configuration needs. The following considerations help outline when each network model might be the most appropriate.

**Use Overlay networking when**:

- You would like to scale to a large number of pods, but have limited IP address space in your VNet.
- Most of the pod communication is within the cluster.
- You don't need advanced AKS features, such as virtual nodes.

**Use the traditional VNet option when**:

- You have available IP address space.
- Most of the pod communication is to resources outside of the cluster.
- Resources outside the cluster need to reach pods directly.
- You need AKS advanced features, such as virtual nodes.

## Limitations with Azure CNI Overlay

Azure CNI Overlay has the following limitations:

- You can't use Application Gateway as an Ingress Controller (AGIC).
- Virtual Machine Availability Sets (VMAS) aren't supported.
- You can't use [DCsv2-series](/azure/virtual-machines/dcv2-series) virtual machines in node pools. To meet Confidential Computing requirements, consider using [DCasv5 or DCadsv5-series confidential VMs](/azure/virtual-machines/dcasv5-dcadsv5-series) instead.
- If you're using your own subnet to deploy the cluster, the names of the subnet, VNet, and resource group containing the VNet, must be 63 characters or less. These names will be used as labels in AKS worker nodes and are subject to [Kubernetes label syntax rules](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set).  

<!-- LINKS - Internal -->
[aks-egress]: limit-egress-traffic.md
[aks-network-policies]: use-network-policies.md
[nsg]: ../virtual-network/network-security-groups-overview.md
