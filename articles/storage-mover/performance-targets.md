---
title: Azure Storage Mover scale and performance targets.
description: Baseline migration performance test results for Azure Storage Mover.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: conceptual
ms.date: 03/27/2023
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

# Azure Storage Mover scale and performance targets

The performance of a storage migration service is a key aspect for any migration. In this article, we share performance test results, though because Azure Storage Mover is a new service, your experience may vary.

## Scale targets

Azure Storage Mover is tested with 100 million namespace items (files and folders), migrated from a [supported source to a supported target](service-overview.md#supported-sources-and-targets) in Azure.

## How we test

Azure Storage Mover is a hybrid cloud service. Hybrid services have a cloud service component and an infrastructure component the administrator of the service runs in their corporate environment. For Storage Mover, that hybrid component is a migration agent. Agents are virtual machines, ran on a host near the source storage. 

Only the agent is a relevant part of the service for performance testing. To omit privacy and performance concerns, data travels directly from the Storage Mover agent to the target storage in Azure. Only control and telemetry messages are sent to the cloud service.

:::image type="content" source="media/across-articles/data-vs-management-path.png" alt-text="A diagram illustrating a migration's path by showing two arrows. The first arrow represents data traveling to a storage account from the source or agent and a second arrow represents only the management or control info to the storage mover resource or service." lightbox="media/across-articles/data-vs-management-path-large.png":::

The following table describes the characteristics of the test environment that produced the performance test results shared later in this article.

|Test               | Result                                                                                                                        |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------|
|Test namespace     | 19% files 0 KiB - 1 KiB <br />57% files 1 KiB - 16 KiB <br />16% files 16 KiB - 1 MiB <br />6% folders                        |
|Test source device | Linux server VM <br />16 virtual CPU cores<br />64-GiB RAM                                                                    |
|Test source share  | NFS v3.0 share <br /> Warm cache: Data set in memory (baseline test). In real-world scenarios, add disk recall times.          |
|Network            | Dedicated, over-provisioned configuration, negligible latency. No bottle neck between source - agent - target Azure storage.) |

## Performance baselines

These test results are created under ideal conditions. They're meant as a baseline of the components the Storage Mover service and agent can directly influence. Differences in source devices, disks, and network connections aren't considered in this test. Real-world performance varies.

Different agent resource configurations are tested:

### [4 CPU / 8-GiB RAM](#tab/minspec)

4 virtual CPU cores at 2.7 GHz each and 8 GiB of memory (RAM) is the minimum specification for an Azure Storage Mover agent.

|Test                      | Single file, 1 TiB|&tilde;3.3M files, &tilde;200-K folders, &tilde;45 GiB |&tilde;50M files, &tilde;3M folders, &tilde;1 TiB |
|--------------------------|-------------------|------------------------------------------------------|--------------------------------------------------|
|Elapsed time              | 16 Min, 42 Sec    | 15 Min, 18 Sec                                       | 5 Hours, 28 Min                                  |
|Items* per Second         | -                 | 3548                                                 | 2860                                             |
|Memory (RAM) usage        | 400 MiB           | 1.4 GiB                                              | 1.4 GiB                                          |
|Disk usage (for logs)     | 28 KiB            | 1.4 GiB                                              | *result missing*                                 |

*A namespace item is either a file or a folder.

### [8 CPU / 16 GiB RAM](#tab/boostspec)

8 virtual CPU cores at 2.7 GHz each and 16 GiB of memory (RAM) is the minimum specification for an Azure Storage Mover agent.

|Test                      | Single file, 1 TiB| &tilde;3.3M files, &tilde;200 K folders, &tilde;45 GiB  |
|--------------------------|-------------------|--------------------------------------------------------|
|Elapsed time              | 14 Min, 36 Sec    | 8 Min, 30 Sec                                          |
|Items* per Second         | -                 | 6298                                                   |
|Memory (RAM) usage        | 400 MiB           | 1.4 GiB                                                |
|Disk usage (for logs)     | 28 KiB            | 1.4 GiB                                                |

*A namespace item is either a file or a folder.

---

[Review recommended agent resources](agent-deploy.md#recommended-compute-and-memory-resources) for your migration scope in the [agent deployment article](agent-deploy.md).

## Why migration performance varies

Fundamentally, network quality and the ability to process files, folders and their metadata impact your migration velocity.

Across the two core areas of network and compute, several aspects have an impact:

- **Migration scenario** <br />Copying into an empty target is faster as compared to a target with content. This behavior is due the migration engine evaluating not only the source, but also the target to make copy decisions.
- **Namespace item count** <br />Migrating 1 GiB of small files takes more time than migrating 1 GiB of larger files.
- **Namespace shape** <br />A wide folder hierarchy lends itself to more parallel processing than a narrow or deep directory structure. The file to folder ratio also plays a roll.
- **Namespace churn**  <br />How many files, folders, and metadata have changed between two copy runs from the same source to the same target. 
- **Network**
    - bandwidth and latency between source and migration agent
    - bandwidth and latency between migration agent and the target in Azure
- **Migration agent resources** <br />The amount of memory (RAM), number of compute cores, and even the amount of available, local disk capacity on the migration agent can have a profound impact on the migration velocity. More compute resources help to optimize the utilization of the available bandwidth, especially when large amounts of smaller files need to be processed in a migration.

For example, a traditional migration requires a strategy to minimize downtime of the workload that depends on the storage that is to be migrated. Azure Storage Mover supports such a strategy. It's called convergent, n-pass migration.

In this strategy, you copy from source to target several times. During these copy iterations, the source remains available for read and write to the workload. Just before the final copy iteration, you take the source offline. It's expected that the final copy finishes faster than say the first copy you've ever made and takes about as long as the one immediately preceding it. After the final copy, the workload is failed over to use the new target storage in Azure and available for use again.

During the first copy from source to target, the target is likely empty and all the source content must travel to the target. As a result, the first copy is likely most constrained by the available network resources. 

Towards the end of a migration, when you've copied the source to the target several times already, only a few files, folders, and metadata has changed since the last copy. In this last copy iteration, comparing each file in source and target to see if it needs to be updated, requires more compute resources and fewer network resources. Copy runs in this late stage of a migration are often more compute-constrained. Proper [resourcing of the Storage Mover agent](agent-deploy.md#recommended-compute-and-memory-resources) becomes increasingly important.

## Next steps

The following articles can help with a successful Azure Storage Mover deployment.

- [Plan for an Azure Storage Mover deployment](deployment-planning.md)
- [Deploy a Storage Mover agent](agent-deploy.md)
- [Register a Storage Mover agent](agent-register.md)
