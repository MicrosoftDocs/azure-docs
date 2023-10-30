---
title: Container copy jobs
titleSuffix: Azure Cosmos DB
description: Learn how to copy data from one container to another in Azure Cosmos DB (preview).
author: seesharprun
ms.author: sidandrews
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/30/2022
ms.custom: references_regions, ignite-2022, build-2023, ignite-2023
---

# Container copy jobs in Azure Cosmos DB (preview)

[!INCLUDE[NoSQL, Cassandra, MongoDB](includes/appliesto-nosql-mongodb-cassandra.md)]

You can perform offline container copy within an Azure Cosmos DB account by using container copy jobs.

You might need to copy data within your Azure Cosmos DB account if you want to achieve any of these scenarios:

* Copy all items from one container to another.
* Change the [granularity at which throughput is provisioned, from database to container](set-throughput.md) and vice versa.
* Change the [partition key](partitioning-overview.md#choose-partitionkey) of a container.
* Update the [unique keys](unique-keys.md) for a container.
* Rename a container or database.
* Change capacity mode of an account from serverless to provisioned or vice-versa.
* Adopt new features that are supported only for new containers.

Container copy jobs can be [created and managed by using Azure CLI commands](how-to-container-copy.md).

## Get started

To get started, register for the relevant preview feature in the Azure portal.

## Container copy across Azure Cosmos DB accounts

### NoSQL API

To get started with cross-account offline container copy for Azure Cosmos DB for NoSQL API accounts, register for the **Cross-account offline container copy (NoSQL)** preview feature flag in [Preview Features](access-previews.md) in the Azure portal. Once the registration is complete, the preview is effective for all NoSQL API accounts in the subscription.

## Container copy within an Azure Cosmos DB account

### NoSQL and Cassandra API

To get started with intra-account offline container copy for NoSQL and Cassandra API accounts, register for the **Intra-account offline container copy (Cassandra & NoSQL)** preview feature flag in [Preview Features](access-previews.md) in the Azure portal. When the registration is complete, the preview is effective for all Cassandra and API for NoSQL accounts in the subscription.

### API for MongoDB

To get started with intra-account offline container copy for Azure Cosmos DB for MongoDB accounts, register for the **Intra-account offline collection copy (MongoDB)** preview feature flag in [Preview Features](access-previews.md) in the Azure portal. Once the registration is complete, the preview is effective for all API for MongoDB accounts in the subscription.

<a name="how-to-do-container-copy"></a>

## Copy a container's data 

1. Create the target Azure Cosmos DB container by using the settings that you want to use (partition key, throughput granularity, request units, unique key, and so on).
1. Stop the operations on the source container by pausing the application instances or any clients that connect to it.
1. [Create the container copy job](how-to-container-copy.md).
1. [Monitor the progress of the container copy job](how-to-container-copy.md#monitor-the-progress-of-a-container-copy-job) and wait until it's completed.
1. Resume the operations by appropriately pointing the application or client to the source or target container copy as intended.

## How does container copy work?

Container copy jobs perform offline data copy by using the source container's incremental change feed log.

1. The platform allocates server-side compute instances for the destination Azure Cosmos DB account.
1. These instances are allocated when one or more container copy jobs are created within the account.
1. The container copy jobs run on these instances.
1. A single job is executed across all instances at any time.
1. The instances are shared by all the container copy jobs that are running within the same account.
1. The platform might deallocate the instances if they're idle for longer than 15 minutes.

> [!NOTE]
> We currently support only offline container copy jobs. We strongly recommend that you stop performing any operations on the source container before you begin the container copy. Item deletions and updates that are done on the source container after you start the copy job might not be captured. If you continue to perform operations on the source container while the container job is in progress, you might have duplicate or missing data on the target container.

## Factors that affect the rate of a container copy job

The rate of container copy job progress is determined by these factors:

* The source container or database throughput setting.

* The target container or database throughput setting.

   > [!TIP]
   > Set the target container throughput to at least two times the source container's throughput.

* Server-side compute instances that are allocated to the Azure Cosmos DB account for performing the data transfer.

   > [!IMPORTANT]
   > The default SKU offers two 4-vCPU 16-GB server-side instances per account.

## Limitations

### Preview eligibility criteria

Container copy jobs don't work with accounts that have the following capabilities enabled. Disable these features before you run container copy jobs:

* [Disable local auth](how-to-setup-rbac.md#use-azure-resource-manager-templates)
* [Merge partition](merge.md)

### Account configurations

The Time to Live (TTL) setting isn't adjusted in the destination container. As a result, if a document hasn't expired in the source container, it starts its countdown anew in the destination container.

## FAQs

### Is there a service-level agreement for container copy jobs?

Container copy jobs are currently supported on a best-effort basis. We don't provide any service-level agreement (SLA) guarantees for the time it takes for the jobs to finish.

### Can I create multiple container copy jobs within an account?

Yes, you can create multiple jobs within the same account. The jobs run consecutively. You can [list all the jobs](how-to-container-copy.md#list-all-the-container-copy-jobs-created-in-an-account) that are created within an account, and monitor their progress.

### Can I copy an entire database within the Azure Cosmos DB account?

You must create a job for each container in the database.

### I have an Azure Cosmos DB account with multiple regions. In which region will the container copy job run?

The container copy job runs in the write region. In an account that's configured with multi-region writes, the job runs in one of the regions in the list of write regions.

### What happens to the container copy jobs when the account's write region changes?

The account's write region might change in the rare scenario of a region outage or due to manual failover. In this scenario, incomplete container copy jobs that were created within the account fail. You would need to re-create these failed jobs. Re-created jobs then run in the new (current) write region.

## Supported regions

Currently, container copy is supported in the following regions:

| Americas | Europe and Africa | Asia Pacific |
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
| South Central US | UK South | Not supported |
| West Central US | UK West  | Not supported |
| West US | West Europe | Not supported |
| West US 2 | Not supported | Not supported |

## Known and common issues

* Error - Owner resource doesn't exist.

    If the job creation fails and displays the error *Owner resource doesn't exist* (error code 404), either the target container hasn't been created yet or the container name that's used to create the job doesn't match an actual container name.

    Make sure that the target container is created before you run the job as specified in the [overview](#how-to-do-container-copy), and ensure that the container name in the job matches an actual container name.

    ```output
    "code": "404",
    "message": "Response status code does not indicate success: NotFound (404); Substatus: 1003; ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx; Reason: (Message: {\"Errors\":[\"Owner resource does not exist\"]
    ```

* Error - Request is unauthorized.

    If the request fails and displays the error *Unauthorized* (error code 401), local authorization might be disabled. Learn how to [enable local authorization](how-to-setup-rbac.md#use-azure-resource-manager-templates).

    Container copy jobs use primary keys to authenticate. If local authorization is disabled, the job creation fails. Local authorization must be enabled for container copy jobs to work.

    ```output
    "code": "401",
    "message": " Response status code does not indicate success: Unauthorized (401); Substatus: 5202; ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx; Reason: Local Authorization is disabled. Use an AAD token to authorize all requests."
    ```

* Error - Error while getting resources for job.

    This error might occur due to internal server issues. To resolve this issue, contact Microsoft Support by opening a **New Support Request** in the Azure portal. For **Problem Type**, select **Data Migration**. For **Problem subtype**, select **Intra-account container copy**.

    ```output
    "code": "500"
    "message": "Error while getting resources for job, StatusCode: 500, SubStatusCode: 0, OperationId:  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```

## Next steps

* Learn [how to create, monitor, and manage container copy jobs](how-to-container-copy.md) in Azure Cosmos DB account by using CLI commands.
