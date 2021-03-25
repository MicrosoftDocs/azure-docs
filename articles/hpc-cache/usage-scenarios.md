---
title: Azure HPC Cache scenarios
description: Describes how to know whether your computing job works well with Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 03/24/2021
ms.author: v-erkel
---

# Is your job a good fit for Azure HPC Cache?

Azure HPC Cache can speed access to data for high-performance computing jobs in a variety of disciplines. But it is not perfect for all types of workflows. This article gives guidelines for how to decide if HPC cache is a good option for your needs.

The [Overview](hpc-cache-overview.md) article also gives a short outline of when to use Azure HPC Cache and some examples of use cases.

Also read [this article](nfs-blob-considerations.md) about how to make effective use of [NFS-mounted blob storage](../storage/blobs/network-file-system-protocol-support.md), which is in preview.

## NFS version 3.0 applications

Azure HPC Cache supports NFS-mounted clients only. **< xxx is there any scenario where SMB works? xxx >**

## High read-to-write ratio

Workloads where the compute clients do more reading than they do writing are usually good candidates for a cache. For example, if your read-to-write ratio is 80/20 or 70/30, Azure HPC Cache can help by serving frequently requested files from the cache instead of having to fetch them from remote storage over and over.

## File-based analytic workload

Azure HPC Cache is ideal for a pipeline that uses file-based data and runs across a large number of compute clients, especially if the compute clients are Azure virtual machines. It can help fix slow or inconsistent performance that's caused by long file access times.

## Remote data that can't be moved permanently

Azure HPC Cache can help reduce latency if your workload needs to access remote data that can't be moved closer to the computing resources. For example, your records might be at the far end of a WAN environment, in a different Azure region, or in a customer data center.

## Heavy request load

If a large number of clients are requesting the data from the source at the same time - for example, in a high-performance computing cluster, latency increases. Azure HPC Cache can handle a high number of concurrent requests.

## Compute resources are located in Azure

Azure virtual machines are a scalable and cost-effective answer to high-performance computing workload. Azure HPC Cache can help by bringing the information they need closer to them, even if the original data is stored on a remote system.

If a customer wants to run their current pipeline "as is" in Azure virtual machines, Azure HPC Cache can provide a POSIX-based shared storage (or caching) solution for scalability.

By using Azure HPC Cache for Azure, you don't have to re-architect the work pipeline to make native calls to Azure Blob storage.

## Next steps

* Learn more about how to plan and configure a cache in the [Overview](hpc-cache-overview.md) and [Prerequisites](hpc-cache-prerequisites.md) articles
* Read about considerations for using [NFS-enabled Blob storage](nfs-blob-considerations.md) (PREVIEW) with Azure HPC Cache
