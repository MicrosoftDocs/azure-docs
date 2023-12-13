---
title: Azure Operator Nexus compute
description: Get an overview of compute resources for Azure Operator Nexus.
author: mukeshdua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 05/22/2023
ms.custom: template-concept
---

# Azure Operator Nexus compute

Azure Operator Nexus is built on basic constructs like compute servers, storage appliances, and network fabric devices. These compute servers, also called bare-metal machines (BMMs), represent the physical machines on the rack. They run the CBL-Mariner operating system and provide closed integration support for high-performance workloads.

These BMMs are deployed as part of the Azure Operator Nexus automation suite. They exist as nodes in a Kubernetes cluster to serve various virtualized and containerized workloads in the ecosystem.

Each BMM in an Azure Operator Nexus instance is represented as an Azure resource. Operators get access to perform various operations to manage the BMM's lifecycle like any other Azure resource.

## Key capabilities of Azure Operator Nexus compute

### NUMA alignment

Nonuniform memory access (NUMA) alignment is a technique to optimize performance and resource utilization in multiple-socket servers. It involves aligning memory and compute resources to reduce latency and improve data access within a server system.

Through the strategic placement of software components and workloads in a NUMA-aware way, Operators can enhance the performance of network functions, such as virtualized routers and firewalls. This placement leads to improved service delivery and responsiveness in their telco cloud environments.

By default, all the workloads deployed in an Azure Operator Nexus instance are NUMA aligned.

### CPU pinning

CPU pinning is a technique to allocate specific CPU cores to dedicated tasks or workloads, which helps ensure consistent performance and resource isolation. Pinning critical network functions or real-time applications to specific CPU cores allows operators to minimize latency and improve predictability in their infrastructure. This approach is useful in scenarios where strict quality-of-service requirements exist, because these tasks can receive dedicated processing power for optimal performance.

All of the virtual machines created for virtual network function (VNF) or containerized network function (CNF) workloads on Azure Operator Nexus compute are pinned to specific virtual cores. This pinning provides better performance and avoids CPU stealing.

### CPU isolation

CPU isolation provides a clear separation between the CPUs allocated for workloads and the CPUs allocated for control plane and platform activities. CPU isolation prevents interference and limits the performance predictability for critical workloads. By isolating CPU cores or groups of cores, operators can mitigate the effect of noisy neighbors. It helps guarantee the required processing power for latency-sensitive applications.

Azure Operator Nexus reserves a small set of CPUs for the host operating system and other platform applications. The remaining CPUs are available for running actual workloads.

### Huge page support

Huge page usage in telco workloads refers to the utilization of large memory pages, typically 2 MB or 1 GB in size, instead of the standard 4-KB pages. This approach helps reduce memory overhead and improves the overall system performance. It reduces the translation look-aside buffer (TLB) miss rate and improves memory access efficiency.

Telco workloads that involve large data sets or intensive memory operations, such as network packet processing, can benefit from huge page usage because it enhances memory performance and reduces memory-related bottlenecks. As a result, users see improved throughput and reduced latency.

All virtual machines created on Azure Operator Nexus can make use of either 2-MB or 1-GB huge pages, depending on the type of virtual machine.

### Dual-stack support

Dual-stack support refers to the ability of networking equipment and protocols to simultaneously handle both IPv4 and IPv6 traffic. With the depletion of available IPv4 addresses and the growing adoption of IPv6, dual-stack support is crucial for seamless transition and coexistence between the two protocols.

Telco operators use dual-stack support to ensure compatibility, interoperability, and future-proofing of their networks. It allows them to accommodate both IPv4 and IPv6 devices and services while gradually transitioning toward full IPv6 deployment.

Dual-stack support helps ensure uninterrupted connectivity and smooth service delivery to customers regardless of their network addressing protocols. Azure Operator Nexus provides support for both IPv4 and IPv6 configuration across all layers of the stack.

### Network interface cards

Computes in Azure Operator Nexus are designed to meet the requirements for running critical applications that are telco grade. They can perform fast and efficient data transfer between servers and networks.

Workloads can make use of single-root I/O virtualization (SR-IOV). SR-IOV enables the direct assignment of physical I/O resources, such as network interfaces, to virtual machines. This direct assignment bypasses the hypervisor's virtual switch layer.

This direct hardware access improves network throughput, reduces latency, and enables more efficient utilization of resources. It makes SR-IOV an ideal choice for operators running virtualized and containerized network functions.

## BMM status

The following properties reflect the operational state of a BMM:

- `Power State` indicates the state as derived from a bare-metal controller (BMC). The state can be either `On` or `Off`.

- `Ready State` provides an overall assessment of BMM readiness. It looks at a combination of `Detailed Status`, `Power State`, and the provisioning state of the resource to determine whether the BMM is ready or not. When `Ready State` is `True`, the BMM is turned on, `Detailed Status` is `Provisioned`, and the node that represents the BMM has successfully joined the undercloud Kubernetes cluster. If any of those conditions aren't met, `Ready State` is set to `False`.

- `Cordon State` reflects the ability to run any workloads on a machine. Valid values are `Cordoned` and `Uncordoned`. `Cordoned` seizes creation of any new workloads on the machine. `Uncordoned` ensures that workloads can now run on this BMM.

- `Detailed Status` reflects the current status of the machine:

  - `Preparing`: The machine is being prepared for provisioning.
  - `Provisioning`: Provisioning is in progress.
  - `Provisioned`: The operating system is provisioned to the machine.
  - `Available`: The machine is available to participate in the cluster. The machine was successfully provisioned but is currently turned off.
  - `Error`: The machine couldn't be provisioned.

  `Preparing` and `Provisioning` are transitory states. `Provisioned`, `Available`, and `Error` are end-state statuses.

## BMM operations

- **Update/Patch BareMetal Machine**: Update the BMM resource properties.
- **List/Show BareMetal Machine**: Retrieve BMM information.
- **Reimage BareMetal Machine**: Reprovision a BMM that matches the image version that's used across the cluster.
- **Replace BareMetal Machine**: Replace a BMM as part of an effort to service the machine.
- **Restart BareMetal Machine**: Restart a BMM.
- **Power Off BareMetal Machine**: Turn off a BMM.
- **Start BareMetal Machine**: Turn on a BMM.
- **Cordon BareMetal Machine**: Prevent scheduling of workloads on the specified BMM's Kubernetes node. Optionally, allow for evacuation of the workloads from the node.
- **Uncordon BareMetal Machine**: Allow scheduling of workloads on the specified BMM's Kubernetes node.
- **BareMetalMachine Validate**: Trigger hardware validation of a BMM.
- **BareMetalMachine Run**: Allow the customer to run a script specified directly in the input on the targeted BMM.
- **BareMetalMachine Run Data Extract**: Allow the customer to run one or more data extractions against a BMM.
- **BareMetalMachine Run Read-only**: Allow the customer to run one or more read-only commands against a BMM.

> [!NOTE]
> Customers can't create or delete BMMs directly. These machines are created only as the realization of the cluster lifecycle. Implementation blocks creation or deletion requests from any user, and it allows only internal/application-driven creation or deletion operations.

## Form-factor-specific information

Azure Operator Nexus offers a group of on-premises cloud solutions that cater to both [near-edge](reference-near-edge-compute.md) and far-edge environments.
