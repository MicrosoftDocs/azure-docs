---
title: Azure Operator Nexus Isolation Domains Configuration
description: Configuration for Isolation Domains for Azure Operator Nexus.
author: joemarshallmsft
ms.author: joemarshall
ms.reviewer: jdasari
ms.date: 01/29/2024
ms.service: azure-operator-nexus
ms.topic: reference
---

# Isolation Domain Configuration

## Layer 3 isolation domain restricted to within the fabric instance (E-W only traffic flows)

Creating a Layer-3 Isolation domain with internal networks (so only on the ToR) enables communication between workloads deployed across racks by exchanging routes with the fabric. A single isolation domain can have multiple BGP peerings, each on a separate VLAN. BGP peering IP addresses can be a single IPv4 or IPv6 address, or a subnet to facilitate peering from multiple dynamic workload instances. BFD parameters can also be configured for each BGP peering. Import and export route policies can be defined to enforce policies on exchanged routes.

## Layer 3 isolation domain that extends into the operator network (E-W + N-S traffic flows)

Creating a Layer-3 Isolation domain with an external network enables inter-rack and intra-rack communication between workloads deployed across racks as well as ability to exchange routes with the fabric and external networks via PE. North-bound peering with PE devices can be configured with either inter-AS option 10A or option 10B. When configured with inter-AS option 10B, route targets can be specified to segregate workload specific traffic. Multiple route-targets can be attached to prefixes.

This isolation domain enables deploying workloads that advertise external service IP addresses to PE devices via BGP, and load-balancing traffic across multiple instances. It also enables inserting workload services (Firewalls, DNS, IPs) between north-south layers as explained in an illustration in the next section.

## Tenant Networking Use Cases

AON is a platform that enables different types of communication between workloads:

-   East-West Communication: communication between workloads within the same AON instance, such as inter-k8s cluster communication for a 5G control plane.

-   External-Internal Communication: communication between workloads inside and outside the AON instance, such as north-south communication with option B, which involves inserting and scaling firewall and network address translation appliances, or north-south communication between a 5G user plane with control plane.

-   In-line Appliance Insertion: communication between workloads that requires passing through an appliance, such as virtual machine communication in a 4G core or appliance insertion between two virtual routing and forwarding domains on the customer edge.

The following diagram depicts an illustration of a typical multi-layer communication required for tenant network use cases.

:::image type="content" source="media/isolation-domain-multidomain-tenant-networking.png" alt-text="Overview of connectivity within and between racks in a multi-Isolation Domain deployment. ":::


In this scenario, the Operator deploys Worker 1 and Worker 2 workloads using Kubernetes. A layer-2 isolation domain (represented in green) is created to allow communication between these workloads. The NAT FW/OAM FW performs SNAT on the IP addresses of the worker services and advertises SNAT range towards the PE via the network fabric. To allow this, an L3 isolation domains is created (represented in orange) on links to CEs.

To ensure all traffic from the worker nodes 0/0 route is advertised in the green layer-2 isolation domain. The FW instances SNAT the traffic and inject the traffic into the orange L3 ID. One interface of the Firewall instances in above diagram is in the orange layer-3 isolation domain. Combination of green layer-2 isolation domain and orange layer-3 isolation domains enable connectivity within the fabric for various workloads with ability to route the traffic towards the PE.

To advertise reachability of the workloads to external networks, north-bound peering is enabled in orange L3 isolation domain. The red line in the diagram represents peering via inter-AS Option A where BGP peering is enabled between the PE and CE explicitly in the L3 Isolation domain. The black line in the diagram represents peering via MPLS inter-AS Option B where MP-BGP peering is enabled between the PE and CE and route targets are leveraged to segregate traffic across L3 isolation domains. Route policy options enable operators to manipulate routes exchanged in north-south directions.

The table below provides key dimensions for workloads planning

| **Feature** | **Details** |
|---|---|
| Layer 2 connectivity | Provides layer 2 networking capabilities within and across the racks. Flat L2 network spanning racks (L2 BGP EVPN). Supports multicast, broadcast. |
| Layer 3 connectivity             | Layer 3 North -- South and East -- West connectivity (L3 BGP EVPN). East-West Connectivity: Internal Network. Layer 3 Isolation Domains Internal Network enables workloads layer 3 communication for east-west and north -south communication within AON Network fabric. Layer 2 Isolation Domain internal networks realizes all uses cases requirement for inter and intra rack communication at layer 3 for compute workloads. Multiple internal networks can be configured for each isolation domain. Layer 3 Isolation Domains External Network enables workload to communicate with external services via provider network. Each layer 3 Isolation domain supports only one external network. |
| Routing Configuration            | BGP with connected subnets, static routing and BFD |
| IP Addressing Supported          | Dual Stack (IPv4 and IPv6) support |
| Configurable parameters          | VLANs, MTU, IPv4/IPv6 subnets, BGP. |
| Dynamic scale up and down        | Workloads networks can be created dynamically. L3 Isolation domain provides ability advertise redistributed routes. |

### Example scenarios and implementation- Isolation Domain Internal Networks

This Section provides examples of using  L3 isolation domains and internal networks using BGP and static routes with IPv4 and IPv6 addresses.

-   **Connected Subnet** Create a internal network for layer 3 communication for workloads. IPv4 and IPv6 are both supported. This option also enables the operator to specify single neighbor, multiple neighbor and listen range for communication with the subnet.

-   **Internal Network Multiple connected subnets IPv4** Create a internal network for layer 3 communication for workloads across multiple subnets. IPv4 and IPv6 are both supported. This option also enables the operator to specify single neighbor, multiple neighbor and listen range for communication with subnet.

The above options also give the operator the ability to send a default route to a neighbor or listen range. By default, no default route is advertised.

-   **Connected Subnet with Static Routes :** Create an internal network and define static routes for communication with a connected subnet. The operator has the option to configure an IPv4 or IPv6 route by defining an IP prefix and the next single or multi hop ip address. IPv4 and IPv6 are both supported. There is also an option to enable Bidirectional Forwarding Detection (BFD).

In all three cases, the internal network is associated with a Layer 3 isolation domain, allowing operators to apply route policy details, which can be referred to in aroute policy guide.