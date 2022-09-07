---
title: Azure Storage Mover scale and performance targets #Required; page title is displayed in search results. Include the brand.
description: Azure Storage Mover scale and performance targets #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: conceptual
ms.date: 06/13/2022
ms.custom: template-concept
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: incomplete
        - NEEDS NETWORK CONFIG STATEMENT
        - NEEDS SOURCE DEVICE CONFIG STATEMENT

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

# Azure Storage Mover scale and performance targets

The performance of a storage migration service is a key aspect for any migration. Azure Storage Mover is a new service, in public preview. In this article, we share performance test results - your experience will vary.

## Performance baselines

The Azure Storage Mover service is tested with different agent resources. Networking is configured to **!!!!NEEDS NETWORK CONFIG STATEMENT!!!!**. In this test scenario the source is an NFS 4.0 share share on a **!!!!NEEDS DEVICE INFO!!!!!!**

### [4 CPU / 8 GiB RAM](#tab/minspec)

4 virtual CPU cores at 4000 MHz each and 8 GiB of memory (RAM) is the minimum specification for an Azure Storage Mover agent. 

|                          |Single file, 1 TiB |&tilde;3.3M files, &tilde;200K folders, &tilde;45 GiB |&tilde;50M files, &tilde;3M folders, &tilde;1 TiB |
|--------------------------|-------------------|------------------------------------------------------|--------------------------------------------------|
|Elapsed time              | 16 Min, 42 Sec    | 15 Min, 18 Sec                                       | 5 Hours, 28 Min                                  |
|Items* per Second         | -                 | 3548                                                 | 2860                                             |
|Memory (RAM) usage        | 400 MiB           | 1.4 GiB                                              | 1.4 GiB                                          |
|Disk usage (for logs)     | 28 KiB            | 1.4 GiB                                              | *result missing*                                 |

*A namespace item is either a file or a folder.

### [8 CPU / 16 GiB RAM](#tab/boostspec)

8 virtual CPU cores at 4000 MHz each and 8 GiB of memory (RAM) is the minimum specification for an Azure Storage Mover agent. 

|                          |Single file, 1 TiB |&tilde;3.3M files, &tilde;200K folders, &tilde;45 GiB |
|--------------------------|-------------------|------------------------------------------------------|
|Elapsed time              | 14 Min, 36 Sec    | 8 Min, 30 Sec                                        |
|Items* per Second         | -                 | 6298                                                 |
|Memory (RAM) usage        | 400 MiB           | 1.4 GiB                                              |
|Disk usage (for logs)     | 28 KiB            | 1.4 GiB                                              |

*A namespace item is either a file or a folder.

---

[Review recommended agent resources](agent-deploy.md#recommended-compute-and-memory-resources) for your migration scope in the [agent deployment article](agent-deploy.md).

## Why migration performance varies

Fundamentally, network quality and the ability to process files, folders and their metadata impact your migration velocity.

Across the two core areas of network and compute, several aspects have an impact:

- **Migration scenario** <br />Copy into an empty target is generally faster as compared to a scenario in which the target has content and the migration engine must evaluate not only the source but also the target to make a copy decision.
- **Namespace item count** <br />Migrating 1 GiB of small files will take more time than migrating 1 GiB of larger but fewer files.
- **Namespace shape** <br />A wide folder hierarchy lends itself to more parallel processing than a narrow, but deep directory structure. The file to folder ratio also plays a roll.
- **Namespace churn**  <br />How many files, folders, and metadata has changed between two copy runs from the same source to the same target. 
- **Network**
    - bandwidth and latency between source and migration agent
    - bandwidth and latency between migration agent and the target in Azure
- **Migration agent resources** <br />The amount of memory (RAM), number of compute cores, and even the amount of available, local disk capacity on the migration agent can have a profound impact on the migration velocity. More compute resources help to optimize the utilization of the available bandwidth, especially when large amounts of smaller files need to be processed in a migration.

For example, a traditional migration requires a strategy to minimize downtime of the workload that depends on the storage that is to be migrated. Azure Storage Mover supports such a strategy. It's called convergent, n-pass migration.

In this strategy, you copy from source to target several times. During these copy iterations, the source remains available for read and write to the workload. Just before the final copy iteration, you take the source offline. It is expected that the final copy finishes faster than say the very first copy you've ever made and takes about as long as the one immediately preceding it. After the final copy, the workload is failed over to use the new target storage in Azure and available for use again.

During the very first copy from source to target, the target is likely empty and all the source content must travel to the target. As a result, the first copy is likely most constrained by the available network resources. 

Towards the end of a migration, when you've copied the source to the target several times already, only a small number of files, folders, and metadata has changed since the last copy. In this last copy iteration, comparing each file in source and target to see if it needs to be updated, requires more compute resources and fewer network resources. Copy runs in this late stage of a migration are often more compute constrained. Proper [resourcing of the Storage Mover agent](agent-deploy.md#recommended-compute-and-memory-resources) becomes more and more important.

## Next steps

The following articles can help with a successful Azure Storage Mover deployment.

- [Plan for an Azure Storage Mover deployment](deployment-planning.md)
- [Deploy a Storage Mover agent](agent-deploy.md)
- [Register a Storage Mover agent](agent-register.md)
