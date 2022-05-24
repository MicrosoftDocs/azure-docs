---
title: Intra-account container copy jobs in Azure Cosmos DB
description: Learn about container data copy capability within an Azure Cosmos DB account.
author: nayakshweta
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/18/2022
ms.author: shwetn
---

# Intra-account container copy jobs in Azure Cosmos DB (Preview)
[!INCLUDE[appliesto-sql-cassandra-api](includes/appliesto-sql-cassandra-api.md)]

You can perform offline container copy within an Azure Cosmos DB account using container copy jobs.

You may need to copy data within your Azure Cosmos DB account if you want to achieve any of these scenarios:

* Copy all items from one container to another.
* Change the [granularity at which throughput is provisioned - from database to container](set-throughput.md) and vice-versa.
* Change the [partition key](partitioning-overview.md#choose-partitionkey) of a container.
* Update the [unique keys](unique-keys.md) for a container.
* Rename a container/database.
* Adopt new features that are only supported on new containers.

Intra-account container copy jobs can be currently [created and managed using CLI commands](how-to-container-copy.md).

## Get started

To get started using container copy jobs, enroll in the preview by filing a support ticket in the [Azure portal](https://portal.azure.com). 

## How does intra-account container copy work?

Intra-account container copy jobs perform offline data copy using the source container's incremental change feed log.

* Within the platform, we allocate two 4-vCPU 16-GB memory server-side compute instances per Azure Cosmos DB account by default.
* The instances are allocated when one or more container copy jobs are created within the account.
* The container copy jobs run on these instances.
* The instances are shared by all the container copy jobs running within the same account.
* The platform may de-allocate the instances if they're idle for >15 mins.

> [!NOTE]
> We currently only support offline container copy. So, we strongly recommend to stop performing any operations on the source container prior to beginning the container copy.
> Item deletions and updates done on the source container after beginning the copy job may not be captured. Hence, continuing to perform operations on the source container while the container job is in progress may result in data missing on the target container.

## Overview of steps needed to do a container copy

1. Stop the operations on the source container by pausing the application instances or any clients connecting to it.
2. [Create the container copy job](how-to-container-copy.md).
3. [Monitor the progress of the container copy job](how-to-container-copy.md#monitor-the-progress-of-a-container-copy-job) and wait until it's completed.
4. Resume the operations by appropriately pointing the application or client to the source or target container copy as intended.

## Factors affecting the rate of container copy job

The rate of container copy job progress is determined by these factors:

* Source container/database throughput setting.

* Target container/database throughput setting.

* Server-side compute instances allocated to the Azure Cosmos DB account for the performing the data transfer.

    > [!IMPORTANT]
    > The default SKU offers two 4-vCPU 16-GB server-side instances per account. You may opt to sign up for [larger SKUs](#large-skus-preview) in preview.

## FAQs

### Is there an SLA for the container copy jobs?

Container copy jobs are currently supported on best-effort basis. We don't provide any SLA guarantees for the time taken to complete these jobs.

### Can I create multiple container copy jobs within an account?

Yes, you can create multiple jobs within the same account. The jobs will run consecutively. You can [list all the jobs](how-to-container-copy.md#list-all-the-container-copy-jobs-created-in-an-account) created within an account and monitor their progress.

### Can I copy an entire database within the Azure Cosmos DB account?

You'll have to create a job for each collection in the database.

### I have an Azure Cosmos DB account with multiple regions. In which region will the container copy job run?

The container copy job will run in the write region. If there are accounts configured with multi-region writes, the job will run in one of the regions from the list.

### What happens to the container copy jobs when the account's write region changes?

The account's write region may change in the rare scenario of a region outage or due to manual failover. In such scenario, incomplete container copy jobs created within the account would fail. You would need to recreate such jobs. Recreated jobs would then run against the new (current) write region.

## Large SKUs preview

If you want to run the container copy jobs faster, you may do so by adjusting one of the [factors that affect the rate of the copy job](#factors-affecting-the-rate-of-container-copy-job). In order to adjust the configuration of the server-side compute instances, you may sign up for "Large SKU support for container copy" preview.

This preview will allow you to choose larger a SKU size for the server-side instances. Large SKU sizes are billable at a higher rate. You can also choose a node count of up to 5 of these instances.

## Next Steps

- You can learn about [how to create, monitor and manage container copy jobs within Azure Cosmos DB account using CLI commands](how-to-container-copy.md).
