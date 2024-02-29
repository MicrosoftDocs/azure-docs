---
title: Azure HPC Cache scenarios
description: Describes how to know whether your computing job works well with Azure HPC Cache
author: femila
ms.service: hpc-cache
ms.topic: how-to
ms.date: 03/29/2021
ms.author: femila
---

# Is your job a good fit for Azure HPC Cache?

Azure HPC Cache can speed access to data for high-performance computing jobs in a variety of disciplines. But it is not perfect for all types of workflows. This article gives guidelines for how to decide if HPC Cache is a good option for your needs.

The [Overview](hpc-cache-overview.md) article also gives a short outline of when to use Azure HPC Cache and some examples of use cases.

Also read [this article](nfs-blob-considerations.md) about how to make effective use of [NFS-mounted blob storage](../storage/blobs/network-file-system-protocol-support.md).

## NFS version 3.0 applications

Azure HPC Cache supports NFS 3.0 clients only.

## High read-to-write ratio

Workloads where the compute clients do more reading than they do writing are usually good candidates for a cache. For example, if your read-to-write ratio is 80/20 or 70/30, Azure HPC Cache can help by serving frequently requested files from the cache instead of having to fetch them from remote storage over and over.

Fetching a file and storing it in the cache for the first time has a small additional latency over a normal client request directly to storage, so the efficiency boost comes the next time a client requests the same file. This is especially true for large files. If each client request is unique, HPC Cache's impact is limited. But the larger the file, the better the performance is over time after that first access.

## File-based analytic workload

Azure HPC Cache is ideal for a pipeline that uses file-based data and runs across a large number of compute clients, especially if the compute clients are Azure virtual machines. It can help fix slow or inconsistent performance that's caused by long file access times.

## Remote data access

Azure HPC Cache can help reduce latency if your workload needs to access remote data that can't be moved closer to the computing resources. For example, your records might be at the far end of a WAN environment, in a different Azure region, or in a customer data center. (This is sometimes called "file-bursting".)

## Heavy request load

If a large number of clients request data from the source at the same time, Azure HPC Cache can speed up file access. For example, when used with a high-performance computing cluster, Azure HPC Cache provides scalability for high numbers of concurrent requests through the cache.

## Compute resources are located in Azure

Azure virtual machines are a scalable and cost-effective answer to high-performance computing workload. Azure HPC Cache can help by bringing the information they need closer to them, especially if the original data is stored on a remote system.

If a customer wants to run their current pipeline "as is" in Azure virtual machines, Azure HPC Cache can provide a POSIX-based shared storage (or caching) solution for scalability.

By using Azure HPC Cache, you don't have to re-architect the work pipeline to make native calls to Azure Blob storage. You can access your data on its original system, or use HPC Cache to move it to a new blob container.

## Next steps

* Learn more about how to plan and configure a cache in the [Overview](hpc-cache-overview.md) and [Prerequisites](hpc-cache-prerequisites.md) articles
* Read considerations for using [NFS-enabled Blob storage](nfs-blob-considerations.md) with Azure HPC Cache
