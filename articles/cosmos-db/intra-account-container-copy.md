---
title: Intra-account container copy jobs in Azure Cosmos DB
description: Learn about container data copy capability within an Azure Cosmos DB account.
author: nayakshweta
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 08/1/2022
ms.author: shwetn
ms.reviewer: sidandrews
ms.custom: references_regions, ignite-2022
---

# Intra-account container copy jobs in Azure Cosmos DB (Preview)
[!INCLUDE[NoSQL, Cassandra](includes/appliesto-nosql-cassandra.md)]

You can perform offline container copy within an Azure Cosmos DB account using container copy jobs.

You may need to copy data within your Azure Cosmos DB account if you want to achieve any of these scenarios:

* Copy all items from one container to another.
* Change the [granularity at which throughput is provisioned - from database to container](set-throughput.md) and vice-versa.
* Change the [partition key](partitioning-overview.md#choose-partitionkey) of a container.
* Update the [unique keys](unique-keys.md) for a container.
* Rename a container/database.
* Adopt new features that are only supported on new containers.

Intra-account container copy jobs can be [created and managed using CLI commands](how-to-container-copy.md).

## Get started

To get started using container copy jobs, register for "Intra-account offline container copy (Cassandra & SQL)" preview from the ['Preview Features'](access-previews.md) list in the Azure portal. Once the registration is complete, the preview will be effective for all Cassandra and API for NoSQL accounts in the subscription.

## Overview of steps needed to do container copy

1. Create the target Azure Cosmos DB container with the desired settings (partition key, throughput granularity, RUs, unique key, etc.).
2. Stop the operations on the source container by pausing the application instances or any clients connecting to it.
3. [Create the container copy job](how-to-container-copy.md).
4. [Monitor the progress of the container copy job](how-to-container-copy.md#monitor-the-progress-of-a-container-copy-job) and wait until it's completed.
5. Resume the operations by appropriately pointing the application or client to the source or target container copy as intended.

## How does intra-account container copy work?

Intra-account container copy jobs perform offline data copy using the source container's incremental change feed log.

* The platform allocates server-side compute instances for the Azure Cosmos DB account.
* These instances are allocated when one or more container copy jobs are created within the account.
* The container copy jobs run on these instances.
* A single job is executed across all instances at any time.
* The instances are shared by all the container copy jobs running within the same account.
* The platform may de-allocate the instances if they're idle for >15 mins.

> [!NOTE]
> We currently only support offline container copy jobs. So, we strongly recommend to stop performing any operations on the source container prior to beginning the container copy.\
> Item deletions and updates done on the source container after beginning the copy job may not be captured. Hence, continuing to perform operations on the source container while the container job is in progress may result in additional or missing data on the target container.


## Factors affecting the rate of a container copy job

The rate of container copy job progress is determined by these factors:

* Source container/database throughput setting.

* Target container/database throughput setting.

* Server-side compute instances allocated to the Azure Cosmos DB account for performing the data transfer.

    > [!IMPORTANT]
    > The default SKU offers two 4-vCPU 16-GB server-side instances per account. 

## FAQs

### Is there an SLA for the container copy jobs?

Container copy jobs are currently supported on best-effort basis. We don't provide any SLA guarantees for the time taken to complete these jobs.

### Can I create multiple container copy jobs within an account?

Yes, you can create multiple jobs within the same account. The jobs will run consecutively. You can [list all the jobs](how-to-container-copy.md#list-all-the-container-copy-jobs-created-in-an-account) created within an account and monitor their progress.

### Can I copy an entire database within the Azure Cosmos DB account?

You'll have to create a job for each container in the database.

### I have an Azure Cosmos DB account with multiple regions. In which region will the container copy job run?

The container copy job will run in the write region. If there are accounts configured with multi-region writes, the job will run in one of the regions from the list.

### What happens to the container copy jobs when the account's write region changes?

The account's write region may change in the rare scenario of a region outage or due to manual failover. In such a scenario, incomplete container copy jobs created within the account would fail. You would need to recreate these failed jobs. Recreated jobs would then run in the new (current) write region.

### Why is a new database *__datatransferstate* created in the account when I run container copy jobs? Am I being charged for this database?
* *__datatransferstate* is a database that is created while running container copy jobs. This database is used by the platform to store the state and progress of the copy job.
* The database uses manual provisioned throughput of 800 RUs. You'll be charged for this database.
* Deleting this database will remove the container copy job history from the account. It can be safely deleted once all the jobs in the account have completed, if you no longer need the job history. The platform will not clean up the *__datatransferstate* database automatically.

## Supported regions

Currently, container copy is supported in the following regions:

| **Americas** | **Europe and Africa** | **Asia Pacific** |
| ------------ | -------- | ----------- | 
| Brazil South | France Central | Australia Central |
| Canada Central | France South | Australia Central 2 |
| Canada East | Germany North | Australia East |
| Central US | Germany West Central | Central India | 
| Central US EUAP | North Europe | Japan East | 
| East US | Norway East | Korea Central | 
| East US 2 | Norway West | Southeast Asia |
| East US 2 EUAP | Switzerland North | UAE Central |
| North Central US | Switzerland West | West India |
| South Central US | UK South | |
| West Central US | UK West  | |
| West US | West Europe |
| West US 2 | |

## Known/common issues

* Error - Owner resource does not exist

If the job creation fails with the error *"Owner resource does not exist"*, it means that the target container wasn't created or was mis-spelt.
Make sure the target container is created before running the job as specified in the [overview section.](#overview-of-steps-needed-to-do-container-copy)

```
"code": "500",
"message": "Response status code does not indicate success: NotFound (404); Substatus: 1003; ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx; Reason: (Message: {\"Errors\":[\"Owner resource does not exist\"]
```

* Error - Shared throughput database creation is not supported for serverless accounts

Job creation on serverless accounts may fail with the error *"Shared throughput database creation is not supported for serverless accounts"*.
As a work-around, create a database called *__datatransferstate* manually within the account and try creating the container copy job again.

```
ERROR: (BadRequest) Response status code does not indicate success: BadRequest (400); Substatus: 0; ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx; Reason: (Shared throughput database creation is not supported for serverless accounts.
```

## Next steps

- You can learn [how to create, monitor and manage container copy jobs within Azure Cosmos DB account using CLI commands](how-to-container-copy.md).
