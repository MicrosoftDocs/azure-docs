---
title: Configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS)
description: Learn how to configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS), including deploying an AKS cluster into an existing virtual network and subnet.
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.topic: how-to
ms.custom: references_regions, devx-track-azurecli
ms.date: 08/07/2023
---

# Configure Azure CNI Overlay networking in Azure Kubernetes Service (AKS)

The traditional [Azure Container Networking Interface (CNI)](./configure-azure-cni.md) assigns a VNet IP address to every pod. It assigns this IP address from a prereserved set of IPs on every node *or* a separate subnet reserved for pods. This approach requires IP address planning and could lead to address exhaustion, which introduces difficulties scaling your clusters as your application demands grow.

With Azure CNI Overlay, the cluster nodes are deployed into an Azure Virtual Network (VNet) subnet. Pods are assigned IP addresses from a private CIDR logically different from the VNet hosting the nodes. Pod and node traffic within the cluster use an Overlay network. Network Address Translation (NAT) uses the node's IP address to reach resources outside the cluster. This solution saves a significant amount of VNet IP addresses and enables you to scale your cluster to large sizes. An extra advantage is that you can reuse the private CIDR in different AKS clusters, which extends the IP space available for containerized applications in Azure Kubernetes Service (AKS).

## Overview of Overlay networking

In Overlay networking, only the Kubernetes cluster nodes are assigned IPs from a subnet. Pods receive IPs from a private CIDR provided at the time of cluster creation. Each node is assigned a `/24` address space carved out from the same CIDR. Extra nodes created when you scale out a cluster automatically receive `/24` address spaces from the same CIDR. Azure CNI assigns IPs to pods from this `/24` space.

A separate routing domain is created in the Azure Networking stack for the pod's private CIDR space, which creates an Overlay network for direct communication between pods. There's no need to provision custom routes on the cluster subnet or use an encapsulation method to tunnel traffic between pod, which provides connectivity performance between pods on par with VMs in a VNet.

:::image type="content" source="media/azure-cni-Overlay/azure-cni-overlay.png" alt-text="A diagram showing two nodes with three pods each running in an Overlay network. Pod traffic to endpoints outside the cluster is routed via NAT.":::

Communication with endpoints outside the cluster, such as on-premises and peered VNets, happens using the node IP through NAT. Azure CNI translates the source IP (Overlay IP of the pod) of the traffic to the primary IP address of the VM, which enables the Azure Networking stack to route the traffic to the destination. Endpoints outside the cluster can't connect to a pod directly. You have to publish the pod's application as a Kubernetes Load Balancer service to make it reachable on the VNet.

You can provide outbound (egress) connectivity to the internet for Overlay pods using a [Standard SKU Load Balancer](./egress-outboundtype.md#outbound-type-of-loadbalancer) or [Managed NAT Gateway](./nat-gateway.md). You can also control egress traffic by directing it to a firewall using [User Defined Routes on the cluster subnet](./egress-outboundtype.md#outbound-type-of-userdefinedrouting).

You can configure ingress connectivity to the cluster using an ingress controller, such as Nginx or [HTTP application routing](./http-application-routing.md).

## Differences between Kubenet and Azure CNI Overlay

Like Azure CNI Overlay, Kubenet assigns IP addresses to pods from an address space logically different from the VNet, but it has scaling and other limitations. The below table provides a detailed comparison between Kubenet and Azure CNI Overlay. If you don't want to assign VNet IP addresses to pods due to IP shortage, we recommend using Azure CNI Overlay.

| Area                         | Azure CNI Overlay                                                | Kubenet                                                                       |
|------------------------------|------------------------------------------------------------------|-------------------------------------------------------------------------------|
| Cluster scale                | 1000 nodes and 250 pods/node                                     | 400 nodes and 250 pods/node                                                   |
| Network configuration        | Simple - no extra configurations required for pod networking | Complex - requires route tables and UDRs on cluster subnet for pod networking |
| Pod connectivity performance | Performance on par with VMs in a VNet                            | Extra hop adds minor latency                                             |
| Kubernetes Network Policies  | Azure Network Policies, Calico, Cilium                           | Calico                                                                        |
| OS platforms supported       | Linux and Windows Server 2022(Preview)                           | Linux only                                                                    |

## IP address planning

- **Cluster Nodes**: When setting up your AKS cluster, make sure your VNet subnet has enough room to grow for future scaling. Keep in mind that clusters can't scale across subnets, but you can always add new node pools in another subnet within the same VNet for extra space. A `/24`subnet can fit up to 251 nodes since the first three IP addresses are reserved for management tasks.
- **Pods**: The Overlay solution assigns a `/24` address space for pods on every node from the private CIDR that you specify during cluster creation. The `/24` size is fixed and can't be increased or decreased. You can run up to 250 pods on a node. When planning the pod address space, ensure the private CIDR is large enough to provide `/24` address spaces for new nodes to support future cluster expansion.
  - When planning IP address space for pods, consider the following factors:
    - Pod CIDR space must not overlap with the cluster subnet range.
    - Pod CIDR space must not overlap with IP ranges used in on-premises networks and peered networks.
    - The same pod CIDR space can be used on multiple independent AKS clusters in the same VNet.
- **Kubernetes service address range**: The size of the service address CIDR depends on the number of cluster services you plan to create. It must be smaller than `/12`. This range shouldn't overlap with the pod CIDR range, cluster subnet range, and IP range used in peered VNets and on-premises networks.
- **Kubernetes DNS service IP address**: This IP address is within the Kubernetes service address range that's used by cluster service discovery. Don't use the first IP address in your address range, as this address is used for the `kubernetes.default.svc.cluster.local` address.

## Network security groups

Pod to pod traffic with Azure CNI Overlay isn't encapsulated, and subnet [network security group][nsg] rules are applied. If the subnet NSG contains deny rules that would impact the pod CIDR traffic, make sure the following rules are in place to ensure proper cluster functionality (in addition to all [AKS egress requirements][aks-egress]):

- Traffic from the node CIDR to the node CIDR on all ports and protocols
- Traffic from the node CIDR to the pod CIDR on all ports and protocols (required for service traffic routing)
- Traffic from the pod CIDR to the pod CIDR on all ports and protocols (required for pod to pod and pod to service traffic, including DNS)

Traffic from a pod to any destination outside of the pod CIDR block utilizes SNAT to set the source IP to the IP of the node where the pod runs.

If you wish to restrict traffic between workloads in the cluster, we recommend using [network policies][aks-network-policies].

## Maximum pods per node

You can configure the maximum number of pods per node at the time of cluster creation or when you add a new node pool. The default for Azure CNI Overlay is 30. The maximum value you can specify in Azure CNI Overlay is 250, and the minimum value is 10. The maximum pods per node value configured during creation of a node pool applies to the nodes in that node pool only.

## Choosing a network model to use

Azure CNI offers two IP addressing options for pods: the traditional configuration that assigns VNet IPs to pods and Overlay networking. The choice of which option to use for your AKS cluster is a balance between flexibility and advanced configuration needs. The following considerations help outline when each network model may be the most appropriate.

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

- You can't use Application Gateway as an Ingress Controller (AGIC) for an Overlay cluster.
- Virtual Machine Availability Sets (VMAS) aren't supported for Overlay.
- Dual stack networking isn't supported in Overlay.
- You can't use [DCsv2-series](/azure/virtual-machines/dcv2-series) virtual machines in node pools. To meet Confidential Computing requirements, consider using [DCasv5 or DCadsv5-series confidential VMs](/azure/virtual-machines/dcasv5-dcadsv5-series) instead.

## Set up Overlay clusters

> [!NOTE]
> You must have CLI version 2.48.0 or later to use the `--network-plugin-mode` argument. For Windows, you must have the latest aks-preview Azure CLI extension installed and can follow the instructions below.

Create a cluster with Azure CNI Overlay using the [`az aks create`][az-aks-create] command. Make sure to use the argument `--network-plugin-mode` to specify an overlay cluster. If the pod CIDR isn't specified, then AKS assigns a default space: `viz. 10.244.0.0/16`.

```azurecli-interactive
clusterName="myOverlayCluster"
resourceGroup="myResourceGroup"
location="westcentralus"

az aks create -n $clusterName -g $resourceGroup --location $location --network-plugin azure --network-plugin-mode overlay --pod-cidr 192.168.0.0/16
```

## Upgrade an existing cluster to CNI Overlay

> [!NOTE]
> You can update an existing Azure CNI cluster to Overlay if the cluster meets the following criteria:
>
> - The cluster is on Kubernetes version 1.22+.
> - Doesn't use the dynamic pod IP allocation feature.
> - Doesn't have network policies enabled.
> - Doesn't use any Windows node pools with docker as the container runtime.
 
> [!WARNING]
> Prior to Windows OS Build 20348.1668, there was a limitation around Windows Overlay pods incorrectly SNATing packets from host network pods, which had a more detrimental effect for clusters upgrading to Overlay. To avoid this issue, **use Windows OS Build greater than or equal to 20348.1668**.

> [!WARNING]
> If using a custom azure-ip-masq-agent config to include additional IP ranges that should not SNAT packets from pods, upgrading to Azure CNI Overlay may break connectivity to these ranges. Pod IPs from the overlay space will not be reachable by anything outside the cluster nodes.
> Additionally, for sufficiently old clusters there may be a ConfigMap left over from a previous version of azure-ip-masq-agent. If this ConfigMap, named `azure-ip-masq-agent-config`, exists and is not intetionally in-place it should be deleted before running the update command.
> If not using a custom ip-masq-agent config, only the `azure-ip-masq-agent-config-reconciled` ConfigMap should exist with respect to Azure ip-masq-agent ConfigMaps and this will be updated automatically during the upgrade process.

The upgrade process triggers each node pool to be re-imaged simultaneously. Upgrading each node pool separately to Overlay isn't supported. Any disruptions to cluster networking are similar to a node image upgrade or Kubernetes version upgrade where each node in a node pool is re-imaged.

Update an existing Azure CNI cluster to use Overlay using the [`az aks update`][az-aks-update] command.

```azurecli-interactive
clusterName="myOverlayCluster"
resourceGroup="myResourceGroup"
location="westcentralus"

az aks update --name $clusterName \
--resource-group $resourceGroup \
--network-plugin-mode overlay \
--pod-cidr 192.168.0.0/16
```

The `--pod-cidr` parameter is required when upgrading from legacy CNI because the pods need to get IPs from a new overlay space, which doesn't overlap with the existing node subnet. The pod CIDR also can't overlap with any VNet address of the node pools. For example, if your VNet address is *10.0.0.0/8*, and your nodes are in the subnet *10.240.0.0/16*, the `--pod-cidr` can't overlap with *10.0.0.0/8* or the existing service CIDR on the cluster.

## Next steps

To learn how to utilize AKS with your own Container Network Interface (CNI) plugin, see [Bring your own Container Network Interface (CNI) plugin](use-byo-cni.md).

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[aks-egress]: limit-egress-traffic.md
[aks-network-policies]: use-network-policies.md
[nsg]: ../virtual-network/network-security-groups-overview.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
