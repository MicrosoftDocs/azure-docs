---
title: Azure Operator Nexus Kubernetes cluster VM SKUs
description: Learn about Azure Operator Nexus Kubernetes cluster SKUs
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 08/11/2023
ms.custom: template-reference
---

# Azure Operator Nexus Kubernetes cluster VM SKUs

The Azure Operator Nexus Kubernetes cluster VMs are grouped into node pools, which are collections of VMs that have the same configuration. The VMs in a node pool are used to run your Kubernetes workloads. The Azure Operator Nexus Kubernetes cluster supports the following VM SKUs. These SKUs are available in all Azure regions where the Azure Operator Nexus Kubernetes cluster is available.

There are two types of VM SKUs:

* General purpose
* Performance optimized

The primary difference between the two types of VMs is their approach to emulator thread isolation. VM SKUs optimized for performance have dedicated emulator threads, which allow each VM to operate at maximum efficiency. Conversely, general-purpose VM SKUs have emulator threads that run on the same processors as applications running inside the VM. For application workloads that cannot tolerate other workloads sharing their processors, we recommend using the performance-optimized SKUs.

All these SKUs are having the following characteristics:

- Dedicated host-to-VM CPU mapping
- Reserved CPUs for Kubelet are 0 and 1, except for NC_G2_8_v1 and NC_P4_28_v1

These VM SKUs can be used for both worker and control plane nodes within the Azure Operator Nexus Kubernetes cluster.

## General purpose VM SKUs

| VM SKU Name   | vCPU | Memory (GiB) | Root Disk (GiB) |
|---------------|----------------|------------|------------------|
| NC_G48_224_v1 | 48             | 224        | 300              |
| NC_G36_168_v1 | 36             | 168        | 300              |
| NC_G24_112_v1 | 24             | 112        | 300              |
| NC_G12_56_v1  | 12             | 56         | 300              |
| NC_G6_28_v1   | 6              | 28         | 300              |
| NC_G2_8_v1    | 2              | 8          | 300              |

## Performance optimized VM SKUs

| VM SKU Name   | vCPU | Memory (GiB) | Root Disk (GiB) |
|---------------|----------------|------------|------------------|
| NC_P46_224_v1 | 46             | 224        | 300              |
| NC_P34_168_v1 | 34             | 168        | 300              |
| NC_P22_112_v1 | 22             | 112        | 300              |
| NC_P10_56_v1  | 10             | 56         | 300              |
| NC_P4_28_v1   | 4              | 28         | 300              |

## Next steps

Try these SKUs in the Azure Operator Nexus Kubernetes cluster. For more information, see [Quickstart: Deploy an Azure Operator Nexus Kubernetes cluster](./quickstarts-kubernetes-cluster-deployment-bicep.md).
