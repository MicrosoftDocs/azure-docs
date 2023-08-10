---
title: "Near Edge Compute Overview"
description: Compute SKUs and resources available in Azure Operator Nexus Near Edge.
author: mukeshdua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 05/22/2023
ms.custom: template-reference
---

# Near-edge Compute

Azure Operator Nexus offers a group of on-premises cloud solutions. One of the on-premises offering allows Telco operators to run the Network functions in a Near-edge environment. In near-edge environment (also known as 'instance'), the compute servers, also referred to as bare metal machines (BMMs), represents the physical machines in the rack, runs the CBL-Mariner operating system, and provides support for running high-performance workloads.

## SKUs available

The Nexus offering is today built with the following compute nodes for near-edge instances (the nodes that run the actual customer workloads).

| SKU                     | Description                            |
| ----------------------- | -------------------------------------- |
| Dell R750               | Compute node for Near Edge             |

## Compute connectivity

This diagram shows the connectivity model followed by computes in the near-edge instances:

:::image type="content" source="media/near-edge-compute.png" alt-text="Screenshot of Operator Nexus Compute Connectivity.":::

Figure: Operator Nexus Compute connectivity

## Compute configurations

Operator Nexus supports a range of geometries and configurations. This table specifies the resources available per Compute.

| Property                               | Specification/Description |
| -------------------------------------- | -------------------------|
| Number of vCPUs for Tenant usage       | 96 vCPUs hyper-threading enabled per compute server |
| Number of vCPU available for workloads | 2 - 48 vCPUs with even number of vCPUs only. No cross-NUMA VMs |
| CPU pinning                            | Default |
| RAM for running tenant workload        | 448 GB (224 GB per NUMA)  |
| Huge pages for Tenant workloads        | All VMs are backed by 1-GB huge pages |
| Disk (Ephemeral) per Compute           | Up to 3.5 TB per compute host |
| Data plane traffic path for workloads  | SR-IOV |
| Number of SR-IOV VFs                   | Max 32 vNICs (30 VFs available for tenant workloads per NUMA) |
| SR-IOV NIC support                     | Enabled on all 100G NIC ports VMs with virtual functions (VF) assigned out of Mellanox supported VF link aggregation (VF LAG). The allocated VFs are from the same physical NIC and within the same NUMA boundary. NIC ports providing VF LAG are connected to two different TOR switches for redundancy. Support for Trunked VFs RSS with Hardware Queuing. Supporting multi-queue support on VMs. |
| IPv4/IPv6 Support                      | Dual stack IPv4/IPv6, IPv4, and IPv6 only virtual machines |
