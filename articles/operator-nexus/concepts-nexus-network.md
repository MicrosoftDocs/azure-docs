---
title: "Azure Operator Nexus: Nexus Workload Network"
description: Introduction to Workload networks core concepts.
author: leijgao
ms.author: leijiagao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 04/25/2024
ms.custom: template-concept
---

# Nexus workload Network Overview

This article describes core concepts of Nexus workload networks, and introduction to options to configure nexus workload networks with critical properties.
Nexus workload network enables application connect with on-premises network and other services over Azure public cloud. It supports operator use cases with
standard industry technologies that are reliable, predictable, and familiar to operators and network equipment providers.

Nexus offers several top-level API resources that categorically represent different types of networks with different input expectations.  
These network types represent logical attachments but also Layer3 information as well.  Essentially, they encapsulate how the customer 
wishes those networks are to be exposed within their cluster.

## Nexus workload network types

 * L3Network: The Nexus workload L3Network resource can be shared and reused across standalone virtual machines and Nexus Kubernetes clusters. Its primary purpose is to define a network that supports Layer 3 properties, which are coordinated between the virtualized workloads and the integrated Nexus Managed Fabric L3IsolationDomain. Additionally, it provides DualStack allocation capabilities (both IPv4 and IPv6) and directly references Azure Managed Network Fabric resources representing the VRF and VLAN associated with this network

 * L2Network: The Nexus workload L2Network resource can be shared and reused across standalone virtual machines and Nexus AKS clusters. Its primary purpose is to grant direct access to a specific Nexus Managed Fabric L2IsolationDomain, enabling isolated network attachment within the Nexus Cluster. Customers utilize L2Network resources when they want the fabric to carry a VLAN across workloads without participating in Layer 3 on that network.

 * TrunkedNetwork: The Nexus workload TrunkedNetwork resource allows association with multiple IsolationDomains, enabling customers to create a custom VLAN trunk range that workloads can access. The TrunkedNetwork defines the allowable VLAN set that workloads can directly tag traffic on. Tagged traffic for VLANs not specified in the TrunkedNetwork resource will be dropped. This custom VLAN trunk range can span across the same IsolationDomain or multiple L3IsolationDomains and/or L2IsolationDomains.

## Nexus workload network plugins

Network plugin is the feature to configuration how applications use the underlying Networks when attaching networks to application VMs or Pods.
The type of plugins supported for different network types. 

| Plugin Name | Available Network Types |
|---------------------|---------------|
|SRIOV|L2Network, L3Network, TrunkedNetwork|
|DPDK|L2Network, L3Network, TrunkedNetwork|
|MACVLAN|L2Network, L3Network, TrunkedNetwork|
|IPVLAN|L3Network, TrunkedNetwork|
|OSDev|L2Network, L3Network, TrunkedNetwork|

 * SRIOV: The SRIOV plugin generates a network attachment definition named after the corresponding network resource. This interface is integrated into a sriov-dp-config resource, 
which is linked to by the network attachment definition. If a network is connected to the cluster multiple times, all interfaces will be available for scheduling via the network 
attachment definition. No IP assignment is made to this type of interface within the node operating system.

 * DPDK: Configured specifically for DPDK workloads, the DPDK plugin type creates a network attachment definition that mirrors the associated network resource. This interface is 
placed within a sriov-dp-config resource, which the network attachment definition references. Multiple connections of the same network to the cluster make all interfaces schedulable 
through the network attachment definition. Depending on the hardware of the platform, the interface might be linked to a specific driver to support DPDK processing. Like SRIOV, this 
interface doesn't receive an IP assignment within the node operating system.

 * OSDevice: The OSDevice plugin type is tailored for direct use within the node operating system, rather than Kubernetes. It acquires a network configuration that is visible and 
functional within the node’s operating system network namespace. This plugin is suitable for instances where direct communication over this network from the node’s OS is required.

 * IPVLAN: The IPVLAN plugin type helps the creation of a network attachment definition named according to the associated network resource. This interface allows for the efficient 
routing of traffic in environments where network isolation is required without the need for multiple physical network interfaces. It operates by assigning multiple IP addresses to a 
single network interface, each behaving as if it is on a separate physical device. Despite the separation at the IP layer, this type doesn't handle separate MAC addresses, and it doesn't provide IP assignments within the node operating system.

 * MACVLAN: The MACVLAN plugin type generates a network attachment definition reflective of the linked network resource. This interface type creates multiple virtual networks interfaces 
each with a unique MAC address over a single physical network interface. It's useful in scenarios where applications running in containers need to appear as physically 
separate on the network for security or compliance reasons. Each interface behaves as if it's directly connected to the physical network, which allows for IP assignments within the 
node operating system.

## Nexus Network IPAM

Nexus Kubernetes offers IP Address Management (IPAM) solutions in various forms. For standalone virtual machines(VNF workload) or Nexus kubernetes nodes(CNF workload) connected to a Nexus network supporting Layer 3, 
an IPAM system is employed that covers multiple clusters. This system ensures unique IP addresses across both VMs and Nexus Kubernetes nodes within network VM interfaces inside VM operating 
systems. Additionally, when these networks are utilized for containerized workloads, Network Attachment Definitions (NADs) automatically generated by Nexus kubernetes cluster incorporate this IPAM feature. 
This same cross-cluster IPAM capability is used to guarantee that containers connected to the same networks receive unique IP addresses as well.

## Nexus Relay

Nexus Kubernetes utilizes the [Arc](../azure-arc/overview.md) [Azure Relay](../azure-relay/relay-what-is-it.md) functionality by integrating the Nexus kubernetes Hybrid Relay infrastructure in each region where the Nexus Cluster service operates.
This setup uses dedicated Nexus relay infrastructure within Nexus owned subscriptions, ensuring that Nexus kubernetes cluster Arc Connectivity doesn't rely on shared public relay networks.

Each Nexus kubernetes cluster and node instance is equipped with its own relay, and customers can manage Network ACL rules through the Nexus Cluster Azure Resource Manager APIs. These rules determine which networks can access both the az connectedk8s proxy and az ssh for their Nexus Arc resources within that specific on-premises Nexus Cluster. This feature enhances operator security by adhering to security protocols established after previous Arc/Relay security incidents, requiring remote Arc connectivity to have customer-defined network filters or ACLs.

