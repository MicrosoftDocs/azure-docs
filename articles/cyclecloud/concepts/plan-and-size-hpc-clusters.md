---
title: Plan and Size HPC Clusters
description: Learn how to plan and size High Performance Computing (HPC) clusters in Azure CycleCloud, including scheduler, VM, autoscaling, storage, networking, and cost decisions.
author: padmalathas
ms.author: padmalathas
ms.date: 07/30/2026
ms.update-cycle: 3650-days
ms.topic: concept-article
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
# Customer intent: As an HPC administrator, I want to understand the decisions involved in planning and sizing an Azure CycleCloud cluster, so that I can build an environment that meets my workload, performance, and cost requirements.
---

# Plan and size HPC clusters in Azure CycleCloud

Before you create a cluster in Azure CycleCloud, plan how the cluster is structured and sized. Good planning decisions up front - about the scheduler, the virtual machine (VM) types, how the cluster scales, and how it stores and moves data - determine how well the cluster performs and how much it costs to run.

This article describes the main decisions to make when you plan an HPC cluster in CycleCloud. It complements [CycleCloud clusters and nodes](clusters.md), which explains what clusters, nodes, and node arrays are, and [Create a new cluster](../how-to/create-cluster.md), which walks through building a cluster from a template.

## Choose a scheduler

CycleCloud is scheduler-agnostic. It has built-in support for the schedulers that most HPC teams already use, and it adds autoscaling to each of them:

- Slurm
- PBS Professional
- IBM Spectrum LSF
- Altair Grid Engine
- HTCondor

Choose the scheduler that matches your existing workflows and job scripts so that you can move workloads to Azure with minimal change. If your organization uses a scheduler that isn't in the built-in list, you can integrate it with the CycleCloud autoscaling API. For more information, see [Scheduling in CycleCloud](scheduling.md).

## Choose VM families and sizes

The VM family and size you select for compute nodes have the largest effect on both performance and cost. Match the VM to the characteristics of your workload:

- **Tightly coupled (MPI) workloads** that exchange data between nodes benefit from HPC-optimized VMs with a low-latency InfiniBand interconnect, such as the [HPC VM sizes](/azure/virtual-machines/sizes-hpc).
- **GPU-accelerated workloads**, such as AI training or rendering, use [GPU-optimized VM sizes](/azure/virtual-machines/sizes-gpu).
- **Embarrassingly parallel or throughput workloads**, where tasks run independently, can use general-purpose or compute-optimized VMs and don't require a specialized interconnect.

For a full comparison of VM options, see [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes/overview).

Because a node array can span more than one virtual machine scale set, a single array can offer VMs of different sizes or families for the same role. This flexibility helps when your preferred VM size has limited capacity in a region. For more information, see [CycleCloud clusters and nodes](clusters.md).

## Size the cluster and plan for autoscaling

CycleCloud automatically scales the number of compute nodes based on the work queued in the scheduler, so you don't need to guess a fixed cluster size. Instead, plan the following boundaries:

- **Maximum size.** The cluster form limits how far a cluster autoscales, based on the total number of cores it can start. Set this limit to reflect the largest workload you expect and the quota available in the region.
- **Dedicated versus Spot nodes.** *Dedicated* nodes are reserved for your pool and give you predictable capacity. *Spot* nodes use surplus Azure capacity at a reduced price, but Azure can reclaim them when it needs the capacity back. Use dedicated nodes for time-sensitive or long-running jobs, and Spot nodes for fault-tolerant or restartable work where cost matters more than guaranteed availability.
- **Scale-down behavior.** Autoscaling removes idle nodes so that you stop paying for compute you aren't using. Confirm that your jobs write results to durable storage, because local data on a node is lost when the node is deallocated.

## Check quota, capacity, and region

The VMs you plan to use must be available, and within quota, in the region where you deploy:

- **Region.** Choose a region that offers the VM families your workload needs and that's close to your data and users. Not every VM family is available in every region.
- **Quota.** Core (vCPU) quotas are set per region and per VM family. Make sure your quota is high enough for the maximum cluster size you planned, and [request a quota increase](/azure/quotas/quickstart-increase-quota-portal) if needed.
- **Capacity.** Even within quota, HPC VM sizes can be constrained in a region at a given time. Consider a fallback VM size or an additional region for large or time-critical runs.

## Plan storage and networking

HPC jobs are often bound by how quickly they can read and write data, not just by compute:

- **Shared file systems.** Most HPC clusters need a shared file system that all nodes can mount. CycleCloud can deploy NFS servers and parallel file systems (for example, BeeGFS) as part of the cluster, and you can connect to managed services such as [Azure NetApp Files](/azure/azure-netapp-files/) or [Azure Managed Lustre](/azure/azure-managed-lustre/).
- **Interconnect.** Tightly coupled MPI jobs require the InfiniBand interconnect available on HPC-optimized VMs. Confirm that both the VM size and the region support it.
- **Networking.** Plan the virtual network and subnets that host the cluster, and ensure the CycleCloud application server has the outbound access it needs to manage nodes. For production guidance, see [Plan your production deployment](../how-to/plan-prod-deployment.md).

## Choose a cluster data path

How you get data onto compute nodes has a large effect on throughput and cost. Choose based on how your jobs read and write data:

| Option | Best for | Notes |
|---|---|---|
| **BlobFuse2 (streaming)** | Reading large datasets straight from Blob (AI training data, simulation inputs) at high throughput, with no standing file server | Per-node FUSE mount; not fully POSIX. See [Mount Azure Blob Storage on cluster nodes](../how-to/mount-blob-storage.md). |
| **Azure Managed Lustre** | Tightly coupled or I/O-intensive jobs that need a shared, POSIX parallel file system; can hydrate from Blob | Managed parallel file system. See [Azure Managed Lustre](/azure/azure-managed-lustre/). |
| **Azure HPC Cache** | Caching an existing NAS or Blob back end for read-heavy HPC, including hybrid and on-premises data | Distributed cache tier in front of storage. See [Azure HPC Cache](/azure/hpc-cache/hpc-cache-overview). |
| **Azure NetApp Files** | Low-latency shared NFS or SMB for EDA and general HPC home and scratch space | Managed file service. See [Azure NetApp Files](/azure/azure-netapp-files/). |

As a rule of thumb: use **BlobFuse2 streaming** when your data already lives in Blob and jobs mostly read it. Use a **shared or parallel file system** (Managed Lustre or NetApp Files) when jobs need cross-node coordination, POSIX semantics, or heavy shared writes. Use a **cache tier** (HPC Cache) when you need to accelerate access to an existing back end.

## Plan for cost

Compute costs are usually the largest expense in an HPC environment. Plan to control these costs by:

- Using autoscaling and Spot nodes to avoid paying for idle capacity.
- Right-sizing VMs to match the workload instead of defaulting to the largest option.
- Tracking spending through the built-in integration with [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management). For more information, see [Cost and usage tracking](usage-tracking.md).

## Next steps

- [CycleCloud clusters and nodes](clusters.md)
- [Scheduling in CycleCloud](scheduling.md)
- [Create a new cluster](../how-to/create-cluster.md)
- [Mount Azure Blob Storage on cluster nodes](../how-to/mount-blob-storage.md)
- [Plan your production deployment](../how-to/plan-prod-deployment.md)
