---
title: Monitor AKS traffic visibility using virtual network flow logs
titleSuffix: Azure Network Watcher
description: Learn how to enable AKS traffic visibility in Azure Network Watcher to monitor pod-to-pod, pod-to-service, and node-level network communication using virtual network flow logs.
author: srijanch
ms.author: srijanch
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 09/29/2026
---

# AKS traffic visibility using virtual network flow logs

Virtual network flow logs record IP traffic that passes through a virtual network. For Azure Kubernetes Service (AKS) workloads, flow logs can capture communication between pods, nodes, virtual machines, and external endpoints when the traffic traverses the virtual network. 
The IP addresses that appear in flow records depend on the AKS networking model used by the cluster.

> [!NOTE]
> Communication between two pods that run on the same node isn't captured. This traffic stays local to the host and never reaches the virtual network datapath, so no flow record is generated for it. This limitation applies to all AKS networking modes, including traffic that's sent through a service and routed to a pod on the same node.

This article covers:
  
- Understand which AKS traffic scenarios virtual network flow logs capture.
- Learn how pod and node IP addresses appear in flow records across different AKS networking models.
- Review limitations that affect traffic visibility and troubleshooting.
- Understand considerations when analyzing AKS workloads by using flow logs.
  
## Supported traffic
 
Flow logs record the following types of AKS traffic:

| Traffic type | Captured | Description |
| --- | --- | --- |
| Pod-to-pod across different nodes | Yes | Communication between pods that run on separate nodes. |
| Pod-to-pod on the same node | No | Traffic stays on the host and doesn't reach the virtual network datapath. |
| Pod-to-virtual machine | Yes | Communication between a pod and a virtual machine in the same virtual network. |
| Node-to-node | Yes | Communication between AKS nodes. |
| Node-to-virtual machine | Yes | Communication between an AKS node and a virtual machine in the same virtual network. |
| Traffic to and from external endpoints | Yes | Communication between AKS workloads and destinations outside the virtual network. |

> [!NOTE]
> Flow records contain IP addresses, not pod names. Pod IP addresses are reassigned as pods are created and deleted, so an IP address identifies a pod only at the time the flow was recorded.

## How pod and node IP addresses appear
 
AKS supports different networking models that determine how pods receive IP addresses and communicate within the cluster. 
Broadly, these models use either flat networking, where pods are directly addressable on the virtual network, or overlay networking, where pod IP addresses are managed separately and traffic might be translated before it reaches the virtual network datapath.
The networking model determines whether a pod IP address or a node IP address appears in the flow record.

- **Azure CNI node subnet** - Nodes and pods receive IP addresses from the same virtual network subnet. As a result, pod IP addresses appear directly in flow records.
- **Azure CNI overlay** - Nodes receive IP addresses from the virtual network subnet, and pods receive IP addresses from a separate pod CIDR. As a result, flow records might not always identify the individual pod involved in the communication and might instead show the corresponding node IP address.
- **Azure CNI pod subnet** - Pods receive IP addresses from a subnet that's separate from the node subnet. Pod IP addresses appear directly in flow records because pod traffic isn't translated to the node IP address.
 
## Limitations
 
Consider the following limitations when you analyze AKS traffic:
- Same-node pod-to-pod traffic isn't recorded. If two pods on the same node communicate, no flow record is generated. Don't rely on flow logs for intra-node communication.
- When a flow record shows a node IP address, pod-originated traffic can't be distinguished from node-originated traffic. As a result, it can't be determined whether the traffic originated from the node itself or from a pod running on that node.
- When pod traffic is translated to a node IP address, pod originated traffic cannot be differentiated from node traffic.
  
## Next steps

- [Virtual network flow logs overview](vnet-flow-logs-overview.md)
- [Create and manage virtual network flow logs](vnet-flow-logs-manage.md)
- [Log network traffic to and from a virtual network using the Azure portal](vnet-flow-logs-tutorial.md)
