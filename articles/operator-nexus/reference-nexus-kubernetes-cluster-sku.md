---
title: Azure Operator Nexus Kubernetes cluster VM SKUs
description: Learn about Azure Operator Nexus Kubernetes cluster SKUs
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 08/07/2024
ms.custom: template-reference
---

# Azure Operator Nexus Kubernetes cluster VM SKUs

The Azure Operator Nexus Kubernetes cluster VMs are grouped into node pools, which are collections of VMs that have the same configuration. The VMs in a node pool are used to run your Kubernetes workloads. The Azure Operator Nexus Kubernetes cluster supports the following VM SKUs. These SKUs are available in all Azure regions where the Azure Operator Nexus Kubernetes cluster is available.

There are three types of VM SKUs:

* General purpose
* Performance optimized
* Memory optimized

The primary difference between general-purpose and performance-optimized types of VMs is their approach to emulator thread isolation. VM SKUs optimized for performance have dedicated emulator threads, which allow each VM to operate at maximum efficiency. Conversely, general-purpose VM SKUs have emulator threads that run on the same processors as applications running inside the VM. For application workloads that cannot tolerate other workloads sharing their processors, we recommend using the performance-optimized SKUs. Memory-optimized SKUs allow application workloads with very large memory requirements to access resources from both NUMA cells within the physical machine. As these SKUs are highly resource intensive, it is recommended to use a smaller SKU if suitable for the application workload.

All these SKUs are having the following characteristics:

* Dedicated host-to-VM CPU mapping
* Reserved CPUs for Kubelet are 0 and 1, except for NC_G2_8_v1 and NC_P4_28_v1

The general purpose and performance optimized VM SKUs can be used for both worker and control plane nodes within the Azure Operator Nexus Kubernetes cluster. Memory optimized VM SKUs can only be used for worker nodes.

> [!NOTE]
> To use these VM SKUs, hardware compatibility should be considered. Operator Nexus offers two hardware options: BOM 1.7.3 and BOM 2.0 (More details [here](./reference-operator-nexus-skus.md#compute-skus)). The larger VM SKUs, specifically `NC_G56_224_v1`, `NC_P54_224_v1`, and `NC_E110_448_v1`, can only be supported on hardware BOM 2.0.
> 
> Nexus Tenant Kubernetes cluster VM SKUs are compatible with BOM 2.0, enabling users to use them alongside the larger VM SKUs. However, if a user tries to use BOM 2.0-specific VM SKUs on BOM 1.7.3 compute hardware, they will encounter an "insufficient resources" error during resource creation.

## General purpose VM SKUs

| VM SKU Name   | vCPU | Memory (GiB) | Root Disk (GiB) | Compatible Compute SKUs |
|---------------|------|--------------|-----------------|---------------------|
| NC_G56_224_v1 | 56   | 224          | 300             | 2.0             |
| NC_G48_224_v1 | 48   | 224          | 300             | 1.7.3, 2.0  |
| NC_G36_168_v1 | 36   | 168          | 300             | 1.7.3, 2.0  |
| NC_G24_112_v1 | 24   | 112          | 300             | 1.7.3, 2.0  |
| NC_G12_56_v1  | 12   | 56           | 300             | 1.7.3, 2.0  |
| NC_G6_28_v1   | 6    | 28           | 300             | 1.7.3, 2.0  |
| NC_G2_8_v1    | 2    | 8            | 300             | 1.7.3, 2.0  |

## Performance optimized VM SKUs

| VM SKU Name   | vCPU | Memory (GiB) | Root Disk (GiB) | Compatible Compute SKUs |
|---------------|------|--------------|-----------------|---------------------|
| NC_P54_224_v1 | 54   | 224          | 300             | 2.0             |
| NC_P46_224_v1 | 46   | 224          | 300             | 1.7.3, 2.0  |
| NC_P34_168_v1 | 34   | 168          | 300             | 1.7.3, 2.0  |
| NC_P22_112_v1 | 22   | 112          | 300             | 1.7.3, 2.0  |
| NC_P10_56_v1  | 10   | 56           | 300             | 1.7.3, 2.0  |
| NC_P4_28_v1   | 4    | 28           | 300             | 1.7.3, 2.0  |

## Memory optimized VM SKUs

| VM SKU Name   | vCPU | Memory (GiB) | Root Disk (GiB) | Compatible Compute SKUs |
|---------------|------|--------------|-----------------|---------------------|
| NC_E110_448_v1| 110  | 448          | 300             | 2.0             |
| NC_E94_448_v1 | 94   | 448          | 300             | 1.7.3, 2.0  |
| NC_E70_336_v1 | 70   | 336          | 300             | 1.7.3, 2.0  |

## Next steps

Try these SKUs in the Azure Operator Nexus Kubernetes cluster. For more information, see [Quickstart: Deploy an Azure Operator Nexus Kubernetes cluster](./quickstarts-kubernetes-cluster-deployment-bicep.md).
