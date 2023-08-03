---
title: "Near-edge compute overview"
description: Learn about compute SKUs and resources available in near-edge Azure Operator Nexus instances.
author: mukeshdua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 05/22/2023
ms.custom: template-reference
---

# Near-edge compute

Azure Operator Nexus offers a group of on-premises cloud solutions. One of the on-premises offering allows telco operators to run the network functions in a near-edge environment. In near-edge environment (also known as an instance), the compute servers (also known as bare metal machines), represent the physical machines in the rack. They run the CBL-Mariner operating system and provide support for running high-performance workloads.

## SKUs available

The Azure Operator Nexus offering is built with the following compute nodes for near-edge instances (the nodes that run the actual customer workloads).

| SKU                     | Description                            |
| ----------------------- | -------------------------------------- |
| Dell R750               | Compute node for near edge             |

## Compute connectivity

This diagram shows the connectivity model followed by computes in the near-edge instances:

:::image type="content" source="media/near-edge-compute.png" alt-text="Diagram of Azure Operator Nexus compute connectivity.":::

## Compute configurations

Azure Operator Nexus supports a range of geometries and configurations. This table specifies the resources available per compute.

| Property                               | Specification/Description |
| -------------------------------------- | -------------------------|
| Number of vCPUs for tenant usage       | 96 vCPUs hyper-threading enabled per compute server |
| Number of vCPUs available for workloads | 2 to 48 vCPUs, with an even number of vCPUs only. No cross-NUMA VMs. |
| CPU pinning                            | Default |
| RAM for running tenant workload        | 448 GB (224 GB per NUMA)  |
| Huge pages for tenant workloads        | All VMs are backed by 1-GB huge pages |
| Disk (ephemeral) per compute           | Up to 3.5 TB per compute host |
| Data plane traffic path for workloads  | SR-IOV |
| Number of SR-IOV VFs                   | Max 32 vNICs (30 VFs available for tenant workloads per NUMA) |
| SR-IOV NIC support                     | Enabled on all 100G NIC ports VMs with virtual functions (VF) assigned out of Mellanox supported VF link aggregation (VF LAG). The allocated VFs are from the same physical NIC and within the same NUMA boundary. NIC ports providing VF LAG are connected to two different TOR switches for redundancy. Support for Trunked VFs RSS with hardware queuing. Supporting multi-queue support on VMs. |
| IPv4/IPv6 support                      | Dual-stack IPv4/IPv6, IPv4, and IPv6-only virtual machines |
